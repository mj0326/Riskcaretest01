export class CommonCode {
  public SUCCESS: number = 200;
  public INVALID_REQUEST: number = 400;
  public UNAUTHORIZED: number = 401;
  public FORBIDDEN: number = 403;
  public METHOD_NOT_ALLOWED = 405;
  public REQUEST_TIMEOUT: number = 408;
  public SERVER_ERROR: number = 500;
  public GATEWAY_TIMEOUT: number = 504;
  public FAIL: number = -1;
}

export class ResultCode {
  public SUCCESS: string = '0000';
  public PROJ_DELETE_FAIL: string = '8888';
  public FAIL_EXIST_CHECK_PROJECT = '8887';    // 프로젝트 리소스 삭제 실패
  public FAIL: string = '0001';
  public SUCCESS_PASSWORD_EXPIRATION = '0003';        // 기간 만료
  public LOGIN_LOCK_FAIL = '0004';        // 로그인 락
  public EXPIRED_ACCESS_TOKEN = '0005';
  public DUPLICATE_LOGIN = '0006';
}

export class LocalStorageKey {

  // 로그인 모드
  public LOGIN_MODE = 'ADMIN_LOGIN_MODE';

}

export class CommonConstant {
  public static CODE: CommonCode = new CommonCode();
  public static RESULT_CODE: ResultCode = new ResultCode();
  public static LOCAL_STORAGE_KEY = new LocalStorageKey();

}



