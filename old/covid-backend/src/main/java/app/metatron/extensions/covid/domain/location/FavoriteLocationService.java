package app.metatron.extensions.covid.domain.location;

import app.metatron.extensions.covid.common.exceptions.ResourceNotFoundException;
import app.metatron.extensions.covid.domain.CollectionPatch;
import app.metatron.extensions.covid.domain.search.CovidSearchService;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Component
@Transactional(readOnly = true)
public class FavoriteLocationService {

  private FavoriteLocationRepository favoriteLocationRepository;

  private CovidSearchService covidSearchService;

  public FavoriteLocationService(
          FavoriteLocationRepository favoriteLocationRepository,
          CovidSearchService covidSearchService) {
    this.favoriteLocationRepository = favoriteLocationRepository;
    this.covidSearchService = covidSearchService;
  }

  /**
   * Get the favorite location by id
   *
   * @param id
   * @return
   */
  public FavoriteLocation findById(Long id) {
    return favoriteLocationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(id));
  }

  /**
   * Get favorite locations by username
   *
   * @param username
   * @param includeIndex if true, include contact score in the result.
   * @param baseDateTime
   * @return
   */
  public List<FavoriteLocation> findFavoriteLocationByUsername(String username, Boolean includeIndex, String baseDateTime) {

    List<FavoriteLocation> results = favoriteLocationRepository.findAllByUsernameOrderBySeq(username);
    if(CollectionUtils.isEmpty(results)) {
      return Lists.newArrayList();
    }

    if(BooleanUtils.isTrue(includeIndex)) {

      // 1. Create the mapper
      Map<String,FavoriteLocation> codeMap = Maps.newLinkedHashMap();
      for (FavoriteLocation result : results) {
        codeMap.put(result.getLocationCode(), result);
      }

      // 2. Search contact scores
      List<Map<String, Object>> indexResults = (List<Map<String, Object>>) covidSearchService
              .querySocialContactByDong(baseDateTime, codeMap.keySet().toArray(new String[codeMap.keySet().size()]));

      // 3. Set contact score in FavoriteLocation objects
      for (Map<String, Object> indexResult : indexResults) {
        if(!indexResult.containsKey("contact_score") || !indexResult.containsKey("ldong_cd")) {
          continue;
        }
        codeMap.get(indexResult.get("ldong_cd")).setLocationScore(NumberUtils.toDouble(indexResult.get("contact_score")+""));
      }

      return Lists.newArrayList(codeMap.values());

    } else {
      return results;

    }
  }

  /**
   * Create a favorite location
   *
   * @param favoriteLocation
   * @return
   */
  @Transactional
  public FavoriteLocation save(FavoriteLocation favoriteLocation) {
    return favoriteLocationRepository.save(favoriteLocation);
  }

  /**
   * Delete favorite locations
   *
   * @param ids
   */
  @Transactional
  public void delete(Long... ids) {
    for (Long id : ids) {
      favoriteLocationRepository.deleteById(id);
    }
  }

  /**
   * Patch favorite locations
   *
   * @param patches
   */
  @Transactional
  public List<FavoriteLocation> patch(List<CollectionPatch> patches) {

    List<FavoriteLocation> results = Lists.newArrayList();

    for (CollectionPatch patch : patches) {
      if(patch.getOp() == CollectionPatch.CollectionAction.ADD) {  // Add Action

        results.add(save(new FavoriteLocation(patch)));

      } else if(patch.getOp() == CollectionPatch.CollectionAction.REPLACE) { // Updates Action

        if(!patch.hasProperty("id")) { continue; }

        FavoriteLocation locationToUpdate = null;
        try {
          locationToUpdate = findById(patch.getLongValue("id"));
        } catch (Exception e) {
          LOG.warn("Not found the favorite location entity by {} while patching", patch);
          continue;
        }

        locationToUpdate.update(patch);
        results.add(save(locationToUpdate));

      } else if(patch.getOp() == CollectionPatch.CollectionAction.REMOVE) {  // Remove Action
        if(!patch.hasProperty("id")) { continue; }
        delete(patch.getLongValue("id"));
      }
    }

    return results;
  }

}
