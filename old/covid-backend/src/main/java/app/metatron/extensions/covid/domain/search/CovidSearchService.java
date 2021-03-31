package app.metatron.extensions.covid.domain.search;

import app.metatron.extensions.covid.domain.storage.CovidRdbmsClient;
import app.metatron.extensions.covid.domain.storage.DruidApiClient;
import app.metatron.extensions.covid.domain.storage.DruidSqlRequest;
import app.metatron.extensions.covid.domain.storage.SiDoMapper;
import app.metatron.extensions.covid.domain.storage.query.IntervalFilterCondition;
import app.metatron.extensions.covid.domain.storage.query.func.AggregationFunc;
import app.metatron.extensions.covid.domain.storage.query.func.TimeExtractFunc;
import app.metatron.extensions.covid.domain.storage.unit.Aggregation;
import app.metatron.extensions.covid.domain.storage.unit.ExtractUnit;
import app.metatron.extensions.covid.domain.storage.unit.Granularity;
import app.metatron.extensions.covid.domain.storage.query.func.TimeFormatFunc;
import app.metatron.extensions.covid.util.JodaTimeUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Preconditions;
import com.google.common.collect.Lists;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.Interval;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * Service interfaces related data search
 */
@Slf4j
@Component
public class CovidSearchService {

  private static final String SPACE = " ";
  private static final String DEFAULT_TIMEZONE = "Asia/Seoul";
  private static final DateTimeFormatter STAT_BASE_DATE_FMT = DateTimeFormat.forPattern("yyyy.MM.dd")
                                                                            .withZone(DateTimeZone.forID(DEFAULT_TIMEZONE));
  private static final DateTimeFormatter STAT_BASE_DATE_FMT_SOCIAL_CONTACT = DateTimeFormat.forPattern("yyyy-MM-dd")
                                                                            .withZone(DateTimeZone.forID(DEFAULT_TIMEZONE));
  private static final DateTimeFormatter STAT_BASE_DATE_FMT_COVID_BLUE = DateTimeFormat.forPattern("yyyyMM")
                                                                                           .withZone(DateTimeZone.forID(DEFAULT_TIMEZONE));

  private DruidApiClient druidApiClient;

  private CovidRdbmsClient covidRdbmsClient;

  private SiDoMapper siDoMapper;

  @Value("${covid.storage.druid.data-sources.msg:default-table}")
  private String msgTableName;

  public CovidSearchService(DruidApiClient druidApiClient,
                            CovidRdbmsClient covidRdbmsClient,
                            SiDoMapper siDoMapper) {
    this.druidApiClient = druidApiClient;
    this.covidRdbmsClient = covidRdbmsClient;
    this.siDoMapper = siDoMapper;
  }

  /**
   * Get results using Druid's SQL
   *
   * @param sqlRequest
   * @return
   */
  public Object searchByRawSql(DruidSqlRequest sqlRequest) {

    Object results = null;
    try {
      LOG.debug("Query : {}}", sqlRequest.getQuery());
      results = druidApiClient.callSql(sqlRequest);
      LOG.debug("Results : {}", results);
    } catch (Exception e) {
      LOG.error("Query result Error :: {}, Result :: {}", e.getMessage(), results);
      throw new RuntimeException("Query result Error :: " + e.getMessage());
    }

    return results;
  }


  public Object searchByListOfCovidStatus(List<String> siDos, List<String> siGunGus, Boolean includeZeroConfirmed, String interval, Integer limit) {

        /*
          [Query Sample]
          SELECT time_format(__time, 'yyyy-MM-dd HH:mm:ss', 'Asia/Seoul') AS t, location_id, si_do, si_gun_gu, msg, confirmed, tracing
          FROM covid_msg_v1
          WHERE __time >= '2020-10-27 00:00:00' AND __time < '2020-10-29 00:00:00';
          ORDER BY __time desc
          LIMIT 100;
         */

    // Set default value to limit
    if (limit == null) {
      limit = 100;
    }

    String timeFormatStr = new TimeFormatFunc("\"__time\"", Granularity.SECOND.getPattern(), DEFAULT_TIMEZONE).build();
    List<String> projectionColumns = Lists
            .newArrayList("location_id", "si_do", "si_gun_gu", "msg", "confirmed", "tracing");

    StringBuilder query = new StringBuilder("SELECT");

    // Projection statement
    query.append(SPACE);
    query.append(timeFormatStr).append(" AS t");
    for (String projectionColumn : projectionColumns) {
      query.append(", ").append(projectionColumn);
    }

    // From statement
    query.append(SPACE);
    query.append("FROM ").append(msgTableName);

    boolean noWhereStmt = true;
    if (StringUtils.isNotEmpty(interval)) {
      if (noWhereStmt) {
        query.append(SPACE)
             .append("WHERE ");
        noWhereStmt = false;
      }
      query.append(new IntervalFilterCondition(interval).build());
    }

    String locationPredicate = getLocationPredicate(siDos, siGunGus);
    if (StringUtils.isNotEmpty(locationPredicate)) {
      if (noWhereStmt) {
        query.append(SPACE)
             .append("WHERE ");
        // noWhereStmt = false;
      } else {
        query.append(SPACE).append("AND ");
      }

      query.append(locationPredicate);
    }

    if(BooleanUtils.isFalse(includeZeroConfirmed)) {
      if (noWhereStmt) {
        query.append(SPACE)
             .append("WHERE ");
        // noWhereStmt = false;
      } else {
        query.append(SPACE).append("AND ");
      }

      query.append("confirmed != 0");
    }

    query.append(SPACE).append("ORDER BY __time DESC");
    query.append(SPACE).append("LIMIT ").append(limit);

    return searchByRawSql(new DruidSqlRequest(query.toString()));
  }

  /**
   * Get WHERE statement related with location columns
   *
   * @param siDos
   * @param siGunGus
   * @return
   */
  private String getLocationPredicate(List<String> siDos, List<String> siGunGus) {
    StringBuilder predicate = new StringBuilder();

    Boolean needAnd = false;
    if (CollectionUtils.isNotEmpty(siDos)) {
      needAnd = true;
      predicate.append("si_do").append(" IN ").append("(").append(joinElementsInStat(siDos)).append(")");
    }

    if (CollectionUtils.isNotEmpty(siGunGus)) {
      if (needAnd) {
        predicate.append(SPACE).append("AND ");
      }

      predicate.append("si_gun_gu").append(" IN ").append("(").append(joinElementsInStat(siGunGus)).append(")");
    }

    return predicate.toString();
  }

  /**
   * Join list to string for IN statement
   *
   * @param list
   * @return
   */
  private String joinElementsInStat(List<String> list) {
    StringJoiner sj = new StringJoiner(",");
    for (String s : list) {
      sj.add("'" + s + "'");
    }
    return sj.toString();
  }

  /**
   * Get trend of infected person
   *
   * @param granularity
   * @param aggregation
   */
  public ChartResponse queryCountOfConfirmedPatients(List<String> siDos, List<String> siGunGus, Granularity granularity,
                                                     Aggregation aggregation,
                                                     String interval) {

        /*
           [Query Sample]
           SELECT time_format("__time", 'yyyy-MM-dd HH', '+09:00') AS t, sum("confirmed") AS val
           FROM covid_msg_v1
           WHERE __time > '2020-10-28 00:00:00' AND __time <= '2020-10-28 23:59:59'
           GROUP BY time_format("__time", 'yyyy-MM-dd HH', '+09:00');
         */

    // select time_format("__time", 'yyyy-MM-dd HH'), sum("count") as val from "druid"."covid_msg" group by  time_format("__time", 'yyyy-MM-dd HH');
    String timeFormatStr = new TimeFormatFunc("\"__time\"", granularity.getPattern(), DEFAULT_TIMEZONE).build();
    String aggrExpr = aggregation + "(\"confirmed\")";

    StringBuilder query = new StringBuilder("SELECT");

    // Projection statement
    query.append(SPACE);
    query.append(timeFormatStr).append(" AS t").append(", ");
    query.append(aggrExpr).append(" AS val");

    // From statement
    query.append(SPACE);
    query.append("FROM ").append(msgTableName);

    boolean noWhereStmt = true;
    if (StringUtils.isNotEmpty(interval)) {
      if (noWhereStmt) {
        query.append(SPACE)
             .append("WHERE ");
        noWhereStmt = false;
      }

      query.append(new IntervalFilterCondition(interval).build());
    }

    String locationPredicate = getLocationPredicate(siDos, siGunGus);
    if (StringUtils.isNotEmpty(locationPredicate)) {
      if (noWhereStmt) {
        query.append(SPACE)
             .append("WHERE ");
        // noWhereStmt = false;
      } else {
        query.append(SPACE).append("AND ");
      }

      query.append(locationPredicate);
    }

    // Group by statement
    query.append("GROUP BY ").append(timeFormatStr);

    ArrayList results = (ArrayList) searchByRawSql(new DruidSqlRequest(query.toString()));

    return new ChartResponse(results, granularity, interval, Lists.newArrayList("val"));
  }

  public ChartResponse queryTimeExtractOfConfirmedPatients(List<String> siDos, List<String> siGunGus,
                                                           ExtractUnit extractUnit, Aggregation aggregation,
                                                           List<String> ranges, List<String> labels) {

    Preconditions.checkArgument(CollectionUtils.isNotEmpty(ranges), "'ranges' required");
    Preconditions.checkArgument(CollectionUtils.isNotEmpty(labels), "'labels' required");
    Preconditions.checkArgument(ranges.size() == labels.size(), "'ranges' and 'labels' sizes must be the same.");

        /*
          [Query Sample]
          SELECT TIME_EXTRACT(__time, 'HOUR', '+09:00') AS t,
            SUM("confirmed") FILTER(WHERE __time >= '2020-10-27 00:00:00' AND __time <  '2020-10-27 21:00:00') AS yesterday,
	        SUM("confirmed") FILTER(WHERE __time >= '2020-10-28 00:00:00' AND __time <  '2020-10-28 21:00:00') AS today
          FROM covid_msg_v1
          WHERE __time >= '2020-10-27 00:00:00' AND __time < '2020-10-29 00:00:00'
          GROUP BY TIME_EXTRACT(__time, 'HOUR', '+09:00');
         */

    String extractFuncStr = new TimeExtractFunc("\"__time\"", extractUnit, DEFAULT_TIMEZONE).build();

    StringBuilder query = new StringBuilder("SELECT");

    // Projection statement
    query.append(SPACE);
    query.append(extractFuncStr).append(" AS t").append(" ");

    for (int i = 0; i < ranges.size(); i++) {
      query.append(", ");
      query.append(
              new AggregationFunc(aggregation, "confirmed", new IntervalFilterCondition(ranges.get(i)).build()).build())
           .append(" ")
           .append(" AS ").append(labels.get(i));
    }

    // From statement
    query.append(SPACE);
    query.append("FROM ").append(msgTableName);

    String interval = JodaTimeUtils.unionInterval(ranges);
    query.append(SPACE);
    query.append("WHERE ").append(new IntervalFilterCondition(interval).build());

    String locationPredicate = getLocationPredicate(siDos, siGunGus);
    if (StringUtils.isNotEmpty(locationPredicate)) {
      query.append(SPACE)
           .append("AND ");
      query.append(locationPredicate);
    }

    // Group by statement
    query.append(SPACE);
    query.append("GROUP BY ").append(extractFuncStr);

    ArrayList results = (ArrayList) searchByRawSql(new DruidSqlRequest(query.toString()));

    return new ChartResponse(results, extractUnit, ranges, labels);
  }

  public Object queryLocationOfConfirmedPatients(List<String> siDos, List<String> siGunGus,
                                                        List<String> ranges, List<String> labels) {

    Preconditions.checkArgument(CollectionUtils.isNotEmpty(ranges), "'ranges' required");
    Preconditions.checkArgument(CollectionUtils.isNotEmpty(labels), "'labels' required");
    Preconditions.checkArgument(ranges.size() == labels.size(), "'ranges' and 'labels' sizes must be the same.");

        /*
          [Query Sample]
          SELECT si_do,
            SUM("confirmed") FILTER(WHERE __time >= '2020-10-27 00:00:00' AND __time <  '2020-10-27 21:00:00') AS yesterday,
            SUM("confirmed") FILTER(WHERE __time >= '2020-10-28 00:00:00' AND __time <  '2020-10-28 21:00:00') AS today
          FROM covid_msg_v1
          WHERE __time >= '2020-10-27 00:00:00' AND __time < '2020-10-29 00:00:00'
          GROUP BY si_do;
         */

    StringBuilder query = new StringBuilder("SELECT");

    // Projection statement
    query.append(SPACE);
    query.append("si_do");

    for (int i = 0; i < ranges.size(); i++) {
      query.append(", ");
      query.append(
              new AggregationFunc(Aggregation.SUM, "confirmed", new IntervalFilterCondition(ranges.get(i)).build()).build())
           .append(" ")
           .append(" AS ").append(labels.get(i));
    }

    // From statement
    query.append(SPACE);
    query.append("FROM ").append(msgTableName);

    // Where statement
    String interval = JodaTimeUtils.unionInterval(ranges);
    query.append(SPACE);
    query.append("WHERE ").append(new IntervalFilterCondition(interval).build());

    String locationPredicate = getLocationPredicate(siDos, siGunGus);
    if (StringUtils.isNotEmpty(locationPredicate)) {
      query.append(SPACE)
           .append("AND ");
      query.append(locationPredicate);
    }

    // Group by statement
    query.append(SPACE);
    query.append("GROUP BY ").append("si_do");

    return searchByRawSql(new DruidSqlRequest(query.toString()));
  }

  public Object queryTotalPatientsByLocationInMsg(String baseDateTime, String baseGroup, List<String> siDos, List<String> labels) {

    DateTime dateTime = DateTime.parse(baseDateTime);
    DateTime yesterdayTime = dateTime.minusDays(1);

    List<String> ranges = Lists.newArrayList();
    ranges.add(yesterdayTime.withTime(0, 0, 0, 0).toString() + "/" + yesterdayTime.toString());
    ranges.add(dateTime.withTime(0, 0, 0, 0).toString() + "/" + dateTime.toString());

    if(CollectionUtils.isEmpty(labels)) {
      labels = Lists.newArrayList("yesterday", "today");
    }

        /*
          [Query Sample]
          SELECT si_do,
            SUM("confirmed") FILTER(WHERE __time >= '2020-10-27 00:00:00' AND __time <  '2020-10-27 21:00:00') AS yesterday,
            SUM("confirmed") FILTER(WHERE __time >= '2020-10-28 00:00:00' AND __time <  '2020-10-28 21:00:00') AS today
          FROM covid_msg_v1
          WHERE __time >= '2020-10-27 00:00:00' AND __time < '2020-10-29 00:00:00'
          GROUP BY si_do;
         */

    StringBuilder query = new StringBuilder("SELECT");

    // Projection statement
    query.append(SPACE);
    if("siGunGu".equals(baseGroup)) {
      query.append("si_gun_gu");
    } else {
      query.append("si_do");
    }

    for (int i = 0; i < ranges.size(); i++) {
      query.append(", ");
      query.append(
              new AggregationFunc(Aggregation.SUM, "confirmed", new IntervalFilterCondition(ranges.get(i)).build()).build())
           .append(" ")
           .append(" AS ").append(labels.get(i));
    }

    // From statement
    query.append(SPACE);
    query.append("FROM ").append(msgTableName);

    // Where statement
    String interval = JodaTimeUtils.unionInterval(ranges);
    query.append(SPACE);
    query.append("WHERE ").append(new IntervalFilterCondition(interval).build());

    String locationPredicate = getLocationPredicate(siDos, null);
    if (StringUtils.isNotEmpty(locationPredicate)) {
      query.append(SPACE)
           .append("AND ");
      query.append(locationPredicate);
    }

    // Group by statement
    query.append(SPACE);
    query.append("GROUP BY ");

    if("siGunGu".equals(baseGroup)) {
      query.append("si_gun_gu");
    } else {
      query.append("si_do");
    }

    return searchByRawSql(new DruidSqlRequest(query.toString()));
  }

  public Object queryTotalPatientsByLocationInStat(String baseDateTime, List<String> siDo, List<String> labels) {

    DateTime dateTime = DateTime.parse(baseDateTime);
    // List<String> dates = Lists.newArrayList(STAT_BASE_DATE_FMT.print(dateTime.minusDays(1)), STAT_BASE_DATE_FMT.print(dateTime));
    List<String> dates = validDateTimeForCovidStat(dateTime);


    StringBuilder locationWhereStmt = new StringBuilder();
    if(CollectionUtils.isEmpty(siDo)) {
      locationWhereStmt.append("location not in ('검역', '합계')");
    } else {
      List<String> convertedLoc = Lists.newArrayList();
      for (String location : siDo) {
        convertedLoc.add(siDoMapper.getSimpleNameByName(location));
      }
      locationWhereStmt.append("location in (").append(joinElementsInStat(convertedLoc)).append(")");
    }

    if(CollectionUtils.isEmpty(labels)) {
      labels = Lists.newArrayList("yesterday", "today");
    }

    /*
      [Query Sample]
      SELECT location AS si_do,
       SUM(IF(base_date = '2020.10.29', total_confirmed_cnt, 0)) AS yesterday,
       SUM(IF(base_date = '2020.10.30', total_confirmed_cnt, 0)) AS today
      FROM covid_stat
      WHERE base_date in ('2020.10.30', '2020.10.29') AND location not in ('검역', '합계')
      GROUP BY location;
     */

    StringBuilder query = new StringBuilder("SELECT");

    // Projection statement
    query.append(SPACE);
    query.append("location AS si_do");

    query.append(", ");
    query.append("SUM(IF(base_date = '").append(dates.get(0)).append("', total_confirmed_cnt, 0)) AS ").append(labels.get(0));

    query.append(", ");
    query.append("SUM(IF(base_date = '").append(dates.get(1)).append("', total_confirmed_cnt, 0)) AS ").append(labels.get(1));

    // From statement
    query.append(SPACE);
    query.append("FROM ").append("covid_stat");

    // Where statement
    query.append(SPACE);
    query.append("WHERE ").append("base_date in (").append(joinElementsInStat(dates)).append(")");
    query.append(" AND ").append(locationWhereStmt.toString());

    // Group by statement
    query.append(SPACE);
    query.append("GROUP BY ").append("location");

    // Order by statement
    query.append(SPACE);
    query.append("ORDER BY ").append("location");

    String queryStr = query.toString();
    LOG.debug("Query : {}", queryStr);

    List<Map<String, Object>> result = covidRdbmsClient.callSql(queryStr);

    // Convert simple si_do name to full name
    for (Map<String, Object> map : result) {
      if(map.containsKey("si_do")) {
        map.replace("si_do", siDoMapper.getNameBySimpleName((String) map.get("si_do")));
      }
    }

    return result;
  }

  /**
   * Check whether covid stat exists and set dates to compare
   *
   * @param dateTime
   * @return
   */
  private List<String> validDateTimeForCovidStat(DateTime dateTime) {

    List<String> dates = Lists.newArrayList();

    for (int i = 0; i < 10; i++) { // Set Loop limit - 10
      if(dates.size() == 2) {
        break;
      }
      // SELECT count(*) FROM covid_stat WHERE base_date = '2020.11.29';
      StringBuilder testQuery = new StringBuilder();
      testQuery.append("SELECT count(*) AS cnt FROM covid_stat WHERE base_date = '")
               .append(STAT_BASE_DATE_FMT.print(dateTime)).append("'");
      List<Map<String, Object>> queryResults = covidRdbmsClient.callSql(testQuery.toString());
      Long cnt = (Long) queryResults.get(0).get("cnt");
      if(cnt > 0) {
        dates.add(STAT_BASE_DATE_FMT.print(dateTime));
      }

      dateTime = dateTime.minusDays(1);
    }

    return Lists.reverse(dates);
  }

  public Object querySocialContact(String baseDateTime) {

    String validBaseTime = validDateTimeForSocialContact(DateTime.parse(baseDateTime));

    /*
      [Query Sample]
      SELECT
       A.*, @ROWNUM:=@ROWNUM+1 AS contact_rank
       FROM (
         SELECT
        dt, si_gun_gu, flow_score, taxi_score, subway_score, outdoor_activity_score, Ceil(AVG(contact_score)) as contact_score
         FROM social_contact sc,
         (SELECT @ROWNUM := 0) TMP
       WHERE dt = 2020-11-26
         GROUP BY si_gun_gu ORDER BY contact_score desc
       ) A, (SELECT @ROWNUM := 0) TMP;
     */

    StringBuilder query = new StringBuilder("SELECT");

    // Projection statement
    query.append(SPACE);
    query.append("A.*");

    query.append(", ");
    query.append("@ROWNUM:=@ROWNUM+1 AS ").append("contact_rank");

    // From statement
    query.append(SPACE);
    query.append("FROM ").append("(");

    query.append("SELECT");
    query.append(SPACE);
    query.append("dt, si_gun_gu, flow_score, taxi_score, subway_score, outdoor_activity_score");
    query.append(", ");
    query.append("Ceil(AVG(contact_score)) AS ").append("contact_score");

    query.append(SPACE);
    query.append("FROM ").append("social_contact sc,");
    query.append(SPACE);
    query.append("(SELECT @ROWNUM := 0) TMP");

    // Where statement
    query.append(SPACE);
    query.append("WHERE ").append("dt = \"").append(validBaseTime).append("\"");

    // Group by statement
    query.append(SPACE);
    query.append("GROUP BY ").append("si_gun_gu");

    // Order by statement
    query.append(SPACE);
    query.append("ORDER BY ").append("contact_score");
    query.append(SPACE);
    query.append("DESC");

    query.append(SPACE);
    query.append(") A,");
    query.append(SPACE);
    query.append("(SELECT @ROWNUM := 0) TMP");

    String queryStr = query.toString();
    LOG.debug("Query : {}", queryStr);

    List<Map<String, Object>> result = covidRdbmsClient.callSql(queryStr);
    result.forEach(socialContact -> {
      socialContact.replace("contact_rank", Math.round((Double) socialContact.get("contact_rank")));
    });
    return result;
  }

  public Object querySocialContactBySiGunGu(String baseDateTime, String siGunGu) {

    String validBaseTime = validDateTimeForSocialContact(DateTime.parse(baseDateTime));

    /*
      [Query Sample]
      SELECT
        dt, dong, ldong_cd, flow_score, taxi_score, subway_score, outdoor_activity_score,
        contact_score, rank_in_si_gun_gu AS contact_rank,
        total_in_si_gun_gu, rank_in_si_do, total_in_si_do
        FROM social_contact
        WHERE si_gun_gu = '종로구'
        ORDER BY contact_score desc;
     */

    StringBuilder query = new StringBuilder("SELECT");

    // Projection statement
    query.append(SPACE);
    query.append("dt, dong, ldong_cd, flow_score, taxi_score, subway_score, outdoor_activity_score");
    query.append(", contact_score");
    query.append(", ");
    query.append("rank_in_si_gun_gu AS ").append("contact_rank");
    query.append(", total_in_si_gun_gu, rank_in_si_do, total_in_si_do");

    // From statement
    query.append(SPACE);
    query.append("FROM ").append("social_contact");

    // Where statement
    query.append(SPACE);
    query.append("WHERE ").append("dt = \"").append(validBaseTime).append("\"");
    query.append(SPACE);
    query.append("AND ").append("si_gun_gu = \"").append(siGunGu).append("\"");

    // Order by statement
    query.append(SPACE);
    query.append("ORDER BY ").append("contact_rank");
    query.append(SPACE);
    query.append("ASC");

    String queryStr = query.toString();
    LOG.debug("Query : {}", queryStr);

    List<Map<String, Object>> result = covidRdbmsClient.callSql(queryStr);
    return result;
  }

  public Object querySocialContactByDong(String baseDateTime, String... ldongCds) {

    String validBaseTime = validDateTimeForSocialContact(DateTime.parse(baseDateTime));

    /*
      [Query Sample]
      SELECT
        dt, si_do, si_gun_gu, dong, ldong_cd, flow_score, taxi_score, subway_score, outdoor_activity_score,
        contact_score, rank_in_si_gun_gu AS contact_rank,
        total_in_si_gun_gu, rank_in_si_do, total_in_si_do
        FROM social_contact
        WHERE ldong_cd = '1111017400';
     */

    StringBuilder query = new StringBuilder("SELECT");

    // Projection statement
    query.append(SPACE);
    query.append("dt, si_do, si_gun_gu, dong, ldong_cd");
    query.append(", flow_score, taxi_score, subway_score, outdoor_activity_score");
    query.append(", contact_score");
    query.append(", rank_in_si_gun_gu AS ").append("contact_rank");
    query.append(", total_in_si_gun_gu, rank_in_si_do, total_in_si_do");

    // From statement
    query.append(SPACE);
    query.append("FROM ").append("social_contact");

    // Where statement
    query.append(SPACE);
    query.append("WHERE ").append("dt = \"").append(validBaseTime).append("\"");
    query.append(SPACE);
    if(ldongCds.length == 1) {
      query.append("AND ").append("ldong_cd = \"").append(ldongCds[0]).append("\"");
    } else {
      query.append("AND ").append("ldong_cd in (").append(joinElementsInStat(Arrays.asList(ldongCds))).append(")");
    }

    String queryStr = query.toString();
    LOG.debug("Query : {}", queryStr);

    List<Map<String, Object>> result = covidRdbmsClient.callSql(queryStr);

    return result;
  }

  /**
   * Check whether covid stat exists and set dates to compare
   *
   * @param dateTime
   * @return
   */
  private String validDateTimeForSocialContact(DateTime dateTime) {

    String baseTime = null;
    for (int i = 0; i < 20; i++) { // Set Loop limit - 10

      baseTime = STAT_BASE_DATE_FMT_SOCIAL_CONTACT.print(dateTime);

      // SELECT count(*) FROM social_contact WHERE dt = '2020.11.29';
      StringBuilder testQuery = new StringBuilder();
      testQuery.append("SELECT count(*) AS cnt FROM social_contact WHERE dt = '")
               .append(baseTime).append("'");
      List<Map<String, Object>> queryResults = covidRdbmsClient.callSql(testQuery.toString());
      Long cnt = (Long) queryResults.get(0).get("cnt");
      if(cnt > 0) {
        break;
      }

      dateTime = dateTime.minusDays(1);
    }

    return baseTime;
  }

  public Object queryCovidBlue(String baseDateTime) {

    DateTime dateTime = DateTime.parse(baseDateTime);

    /*
      [Query Sample]
      SELECT
       A.*, @ROWNUM:=@ROWNUM+1 AS total_rank
       FROM (
         SELECT
        ym, si_gun_gu, call_15770199_score, job_score, move_score,
        preg_score, security_score, date_score, Ceil(AVG(total_score)) AS total_score
         FROM corona_blue cb,
         (SELECT @ROWNUM := 0) TMP
       WHERE ym = 202010
         GROUP BY si_gun_gu ORDER BY total_score desc
       ) A, (SELECT @ROWNUM := 0) TMP;
     */

    StringBuilder query = new StringBuilder("SELECT");

    // Projection statement
    query.append(SPACE);
    query.append("A.*");

    query.append(", ");
    query.append("@ROWNUM:=@ROWNUM+1 AS ").append("total_rank");

    // From statement
    query.append(SPACE);
    query.append("FROM ").append("(");

    query.append("SELECT");
    query.append(SPACE);
    query.append("ym, si_gun_gu, call_15770199_score, job_score, move_score");
    query.append(", preg_score, security_score, date_score");
    query.append(", ");
    query.append("Ceil(AVG(total_score)) as total_score");

    query.append(SPACE);
    query.append("FROM ").append("corona_blue cb,");
    query.append(SPACE);
    query.append("(SELECT @ROWNUM := 0) TMP");

    // Where statement
    query.append(SPACE);
    query.append("WHERE ").append("ym = \"").append(STAT_BASE_DATE_FMT_COVID_BLUE.print(dateTime)).append("\"");

    // Group by statement
    query.append(SPACE);
    query.append("GROUP BY ").append("si_gun_gu");

    // Order by statement
    query.append(SPACE);
    query.append("ORDER BY ").append("total_score");
    query.append(SPACE);
    query.append("DESC");

    query.append(SPACE);
    query.append(") A,");
    query.append(SPACE);
    query.append("(SELECT @ROWNUM := 0) TMP");

    String queryStr = query.toString();
    LOG.debug("Query : {}", queryStr);

    List<Map<String, Object>> result = covidRdbmsClient.callSql(queryStr);
    result.forEach(covidBlue -> {
      covidBlue.replace("total_rank", Math.round((Double) covidBlue.get("total_rank")));
    });
    return result;
  }

  public Object queryCovidBlueBySiGunGu(String baseDateTime, String siGunGu) {

    DateTime dateTime = DateTime.parse(baseDateTime);

    /*
      [Query Sample]
      SELECT ym, dong, ldong_cd, call_15770199_score, job_score, move_score,
        preg_score, security_score, date_score, total_score, rank_in_si_gun_gu AS total_rank,
        total_in_si_gun_gu, rank_in_si_do, total_in_si_do
        FROM corona_blue
        WHERE si_gun_gu = '종로구'
        ORDER BY total_score desc;
     */

    StringBuilder query = new StringBuilder("SELECT");

    // Projection statement
    query.append(SPACE);
    query.append("ym, dong, ldong_cd, call_15770199_score, job_score, move_score");
    query.append(", preg_score, security_score, date_score, total_score");
    query.append(", ");
    query.append("rank_in_si_gun_gu AS ").append("total_rank");
    query.append(", total_in_si_gun_gu, rank_in_si_do, total_in_si_do");

    // From statement
    query.append(SPACE);
    query.append("FROM ").append("corona_blue");

    // Where statement
    query.append(SPACE);
    query.append("WHERE ").append("ym = \"").append(STAT_BASE_DATE_FMT_COVID_BLUE.print(dateTime)).append("\"");
    query.append(SPACE);
    query.append("AND ").append("si_gun_gu = \"").append(siGunGu).append("\"");

    // Order by statement
    query.append(SPACE);
    query.append("ORDER BY ").append("total_rank");
    query.append(SPACE);
    query.append("ASC");

    String queryStr = query.toString();
    LOG.debug("Query : {}", queryStr);

    List<Map<String, Object>> result = covidRdbmsClient.callSql(queryStr);
    return result;
  }

  public Object queryTrendSocialContactByDong(String interval, String ldongCd) {
    Preconditions.checkArgument(StringUtils.isNotEmpty(ldongCd), "'ldongCd' required");

    Interval intervals = Interval.parse(interval);
    DateTimeFormatter fmt = DateTimeFormat.forPattern("yyyy-MM-dd").withZone(DateTimeZone.forID(DEFAULT_TIMEZONE));
    String startDateTime = fmt.print(intervals.getStart());
    String endDateTime = fmt.print(intervals.getEnd());

    /*
      [Query Sample]
      SELECT dt, ldong_cd, flow_score, taxi_score, subway_score, outdoor_activity_score
      FROM social_contact
      WHERE STR_TO_DATE(dt, '%Y-%m-%d') > STR_TO_DATE('2020-01-01', '%Y-%m-%d')
      AND STR_TO_DATE(dt, '%Y-%m-%d') < STR_TO_DATE('2020-12-01', '%Y-%m-%d')
      AND ldong_cd = '정동'
      GROUP BY dt, ldong_cd;
     */

    StringBuilder query = new StringBuilder("SELECT");

    // Projection statement
    query.append(SPACE);
    query.append("dt as t, dong, ldong_cd, flow_score, taxi_score, subway_score, outdoor_activity_score");
    query.append(", contact_score");
    query.append(", ");
    query.append("rank_in_si_gun_gu AS ").append("contact_rank");
    query.append(", total_in_si_gun_gu, rank_in_si_do, total_in_si_do");

    // From statement
    query.append(SPACE);
    query.append("FROM ").append("social_contact");

    // Where statement
    query.append(SPACE);
    query.append("WHERE ").append("STR_TO_DATE(dt, '%Y-%m-%d')");
    query.append(SPACE).append(">=");
    query.append(SPACE).append("STR_TO_DATE('");
    query.append(startDateTime);
    query.append("', '%Y-%m-%d')");
    query.append(SPACE);
    query.append("AND ").append("STR_TO_DATE(dt, '%Y-%m-%d')");
    query.append(SPACE).append("<=");
    query.append(SPACE).append("STR_TO_DATE('");
    query.append(endDateTime);
    query.append("', '%Y-%m-%d')");
    query.append(SPACE);
    query.append("AND ").append("ldong_cd = ").append(ldongCd);

    // Order by statement
    query.append(SPACE);
    query.append("ORDER BY ").append("t");
    query.append(SPACE);
    query.append("ASC");

    String queryStr = query.toString();
    LOG.debug("Query : {}", queryStr);

    List result = covidRdbmsClient.callSql(queryStr);

    return new ChartResponse(result, Granularity.DAY, interval
        , Lists.newArrayList("flow_score", "taxi_score", "subway_score", "outdoor_activity_score", "contact_score")
        , DateTimeZone.forID(DEFAULT_TIMEZONE));
  }

  public Object queryCovidStatTrend(String siDo, String interval) {
    Interval intervals = Interval.parse(interval);
    DateTimeFormatter fmt = DateTimeFormat.forPattern("yyyy.MM.dd").withZone(DateTimeZone.forID(DEFAULT_TIMEZONE));
    String startDateTime = fmt.print(intervals.getStart());
    String endDateTime = fmt.print(intervals.getEnd());

    /*
    [Query Sample]
    SELECT base_date as t, location, daily_confirmed_cnt, local_cnt, inflow_cnt FROM covid_stat
    WHERE STR_TO_DATE(base_date, '%Y.%m.%d') > STR_TO_DATE('2020.11.20', '%Y.%m.%d')
    AND STR_TO_DATE(base_date, '%Y.%m.%d') < STR_TO_DATE('2020.11.27', '%Y.%m.%d')
	  AND location = '합계';
     */

    StringBuilder query = new StringBuilder("SELECT");

    // Projection statement
    query.append(SPACE);
    query.append("base_date as t, daily_confirmed_cnt, local_cnt, inflow_cnt");

    // From statement
    query.append(SPACE);
    query.append("FROM ").append("covid_stat");

    // Where statement
    query.append(SPACE);
    query.append("WHERE ").append("STR_TO_DATE(base_date, '%Y.%m.%d')");
    query.append(SPACE).append(">=");
    query.append(SPACE).append("STR_TO_DATE('");
    query.append(startDateTime);
    query.append("', '%Y.%m.%d')");
    query.append(SPACE);
    query.append("AND ").append("STR_TO_DATE(base_date, '%Y.%m.%d')");
    query.append(SPACE).append("<=");
    query.append(SPACE).append("STR_TO_DATE('");
    query.append(endDateTime);
    query.append("', '%Y.%m.%d')");
    query.append(SPACE);
    query.append("AND ").append("LOCATION = '" + siDo + "'");

    String queryStr = query.toString();
    LOG.debug("Query : {}", queryStr);

    List result = covidRdbmsClient.callSql(queryStr);

    return new ChartResponse(result, Granularity.COVID_STAT, interval
        , Lists.newArrayList("daily_confirmed_cnt", "local_cnt", "inflow_cnt")
        , DateTimeZone.forID(DEFAULT_TIMEZONE));
  }


}
