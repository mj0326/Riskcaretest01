//package com.skt.covid.config;
//
//import com.skt.covid.storage.DruidApiClient;
//import feign.Feign;
//import feign.Logger;
//import feign.jackson.JacksonDecoder;
//import feign.jackson.JacksonEncoder;
//import feign.slf4j.Slf4jLogger;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//@Configuration
//public class ApiClientConfig {
//
//    @Value("${covid.storage.druid.query-url:http://localhost:8082}")
//    private String druidQueryServerUrl;
//
//    @Value("${covid.discovery.internal-url:http://localhost:8180}")
//    private String discoveryServerUrl;
//
//    @Bean
//    public DruidApiClient druidApiClient() {
//        return Feign.builder()
//                .client(new feign.okhttp.OkHttpClient())
//                .encoder(new JacksonEncoder())
//                .decoder(new JacksonDecoder())
//                .logger(new Slf4jLogger(DruidApiClient.class))
//                .logLevel(Logger.Level.FULL)
//                .target(DruidApiClient.class, druidQueryServerUrl);
//    }
//
//}
