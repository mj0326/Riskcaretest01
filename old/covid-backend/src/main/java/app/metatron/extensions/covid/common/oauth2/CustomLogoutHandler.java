package app.metatron.extensions.covid.common.oauth2;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import app.metatron.extensions.covid.util.CookieManager;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CustomLogoutHandler implements LogoutHandler {

	@Override
	public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
		try {
			Cookie cookie = CookieManager.getAccessToken(request);
			if (cookie != null) {
				LOG.debug("LogoutHandler : {}", cookie.getValue());
				request.setAttribute(CookieManager.ACCESS_TOKEN, cookie.getValue());
			}
			CookieManager.removeAllToken(response);
		} catch (Exception e) {
			LOG.error(e.getMessage());
		}
	}

}
