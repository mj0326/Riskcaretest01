package app.metatron.extensions.covid;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.common.ConsoleNotifier;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.springframework.boot.web.server.LocalServerPort;

import io.restassured.RestAssured;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.urlPathEqualTo;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.options;

/**
 * Base class to implement transactiona integration tests using the root application configuration.
 *
 * @author Oliver Gierke
 */
public abstract class AbstractRestIntegrationTest {

  protected String oauth_token = "TEST_TOKEN";

  @LocalServerPort
  private int port;

  private WireMockServer wireMockServer;

  @BeforeAll
  public void setUp() {
    RestAssured.port = port;

    wireMockServer = new WireMockServer(options().port(8180).notifier(new ConsoleNotifier(true)));
    wireMockServer.stubFor(get(urlPathEqualTo("/api/oauth/user/info"))
                               .willReturn(aResponse()
                                               .withStatus(200)
                                               .withHeader("Content-Type", "application/json")
                                               .withBody("{\"username\":\"admin\"}")));
    wireMockServer.start();
  }

  @AfterAll
  public void close() {
    wireMockServer.stop();
  }

}
