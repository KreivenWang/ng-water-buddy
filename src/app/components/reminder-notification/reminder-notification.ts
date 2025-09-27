import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../services/settings.service';
@Component({
  selector: 'app-reminder-setting',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="notification-settings-container">
      <h2 class="notification-title">
        <span class="notification-icon">🔔</span>
        通知设置
      </h2>
      
      <div class="setting-item">
        <div class="setting-label">
          <div class="setting-title">开启提醒</div>
          <div class="setting-description">定时提醒您喝水</div>
        </div>
        <label class="toggle-switch">
          <input 
            type="checkbox" 
            [(ngModel)]="reminderEnabled"
            (change)="saveSettings()"
          />
          <span class="toggle-slider"></span>
        </label>
      </div>
      
      <div class="setting-item">
        <div class="setting-label">
          <div class="setting-title">提醒声音</div>
          <div class="setting-description">播放提醒音效</div>
        </div>
        <label class="toggle-switch">
          <input 
            type="checkbox" 
            [(ngModel)]="soundEnabled"
            (change)="saveSettings()"
          />
          <span class="toggle-slider"></span>
        </label>
      </div>
    </div>
  `,
  styles: [`
    .notification-settings-container {
      background-color: #ffffff;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    .notification-title {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #333333;
    }
    
    .notification-icon {
      margin-right: 8px;
    }
    
    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .setting-item:last-child {
      border-bottom: none;
    }
    
    .setting-label {
      flex: 1;
    }
    
    .setting-title {
      font-size: 16px;
      font-weight: 500;
      color: #333333;
      margin-bottom: 4px;
    }
    
    .setting-description {
      font-size: 14px;
      color: #666666;
    }
    
    /* Toggle Switch Styles */
    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 24px;
    }
    
    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    
    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #e0e0e0;
      transition: .4s;
      border-radius: 24px;
    }
    
    .toggle-slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
    
    input:checked + .toggle-slider {
      background-color: #3b82f6;
    }
    
    input:checked + .toggle-slider:before {
      transform: translateX(26px);
    }
  `]
})
export class ReminderNotificationComponent implements OnInit {
  reminderEnabled: boolean = true; // 默认开启提醒
  soundEnabled: boolean = true; // 默认开启声音
  
  private settingsService = inject(SettingsService);

  constructor() { }

  ngOnInit(): void {
    this.loadSettings();
  }

  // 从服务加载设置
  loadSettings(): void {
    try {
      const settings = this.settingsService.loadNotificationSettings();
      this.reminderEnabled = settings.reminderEnabled !== undefined ? settings.reminderEnabled : this.reminderEnabled;
      this.soundEnabled = settings.soundEnabled !== undefined ? settings.soundEnabled : this.soundEnabled;
    } catch (error) {
      console.error('加载通知设置失败:', error);
    }
  }

  // 保存设置到服务
  saveSettings(): void {
    try {
      const settings = {
        reminderEnabled: this.reminderEnabled,
        soundEnabled: this.soundEnabled
      };
      this.settingsService.saveNotificationSettings(settings);
    } catch (error) {
      console.error('保存通知设置失败:', error);
    }
  }
}
