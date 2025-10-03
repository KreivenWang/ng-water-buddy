import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { WaterWaveComponent } from './components/water-wave/water-wave.component';
import { ProgressRingComponent } from './components/progress-ring/progress-ring.component';
import { WaterCupComponent } from './components/water-cup/water-cup.component';
import { QuickAddButtonsComponent } from './components/quick-add-buttons/quick-add-buttons.component';
import { FamilyMemberCardComponent } from './components/family-member-card/family-member-card.component';
import { ReminderActionDialogComponent } from './components/reminder-action-dialog/reminder-action-dialog.component';

// Pipes
import { MlToLiterPipe } from './pipes/ml-to-liter.pipe';
import { ProgressPercentPipe } from './pipes/progress-percent.pipe';

/**
 * Shared 模块
 * 提供可复用的展示组件、管道、指令
 * 可被多个 Feature 模块导入
 */
@NgModule({
  declarations: [
    // Components
    WaterWaveComponent,
    ProgressRingComponent,
    WaterCupComponent,
    QuickAddButtonsComponent,
    FamilyMemberCardComponent,
    ReminderActionDialogComponent,
    
    // Pipes
    MlToLiterPipe,
    ProgressPercentPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    // [关键点] 导出所有组件和管道，供其他模块使用
    WaterWaveComponent,
    ProgressRingComponent,
    WaterCupComponent,
    QuickAddButtonsComponent,
    FamilyMemberCardComponent,
    ReminderActionDialogComponent,
    MlToLiterPipe,
    ProgressPercentPipe
  ]
})
export class SharedModule { }

