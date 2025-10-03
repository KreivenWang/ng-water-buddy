import { Injectable, EventEmitter } from '@angular/core';
import { Observable, from } from 'rxjs';
import { ReminderConfig } from '../../models/reminder-config.interface';

/**
 * 通知提醒服务
 * 管理定时提醒、通知权限、提醒后交互
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private reminderInterval: any;
  private snoozeTimer: any;
  
  // [关键点] 事件发射器，用于通知应用层
  onReminderClicked = new EventEmitter<void>();

  /**
   * 请求通知权限
   */
  requestPermission(): Observable<NotificationPermission> {
    // TODO: 实现权限请求逻辑
    return from(Notification.requestPermission());
  }

  /**
   * 启动提醒
   * @param config 提醒配置（间隔、开始/结束时间）
   */
  startReminders(config: ReminderConfig): void {
    // TODO: 实现启动提醒逻辑
    throw new Error('Method not implemented.');
  }

  /**
   * 显示提醒通知
   */
  private showReminderNotification(): void {
    // TODO: 实现显示通知逻辑
    throw new Error('Method not implemented.');
  }

  /**
   * 处理通知点击
   */
  private handleNotificationClick(): void {
    // TODO: 实现通知点击处理逻辑
    this.onReminderClicked.emit();
  }

  /**
   * 稍后提醒（15分钟后）
   */
  snoozeReminder(): void {
    // TODO: 实现稍后提醒逻辑
    throw new Error('Method not implemented.');
  }

  /**
   * 取消所有提醒
   */
  cancelAllReminders(): void {
    if (this.reminderInterval) {
      clearInterval(this.reminderInterval);
      this.reminderInterval = null;
    }
    if (this.snoozeTimer) {
      clearTimeout(this.snoozeTimer);
      this.snoozeTimer = null;
    }
  }
}

