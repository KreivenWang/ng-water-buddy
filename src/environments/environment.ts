/**
 * 开发环境配置
 * 本地开发使用此配置
 */
export const environment = {
  production: false,
  
  // [关键点] 开发环境使用 LocalStorage 适配器
  useLocalStorage: true,
  
  // Supabase 配置（开发环境暂不使用）
  supabase: {
    url: '',
    anonKey: ''
  },
  
  // 应用配置
  app: {
    name: 'Water Buddy',
    version: '1.0.0'
  },
  
  // 提醒默认配置
  reminder: {
    defaultInterval: 1,      // 小时
    defaultStartHour: 8,     // 8:00
    defaultEndHour: 22,      // 22:00
    defaultAutoRecordAmount: 200  // ml
  },
  
  // 日志配置
  logging: {
    enabled: true,
    level: 'debug'
  }
};

