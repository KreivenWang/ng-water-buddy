import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ProgressComponent } from '@components/progress/progress';
import { ReminderComponent } from '@components/reminder/reminder';
import { WaterRecordsComponent } from '@components/water-records/water-records';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ProgressComponent, ReminderComponent, WaterRecordsComponent],
  template: `
    <div class="dashboard-container max-w-md mx-auto p-4">
      <div class="dashboard-content">
        <app-progress #progressComponent></app-progress>
        <app-reminder (waterRecorded)="onWaterRecorded()"></app-reminder>
        <app-water-records #waterRecordsComponent></app-water-records>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        background-color: #f9fafb;
        min-height: 100vh;
        padding-top: 2rem;
        padding-bottom: 2rem;
      }
      .dashboard-content {
        border-radius: 0 0 1rem 1rem;
        overflow: hidden;
      }
    `,
  ],
})
export class DashboardComponent {
  @ViewChild('progressComponent') progressComponent!: ProgressComponent;
  @ViewChild('waterRecordsComponent') waterRecordsComponent!: WaterRecordsComponent;

  onWaterRecorded(): void {
    console.log('收到饮水记录事件，正在刷新组件...');

    // 刷新进度组件
    if (this.progressComponent) {
      this.progressComponent.refreshProgress();
    }

    // 刷新饮水记录组件
    if (this.waterRecordsComponent) {
      this.waterRecordsComponent.refreshRecords();
    }

    console.log('组件数据已刷新');
  }
}
