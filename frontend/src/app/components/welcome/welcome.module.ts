import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WelcomeComponent} from '@components/welcome/welcome.component';
import {CheckRiskDegreePopupComponent} from '@components/welcome/popup/check-risk-degree-popup.component';
import {SharedModule} from '@shared/shared.module';
import {WelcomeService} from '@components/welcome/welcome.service';
import {SearchLocationPopupComponent} from '@components/welcome/popup/search-location-popup.component';

const welcomeRoutes: Routes = [
  {
    path: '',
    component: WelcomeComponent
  }
];


@NgModule({
  declarations: [
    WelcomeComponent,
    CheckRiskDegreePopupComponent,
    SearchLocationPopupComponent
  ],
  imports: [
    RouterModule.forChild(welcomeRoutes),
    SharedModule
  ],
  providers: [
    WelcomeService
  ]
})
export class WelcomeModule {
}
