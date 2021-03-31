package com.skt.covid.repository;

import com.skt.covid.domain.SocialContactLdongCd10;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

public interface SocialContactLdongCd10Repository extends JpaRepository<SocialContactLdongCd10, Long> {


    @Query(
        "select socialContactLdongCd10.ldongCd as ldongCd, socialContactLdongCd10.hh as hh, socialContactLdongCd10.contactIndex as contactIndex, socialContactLdongCd10.contactIndexPercentile as contactIndexPercentile \n" +
        "from   SocialContactLdongCd10 socialContactLdongCd10 \n" +
        "where  socialContactLdongCd10.ldongCd = :ldongCd \n" +
        "and    socialContactLdongCd10.dt = TIMESTAMP(DATE_FORMAT(:baseYMD, '%Y-%m-%d')) \n" +
        "order by socialContactLdongCd10.hh asc \n"
    )
    List<Map> getSocialContactTimeSeiresDay(@Param("baseYMD") String baseYMD, @Param("ldongCd") String ldongCd);

    @Query(
        "select socialContactLdongCd10 \n" +
        "from   SocialContactLdongCd10 socialContactLdongCd10 \n" +
        "where  socialContactLdongCd10.ldongCd = :ldongCd \n" +
        "and    socialContactLdongCd10.dt = TIMESTAMP(DATE_FORMAT(:baseYMD, '%Y-%m-%d')) \n" +
        "and    socialContactLdongCd10.hh = :hour"
    )
    List<SocialContactLdongCd10>  getSocialContactTimeSeiresHour(@Param("baseYMD") String baseYMD, @Param("ldongCd") String ldongCd, @Param("hour") String hour);



    @Query(
        "select socialContactLdongCd10.dt as dt, max(socialContactLdongCd10.contactIndexPercentile) as contactIndexPercentile \n" +
        "from   SocialContactLdongCd10 socialContactLdongCd10 \n" +
        "where  socialContactLdongCd10.ldongCd = :ldongCd \n" +
        "and    socialContactLdongCd10.dt between TIMESTAMP(DATE_FORMAT(:fromYMD, '%Y-%m-%d')) and TIMESTAMP(DATE_FORMAT(:toYMD, '%Y-%m-%d'))\n" +
        "group by socialContactLdongCd10.dt "
    )
    List<Map>  getSocialContactTimeSeiresPreWeek(@Param("ldongCd") String ldongCd, @Param("fromYMD") String fromYMD, @Param("toYMD") String toYMD);


}
