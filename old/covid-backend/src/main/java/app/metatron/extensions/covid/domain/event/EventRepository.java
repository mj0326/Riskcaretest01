package app.metatron.extensions.covid.domain.event;

import app.metatron.extensions.covid.domain.location.LocationDong;
import app.metatron.extensions.covid.domain.location.LocationDongRepositoryExtends;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

public interface EventRepository extends JpaRepository<Event, String>,
        QuerydslPredicateExecutor<Event>, EventRepositoryExtends {

}
