import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { DailyRecordService } from '../../services/daily-record.service';
import { SettingsService } from '../../services/settings.service';
import { DrinkRecord } from '../../models/water-data';

@Component({
  selector: 'app-water-records',
  imports: [CommonModule],
  template: `
    <div class="water-records bg-white p-6 rounded-lg shadow-sm">
      <h3 class="text-lg font-bold text-gray-800 mb-4 text-center">今日饮水记录</h3>
      <div class="grid grid-cols-4 gap-4">
        <div *ngFor="let record of records" class="flex justify-center">
          <button 
            class="cup w-16 h-20 border-2 rounded-t-2xl relative flex flex-col items-center justify-end pb-2 hover:bg-blue-50 transition-colors"
            [class.border-blue-400]="record.completed"
            [class.border-gray-300]="!record.completed"
            (click)="toggleRecord(record.id)"
          >
            <span class="text-sm font-medium text-gray-600">{{ record.id }}</span>
            <svg *ngIf="record.completed" class="absolute top-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#3b82f6" stroke="none">
              <path d="M20 6 9 17l-5-5" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="mt-4 text-center text-sm text-gray-500">
        <p>点击杯子记录饮水</p>
      </div>
    </div>
  `,
  styles: [
    `
    .water-records {
      margin: 1rem 0;
    }
    .cup {
      cursor: pointer;
    }
    `
  ]
})
export class WaterRecordsComponent implements OnInit, OnDestroy {
  protected records: DrinkRecord[] = [];

  private dailyRecordService = inject(DailyRecordService);
  private settingsService = inject(SettingsService);

  ngOnInit(): void {
    this.loadRecords();
  }

  ngOnDestroy(): void {
    // 清理资源
  }

  protected toggleRecord(id: number): void {
    const record = this.records.find(r => r.id === id);
    if (record) {
      if (!record.completed) {
        // 如果未完成，则记录饮水
        const success = this.dailyRecordService.record();
        if (success) {
          record.completed = true;
          record.timestamp = new Date().toISOString();
          console.log(`已记录第${id}杯水`);
        }
      } else {
        // 如果已完成，则取消记录（可选功能）
        console.log('已完成的记录不能取消');
      }
    }
  }

  private loadRecords(): void {
    try {
      // 获取今日记录
      const todayRecords = this.dailyRecordService.getTodayRecords();
      this.records = todayRecords.records;

      console.log('饮水记录组件已加载:', {
        records: this.records,
        currentAmount: todayRecords.currentAmount,
        totalAmount: todayRecords.totalAmount
      });
    } catch (error) {
      console.error('加载饮水记录失败:', error);
      // 如果加载失败，使用默认记录
      this.initializeDefaultRecords();
    }
  }

  private initializeDefaultRecords(): void {
    try {
      const settings = this.settingsService.loadAllSettings();
      const dailyCups = settings.dailyCup.dailyCups || 8;
      
      this.records = Array.from({ length: dailyCups }, (_, i) => ({
        id: i + 1,
        completed: false
      }));
    } catch (error) {
      console.error('初始化默认记录失败:', error);
      // 最后的备用方案
      this.records = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        completed: false
      }));
    }
  }

  // 刷新记录数据（供外部调用）
  refreshRecords(): void {
    this.loadRecords();
  }
}
