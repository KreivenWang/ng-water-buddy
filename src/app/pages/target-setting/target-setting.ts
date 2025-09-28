import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DailyCupComponent } from '../../components/daily-cup/daily-cup';
import { ReminderFrequencyComponent } from '../../components/reminder-frequency/reminder-frequency';
import { ReminderRepeatComponent } from '../../components/reminder-repeat/reminder-repeat';
import { SettingsService } from '../../services/settings.service';
import {
  DEFAULT_DAILY_CUP,
  DEFAULT_NOTIFICATION_SETTINGS,
  DEFAULT_REMINDER_FREQUENCY,
  DEFAULT_REMINDER_REPEAT,
} from 'src/app/models/user-setting';

@Component({
  selector: 'app-target-setting',
  imports: [
    CommonModule,
    FormsModule,
    DailyCupComponent,
    ReminderFrequencyComponent,
    ReminderRepeatComponent,
  ],
  template: `
    <div class="max-w-3xl mx-auto p-4">
      <header class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">目标与提醒设置</h1>
        <p class="text-gray-600 mt-1">设置您的每日饮水目标和提醒偏好，帮助您养成良好的饮水习惯。</p>
      </header>

      <main class="space-y-6">
        <!-- 每日饮水目标设置 -->
        <app-daily-cup #dailyCupComponent></app-daily-cup>

        <!-- 提醒频率设置 -->
        <app-reminder-frequency #reminderFrequencyComponent></app-reminder-frequency>

        <!-- 提醒重复设置 -->
        <app-reminder-repeat #reminderRepeatComponent></app-reminder-repeat>
      </main>

      <footer class="mt-8">
        <button
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
          (click)="saveSettings()"
        >
          保存所有设置
        </button>
        <p class="text-xs text-gray-500 text-center mt-3">
          设置将自动保存并立即生效。根据您的生活习惯定期调整这些设置以获得最佳体验。
        </p>
      </footer>
    </div>
  `,
  styles: [``],
})
export class TargetSettingComponent implements OnInit {
  @ViewChild('dailyCupComponent') dailyCupComponent: any;
  @ViewChild('reminderFrequencyComponent') reminderFrequencyComponent: any;
  @ViewChild('reminderRepeatComponent') reminderRepeatComponent: any;

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.loadAllSettings();
  }

  // 保存所有设置
  saveSettings(): void {
    try {
      // 构建设置对象
      const allSettings = {
        dailyCup: {
          dailyCups: this.dailyCupComponent?.dailyCups || DEFAULT_DAILY_CUP.dailyCups,
          cupSize: this.dailyCupComponent?.cupSize || DEFAULT_DAILY_CUP.cupSize,
        },
        reminderFrequency: {
          frequencyMinutes:
            this.reminderFrequencyComponent?.frequencyMinutes || DEFAULT_REMINDER_FREQUENCY,
        },
        reminderRepeat: {
          repeatCount:
            this.reminderRepeatComponent?.repeatCount || DEFAULT_REMINDER_REPEAT.repeatCount,
          neverEnding:
            this.reminderRepeatComponent?.neverEnding || DEFAULT_REMINDER_REPEAT.neverEnding,
        },
        notificationSettings: {
          reminderEnabled: DEFAULT_NOTIFICATION_SETTINGS.reminderEnabled,
          soundEnabled: DEFAULT_NOTIFICATION_SETTINGS.soundEnabled,
        },
        lastSaved: new Date().toISOString(),
      };

      // 使用服务保存设置
      const success = this.settingsService.saveAllSettings(allSettings);

      if (success) {
        console.log('所有设置已保存:', allSettings);
        alert('设置已成功保存！');
      } else {
        alert('保存设置失败，请重试。');
      }
    } catch (error) {
      console.error('保存设置失败:', error);
      alert('保存设置时发生错误，请重试。');
    }
  }

  // 加载所有设置
  loadAllSettings(): void {
    try {
      const allSettings = this.settingsService.loadAllSettings();
      console.log('已加载保存的设置:', allSettings);

      // 各组件会在自己的ngOnInit中加载设置
      // 这里主要是记录日志，确认设置已加载
    } catch (error) {
      console.error('加载设置失败:', error);
    }
  }
}
