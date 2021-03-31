import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {HomeComponent} from './home.component';
import {RouterModule, Routes} from '@angular/router';
import {AddInterestPlaceComponent} from '@components/home/interest-place/add-interest-place.component';
import {EditInterestPlaceComponent} from '@components/home/interest-place/edit-interest-place.component';
import {UrlPath} from '@shared/routes/url-path';
import {SharedModule} from '@shared/shared.module';
import {HomeService} from '@components/home/home.service';
import {DragDropModule} from '@angular/cdk/drag-drop';

const homeRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: UrlPath.HOME.ROUTE.INTEREST_ADD,
    component: AddInterestPlaceComponent
  },
  {
    path: UrlPath.HOME.ROUTE.INTEREST_EDIT,
    component: EditInterestPlaceComponent
  },
];


@NgModule({
  declarations: [
    HomeComponent,
    AddInterestPlaceComponent,
    EditInterestPlaceComponent,
  ],
  imports: [
    RouterModule.forChild(homeRoutes),
    SharedModule,
    DragDropModule
  ],
  providers: [
    HomeService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeModule {
}
