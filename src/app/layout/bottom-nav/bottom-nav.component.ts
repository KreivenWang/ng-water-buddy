import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * 底部导航栏组件（移动端）
 * 
 * 功能：
 * - 提供主要功能的快速导航入口
 * - 响应式设计：仅在移动端和平板显示，桌面端隐藏
 * - 支持深色模式自动切换
 * - 触摸友好设计（最小可点击区域 48x48px）
 */
@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BottomNavComponent {
  /**
   * 导航项配置
   * 使用 Ionicons 图标名称
   * 图标查询: https://ionic.io/ionicons
   */
  navItems = [
    { 
      path: '/dashboard', 
      label: '仪表盘', 
      icon: 'water',           // 水滴图标
      iconOutline: 'water-outline' 
    },
    { 
      path: '/reminder', 
      label: '提醒', 
      icon: 'notifications',   // 通知图标
      iconOutline: 'notifications-outline' 
    },
    { 
      path: '/settings', 
      label: '设置', 
      icon: 'settings',        // 设置图标
      iconOutline: 'settings-outline' 
    }
  ];

  /**
   * TrackBy 函数优化 *ngFor 性能
   * [性能] 避免不必要的 DOM 重新渲染
   */
  trackByPath(index: number, item: any): string {
    return item.path;
  }
}

