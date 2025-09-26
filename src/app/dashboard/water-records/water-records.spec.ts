import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterRecords } from './water-records';

describe('WaterRecords', () => {
  let component: WaterRecords;
  let fixture: ComponentFixture<WaterRecords>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaterRecords]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaterRecords);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
