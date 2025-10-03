/**
 * 生产环境配置
 * 部署时使用此配置
 */
export const environment = {
  production: true,
  
  // [关键点] 生产环境使用 Supabase 适配器
  useLocalStorage: false,
  
  // Supabase 配置（部署时需要填写）
  supabase: {
    url: 'https://your-project.supabase.co',
    anonKey: 'your-anon-key'
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
    enabled: false,
    level: 'error'
  }
};

