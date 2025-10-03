import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IStorageAdapter } from '../../interfaces/storage-adapter.interface';
import { Family } from '../../../models/family.interface';
import { FamilyMember } from '../../../models/family-member.interface';
import { WaterRecord } from '../../../models/water-record.interface';
import { DailySummary } from '../../../models/daily-summary.interface';
import { ReminderConfig } from '../../../models/reminder-config.interface';

/**
 * Supabase 适配器实现
 * 用于生产环境，支持云端同步
 */
@Injectable()
export class SupabaseAdapter implements IStorageAdapter {
  
  // TODO: 注入 SupabaseService
  // constructor(private supabase: SupabaseService) {}

  createFamily(name: string, creatorName: string, creatorAvatar: string): Observable<{
    familyId: string;
    memberId: string;
    inviteCode: string;
  }> {
    // TODO: 调用 Supabase Function
    throw new Error('Method not implemented.');
  }

  joinFamily(inviteCode: string, memberName: string, memberAvatar: string): Observable<{
    familyId: string;
    memberId: string;
  }> {
    // TODO: 调用 Supabase Function
    throw new Error('Method not implemented.');
  }

  getFamily(familyId: string): Observable<Family> {
    // TODO: 查询 Supabase
    throw new Error('Method not implemented.');
  }

  getMembers(familyId: string): Observable<FamilyMember[]> {
    // TODO: 查询 Supabase
    throw new Error('Method not implemented.');
  }

  addMember(member: FamilyMember): Observable<FamilyMember> {
    // TODO: 插入 Supabase
    throw new Error('Method not implemented.');
  }

  updateMember(id: string, data: Partial<FamilyMember>): Observable<void> {
    // TODO: 更新 Supabase
    throw new Error('Method not implemented.');
  }

  deleteMember(id: string): Observable<void> {
    // TODO: 删除 Supabase
    throw new Error('Method not implemented.');
  }

  getRecordsByDate(memberId: string, date: string): Observable<WaterRecord[]> {
    // TODO: 查询 Supabase
    throw new Error('Method not implemented.');
  }

  addRecord(record: WaterRecord): Observable<WaterRecord> {
    // TODO: 插入 Supabase
    throw new Error('Method not implemented.');
  }

  deleteRecord(id: string): Observable<void> {
    // TODO: 删除 Supabase
    throw new Error('Method not implemented.');
  }

  getTodaySummary(familyId: string): Observable<DailySummary> {
    // TODO: 调用 Supabase Function
    throw new Error('Method not implemented.');
  }

  getReminderConfig(memberId: string): Observable<ReminderConfig> {
    // TODO: 查询 Supabase
    throw new Error('Method not implemented.');
  }

  saveReminderConfig(memberId: string, config: ReminderConfig): Observable<void> {
    // TODO: 更新 Supabase
    throw new Error('Method not implemented.');
  }
}

