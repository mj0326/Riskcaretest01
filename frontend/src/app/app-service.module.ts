import {ErrorHandler, NgModule} from '@angular/core';
import {LoadingService} from '@shared/component/loading/loading.service';
import {PopupService} from '@shared/component/popup/popup.service';
import {RequestInterceptor} from '@shared/services/request.interceptor';
import {GlobalErrorHandler} from '@shared/services/global.error.handler';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler, useClass: GlobalErrorHandler
    },
    LoadingService,
    PopupService,
  ]
})
export class AppServiceModule {
}
