package com.skt.covid.web.rest;

import com.skt.covid.config.Constants;
import com.skt.covid.service.CovidSearchService;
import com.skt.covid.service.LocationDongService;
import com.skt.covid.web.rest.errors.CovidException;
import com.skt.covid.web.rest.vm.Result;
import com.sun.org.apache.regexp.internal.RE;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/v1")
public class CovidSearchController {

    @Autowired
    private CovidSearchService covidSearchService;

    @Autowired
    private LocationDongService locationDongService;

    /**
     * 이름으로 지역 찾기 API
     * @param searchText
     * @return
     */
    @ApiOperation(value = "법정동 10자리 구하기 API", httpMethod = "GET", notes = "법정동 10자리 구하기 API")
    @GetMapping(path = "/search/location")
    public Result searchLocationByName(@ApiParam(value="ex) 압구정 (1자리 이상) - 시도/시군구", required = true) @RequestParam(value = "searchText", required = true) String searchText) {
        Result result = new Result();
        try {
            result = locationDongService.searchByName(searchText);
        } catch (CovidException e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("지역조회에 실패하였습니다. +\n " + e.getMessage());
        }
        return result;
    }

    /**
     * 일별 - 사회적 접촉지수 예측
     *
     * @param ldongCd
     * @param filterDate
     * @return
     */
    @ApiOperation(value = "코로나 위험도 지수 예측 By 날짜별 API", httpMethod = "GET", notes = "날짜필터를 이용하여, 코로나 위험도 지수를 검색한다.")
    @GetMapping(path = "/search/socialcontact")
    public Result searchSocialContact(@ApiParam(value="ex) 1111017700 (종로구) - 행정구역 10자리", required = true) @RequestParam(value = "ldongCd", required = true) String ldongCd,
                                      @ApiParam(value="ex) 20210301(검색날짜)", required = true) @RequestParam(value = "filterDate", required = true) String filterDate) {

        Result result = new Result();
        try {
            result = covidSearchService.searchSocialContact(ldongCd, filterDate);
            result.setCode(Constants.CommonCode.SUCCESS);
        }catch (CovidException e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("데이터가 존재하지 않습니다.");
        }
        return result;
    }

    /**
     * 실시간 - 지역별 확진자 현황 가져옵니다. - 전체
     * @return
     */
    @ApiOperation(value = "실시간 전체 코로나 확진자 현황", httpMethod = "GET", notes = "실시간 전체 코로나 확진자 현황")
    @GetMapping(path = "/search/realtime/patients/all")
    public Result searchRealtimeOfPatientsAll() {
        Result result = new Result();
        try {
            result = covidSearchService.queryRealTimeOfConfirmedPatientsAll();
            result.setCode(Constants.CommonCode.SUCCESS);
        }catch (CovidException e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("데이터가 존재하지 않습니다.");
        }
        return result;
    }

    /**
     * 실시간 - 지역별 확진자 현황 가져옵니다. - 시도
     * @param searchText
     * @return
     */
    @ApiOperation(value = "실시간 지역별(구) 코로나 확진자 현황 Filter By 시도 ", httpMethod = "GET", notes = "실시간 지역별(구) 확진자 현황 - 지역별 확진자 현황을 가져옵니다.")
    @GetMapping(path = "/search/realtime/patients/sido")
    public Result searchRealtimeOfPatientsSido(@ApiParam(value="ex) 서초구 - 시도", required = false) @RequestParam(value = "searchText", required = false) String searchText) {
        Result result = new Result();
        try {
            result = covidSearchService.queryRealtimeOfConfirmedPatientsSido(searchText);
            result.setCode(Constants.CommonCode.SUCCESS);
        }catch (CovidException e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("데이터가 존재하지 않습니다.");
        }
        return result;
    }

    /**
     * 실시간 - 지역별 확진자 현황 가져옵니다. - 구별
     * @param
     * @param searchText
     * @return
     */
    @ApiOperation(value = "실시간 지역별(구) 코로나 확진자 현황 Filter By 시도/시군구 ", httpMethod = "GET", notes = "실시간 지역별(구) 확진자 현황 - 지역별 확진자 현황을 가져옵니다.")
    @GetMapping(path = "/search/realtime/patients/sigungu")
    public Result searchRealtimeOfPatientsSiGunGu(@ApiParam(value="ex) 서초구 - 시도/시군구", required = false) @RequestParam(value = "searchText", required = false) String searchText) {
        Result result = new Result();
        try {
            result = covidSearchService.queryRealtimeOfConfirmedPatientsSiGunGu(searchText);
            result.setCode(Constants.CommonCode.SUCCESS);
        }catch (CovidException e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("데이터가 존재하지 않습니다.");
        }
        return result;
    }


    /**
     * 지역별 확진자 현황(어제/오늘) 가져옵니다. - 시별
     * @param filterDate
     * @param searchText
     * @return
     */
    @ApiOperation(value = "지역별(시) 코로나 확진자 현황 Filter By 시도별 + 날짜 API", httpMethod = "GET", notes = "지역별(시) 확진자 현황 - 지역별 확진자 현황을 가져옵니다.")
    @GetMapping(path = "/search/location/patients/sido")
    public Result searchLocationOfPatientsSido(@ApiParam(value="ex) 20210301(검색날짜)", required = true) @RequestParam(value = "filterDate", required = true) String filterDate,
                                               @ApiParam(value="ex) 서울 - 시도", required = false) @RequestParam(value = "searchText", required = false) String searchText
                                               ) {
        Result result = new Result();
        try {
            result = covidSearchService.queryLocationOfConfirmedPatientsSido(filterDate, searchText);
            result.setCode(Constants.CommonCode.SUCCESS);
        }catch (CovidException e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("데이터가 존재하지 않습니다.");
        }
        return result;
    }

    /**
     * 지역별 확진자 현황 가져옵니다. - 전체
     * @param filterDate
     * @return
     */
    @ApiOperation(value = "지역별(전체) 코로나 확진자 현황 Filter By 날짜 API", httpMethod = "GET", notes = "지역별(전체) 확진자 현황 - 지역별 확진자 현황을 가져옵니다.")
    @GetMapping(path = "/search/location/patients/all")
    public Result searchLocationOfPatientsAll(@ApiParam(value="ex) 20210301(검색날짜)", required = true) @RequestParam(value = "filterDate", required = true) String filterDate) {
        Result result = new Result();
        try {
            result = covidSearchService.queryLocationOfConfirmedPatientsSidoAll(filterDate);
            result.setCode(Constants.CommonCode.SUCCESS);
        }catch (CovidException e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("데이터가 존재하지 않습니다.");
        }
        return result;
    }

    /**
     * 지역별 백신접종 현황 가져옵니다.
     * @param filterDate
     * @return
     */
    @ApiOperation(value = "지역별(시도) 백신접종 현황  Filter By 날짜 API", httpMethod = "GET", notes = "지역별(시도) 백신접종 현황을 가져옵니다.")
    @GetMapping(path = "/search/location/vaccine")
    public Result searchLocationOfVaccine(@ApiParam(value="ex) 20210311(검색날짜) ", required = true) @RequestParam(value = "filterDate", required = true) String filterDate) {
        Result result = new Result();
        try {
            result = covidSearchService.searchLocationOfVaccine(filterDate);
            result.setCode(Constants.CommonCode.SUCCESS);
        }catch (CovidException e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("데이터가 존재하지 않습니다.");
        }
        return result;
    }

    /**
     * 날짜별 백신 접종타입 수
     * @param filterDate
     * @return
     */
    @ApiOperation(value = "백신 종류별 접종자 수 Filter By 날짜 API", httpMethod = "GET", notes = "백신 종류별 접종자 수 Filter By 날짜 API")
    @GetMapping(path = "/search/location/vaccine/type")
    public Result searchLocationOfVaccineType(@ApiParam(value="ex) 20210311(검색날짜)", required = true) @RequestParam(value = "filterDate", required = true) String filterDate) {
        Result result = new Result();
        try {
            result = covidSearchService.searchLocationOfVaccineType(filterDate);
            result.setCode(Constants.CommonCode.SUCCESS);
        }catch (CovidException e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("데이터가 존재하지 않습니다.");
        }
        return result;
    }
}
