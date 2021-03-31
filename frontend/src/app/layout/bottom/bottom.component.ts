import {Component, ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {AbstractComponent} from '@shared/component/abstract.component';
import {LayoutService} from '@layout/layout/layout.service';
import {CovidSearchService} from '@shared/services/covid-search.service';
import {CommonConstant} from '@shared/constant/common-constant';


@Component({
  selector: 'div[bottom]',
  templateUrl: './bottom.component.html',
})
export class BottomComponent extends AbstractComponent implements OnInit, OnDestroy {
  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Public Variables
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  public coronaState: CoronaState = new CoronaState();
  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Private Variables
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Constructor
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  constructor(
    protected elementRef: ElementRef,
    protected  injector: Injector,
    private _layoutSvc: LayoutService,
    private _searchSvc: CovidSearchService) {
    super(elementRef, injector);
  }

  ngOnInit() {
    super.ngOnInit();
    this._init();
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
   * 메뉴 클릭시
   */
  public onClickMenu() {
    this._layoutSvc.isLnbOpened$.next(true);
  } // func - onClickMenu

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Private Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  /**
   * 코로나 일반 현황 조회
   */
  private _init() {
    this._searchSvc.getCoronaCurrentState().subscribe(
      result => {
       if(result.code === CommonConstant.RESULT_CODE.SUCCESS) {
         this.coronaState = result.data as CoronaState;
         this.safelyDetectChanges();
       }
      }
    )
  }
}

export class CoronaState {
  public patientsAccumulated: number;
  public patientsToday: number;
  public vaccineAccumulated: number;
  public vaccineYesterDay: number;
}
