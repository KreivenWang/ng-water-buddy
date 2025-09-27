import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

// 定义设置类型
interface DailyCupSettings {
  dailyCups: number;
  cupSize: number;
  lastUpdated?: string;
}

interface ReminderFrequencySettings {
  frequencyMinutes: number;
  lastUpdated?: string;
}

interface ReminderRepeatSettings {
  repeatCount: number;
  neverEnding: boolean;
  lastUpdated?: string;
}

interface AllSettings {
  dailyCup: DailyCupSettings;
  reminderFrequency: ReminderFrequencySettings;
  reminderRepeat: ReminderRepeatSettings;
  lastSaved?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  // localStorage键名
  private readonly DAILY_CUP_KEY = 'waterBuddy_dailyCup';
  private readonly REMINDER_FREQUENCY_KEY = 'waterBuddy_reminderFrequency';
  private readonly REMINDER_REPEAT_KEY = 'waterBuddy_reminderRepeat';
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

  constructor(private localStorageService: LocalStorageService) { }

  /**
   * 保存每日饮水目标设置
   */
  saveDailyCupSettings(settings: DailyCupSettings): boolean {
    return this.localStorageService.save(this.DAILY_CUP_KEY, settings);
  }

  /**
   * 加载每日饮水目标设置
   */
  loadDailyCupSettings(): DailyCupSettings {
    return this.localStorageService.load(this.DAILY_CUP_KEY, this.DEFAULT_DAILY_CUP);
  }

  /**
   * 保存提醒频率设置
   */
  saveReminderFrequencySettings(settings: ReminderFrequencySettings): boolean {
    return this.localStorageService.save(this.REMINDER_FREQUENCY_KEY, settings);
  }

  /**
   * 加载提醒频率设置
   */
  loadReminderFrequencySettings(): ReminderFrequencySettings {
    return this.localStorageService.load(this.REMINDER_FREQUENCY_KEY, this.DEFAULT_REMINDER_FREQUENCY);
  }

  /**
   * 保存提醒重复设置
   */
  saveReminderRepeatSettings(settings: ReminderRepeatSettings): boolean {
    return this.localStorageService.save(this.REMINDER_REPEAT_KEY, settings);
  }

  /**
   * 加载提醒重复设置
   */
  loadReminderRepeatSettings(): ReminderRepeatSettings {
    return this.localStorageService.load(this.REMINDER_REPEAT_KEY, this.DEFAULT_REMINDER_REPEAT);
  }

  /**
   * 保存所有设置
   */
  saveAllSettings(settings: AllSettings): boolean {
    // 保存整体设置
    const success = this.localStorageService.save(this.ALL_SETTINGS_KEY, settings);
    
    if (success) {
      // 同时保存各个单独的设置
      this.saveDailyCupSettings(settings.dailyCup);
      this.saveReminderFrequencySettings(settings.reminderFrequency);
      this.saveReminderRepeatSettings(settings.reminderRepeat);
    }
    
    return success;
  }

  /**
   * 加载所有设置
   */
  loadAllSettings(): AllSettings {
    // 尝试加载整体设置
    const allSettings = this.localStorageService.load<AllSettings>(this.ALL_SETTINGS_KEY, {
      dailyCup: this.DEFAULT_DAILY_CUP,
      reminderFrequency: this.DEFAULT_REMINDER_FREQUENCY,
      reminderRepeat: this.DEFAULT_REMINDER_REPEAT
    });
    
    // 如果整体设置不存在，则从各个单独的设置中加载
    if (!allSettings) {
      return {
        dailyCup: this.loadDailyCupSettings(),
        reminderFrequency: this.loadReminderFrequencySettings(),
        reminderRepeat: this.loadReminderRepeatSettings(),
        lastSaved: new Date().toISOString()
      };
    }
    
    return allSettings;
  }

  /**
   * 清除所有设置
   */
  clearAllSettings(): boolean {
    const keys = [
      this.DAILY_CUP_KEY,
      this.REMINDER_FREQUENCY_KEY,
      this.REMINDER_REPEAT_KEY,
      this.ALL_SETTINGS_KEY
    ];
    
    return keys.every(key => this.localStorageService.remove(key));
  }
}