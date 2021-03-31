import React, { useState } from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View, TextInput} from "react-native";
import {TouchableOpacity} from "react-native-gesture-handler";
import RouteNames from "../../constants/RouteNames";
import Images from "../../../assets";
import AppButton from "../../components/common/AppButton";
import {useDispatch, useSelector} from "react-redux";
import {SIGN_UP} from "../../redux/reducers/actionTypes";
import {useNavigation} from "@react-navigation/native";

const SignUpScreen = () => {

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { userSignUpDto } = useSelector(state => state.user);

  const [state, setState] = useState({
    userName: '',
    birth: '',
    TBD: ''
  })

  // state destructuring
  const { userName } = state;

  /**
   * 회원가입
   */
  const onClickComplete = () => {
    userSignUpDto.userName = userName;
    dispatch({ type: SIGN_UP, payload: userSignUpDto });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <TextInput
          onChange={(e) => { setState({ ...state, userName: e.nativeEvent.text })}}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.textInput}
          placeholder="이름을 입력해주세요"
          placeholderTextColor="#b2b2b2"/>
        <TextInput
          onChange={(e) => { setState({ ...state, birth: e.nativeEvent.text })}}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType={'number-pad'}
          style={styles.textInput}
          placeholder="생년월일을 입력해주세요"
          placeholderTextColor="#b2b2b2"/>
        <TextInput
          onChange={(e) => { setState({ ...state, name: e.nativeEvent.text })}}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.textInput}
          placeholder="TBD"
          placeholderTextColor="#b2b2b2"/>
      </View>
      <AppButton click={onClickComplete} title={'완료'}/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f9',
  },
  innerContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
    backgroundColor: 'white',
  },
  textInput: {
    borderBottomWidth: 1,
    height: 60,
    borderBottomColor: '#e1e1e1',
  },
});

export default SignUpScreen;
