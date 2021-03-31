import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class LoadingService {

  private _show: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public show() {
    try {
      this._show.next(true);
    } catch (e) {
      this._show.next(false);
    }
  }

  public hide() {
    try {
      this._show.next(false);
    } catch (e) {
      this._show.next(false);
    }
  }

  public getBehaviorSubject() {
    return this._show;
  }
}
