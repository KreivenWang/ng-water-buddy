/**
 * 应用状态（本地存储）
 */
export interface AppState {
  currentFamilyId: string | null;
  currentMemberId: string | null;
  inviteCode: string | null;      // 当前家庭的邀请码
  lastSyncTime: Date | null;       // 最后同步时间（Supabase）
  isFirstLaunch: boolean;          // 是否首次启动
}

