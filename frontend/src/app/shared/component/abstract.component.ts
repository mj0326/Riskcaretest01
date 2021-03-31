import {ChangeDetectorRef, ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Location} from '@angular/common';
import {Subscription} from 'rxjs';
import {LoadingService} from './loading/loading.service';
import {environment} from '@environments/environment';
import {CookieService} from '@shared/services/cookie.service';

import * as $ from 'jquery';
import {CovidSearchService} from '@shared/services/covid-search.service';
import {UrlPath} from '@shared/routes/url-path';

export abstract class AbstractComponent implements OnInit, OnDestroy {

  protected readonly API_URL: string;

  protected subscriptions: Subscription[] = [];

  protected router: Router;

  protected activatedRoute: ActivatedRoute;

  protected jQuery = $;

  protected location: Location;

  protected loadingService: LoadingService;

  protected changeDetect: ChangeDetectorRef;

  protected cookieService: CookieService;

  protected searchService: CovidSearchService

  protected constructor(protected elementRef: ElementRef,
                        protected injector: Injector) {
    this.API_URL = (environment.production) ? environment.host + '/api' : '/api';

    this.router = injector.get(Router);
    this.location = injector.get(Location);
    this.activatedRoute = injector.get(ActivatedRoute);
    this.loadingService = injector.get(LoadingService);
    this.changeDetect = injector.get(ChangeDetectorRef);
    this.cookieService = injector.get(CookieService);
    this.searchService = injector.get(CovidSearchService);

    // 화면 이동시 앱에 알림
    this.subscriptions.push(this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        // @ts-ignore
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({type: "URL_CHANGED", data: `${location.origin}${e.url}`}, '*'));
      }
    }));
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  protected safelyDetectChanges() {
    if (!this.changeDetect['destroyed']) {
      this.changeDetect.detectChanges();
    }
  }

  public goToHome() {
    this.router.navigateByUrl(UrlPath.HOME.ROUTE.ROOT).then();
  }

  public goToBack() {
    if (window.navigator.userAgent.includes('Mobile-App')) {
      // @ts-ignore
      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({type: "CLOSE_MODAL"}));
    }

    this.location.back();
  }
}
