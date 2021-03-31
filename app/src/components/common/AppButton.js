import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View, Dimensions} from 'react-native';

const AppButton = ({click, title, customStyle}) => {
    return (
      <TouchableHighlight underlayColor={'#e1e1fa'}  style={ { ...styles.btn, ...customStyle }} onPress={click}>
          <View style={styles.btnInnerContainer}>
              <Text style={styles.btnText}>{title}</Text>
          </View>
      </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
  btnInnerContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageBtn: {
    width: 24,
    height: 24
  },
  btn: {
    width: Dimensions.get('window').width - 40,
    marginTop: 30,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#6369cc',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  btnText: {
    color: '#ffffff',
    fontSize: 14,
  },
});



export default AppButton;
