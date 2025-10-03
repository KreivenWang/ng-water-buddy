import { Injectable, Inject } from '@angular/core';
import { IStorageAdapter } from '../interfaces/storage-adapter.interface';

/**
 * 存储服务（统一门面）
 * 通过适配器模式支持多种存储后端
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  constructor(
    @Inject('STORAGE_ADAPTER') private adapter: IStorageAdapter
  ) {}

  // [关键点] 直接委托给适配器，保持接口一致性
  createFamily = this.adapter.createFamily.bind(this.adapter);
  joinFamily = this.adapter.joinFamily.bind(this.adapter);
  getFamily = this.adapter.getFamily.bind(this.adapter);
  
  getMembers = this.adapter.getMembers.bind(this.adapter);
  addMember = this.adapter.addMember.bind(this.adapter);
  updateMember = this.adapter.updateMember.bind(this.adapter);
  deleteMember = this.adapter.deleteMember.bind(this.adapter);
  
  getRecordsByDate = this.adapter.getRecordsByDate.bind(this.adapter);
  addRecord = this.adapter.addRecord.bind(this.adapter);
  deleteRecord = this.adapter.deleteRecord.bind(this.adapter);
  getTodaySummary = this.adapter.getTodaySummary.bind(this.adapter);
  
  getReminderConfig = this.adapter.getReminderConfig.bind(this.adapter);
  saveReminderConfig = this.adapter.saveReminderConfig.bind(this.adapter);
}

