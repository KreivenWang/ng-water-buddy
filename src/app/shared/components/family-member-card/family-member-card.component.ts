import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FamilyMember } from '../../../models/family-member.interface';

/**
 * 家庭成员卡片组件
 * 展示成员信息和操作按钮
 */
@Component({
  selector: 'app-family-member-card',
  templateUrl: './family-member-card.component.html',
  styleUrls: ['./family-member-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FamilyMemberCardComponent {
  @Input() member!: FamilyMember;
  @Input() currentAmount: number = 0;      // 今日已喝水量
  @Input() percentage: number = 0;         // 完成百分比
  @Input() showActions: boolean = true;    // 是否显示操作按钮
  
  @Output() edit = new EventEmitter<FamilyMember>();
  @Output() delete = new EventEmitter<FamilyMember>();
  @Output() cardClick = new EventEmitter<FamilyMember>();

  /**
   * 获取进度状态颜色
   */
  get progressColor(): string {
    if (this.percentage < 30) return '#FF4B4B';    // 红色
    if (this.percentage < 70) return '#FFC800';    // 黄色
    return '#58CC02';                               // 绿色
  }

  /**
   * 获取进度状态文本
   */
  get progressText(): string {
    if (this.percentage >= 100) return '已完成';
    if (this.percentage >= 70) return '进展良好';
    if (this.percentage >= 30) return '继续努力';
    return '需要加油';
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.member);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.member);
  }

  onCardClick(): void {
    this.cardClick.emit(this.member);
  }
}

