package com.skt.covid.repository;

import com.skt.covid.domain.Event;
import com.skt.covid.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, String> {

//    @Query(
//        "select event \n" +
//        "from Event event \n" +
//        "where event.startTime <= :endDateTime and event.endTime >= :startDateTime \n" +
//        "and event.user = :user "
//    )
//    List<Event> searchEvent(@Param("user") User user, @Param("locationCode") String locationCode, @Param("startDateTime") LocalDateTime startDateTime, @Param("endDateTime") LocalDateTime endDateTime);
}
