import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { DailySummary } from '../../../models/daily-summary.interface';
import { FamilyMember } from '../../../models/family-member.interface';
import { FamilyService } from '../services/family.service';
import { WaterRecordService } from '../services/water-record.service';

/**
 * 家庭仪表盘容器组件
 * 管理家庭进度的业务逻辑
 */
@Component({
  selector: 'app-family-dashboard',
  templateUrl: './family-dashboard.component.html',
  styleUrls: ['./family-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FamilyDashboardComponent implements OnInit {
  dailySummary$!: Observable<DailySummary>;
  members$!: Observable<FamilyMember[]>;

  constructor(
    private familyService: FamilyService,
    private waterRecordService: WaterRecordService
  ) {}

  ngOnInit(): void {
    // TODO: 实现加载数据逻辑
  }

  onWaterAdded(data: { memberId: string; amount: number }): void {
    // TODO: 实现添加喝水记录逻辑
  }

  onMemberEdit(member: FamilyMember): void {
    // TODO: 实现编辑成员逻辑
  }

  onMemberDelete(member: FamilyMember): void {
    // TODO: 实现删除成员逻辑
  }
}

