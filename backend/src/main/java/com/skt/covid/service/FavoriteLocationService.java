package com.skt.covid.service;

import com.skt.covid.config.Constants;
import com.skt.covid.domain.FavoriteLocation;
import com.skt.covid.domain.LocationDong;
import com.skt.covid.repository.FavoriteLocationRepository;
import com.skt.covid.repository.LocationDongRepository;
import com.skt.covid.repository.SocialContactPredLdongCd10Repository;
import com.skt.covid.security.SecurityUtils;
import com.skt.covid.service.dto.FavoriteLocationDTO;
import com.skt.covid.service.dto.SocialContactPredDTO;
import com.skt.covid.service.mapper.SocialContactMapper;
import com.skt.covid.web.rest.errors.CovidException;
import com.skt.covid.web.rest.vm.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class FavoriteLocationService {

    @Autowired
    private FavoriteLocationRepository favoriteLocationRepository;

    @Autowired
    private LocationDongRepository locationDongRepository;

    @Autowired
    SocialContactPredLdongCd10Repository socialContactPredLdongCd10Repository;

    @Autowired
    SocialContactMapper socialContactMapper;

    /**
     * 관심 장소 등록.
     * @param lDongCd
     */
    @Transactional
    public Result setFavoriteLocation(String lDongCd) throws CovidException {
        Result result = new Result();

        String userId = SecurityUtils.getCurrentUserLogin().get();
        if(null == userId) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("로그인이 필요한 서비스 입니다.");
            return result;
        }

        LocationDong locationDong = locationDongRepository.getLocationDong(lDongCd);
        if(null != locationDong) {

            FavoriteLocation location = favoriteLocationRepository.getFavoriteLocation(userId, lDongCd);
            if ( null == location ) {
                FavoriteLocation favoriteLocation = new FavoriteLocation();
                favoriteLocation.setLocationCode(locationDong.getCode());
                favoriteLocation.setLocationName(locationDong.getSiDo() + " " + locationDong.getSiGunGu() + " " + locationDong.getDong());
                favoriteLocation.setSiDo(locationDong.getSiDo());
                favoriteLocation.setSiGunGSu(locationDong.getSiGunGu());
                favoriteLocation.setDong(locationDong.getDong());

                int maxOrder = favoriteLocationRepository.getMaxOrderInFavoriteLocation(userId);
                favoriteLocation.setOrder(maxOrder + 1);

                favoriteLocationRepository.save(favoriteLocation);
                result.setCode(Constants.CommonCode.SUCCESS);
            }
            else {
                result.setCode(Constants.CommonCode.FAIL);
                result.setMessage("등록된 장소입니다.");
            }

        }
        else {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("잘못된 법정동 코드입니다.");
        }
        return result;
    }

    /**
     * 관심장소 리스트 업데이트
     * @param favoriteLocationDtoList
     * @return
     * @throws CovidException
     */
    @Transactional
    public Result updateFavoriteLocations(List<FavoriteLocationDTO> favoriteLocationDtoList) throws CovidException {
        Result result = new Result();

        String userId = SecurityUtils.getCurrentUserLogin().get();
        if(null == userId) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("로그인이 필요한 서비스 입니다.");
            return result;
        }

        favoriteLocationDtoList.forEach(dto -> {
            FavoriteLocation favoriteLocation = favoriteLocationRepository.getFavoriteLocation(userId, dto.getlDongCd());
            favoriteLocation.setOrder(dto.getOrder());
            favoriteLocationRepository.save(favoriteLocation);
        });

        result.setCode(Constants.CommonCode.SUCCESS);
        return result;
    }

    /**
     * 관심 장소 삭제
     * @param id
     */
    @Transactional
    public Result deleteFavoriteLocation(long id) throws CovidException {
        Result result = new Result();
        favoriteLocationRepository.deleteById(id);
        result.setCode(Constants.CommonCode.SUCCESS);
        return result;
    }

    /**
     * 관심 장소 조회
     * @return
     * @throws CovidException
     */
    @Transactional
    public Result getFavoriteLocation() throws CovidException {
        Result result = new Result();

        String userId = SecurityUtils.getCurrentUserLogin().get();
        if(null == userId) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("로그인이 필요한 서비스 입니다.");
            return result;
        }
        List<FavoriteLocation> favoriteLocationList = favoriteLocationRepository.getFavoriteLocations(userId);

        List<String> ldongCds = new ArrayList<>();
        for(FavoriteLocation favoriteLocation :favoriteLocationList) {
            ldongCds.add(favoriteLocation.getLocationCode());
        }

        String baseYMD = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String baseHH = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH"));
        String dt = LocalDateTime.now().minusDays(2).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

        List<SocialContactPredDTO> resultlist = socialContactMapper.socialContactPredTosocialContactPredDTOs(socialContactPredLdongCd10Repository.getSocialContactPreds(baseYMD, baseHH, ldongCds, dt));
        // order 값 삽입
        for ( SocialContactPredDTO item : resultlist ) {
            for ( FavoriteLocation favorite : favoriteLocationList ) {
                if ( item.getlDongCd().equals(favorite.getLocationCode()) ) {
                    item.setFavoriteLocationId(favorite.getId());
                    item.setOrder(favorite.getOrder());
                    break;
                }
            }
        }

        result.setData(resultlist);
        result.setCode(Constants.CommonCode.SUCCESS);

        return result;
    }

}
