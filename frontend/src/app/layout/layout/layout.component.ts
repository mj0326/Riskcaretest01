import {AfterViewChecked, Component, ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {AbstractComponent} from '@shared/component/abstract.component';
import {LayoutService} from '@layout/layout/layout.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent extends AbstractComponent implements OnInit, OnDestroy, AfterViewChecked {
  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Public Variables
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  public isSubMode: boolean = false;
  public isSectionRight: boolean = false;
  public subTitle: string;
  public ldongCd: string = '';
  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Private Variables
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Constructor
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  constructor(
    protected elementRef: ElementRef,
    protected  injector: Injector,
    public layoutSvc: LayoutService) {
    super(elementRef, injector);
    this.subscriptions.push(
      this.layoutSvc.isSubMode$.subscribe(
        (obj) => {
          this.isSubMode = obj.isSubMode;
          if(this.isSubMode) {
            this.isSectionRight = obj.isSectionRight;
            this.subTitle = obj.subTitle;
            this.ldongCd = obj.ldongCd ? obj.ldongCd : '';
          }
          this.safelyDetectChanges();
        }
      )
    );
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewChecked(): void {
    // app에서는 GNB 숨김
    if (window.navigator.userAgent.includes('Mobile-App') && (this.router.url === '/home' || this.router.url === '/welcome')) {
      this.jQuery('.layout-header').hide();
      this.jQuery('.layout-content').css('padding', 0);
      // this.jQuery('.layout-content').css('padding-bottom', '1.875rem');
    } else {
      this.jQuery('.layout-header').show();
      this.jQuery('.layout-content').css('padding-top', '3.375rem');
      // this.jQuery('.layout-content').css('padding-bottom', '1.875rem');
    }
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
}
