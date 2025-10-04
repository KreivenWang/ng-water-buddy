import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { User } from '../../../models/user.interface';
import { DailySummary } from '../../../models/daily-summary.interface';

/**
 * 个人喝水记录组件
 * 显示当前登录用户的个人喝水进度和记录功能
 */
@Component({
  selector: 'app-personal-water-log',
  templateUrl: './personal-water-log.component.html',
  styleUrls: ['./personal-water-log.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalWaterLogComponent {
  @Input() user!: User;
  @Input() dailySummary: DailySummary | null = null;
  
  @Output() waterAdded = new EventEmitter<{ memberId: string; amount: number }>();

  // 预设水量选项
  presetAmounts = [100, 200, 300, 500];

  /**
   * 获取用户今日数据
   */
  get userTodayData() {
    if (!this.dailySummary || !this.user.memberId) {
      return {
        totalAmount: 0,
        percentage: 0,
        recordCount: 0
      };
    }
    
    return this.dailySummary.memberRecords[this.user.memberId] || {
      totalAmount: 0,
      percentage: 0,
      recordCount: 0
    };
  }

  /**
   * 获取进度百分比
   */
  get progressPercentage(): number {
    if (!this.user.dailyGoal || this.user.dailyGoal === 0) return 0;
    return Math.min((this.userTodayData.totalAmount / this.user.dailyGoal) * 100, 100);
  }

  /**
   * 获取剩余目标
   */
  get remainingAmount(): number {
    return Math.max(this.user.dailyGoal - this.userTodayData.totalAmount, 0);
  }

  /**
   * 获取进度状态颜色
   */
  get progressColor(): string {
    if (this.progressPercentage < 30) return '#FF4B4B';    // 红色
    if (this.progressPercentage < 70) return '#FFC800';    // 黄色
    return '#58CC02';                                       // 绿色
  }

  /**
   * 获取进度状态文本
   */
  get progressText(): string {
    if (this.progressPercentage >= 100) return '🎉 今日目标已完成！';
    if (this.progressPercentage >= 70) return '进展良好，继续加油！';
    if (this.progressPercentage >= 30) return '继续努力，保持节奏！';
    return '需要加油，开始喝水吧！';
  }

  /**
   * 处理快捷添加喝水
   */
  onQuickAdd(amount: number): void {
    if (this.user.memberId) {
      // [关键点] 触觉反馈
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      this.waterAdded.emit({
        memberId: this.user.memberId,
        amount
      });
    }
  }
}
