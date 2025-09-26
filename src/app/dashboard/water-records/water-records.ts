import { Component } from '@angular/core';

@Component({
  selector: 'app-water-records',
  standalone: false,
  template: `
    <div class="water-records bg-white p-6 rounded-lg shadow-sm">
      <h3 class="text-lg font-bold text-gray-800 mb-4 text-center">今日饮水记录</h3>
      <div class="grid grid-cols-4 gap-4">
        <div *ngFor="let record of records" class="flex justify-center">
          <button 
            class="cup w-16 h-20 border-2 rounded-t-2xl relative flex flex-col items-center justify-end pb-2 hover:bg-blue-50 transition-colors"
            [class.border-blue-400]="record.completed"
            [class.border-gray-300]="!record.completed"
            (click)="toggleRecord(record.id)"
          >
            <span class="text-sm font-medium text-gray-600">{{ record.id }}</span>
            <svg *ngIf="record.completed" class="absolute top-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#3b82f6" stroke="none">
              <path d="M20 6 9 17l-5-5" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .water-records {
      margin: 1rem 0;
    }
    .cup {
      cursor: pointer;
    }
  `]
})
export class WaterRecordsComponent {
  protected records = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    completed: false
  }));

  protected toggleRecord(id: number): void {
    const record = this.records.find(r => r.id === id);
    if (record) {
      record.completed = !record.completed;
    }
  }
}
