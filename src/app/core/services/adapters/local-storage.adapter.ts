import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IStorageAdapter } from '../../interfaces/storage-adapter.interface';
import { Family } from '../../../models/family.interface';
import { FamilyMember } from '../../../models/family-member.interface';
import { WaterRecord } from '../../../models/water-record.interface';
import { DailySummary } from '../../../models/daily-summary.interface';
import { ReminderConfig } from '../../../models/reminder-config.interface';

/**
 * LocalStorage 适配器实现
 * 用于开发测试阶段，无需后端服务
 */
@Injectable()
export class LocalStorageAdapter implements IStorageAdapter {
  private readonly STORAGE_KEYS = {
    FAMILIES: 'wb_families',
    MEMBERS: 'wb_members',
    RECORDS: 'wb_records',
    REMINDERS: 'wb_reminders'
  };

  // [关键点] 家庭管理方法
  createFamily(name: string, creatorName: string, creatorAvatar: string): Observable<{
    familyId: string;
    memberId: string;
    inviteCode: string;
  }> {
    // TODO: 实现创建家庭逻辑
    throw new Error('Method not implemented.');
  }

  joinFamily(inviteCode: string, memberName: string, memberAvatar: string): Observable<{
    familyId: string;
    memberId: string;
  }> {
    // TODO: 实现加入家庭逻辑
    throw new Error('Method not implemented.');
  }

  getFamily(familyId: string): Observable<Family> {
    // TODO: 实现获取家庭逻辑
    throw new Error('Method not implemented.');
  }

  // [关键点] 成员管理方法
  getMembers(familyId: string): Observable<FamilyMember[]> {
    // TODO: 实现获取成员列表逻辑
    throw new Error('Method not implemented.');
  }

  addMember(member: FamilyMember): Observable<FamilyMember> {
    // TODO: 实现添加成员逻辑
    throw new Error('Method not implemented.');
  }

  updateMember(id: string, data: Partial<FamilyMember>): Observable<void> {
    // TODO: 实现更新成员逻辑
    throw new Error('Method not implemented.');
  }

  deleteMember(id: string): Observable<void> {
    // TODO: 实现删除成员逻辑
    throw new Error('Method not implemented.');
  }

  // [关键点] 喝水记录方法
  getRecordsByDate(memberId: string, date: string): Observable<WaterRecord[]> {
    // TODO: 实现获取记录逻辑
    throw new Error('Method not implemented.');
  }

  addRecord(record: WaterRecord): Observable<WaterRecord> {
    // TODO: 实现添加记录逻辑
    throw new Error('Method not implemented.');
  }

  deleteRecord(id: string): Observable<void> {
    // TODO: 实现删除记录逻辑
    throw new Error('Method not implemented.');
  }

  getTodaySummary(familyId: string): Observable<DailySummary> {
    // TODO: 实现获取今日汇总逻辑
    throw new Error('Method not implemented.');
  }

  // [关键点] 提醒配置方法
  getReminderConfig(memberId: string): Observable<ReminderConfig> {
    // TODO: 实现获取提醒配置逻辑
    throw new Error('Method not implemented.');
  }

  saveReminderConfig(memberId: string, config: ReminderConfig): Observable<void> {
    // TODO: 实现保存提醒配置逻辑
    throw new Error('Method not implemented.');
  }

  // [工具方法] UUID 生成
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // [工具方法] 邀请码生成
  private generateInviteCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  // [工具方法] 保存到 LocalStorage
  private saveToStorage(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // [工具方法] 从 LocalStorage 读取
  private getFromStorage<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
}

