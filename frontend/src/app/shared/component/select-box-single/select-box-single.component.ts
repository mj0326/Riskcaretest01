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
import {SelectValue} from '@shared/value/select.value';
import {Utils} from '@shared/utils/utils';

@Component({
  selector: 'app-select-box-single',
  templateUrl: './select-box-single.component.html',
})
export class SelectBoxSingleComponent extends AbstractComponent implements OnInit, OnDestroy {

  @Input('itemList') set setItemList(value: SelectValue[]) {
    if (value !== undefined && value.length !== 0) {
      // init data list
      this.itemList = value;
      this.itemList.forEach(() => {
        this.radioUUIDList.push(Utils.Generate.UUID());
      });

      // check for pre-selected value
      const index = this.itemList.findIndex((item) => {
        return item.checked;
      });

      if (index === -1) { // make dummy init label if no item selected
        this.initialItem = new SelectValue(this.titlePlaceHolder, '', true);
      } else {  // select initial item if exists pre-selected item
        this.initialItem = this.itemList[index];
      }

      this.selectedItem = this.initialItem;
      this.safelyDetectChanges();
    } else {  // init for empty data list
      this.itemList = [];
      this.initialItem = new SelectValue(this.titlePlaceHolder, '', true);
      this.selectedItem = this.initialItem;
      this.safelyDetectChanges();
    }
  }

  @Input()
  public optionalClass: string = 'component-selectbox';

  @Input()
  public allLabel: string = 'All';

  // SelectBox name
  @Input()
  public name: string = '';

  // is error occurred
  @Input()
  public isError: boolean = false;

  // disable component
  @Input()
  public isDisabled: boolean = false;

  // component expand upside variable
  @Input()
  public typeUp: boolean = false;

  @Input()
  public titlePlaceHolder: string = 'Select Option';

  // selectBox data list
  public itemList: SelectValue[] = [];

  // emit for selected item
  @Output()
  public selectedItemChanged: EventEmitter<SelectValue> = new EventEmitter<SelectValue>();

  // component expand variable
  public isOpen: boolean = false;

  public allChecked: boolean = false;

  public radioUUIDList: string[] = [];
  public radioUUID: string = Utils.Generate.UUID();

  public selectedItem: SelectValue = new SelectValue(this.allLabel, 'all', true);
  public initialItem: SelectValue;

  // close the selectBox after click outside
  @HostListener('document:click', ['$event'])
  clickOut(event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  constructor(protected elementRef: ElementRef,
              protected injector: Injector) {
    super(elementRef, injector);
  }


  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  /**
   * click select all
   */
  onClickAll() {
    event.stopImmediatePropagation();
    event.preventDefault();

    if (this.allChecked !== true) {
      this.allChecked = true;
      this.selectedItem = new SelectValue(this.allLabel, 'all', true);

      this.itemList.forEach((item) => {
        item.checked = false;
      });

      this.selectedItemChanged.emit(this.selectedItem);
    }
    this.isOpen = false;
  }

  /**
   * select item
   */
  onClickRadio(selectedItem: SelectValue) {
    event.stopImmediatePropagation();
    event.preventDefault();
    if (!this.selectedItem || selectedItem.label !== this.selectedItem.label) {
      selectedItem.checked = true;
      this.selectedItem = selectedItem;

      this.allChecked = false;
      this.itemList.forEach((item) => {
        if (item.label !== selectedItem.label) {
          item.checked = false;
        }
      });

      this.selectedItemChanged.emit(this.selectedItem);
    }
    this.isOpen = false;
  }

  /**
   * open or close component expanded
   */
  toggleSelectBox(event: MouseEvent) {
    if (this.isDisabled) {
      event.stopImmediatePropagation();
      return;
    }

    if (this.itemList.length !== 0) {
      this.isOpen = !this.isOpen;
    }
  }

  /**
   * set selected item
   * @param value - selected value
   * @param useOutput - 외부 이벤트 사용 여부
   */
  setSelectedItem(value: SelectValue, useOutput: boolean = true) {
    this.selectedItem = value;
    if (useOutput) {
      this.selectedItemChanged.emit(value);
    }
  }

}
