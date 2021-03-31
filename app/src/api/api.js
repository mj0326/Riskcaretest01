import {useCallback, useEffect, useMemo, useState} from "react";
import axios from "axios";
import AsyncStorage from '@react-native-community/async-storage';
import {ASYNC_STORAGE_KEY} from "../constants/Constants";

export const instance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useAxiosLoader = () => {
  const [counter, setCounter] = useState(0);
  const [ready, setReady] = useState(false);
  const inc = useCallback(() => setCounter(counter => counter + 1), [setCounter]); // add to counter
  const dec = useCallback(() => setCounter(counter => counter - 1), [setCounter]); // remove from counter

  const interceptors = useMemo(() => ({
    request: async (config) => {
      console.log('config: ', config.url);
      if (!config.url.includes('/api/register') && !config.url.includes('/api/authenticate') && !config.url.includes('/api/account/exist')) {
        const accessToken = await AsyncStorage.getItem(ASYNC_STORAGE_KEY.ACCESS_TOKEN);
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
          inc();
        } else {

        }
      }

      return config
    },
    response: (response) => (dec(), response),
    error: (error) => (dec(), Promise.reject(error)),
  }), [inc, dec]); // create the interceptors

  useEffect(() => {
    // add request interceptors
    const reqInterceptor = instance.interceptors.request.use(interceptors.request, interceptors.error);
    // add response interceptors
    const resInterceptor =  instance.interceptors.response.use(interceptors.response, interceptors.error);
    setReady(true);
    return () => {
      // remove all intercepts when done
      instance.interceptors.request.eject(reqInterceptor);
      instance.interceptors.response.eject(resInterceptor);
    };
  }, [interceptors]);

  return [counter > 0, ready];
};




