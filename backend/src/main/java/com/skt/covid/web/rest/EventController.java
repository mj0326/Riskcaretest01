package com.skt.covid.web.rest;

import com.skt.covid.domain.Event;
import com.skt.covid.service.EventService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping(path = "/app")
public class EventController {

    @Autowired
    private EventService eventService;

    /**
    * 일정(캘린더) 생성 API
    * 개인일정을 등록하는 API - 다른 캘린더와 연동시 API 변경 예정
    *
    * @param event
    * @return
    */
    @ApiOperation(value = "일정(캘린더) 생성 API", httpMethod = "POST", notes = "개인일정을 등록하는 API - 다른 캘린더와 연동시 API 변경 예정")
    @PostMapping(path = "/events")
    public ResponseEntity<?> createEvent(@RequestBody Event event) {
        Event savedEvent = eventService.create(event);
        return ResponseEntity.ok(savedEvent);
    }

    /**
    * 일정(캘린더) 수정 API
    * 개인일정을 수정하는 API - 다른 캘린더와 연동시 API 변경 예정
     *
    * @param id
    * @return
    */
    @ApiOperation(value = "일정(캘린더) 수정 API", httpMethod = "PATCH", notes = "개인일정을 수정하는 API - 다른 캘린더와 연동시 API 변경 예정")
    @PatchMapping(path = "/events/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable(name = "id") String id,
                                       @RequestBody Map<String, Object> updates) {

        Event updatedEvent = eventService.update(id, updates);
        return ResponseEntity.ok(updatedEvent);
    }

    /**
    * 일정(캘린더) 삭제 API
    *
    * @param id
    * @return
    */
    @ApiOperation(value = "일정(캘린더) 삭제 API (임시-변경예정)", httpMethod = "DELETE", notes = "개인일정을 삭제하는 API - 다른 캘린더와 연동시 API 변경 예정")
    @DeleteMapping(path = "/events/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable(name = "id") String id) {
        eventService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
    * 일정(캘린더) 조회 API By Id
    *
    * @param id
    * @return
    */
    @ApiOperation(value = "일정(캘린더) 조회 API by Id (임시-변경예정)", httpMethod = "GET", notes = "개인일정을 조회하는 API - 다른 캘린더와 연동시 API 변경 예정")
    @GetMapping(path = "/events/{id}")
    public ResponseEntity<?> findEvent(@PathVariable(name = "id") String id,
                                     @RequestParam(value = "includeIndex", required = false) Boolean includeIndex) {

        return ResponseEntity.ok(eventService.findById(id, includeIndex));
    }

    /**
     * USER 일정(캘린더) 조회 API
     *
     * @param startDate
     * @param endDate
     * @return
     */
    @ApiOperation(value = "일정(캘린더) 조회 API)", httpMethod = "GET", notes = "개인일정을 조회하는 API")
    @GetMapping(path = "/events/user")
    public ResponseEntity<?> findEventByUser(
        @ApiParam(value="ex) 20210301(검색날짜) - 디폴트값 : 조회날짜 ", required = false)
        @RequestParam(value = "startDate", required = false) String startDate,
        @ApiParam(value="ex) 20210331(검색날짜) - 디폴트값 : 조회날짜 ", required = false)
        @RequestParam(value = "endDate", required = false) String endDate
        ) {

        return ResponseEntity.ok(eventService.findEventByUser(startDate, endDate));
    }
}
