import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataApiService } from '../../services/data-api.service';
import { DEFAULT_DAILY_CUP } from '../../models/user-setting';

@Component({
  selector: 'app-daily-cup',
  imports: [FormsModule, CommonModule],
  templateUrl: './daily-cup.html',
  styleUrl: './daily-cup.css'
})
export class DailyCupComponent implements OnInit {
  dailyCups: number = DEFAULT_DAILY_CUP.dailyCups;
  cupSize: number = DEFAULT_DAILY_CUP.cupSize;
  quickCups: number[] = [6, 8, 10];
  
  private dataApiService = inject(DataApiService);

  constructor() { }

  ngOnInit(): void {
    this.loadSettings();
  }

  get totalLiters(): number {
    return (this.dailyCups * this.cupSize) / 1000;
  }

  setCups(cups: number): void {
    this.dailyCups = cups;
  }

  // 从服务加载设置
  loadSettings(): void {
    try {
      const allSettings = this.dataApiService.getSettings();
      this.dailyCups = allSettings.dailyCup.dailyCups || DEFAULT_DAILY_CUP.dailyCups;
      this.cupSize = allSettings.dailyCup.cupSize || DEFAULT_DAILY_CUP.cupSize;
    } catch (error) {
      console.error('加载每日饮水目标设置失败:', error);
    }
  }
}
