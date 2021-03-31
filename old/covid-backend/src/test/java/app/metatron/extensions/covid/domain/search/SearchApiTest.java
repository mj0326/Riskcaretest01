package app.metatron.extensions.covid.domain.search;

import app.metatron.extensions.covid.AbstractRestIntegrationTest;
import app.metatron.extensions.covid.CovidStatusApplication;
import app.metatron.extensions.covid.domain.storage.DruidSqlRequest;
import com.google.common.collect.Maps;

import io.restassured.http.ContentType;
import org.apache.http.HttpStatus;
import org.assertj.core.util.Lists;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Map;

import static io.restassured.RestAssured.given;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = CovidStatusApplication.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class SearchApiTest extends AbstractRestIntegrationTest {

  @Test
  public void whenQuerySql_thenGettingRawResults() {

    DruidSqlRequest sqlRequest = new DruidSqlRequest("select 1");

    // @formatter:off
        given()
            .auth().oauth2(oauth_token)
            .contentType(ContentType.JSON)
            .body(sqlRequest)
        .when()
            .post("/api/search/sql")
        .then()
            .log().all()
            .statusCode(HttpStatus.SC_OK);
        // @formatter:on

  }

  /**
   * Function Sample : 문자 현황 가져오기 (실시간 문자 알림 Polling 용도 포함)
   */
  @Test
  public void whenQueryListOfCovidStatus_thenGettingResults() {

    Map<String, Object> reqMap = Maps.newHashMap();
    reqMap.put("siDo", Lists.newArrayList("울산광역시"));
    //reqMap.put("siGunGu", Lists.newArrayList("용인시", "포천시"));
    reqMap.put("interval", "2020-10-20T00:00:00+09:00/2020-10-30T00:00:00+09:00");
    reqMap.put("limit", "10");

    // @formatter:off
        given()
            .auth().oauth2(oauth_token)
            .contentType(ContentType.JSON)
            .body(reqMap)
            .log().all()
        .when()
            .post("/api/search/covid/list")
        .then()
            .log().all()
            .statusCode(HttpStatus.SC_OK);
        // @formatter:on

  }

  /**
   * Function Sample : 일별 확진자 현황 차트 용
   */
  @Test
  public void whenQueryTrendOfPatients_thenGettingChartResultsByDayGranularity() {

    Map<String, Object> reqMap = Maps.newHashMap();
    //        reqMap.put("siDo", Lists.newArrayList("경기도"));
    //        reqMap.put("siGunGu", Lists.newArrayList("용인시", "포천시"));
    reqMap.put("granularity", "day");
    reqMap.put("aggregation", "sum");
    reqMap.put("interval", "2020-10-10T00:00:00+09:00/2020-10-20T00:00:00+09:00");

    // @formatter:off
        given()
            .auth().oauth2(oauth_token)
            .contentType(ContentType.JSON)
            .body(reqMap)
            .log().all()
        .when()
            .post("/api/search/trend/patients")
        .then()
            .log().all()
            .statusCode(HttpStatus.SC_OK);
        // @formatter:on

  }

  /**
   * Function Sample : 어제/오늘 시간대별 조회 차트 용
   */
  @Test
  public void whenQueryTimeExtractOfPatients_thenGettingChartResultsByExtractUnits() {

    Map<String, Object> reqMap = Maps.newHashMap();
    //        reqMap.put("siDo", Lists.newArrayList("경기도"));
    //        reqMap.put("siGunGu", Lists.newArrayList("용인시", "포천시"));
    reqMap.put("extractUnit", "hour");
    reqMap.put("aggregation", "sum");
    reqMap.put("ranges", Lists.newArrayList("2020-11-11T07:00:00+09:00/2020-11-11T15:00:00+09:00",
                                            "2020-11-12T07:00:00+09:00/2020-11-12T15:00:00+09:00"));
    reqMap.put("labels", Lists.newArrayList("yesterday", "today"));

    // @formatter:off
        given()
            .auth().oauth2(oauth_token)
            .contentType(ContentType.JSON)
            .body(reqMap)
            .log().all()
        .when()
            .post("/api/search/timeextract/patients")
        .then()
            .log().all()
            .statusCode(HttpStatus.SC_OK);
        // @formatter:on

  }

  /**
   * Function Sample : 일자 범위별 지역별 일별 확진자 수 조회
   */
  @Test
  public void whenQueryLocationOfPatients_thenGettingResultsByLocation() {

    Map<String, Object> reqMap = Maps.newHashMap();
    reqMap.put("ranges", Lists.newArrayList("2020-10-27T00:00:00+09:00/2020-10-28T00:00:00+09:00",
                                            "2020-10-28T00:00:00+09:00/2020-10-29T00:00:00+09:00"));
    reqMap.put("labels", Lists.newArrayList("yesterday", "today"));

    // @formatter:off
        given()
            .auth().oauth2(oauth_token)
            .contentType(ContentType.JSON)
            .body(reqMap)
        .when()
            .post("/api/search/location/patients/daily")
        .then()
            .log().all()
            .statusCode(HttpStatus.SC_OK);
        // @formatter:on

  }


  /**
   * Function Sample : 기준 시간 대비 어제/오늘 지역별 일별 확진자 수 조회
   */
  @Test
  public void whenQueryDailyPatients_thenGettingResultsByLocation() {

    Map<String, Object> reqMap = Maps.newHashMap();
    reqMap.put("baseDateTime", "2020-10-30T21:00:00+09:00");
    // reqMap.put("baseGroup", "siGunGu");
    reqMap.put("siDo", Lists.newArrayList("경기도"));
    //reqMap.put("labels", Lists.newArrayList("yesterday", "today"));

    // @formatter:off
        given()
            .auth().oauth2(oauth_token)
            .contentType(ContentType.JSON)
            .body(reqMap)
            .log().all()
        .when()
            .post("/api/search/location/patients/daily")
        .then()
            .log().all()
            .statusCode(HttpStatus.SC_OK);
        // @formatter:on

  }


  /**
   * Function Sample : 어제/오늘 총 지역별 누적 확진자 수 조회
   */
  @Test
  public void whenQueryTotalPatients_thenGettingResultsByLocation() {

    Map<String, Object> reqMap = Maps.newHashMap();
    reqMap.put("siDo", Lists.newArrayList("합계"));
    //reqMap.put("baseDateTime", "2020-10-30T21:00:00+09:00");
    reqMap.put("baseDateTime", "2020-12-01T15:10:00+09:00");
    //reqMap.put("labels", Lists.newArrayList("yesterday", "today"));

    // @formatter:off
        given()
            .auth().oauth2(oauth_token)
            .contentType(ContentType.JSON)
            .body(reqMap)
            .log().all()
        .when()
            .post("/api/search/location/patients/total")
        .then()
            .log().all()
            .statusCode(HttpStatus.SC_OK);
        // @formatter:on

  }

  @Test
  public void whenQuerySocialContact() {

    Map<String, Object> reqMap = Maps.newHashMap();
    reqMap.put("baseDateTime", "2021-01-01T21:00:00+09:00");
    reqMap.put("ldongCd", "1174010900");
    //reqMap.put("siGunGu", "강남구");

    // @formatter:off
    given()
        .auth().oauth2(oauth_token)
        .contentType(ContentType.JSON)
        .body(reqMap)
        .log().all()
    .when()
        .post("/api/search/socialcontact")
    .then()
        .log().all()
        .statusCode(HttpStatus.SC_OK);
    // @formatter:on

  }

  @Test
  public void whenQueryCovidblue() {

    Map<String, Object> reqMap = Maps.newHashMap();
    reqMap.put("baseDateTime", "2020-10-01T21:00:00+09:00");
    //reqMap.put("siGunGu", "강남구");

    // @formatter:off
    given()
        .auth().oauth2(oauth_token)
        .contentType(ContentType.JSON)
        .body(reqMap)
        .log().all()
    .when()
        .post("/api/search/covidblue")
    .then()
        .log().all()
        .statusCode(HttpStatus.SC_OK);
    // @formatter:on

  }

  @Test
  public void whenQueryTrendSocialContact() {

    Map<String, Object> reqMap = Maps.newHashMap();
    reqMap.put("interval", "2020-12-01T00:00:00+09:00/2020-12-21T23:00:00+09:00");
    reqMap.put("ldongCd", "1168010800");

    // @formatter:off
    given()
        .auth().oauth2(oauth_token)
        .contentType(ContentType.JSON)
        .body(reqMap)
        .log().all()
    .when()
        .post("/api/search/trend/socialcontact")
    .then()
        .log().all()
        .statusCode(HttpStatus.SC_OK);
    // @formatter:on

  }

  @Test
  public void whenQueryTrendCovidStat() {

    Map<String, Object> reqMap = Maps.newHashMap();
    reqMap.put("interval", "2020-11-21T00:00:00+09:00/2020-11-27T23:00:00+09:00");

    // @formatter:off
    given()
        .auth().oauth2(oauth_token)
        .contentType(ContentType.JSON)
        .body(reqMap)
        .log().all()
    .when()
        .post("/api/search/trend/covidstat")
    .then()
        .log().all()
        .statusCode(HttpStatus.SC_OK);
    // @formatter:on

  }

}
