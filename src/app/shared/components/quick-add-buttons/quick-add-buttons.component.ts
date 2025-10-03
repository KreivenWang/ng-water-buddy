import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

/**
 * 快捷添加按钮组
 * 提供预设水量快速添加功能
 */
@Component({
  selector: 'app-quick-add-buttons',
  templateUrl: './quick-add-buttons.component.html',
  styleUrls: ['./quick-add-buttons.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickAddButtonsComponent {
  @Output() waterAdded = new EventEmitter<number>();
  
  presetAmounts = [200, 500, 750];

  /**
   * 添加预设水量
   */
  onAddWater(amount: number): void {
    // [关键点] 触觉反馈
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    this.waterAdded.emit(amount);
  }

  /**
   * 打开自定义水量输入
   */
  onCustomAmount(): void {
    // TODO: 打开自定义输入对话框
  }
}

