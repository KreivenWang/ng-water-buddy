import { Pipe, PipeTransform } from '@angular/core';

/**
 * 进度百分比管道
 * 计算并格式化进度百分比
 */
@Pipe({ name: 'progressPercent', pure: true })
export class ProgressPercentPipe implements PipeTransform {
  
  /**
   * 计算进度百分比
   * @param current 当前值
   * @param total 总值
   * @param decimals 小数位数，默认 0
   * @returns 格式化后的百分比字符串，如 "75%"
   */
  transform(current: number, total: number, decimals: number = 0): string {
    if (isNaN(current) || isNaN(total) || total === 0) return '0%';
    
    // [关键点] 最大不超过 100%
    const percentage = Math.min((current / total) * 100, 100);
    
    return `${percentage.toFixed(decimals)}%`;
  }
}

