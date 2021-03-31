package app.metatron.extensions.covid.common.oauth2;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import app.metatron.extensions.covid.util.CookieManager;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class CustomLogoutSuccessHandler implements LogoutSuccessHandler {

	@Autowired
	private ClientRegistrationRepository clientRegistrationRepository;

	@Value("${covid.discovery.host-url:http://localhost:8180}")
	private String discoveryUrl;

	@Value("${covid.common.host-url:}")
	private String baseUrl;

	@Override
	public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
		try {
			if (StringUtils.isBlank(baseUrl)) {
				baseUrl = request.getRequestURL().substring(0, request.getRequestURL().lastIndexOf("/"));
			}
			if (request.getAttribute(CookieManager.ACCESS_TOKEN) != null) {
				ClientRegistration clientRegistration = clientRegistrationRepository.findByRegistrationId(Oauth2Constants.OAUTH_REGISTRATION_ID);
				StringBuffer sb = new StringBuffer(discoveryUrl);
				sb.append(Oauth2Constants.DISCOVERY_LOGOUT_URL);
				sb.append("?client_id=");
				sb.append(clientRegistration.getClientId());
				sb.append("&redirect_uri=");
				sb.append(URLEncoder.encode(baseUrl + Oauth2Constants.LOGIN_URL, "UTF-8"));

				response.sendRedirect(sb.toString());
			} else {
				response.sendRedirect(baseUrl + Oauth2Constants.LOGIN_URL);
			}
		} catch (Exception e) {
			LOG.error(e.getMessage());
		}
	}

}
