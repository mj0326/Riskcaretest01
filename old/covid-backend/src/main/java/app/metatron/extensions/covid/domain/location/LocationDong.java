package app.metatron.extensions.covid.domain.location;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "location_dong")
@NoArgsConstructor
@Getter @Setter
public class LocationDong {

  @Id
  @Column(name = "ldong_cd")
  private String code;

  @Column(name = "si_do")
  private String siDo;

  @Column(name = "si_gun_gu")
  private String siGunGu;

  @Column(name = "dong")
  private String dong;

  @Transient
  @JsonProperty
  private Double locationScore;

}
