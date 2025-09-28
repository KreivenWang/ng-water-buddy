// 饮水记录模型
export interface DrinkRecord {
  id: number;
  completed: boolean;
  timestamp?: string;
}

export interface DrinkRecords {
  records: DrinkRecord[];
  currentAmount: number;
  totalAmount: number;
  completedPercentage: number;
  totalMl: number;
}

// 提醒状态模型
export interface ReminderStatus {
  countdownTime: string;
  reminderProgress: number;
  showModal: boolean;
  timerActive: boolean;
}

// 音频设置模型
export interface AudioSettings {
  soundEnabled: boolean;
  reminderSound?: string;
  confirmationSound?: string;
}

// 本地存储键名常量
export const STORAGE_KEYS = {
  ALL_SETTINGS: 'waterBuddy_allSettings',
  DRINK_RECORDS: 'waterBuddy_drinkRecords',
  REMINDER_STATUS: 'waterBuddy_reminderStatus'
} as const;

// 默认饮水记录
export const DEFAULT_WATER_RECORDS: DrinkRecords = {
  records: Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    completed: false
  })),
  currentAmount: 0,
  totalAmount: 8,
  completedPercentage: 0,
  totalMl: 2000
};

// 默认提醒状态
export const DEFAULT_REMINDER_STATUS: ReminderStatus = {
  countdownTime: '0分0秒',
  reminderProgress: 0,
  showModal: false,
  timerActive: false
};

// 默认音频设置
export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  soundEnabled: true,
  reminderSound: '',
  confirmationSound: ''
};
