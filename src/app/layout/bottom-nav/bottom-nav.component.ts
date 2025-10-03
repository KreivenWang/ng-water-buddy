import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * 底部导航栏组件（移动端）
 */
@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BottomNavComponent {
  navItems = [
    { path: '/dashboard', label: '仪表盘', icon: '📊' },
    { path: '/reminder', label: '提醒', icon: '⏰' },
    { path: '/settings', label: '设置', icon: '⚙️' }
  ];

  // TODO: 实现底部导航逻辑
}

