package app.metatron.extensions.covid.domain.storage;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class DruidSqlRequest {

    String query;

    @JsonCreator
    @Builder
    public DruidSqlRequest(@JsonProperty("query") String query) {
        this.query = query;
    }
}
