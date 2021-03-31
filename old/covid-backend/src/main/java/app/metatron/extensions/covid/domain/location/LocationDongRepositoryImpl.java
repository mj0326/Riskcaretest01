package app.metatron.extensions.covid.domain.location;

import com.google.common.collect.Lists;
import com.querydsl.jpa.JPQLQuery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.util.List;

public class LocationDongRepositoryImpl extends QuerydslRepositorySupport implements LocationDongRepositoryExtends {

  public LocationDongRepositoryImpl() {
    super(LocationDong.class);
  }

  @Override
  public Page<LocationDong> searchByName(String name, Pageable pageable) {

    QLocationDong qLocationDong = QLocationDong.locationDong;

    JPQLQuery<LocationDong> query = from(qLocationDong);

    query.where(qLocationDong.siDo.contains(name)
                                  .or(qLocationDong.siGunGu.contains(name))
                                  .or(qLocationDong.dong.contains(name)));

    Long total = query.fetchCount();

    List<LocationDong> contents;
    if (total > pageable.getOffset()) {
      query = getQuerydsl().applyPagination(pageable, query);
      contents = query.fetch();
    } else {
      contents = Lists.newArrayList();
    }

    return new PageImpl<>(contents, pageable, total);

  }
}
