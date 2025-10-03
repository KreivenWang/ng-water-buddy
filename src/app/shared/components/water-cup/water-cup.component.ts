import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/**
 * 水杯动画组件
 * 个人进度页面的主视觉元素
 */
@Component({
  selector: 'app-water-cup',
  templateUrl: './water-cup.component.html',
  styleUrls: ['./water-cup.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WaterCupComponent {
  @Input() currentAmount!: number;   // 当前喝水量（ml）
  @Input() dailyGoal!: number;       // 每日目标（ml）

  /**
   * 计算水位百分比
   */
  get percentage(): number {
    return Math.min((this.currentAmount / this.dailyGoal) * 100, 100);
  }
}

