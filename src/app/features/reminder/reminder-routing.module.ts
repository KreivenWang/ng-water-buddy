import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReminderPageComponent } from './containers/reminder-page.component';

const routes: Routes = [
  {
    path: '',
    component: ReminderPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReminderRoutingModule { }

