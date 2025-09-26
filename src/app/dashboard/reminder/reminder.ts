import { Component } from '@angular/core';

@Component({
  selector: 'app-reminder',
  standalone: false,
  template: `
    <div class="reminder bg-white p-4 rounded-lg shadow-sm">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div>
          <h3 class="font-medium text-gray-800">下次提醒</h3>
          <p class="text-sm text-gray-500">还有 {{ countdownTime }}</p>
        </div>
      </div>
      <div class="relative h-2 bg-gray-200 rounded-full">
        <div 
          class="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-red-400 rounded-full transition-all duration-300"
          [style.width.%]="reminderProgress"
        ></div>
      </div>
    </div>
  `,
  styles: [`
    .reminder {
      margin: 1rem 0;
    }
  `]
})
export class ReminderComponent {
  protected countdownTime = '9分53秒';
  protected reminderProgress = 60; // 模拟的进度百分比
}
