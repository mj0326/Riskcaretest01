package com.skt.covid.repository;

import com.skt.covid.domain.SocialContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface SocialContactRepository extends JpaRepository<SocialContact, String> {

    @Query(
        "SELECT \n" +
        " sc.dt as dt, sc.siDo as si_do, sc.siGunGu as si_gun_gu, sc.dong as dong, sc.ldongCd as ldong_cd, " +
        " sc.flowScore as flow_score, sc.taxiScore as taxi_score, sc.subwayScore as subway_score, sc.outdoorActivityScore as outdoor_activity_score, \n" +
        " sc.contactScore as contact_score, sc.rankInSiGunGu AS contact_rank, sc.totalInSiGunGu as total_in_si_gun_gu, sc.rankInSiDo as rank_in_si_do, sc.totalInSiDo as total_in_si_do\n" +
        "from SocialContact sc \n" +
        "where STR_TO_DATE(sc.dt, '%Y-%m-%d') >=  STR_TO_DATE(:startDateTime, '%Y-%m-%d') \n" +
        "and STR_TO_DATE(sc.dt, '%Y-%m-%d') <= STR_TO_DATE(:endDateTime, '%Y-%m-%d') \n" +
        "and sc.ldongCd = :ldongCd \n" +
        "order by sc.dt asc"
    )
    List<Map<String, Object>> getSocialContacts(@Param("startDateTime") String startDateTime, @Param("endDateTime") String endDateTime, @Param("ldongCd") String ldongCd);


    @Query(
      "SELECT count(sc.dt) AS cnt \n" +
      "FROM SocialContact sc \n" +
      "WHERE sc.dt = :baseTime"
    )
    Map getSocialCnt(@Param("baseTime") String baseTime);

    @Query(
        "SELECT \n" +
        " sc.dt as dt, sc.siDo as si_do, sc.siGunGu as si_gun_gu, sc.dong as dong, sc.ldongCd as ldong_cd, " +
        " sc.flowScore as flow_score, sc.taxiScore as taxi_score, sc.subwayScore as subway_score, sc.outdoorActivityScore as outdoor_activity_score, \n" +
        " sc.contactScore as contact_score, sc.rankInSiGunGu AS contact_rank, sc.totalInSiGunGu as total_in_si_gun_gu, sc.rankInSiDo as rank_in_si_do, sc.totalInSiDo as total_in_si_do\n" +
        "FROM SocialContact sc \n" +
        "WHERE dt = :baseTime \n" +
        "and ldong_cd in :ldongCd"
    )
    List<Map<String, Object>> getSocialContact(@Param("baseTime") String baseTime, @Param("ldongCd") String... ldongCd);

    @Query(
        "SELECT \n" +
        " sc \n" +
        "FROM SocialContact sc \n" +
        "WHERE dt = :baseTime \n" +
        "and ldong_cd in :ldongCd"
    )
    List<SocialContact> getSocialContacts(@Param("baseTime") String baseTime, @Param("ldongCd") List<String> ldongCds);

    @Query(
        "SELECT \n" +
        " sc.dt as dt, sc.siDo as si_do, sc.siGunGu as si_gun_gu, sc.dong as dong, sc.ldongCd as ldong_cd, " +
        " sc.flowScore as flow_score, sc.taxiScore as taxi_score, sc.subwayScore as subway_score, sc.outdoorActivityScore as outdoor_activity_score, \n" +
        " sc.contactScore as contact_score, sc.rankInSiGunGu AS contact_rank, sc.totalInSiGunGu as total_in_si_gun_gu, sc.rankInSiDo as rank_in_si_do, sc.totalInSiDo as total_in_si_do\n" +
        "FROM SocialContact sc \n" +
        "WHERE dt = :baseTime \n" +
        "and (si_gun_gu like :searchText or si_do like :searchText or dong like :searchText)"
    )
    List<Map<String, Object>> getSocialContact(@Param("baseTime") String baseTime, @Param("searchText") String searchText);

    @Query(value =
        "SELECT\n" +
        "   A.*, @ROWNUM=@ROWNUM+1 AS contact_rank\n" +
        "   FROM (\n" +
        "         SELECT\n" +
        "        dt, si_gun_gu, flow_score, taxi_score, subway_score, outdoor_activity_score, Ceil(AVG(contact_score)) as contact_score\n" +
        "         FROM social_contact sc,\n" +
        "         (SELECT @ROWNUM = 0) TMP\n" +
        "       WHERE dt = :dt \n" +
        "         GROUP BY si_gun_gu ORDER BY contact_score desc\n" +
        "\n" +
        " ) A, (SELECT @ROWNUM = 0) TMP", nativeQuery = true)
    List<Map<String, Object>> getSocialContactScore(@Param("dt") String dt);

    @Query(
        "SELECT \n" +
            " sc " +
            "from SocialContact sc \n"
    )
    List<Map> getCovidMsg();
}
