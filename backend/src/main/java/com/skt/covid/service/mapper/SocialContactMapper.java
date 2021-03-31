package com.skt.covid.service.mapper;

import com.skt.covid.domain.*;
import com.skt.covid.repository.LocationDongRepository;
import com.skt.covid.service.dto.SocialContactDTO;
import com.skt.covid.service.dto.SocialContactPredDTO;
import com.skt.covid.service.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Mapper for the entity {@link User} and its DTO called {@link UserDTO}.
 *
 * Normal mappers are generated using MapStruct, this one is hand-coded as MapStruct
 * support is still in beta, and requires a manual step with an IDE.
 */
@Service
public class SocialContactMapper {

    @Autowired
    LocationDongRepository locationDongRepository;

    public List<SocialContactDTO> locationDongTosocialContacts(List<LocationDong> locationDongs) {
        return locationDongs.stream()
            .filter(Objects::nonNull)
            .map(this::locationDongTosocialContactDTO)
            .collect(Collectors.toList());
    }

    public SocialContactDTO locationDongTosocialContactDTO(LocationDong locationDong) {
        return new SocialContactDTO(locationDong);
    }


    public List<SocialContactDTO> socialContactTosocialContacts(List<SocialContact> socialContacts) {
        return socialContacts.stream()
            .filter(Objects::nonNull)
            .map(this::socialContactTosocialContactDTO)
            .collect(Collectors.toList());
    }

    public SocialContactDTO socialContactTosocialContactDTO(SocialContact socialContact) {
        return new SocialContactDTO(socialContact);
    }


    public List<SocialContactPredDTO> socialContactPredTosocialContactPredDTOs(List<SocialContactPredLdongCd10> socialContactPredLdongCd10s) {
        return socialContactPredLdongCd10s.stream()
            .filter(Objects::nonNull)
            .map(this::socialContactPredTosocialContactPredDTO)
            .collect(Collectors.toList());
    }

    public SocialContactPredDTO socialContactPredTosocialContactPredDTO(SocialContactPredLdongCd10 socialContactPredLdongCd10) {

        LocationDong locationDong = locationDongRepository.getLocationDong(socialContactPredLdongCd10.getLdongCd());
        return new SocialContactPredDTO(socialContactPredLdongCd10, locationDong);
    }


    public List<SocialContactPredDTO> socialContactTosocialContactDTOs(List<SocialContactLdongCd10> socialContactLdongCd10s) {
        return socialContactLdongCd10s.stream()
            .filter(Objects::nonNull)
            .map(this::socialContactTosocialContactDTO)
            .collect(Collectors.toList());
    }

    public SocialContactPredDTO socialContactTosocialContactDTO(SocialContactLdongCd10 socialContactLdongCd10) {

        LocationDong locationDong = locationDongRepository.getLocationDong(socialContactLdongCd10.getLdongCd());
        return new SocialContactPredDTO(socialContactLdongCd10, locationDong);
    }



}
