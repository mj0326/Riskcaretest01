package app.metatron.extensions.covid.domain.storage.query.func;

import app.metatron.extensions.covid.domain.storage.unit.ExtractUnit;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class TimeExtractFuncTest {

    @Test
    public void should_covertTimeExtractFuncToStmt() {
        assertThat(new TimeExtractFunc("\"__time\"", ExtractUnit.HOUR).build())
                .isEqualTo("TIME_EXTRACT(\"__time\", 'HOUR')");

        assertThat(new TimeExtractFunc("\"__time\"",ExtractUnit.HOUR, "Asia/Seoul").build())
                .isEqualTo("TIME_EXTRACT(\"__time\", 'HOUR', 'Asia/Seoul')");
    }
}