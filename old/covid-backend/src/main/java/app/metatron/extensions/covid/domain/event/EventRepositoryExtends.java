package app.metatron.extensions.covid.domain.event;

import app.metatron.extensions.covid.domain.location.LocationDongRepositoryExtends;
import org.joda.time.DateTime;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.util.List;

public interface EventRepositoryExtends {
  List<Event> searchEvent(String q, String username, String locationCode, DateTime startDateTime, DateTime endDateTime);
}
