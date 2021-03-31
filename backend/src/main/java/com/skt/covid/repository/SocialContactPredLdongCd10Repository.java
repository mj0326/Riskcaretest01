package com.skt.covid.repository;

import com.skt.covid.domain.SocialContactPredLdongCd10;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

public interface SocialContactPredLdongCd10Repository extends JpaRepository<SocialContactPredLdongCd10, String> {


    @Query(
        "select socialContactPredLdongCd10 \n" +
        "from   SocialContactPredLdongCd10 socialContactPredLdongCd10 \n" +
        "where  socialContactPredLdongCd10.ldongCd in :ldongCds \n" +
        "and    socialContactPredLdongCd10.predDt = :baseYMD \n" +
        "and    socialContactPredLdongCd10.dt = TIMESTAMP(DATE_FORMAT(:dt, '%Y-%m-%d'))  \n" +
        "and    socialContactPredLdongCd10.hh = :baseHH \n"
    )
    List<SocialContactPredLdongCd10> getSocialContactPreds(@Param("baseYMD") String baseYMD, @Param("baseHH") String baseHH, @Param("ldongCds") List<String> ldongCds, @Param("dt") String dt);

    @Query(
        "select socialContactPredLdongCd10 \n" +
        "from   SocialContactPredLdongCd10 socialContactPredLdongCd10 \n" +
        "where  socialContactPredLdongCd10.ldongCd = :ldongCd \n" +
        "and    socialContactPredLdongCd10.predDt = :baseYMD \n" +
        "and    socialContactPredLdongCd10.dt = TIMESTAMP(DATE_FORMAT(:dt, '%Y-%m-%d'))  \n" +
        "and    socialContactPredLdongCd10.hh = :baseHH \n"
    )
    List<SocialContactPredLdongCd10>  getSocialContactPred(@Param("baseYMD") String baseYMD, @Param("baseHH") String baseHH, @Param("ldongCd") String ldongCd, @Param("dt") String dt);


    @Query(
        "select socialContactPredLdongCd10.ldongCd as ldongCd, socialContactPredLdongCd10.hh as hh, socialContactPredLdongCd10.contactDensity as contactDensity, socialContactPredLdongCd10.contactDensityPercentile as contactDensityPercentile \n" +
        "from   SocialContactPredLdongCd10 socialContactPredLdongCd10 \n" +
        "where  socialContactPredLdongCd10.ldongCd = :ldongCd \n" +
        "and    socialContactPredLdongCd10.predDt = :baseYMD \n" +
        "and    socialContactPredLdongCd10.dt = TIMESTAMP(DATE_FORMAT(:dt, '%Y-%m-%d')) \n" +
        "order by socialContactPredLdongCd10.hh asc \n"
    )
    List<Map>  getSocialContactPredTimeSeiresDay(@Param("baseYMD") String baseYMD, @Param("dt") String dt, @Param("ldongCd") String ldongCd);

    @Query(
        "select socialContactPredLdongCd10 \n" +
        "from   SocialContactPredLdongCd10 socialContactPredLdongCd10 \n" +
        "where  socialContactPredLdongCd10.ldongCd = :ldongCd \n" +
        "and    socialContactPredLdongCd10.predDt = :baseYMD \n" +
        "and    socialContactPredLdongCd10.dt = TIMESTAMP(DATE_FORMAT(:dt, '%Y-%m-%d')) \n" +
        "and    socialContactPredLdongCd10.hh = :hour"
    )
    List<SocialContactPredLdongCd10>  getSocialContactPredTimeSeiresHour(@Param("baseYMD") String baseYMD, @Param("dt") String dt, @Param("ldongCd") String ldongCd, @Param("hour") String hour);


    @Query(
        "select socialContactPredLdongCd10.predDt as dt, max(socialContactPredLdongCd10.contactDensityPercentile) as contactDensityPercentile \n" +
        "from   SocialContactPredLdongCd10 socialContactPredLdongCd10 \n" +
        "where  socialContactPredLdongCd10.ldongCd = :ldongCd \n" +
        "and    socialContactPredLdongCd10.predDt between :fromYMD and :toYMD \n" +
        "and    socialContactPredLdongCd10.dt = TIMESTAMP(DATE_FORMAT(:baseYMD, '%Y-%m-%d')) \n" +
        "group by socialContactPredLdongCd10.predDt "
    )
    List<Map>  getSocialContactTimeSeiresWeek(@Param("ldongCd") String ldongCd, @Param("baseYMD") String baseYMD, @Param("fromYMD") String fromYMD, @Param("toYMD") String toYMD);

}
