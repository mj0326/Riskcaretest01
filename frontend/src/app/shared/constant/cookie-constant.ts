/**
 * 쿠키 Key 상수
 */
export class CookieKey {
  // user id
  public readonly USER_ID = 'ADMIN_USER_ID';

  // token
  public readonly TOKEN = 'ADMIN_TOKEN';

  public readonly ACCESS_TOKEN = 'ACCESS_TOKEN';

  // refresh_token
  public readonly REFRESH_TOKEN = 'ADMIN_REFRESH_TOKEN';
  public readonly REDIRECTION = 'REDIRECTION';

  // location code list
  public readonly L_DONG_CDS = 'L_DONG_CDS';
}

export class CookieConstant {
  public static KEY: CookieKey = new CookieKey();
}
