import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FamilyMember } from '../../../models/family-member.interface';
import { DailySummary } from '../../../models/daily-summary.interface';

/**
 * 成员列表组件（展示组件）
 * 
 * 职责：
 * - 显示家庭成员列表
 * - 每个成员卡片显示头像、名字、进度、饮水量
 * - 提供快捷添加喝水按钮
 * 
 * [注意] 纯展示组件，无副作用
 */
@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberListComponent {
  @Input() members: FamilyMember[] = [];
  @Input() dailySummary: DailySummary | null = null;
  @Input() isAuthenticated: boolean = false;        // 是否已登录
  @Input() currentMemberId: string | null = null;   // 当前登录用户的成员ID
  
  @Output() waterAdded = new EventEmitter<{ memberId: string; amount: number }>();
  @Output() memberClick = new EventEmitter<FamilyMember>();

  /**
   * trackBy 函数优化性能
   * [性能] 避免不必要的 DOM 重新渲染
   */
  trackByMemberId(index: number, member: FamilyMember): string {
    return member.id;
  }

  /**
   * 获取成员今日数据
   */
  getMemberData(memberId: string) {
    if (!this.dailySummary || !this.dailySummary.memberRecords) {
      return {
        totalAmount: 0,
        percentage: 0,
        recordCount: 0
      };
    }
    
    return this.dailySummary.memberRecords[memberId] || {
      totalAmount: 0,
      percentage: 0,
      recordCount: 0
    };
  }

  /**
   * 处理成员点击
   */
  onMemberClick(member: FamilyMember): void {
    this.memberClick.emit(member);
  }

  /**
   * 处理快捷添加喝水
   */
  onQuickAdd(member: FamilyMember, amount: number): void {
    // [关键点] 权限检查：只有登录用户才能添加记录
    if (!this.isAuthenticated || !this.currentMemberId) {
      console.warn('未登录用户无法添加喝水记录');
      return;
    }

    // [关键点] 权限检查：只能为自己添加记录
    if (this.currentMemberId !== member.id) {
      console.warn('只能为自己添加喝水记录');
      return;
    }

    // [关键点] 触觉反馈
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    this.waterAdded.emit({
      memberId: member.id,
      amount
    });
  }

  /**
   * 检查是否可以修改指定成员
   */
  canModifyMember(member: FamilyMember): boolean {
    return this.isAuthenticated && this.currentMemberId === member.id;
  }

  /**
   * 获取进度百分比文本
   */
  getPercentageText(percentage: number): string {
    return `${percentage}%`;
  }

  /**
   * 获取水量显示文本
   */
  getWaterText(totalAmount: number, dailyGoal: number): string {
    return `${totalAmount}/${dailyGoal}ml`;
  }
}
