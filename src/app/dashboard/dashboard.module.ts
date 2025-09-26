import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { HeaderComponent } from './header/header';
import { ProgressComponent } from './progress/progress';
import { ReminderComponent } from './reminder/reminder';
import { WaterRecordsComponent } from './water-records/water-records';

const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    ProgressComponent,
    ReminderComponent,
    WaterRecordsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(dashboardRoutes)
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }
