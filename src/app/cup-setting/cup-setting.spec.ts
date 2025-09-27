import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CupSetting } from './cup-setting';

describe('CupSetting', () => {
  let component: CupSetting;
  let fixture: ComponentFixture<CupSetting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CupSetting]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CupSetting);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
