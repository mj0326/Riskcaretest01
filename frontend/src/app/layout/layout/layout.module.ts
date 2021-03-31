import {NgModule} from '@angular/core';
import {LayoutComponent} from './layout.component';
import {RouterModule, Routes} from '@angular/router';
import {UrlPath} from '@shared/routes/url-path';
import {HeaderComponent} from '@layout/layout/header/header.component';
import {HeaderSubComponent} from '@layout/layout/header-sub/header-sub.component';
import {CommonModule} from '@angular/common';
import {LayoutService} from '@layout/layout/layout.service';
import {LnbComponent} from '@layout/layout/lnb/lnb.component';
import {ServiceIntroduceComponent} from '@components/service-introduce/service-introduce.component';
import {BottomComponent} from '@layout/bottom/bottom.component';

const layoutRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: UrlPath.WELCOME.ROUTE.ROOT,
        pathMatch: 'full'
      },
      {
        path: UrlPath.WELCOME.ROUTE.ROOT,
        loadChildren: () => import('@components/welcome/welcome.module').then(mod => mod.WelcomeModule)
      },
      {
        path: UrlPath.HOME.ROUTE.ROOT,
        loadChildren: () => import('@components/home/home.module').then(mod => mod.HomeModule),
        runGuardsAndResolvers: 'always',
      },
      {
        path: UrlPath.RISK.ROUTE.RISK_DEGREE_DETAIL,
        loadChildren: () => import('@components/risk-degree/risk-degree.module').then(mod => mod.RiskDegreeModule),
        runGuardsAndResolvers: 'always',
      },
      {
        path: UrlPath.SERVICE_INTRODUCE.ROUTE.ROOT,
        component: ServiceIntroduceComponent,
        runGuardsAndResolvers: 'always',
      },
      {
        path: UrlPath.NOTICE.ROUTE.ROOT,
        loadChildren: () => import('@components/notice/notice.module').then(mod => mod.NoticeModule),
        runGuardsAndResolvers: 'always',
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(layoutRoutes),
    CommonModule,
  ],
  declarations: [
    LayoutComponent,
    HeaderComponent,
    HeaderSubComponent,
    LnbComponent,
    ServiceIntroduceComponent,
    BottomComponent
  ],
  providers: [
    LayoutService
  ]
})
export class LayoutModule {
}
