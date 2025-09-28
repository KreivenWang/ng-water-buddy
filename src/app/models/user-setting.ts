// 定义设置类型
export interface DailyCupSettings {
  dailyCups: number;
  cupSize: number;
}

export interface ReminderFrequencySettings {
  frequencyMinutes: number;
}

export interface ReminderRepeatSettings {
  repeatCount: number;
  neverEnding: boolean;
}

export interface NotificationSettings {
  reminderEnabled: boolean;
  soundEnabled: boolean;
}

export interface AllSettings {
  dailyCup: DailyCupSettings;
  reminderFrequency: ReminderFrequencySettings;
  reminderRepeat: ReminderRepeatSettings;
  notificationSettings: NotificationSettings;
  lastSaved?: string;
}

// 默认设置
export const DEFAULT_DAILY_CUP: DailyCupSettings = {
  dailyCups: 8,
  cupSize: 250,
};

export const DEFAULT_REMINDER_FREQUENCY: ReminderFrequencySettings = {
  frequencyMinutes: 30,
};

export const DEFAULT_REMINDER_REPEAT: ReminderRepeatSettings = {
  repeatCount: 3,
  neverEnding: false,
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  reminderEnabled: true,
  soundEnabled: true,
};

export const DEFAULT_ALL_SETTINGS: AllSettings = {
  dailyCup: DEFAULT_DAILY_CUP,
  reminderFrequency: DEFAULT_REMINDER_FREQUENCY,
  reminderRepeat: DEFAULT_REMINDER_REPEAT,
  notificationSettings: DEFAULT_NOTIFICATION_SETTINGS,
};
