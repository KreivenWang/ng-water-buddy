/**
 * 用户实体
 */
export interface User {
  id: string;                    // UUID
  email?: string;                // 邮箱（可选）
  name: string;                  // 用户名称
  avatar: string;                // 头像（emoji）
  avatarBgColor: string;         // 头像背景色
  dailyGoal: number;             // 个人每日目标
  familyId?: string;             // 所属家庭ID
  memberId?: string;             // 在家庭中的成员ID
  isLoggedIn: boolean;           // 是否已登录
  lastLoginAt?: Date;            // 最后登录时间
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 用户会话状态
 */
export interface UserSession {
  user: User | null;
  isAuthenticated: boolean;
  currentFamilyId: string | null;
  currentMemberId: string | null;
}

/**
 * 登录表单数据
 */
export interface LoginFormData {
  name: string;
  email?: string;
  avatar: string;
  avatarBgColor: string;
  dailyGoal: number;
}

/**
 * 视图模式枚举
 */
export enum ViewMode {
  Personal = 'personal',
  Family = 'family'
}
