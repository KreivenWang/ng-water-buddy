import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { IStorageAdapter } from '../../interfaces/storage-adapter.interface';
import { Family } from '../../../models/family.interface';
import { FamilyMember, AVATAR_COLORS, AVATAR_EMOJIS } from '../../../models/family-member.interface';
import { WaterRecord } from '../../../models/water-record.interface';
import { DailySummary } from '../../../models/daily-summary.interface';
import { ReminderConfig } from '../../../models/reminder-config.interface';

/**
 * LocalStorage 适配器实现
 * 用于开发测试阶段，无需后端服务
 * 
 * [关键点] 数据结构：
 * - wb_families: { [familyId]: Family }
 * - wb_members: { [memberId]: FamilyMember }
 * - wb_records: { [recordId]: WaterRecord }
 * - wb_reminders: ReminderConfig
 * - wb_current_family: string (当前家庭ID)
 */
@Injectable()
export class LocalStorageAdapter implements IStorageAdapter {
  private readonly STORAGE_KEYS = {
    FAMILIES: 'wb_families',
    MEMBERS: 'wb_members',
    RECORDS: 'wb_records',
    REMINDERS: 'wb_reminders',
    CURRENT_FAMILY: 'wb_current_family'
  };

  private readonly DEFAULT_FAMILY_ID = 'default-family-001';

  constructor() {
    this.initializeDefaultData();
  }

  /**
   * 初始化默认数据
   * [关键点] 首次使用时自动创建示例家庭和成员
   */
  private initializeDefaultData(): void {
    const currentFamily = localStorage.getItem(this.STORAGE_KEYS.CURRENT_FAMILY);
    
    if (!currentFamily) {
      // 创建默认家庭
      const defaultFamily: Family = {
        id: this.DEFAULT_FAMILY_ID,
        name: '我的家庭',
        inviteCode: 'DEFAULT',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const families: { [key: string]: Family } = {
        [this.DEFAULT_FAMILY_ID]: defaultFamily
      };

      localStorage.setItem(this.STORAGE_KEYS.FAMILIES, JSON.stringify(families));
      localStorage.setItem(this.STORAGE_KEYS.CURRENT_FAMILY, this.DEFAULT_FAMILY_ID);

      // 创建默认成员："布布" 和 "一二"
      const defaultMembers: FamilyMember[] = [
        {
          id: this.generateId(),
          familyId: this.DEFAULT_FAMILY_ID,
          name: '布布',
          avatar: '👧',
          avatarBgColor: '#FF6B6B',
          dailyGoal: 2000,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: this.generateId(),
          familyId: this.DEFAULT_FAMILY_ID,
          name: '一二',
          avatar: '👦',
          avatarBgColor: '#4ECDC4',
          dailyGoal: 2000,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const membersMap: { [key: string]: FamilyMember } = {};
      defaultMembers.forEach(member => {
        membersMap[member.id] = member;
      });

      localStorage.setItem(this.STORAGE_KEYS.MEMBERS, JSON.stringify(membersMap));
      localStorage.setItem(this.STORAGE_KEYS.RECORDS, JSON.stringify({}));
    }
  }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取当前家庭 ID
   */
  private getCurrentFamilyId(): string {
    return localStorage.getItem(this.STORAGE_KEYS.CURRENT_FAMILY) || this.DEFAULT_FAMILY_ID;
  }

  /**
   * 获取今日日期字符串 (YYYY-MM-DD)
   */
  private getTodayDateString(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  /**
   * 模拟网络延迟（更真实的异步效果）
   */
  private simulateDelay<T>(data: T): Observable<T> {
    return of(data).pipe(delay(100));
  }

  // ========== 家庭管理方法 ==========

  createFamily(name: string, creatorName: string, creatorAvatar: string): Observable<{
    familyId: string;
    memberId: string;
    inviteCode: string;
  }> {
    const familyId = this.generateId();
    const memberId = this.generateId();
    const inviteCode = this.generateId().substr(0, 6).toUpperCase();

    const family: Family = {
      id: familyId,
      name,
      inviteCode,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const member: FamilyMember = {
      id: memberId,
      familyId,
      name: creatorName,
      avatar: creatorAvatar,
      avatarBgColor: AVATAR_COLORS[0],
      dailyGoal: 2000,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 保存家庭
    const families = this.getFamiliesFromStorage();
    families[familyId] = family;
    localStorage.setItem(this.STORAGE_KEYS.FAMILIES, JSON.stringify(families));

    // 保存创建者成员
    const members = this.getMembersFromStorage();
    members[memberId] = member;
    localStorage.setItem(this.STORAGE_KEYS.MEMBERS, JSON.stringify(members));

    // 设置为当前家庭
    localStorage.setItem(this.STORAGE_KEYS.CURRENT_FAMILY, familyId);

    return this.simulateDelay({ familyId, memberId, inviteCode });
  }

  joinFamily(inviteCode: string, memberName: string, memberAvatar: string): Observable<{
    familyId: string;
    memberId: string;
  }> {
    const families = this.getFamiliesFromStorage();
    const family = Object.values(families).find(f => f.inviteCode === inviteCode);

    if (!family) {
      return throwError(() => new Error('邀请码无效'));
    }

    const memberId = this.generateId();
    const member: FamilyMember = {
      id: memberId,
      familyId: family.id,
      name: memberName,
      avatar: memberAvatar,
      avatarBgColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      dailyGoal: 2000,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const members = this.getMembersFromStorage();
    members[memberId] = member;
    localStorage.setItem(this.STORAGE_KEYS.MEMBERS, JSON.stringify(members));

    localStorage.setItem(this.STORAGE_KEYS.CURRENT_FAMILY, family.id);

    return this.simulateDelay({ familyId: family.id, memberId });
  }

  getFamily(familyId: string): Observable<Family> {
    const families = this.getFamiliesFromStorage();
    const family = families[familyId];
    
    if (!family) {
      return throwError(() => new Error('家庭不存在'));
    }

    return this.simulateDelay(family);
  }

  // ========== 成员管理方法 ==========

  getMembers(familyId: string): Observable<FamilyMember[]> {
    const members = this.getMembersFromStorage();
    const familyMembers = Object.values(members)
      .filter(m => m.familyId === familyId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    return this.simulateDelay(familyMembers);
  }

  addMember(member: FamilyMember): Observable<FamilyMember> {
    const members = this.getMembersFromStorage();
    
    const newMember: FamilyMember = {
      ...member,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    members[newMember.id] = newMember;
    localStorage.setItem(this.STORAGE_KEYS.MEMBERS, JSON.stringify(members));

    return this.simulateDelay(newMember);
  }

  updateMember(id: string, data: Partial<FamilyMember>): Observable<void> {
    const members = this.getMembersFromStorage();
    
    if (!members[id]) {
      return throwError(() => new Error('成员不存在'));
    }

    members[id] = {
      ...members[id],
      ...data,
      updatedAt: new Date()
    };

    localStorage.setItem(this.STORAGE_KEYS.MEMBERS, JSON.stringify(members));
    return this.simulateDelay(void 0);
  }

  deleteMember(id: string): Observable<void> {
    const members = this.getMembersFromStorage();
    
    if (!members[id]) {
      return throwError(() => new Error('成员不存在'));
    }

    delete members[id];
    localStorage.setItem(this.STORAGE_KEYS.MEMBERS, JSON.stringify(members));

    // 同时删除该成员的所有记录
    const records = this.getRecordsFromStorage();
    const filteredRecords: { [key: string]: WaterRecord } = {};
    
    Object.entries(records).forEach(([recordId, record]) => {
      if (record.memberId !== id) {
        filteredRecords[recordId] = record;
      }
    });

    localStorage.setItem(this.STORAGE_KEYS.RECORDS, JSON.stringify(filteredRecords));

    return this.simulateDelay(void 0);
  }

  // ========== 喝水记录方法 ==========

  getRecordsByDate(memberId: string, date: string): Observable<WaterRecord[]> {
    const records = this.getRecordsFromStorage();
    
    const memberRecords = Object.values(records)
      .filter(r => {
        const recordDate = new Date(r.recordedAt).toISOString().split('T')[0];
        return r.memberId === memberId && recordDate === date;
      })
      .sort((a, b) => b.recordedAt.getTime() - a.recordedAt.getTime());

    return this.simulateDelay(memberRecords);
  }

  addRecord(record: WaterRecord): Observable<WaterRecord> {
    const records = this.getRecordsFromStorage();
    
    const newRecord: WaterRecord = {
      ...record,
      id: this.generateId(),
      recordedAt: new Date(record.recordedAt),
      synced: false
    };

    records[newRecord.id] = newRecord;
    localStorage.setItem(this.STORAGE_KEYS.RECORDS, JSON.stringify(records));

    return this.simulateDelay(newRecord);
  }

  deleteRecord(id: string): Observable<void> {
    const records = this.getRecordsFromStorage();
    
    if (!records[id]) {
      return throwError(() => new Error('记录不存在'));
    }

    delete records[id];
    localStorage.setItem(this.STORAGE_KEYS.RECORDS, JSON.stringify(records));

    return this.simulateDelay(void 0);
  }

  /**
   * 获取今日汇总
   * [关键点] 聚合所有成员的今日记录，计算总量和百分比
   */
  getTodaySummary(familyId: string): Observable<DailySummary> {
    const today = this.getTodayDateString();
    const members = this.getMembersFromStorage();
    const records = this.getRecordsFromStorage();

    // 筛选家庭成员
    const familyMembers = Object.values(members).filter(m => m.familyId === familyId);

    // 筛选今日记录
    const todayRecords = Object.values(records).filter(r => {
      const recordDate = new Date(r.recordedAt).toISOString().split('T')[0];
      return recordDate === today;
    });

    // 构建成员记录汇总
    const memberRecords: DailySummary['memberRecords'] = {};

    familyMembers.forEach(member => {
      const memberTodayRecords = todayRecords.filter(r => r.memberId === member.id);
      const totalAmount = memberTodayRecords.reduce((sum, r) => sum + r.amount, 0);
      const percentage = Math.min(Math.round((totalAmount / member.dailyGoal) * 100), 100);

      memberRecords[member.id] = {
        memberId: member.id,
        memberName: member.name,
        avatar: member.avatar,
        avatarBgColor: member.avatarBgColor,
        dailyGoal: member.dailyGoal,
        totalAmount,
        percentage,
        recordCount: memberTodayRecords.length,
        records: memberTodayRecords.sort((a, b) => b.recordedAt.getTime() - a.recordedAt.getTime())
      };
    });

    const summary: DailySummary = {
      date: today,
      memberRecords
    };

    return this.simulateDelay(summary);
  }

  // ========== 提醒配置方法 ==========

  getReminderConfig(memberId: string): Observable<ReminderConfig> {
    const configStr = localStorage.getItem(this.STORAGE_KEYS.REMINDERS);
    
    if (!configStr) {
      // 返回默认配置
      const defaultConfig: ReminderConfig = {
        enabled: false,
        interval: 1,
        startHour: 8,
        endHour: 22,
        soundType: 'water-drop',
        vibrate: true,
        autoRecordAmount: 200
      };
      return this.simulateDelay(defaultConfig);
    }

    const config = JSON.parse(configStr);
    return this.simulateDelay(config);
  }

  saveReminderConfig(memberId: string, config: ReminderConfig): Observable<void> {
    localStorage.setItem(this.STORAGE_KEYS.REMINDERS, JSON.stringify(config));
    return this.simulateDelay(void 0);
  }

  // ========== 私有辅助方法 ==========

  private getFamiliesFromStorage(): { [key: string]: Family } {
    const data = localStorage.getItem(this.STORAGE_KEYS.FAMILIES);
    return data ? JSON.parse(data) : {};
  }

  private getMembersFromStorage(): { [key: string]: FamilyMember } {
    const data = localStorage.getItem(this.STORAGE_KEYS.MEMBERS);
    if (!data) return {};
    
    const parsed = JSON.parse(data);
    // 转换日期字符串为 Date 对象
    Object.values(parsed).forEach((member: any) => {
      member.createdAt = new Date(member.createdAt);
      member.updatedAt = new Date(member.updatedAt);
    });
    return parsed;
  }

  private getRecordsFromStorage(): { [key: string]: WaterRecord } {
    const data = localStorage.getItem(this.STORAGE_KEYS.RECORDS);
    if (!data) return {};
    
    const parsed = JSON.parse(data);
    // 转换日期字符串为 Date 对象
    Object.values(parsed).forEach((record: any) => {
      record.recordedAt = new Date(record.recordedAt);
    });
    return parsed;
  }
}
