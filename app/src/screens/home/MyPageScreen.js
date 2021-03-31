import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native'
import {useDispatch, useSelector} from 'react-redux';
import SocialLoginButtons from "../../components/common/SocialLoginButtons";
import SocialLogoutButton from "../../components/SocialLogoutButton";

const MyPageScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);

  useEffect(() => {
    console.log(user);
  }, [])



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        { !user ? <SocialLoginButtons/> : <SocialLogoutButton/>}
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
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    alignItems: 'center'
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

export default MyPageScreen;
