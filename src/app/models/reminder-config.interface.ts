/**
 * 提醒配置
 */
export interface ReminderConfig {
  enabled: boolean;              // 是否启用提醒
  interval: number;              // 提醒间隔（小时），默认 1
  startHour: number;             // 开始时间（小时），默认 8
  endHour: number;               // 结束时间（小时），默认 22
  soundType: 'water-drop' | 'bell' | 'chime';
  vibrate: boolean;              // 是否震动
  autoRecordAmount: number;      // "已喝完"自动记录的水量（毫升），默认 200
}

