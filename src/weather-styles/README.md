# 天气应用 UI 设计系统

基于 Figma 设计稿还原的完整 CSS 样式系统，专为天气应用设计。

## 📁 文件结构

```
src/weather-styles/
├── variables.css              # CSS 变量定义
├── base.css                  # 基础样式和重置
├── layout.css                # 布局相关样式
├── components/
│   ├── weather-card.css      # 天气卡片组件
│   ├── button.css            # 按钮组件
│   └── icon.css              # 图标样式
├── responsive.css            # 响应式设计
├── weather-app.css           # 主样式文件（导入所有样式）
└── README.md                 # 本文档
```

## 🎨 设计规范

### 颜色系统

| 属性 | 变量名 | 值/描述 |
| :--- | :--- | :--- |
| 主渐变 | `--gradient-primary` | 径向渐变：紫蓝色系 |
| 主紫色 | `--color-primary-purple` | #45278b |
| 主蓝色 | `--color-primary-blue` | #2e335a |
| 主文本 | `--text-primary` | #ffffff |
| 次要文本 | `--text-secondary` | rgba(255, 255, 255, 0.8) |
| 第三文本 | `--text-tertiary` | rgba(255, 255, 255, 0.6) |
| 卡片背景 | `--bg-card` | rgba(255, 255, 255, 0.15) |
| 叠加背景 | `--bg-overlay` | rgba(255, 255, 255, 0.1) |

### 字体系统

| 属性 | 变量名 | 值 |
| :--- | :--- | :--- |
| 主字体 | `--font-family-primary` | 系统字体栈 |
| 等宽字体 | `--font-family-mono` | 等宽字体栈 |
| 基础字号 | `--font-size-base` | 16px |
| 大标题 | `--font-size-4xl` | 48px |
| 温度显示 | `--font-size-5xl` | 64px |

### 间距系统

| 属性 | 变量名 | 值 |
| :--- | :--- | :--- |
| 小间距 | `--spacing-sm` | 8px |
| 中等间距 | `--spacing-md` | 16px |
| 大间距 | `--spacing-lg` | 24px |
| 超大间距 | `--spacing-xxxl` | 100px |

### 圆角系统

| 属性 | 变量名 | 值 |
| :--- | :--- | :--- |
| 小圆角 | `--radius-sm` | 8px |
| 中等圆角 | `--radius-md` | 16px |
| 大圆角 | `--radius-lg` | 32px |
| 超大圆角 | `--radius-xl` | 88px |

## 🧩 组件使用

### 天气卡片 (Weather Card)

```html
<!-- 基础卡片 -->
<div class="weather-card">
  <div class="weather-card__header">
    <h3 class="weather-card__title">当前天气</h3>
  </div>
  <div class="weather-card__content">
    <div class="weather-card__body">
      <p>内容区域</p>
    </div>
  </div>
</div>

<!-- 当前天气卡片 -->
<div class="weather-card current-weather-card">
  <div class="temperature">25°C</div>
  <div class="condition">晴天</div>
</div>

<!-- 预报卡片 -->
<div class="weather-card forecast-card">
  <div class="day">今天</div>
  <div class="icon">☀️</div>
  <div class="temperature-range">
    <span class="temp-high">28°</span>
    <span class="temp-low">18°</span>
  </div>
</div>
```

### 按钮组件 (Button)

```html
<!-- 主要按钮 -->
<button class="btn btn--primary">主要按钮</button>

<!-- 次要按钮 -->
<button class="btn btn--secondary">次要按钮</button>

<!-- 文本按钮 -->
<button class="btn btn--text">文本按钮</button>

<!-- 图标按钮 -->
<button class="btn btn--icon">
  <span class="icon icon--md">⚙️</span>
</button>

<!-- 不同尺寸 -->
<button class="btn btn--primary btn--small">小按钮</button>
<button class="btn btn--primary btn--large">大按钮</button>

<!-- 圆形按钮 -->
<button class="btn btn--primary btn--circle">○</button>

<!-- 按钮组 -->
<div class="btn-group">
  <button class="btn btn--secondary">左</button>
  <button class="btn btn--secondary">中</button>
  <button class="btn btn--secondary">右</button>
</div>
```

### 图标组件 (Icon)

```html
<!-- 基础图标 -->
<span class="icon icon--md">🌤️</span>

<!-- 不同尺寸 -->
<span class="icon icon--xs">🌤️</span>
<span class="icon icon--sm">🌤️</span>
<span class="icon icon--lg">🌤️</span>
<span class="icon icon--xl">🌤️</span>
<span class="icon icon--2xl">🌤️</span>
<span class="icon icon--3xl">🌤️</span>

<!-- 不同颜色 -->
<span class="icon icon--md icon--primary">🌤️</span>
<span class="icon icon--md icon--secondary">🌤️</span>
<span class="icon icon--md icon--accent">☀️</span>

<!-- 天气图标 -->
<span class="icon icon--2xl weather-icon weather-icon--sun">☀️</span>
<span class="icon icon--2xl weather-icon weather-icon--cloud">☁️</span>
<span class="icon icon--2xl weather-icon weather-icon--rain">🌧️</span>

<!-- 图标容器 -->
<div class="icon-container icon-container--md">
  <span class="icon icon--md">🌤️</span>
</div>
```

## 📱 响应式设计

系统支持以下断点：

- **桌面端**: > 1024px
- **平板端**: 768px - 1024px
- **移动端**: 481px - 768px
- **小屏移动**: 320px - 480px
- **超小屏**: < 320px

### 响应式类名

```css
/* 在移动端自动调整 */
@media (max-width: 768px) {
  .weather-details {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .weather-details {
    grid-template-columns: 1fr;
  }
}
```

## 🎯 使用示例

### 完整天气应用布局

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>天气应用</title>
  <link rel="stylesheet" href="weather-app.css">
</head>
<body>
  <div class="weather-app">
    <div class="weather-container">
      <img src="assets/background.png" alt="背景" class="weather-background">
      
      <div class="weather-content">
        <!-- 头部 -->
        <div class="weather-header">
          <div class="weather-location">
            <h1 class="location-name">北京市</h1>
            <p class="location-date">2024年1月15日</p>
          </div>
          <div class="weather-menu">
            <button class="btn btn--icon">
              <span class="icon icon--md">⚙️</span>
            </button>
          </div>
        </div>
        
        <!-- 主要内容 -->
        <div class="weather-main">
          <div class="current-weather">
            <div class="weather-icon">
              <span class="icon icon--3xl weather-icon weather-icon--sun">☀️</span>
            </div>
            <div class="temperature-display">25°C</div>
            <div class="weather-condition">晴天</div>
          </div>
          
          <!-- 详情网格 -->
          <div class="weather-details">
            <div class="detail-item">
              <div class="detail-label">湿度</div>
              <div class="detail-value">65%</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">风速</div>
              <div class="detail-value">12 km/h</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">气压</div>
              <div class="detail-value">1013 hPa</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">能见度</div>
              <div class="detail-value">10 km</div>
            </div>
          </div>
        </div>
        
        <!-- 底部 -->
        <div class="weather-footer">
          <button class="btn btn--primary">刷新</button>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
```

## 🚀 快速开始

1. **引入样式文件**
   ```html
   <link rel="stylesheet" href="weather-app.css">
   ```

2. **使用基础结构**
   ```html
   <div class="weather-app">
     <div class="weather-container">
       <!-- 内容 -->
     </div>
   </div>
   ```

3. **添加组件**
   ```html
   <div class="weather-card">
     <div class="weather-card__content">
       <!-- 卡片内容 -->
     </div>
   </div>
   ```

## 🎨 自定义

### 修改主题色

在 `variables.css` 中修改颜色变量：

```css
:root {
  --color-primary-purple: #your-color;
  --color-primary-blue: #your-color;
}
```

### 添加新组件

1. 在 `components/` 目录下创建新的 CSS 文件
2. 在 `weather-app.css` 中导入新文件
3. 按照 BEM 命名规范编写样式

## 📝 注意事项

- 所有组件都支持响应式设计
- 使用 CSS 变量便于主题定制
- 遵循 BEM 命名规范
- 支持现代浏览器的 CSS 特性
- 包含完整的无障碍访问支持

## 🔧 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📄 许可证

MIT License
