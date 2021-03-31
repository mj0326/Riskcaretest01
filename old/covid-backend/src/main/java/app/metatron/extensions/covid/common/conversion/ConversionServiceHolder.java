package app.metatron.extensions.covid.common.conversion;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.format.support.DefaultFormattingConversionService;

import java.net.URI;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public enum ConversionServiceHolder {
  INSTANCE;

  private DefaultFormattingConversionService service;

  ConversionServiceHolder() {
  }

  public void setService(DefaultFormattingConversionService defaultConversionService) {
    this.service = defaultConversionService;
  }

  public DefaultFormattingConversionService getService() {
    return service;
  }

  public <T> T convert(Object source, Class<T> targetType) {
    if (source == null) {
      return null;
    }

    return service.convert(source, targetType);
  }

  public <T> T convertStringURI(String uriString, Class<T> targetType) {
    if (StringUtils.isEmpty(uriString)) {
      return null;
    }

    return service.convert(URI.create(uriString), targetType);
  }

  public <T> List<T> convert(List<String> urlStrings, Class<T> targetType) {

    if (CollectionUtils.isEmpty(urlStrings)) {
      return Collections.EMPTY_LIST;
    }
    List<URI> uris = urlStrings.stream()
            .map(s -> URI.create(s)).collect(Collectors.toList());

    List<T> convertedObjects = uris.stream()
            .map(uri -> service.convert(uri, targetType)).collect(Collectors.toList());

    return convertedObjects;
  }

}
