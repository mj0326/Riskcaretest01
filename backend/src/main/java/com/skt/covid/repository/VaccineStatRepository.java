package com.skt.covid.repository;

import com.skt.covid.domain.VaccineStat;
import com.skt.covid.domain.VaccineStatPK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface VaccineStatRepository extends JpaRepository<VaccineStat, VaccineStatPK> {

    @Query(
        "select vaccineStat \n" +
        "from VaccineStat vaccineStat \n" +
        "WHERE vaccineStat.baseDate = :dateTime \n" +
        "AND vaccineStat.siDo like :siDo"
    )
    List<VaccineStat> vaccineSidoList(@Param("dateTime") String dateTime, @Param("siDo") String siDo);

    @Query(
        "select vaccineStat\n" +
        "from VaccineStat vaccineStat \n" +
        "WHERE vaccineStat.baseDate = :dateTime \n"
    )
    List<VaccineStat> vaccineList(@Param("dateTime") String dateTime);

    @Query(
        "select vaccineStat \n" +
        "from VaccineStat vaccineStat \n" +
        "WHERE vaccineStat.baseDate = :dateTime \n" +
        "AND   vaccineStat.siDo = '전국' "
    )
    VaccineStat vaccineTotalList(@Param("dateTime") String dateTime);
}

