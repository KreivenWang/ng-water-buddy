import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { 
  AllSettings, 
  DEFAULT_ALL_SETTINGS,
  DailyCupSettings,
  ReminderFrequencySettings,
  ReminderRepeatSettings,
  NotificationSettings
} from '../models/user-setting';
import { 
  DrinkRecords, 
  DrinkRecord,
  ReminderStatus,
  DEFAULT_REMINDER_STATUS,
  STORAGE_KEYS 
} from '../models/water-data';

/**
 * 数据API服务 - 统一管理所有数据的加载和保存
 * 替代直接使用localStorage，提供统一的数据访问接口
 */
@Injectable({
  providedIn: 'root'
})
export class DataApiService {
  // 数据状态管理
  private settingsSubject = new BehaviorSubject<AllSettings>(DEFAULT_ALL_SETTINGS);
  private todayRecordsSubject = new BehaviorSubject<DrinkRecords>(this.getDefaultRecords());
  private reminderStatusSubject = new BehaviorSubject<ReminderStatus>(DEFAULT_REMINDER_STATUS);

  // 可观察的数据流
  public settings$ = this.settingsSubject.asObservable();
  public todayRecords$ = this.todayRecordsSubject.asObservable();
  public reminderStatus$ = this.reminderStatusSubject.asObservable();

  constructor(private localStorageService: LocalStorageService) {
    // 初始化时加载所有数据
    this.loadAllData();
  }

  // ==================== 设置相关 ====================

  /**
   * 获取当前设置
   */
  getSettings(): AllSettings {
    return this.settingsSubject.value;
  }

  /**
   * 获取设置流
   */
  getSettings$(): Observable<AllSettings> {
    return this.settings$;
  }

  /**
   * 保存所有设置
   */
  saveSettings(settings: AllSettings): Observable<boolean> {
    try {
      const settingsWithTimestamp = {
        ...settings,
        lastSaved: new Date().toISOString(),
      };
      
      const success = this.localStorageService.save(STORAGE_KEYS.ALL_SETTINGS, settingsWithTimestamp);
      if (success) {
        this.settingsSubject.next(settingsWithTimestamp);
      }
      return of(success);
    } catch (error) {
      console.error('保存设置失败:', error);
      return of(false);
    }
  }

  /**
   * 更新每日杯数设置
   */
  updateDailyCupSettings(dailyCup: DailyCupSettings): Observable<boolean> {
    const currentSettings = this.getSettings();
    const updatedSettings = {
      ...currentSettings,
      dailyCup
    };
    return this.saveSettings(updatedSettings);
  }

  /**
   * 更新提醒频率设置
   */
  updateReminderFrequencySettings(reminderFrequency: ReminderFrequencySettings): Observable<boolean> {
    const currentSettings = this.getSettings();
    const updatedSettings = {
      ...currentSettings,
      reminderFrequency
    };
    return this.saveSettings(updatedSettings);
  }

  /**
   * 更新提醒重复设置
   */
  updateReminderRepeatSettings(reminderRepeat: ReminderRepeatSettings): Observable<boolean> {
    const currentSettings = this.getSettings();
    const updatedSettings = {
      ...currentSettings,
      reminderRepeat
    };
    return this.saveSettings(updatedSettings);
  }

  /**
   * 更新通知设置
   */
  updateNotificationSettings(notificationSettings: NotificationSettings): Observable<boolean> {
    const currentSettings = this.getSettings();
    const updatedSettings = {
      ...currentSettings,
      notificationSettings
    };
    return this.saveSettings(updatedSettings);
  }

  // ==================== 饮水记录相关 ====================

  /**
   * 获取今日饮水记录
   */
  getTodayRecords(): DrinkRecords {
    return this.todayRecordsSubject.value;
  }

  /**
   * 获取今日饮水记录流
   */
  getTodayRecords$(): Observable<DrinkRecords> {
    return this.todayRecords$;
  }

  /**
   * 记录一次饮水
   */
  recordWaterIntake(): Observable<boolean> {
    try {
      const currentRecords = this.getTodayRecords();
      const nextRecord = currentRecords.records.find(record => !record.completed);
      
      if (nextRecord) {
        nextRecord.completed = true;
        nextRecord.timestamp = new Date().toISOString();
        this.updateStatistics(currentRecords);
        this.saveTodayRecords(currentRecords);
        console.log(`已记录第${nextRecord.id}杯水，时间: ${nextRecord.timestamp}`);
        return of(true);
      } else {
        console.log("今日饮水目标已完成！");
        return of(false);
      }
    } catch (error) {
      console.error("记录饮水失败:", error);
      return of(false);
    }
  }

  /**
   * 获取今日进度
   */
  getTodayProgress(): { current: number; total: number; percentage: number } {
    const records = this.getTodayRecords();
    return {
      current: records.currentAmount,
      total: records.totalAmount,
      percentage: records.completedPercentage
    };
  }

  /**
   * 检查今日目标是否完成
   */
  isTodayGoalCompleted(): boolean {
    const records = this.getTodayRecords();
    return records.currentAmount >= records.totalAmount;
  }

  /**
   * 获取下一杯水的编号
   */
  getNextCupNumber(): number {
    const records = this.getTodayRecords();
    const nextRecord = records.records.find(record => !record.completed);
    return nextRecord ? nextRecord.id : records.totalAmount + 1;
  }

  /**
   * 重置今日记录
   */
  resetTodayRecords(): Observable<boolean> {
    try {
      const today = this.getTodayKey();
      const success = this.localStorageService.remove(today);
      if (success) {
        const defaultRecords = this.getDefaultRecords();
        this.todayRecordsSubject.next(defaultRecords);
        console.log("今日饮水记录已重置");
      }
      return of(success);
    } catch (error) {
      console.error("重置今日记录失败:", error);
      return of(false);
    }
  }

  // ==================== 提醒状态相关 ====================

  /**
   * 获取提醒状态
   */
  getReminderStatus(): ReminderStatus {
    return this.reminderStatusSubject.value;
  }

  /**
   * 获取提醒状态流
   */
  getReminderStatus$(): Observable<ReminderStatus> {
    return this.reminderStatus$;
  }

  /**
   * 更新提醒状态
   */
  updateReminderStatus(status: ReminderStatus): Observable<boolean> {
    try {
      const success = this.localStorageService.save(STORAGE_KEYS.REMINDER_STATUS, status);
      if (success) {
        this.reminderStatusSubject.next(status);
      }
      return of(success);
    } catch (error) {
      console.error('更新提醒状态失败:', error);
      return of(false);
    }
  }

  // ==================== 私有方法 ====================

  /**
   * 加载所有数据
   */
  private loadAllData(): void {
    // 加载设置
    const settings = this.localStorageService.load<AllSettings>(
      STORAGE_KEYS.ALL_SETTINGS,
      DEFAULT_ALL_SETTINGS
    );
    this.settingsSubject.next(settings);

    // 加载今日记录
    const todayRecords = this.loadTodayRecords();
    this.todayRecordsSubject.next(todayRecords);

    // 加载提醒状态
    const reminderStatus = this.localStorageService.load<ReminderStatus>(
      STORAGE_KEYS.REMINDER_STATUS,
      DEFAULT_REMINDER_STATUS
    );
    this.reminderStatusSubject.next(reminderStatus);
  }

  /**
   * 加载今日记录
   */
  private loadTodayRecords(): DrinkRecords {
    const today = this.getTodayKey();
    return this.localStorageService.load<DrinkRecords>(
      today,
      this.getDefaultRecords()
    );
  }

  /**
   * 保存今日记录
   */
  private saveTodayRecords(records: DrinkRecords): boolean {
    const today = this.getTodayKey();
    return this.localStorageService.save(today, records);
  }

  /**
   * 获取今日存储键
   */
  private getTodayKey(): string {
    const today = new Date().toISOString().split("T")[0];
    return `${STORAGE_KEYS.DRINK_RECORDS}_${today}`;
  }

  /**
   * 获取默认记录
   */
  private getDefaultRecords(): DrinkRecords {
    const settings = this.getSettings();
    const dailyCups = settings.dailyCup.dailyCups || 8;
    const cupSize = settings.dailyCup.cupSize || 250;
    
    return {
      records: Array.from({ length: dailyCups }, (_, i) => ({
        id: i + 1,
        completed: false
      })),
      currentAmount: 0,
      totalAmount: dailyCups,
      completedPercentage: 0,
      totalMl: dailyCups * cupSize
    };
  }

  /**
   * 更新统计信息
   */
  private updateStatistics(records: DrinkRecords): void {
    const completedCount = records.records.filter(r => r.completed).length;
    records.currentAmount = completedCount;
    records.completedPercentage = Math.round((completedCount / records.totalAmount) * 100);
  }

  // ==================== 数据管理 ====================

  /**
   * 清除所有数据
   */
  clearAllData(): Observable<boolean> {
    try {
      const keys = [
        STORAGE_KEYS.ALL_SETTINGS,
        STORAGE_KEYS.REMINDER_STATUS
      ];
      
      // 清除所有设置相关数据
      keys.forEach(key => this.localStorageService.remove(key));
      
      // 清除今日记录
      const today = this.getTodayKey();
      this.localStorageService.remove(today);
      
      // 重置所有状态
      this.settingsSubject.next(DEFAULT_ALL_SETTINGS);
      this.todayRecordsSubject.next(this.getDefaultRecords());
      this.reminderStatusSubject.next(DEFAULT_REMINDER_STATUS);
      
      console.log('所有数据已清除');
      return of(true);
    } catch (error) {
      console.error('清除数据失败:', error);
      return of(false);
    }
  }

  /**
   * 导出所有数据
   */
  exportAllData(): Observable<any> {
    const data = {
      settings: this.getSettings(),
      todayRecords: this.getTodayRecords(),
      reminderStatus: this.getReminderStatus(),
      exportTime: new Date().toISOString()
    };
    return of(data);
  }

  /**
   * 导入数据
   */
  importData(data: any): Observable<boolean> {
    try {
      if (data.settings) {
        this.saveSettings(data.settings).subscribe();
      }
      if (data.todayRecords) {
        this.todayRecordsSubject.next(data.todayRecords);
        this.saveTodayRecords(data.todayRecords);
      }
      if (data.reminderStatus) {
        this.updateReminderStatus(data.reminderStatus).subscribe();
      }
      return of(true);
    } catch (error) {
      console.error('导入数据失败:', error);
      return of(false);
    }
  }
}
