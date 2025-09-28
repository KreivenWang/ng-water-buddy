import { Component, OnInit, ViewChild, inject } from '@angular/core';
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
  templateUrl: './target-setting.html',
  styleUrl: './target-setting.css'
})
export class TargetSettingComponent implements OnInit {
  @ViewChild('dailyCupComponent') dailyCupComponent!: DailyCupComponent;
  @ViewChild('reminderFrequencyComponent') reminderFrequencyComponent!: ReminderFrequencyComponent;
  @ViewChild('reminderRepeatComponent') reminderRepeatComponent!: ReminderRepeatComponent;

  private settingsService = inject(SettingsService);

  constructor() { }

  ngOnInit(): void {
    this.loadSettings();
  }

  private loadSettings(): void {
    try {
      const allSettings = this.settingsService.loadAllSettings();
      if (!allSettings) {
        // 如果没有设置，使用默认值
        this.initializeDefaultSettings();
      }
    } catch (error) {
      console.error('加载设置失败:', error);
      this.initializeDefaultSettings();
    }
  }

  private initializeDefaultSettings(): void {
    const defaultSettings = {
      dailyCup: DEFAULT_DAILY_CUP,
      notificationSettings: DEFAULT_NOTIFICATION_SETTINGS,
      reminderFrequency: DEFAULT_REMINDER_FREQUENCY,
      reminderRepeat: DEFAULT_REMINDER_REPEAT,
    };
    this.settingsService.saveAllSettings(defaultSettings);
  }

  saveSettings(): void {
    try {
      // 这里可以添加保存逻辑
      console.log('设置已保存');
      alert('设置已保存！');
    } catch (error) {
      console.error('保存设置失败:', error);
    }
  }
}
