//package com.skt.covid.repository;
//
//import com.skt.covid.domain.CoronaBlue;
//import com.skt.covid.domain.SocialContact;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface CoronaBlueRepository extends JpaRepository<CoronaBlue, String> {
//
////    @Query(
////        "select sc.dt as t, sc.dong as dong, sc.ldongCd as ldong_cd, sc.flowScore as flow_score, sc.taxiScore as taxi_score, sc.subwayScore as subway_score, sc.outdoorActivityScore as outdoor_activity_score, " +
////        "       sc.contactScore as contact_score, sc.rankInSiGunGu as contact_rank, sc.totalInSiGunGu as total_in_si_gun_gu, sc.rankInSiDo as rank_in_si_do, sc.totalInSiDo as total_in_si_do \n" +
////        "from CoronaBlue cb \n" +
////        "where cb.ym =  dateTime \n" +
////        "group by cb.siGunGu \n" +
////        "order by cb.totalScore desc"
////    )
////    List<CoronaBlue> getCoronaBlue(String dateTime, String endDateTime, String ldongCd);
//}
