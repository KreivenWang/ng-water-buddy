import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'cup-setting',
    loadComponent: () => import('./cup-setting/cup-setting').then(m => m.CupSetting)
  },
  {
    path: 'target-setting',
    loadChildren: () => import('./target-setting/target-setting-module').then(m => m.TargetSettingModule)
  }
];

export { routes };
