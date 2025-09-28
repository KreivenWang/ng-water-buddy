import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ProgressComponent } from '@components/progress/progress';
import { ReminderComponent } from '@components/reminder/reminder';
import { CupListComponent } from '@components/cup-list/cup-list';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ProgressComponent, ReminderComponent, CupListComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  @ViewChild('progressComponent') progressComponent!: ProgressComponent;
  @ViewChild('cupListComponent') cupListComponent!: CupListComponent;

  onWaterRecorded(): void {
    console.log('收到饮水记录事件，正在刷新组件...');

    // 刷新进度组件
    if (this.progressComponent) {
      this.progressComponent.refreshProgress();
    }

    // 刷新杯数列表组件
    if (this.cupListComponent) {
      this.cupListComponent.refreshRecords();
    }

    console.log('组件刷新完成');
  }
}
