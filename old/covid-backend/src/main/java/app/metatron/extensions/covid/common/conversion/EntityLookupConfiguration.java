package app.metatron.extensions.covid.common.conversion;

import org.springframework.core.convert.converter.Converter;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.core.RepositoryInformation;
import org.springframework.data.repository.core.support.AbstractRepositoryMetadata;
import org.springframework.data.repository.support.Repositories;
import org.springframework.data.util.StreamUtils;
import org.springframework.lang.NonNull;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Configuration instance to implement {@link EntityLookupRegistrar}.
 *
 * @author Oliver Gierke
 * @since 2.5
 */
public class EntityLookupConfiguration implements EntityLookupRegistrar {

  private final List<LookupInformation<Object, Object, Repository<? extends Object, ?>>> lookupInformation = new ArrayList<>();
  private final List<Class<?>> lookupTypes = new ArrayList<>();

  /*
   * (non-Javadoc)
   * @see org.springframework.data.rest.core.config.EntityLookupRegistrar#forRepository(java.lang.Class, org.springframework.core.convert.converter.Converter, org.springframework.data.rest.core.config.EntityLookupRegistrar.LookupRegistrar.Lookup)
   */
  @Override
  public <T, ID, R extends Repository<T, ?>> EntityLookupRegistrar forRepository(Class<R> repositoryType,
                                                                                 Converter<T, ID> converter, LookupRegistrar.Lookup<R, ID> lookup) {

    new MappingBuilder<T, ID, R>(repositoryType).withIdMapping(converter).withLookup(lookup);
    return this;
  }

  /*
   * (non-Javadoc)
   * @see org.springframework.data.rest.core.config.EntityLookupRegistrar#forValueRepository(java.lang.Class)
   */
  @Override
  public <T, ID, R extends Repository<T, ?>> IdMappingRegistrar<T, R> forLookupRepository(Class<R> type) {
    this.lookupTypes.add(AbstractRepositoryMetadata.getMetadata(type).getDomainType());
    return forRepository(type);
  }

  /*
   * (non-Javadoc)
   * @see org.springframework.data.rest.core.config.EntityLookupRegistrar#forRepository(java.lang.Class)
   */
  @Override
  public <T, ID, R extends Repository<T, ?>> IdMappingRegistrar<T, R> forRepository(Class<R> type) {
    return new MappingBuilder<T, ID, R>(type);
  }

  /*
   * (non-Javadoc)
   * @see org.springframework.data.rest.core.config.EntityLookupRegistrar#forValueRepository(java.lang.Class, org.springframework.core.convert.converter.Converter, org.springframework.data.rest.core.config.EntityLookupRegistrar.LookupRegistrar.Lookup)
   */
  @Override
  public <T, ID, R extends Repository<T, ?>> EntityLookupRegistrar forValueRepository(Class<R> type,
                                                                                      Converter<T, ID> identifierMapping, LookupRegistrar.Lookup<R, ID> lookup) {

    this.lookupTypes.add(AbstractRepositoryMetadata.getMetadata(type).getDomainType());
    return forRepository(type, identifierMapping, lookup);
  }

  /**
   * Custom builder implementation to back {@link LookupRegistrar} and {@link IdMappingRegistrar}.
   *
   * @author Oliver Gierke
   */
  private class MappingBuilder<T, ID, R extends Repository<T, ?>>
      implements LookupRegistrar<T, ID, R>, IdMappingRegistrar<T, R> {

    private @NonNull final Class<R> repositoryType;
    private Converter<T, ID> idMapping;

    public MappingBuilder(Class<R> repositoryType) {
      this.repositoryType = repositoryType;
    }

    /**
     * Creates a new {@link MappingBuilder} using the given repository type and identifier mapping.
     *
     * @param repositoryType must not be {@literal null}.
     * @param mapping must not be {@literal null}.
     */
    private MappingBuilder(Class<R> repositoryType, Converter<T, ID> mapping) {

      this(repositoryType);

      Assert.notNull(mapping, "Converter must not be null!");

      this.idMapping = mapping;
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.rest.core.config.EntityLookupRegistrar.LookupRegistrar#withLookup(org.springframework.data.rest.core.config.EntityLookupRegistrar.LookupRegistrar.Lookup)
     */
    @Override
    @SuppressWarnings("unchecked")
    public EntityLookupRegistrar withLookup(Lookup<R, ID> lookup) {

      EntityLookupConfiguration.this.lookupInformation
          .add((LookupInformation<Object, Object, Repository<? extends Object, ?>>) new LookupInformation<T, ID, R>(
              repositoryType, idMapping, lookup));

      return EntityLookupConfiguration.this;
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.rest.core.config.EntityLookupRegistrar.IdMappingRegistrar#withIdMapping(org.springframework.core.convert.converter.Converter)
     */
    @Override
    public <ID2> LookupRegistrar<T, ID2, R> withIdMapping(Converter<T, ID2> idMapping) {
      return new MappingBuilder<T, ID2, R>(repositoryType, idMapping);
    }
  }

  /**
   * Returns the {@link EntityLookup}s registered on this configuration.
   *
   * @param repositories must not be {@literal null}.
   * @return
   */
  public List<EntityLookup<?>> getEntityLookups(Repositories repositories) {

    Assert.notNull(repositories, "Repositories must not be null!");

    return lookupInformation.stream()//
                            .map(it -> new RepositoriesEntityLookup<>(repositories, it))//
                            .collect(StreamUtils.toUnmodifiableList());
  }

  public boolean isLookupType(Class<?> type) {
    return this.lookupTypes.contains(type);
  }

  /**
   * An {@link EntityLookup} backed by a repository instance and a {@link LookupInformation}.
   *
   * @author Oliver Gierke
   */
  private static class RepositoriesEntityLookup<T> implements EntityLookup<T> {

    private final LookupInformation<Object, Object, Repository<? extends T, ?>> lookupInfo;
    private final Repository<? extends T, ?> repository;
    private final Class<?> domainType;

    /**
     * Creates a new {@link RepositoriesEntityLookup} for the given {@link Repositories} and {@link LookupInformation}.
     *
     * @param repositories must not be {@literal null}.
     * @param lookupInformation must not be {@literal null}.
     */
    @SuppressWarnings("unchecked")
    public RepositoriesEntityLookup(Repositories repositories,
                                    LookupInformation<Object, Object, Repository<? extends T, ?>> lookupInformation) {

      Assert.notNull(repositories, "Repositories must not be null!");
      Assert.notNull(lookupInformation, "LookupInformation must not be null!");

      RepositoryInformation information = repositories.getRepositoryInformation(lookupInformation.repositoryType)//
                                                      .orElseThrow(() -> new IllegalStateException(
                                                          "No repository found for type " + lookupInformation.repositoryType.getName() + "!"));

      this.domainType = information.getDomainType();
      this.lookupInfo = lookupInformation;
      this.repository = (Repository<? extends T, ?>) repositories.getRepositoryFor(information.getDomainType())//
                                                                 .orElseThrow(() -> new IllegalStateException(
                                                                     "No repository found for type " + information.getDomainType().getName() + "!"));
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.rest.core.support.EntityLookup#getResourceIdentifier(java.lang.Object)
     */
    @Override
    public Object getResourceIdentifier(T entity) {
      return lookupInfo.getIdentifierMapping().convert(entity);
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.rest.core.support.EntityLookup#lookupEntity(java.io.Serializable)
     */
    @Override
    @SuppressWarnings("unchecked")
    public Optional<T> lookupEntity(Object id) {

      Object result = lookupInfo.getLookup().lookup(repository, id);

      return Optional.class.isInstance(result) ? (Optional<T>) result : Optional.ofNullable((T) result);
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.plugin.core.Plugin#supports(java.lang.Object)
     */
    @Override
    public boolean supports(Class<?> delimiter) {
      return domainType.isAssignableFrom(delimiter);
    }
  }

  private static class LookupInformation<T, ID, R extends Repository<? extends T, ?>> {

    private final Class<R> repositoryType;
    private final Converter<T, ID> identifierMapping;
    private final LookupRegistrar.Lookup<R, ID> lookup;

    public LookupInformation(Class<R> repositoryType, Converter<T, ID> identifierMapping, LookupRegistrar.Lookup<R, ID> lookup) {
      this.repositoryType = repositoryType;
      this.identifierMapping = identifierMapping;
      this.lookup = lookup;
    }

    public Class<R> getRepositoryType() {
      return repositoryType;
    }

    public Converter<T, ID> getIdentifierMapping() {
      return identifierMapping;
    }

    public LookupRegistrar.Lookup<R, ID> getLookup() {
      return lookup;
    }
  }
}
