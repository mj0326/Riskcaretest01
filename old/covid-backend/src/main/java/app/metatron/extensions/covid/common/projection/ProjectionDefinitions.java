package app.metatron.extensions.covid.common.projection;

/**
 * Interface to allow the lookup of a projection interface by source type and name. This allows the definition of
 * projections with the same name for different source types.
 *
 */
public interface ProjectionDefinitions {

  /**
   * Returns the projection type for the given source type and name.
   *
   * @param sourceType must not be {@literal null}.
   * @param name must not be {@literal null} or empty.
   * @return
   */
  Class<?> getProjectionType(Class<?> sourceType, String name);

  /**
   * Returns whether we have a projection registered for the given source type.
   *
   * @param sourceType must not be {@literal null}.
   * @return
   */
  boolean hasProjectionFor(Class<?> sourceType);

  /**
   * Returns the request parameter to be used to expose the projection to the web.
   *
   * @return the parameterName will never be {@literal null} or empty.
   */
  String getParameterName();
}

