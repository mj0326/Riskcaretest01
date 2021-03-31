package app.metatron.extensions.covid.domain.location;

import app.metatron.extensions.covid.AbstractRestIntegrationTest;
import app.metatron.extensions.covid.CovidStatusApplication;
import com.google.common.collect.Maps;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.apache.http.HttpStatus;
import org.assertj.core.util.Lists;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.util.Map;

import static io.restassured.RestAssured.given;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = CovidStatusApplication.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ActiveProfiles({"local","h2-in-memory-db","logging-console-debug", "initial"})
public class FavoriteLocationApiTest extends AbstractRestIntegrationTest {

  @Test
  public void create_and_get_my_favorite_locations() {

    FavoriteLocation favoriteLocation = FavoriteLocation.builder()
                                                         .locationName("테스트 장소")
                                                         .locationCode("1111000011")
                                                         .seq(1).build();

    // @formatter:off
    Response res =
    given()
      .auth().oauth2(oauth_token)
      .contentType(ContentType.JSON)
      .body(favoriteLocation)
    .when()
        .post("/api/favorlocations");
    res
    .then()
        .log().all()
        .statusCode(HttpStatus.SC_OK);
    // @formatter:on

    // @formatter:off
    given()
      .auth().oauth2(oauth_token)
      .contentType(ContentType.JSON)
    .when()
      .get("/api/favorlocations/my")
    .then()
      .log().all()
      .statusCode(HttpStatus.SC_OK);
    // @formatter:on

  }

  @Test
  @Sql("/scripts/test_favorite_location.sql")
  public void patch_and_get_my_favorite_locations() {

    Map<String, Object> addPatch = Maps.newLinkedHashMap();
    addPatch.put("op", "add");
    addPatch.put("locationName", "테스트 장소");
    addPatch.put("locationCode", "1111000011");
    addPatch.put("seq", 1);


    Map<String, Object> updatePatch = Maps.newLinkedHashMap();
    updatePatch.put("op", "replace");
    updatePatch.put("id", 1000L);
    updatePatch.put("locationName", "테스트 장소 UPDATE");
    updatePatch.put("seq", 2);

    Map<String, Object> removePatch = Maps.newLinkedHashMap();
    removePatch.put("op", "remove");
    removePatch.put("id", 2000L);


    // @formatter:off
    Response res =
    given()
      .auth().oauth2(oauth_token)
      .contentType(ContentType.JSON)
      .body(Lists.newArrayList(addPatch, updatePatch, removePatch))
      .log().all()
    .when()
      .patch("/api/favorlocations");
    res
    .then()
      .log().all()
      .statusCode(HttpStatus.SC_OK);
    // @formatter:on

  }

}
