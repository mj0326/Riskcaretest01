package app.metatron.extensions.covid.domain.event;

import app.metatron.extensions.covid.common.exceptions.ResourceNotFoundException;
import app.metatron.extensions.covid.domain.location.FavoriteLocation;
import app.metatron.extensions.covid.domain.search.CovidSearchService;
import app.metatron.extensions.covid.util.AuthUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.joda.time.DateTime;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Slf4j
@Component
@Transactional(readOnly = true)
public class EventService {

  private EventRepository eventRepository;

  private CovidSearchService covidSearchService;

  public EventService(EventRepository eventRepository,
                      CovidSearchService covidSearchService) {
    this.eventRepository = eventRepository;
    this.covidSearchService = covidSearchService;
  }

  /**
   * Get the Event by id
   *
   * @param id
   * @return
   */
  public Event findById(String id) {
    return eventRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(id));
  }

  public Event findById(String id, Boolean includeIndex) {
    Event event = findById(id);

    if (BooleanUtils.isTrue(includeIndex) && event != null) {
      injectLocationIndex(event);
    }

    return event;
  }

  /**
   * Search events
   *
   * @param q
   * @param locationCode
   * @param startDateTime
   * @param endDateTime
   * @return
   */
  public List<Event> searchEvent(String q, String username, String locationCode, Boolean includeIndex, DateTime startDateTime,
                                 DateTime endDateTime) {

    if(StringUtils.isEmpty(username)) {
      username = AuthUtils.getAuthUserName();
    }

    List<Event> results = eventRepository.searchEvent(q, username, locationCode, startDateTime, endDateTime);

    if (BooleanUtils.isTrue(includeIndex) && CollectionUtils.isNotEmpty(results)) {

      for (Event result : results) {
        injectLocationIndex(result);
      }
    }

    return results;
  }

  /**
   * Inject a location index
   *
   * @param event
   */
  private void injectLocationIndex(Event event) {
    List<Map<String, Object>> indexResults = (List<Map<String, Object>>) covidSearchService
            .querySocialContactByDong(event.getStartTime().toString(), event.getLocationCode());

    if (CollectionUtils.isNotEmpty(indexResults)) {
      Map<String, Object> indexResult = indexResults.get(0);

      if (!indexResult.containsKey("contact_score") || !indexResult.containsKey("ldong_cd")) {
        return;
      }

      event.setLocationScore(NumberUtils.toDouble(indexResult.get("contact_score") + ""));
    }
  }

  /**
   * Save a event
   *
   * @param event
   * @return
   */
  @Transactional
  public Event create(Event event) {
    return eventRepository.save(event);
  }

  /**
   * Update a event
   *
   * @param updates
   * @return
   */
  @Transactional
  public Event update(String id, Map<String, Object> updates) {

    Event eventToUpdate = findById(id);

    eventToUpdate.update(updates);

    return eventRepository.save(eventToUpdate);
  }

  /**
   * Delete favorite locations
   *
   * @param ids
   */
  @Transactional
  public void delete(String... ids) {
    for (String id : ids) {
      eventRepository.deleteById(id);
    }
  }
}
