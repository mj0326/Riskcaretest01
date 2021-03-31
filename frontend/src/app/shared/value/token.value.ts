import {Result} from "@shared/value/common.value";


export class Token {


}

/**
 * login Token
 */
export class Login {

  // 토큰
  public access_token: string;

}

export class LoginResult extends Result {
  // Data
  public data: Login;
}
