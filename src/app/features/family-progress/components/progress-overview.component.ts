import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { DailySummary } from '../../../models/daily-summary.interface';

/**
 * 进度总览组件（展示组件）
 * 
 * 职责：
 * - 显示家庭整体喝水进度
 * - 统计总饮水量和总目标
 * - 显示完成人数
 * 
 * [注意] 纯展示组件，无副作用
 */
@Component({
  selector: 'app-progress-overview',
  templateUrl: './progress-overview.component.html',
  styleUrls: ['./progress-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressOverviewComponent {
  @Input() summary!: DailySummary;

  /**
   * 获取家庭总饮水量
   */
  get totalAmount(): number {
    if (!this.summary || !this.summary.memberRecords) {
      return 0;
    }
    
    return Object.values(this.summary.memberRecords)
      .reduce((sum, record) => sum + record.totalAmount, 0);
  }

  /**
   * 获取家庭总目标
   */
  get totalGoal(): number {
    if (!this.summary || !this.summary.memberRecords) {
      return 0;
    }
    
    return Object.values(this.summary.memberRecords)
      .reduce((sum, record) => sum + record.dailyGoal, 0);
  }

  /**
   * 获取整体完成百分比
   */
  get overallPercentage(): number {
    if (this.totalGoal === 0) {
      return 0;
    }
    
    return Math.min(Math.round((this.totalAmount / this.totalGoal) * 100), 100);
  }

  /**
   * 获取完成人数
   */
  get completedCount(): number {
    if (!this.summary || !this.summary.memberRecords) {
      return 0;
    }
    
    return Object.values(this.summary.memberRecords)
      .filter(record => record.percentage >= 100).length;
  }

  /**
   * 获取总人数
   */
  get totalMembers(): number {
    if (!this.summary || !this.summary.memberRecords) {
      return 0;
    }
    
    return Object.keys(this.summary.memberRecords).length;
  }

  /**
   * 获取今日日期显示文本
   */
  get dateText(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekDay = weekDays[today.getDay()];
    
    return `${year}年${month}月${day}日 ${weekDay}`;
  }
}
