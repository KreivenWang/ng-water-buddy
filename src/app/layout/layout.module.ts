import { NgModule } from '@angular/core';
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
  ]
})
export class LayoutModule { }

