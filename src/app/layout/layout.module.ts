import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

// Components
import { HeaderComponent } from './header/header.component';
import { BottomNavComponent } from './bottom-nav/bottom-nav.component';

/**
 * Layout 模块
 * 提供应用布局组件
 */
@NgModule({
  declarations: [
    HeaderComponent,
    BottomNavComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    HeaderComponent,
    BottomNavComponent
  ],
  // [关键点] 允许使用自定义元素（Ionicons Web Components）
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LayoutModule { }

