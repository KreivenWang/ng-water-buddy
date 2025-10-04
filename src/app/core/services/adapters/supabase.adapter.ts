import { Injectable } from '@angular/core';
import { Observable, throwError, of, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IStorageAdapter } from '../../interfaces/storage-adapter.interface';
import { Family } from '../../../models/family.interface';
import { FamilyMember } from '../../../models/family-member.interface';
import { WaterRecord } from '../../../models/water-record.interface';
import { DailySummary } from '../../../models/daily-summary.interface';
import { ReminderConfig } from '../../../models/reminder-config.interface';
import { AVATAR_COLORS } from '../../../models/family-member.interface';
import { environment } from '../../../../environments/environment';

/**
 * Supabase 适配器实现
 * 用于生产环境，支持云端同步
 * [临时方案] 在没有 Supabase 配置时回退到 LocalStorage
 */
@Injectable()
export class SupabaseAdapter implements IStorageAdapter {
  
  // [临时方案] 回退到 LocalStorage 适配器
  private fallbackAdapter: IStorageAdapter | null = null;

  constructor() {
    // 检查是否有有效的 Supabase 配置
    if (!this.hasValidSupabaseConfig()) {
      // 动态导入 LocalStorage 适配器作为回退方案
      this.initializeFallbackAdapter();
    }
  }

  /**
   * 检查是否有有效的 Supabase 配置
   */
  private hasValidSupabaseConfig(): boolean {
    return !!(
      environment.supabase?.url && 
      environment.supabase?.url !== 'https://your-project.supabase.co' &&
      environment.supabase?.anonKey && 
      environment.supabase?.anonKey !== 'your-anon-key'
    );
  }

  /**
   * 初始化回退适配器
   */
  private async initializeFallbackAdapter(): Promise<void> {
    try {
      const { LocalStorageAdapter } = await import('./local-storage.adapter');
      this.fallbackAdapter = new LocalStorageAdapter();
    } catch (error) {
      console.error('Failed to initialize fallback adapter:', error);
    }
  }

  /**
   * 使用回退适配器或抛出错误
   */
  private useFallbackOrThrow<T>(methodName: string, ...args: any[]): Observable<T> {
    if (this.fallbackAdapter) {
      return (this.fallbackAdapter as any)[methodName].apply(this.fallbackAdapter, args);
    }
    throw new Error(`Supabase not configured and fallback not available. Method: ${methodName}`);
  }

  // ========== 家庭管理方法 ==========

  createFamily(name: string, creatorName: string, creatorAvatar: string): Observable<{
    familyId: string;
    memberId: string;
    inviteCode: string;
  }> {
    if (!this.hasValidSupabaseConfig()) {
      return this.useFallbackOrThrow('createFamily', name, creatorName, creatorAvatar);
    }
    
    // TODO: 实现 Supabase 创建家庭逻辑
    // return from(this.supabase.callFunction('create_family', {...}));
    throw new Error('Supabase createFamily not implemented yet.');
  }

  joinFamily(inviteCode: string, memberName: string, memberAvatar: string): Observable<{
    familyId: string;
    memberId: string;
  }> {
    if (!this.hasValidSupabaseConfig()) {
      return this.useFallbackOrThrow('joinFamily', inviteCode, memberName, memberAvatar);
    }
    
    // TODO: 实现 Supabase 加入家庭逻辑
    throw new Error('Supabase joinFamily not implemented yet.');
  }

  getFamily(familyId: string): Observable<Family> {
    if (!this.hasValidSupabaseConfig()) {
      return this.useFallbackOrThrow('getFamily', familyId);
    }
    
    // TODO: 实现 Supabase 查询家庭逻辑
    throw new Error('Supabase getFamily not implemented yet.');
  }

  // ========== 成员管理方法 ==========

  getMembers(familyId: string): Observable<FamilyMember[]> {
    if (!this.hasValidSupabaseConfig()) {
      return this.useFallbackOrThrow('getMembers', familyId);
    }
    
    // TODO: 实现 Supabase 查询成员逻辑
    // return from(this.supabase.client.from('family_members').select('*').eq('family_id', familyId));
    throw new Error('Supabase getMembers not implemented yet.');
  }

  addMember(member: FamilyMember): Observable<FamilyMember> {
    if (!this.hasValidSupabaseConfig()) {
      return this.useFallbackOrThrow('addMember', member);
    }
    
    // TODO: 实现 Supabase 添加成员逻辑
    throw new Error('Supabase addMember not implemented yet.');
  }

  updateMember(id: string, data: Partial<FamilyMember>): Observable<void> {
    if (!this.hasValidSupabaseConfig()) {
      return this.useFallbackOrThrow('updateMember', id, data);
    }
    
    // TODO: 实现 Supabase 更新成员逻辑
    throw new Error('Supabase updateMember not implemented yet.');
  }

  deleteMember(id: string): Observable<void> {
    if (!this.hasValidSupabaseConfig()) {
      return this.useFallbackOrThrow('deleteMember', id);
    }
    
    // TODO: 实现 Supabase 删除成员逻辑
    throw new Error('Supabase deleteMember not implemented yet.');
  }

  // ========== 记录管理方法 ==========

  getRecordsByDate(memberId: string, date: string): Observable<WaterRecord[]> {
    if (!this.hasValidSupabaseConfig()) {
      return this.useFallbackOrThrow('getRecordsByDate', memberId, date);
    }
    
    // TODO: 实现 Supabase 查询记录逻辑
    throw new Error('Supabase getRecordsByDate not implemented yet.');
  }

  addRecord(record: WaterRecord): Observable<WaterRecord> {
    if (!this.hasValidSupabaseConfig()) {
      return this.useFallbackOrThrow('addRecord', record);
    }
    
    // TODO: 实现 Supabase 添加记录逻辑
    throw new Error('Supabase addRecord not implemented yet.');
  }

  deleteRecord(id: string): Observable<void> {
    if (!this.hasValidSupabaseConfig()) {
      return this.useFallbackOrThrow('deleteRecord', id);
    }
    
    // TODO: 实现 Supabase 删除记录逻辑
    throw new Error('Supabase deleteRecord not implemented yet.');
  }

  // ========== 汇总和统计方法 ==========

  getTodaySummary(familyId: string): Observable<DailySummary> {
    if (!this.hasValidSupabaseConfig()) {
      return this.useFallbackOrThrow('getTodaySummary', familyId);
    }
    
    // TODO: 实现 Supabase 今日汇总逻辑
    // return from(this.supabase.callFunction('get_today_summary', { family_id_param: familyId }));
    throw new Error('Supabase getTodaySummary not implemented yet.');
  }

  // ========== 提醒配置方法 ==========

  getReminderConfig(memberId: string): Observable<ReminderConfig> {
    if (!this.hasValidSupabaseConfig()) {
      return this.useFallbackOrThrow('getReminderConfig', memberId);
    }
    
    // TODO: 实现 Supabase 查询提醒配置逻辑
    throw new Error('Supabase getReminderConfig not implemented yet.');
  }

  saveReminderConfig(memberId: string, config: ReminderConfig): Observable<void> {
    if (!this.hasValidSupabaseConfig()) {
      return this.useFallbackOrThrow('saveReminderConfig', memberId, config);
    }
    
    // TODO: 实现 Supabase 保存提醒配置逻辑
    throw new Error('Supabase saveReminderConfig not implemented yet.');
  }
}