import React from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import {ScrollView} from "react-native-gesture-handler";

const PersonalInfoScreen = () => {

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.innerContainer}>
        <Text>{
          ``
        }</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f9',
  },
  innerContainer: {
    paddingHorizontal: 12
  }
});

export default PersonalInfoScreen;
