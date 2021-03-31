import {Component, ElementRef, EventEmitter, HostBinding, Injector, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractComponent} from '../abstract.component';
import {Utils} from '@shared/utils/utils';

@Component({
  selector: '[input-button]',
  templateUrl: './input-button.component.html'
})
export class InputButtonComponent extends AbstractComponent implements OnInit, OnDestroy {

  @HostBinding('class') public classAttribute: string = 'common-ui-form-check type-confirm';

  public DEFAULT_PLACEHOLDER: string = 'Please Select.';

  private _text: any;
  @Input()
  public initialText: any;

  @ViewChild('inputElement', { static: true })
  private input: ElementRef;

  @Output() textChange = new EventEmitter();

  @Input()
  get text() {
    return this._text;
  }

  set text(text: any) {
    this._text = text;
  }

  @Input() public maxlength: number;
  @Input() public placeholder: string = this.DEFAULT_PLACEHOLDER;
  @Input() public disabled: boolean = false;
  @Input() public isError: boolean = false;
  @Input() public errorMessage: string;

  @Input()
  public set focus(value: boolean) {
    if (value) {
      this.input.nativeElement.focus();
    }
  }

  public inputUUID: string = Utils.Generate.UUID();

  private focusClass = 'common-ui-form-check type-confirm is-focus';
  private blurClass = 'common-ui-form-check type-confirm ';

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

  public onClickConfirm($event) {
    $event.preventDefault();
    this.textChange.emit(this._text);
    this.classAttribute = this.blurClass;
    this.input.nativeElement.blur();
  }

  public onClickCancel($event) {
    $event.preventDefault();
    this._text = this.initialText;
    this.classAttribute = this.blurClass;
    this.input.nativeElement.blur();
  }

  public onFocus() {
    this.classAttribute = this.focusClass;
  }

  public onBlur() {
    this.classAttribute = this.blurClass;
  }

  /**
   * 키보드 업 이벤트
   * @param event - 키보드 이벤트
   */
  public onKeyup(event: KeyboardEvent) {
    if ('Enter' !== event.key) {
      return;
    }
    this.onClickConfirm(event);
  } // func - onKeyup
}
