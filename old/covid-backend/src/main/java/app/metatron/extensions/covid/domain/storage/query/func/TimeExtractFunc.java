package app.metatron.extensions.covid.domain.storage.query.func;

import app.metatron.extensions.covid.domain.storage.unit.ExtractUnit;
import lombok.Getter;
import org.apache.commons.lang3.EnumUtils;
import org.apache.commons.lang3.StringUtils;

@Getter
public class TimeExtractFunc extends AbstractQueryFunction implements QueryFunction {

    private final static String FUNC_NAME = "TIME_EXTRACT";

    /**
     * column name or expression
     */
    String expr;

    /**
     * Extract units
     * Unit can be EPOCH, MICROSECOND, MILLISECOND, SECOND, MINUTE, HOUR, DAY (day of month), DOW (day of week), ISODOW (ISO day of week), DOY (day of year), WEEK (week of year), MONTH, QUARTER, YEAR, ISOYEAR, DECADE, CENTURY or MILLENNIUM
     */
    ExtractUnit unit;

    String timezone;

    public TimeExtractFunc(String expr, ExtractUnit unit) {
        super(FUNC_NAME);
        this.expr = expr;
        this.unit = unit;
    }

    public TimeExtractFunc(String expr, ExtractUnit unit, String timezone) {
        super(FUNC_NAME);
        this.expr = expr;
        this.unit = unit;
        this.timezone = timezone;
    }

    public String build() {

        // ex. TIME_EXTRACT(__time, 'HOUR', 'America/Los_Angeles')

        StringBuilder sb = new StringBuilder(getName());
        sb.append("(");
        sb.append(expr);
        sb.append(", ").append("'").append(unit.name()).append("'");

        if(StringUtils.isNotEmpty(timezone)) {
            sb.append(", ").append("'").append(timezone).append("'");
        }

        sb.append(")");

        return sb.toString();
    }

}
