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

package app.metatron.extensions.covid.common.exceptions;

public enum GlobalErrorCodes implements ErrorCodes {

  UNKNOWN_SERVER_ERROR_CODE("GB0001", "msg.comm.unknown.error"),
  NOT_FOUND_CODE("GB0002", "msg.comm.resource.notfound"),
  BAD_REQUEST_CODE("GB0003", "msg.comm.bad.request"),
  ACCESS_DENIED_CODE("GB0004", "msg.comm.access.denied"),
  AUTH_ERROR_CODE("GB0005", "msg.comm.auth.error"),
  INVALID_USERNAME_PASSWORD_CODE("GB0006", "msg.comm.invalid.user.info"),
  INVALID_TOKEN_CODE("GB0007", "msg.comm.invalid.token");

  String code;

  String resource;

  GlobalErrorCodes(String code) {
    this.code = code;
  }

  GlobalErrorCodes(String code, String resource) {
    this.code = code;
    this.resource = resource;
  }

  @Override
  public String getCode() {
    return code;
  }

  @Override
  public String getResource() {
    return resource;
  }

}
