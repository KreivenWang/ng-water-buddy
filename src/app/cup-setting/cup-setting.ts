import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cup-setting',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="cup-setting-container max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div class="flex items-center gap-2 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.4c-.5-.6-1.2-1.1-2-1.4-.4-.2-.8-.3-1.3-.3s-.9.1-1.3.3c-.8.3-1.5.8-2 1.4C8.3 8.6 7 10 7 10s-2.7.6-3.5 1.1C3 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"></path>
          <path d="M5 8v.01"></path>
          <path d="M19 8v.01"></path>
          <path d="M12 6v15"></path>
        </svg>
        <h2 class="text-xl font-bold text-gray-800">杯子设置</h2>
      </div>

      <!-- 文件上传部分 -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-gray-700 mb-3">上传杯子照片</h3>
        <div 
          class="upload-area border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
          (click)="fileInput.click()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" x2="12" y1="3" y2="15"></line>
          </svg>
          <p class="text-gray-500">上传杯子照片</p>
        </div>
        <input 
          #fileInput 
          type="file" 
          accept="image/*" 
          class="hidden"
          (change)="handleFileChange($event)"
        />
        <div class="mt-2 flex items-center gap-2">
          <button type="button" class="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors" (click)="fileInput.click()">选择文件</button>
          <span class="text-sm text-gray-500">{{ selectedFileName || '未选择文件' }}</span>
        </div>
      </div>

      <!-- 预设杯子选择 -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-gray-700 mb-3">或选择预设杯子</h3>
        <div class="grid grid-cols-2 gap-3">
          <div 
            *ngFor="let preset of presetCups"
            class="cup-preset border-2 rounded-lg p-4 cursor-pointer transition-colors"
            [class.border-blue-500]="selectedPreset === preset.capacity"
            [class.bg-blue-50]="selectedPreset === preset.capacity"
            [class.border-gray-200]="selectedPreset !== preset.capacity"
            (click)="selectPreset(preset)"
          >
            <div class="text-center">
              <span class="text-xl font-bold text-gray-800">{{ preset.capacity }}ml</span>
              <p class="text-sm text-gray-500">{{ preset.name }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 杯子信息表单 -->
      <form [formGroup]="cupForm" class="space-y-5">
        <div>
          <label for="cupName" class="block text-sm font-medium text-gray-700 mb-1">杯子名称</label>
          <input 
            id="cupName" 
            formControlName="cupName"
            type="text" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="请输入杯子名称"
          />
        </div>
        
        <div>
          <label for="capacity" class="block text-sm font-medium text-gray-700 mb-1">容量 (ml)</label>
          <input 
            id="capacity" 
            formControlName="capacity"
            type="number" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            min="1"
          />
        </div>

        <button 
          type="submit" 
          class="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          (click)="saveCupSettings()"
        >
          保存杯子设置
        </button>
      </form>
    </div>
  `,
  styles: [`
    .cup-setting-container {
      margin-top: 2rem;
    }
    .upload-area {
      min-height: 160px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .cup-preset {
      transition: all 0.2s ease;
    }
  `]
})
export class CupSetting implements OnInit {
  protected cupForm!: FormGroup;
  protected selectedFileName: string = '';
  protected selectedPreset: number = 300; // 默认选择300ml
  protected presetCups = [
    { capacity: 200, name: '小杯子' },
    { capacity: 300, name: '普通杯子' },
    { capacity: 500, name: '大杯子' },
    { capacity: 750, name: '运动水杯' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.cupForm = this.fb.group({
      cupName: ['我的杯子', Validators.required],
      capacity: [300, [Validators.required, Validators.min(1)]]
    });
  }

  protected handleFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      this.selectedFileName = target.files[0].name;
      // 这里可以添加文件上传逻辑
    }
  }

  protected selectPreset(preset: { capacity: number; name: string }): void {
    this.selectedPreset = preset.capacity;
    this.cupForm.patchValue({
      capacity: preset.capacity,
      cupName: `${preset.name} ${preset.capacity}ml`
    });
  }

  protected saveCupSettings(): void {
    if (this.cupForm.valid) {
      const formData = this.cupForm.value;
      console.log('保存杯子设置:', formData);
      // 这里可以添加保存到本地存储或发送到服务器的逻辑
      alert('杯子设置已保存！');
    }
  }
}
