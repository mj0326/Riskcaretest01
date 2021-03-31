package app.metatron.extensions.covid.domain.storage.query.func;

import app.metatron.extensions.covid.domain.storage.unit.Aggregation;
import app.metatron.extensions.covid.domain.storage.unit.ExtractUnit;
import app.metatron.extensions.covid.domain.storage.unit.Granularity;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AggregationFuncTest {

    @Test
    public void should_covertAggregationFuncToStmt() {
        assertThat(new AggregationFunc(Aggregation.SUM, "\"col\"").build())
                .isEqualTo("SUM(\"col\")");

        assertThat(new AggregationFunc(Aggregation.SUM, "\"col\"", "a = 'b'").build())
                .isEqualTo("SUM(\"col\") FILTER(WHERE a = 'b')");
    }
}