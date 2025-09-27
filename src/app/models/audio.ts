/**
 * 音频相关类型定义和常量
 */

/**
 * 声音事件类型 - 用于定义声音序列中的事件
 */
export type SoundEventType = 'beep' | 'pause';

/**
 * 声音事件接口 - 表示声音序列中的一个事件
 */
export interface SoundEvent {
  type: SoundEventType;
  duration: number;
}

/**
 * 蜂鸣声音事件接口
 */
export interface BeepSoundEvent extends SoundEvent {
  type: 'beep';
  frequency: number;
  volume: number;
}

/**
 * 暂停事件接口
 */
export interface PauseSoundEvent extends SoundEvent {
  type: 'pause';
}

/**
 * 声音序列 - 可以是蜂鸣或暂停事件的数组
 */
export type SoundPattern = (BeepSoundEvent | PauseSoundEvent)[];

/**
 * 提醒声音模式 - 预定义的提醒声音序列
 */
export const REMINDER_SOUND_PATTERN: SoundPattern = [
  { type: 'beep', frequency: 1200, duration: 300, volume: 0.1 },
  { type: 'beep', frequency: 600, duration: 400, volume: 0.1 },
  { type: 'beep', frequency: 800, duration: 200, volume: 0.1 },
  { type: 'beep', frequency: 1000, duration: 300, volume: 0.1 },
  { type: 'pause', duration: 1000 },
  { type: 'beep', frequency: 1200, duration: 300, volume: 0.1 },
  { type: 'beep', frequency: 600, duration: 400, volume: 0.1 },
  { type: 'beep', frequency: 800, duration: 200, volume: 0.1 },
  { type: 'beep', frequency: 1000, duration: 300, volume: 0.1 },
  { type: 'pause', duration: 1000 },
  { type: 'beep', frequency: 1200, duration: 300, volume: 0.1 },
  { type: 'beep', frequency: 600, duration: 400, volume: 0.1 },
  { type: 'beep', frequency: 800, duration: 200, volume: 0.1 },
  { type: 'beep', frequency: 1000, duration: 300, volume: 0.1 },
  { type: 'pause', duration: 1000 },
  { type: 'beep', frequency: 1200, duration: 300, volume: 0.1 },
  { type: 'beep', frequency: 600, duration: 400, volume: 0.1 },
  { type: 'beep', frequency: 800, duration: 200, volume: 0.1 },
  { type: 'beep', frequency: 1000, duration: 300, volume: 0.1 },
];

/**
 * 确认声音配置
 */
export const CONFIRMATION_SOUND_CONFIG = {
  frequency: 400,
  duration: 1000,
  volume: 0.08,
};

/**
 * 默认提示音配置
 */
export const DEFAULT_BEEP_CONFIG = {
  frequency: 800,
  duration: 500,
  volume: 0.1,
};