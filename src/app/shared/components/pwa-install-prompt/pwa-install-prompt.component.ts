import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PWAService } from '../../../core/services/pwa.service';

/**
 * PWA 安装提示组件
 * 在用户首次访问时显示安装提示
 */
@Component({
  selector: 'app-pwa-install-prompt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pwa-install-prompt.component.html',
  styleUrls: ['./pwa-install-prompt.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PwaInstallPromptComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private pwaService = inject(PWAService);

  canInstall$: Observable<boolean>;
  isInstalling = false;

  constructor() {
    this.canInstall$ = this.pwaService.canInstall$;
  }

  ngOnInit(): void {
    // 检查是否是首次访问（可以结合 localStorage 实现）
    this.checkFirstVisit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 检查是否是首次访问
   */
  private checkFirstVisit(): void {
    const hasVisited = localStorage.getItem('pwa-has-visited');
    if (!hasVisited) {
      // 标记为已访问
      localStorage.setItem('pwa-has-visited', 'true');
    }
  }

  /**
   * 触发安装提示
   */
  async onInstallClick(): Promise<void> {
    if (this.isInstalling) return;

    this.isInstalling = true;
    
    try {
      const installed = await this.pwaService.promptInstall();
      if (installed) {
        // 安装成功，可以显示成功提示
        console.log('PWA 安装成功');
      }
    } catch (error) {
      console.error('安装失败:', error);
    } finally {
      this.isInstalling = false;
    }
  }

  /**
   * 稍后提醒
   */
  onLaterClick(): void {
    // 设置稍后提醒的时间戳（比如 1 天后）
    const remindLater = Date.now() + (24 * 60 * 60 * 1000);
    localStorage.setItem('pwa-remind-later', remindLater.toString());
  }

  /**
   * 关闭提示
   */
  onDismissClick(): void {
    // 永久关闭提示
    localStorage.setItem('pwa-dismissed', 'true');
  }
}
