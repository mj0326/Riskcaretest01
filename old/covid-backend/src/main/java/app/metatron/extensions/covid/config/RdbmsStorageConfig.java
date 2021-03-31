package app.metatron.extensions.covid.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

@Getter
@Configuration
public class RdbmsStorageConfig {

  @Autowired
  RdbmsStorageProperties rdbmsStorageProperties;

  @Bean("covidDataSource")
  public DataSource covidMySqlDataSource() {

    RdbmsStorageProperties.RdbmsConnection covidConnection = rdbmsStorageProperties.getConnByName("covid");

    DriverManagerDataSource dataSource = new DriverManagerDataSource();
    dataSource.setDriverClassName(covidConnection.getDriverClassName());
    dataSource.setUrl(covidConnection.getUrl());
    dataSource.setUsername(covidConnection.getUsername());
    dataSource.setPassword(covidConnection.getPassword());

    return dataSource;
  }
}
