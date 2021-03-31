package app.metatron.extensions.covid.domain.storage.query.func;

public abstract class AbstractQueryFunction implements QueryFunction {

    /**
     * Name of Function
     */
    String name;

    public AbstractQueryFunction(final String name) {
        this.name = name;
    }

    @Override
    public String getName() {
        return name;
    }
}
