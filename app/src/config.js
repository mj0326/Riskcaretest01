import {ENV} from "./constants/Constants";


export let userAgentConfig = Platform.OS === 'android' ? `Mobile-App-Android` : `Mobile-App-Ios`;

// 개발인지 운영인지 설정
export const env = ENV.DEV;

export const prodUrl = 'http://localhost:4200';
// 로컬
export const devUrl = 'http://192.168.100.29:8080';
export const HOST = env === ENV.DEV ? 'http://localhost:9090' : 'http://localhost:9090';
// 개발
// export const devUrl = 'https://m-web-dev.hankookilbo.com';
// export const devApiUrl = 'https://m-web-dev.hankookilbo.com';

export const cookieDomain = 'localhost';
export const cookiePath = '/'


