import { Component, OnInit } from '@angular/core';
import { PWAService } from './core/services/pwa.service';

/**
 * 应用根组件
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Water Buddy';

  constructor(private pwaService: PWAService) {}

  ngOnInit(): void {
    // TODO: 初始化 PWA 服务
    // this.pwaService.checkForUpdates();
  }
}

