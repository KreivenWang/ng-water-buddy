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
    path: 'user-setting',
    loadComponent: () => import('@pages/user-setting/user-setting').then(m => m.UserSettingComponent)
  }
];

export { routes };
