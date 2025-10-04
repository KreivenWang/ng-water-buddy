import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { DailySummary } from '../../../models/daily-summary.interface';
import { FamilyMember } from '../../../models/family-member.interface';
import { WaterRecord } from '../../../models/water-record.interface';
import { User, ViewMode } from '../../../models/user.interface';
import { FamilyService } from '../services/family.service';
import { WaterRecordService } from '../services/water-record.service';
import { AuthService } from '../../../core/services/auth.service';
import { ViewModeService } from '../services/view-mode.service';

/**
 * 家庭仪表盘容器组件
 * 
 * 职责：
 * - 显示个人视图和家庭视图的切换
 * - 管理用户认证状态和权限控制
 * - 协调子组件的数据流和交互
 * 
 * [注意] 成员的增删改功能在 Settings 页面实现
 */
@Component({
  selector: 'app-family-dashboard',
  templateUrl: './family-dashboard.component.html',
  styleUrls: ['./family-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FamilyDashboardComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  
  // [关键点] 使用默认家庭 ID（LocalStorage 适配器已初始化）
  private readonly DEFAULT_FAMILY_ID = 'default-family-001';
  
  // [关键点] 刷新触发器，用于重新加载数据
  private refreshTrigger$ = new BehaviorSubject<void>(undefined);
  
  // 今日汇总数据
  dailySummary$: Observable<DailySummary>;
  
  // 家庭成员列表
  members$: Observable<FamilyMember[]>;
  
  // 加载状态
  isLoading$ = new BehaviorSubject<boolean>(false);

  // [关键点] 注入认证和视图模式服务
  constructor(
    private familyService: FamilyService,
    private waterRecordService: WaterRecordService,
    private authService: AuthService,
    private viewModeService: ViewModeService
  ) {
    // [关键点] 使用 switchMap 实现数据刷新机制
    this.dailySummary$ = this.refreshTrigger$.pipe(
      switchMap(() => this.waterRecordService.getTodaySummary(this.DEFAULT_FAMILY_ID))
    );

    this.members$ = this.refreshTrigger$.pipe(
      switchMap(() => this.familyService.getMembers(this.DEFAULT_FAMILY_ID))
    );
  }

  ngOnInit(): void {
    // [关键点] 组件初始化时自动加载数据
    this.loadData();
  }

  /**
   * 加载数据
   */
  private loadData(): void {
    this.refreshTrigger$.next();
  }

  /**
   * 刷新数据
   * [公开方法] 供子组件或模板调用
   */
  refresh(): void {
    this.loadData();
  }

  // ========== 视图模式相关方法 ==========

  /**
   * 获取当前视图模式
   */
  get currentViewMode(): ViewMode {
    return this.viewModeService.getCurrentMode();
  }

  /**
   * 是否为个人视图
   */
  get isPersonalView(): boolean {
    return this.viewModeService.isPersonalView();
  }

  /**
   * 是否为家庭视图
   */
  get isFamilyView(): boolean {
    return this.viewModeService.isFamilyView();
  }

  /**
   * 切换到个人视图
   */
  switchToPersonalView(): void {
    this.viewModeService.switchToPersonalView();
  }

  /**
   * 切换到家庭视图
   */
  switchToFamilyView(): void {
    this.viewModeService.switchToFamilyView();
  }

  // ========== 用户认证相关方法 ==========

  /**
   * 获取当前用户
   */
  get currentUser(): User | null {
    return this.authService.currentUser();
  }

  /**
   * 是否已登录
   */
  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  /**
   * 获取当前成员ID
   */
  get currentMemberId(): string | null {
    return this.authService.currentMemberId();
  }

  /**
   * 检查是否可以修改指定成员
   */
  canModifyMember(memberId: string): boolean {
    return this.authService.canModifyMember(memberId);
  }

  /**
   * 处理添加喝水记录
   * @param data 成员ID和水量
   */
  onWaterAdded(data: { memberId: string; amount: number }): void {
    const record: WaterRecord = {
      id: '', // LocalStorage 适配器会自动生成
      memberId: data.memberId,
      amount: data.amount,
      recordedAt: new Date(),
      synced: false
    };

    this.isLoading$.next(true);

    this.waterRecordService.addRecord(record)
      .pipe(
        tap(() => {
          // [用户反馈] 添加成功后刷新数据
          this.refresh();
        }),
        tap(() => this.isLoading$.next(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          console.log('喝水记录添加成功', data);
        },
        error: (error) => {
          console.error('添加喝水记录失败', error);
          this.isLoading$.next(false);
        }
      });
  }

  /**
   * 处理删除记录
   * @param recordId 记录ID
   */
  onRecordDelete(recordId: string): void {
    // [确认对话框] 实际应用中应添加确认对话框
    if (!confirm('确定要删除这条记录吗？')) {
      return;
    }

    this.isLoading$.next(true);

    this.waterRecordService.deleteRecord(recordId)
      .pipe(
        tap(() => this.refresh()),
        tap(() => this.isLoading$.next(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          console.log('记录删除成功', recordId);
        },
        error: (error) => {
          console.error('删除记录失败', error);
          this.isLoading$.next(false);
        }
      });
  }

  /**
   * 处理成员点击
   * [关键点] 当前暂不实现，预留接口
   */
  onMemberClick(member: FamilyMember): void {
    console.log('成员点击', member);
    // TODO: 未来可实现跳转到成员详情页
  }

  /**
   * 跳转到登录页面
   */
  goToLogin(): void {
    // TODO: 实现登录页面导航
    console.log('跳转到登录页面');
  }
}
