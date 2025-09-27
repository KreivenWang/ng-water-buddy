import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyCupComponent } from './daily-cup';

describe('DailyCupComponent', () => {
  let component: DailyCupComponent;
  let fixture: ComponentFixture<DailyCupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyCupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyCupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
