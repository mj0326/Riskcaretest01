import React from 'react';
import {Text, TouchableOpacity, View, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SET_SHOW_MODAL, SET_WEB_VIEW_MODAL} from '../redux/reducers/actionTypes';
import {useDispatch} from 'react-redux';
import Images from '../../assets';
import RNKakaoLink from "react-native-kakao-links";
import {ShareDialog} from 'react-native-fbsdk';
import HorizontalSpacer from "./common/HorizontalSpacer";

const HomeHeader = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  /**
   * Drawer 열기
   */
  const openDrawer = () => {
    navigation.openDrawer();
  };

  /**
   * 지도 열기
   */
  const onClickMap = async () => {
    dispatch({type: SET_WEB_VIEW_MODAL, payload: {show: true, url: '/map'}})
  };

  /**
   * 알림창 열기
   */
  const onClickAlarm = async () => {
    dispatch({type: SET_SHOW_MODAL, payload: { type: 'showAlarm', value: true}})
  }

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 10,
      paddingHorizontal: 10,
    }}>
      <TouchableOpacity onPress={openDrawer}>
        <Image source={Images.gnb.menu}/>
      </TouchableOpacity>

      <Image source={Images.appTitle}/>

      <View style={{
        flexDirection: 'row'
      }}>
        <TouchableOpacity onPress={onClickAlarm}>
          <Image source={Images.gnb.map}/>
        </TouchableOpacity>
        <HorizontalSpacer width={8}/>
        <TouchableOpacity onPress={onClickMap}>
          <Image source={Images.gnb.map}/>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default HomeHeader;
