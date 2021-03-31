package app.metatron.extensions.covid.domain.event;

import app.metatron.extensions.covid.AbstractRestIntegrationTest;
import app.metatron.extensions.covid.CovidStatusApplication;
import com.google.common.collect.Maps;
import io.restassured.http.ContentType;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.apache.http.HttpStatus;
import org.assertj.core.util.Lists;
import org.joda.time.DateTime;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Map;

import static io.restassured.RestAssured.given;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = CovidStatusApplication.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ActiveProfiles({"local","h2-in-memory-db","logging-console-debug", "initial"})
public class EventApiTest extends AbstractRestIntegrationTest {

  @Test
  public void create_update_and_get_delete_event() {

    DateTime now = DateTime.now();

    Map<String, Object> creates = Maps.newLinkedHashMap();
    creates.put("summary", "created event");
    creates.put("description", "created description");
    creates.put("location", "created location");
    creates.put("locationCode", "1111000011");
    creates.put("startTime", now.minusHours(1).toString());
    creates.put("endTime", now.plusHours(1).toString());

    // @formatter:off
    Response res =
    given()
      .auth().oauth2(oauth_token)
      .contentType(ContentType.JSON)
      .body(creates)
      .log().all()
    .when()
      .post("/api/events");
    res
    .then()
      .log().all()
      .statusCode(HttpStatus.SC_OK);
    // @formatter:on

    String eventId = JsonPath.from(res.asString()).get("id");

    Map<String, Object> updates = Maps.newLinkedHashMap();
    updates.put("summary", "updated event!!");
    updates.put("description", "updated description!!");
    updates.put("startTime", now.plusHours(1).toString());
    updates.put("endTime", now.plusHours(3).toString());

    // @formatter:off
    given()
      .auth().oauth2(oauth_token)
      .contentType(ContentType.JSON)
      .body(updates)
      .log().all()
    .when()
      .patch("/api/events/{id}", eventId)
    .then()
      .log().all()
      .statusCode(HttpStatus.SC_OK);
    // @formatter:on

    // @formatter:off
    given()
      .auth().oauth2(oauth_token)
      .contentType(ContentType.JSON)
    .when()
      .delete("/api/events/{id}", eventId)
    .then()
      .log().all()
      .statusCode(HttpStatus.SC_NO_CONTENT);
    // @formatter:on

  }

  @Test
  public void search_event() {

    DateTime now = DateTime.now();

    Map<String, Object> creates1 = Maps.newLinkedHashMap();
    creates1.put("summary", "created event 1");
    creates1.put("description", "created description");
    creates1.put("location", "created location");
    creates1.put("locationCode", "1111000011");
    creates1.put("startTime", now.minusHours(1).toString());
    creates1.put("endTime", now.plusHours(1).toString());

    Map<String, Object> creates2 = Maps.newLinkedHashMap();
    creates2.put("summary", "created event 2");
    creates2.put("description", "created description");
    creates2.put("location", "created location");
    creates2.put("locationCode", "1111000011");
    creates2.put("startTime", now.minusHours(6).toString());
    creates2.put("endTime", now.minusHours(4).toString());

    List<Map<String,Object>> testEvents = Lists.newArrayList(creates1, creates2);

    for (Map<String, Object> testEvent : testEvents) {
      // @formatter:off
      given()
        .auth().oauth2(oauth_token)
        .contentType(ContentType.JSON)
        .body(testEvent)
        .log().all()
      .when()
        .post("/api/events")
      .then()
        .log().all()
        .statusCode(HttpStatus.SC_OK);
      // @formatter:on
    }

    // @formatter:off
    given()
      .auth().oauth2(oauth_token)
      .contentType(ContentType.JSON)
      .queryParam("startTime", now.minusHours(5).toString())
      .queryParam("endTime", now.toString())
      .log().all()
    .when()
      .get("/api/events/search")
    .then()
      .log().all()
      .statusCode(HttpStatus.SC_OK);
    // @formatter:on
  }

}
