import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from "react-native-gesture-handler";
import VerticalSpacer from "../../components/common/VerticalSpacer";

const SettingCalendarScreen = () => {
  const disabled = true
  return (
    <SafeAreaView style={styles.container}>
      <View pointerEvents={ disabled ? 'none' : 'auto'} style={styles.innerContainer}>
        <Text style={{
          fontSize: 16,
          fontWeight: 'bold'
        }}>
          현재 Google Calendar를 사용 중입니다.
        </Text>
        <View style={{ ...styles.buttonContainer, opacity: 0.5 }}>
          <View style={styles.buttonInnerContainer}>
            <Text style={styles.buttonTitle}>
              한 주의 시작
            </Text>
            <View style={{
              flexDirection: 'row',
            }}>
              <TouchableOpacity style={styles.leftButton}>
                <Text>일요일</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rightButton}>
                <Text>월요일</Text>
              </TouchableOpacity>
            </View>
          </View>
          <VerticalSpacer height={10}/>
          <View style={styles.buttonInnerContainer}>
            <Text style={styles.buttonTitle}>
              시간제 <Text>오후 6:00</Text>
            </Text>
            <View style={{
              flexDirection: 'row',
            }}>
              <TouchableOpacity style={styles.leftButton}>
                <Text>12시간</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rightButton}>
                <Text>24시간</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f9',
    paddingHorizontal: 16
  },
  innerContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    paddingVertical: 30,
    borderRadius: 10
  },
  buttonContainer: {
    marginTop: 20
  },
  buttonInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonTitle: {

  },
  leftButton: {
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 6,
    marginRight: 8
  },
  rightButton: {
    backgroundColor: 'blue',
    borderRadius: 10,
    padding: 6
  }
});

export default SettingCalendarScreen;
