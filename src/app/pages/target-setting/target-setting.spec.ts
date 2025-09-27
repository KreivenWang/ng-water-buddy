import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetSetting } from './target-setting';

describe('TargetSetting', () => {
  let component: TargetSetting;
  let fixture: ComponentFixture<TargetSetting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TargetSetting]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TargetSetting);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
