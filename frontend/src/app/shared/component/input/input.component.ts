import {Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractComponent} from '../abstract.component';
import * as _ from 'lodash';
import {Utils} from '@shared/utils/utils';

@Component({
  selector: '[custom-input]',
  templateUrl: './input.component.html'
})
export class InputComponent extends AbstractComponent implements OnInit, OnDestroy {

  public DEFAULT_PLACEHOLDER: string = 'Please Select.';

  public _text: any;

  @ViewChild('inputElement', { static: true })
  private input: ElementRef;

  @Output() textChange = new EventEmitter();
  @Output() focusIn = new EventEmitter();
  @Output() focusOut = new EventEmitter();
  @Output() keyupEvent = new EventEmitter();

  @Input()
  get text() {
    return this._text;
  }

  set text(text: any) {
    this._text = text;
    this.textChange.emit(this._text);
  }

  @Input() public maxlength: number;
  @Input() public placeholder: string = this.DEFAULT_PLACEHOLDER;
  @Input() public disabled: boolean = false;
  @Input() public isError: boolean = false;
  @Input() public errorMessage: string;
  @Input() public useTextCount: boolean = false;
  @Input() public label: string = '';
  @Input() public optionalClass: string = '';
  @Input() public useSuccessIcon: boolean = false;
  @Input() public useClearBtn: boolean = false;
  @Input() public inputType: string = 'text';
  @Input() public tabIndex: number = -1;

  public isFocusIn: boolean = false;

  @Input()
  public set focus(value: boolean) {
    if (value) {
      this.input.nativeElement.focus();
    }
  }

  public inputUUID: string = Utils.Generate.UUID();

  constructor(protected elementRef: ElementRef,
              protected injector: Injector) {
    super(elementRef, injector);
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  /**
   * focusin
   * @param event
   */
  public onFocus(event: FocusEvent): void {
    if (this.useClearBtn) {
      this.isFocusIn = true;
    }
    this.safelyDetectChanges();
    this.focusIn.emit(event);
  }

  /**
   * focusout
   * @param event
   */
  public onFocusOut(event) {
    if ( event.relatedTarget != null && event.relatedTarget.className === 'btn-clear') {
      this.text = '';
      this.input.nativeElement.focus();
      return;
    }
    this.isFocusIn = false;
    this.focusOut.emit(event);
  }

  /**
   * 키보드 업 이벤트
   * @param event - 키보드 이벤트
   */
  public onKeyup(event: KeyboardEvent) {
    if ('Enter' !== event.key) {
      return;
    }
    this.keyupEvent.emit(event);
  } // func - onKeyup

  get hasLabel() {
    return this.label && this.label.length > 0;
  }
}
