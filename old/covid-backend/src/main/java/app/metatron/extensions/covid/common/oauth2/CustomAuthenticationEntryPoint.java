package app.metatron.extensions.covid.common.oauth2;

import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import app.metatron.extensions.covid.common.GlobalObjectMapper;
import app.metatron.extensions.covid.common.exceptions.ErrorResponse;
import app.metatron.extensions.covid.common.exceptions.GlobalErrorCodes;
import app.metatron.extensions.covid.util.AuthUtils;
import app.metatron.extensions.covid.util.CookieManager;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

  @Override
  public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authEx) throws IOException {
    String message = String.format("User(%s) attempted to access the protected URI: %s", AuthUtils.getAuthUserName(), request.getRequestURI());
    LOG.warn(message);
    LOG.error(String.format("Exception(%s): %s", authEx.getClass(), authEx.getMessage()));

    if (Oauth2Constants.AJAX_HEADER_VALUE.equals(request.getHeader(Oauth2Constants.AJAX_HEADER_KEY))) {
      ErrorResponse errorResponse = new ErrorResponse(GlobalErrorCodes.AUTH_ERROR_CODE,
                                                      authEx.getMessage(),
                                                      message);
      response.setCharacterEncoding("UTF-8");
      response.setContentType(MediaType.APPLICATION_JSON_VALUE);
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.getWriter().print(GlobalObjectMapper.writeValueAsString(errorResponse));
    } else {
      CookieManager.removeAllToken(response);

      response.setContentType(MediaType.TEXT_HTML_VALUE);
      response.sendRedirect(Oauth2Constants.LOGIN_URL);
    }

  }

}
