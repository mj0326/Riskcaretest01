package app.metatron.extensions.covid.util;

import javax.servlet.http.HttpServletRequest;

public class HttpUtils {

  public static String getClientIp(HttpServletRequest request) {
    String clientIp = request.getHeader("X-Forwarded-For");
    if (clientIp == null || clientIp.length() == 0 || "unknown".equalsIgnoreCase(clientIp)) {
      clientIp = request.getHeader("Proxy-Client-IP");
    }
    if (clientIp == null || clientIp.length() == 0 || "unknown".equalsIgnoreCase(clientIp)) {
      clientIp = request.getHeader("WL-Proxy-Client-IP");
    }
    if (clientIp == null || clientIp.length() == 0 || "unknown".equalsIgnoreCase(clientIp)) {
      clientIp = request.getHeader("HTTP_CLIENT_IP");
    }
    if (clientIp == null || clientIp.length() == 0 || "unknown".equalsIgnoreCase(clientIp)) {
      clientIp = request.getHeader("HTTP_X_FORWARDED_FOR");
    }
    if (clientIp == null || clientIp.length() == 0 || "unknown".equalsIgnoreCase(clientIp)) {
      clientIp = request.getRemoteAddr();
    }

    return clientIp;
  }

}
