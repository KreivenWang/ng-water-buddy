import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

/**
 * 声音选择器组件（展示组件）
 */
@Component({
  selector: 'app-sound-picker',
  templateUrl: './sound-picker.component.html',
  styleUrls: ['./sound-picker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoundPickerComponent {
  @Input() selectedSound: string = 'water-drop';
  @Output() soundSelected = new EventEmitter<string>();

  soundOptions = [
    { value: 'water-drop', label: '水滴声' },
    { value: 'bell', label: '铃声' },
    { value: 'chime', label: '钟声' }
  ];

  onSoundSelect(sound: string): void {
    this.soundSelected.emit(sound);
  }
}

