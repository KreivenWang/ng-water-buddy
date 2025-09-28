import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-reminder-repeat',
  imports: [FormsModule, CommonModule],
  templateUrl: './reminder-repeat.html',
  styleUrl: './reminder-repeat.css'
})
export class ReminderRepeatComponent implements OnInit {
  repeatCount: number = 3; // 默认3次
  neverEnding: boolean = false;
  repeatPresets: number[] = [1, 2, 3, 5, 10];
  
  private settingsService = inject(SettingsService);

  constructor() { }

  ngOnInit(): void {
    this.loadSettings();
  }

  setRepeatCount(count: number): void {
    this.repeatCount = count;
    this.neverEnding = false; // 选择具体次数时，取消永不关闭选项
  }

  // 从服务加载设置
  loadSettings(): void {
    try {
      const allSettings = this.settingsService.loadAllSettings();
      this.repeatCount = allSettings.reminderRepeat.repeatCount || this.repeatCount;
      this.neverEnding = allSettings.reminderRepeat.neverEnding || this.neverEnding;
    } catch (error) {
      console.error('加载提醒重复设置失败:', error);
    }
  }
}
