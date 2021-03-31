import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '@shared/shared.module';
import {NoticeComponent} from "@components/notice/notice.component";
import {NoticeService} from "@components/notice/notice.service";

const noticeRoutes: Routes = [
  {
    path: '',
    component: NoticeComponent
  },
];


@NgModule({
  declarations: [
    NoticeComponent
  ],
  imports: [
    RouterModule.forChild(noticeRoutes),
    SharedModule,
  ],
  providers: [
    NoticeService
  ]
})
export class NoticeModule {
}
