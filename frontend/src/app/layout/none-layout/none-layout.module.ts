import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NoneLayoutComponent } from './none-layout.component';

const layoutRoutes: Routes = [
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(layoutRoutes),
  ],
  declarations: [NoneLayoutComponent],
  providers: [
  ]
})
export class NoneLayoutModule {}
