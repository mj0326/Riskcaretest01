import {Component, ElementRef, Injector, OnInit} from '@angular/core';
import {AbstractComponent} from '@shared/component/abstract.component';
import {LayoutService} from '@layout/layout/layout.service';

@Component({
  selector: 'service-introduce',
  templateUrl: './service-introduce.component.html'
})
export class ServiceIntroduceComponent extends AbstractComponent implements OnInit {
  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Public Variables
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  public selectedTab;
  public ServiceIntroduceTab = ServiceIntroduceTab;

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Private Variables
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Constructor
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  constructor(
    protected elementRef: ElementRef,
    protected injector: Injector,
    private _layoutSvc: LayoutService
  ) {
    super(elementRef, injector);
  }

  ngOnInit(): void {
    this._layoutSvc.isSubMode$.next({ isSubMode: true, isSectionRight:false, subTitle : '서비스 소개' });

    setTimeout(() => {
      this.selectedTab = ServiceIntroduceTab.INTRO;
    }, 300);
  }



  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Override Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Public Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

  /**
   * 탭 변경시
   * @param tab
   */
  public onClickTab(tab: ServiceIntroduceTab) {
    this.selectedTab = tab;
  }


  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Private Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
}

enum ServiceIntroduceTab {
  INTRO = 'INTRO',
  ANALYZE_DATA = 'ANALYZE_DATA',
  COVID_DANGER = 'COVID_DANGER',
  MAIN_INDEX = 'MAIN_INDEX'
}
