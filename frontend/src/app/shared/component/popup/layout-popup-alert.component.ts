// import {Component, EventEmitter, NgZone, OnInit, Output} from '@angular/core';
// import {PopupService, popupType} from '@shared/component/popup/popup.service';
// import {switchMap} from 'rxjs/operators';
// import {of} from 'rxjs';
//
// @Component({
//   selector: 'layout-popup-alert',
//   templateUrl: './layout-popup-alert.component.html'
// })
// export class LayoutPopupAlertComponent implements OnInit {
//
//   public layoutPopupTitle: string = '';
//   public layoutPopupMessage: string = '';
//   public layoutPopupMessageSub: string = '';
//   public layoutPopupType: popupType = popupType.action;
//   public layoutPopupRightButton: string = '';
//   public popupType = popupType;
//
//   @Output() public layoutPopupConfirm = new EventEmitter();
//   public isShowPopup: boolean = false;
//
//   constructor(private _popupSvc: PopupService,
//               private zone: NgZone) {
//     this._popupSvc.getBehaviorSubject()
//       .pipe(switchMap(value => of(value)))
//       .subscribe(value => this.zone.runOutsideAngular(_ => {
//         if (value) {
//           this.layoutPopupTitle = this._popupSvc.title;
//           const popupMsg = this._popupSvc.message;
//           // tslint:disable-next-line:no-string-literal
//           if (popupMsg['main'] && popupMsg['sub']) {
//             this.layoutPopupMessage = (popupMsg as { main: string, sub: string }).main;
//             this.layoutPopupMessageSub = (popupMsg as { main: string, sub: string }).sub;
//           } else {
//             this.layoutPopupMessage = this._popupSvc.message as string;
//             this.layoutPopupMessageSub = '';
//           }
//           this.layoutPopupRightButton = this._popupSvc.rightButton;
//           this.layoutPopupType = this._popupSvc.popupType;
//         }
//         this.isShowPopup = value;
//       }));
//     this._popupSvc.hide();
//   }
//
//   ngOnInit(): void {
//   }
//
//   public onClickCancel() {
//     this._popupSvc.confirm(false);
//   }
//
//   public onClickConfirm() {
//     this._popupSvc.confirm(true);
//   }
//
// }
