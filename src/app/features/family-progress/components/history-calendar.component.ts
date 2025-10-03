import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

/**
 * 历史日历组件（展示组件）
 */
@Component({
  selector: 'app-history-calendar',
  templateUrl: './history-calendar.component.html',
  styleUrls: ['./history-calendar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryCalendarComponent {
  @Input() memberId!: string;
  @Output() dateSelected = new EventEmitter<Date>();

  // TODO: 实现日历逻辑
}

