import {Component, ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {AbstractComponent} from '@shared/component/abstract.component';
import {LayoutService} from '@layout/layout/layout.service';
import {CommonConstant} from '@shared/constant/common-constant';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {RiskDegreeDetailService} from '@components/risk-degree/risk-degree-detail.service';
import {Utils} from '@shared/utils/utils';
import DateUtil = Utils.DateUtil;
import * as _ from 'lodash';
import {CookieConstant} from '@shared/constant/cookie-constant';
import {CookieService} from '@shared/services/cookie.service';

declare let echarts: any;

@Component({
  selector: 'risk-degree-detail',
  templateUrl: './risk-degree-detail.component.html'
})
export class RiskDegreeDetailComponent extends AbstractComponent implements OnInit, OnDestroy {
  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Public Variables
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  public bom = {
    Math : Math
  };

  public isLogin: boolean = false;
  public barChart: any;
  public radarChart: any;
  public BarChartMode = BarChartMode;
  public barChartMode: string = BarChartMode.DAY;
  public isShowPopup: boolean = false;
  public isComplete: boolean = false;
  public selectedDataIdx: number = null;
  public currentTimeIdx: number = null;
  public dayLabel = ['월', '화', '수', '목', '금', '토', '일'];
  public dayClass = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  public selectedDate: Date = new Date();
  public ymd;
  public dayRiskDegreeList: DayRiskDegree[] = [];
  public weekType = 'current';
  public weekRiskInfoList: WeekRisk[] = [];
  // 나중에 @Input 으로 바꾸기
  public ldongCd: string;
  public riskDegreeInfo: RiskDegree = null;
  public riskDegree: number; // 위험지수
  public riskType: string; // 위험지수 class for css
  public riskLevelMap: Map<string, string> = new Map([
    [ 'a', '양호' ], [ 'b', '보통'], [ 'c', '주의'], ['d', '위험'], ['e', '심각']]);
  public currentTime: Date = new Date();
  public currentTimeKr: string;
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
    private _cookieSvc: CookieService,
    private _riskDegreeDetailSvc: RiskDegreeDetailService
  ) {
    super(elementRef, injector);
    this.subscriptions.push(
      this.activatedRoute.params.subscribe(
        (params) => {
          this.ldongCd = params.id;
        }
      )
    )
  }

  ngOnInit(): void {
    // ldongCd로 정보 얻어오기
    this._layoutSvc.isSubMode$.next({isSubMode: true, isSectionRight: true, subTitle: '', ldongCd: this.ldongCd});

    // 로그인 체크
    const token = this._cookieSvc.get(CookieConstant.KEY.ACCESS_TOKEN);
    this.isLogin = undefined !== token && ''!== token;

    this.currentTime = new Date();
    this.ymd = DateUtil.dateToYmdString(this.currentTime);
    this._getDetailInfo();
    this._getDayRiskDegree();

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
   * 위험도 별 레벨 반환
   * @param riskDegree 위험도
   */
  public setRiskLevel(percentile: number) {
    let riskType: string;
    if      ( percentile >= 80 ) { riskType = 'e'; }
    else if ( percentile >= 60 ) { riskType = 'd'; }
    else if ( percentile >= 40 ) { riskType = 'c'; }
    else if ( percentile >= 20 ) { riskType = 'b'; }
    else                         { riskType = 'a'; }
    this.riskType = riskType;
  }
  /**
   * 주간, 일간 위험도 모드 변환
   * @param type 모드 종류 (주간, 일간)
   */
  public changeBarChartMode(type: string) {
    if(this.selectedDataIdx) {
      this.drawRadarChart();
    }
    this.barChartMode = type;
    if(type === BarChartMode.DAY) {
      setTimeout(
        () => {
          this.drawBarChart();
        }, 100
      );
      this.safelyDetectChanges();
    } else {
      this.weekType = 'current';
      this.getWeekInfo(this.weekType);
    }
  }
  /**
   * 언제가 위험할까 - 일간 Bar 차트 그리기
   */
  public drawBarChart() {
    // DOM을 준비하고 echart 객체를 만듭니다.
    const element = document.getElementById('barChart') as HTMLDivElement;
    this.barChart = echarts.init(element);
    // 차트 속성과 데이터를 지정합니다.
    this.currentTimeIdx = this.currentTime.getHours() % 24;
    const xAxisData = [];
    const seriesData = [];
    this.dayRiskDegreeList.forEach(
      (item, idx) => {
        if(idx === this.currentTimeIdx) {
          xAxisData.push({
            value: '현재',
            textStyle: {
              color: 'rgb(86,86,86)',
              fontWeight: 'bold',
              fontSize: 13
            }
          });
          seriesData.push(
            {
              value: item.contactDensityPercentile,
              itemStyle: {
                borderColor: 'rgb(47,46,46)',
                color: this._getColorWithDegree(item.contactDensityPercentile)
              }
            }
          );
        } else {
          xAxisData.push(idx + '시');
          seriesData.push(
            {
            value: item.contactDensityPercentile,
            itemStyle: {
              color: this._getColorWithDegree(item.contactDensityPercentile)
            }
          }
          );
        }
      }
    );
    const barOption = {
      grid: {
        left: element.offsetWidth > 250 ? '10%' : '12%',
        right: '2%',
        top: '0%',
        bottom: '15%'
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          interval: (index, _value) => {
            if(index === this.currentTimeIdx) { return true; }
            if(index % 3 === 0) {
              if(element.offsetWidth < 303) {
                return Math.abs(index - this.currentTimeIdx) > 2;
              } else if(element.offsetWidth >= 303) {
                return Math.abs(index - this.currentTimeIdx) > 1;
              }
            }
          },
          margin: 4.5,
          showMinLabel: true,
          showMaxLabel: true,
          align: 'center',
          fontSize: 11,
          color: 'rgba(180, 180, 180, 1)'
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value, _index) => {
            if      ( value >= 80 ) { return '심각'; }
            else if ( value >= 60 ) { return '위험'; }
            else if ( value >= 40 ) { return '주의'; }
            else if ( value >= 20 ) { return '보통'; }
            else                    { return '양호'; }
          },
          showMinLabel: false,
          verticalAlign: 'top',
        },
        min: 0,
        max: 100,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      series: [{
        data: seriesData,
        type: 'bar',
        itemStyle: {
          barBorderRadius: [50, 50, 50, 50]
        },
        barWidth: 7,
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
          borderRadius: [50, 50, 50, 50]
        },
        center: ['50%', '50%'],
        select: {
          label: {
            show: false
          },
          itemStyle: {
            borderColor: 'rgb(55,74,246)'
          }
        },
        selectedMode: 'single'
      }],
    };
    // 위에서 설정한 속성을 차트에 반영합니다.
    this.barChart.setOption(barOption);
    this.barChart.on('click', (params) => {
      this.selectedDataIdx = params.dataIndex === this.selectedDataIdx ? null : params.dataIndex;
      if(this.selectedDataIdx) {
        this._riskDegreeDetailSvc.getTimeRiskDegree(this.ldongCd, this.ymd, this.selectedDataIdx < 10 ? '0' + this.selectedDataIdx : this.selectedDataIdx.toString()).subscribe(
          result => {
            this.drawRadarChart(result.data[0] as RiskDegree);
          }
        );
      } else {
        this.drawRadarChart();
      }
    });
  }

  private _getColorWithDegree(degree: number) {
    if      ( degree >= 80 ) { return 'rgb(101,3,162)'; }
    else if ( degree >= 60 ) { return 'rgb(248,23,117)'; }
    else if ( degree >= 40 ) { return 'rgb(233,145,50)'; }
    else if ( degree >= 20 ) { return 'rgb(233,145,50)'; }
    else                     { return 'rgb(39,221,169)'; }
  }
  /**
   * 얼마나 위험할까 - Radar 차트 그리기
   */
  public drawRadarChart(selectedTime?: RiskDegree) {
    const data = [];
    data.push({
      value: [this.riskDegreeInfo.flowDensityPercentile, this.riskDegreeInfo.subwayDensityPercentile, this.riskDegreeInfo.congestionPercentile, this.riskDegreeInfo.taxiDensityPercentile],
      name: 'current',
      lineStyle: {
        color: 'rgb(241,45,45)'
      },
      itemStyle: {
        color: 'rgb(241,45,45)'
      },
      areaStyle: {
        color: 'rgba(241, 45, 45, 0.4)'
      }
    });
    selectedTime && data.push({
      value: [selectedTime.flowDensityPercentile, selectedTime.subwayDensityPercentile, selectedTime.congestionPercentile, selectedTime.taxiDensityPercentile],
      name: 'selected',
      lineStyle: {
        color: 'rgb(9,5,134)'
      },
      itemStyle: {
        color: 'rgb(9,5,134)'
      }
    })
    // DOM을 준비하고 echart 객체를 만듭니다.
    this.radarChart = echarts.init(document.getElementById('radarChart') as HTMLDivElement);
    // 차트 속성과 데이터를 지정합니다.
    const radarOption = {
      title: {
        text: ''
      },
      tooltip: {
        show: false
      },
      radar: {
        // shape: 'circle',
        name: {
          textStyle: {
            color: '#000000',
            borderRadius: 3,
            padding: [1, 0]
          }
        },
        indicator: [
          { name: '', max: 100},
          { name: '', max: 100},
          { name: '', max: 100},
          { name: '', max: 100},
        ],
        splitArea: {
          show: false
        },
        radius: ['0%', '97%']
      },
      series: [{
        name: '',
        type: 'radar',
        data: data
      }]
    };
    // 위에서 설정한 속성을 차트에 반영합니다.
    this.radarChart.setOption(radarOption);
  }
  /**
   * 주간 이동
   * @param type 이동 종류 (이전, 이후)
   */
  public moveWeekIdx(type: string) {
    this.weekRiskInfoList = [];
    if(type === 'before') {
      this.weekType = 'prev';
    } else if(type === 'after') {
      this.weekType = 'current';
    }
    this.getWeekInfo(this.weekType);
  }
  /**
   * 일간 이동
   * @param type 이동 종류 (이전, 이후)
   */
  public moveDayIdx(type: string) {
    this.barChart.clear();
    if(type === 'before') {
      this.selectedDate.setDate(this.selectedDate.getDate() - 1);
    } else if(type === 'after') {
      this.selectedDate.setDate(this.selectedDate.getDate() + 1);
    }
    this.ymd = DateUtil.dateToYmdString(this.selectedDate);
    this.safelyDetectChanges();
    this._getDayRiskDegree();
  }
  /**
   * 지수 별 위험도 반환
   * @param degree 지수
   */
  public getRiskLevel(degree: number, type: string) {
    if      ( degree >= 80 ) { return type === 'class' ? 'e' : '심각'; }
    else if ( degree >= 60 ) { return type === 'class' ? 'd' : '위험'; }
    else if ( degree >= 40 ) { return type === 'class' ? 'c' : '주의'; }
    else if ( degree >= 20 ) { return type === 'class' ? 'b' : '보통'; }
    else                     { return type === 'class' ? 'a' : '양호'; }
  }

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Private Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  /**
   * 위험도 상세 조회
   */
  private _getDetailInfo() {
    this._riskDegreeDetailSvc.getRiskDegreeDetail(this.ldongCd).pipe(
      catchError(error => {
        console.log(error.statusText);
        return throwError(error);
      })
    ).subscribe(
      result => {
        if(result.code === CommonConstant.RESULT_CODE.SUCCESS) {
          console.log('=== 위험도 상세 조회 ===');
          console.log(result);
          if (result.data && result.data.length > 0) {
            this.riskDegreeInfo = result.data[0] as RiskDegree;
            // this.setRiskLevel(this.riskDegreeInfo.contactCovidClass);
            this.setRiskLevel(this.riskDegreeInfo.contactDensityPercentile);
            this._layoutSvc.isSubMode$.next({isSubMode: true, isSectionRight: true, subTitle: this.riskDegreeInfo.dong ? this.riskDegreeInfo.dong : (this.riskDegreeInfo.siGunGu ? this.riskDegreeInfo.siGunGu : this.riskDegreeInfo.siDo), ldongCd: this.ldongCd});
            this.isComplete = true;
            this.drawRadarChart();
          } else {
            alert('데이터가 없습니다.');
            this.location.back();
          }

        }
      }
    )
  }

  /**
   * 일간 위험도 조회
   */
  private _getDayRiskDegree() {
    this._riskDegreeDetailSvc.getDayRiskDegree( this.ldongCd, this.ymd).pipe(
      catchError(
        error => {
          console.log(error.statusText);
          return throwError(error);
        }
      )
    ).subscribe(
      result => {
        if(result.code === CommonConstant.RESULT_CODE.SUCCESS) {
          this.dayRiskDegreeList = result.data as DayRiskDegree[];
          this.drawBarChart();
        }
      }
    );
  }

  /**
   * 주간 위험도 조회
   */
  public getWeekInfo(type: string){
    if(type === 'current') {
      this.getWeekRiskDegree();
    } else {
      this.getPreWeekRiskDegree();
    }
  }

  /**
   * 금주 주간 위험도 조회
   */
  public getWeekRiskDegree() {
    this._riskDegreeDetailSvc.getWeekRiskDegree(this.ldongCd).pipe(
      catchError(
        error => {
          console.log(error.statusText);
          return throwError(error);
        }
      )
    ).subscribe(
      result => {
        console.log(result);
        if(result.code === CommonConstant.RESULT_CODE.SUCCESS) {
          console.log('==== 주간 위험도 조회 ====');
          console.log(result);
          this.weekRiskInfoList = result.data as WeekRisk[];
          if(this.weekRiskInfoList.length === 0) {
            // 임시 데이터
            this.weekRiskInfoList = [
              {
                dt: '2021-03-26T09:00:00',
                contactDensityPercentile: 50
              },
              {
                dt: '2021-03-27T09:00:00',
                contactDensityPercentile: 30
              },
              {
                dt: '2021-03-28T09:00:00',
                contactDensityPercentile: 60
              },
              {
                dt: '2021-03-29T09:00:00',
                contactDensityPercentile: 70
              },
              {
                dt: '2021-03-30T09:00:00',
                contactDensityPercentile: 85
              },
              {
                dt: '2021-03-31T09:00:00',
                contactDensityPercentile: 90
              },
              {
                dt: '2021-04-01T09:00:00',
                contactDensityPercentile: 40
              }
            ]
          }
        }
      }
    )
  }

  /**
   * 전주 주간 위험도 조회
   */
  public getPreWeekRiskDegree() {
    this._riskDegreeDetailSvc.getPreWeekRiskDegree(this.ldongCd).pipe(
      catchError(
        error => {
          console.log(error.statusText);
          return throwError(error);
        }
      )
    ).subscribe(
      result => {
        console.log(result);
        if(result.code === CommonConstant.RESULT_CODE.SUCCESS) {
          this.weekRiskInfoList = result.data as WeekRisk[];
          // 임시 데이터
          if(this.weekRiskInfoList.length === 0){
            this.weekRiskInfoList = [
              {
                dt: '2021-03-19T09:00:00',
                contactDensityPercentile: 5
              },
              {
                dt: '2021-03-20T09:00:00',
                contactDensityPercentile: 5
              },
              {
                dt: '2021-03-21T09:00:00',
                contactDensityPercentile: 5
              },
              {
                dt: '2021-03-22T09:00:00',
                contactDensityPercentile: 5
              },
              {
                dt: '2021-03-23T09:00:00',
                contactDensityPercentile: 5
              },
              {
                dt: '2021-03-24T09:00:00',
                contactDensityPercentile: 5
              },
              {
                dt: '2021-03-25T09:00:00',
                contactDensityPercentile: 5
              }
            ]
          }
        }
      }
    )
  }
  /**
   * 날짜 정보를 날짜 Label로 변환
   */
  public dateToLabel(dateStr: string) {
    const date = this._yyyyMMddToDate(dateStr);
    return (date.getMonth() + 1)+ '월 ' + date.getDate() + '일 (' + this.dayLabel[date.getDay() !== 0 ? date.getDay() - 1 : 6] + ')'
  }
  /**
   * 오늘인지 체크
   */
  public checkToday(day: WeekRisk) {
    const date = this._yyyyMMddToDate(day.dt);
    return this.currentTime.getFullYear() === date.getFullYear() && this.currentTime.getMonth() === date.getMonth() && this.currentTime.getDate() === date.getDate()
  }
  /**
   * 요일 반환
   */
  public getDay(day: WeekRisk, idx: number) {
    const date = this._yyyyMMddToDate(day.dt);

    if (String(date) === 'Invalid Date') {
      return this.dayLabel[idx];
    }

    if (this.checkToday(day)) {
      return '오늘';
    } else {
      return this.dayLabel[date.getDay() === 0 ? this.dayLabel.length - 1 : date.getDay() - 1];
    }
  }

  public check7Day(type: string) {
    const currentDt = new Date(_.cloneDeep(this.currentTime).setHours(0,0,0,0));
    const selectedDt = new Date(this.selectedDate.setHours(0,0,0,0));
    if(type === 'before') {
      return (currentDt.getTime() - selectedDt.getTime())/(1000*3600*24) < 7;
    } else {
      return (selectedDt.getTime() - currentDt.getTime())/(1000*3600*24) < 6;
    }
  }

  private _yyyyMMddToDate(day: string) {

    if (day.length === 8) {
      const dateString  = day;
      const yearT       = dateString.substring(0,4);
      const monthT       = dateString.substring(4,6);
      const dayT      = dateString.substring(6,8);
      return new Date(Number(yearT), Number(monthT) - 1, Number(dayT));
    } else {
      return new Date(day);
    }

  }
}

export enum BarChartMode {
  DAY = 'DAY',
  WEEK = 'WEEK'
}

export class RiskDegree {
  congestion: number;
  congestionPercentile: number;
  contactCovidClass: string;
  contactDensity: number;
  contactDensityPercentile: number;
  contactIndex: number;
  contactIndexPercentile: number;
  dt: string;
  flowCnt: number;
  flowDensity: number;
  flowDensityPercentile: number;
  flowPercentile: number;
  hh: string;
  ldongCd: string;
  predDt: string;
  subwayCnt: number;
  subwayDensity: number;
  subwayPercentile: number;
  subwayDensityPercentile: number;
  taxiCnt: number;
  taxiDensity: number;
  taxiDensityPercentile: number;
  taxiPercentile: number;
  dong: string;
  siDo: string;
  siGunGu: string;
}

export class DayRiskDegree {
  contactIndex: number;
  // contactIndexPercentile: number;
  contactDensityPercentile
  hh: string
  ldongCd: string;
}

export class WeekRisk {
  dt: string;
  // contactIndexPercentile: number;
  contactDensityPercentile: number;
}
