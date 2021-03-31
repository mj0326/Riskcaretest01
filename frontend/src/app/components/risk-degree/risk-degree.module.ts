import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '@shared/shared.module';
import {RiskDegreeDetailComponent} from '@components/risk-degree/risk-degree-detail.component';
import {RiskDegreeDetailService} from '@components/risk-degree/risk-degree-detail.service';

const riskDegreeRoutes: Routes = [
  {
    path: '',
    component: RiskDegreeDetailComponent
  },
];


@NgModule({
  declarations: [
    RiskDegreeDetailComponent
  ],
  imports: [
    RouterModule.forChild(riskDegreeRoutes),
    SharedModule,
  ],
  providers: [
    RiskDegreeDetailService
  ]
})
export class RiskDegreeModule {
}
