import {BackHandler, SafeAreaView, StyleSheet, ToastAndroid} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import {prodUrl, userAgentConfig} from '../../config';
import {useDispatch, useSelector} from 'react-redux';
import HomeHeader from '../../components/HomeHeader';
import WebView from 'react-native-webview';
import {WEBVIEW_EVENT_TYPE} from '../../constants/Constants';
import {useNavigation} from '@react-navigation/native';
import RouteNames from '../../constants/RouteNames';
import {SET_WEB_VIEW_MODAL} from '../../redux/reducers/actionTypes';
import ModalWebView from '../../components/common/ModalWebView';
import {useIsDrawerOpen} from '@react-navigation/drawer';


// window.ReactNativeWebView && window.ReactNativeWebView.postMessage(document.cookie)
const MyLocation = () => {
  const navigation = useNavigation();

  const [state, setMyState] = useState({
    isFirstTime: true,
    isChannelEmpty: true,
    loading: true,
    userAgent: userAgentConfig,
  });


  // exit App
  const [exitApp, setExitApp] = useState(false);

  // current Url
  const [currentUrl, setCurrentUrl] = useState(`${prodUrl}`);
  // webview ref
  const webviewRef = useRef(null);
  // dispatch
  const dispatch = useDispatch();

  // state destructing
  const { userAgent, isFirstTime } = state;
  const isDrawerOpen = useIsDrawerOpen();

  /**
   * 안드로이드 백버튼 처리
   * @returns {boolean}
   */
  const handleBackButton = () => {
    if (isDrawerOpen) {
      navigation.closeDrawer();
    }
    const { index, routes } =  navigation.dangerouslyGetState()

    console.log(routes[index].name)

    if (routes[index].name === RouteNames.Home) {
      let timeout = setTimeout(() => {
        setExitApp(false);
      }, 2000);

      // 웰컴화면 or 홈화면일 경우
      if (currentUrl === `${prodUrl}` || currentUrl === `${prodUrl}/` || currentUrl === `${prodUrl}/home`) {
        if (!exitApp) {
          ToastAndroid.show('한번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);
          setExitApp(true);
        } else {
          clearTimeout(timeout);
          BackHandler.exitApp();  // 앱 종료
        }
      } else {
        if (webviewRef) {
          webviewRef.current.injectJavaScript(`history.back();`);
        }
      }
    } else {
      navigation.goBack();
    }

    return true;
  };

  /**
   * 안드로이드 Backbutton 처리
   */
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      backHandler.remove();
    }
  });

  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {

    });

    return focusListener;
  }, []);

  /**
   * 웹뷰 통신 처리
   */
  const onReceiveMessage = (event) => {
    // await AsyncStorage.setItem(ASYNC_STORAGE_KEY.CHANNEL_LIST)
    // 로그인 완료가 되면 channelList에 넣고 currentChannel에 값을 준다.
    // console.log('이벤트', event.nativeEvent);

    try {
      let data;
      data = JSON.parse(`${event.nativeEvent.data}`);

      // console.log(data);

      switch (data.type) {
        case WEBVIEW_EVENT_TYPE.LOGGED_IN:
          console.log('==== 로그인 ====');
          console.log(data.data);
          break;
        case WEBVIEW_EVENT_TYPE.HOME_CLICKED:
          console.log('==== 홈 클릭 ====');
          navigation.navigate(RouteNames.Calendar);
          break;
        case WEBVIEW_EVENT_TYPE.CLOSE_MODAL:
          console.log('==== 모달 닫기 ====');
          dispatch({type: SET_WEB_VIEW_MODAL, payload: {show: false, url: '/'}});
          break;
        case WEBVIEW_EVENT_TYPE.OPEN_MENU:
          navigation.openDrawer();
          break;
        case WEBVIEW_EVENT_TYPE.URL_CHANGED:
          setCurrentUrl(data.data);
          break;
        case WEBVIEW_EVENT_TYPE.SHARE_LINK:

          break;
        default:
          break;
      }
    } catch (e) {
      console.log(e);
    }
  };


  // 로그인 화면
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        style={{flex: 1}}
        source={{
          uri: `${prodUrl}/home`,
        }}
        ref={webviewRef}
        userAgent={userAgent}
        javaScriptEnabled={true}
        onMessage={(event) => {
          onReceiveMessage(event);
        }}
        mediaPlaybackRequiresUserAction={true}
        textZoom={100}
        mixedContentMode="always"
        domStorageEnabled
        allowFileAccess={true}
        scalesPageToFit={true}
        originWhitelist={['*']}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default MyLocation;
