import {Injectable, Injector} from '@angular/core';
import {AbstractService} from '@shared/services/abstract.service';
import {Result} from '@shared/value/common.value';

@Injectable()
export class  RiskDegreeDetailService extends AbstractService {

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
   * 코로나 위험도 상세
   * @param lDongCd 법정동 코드
   */
  public getRiskDegreeDetail(lDongCd: string) {
    return this.get<Result<any>>(`${this.API_URL}/socialcontact/ldongcd?ldongCd=${lDongCd}`);
  }
  /**
   * 코로나 위험도 일간
   * @param day 날짜
   */
  public getDayRiskDegree(lDongCd: string, ymd: string) {
    let url = `${this.API_URL}/socialcontact/ldongcd/timeseries/day?ldongCd=${lDongCd}`;
    ymd && (url += `&baseYmd=${ymd}`)
    console.log(url);
    return this.get<Result<any>>(url);
  }
  /**
   * 시간 별 위험도 상세
   * @param lDongCd 법정동 코드, ymd 날짜(yyyyMMdd), hour 시각(HH)
   */
  public getTimeRiskDegree(lDongCd: string, ymd: string, hour: string) {
    const url = `${this.API_URL}/socialcontact/ldongcd/timeseries/hour?ldongCd=${lDongCd}&baseYmd=${ymd}&baseHour=${hour}`;
    console.log(url);
    return this.get<Result<any>>(url);
  }

  /**
   * 금주 주간 위험도
   * @param lDongCd 법정동 코드
   */
  public getWeekRiskDegree(lDongCd: string) {
    return this.get<Result<any>>(`${this.API_URL}/socialcontact/ldongcd/timeseries/week?ldongCd=${lDongCd}`);
  }
  /**
   * 전주 주간 위험도
   * @param lDongCd 법정동 코드
   */
  public getPreWeekRiskDegree(lDongCd: string) {
    return this.get<Result<any>>(`${this.API_URL}/socialcontact/ldongcd/timeseries/preweek?ldongCd=${lDongCd}`);
  }
}
