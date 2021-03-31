package app.metatron.extensions.covid.common.conversion;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.support.RepositoryInvoker;
import org.springframework.data.repository.support.RepositoryInvokerFactory;
import org.springframework.plugin.core.OrderAwarePluginRegistry;
import org.springframework.plugin.core.PluginRegistry;
import org.springframework.util.Assert;
import org.springframework.util.MultiValueMap;

import java.lang.reflect.Method;
import java.util.List;
import java.util.Optional;

/**
 * {@link RepositoryInvokerFactory} that wraps the {@link RepositoryInvokerFactory} returned by the delegate with one
 * that automatically unwraps JDK 8 {@link Optional} and Guava {@link com.google.common.base.Optional}s.
 *
 * @author Oliver Gierke
 */
public class UnwrappingRepositoryInvokerFactory implements RepositoryInvokerFactory {

  private final RepositoryInvokerFactory delegate;
  private final PluginRegistry<EntityLookup<?>, Class<?>> lookups;

  /**
   * @param delegate must not be {@literal null}.
   * @param lookups must not be {@literal null}.
   */
  public UnwrappingRepositoryInvokerFactory(RepositoryInvokerFactory delegate,
                                            List<? extends EntityLookup<?>> lookups) {

    Assert.notNull(delegate, "Delegate RepositoryInvokerFactory must not be null!");
    Assert.notNull(lookups, "EntityLookups must not be null!");

    this.delegate = delegate;
    this.lookups = OrderAwarePluginRegistry.create(lookups);
  }

  /*
   * (non-Javadoc)
   * @see org.springframework.data.repository.support.RepositoryInvokerFactory#getInvokerFor(java.lang.Class)
   */
  @Override
  public RepositoryInvoker getInvokerFor(Class<?> domainType) {

    Optional<EntityLookup<?>> lookup = Optional.ofNullable(lookups.getPluginFor(domainType));

    return new UnwrappingRepositoryInvoker(delegate.getInvokerFor(domainType), lookup);
  }

  /**
   *
   */
  private static class UnwrappingRepositoryInvoker implements RepositoryInvoker {

    private final RepositoryInvoker delegate;
    private final Optional<EntityLookup<?>> lookup;

    public UnwrappingRepositoryInvoker(RepositoryInvoker delegate, Optional<EntityLookup<?>> lookup) {
      this.delegate = delegate;
      this.lookup = lookup;
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.repository.support.RepositoryInvoker#invokeFindOne(java.io.Serializable)
     */
    @Override
    @SuppressWarnings("unchecked")
    public <T> Optional<T> invokeFindById(Object id) {

      return lookup.isPresent() //
          ? (Optional<T>) lookup.flatMap(it -> it.lookupEntity(id)) //
          : delegate.invokeFindById(id);
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.repository.support.RepositoryInvoker#invokeQueryMethod(java.lang.reflect.Method, org.springframework.util.MultiValueMap, org.springframework.data.domain.Pageable, org.springframework.data.domain.Sort)
     */
    @Override
    public Optional<Object> invokeQueryMethod(Method method, MultiValueMap<String, ? extends Object> parameters,
                                              Pageable pageable, Sort sort) {
      return delegate.invokeQueryMethod(method, parameters, pageable, sort);
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.repository.support.RepositoryInvocationInformation#hasDeleteMethod()
     */
    @Override
    public boolean hasDeleteMethod() {
      return delegate.hasDeleteMethod();
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.repository.support.RepositoryInvocationInformation#hasFindAllMethod()
     */
    @Override
    public boolean hasFindAllMethod() {
      return delegate.hasFindAllMethod();
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.repository.support.RepositoryInvocationInformation#hasFindOneMethod()
     */
    @Override
    public boolean hasFindOneMethod() {
      return delegate.hasFindOneMethod();
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.repository.support.RepositoryInvocationInformation#hasSaveMethod()
     */
    @Override
    public boolean hasSaveMethod() {
      return delegate.hasSaveMethod();
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.repository.support.RepositoryInvoker#invokeDeleteById(java.lang.Object)
     */
    @Override
    public void invokeDeleteById(Object id) {
      delegate.invokeDeleteById(id);
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.repository.support.RepositoryInvoker#invokeFindAll(org.springframework.data.domain.Pageable)
     */
    @Override
    public Iterable<Object> invokeFindAll(Pageable pageable) {
      return delegate.invokeFindAll(pageable);
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.repository.support.RepositoryInvoker#invokeFindAll(org.springframework.data.domain.Sort)
     */
    @Override
    public Iterable<Object> invokeFindAll(Sort sort) {
      return delegate.invokeFindAll(sort);
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.repository.support.RepositoryInvoker#invokeSave(java.lang.Object)
     */
    @Override
    public <T> T invokeSave(T object) {
      return delegate.invokeSave(object);
    }
  }
}