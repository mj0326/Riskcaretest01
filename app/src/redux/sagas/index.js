import {all} from 'redux-saga/effects';
import {watchCheckExist, watchGetUserMe, watchSignIn, watchSignUp} from "./userSaga";
import AsyncStorage from "@react-native-community/async-storage";

export default function* rootSaga() {
  yield all([
    watchGetUserMe(),
    watchSignUp(),
    watchCheckExist(),
    watchSignIn()
  ])
}

export const storeAsyncStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log('AsyncStorage error during token store:', error);
  }
}
