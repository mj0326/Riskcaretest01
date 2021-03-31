package app.metatron.extensions.covid.domain.event;

import app.metatron.extensions.covid.domain.AbstractHistoryEntity;
import app.metatron.extensions.covid.util.AuthUtils;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;

import javax.persistence.*;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Table(name = "event")
@Entity
@Getter @Setter
@NoArgsConstructor
@JsonDeserialize(using = Event.EventDeserializer.class)
public class Event extends AbstractHistoryEntity {

  @Id
  @GeneratedValue(generator = "uuid")
  @GenericGenerator(name = "uuid", strategy = "uuid2")
  @Column(name = "id")
  String id;

  @Column(name = "summary")
  String summary;

  @Column(name = "description")
  String description;

  @Column(name = "location")
  String location;

  @Column(name = "location_code")
  String locationCode;

  @Column(name = "username")
  String username;

  @Column(name = "start_time")
  @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentDateTime")
  DateTime startTime;

  @Column(name = "end_time")
  @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentDateTime")
  DateTime endTime;

  @Transient
  @JsonProperty
  private Double locationScore;

  @Builder
  public Event(String summary, String description, String location, String locationCode,
               String username, DateTime startTime, DateTime endTime) {
    this.summary = summary;
    this.description = description;
    this.location = location;
    this.locationCode = locationCode;
    setUsername(username);
    this.startTime = startTime;
    this.endTime = endTime;
  }

  public void update(Map<String, Object> updates) {

    if(updates.containsKey("summary")) {
      this.summary = (String) updates.get("summary");
    }

    if(updates.containsKey("description")) {
      this.description = (String) updates.get("description");
    }

    if(updates.containsKey("location")) {
      this.location = (String) updates.get("location");
    }

    if(updates.containsKey("locationCode")) {
      this.locationCode = (String) updates.get("locationCode");
    }

    if(updates.containsKey("startTime")) {
      this.startTime = DateTime.parse((String) updates.get("startTime"));
    }

    if(updates.containsKey("endTime")) {
      this.endTime = DateTime.parse((String) updates.get("endTime"));
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

  public static class EventDeserializer extends JsonDeserializer {

    @Override
    public Object deserialize(JsonParser jsonParser, DeserializationContext deserializationContext)
            throws IOException, JsonProcessingException {

      ObjectCodec objectCodec = jsonParser.getCodec();
      JsonNode jsonNode = objectCodec.readTree(jsonParser);

      Event event = new Event();
      if (jsonNode.has("summary")) {
        event.setSummary(jsonNode.get("summary").asText());
      }

      if (jsonNode.has("description")) {
        event.setDescription(jsonNode.get("description").asText());
      }

      if (jsonNode.has("location")) {
        event.setLocation(jsonNode.get("location").asText());
      }

      if (jsonNode.has("locationCode")) {
        event.setLocationCode(jsonNode.get("locationCode").asText());
      }

      if (jsonNode.has("username")) {
        event.setUsername(jsonNode.get("username").asText());
      } else {
        event.setUsername(AuthUtils.getAuthUserName());
      }

      if (jsonNode.has("startTime")) {
        event.setStartTime(DateTime.parse(jsonNode.get("startTime").asText()));
      }

      if (jsonNode.has("endTime")) {
        event.setEndTime(DateTime.parse(jsonNode.get("endTime").asText()));
      }

      return event;
    }
  }
}
