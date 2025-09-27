import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// 定义设置的localStorage键名
const REMINDER_REPEAT_KEY = 'waterBuddy_reminderRepeat';

@Component({
  selector: 'app-reminder-repeat',
  imports: [FormsModule, CommonModule],
  template: `
    <div class="bg-white rounded-lg p-4 shadow-sm">
      <h3 class="text-lg font-medium text-gray-800 mb-4">提醒重复设置</h3>
      
      <div class="mb-4">
        <label for="reminderRepeat" class="block text-sm font-medium text-gray-700 mb-1">
          自动关闭前重复次数
        </label>
        <input 
          type="range" 
          id="reminderRepeat" 
          min="1" 
          max="10" 
          step="1" 
          [(ngModel)]="repeatCount"
          (ngModelChange)="saveSettings()"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        >
        <div class="flex justify-between text-sm text-gray-500 mt-1">
          <span>1次</span>
          <span class="font-medium text-blue-600">{{ repeatCount }} 次</span>
          <span>10次</span>
        </div>
      </div>

      <div class="mt-4">
        <p class="text-sm text-gray-600 mb-2">快速选择</p>
        <div class="grid grid-cols-5 gap-2">
          <button 
            *ngFor="let count of repeatPresets" 
            (click)="setRepeatCount(count)"
            [ngClass]="{
              'bg-blue-100 text-blue-700': repeatCount === count,
              'bg-gray-100 text-gray-700': repeatCount !== count
            }"
            class="py-2 px-3 rounded-md text-sm font-medium text-center transition-colors"
          >
            {{ count }}次
          </button>
        </div>
      </div>

      <div class="mt-6 flex items-center">
        <label class="inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            [(ngModel)]="neverEnding"
            (change)="saveSettings()"
            class="sr-only peer"
          >
          <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span class="ml-3 text-sm font-medium text-gray-700">永不自动关闭提醒</span>
        </label>
      </div>

      <div *ngIf="neverEnding" class="mt-3 p-3 bg-green-50 rounded-md">
        <p class="text-sm text-gray-700">
          提醒将持续显示直到您手动关闭。
        </p>
      </div>
    </div>
  `,
  styles: [``]
})
export class ReminderRepeatComponent implements OnInit {
  repeatCount: number = 3; // 默认3次
  neverEnding: boolean = false;
  repeatPresets: number[] = [1, 2, 3, 5, 10];

  constructor() { }

  ngOnInit(): void {
    this.loadSettings();
  }

  setRepeatCount(count: number): void {
    this.repeatCount = count;
    this.neverEnding = false; // 选择具体次数时，取消永不关闭选项
    this.saveSettings();
  }

  // 从localStorage加载设置
  loadSettings(): void {
    try {
      const savedSettings = localStorage.getItem(REMINDER_REPEAT_KEY);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        this.repeatCount = settings.repeatCount || this.repeatCount;
        this.neverEnding = settings.neverEnding || this.neverEnding;
      }
    } catch (error) {
      console.error('加载提醒重复设置失败:', error);
    }
  }

  // 保存设置到localStorage
  saveSettings(): void {
    try {
      const settings = {
        repeatCount: this.repeatCount,
        neverEnding: this.neverEnding,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(REMINDER_REPEAT_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('保存提醒重复设置失败:', error);
    }
  }
}
