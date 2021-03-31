package com.skt.covid.service.mapper;

import com.skt.covid.domain.Authority;
import com.skt.covid.domain.CovidMsg;
import com.skt.covid.domain.User;
import com.skt.covid.service.dto.CovidMsgDTO;
import com.skt.covid.service.dto.UserDTO;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Mapper for the entity {@link User} and its DTO called {@link UserDTO}.
 *
 * Normal mappers are generated using MapStruct, this one is hand-coded as MapStruct
 * support is still in beta, and requires a manual step with an IDE.
 */
@Service
public class CovidMsgMapper {

    public List<CovidMsgDTO> covidMsgsToCovidMsgDTOs(List<CovidMsg> covidMsgDTOs) {
        return covidMsgDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::covidMsgToCovidMsgDTO)
            .collect(Collectors.toList());
    }

    public CovidMsgDTO covidMsgToCovidMsgDTO(CovidMsg covidMsg) {
        return new CovidMsgDTO(covidMsg);
    }


}
