import {Injectable, Injector} from '@angular/core';
import {AbstractService} from '@shared/services/abstract.service';
import {map} from 'rxjs/operators';

@Injectable()
export class HomeService extends AbstractService {
  // private readonly WELCOME_API_URL = `${this.API_URL}/admin/board`;

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Constructor
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  public constructor(injector: Injector) {
    super(injector);
  }

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Public Functions - xx 관련
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  /**
   * 현재 좌표를 사용하여 주소 반환
   * @param projectId 프로젝트 아이디
   */
  public getCurrentLocation(latlng: any) {
    const params = {
      appKey : 'l7xxd78734c09b7b498cabf1efce0f585a9f',
      coordType : 'WGS84GEO',
      addressType : 'A10',
      lon : latlng._lng,
      lat : latlng._lat
    }
    return this.http.get(`https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&format=json&callback=result`,  {params : params}).pipe(
      map(
        result => {
          // @ts-ignore
          result = result.addressInfo;
          return result;
        }
      ),
    );
  }
}
