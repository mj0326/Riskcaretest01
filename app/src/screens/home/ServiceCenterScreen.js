import React from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';

const ServiceCenterScreen = () => {

  return (
    <SafeAreaView style={styles.container}>
      <Text>
        고객센터
      </Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f9',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  menu: {
    paddingVertical: 21,
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  menuTitle: {
    fontSize: 16
  },
  pushDesc: {
    color: '#999999',
    fontSize: 12,
    lineHeight: 18
  }
});

export default ServiceCenterScreen;
