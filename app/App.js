/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import Navigator from './src/navigators';
import {Provider} from 'react-redux';
import { store } from './src/redux/store'
import RNAsyncStorageFlipper from 'rn-async-storage-flipper';
import AsyncStorage from '@react-native-community/async-storage';
import ReactNative, { Platform } from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AbstractHoc from "./src/AbstractHoc";


const { SharedStorage } = ReactNative.NativeModules;

const App = () => {
  RNAsyncStorageFlipper(AsyncStorage);

    useEffect(() => {
      SharedStorage.plz(
        JSON.stringify({text: 'This is data from the React Native app'})
      );

      // google signin
      GoogleSignin.configure({
        webClientId: '323066347982-5egmklp0p8euup7clmk24q42k774l1uj.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
        scopes: ['email', 'profile', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.readonly'],
        // offlineAccess: true,
        // forceCodeForRefreshToken:true,
      });
    }, [])

  return (
    <Provider store={store}>
      <AbstractHoc>
        <Navigator/>
      </AbstractHoc>
    </Provider>

  );
};


export default App;
