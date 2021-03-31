import {Injector} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '@environments/environment';
import {CookieService} from '@shared/services/cookie.service';
import {Observable} from 'rxjs';
import {Cookie} from '@shared/model/cookie.model';
import {HttpOptions} from '@shared/model/http.model';
import {CookieConstant} from '@shared/constant/cookie-constant';

export abstract class AbstractService {

  private readonly showLog: boolean = false;

  protected readonly API_URL: string;

  protected http: HttpClient;

  protected router: Router;

  protected cookieService: CookieService;

  protected constructor(protected injector: Injector) {
    this.router = injector.get(Router);
    this.http = injector.get(HttpClient);
    this.cookieService = injector.get(CookieService);
    this.API_URL = (environment.production) ? environment.host + '/apps' : '/apps';
  }

  /**
   * GET 호출
   */
  protected get<T = any>(url: string, params?: any, httpOptions?: HttpOptions): Observable<T> {

    if (this.showLog) {
      console.log(`[${this['__proto__'].constructor.name}] > GET ${url}`);
      console.log(`[${this['__proto__'].constructor.name}] > PARAMS`, params);
    }

    const setHttpOptions = this.getDefaultRequestHttpOptions(httpOptions);
    if (params) {
      setHttpOptions['params'] = params;
    }

    return this.http.get<T>(url, setHttpOptions);
  }

  /**
   * POST 호출
   */
  protected post<T = any>(url: string, data: any, httpOptions?: HttpOptions): Observable<T> {

    if (this.showLog) {
      console.log(`[${this['__proto__'].constructor.name}] > POST ${url}`);
      console.log(`[${this['__proto__'].constructor.name}] > DATA`, data);
    }

    return this.http.post<T>(url, data, this.getDefaultRequestHttpOptions(httpOptions));
  }

  /**
   * FORM Data POST
   */
  protected postWithFormData<T = any>(url, data, httpOptions?: HttpOptions): Observable<T> {
    return this.http.post<T>(url, data, this.getMultipartRequestHttpOptions(httpOptions));
  }

  /**
   * PUT 호출
   */
  protected put<T = any>(url: string, data: any, httpOptions?: HttpOptions): Observable<T> {

    if (this.showLog) {
      console.log(`[${this['__proto__'].constructor.name}] > PUT ${url}`);
      console.log(`[${this['__proto__'].constructor.name}] > DATA`, data);
    }

    return this.http.put<T>(url, data, this.getDefaultRequestHttpOptions(httpOptions));
  }

  /**
   * PATCH 호출
   */
  protected patch<T = any>(url: string, data?: any, httpOptions?: HttpOptions): Observable<T> {

    if (this.showLog) {
      console.log(`[${this['__proto__'].constructor.name}] > PATHCH ${url}`);
      console.log(`[${this['__proto__'].constructor.name}] > DATA`, data);
    }

    return this.http.patch<T>(url, data, this.getDefaultRequestHttpOptions(httpOptions));
  }

  /**
   * DELETE 호출
   */
  protected delete<T = any>(url: string, httpOptions?: HttpOptions): Observable<T> {

    if (this.showLog) {
      console.log(`[${this['__proto__'].constructor.name}] > DELETE ${url}`);
    }

    return this.http.delete<T>(url, this.getDefaultRequestHttpOptions(httpOptions));
  }

  /**
   * 기본 옵션 정보 생성
   * @param httpOptions
   */
  protected getDefaultRequestHttpOptions(httpOptions: HttpOptions): { headers: any, withCredentials: boolean } {

    let headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      isLoading: `${!httpOptions?.disableLoading}`
    };

    if (!httpOptions?.disableAuthorization) {
      // headers = {...headers, ...{Authorization: `Bearer ${this.cookieService.get(Cookie.JSESSIONID)}`}};
      headers = {...headers, ...{Authorization: `Bearer ${this.cookieService.get(CookieConstant.KEY.ACCESS_TOKEN)}`}};
    }

    return {headers, withCredentials: true};
  }

  /**
   * 기본 옵션 정보 생성
   * @param httpOptions
   */
  protected getMultipartRequestHttpOptions(httpOptions: HttpOptions): { headers: any, withCredentials: boolean } {

    const token = this.cookieService.get(Cookie.TOKEN);
    let headers;
    if (!httpOptions?.disableAuthorization) {
      headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        enctype: 'multipart/form-data',
        isLoading: `${!httpOptions?.disableLoading}`
      });
    } else {
      headers = new HttpHeaders({
        enctype: 'multipart/form-data',
        isLoading: `${!httpOptions?.disableLoading}`
      });
    }

    return {headers, withCredentials: true};
  }

  /**
   *  create URL parameter
   * @param obj - target object
   * @returns URL parameter
   */
  public objectToUrlString(obj: any): string {
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
