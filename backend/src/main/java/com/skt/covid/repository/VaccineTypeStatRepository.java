package com.skt.covid.repository;

import com.skt.covid.domain.VaccineTypeStat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VaccineTypeStatRepository extends JpaRepository<VaccineTypeStat, String> {

    @Query(
        "select vaccineTypeStat \n" +
        "from VaccineTypeStat vaccineTypeStat \n" +
        "WHERE vaccineTypeStat.baseDate = :dateTime \n"
    )
    List<VaccineTypeStat> vaccineTypeStatList(@Param("dateTime") String dateTime);
}

