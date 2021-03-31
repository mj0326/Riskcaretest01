import React from "react";
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import Images from "../../../assets";

const HeaderBackButton = () => {
  const navigation = useNavigation();


  return (
    <TouchableOpacity style={styles.container}
                      onPress={() => navigation.goBack()}>
      <Image source={Images.back} style={styles.buttonImage}/>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonImage: {
    width: 15,
    height: 15
  }
});

export default HeaderBackButton;
