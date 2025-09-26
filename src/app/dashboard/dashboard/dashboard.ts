import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  template: `
    <div class="dashboard-container max-w-md mx-auto p-4">
      <app-header></app-header>
      <div class="dashboard-content">
        <app-progress></app-progress>
        <app-reminder></app-reminder>
        <app-water-records></app-water-records>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      background-color: #f9fafb;
      min-height: 100vh;
      padding-top: 2rem;
      padding-bottom: 2rem;
    }
    .dashboard-content {
      border-radius: 0 0 1rem 1rem;
      overflow: hidden;
    }
  `]
})
export class DashboardComponent { }
