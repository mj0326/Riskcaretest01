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

package app.metatron.extensions.covid.domain;

import app.metatron.extensions.covid.util.AuthUtils;
import lombok.Data;
import org.hibernate.annotations.Type;
import org.joda.time.DateTime;

import javax.persistence.*;

/**
 *
 */
@MappedSuperclass
@Data
public abstract class AbstractHistoryEntity {

  @Column(name = "version")
  @Version
  protected int version;

  @Column(name = "created_by")
  protected String createdBy;

  @Column(name = "created_time")
  @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentDateTime")
  protected DateTime createdTime;

  @Column(name = "modified_by")
  protected String modifiedBy;

  @Column(name = "modified_time")
  @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentDateTime")
  protected DateTime modifiedTime;

  @PrePersist
  public void prePersist() {
    createdBy = AuthUtils.getAuthUserName();
    modifiedBy = AuthUtils.getAuthUserName();
    createdTime = DateTime.now();
    modifiedTime = createdTime;
  }

  @PreUpdate
  public void preUpdate() {
    modifiedBy = AuthUtils.getAuthUserName();
    modifiedTime = DateTime.now();
  }
}
