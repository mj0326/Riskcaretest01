// import {Injectable} from '@angular/core';
// import {BehaviorSubject} from 'rxjs';
//
// export enum popupType {
//   action = 'action',
//   caution = 'caution',
//   info = 'info',
// }
//
// @Injectable()
// export class PopupService {
//
//   private _show = new BehaviorSubject<boolean>(false);
//   private _title: string = '';
//   private _message: string | { main: string, sub: string } = '';
//   private _popupType: popupType = popupType.action;
//   private _isSuccess: boolean = false;
//   private _rightButton: string = '확인';
//   private _conFirmCallback: () => void;
//   private _cancelCallback: () => void;
//
//   constructor() {
//   }
//
//   public show(type: popupType, title: string, content: string | { main: string, sub: string }, rightButton: string, confirmCallback: () => void, cancelCallback?: () => void) {
//     try {
//       this._title = title;
//       this._message = content;
//       this._conFirmCallback = confirmCallback;
//       this._cancelCallback = cancelCallback;
//       this._popupType = type;
//       this._rightButton = rightButton;
//       this._show.next(true);
//     } catch (e) {
//       this._show.next(false);
//     }
//   }
//
//   public hide() {
//     try {
//       this._show.next(false);
//     } catch (e) {
//       this._show.next(false);
//     }
//   }
//
//   public confirm(success: boolean) {
//     this._isSuccess = success;
//     if (this._isSuccess && this._conFirmCallback) {
//       this._conFirmCallback();
//     } else if (!this._isSuccess && this._cancelCallback) {
//       this._cancelCallback();
//     }
//     this.hide();
//   }
//
//   public getBehaviorSubject() {
//     return this._show;
//   }
//
//   public get title() {
//     return this._title;
//   }
//
//   public get message() {
//     return this._message;
//   }
//
//   public get rightButton() {
//     return this._rightButton;
//   }
//
//   public get popupType() {
//     return this._popupType;
//   }
//
// }
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class PopupService {

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
