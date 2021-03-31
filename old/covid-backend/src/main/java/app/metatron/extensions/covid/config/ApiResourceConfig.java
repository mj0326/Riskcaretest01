/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package app.metatron.extensions.covid.config;

import app.metatron.extensions.covid.common.PageImplJacksonSerializer;
import app.metatron.extensions.covid.common.conversion.*;
import app.metatron.extensions.covid.common.projection.Projection;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.datatype.joda.JodaModule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.BeanFactoryUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.ConversionService;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.data.mapping.context.MappingContext;
import org.springframework.data.mapping.context.PersistentEntities;
import org.springframework.data.projection.SpelAwareProxyProjectionFactory;
import org.springframework.data.repository.support.DefaultRepositoryInvokerFactory;
import org.springframework.data.repository.support.Repositories;
import org.springframework.data.repository.support.RepositoryInvokerFactory;
import org.springframework.data.util.AnnotatedTypeScanner;
import org.springframework.format.support.DefaultFormattingConversionService;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.converter.ByteArrayHttpMessageConverter;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.context.request.RequestContextListener;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.*;
import org.springframework.web.servlet.resource.PathResourceResolver;
import org.springframework.web.servlet.resource.ResourceResolver;
import org.springframework.web.servlet.resource.ResourceResolverChain;
import org.springframework.web.servlet.view.InternalResourceView;
import org.springframework.web.servlet.view.UrlBasedViewResolver;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.charset.Charset;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;

import static com.fasterxml.jackson.core.JsonParser.Feature.ALLOW_NON_NUMERIC_NUMBERS;
import static com.fasterxml.jackson.core.JsonParser.Feature.ALLOW_SINGLE_QUOTES;
import static java.util.Optional.ofNullable;

@Configuration
@EnableWebMvc
public class ApiResourceConfig implements WebMvcConfigurer {

  private static Logger LOGGER = LoggerFactory.getLogger(ApiResourceConfig.class);

  private static final String RESOURCE_PATH = "/resources/";
  private static final String COMMON_JS = RESOURCE_PATH + "common.*.js";
  private static final String RUNTIME_JS = RESOURCE_PATH + "runtime.*.js";
  private static final String MAIN_JS = RESOURCE_PATH + "main.*.js";
  private static final String POLYFILLS_JS = RESOURCE_PATH + "polyfills.*.js";
  private static final String SCRIPTS_JS = RESOURCE_PATH + "scripts.*.js";
  private static final String OTHER_JS = RESOURCE_PATH + "*.*.js";

  private static final String STYLES_CSS = RESOURCE_PATH + "styles.*.css";

  private static final String PNG = RESOURCE_PATH + "*.*.png";
  private static final String JPG = RESOURCE_PATH + "*.*.jpg";
  private static final String WOFF = RESOURCE_PATH + "*.*.woff";
  private static final String EOF = RESOURCE_PATH + "*.*.eot";
  private static final String TTF = RESOURCE_PATH + "*.*.ttf";
  private static final String ICO = RESOURCE_PATH + "*.*.ico";

  public final static String APP_UI_ROUTE_PREFIX = "/app/";
  public final static String API_PREFIX = "/api";
  public final static String REDIRECT_URL = "redirect:" + APP_UI_ROUTE_PREFIX + "index.html";
  public final static String REDIRECT_PATH_URL = REDIRECT_URL + "?path=";

  @Value("${covid.resources.cache.cacheControl.max-age: 604800}")
  private Integer cacheControlMaxAge;

  @Autowired
  ApplicationContext applicationContext;

  /**
   * Maps all AngularJS routes to index so that they work with direct linking.
   */
  @Controller
  static class Routes {

    @RequestMapping({"/"})
    public String index() {
      return REDIRECT_URL;
    }
  }

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {

    registry.addResourceHandler("/app/**")
            .addResourceLocations("classpath:resources/");

    ofNullable(cacheControlMaxAge).ifPresent(value -> {
      try {
        registry.addResourceHandler(COMMON_JS, RUNTIME_JS, MAIN_JS, POLYFILLS_JS, SCRIPTS_JS, OTHER_JS, STYLES_CSS, PNG, JPG, WOFF, EOF, TTF, ICO)
                .addResourceLocations("classpath:resources/")
                .setCacheControl(CacheControl.maxAge(value, TimeUnit.SECONDS).cachePublic())
                .resourceChain(true)
                .addResolver(new PathResourceResolver());
        ;
      } catch (Exception e) {
        LOGGER.debug("Please check the value of \"covid.resources.cache.cacheControl.max-age\" in application.yaml. Resource caching is not enabled.");
      }
    });

    // for angular
    registry.addResourceHandler("/assets/**")
            .addResourceLocations("classpath:resources/assets/");
    registry.addResourceHandler("/webjars/**")
            .addResourceLocations("classpath:/META-INF/resources/webjars/");
  }

//  @Override
//  public void addViewControllers(ViewControllerRegistry registry) {
//    registry.addViewController("/app/manifest.json").setViewName("forward:/resources/manifest.json");
//    registry.addViewController("/app/favicon.ico").setViewName("forward:/resources/favicon.ico");
//    registry.addViewController("/app/asset-manifest.json").setViewName("forward:/resources/asset-manifest.json");
//    registry.addViewController("/app/logo192.png").setViewName("forward:/resources/logo192.png");
//    registry.addViewController("/app/logo512.png").setViewName("forward:/resources/logo512.png");
//    registry.addViewController("/app/logo512.png").setViewName("forward:/resources/logo512.png");
//    registry.addViewController("/app/robots.txt").setViewName("forward:/resources/robots.txt");
//    registry.addViewController("/app/**").setViewName("forward:/resources/index.html");
////    registry.addViewController("/app/index.html").setViewName("forward:/resources/index.html");
//  }

  @Override
  public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
    configurer.enable("default");
  }

  @Override
  public void configureViewResolvers(ViewResolverRegistry registry) {
    registry.viewResolver(urlBasedViewResolver());
  }

  @Bean
  public ViewResolver urlBasedViewResolver() {
    UrlBasedViewResolver viewResolver = new UrlBasedViewResolver();
    viewResolver.setViewClass(InternalResourceView.class);
    return viewResolver;
  }

  @Override
  public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
    converters.add(mappingJackson2HttpMessageConverter());
    converters.add(stringHttpMessageConverter());
    converters.add(byteArrayHttpMessageConverter());
  }

  @Bean("mappingJackson2HttpMessageConverter")
  public MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter() {
    final MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
    converter.setObjectMapper(jacksonBuilder().build());
    return converter;
  }

  @Bean
  public StringHttpMessageConverter stringHttpMessageConverter() {
    final StringHttpMessageConverter stringConverter = new StringHttpMessageConverter(Charset.forName("UTF-8"));
    stringConverter.setSupportedMediaTypes(
        Arrays.asList(MediaType.TEXT_PLAIN, MediaType.TEXT_HTML, MediaType.APPLICATION_JSON));
    return stringConverter;
  }

  @Bean
  public ByteArrayHttpMessageConverter byteArrayHttpMessageConverter() {
    final ByteArrayHttpMessageConverter byteArrayHttpMessageConverter = new ByteArrayHttpMessageConverter();
    byteArrayHttpMessageConverter.setSupportedMediaTypes(Arrays.asList(
        MediaType.IMAGE_JPEG, MediaType.IMAGE_PNG, MediaType.IMAGE_GIF, MediaType.APPLICATION_OCTET_STREAM, MediaType.ALL
    ));

    return byteArrayHttpMessageConverter;
  }

  @Bean
  public Jackson2ObjectMapperBuilder jacksonBuilder() {
    Jackson2ObjectMapperBuilder builder = Jackson2ObjectMapperBuilder.json();
    builder.indentOutput(false)
           .dateFormat(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ"))
           .timeZone("Asia/Seoul")
           .failOnUnknownProperties(false)
           .featuresToEnable(ALLOW_NON_NUMERIC_NUMBERS)
           .featuresToEnable(ALLOW_SINGLE_QUOTES)
           .serializers(new PageImplJacksonSerializer())
           .serializationInclusion(JsonInclude.Include.NON_NULL)
           .modules(new JodaModule());
           //.modules(new Hibernate5Module());
    return builder;
  }

  @Bean
  public SpelAwareProxyProjectionFactory projectionFactory() {
    return new SpelAwareProxyProjectionFactory();
  }

  @Override
  public void addCorsMappings(CorsRegistry registry) {

    //        List<MetatronProperties.Cors> corss = metatronProperties.getCors();
    //
    //        if(corss.isEmpty()) {
    //           registry.addMapping("/**");
    //        } else {
    //            for (MetatronProperties.Cors cors : corss) {
    //                registry
    //                    .addMapping(cors.getMapping())
    //                    .allowedOrigins(cors.getAllowedOrigins())
    //                    .allowedHeaders(cors.getAllowedHeaders())
    //                    .exposedHeaders(cors.getExposedHeaders())
    //                    .allowedMethods(cors.getAllowedMethods())
    //                    .allowCredentials(cors.getAllowCredentials())
    //                    .maxAge(cors.getMaxAge());
    //            }
    //        }

    registry
        .addMapping("/**")
        .allowedOrigins("*")
        .allowedMethods("*")
        .allowedHeaders("*")
        .exposedHeaders("Access-Control-Allow-Origin",
                        "Access-Control-Allow-Methods",
                        "Access-Control-Allow-Headers",
                        "Access-Control-Max-Age",
                        "Access-Control-Request-Headers",
                        "Access-Control-Request-Method");
  }


  @Bean
  @Qualifier
  public DefaultFormattingConversionService defaultConversionService() {

    DefaultFormattingConversionService conversionService = new DefaultFormattingConversionService();
    // Add Spring Data Commons formatters
    conversionService.addConverter(uriToEntityConverter(conversionService));

    // Inject conversion instance to ConversionServiceHolder
    ConversionServiceHolder.INSTANCE.setService(conversionService);

    return conversionService;
  }

  protected UriToEntityConverter uriToEntityConverter(ConversionService conversionService) {
    return new UriToEntityConverter(persistentEntities(), repositoryInvokerFactory(conversionService), repositories());
  }

  @Bean
  public RepositoryInvokerFactory repositoryInvokerFactory(@Qualifier ConversionService defaultConversionService) {

    List<EntityLookup<?>> lookups = getEntityLookups();

    return new UnwrappingRepositoryInvokerFactory(
        new DefaultRepositoryInvokerFactory(repositories(), defaultConversionService), lookups);
  }

  public List<EntityLookup<?>> getEntityLookups() {

    EntityLookupConfiguration lookupConfiguration = new EntityLookupConfiguration();

    List<EntityLookup<?>> lookups = new ArrayList<>();
    lookups.addAll(lookupConfiguration.getEntityLookups(repositories()));


    return lookups;

  }

  private Set<Class<?>> getProjections(Repositories repositories) {

    Set<String> packagesToScan = new HashSet<>();

    for (Class<?> domainType : repositories) {
      packagesToScan.add(domainType.getPackage().getName());
    }

    AnnotatedTypeScanner scanner = new AnnotatedTypeScanner(Projection.class);
    scanner.setEnvironment(applicationContext.getEnvironment());
    scanner.setResourceLoader(applicationContext);

    return scanner.findTypes(packagesToScan);
  }

  @Bean
  public Repositories repositories() {
    return new Repositories(applicationContext);
  }

  @Bean
  public PersistentEntities persistentEntities() {

    List<MappingContext<?, ?>> arrayList = new ArrayList<MappingContext<?, ?>>();

    for (MappingContext<?, ?> context : BeanFactoryUtils
        .beansOfTypeIncludingAncestors(applicationContext, MappingContext.class).values()) {
      arrayList.add(context);
    }

    return new PersistentEntities(arrayList);
  }

  @Bean
  public RequestContextListener requestContextListener() {
    return new RequestContextListener();
  }

}
