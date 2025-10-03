import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { DailySummary } from '../../../models/daily-summary.interface';

/**
 * 进度总览组件（展示组件）
 */
@Component({
  selector: 'app-progress-overview',
  templateUrl: './progress-overview.component.html',
  styleUrls: ['./progress-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressOverviewComponent {
  @Input() summary!: DailySummary;

  // TODO: 实现进度总览逻辑
}

