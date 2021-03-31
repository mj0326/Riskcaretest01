package app.metatron.extensions.covid.domain.storage.query.func;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ExtractFuncTest {

    @Test
    public void should_covertTimeFormatFuncToStmt() {
        assertThat(new ExtractFunc("\"__time\"","day").build())
                .isEqualTo("EXTRACT(DAY FROM \"__time\")");
    }
}