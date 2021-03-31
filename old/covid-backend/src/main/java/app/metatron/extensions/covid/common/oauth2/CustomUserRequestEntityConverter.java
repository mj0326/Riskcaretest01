package app.metatron.extensions.covid.common.oauth2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.RequestEntity;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequestEntityConverter;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;

import javax.servlet.http.HttpServletRequest;

import app.metatron.extensions.covid.util.HttpUtils;

@Component
public class CustomUserRequestEntityConverter implements Converter<OAuth2UserRequest, RequestEntity<?>> {

  private OAuth2UserRequestEntityConverter defaultConverter =
      new OAuth2UserRequestEntityConverter();

  @Autowired
  HttpServletRequest httpServletRequest;

  @Override
  public RequestEntity<?> convert(OAuth2UserRequest oAuth2UserRequest) {
    RequestEntity<?> entity = defaultConverter.convert(oAuth2UserRequest);
    HttpHeaders httpHeaders = HttpHeaders.writableHttpHeaders(entity.getHeaders());
    httpHeaders.add(Oauth2Constants.X_FORWARDED_FOR, HttpUtils.getClientIp(httpServletRequest));
    MultiValueMap<String, String> params = (MultiValueMap<String,String>) entity.getBody();
    return new RequestEntity<>(params, httpHeaders, entity.getMethod(), entity.getUrl());
  }
}