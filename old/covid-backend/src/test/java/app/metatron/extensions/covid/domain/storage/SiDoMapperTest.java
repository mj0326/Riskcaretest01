package app.metatron.extensions.covid.domain.storage;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

class SiDoMapperTest {

  @Test
  public void mapping() {
    SiDoMapper siDoMapper = new SiDoMapper();

    assertThat(siDoMapper.getNameBySimpleName("경기")).isEqualTo("경기도");
    assertThat(siDoMapper.getSimpleNameByName("경기도")).isEqualTo("경기");
  }

}