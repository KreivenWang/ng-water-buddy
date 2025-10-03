import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FamilyMember } from '../../../models/family-member.interface';

/**
 * 家庭成员卡片组件
 * 展示成员信息和操作按钮
 */
@Component({
  selector: 'app-family-member-card',
  templateUrl: './family-member-card.component.html',
  styleUrls: ['./family-member-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FamilyMemberCardComponent {
  @Input() member!: FamilyMember;
  @Output() edit = new EventEmitter<FamilyMember>();
  @Output() delete = new EventEmitter<FamilyMember>();

  onEdit(): void {
    this.edit.emit(this.member);
  }

  onDelete(): void {
    this.delete.emit(this.member);
  }
}

