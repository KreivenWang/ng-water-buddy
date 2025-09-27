import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TargetSetting } from './target-setting/target-setting';
import { DailyCup } from './daily-cup/daily-cup';
import { ReminderFrequency } from './reminder-frequency/reminder-frequency';
import { ReminderRepeat } from './reminder-repeat/reminder-repeat';

const targetSettingRoutes: Routes = [
  {
    path: '',
    component: TargetSetting
  }
];

@NgModule({
  declarations: [
    TargetSetting,
    DailyCup,
    ReminderFrequency,
    ReminderRepeat
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(targetSettingRoutes)
  ],
  exports: [
    TargetSetting
  ]
})
export class TargetSettingModule { }
