import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import {Pageable} from './pagination.value';
import {Utils} from '@shared/utils/utils';

@Component({
  selector: 'div[pagination]',
  templateUrl: './pagination.component.html'
})
export class PaginationComponent implements OnChanges {

  @HostBinding('class') public hostClass: string = 'component-pagination';

  @Output()
  private pageMove = new EventEmitter();

  @Output()
  private setPageSize = new EventEmitter();

  @Input()
  public page: Pageable;

  @Input('customPageSizeList')
  public set setCustomPageSizeList(customPageSizeList: PageSizeType[]) {
    if (!customPageSizeList) {
      return;
    }
    this.pageSizeList = customPageSizeList;
    this.selectedPageSize = this.pageSizeList[0];
    this.safelyDetectChanges();
  }

  // 페이지 목록
  public pages: number[] = [];
  // 전체 페이지 개수
  public totalPage: number;
  // next 페이지 이동 가능여부
  public lastPageFl: boolean;
  // prev 페이지 이동 가능여부
  public prevPageFl: boolean;
  // 현재 페이지
  public currentPage: number = 0;
  // 페이지 묶음 갯수
  public pagePackCnt: number = 5;

  // 페이지 사이즈 관련
  public openPageSize: boolean = false;   // 페이지 사이즈 옵션 펼침 여부
  public pageSizeList: PageSizeType[] = [
    {name: '20', checked: true, value: 20},
    {name: '30', checked: false, value: 30},
    {name: '50', checked: false, value: 50},
    {name: '100', checked: false, value: 100}
  ];
  public selectedPageSize: PageSizeType = this.pageSizeList[0];

  public inputUUID: string = Utils.Generate.UUID();

  constructor(private readonly changeDetect: ChangeDetectorRef) {
  }

  /**
   * 변경 체크
   * @param changes - 변경정보
   */
  public ngOnChanges(changes: SimpleChanges): void {
    const pageChange: SimpleChange = changes.page;
    if (pageChange && pageChange.previousValue !== pageChange.currentValue) {
      this._setComponentInfo();
    }
  } // func - ngOnChanges

  /**
   * 페이지 시작 아이템 순번
   */
  public get startElementIdx(): number {
    return this.selectedPageSize.value * (this.currentPage - 1) + 1;
  } // get - startElementIdx

  /**
   * 페이지 마지막 아이템 순번
   */
  public get endElementIdx(): number {
    const elmIdx = this.selectedPageSize.value * (this.currentPage);
    return elmIdx > this.page.totalElements ? this.page.totalElements : elmIdx;
  } // get - endElementIdx

  ////////////////////////////////////////////////////////////////////////////////////
  // API
  ////////////////////////////////////////////////////////////////////////////////////

  /**
   * 페이지 사이즈 직접 지정
   * @param pageSize - 페이지크기
   */
  public changePageSize(pageSize: PageSizeType) {

    if (!pageSize) {
      return;
    }

    if (!pageSize.value) {
      return;
    }

    if (!Number(pageSize.value)) {
      return;
    }

    if (!Number(pageSize.name)) {
      return;
    }

    if (Number(pageSize.name) !== Number(pageSize.value)) {
      return;
    }

    const pageSizeTypes = this.pageSizeList.filter(v => v.value === Number(pageSize.value));

    if (!pageSizeTypes) {
      return;
    }

    if (pageSizeTypes.length === 0) {
      return;
    }

    if (pageSizeTypes.length !== 1) {
      return;
    }

    const pageSizeType = pageSizeTypes[0];

    if (pageSizeType.checked) {
      return;
    }

    this.onChangePageSize(pageSizeType, false);
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // Function
  ////////////////////////////////////////////////////////////////////////////////////

  // 이전 페이지(true) 다음 페이지(false)
  /**
   * 페이지 이동
   * @param isPrev - 이전 페이지 이동 여부
   */
  public changePagePack(isPrev: boolean) {
    if (isPrev) {
      // 이전 묶음으로 이동
      this.page.number = this.pages[0] - 2;
      if (0 > this.page.number) {
        this.page.number = 0;
      }
    } else {
      // 다음 묶음으로 이동
      this.page.number = this.pages[this.pages.length - 1];
      if (this.page.totalElements < this.page.number) {
        this.page.number = this.page.totalElements;
      }
    }

    // 컴포넌트 정보 설정
    this._setComponentInfo();

    // 현재 페이지 parent로 noti
    this.pageMove.emit(this.currentPage - 1);
  } // func - changePagePack

  /**
   * 페이지 이동
   * @param pageNum - 페이지 번호
   */
  public setPage(pageNum: number) {

    if (this.isCurrentPage(pageNum)) {
      return;
    }

    // 현재 페이지
    this.currentPage = pageNum;

    // 현재 페이지 parent로 noti
    this.pageMove.emit(this.currentPage - 1);
  }

  /**
   * 현재 페이지 여부
   * @param item - 체크할 페이지 번호
   */
  public isCurrentPage(item: number): boolean {
    return this.currentPage === item;
  } // func - isCurrentPage

  /**
   * 페이지 사이즈 변경
   * @param item - 선택된 페이지 사이즈 정보
   * @param isNonSkipOutput - 외부 전달 여부
   */
  public onChangePageSize(item: PageSizeType, isNonSkipOutput: boolean = true) {
    this._setPageSize(item.value);

    if (isNonSkipOutput) {
      this.setPageSize.emit(item.value);
    }

    if (this.openPageSize) {
      this.toggleOpenPageSize();
    }
  } // func - onChangePageSize

  /**
   * 페이지 크기 옵션 표시 여부
   */
  public toggleOpenPageSize() {
    this.openPageSize = !this.openPageSize;
  } // func - toggleOpenPageSize

  /**
   * 컴포넌트 정보 설정
   */
  private _setComponentInfo() {

    // 페이지 정보
    const pageInfo = this.page;

    // 페이지 목록 초기화
    this.pages = [];

    // 총 페이지수가 0 이라면 페이지 목록을 초기화하고 멈춘다
    if (!pageInfo.totalPages || pageInfo.totalPages === 0) {
      this.pages = [];
      return;
    }

    // 페이지 크기 설정
    this._setPageSize(pageInfo.size);

    // 전체 페이지 수
    this.totalPage = Math.ceil(pageInfo.totalElements / pageInfo.size);

    // 페이지 목록 설정
    const pages: number[] = [];

    const pageNum: number = pageInfo.number + 1;
    const startPage = ((Math.ceil(pageNum / this.pagePackCnt) - 1) * this.pagePackCnt) + 1;
    const endPage = (this.totalPage < startPage + this.pagePackCnt) ? this.totalPage : (startPage + this.pagePackCnt) - 1;

    for (let idx = startPage; idx <= endPage; idx++) {
      pages.push(idx);
    }
    this.pages = pages; // 페이지 목록

    // 현재 페이지를 셀렉트 표시하기 위해서 값을 세팅한다
    this.currentPage = pageNum;

    // 해당 페이지범위의 prev 이동 가능여부
    this.prevPageFl = startPage !== 1;

    // 해당 페이지범위의 next 이동 가능여부
    this.lastPageFl = endPage < this.totalPage;

    this.safelyDetectChanges();
  } // func - _setComponentInfo

  /**
   * 페이지 사이즈 설정
   */
  private _setPageSize(targetSize: number) {
    this.pageSizeList.forEach(item => {
      if (Number(item.value) === Number(targetSize)) {
        item.checked = true;
        this.selectedPageSize = item;
      } else {
        item.checked = false;
      }
    });
  }

  /**
   * 화면 갱신
   */
  protected safelyDetectChanges() {
    // tslint:disable-next-line:no-string-literal
    if (!this.changeDetect['destroyed']) {
      this.changeDetect.detectChanges();
    }
  }
}

interface PageSizeType {
  name: string;
  checked: boolean;
  value: number;
}
