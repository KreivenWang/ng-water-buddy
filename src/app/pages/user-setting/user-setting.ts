import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DailyCupComponent } from '../../components/daily-cup/daily-cup';
import { ReminderFrequencyComponent } from '../../components/reminder-frequency/reminder-frequency';
import { ReminderRepeatComponent } from '../../components/reminder-repeat/reminder-repeat';
import { ReminderNotificationComponent } from '../../components/reminder-notification/reminder-notification';
import { SettingsService } from '../../services/settings.service';
import { DEFAULT_ALL_SETTINGS } from '../../models/user-setting';

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
    this.settingsService.saveAllSettings(DEFAULT_ALL_SETTINGS);
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
