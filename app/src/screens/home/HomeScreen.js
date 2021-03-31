import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from "react-redux";

import HomeHeader from "../../components/HomeHeader";
import MyLocation from "../schedule/MyLocation";
import MySchedule from '../schedule/MySchedule';
import {GET_USER, SET_WEB_VIEW_MODAL} from "../../redux/reducers/actionTypes";
import CovidAlarmModal from "./CovidAlarmModal";

const HomeScreen = () => {
  /******************
   * state
   *****************/
  const [tabMenu, setTabMenu] = useState({ myLocation: true, mySchedule: false });
  const { googleTokens } = useSelector(state => state.user);
  const { showAlarm } = useSelector(state => state.common);

  /******************
   * destructuring
   *****************/
  const {myLocation, mySchedule} = tabMenu;
  const { accessToken, idToken } = googleTokens;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({type: GET_USER});
    dispatch({type: SET_WEB_VIEW_MODAL, payload: { show: true, url: '/welcome'}});
  }, []);


  const selectedTabStyle = { borderWidth: 1, borderColor: '#e1e1e1' };

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader clickAlarm={() => console.log('=== ALARM_CLICKED ===') } />

      { showAlarm && <CovidAlarmModal/> }
      {/* tab menu */}
      <View style={styles.tabMenuContainer}>
        <TouchableOpacity style={[ styles.tabMenuItem, myLocation && selectedTabStyle ]} onPress={() => setTabMenu({myLocation: true, mySchedule: false})}>
          <Text style={styles.tabMenuText}>나의 관심장소</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[ styles.tabMenuItem, mySchedule && selectedTabStyle ]}  onPress={() => setTabMenu({myLocation: false, mySchedule: true})}>
          <Text style={styles.tabMenuText}>나의 일정</Text>
        </TouchableOpacity>
      </View>
      {/* tab menu */}

      { myLocation && <MyLocation/> }

      { mySchedule && <MySchedule/> }

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f9'
  },
  // tab menu
  tabMenuContainer: {
    flexDirection: 'row',
  },
  tabMenuItem: {
    flex: 1,
    justifyContent: 'center',
    height: 50
  },
  tabMenuText: {
    textAlign: 'center'
  },
});

export default HomeScreen;
