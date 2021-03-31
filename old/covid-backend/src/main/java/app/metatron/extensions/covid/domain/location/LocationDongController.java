package app.metatron.extensions.covid.domain.location;

import app.metatron.extensions.covid.domain.CollectionPatch;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping(path = "/api")
public class LocationDongController {

  private LocationDongService locationDongService;

  public LocationDongController(LocationDongService locationDongService) {
    this.locationDongService = locationDongService;
  }

  /**
   * Search locations
   *
   * @param name
   * @param includeIndex
   * @param baseDateTime
   * @param pageable
   * @return
   */
  @GetMapping(path = "/locations/dong/search")
  public ResponseEntity<?> searchLocationByName(@RequestParam("name") String name,
                                                @RequestParam(value = "includeIndex", required = false) Boolean includeIndex,
                                                @RequestParam(value = "baseDateTime", required = false) String baseDateTime,
                                                @PageableDefault(size = 100) Pageable pageable) {

    return ResponseEntity.ok(locationDongService.searchByName(name, includeIndex, baseDateTime, pageable));
  }
}
