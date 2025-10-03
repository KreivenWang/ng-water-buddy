import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

/**
 * 环形进度条组件
 * 显示家庭成员的喝水进度
 */
@Component({
  selector: 'app-progress-ring',
  templateUrl: './progress-ring.component.html',
  styleUrls: ['./progress-ring.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressRingComponent {
  @Input() progress!: number;        // 当前进度（ml）
  @Input() total!: number;           // 目标总量（ml）
  @Input() memberName!: string;      // 成员名称
  @Input() avatar!: string;          // 成员头像（emoji）
  @Input() avatarBgColor!: string;   // 头像背景色
  
  @Output() ringClick = new EventEmitter<void>();

  /**
   * 计算进度百分比
   */
  get percentage(): number {
    return Math.min((this.progress / this.total) * 100, 100);
  }

  /**
   * 根据进度返回颜色
   */
  get strokeColor(): string {
    if (this.percentage < 30) return 'var(--color-progress-low)';
    if (this.percentage < 70) return 'var(--color-progress-medium)';
    return 'var(--color-progress-high)';
  }

  onRingClick(): void {
    this.ringClick.emit();
  }
}

