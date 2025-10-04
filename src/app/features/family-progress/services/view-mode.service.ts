import { Injectable, signal, computed } from '@angular/core';
import { ViewMode } from '../../../models/user.interface';

/**
 * 视图模式管理服务
 * 管理Dashboard页面的个人视图和家庭视图切换
 */
@Injectable({ providedIn: 'root' })
export class ViewModeService {
  private readonly STORAGE_KEY = 'wb_view_mode';
  
  // [关键点] 使用 Signal 进行响应式状态管理
  private currentMode = signal<ViewMode>(ViewMode.Personal);
  
  // 公开的计算属性
  isPersonalView = computed(() => this.currentMode() === ViewMode.Personal);
  isFamilyView = computed(() => this.currentMode() === ViewMode.Family);

  constructor() {
    this.loadViewMode();
  }

  /**
   * 获取当前视图模式
   */
  getCurrentMode(): ViewMode {
    return this.currentMode();
  }

  /**
   * 切换到个人视图
   */
  switchToPersonalView(): void {
    this.setViewMode(ViewMode.Personal);
  }

  /**
   * 切换到家庭视图
   */
  switchToFamilyView(): void {
    this.setViewMode(ViewMode.Family);
  }

  /**
   * 切换视图模式
   */
  toggleViewMode(): void {
    const newMode = this.currentMode() === ViewMode.Personal 
      ? ViewMode.Family 
      : ViewMode.Personal;
    this.setViewMode(newMode);
  }

  /**
   * 设置视图模式
   */
  private setViewMode(mode: ViewMode): void {
    this.currentMode.set(mode);
    this.saveViewMode(mode);
  }

  /**
   * 从本地存储加载视图模式
   */
  private loadViewMode(): void {
    try {
      const savedMode = localStorage.getItem(this.STORAGE_KEY);
      if (savedMode && Object.values(ViewMode).includes(savedMode as ViewMode)) {
        this.currentMode.set(savedMode as ViewMode);
      }
    } catch (error) {
      console.error('加载视图模式失败:', error);
      this.currentMode.set(ViewMode.Personal);
    }
  }

  /**
   * 保存视图模式到本地存储
   */
  private saveViewMode(mode: ViewMode): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, mode);
    } catch (error) {
      console.error('保存视图模式失败:', error);
    }
  }
}
