package app.metatron.extensions.covid.domain.storage.query.func;

import app.metatron.extensions.covid.domain.storage.unit.ExtractUnit;
import app.metatron.extensions.covid.domain.storage.unit.Granularity;
import lombok.Getter;
import org.apache.commons.lang3.EnumUtils;
import org.apache.commons.lang3.StringUtils;

@Getter
public class ExtractFunc extends AbstractQueryFunction implements QueryFunction {

    private final static String FUNC_NAME = "EXTRACT";

    /**
     * column name or expression
     */
    String expr;

    /**
     * Extract units
     * Unit can be EPOCH, MICROSECOND, MILLISECOND, SECOND, MINUTE, HOUR, DAY (day of month), DOW (day of week), ISODOW (ISO day of week), DOY (day of year), WEEK (week of year), MONTH, QUARTER, YEAR, ISOYEAR, DECADE, CENTURY or MILLENNIUM
     */
    ExtractUnit unit;

    public ExtractFunc(String expr, String unit) {
        super(FUNC_NAME);
        this.expr = expr;
        this.unit = EnumUtils.getEnumIgnoreCase(ExtractUnit.class, unit, ExtractUnit.DAY);
    }

    public String build() {

        StringBuilder sb = new StringBuilder(getName());
        sb.append("(");
        sb.append(unit.name());
        sb.append(" FROM ");
        sb.append(expr);
        sb.append(")");

        return sb.toString();
    }

}
