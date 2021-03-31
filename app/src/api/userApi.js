import {instance} from "./api";
import {HOST} from "../config";


/**
 * 로그인
 */
export const signIn = async (param) => {

  param.username = param.login;
  param.password = `${param.username}${param.userType}`;
  param.rememberMe = true;

  const response = await instance.post(
    HOST + '/api/authenticate',
    param
  );

  return response;
}
/*
* 회원가입
*/
export const signUp = async (param) => {

  console.log(param);
  param.password = `${param.login}${param.userType}`
  param.langKey = 'ko';
  param.imageUrl = '';

  const {data} = await instance.post(
    HOST + '/apps/user/register',
    param
  );

  return data;
};

/**
 * User Me
 */
export const getUserMe = async () => {
  const {data} = await instance.get(
    HOST + `/apps/user/me`,
  )
  return data;
}

/**
 * 중복 회원가입 체크
 */
export const checkExist = async (loginId) => {
  const {data} = await instance.get(HOST + `/apps/user/exist?loginId=${loginId}`,)
  return data;
}
