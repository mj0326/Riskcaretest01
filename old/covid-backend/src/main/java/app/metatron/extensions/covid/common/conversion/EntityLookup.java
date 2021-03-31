package app.metatron.extensions.covid.common.conversion;

import org.springframework.plugin.core.Plugin;

import java.util.Optional;

/**
 * SPI to customize which property of an entity is used as unique identifier and how the entity instance is looked up
 * from the backend. Prefer to extend {@link EntityLookupSupport} to let the generics declaration be used for the
 * {@link #supports(Object)} method automatically.
 *
 * @author Oliver Gierke
 * @see EntityLookupSupport
 * @since 2.5
 * @soundtrack Elephants Crossing - Echo (Live at Stadtfest Dresden -
 *             https://soundcloud.com/elephants-crossing/sets/live-at-stadtfest-dresden)
 */
public interface EntityLookup<T> extends Plugin<Class<?>> {

  /**
   * Returns the property of the given entity that shall be used to uniquely identify it. If no {@link EntityLookup} is
   * defined for a particular type, a standard identifier lookup mechanism (i.e. the datastore identifier) will be used
   * to eventually create an identifying URI.
   *
   * @param entity will never be {@literal null}.
   * @return must not be {@literal null}.
   */
  Object getResourceIdentifier(T entity);

  /**
   * Returns the entity instance to be used if an entity with the given identifier value is requested. Implementations
   * will usually forward the call to a repository method explicitly and can assume the given value be basically the
   * value they returned in {@link #getResourceIdentifier(Object)}.
   * <p>
   * Implementations are free to return {@literal null} to indicate absence of a value or wrap the result into any
   * generally supported {@code Optional} type.
   *
   * @param id will never be {@literal null}.
   * @return can be {@literal null}.
   */
  Optional<T> lookupEntity(Object id);
}