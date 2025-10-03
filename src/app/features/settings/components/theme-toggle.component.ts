import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

/**
 * 主题切换组件（展示组件）
 */
@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeToggleComponent {
  @Output() themeChanged = new EventEmitter<'light' | 'dark'>();

  // TODO: 实现主题切换逻辑
}

