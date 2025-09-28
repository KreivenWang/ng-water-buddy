import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { DailyRecordService } from '../../services/daily-record.service';
import { SettingsService } from '../../services/settings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.html',
  styleUrl: './progress.css'
})
export class ProgressComponent implements OnInit, OnDestroy {
  protected currentAmount = 0;
  protected totalAmount = 8;
  protected completedPercentage = 0;
  protected totalMl = 0;

  private dailyRecordService = inject(DailyRecordService);
  private settingsService = inject(SettingsService);

  ngOnInit(): void {
    this.loadProgress();
  }

  ngOnDestroy(): void {
    // 清理资源
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
