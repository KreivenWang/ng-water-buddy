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
   * 圆环半径
   */
  private readonly radius = 50;

  /**
   * 圆环周长
   */
  get circumference(): number {
    return 2 * Math.PI * this.radius;
  }

  /**
   * 计算进度百分比
   */
  get percentage(): number {
    if (!this.total || this.total === 0) return 0;
    return Math.min((this.progress / this.total) * 100, 100);
  }

  /**
   * 计算进度圆环的 stroke-dashoffset
   */
  get strokeDashoffset(): number {
    return this.circumference - (this.circumference * this.percentage / 100);
  }

  /**
   * 根据进度返回颜色
   */
  get strokeColor(): string {
    if (this.percentage < 30) return '#FF4B4B';    // 红色
    if (this.percentage < 70) return '#FFC800';    // 黄色
    return '#58CC02';                               // 绿色
  }

  onRingClick(): void {
    this.ringClick.emit();
  }
}

