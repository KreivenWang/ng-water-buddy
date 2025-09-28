import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataApiService } from '../../services/data-api.service';
import { Subscription } from 'rxjs';
import { AllSettings } from '../../models/user-setting';
import { DrinkRecords, ReminderStatus } from '../../models/water-data';

/**
 * 示例组件 - 展示如何使用DataApiService
 * 这个组件演示了如何通过DataApiService访问和操作数据
 */
@Component({
  selector: 'app-data-api-example',
  imports: [CommonModule],
  templateUrl: './data-api-example.html',
  styleUrl: './data-api-example.css'
})
export class DataApiExampleComponent implements OnInit, OnDestroy {
  // 数据状态
  settings: AllSettings | null = null;
  todayRecords: DrinkRecords | null = null;
  reminderStatus: ReminderStatus | null = null;
  
  // 订阅管理
  private subscriptions = new Subscription();

  private dataApiService = inject(DataApiService);

  ngOnInit(): void {
    this.loadAllData();
    this.subscribeToDataChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * 加载所有数据
   */
  private loadAllData(): void {
    // 同步获取当前数据
    this.settings = this.dataApiService.getSettings();
    this.todayRecords = this.dataApiService.getTodayRecords();
    this.reminderStatus = this.dataApiService.getReminderStatus();
    
    console.log('数据已加载:', {
      settings: this.settings,
      todayRecords: this.todayRecords,
      reminderStatus: this.reminderStatus
    });
  }

  /**
   * 订阅数据变化
   */
  private subscribeToDataChanges(): void {
    // 订阅设置变化
    this.subscriptions.add(
      this.dataApiService.getSettings$().subscribe(settings => {
        this.settings = settings;
        console.log('设置已更新:', settings);
      })
    );

    // 订阅今日记录变化
    this.subscriptions.add(
      this.dataApiService.getTodayRecords$().subscribe(records => {
        this.todayRecords = records;
        console.log('今日记录已更新:', records);
      })
    );

    // 订阅提醒状态变化
    this.subscriptions.add(
      this.dataApiService.getReminderStatus$().subscribe(status => {
        this.reminderStatus = status;
        console.log('提醒状态已更新:', status);
      })
    );
  }

  /**
   * 记录饮水
   */
  recordWater(): void {
    this.dataApiService.recordWaterIntake().subscribe({
      next: (success) => {
        if (success) {
          console.log('饮水记录成功');
        } else {
          console.log('饮水记录失败');
        }
      },
      error: (error) => {
        console.error('记录饮水时发生错误:', error);
      }
    });
  }

  /**
   * 重置今日记录
   */
  resetTodayRecords(): void {
    this.dataApiService.resetTodayRecords().subscribe({
      next: (success) => {
        if (success) {
          console.log('今日记录已重置');
        } else {
          console.log('重置失败');
        }
      },
      error: (error) => {
        console.error('重置记录时发生错误:', error);
      }
    });
  }

  /**
   * 导出数据
   */
  exportData(): void {
    this.dataApiService.exportAllData().subscribe({
      next: (data) => {
        console.log('导出的数据:', data);
        // 这里可以将数据保存为文件或发送到服务器
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'water-buddy-data.json';
        link.click();
        URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('导出数据时发生错误:', error);
      }
    });
  }

  /**
   * 清除所有数据
   */
  clearAllData(): void {
    if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
      this.dataApiService.clearAllData().subscribe({
        next: (success) => {
          if (success) {
            console.log('所有数据已清除');
            this.loadAllData(); // 重新加载默认数据
          } else {
            console.log('清除数据失败');
          }
        },
        error: (error) => {
          console.error('清除数据时发生错误:', error);
        }
      });
    }
  }

  /**
   * 获取今日进度
   */
  getTodayProgress(): { current: number; total: number; percentage: number } {
    return this.dataApiService.getTodayProgress();
  }

  /**
   * 检查今日目标是否完成
   */
  isTodayGoalCompleted(): boolean {
    return this.dataApiService.isTodayGoalCompleted();
  }

  /**
   * 获取下一杯水的编号
   */
  getNextCupNumber(): number {
    return this.dataApiService.getNextCupNumber();
  }
}
