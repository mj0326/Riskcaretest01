import {Image, StyleSheet, TouchableOpacity, SafeAreaView, View} from 'react-native';
import Images from '../../assets';
import React from 'react';

const LoginHeader = ({ goBack }) => {
  return (
    <SafeAreaView style={styles.loginHeader}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Image source={Images.back} style={styles.imageBtn}/>
        </TouchableOpacity>
      </View>
      <View/>
      <View/>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  loginHeader: {
    marginLeft: 20
  },
  header: {
    marginTop: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageBtn: {
    width: 24,
    height: 24,
  },
});

export default LoginHeader;
