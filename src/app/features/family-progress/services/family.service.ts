import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FamilyMember } from '../../../models/family-member.interface';
import { StorageService } from '../../../core/services/storage.service';

/**
 * 家庭成员管理服务
 */
@Injectable({ providedIn: 'root' })
export class FamilyService {
  
  constructor(private storageService: StorageService) {}

  /**
   * 获取家庭成员列表
   */
  getMembers(familyId: string): Observable<FamilyMember[]> {
    return this.storageService.getMembers(familyId);
  }

  /**
   * 添加家庭成员
   */
  addMember(member: FamilyMember): Observable<FamilyMember> {
    return this.storageService.addMember(member);
  }

  /**
   * 更新家庭成员
   */
  updateMember(id: string, data: Partial<FamilyMember>): Observable<void> {
    return this.storageService.updateMember(id, data);
  }

  /**
   * 删除家庭成员
   */
  deleteMember(id: string): Observable<void> {
    return this.storageService.deleteMember(id);
  }
}

