import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {AbstractComponent} from '@shared/component/abstract.component';
import {SelectValue} from "@shared/value/select.value";
import {Utils} from "@shared/utils/utils";

@Component({
  selector: 'app-select-box-multi',
  templateUrl: './select-box-multi.component.html',
})
export class SelectBoxMultiComponent extends AbstractComponent implements OnInit, OnDestroy {

  // close the selectBox after click outside
  @HostListener('document:click', ['$event'])
  clickOut(event) {
    if (!this.elementRef.nativeElement.contains(event.target)) this.isOpen = false;
  }

  // SelectBox name
  @Input()
  name: string = "";

  // enable to check all option
  @Input()
  enableCheckAll: boolean = false;

  // is error occurred
  @Input()
  isError: boolean = false;

  // disable component
  @Input()
  isDisabled: boolean = false;

  // component expand upside variable
  @Input()
  typeUp: boolean = false;

  // selectBox data list
  itemList: SelectValue[] = [];

  @Input('itemList') set setItemList(value: SelectValue[]) {
    if (value !== undefined && value.length !== 0) {
      // init data list
      this.selectedItemList = [];
      this.itemList = value;
      this.itemList.forEach((item) => {
        this.radioUUIDList.push(Utils.Generate.UUID());

        // check for pre-selected value
        if (item.checked) {
          this.selectedItemList.push(item);
        }
      });

      // items all checked
      this.allChecked = this.selectedItemList.length === value.length;
      this.safelyDetectChanges();
    } else {  // init for empty data list
      this.itemList = [];
      this.safelyDetectChanges();
    }
  }

  // placeholder 일때
  @Input()
  isPlaceholder: boolean = true;

  // limit the max select item
  @Input()
  limitCount: number = 0;

  // emit for selected item
  @Output()
  selectedItemListChanged: EventEmitter<SelectValue[]> = new EventEmitter<SelectValue[]>();

  // component expand variable
  isOpen: boolean = false;

  allChecked: boolean = false;

  selectedItemList: SelectValue[] = [];

  // UUID List
  radioUUIDList: string[] = [];

  // UUID for 전체선택
  radioUUID: string = Utils.Generate.UUID();

  constructor(protected elementRef: ElementRef,
              protected injector: Injector) {
    super(elementRef, injector);
  }

  // public ngOnInit(): void {
  //   console.log(this.itemList);
  //   // if (this.itemList.length !== 0) {
  //   //   this.itemList.forEach(() => {
  //   //     this.radioUUIDList.push(Utils.Generate.UUID());
  //   //   });
  //   //
  //   //   this.allChecked = this.itemList.every((item) => {
  //   //     return item.checked;
  //   //   });
  //   //
  //   //   if (this.allChecked) {
  //   //     this.selectedItemList = this.itemList;
  //   //   }
  //   // }
  // }

  // public ngOnChanges(){
  //   console.log(this.itemList);
  //   // if (this.itemList !== undefined && this.itemList.length !== 0) {
  //   //   this.itemList.forEach(() => {
  //   //     this.radioUUIDList.push(Utils.Generate.UUID());
  //   //   });
  //   //
  //   //   this.allChecked = this.itemList.every((item) => {
  //   //     return item.checked;
  //   //   });
  //   //
  //   //   if (this.allChecked) {
  //   //     this.selectedItemList = this.itemList;
  //   //   }
  //   // }
  // }


  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  /**
   * 전체 선택 버튼 클릭시 이벤트 핸들러
   */
  onClickAllChecked() {
    this.allChecked = !this.allChecked;

    // 전체 item push 하면 기존에 들어있던 아이템이 중복으로 또 들어가기 때문에 비운다.
    this.selectedItemList = [];

    this.itemList.forEach((item) => {
      item.checked = this.allChecked;

      // 전체 선택이면 모든 아이템을 다 넣는다.
      if (this.allChecked) {
        this.selectedItemList.push(item);
      }
    });

    // 데이터 변화를 알린다.
    this.selectedItemListChanged.emit(this.selectedItemList);
  }

  /**
   * 체크 박스를 클릭할 때 이벤트 핸들러
   *
   */
  onClickCheckBox(item: SelectValue) {
    event.preventDefault();
    event.stopImmediatePropagation();
    // 선택된 아이템의 flag를 toggle
    item.checked = !item.checked;

    // 선택된 아이템의 값이 true 이면 selectedItemList에 넣는다.
    item.checked && this.selectedItemList.push(item);

    // 선택된 아이템의 값이 false 이면 selectedItemList에서 뺀다.
    if (!item.checked) {
      this.selectedItemList = this.selectedItemList.filter((selectedItem) => {
        return selectedItem.label !== item.label;
      });
    }

    this.itemList.every((item) => {
      return item.checked === true
    })
      ? this.allChecked = true
      : this.allChecked = false;

    // 아이템 중에 선택된게 있으면 is-placeholder class를 제거한다.
    this.itemList.some((item) => {
      return item.checked === true
    })
      ? this.isPlaceholder = false
      : this.isPlaceholder = true;

    // 제한 개수가 있을 경우
    if (this.limitCount > 0 && this.selectedItemList.length > this.limitCount) {
      // 선택된 아이템의 flag를 toggle
      item.checked = !item.checked;
      this.selectedItemList.pop();
      return;
    }

    // 데이터 변화를 알린다.
    this.selectedItemListChanged.emit(this.selectedItemList);

  }

  /**
   * 사용자에게 선택한 item을 보여줄 수 있게 label만 뽑아 리스트를 만들고 그 리스트를 string으로 변환하는 함수
   *
   */
  getSelectedItemListString() {
    if (this.allChecked) {
      return '전체';
    }
    const selectedItemsLabelOnlyList = this.selectedItemList.reduce((acc, cur) => {
      acc.push(cur.label);
      return acc;
    }, []);

    return selectedItemsLabelOnlyList.join(", ");
  }

  /**
   * select box를 열었다 닫았다 하는 함수
   *
   */
  toggleSelectBox() {
    if (!this.isDisabled && this.itemList.length !== 0) {
      this.isOpen = !this.isOpen;
    }
  }

  /**
   * 선택 아이템 설정
   * @param itemValue - 아이템 값
   */
  public setSelectedItem(value: SelectValue[]) {
    this.selectedItemList = value;
    // 선택된 리스트의 길이가 itemList와 같고 모두 checked가 true이면 allChecked = true
    if (this.selectedItemList.length === this.itemList.length) {
      this.itemList.every((item) => {
        return item.checked === true
      })
        ? this.allChecked = true
        : this.allChecked = false;
    }
    this.safelyDetectChanges();
  }

  /**
   * 선택된 아이템 리스트를 리셋
   */
  reset() {
    this.selectedItemList = [];
    this.selectedItemListChanged.emit(this.selectedItemList)
  }

  /**
   * select box label
   */
  getLabel() {
    let label = '';

    if (this.allChecked) {
      label = this.name;
    }

    return label;
  }
}
