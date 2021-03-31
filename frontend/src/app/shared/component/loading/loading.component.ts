import {Component, ElementRef, Injector, NgZone, OnDestroy, OnInit} from '@angular/core';
import {AbstractComponent} from '../abstract.component';
import {LoadingService} from './loading.service';
import {switchMap} from 'rxjs/operators';
import {of} from 'rxjs';

@Component({
  selector: 'div[loading]',
  templateUrl: './loading.component.html'
})
export class LoadingComponent extends AbstractComponent implements OnInit, OnDestroy {

  constructor(protected readonly elementRef: ElementRef,
              protected readonly injector: Injector,
              private readonly loading: LoadingService,
              private readonly zone: NgZone) {
    super(elementRef, injector);
    this.loading.hide();
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.subscriptions.push(
      this.loading
        .getBehaviorSubject()
        .pipe(switchMap(value => of(value)))
        .subscribe(value => this.zone.runOutsideAngular(_ => this.jQuery('#loadingDiv').attr('aria-hidden', !value)))
    );
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
