import React, {useEffect} from 'react';
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {useDispatch, useSelector} from 'react-redux';
import KakaoLogins, {KAKAO_AUTH_TYPES} from '@react-native-seoul/kakao-login';
import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {useNavigation} from "@react-navigation/native";
import {CHECK_USER_EXIST, SET_GOOGLE_TOKENS, SET_USER_SIGN_UP} from "../../redux/reducers/actionTypes";
import RouteNames from "../../constants/RouteNames";
import AsyncStorage from "@react-native-community/async-storage";
import {ASYNC_STORAGE_KEY, USER_TYPE} from '../../constants/Constants';
import Images from '../../../assets/index';

const SocialLoginButtons = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {userSignUpDto} = useSelector(state => state.user);

  useEffect(() => {

  }, [])

  /**
   * 카카오 로그인 클릭
   */
  const onClickKakao = async () => {

    try {
      // 카카오 토큰 조회
      const tokenResult = await KakaoLogins.login([KAKAO_AUTH_TYPES.Talk]);
      console.log('==== 카카오 로그인 토큰  ====', tokenResult);
      const profileResult = await KakaoLogins.getProfile();
      console.log('==== 카카오 프로필 조회 ====', profileResult);

      if (tokenResult && profileResult) {
        userSignUpDto.login = profileResult.id;
        userSignUpDto.userName = profileResult.nickname
        userSignUpDto.userType = USER_TYPE.KAKAO;

        if (profileResult.email) {
          userSignUpDto.email = profileResult.email;
        }

        checkExistUser(userSignUpDto);
      }

    } catch (e) {
      console.log(e);
    }

  };

  /**
   * 구글 로그인 클릭
   */
  const onClickGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('=== USER_INFO ', userInfo);

      const tokens = await GoogleSignin.getTokens();
      console.log('=== TOKEN', tokens);
      dispatch({type: SET_GOOGLE_TOKENS, payload: tokens});

      if (userInfo) {
        userSignUpDto.login = userInfo.user.id;
        userSignUpDto.userType = USER_TYPE.GOOGLE;

        if (userInfo.user && userInfo.user.email) {
          userSignUpDto.email = userInfo.user.email;
        }

        if (userInfo.user && userInfo.user.name) {
          userSignUpDto.userName = userInfo.user.name;
        }

        checkExistUser(userSignUpDto);
      }


    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  /**
   * 애플 로그인
   * @returns {Promise<void>}
   */
  const onClickApple = async () => {
    try {
      // performs login request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      console.log('==== 애플 로그인 ====');
      console.log(appleAuthRequestResponse);

      // 애플 로그인시 최초 1회 로그인 때만 이름을 내려주기 때문에 저장해둬야함
      if (appleAuthRequestResponse.fullName.familyName && appleAuthRequestResponse.fullName.familyName !== '') {
        await AsyncStorage.setItem(ASYNC_STORAGE_KEY.APPLE_FAMILY_NAME, appleAuthRequestResponse.fullName.familyName);
        await AsyncStorage.setItem(ASYNC_STORAGE_KEY.APPLE_FAMILY_NAME, appleAuthRequestResponse.fullName.givenName);
        await AsyncStorage.setItem(ASYNC_STORAGE_KEY.APPLE_EMAIL, appleAuthRequestResponse.email);

        if (appleAuthRequestResponse.fullName.middleName) {
          await AsyncStorage.setItem(ASYNC_STORAGE_KEY.APPLE_MIDDLE_NAME, appleAuthRequestResponse.fullName.middleName);
        }
      }

      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

      console.log('==== 애플 로그인 상태 ====');
      console.log(credentialState);
      // use credentialState response to ensure the user is authenticated
      // user is authenticated
      if (credentialState === appleAuth.State.AUTHORIZED) {
        userSignUpDto.login = appleAuthRequestResponse.user;
        userSignUpDto.userType = USER_TYPE.APPLE;
        const familyName = await AsyncStorage.getItem(ASYNC_STORAGE_KEY.APPLE_FAMILY_NAME);
        const givenName = await AsyncStorage.getItem(ASYNC_STORAGE_KEY.APPLE_GIVEN_NAME);
        const email = await AsyncStorage.getItem(ASYNC_STORAGE_KEY.APPLE_GIVEN_NAME);
        if (familyName && givenName) {
          userSignUpDto.userName = familyName + givenName;
        }

        if (email) {
          userSignUpDto.email = email;
        }

        checkExistUser(userSignUpDto);
      }
    } catch (e) {
      console.log(e)
    }

  }

  /**
   * 로그아웃
   */
  const onClickSignOut = () => {

  }

  /**
   * 중복 회원가입 체크
   */
  const checkExistUser = (userSignUpDto) => {
    console.log(userSignUpDto);
    dispatch({type: CHECK_USER_EXIST, payload: userSignUpDto});
  }

  return (
    <View style={{
      alignItems: 'center',
    }}>
      <TouchableOpacity style={styles.menuContainer}>
        <Image source={Images.close}/>
        <Text>T-ID 로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuContainer} onPress={onClickKakao}>
        <Image source={Images.close}/>
        <Text>카카오톡 로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuContainer} onPress={onClickGoogle} >
        <Image source={Images.close}/>
        <Text>Google 로그인</Text>
      </TouchableOpacity>
      {
        Platform.OS === 'ios' && <TouchableOpacity style={styles.menuContainer} onPress={onClickApple}>
          <Image source={Images.close}/>
          <Text>Apple 로그인</Text>
        </TouchableOpacity>
      }

      <Text>{`로그인하면 해당 계정에서 사용중인 \n 일정을 연동할 수 있습니다`}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f9',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    alignItems: 'center',
  },

  menuContainer: {
    flexDirection: 'row',
    backgroundColor: '#e7e9f0',
    borderRadius: 35,
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginVertical: 10,
    width: 200,
    justifyContent: 'center',
  },
  menu: {
    paddingVertical: 21,
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  menuTitle: {
    fontSize: 16
  },
  pushDesc: {
    color: '#999999',
    fontSize: 12,
    lineHeight: 18
  }
});

export default SocialLoginButtons;
