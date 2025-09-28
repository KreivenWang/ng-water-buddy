import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataApiService } from './data-api.service';
import { AllSettings, DailyCupSettings, ReminderFrequencySettings, ReminderRepeatSettings, NotificationSettings } from '../models/user-setting';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private dataApiService: DataApiService) {}

  /**
   * 保存所有设置
   */
  saveAllSettings(settings: AllSettings): Observable<boolean> {
    return this.dataApiService.saveSettings(settings);
  }

  /**
   * 加载所有设置
   */
  loadAllSettings(): AllSettings {
    return this.dataApiService.getSettings();
  }

  /**
   * 获取设置流
   */
  getSettings$(): Observable<AllSettings> {
    return this.dataApiService.getSettings$();
  }

  /**
   * 更新每日杯数设置
   */
  updateDailyCupSettings(dailyCup: DailyCupSettings): Observable<boolean> {
    return this.dataApiService.updateDailyCupSettings(dailyCup);
  }

  /**
   * 更新提醒频率设置
   */
  updateReminderFrequencySettings(reminderFrequency: ReminderFrequencySettings): Observable<boolean> {
    return this.dataApiService.updateReminderFrequencySettings(reminderFrequency);
  }

  /**
   * 更新提醒重复设置
   */
  updateReminderRepeatSettings(reminderRepeat: ReminderRepeatSettings): Observable<boolean> {
    return this.dataApiService.updateReminderRepeatSettings(reminderRepeat);
  }

  /**
   * 更新通知设置
   */
  updateNotificationSettings(notificationSettings: NotificationSettings): Observable<boolean> {
    return this.dataApiService.updateNotificationSettings(notificationSettings);
  }

  /**
   * 清除所有设置
   */
  clearAllSettings(): Observable<boolean> {
    return this.dataApiService.clearAllData();
  }
}
