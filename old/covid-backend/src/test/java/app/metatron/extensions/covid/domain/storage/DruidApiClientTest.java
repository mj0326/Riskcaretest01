package app.metatron.extensions.covid.domain.storage;

import app.metatron.extensions.covid.config.ApiClientConfig;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import java.io.IOException;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = ApiClientConfig.class, loader = AnnotationConfigContextLoader.class)
public class DruidApiClientTest {

    @Autowired
    private DruidApiClient druidApiClient;

    @Test
    public void callSqlAPI() throws IOException {
        DruidSqlRequest druidSqlRequest = new DruidSqlRequest("select time_format(\"__time\", 'yyyy-MM-dd') as t, location_name, sum(\"count\") as val from \"druid\".\"covid_msg\" group by  time_format(\"__time\", 'yyyy-MM-dd'), location_name");
        Object result = druidApiClient.callSql(druidSqlRequest);
        System.out.println(result);
    }
}
