import { Component, OnInit, inject, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { TimerService } from '../../services/timer.service';
import { AudioService } from '../../services/audio.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReminderModalComponent } from './reminder-modal/reminder-modal';
import { Subscription, interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { DailyRecordService } from 'src/app/services/daily-record.service';

@Component({
  selector: 'app-reminder',
  imports: [FormsModule, CommonModule, ReminderModalComponent],
  templateUrl: './reminder.html',
  styleUrl: './reminder.css'
})
export class ReminderComponent implements OnInit, OnDestroy {
  protected countdownTime = '0分0秒';
  protected reminderProgress = 0;
  protected showModal = false;

  @Output() waterRecorded = new EventEmitter<void>();

  private settingsService = inject(SettingsService);
  private timerService = inject(TimerService);
  private audioService = inject(AudioService);
  private dailyRecordService = inject(DailyRecordService);
  private subscriptions: Subscription = new Subscription();
  private soundRepeatSubscription: Subscription | null = null;

  // 获取设置，如果没有则使用默认值
  settings = this.settingsService.loadAllSettings() || {
    notificationSettings: {
      reminderEnabled: true,
      soundEnabled: true,
    },
    reminderFrequency: {
      frequencyMinutes: 30,
    },
    reminderRepeat: {
      repeatCount: 5,
    },
    dailyCup: {
      dailyCups: 8,
    },
  };

  ngOnInit(): void {
    this.initialize();
  }

  ngOnDestroy(): void {
    // 清理所有订阅
    this.subscriptions.unsubscribe();
    // 清理声音重复订阅
    this.clearSoundRepeat();
  }

  private initialize(): void {
    // 从设置中获取提醒频率（分钟），默认为30分钟
    const frequencyMinutes = this.settings.reminderFrequency?.frequencyMinutes || 30;

    // 初始化计时器服务
    this.timerService.initialize(frequencyMinutes);

    // 订阅倒计时更新
    this.subscriptions.add(
      this.timerService.countdownUpdate$.subscribe((update) => {
        this.countdownTime = update.timeString;
        this.reminderProgress = update.progress;
      })
    );

    // 订阅计时完成事件
    this.subscriptions.add(
      this.timerService.timerComplete$.subscribe(() => {
        this.showReminder();
      })
    );

    // 启动计时器
    this.timerService.start();
  }

  private showReminder(): void {
    // 检查提醒设置是否启用
    if (this.settings.notificationSettings?.reminderEnabled) {
      // 显示弹窗
      this.showModal = true;

      // 如果启用了声音，播放提示音
      if (this.settings.notificationSettings?.soundEnabled) {
        // 延迟一点播放声音，确保在用户交互上下文中
        setTimeout(() => this.playSound(), 100);
      }
    }
  }

  playSound(): void {
    try {
      // 清除之前可能存在的重复订阅
      this.clearSoundRepeat();

      // 播放第一次提醒音
      this.audioService.playReminderSound();

      // 获取重复次数设置，默认为5次
      const repeatCount = this.settings.reminderRepeat?.repeatCount || 5;

      // 如果需要重复播放（重复次数大于1）
      if (repeatCount > 1) {
        // 使用RxJS interval创建重复流，每隔2分钟触发一次，总共触发repeatCount-1次
        this.soundRepeatSubscription = interval(2 * 60000)
          .pipe(take(repeatCount - 1))
          .subscribe(() => {
            // 播放提醒音
            this.audioService.playReminderSound();
          });

        // 将这个订阅添加到主订阅列表中
        this.subscriptions.add(this.soundRepeatSubscription);
      }
    } catch (error) {
      console.error('播放声音失败:', error);
      // 发生错误时清除重复订阅
      this.clearSoundRepeat();
    }
  }

  /**
   * 清除声音重复订阅
   */
  private clearSoundRepeat(): void {
    if (this.soundRepeatSubscription) {
      this.soundRepeatSubscription.unsubscribe();
      this.soundRepeatSubscription = null;
    }
  }

  closeModal(hasDrunk: boolean): void {
    // 关闭弹窗
    this.showModal = false;

    // 清除声音重复订阅
    this.clearSoundRepeat();

    this.audioService.stopAllSounds();

    // 如果用户喝了水，记录饮水并通知其他组件
    if (hasDrunk) {
      console.log('用户喝了一杯水');
      // 播放确认声音
      this.audioService.playConfirmationSound();
      // 记录饮水
      const success = this.dailyRecordService.record();
      if (success) {
        // 发射事件通知其他组件更新
        this.waterRecorded.emit();
        console.log('已通知其他组件更新数据');
      }
    }

    // 重置并重新启动计时器
    this.timerService.reset();
    this.timerService.start();
  }
}
