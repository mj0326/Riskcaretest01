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

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import org.apache.commons.lang3.exception.ExceptionUtils;

import java.io.Serializable;

/**
 * Error response model
 */
@JsonPropertyOrder({ "code", "resource", "message", "details" })
public class ErrorResponse implements Serializable {
  /**
   * 에러 코드
   */
  String code;

  /**
   * Resource code, if exist
   */
  String resource;

  /**
   * 대표 에러 메시지
   */
  String message;

  /**
   * 상세 에러 메시지
   */
  Object details;

  public ErrorResponse() {
    // empty constructor
  }

  public ErrorResponse(ErrorCodes code, String message, Object details) {
    if(code != null) {
      this.code = code.getCode();
      this.resource = code.getResource();
    } else {
      this.code = GlobalErrorCodes.UNKNOWN_SERVER_ERROR_CODE.getCode();
      this.resource = GlobalErrorCodes.UNKNOWN_SERVER_ERROR_CODE.getResource();
    }
    this.message = message;
    this.details = details;
  }

  public ErrorResponse(MetatronException e) {
    this(e.getCode(), e.getMessage(), ExceptionUtils.getStackTrace(e));
  }

  public static ErrorResponse unknownError(Exception ex) {
    return new ErrorResponse(GlobalErrorCodes.UNKNOWN_SERVER_ERROR_CODE, MetatronException.DEFAULT_GLOBAL_MESSAGE, ExceptionUtils.getStackTrace(ex));
  }

  public String getCode() {
    return code;
  }

  public String getResource() {
    return resource;
  }

  public String getMessage() {
    return message;
  }

  public Object getDetails() {
    return details;
  }

  @Override
  public String toString() {
    return "ErrorResponse{" +
        "code='" + code + '\'' +
        ", resource='" + resource + '\'' +
        ", message='" + message + '\'' +
        ", details=" + details +
        '}';
  }
}
