package app.metatron.extensions.covid.domain.storage.query;

import app.metatron.extensions.covid.domain.storage.unit.Granularity;
import org.joda.time.Interval;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

public class IntervalFilterCondition {

    String startDateTime;

    String endDateTime;

    public IntervalFilterCondition(String intervalStr) {
        Interval interval = Interval.parse(intervalStr);

        DateTimeFormatter fmt = DateTimeFormat.forPattern(Granularity.SECOND.getPattern()).withZoneUTC();

        startDateTime = fmt.print(interval.getStart());
        endDateTime = fmt.print(interval.getEnd());
    }

    public String build() {
        StringBuilder sb = new StringBuilder();
        sb.append(" ");
        sb.append("\"__time\"").append(">=").append("'").append(startDateTime).append("'");
        sb.append(" AND ");
        sb.append("\"__time\"").append("<").append("'").append(endDateTime).append("'");
        sb.append(" ");

        return sb.toString();
    }
}
