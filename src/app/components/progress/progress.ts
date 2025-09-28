import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';
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

  private dataApiService = inject(DataApiService);
  private subscriptions = new Subscription();

  ngOnInit(): void {
    this.loadProgress();
    this.subscribeToDataChanges();
  }

  ngOnDestroy(): void {
    // 清理订阅
    this.subscriptions.unsubscribe();
  }

  protected get progressPercentage(): number {
    return (this.currentAmount / this.totalAmount) * 100;
  }

  /**
   * 订阅数据变化
   */
  private subscribeToDataChanges(): void {
    // 订阅今日记录变化
    this.subscriptions.add(
      this.dataApiService.getTodayRecords$().subscribe(records => {
        this.updateProgressData(records);
        console.log('进度数据已更新:', {
          current: this.currentAmount,
          total: this.totalAmount,
          percentage: this.completedPercentage,
          totalMl: this.totalMl
        });
      })
    );

    // 订阅设置变化
    this.subscriptions.add(
      this.dataApiService.getSettings$().subscribe(settings => {
        const cupSize = settings.dailyCup.cupSize || 250;
        this.totalMl = this.totalAmount * cupSize;
        console.log('设置已更新，重新计算总毫升数:', this.totalMl);
      })
    );
  }

  /**
   * 更新进度数据
   */
  private updateProgressData(records: any): void {
    this.currentAmount = records.currentAmount;
    this.totalAmount = records.totalAmount;
    this.completedPercentage = records.completedPercentage;
    
    // 获取当前设置来计算总毫升数
    const settings = this.dataApiService.getSettings();
    const cupSize = settings.dailyCup.cupSize || 250;
    this.totalMl = this.totalAmount * cupSize;
  }

  private loadProgress(): void {
    try {
      // 获取今日进度
      const progress = this.dataApiService.getTodayProgress();
      this.currentAmount = progress.current;
      this.totalAmount = progress.total;
      this.completedPercentage = progress.percentage;

      // 获取用户设置来计算总毫升数
      const settings = this.dataApiService.getSettings();
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
