package app.metatron.extensions.covid.domain.location;

import app.metatron.extensions.covid.domain.search.CovidSearchService;
import com.google.common.collect.Maps;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.joda.time.DateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class LocationDongService {

  private LocationDongRepository locationDongRepository;

  private CovidSearchService covidSearchService;

  public LocationDongService(LocationDongRepository locationDongRepository,
                             CovidSearchService covidSearchService) {
    this.locationDongRepository = locationDongRepository;
    this.covidSearchService = covidSearchService;
  }

  public Page<LocationDong> searchByName(String name, Boolean includeIndex, String baseDateTime, Pageable pageable) {

    Page<LocationDong> results = locationDongRepository.searchByName(name, pageable);

    if(BooleanUtils.isTrue(includeIndex) && !results.isEmpty()) {

      // 1. Create the mapper
      Map<String,LocationDong> codeMap = Maps.newLinkedHashMap();
      for (LocationDong result : results) {
        codeMap.put(result.getCode(), result);
      }

      if(StringUtils.isEmpty(baseDateTime)) {
        baseDateTime = DateTime.now().toString();
      }
      // 2. Search contact scores
      List<Map<String, Object>> indexResults = (List<Map<String, Object>>) covidSearchService
              .querySocialContactByDong(baseDateTime, codeMap.keySet().toArray(new String[codeMap.keySet().size()]));

      // 3. Set contact score in FavoriteLocation objects
      for (Map<String, Object> indexResult : indexResults) {
        if(!indexResult.containsKey("contact_score") || !indexResult.containsKey("ldong_cd")) {
          continue;
        }
        codeMap.get(indexResult.get("ldong_cd")).setLocationScore(
                NumberUtils.toDouble(indexResult.get("contact_score")+""));
      }
    }

    return results;
  }
}
