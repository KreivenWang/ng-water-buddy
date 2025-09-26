import { Component } from '@angular/core';

@Component({
  selector: 'app-progress',
  standalone: false,
  template: `
    <div class="progress bg-white p-6 rounded-lg shadow-sm">
      <h2 class="text-3xl font-bold text-blue-600 text-center mb-2">{{ currentAmount }}/{{ totalAmount }}</h2>
      <p class="text-gray-500 text-center mb-4">今日进度</p>
      <div class="relative h-2 bg-gray-200 rounded-full mb-2">
        <div 
          class="absolute top-0 left-0 h-full bg-blue-400 rounded-full transition-all duration-300"
          [style.width.%]="progressPercentage"
        ></div>
      </div>
      <div class="flex justify-between text-sm text-gray-500">
        <span>已完成 {{ completedPercentage }}%</span>
        <span>总计 {{ totalMl }}ml</span>
      </div>
    </div>
  `,
  styles: [`
    .progress {
      margin: 1rem 0;
    }
  `]
})
export class ProgressComponent {
  protected currentAmount = 0;
  protected totalAmount = 8;
  protected completedPercentage = 0;
  protected totalMl = 0;
  protected get progressPercentage(): number {
    return (this.currentAmount / this.totalAmount) * 100;
  }
}
