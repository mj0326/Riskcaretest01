package com.skt.covid.repository;

import com.skt.covid.domain.CovidStat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface CovidStatRepository extends JpaRepository<CovidStat, String> {

    @Query(
        "select covidStat.baseDate as t, covidStat.dailyConfirmedCnt as daily_confirmed_cnt, covidStat.localCnt as local_cnt, covidStat.inflowCnt as inflow_cnt \n" +
        "from CovidStat covidStat \n" +
        "where TIMESTAMP(DATE_FORMAT(covidStat.baseDate, '%Y.%m.%d')) >= TIMESTAMP(DATE_FORMAT(:startDateTime, '%Y.%m.%d'))\n" +
        "and TIMESTAMP(DATE_FORMAT(covidStat.baseDate, '%Y.%m.%d')) <= TIMESTAMP(DATE_FORMAT(:endDateTime, '%Y.%m.%d')) \n" +
        "and covidStat.location like :sido"
    )
    List<Map<String, Object>> covidStatList(@Param("startDateTime") String startDateTime, @Param("endDateTime") String endDateTime, @Param("sido") String sido);

    @Query(
        "select count(covidStat.baseDate) AS cnt \n" +
        "from CovidStat covidStat \n" +
        "where covidStat.baseDate = :dateTime "
    )
    Map covidStatListMap(@Param("dateTime") String dateTime);

    @Query(
        value = "select covidStat.location AS si_do, \n" +
        "SUM(IF(covidStat.base_date = :yesterday, covidStat.total_confirmed_cnt, 0)) AS yesterday, \n" +
        "SUM(IF(covidStat.base_date = :today, covidStat.total_confirmed_cnt, 0)) AS today \n" +
        "from covid_stat covidStat \n" +
        "where covidStat.base_date in :dates \n" +
        "and covidStat.location in :locationWhereStmts", nativeQuery = true
    )
    List<Map> covidStatCompareList(@Param("yesterday") String yesterday, @Param("today") String today, @Param("dates") List dates, @Param("locationWhereStmts") List locationWhereStmts);

    @Query(
        value = "select covidStat.location AS si_do, \n" +
        "SUM(IF(covidStat.base_date = :yesterday, covidStat.total_confirmed_cnt, 0)) AS yesterday, \n" +
        "SUM(IF(covidStat.base_date = :today, covidStat.total_confirmed_cnt, 0)) AS today \n" +
        "from covid_stat covidStat \n" +
        "where covidStat.base_date in :dates \n" +
        "and covidStat.location not in :locationWhereStmts", nativeQuery = true
    )
    List<Map> covidStatNotCompareList(@Param("yesterday") String yesterday, @Param("today") String today, @Param("dates") List dates, @Param("locationWhereStmts") List locationWhereStmts);


    @Query(
        "select covidStat \n" +
        "from CovidStat covidStat \n" +
        "where covidStat.baseDate = :dateTime \n" +
        "and covidStat.location = '합계' "
    )
    CovidStat covidStatTotal(@Param("dateTime") String dateTime);

    @Query(
        "select covidStat \n" +
        "from CovidStat covidStat \n" +
        "where covidStat.baseDate = :dateTime \n" +
        "and covidStat.location <> '합계' " +
        "and covidStat.location like :searchText "
    )
    List<CovidStat> covidStatSido(@Param("dateTime") String dateTime, @Param("searchText") String searchText);

}

