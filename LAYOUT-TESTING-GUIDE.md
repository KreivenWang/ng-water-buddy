# Layout 组件测试指南

本文档说明如何测试 Header 和 Bottom Nav 组件的 Design System 应用效果。

## 🚀 快速开始

### 1. 启动开发服务器

```bash
npm start
# 或
ng serve
```

访问：http://localhost:4200

---

## 🎨 功能测试清单

### ✅ Header Component 测试

#### 视觉检查
- [ ] **标题显示**：应显示 "Water Buddy"
- [ ] **背景色**：浅色模式为白色，深色模式为深灰色
- [ ] **阴影效果**：底部有轻微阴影
- [ ] **固定定位**：滚动页面时 Header 始终固定在顶部

#### 响应式测试
1. **移动端 (< 768px)**
   - [ ] 高度：56px
   - [ ] 标题字号：20px (--font-size-xl)
   - [ ] 左右内边距：16px

2. **平板 (768px - 1023px)**
   - [ ] 左右内边距：24px
   - [ ] 标题字号：24px (--font-size-2xl)

3. **桌面端 (≥ 1024px)**
   - [ ] 高度：64px
   - [ ] 标题字号：30px (--font-size-3xl)
   - [ ] 左右内边距：32px
   - [ ] 阴影增强（更明显）

#### 深色模式测试
在浏览器控制台执行：
```javascript
// 切换到深色模式
document.documentElement.setAttribute('data-theme', 'dark');

// 切换回浅色模式
document.documentElement.setAttribute('data-theme', 'light');
```

检查项：
- [ ] 背景色自动切换
- [ ] 文字颜色自动切换
- [ ] 边框和阴影适配深色模式

---

### ✅ Bottom Nav Component 测试

#### 视觉检查
- [ ] **导航项数量**：3 个（仪表盘、提醒、设置）
- [ ] **图标显示**：Ionicons 图标正确加载
- [ ] **未激活状态**：灰色轮廓图标 + 灰色文字
- [ ] **激活状态**：蓝色实心图标 + 蓝色文字 + 半透明背景

#### 动画效果测试
1. **点击导航项**
   - [ ] 点击时缩小效果 (scale 0.92)
   - [ ] 松开后恢复
   
2. **激活状态切换**
   - [ ] 图标从轮廓变为实心
   - [ ] 图标放大 + 弹跳动画
   - [ ] 背景色淡入
   - [ ] 文字颜色变为主色调
   - [ ] 文字轻微放大

3. **悬停效果（桌面端）**
   - [ ] 鼠标悬停时背景色变化
   - [ ] 轻微向上移动

#### 响应式测试
1. **移动端 (< 768px)**
   - [ ] 底部固定显示
   - [ ] 图标大小：24px
   - [ ] 文字大小：12px (--font-size-xs)
   - [ ] 最小可点击区域：64x48px

2. **平板 (768px - 1023px)**
   - [ ] 图标大小增加：26px
   - [ ] 文字大小：14px (--font-size-sm)
   - [ ] 间距增加

3. **桌面端 (≥ 1024px)**
   - [ ] **完全隐藏**（display: none）

#### 深色模式测试
```javascript
// 切换到深色模式
document.documentElement.setAttribute('data-theme', 'dark');
```

检查项：
- [ ] 背景色自动切换为深色
- [ ] 未激活图标颜色适配
- [ ] 激活状态背景色调整
- [ ] 阴影增强

#### 无障碍性测试
1. **键盘导航**
   - [ ] 按 Tab 键可以聚焦到导航项
   - [ ] 焦点样式清晰可见（蓝色轮廓）
   - [ ] 按 Enter 可以激活导航

2. **屏幕阅读器**
   - [ ] 导航项有正确的 aria-label
   - [ ] 激活状态有 aria-current="page"

---

## 🎯 浏览器兼容性测试

### 推荐测试浏览器
- [ ] Chrome (最新版)
- [ ] Safari (最新版)
- [ ] Firefox (最新版)
- [ ] Edge (最新版)

### 移动端测试
- [ ] iOS Safari
- [ ] Android Chrome

---

## 🛠️ 开发者工具测试方法

### 1. 响应式设计模式
1. 打开 Chrome DevTools (F12)
2. 点击 "Toggle device toolbar" (Ctrl/Cmd + Shift + M)
3. 选择不同设备预设：
   - iPhone 12 Pro (390x844)
   - iPad Pro (1024x1366)
   - Desktop (1920x1080)

### 2. 深色模式快速切换
在 Chrome DevTools 中：
1. 打开 DevTools (F12)
2. 按 Ctrl/Cmd + Shift + P 打开命令面板
3. 输入 "dark" 找到 "Emulate CSS prefers-color-scheme: dark"
4. 或在控制台直接执行：
   ```javascript
   document.documentElement.setAttribute('data-theme', 'dark');
   ```

### 3. 性能测试
1. 打开 Chrome DevTools > Performance 标签
2. 开始录制
3. 在 Bottom Nav 中快速切换导航
4. 停止录制
5. 检查：
   - [ ] 动画帧率应保持在 60fps
   - [ ] 无明显的布局抖动 (Layout Shift)

---

## 🐛 已知问题和注意事项

### Header Component
- ⚠️ **页面内容遮挡问题**：由于 Header 固定在顶部，页面内容需要添加 `padding-top: 56px` (移动端) 或 `64px` (桌面端) 避免被遮挡。

### Bottom Nav Component
- ⚠️ **页面内容遮挡问题**：由于 Bottom Nav 固定在底部，页面内容需要添加 `padding-bottom: 64px` 左右的空间。

### 建议的主容器样式
```css
.main-content {
  padding-top: 56px;  /* Header 高度 */
  padding-bottom: 64px; /* Bottom Nav 高度 + 安全间距 */
  min-height: 100vh;
}

@media (min-width: 1024px) {
  .main-content {
    padding-top: 64px;  /* 桌面端 Header 更高 */
    padding-bottom: 0;  /* 桌面端没有 Bottom Nav */
  }
}
```

---

## 📊 Design Tokens 验证

### 验证方法
在浏览器控制台执行：
```javascript
// 检查 CSS 变量是否正确加载
const styles = getComputedStyle(document.documentElement);

console.log('主色调:', styles.getPropertyValue('--color-primary'));
console.log('间距-4:', styles.getPropertyValue('--spacing-4'));
console.log('字体-xl:', styles.getPropertyValue('--font-size-xl'));
console.log('阴影-sm:', styles.getPropertyValue('--shadow-sm'));
console.log('圆角-lg:', styles.getPropertyValue('--radius-lg'));
console.log('Header z-index:', styles.getPropertyValue('--z-index-header'));
console.log('Bottom Nav z-index:', styles.getPropertyValue('--z-index-bottom-nav'));
```

### 预期输出
```
主色调: #4A90E2
间距-4: 16px
字体-xl: 20px
阴影-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
圆角-lg: 12px
Header z-index: 50
Bottom Nav z-index: 40
```

---

## ✅ 测试通过标准

### Header Component
- ✅ 所有响应式断点样式正确
- ✅ 深色模式自动切换
- ✅ 固定定位无抖动
- ✅ 无 linter 错误

### Bottom Nav Component
- ✅ 所有导航项可点击
- ✅ 激活状态动画流畅（弹跳 + 放大）
- ✅ 点击反馈明显（缩小效果）
- ✅ 图标正确切换（轮廓 ↔ 实心）
- ✅ 桌面端正确隐藏
- ✅ 深色模式自动切换
- ✅ 键盘导航可用
- ✅ 无 linter 错误

---

## 📝 反馈和改进

如果发现任何问题，请记录：
1. 浏览器和版本
2. 设备类型（移动端/平板/桌面）
3. 问题描述和截图
4. 复现步骤

---

Created: 2025-10-03
Updated: 2025-10-03

