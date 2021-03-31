import {Directive, Output, EventEmitter, Renderer2, ElementRef, OnInit, OnDestroy} from '@angular/core';

@Directive({
  selector: '[custom-keyup]'
})
export class CustomKeyupDirective implements OnInit, OnDestroy {

  @Output('custom-keyup') customEvent = new EventEmitter();

  private _listenerFn: () => void;
  private elapsed: boolean = true;

  constructor(private renderer: Renderer2, private element: ElementRef) {
  }

  ngOnInit() {
    this._listenerFn = this.renderer.listen(this.element.nativeElement, 'keyup', (event: KeyboardEvent) => {
      event.stopPropagation();
      if ('Enter' === event.key) {
        if (this.elapsed) {
          this.elapsed = false;
          setTimeout(() => {
            this.customEvent.emit(event);
            this.elapsed = true;
          }, 150);
        }
      } else {
        this.customEvent.emit(event);
      }
    });
  }

  ngOnDestroy() {
    if (this._listenerFn) {
      this._listenerFn();
    }
  }

}
