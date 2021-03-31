package app.metatron.extensions.covid.config;

import app.metatron.extensions.covid.common.oauth2.DiscoveryApiClient;
import app.metatron.extensions.covid.common.oauth2.Oauth2Constants;
import app.metatron.extensions.covid.domain.storage.DruidApiClient;
import feign.Feign;
import feign.Logger;
import feign.auth.BasicAuthRequestInterceptor;
import feign.form.FormEncoder;
import feign.jackson.JacksonDecoder;
import feign.jackson.JacksonEncoder;
import feign.slf4j.Slf4jLogger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;

@Configuration
public class ApiClientConfig {

    @Value("${covid.storage.druid.query-url:http://localhost:8082}")
    private String druidQueryServerUrl;

    @Value("${covid.discovery.internal-url:http://localhost:8180}")
    private String discoveryServerUrl;

    @Autowired
    private ClientRegistrationRepository clientRegistrationRepository;

    @Bean
    public DruidApiClient druidApiClient() {
        return Feign.builder()
                .client(new feign.okhttp.OkHttpClient())
                .encoder(new JacksonEncoder())
                .decoder(new JacksonDecoder())
                .logger(new Slf4jLogger(DruidApiClient.class))
                .logLevel(Logger.Level.FULL)
                .target(DruidApiClient.class, druidQueryServerUrl);
    }

    @Bean
    public DiscoveryApiClient discoveryApiClient() {
        ClientRegistration clientRegistration =
            clientRegistrationRepository.findByRegistrationId(Oauth2Constants.OAUTH_REGISTRATION_ID);
        return Feign.builder()
                    .client(new feign.okhttp.OkHttpClient())
                    .encoder(new FormEncoder(new JacksonEncoder()))
                    .decoder(new JacksonDecoder())
                    .logger(new Slf4jLogger(DiscoveryApiClient.class))
                    .logLevel(Logger.Level.FULL)
                    .requestInterceptor(
                        new BasicAuthRequestInterceptor(
                            clientRegistration.getClientId(), clientRegistration.getClientSecret()))
                    .target(DiscoveryApiClient.class, discoveryServerUrl);
    }
}
