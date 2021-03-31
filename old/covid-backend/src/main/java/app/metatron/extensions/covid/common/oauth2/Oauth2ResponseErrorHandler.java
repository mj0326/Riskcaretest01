package app.metatron.extensions.covid.common.oauth2;

import org.apache.commons.io.IOUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.ResponseErrorHandler;

import java.io.IOException;

import javax.security.sasl.AuthenticationException;

public class Oauth2ResponseErrorHandler implements ResponseErrorHandler {

  @Override
  public boolean hasError(ClientHttpResponse response) throws IOException {
    if (response.getStatusCode() == HttpStatus.OK || response.getStatusCode() == HttpStatus.NO_CONTENT) {
      return false;
    }

    return true;
  }

  @Override
  public void handleError(ClientHttpResponse response) throws IOException {
    throw new AuthenticationException(IOUtils.toString(response.getBody()));
  }
}