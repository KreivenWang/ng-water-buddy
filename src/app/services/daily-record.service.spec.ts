import { TestBed } from '@angular/core/testing';
import { DailyRecordService } from './daily-record.service';
import { LocalStorageService } from './local-storage.service';
import { SettingsService } from './settings.service';

describe('DailyRecordService', () => {
  let service: DailyRecordService;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;
  let settingsService: jasmine.SpyObj<SettingsService>;

  beforeEach(() => {
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['load', 'save', 'remove']);
    const settingsSpy = jasmine.createSpyObj('SettingsService', ['loadAllSettings']);

    TestBed.configureTestingModule({
      providers: [
        DailyRecordService,
        { provide: LocalStorageService, useValue: localStorageSpy },
        { provide: SettingsService, useValue: settingsSpy }
      ]
    });

    service = TestBed.inject(DailyRecordService);
    localStorageService = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
    settingsService = TestBed.inject(SettingsService) as jasmine.SpyObj<SettingsService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should record a drink successfully', () => {
    // Mock settings
    settingsService.loadAllSettings.and.returnValue({
      dailyCup: { dailyCups: 8, cupSize: 250 },
      reminderFrequency: { frequencyMinutes: 30 },
      reminderRepeat: { repeatCount: 3, neverEnding: false },
      notificationSettings: { reminderEnabled: true, soundEnabled: true }
    });

    // Mock today's records with one incomplete record
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

    localStorageService.load.and.returnValue(mockRecords);
    localStorageService.save.and.returnValue(true);

    const result = service.record();

    expect(result).toBe(true);
    expect(localStorageService.save).toHaveBeenCalled();
  });

  it('should return false when all drinks are completed', () => {
    // Mock settings
    settingsService.loadAllSettings.and.returnValue({
      dailyCup: { dailyCups: 8, cupSize: 250 },
      reminderFrequency: { frequencyMinutes: 30 },
      reminderRepeat: { repeatCount: 3, neverEnding: false },
      notificationSettings: { reminderEnabled: true, soundEnabled: true }
    });

    // Mock today's records with all completed
    const mockRecords = {
      records: [
        { id: 1, completed: true },
        { id: 2, completed: true }
      ],
      currentAmount: 2,
      totalAmount: 2,
      completedPercentage: 100,
      totalMl: 500
    };

    localStorageService.load.and.returnValue(mockRecords);

    const result = service.record();

    expect(result).toBe(false);
  });
});
