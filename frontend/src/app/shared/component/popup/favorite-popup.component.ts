import {
  Component,
  ElementRef,
  Injector
} from '@angular/core';
import {AbstractComponent} from '@shared/component/abstract.component';
import {PopupService} from '@shared/component/popup/popup.service';
import {switchMap} from 'rxjs/operators';
import {of} from 'rxjs';

@Component({
  selector: 'favorite-popup',
  templateUrl: './favorite-popup.component.html',
})
export class FavoritePopupComponent extends AbstractComponent{

  public isShowPopup: boolean = false;

  constructor(
    protected elementRef: ElementRef,
    protected injector: Injector,
    private _popupSvc: PopupService
  ) {
    super(elementRef, injector);
    this._popupSvc
      .getBehaviorSubject()
      .pipe(switchMap(value => of(value)))
      .subscribe(value => {
          this.isShowPopup = value;
        }
      );
    this._popupSvc.hide();
  }
}
