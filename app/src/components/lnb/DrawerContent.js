import React from 'react';
import {Image, Linking, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import RouteNames from '../../constants/RouteNames';
import {useDispatch} from 'react-redux';
import {SET_WEB_VIEW_MODAL} from '../../redux/reducers/actionTypes';
import Images from "../../../assets";

const DrawerContent = ({navigation}) => {

  const dispatch = useDispatch();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 16,
            marginBottom: 10
          }}>
            <Image source={Images.appTitle}/>
            <TouchableOpacity onPress={() => navigation.closeDrawer()}>
              <Image source={Images.close}/>
            </TouchableOpacity>
          </View>
          {/* 채널 상세 */}
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuInnerContainer} onPress={() => navigation.navigate(RouteNames.MyPage)}>
              <Image style={styles.menuIcon} source={Images.lnb.service}/>
              <Text style={styles.menuTitle}>마이페이지</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuInnerContainer} onPress={() => dispatch({type: SET_WEB_VIEW_MODAL, payload: {show: true, url: '/'}})}>
              <Image style={styles.menuIcon} source={Images.lnb.service}/>
              <Text style={styles.menuTitle}>위험도 분석</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuInnerContainer} onPress={() => dispatch({type: SET_WEB_VIEW_MODAL, payload: {show: true, url: '/service-introduce'}})}>
              <Image style={styles.menuIcon} source={Images.lnb.service}/>
              <Text style={styles.menuTitle}>서비스 소개</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuInnerContainer} onPress={() => Linking.openURL('https://www.naver.com')}>
              <Image style={styles.menuIcon} source={Images.lnb.api}/>
              <Text style={styles.menuTitle}>API 포털로 이동</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuInnerContainer} onPress={() => dispatch({type: SET_WEB_VIEW_MODAL, payload: {show: true, url: '/notice'}})}>
              <Image style={styles.menuIcon} source={Images.lnb.notice}/>
              <Text style={styles.menuTitle}>공지사항</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuInnerContainer} onPress={() => navigation.navigate(RouteNames.FAQ)}>
              <Image style={styles.menuIcon} source={Images.lnb.service}/>
              <Text style={styles.menuTitle}>FAQ</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuInnerContainer} onPress={() => navigation.navigate(RouteNames.ServiceCenter)}>
              <Image style={styles.menuIcon} source={Images.lnb.service}/>
              <Text style={styles.menuTitle}>고객센터</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuInnerContainer} onPress={() => navigation.navigate(RouteNames.Settings)}>
              <Image style={styles.menuIcon} source={Images.lnb.service}/>
              <Text style={styles.menuTitle}>설정</Text>
            </TouchableOpacity>
          </View>
        </View>


        <View>
          <Text style={styles.extraInfo}>Service Version: 1.0</Text>
          <Text style={styles.extraInfo}>Last Update: YYYY-MM-DD</Text>
          <Text style={styles.extraInfo}>Copyright info.</Text>
        </View>
      </View>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    flex: 1
  },
  menuContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10
  },
  menuInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  menuIcon: {
    marginRight: 16
  },
  menuTitle: {
    color: '#495057',
    fontSize: 18,
    lineHeight: 20,
    letterSpacing: -0.5,
    fontWeight: 'bold'
  },
  extraInfo: {
    color: '#a0a0a0',
    fontSize: 12,
    lineHeight: 20,
    letterSpacing: -0.5
  }
});

export default DrawerContent;
