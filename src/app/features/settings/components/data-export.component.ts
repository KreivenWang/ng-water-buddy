import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

/**
 * 数据导出组件（展示组件）
 */
@Component({
  selector: 'app-data-export',
  templateUrl: './data-export.component.html',
  styleUrls: ['./data-export.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataExportComponent {
  @Output() exportData = new EventEmitter<void>();
  @Output() importData = new EventEmitter<File>();

  onExport(): void {
    this.exportData.emit();
  }

  onImport(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      this.importData.emit(target.files[0]);
    }
  }
}

