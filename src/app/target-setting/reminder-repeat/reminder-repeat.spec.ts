import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderRepeat } from './reminder-repeat';

describe('ReminderRepeat', () => {
  let component: ReminderRepeat;
  let fixture: ComponentFixture<ReminderRepeat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReminderRepeat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReminderRepeat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
