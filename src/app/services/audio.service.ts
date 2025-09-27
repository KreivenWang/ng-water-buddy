import { Injectable, OnDestroy } from '@angular/core';
import { of, Subject, Subscription, timer } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { CONFIRMATION_SOUND_CONFIG, DEFAULT_BEEP_CONFIG, REMINDER_SOUND_PATTERN } from '../models/audio';

@Injectable({
  providedIn: 'root',
})
export class AudioService implements OnDestroy {
  private audioContext: AudioContext | null = null;
  private oscillators: {
    [key: string]: { oscillator: OscillatorNode; gainNode: GainNode; playing: boolean };
  } = {};
  private audioContextCreated = false;
  
  // Subscription for reminder sound sequence
  private reminderSoundSubscription: Subscription | null = null;

  // 音频事件通知
  private soundPlayedSubject = new Subject<string>();
  soundPlayed$ = this.soundPlayedSubject.asObservable();

  constructor() {
    // 注意：由于浏览器策略，音频上下文需要在用户交互后创建
  }

  /**
   * 确保音频上下文处于运行状态（处理用户交互限制）
   */
  private ensureAudioContextRunning(): boolean {
    if (!this.audioContext) {
      // 使用兼容的方式创建音频上下文
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        this.audioContext = new AudioContext();
        this.audioContextCreated = true;
      } else {
        console.warn('Web Audio API 不可用');
        return false;
      }
    }

    // 检查音频上下文状态，如果被暂停则恢复
    if (this.audioContext.state === 'suspended') {
      try {
        this.audioContext.resume();
      } catch (error) {
        console.error('无法恢复音频上下文:', error);
        return false;
      }
    }

    return true;
  }

  /**
   * 检查音频功能是否可用
   */
  isAudioAvailable(): boolean {
    return this.audioContextCreated;
  }

  /**
   * 播放简单的提示音
   * @param frequency 频率 (Hz)
   * @param duration 持续时间 (ms)
   * @param volume 音量 (0-1)
   * @param soundId 声音ID，用于追踪和停止特定声音
   */
  playBeep(
    frequency: number = DEFAULT_BEEP_CONFIG.frequency,
    duration: number = DEFAULT_BEEP_CONFIG.duration,
    volume: number = DEFAULT_BEEP_CONFIG.volume,
    soundId: string = 'default'
  ): void {
    if (!this.ensureAudioContextRunning()) {
      console.warn('无法播放声音，音频上下文不可用');
      return;
    }

    // 停止之前的同名声音
    this.stopSound(soundId);

    try {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      // 连接节点
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      // 设置音频参数
      oscillator.frequency.value = frequency; // 频率
      gainNode.gain.value = volume; // 音量

      // 保存振荡器引用以便后续停止
      this.oscillators[soundId] = {
        oscillator,
        gainNode,
        playing: true,
      };

      // 设置音量渐变，使声音听起来更自然
      const now = this.audioContext!.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(volume, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration / 1000);

      // 启动音频
      oscillator.start(now);

      // 在持续时间后停止
      setTimeout(() => {
        if (this.oscillators[soundId]) {
          try {
            oscillator.stop();
          } catch (error) {
            // 忽略已经停止的振荡器错误
          }
          delete this.oscillators[soundId];
        }
      }, duration);

      // 通知声音播放
      this.soundPlayedSubject.next(soundId);
    } catch (error) {
      console.error(`播放声音失败 (${soundId}):`, error);
      // 清理失败的声音引用
      if (this.oscillators[soundId]) {
        delete this.oscillators[soundId];
      }
    }
  }

  /**
   * 播放提醒声音 - 使用RxJS实现可中断的声音序列
   */
  playReminderSound(): void {
    // 停止之前的声音序列订阅
    this.stopReminderSoundSequence();
    
    if (!this.ensureAudioContextRunning()) {
      return;
    }
    
    // 使用RxJS创建声音序列
    const soundSequence$ = of(...REMINDER_SOUND_PATTERN).pipe(
      // 对每个声音事件进行延迟处理
      concatMap((event, index) => {
        // 为每个声音创建一个唯一ID
        const soundId = `reminder-${index}`;
        
        // 根据事件类型处理
        if (event.type === 'beep') {
          // 播放声音，并在持续时间后返回完成信号
          return timer(0).pipe(
            concatMap(() => {
              this.playBeep(event.frequency, event.duration, event.volume, soundId);
              // 返回一个延迟等于持续时间的Observable
              return timer(event.duration);
            })
          );
        } else { // pause
          // 仅返回延迟的Observable
          return timer(event.duration);
        }
      })
    );

    // 订阅声音序列并保存引用，以便后续可以取消订阅
    this.reminderSoundSubscription = soundSequence$.subscribe(
      () => {
        // 每个事件完成时触发
      },
      (error) => {
        console.error('声音序列执行错误:', error);
      },
      () => {
        // 声音序列完成时清理订阅引用
        this.reminderSoundSubscription = null;
      }
    );
  }

  /**
   * 停止提醒声音序列
   */
  private stopReminderSoundSequence(): void {
    // 取消订阅，停止后续的声音事件
    if (this.reminderSoundSubscription) {
      this.reminderSoundSubscription.unsubscribe();
      this.reminderSoundSubscription = null;
    }
    
    // 停止所有当前正在播放的提醒声音
    Object.keys(this.oscillators)
      .filter(soundId => soundId.startsWith('reminder-'))
      .forEach(soundId => this.stopSound(soundId));
  }

  /**
   * 播放确认声音
   */
  playConfirmationSound(): void {
    this.playBeep(
      CONFIRMATION_SOUND_CONFIG.frequency,
      CONFIRMATION_SOUND_CONFIG.duration,
      CONFIRMATION_SOUND_CONFIG.volume,
      'confirmation'
    );
  }

  /**
   * 停止特定声音
   * @param soundId 要停止的声音ID
   */
  stopSound(soundId: string): void {
    if (this.oscillators[soundId]) {
      const { oscillator } = this.oscillators[soundId];
      try {
        // 立即停止振荡器
        oscillator.stop();
      } catch (error) {
        // 忽略已经停止的振荡器错误
      }
      delete this.oscillators[soundId];
    }
  }

  /**
   * 停止所有正在播放的声音
   */
  stopAllSounds(): void {
    // 停止提醒声音序列
    this.stopReminderSoundSequence();
    
    // 停止所有其他正在播放的声音
    Object.keys(this.oscillators).forEach((soundId) => {
      this.stopSound(soundId);
    });
  }

  /**
   * 清理音频资源
   */
  cleanup(): void {
    this.stopAllSounds();
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (error) {
        console.error('关闭音频上下文失败:', error);
      }
      this.audioContext = null;
      this.audioContextCreated = false;
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
    this.soundPlayedSubject.complete();
  }
}
