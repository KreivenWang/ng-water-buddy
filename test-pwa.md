# PWA 功能测试指南

## 🧪 本地测试步骤

### 1. 启动本地 HTTPS 服务器
```bash
# 安装 http-server（如果还没有安装）
npm install -g http-server

# 启动 HTTPS 服务器
cd dist/ng-water-buddy
http-server -p 8080 -S -C cert.pem -K key.pem
```

### 2. 访问应用
打开浏览器访问：`https://localhost:8080`

### 3. PWA 功能测试清单

#### ✅ 安装提示测试
- [ ] 首次访问时是否显示安装提示横幅
- [ ] 点击"安装"按钮是否触发浏览器安装提示
- [ ] 点击"稍后"按钮是否隐藏提示
- [ ] 点击"关闭"按钮是否隐藏提示

#### ✅ 应用更新测试
- [ ] 修改代码后重新构建
- [ ] 访问应用是否显示更新提示
- [ ] 点击"立即更新"是否刷新页面
- [ ] 点击"稍后"是否隐藏提示

#### ✅ 离线功能测试
- [ ] 打开开发者工具 → Application → Service Workers
- [ ] 确认 Service Worker 已注册
- [ ] 切换到 Network 标签，选择"Offline"
- [ ] 刷新页面，应用是否仍可访问
- [ ] 检查缓存的资源是否正常加载

#### ✅ Manifest 测试
- [ ] 打开开发者工具 → Application → Manifest
- [ ] 确认 Manifest 信息正确显示
- [ ] 检查图标是否正常加载
- [ ] 验证应用名称和描述

### 4. 移动端测试

#### iPhone Safari 测试
1. 在 iPhone 上访问应用
2. 点击分享按钮 → "添加到主屏幕"
3. 确认应用图标显示正确
4. 从主屏幕启动应用，确认独立模式运行

#### Android Chrome 测试
1. 在 Android 设备上访问应用
2. 浏览器应显示"添加到主屏幕"横幅
3. 点击安装，确认应用添加到主屏幕
4. 启动应用，确认独立模式运行

### 5. Lighthouse PWA 审计
1. 打开开发者工具 → Lighthouse
2. 选择"Progressive Web App"类别
3. 点击"Generate report"
4. 目标：PWA 评分 ≥ 90

## 🐛 常见问题排查

### Service Worker 未注册
- 确认在生产环境中构建
- 检查 `environment.production` 是否为 `true`
- 确认应用运行在 HTTPS 环境

### 安装提示不显示
- 检查浏览器是否支持 PWA
- 确认应用已满足 PWA 安装条件
- 清除浏览器缓存后重试

### 图标不显示
- 确认图标文件存在于 `/assets/icons/` 目录
- 检查 Manifest 中的图标路径是否正确
- 验证图标文件格式和尺寸

## 📊 预期结果

### 成功指标
- ✅ 应用可安装到主屏幕
- ✅ 支持离线访问
- ✅ 自动更新检测
- ✅ Lighthouse PWA 评分 ≥ 90
- ✅ 在移动设备上正常运行

### 性能指标
- 首次加载时间 < 3 秒
- 离线加载时间 < 1 秒
- 应用大小 < 500KB（gzipped）
