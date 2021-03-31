package com.skt.covid.service;

import com.skt.covid.config.Constants;
import com.skt.covid.domain.Event;
import com.skt.covid.repository.EventRepository;
import com.skt.covid.repository.UserRepository;
import com.skt.covid.security.SecurityUtils;
import com.skt.covid.web.rest.errors.ResourceNotFoundException;
//import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;


@Service
@Transactional
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;



    @Autowired
    private CovidSearchService covidSearchService;

    /**
    * Get the Event by id
    *
    * @param id
    * @return
    */
    @Transactional(readOnly = true)
    public Event findById(String id) {
        return eventRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Event : " + id));
    }

    @Transactional(readOnly = true)
    public List<Event> findEventByUser(String startDate , String endDate) {
//        String userId = SecurityUtils.getCurrentUserLogin().get();
//        userRepository.getOne(userId)



        return null;
    }

    public Event findById(String id, Boolean includeIndex) {
        Event event = findById(id);

        if (BooleanUtils.isTrue(includeIndex) && event != null) {
            injectLocationIndex(event);
        }

        return event;
    }

//    /**
//    * Search events
//    *
//    * @param q
//    * @param locationCode
//    * @param startDateTime
//    * @param endDateTime
//    * @return
//    */
//    @Transactional(readOnly = true)
//    public List<Event> searchEvent(String q, String username, String locationCode, Boolean includeIndex, LocalDateTime startDateTime,
//                                   LocalDateTime endDateTime) {
//
//        if(StringUtils.isEmpty(username)) {
//          username = SecurityUtils.getCurrentUserLogin().get();
//        }
//
//        List<Event> results = eventRepository.searchEvent(q, username, locationCode, startDateTime, endDateTime);
//
//
////        if (BooleanUtils.isTrue(includeIndex) && CollectionUtils.isNotEmpty(results)) {
////
////            for (Event result : results) {
////                injectLocationIndex(result);
////            }
////        }
//        return results;
//    }

    /**
    * Inject a location index
    *
    * @param event
    */
    private void injectLocationIndex(Event event) {
//        List<Map<String, Object>> indexResults = (List<Map<String, Object>>) covidSearchService
//                .querySocialContactByDong(event.getStartTime().toString(), event.getLocationCode());
//
//        if (CollectionUtils.isNotEmpty(indexResults)) {
//          Map<String, Object> indexResult = indexResults.get(0);
//
//          if (!indexResult.containsKey("contact_score") || !indexResult.containsKey("ldong_cd")) {
//            return;
//          }
//
//          event.setLocationScore(NumberUtils.toDouble(indexResult.get("contact_score") + ""));
//        }
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

//        eventToUpdate.update(updates);

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
