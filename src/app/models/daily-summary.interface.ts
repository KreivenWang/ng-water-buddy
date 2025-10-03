import { WaterRecord } from './water-record.interface';

/**
 * 每日汇总
 */
export interface DailySummary {
  date: string;                  // YYYY-MM-DD
  memberRecords: {               // 成员ID -> 记录汇总
    [memberId: string]: {
      memberId: string;
      memberName: string;
      avatar: string;
      avatarBgColor: string;
      dailyGoal: number;
      totalAmount: number;
      percentage: number;         // 0-100
      recordCount: number;
      records: WaterRecord[];
    };
  };
}

