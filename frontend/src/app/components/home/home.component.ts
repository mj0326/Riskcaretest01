import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Injector, OnInit} from '@angular/core';
import {AbstractComponent} from '@shared/component/abstract.component';
import {UrlPath} from '@shared/routes/url-path';
import {HomeService} from '@components/home/home.service';
import {LayoutService} from '@layout/layout/layout.service';
import {Location, LocationHome} from '@shared/value/location.value';
import {CookieService} from '@shared/services/cookie.service';
import {CookieConstant} from '@shared/constant/cookie-constant';
import {CovidSearchService} from '@shared/services/covid-search.service';
import {Utils} from '@shared/utils/utils';
import {CommonConstant} from '@shared/constant/common-constant';
declare let Tmapv2;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent extends AbstractComponent implements OnInit, AfterViewInit{
  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Public Variables
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  public bom = {
    Math : Math
  };

  public currLocation: LocationHome;
  public locations: LocationHome[];
  public lDongCds: string[];
  public useGeolocation: boolean = false;
  public isLogin: boolean = false;

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Private Variables
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  private covidContent = {
    very_low    : {step: '양호', typeNameCss: 'type-a', title: '코로나19 위험도가 양호한 편입니다.'},
    low         : {step: '보통', typeNameCss: 'type-b', title: '코로나19 위험도가 보통입니다.'},
    middle      : {step: '주의', typeNameCss: 'type-c', title: '코로나19 위험이 주의가 필요합니다.'},
    high        : {step: '위험', typeNameCss: 'type-d', title: '코로나19 위험이 높은 장소입니다.'},
    very_high   : {step: '심각', typeNameCss: 'type-e', title: '코로나19 위험도가 매우 높습니다.'}
  };

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Constructor
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  constructor(
    protected elementRef: ElementRef,
    protected injector: Injector,
    private _homeSvc: HomeService,
    private _layoutSvc: LayoutService,
    private _searchSvc: CovidSearchService,
    private _cookieSvc: CookieService
  ) {
    super(elementRef, injector);
  }

  ngOnInit(): void {
    this._layoutSvc.isSubMode$.next({isSubMode: false});

    // 로그인 체크
    const token = this._cookieSvc.get(CookieConstant.KEY.ACCESS_TOKEN);
    this.isLogin = undefined !== token && ''!== token;

    if ( this.isLogin ) {
      this.initPageServer();
    } else {
      this.initPageLocal();
    }
  }

  ngAfterViewInit() {
  }
  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Override Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Public Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  /**
   * 관심 장소 편집으로 이동
   */
  public moveEditInterestPage() {
    this.router.navigateByUrl(UrlPath.HOME.INTEREST_EDIT);
  }

  /**
   * 상세 페이지 이동
   * @param location
   */
  public moveDetailPage(location: Location) {
    this.router.navigateByUrl('risk-degree/' + location.lDongCd);
  }

  /**
   * 사용자의 현재 GPS 위치 반환
   */
  public getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.useGeolocation = true;
        const latlng = new Tmapv2.LatLng(position.coords.latitude, position.coords.longitude);

        this._homeSvc.getCurrentLocation(latlng).subscribe(result => {
          this.currLocation = new LocationHome();
          this.currLocation.lDongCd = result['legalDongCode'];
          this.currLocation.dong = result['legalDong'];
          this.currLocation.siDo = result['city_do'];
          this.currLocation.siGunGu = result['gu_gun'];

          this._searchSvc.getRiskDegreeWithLdongcds([this.currLocation.lDongCd]).subscribe(result => {
            if(result.code === CommonConstant.RESULT_CODE.SUCCESS) {
              // response data
              const locations = result.data;
              if ( locations?.length === 0 ) { return; }
              const location = locations[0];

              // this.currLocation.contactCovidClass = location['contactCovidClass'];
              // this.currLocation.contactIndex = location['contactIndex'];
              // this.currLocation.contactIndexPercentile = location['contactIndexPercentile'];
              this.currLocation.contactDensityPercentile = location['contactDensityPercentile'];
              this.currLocation.isExpand = false;
              this.currLocation.covidContent = this.getCovidClass(location['contactDensityPercentile']);

              this.safelyDetectChanges();
            }
          });

          this.safelyDetectChanges();
        });
      }, (err)=> {
        console.log(err.message);
      });
    } else {
      console.log('geolocation 미지원');
    }
  }

  /**
   * 장소 검색
   */
  public getLocation(lDongCds: string[]) {
    if ( lDongCds.length === 0 ) {
      this.locations = [];
      this.safelyDetectChanges();
      return;
    }

    this._searchSvc.getLocationWithSearchByCd(lDongCds).subscribe(result => {
      if(result.code === CommonConstant.RESULT_CODE.SUCCESS) {
        // response data
        const locations = result.data;
        // 쿠키 코드 순서대로 정렬
        this.locations = Utils.ArrayUtil.sortArray(this.lDongCds, locations, 'lDongCd');

        this.safelyDetectChanges();

        this.setRiskDegree(lDongCds);
      }
    });
  }

  /**
   * 코로나 위험도 지수 조회
   */
  public setRiskDegree(lDongCds: string[]) {

    this._searchSvc.getRiskDegreeWithLdongcds(lDongCds).subscribe(result => {
      if(result.code === CommonConstant.RESULT_CODE.SUCCESS) {
        // response data
        const reslocations = result.data as LocationHome[];

        this.locations.forEach((location) => {
          for ( let reslocation of reslocations ) {
            if ( location.lDongCd === reslocation.lDongCd ) {
              // location.contactCovidClass = reslocation.contactCovidClass;
              // location.contactIndexPercentile = reslocation.contactIndexPercentile;
              location.contactDensityPercentile = reslocation.contactDensityPercentile;
              location.order = reslocation.order;
              location.covidContent = this.getCovidClass(reslocation.contactDensityPercentile);
              break;
            }
          }
        });

        this.safelyDetectChanges();
      }
    });

  }

  /**
   * 코로나 위험도 지수 조회
   */
  // public getRiskDegree(lDongCds: string[]) {
  //   if ( lDongCds.length === 0 ) {
  //     this.locations = [];
  //     this.safelyDetectChanges();
  //     return;
  //   }
  //
  //   this._searchSvc.getRiskDegreeWithLdongcds(lDongCds).subscribe(result => {
  //     if(result.code === CommonConstant.RESULT_CODE.SUCCESS) {
  //       // response data
  //       const locations = result.data;
  //
  //       // 쿠키 코드 순서대로 정렬
  //       this.locations = Utils.ArrayUtil.sortArray(this.lDongCds, locations, 'lDongCd');
  //       this.locations.forEach((location) => {
  //         // location.isExpand = false;
  //         location.covidContent = this.covidContent[location.contactCovidClass];
  //       });
  //
  //       this.safelyDetectChanges();
  //     }
  //   });
  // }

  /**
   * 리스트 아이템 확장
   * @param location
   */
  public applyExpand(location: LocationHome) {
    // 아이템 현재 확장 상태 저장
    const beforeVal = location.isExpand === undefined ? false : location.isExpand;
    // 리스트 아이템 전부 닫기
    this.applyAllExpand(false);
    // 기존 값에서 반대로 바꿈
    location.isExpand = ! beforeVal;
  }

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Private Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  private initPageLocal() {
    // code 쿠키
    const lDongCdsStr: string = this._cookieSvc.get(CookieConstant.KEY.L_DONG_CDS);
    let lDongCds: string[] = lDongCdsStr !== '' ? JSON.parse(lDongCdsStr) : [];
    // 중복 값 제거 및 초기화
    this.lDongCds = Array.from(new Set(lDongCds));
    // 지역 조회
    this.getLocation(this.lDongCds);
    // 현재 위치 조회
    this.getCurrentLocation();
  }

  private initPageServer() {
    this._searchSvc.getFavorlocation().subscribe(result => {
      if (result.code === CommonConstant.RESULT_CODE.SUCCESS) {
        // response data
        const locations = result.data;
        this.locations = locations;
        this.locations.forEach((location) => {
          // location.isExpand = false;
          location.covidContent = this.getCovidClass(location.contactDensityPercentile);
        });
        // 순서 정렬
        this.locations.sort((a, b) => {
          return a.order < b.order ? -1 : a.order > b.order ? 1 : 0;
        });
      }
    });
    // 현재 위치 조회
    this.getCurrentLocation();
  }

  /**
   * 리스트 아이템 확장 상태 일괄 적용
   * @param value
   */
  private applyAllExpand(value: boolean) {
    this.currLocation && (this.currLocation.isExpand = value);
    if(this.locations && this.locations.length !== 0) {
      this.locations.forEach((location) => {
        location.isExpand = value;
      });
    }
  }

  /**
   * 코로나 단계 리턴
   * @param percentile
   */
  private getCovidClass(percentile: number) {
    let covidContent;
    if ( percentile === undefined ) { return {}; }

    if      ( percentile >= 80 ) { covidContent = this.covidContent.very_high; }
    else if ( percentile >= 60 ) { covidContent = this.covidContent.high; }
    else if ( percentile >= 40 ) { covidContent = this.covidContent.middle; }
    else if ( percentile >= 20 ) { covidContent = this.covidContent.low; }
    else                         { covidContent = this.covidContent.very_low; }
    return covidContent;
  }



}
