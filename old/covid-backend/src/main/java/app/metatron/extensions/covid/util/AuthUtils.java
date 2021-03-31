package app.metatron.extensions.covid.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import app.metatron.extensions.covid.common.oauth2.Oauth2Constants;

public class AuthUtils {

  public static Authentication getAuthentication() {
    return SecurityContextHolder.getContext().getAuthentication();
  }

  public static String getAuthUserName() {
    Authentication auth = getAuthentication();
    if (auth == null) {
      return Oauth2Constants.UNKNOWN_USERNAME;
    }

    return auth.getName();
  }

}
