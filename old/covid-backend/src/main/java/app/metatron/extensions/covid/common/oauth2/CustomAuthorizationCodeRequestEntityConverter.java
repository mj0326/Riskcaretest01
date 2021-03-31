package app.metatron.extensions.covid.common.oauth2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.RequestEntity;
import org.springframework.security.oauth2.client.endpoint.OAuth2AuthorizationCodeGrantRequest;
import org.springframework.security.oauth2.client.endpoint.OAuth2AuthorizationCodeGrantRequestEntityConverter;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;

import javax.servlet.http.HttpServletRequest;

import app.metatron.extensions.covid.util.HttpUtils;

@Component
public class CustomAuthorizationCodeRequestEntityConverter implements Converter<OAuth2AuthorizationCodeGrantRequest, RequestEntity<?>> {

  private OAuth2AuthorizationCodeGrantRequestEntityConverter defaultConverter =
      new OAuth2AuthorizationCodeGrantRequestEntityConverter();

  @Autowired
  HttpServletRequest httpServletRequest;

  @Override
  public RequestEntity<?> convert(OAuth2AuthorizationCodeGrantRequest req) {
    RequestEntity<?> entity = defaultConverter.convert(req);
    HttpHeaders httpHeaders = HttpHeaders.writableHttpHeaders(entity.getHeaders());
    httpHeaders.add(Oauth2Constants.X_FORWARDED_FOR, HttpUtils.getClientIp(httpServletRequest));
    MultiValueMap<String, String> params = (MultiValueMap<String,String>) entity.getBody();
    return new RequestEntity<>(params, httpHeaders, entity.getMethod(), entity.getUrl());
  }

}