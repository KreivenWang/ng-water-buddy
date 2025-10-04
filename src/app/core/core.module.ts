import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartAdapter } from './services/adapters/smart.adapter';

/**
 * Core 模块
 * 全局单例服务、拦截器、守卫
 * 仅在 AppModule 中导入一次
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    // [关键点] 使用智能适配器，自动选择正确的存储后端
    {
      provide: 'STORAGE_ADAPTER',
      useClass: SmartAdapter
    }
  ]
})
export class CoreModule {
  // [关键点] 防止 CoreModule 被多次导入
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule 已被导入。请仅在 AppModule 中导入一次。');
    }
  }
}

