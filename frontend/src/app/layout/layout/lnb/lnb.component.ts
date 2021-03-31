import {Component, ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {AbstractComponent} from '@shared/component/abstract.component';
import {LayoutService} from '@layout/layout/layout.service';
import {UrlPath} from "@shared/routes/url-path";


@Component({
  selector: 'lnb',
  templateUrl: './lnb.component.html',
})
export class LnbComponent extends AbstractComponent implements OnInit, OnDestroy {
  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Public Variables
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  public isLnbOpened: boolean = false;
  public UrlPath = UrlPath;
  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Private Variables
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Constructor
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  constructor(
    protected elementRef: ElementRef,
    protected  injector: Injector,
    private _layoutSvc: LayoutService) {
    super(elementRef, injector);
  }

  ngOnInit() {
    super.ngOnInit();

    this.subscriptions.push(
      this._layoutSvc.isLnbOpened$.subscribe(
        (obj: boolean) => {
          this.isLnbOpened = obj;
        }
      )
    )
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
   * 닫기
   */
  public onClickClose() {
    this._layoutSvc.isLnbOpened$.next(false);
  }

  /**
   * 메뉴 클릭시
   * @param url
   */
  public onClickMenu(url: string) {
    console.log(url);
    this._layoutSvc.isLnbOpened$.next(false);
    this.router.navigateByUrl(url).then();
  }

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Private Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
