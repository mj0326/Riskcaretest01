import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {useDispatch} from "react-redux";
import {SET_WEB_VIEW_MODAL} from "../../../../redux/reducers/actionTypes";

const AlarmListItem = ({item}) => {
  const dispatch = useDispatch();

  const onClickDetail = () => {
    dispatch({type: SET_WEB_VIEW_MODAL, payload: {show: true, url: '/'}})
  }

  return (
    <View style={{
      backgroundColor: 'white',
      height: 200,
      marginBottom: 20,
      borderRadius: 8,
      padding: 20
    }}>
      <Text>2021.03.24 16:23</Text>
      <Text>현재 관심장소의 코로나19 위험이 높습니다.</Text>
      <Text>을지로 11</Text>
      <Text>현재 위험도: 위험(75)</Text>

      <TouchableOpacity
        onPress={onClickDetail}
        style={{
        alignSelf: 'center',
        marginTop: 20
      }}>
        <Text>위험도 상세 정보 보러가기 ></Text>
      </TouchableOpacity>
    </View>
  )
}

export default AlarmListItem;
