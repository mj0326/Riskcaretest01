import React, { useRef } from 'react';
import {Modal, Text, SafeAreaView, TouchableOpacity, Linking} from 'react-native';
import WebView from "react-native-webview";
import {prodUrl, userAgentConfig} from "../../config";
import {WEBVIEW_EVENT_TYPE} from "../../constants/Constants";
import RouteNames from "../../constants/RouteNames";
import {useDispatch, useSelector} from "react-redux";
import {SET_WEB_VIEW_MODAL} from "../../redux/reducers/actionTypes";
import RNKakaoLink from "react-native-kakao-links";
import {ShareDialog} from 'react-native-fbsdk';

const ModalWebView = () => {

    const webviewRef = useRef();
    const dispatch = useDispatch();
    const userAgent = userAgentConfig;
    const { webViewModal } = useSelector(state => state.common);

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
                case WEBVIEW_EVENT_TYPE.CLOSE_MODAL:
                    console.log('==== 모달 닫기 ====');
                    onClose();
                case WEBVIEW_EVENT_TYPE.SHARE_LINK:
                    share(data.data)
                    break;
                default:
                    break;
            }
        } catch (e) {
            console.log(e);
        }
    };

    /**
     * 공유하기
     */
    const share = async (data) => {
        if (data.type === 'facebook') {
            facebookShare();
        } else if (data.type === 'twitter') {
            await Linking.openURL('https://twitter.com/share?url=' + data.url + '&text=' + data.title);
        } else if (data.type === 'naver') {
            await naverShare();
        } else if (data.type === 'kakao') {
            await kakaoShare(data);
        }
    };

    /**
     * 네이버 블로그 공유하기
     */
    const naverShare = async () => {
        const url = encodeURI(encodeURIComponent('https://www.naver.com'));
        const title = encodeURI('테스트');
        const shareURL = "https://share.naver.com/web/shareView?url=" + url + "&title=" + title;
        await Linking.openURL(shareURL);
    }

    /**
     * 카카오 공유하기
     * @param data
     * @returns {Promise<void>}
     */
    const kakaoShare = async (data) => {
        try {
            const linkObject = {
                webURL: 'https://www.naver.com',//optional
                mobileWebURL: 'https://www.naver.com',//optional
            };

            const contentObject = {
                title: 'test',
                link: linkObject,
                imageURL: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png',
                imageWidth: 240,//optional
                imageHeight: 240//optional
            };

            const options = {
                objectType: 'feed',//required
                content: contentObject,//required
                buttons: [
                    {
                        title: '뉴스 더보기',//required
                        link: linkObject,//required
                    }
                ]//optional
            };
            const response = await RNKakaoLink.link(options);
            console.log(response);
        } catch (e) {
            console.warn(e);
        }
    }

    /**
     * 페이스북 공유하기
     */
    const facebookShare = () => {
        ShareDialog.canShow({
            contentType: 'link',
            contentUrl: 'https://www.naver.com',
        }).then(
          function (canShow) {
              if (canShow) {
                  return ShareDialog.show({
                      contentType: 'link',
                      contentUrl: 'https://www.naver.com',
                  });
              }
          }
        ).then(
          function (result) {
              // console.log(result);
              if (result.isCancelled) {
                  // console.log('Share cancelled');
              } else {

              }
          },
          function (error) {
              // console.log('Share fail with error: ' + error);
          }
        );
    }

    /**
     * 모달 닫기
     */
    const onClose = () => {
        dispatch({type: SET_WEB_VIEW_MODAL, payload: { show: false, url: '/'}})
    }

    return (
        <Modal onRequestClose={onClose}>
            <SafeAreaView style={{flex: 1}}>
                <TouchableOpacity style={{
                    height: 100
                }} onPress={onClose}><Text>닫기</Text></TouchableOpacity>
                <WebView
                  style={{flex: 1}}
                  source={{
                      uri: `${prodUrl}/${webViewModal.url}`
                  }}
                  ref={webviewRef}
                  userAgent={userAgent}
                  javaScriptEnabled={true}
                  onMessage={(event) => {
                      onReceiveMessage(event)
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
        </Modal>
    )
}

export default ModalWebView;
