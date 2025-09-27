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
    path: 'target-setting',
    loadComponent: () => import('@pages/target-setting/target-setting').then(m => m.TargetSettingComponent)
  }
];

export { routes };
