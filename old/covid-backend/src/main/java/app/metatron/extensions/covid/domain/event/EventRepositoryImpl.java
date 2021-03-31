package app.metatron.extensions.covid.domain.event;

import app.metatron.extensions.covid.domain.location.LocationDong;
import app.metatron.extensions.covid.domain.location.QLocationDong;
import com.querydsl.jpa.JPQLQuery;
import org.apache.commons.lang3.StringUtils;
import org.joda.time.DateTime;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.util.List;

public class EventRepositoryImpl extends QuerydslRepositorySupport implements EventRepositoryExtends {

  public EventRepositoryImpl() {
    super(Event.class);
  }

  @Override
  public List<Event> searchEvent(String q, String username, String locationCode, DateTime startDateTime, DateTime endDateTime) {

    QEvent qEvent = QEvent.event;

    JPQLQuery<Event> query = from(qEvent);

    if(StringUtils.isNotEmpty(locationCode)) {
      query.where(qEvent.locationCode.eq(locationCode));
    }

    query.where(qEvent.startTime.before(endDateTime).and(qEvent.endTime.after(startDateTime)));

    if(StringUtils.isNotEmpty(username)) {
      query.where(qEvent.username.eq(username));
    }

    if(StringUtils.isNotEmpty(q)) {
      query.where(qEvent.summary.contains(q)
                                    .or(qEvent.location.contains(q)));
    }

    return query.fetch();
  }
}
