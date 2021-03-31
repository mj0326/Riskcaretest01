package app.metatron.extensions.covid.domain.location;

import app.metatron.extensions.covid.domain.CollectionPatch;
import app.metatron.extensions.covid.util.AuthUtils;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
@Table(name = "favorite_location")
@NoArgsConstructor
@Getter @Setter
public class FavoriteLocation {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
  @GenericGenerator(name = "native", strategy = "native")
  @Column(name = "id")
  private Long id;

  @Column(name = "username")
  private String username;

  @Column(name = "location_name")
  private String locationName;

  @Column(name = "location_code")
  private String locationCode;

  @Column(name = "seq")
  private Integer seq;

  @Transient
  @JsonProperty
  private Double locationScore;

  @Builder
  public FavoriteLocation(Long id, String username, String locationName, String locationCode, Integer seq) {
    this.id = id;
    setUsername(username);
    this.locationName = locationName;
    this.locationCode = locationCode;
    this.seq = seq;
  }

  public FavoriteLocation(CollectionPatch patch) {
    this.username = AuthUtils.getAuthUserName();
    this.locationName = patch.getValue("locationName");
    this.locationCode = patch.getValue("locationCode");
    this.seq = patch.getValue("seq");
  }

  public void update(CollectionPatch patch) {

    if(patch.hasProperty("locationName")) {
      this.locationName = patch.getValue("locationName");
    }

    if(patch.hasProperty("locationCode")) {
      this.locationCode = patch.getValue("locationCode");
    }

    if(patch.hasProperty("seq")) {
      this.seq = patch.getValue("seq");
    }
  }

  /**
   * Set a temporary username
   *
   * @param username
   */
  public void setUsername(String username) {
    if(StringUtils.isEmpty(username)) {
      this.username = AuthUtils.getAuthUserName();
    } else {
      this.username = username;
    }
  }
}
