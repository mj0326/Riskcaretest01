import {Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractComponent} from '@shared/component/abstract.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
})
export class SearchComponent extends AbstractComponent implements OnInit, OnDestroy {
  constructor(protected elementRef: ElementRef,
              protected injector: Injector) {
    super(elementRef, injector);
  }

  // 한국어 버퍼 문제 해결을 위한 변수
  timer: any;

  @Input()
  public placeHolder: string = '';

  @Input()
  public immediateResponse: boolean = false;

  // 초기화 버튼
  public showClearButton: boolean = false;

  // 검색어
  @Input()
  public keyword: string = '';

  // 검색어 저장
  public keywordTemp: string = '';

  // 검색
  @Output()
  keywordChanged: EventEmitter<string> = new EventEmitter<string>();

  public ngOnInit(): void {
  }

  /**
   * 엔터 클릭시 검색
   */
  public submit() {
    this.keywordChanged.emit(this.keyword);
  }

  /**
   * 키워드 input change event handler
   *
   * @param value
   */
  onChangeKeyword(value: any) {
    this.keyword = value;
    this.showClearButton = this.keyword !== '';
    if (this.immediateResponse) {
      this.submit();
    }
  }

  /**
   * 키보드 업 이벤트
   * @param event - 키보드 이벤트
   */
  public onKeyup(event: KeyboardEvent) {
    if ('Enter' !== event.key) {
      return;
    }
    this.submit();
  } // func - onKeyup

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public clear() {
    this.keyword = '';
    this.keywordChanged.emit(this.keyword);
    this.showClearButton = false;
  }
}
