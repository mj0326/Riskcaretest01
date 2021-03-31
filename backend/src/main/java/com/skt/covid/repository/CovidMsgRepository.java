package com.skt.covid.repository;

import com.skt.covid.domain.CovidMsg;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface CovidMsgRepository extends JpaRepository<CovidMsg, Integer> {

    List<CovidMsg> findCovidMsgByMd102Sn(@Param("md102Sn") int md102Sn);


    @Query(
        "SELECT covidMsg \n" +
        "FROM   CovidMsg covidMsg \n" +
        "WHERE TIMESTAMP(DATE_FORMAT(covidMsg.createDate, '%Y.%m.%d')) = TIMESTAMP(DATE_FORMAT(:dateTime, '%Y.%m.%d'))\n" +
        "AND (covidMsg.siDo like :searchText or covidMsg.siGunGu like :searchText)"
    )
    List<CovidMsg> covidMsgSiGunGuList(@Param("dateTime") String dateTime, @Param("searchText") String searchText);

    @Query(
        "SELECT covidMsg.siDo as siDo, sum(covidMsg.confirmed) as patientCnt \n" +
        "FROM   CovidMsg covidMsg \n" +
        "WHERE TIMESTAMP(DATE_FORMAT(covidMsg.createDate, '%Y.%m.%d')) = TIMESTAMP(DATE_FORMAT(:dateTime, '%Y.%m.%d'))\n" +
        "AND (covidMsg.siDo like :searchText) \n" +
        "GROUP BY covidMsg.siDo"
    )
    List<Map> covidMsgSiDoList(@Param("dateTime") String dateTime, @Param("searchText") String searchText);

    @Query(
        "SELECT sum(covidMsg.confirmed) as patientCnt \n" +
        "FROM   CovidMsg covidMsg \n" +
        "WHERE TIMESTAMP(DATE_FORMAT(covidMsg.createDate, '%Y.%m.%d')) = TIMESTAMP(DATE_FORMAT(:dateTime, '%Y.%m.%d'))\n"
    )
    List<Map> covidMsgAllList(@Param("dateTime") String dateTime);

}
