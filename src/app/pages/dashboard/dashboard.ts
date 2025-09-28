import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ProgressComponent } from '@components/progress/progress';
import { ReminderComponent } from '@components/reminder/reminder';
import { WaterRecordsComponent } from '@components/water-records/water-records';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ProgressComponent, ReminderComponent, WaterRecordsComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
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

    console.log('组件刷新完成');
  }
}
