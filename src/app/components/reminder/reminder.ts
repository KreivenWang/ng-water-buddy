import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReminderModalComponent } from './reminder-modal/reminder-modal';

@Component({
  selector: 'app-reminder',
  imports: [FormsModule, CommonModule, ReminderModalComponent],
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

    <!-- 使用提醒弹窗组件 -->
    <app-reminder-modal
      [visible]="showModal"
      [soundEnabled]="settings.notificationSettings?.soundEnabled || false"
      (playSound)="playSound()"
      (close)="closeModal($event)"
    />
  `,
  styles: [`
    .reminder {
      margin: 1rem 0;
    }
  `]
})export class ReminderComponent implements OnInit, OnDestroy {
  protected countdownTime = '0分0秒';
  protected reminderProgress = 100;
  protected showModal = false;
  
  private settingsService = inject(SettingsService);
  private timer: any = null;
  private totalSeconds: number = 0;
  private remainingSeconds: number = 0;
  private audioContext: AudioContext | null = null;
  
  // 获取设置，如果没有则使用默认值
  settings = this.settingsService.loadAllSettings() || {
    notificationSettings: {
      reminderEnabled: true,
      soundEnabled: true
    },
    reminderFrequency: {
      frequencyMinutes: 30
    },
    reminderRepeat: {
      repeatCount: 5
    },
    dailyCup: {
      dailyCups: 8
    }
  };

  ngOnInit(): void {
    this.initializeReminder();
  }

  ngOnDestroy(): void {
    // 清理定时器
    if (this.timer) {
      clearInterval(this.timer);
    }
    // 清理音频上下文
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  private initializeReminder(): void {
    // 从设置中获取提醒频率（分钟），默认为30分钟
    const frequencyMinutes = this.settings.reminderFrequency?.frequencyMinutes || 30;
    this.totalSeconds = frequencyMinutes * 60;
    this.remainingSeconds = this.totalSeconds;
    
    // 更新倒计时显示
    this.updateCountdown();
    
    // 设置定时器，每秒更新一次
    this.timer = setInterval(() => {
      this.remainingSeconds--;
      
      // 更新倒计时显示和进度条
      this.updateCountdown();
      
      // 检查是否达到提醒时间
      if (this.remainingSeconds <= 0) {
        this.showReminder();
      }
    }, 1000);
  }

  private updateCountdown(): void {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;
    
    // 格式化时间显示
    this.countdownTime = `${minutes}分${seconds.toString().padStart(2, '0')}秒`;
    
    // 计算并更新进度条
    this.reminderProgress = (this.remainingSeconds / this.totalSeconds) * 100;
  }

  private showReminder(): void {
    // 检查提醒设置是否启用
    if (this.settings.notificationSettings?.reminderEnabled) {
      // 显示弹窗
      this.showModal = true;
      
      // 如果启用了声音，播放提示音
      if (this.settings.notificationSettings?.soundEnabled) {
        // 延迟一点播放声音，确保在用户交互上下文中
        setTimeout(() => this.playSound(), 100);
      }
      
      // 重置倒计时
      this.resetCountdown();
    }
  }

  playSound(): void {
    try {
      // 确保在用户交互后创建音频上下文
      if (!this.audioContext) {
        // 使用兼容的方式创建音频上下文
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          this.audioContext = new AudioContext();
        }
      }
      
      if (this.audioContext) {
        // 创建振荡器和增益节点
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        // 连接节点
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // 设置音频参数
        oscillator.frequency.value = 800; // 频率
        gainNode.gain.value = 0.1; // 音量
        
        // 启动音频
        oscillator.start();
        
        // 500毫秒后停止
        setTimeout(() => {
          oscillator.stop();
        }, 500);
      } else {
        // 如果Web Audio API不可用，使用简单的提示音
        console.log('提示音已触发（Web Audio API不可用）');
      }
    } catch (error) {
      console.error('播放声音失败:', error);
    }
  }

  closeModal(hasDrunk: boolean): void {
    // 关闭弹窗
    this.showModal = false;
    
    // 如果用户喝了水，可以在这里添加相应的逻辑
    if (hasDrunk) {
      console.log('用户喝了一杯水');
      // 这里可以添加记录饮水的逻辑
    }
  }

  private resetCountdown(): void {
    // 重置倒计时为设定的频率
    this.remainingSeconds = this.totalSeconds;
    this.updateCountdown();
  }
}
