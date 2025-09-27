import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@pages/dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('@pages/dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'cup-setting',
    loadComponent: () => import('@components/cup-setting/cup-setting').then(m => m.CupSetting)
  },
  {
    path: 'target-setting',
    loadComponent: () => import('@pages/target-setting/target-setting').then(m => m.TargetSettingComponent)
  }
];

export { routes };
