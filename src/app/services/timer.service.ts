import { Injectable, OnDestroy } from '@angular/core';
import { timer, Subject, Subscription, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimerService implements OnDestroy {
  private timerSubscription: Subscription | null = null;
  private totalSeconds: number = 0;
  private remainingSeconds: number = 0;
  private isRunning: boolean = false;
  private destroy$ = new Subject<void>();
  
  // 用于通知组件倒计时更新
  private countdownUpdateSubject = new Subject<{
    minutes: number;
    seconds: number;
    progress: number;
    timeString: string;
  }>();
  
  // 用于通知组件计时结束
  private timerCompleteSubject = new Subject<void>();
  
  // 可观察对象，供组件订阅
  countdownUpdate$: Observable<{
    minutes: number;
    seconds: number;
    progress: number;
    timeString: string;
  }> = this.countdownUpdateSubject.asObservable();
  
  timerComplete$: Observable<void> = this.timerCompleteSubject.asObservable();

  constructor() {}

  ngOnDestroy(): void {
    this.destroy();
  }

  /**
   * 初始化计时器
   * @param totalMinutes 总分钟数
   */
  initialize(totalMinutes: number): void {
    // 清理之前的订阅
    this.cleanup();
    
    // 设置总秒数和剩余秒数
    this.totalSeconds = totalMinutes * 60;
    this.remainingSeconds = this.totalSeconds;
    this.isRunning = false;
    
    // 立即发送一次初始状态
    this.notifyUpdate();
  }

  /**
   * 启动计时器
   */
  start(): void {
    if (this.isRunning || this.remainingSeconds <= 0) {
      return;
    }
    
    this.isRunning = true;
    
    // 使用RxJS timer创建每秒更新的流
    this.timerSubscription = timer(0, 1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // 第一次触发不减少秒数（除非是暂停后恢复）
        if (this.remainingSeconds > 0 && this.timerSubscription?.closed === false) {
          this.remainingSeconds--;
        }
        
        // 通知更新
        this.notifyUpdate();
        
        // 检查是否计时结束
        if (this.remainingSeconds <= 0) {
          this.completeTimer();
        }
      });
  }

  /**
   * 暂停计时器
   */
  pause(): void {
    if (!this.isRunning) {
      return;
    }
    
    this.isRunning = false;
    this.cleanup();
  }

  /**
   * 重置计时器
   */
  reset(): void {
    this.pause();
    this.remainingSeconds = this.totalSeconds;
    this.notifyUpdate();
  }

  /**
   * 立即完成当前计时
   */
  complete(): void {
    this.remainingSeconds = 0;
    this.completeTimer();
  }

  /**
   * 获取当前状态
   */
  getStatus(): {
    isRunning: boolean;
    remainingSeconds: number;
    totalSeconds: number;
    minutes: number;
    seconds: number;
    progress: number;
    timeString: string;
  } {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;
    const progress = (1 - this.remainingSeconds / this.totalSeconds) * 100;
    const timeString = `${minutes}分${seconds.toString().padStart(2, '0')}秒`;
    
    return {
      isRunning: this.isRunning,
      remainingSeconds: this.remainingSeconds,
      totalSeconds: this.totalSeconds,
      minutes,
      seconds,
      progress,
      timeString
    };
  }

  /**
   * 销毁服务
   */
  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.cleanup();
  }

  /**
   * 清理定时器订阅
   */
  private cleanup(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }

  /**
   * 通知组件倒计时更新
   */
  private notifyUpdate(): void {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;
    const progress = (1 - this.remainingSeconds / this.totalSeconds) * 100;
    const timeString = `${minutes}分${seconds.toString().padStart(2, '0')}秒`;
    
    this.countdownUpdateSubject.next({
      minutes,
      seconds,
      progress,
      timeString
    });
  }

  /**
   * 处理计时完成逻辑
   */
  private completeTimer(): void {
    this.isRunning = false;
    this.cleanup();
    this.timerCompleteSubject.next();
  }
}