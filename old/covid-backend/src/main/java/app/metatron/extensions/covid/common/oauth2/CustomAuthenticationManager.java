package app.metatron.extensions.covid.common.oauth2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.server.resource.BearerTokenAuthenticationToken;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

import app.metatron.extensions.covid.common.GlobalObjectMapper;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class CustomAuthenticationManager implements AuthenticationManager {

  @Autowired
  HttpServletRequest httpServletRequest;

  @Override
  public Authentication authenticate(Authentication authentication)
      throws AuthenticationException {
    LOG.trace(GlobalObjectMapper.writeValueAsString(authentication));
    if (authentication instanceof BearerTokenAuthenticationToken) {
      BearerTokenAuthenticationToken bearerTokenAuthenticationToken = (BearerTokenAuthenticationToken) authentication ;
      return new PreAuthenticatedAuthenticationToken(bearerTokenAuthenticationToken.getToken(), null);
    }
    return null;
  }

}
