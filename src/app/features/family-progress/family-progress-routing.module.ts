import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FamilyDashboardComponent } from './containers/family-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: FamilyDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FamilyProgressRoutingModule { }

