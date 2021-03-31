import * as moment from 'moment';
import {ParamMap} from '@angular/router';

declare const CryptoJS: any;

export namespace Utils {

  export class DateUtil {

    public static getCurrentString(format: string = 'YYYY-MM-DD HH:mm:ss') {
      return moment().format(format);
    }

    /**
     * 시간 데이터 yyyy-mm-dd HH:MM:SS 데이터로 변환
     * @param date - Date
     */
    public static dateToString(date: Date) {
      return leadingZeros(date.getFullYear(), 4) + '-' +
        leadingZeros(date.getMonth() + 1, 2) + '-' +
        leadingZeros(date.getDate(), 2) + ' ' +
        leadingZeros(date.getHours(), 2) + ':' +
        leadingZeros(date.getMinutes(), 2) + ':' +
        leadingZeros(date.getSeconds(), 2);

      function leadingZeros(n, digits) {
        let zero = '';
        n = n.toString();

        if (n.length < digits) {
          for (let i = 0; i < digits - n.length; i++) {
            zero += '0';
          }
        }
        return zero + n;
      }
    }

    /**
     * 시간 데이터 yyyymmdd 데이터로 변환
     * @param date - Date
     */
    public static dateToYmdString(date: Date) {
      return leadingZeros(date.getFullYear(), 4) +
        leadingZeros(date.getMonth() + 1, 2) +
        leadingZeros(date.getDate(), 2);

      function leadingZeros(n, digits) {
        let zero = '';
        n = n.toString();

        if (n.length < digits) {
          for (let i = 0; i < digits - n.length; i++) {
            zero += '0';
          }
        }
        return zero + n;
      }
    }
  }

  export class ObjectUtil {

    /**
     * 객체 복제
     * @param source - 복제 대상 객체
     */
    public static clone(source: any) {

      if (source === undefined) {
        return source;
      }

      return JSON.parse(JSON.stringify(source));
    }

    /**
     * 객체 데이터 병합
     * @param target - 대상 객체
     * @param sources - 원본 객체
     */
    public static merge<T>(target: T, ...sources: (object | ParamMap)[]) {
      sources.forEach((source) => {
        Object.keys(source).forEach((key) => {
          target[key] = source[key];
        });
      });
      return target;
    }

    /**
     *  create URL parameter
     * @param obj - target object
     * @returns URL parameter
     */
    public static objectToUrlString(obj: any) {
      if (obj) {
        let params = '';
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            params += `&${key}=${encodeURIComponent(obj[key])}`;
          }
        }

        if (params.startsWith('&')) {
          params = params.substring(1);
        }

        return params;
      }
      return '';
    }
  }

  export class Generate {
    /**
     * Generate UUID
     */
    public static UUID() {
      let d = new Date().getTime();
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    }
  }

  // export class Cipher {
  //   public static AES256(value: string) {
  //     const key = environment.key;
  //     const iv = environment.iv;
  //     const cipher = CryptoJS.AES.encrypt(value, CryptoJS.enc.Utf8.parse(key), {
  //       iv: CryptoJS.enc.Utf8.parse(iv), // parse the IV
  //       padding: CryptoJS.pad.Pkcs7,
  //       mode: CryptoJS.mode.CBC
  //     });
  //
  //     return cipher.toString();
  //   }
  // }

  export class ClassName {

    /**
     * 사용자 아이콘 컬러, 이미지 없을 경우 email 첫번째 값으로 기본 값 설정
     * @param userEmail
     */
    public static emailToColor(userEmail: string) {
      const firstChar = userEmail.charCodeAt(0);
      const remain = firstChar % 10;
      const numberToColor = String.fromCharCode(remain + 97);
      return `bg-user-${numberToColor}`;
    }
  }

  export class ArrayUtil {

    /**
     * 기준 배열로 타겟 배열의 순서를 재정렬하여 반환
     * @param indexs
     * @param targets
     * @param targetKey
     */
    public static sortArray( indexs: any[], targets: any[], targetKey: string ) {
      let sorts: any[] = [];

      for ( let iItem of indexs ) {
        for ( let tItem of targets ) {
          if ( iItem === tItem[targetKey] ) {
            sorts.push(tItem);
            break;
          }
        }
      }

      return sorts;
    }

  }

}

