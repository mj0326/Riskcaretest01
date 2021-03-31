package app.metatron.extensions.covid.config;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Map;

@NoArgsConstructor
@Getter @Setter
@Component
@ConfigurationProperties(prefix="covid.storage")
public class RdbmsStorageProperties {

  Map<String, RdbmsConnection> rdbms;

  public RdbmsConnection getConnByName(String name) {
    return rdbms.get(name);
  }

  @NoArgsConstructor
  @Getter @Setter
  public static class RdbmsConnection {
    String driverClassName;
    String url;
    String username;
    String password;

  }
}
