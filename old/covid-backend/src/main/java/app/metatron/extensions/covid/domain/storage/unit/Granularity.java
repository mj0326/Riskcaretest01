package app.metatron.extensions.covid.domain.storage.unit;

import org.joda.time.DateTime;

public enum Granularity {

    DAY("yyyy-MM-dd"),
    HOUR("yyyy-MM-dd HH"),
    MINUTE("yyyy-MM-dd HH:mm"),
    SECOND("yyyy-MM-dd HH:mm:ss"),
    COVID_STAT("yyyy.MM.dd");

    private String pattern;

    Granularity(String pattern) {
        this.pattern = pattern;
    }

    public String getPattern() {
        return pattern;
    }

    /**
     * Plus datetime by granularity unit
     *
     * @param dateTime
     * @param i
     * @return
     */
    public DateTime plus(DateTime dateTime, int i) {
        switch (this) {
            case DAY:
            case COVID_STAT:
                return dateTime.plusDays(i);
            case HOUR:
                return dateTime.plusHours(i);
            case MINUTE:
                return dateTime.plusMinutes(i);
            case SECOND:
                return dateTime.plusSeconds(i);
        }
        return dateTime;
    }
}
