import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

// 定义设置类型
interface DailyCupSettings {
  dailyCups: number;
  cupSize: number;
}

interface ReminderFrequencySettings {
  frequencyMinutes: number;
}

interface ReminderRepeatSettings {
  repeatCount: number;
  neverEnding: boolean;
}

interface NotificationSettings {
  reminderEnabled: boolean;
  soundEnabled: boolean;
}

export interface AllSettings {
  dailyCup: DailyCupSettings;
  reminderFrequency: ReminderFrequencySettings;
  reminderRepeat: ReminderRepeatSettings;
  notificationSettings: NotificationSettings;
  lastSaved?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  // 只保留all settings的localStorage键名
  private readonly ALL_SETTINGS_KEY = 'waterBuddy_allSettings';

  // 默认设置
  private readonly DEFAULT_DAILY_CUP: DailyCupSettings = {
    dailyCups: 8,
    cupSize: 250
  };

  private readonly DEFAULT_REMINDER_FREQUENCY: ReminderFrequencySettings = {
    frequencyMinutes: 30
  };

  private readonly DEFAULT_REMINDER_REPEAT: ReminderRepeatSettings = {
    repeatCount: 3,
    neverEnding: false
  };
  
  private readonly DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
    reminderEnabled: true,
    soundEnabled: true
  };

  private readonly DEFAULT_ALL_SETTINGS: AllSettings = {
    dailyCup: this.DEFAULT_DAILY_CUP,
    reminderFrequency: this.DEFAULT_REMINDER_FREQUENCY,
    reminderRepeat: this.DEFAULT_REMINDER_REPEAT,
    notificationSettings: this.DEFAULT_NOTIFICATION_SETTINGS
  };

  constructor(private localStorageService: LocalStorageService) { }

  /**
   * 保存所有设置
   */
  saveAllSettings(settings: AllSettings): boolean {
    // 添加最后保存时间
    const settingsWithTimestamp = {
      ...settings,
      lastSaved: new Date().toISOString()
    };
    return this.localStorageService.save(this.ALL_SETTINGS_KEY, settingsWithTimestamp);
  }

  /**
   * 加载所有设置
   */
  loadAllSettings(): AllSettings {
    return this.localStorageService.load<AllSettings>(this.ALL_SETTINGS_KEY, this.DEFAULT_ALL_SETTINGS);
  }

  /**
   * 清除所有设置
   */
  clearAllSettings(): boolean {
    return this.localStorageService.remove(this.ALL_SETTINGS_KEY);
  }
}