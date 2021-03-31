package com.skt.covid.service.mapper;

import com.skt.covid.domain.LocationDong;
import com.skt.covid.domain.User;
import com.skt.covid.service.dto.LocationDongDTO;
import com.skt.covid.service.dto.UserDTO;
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
public class LocationDongMapper {

    public List<LocationDongDTO> locationDongToLocationDongDTOs(List<LocationDong> locationDongDto) {
        return locationDongDto.stream()
            .filter(Objects::nonNull)
            .map(this::locationDongToLocationDongDTO)
            .collect(Collectors.toList());
    }

    public LocationDongDTO locationDongToLocationDongDTO(LocationDong locationDong) {
        return new LocationDongDTO(locationDong);
    }


}
