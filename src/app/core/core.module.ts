import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageAdapter } from './services/adapters/local-storage.adapter';
import { SupabaseAdapter } from './services/adapters/supabase.adapter';
import { environment } from '../../environments/environment';

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
    // [关键点] 根据环境切换存储适配器
    // 开发环境使用 LocalStorage，生产环境使用 Supabase
    {
      provide: 'STORAGE_ADAPTER',
      useClass: environment.useLocalStorage ? LocalStorageAdapter : SupabaseAdapter
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

