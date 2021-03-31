package app.metatron.extensions.covid.domain.storage;

import feign.Headers;
import feign.RequestLine;

public interface DruidApiClient {

    /**
     * Call query by SQL
     *
     * @param druidSqlRequest
     * @return
     */
    @RequestLine("POST /druid/v2/sql")
    @Headers("Content-Type: application/json")
    Object callSql(DruidSqlRequest druidSqlRequest);
}
