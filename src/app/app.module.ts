import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { LayoutModule } from './layout/layout.module';
import { environment } from '../environments/environment';

/**
 * 应用根模块
 */
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    
    // [关键点] Core 模块仅导入一次
    CoreModule,
    
    // [关键点] Shared 和 Layout 模块可多处导入
    SharedModule,
    LayoutModule,
    
    // [关键点] PWA Service Worker 配置
    // TODO: 取消注释以启用 PWA
    // ServiceWorkerModule.register('ngsw-worker.js', {
    //   enabled: environment.production,
    //   registrationStrategy: 'registerWhenStable:30000'
    // })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

