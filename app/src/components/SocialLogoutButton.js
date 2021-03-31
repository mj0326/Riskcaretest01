import {Image, Text, TouchableOpacity, View, Dimensions} from "react-native";
import Images from "../../assets";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {ASYNC_STORAGE_KEY, USER_TYPE} from "../constants/Constants";
import {SET_USER} from "../redux/reducers/actionTypes";
import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from "@react-navigation/native";
import RouteNames from "../constants/RouteNames";

const SocialLogoutButton = () => {

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user } = useSelector(state => state.user);

  /**
   * 로그아웃
   */
  const onClickSignOut = async () => {
    await AsyncStorage.removeItem(ASYNC_STORAGE_KEY.USER_TYPE);
    await AsyncStorage.removeItem(ASYNC_STORAGE_KEY.USER_ID);
    await AsyncStorage.removeItem(ASYNC_STORAGE_KEY.ACCESS_TOKEN);
    dispatch({ type: SET_USER, payload: undefined });
  }

  /**
   * 유저 타입
   */
  const getUserType = () => {
    switch (user.userType) {
      case USER_TYPE.KAKAO:
        return '카카오톡'
      case USER_TYPE.FACEBOOK:
        return '페이스북'
      case USER_TYPE.SKT:
        return 'Tid'
      case USER_TYPE.GOOGLE:
        return '구글'
      default:
        return '';
    }
  }

  return (
    <View style={{
      alignItems: 'center'
    }}>
      <Image style={{
        marginTop: 80
      }} source={Images.back}/>
      <Text style={{
        marginTop: 40
      }}>현재 { getUserType() }으로 로그인 중입니다.</Text>

      <Text>이름: { user.userName }</Text>
      <Text>이메일: { user.email }</Text>
      <TouchableOpacity style={{
        marginTop: 40
      }} onPress={onClickSignOut}>
        <Text>로그아웃</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{
        marginTop: 40
      }} onPress={onClickSignOut}>
        <Text>회원탈퇴</Text>
      </TouchableOpacity>

      <View style={{
        borderWidth: 1,
        borderColor: '#e1e1e1',
        borderRadius: 10,
        width: Dimensions.get('window').width - 40
      }}>
        <TouchableOpacity onPress={() => navigation.navigate(RouteNames.TermOfUse)} style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 14,
        }}>
          <Text>서비스 이용약관</Text>
          <Image source={Images.back}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate(RouteNames.PersonalInfoAgree)} style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 14,
        }}>
          <Text>개인 정보 수집 및 이용 동의</Text>
          <Image source={Images.back}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate(RouteNames.PersonalInfo)} style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 14,
        }}>
          <Text>개인 정보 처리방침</Text>
          <Image source={Images.back}/>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default SocialLogoutButton;
