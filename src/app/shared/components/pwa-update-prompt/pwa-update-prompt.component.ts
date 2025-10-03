import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PWAService } from '../../../core/services/pwa.service';

/**
 * PWA 更新提示组件
 * 检测到应用更新时显示更新提示
 */
@Component({
  selector: 'app-pwa-update-prompt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pwa-update-prompt.component.html',
  styleUrls: ['./pwa-update-prompt.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PwaUpdatePromptComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private pwaService = inject(PWAService);

  isUpdateAvailable$: Observable<boolean>;
  isUpdating = false;

  constructor() {
    this.isUpdateAvailable$ = this.pwaService.isUpdateAvailable$;
  }

  ngOnInit(): void {
    // 自动检查更新
    this.checkForUpdates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 检查应用更新
   */
  private checkForUpdates(): void {
    this.pwaService.checkForUpdates()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdate => {
        if (hasUpdate) {
          console.log('检测到应用更新');
        }
      });
  }

  /**
   * 立即更新应用
   */
  async onUpdateNowClick(): Promise<void> {
    if (this.isUpdating) return;

    this.isUpdating = true;
    
    try {
      const updated = await this.pwaService.activateUpdate();
      if (updated) {
        console.log('应用更新成功');
      }
    } catch (error) {
      console.error('更新失败:', error);
      this.isUpdating = false;
    }
  }

  /**
   * 稍后更新
   */
  onUpdateLaterClick(): void {
    // 设置稍后提醒的时间戳（比如 30 分钟后）
    const remindLater = Date.now() + (30 * 60 * 1000);
    localStorage.setItem('pwa-update-remind-later', remindLater.toString());
  }
}
