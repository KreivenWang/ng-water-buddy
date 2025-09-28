import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reminder-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reminder-modal.html',
  styleUrl: './reminder-modal.css'
})
export class ReminderModalComponent {
  @Input() visible: boolean = false;
  @Input() soundEnabled: boolean = true;
  
  @Output() playSound = new EventEmitter<void>();
  @Output() close = new EventEmitter<boolean>();
  
  closeModal(hasDrunk: boolean): void {
    this.close.emit(hasDrunk);
  }
}
