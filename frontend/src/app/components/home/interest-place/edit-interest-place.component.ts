import {Component, ElementRef, Injector, OnInit} from '@angular/core';
import {AbstractComponent} from '@shared/component/abstract.component';
import {UrlPath} from '@shared/routes/url-path';
import {LayoutService} from '@layout/layout/layout.service';
import {CookieService} from '@shared/services/cookie.service';
import {Location, LocationEdit} from '@shared/value/location.value';
import {CovidSearchService} from '@shared/services/covid-search.service';
import {CommonConstant} from '@shared/constant/common-constant';
import {CookieConstant} from '@shared/constant/cookie-constant';
import {Utils} from '@shared/utils/utils';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {HomeService} from '@components/home/home.service';
declare let Tmapv2;

@Component({
  selector: 'edit-interest-place',
  templateUrl: './edit-interest-place.component.html',
  styleUrls: ['edit-interest-place.component.css']
})
export class EditInterestPlaceComponent extends AbstractComponent implements OnInit {
  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Public Variables
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  public currLocation: Location;
  public locations: LocationEdit[];
  public lDongCds: string[];
  public useGeolocation: boolean = false;
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
    private _homeSvc: HomeService,
    private _layoutSvc: LayoutService,
    private _searchSvc: CovidSearchService,
    private _cookieSvc: CookieService
  ) {
    super(elementRef, injector);
  }

  ngOnInit(): void {
    this._layoutSvc.isSubMode$.next({ isSubMode: true, isSectionRight:false, subTitle : '관심 장소 편집' });

    // 로그인 체크
    const token = this._cookieSvc.get(CookieConstant.KEY.ACCESS_TOKEN);
    this.isLogin = undefined !== token && ''!== token;

    if ( this.isLogin ) {
      this.initPageServer();
    } else {
      this.initPageLocal();
    }
  }
  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Override Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Public Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  /**
   * 관심 장소 추가로 이동
   */
  public moveAddInterestPage() {
    this.router.navigateByUrl(UrlPath.HOME.INTEREST_ADD);
  }

  /**
   * 장소 검색
   */
  public getLocation(lDongCds: string[]) {
    if ( lDongCds.length === 0 ) {
      this.locations = [];
      return;
    }

    this._searchSvc.getLocationWithSearchByCd(lDongCds).subscribe(result => {
      if(result.code === CommonConstant.RESULT_CODE.SUCCESS) {
        // response data
        const locations = result.data as LocationEdit[];
        // 쿠키 코드 순서대로 정렬
        this.locations = Utils.ArrayUtil.sortArray(this.lDongCds, locations, 'lDongCd');
      }
    });
  }

  /**
   * 관심 장소 삭제
   * @param location
   */
  public deleteInterest(location: LocationEdit) {
    if ( this.isLogin ) {
      this.deleteInterestServer(location);
    } else {
      this.deleteInterestLocal(location);
    }
  }

  /**
   * 관심 장소 드래그 재정
   * @param event
   */
  public reorderList(event: CdkDragDrop<string[]>){
    if ( this.isLogin ) {
      this.reorderListServer(event);
    } else {
      this.reorderListLocal(event);
    }
  }

  /**
   * 사용자의 현재 GPS 위치 반환
   */
  public getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=>{
        this.useGeolocation = true;

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const latlng = new Tmapv2.LatLng(latitude, longitude);

        this._homeSvc.getCurrentLocation(latlng).subscribe(result => {
            this.currLocation = new Location();
            this.currLocation.lDongCd = result['legalDongCode'];
            this.currLocation.dong = result['legalDong'];
            this.currLocation.siDo = result['city_do'];
            this.currLocation.siGunGu = result['gu_gun'];
          }
        );
      }, (err)=> {
        console.log(err.message);
      });
    } else {
      console.log('geolocation 미지원');
    }
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
        // 순서 정렬
        this.locations.sort((a, b) => {
          return a.order < b.order ? -1 : a.order > b.order ? 1 : 0;
        });
      }
    });
    // 현재 위치 조회
    this.getCurrentLocation();
  }

  private deleteInterestLocal(location: LocationEdit) {
    // index 가져오기
    const index = this.lDongCds.indexOf(location.lDongCd);
    // 배열에서 제거
    this.lDongCds.splice(index, 1);
    // css class (리스트 삭제 애니메이션)
    location.isDelete = true;
    // 쿠키 변경
    this._cookieSvc.set(CookieConstant.KEY.L_DONG_CDS, JSON.stringify(this.lDongCds), 0);

    // TODO: css 애니메이션 임시 callback 처리
    setTimeout(() => {
      // this.lDongCds 하고 순서가 동일함
      this.locations.splice(index, 1);
    }, 700);
  }

  private deleteInterestServer(location: LocationEdit) {
    this._searchSvc.deleteFavorlocation(location.favoriteLocationId).subscribe(result => {
      if (result.code === CommonConstant.RESULT_CODE.SUCCESS) {
        // css class (리스트 삭제 애니메이션)
        location.isDelete = true;

        for ( let i = 0, len = this.locations.length; i < len; i += 1 ) {
          if ( this.locations[i].favoriteLocationId === location.favoriteLocationId ) {
            setTimeout(() => {
              this.locations.splice(i, 1);
            }, 700);
            break;
          }
        }
      }
    });
  }

  private reorderListLocal(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.locations, event.previousIndex, event.currentIndex);
    let idx=0;
    this.locations.forEach(value => {
      this.lDongCds[idx++]=value.lDongCd;
    });
    // 쿠키 변경
    this._cookieSvc.set(CookieConstant.KEY.L_DONG_CDS, JSON.stringify(this.lDongCds),0);
    this.getLocation(this.lDongCds);
  }

  private reorderListServer(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.locations, event.previousIndex, event.currentIndex);
    let idx = 1;
    this.locations.forEach(loc => {
      loc.order = idx++;
    })

    this._searchSvc.updateFavorlocations(this.locations).subscribe(result => {
      if(result.code === CommonConstant.RESULT_CODE.SUCCESS){
        console.log('update success');
      }
    });
  }

}
