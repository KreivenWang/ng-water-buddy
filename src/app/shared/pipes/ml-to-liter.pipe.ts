import { Pipe, PipeTransform } from '@angular/core';

/**
 * 毫升转升管道
 * 数据格式化：1000ml → 1L
 */
@Pipe({ name: 'mlToLiter', pure: true })
export class MlToLiterPipe implements PipeTransform {
  
  /**
   * 转换毫升为升
   * @param value 毫升值
   * @param decimals 小数位数，默认 1
   * @returns 格式化后的字符串，如 "1.5L"
   */
  transform(value: number, decimals: number = 1): string {
    if (isNaN(value) || value < 0) return '-';
    
    // [关键点] 当值 >= 1000ml 时显示为升，否则显示毫升
    if (value >= 1000) {
      return `${(value / 1000).toFixed(decimals)}L`;
    }
    
    return `${value}ml`;
  }
}

