import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, UserSession, LoginFormData } from '../../models/user.interface';

/**
 * 用户认证服务
 * 管理用户登录状态、会话信息和权限控制
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'wb_user_session';
  
  // [关键点] 使用 Signal 进行响应式状态管理
  private userSession = signal<UserSession>({
    user: null,
    isAuthenticated: false,
    currentFamilyId: null,
    currentMemberId: null
  });
  
  // 公开的计算属性
  currentUser = computed(() => this.userSession().user);
  isAuthenticated = computed(() => this.userSession().isAuthenticated);
  currentFamilyId = computed(() => this.userSession().currentFamilyId);
  currentMemberId = computed(() => this.userSession().currentMemberId);
  
  // 兼容 RxJS 的 Observable
  userSession$ = new BehaviorSubject<UserSession>(this.userSession());

  constructor() {
    this.loadUserSession();
  }

  /**
   * 用户登录
   */
  login(loginData: LoginFormData): Observable<User> {
    const user: User = {
      id: this.generateId(),
      name: loginData.name,
      email: loginData.email,
      avatar: loginData.avatar,
      avatarBgColor: loginData.avatarBgColor,
      dailyGoal: loginData.dailyGoal,
      isLoggedIn: true,
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const session: UserSession = {
      user,
      isAuthenticated: true,
      currentFamilyId: user.familyId || null,
      currentMemberId: user.memberId || null
    };

    this.updateSession(session);
    this.saveUserSession(session);
    
    return of(user);
  }

  /**
   * 用户登出
   */
  logout(): void {
    const session: UserSession = {
      user: null,
      isAuthenticated: false,
      currentFamilyId: null,
      currentMemberId: null
    };

    this.updateSession(session);
    this.clearUserSession();
  }

  /**
   * 更新用户信息
   */
  updateUser(userData: Partial<User>): Observable<User> {
    const currentUser = this.userSession().user;
    if (!currentUser) {
      throw new Error('用户未登录');
    }

    const updatedUser: User = {
      ...currentUser,
      ...userData,
      updatedAt: new Date()
    };

    const session: UserSession = {
      ...this.userSession(),
      user: updatedUser
    };

    this.updateSession(session);
    this.saveUserSession(session);
    
    return of(updatedUser);
  }

  /**
   * 加入家庭
   */
  joinFamily(familyId: string, memberId: string): void {
    const currentUser = this.userSession().user;
    if (!currentUser) {
      throw new Error('用户未登录');
    }

    const updatedUser: User = {
      ...currentUser,
      familyId,
      memberId
    };

    const session: UserSession = {
      user: updatedUser,
      isAuthenticated: true,
      currentFamilyId: familyId,
      currentMemberId: memberId
    };

    this.updateSession(session);
    this.saveUserSession(session);
  }

  /**
   * 离开家庭
   */
  leaveFamily(): void {
    const currentUser = this.userSession().user;
    if (!currentUser) {
      return;
    }

    const updatedUser: User = {
      ...currentUser,
      familyId: undefined,
      memberId: undefined
    };

    const session: UserSession = {
      user: updatedUser,
      isAuthenticated: true,
      currentFamilyId: null,
      currentMemberId: null
    };

    this.updateSession(session);
    this.saveUserSession(session);
  }

  /**
   * 检查用户权限
   */
  canModifyMember(memberId: string): boolean {
    const session = this.userSession();
    if (!session.isAuthenticated || !session.currentMemberId) {
      return false;
    }
    
    // 只能修改自己的记录
    return session.currentMemberId === memberId;
  }

  /**
   * 检查是否为家庭创建者
   */
  isFamilyOwner(): boolean {
    const user = this.userSession().user;
    return user?.familyId !== undefined && user?.memberId !== undefined;
  }

  /**
   * 获取当前用户ID
   */
  getCurrentUserId(): string | null {
    return this.userSession().user?.id || null;
  }

  /**
   * 获取当前成员ID
   */
  getCurrentMemberId(): string | null {
    return this.userSession().currentMemberId;
  }

  /**
   * 更新会话状态
   */
  private updateSession(session: UserSession): void {
    this.userSession.set(session);
    this.userSession$.next(session);
  }

  /**
   * 从本地存储加载用户会话
   */
  private loadUserSession(): void {
    try {
      const sessionData = localStorage.getItem(this.STORAGE_KEY);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        // 转换日期字符串为 Date 对象
        if (session.user) {
          session.user.createdAt = new Date(session.user.createdAt);
          session.user.updatedAt = new Date(session.user.updatedAt);
          if (session.user.lastLoginAt) {
            session.user.lastLoginAt = new Date(session.user.lastLoginAt);
          }
        }
        this.updateSession(session);
      }
    } catch (error) {
      console.error('加载用户会话失败:', error);
      this.clearUserSession();
    }
  }

  /**
   * 保存用户会话到本地存储
   */
  private saveUserSession(session: UserSession): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('保存用户会话失败:', error);
    }
  }

  /**
   * 清除本地存储的用户会话
   */
  private clearUserSession(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
