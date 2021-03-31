package app.metatron.extensions.covid.domain.location;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationDongRepository extends JpaRepository<LocationDong, String>,
        QuerydslPredicateExecutor<LocationDong>, LocationDongRepositoryExtends {

}
