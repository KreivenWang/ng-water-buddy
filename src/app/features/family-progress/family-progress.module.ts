import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FamilyProgressRoutingModule } from './family-progress-routing.module';
import { SharedModule } from '../../shared/shared.module';

// Components
import { ProgressOverviewComponent } from './components/progress-overview.component';
import { MemberListComponent } from './components/member-list.component';
import { AddWaterModalComponent } from './components/add-water-modal.component';
import { HistoryCalendarComponent } from './components/history-calendar.component';

// Containers
import { FamilyDashboardComponent } from './containers/family-dashboard.component';

/**
 * FamilyProgress 功能模块
 * 提供家庭进度管理功能
 */
@NgModule({
  declarations: [
    ProgressOverviewComponent,
    MemberListComponent,
    AddWaterModalComponent,
    HistoryCalendarComponent,
    FamilyDashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FamilyProgressRoutingModule
  ]
})
export class FamilyProgressModule { }

