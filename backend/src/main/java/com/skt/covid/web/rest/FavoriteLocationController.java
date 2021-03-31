package com.skt.covid.web.rest;

import com.skt.covid.config.Constants;
import com.skt.covid.service.FavoriteLocationService;
import com.skt.covid.service.dto.FavoriteLocationDTO;
import com.skt.covid.web.rest.errors.CovidException;
import com.skt.covid.web.rest.vm.Result;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/apps")
public class FavoriteLocationController {

    @Autowired
    private FavoriteLocationService favoriteLocationService;

    /**
     * Result
     * @param lDongCd
     * @return
     */
    @ApiOperation(value = "관심장소 등록 API", httpMethod = "POST", notes = "관심장소 등록 API")
    @PostMapping(path = "/favorlocation")
    public Result createFavoriteLocation(@RequestBody String lDongCd) {
        Result result = new Result();
        try {
            result = favoriteLocationService.setFavoriteLocation(lDongCd);
        } catch (CovidException e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("관심장소 등록에 실패하였습니다. +\n " + e.getMessage());
        }
        return result;
    }

    /**
     * 관심장소 리스트 업데이트 API
     * @param favoriteLocationDtoList
     * @return
     */
    @ApiOperation(value = "관심장소 업데이트 API", httpMethod = "PUT", notes = "관심장소 업데이트 API")
    @PutMapping(path = "/favorlocations")
    public Result updateFavoriteLocations(@RequestBody List<FavoriteLocationDTO> favoriteLocationDtoList) {
        Result result = new Result();
        try {
            result = favoriteLocationService.updateFavoriteLocations(favoriteLocationDtoList);
        } catch (CovidException e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("관심장소 리스트 업데이트에 실패하였습니다. +\n " + e.getMessage());
        }
        return result;
    }

    /**
     * Delete the favorite location
     *
     * @param id
     * @return
     */
    @ApiOperation(value = "관심장소 삭제 API", httpMethod = "DELETE", notes = "관심장소 삭제 API")
    @DeleteMapping(path = "/favorlocation/{id}")
    public Result deleteFavoriteLocation(@PathVariable(name = "id") Long id) {
        Result result = new Result();
        try {
            return favoriteLocationService.deleteFavoriteLocation(id);
        } catch (CovidException e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("관심장소 삭제에 실패하였습니다. +\n " + e.getMessage());
        }
        return result;
    }

    /**
     * 관심 장소 조회 API
     * @return
     */
    @ApiOperation(value = "관심장소 조회 API", httpMethod = "GET", notes = "관심장소 조회 API")
    @GetMapping(path = "/favorlocation")
    public Result getFavoriteLocation() {
        Result result = new Result();
        try {
            result = favoriteLocationService.getFavoriteLocation();
        } catch (CovidException e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("관심장소 조회에 실패하였습니다. +\n " + e.getMessage());
        }
        return result;
    }

}
