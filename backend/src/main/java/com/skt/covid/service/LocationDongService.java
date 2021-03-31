package com.skt.covid.service;

import com.skt.covid.config.Constants;
import com.skt.covid.domain.LocationDong;
import com.skt.covid.repository.LocationDongRepository;
import com.skt.covid.service.mapper.LocationDongMapper;
import com.skt.covid.web.rest.errors.CovidException;
import com.skt.covid.web.rest.vm.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class LocationDongService {

    @Autowired
    private LocationDongRepository locationDongRepository;

    @Autowired
    private LocationDongMapper locationDongMapper;

    /**
     *
     * @param name
     * @return
     */
    @Transactional(readOnly = true)
    public Result searchByName(String name) throws CovidException {
        Result result = new Result();

        if(name.length() > 1) {
            name = "%" + name + "%";
        } else {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("Please enter at least 1 character.");
            return result;
        }

        List<LocationDong> results = locationDongRepository.searchByName(name);
        result.setData(locationDongMapper.locationDongToLocationDongDTOs(results));
        result.setCode(Constants.CommonCode.SUCCESS);
        return result;
    }

    /**
     *
     * @param lDongCds
     * @return
     */
    @Transactional(readOnly = true)
    public Result searchByLDongCds(List<String> lDongCds) throws CovidException {
        Result result = new Result();

        List<LocationDong> results = locationDongRepository.getLocationDongList(lDongCds);
        result.setData(locationDongMapper.locationDongToLocationDongDTOs(results));
        result.setCode(Constants.CommonCode.SUCCESS);
        return result;
    }

    /**
     * 시도 API
     * @return
     */
    @Transactional(readOnly = true)
    public Result searchLocationSido() throws CovidException {
        Result result = new Result();

        List<LocationDong> results = locationDongRepository.searchLocationSido();
        result.setData(locationDongMapper.locationDongToLocationDongDTOs(results));
        result.setCode(Constants.CommonCode.SUCCESS);
        return result;
    }

    /**
     * 시군구 API
     * @return
     */
    @Transactional(readOnly = true)
    public Result searchLocationSigungu(String sigungu) throws CovidException {
        Result result = new Result();

        List<LocationDong> results = locationDongRepository.searchLocationSigungu(sigungu);
        result.setData(locationDongMapper.locationDongToLocationDongDTOs(results));
        result.setCode(Constants.CommonCode.SUCCESS);
        return result;
    }

    /**
     * 동 API
     * @return
     */
    @Transactional(readOnly = true)
    public Result searchLocationDong(String siDo, String siGunGu) throws CovidException {
        Result result = new Result();

        List<LocationDong> results = locationDongRepository.searchLocationDong(siDo, siGunGu);
        result.setData(locationDongMapper.locationDongToLocationDongDTOs(results));
        result.setCode(Constants.CommonCode.SUCCESS);
        return result;
    }
}


