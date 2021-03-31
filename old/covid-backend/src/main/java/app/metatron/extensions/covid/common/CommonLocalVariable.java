/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package app.metatron.extensions.covid.common;

import lombok.Getter;
import lombok.Setter;


/**
 * Local Variable
 */
public class CommonLocalVariable {

  private static final ThreadLocal<LocalVariable> managementsThreadLocal =
      new ThreadLocal<LocalVariable>() {
        protected LocalVariable initialValue() {
          return new LocalVariable();
        }
      };

  public static LocalVariable getLocalVariable() {
    return managementsThreadLocal.get();
  }

  public static void remove() {
    managementsThreadLocal.remove();
  }

  @Getter @Setter
  public static class LocalVariable {

    String userId;

  }
}
