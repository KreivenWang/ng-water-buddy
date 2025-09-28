import { TestBed } from '@angular/core/testing';
import { DataApiService } from './data-api.service';
import { LocalStorageService } from './local-storage.service';
import { DEFAULT_ALL_SETTINGS } from '../models/user-setting';
import { DEFAULT_REMINDER_STATUS, STORAGE_KEYS } from '../models/water-data';

describe('DataApiService', () => {
  let service: DataApiService;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;

  beforeEach(() => {
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', [
      'save', 'load', 'remove', 'has', 'clear', 'getAllKeys'
    ]);

    TestBed.configureTestingModule({
      providers: [
        DataApiService,
        { provide: LocalStorageService, useValue: localStorageSpy }
      ]
    });

    service = TestBed.inject(DataApiService);
    localStorageService = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Settings Management', () => {
    it('should get current settings', () => {
      const settings = service.getSettings();
      expect(settings).toEqual(DEFAULT_ALL_SETTINGS);
    });

    it('should save settings successfully', (done) => {
      const testSettings = { ...DEFAULT_ALL_SETTINGS };
      localStorageService.save.and.returnValue(true);

      service.saveSettings(testSettings).subscribe(result => {
        expect(result).toBeTrue();
        expect(localStorageService.save).toHaveBeenCalledWith(
          STORAGE_KEYS.ALL_SETTINGS, 
          jasmine.objectContaining(testSettings)
        );
        done();
      });
    });

    it('should update daily cup settings', (done) => {
      const newDailyCup = { dailyCups: 10, cupSize: 300 };
      localStorageService.save.and.returnValue(true);

      service.updateDailyCupSettings(newDailyCup).subscribe(result => {
        expect(result).toBeTrue();
        done();
      });
    });
  });

  describe('Water Records Management', () => {
    it('should get today records', () => {
      const records = service.getTodayRecords();
      expect(records).toBeDefined();
      expect(records.records).toBeDefined();
    });

    it('should record water intake', (done) => {
      localStorageService.save.and.returnValue(true);

      service.recordWaterIntake().subscribe(result => {
        expect(result).toBeTrue();
        done();
      });
    });

    it('should get today progress', () => {
      const progress = service.getTodayProgress();
      expect(progress).toBeDefined();
      expect(progress.current).toBeDefined();
      expect(progress.total).toBeDefined();
      expect(progress.percentage).toBeDefined();
    });

    it('should check if today goal is completed', () => {
      const isCompleted = service.isTodayGoalCompleted();
      expect(typeof isCompleted).toBe('boolean');
    });

    it('should get next cup number', () => {
      const nextCup = service.getNextCupNumber();
      expect(typeof nextCup).toBe('number');
      expect(nextCup).toBeGreaterThan(0);
    });

    it('should reset today records', (done) => {
      localStorageService.remove.and.returnValue(true);

      service.resetTodayRecords().subscribe(result => {
        expect(result).toBeTrue();
        expect(localStorageService.remove).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('Reminder Status Management', () => {
    it('should get reminder status', () => {
      const status = service.getReminderStatus();
      expect(status).toEqual(DEFAULT_REMINDER_STATUS);
    });

    it('should update reminder status', (done) => {
      const newStatus = { ...DEFAULT_REMINDER_STATUS, timerActive: true };
      localStorageService.save.and.returnValue(true);

      service.updateReminderStatus(newStatus).subscribe(result => {
        expect(result).toBeTrue();
        expect(localStorageService.save).toHaveBeenCalledWith(
          STORAGE_KEYS.REMINDER_STATUS, 
          newStatus
        );
        done();
      });
    });
  });

  describe('Data Management', () => {
    it('should clear all data', (done) => {
      localStorageService.remove.and.returnValue(true);

      service.clearAllData().subscribe(result => {
        expect(result).toBeTrue();
        done();
      });
    });

    it('should export all data', (done) => {
      service.exportAllData().subscribe(data => {
        expect(data).toBeDefined();
        expect(data.settings).toBeDefined();
        expect(data.todayRecords).toBeDefined();
        expect(data.reminderStatus).toBeDefined();
        expect(data.exportTime).toBeDefined();
        done();
      });
    });

    it('should import data', (done) => {
      const testData = {
        settings: DEFAULT_ALL_SETTINGS,
        todayRecords: service.getTodayRecords(),
        reminderStatus: DEFAULT_REMINDER_STATUS
      };

      service.importData(testData).subscribe(result => {
        expect(result).toBeTrue();
        done();
      });
    });
  });

  describe('Observables', () => {
    it('should provide settings observable', (done) => {
      service.getSettings$().subscribe(settings => {
        expect(settings).toBeDefined();
        done();
      });
    });

    it('should provide today records observable', (done) => {
      service.getTodayRecords$().subscribe(records => {
        expect(records).toBeDefined();
        done();
      });
    });

    it('should provide reminder status observable', (done) => {
      service.getReminderStatus$().subscribe(status => {
        expect(status).toBeDefined();
        done();
      });
    });
  });
});
