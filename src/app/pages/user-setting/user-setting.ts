import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DailyCupComponent } from '../../components/daily-cup/daily-cup';
import { ReminderFrequencyComponent } from '../../components/reminder-frequency/reminder-frequency';
import { ReminderRepeatComponent } from '../../components/reminder-repeat/reminder-repeat';
import { ReminderNotificationComponent } from '../../components/reminder-notification/reminder-notification';
import { DEFAULT_ALL_SETTINGS, AllSettings } from '../../models/user-setting';
import { DataApiService } from '../../services/data-api.service';

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

  private dataApi = inject(DataApiService);

  constructor() { }

  ngOnInit(): void {
    this.loadSettings();
  }

  private loadSettings(): void {
    try {
      const allSettings = this.dataApi.getSettings();
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
    this.dataApi.saveSettings(DEFAULT_ALL_SETTINGS).subscribe({
      next: (success) => {
        if (success) {
          console.log('默认设置已初始化');
        } else {
          console.error('初始化默认设置失败');
        }
      },
      error: (error) => {
        console.error('初始化默认设置时发生错误:', error);
      }
    });
  }

  saveAllSettings(): void {
    try {
      // 收集所有组件的当前设置值
      const currentSettings: AllSettings = {
        dailyCup: {
          dailyCups: this.dailyCupComponent.dailyCups,
          cupSize: this.dailyCupComponent.cupSize
        },
        reminderFrequency: {
          frequencyMinutes: this.reminderFrequencyComponent.frequencyMinutes
        },
        reminderRepeat: {
          repeatCount: this.reminderRepeatComponent.repeatCount,
          neverEnding: this.reminderRepeatComponent.neverEnding
        },
        notificationSettings: {
          reminderEnabled: this.reminderNotificationComponent.reminderEnabled,
          soundEnabled: this.reminderNotificationComponent.soundEnabled
        }
      };

      // 通过设置服务保存到localStorage
      this.dataApi.saveSettings(currentSettings).subscribe({
        next: (success) => {
          if (success) {
            console.log('所有设置已保存:', currentSettings);
            alert('设置已保存！');
          } else {
            console.error('保存设置失败');
            alert('保存设置失败，请重试');
          }
        },
        error: (error) => {
          console.error('保存设置时发生错误:', error);
          alert('保存设置失败，请重试');
        }
      });
    } catch (error) {
      console.error('保存设置失败:', error);
      alert('保存设置失败，请重试');
    }
  }
}
