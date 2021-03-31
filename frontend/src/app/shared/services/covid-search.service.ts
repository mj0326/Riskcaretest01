import {Injectable, Injector} from '@angular/core';
import {AbstractService} from '@shared/services/abstract.service';
import {Result} from '@shared/value/common.value';
import {LocationEdit} from '@shared/value/location.value';

@Injectable()
export class CovidSearchService extends AbstractService {

  private readonly COVID_SEARCH_API_URL = `${this.API_URL}/search`;

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Constructor
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  public constructor(injector: Injector) {
    super(injector);
  }

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Public Functions - 확진자 검색 관련
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

  /**
   * 이름으로 장소 검색
   * @param searchText 검색 장소
   */
  public getLocationWithSearch(searchText: string) {
    return this.get<Result<any>>(`${this.COVID_SEARCH_API_URL}/location?searchText=${searchText}`);
  }

  /**
   * 코드로 장소 검색
   * @param ldongCd 법정동 코드 리스트
   */
  public getLocationWithSearchByCd(lDongCds: string[]) {
    return this.get<Result<any>>(`${this.COVID_SEARCH_API_URL}/location/ldongcds?ldongCd=${lDongCds}`);
  }

  /**
   * 코로나 위험도 지수 조회
   * @param lDongCds - 법정동 코드 리스트
   */
  public getRiskDegreeWithLdongcds(lDongCds: string[]) {
    return this.get<Result<any>>(`${this.API_URL}/socialcontact/ldongcds?ldongCds=${lDongCds}`, null, {disableAuthorization: false, disableLoading: false});
  }

  /**
   * 코로나 일반 현황
   */
  public getCoronaCurrentState() {
    return this.get<Result<any>>(`${this.API_URL}/corona/stat`);
  }

  /**
   * 관심장소 조회 API
   */
  public getFavorlocation() {
    return this.get<Result<any>>(`${this.API_URL}/favorlocation`, null, {disableAuthorization: false, disableLoading: false});
  }

  /**
   * 관심장소 등록 API
   */
  public insertFavorlocation(ldongCd: string) {
    return this.post<Result<any>>(`${this.API_URL}/favorlocation`, ldongCd, {disableAuthorization: false, disableLoading: false});
  }

  /**
   * 관심장소 리스트 업데이트 API
   */
  public updateFavorlocations(locationEdits: LocationEdit[]) {
    return this.put<Result<any>>(`${this.API_URL}/favorlocations`, locationEdits, {disableAuthorization: false, disableLoading: false});
  }

  /**
   * 관심장소 삭제 API
   */
  public deleteFavorlocation(id: number) {
    return this.delete<Result<any>>(`${this.API_URL}/favorlocation/${id}`, {disableAuthorization: false, disableLoading: false});
  }

}
