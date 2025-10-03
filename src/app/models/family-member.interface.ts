/**
 * 家庭成员实体
 */
export interface FamilyMember {
  id: string;                    // UUID
  familyId: string;              // 关联家庭 ID
  name: string;                  // 成员名称
  avatar: string;                // 头像（emoji，如 '👤'）
  avatarBgColor: string;         // 头像背景色（如 '#FF6B6B'）
  dailyGoal: number;             // 每日目标（毫升），默认 2000
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 预设头像颜色
 */
export const AVATAR_COLORS = [
  '#FF6B6B', // 红色
  '#4ECDC4', // 青色
  '#45B7D1', // 蓝色
  '#FFA07A', // 橙色
  '#98D8C8', // 绿色
  '#F7DC6F', // 黄色
  '#BB8FCE', // 紫色
  '#85C1E2'  // 浅蓝
];

/**
 * 预设头像 Emoji
 */
export const AVATAR_EMOJIS = [
  '👤', '👨', '👩', '🧑', '👶', '👧', '👦', '🧒', '👴', '👵'
];

