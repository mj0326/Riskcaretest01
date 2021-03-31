package app.metatron.extensions.covid.common.oauth2;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import app.metatron.extensions.covid.util.CookieManager;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CustomAuthenticationSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

  private OAuth2AuthorizedClientService oAuth2AuthorizedClientService;

  public CustomAuthenticationSuccessHandler(OAuth2AuthorizedClientService oAuth2AuthorizedClientService) {
    this.oAuth2AuthorizedClientService = oAuth2AuthorizedClientService;
  }

  @Override
  public void onAuthenticationSuccess(HttpServletRequest request,
                                      HttpServletResponse response,
                                      Authentication authentication) throws IOException, ServletException {
    OAuth2AuthenticationToken oauthToken =
        (OAuth2AuthenticationToken) authentication;
    OAuth2AuthorizedClient client =
        oAuth2AuthorizedClientService.loadAuthorizedClient(
            oauthToken.getAuthorizedClientRegistrationId(),
            oauthToken.getName());
    LOG.debug("accessToken  : {}", client.getAccessToken().getTokenValue());
    LOG.debug("refreshToken : {}", client.getRefreshToken().getTokenValue());
    CookieManager.addCookie(CookieManager.ACCESS_TOKEN, client.getAccessToken().getTokenValue(), response);
    CookieManager.addCookie(CookieManager.REFRESH_TOKEN, client.getRefreshToken().getTokenValue(), response);
    CookieManager.addCookie(CookieManager.TOKEN_TYPE, client.getAccessToken().getTokenType().getValue(), response);

    super.onAuthenticationSuccess(request, response, authentication);
  }

}
