package app.metatron.extensions.covid.domain.storage.query.func;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

class TimeFormatFuncTest {

    @Test
    public void should_covertTimeFormatFuncToStmt() {
        assertThat(new TimeFormatFunc("\"__time\"","yyyy-MM-dd").build())
                .isEqualTo("TIME_FORMAT(\"__time\", 'yyyy-MM-dd')");

        assertThat(new TimeFormatFunc("\"__time\"","yyyy-MM-dd", "Asia/Seoul").build())
                .isEqualTo("TIME_FORMAT(\"__time\", 'yyyy-MM-dd', 'Asia/Seoul')");
    }
}