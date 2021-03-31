package app.metatron.extensions.covid.domain.event;

import app.metatron.extensions.covid.domain.location.FavoriteLocation;
import lombok.extern.slf4j.Slf4j;
import org.joda.time.DateTime;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping(path = "/api")
public class EventController {

  private EventService eventService;

  public EventController(EventService eventService) {
    this.eventService = eventService;
  }


  /**
   * Create a event
   *
   * @param event
   * @return
   */
  @PostMapping(path = "/events")
  public ResponseEntity<?> createEvent(@RequestBody Event event) {

    Event savedEvent = eventService.create(event);

    return ResponseEntity.ok(savedEvent);
  }

  /**
   * Update the event
   *
   * @param id
   * @return
   */
  @PatchMapping(path = "/events/{id}")
  public ResponseEntity<?> updateEvent(@PathVariable(name = "id") String id,
                                       @RequestBody Map<String, Object> updates) {

    Event updatedEvent = eventService.update(id, updates);

    return ResponseEntity.ok(updatedEvent);
  }

  /**
   * Delete the favorite location
   *
   * @param id
   * @return
   */
  @DeleteMapping(path = "/events/{id}")
  public ResponseEntity<?> deleteEvent(@PathVariable(name = "id") String id) {

    eventService.delete(id);

    return ResponseEntity.noContent().build();
  }

  /**
   * Get a event by id
   *
   * @param id
   * @return
   */
  @GetMapping(path = "/events/{id}")
  public ResponseEntity<?> findEvent(@PathVariable(name = "id") String id,
                                     @RequestParam(value = "includeIndex", required = false) Boolean includeIndex) {

    return ResponseEntity.ok(eventService.findById(id, includeIndex));
  }

  @GetMapping(path = "/events/search")
  public ResponseEntity<?> searchEvent(@RequestParam(value = "q", required = false) String q,
                                       @RequestParam(value = "username", required = false) String username,
                                       @RequestParam(value = "locationCode", required = false) String locationCode,
                                       @RequestParam(value = "includeIndex", required = false) Boolean includeIndex,
                                       @RequestParam(value = "startTime", required = false)
                                         @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) DateTime startTime,
                                       @RequestParam(value = "endTime", required = false)
                                         @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) DateTime endTime) {

    List<Event> events = eventService.searchEvent(q, username, locationCode, includeIndex, startTime, endTime);

    return ResponseEntity.ok(events);
  }
}
