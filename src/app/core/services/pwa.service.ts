import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject, fromEvent, merge } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';
import { SwUpdate } from '@angular/service-worker';

/**
 * PWA 管理服务
 * 管理 PWA 安装提示、更新检测
 */
@Injectable({ providedIn: 'root' })
export class PWAService {
  private canInstallSubject = new BehaviorSubject<boolean>(false);
  private deferredPrompt: any = null;
  private isUpdateAvailableSubject = new BehaviorSubject<boolean>(false);
  
  /**
   * 检测是否可安装
   */
  canInstall$: Observable<boolean> = this.canInstallSubject.asObservable();

  /**
   * 检测是否有应用更新
   */
  isUpdateAvailable$: Observable<boolean> = this.isUpdateAvailableSubject.asObservable();

  constructor(
    @Inject(SwUpdate) private swUpdate: SwUpdate
  ) {
    this.initializePWA();
  }

  /**
   * 初始化 PWA 功能
   */
  private initializePWA(): void {
    // 监听 beforeinstallprompt 事件
    window.addEventListener('beforeinstallprompt', (e) => {
      // 阻止默认的安装提示
      e.preventDefault();
      // 保存事件，稍后可以触发
      this.deferredPrompt = e;
      // 更新可安装状态
      this.canInstallSubject.next(true);
    });

    // 监听应用安装完成事件
    window.addEventListener('appinstalled', () => {
      // 安装完成后，重置状态
      this.deferredPrompt = null;
      this.canInstallSubject.next(false);
      console.log('PWA 安装完成');
    });

    // 检查是否已在独立模式运行
    if (this.isStandalone()) {
      this.canInstallSubject.next(false);
    }

    // 监听 Service Worker 更新
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.pipe(
        filter(event => event.type === 'VERSION_READY')
      ).subscribe(() => {
        this.isUpdateAvailableSubject.next(true);
      });
    }
  }

  /**
   * 显示安装提示
   */
  promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return Promise.resolve(false);
    }

    return new Promise((resolve) => {
      // 显示安装提示
      this.deferredPrompt.prompt();
      
      // 等待用户响应
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('用户接受了安装提示');
          resolve(true);
        } else {
          console.log('用户拒绝了安装提示');
          resolve(false);
        }
        
        // 清除保存的事件
        this.deferredPrompt = null;
        this.canInstallSubject.next(false);
      });
    });
  }

  /**
   * 检测应用更新
   */
  checkForUpdates(): Observable<boolean> {
    if (!this.swUpdate.isEnabled) {
      return new Observable(observer => {
        observer.next(false);
        observer.complete();
      });
    }

    return new Observable(observer => {
      this.swUpdate.checkForUpdate().then(() => {
        // 检查是否有可用更新
        this.swUpdate.versionUpdates.pipe(
          filter(event => event.type === 'VERSION_READY'),
          take(1)
        ).subscribe(() => {
          this.isUpdateAvailableSubject.next(true);
          observer.next(true);
          observer.complete();
        });

        // 如果没有更新，立即完成
        setTimeout(() => {
          if (!this.isUpdateAvailableSubject.value) {
            observer.next(false);
            observer.complete();
          }
        }, 1000);
      }).catch(error => {
        console.error('检查更新失败:', error);
        observer.next(false);
        observer.complete();
      });
    });
  }

  /**
   * 激活应用更新
   */
  activateUpdate(): Promise<boolean> {
    if (!this.swUpdate.isEnabled || !this.isUpdateAvailableSubject.value) {
      return Promise.resolve(false);
    }

    return this.swUpdate.activateUpdate().then(() => {
      this.isUpdateAvailableSubject.next(false);
      // 重新加载页面以应用更新
      window.location.reload();
      return true;
    }).catch(error => {
      console.error('激活更新失败:', error);
      return false;
    });
  }

  /**
   * 是否在独立模式运行
   */
  isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true ||
           document.referrer.includes('android-app://');
  }

  /**
   * 获取 PWA 状态信息
   */
  getPWAStatus(): {
    isStandalone: boolean;
    canInstall: boolean;
    hasUpdate: boolean;
    isOnline: boolean;
  } {
    return {
      isStandalone: this.isStandalone(),
      canInstall: this.canInstallSubject.value,
      hasUpdate: this.isUpdateAvailableSubject.value,
      isOnline: navigator.onLine
    };
  }
}

