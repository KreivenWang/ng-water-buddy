import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { AllSettings, DEFAULT_ALL_SETTINGS } from '../models/user-setting';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  // 只保留all settings的localStorage键名
  private readonly ALL_SETTINGS_KEY = 'waterBuddy_allSettings';

  constructor(private localStorageService: LocalStorageService) {}

  /**
   * 保存所有设置
   */
  saveAllSettings(settings: AllSettings): boolean {
    // 添加最后保存时间
    const settingsWithTimestamp = {
      ...settings,
      lastSaved: new Date().toISOString(),
    };
    return this.localStorageService.save(this.ALL_SETTINGS_KEY, settingsWithTimestamp);
  }

  /**
   * 加载所有设置
   */
  loadAllSettings(): AllSettings {
    return this.localStorageService.load<AllSettings>(
      this.ALL_SETTINGS_KEY,
      DEFAULT_ALL_SETTINGS
    );
  }

  /**
   * 清除所有设置
   */
  clearAllSettings(): boolean {
    return this.localStorageService.remove(this.ALL_SETTINGS_KEY);
  }
}
