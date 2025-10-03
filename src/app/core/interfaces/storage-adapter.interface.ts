import { Observable } from 'rxjs';
import { Family } from '../../models/family.interface';
import { FamilyMember } from '../../models/family-member.interface';
import { WaterRecord } from '../../models/water-record.interface';
import { DailySummary } from '../../models/daily-summary.interface';
import { ReminderConfig } from '../../models/reminder-config.interface';

/**
 * 存储适配器接口
 * 支持多种存储后端（LocalStorage、Supabase）
 */
export interface IStorageAdapter {
  // 家庭管理
  createFamily(name: string, creatorName: string, creatorAvatar: string): Observable<{
    familyId: string;
    memberId: string;
    inviteCode: string;
  }>;
  joinFamily(inviteCode: string, memberName: string, memberAvatar: string): Observable<{
    familyId: string;
    memberId: string;
  }>;
  getFamily(familyId: string): Observable<Family>;
  
  // 成员管理
  getMembers(familyId: string): Observable<FamilyMember[]>;
  addMember(member: FamilyMember): Observable<FamilyMember>;
  updateMember(id: string, data: Partial<FamilyMember>): Observable<void>;
  deleteMember(id: string): Observable<void>;
  
  // 喝水记录
  getRecordsByDate(memberId: string, date: string): Observable<WaterRecord[]>;
  addRecord(record: WaterRecord): Observable<WaterRecord>;
  deleteRecord(id: string): Observable<void>;
  getTodaySummary(familyId: string): Observable<DailySummary>;
  
  // 提醒配置
  getReminderConfig(memberId: string): Observable<ReminderConfig>;
  saveReminderConfig(memberId: string, config: ReminderConfig): Observable<void>;
}

