import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { TimerService } from '../../services/timer.service';
import { AudioService } from '../../services/audio.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReminderModalComponent } from './reminder-modal/reminder-modal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reminder',
  imports: [FormsModule, CommonModule, ReminderModalComponent],
  template: `
    <div class="reminder bg-white p-4 rounded-lg shadow-sm">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f97316"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div>
          <h3 class="font-medium text-gray-800">下次提醒</h3>
          <p class="text-sm text-gray-500">还有 {{ countdownTime }}</p>
        </div>
      </div>
      <div class="relative h-2 bg-gray-200 rounded-full">
        <div
          class="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-red-400 rounded-full transition-all duration-300"
          [style.width.%]="reminderProgress"
        ></div>
      </div>
    </div>

    <!-- 使用提醒弹窗组件 -->
    <app-reminder-modal
      [visible]="showModal"
      [soundEnabled]="settings.notificationSettings?.soundEnabled || false"
      (playSound)="playSound()"
      (close)="closeModal($event)"
    />
  `,
  styles: [
    `
      .reminder {
        margin: 1rem 0;
      }
    `,
  ],
})
export class ReminderComponent implements OnInit, OnDestroy {
  protected countdownTime = '0分0秒';
  protected reminderProgress = 0;
  protected showModal = false;

  private settingsService = inject(SettingsService);
  private timerService = inject(TimerService);
  private audioService = inject(AudioService);
  private subscriptions: Subscription = new Subscription();

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
      // 使用音频服务播放提醒音
      this.audioService.playReminderSound();
    } catch (error) {
      console.error('播放声音失败:', error);
    }
  }

  closeModal(hasDrunk: boolean): void {
    // 关闭弹窗
    this.showModal = false;

    // 如果用户喝了水，可以在这里添加相应的逻辑
    if (hasDrunk) {
      console.log('用户喝了一杯水');
      // 播放确认声音
      this.audioService.playConfirmationSound();
      // 这里可以添加记录饮水的逻辑
    }

    // 重置并重新启动计时器
    this.timerService.reset();
    this.timerService.start();
  }
}
