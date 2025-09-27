import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderFrequency } from './reminder-frequency';

describe('ReminderFrequency', () => {
  let component: ReminderFrequency;
  let fixture: ComponentFixture<ReminderFrequency>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReminderFrequency]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReminderFrequency);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
