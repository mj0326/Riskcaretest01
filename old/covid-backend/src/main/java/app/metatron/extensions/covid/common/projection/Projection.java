package app.metatron.extensions.covid.common.projection;

import java.lang.annotation.*;

/**
 * Annotation to tie a particular projection type to a source type. Used to find projection interfaces at startup time.
 *
 */
@Inherited
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.TYPE, ElementType.ANNOTATION_TYPE })
public @interface Projection {

  /**
   * The type the projection type is bound to.
   *
   * @return
   */
  Class<?>[] types();

  /**
   * The name of projection to refer to.
   *
   * @return
   */
  String name() default "";
}
