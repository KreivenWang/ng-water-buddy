import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-daily-cup',
  standalone: false,
  template: `
    <div class="bg-white rounded-lg p-4 shadow-sm">
      <h3 class="text-lg font-medium text-gray-800 mb-4">每日饮水目标</h3>
      
      <div class="mb-4">
        <label for="dailyCups" class="block text-sm font-medium text-gray-700 mb-1">目标杯数</label>
        <input 
          type="range" 
          id="dailyCups" 
          min="1" 
          max="20" 
          step="1" 
          [(ngModel)]="dailyCups"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        >
        <div class="flex justify-between text-sm text-gray-500 mt-1">
          <span>1</span>
          <span class="font-medium text-blue-600">{{ dailyCups }} 杯</span>
          <span>20</span>
        </div>
      </div>

      <div class="flex items-center justify-between bg-blue-50 p-3 rounded-md">
        <span class="text-sm text-gray-700">总计饮水量</span>
        <span class="text-xl font-bold text-blue-600">{{ totalLiters.toFixed(1) }} L</span>
      </div>

      <div class="mt-4 grid grid-cols-3 gap-2">
        <button 
          *ngFor="let cup of quickCups" 
          (click)="setCups(cup)"
          [ngClass]="{
            'bg-blue-100 text-blue-700': dailyCups === cup,
            'bg-gray-100 text-gray-700': dailyCups !== cup
          }"
          class="py-2 px-3 rounded-md text-sm font-medium transition-colors"
        >
          {{ cup }} 杯
        </button>
      </div>
    </div>
  `,
  styles: [``]
})
export class DailyCup implements OnInit {
  dailyCups: number = 8;
  cupSize: number = 250; // 默认杯子大小，单位：毫升
  quickCups: number[] = [6, 8, 10];

  constructor() { }

  ngOnInit(): void {}

  get totalLiters(): number {
    return (this.dailyCups * this.cupSize) / 1000;
  }

  setCups(cups: number): void {
    this.dailyCups = cups;
  }
}
