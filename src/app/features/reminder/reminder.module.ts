import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReminderRoutingModule } from './reminder-routing.module';
import { SharedModule } from '../../shared/shared.module';

// Components
import { ReminderSettingsComponent } from './components/reminder-settings.component';
import { SoundPickerComponent } from './components/sound-picker.component';

// Containers
import { ReminderPageComponent } from './containers/reminder-page.component';

/**
 * Reminder 功能模块
 * 提供喝水提醒功能
 */
@NgModule({
  declarations: [
    ReminderSettingsComponent,
    SoundPickerComponent,
    ReminderPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReminderRoutingModule
  ]
})
export class ReminderModule { }

