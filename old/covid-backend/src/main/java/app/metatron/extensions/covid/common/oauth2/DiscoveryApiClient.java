package app.metatron.extensions.covid.common.oauth2;

import java.util.Map;

import feign.Headers;
import feign.Param;
import feign.RequestLine;

public interface DiscoveryApiClient {

    @RequestLine("POST /oauth/token")
    @Headers("Content-Type: application/x-www-form-urlencoded")
    Map refreshToken(@Param("grant_type") String grantType, @Param("refresh_token") String refreshToken);

    @RequestLine("POST /oauth/token")
    @Headers("Content-Type: application/x-www-form-urlencoded")
    Map accessToken(@Param("grant_type") String grantType, @Param("scope") String scope,
                    @Param("username") String username, @Param("password") String password);
}
