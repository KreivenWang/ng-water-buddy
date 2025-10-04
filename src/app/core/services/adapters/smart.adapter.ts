import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IStorageAdapter } from '../../interfaces/storage-adapter.interface';
import { Family } from '../../../models/family.interface';
import { FamilyMember } from '../../../models/family-member.interface';
import { WaterRecord } from '../../../models/water-record.interface';
import { DailySummary } from '../../../models/daily-summary.interface';
import { ReminderConfig } from '../../../models/reminder-config.interface';
import { environment } from '../../../../environments/environment';

/**
 * 智能适配器
 * 根据环境配置自动选择 LocalStorage 或 Supabase 适配器
 */
@Injectable()
export class SmartAdapter implements IStorageAdapter {
  private adapter!: IStorageAdapter;

  constructor() {
    this.initializeAdapter();
  }

  /**
   * 初始化适配器
   */
  private initializeAdapter(): void {
    if (environment.useLocalStorage) {
      // 使用 LocalStorage 适配器
      this.loadLocalStorageAdapter();
    } else {
      // 使用 Supabase 适配器
      this.loadSupabaseAdapter();
    }
  }

  /**
   * 动态加载 LocalStorage 适配器
   */
  private async loadLocalStorageAdapter(): Promise<void> {
    try {
      const { LocalStorageAdapter } = await import('./local-storage.adapter');
      this.adapter = new LocalStorageAdapter();
    } catch (error) {
      console.error('Failed to load LocalStorage adapter:', error);
      throw new Error('LocalStorage adapter not available');
    }
  }

  /**
   * 动态加载 Supabase 适配器
   */
  private async loadSupabaseAdapter(): Promise<void> {
    try {
      const { SupabaseAdapter } = await import('./supabase.adapter');
      this.adapter = new SupabaseAdapter();
    } catch (error) {
      console.error('Failed to load Supabase adapter:', error);
      throw new Error('Supabase adapter not available');
    }
  }

  // ========== 家庭管理方法 ==========

  createFamily(name: string, creatorName: string, creatorAvatar: string): Observable<{
    familyId: string;
    memberId: string;
    inviteCode: string;
  }> {
    return this.adapter.createFamily(name, creatorName, creatorAvatar);
  }

  joinFamily(inviteCode: string, memberName: string, memberAvatar: string): Observable<{
    familyId: string;
    memberId: string;
  }> {
    return this.adapter.joinFamily(inviteCode, memberName, memberAvatar);
  }

  getFamily(familyId: string): Observable<Family> {
    return this.adapter.getFamily(familyId);
  }

  // ========== 成员管理方法 ==========

  getMembers(familyId: string): Observable<FamilyMember[]> {
    return this.adapter.getMembers(familyId);
  }

  addMember(member: FamilyMember): Observable<FamilyMember> {
    return this.adapter.addMember(member);
  }

  updateMember(id: string, data: Partial<FamilyMember>): Observable<void> {
    return this.adapter.updateMember(id, data);
  }

  deleteMember(id: string): Observable<void> {
    return this.adapter.deleteMember(id);
  }

  // ========== 记录管理方法 ==========

  getRecordsByDate(memberId: string, date: string): Observable<WaterRecord[]> {
    return this.adapter.getRecordsByDate(memberId, date);
  }

  addRecord(record: WaterRecord): Observable<WaterRecord> {
    return this.adapter.addRecord(record);
  }

  deleteRecord(id: string): Observable<void> {
    return this.adapter.deleteRecord(id);
  }

  // ========== 汇总和统计方法 ==========

  getTodaySummary(familyId: string): Observable<DailySummary> {
    return this.adapter.getTodaySummary(familyId);
  }

  // ========== 提醒配置方法 ==========

  getReminderConfig(memberId: string): Observable<ReminderConfig> {
    return this.adapter.getReminderConfig(memberId);
  }

  saveReminderConfig(memberId: string, config: ReminderConfig): Observable<void> {
    return this.adapter.saveReminderConfig(memberId, config);
  }
}
