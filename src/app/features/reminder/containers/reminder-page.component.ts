import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { ReminderConfig } from '../../../models/reminder-config.interface';
import { ReminderService } from '../services/reminder.service';

/**
 * 提醒页面容器组件
 * 管理提醒配置的业务逻辑
 */
@Component({
  selector: 'app-reminder-page',
  templateUrl: './reminder-page.component.html',
  styleUrls: ['./reminder-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReminderPageComponent implements OnInit {
  reminderConfig$!: Observable<ReminderConfig>;

  constructor(private reminderService: ReminderService) {}

  ngOnInit(): void {
    // TODO: 实现加载提醒配置逻辑
  }

  onConfigChanged(config: ReminderConfig): void {
    // TODO: 实现保存配置逻辑
  }
}

