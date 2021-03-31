import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UrlPath} from '@shared/routes/url-path';

const routes: Routes = [
  {
    path: UrlPath.APP.ROUTE.ROOT,
    loadChildren: () => import('app/layout/layout/layout.module').then(mod => mod.LayoutModule),
    // canActivate: [LoginCheckGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: UrlPath.MAP.ROUTE.ROOT,
    loadChildren: () => import('app/components/map/map.module').then(mod => mod.MapModule),
    // canActivate: [LoginCheckGuard],
    runGuardsAndResolvers: 'always'
  },
  // {
  //   path: UrlPath.ERROR.ROUTE.ROOT,
  //   loadChildren: () => import('app/layout/error/error.module').then(mod => mod.ErrorModule),
  //   runGuardsAndResolvers: 'always'
  // },
  {
    path: '**',
    redirectTo: 'error/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    onSameUrlNavigation: 'reload',
  })],
  declarations: [],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})
export class AppRoutingModule {
}
