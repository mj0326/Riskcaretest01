package app.metatron.extensions.covid.config;

import com.google.common.collect.Lists;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.FormHttpMessageConverter;
import org.springframework.security.authentication.AuthenticationManagerResolver;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.endpoint.DefaultAuthorizationCodeTokenResponseClient;
import org.springframework.security.oauth2.client.endpoint.OAuth2AccessTokenResponseClient;
import org.springframework.security.oauth2.client.endpoint.OAuth2AuthorizationCodeGrantRequest;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.oauth2.core.http.converter.OAuth2AccessTokenResponseHttpMessageConverter;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequest;

import app.metatron.extensions.covid.common.oauth2.*;

/**
 *
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  @Autowired
  private OAuth2AuthorizedClientService oAuth2AuthorizedClientService;

  @Autowired
  private ClientRegistrationRepository authorizedClientRepository;

  @Autowired
  private CustomAuthorizationCodeRequestEntityConverter authorizationCodeRequestEntityConverter;

  @Autowired
  private CustomLogoutSuccessHandler logoutSuccessHandler;

  @Autowired
  private OauthProperties oauthProperties;

  @Autowired
  private CustomAuthenticationManager authenticationManager;

  @Value("${covid.oauth2.defaultTargetUrl:/app/}")
  private String defaultTargetUrl;

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.cors().and()
        .csrf().disable()
        .headers()
        .frameOptions().disable()
        .and()
        .authenticationProvider(
            new CustomAuthenticationProvider(oAuth2UserService(), authorizedClientRepository))
        .oauth2ResourceServer()
        .authenticationManagerResolver(authenticationManagerResolver())
        .authenticationEntryPoint(new CustomAuthenticationEntryPoint())
        .bearerTokenResolver(new CustomBearerTokenResolver())
        .and()
        .sessionManagement()
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        //.and()
        //.requestCache().requestCache(new HttpCookieRequestCache())
        .and()
        .requestMatchers()
        .antMatchers("/", "/oauth2/**", "/login/**", "/login", "/logout",
                     "/api/**")
        .and()
        .logout()
        .clearAuthentication(true)
        .invalidateHttpSession(true)
        .logoutSuccessUrl("/")
        .addLogoutHandler(new CustomLogoutHandler())
        .logoutSuccessHandler(logoutSuccessHandler)
        .and()
        .oauth2Login()
        .authorizationEndpoint()
        .authorizationRequestRepository(authorizationRequestRepository())
        .and()
        .tokenEndpoint()
        .accessTokenResponseClient(accessTokenResponseClient())
        .and()
        .userInfoEndpoint().userService(oAuth2UserService())
        .and()
        .successHandler(authenticationSuccessHandler())
        .failureHandler(new CustomAuthenticationFailureHandler());


    for (OauthProperties.Matcher matcher : oauthProperties.getPermitAll()) {
      http.authorizeRequests().antMatchers(matcher.getMethod(), matcher.getApi()).permitAll();
    }

//    http.authorizeRequests()
//        .antMatchers("/oauth2/**", "/login/**", "/login", "/logout", "/api/oauth/token").permitAll();

//    http.authorizeRequests()
//            .antMatchers("/", "/api/**")
//            .authenticated();

    http.authorizeRequests()
        .antMatchers("/", "/api/**", "/oauth2/**", "/login/**", "/login", "/logout", "/api/oauth/token")
        .permitAll();
  }

  @Bean
  public AuthorizationRequestRepository<OAuth2AuthorizationRequest> authorizationRequestRepository() {
    return new HttpCookieOAuth2AuthorizationRequestRepository();
  }

  @Bean
  public OAuth2AccessTokenResponseClient<OAuth2AuthorizationCodeGrantRequest> accessTokenResponseClient() {
    RestTemplate restTemplate = new RestTemplate();
    restTemplate.setErrorHandler(new Oauth2ResponseErrorHandler());

    DefaultAuthorizationCodeTokenResponseClient accessTokenResponseClient = new DefaultAuthorizationCodeTokenResponseClient();
    accessTokenResponseClient.setRequestEntityConverter(authorizationCodeRequestEntityConverter);

    OAuth2AccessTokenResponseHttpMessageConverter tokenResponseHttpMessageConverter = new OAuth2AccessTokenResponseHttpMessageConverter();
    tokenResponseHttpMessageConverter.setTokenResponseConverter(new CustomTokenResponseConverter());
    restTemplate.setMessageConverters(Lists.newArrayList(new FormHttpMessageConverter(), tokenResponseHttpMessageConverter));
    accessTokenResponseClient.setRestOperations(restTemplate);
    return accessTokenResponseClient;
  }

  @Bean
  public AuthenticationManagerResolver<HttpServletRequest> authenticationManagerResolver() {
    return request -> authenticationManager;
  }

  @Bean
  public OAuth2UserService<OAuth2UserRequest, OAuth2User> oAuth2UserService() {
    return new CustomUserService();
  }

  private CustomAuthenticationSuccessHandler authenticationSuccessHandler() {
    CustomAuthenticationSuccessHandler loginSuccessHandler = new CustomAuthenticationSuccessHandler(oAuth2AuthorizedClientService);
    loginSuccessHandler.setDefaultTargetUrl(defaultTargetUrl);
    return loginSuccessHandler;
  }

}
