package com.skt.covid.web.rest;

import com.skt.covid.config.Constants;
import com.skt.covid.service.LocationDongService;
import com.skt.covid.web.rest.errors.CovidException;
import com.skt.covid.web.rest.vm.Result;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/apps")
public class LocationDongController {

    @Autowired
    private LocationDongService locationDongService;

    /**
     * 이름으로 지역 찾기 API
     * @param searchText
     * @return
     */
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
     * 코드로 지역 찾기 API
     * @param ldongCds
     * @return
     */
    @GetMapping(path = "/search/location/ldongcds")
    public Result searchLocationByName(@ApiParam(value="ex)1147010200") @RequestParam(value = "ldongCd", required = true) List<String> ldongCds) {
        Result result = new Result();
        try {
            result = locationDongService.searchByLDongCds(ldongCds);
        } catch (CovidException e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("지역조회에 실패하였습니다. +\n " + e.getMessage());
        }
        return result;
    }

    /**
     * 시도 API
     * @return
     */
    @GetMapping(path = "/search/location/sido")
    public Result searchLocationSido() {
        Result result = new Result();
        try {
            result = locationDongService.searchLocationSido();
        } catch (CovidException e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("지역조회에 실패하였습니다. +\n " + e.getMessage());
        }
        return result;
    }

    /**
     * 시군구 API
     * @return
     */
    @GetMapping(path = "/search/location/sigungu")
    public Result searchLocationSigungu(@ApiParam(value="ex)서울특별시") @RequestParam(value = "sigungu", required = true) String sigungu) {
        Result result = new Result();
        try {
            result = locationDongService.searchLocationSigungu(sigungu);
        } catch (CovidException e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("지역조회에 실패하였습니다. +\n " + e.getMessage());
        }
        return result;
    }


    /**
     * 동 API
     * @return
     */
    @GetMapping(path = "/search/location/dong")
    public Result searchLocationDong(@ApiParam(value="ex)서울특별시") @RequestParam(value = "siDo", required = true) String siDo,
                                     @ApiParam(value="ex)강남구") @RequestParam(value = "siGunGu", required = true) String siGunGu) {
        Result result = new Result();
        try {
            result = locationDongService.searchLocationDong(siDo, siGunGu);
        } catch (CovidException e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("지역조회에 실패하였습니다. +\n " + e.getMessage());
        }
        return result;
    }

}
