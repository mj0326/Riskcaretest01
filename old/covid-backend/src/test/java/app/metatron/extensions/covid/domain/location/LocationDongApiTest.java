package app.metatron.extensions.covid.domain.location;

import app.metatron.extensions.covid.AbstractRestIntegrationTest;
import app.metatron.extensions.covid.CovidStatusApplication;
import io.restassured.http.ContentType;
import org.apache.http.HttpStatus;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import static io.restassured.RestAssured.given;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = CovidStatusApplication.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ActiveProfiles({"local","h2-in-memory-db","logging-console-debug", "initial"})
public class LocationDongApiTest extends AbstractRestIntegrationTest {

  @Test
  @Sql("/scripts/test_search_dong.sql")
  public void search_dong_by_name() {

    String queryName = "송파";

    // @formatter:off
    given()
      .auth().oauth2(oauth_token)
      .contentType(ContentType.JSON)
      .queryParam("name", queryName)
      .queryParam("baseDateTime", "2020-12-12T10:00:00.000+09:00")
      .queryParam("includeIndex", true)
      .queryParam("page", 0)
      .queryParam("size", 5)
    .when()
        .get("/api/locations/dong/search")
    .then()
        .log().all()
        .statusCode(HttpStatus.SC_OK);
    // @formatter:on

  }
}
