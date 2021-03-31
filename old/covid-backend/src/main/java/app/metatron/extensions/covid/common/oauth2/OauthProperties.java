package app.metatron.extensions.covid.common.oauth2;

import com.google.common.collect.Lists;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties(prefix = "covid.oauth2")
public class OauthProperties {

  List<Matcher> permitAll = Lists.newArrayList();

  public OauthProperties() {
  }

  public List<Matcher> getPermitAll() {
    return permitAll;
  }

  public void setPermitAll(List<Matcher> permitAll) {
    this.permitAll = permitAll;
  }

  public static class Matcher {
    HttpMethod method;
    String api;

    public Matcher() {
    }

    public HttpMethod getMethod() {
      return method;
    }

    public void setMethod(HttpMethod method) {
      this.method = method;
    }

    public String getApi() {
      return api;
    }

    public void setApi(String api) {
      this.api = api;
    }
  }
}
