import React from 'react';
import {Modal, SafeAreaView, Text, TouchableOpacity, View, Image, StyleSheet} from 'react-native';
import WebView from "react-native-webview";
import {prodUrl, userAgentConfig} from "../../config";
import {useDispatch} from "react-redux";
import {SET_SHOW_MODAL} from "../../redux/reducers/actionTypes";
import Images from "../../../assets";
import AlarmList from "./components/alarm-modal/AlarmList";

const ModalWebView = () => {

  const dispatch = useDispatch();
  const userAgent = userAgentConfig;

  /**
   * 모달 닫기
   */
  const onClose = () => {
    dispatch({type: SET_SHOW_MODAL, payload: { type: 'showAlarm', show: false}})
  }

  return (
    <Modal onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 40,
          alignItems: 'center',
          paddingHorizontal: 15,
          paddingVertical: 10,
          backgroundColor: 'red'
        }}>
          <View/>
          <Text>코로나19 위험도 알림</Text>
          <TouchableOpacity onPress={onClose}>
            <Image source={Images.close}/>
          </TouchableOpacity>
        </View>

        <AlarmList/>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f9'
  },
});

export default ModalWebView;
