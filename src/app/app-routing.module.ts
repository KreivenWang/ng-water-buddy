import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { NotificationPermissionGuard } from './core/guards/notification-permission.guard';

/**
 * 应用路由配置
 * 采用懒加载策略优化性能
 */
const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/family-progress/family-progress.module')
      .then(m => m.FamilyProgressModule)
  },
  {
    path: 'reminder',
    loadChildren: () => import('./features/reminder/reminder.module')
      .then(m => m.ReminderModule),
    canActivate: [NotificationPermissionGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./features/settings/settings.module')
      .then(m => m.SettingsModule)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // [关键点] 使用预加载策略，空闲时预加载其他模块
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

