import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterRecordsComponent } from './water-records';

describe('WaterRecordsComponent', () => {
  let component: WaterRecordsComponent;
  let fixture: ComponentFixture<WaterRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaterRecordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaterRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
