import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

/**
 * 添加喝水弹窗组件（展示组件）
 */
@Component({
  selector: 'app-add-water-modal',
  templateUrl: './add-water-modal.component.html',
  styleUrls: ['./add-water-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddWaterModalComponent {
  @Input() isOpen = false;
  @Input() memberId!: string;
  @Output() waterAdded = new EventEmitter<{ memberId: string; amount: number }>();
  @Output() closed = new EventEmitter<void>();

  onWaterAdded(amount: number): void {
    this.waterAdded.emit({ memberId: this.memberId, amount });
    this.close();
  }

  close(): void {
    this.closed.emit();
  }
}

