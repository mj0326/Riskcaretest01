package app.metatron.extensions.covid.util;

import org.assertj.core.util.Lists;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.*;

class JodaTimeUtilsTest {

    @Test
    public void should_GetUnionIntervalFromIntervalStrings() {

        List<String> unionIntervalStrs = Lists.newArrayList(
                "2020-01-01T00:00:00+09:00/2020-01-02T00:00:00+09:00",
                "2020-01-04T00:00:00+09:00/2020-01-05T00:00:00+09:00",
                "2020-01-02T00:00:00+09:00/2020-01-03T00:00:00+09:00"
        );

        assertThat(JodaTimeUtils.unionInterval(unionIntervalStrs))
                .isEqualTo("2020-01-01T00:00:00.000+09:00/2020-01-05T00:00:00.000+09:00");

    }
}