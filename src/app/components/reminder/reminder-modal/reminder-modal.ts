import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reminder-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- 提醒弹窗 -->
    <div *ngIf="visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div class="flex flex-col items-center text-center">
          <div class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">该喝水啦！💧</h2>
          <p class="text-gray-600 mb-6">为了健康，记得及时补充水分哦</p>
          
          <!-- 声音控制按钮 -->
          <button 
            (click)="playSound.emit()"
            class="text-blue-500 hover:text-blue-700 mb-6"
            *ngIf="soundEnabled"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          </button>
          
          <p class="text-gray-700 mb-6">喝完一杯了吗？</p>
          
          <div class="flex gap-3 w-full">
            <button 
              (click)="closeModal(false)"
              class="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              还没有
            </button>
            <button 
              (click)="closeModal(true)"
              class="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              是的 ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ReminderModalComponent {
  @Input() visible: boolean = false;
  @Input() soundEnabled: boolean = true;
  
  @Output() playSound = new EventEmitter<void>();
  @Output() close = new EventEmitter<boolean>();
  
  closeModal(hasDrunk: boolean): void {
    this.close.emit(hasDrunk);
  }
}