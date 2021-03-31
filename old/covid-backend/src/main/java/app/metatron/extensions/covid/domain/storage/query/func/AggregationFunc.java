package app.metatron.extensions.covid.domain.storage.query.func;

import app.metatron.extensions.covid.domain.storage.unit.Aggregation;
import app.metatron.extensions.covid.domain.storage.unit.ExtractUnit;
import lombok.Getter;
import org.apache.commons.lang3.EnumUtils;
import org.apache.commons.lang3.StringUtils;

@Getter
public class AggregationFunc extends AbstractQueryFunction implements QueryFunction {

    /**
     * column name or expression
     */
    String expr;

    /**
     * Filter, WHERE clause
     */
    String filterCondition;

    public AggregationFunc(Aggregation aggregation, String expr) {
        this(aggregation, expr, null);
    }

    public AggregationFunc(Aggregation aggregation, String expr, String filterCondition) {
        super(aggregation.name());
        this.expr = expr;
        this.filterCondition = filterCondition;
    }

    public String build() {

        StringBuilder sb = new StringBuilder(getName());
        sb.append("(");
        sb.append(expr);
        sb.append(")");

        // FILTER(WHERE statement)
        if(StringUtils.isNotEmpty(filterCondition)) {
            sb.append(" ").append("FILTER(WHERE").append(" ");
            sb.append(filterCondition);
            sb.append(")");
        }

        return sb.toString();
    }

}
