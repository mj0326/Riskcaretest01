package app.metatron.extensions.covid.common.oauth2;

public class Oauth2Constants {

  final public static String APP_NAME = "RISK_CARE";
  final public static String X_FORWARDED_FOR = "X-Forwarded-For";
  final public static String AJAX_HEADER_KEY = "x-requested-with";
  final public static String AJAX_HEADER_VALUE = "XMLHttpRequest";
  final public static String OAUTH_REGISTRATION_ID = "metatron";
  final public static String ACCESS_TOKEN_EXPIRED = "Access token expired";
  final public static String REFRESH_TOKEN_EXPIRED = "Invalid refresh token (expired)";
  final public static String USER_IP_IS_NOT_IN_WHITELIST = "User ip is not in whitelist.";
  final public static String UNKNOWN_USERNAME = "unknown";

  final public static String LOGIN_URL = "/oauth2/authorization/metatron";
  final public static String DISCOVERY_LOGOUT_URL = "/api/oauth/client/logout";

}