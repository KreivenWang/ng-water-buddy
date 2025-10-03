import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ReminderConfig } from '../../../models/reminder-config.interface';

/**
 * 提醒设置表单组件（展示组件）
 */
@Component({
  selector: 'app-reminder-settings',
  templateUrl: './reminder-settings.component.html',
  styleUrls: ['./reminder-settings.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReminderSettingsComponent {
  @Input() config!: ReminderConfig;
  @Output() configChanged = new EventEmitter<ReminderConfig>();

  // TODO: 实现表单逻辑
}

