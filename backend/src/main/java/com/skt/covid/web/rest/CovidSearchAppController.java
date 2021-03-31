package com.skt.covid.web.rest;

import com.skt.covid.config.Constants;
import com.skt.covid.service.CovidSearchAppService;
import com.skt.covid.service.LocationDongService;
import com.skt.covid.web.rest.errors.CovidException;
import com.skt.covid.web.rest.vm.Result;
//import com.sun.org.apache.regexp.internal.RE;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping(path = "/apps")
public class CovidSearchAppController {

    @Autowired
    private CovidSearchAppService covidSearchAppService;

    @Autowired
    LocationDongService locationDongService;


    /**
     * 위험도 지수 구하기
     * @return
     */
    @ApiOperation(value = "지역코드 기반 위험도 지수 구하기", httpMethod = "GET", notes = "위험도 지수 구하기")
    @GetMapping(path = "/search/socialcontact/ldongcds")
    public Result searchSocialContactByLDongCd(@ApiParam(value="ex)1147010200") @RequestParam(value = "ldongCd", required = true) List<String> ldongCds) {
        Result result = new Result();
        try {
            return covidSearchAppService.getSocialContacts(ldongCds);
        } catch (CovidException e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("비지니스 로직 에러 관리자에게 문의하세요.");
        }
        return result;
    }

    /**
     * 코로나 환자 현황 + 백신 현황
     * @return
     */
    @GetMapping(path = "/corona/stat")
    public Result searchSocialContactByLDongCd() {
        Result result = new Result();
        try {
            result = covidSearchAppService.getCoronaStat();
        } catch (CovidException e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("비지니스 로직 에러 관리자에게 문의하세요.");
        }
        return result;
    }

    /**
     * 관심 지역 코로나 지표 구하기.
     * @param ldongCds
     * @return
     */
    @GetMapping(path = "/socialcontact/ldongcds")
    public Result getSocialContactByLDongCd(@ApiParam(value="ex)1147010200") @RequestParam(value = "ldongCds", required = true) List<String> ldongCds) {
        Result result = new Result();
        try {
            result = covidSearchAppService.getSocialContactLdongCds(ldongCds);
        } catch (CovidException e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("비지니스 로직 에러 관리자에게 문의하세요.");
        }
        return result;
    }

    /**
     * 관심 지역 상세
     * @param ldongCd
     * @return
     */
    @GetMapping(path = "/socialcontact/ldongcd")
    public Result getSocialContactByLDongCd(@ApiParam(value="ex)1147010200") @RequestParam(value = "ldongCd", required = true) String ldongCd) {
        Result result = new Result();
        try {
            result = covidSearchAppService.getSocialContactLdongCd(ldongCd);
        } catch (CovidException e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("비지니스 로직 에러 관리자에게 문의하세요.");
        }
        return result;
    }

    /**
     * 관심 지역 상세 - 일 시간별 현황.
     * @param ldongCd
     * @return
     */
    @GetMapping(path = "/socialcontact/ldongcd/timeseries/day")
    public Result getSocialContactByLDongCdTimeSeiresDay(@ApiParam(value="ex)1147010200") @RequestParam(value = "ldongCd", required = true) String ldongCd,
                                                         @ApiParam(value="ex)20210301") @RequestParam(value = "baseYmd", required = true) String baseYmd) {
        Result result = new Result();
        try {
            result = covidSearchAppService.getSocialContactLdongCdTimeSeiresDay(baseYmd, ldongCd);
        } catch (CovidException e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("비지니스 로직 에러 관리자에게 문의하세요.");
        }
        return result;
    }

    /**
     * 관심 지역 상세 - 일 시간 현황
     * @param ldongCd
     * @return
     */
    @GetMapping(path = "/socialcontact/ldongcd/timeseries/hour")
    public Result getSocialContactByLDongCdTimeSeiresHour(@ApiParam(value="ex)1147010200") @RequestParam(value = "ldongCd", required = true) String ldongCd,
                                                          @ApiParam(value="ex)20210301") @RequestParam(value = "baseYmd", required = true) String baseYmd,
                                                          @ApiParam(value="ex)01") @RequestParam(value = "baseHour", required = true) String baseHour) {
        Result result = new Result();
        try {
            result = covidSearchAppService.getSocialContactLdongCdTimeSeiresHour(baseYmd, ldongCd, baseHour);
        } catch (CovidException e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("비지니스 로직 에러 관리자에게 문의하세요.");
        }
        return result;
    }


    /**
     * 관심 지역 상세 - 주별 위험도(금주)
     * @param ldongCd
     * @return
     */
    @GetMapping(path = "/socialcontact/ldongcd/timeseries/week")
    public Result getSocialContactByLDongCdTimeSeiresWeek(@ApiParam(value="ex)1147010200") @RequestParam(value = "ldongCd", required = true) String ldongCd) {
        Result result = new Result();
        try {
            result = covidSearchAppService.getSocialContactLdongCdTimeSeiresWeek(ldongCd);
        } catch (CovidException e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("비지니스 로직 에러 관리자에게 문의하세요.");
        }
        return result;
    }

    /**
     * 관심 지역 상세 - 주별 위험도(전주)
     * @param ldongCd
     * @return
     */
    @GetMapping(path = "/socialcontact/ldongcd/timeseries/preweek")
    public Result getSocialContactByLDongCdTimeSeiresPreWeek(@ApiParam(value="ex)1147010200") @RequestParam(value = "ldongCd", required = true) String ldongCd) {
        Result result = new Result();
        try {
            result = covidSearchAppService.getSocialContactLdongCdTimeSeiresPreWeek(ldongCd);
        } catch (CovidException e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("비지니스 로직 에러 관리자에게 문의하세요.");
        }
        return result;
    }

}
