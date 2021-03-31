package app.metatron.extensions.covid.common.conversion;

import org.springframework.core.GenericTypeResolver;

/**
 * {@link EntityLookup} implementation base class to derive the supported domain type from the generics signature.
 *
 * @author Oliver Gierke
 * @since 2.5
 * @soundtrack Elephants Crossing - The New (Live at Stadtfest Dresden -
 *             https://soundcloud.com/elephants-crossing/sets/live-at-stadtfest-dresden)
 */
public abstract class EntityLookupSupport<T> implements EntityLookup<T> {

  private final Class<?> domainType;

  /**
   * Creates a new {@link EntityLookupSupport} instance discovering the supported type from the generics signature.
   */
  public EntityLookupSupport() {
    this.domainType = GenericTypeResolver.resolveTypeArgument(getClass(), EntityLookup.class);
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