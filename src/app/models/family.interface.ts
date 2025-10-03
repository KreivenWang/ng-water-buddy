/**
 * 家庭实体
 */
export interface Family {
  id: string;                    // UUID
  name: string;                  // 家庭名称
  inviteCode: string;            // 邀请码（6位大写字母数字）
  createdAt: Date;
  updatedAt: Date;
}

