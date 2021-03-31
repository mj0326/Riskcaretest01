package app.metatron.extensions.covid.domain.search;

import app.metatron.extensions.covid.domain.storage.DruidSqlRequest;
import app.metatron.extensions.covid.domain.storage.unit.Aggregation;
import app.metatron.extensions.covid.domain.storage.unit.ExtractUnit;
import app.metatron.extensions.covid.domain.storage.unit.Granularity;
import com.google.common.collect.Lists;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.EnumUtils;
import org.apache.commons.lang3.StringUtils;
import org.joda.time.DateTime;
import org.joda.time.Interval;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping(path = "/api")
public class CovidSearchController {

  private CovidSearchService covidSearchService;

  public CovidSearchController(CovidSearchService covidSearchService) {
    this.covidSearchService = covidSearchService;
  }

  /**
   * 드루이드에 SQL 을 넘겨 결과값을 그대로 받아올수 있습니다.
   * ex. {"query":"select 1"}
   *
   * @param sqlRequest
   * @return
   */
  @PostMapping(path = "/search/sql")
  public ResponseEntity<?> searchByRawSql(@RequestBody DruidSqlRequest sqlRequest) {
    return ResponseEntity.ok(covidSearchService.searchByRawSql(sqlRequest));
  }

  /**
   * 실시간 알림 목록 확인 및 목록 조회
   *
   * @param body
   * @return
   */
  @PostMapping(path = "/search/covid/list")
  public ResponseEntity<?> searchListOfCovidStatus(@RequestBody Map<String, Object> body) {

    String interval;
    Integer limit;

    if (body.containsKey("interval")) {
      try {
        interval = (String) body.get("interval");
        Interval.parse(interval);
      } catch (Exception e) {
        throw new IllegalArgumentException("Invalid argument : 'interval'");
      }
    } else {
      DateTime now = DateTime.now();
      interval = now.minusDays(1).toString() + "/" + now.toString();
    }

    if (body.containsKey("limit")) {
      limit = Integer.parseInt((String) body.get("limit"));
    } else {
      limit = 100;
    }

    List<String> siDos = null;
    List<String> siGunGus = null;
    if (body.containsKey("siDo")) {
      siDos = (List<String>) body.get("siDo");
    }

    if (body.containsKey("siGunGu")) {
      siGunGus = (List<String>) body.get("siGunGu");
    }

    Boolean includeZeroConfirmed = false;
    if(body.containsKey("includeZeroConfirmed")) {
      includeZeroConfirmed = (Boolean) body.get("includeZeroConfirmed");
    }

    return ResponseEntity.ok(covidSearchService.searchByListOfCovidStatus(siDos, siGunGus, includeZeroConfirmed, interval, limit));
  }

  /**
   * 확진자 현황을 확인 합니다.
   *
   * @param body
   * @return
   */
  @PostMapping(path = "/search/trend/patients")
  public ResponseEntity<?> searchTrendOfPatients(@RequestBody Map<String, Object> body) {

    Granularity granularity = EnumUtils.getEnumIgnoreCase(Granularity.class, (String) body.get("granularity"), Granularity.DAY);
    Aggregation aggregation = EnumUtils.getEnumIgnoreCase(Aggregation.class, (String) body.get("aggregation"), Aggregation.SUM);

    String interval;
    if (body.containsKey("interval")) {
      try {
        interval = (String) body.get("interval");
        Interval.parse(interval);
      } catch (Exception e) {
        throw new IllegalArgumentException("Invalid argument : 'interval'");
      }
    } else {
      DateTime now = DateTime.now();
      interval = now.minusDays(1).toString() + "/" + now.toString();
    }

    List<String> siDos = null;
    List<String> siGunGus = null;
    if (body.containsKey("siDo")) {
      siDos = (List<String>) body.get("siDo");
    }

    if (body.containsKey("siGunGu")) {
      siGunGus = (List<String>) body.get("siGunGu");
    }

    return ResponseEntity.ok(covidSearchService.queryCountOfConfirmedPatients(siDos, siGunGus, granularity, aggregation, interval));
  }

  /**
   * 특정 단위 (시간대, 주간) 별 데이터를 비교하여 가져옵니다.
   *
   * @param body
   * @return
   */
  @PostMapping(path = "/search/timeextract/patients")
  public ResponseEntity<?> searchTimeExtractOfPatients(@RequestBody Map<String, Object> body) {

    ExtractUnit extractUnit = EnumUtils
            .getEnumIgnoreCase(ExtractUnit.class, (String) body.get("extractUnit"), ExtractUnit.DAY);
    Aggregation aggregation = EnumUtils
            .getEnumIgnoreCase(Aggregation.class, (String) body.get("aggregation"), Aggregation.SUM);

    List<String> ranges = (List<String>) body.get("ranges");
    List<String> labels = (List<String>) body.get("labels");

    List<String> siDos = null;
    List<String> siGunGus = null;
    if (body.containsKey("siDo")) {
      siDos = (List<String>) body.get("siDo");
    }

    if (body.containsKey("siGunGu")) {
      siGunGus = (List<String>) body.get("siGunGu");
    }

    return ResponseEntity
            .ok(covidSearchService.queryTimeExtractOfConfirmedPatients(siDos, siGunGus, extractUnit, aggregation, ranges, labels));
  }

  /**
   * 지역별 확진자 현황(어제/오늘) 가져옵니다.
   *
   * @param body
   * @return
   */
  @PostMapping(path = "/search/location/patients")
  public ResponseEntity<?> searchLocationOfPatients(@RequestBody Map<String, Object> body) {

    List<String> ranges = (List<String>) body.get("ranges");
    List<String> labels = (List<String>) body.get("labels");

    List<String> siDos = null;
    List<String> siGunGus = null;
    if (body.containsKey("siDo")) {
      siDos = (List<String>) body.get("siDo");
    }

    if (body.containsKey("siGunGu")) {
      siGunGus = (List<String>) body.get("siGunGu");
    }

    return ResponseEntity
            .ok(covidSearchService.queryLocationOfConfirmedPatients(siDos, siGunGus, ranges, labels));
  }

  /**
   * 지역별 확진자 현황(어제/오늘) 가져옵니다.
   *
   * @param body
   * @return
   */
  @PostMapping(path = "/search/location/patients/daily")
  public ResponseEntity<?> searchDailyPatientsByLocation(@RequestBody Map<String, Object> body) {

    String baseDateTime = (String) body.get("baseDateTime");
    if(StringUtils.isEmpty(baseDateTime)) {
      baseDateTime = DateTime.now().toString();
    }

    List<String> labels = (List<String>) body.getOrDefault("labels", Lists.newArrayList());
    List<String> siDos = (List<String>) body.getOrDefault("siDo", Lists.newArrayList());

    String baseGroup = (String) body.getOrDefault("baseGroup", "siDo");

    return ResponseEntity
            .ok(covidSearchService.queryTotalPatientsByLocationInMsg(baseDateTime, baseGroup, siDos, labels));
  }

  /**
   * 지역별 확진자 현황(어제/오늘) 가져옵니다.
   *
   * @param body
   * @return
   */
  @PostMapping(path = "/search/location/patients/total")
  public ResponseEntity<?> searchTotalPatientsByLocation(@RequestBody Map<String, Object> body) {

    String baseDateTime = (String) body.get("baseDateTime");
    if(StringUtils.isEmpty(baseDateTime)) {
      baseDateTime = DateTime.now().toString();
    }

    // 기준시간 10시 전후 데이터에 대한 보정
    DateTime dateTimeObj = DateTime.parse(baseDateTime);
    /*if(dateTimeObj.getHourOfDay() < 10
            || (dateTimeObj.getHourOfDay() == 10 && dateTimeObj.getMinuteOfHour() <= 10)) {
      dateTimeObj = dateTimeObj.minusHours(11);
      LOG.debug("Changed base Time : {} -> {}", baseDateTime, dateTimeObj.toString());
    }*/

    List<String> labels = (List<String>) body.getOrDefault("labels", Lists.newArrayList());
    List<String> siDos = (List<String>) body.getOrDefault("siDo", Lists.newArrayList());


    List<Map<String, Object>> result = (List<Map<String, Object>>) covidSearchService.queryTotalPatientsByLocationInStat(dateTimeObj.toString(), siDos, labels);

    return ResponseEntity.ok(result);
  }

  @PostMapping(path = "/search/socialcontact")
  public ResponseEntity<?> searchSocialContact(@RequestBody Map<String, Object> body) {
    String baseDateTime = (String) body.get("baseDateTime");
    if(StringUtils.isEmpty(baseDateTime)) {
      baseDateTime = DateTime.now().toString();
    }

    String siGunGu = (String) body.get("siGunGu");
    String ldongCd = (String) body.get("ldongCd");
    if (!StringUtils.isEmpty(ldongCd)) {
      return ResponseEntity.ok(covidSearchService.querySocialContactByDong(baseDateTime, ldongCd));
    } else if (!StringUtils.isEmpty(siGunGu)) {
      return ResponseEntity.ok(covidSearchService.querySocialContactBySiGunGu(baseDateTime, siGunGu));
    } else  {
      return ResponseEntity.ok(covidSearchService.querySocialContact(baseDateTime));
    }
  }

  @PostMapping(path = "/search/covidblue")
  public ResponseEntity<?> searchCovidBlue(@RequestBody Map<String, Object> body) {
    String baseDateTime = (String) body.get("baseDateTime");
    if(StringUtils.isEmpty(baseDateTime)) {
      baseDateTime = DateTime.now().toString();
    }

    String siGunGu = (String) body.get("siGunGu");
    if(StringUtils.isEmpty(siGunGu)) {
      return ResponseEntity.ok(covidSearchService.queryCovidBlue(baseDateTime));
    } else {
      return ResponseEntity.ok(covidSearchService.queryCovidBlueBySiGunGu(baseDateTime, siGunGu));
    }
  }

  @PostMapping(path = "/search/trend/socialcontact")
  public ResponseEntity<?> searchTrendOfSocialContact(@RequestBody Map<String, Object> body) {
    String ldongCd = (String) body.get("ldongCd");

    String interval;
    if (body.containsKey("interval")) {
      try {
        interval = (String) body.get("interval");
        Interval.parse(interval);
      } catch (Exception e) {
        throw new IllegalArgumentException("Invalid argument : 'interval'");
      }
    } else {
      DateTime now = DateTime.now();
      interval = now.minusWeeks(3).toString() + "/" + now.toString();
    }

    return ResponseEntity.ok(covidSearchService.queryTrendSocialContactByDong(interval, ldongCd));
  }

  @PostMapping(path = "/search/trend/covidstat")
  public ResponseEntity<?> searchTrendOfCovidStat(@RequestBody Map<String, Object> body) {

    String interval;
    if (body.containsKey("interval")) {
      try {
        interval = (String) body.get("interval");
        Interval.parse(interval);
      } catch (Exception e) {
        throw new IllegalArgumentException("Invalid argument : 'interval'");
      }
    } else {
      DateTime now = DateTime.now();
      interval = now.minusWeeks(1).toString() + "/" + now.toString();
    }

    String siDo = (String) body.get("siDo");
    if (siDo == null) {
      siDo = "합계";
    }

    return ResponseEntity.ok(covidSearchService.queryCovidStatTrend(siDo, interval));
  }

}
