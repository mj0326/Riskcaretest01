package app.metatron.extensions.covid.domain.storage.unit;

import org.joda.time.DateTime;

public enum ExtractUnit {

    EPOCH, MICROSECOND, MILLISECOND, SECOND, MINUTE, HOUR, DAY, DOW, ISODOW, DOY, WEEK, MONTH, QUARTER, YEAR, ISOYEAR, DECADE, CENTURY, MILLENNIUM;

    public static ExtractUnit fromGranularity(Granularity granularity) {
        if(granularity == Granularity.DAY) {
            return DAY;
        } else if(granularity == Granularity.HOUR) {
            return HOUR;
        } else if(granularity == Granularity.MINUTE) {
            return MINUTE;
        } else if(granularity == Granularity.SECOND) {
            return SECOND;
        }
        return DAY;
    }

    public Integer getValueByExtraction(DateTime dateTime) {
        switch (this) {
            case DAY:
                return dateTime.getDayOfMonth();
            case HOUR:
                return dateTime.getHourOfDay();
            case MINUTE:
                return dateTime.getMinuteOfHour();
            case SECOND:
                return dateTime.getSecondOfMinute();
        }

        return dateTime.getHourOfDay();
    }
}
