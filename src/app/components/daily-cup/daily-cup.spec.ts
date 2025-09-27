import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyCup } from './daily-cup';

describe('DailyCup', () => {
  let component: DailyCup;
  let fixture: ComponentFixture<DailyCup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyCup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyCup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
