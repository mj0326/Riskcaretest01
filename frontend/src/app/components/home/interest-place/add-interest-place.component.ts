import {Component, ElementRef, Injector, OnInit} from '@angular/core';
import {AbstractComponent} from '@shared/component/abstract.component';
import {LayoutService} from '@layout/layout/layout.service';
import {CovidSearchService} from '@shared/services/covid-search.service';
import {CommonConstant} from '@shared/constant/common-constant';
import {Location} from '@shared/value/location.value';
import {CookieService} from '@shared/services/cookie.service';
import {CookieConstant} from '@shared/constant/cookie-constant';
import {PopupService} from '@shared/component/popup/popup.service';

@Component({
  selector: 'add-interest-place',
  templateUrl: './add-interest-place.component.html'
})
export class AddInterestPlaceComponent extends AbstractComponent implements OnInit {
  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Public Variables
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  public searchText = '';
  public searchFlag: boolean = false;
  public searchResult: Location[];
  public focusIn: boolean = false;
  public isLogin: boolean = false;
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
    private _searchSvc: CovidSearchService,
    private _cookieSvc: CookieService,
    private _popupSvc: PopupService
  ) {
    super(elementRef, injector);
  }
  ngOnInit(): void {
    this._layoutSvc.isSubMode$.next({ isSubMode: true, isSectionRight: false, subTitle : '관심 장소 추가' });

    // 로그인 체크
    const token = this._cookieSvc.get(CookieConstant.KEY.ACCESS_TOKEN);
    this.isLogin = undefined !== token && ''!== token;
  }
  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Override Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Public Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  /**
   * 장소 검색
   */
  public searchLocation() {
    this._searchSvc.getLocationWithSearch(this.searchText).subscribe(result => {
      if(result.code === CommonConstant.RESULT_CODE.SUCCESS) {
        this.searchResult = result.data as Location[];
        this.searchFlag = true;
      }
    });
  }

  /**
   * 검색어 변경
   * @param text 변경된 텍스트
   */
  public textChanged(text: string) {
    this.searchText = text;
  }

  /**
   * 검색 모드로 변경
   */
  public returnToSearch(event: Event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    this.searchFlag = false
    this.focusIn = true;
  }

  /**
   * 관심장소 추가
   * @param location
   */
  public addInterestPlace( location: Location ) {
    if ( this.isLogin ) {
      this.addInterestPlaceServer( location );
    } else {
      this.addInterestPlaceLocal( location );
    }

  }

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Private Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  /**
   * 관심장소 저장 (쿠키)
   * @param location
   */
  private addInterestPlaceLocal( location: Location ) {
    // code 쿠키
    const lDongCdsStr: string = this._cookieSvc.get(CookieConstant.KEY.L_DONG_CDS);
    let   lDongCds: string[] = lDongCdsStr !== '' ? JSON.parse(lDongCdsStr) : [];

    // 쿠키에 저장할 배열에 선택한 관심장소 코드 추가
    lDongCds.push(location.lDongCd);
    // 중복 값 제거
    lDongCds = Array.from(new Set(lDongCds));
    // 쿠키 설정
    this._cookieSvc.set(CookieConstant.KEY.L_DONG_CDS, JSON.stringify(lDongCds), 0);

    // TODO: css 애니메이션 임시 callback 처리
    this._popupSvc.show();
    setTimeout(() => {
      this._popupSvc.hide();
      this.router.navigateByUrl('risk-degree/' + location.lDongCd);
    }, 1500);
  }

  /**
   * 관심장소 저장 (DB)
   * @param location
   */
  private addInterestPlaceServer( location: Location ) {
    this._searchSvc.insertFavorlocation(location.lDongCd).subscribe(result => {
      if (result.code === CommonConstant.RESULT_CODE.SUCCESS) {
        // TODO: css 애니메이션 임시 callback 처리
        this._popupSvc.show();
        setTimeout(() => {
          this._popupSvc.hide();
          this.router.navigateByUrl('risk-degree/' + location.lDongCd);
        }, 1500);
      } else {
        alert(result.message);
      }
    });
  }

}
