import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { DailyRecordService } from '../../services/daily-record.service';
import { SettingsService } from '../../services/settings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-progress',
  template: `
    <div class="progress bg-white p-6 rounded-lg shadow-sm">
      <h2 class="text-3xl font-bold text-blue-600 text-center mb-2">{{ currentAmount }}/{{ totalAmount }}</h2>
      <p class="text-gray-500 text-center mb-4">今日进度</p>
      <div class="relative h-2 bg-gray-200 rounded-full mb-2">
        <div 
          class="absolute top-0 left-0 h-full bg-blue-400 rounded-full transition-all duration-300"
          [style.width.%]="progressPercentage"
        ></div>
      </div>
      <div class="flex justify-between text-sm text-gray-500">
        <span>已完成 {{ completedPercentage }}%</span>
        <span>总计 {{ totalMl }}ml</span>
      </div>
    </div>
  `,
  styles: [
    `
      .progress {
        margin: 1rem 0;
      }
    `
  ]
})
export class ProgressComponent implements OnInit {
  protected currentAmount = 0;
  protected totalAmount = 8;
  protected completedPercentage = 0;
  protected totalMl = 0;

  private dailyRecordService = inject(DailyRecordService);
  private settingsService = inject(SettingsService);

  ngOnInit(): void {
    this.loadProgress();
  }

  protected get progressPercentage(): number {
    return (this.currentAmount / this.totalAmount) * 100;
  }

  private loadProgress(): void {
    try {
      // 获取今日进度
      const progress = this.dailyRecordService.getTodayProgress();
      this.currentAmount = progress.current;
      this.totalAmount = progress.total;
      this.completedPercentage = progress.percentage;

      // 获取用户设置来计算总毫升数
      const settings = this.settingsService.loadAllSettings();
      const cupSize = settings.dailyCup.cupSize || 250;
      this.totalMl = this.totalAmount * cupSize;

      console.log('进度组件已加载:', {
        current: this.currentAmount,
        total: this.totalAmount,
        percentage: this.completedPercentage,
        totalMl: this.totalMl
      });
    } catch (error) {
      console.error('加载进度失败:', error);
    }
  }

  // 刷新进度数据（供外部调用）
  refreshProgress(): void {
    this.loadProgress();
  }
}
