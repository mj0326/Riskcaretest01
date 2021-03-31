package app.metatron.extensions.covid.domain.storage;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.util.List;
import java.util.Map;

@Component
public class CovidRdbmsClient {

  private JdbcTemplate jdbcTemplate;

  public CovidRdbmsClient(@Qualifier("covidDataSource") DataSource dataSource) {
    this.jdbcTemplate = new JdbcTemplate(dataSource);
  }

  public List<Map<String, Object>> callSql(String sql) {
    return jdbcTemplate.queryForList(sql);
  }
}
