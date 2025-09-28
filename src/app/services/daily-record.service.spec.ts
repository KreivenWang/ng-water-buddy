import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DailyRecordService } from './daily-record.service';
import { DataApiService } from './data-api.service';

describe('DailyRecordService', () => {
  let service: DailyRecordService;
  let dataApiService: jasmine.SpyObj<DataApiService>;

  beforeEach(() => {
    const dataApiSpy = jasmine.createSpyObj('DataApiService', [
      'recordWaterIntake', 'getTodayRecords', 'getTodayRecords$', 'getTodayProgress',
      'resetTodayRecords', 'isTodayGoalCompleted', 'getNextCupNumber'
    ]);

    TestBed.configureTestingModule({
      providers: [
        DailyRecordService,
        { provide: DataApiService, useValue: dataApiSpy }
      ]
    });

    service = TestBed.inject(DailyRecordService);
    dataApiService = TestBed.inject(DataApiService) as jasmine.SpyObj<DataApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should record a drink successfully', (done) => {
    dataApiService.recordWaterIntake.and.returnValue(of(true));

    service.record().subscribe({
      next: (result) => {
        expect(result).toBe(true);
        expect(dataApiService.recordWaterIntake).toHaveBeenCalled();
        done();
      },
      error: done.fail
    });
  });

  it('should return false when all drinks are completed', (done) => {
    dataApiService.recordWaterIntake.and.returnValue(of(false));

    service.record().subscribe({
      next: (result) => {
        expect(result).toBe(false);
        expect(dataApiService.recordWaterIntake).toHaveBeenCalled();
        done();
      },
      error: done.fail
    });
  });

  it('should get today records', () => {
    const mockRecords = {
      records: [
        { id: 1, completed: false },
        { id: 2, completed: false }
      ],
      currentAmount: 0,
      totalAmount: 8,
      completedPercentage: 0,
      totalMl: 2000
    };

    dataApiService.getTodayRecords.and.returnValue(mockRecords);

    const result = service.getTodayRecords();

    expect(result).toEqual(mockRecords);
    expect(dataApiService.getTodayRecords).toHaveBeenCalled();
  });

  it('should get today progress', () => {
    const mockProgress = { current: 2, total: 8, percentage: 25 };
    dataApiService.getTodayProgress.and.returnValue(mockProgress);

    const result = service.getTodayProgress();

    expect(result).toEqual(mockProgress);
    expect(dataApiService.getTodayProgress).toHaveBeenCalled();
  });

  it('should check if today goal is completed', () => {
    dataApiService.isTodayGoalCompleted.and.returnValue(false);

    const result = service.isTodayGoalCompleted();

    expect(result).toBe(false);
    expect(dataApiService.isTodayGoalCompleted).toHaveBeenCalled();
  });

  it('should get next cup number', () => {
    dataApiService.getNextCupNumber.and.returnValue(3);

    const result = service.getNextCupNumber();

    expect(result).toBe(3);
    expect(dataApiService.getNextCupNumber).toHaveBeenCalled();
  });

  it('should reset today records', (done) => {
    dataApiService.resetTodayRecords.and.returnValue(of(true));

    service.resetTodayRecords().subscribe({
      next: (result) => {
        expect(result).toBe(true);
        expect(dataApiService.resetTodayRecords).toHaveBeenCalled();
        done();
      },
      error: done.fail
    });
  });
});
