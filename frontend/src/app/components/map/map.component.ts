import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Injector, OnInit} from '@angular/core';
import {AbstractComponent} from '@shared/component/abstract.component';
import {HomeService} from '@components/home/home.service';
import {MapService} from '@components/map/map.service';
declare let Tmapv2;

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent extends AbstractComponent implements OnInit, AfterViewInit{
  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Public Variables
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  public siDo: string = '';
  public siGungu: string = '';
  public dong: string = '';
  public marker;
  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Private Variables
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  private _map;
  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Constructor
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  constructor(
    protected elementRef: ElementRef,
    protected injector: Injector,
    private _homeSvc: HomeService,
    private _mapSvc: MapService
  ) {
    super(elementRef, injector);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this._map = new Tmapv2.Map('section-map',  // "_map" : 지도가 표시될 div의 id
      {
        center: new Tmapv2.LatLng(37.566481622437934,126.98502302169841), // 지도 초기 좌표
        zoomControl: false
      });
    this._map.addListener('zoom_changed', this.zoomChanged); // 지도의 줌 변경시, 이벤트 리스너 등록.
    this.testMarker();
  }
  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Override Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Public Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  /**
   * 위험도 상세 조회
   * @param id 해당 위험도 상세 Id
   */
  public goToRisk(id: number) {
    this.router.navigateByUrl(`risk-degree/${id}`);
  }

  /**
   * 사용자의 현재 GPS 위치 반환
   */
  public getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=>{
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        const latlng = new Tmapv2.LatLng(latitude, longitude);
        this._map.setCenter(latlng);
        this._map.setZoom(17);
        // @ts-ignore
        const marker = new Tmapv2.Marker({
          position: latlng, // Marker의 중심좌표 설정.
          map: this._map, // Marker가 표시될 Map 설정.
          icon: ''
        });
        console.log(latlng);
        this._homeSvc.getCurrentLocation(latlng).subscribe(
          result => {
            console.log(result);
          }
        );
      }, (err)=> {
        console.log(err.message);
      });
    } else {
      alert('geolocation 미지원');
    }
  }
  /**
   * zoom 정도 변경
   * @param type 줌 타입 (인, 아웃)
   */
  public changeZoom(type: string) {
    if(type === 'in') {
      this._map.zoomIn();
    } else {
      this._map.zoomOut();
    }
  }
  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Private Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  /**
   * 줌 변경 시 이벤트 리스너
   * @param e 줌 변경 이벤트
   */
  private zoomChanged(e) {
    console.log(e);
  }

  private testMarker() {
    const addrList = ['분당구 서현동', '수정구 시흥동', '분당구 수내동', '강남구 논현동'];
    for(const addr of addrList) {
      console.log(addr);
      this._mapSvc.getLatlangWithAddress(addr).subscribe(
        result => {
          // @ts-ignore
          const data = result.coordinateInfo.coordinate[0];
          this.marker = new Tmapv2.Marker({
            position: new Tmapv2.LatLng(data.lat, data.lon),
            map: this._map
          });
        }
      );
    }
  }
}
