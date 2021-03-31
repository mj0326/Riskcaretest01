import {Injectable, Injector} from '@angular/core';
import {AbstractService} from '@shared/services/abstract.service';

@Injectable()
export class MapService extends AbstractService {
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
   * 주소로 좌표 반환
   * @param projectId 프로젝트 아이디
   */
  public getLatlangWithAddress(addr: string) {
    const params = {
      appKey : 'l7xxd78734c09b7b498cabf1efce0f585a9f',
      coordType : 'WGS84GEO',
      fullAddr : addr
    }
    return this.http.get(`https://apis.openapi.sk.com/tmap/geo/fullAddrGeo?version=1&format=json&callback=result`,  {params : params});
  }
}
