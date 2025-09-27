import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  /**
   * 保存数据到localStorage
   * @param key 存储键名
   * @param data 要存储的数据
   * @param includeTimestamp 是否包含时间戳，默认true
   * @returns 是否保存成功
   */
  save<T>(key: string, data: T, includeTimestamp: boolean = true): boolean {
    try {
      // 如果需要包含时间戳，则创建一个带有时间戳的新对象
      const dataToSave = includeTimestamp && typeof data === 'object' && data !== null
        ? { ...data, lastUpdated: new Date().toISOString() }
        : data;

      localStorage.setItem(key, JSON.stringify(dataToSave));
      console.log(`数据已成功保存到localStorage，键名: ${key}`);
      return true;
    } catch (error) {
      console.error(`保存数据到localStorage失败，键名: ${key}`, error);
      return false;
    }
  }

  /**
   * 从localStorage加载数据
   * @param key 存储键名
   * @param defaultValue 数据不存在时的默认值
   * @returns 加载的数据或默认值
   */
  load<T>(key: string, defaultValue: T): T {
    try {
      const savedData = localStorage.getItem(key);
      
      // 如果数据不存在或为空字符串，返回默认值
      if (savedData === null || savedData === '') {
        console.log(`localStorage中未找到键名 ${key} 对应的数据，使用默认值`);
        return defaultValue;
      }

      const parsedData = JSON.parse(savedData) as T;
      console.log(`从localStorage成功加载数据，键名: ${key}`);
      return parsedData;
    } catch (error) {
      console.error(`从localStorage加载数据失败，键名: ${key}`, error);
      return defaultValue;
    }
  }

  /**
   * 检查localStorage中是否存在指定键名的数据
   * @param key 存储键名
   * @returns 是否存在
   */
  has(key: string): boolean {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`检查localStorage键名存在性失败: ${key}`, error);
      return false;
    }
  }

  /**
   * 从localStorage删除指定键名的数据
   * @param key 存储键名
   * @returns 是否删除成功
   */
  remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      console.log(`从localStorage成功删除数据，键名: ${key}`);
      return true;
    } catch (error) {
      console.error(`从localStorage删除数据失败，键名: ${key}`, error);
      return false;
    }
  }

  /**
   * 清空所有localStorage数据
   * @returns 是否清空成功
   */
  clear(): boolean {
    try {
      localStorage.clear();
      console.log('localStorage已清空');
      return true;
    } catch (error) {
      console.error('清空localStorage失败', error);
      return false;
    }
  }

  /**
   * 获取所有localStorage键名
   * @returns 键名数组
   */
  getAllKeys(): string[] {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          keys.push(key);
        }
      }
      return keys;
    } catch (error) {
      console.error('获取localStorage键名列表失败', error);
      return [];
    }
  }
}