import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-daily-cup',
  imports: [FormsModule, CommonModule],
  templateUrl: './daily-cup.html',
  styleUrl: './daily-cup.css'
})
export class DailyCupComponent implements OnInit {
  dailyCups: number = 8;
  cupSize: number = 250; // 默认杯子大小，单位：毫升
  quickCups: number[] = [6, 8, 10];
  
  private settingsService = inject(SettingsService);

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
      const allSettings = this.settingsService.loadAllSettings();
      this.dailyCups = allSettings.dailyCup.dailyCups || this.dailyCups;
      this.cupSize = allSettings.dailyCup.cupSize || this.cupSize;
    } catch (error) {
      console.error('加载每日饮水目标设置失败:', error);
    }
  }
}
