import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '@shared/shared.module';
import {MapComponent} from '@components/map/map.component';
import {MapService} from '@components/map/map.service';
import {HomeService} from '@components/home/home.service';

const mapRoutes: Routes = [
  {
    path: '',
    component: MapComponent,
    pathMatch: 'full'
  },
];


@NgModule({
  declarations: [
    MapComponent
  ],
  imports: [
    RouterModule.forChild(mapRoutes),
    SharedModule,
  ],
  providers: [
    MapService,
    HomeService
  ]
})
export class MapModule {
}
