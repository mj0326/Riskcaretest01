import {Component, ElementRef, Injector, OnInit} from '@angular/core';
import {AbstractComponent} from '@shared/component/abstract.component';
import {LayoutService} from '@layout/layout/layout.service';
import {NoticeService} from "@components/notice/notice.service";
import {Observable} from "rxjs";
import {Notice} from "@components/notice/notice.value";
import {map} from "rxjs/operators";
import {CommonConstant} from "@shared/constant/common-constant";

@Component({
  selector: 'notice',
  templateUrl: './notice.component.html'
})
export class NoticeComponent extends AbstractComponent implements OnInit {
  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Public Variables
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  public noticeList$: Observable<Notice[]>;

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Private Variables
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Constructor
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  constructor(
    protected elementRef: ElementRef,
    protected injector: Injector,
    private _layoutSvc: LayoutService,
    private _noticeSvc: NoticeService
  ) {
    super(elementRef, injector);
  }

  ngOnInit(): void {
    this._init();
  }


  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Override Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Public Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/


  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Private Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

  /**
   * 초기화
   * @private
   */
  private _init() {
    this._layoutSvc.isSubMode$.next({isSubMode: true, isSectionRight: false, subTitle: '공지사항'});

    this.getNoticeList();
  }

  /**
   * 공지사항 리스트 조회
   * @private
   */
  private getNoticeList() {
    this.noticeList$ = this._noticeSvc.getNoticeList()
      .pipe(
        map((result) => {
          if (result.code === CommonConstant.RESULT_CODE.SUCCESS) {
            console.log('=== 공지사항 리스트 조회 성공 ===');
            console.log(result);
            return result.data;
          } else {
            console.log('=== 공지사항 리스트 조회 실패 ===');
            console.log(result);
            return [];
          }
        })
      );
  }
}
