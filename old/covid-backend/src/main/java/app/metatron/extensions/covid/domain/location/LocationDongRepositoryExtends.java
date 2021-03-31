package app.metatron.extensions.covid.domain.location;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LocationDongRepositoryExtends {

  Page<LocationDong> searchByName(String name, Pageable pageable);

}
