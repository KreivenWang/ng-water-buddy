import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FamilyMember } from '../../../models/family-member.interface';

/**
 * 成员列表组件（展示组件）
 */
@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberListComponent {
  @Input() members: FamilyMember[] = [];
  @Output() memberClick = new EventEmitter<FamilyMember>();
  @Output() memberEdit = new EventEmitter<FamilyMember>();
  @Output() memberDelete = new EventEmitter<FamilyMember>();

  /**
   * trackBy 函数优化性能
   */
  trackByMemberId(index: number, member: FamilyMember): string {
    return member.id;
  }

  onMemberClick(member: FamilyMember): void {
    this.memberClick.emit(member);
  }

  onMemberEdit(member: FamilyMember): void {
    this.memberEdit.emit(member);
  }

  onMemberDelete(member: FamilyMember): void {
    this.memberDelete.emit(member);
  }
}

