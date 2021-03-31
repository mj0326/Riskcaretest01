import {Component, ElementRef, EventEmitter, HostBinding, Injector, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractComponent} from '../abstract.component';
import {Utils} from '@shared/utils/utils';

@Component({
  selector: '[textarea]',
  templateUrl: './textarea.component.html'
})
export class TextareaComponent extends AbstractComponent implements OnInit, OnDestroy {

  private hostDefaultClass = 'component-textarea';
  private hostErrorClass = 'component-textarea is-error';

  @HostBinding('class') public classAttribute: string = this.hostDefaultClass;

  public DEFAULT_PLACEHOLDER: string = 'Placeholder';

  public _text: any;
  public _useTextCount: boolean = false;

  @Output() textChange = new EventEmitter();
  @Output() focusOut = new EventEmitter();

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
  @Input() public disabled: boolean;
  @Input() public _isError: boolean;
  @Input() public errorMessage: string;

  @Input()
  get isError() {
    return this._isError;
  }

  set isError(value: boolean) {
    if (value) {
      this.classAttribute = this.hostErrorClass;
    } else {
      this.classAttribute = this.hostDefaultClass;
    }
    this._isError = value;
  }

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
}
