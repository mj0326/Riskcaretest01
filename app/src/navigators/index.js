import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import HomeNavigator from './HomeNavigator';
import {navigationRef} from "./RootNavigation";

const Navigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <HomeNavigator/>
    </NavigationContainer>
  )
};

export default Navigator;
