import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/**
 * 水波动画组件
 * 用于视觉装饰和进度展示
 */
@Component({
  selector: 'app-water-wave',
  templateUrl: './water-wave.component.html',
  styleUrls: ['./water-wave.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WaterWaveComponent {
  @Input() height: number = 50; // 水位高度百分比（0-100）
  
  // TODO: 实现水波动画逻辑
}

