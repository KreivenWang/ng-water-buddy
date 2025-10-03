/**
 * 喝水记录实体
 */
export interface WaterRecord {
  id: string;
  memberId: string;              // 关联成员 ID
  amount: number;                // 喝水量（毫升）
  recordedAt: Date;              // 记录时间
  synced?: boolean;              // 是否已同步到云端（Supabase）
}

