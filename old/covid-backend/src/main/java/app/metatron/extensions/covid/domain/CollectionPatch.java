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

package app.metatron.extensions.covid.domain;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.google.common.collect.Maps;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang3.EnumUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.Serializable;
import java.lang.reflect.InvocationTargetException;
import java.util.Map;

/**
 * 도메인내 Collection 타입의 업데이트(PATCH)가 필요시 표준 모델 정의
 * JsonCreator 어노테이션과 JsonAnySetter 가 함께 사용하는 내용이 정의 되지 않아 별도 Deserialize 정의
 */
public class CollectionPatch implements Serializable {

  private static Logger LOGGER = LoggerFactory.getLogger(CollectionPatch.class);

  CollectionAction op = CollectionAction.ADD;

  private Map<String, Object> properties = Maps.newHashMap();

  public CollectionPatch() {
  }

  @JsonIgnore
  public <T> T getValue(String key) {
    if(!hasProperty(key)) {
      return null;
    }

    return (T) this.properties.get(key);
  }

  @JsonIgnore
  public Object getObjectValue(String key) {
    if(!hasProperty(key)) {
      return null;
    }

    return this.properties.get(key);
  }

  @JsonIgnore
  public Long getLongValue(String key) {
    if(!hasProperty(key)) {
      return null;
    }

    Object obj = this.properties.get(key);
    if(obj instanceof Number) {
      return ((Number) obj).longValue();
    } else {
      return null;
    }
  }

  @JsonIgnore
  public Integer getIntValue(String key) {
    if(!hasProperty(key)) {
      return null;
    }

    Object obj = this.properties.get(key);
    if(obj instanceof Number) {
      return ((Number) obj).intValue();
    } else {
      return null;
    }
  }

  public void patchEntity(Object obj, String... props) {
    for(String prop : props) {
      if(!hasProperty(prop)) {
        continue;
      }

      try {
        BeanUtils.setProperty(obj, prop, getValue(prop));
      } catch (IllegalAccessException | InvocationTargetException e) {
        LOGGER.warn("Fail to patch property({}) from bean({})", prop, obj.getClass().getName());
      }
    }
  }

  public Boolean hasProperty(String key) {
    return this.properties.containsKey(key);
  }

  public CollectionAction getOp() {
    return op;
  }

  @JsonSetter
  public void setOp(String op) {
    this.op = EnumUtils.getEnumIgnoreCase(CollectionAction.class, op);
  }

  public void setOp(CollectionAction op) {
    this.op = op;
  }

  @JsonAnySetter
  public void add(String key, Object value) {
    properties.put(key, value);
  }

  @JsonAnyGetter
  public Map<String, Object> getProperties() {
    return properties;
  }

  @Override
  public String toString() {
    return "CollectionPatch{" +
            "op=" + op +
            ", properties=" + properties +
            '}';
  }

  public enum CollectionAction {
    ADD, REMOVE, REPLACE;

    public static CollectionAction valueCaseOf(String op) {
      return EnumUtils.getEnumIgnoreCase(CollectionAction.class, op, ADD);
    }
  }
}
