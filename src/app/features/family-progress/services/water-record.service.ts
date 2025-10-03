import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WaterRecord } from '../../../models/water-record.interface';
import { DailySummary } from '../../../models/daily-summary.interface';
import { StorageService } from '../../../core/services/storage.service';

/**
 * 喝水记录管理服务
 */
@Injectable({ providedIn: 'root' })
export class WaterRecordService {
  
  constructor(private storageService: StorageService) {}

  /**
   * 添加喝水记录
   */
  addRecord(record: WaterRecord): Observable<WaterRecord> {
    return this.storageService.addRecord(record);
  }

  /**
   * 获取指定日期的记录
   */
  getRecordsByDate(memberId: string, date: string): Observable<WaterRecord[]> {
    return this.storageService.getRecordsByDate(memberId, date);
  }

  /**
   * 删除记录
   */
  deleteRecord(id: string): Observable<void> {
    return this.storageService.deleteRecord(id);
  }

  /**
   * 获取今日汇总
   */
  getTodaySummary(familyId: string): Observable<DailySummary> {
    return this.storageService.getTodaySummary(familyId);
  }
}

