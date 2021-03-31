package app.metatron.extensions.covid.domain.storage;

import com.google.common.collect.Maps;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class SiDoMapper {

  Map<String, String> mapper;

  public SiDoMapper() {
    mapper = Maps.newHashMap();
    mapper.put("제주", "제주특별자치도");
    mapper.put("경남", "경상남도");
    mapper.put("경북", "경상북도");
    mapper.put("전남", "전라남도");
    mapper.put("전북", "전라북도");
    mapper.put("충남", "충청남도");
    mapper.put("충북", "충청북도");
    mapper.put("강원", "강원도");
    mapper.put("경기", "경기도");
    mapper.put("세종", "세종특별자치시");
    mapper.put("울산", "울산광역시");
    mapper.put("대전", "대전광역시");
    mapper.put("광주", "광주광역시");
    mapper.put("인천", "인천광역시");
    mapper.put("대구", "대구광역시");
    mapper.put("부산", "부산광역시");
    mapper.put("서울", "서울특별시");
  }

  public String getNameBySimpleName(String simpleName) {
    return mapper.getOrDefault(simpleName, "Unknown");
  }

  public String getSimpleNameByName(String name) {
    for (String key : mapper.keySet()) {
      if(name.equals(mapper.get(key))) {
        return key;
      }
    }
    return name;
  }
}
