import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DailyCupComponent } from '../../components/daily-cup/daily-cup';
import { ReminderFrequencyComponent } from '../../components/reminder-frequency/reminder-frequency';
import { ReminderRepeatComponent } from '../../components/reminder-repeat/reminder-repeat';
import { ReminderNotificationComponent } from '../../components/reminder-notification/reminder-notification';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-user-setting',
  imports: [
    CommonModule, 
    FormsModule, 
    DailyCupComponent, 
    ReminderFrequencyComponent, 
    ReminderRepeatComponent,
    ReminderNotificationComponent
  ],
  template: `
    <div class="max-w-3xl mx-auto p-4">
      <header class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">目标与提醒设置</h1>
        <p class="text-gray-600 mt-1">
          设置您的每日饮水目标和提醒偏好，帮助您养成良好的饮水习惯。
        </p>
      </header>

      <main class="space-y-6">
        <!-- 每日饮水目标设置 -->
        <app-daily-cup #dailyCupComponent></app-daily-cup>

        <!-- 提醒频率设置 -->
        <app-reminder-frequency #reminderFrequencyComponent></app-reminder-frequency>

        <!-- 提醒重复设置 -->
        <app-reminder-repeat #reminderRepeatComponent></app-reminder-repeat>

        <!-- 通知设置 -->
        <app-reminder-setting #reminderNotificationComponent></app-reminder-setting>
      </main>

      <footer class="mt-8">
        <button 
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
          (click)="saveAllSettings()"
        >
          保存所有设置
        </button>
        <p class="text-xs text-gray-500 text-center mt-3">
          设置将在您点击保存按钮后生效。根据您的生活习惯定期调整这些设置以获得最佳体验。
        </p>
      </footer>
    </div>
  `,
  styles: [``]
})
export class UserSettingComponent implements OnInit {
  @ViewChild('dailyCupComponent') dailyCupComponent: any;
  @ViewChild('reminderFrequencyComponent') reminderFrequencyComponent: any;
  @ViewChild('reminderRepeatComponent') reminderRepeatComponent: any;
  @ViewChild('reminderNotificationComponent') reminderNotificationComponent: any;

  constructor(private settingsService: SettingsService) { }

  ngOnInit(): void {
    // 各组件会在自己的ngOnInit中加载设置
    console.log('用户设置页面初始化');
  }

  // 保存所有设置
  saveAllSettings(): void {
    try {
      // 从各个组件收集设置
      const allSettings = {
        dailyCup: {
          dailyCups: this.dailyCupComponent?.dailyCups || 8,
          cupSize: this.dailyCupComponent?.cupSize || 250
        },
        reminderFrequency: {
          frequencyMinutes: this.reminderFrequencyComponent?.frequencyMinutes || 30
        },
        reminderRepeat: {
          repeatCount: this.reminderRepeatComponent?.repeatCount || 8,
          neverEnding: this.reminderRepeatComponent?.neverEnding || false
        },
        notificationSettings: {
          reminderEnabled: this.reminderNotificationComponent?.reminderEnabled ?? true,
          soundEnabled: this.reminderNotificationComponent?.soundEnabled ?? true
        },
        lastSaved: new Date().toISOString()
      };

      // 使用服务保存设置
      this.settingsService.saveAllSettings(allSettings);
      
      console.log('所有设置已保存:', allSettings);
      alert('设置已成功保存！');
    } catch (error) {
      console.error('保存设置失败:', error);
      alert('保存设置时发生错误，请重试。');
    }
  }
}
