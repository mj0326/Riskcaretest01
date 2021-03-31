package app.metatron.extensions.covid.domain.location;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteLocationRepository extends JpaRepository<FavoriteLocation, Long> {

  List<FavoriteLocation> findAllByUsernameOrderBySeq(String username);

}
