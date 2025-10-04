import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

// Components (现在是 standalone 组件)
import { HeaderComponent } from './header/header.component';
import { BottomNavComponent } from './bottom-nav/bottom-nav.component';

/**
 * Layout 模块
 * 提供应用布局组件
 * 
 * 注意：HeaderComponent 和 BottomNavComponent 现在是 standalone 组件
 * 可以直接在需要的地方导入使用，无需通过此模块
 */
@NgModule({
  declarations: [
    // standalone 组件不需要在这里声明
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    // 导入 standalone 组件以便重新导出
    HeaderComponent,
    BottomNavComponent
  ],
  exports: [
    HeaderComponent,
    BottomNavComponent
  ],
  // [关键点] 允许使用自定义元素（Ionicons Web Components）
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LayoutModule { }

