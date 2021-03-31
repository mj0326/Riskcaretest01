package app.metatron.extensions.covid.common.oauth2;

import com.google.common.collect.ImmutableSet;
import com.google.common.collect.Sets;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;

public class CustomAuthenticationProvider implements AuthenticationProvider {

  private ClientRegistrationRepository clientRegistrationRepository;

  private OAuth2UserService oAuth2UserService;

  public CustomAuthenticationProvider(OAuth2UserService oAuth2UserService,
      ClientRegistrationRepository clientRegistrationRepository) {
    this.oAuth2UserService = oAuth2UserService;
    this.clientRegistrationRepository = clientRegistrationRepository;
  }

  @Override
  public Authentication authenticate(Authentication authentication)
      throws AuthenticationException {
    PreAuthenticatedAuthenticationToken authenticationToken = (PreAuthenticatedAuthenticationToken) authentication;
    ClientRegistration clientRegistration = clientRegistrationRepository.findByRegistrationId(Oauth2Constants.OAUTH_REGISTRATION_ID);

    OAuth2AccessToken oAuth2AccessToken =
        new OAuth2AccessToken(OAuth2AccessToken.TokenType.BEARER, authenticationToken.getPrincipal().toString(), null, null,
                              clientRegistration != null ? clientRegistration.getScopes() : Sets.newLinkedHashSet(ImmutableSet.of("read", "write")));
    OAuth2User oAuth2User = oAuth2UserService.loadUser(new OAuth2UserRequest(clientRegistration, oAuth2AccessToken, null));
    OAuth2AuthenticationToken oAuth2AuthenticationToken = new OAuth2AuthenticationToken(
        oAuth2User, oAuth2User.getAuthorities(), Oauth2Constants.OAUTH_REGISTRATION_ID);
    return oAuth2AuthenticationToken;
  }

  @Override
  public boolean supports(Class<?> authentication) {
    return authentication.equals(PreAuthenticatedAuthenticationToken.class);
  }

}
