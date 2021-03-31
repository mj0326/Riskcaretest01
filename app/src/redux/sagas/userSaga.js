import {ASYNC_STORAGE_KEY, COMMON_CODE} from "../../constants/Constants";
import {CHECK_USER_EXIST, GET_USER, SET_USER, SIGN_IN, SIGN_UP} from "../reducers/actionTypes";
import {checkExist, getUserMe, signIn, signUp} from "../../api/userApi";
import {call, put, takeLatest} from 'redux-saga/effects';
import RouteNames from "../../constants/RouteNames";
import * as RootNavigation from '../../navigators/RootNavigation';
import {storeAsyncStorage} from "./index";

/**
 * 회원가입
 * @param action
 * @returns {Generator<*, void, *>}
 */
function* signUpAsync(action) {
  try {
    const response = yield call(signUp, action.payload);

    if (response.code === COMMON_CODE.SUCCESS) {
      console.log('==== 회원가입 성공 ====');
      console.log(response);

      RootNavigation.navigate(RouteNames.MyPage);
      yield put({ type: SIGN_IN, payload: action.payload });
    } else {
      console.log('==== 회원가입 실패 ====');
    }
  } catch (e) {
    console.log(e);
  }
}

/**
 * 유저 정보 조회
 */
function* getUserMeAsync(action) {
  try {
    const response = yield call(getUserMe);

    if (response.code === COMMON_CODE.SUCCESS) {
      console.log('==== 유저 정보 조회 성공 ====');
      console.log(response);
      yield put({type: SET_USER, payload: response.data});
    } else {
      console.log('==== 유저 정보 조회 실패 ====');
      yield put({type: SET_USER, payload: undefined});
    }

  } catch (e) {
  }
}

/**
 * 중복 회원가입 체크
 */
function* checkExistAsync(action) {
  try {
    const response = yield call(checkExist, action.payload.login);

    if (response.code === COMMON_CODE.SUCCESS) {
      console.log('==== 중복 회원가입 조회 성공 ====');
      console.log(response);
      if (response.data) {
        yield put({type: SIGN_IN, payload: action.payload});
      } else {
        RootNavigation.navigate(RouteNames.AgreeTerm);
      }
    } else {
      console.log('==== 중복 회원가입 조회 실패 ====');
      alert('에러 발생')
    }

  } catch (e) {
    console.log(e);
  }
}

/**
 * 로그인
 */
function* signInAsync(action) {
  try {
    const response = yield call(signIn, action.payload)

    if (response.status === 200) {
      console.log(response.data.id_token);
      yield call(storeAsyncStorage, ASYNC_STORAGE_KEY.USER_TYPE, action.payload.userType);
      yield call(storeAsyncStorage, ASYNC_STORAGE_KEY.USER_ID, action.payload.login);
      yield call(storeAsyncStorage, ASYNC_STORAGE_KEY.ACCESS_TOKEN, response.data.id_token);
      yield put({type: GET_USER, payload: action.payload});
    } else {
      alert('에러 발생')
      RootNavigation.navigate(RouteNames.AgreeTerm);
    }

  } catch (e) {
    console.log(e);
  }
}

export function* watchGetUserMe() {
  yield takeLatest(GET_USER, getUserMeAsync);
}

export function* watchSignUp() {
  yield takeLatest(SIGN_UP, signUpAsync);
}

export function* watchCheckExist() {
  yield takeLatest(CHECK_USER_EXIST, checkExistAsync);
}

export function* watchSignIn() {
  yield takeLatest(SIGN_IN, signInAsync);
}
