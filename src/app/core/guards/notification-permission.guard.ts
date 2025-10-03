import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

/**
 * 通知权限守卫
 * 确保用户已授权通知权限后才能访问提醒页面
 */
@Injectable({ providedIn: 'root' })
export class NotificationPermissionGuard implements CanActivate {
  
  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // TODO: 实现权限检查逻辑
    // 如果未授权，引导用户授权或跳转到引导页面
    return of(true);
  }
}

