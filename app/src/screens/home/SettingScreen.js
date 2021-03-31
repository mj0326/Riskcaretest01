import React from 'react';
import {SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, Switch} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import RouteNames from '../../constants/RouteNames';
import Images from "../../../assets";

const SettingScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>

        <View style={styles.itemContainer} onPress={() => navigation.navigate(RouteNames.SettingCalendar)}>
          <Text>알림 허용</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(val) => console.log(val)}
            value={true}
          />
        </View>
        <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate(RouteNames.SettingCalendar)}>
          <Text>캘린더 설정</Text>
          <Image source={Images.back}/>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f9',
  },
  innerContainer: {
    borderColor: '#e1e1e1',
    overflow: 'hidden',
    borderRadius: 10,
    margin: 20,
    borderWidth: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    height: 55,
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1'
  }
});

export default SettingScreen;
