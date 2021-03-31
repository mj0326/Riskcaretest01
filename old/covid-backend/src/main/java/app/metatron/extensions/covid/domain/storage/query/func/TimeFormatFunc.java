package app.metatron.extensions.covid.domain.storage.query.func;

import lombok.Getter;
import org.apache.commons.lang3.StringUtils;

@Getter
public class TimeFormatFunc extends AbstractQueryFunction implements QueryFunction {

    private final static String FUNC_NAME = "TIME_FORMAT";

    /**
     * column name or expression
     */
    String expr;

    /**
     * Time Format
     * ref : https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html
     */
    String format;

    /**
     * if provided, should be a time zone name like "America/Los_Angeles" or offset like "-08:00". Pattern and time zone must be literals.
     */
    String timezone;

    public TimeFormatFunc(String expr, String format) {
        super(FUNC_NAME);
        this.expr = expr;
        this.format = format;
    }

    public TimeFormatFunc(String expr, String format, String timezone) {
        super(FUNC_NAME);
        this.expr = expr;
        this.format = format;
        this.timezone = timezone;
    }

    public String build() {

        StringBuilder sb = new StringBuilder(getName());
        sb.append("(");
        sb.append(expr);
        sb.append(", ").append("'").append(format).append("'");

        if(StringUtils.isNotEmpty(timezone)) {
            sb.append(", ").append("'").append(timezone).append("'");
        }

        sb.append(")");

        return sb.toString();
    }

}
