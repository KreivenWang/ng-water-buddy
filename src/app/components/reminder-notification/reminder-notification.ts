import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-reminder-setting',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reminder-notification.html',
  styleUrl: './reminder-notification.css'
})
export class ReminderNotificationComponent implements OnInit {
  reminderEnabled: boolean = true;
  soundEnabled: boolean = true;
  
  private settingsService = inject(SettingsService);

  constructor() { }

  ngOnInit(): void {
    this.loadSettings();
  }

  // 从服务加载设置
  loadSettings(): void {
    try {
      const allSettings = this.settingsService.loadAllSettings();
      this.reminderEnabled = allSettings.notificationSettings?.reminderEnabled ?? this.reminderEnabled;
      this.soundEnabled = allSettings.notificationSettings?.soundEnabled ?? this.soundEnabled;
    } catch (error) {
      console.error('加载通知设置失败:', error);
    }
  }

  // 保存设置
  saveSettings(): void {
    try {
      const allSettings = this.settingsService.loadAllSettings();
      allSettings.notificationSettings = {
        reminderEnabled: this.reminderEnabled,
        soundEnabled: this.soundEnabled
      };
      this.settingsService.saveAllSettings(allSettings).subscribe({
        next: (success) => {
          if (success) {
            console.log('通知设置已保存');
          } else {
            console.error('保存通知设置失败');
          }
        },
        error: (error) => {
          console.error('保存通知设置失败:', error);
        }
      });
    } catch (error) {
      console.error('保存通知设置失败:', error);
    }
  }
}
