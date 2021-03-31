package app.metatron.extensions.covid.util;

import com.google.common.base.Preconditions;
import org.apache.commons.collections4.CollectionUtils;
import org.joda.time.DateTime;
import org.joda.time.Interval;

import java.util.List;

public class JodaTimeUtils {

    /**
     * Produce a new Interval string from the multiple interval texts.
     *
     * @param intervals
     * @return
     */
    public static String unionInterval(List<String> intervals) {
        Preconditions.checkArgument(CollectionUtils.isNotEmpty(intervals));

        try {
            if (intervals.size() == 1) {
                Interval.parse(intervals.get(0));
                return intervals.get(0);
            } else {
                Interval unionInterval = null;
                for (String interval : intervals) {
                    Interval tempInterval = Interval.parse(interval);

                    if (unionInterval == null) {
                        unionInterval = tempInterval;
                        continue;
                    }

                    unionInterval = unionInterval(unionInterval, tempInterval);
                }
                return unionInterval.toString();
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid interval strings : 'intervals'");
        }
    }

    /**
     *
     * Produce a new Interval instance from the outer limits of any pair of Intervals.
     *
     * @param firstInterval
     * @param secondInterval
     * @return
     */
    public static Interval unionInterval(Interval firstInterval, Interval secondInterval) {

        // Take the earliest of both starting date-times.
        DateTime start = firstInterval.getStart().isBefore(secondInterval.getStart()) ? firstInterval.getStart() : secondInterval.getStart();
        // Take the latest of both ending date-times.
        DateTime end = firstInterval.getEnd().isAfter(secondInterval.getEnd()) ? firstInterval.getEnd() : secondInterval.getEnd();
        // Instantiate a new Interval from the pair of DateTime instances.
        Interval unionInterval = new Interval(start, end);

        return unionInterval;
    }
}
