import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';
import { SettingsService } from './settings.service';

// 创建LocalStorageService的模拟
class MockLocalStorageService {
  private store: { [key: string]: any } = {};

  save(key: string, data: any, includeTimestamp: boolean = true): boolean {
    try {
      this.store[key] = JSON.stringify(data);
      return true;
    } catch (error) {
      return false;
    }
  }

  load<T>(key: string, defaultValue: T): T {
    try {
      const savedData = this.store[key];
      if (!savedData) {
        return defaultValue;
      }
      return JSON.parse(savedData) as T;
    } catch (error) {
      return defaultValue;
    }
  }

  remove(key: string): boolean {
    try {
      delete this.store[key];
      return true;
    } catch (error) {
      return false;
    }
  }

  // 模拟失败的方法
  simulateFailure(): void {
    this.save = () => false;
    this.load = () => ({} as any);
    this.remove = () => false;
  }
}

describe('SettingsService', () => {
  let service: SettingsService;
  let localStorageService: MockLocalStorageService;

  beforeEach(() => {
    localStorageService = new MockLocalStorageService();
    
    TestBed.configureTestingModule({
      providers: [
        {
          provide: LocalStorageService,
          useValue: localStorageService
        }
      ]
    });
    service = TestBed.inject(SettingsService);
  });

  describe('Daily Cup Settings', () => {
    it('should save daily cup settings successfully', () => {
      const settings = { dailyCups: 10, cupSize: 300 };
      const result = service.saveDailyCupSettings(settings);
      expect(result).toBeTrue();
    });

    it('should load daily cup settings successfully', () => {
      const expectedSettings = { dailyCups: 8, cupSize: 250 };
      const loadedSettings = service.loadDailyCupSettings();
      expect(loadedSettings).toEqual(expectedSettings);
    });

    it('should load custom daily cup settings when they exist', () => {
      const customSettings = { dailyCups: 10, cupSize: 300 };
      localStorageService.save('waterBuddy_dailyCup', customSettings);
      const loadedSettings = service.loadDailyCupSettings();
      expect(loadedSettings).toEqual(customSettings);
    });

    it('should return false when saving daily cup settings fails', () => {
      localStorageService.simulateFailure();
      const settings = { dailyCups: 8, cupSize: 250 };
      const result = service.saveDailyCupSettings(settings);
      expect(result).toBeFalse();
    });
  });

  describe('Reminder Frequency Settings', () => {
    it('should save reminder frequency settings successfully', () => {
      const settings = { frequencyMinutes: 45 };
      const result = service.saveReminderFrequencySettings(settings);
      expect(result).toBeTrue();
    });

    it('should load reminder frequency settings successfully', () => {
      const expectedSettings = { frequencyMinutes: 30 };
      const loadedSettings = service.loadReminderFrequencySettings();
      expect(loadedSettings).toEqual(expectedSettings);
    });

    it('should load custom reminder frequency settings when they exist', () => {
      const customSettings = { frequencyMinutes: 45 };
      localStorageService.save('waterBuddy_reminderFrequency', customSettings);
      const loadedSettings = service.loadReminderFrequencySettings();
      expect(loadedSettings).toEqual(customSettings);
    });

    it('should return false when saving reminder frequency settings fails', () => {
      localStorageService.simulateFailure();
      const settings = { frequencyMinutes: 30 };
      const result = service.saveReminderFrequencySettings(settings);
      expect(result).toBeFalse();
    });
  });

  describe('Reminder Repeat Settings', () => {
    it('should save reminder repeat settings successfully', () => {
      const settings = { repeatCount: 5, neverEnding: true };
      const result = service.saveReminderRepeatSettings(settings);
      expect(result).toBeTrue();
    });

    it('should load reminder repeat settings successfully', () => {
      const expectedSettings = { repeatCount: 3, neverEnding: false };
      const loadedSettings = service.loadReminderRepeatSettings();
      expect(loadedSettings).toEqual(expectedSettings);
    });

    it('should load custom reminder repeat settings when they exist', () => {
      const customSettings = { repeatCount: 5, neverEnding: true };
      localStorageService.save('waterBuddy_reminderRepeat', customSettings);
      const loadedSettings = service.loadReminderRepeatSettings();
      expect(loadedSettings).toEqual(customSettings);
    });

    it('should return false when saving reminder repeat settings fails', () => {
      localStorageService.simulateFailure();
      const settings = { repeatCount: 3, neverEnding: false };
      const result = service.saveReminderRepeatSettings(settings);
      expect(result).toBeFalse();
    });
  });

  describe('All Settings', () => {
    it('should save all settings successfully', () => {
      const allSettings = {
        dailyCup: { dailyCups: 8, cupSize: 250 },
        reminderFrequency: { frequencyMinutes: 30 },
        reminderRepeat: { repeatCount: 3, neverEnding: false },
        notificationSettings: { reminderEnabled: true, soundEnabled: true }
      };
      const result = service.saveAllSettings(allSettings);
      expect(result).toBeTrue();
    });

    it('should load all settings successfully with defaults', () => {
      const allSettings = service.loadAllSettings();
      expect(allSettings.dailyCup).toEqual({ dailyCups: 8, cupSize: 250 });
      expect(allSettings.reminderFrequency).toEqual({ frequencyMinutes: 30 });
      expect(allSettings.reminderRepeat).toEqual({ repeatCount: 3, neverEnding: false });
      expect(allSettings.notificationSettings).toEqual({ reminderEnabled: true, soundEnabled: true });
    });

    it('should load all settings when they exist', () => {
      const savedSettings = {
        dailyCup: { dailyCups: 10, cupSize: 300 },
        reminderFrequency: { frequencyMinutes: 45 },
        reminderRepeat: { repeatCount: 5, neverEnding: true },
        notificationSettings: { reminderEnabled: true, soundEnabled: true }
      };
      localStorageService.save('waterBuddy_allSettings', savedSettings);
      
      const loadedSettings = service.loadAllSettings();
      expect(loadedSettings).toEqual(savedSettings);
    });

    it('should return false when saving all settings fails', () => {
      localStorageService.simulateFailure();
      const allSettings = {
        dailyCup: { dailyCups: 8, cupSize: 250 },
        reminderFrequency: { frequencyMinutes: 30 },
        reminderRepeat: { repeatCount: 3, neverEnding: false },
        notificationSettings: { reminderEnabled: true, soundEnabled: true }
      };
      const result = service.saveAllSettings(allSettings);
      expect(result).toBeFalse();
    });
  });

  describe('Clear All Settings', () => {
    it('should clear all settings successfully', () => {
      // 先保存一些设置
      const dailyCupSettings = { dailyCups: 8, cupSize: 250 };
      const reminderFrequencySettings = { frequencyMinutes: 30 };
      const reminderRepeatSettings = { repeatCount: 3, neverEnding: false };
      
      localStorageService.save('waterBuddy_dailyCup', dailyCupSettings);
      localStorageService.save('waterBuddy_reminderFrequency', reminderFrequencySettings);
      localStorageService.save('waterBuddy_reminderRepeat', reminderRepeatSettings);
      localStorageService.save('waterBuddy_allSettings', {
        dailyCup: dailyCupSettings,
        reminderFrequency: reminderFrequencySettings,
        reminderRepeat: reminderRepeatSettings
      });
      
      // 清除设置
      const result = service.clearAllSettings();
      expect(result).toBeTrue();
    });

    it('should return true even when there are no settings to clear', () => {
      const result = service.clearAllSettings();
      expect(result).toBeTrue();
    });

    it('should return false when clearing settings fails', () => {
      localStorageService.simulateFailure();
      const result = service.clearAllSettings();
      expect(result).toBeFalse();
    });
  });
});