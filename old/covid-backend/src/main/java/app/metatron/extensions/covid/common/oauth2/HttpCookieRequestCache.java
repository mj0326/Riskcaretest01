package app.metatron.extensions.covid.common.oauth2;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.web.savedrequest.CookieRequestCache;
import org.springframework.security.web.savedrequest.DefaultSavedRequest;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.security.web.util.UrlUtils;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Base64;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import app.metatron.extensions.covid.util.CookieManager;

public class HttpCookieRequestCache extends CookieRequestCache {

  private RequestMatcher requestMatcher = new OrRequestMatcher(
      new AntPathRequestMatcher("/")
  );

  private static final String COOKIE_NAME = Oauth2Constants.APP_NAME + ".REDIRECT_URI";

  @Override
  public void saveRequest(HttpServletRequest request, HttpServletResponse response) {
    if (isRequiredSavedRequest(request)) {
      String redirectUrl = request.getHeader(HttpHeaders.REFERER);
      if (redirectUrl == null) {
        redirectUrl = UrlUtils.buildFullRequestUrl(request);
      }

      CookieManager.addCookie(COOKIE_NAME, encodeCookie(redirectUrl), CookieManager.MAX_AGE, true, response);
    } else {
      logger.debug("Request not saved as configured RequestMatcher did not match");
    }
  }

  @Override
  public SavedRequest getRequest(HttpServletRequest currentRequest, HttpServletResponse response) {
    Cookie savedRequestCookie = CookieManager.getCookie(COOKIE_NAME, currentRequest);
    if (savedRequestCookie != null) {
      String originalURI = decodeCookie(savedRequestCookie.getValue());
      UriComponents uriComponents = UriComponentsBuilder.fromUriString(originalURI).build();
      DefaultSavedRequest.Builder builder = new DefaultSavedRequest.Builder();

      int port = uriComponents.getPort();
      if (port == -1) {
        if ("https".equalsIgnoreCase(uriComponents.getScheme())) {
          port = 443;
        } else {
          port = 80;
        }
      }
      return builder.setScheme(uriComponents.getScheme())
                    .setServerName(uriComponents.getHost())
                    .setRequestURI(uriComponents.getPath())
                    .setQueryString(uriComponents.getQuery())
                    .setServerPort(port)
                    .setMethod(HttpMethod.GET.name())
                    .build();
    }
    return null;
  }

  @Override
  public void removeRequest(HttpServletRequest currentRequest, HttpServletResponse response) {
    CookieManager.removeCookie(COOKIE_NAME, response);
  }

  private static String encodeCookie(String cookieValue) {
    return Base64.getEncoder().encodeToString(cookieValue.getBytes());
  }

  private static String decodeCookie(String encodedCookieValue) {
    return new String(Base64.getDecoder().decode(encodedCookieValue.getBytes()));
  }

  private boolean isRequiredSavedRequest(HttpServletRequest request){
    if (!requestMatcher.matches(request)) {
      String referer = request.getHeader(HttpHeaders.REFERER);
      try {
        URL url = new URL(referer);
        if ("/".equals(url.getPath())) {
          return false;
        }
      } catch (MalformedURLException e) {
        logger.warn("referer is not valid");
      }
      return true;
    }
    return false;

  }

}
