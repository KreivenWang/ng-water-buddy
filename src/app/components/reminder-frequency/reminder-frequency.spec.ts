import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderFrequencyComponent } from './reminder-frequency';

describe('ReminderFrequencyComponent', () => {
  let component: ReminderFrequencyComponent;
  let fixture: ComponentFixture<ReminderFrequencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReminderFrequencyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReminderFrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
