import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from '../../shared/shared.module';

// Components
import { ThemeToggleComponent } from './components/theme-toggle.component';
import { DataExportComponent } from './components/data-export.component';

// Containers
import { SettingsPageComponent } from './containers/settings-page.component';

/**
 * Settings 功能模块
 * 提供应用设置功能
 */
@NgModule({
  declarations: [
    ThemeToggleComponent,
    DataExportComponent,
    SettingsPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }

