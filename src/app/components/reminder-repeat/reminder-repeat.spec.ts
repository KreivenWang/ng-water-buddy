import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderRepeatComponent } from './reminder-repeat';

describe('ReminderRepeatComponent', () => {
  let component: ReminderRepeatComponent;
  let fixture: ComponentFixture<ReminderRepeatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReminderRepeatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReminderRepeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
