package app.metatron.extensions.covid.domain.oauth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import app.metatron.extensions.covid.common.exceptions.ErrorResponse;
import app.metatron.extensions.covid.common.exceptions.GlobalErrorCodes;
import app.metatron.extensions.covid.common.oauth2.DiscoveryApiClient;
import app.metatron.extensions.covid.common.oauth2.Oauth2Constants;
import app.metatron.extensions.covid.util.CookieManager;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping(path = "/api")
public class OauthController {

  private DiscoveryApiClient discoveryApiClient;

  public OauthController(DiscoveryApiClient discoveryApiClient) {
    this.discoveryApiClient = discoveryApiClient;
  }

  @PostMapping("/oauth/token")
  public ResponseEntity<?> token(@RequestParam(value = "type") String type, HttpServletRequest request) {
    if ("refresh_token".equals(type)) {
      String refreshToken = request.getParameter(OAuth2ParameterNames.REFRESH_TOKEN);
      Cookie cooKie = CookieManager.getRefreshToken(request);
      if (refreshToken == null && cooKie != null) {
        refreshToken = cooKie.getValue();
      }
      if (refreshToken != null) {
        try {
          Map refreshTokenResult = discoveryApiClient.refreshToken("refresh_token", refreshToken);
          LOG.info("RefreshTokenResult : {}", refreshTokenResult);
          return ResponseEntity.ok(refreshTokenResult);
        } catch (Exception e) {
          ErrorResponse errorResponse;
          if (e.getMessage().indexOf(Oauth2Constants.REFRESH_TOKEN_EXPIRED) > -1) {
            String message = "RefreshToken is expired: " + refreshToken;
            LOG.error(message);
            errorResponse = new ErrorResponse(GlobalErrorCodes.AUTH_ERROR_CODE,
                                              e.getMessage(),
                                              message);
          } else {
            errorResponse = ErrorResponse.unknownError(e);
          }
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
      }
      return ResponseEntity.badRequest().body("RefreshToken is null");
    }
    return ResponseEntity.badRequest().build();

  }

}
