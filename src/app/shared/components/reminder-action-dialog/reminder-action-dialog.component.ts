import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

/**
 * 提醒交互弹窗
 * 提醒触发后的用户交互选项
 */
@Component({
  selector: 'app-reminder-action-dialog',
  templateUrl: './reminder-action-dialog.component.html',
  styleUrls: ['./reminder-action-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReminderActionDialogComponent {
  @Input() isOpen = false;
  @Output() confirmed = new EventEmitter<void>();
  @Output() snoozed = new EventEmitter<void>();
  @Output() dismissed = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
    this.close();
  }

  onSnooze(): void {
    this.snoozed.emit();
    this.close();
  }

  onDismiss(): void {
    this.dismissed.emit();
    this.close();
  }

  private close(): void {
    this.isOpen = false;
  }
}

