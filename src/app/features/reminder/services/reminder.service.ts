import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReminderConfig } from '../../../models/reminder-config.interface';

/**
 * 提醒业务逻辑服务
 * 管理提醒配置和提醒调度
 */
@Injectable({ providedIn: 'root' })
export class ReminderService {
  
  /**
   * 获取提醒配置
   */
  getReminderConfig(memberId: string): Observable<ReminderConfig> {
    // TODO: 实现获取配置逻辑
    throw new Error('Method not implemented.');
  }

  /**
   * 保存提醒配置
   */
  saveReminderConfig(memberId: string, config: ReminderConfig): Observable<void> {
    // TODO: 实现保存配置逻辑
    throw new Error('Method not implemented.');
  }

  /**
   * 启动提醒
   */
  startReminder(config: ReminderConfig): void {
    // TODO: 实现启动提醒逻辑
    throw new Error('Method not implemented.');
  }

  /**
   * 停止提醒
   */
  stopReminder(): void {
    // TODO: 实现停止提醒逻辑
    throw new Error('Method not implemented.');
  }
}

