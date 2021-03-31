import React, {useState} from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from "react-native";
import {TouchableOpacity} from "react-native-gesture-handler";
import Images from "../../../assets";
import {useNavigation} from "@react-navigation/native";
import RouteNames from "../../constants/RouteNames";
import {SIGN_UP} from "../../redux/reducers/actionTypes";
import {useDispatch, useSelector} from "react-redux";

const AgreeTermScreen = () => {

  const [state, setState] = useState({
    service: false,
    personal: false
  });

  const { userSignUpDto } = useSelector(state => state.user);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  /**
   * 체크 박스 토글
   * @param type
   */
  const toggle = (type) => {
    // @ts-ignore
    setState({...state, [type]: !state[type]});
  };

  /**
   * 전체 동의
   */
  const agreeAll = () => {
    if (state.personal && state.service) {
      setState({...state, personal: false, service: false});
    } else {
      setState({...state, personal: true, service: true});
    }
  };

  /**
   * 회원가입
   */
  const onClickComplete = () => {
    if (state.personal && state.service) {
      dispatch({ type: SIGN_UP, payload: userSignUpDto });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <TouchableOpacity onPress={agreeAll} style={styles.row}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <View style={[(state.personal && state.service) && { width: 5, height: 5, backgroundColor: 'red' }, { width: 5, height: 5, borderColor: '#e1e1e1', borderWidth: 1 }]}/>
            <Text>전체 동의</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggle('service')} style={styles.row}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <View style={[(state.service) && { width: 5, height: 5, backgroundColor: 'red' }, { width: 5, height: 5, borderColor: '#e1e1e1', borderWidth: 1 }]}/>
            <Text>서비스 이용 약관 (필수)</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate(RouteNames.TermOfUse)}>
            <Image source={Images.back}/>
          </TouchableOpacity>

        </TouchableOpacity>

        <TouchableOpacity onPress={() => toggle('personal')} style={styles.row}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <View style={[(state.personal) && { width: 5, height: 5, backgroundColor: 'red' }, { width: 5, height: 5, borderColor: '#e1e1e1', borderWidth: 1 }]}/>
            <Text>개인 정보 수집 및 이용 동의 (필수)</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate(RouteNames.PersonalInfo)}>
            <Image source={Images.back}/>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{
          marginTop: 20,
          borderWidth: 1,
          borderColor: '#e1e1e1',
          borderRadius: 20,
          padding: 10,
          width: 100,
          alignItems: 'center',
          alignSelf: 'center'
        }}
        onPress={onClickComplete}>
        <Text>로그인</Text>
      </TouchableOpacity>
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
  row: {
    borderBottomColor: '#e1e1e1',
    borderBottomWidth: 1,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default AgreeTermScreen;
