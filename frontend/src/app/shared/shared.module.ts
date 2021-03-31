import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// Components
// Header Elements Components
// Directives
// Services
import {SafeHtmlPipe} from '@shared/pipes/safe-html.pipe';
import { ReversePipe } from './pipes/reverse.pipe';
import { FindNamePipe } from './pipes/find-name.pipe';
import {PaginationModule} from '@shared/component/pagination/pagination.module';
import {FileUploadModule} from 'ng2-file-upload';
import {CustomKeyupDirective} from '@shared/component/directive/custom-keyup.directive';
// import {LayoutPopupAlertComponent} from '@shared/component/popup/layout-popup-alert.component';
import {InputComponent} from '@shared/component/input/input.component';
import {SearchComponent} from '@shared/component/search/search.component';
import {SelectBoxMultiComponent} from '@shared/component/select-box-multi/select-box-multi.component';
import {SelectBoxSingleComponent} from '@shared/component/select-box-single/select-box-single.component';
import {InputButtonComponent} from '@shared/component/input-button/input-button.component';
import {TextareaComponent} from '@shared/component/textarea/textarea.component';
import {TextareaButtonComponent} from '@shared/component/textarea-button/textarea-button.component';
import {FileUploadComponent} from '@shared/component/file-upload/file-upload.component';
import {UserService} from '@shared/services/user.service';
import {CookieService} from '@shared/services/cookie.service';
import {FileService} from '@shared/services/file.service';
import {CovidSearchService} from '@shared/services/covid-search.service';
import {FavoritePopupComponent} from '@shared/component/popup/favorite-popup.component';

const MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  PaginationModule,
  FileUploadModule
];

const DIRECTIVES = [
  CustomKeyupDirective
];

const COMPONENTS = [
  SelectBoxSingleComponent,
  SelectBoxMultiComponent,
  SearchComponent,
  // LayoutPopupAlertComponent,
  FavoritePopupComponent,
  InputComponent,
  InputButtonComponent,
  TextareaComponent,
  TextareaButtonComponent,
  FileUploadComponent
];

const PROVIDERS = [
  UserService,
  CookieService,
  FileService,
  CovidSearchService
];

const PIPE = [
  SafeHtmlPipe,
  ReversePipe,
  FindNamePipe,
];



@NgModule({
    declarations: [
      COMPONENTS,
      DIRECTIVES,
      PIPE,
    ],
    imports: [
      MODULES
    ],
    providers: [
      PROVIDERS
    ],
    exports: [
      MODULES,
      COMPONENTS,
      DIRECTIVES,
      PIPE
    ],
})
export class SharedModule {
}
