import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PWAService } from './core/services/pwa.service';
import { PwaInstallPromptComponent } from './shared/components/pwa-install-prompt/pwa-install-prompt.component';
import { PwaUpdatePromptComponent } from './shared/components/pwa-update-prompt/pwa-update-prompt.component';
import { HeaderComponent } from './layout/header/header.component';
import { BottomNavComponent } from './layout/bottom-nav/bottom-nav.component';

/**
 * 应用根组件
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    BottomNavComponent,
    PwaInstallPromptComponent,
    PwaUpdatePromptComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Water Buddy';

  constructor(private pwaService: PWAService) {}

  ngOnInit(): void {
    // 初始化 PWA 服务
    console.log('PWA 状态:', this.pwaService.getPWAStatus());
  }
}

