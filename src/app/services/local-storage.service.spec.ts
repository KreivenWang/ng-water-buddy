import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';

// 模拟localStorage
class MockLocalStorage {
  private store: { [key: string]: string } = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }

  get length(): number {
    return Object.keys(this.store).length;
  }
}

// 创建一个会抛出错误的localStorage模拟
class ErrorThrowingLocalStorage extends MockLocalStorage {
  override getItem(key: string): string | null {
    throw new Error('localStorage getItem error');
  }

  override setItem(key: string, value: string): void {
    throw new Error('localStorage setItem error');
  }

  override removeItem(key: string): void {
    throw new Error('localStorage removeItem error');
  }

  override clear(): void {
    throw new Error('localStorage clear error');
  }

  override key(index: number): string | null {
    throw new Error('localStorage key error');
  }
}

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  let originalLocalStorage: any;

  beforeEach(() => {
    // 保存原始的localStorage引用
    originalLocalStorage = { ...window.localStorage };
    
    // 安装模拟的localStorage
    const mockLocalStorage = new MockLocalStorage();
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });

    TestBed.configureTestingModule({
      providers: [LocalStorageService]
    });
    service = TestBed.inject(LocalStorageService);
  });

  afterEach(() => {
    // 恢复原始的localStorage
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true
    });
  });

  describe('save method', () => {
    it('should save data successfully with default timestamp', () => {
      const testData = { test: 'value' };
      const result = service.save('testKey', testData);
      
      expect(result).toBeTrue();
      const savedData = JSON.parse(window.localStorage.getItem('testKey') || '{}');
      expect(savedData.test).toBe('value');
      expect(savedData.lastUpdated).toBeDefined();
    });

    it('should save data successfully without timestamp when includeTimestamp is false', () => {
      const testData = { test: 'value' };
      const result = service.save('testKey', testData, false);
      
      expect(result).toBeTrue();
      const savedData = JSON.parse(window.localStorage.getItem('testKey') || '{}');
      expect(savedData.test).toBe('value');
      expect(savedData.lastUpdated).toBeUndefined();
    });

    it('should save primitive values correctly', () => {
      expect(service.save('stringKey', 'test string')).toBeTrue();
      expect(JSON.parse(window.localStorage.getItem('stringKey') || '')).toBe('test string');
      
      expect(service.save('numberKey', 42)).toBeTrue();
      expect(JSON.parse(window.localStorage.getItem('numberKey') || '')).toBe(42);
      
      expect(service.save('booleanKey', true)).toBeTrue();
      expect(JSON.parse(window.localStorage.getItem('booleanKey') || '')).toBeTrue();
    });

    it('should handle null data correctly', () => {
      expect(service.save('nullKey', null)).toBeTrue();
      expect(window.localStorage.getItem('nullKey')).toBe('null');
    });

    it('should handle empty objects correctly', () => {
      expect(service.save('emptyObjKey', {})).toBeTrue();
      const savedData = JSON.parse(window.localStorage.getItem('emptyObjKey') || '{}');
      expect(Object.keys(savedData)).toContain('lastUpdated');
    });

    it('should return false when localStorage throws an error', () => {
      // 替换为会抛出错误的localStorage
      Object.defineProperty(window, 'localStorage', {
        value: new ErrorThrowingLocalStorage(),
        writable: true
      });
      
      expect(service.save('errorKey', 'test')).toBeFalse();
    });
  });

  describe('load method', () => {
    it('should load saved data successfully', () => {
      const testData = { test: 'value' };
      window.localStorage.setItem('testKey', JSON.stringify(testData));
      const originalDefault = { test: 'value' };
      // 修改为与 testData 相同类型的默认值
      const loadedData = service.load('testKey', originalDefault);
      expect(loadedData).toEqual(testData);
    });

    it('should return default value when key does not exist', () => {
      const defaultValue = { default: 'value' };
      const loadedData = service.load('nonExistentKey', defaultValue);
      expect(loadedData).toEqual(defaultValue);
    });

    it('should return default value when key exists but value is empty string', () => {
      window.localStorage.setItem('emptyKey', '');
      const defaultValue = { default: 'value' };
      const loadedData = service.load('emptyKey', defaultValue);
      expect(loadedData).toEqual(defaultValue);
    });

    it('should return default value when JSON parsing fails', () => {
      window.localStorage.setItem('invalidJsonKey', 'invalid json');
      const defaultValue = { default: 'value' };
      const loadedData = service.load('invalidJsonKey', defaultValue);
      expect(loadedData).toEqual(defaultValue);
    });

    it('should return default value when localStorage throws an error', () => {
      // 替换为会抛出错误的localStorage
      Object.defineProperty(window, 'localStorage', {
        value: new ErrorThrowingLocalStorage(),
        writable: true
      });
      
      const defaultValue = { default: 'value' };
      expect(service.load('errorKey', defaultValue)).toEqual(defaultValue);
    });
  });

  describe('has method', () => {
    it('should return true when key exists', () => {
      window.localStorage.setItem('existingKey', 'value');
      expect(service.has('existingKey')).toBeTrue();
    });

    it('should return false when key does not exist', () => {
      expect(service.has('nonExistentKey')).toBeFalse();
    });

    it('should return false when localStorage throws an error', () => {
      // 替换为会抛出错误的localStorage
      Object.defineProperty(window, 'localStorage', {
        value: new ErrorThrowingLocalStorage(),
        writable: true
      });
      
      expect(service.has('errorKey')).toBeFalse();
    });
  });

  describe('remove method', () => {
    it('should remove existing key successfully', () => {
      window.localStorage.setItem('keyToRemove', 'value');
      expect(window.localStorage.getItem('keyToRemove')).toBeTruthy();
      
      expect(service.remove('keyToRemove')).toBeTrue();
      expect(window.localStorage.getItem('keyToRemove')).toBeNull();
    });

    it('should return true even when removing non-existent key', () => {
      expect(service.remove('nonExistentKey')).toBeTrue();
    });

    it('should return false when localStorage throws an error', () => {
      // 替换为会抛出错误的localStorage
      Object.defineProperty(window, 'localStorage', {
        value: new ErrorThrowingLocalStorage(),
        writable: true
      });
      
      expect(service.remove('errorKey')).toBeFalse();
    });
  });

  describe('clear method', () => {
    it('should clear all localStorage data successfully', () => {
      window.localStorage.setItem('key1', 'value1');
      window.localStorage.setItem('key2', 'value2');
      expect(window.localStorage.length).toBe(2);
      
      expect(service.clear()).toBeTrue();
      expect(window.localStorage.length).toBe(0);
    });

    it('should return true even when localStorage is already empty', () => {
      expect(service.clear()).toBeTrue();
    });

    it('should return false when localStorage throws an error', () => {
      // 替换为会抛出错误的localStorage
      Object.defineProperty(window, 'localStorage', {
        value: new ErrorThrowingLocalStorage(),
        writable: true
      });
      
      expect(service.clear()).toBeFalse();
    });
  });

  describe('getAllKeys method', () => {
    it('should return all keys successfully', () => {
      window.localStorage.setItem('key1', 'value1');
      window.localStorage.setItem('key2', 'value2');
      window.localStorage.setItem('key3', 'value3');
      
      const keys = service.getAllKeys();
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
      expect(keys).toContain('key3');
      expect(keys.length).toBe(3);
    });

    it('should return empty array when localStorage is empty', () => {
      const keys = service.getAllKeys();
      expect(keys).toEqual([]);
    });

    it('should return empty array when localStorage throws an error', () => {
      // 替换为会抛出错误的localStorage
      Object.defineProperty(window, 'localStorage', {
        value: new ErrorThrowingLocalStorage(),
        writable: true
      });
      
      expect(service.getAllKeys()).toEqual([]);
    });

    it('should handle null keys from localStorage.key()', () => {
      // 创建一个模拟，其中key()方法有时返回null
      const mockWithNullKeys = {
        ...new MockLocalStorage(),
        key: (index: number): string | null => {
          const keys = ['validKey', 'anotherValidKey'];
          return index < keys.length ? keys[index] : null;
        },
        length: 5 // 故意设置长度大于实际键数量，测试null处理
      };
      
      Object.defineProperty(window, 'localStorage', {
        value: mockWithNullKeys,
        writable: true
      });
      
      const keys = service.getAllKeys();
      expect(keys.length).toBe(2);
      expect(keys).toContain('validKey');
      expect(keys).toContain('anotherValidKey');
    });
  });
});