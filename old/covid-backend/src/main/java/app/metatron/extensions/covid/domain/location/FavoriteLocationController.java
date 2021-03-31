package app.metatron.extensions.covid.domain.location;

import app.metatron.extensions.covid.domain.CollectionPatch;
import app.metatron.extensions.covid.util.AuthUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.joda.time.DateTime;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping(path = "/api")
public class FavoriteLocationController {

  private FavoriteLocationService favoriteLocationService;

  public FavoriteLocationController(FavoriteLocationService favoriteLocationService) {
    this.favoriteLocationService = favoriteLocationService;
  }

  /**
   * Create a favorite location
   *
   * @param favoriteLocation
   * @return
   */
  @PostMapping(path = "/favorlocations")
  public ResponseEntity<?> createFavoriteLocation(@RequestBody FavoriteLocation favoriteLocation) {

    FavoriteLocation savedLocation = favoriteLocationService.save(favoriteLocation);

    return ResponseEntity.ok(savedLocation);
  }

  /**
   * Delete the favorite location
   *
   * @param id
   * @return
   */
  @DeleteMapping(path = "/favorlocations/{id}")
  public ResponseEntity<?> deleteFavoriteLocation(@PathVariable(name = "id") Long id) {

    favoriteLocationService.delete(id);

    return ResponseEntity.noContent().build();
  }

  /**
   * Patch favorite locations
   *
   * @param patches
   * @return
   */
  @PatchMapping(path = "/favorlocations")
  public ResponseEntity<?> patchFavoriteLocations(@RequestBody List<CollectionPatch> patches) {

    List<FavoriteLocation> locations = favoriteLocationService.patch(patches);

    return ResponseEntity.ok(locations);
  }

  /**
   * Get my favorite locations
   *
   * @return
   */
  @GetMapping(path = "/favorlocations/my")
  public ResponseEntity<?> getMyFavoriteLocation(@RequestParam(value = "includeIndex", required = false) Boolean includeIndex,
                                                 @RequestParam(value = "baseDateTime", required = false) String baseDateTime) {

    if(StringUtils.isEmpty(baseDateTime)) {
      baseDateTime = DateTime.now().toString();
    }

    List<FavoriteLocation> myLocations = favoriteLocationService.findFavoriteLocationByUsername(AuthUtils.getAuthUserName(), includeIndex, baseDateTime);

    return ResponseEntity.ok(myLocations);
  }
}
