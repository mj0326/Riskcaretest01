import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, delay, finalize, map} from 'rxjs/operators';
import {CookieService} from '@shared/services/cookie.service';
import {HttpStatus} from '@shared/model/http.model';
import {Cookie} from '@shared/model/cookie.model';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  private loadingCnt = 0;

  constructor(private readonly cookieSvc: CookieService) {
  }

  /**
   * Intercept all XHR request
   */
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // const reqUrl: string = request.url;
    const enableLoading: boolean = 'true' === request.headers.get('isLoading');
    if (enableLoading) {
      if (0 === this.loadingCnt) {
        // console.log( '+=+=+=+=+=+=+=+=+= showLoading', reqUrl );
      }
      this.loadingCnt += 1;
      // console.log( '+=+=+=+=+=+=+=+=+= increase cnt', this.loadingCnt, reqUrl );
    }

    /**
     * Continues request execution
     */
    return next
      .handle(request)
      .pipe(
        delay(100),
        map((response: any) => {
          if (response?.body?.error?.code === 401) {
            return response;
          }

          return response;
        }),
        // timeout(15000),
        catchError((error) => {
          // console.log( '+=+=+=+=+=+=+=+=+= error' );
          this.loadingCnt = 0;
          // this.loadingSvc.hide();
          switch (error.status) {
            case HttpStatus.SERVER_ERROR: {
              // this.router.navigate([UrlPath.ERROR.ROOT + '/500']);
              break;
            }
            case HttpStatus.INVALID_REQUEST: {
              // this.router.navigate([UrlPath.ERROR.ROOT + '/400']);
              break;
            }
            case HttpStatus.UNAUTHORIZED:
            case HttpStatus.FORBIDDEN: {
              break;
            }
            case HttpStatus.GATEWAY_TIMEOUT: {
              this.cookieSvc.delete(Cookie.TOKEN);
              // this.router.navigate([UrlPath.ERROR.ROOT + '/500']);
              break;
            }
            default: {
              this.cookieSvc.delete(Cookie.TOKEN);
              // this.router.navigate([UrlPath.ERROR.ROOT + '/500']);
              break;
            }
          }
          return throwError(error);
        }),
        finalize(() => {
          if (enableLoading) {
            if (0 < this.loadingCnt) {
              this.loadingCnt -= 1;
            }
            if (0 === this.loadingCnt) {
            }
          }
        })
      );
  }
}
