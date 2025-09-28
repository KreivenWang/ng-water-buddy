import { Component, OnInit, ViewChild, inject } from '@angular/core';
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
  templateUrl: './user-setting.html',
  styleUrl: './user-setting.css'
})
export class UserSettingComponent implements OnInit {
  @ViewChild('dailyCupComponent') dailyCupComponent!: DailyCupComponent;
  @ViewChild('reminderFrequencyComponent') reminderFrequencyComponent!: ReminderFrequencyComponent;
  @ViewChild('reminderRepeatComponent') reminderRepeatComponent!: ReminderRepeatComponent;
  @ViewChild('reminderNotificationComponent') reminderNotificationComponent!: ReminderNotificationComponent;

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
      dailyCup: {
        dailyCups: 8,
        cupSize: 250
      },
      notificationSettings: {
        reminderEnabled: true,
        soundEnabled: true
      },
      reminderFrequency: {
        frequencyMinutes: 30
      },
      reminderRepeat: {
        repeatCount: 3,
        neverEnding: false
      }
    };
    this.settingsService.saveAllSettings(defaultSettings);
  }

  saveAllSettings(): void {
    try {
      // 这里可以添加保存逻辑
      console.log('所有设置已保存');
      alert('设置已保存！');
    } catch (error) {
      console.error('保存设置失败:', error);
    }
  }
}
