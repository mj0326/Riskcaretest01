package app.metatron.extensions.covid.domain.storage;

import com.google.common.collect.Maps;
import org.assertj.core.util.Lists;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
class CovidRdbmsClientTest {

  @Autowired
  CovidRdbmsClient covidRdbmsClient;

  @Test
  public void whenQuerySql_shouldReturnRawResult() {

    String sql = "SELECT 1";

    Map<String, Object> result = Maps.newHashMap();
    result.put("1", 1);
    List<Map<String,Object>> resultLine = Lists.newArrayList(result);

    assertThat(covidRdbmsClient.callSql(sql)).isEqualTo(resultLine);

  }
}