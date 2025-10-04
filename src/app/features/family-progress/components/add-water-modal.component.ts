import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { FamilyMember } from '../../../models/family-member.interface';

/**
 * 添加喝水记录模态框组件
 * 提供快捷添加和自定义输入功能
 */
@Component({
  selector: 'app-add-water-modal',
  templateUrl: './add-water-modal.component.html',
  styleUrls: ['./add-water-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddWaterModalComponent {
  @Input() isOpen = false;
  @Input() member: FamilyMember | null = null;
  @Input() currentAmount: number = 0;
  
  @Output() waterAdded = new EventEmitter<{ memberId: string; amount: number }>();
  @Output() closed = new EventEmitter<void>();

  // 预设水量选项
  presetAmounts = [100, 200, 300, 500];
  
  // 自定义输入
  customAmount: number | null = null;
  showCustomInput = false;

  /**
   * 监听 ESC 键关闭模态框
   */
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.isOpen) {
      this.close();
    }
  }

  /**
   * 处理预设水量添加
   */
  onPresetAmountAdded(amount: number): void {
    if (this.member) {
      this.waterAdded.emit({ 
        memberId: this.member.id, 
        amount 
      });
      this.close();
    }
  }

  /**
   * 显示自定义输入
   */
  showCustomAmountInput(): void {
    this.showCustomInput = true;
  }

  /**
   * 添加自定义水量
   */
  onCustomAmountAdded(): void {
    if (this.customAmount && this.customAmount > 0 && this.member) {
      this.waterAdded.emit({ 
        memberId: this.member.id, 
        amount: this.customAmount 
      });
      this.close();
    }
  }

  /**
   * 取消自定义输入
   */
  cancelCustomInput(): void {
    this.showCustomInput = false;
    this.customAmount = null;
  }

  /**
   * 关闭模态框
   */
  close(): void {
    this.showCustomInput = false;
    this.customAmount = null;
    this.closed.emit();
  }

  /**
   * 处理背景点击关闭
   */
  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  /**
   * 获取成员进度百分比
   */
  get progressPercentage(): number {
    if (!this.member || this.member.dailyGoal === 0) return 0;
    return Math.min((this.currentAmount / this.member.dailyGoal) * 100, 100);
  }

  /**
   * 获取剩余目标
   */
  get remainingAmount(): number {
    if (!this.member) return 0;
    return Math.max(this.member.dailyGoal - this.currentAmount, 0);
  }
}

