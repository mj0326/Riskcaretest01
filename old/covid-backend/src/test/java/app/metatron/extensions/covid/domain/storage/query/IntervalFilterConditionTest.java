package app.metatron.extensions.covid.domain.storage.query;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

class IntervalFilterConditionTest {

    @Test
    public void whenIntervalString_thenConvertingWhereCondition() {
        IntervalFilterCondition condition = new IntervalFilterCondition("2020-01-01T00:00:00+09:00/2020-01-02T00:00:00+09:00");

        assertThat(condition.build())
                .isEqualTo(" \"__time\">='2019-12-31 15:00:00' AND \"__time\"<'2020-01-01 15:00:00' ");
    }
}