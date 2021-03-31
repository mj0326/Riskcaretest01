import {
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {AbstractComponent} from '@shared/component/abstract.component';
import {Utils} from '@shared/utils/utils';

@Component({
  selector: '[custom-textarea-button]',
  templateUrl: './textarea-button.component.html'
})
export class TextareaButtonComponent extends AbstractComponent implements OnInit, OnDestroy {

  public DEFAULT_PLACEHOLDER: string = 'Please Select.';

  public _text: any;
  public _useTextCount: boolean = false;

  @ViewChild('inputElement', {static: true})
  private input: ElementRef;

  @Output() textChange = new EventEmitter();
  @Output() focusIn = new EventEmitter();
  @Output() focusOut = new EventEmitter();
  @Output() confirmEvent = new EventEmitter();
  @Output() cancelEvent = new EventEmitter();

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

  @Input()
  get useTextCount() {
    return this._useTextCount;
  }

  set useTextCount(value: boolean) {
    if (!value) {
      this.jQuery('.box-textarea').contents().unwrap();
    }
    this._useTextCount = value;
  }

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
    this.isFocusIn = true;
    this.safelyDetectChanges();
    this.focusIn.emit(event);
  }

  /**
   * focusout
   * @param event
   */
  public onFocusOut(event) {
    if (event.relatedTarget != null && event.relatedTarget.className === 'btn-clear') {
      this.onClickClear();
      return;
    } else if (event.relatedTarget != null && event.relatedTarget.className === 'btn-form type-cancel') {
      return;
    } else if (event.relatedTarget != null && event.relatedTarget.className === 'btn-form type-confirm') {
      return;
    }
    this.isFocusIn = false;
    this.safelyDetectChanges();
    this.focusOut.emit(event);
  }

  public onClickConfirm() {
    this.isFocusIn = false;
    this.confirmEvent.emit();
  }

  public onClickCancel() {
    this.isFocusIn = false;
    this.cancelEvent.emit();
  }

  public onClickClear() {
    this._text = '';
    this.textChange.emit(this._text);
  }

}
