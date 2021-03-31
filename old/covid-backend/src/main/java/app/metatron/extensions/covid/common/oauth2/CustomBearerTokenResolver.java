package app.metatron.extensions.covid.common.oauth2;

import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import app.metatron.extensions.covid.util.CookieManager;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CustomBearerTokenResolver implements BearerTokenResolver {

  private DefaultBearerTokenResolver defaultBearerTokenResolver = new DefaultBearerTokenResolver();

  public String resolve(HttpServletRequest request) {
    Cookie accessToken = CookieManager.getAccessToken(request);
    if (accessToken != null) {
      LOG.trace("Bearer token is from cookie, URI({})", request.getRequestURI());
      return accessToken.getValue();
    }

    return defaultBearerTokenResolver.resolve(request);
  }
}
