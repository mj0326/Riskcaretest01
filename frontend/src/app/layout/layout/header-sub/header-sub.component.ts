import {Component, ElementRef, Injector, Input, OnDestroy, OnInit} from '@angular/core';
import {AbstractComponent} from '@shared/component/abstract.component';
import {LayoutService} from '@layout/layout/layout.service';
import {CookieService} from '@shared/services/cookie.service';
import {PopupService} from '@shared/component/popup/popup.service';
import {CookieConstant} from '@shared/constant/cookie-constant';


@Component({
  selector: 'div[header-sub]',
  templateUrl: './header-sub.component.html',
  // host: {'[class.layout-header]': 'true'}
})
export class HeaderSubComponent extends AbstractComponent implements OnInit, OnDestroy {
  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Public Variables
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  @Input() subTitle: string = '';
  @Input() isSectionRight: boolean = false;
  @Input() ldongCd: string = '';
  public isFavorite: boolean = false;
  public ldongCdList: string[] = [];
  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Private Variables
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Constructor
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  constructor(
    protected elementRef: ElementRef,
    protected  injector: Injector,
    public layoutSvc: LayoutService,
    private _cookieSvc: CookieService,
    private _popupSvc: PopupService) {
    super(elementRef, injector);
  }

  ngOnInit() {
    super.ngOnInit();
    const lDongCds = this._cookieSvc.get(CookieConstant.KEY.L_DONG_CDS);
    this.ldongCdList= lDongCds !== '' ? JSON.parse(lDongCds) as string[] : [];
    this.isFavorite = this.ldongCdList.some( code => code === this.ldongCd);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Override Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Public Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

  /**
   * 좋아요 클릭시
   */
  public onClickLike() {
    if(this.isFavorite) {
      this.ldongCdList = this.ldongCdList.filter(
        code => {
          return code !== this.ldongCd;
        }
      )
    } else {
      this._popupSvc.show();
      this.ldongCdList.push(this.ldongCd);
      setTimeout(
        () => {
          this._popupSvc.hide();
        }, 1500
      )
    }
    this.isFavorite = !this.isFavorite;
    this.ldongCdList = Array.from(new Set(this.ldongCdList));
    this._cookieSvc.set(CookieConstant.KEY.L_DONG_CDS, JSON.stringify(this.ldongCdList), 0);
  } // func - onClickLike

  /**
   * 공유하기 클릭시
   */
  public onClickShare() {

  } // func - onClickShare
  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Private Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/



}
