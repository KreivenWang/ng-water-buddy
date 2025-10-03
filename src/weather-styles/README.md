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
├── weather-app-advanced.css  # 高级设计稿样式（复杂布局）
├── color-system.css          # 精确配色系统（基于设计稿40-2621）
├── color-showcase.html       # 配色系统展示页面
├── homepage.html             # 主页面（基于设计稿50-1648）
├── homepage.css              # 主页面专用样式
├── complete-example.html     # 完整样式示例（推荐查看）
├── assets/                   # 设计稿资源文件
│   ├── 611b99ce-9481-43b2-a2af-4debe292fe4b.png  # 基础背景图
│   ├── e41b3318-5f3f-4ae3-9d7d-047bff41c0ce.png  # 侧边栏背景
│   ├── 3c7d24d9-1493-45b4-ba4f-731e7c1cd30a.png  # 天气图标
│   └── [其他资源文件...]     # 更多设计稿资源
└── README.md                 # 本文档
```

## 🎨 设计规范

### 颜色系统

#### 基础配色（原始设计稿）
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

#### 精确配色系统（基于设计稿40-2621）

**浅色主题 (Light Theme)**
| 类别 | 变量名 | 色值 | 用途 |
| :--- | :--- | :--- | :--- |
| 主背景 | `--light-bg-primary` | #F4F7FB | 页面主背景色 |
| 主文本 | `--light-text-primary` | #000000 | 主要文本颜色 |
| 次要色 | `--light-secondary` | #3C3C43 | 次要元素颜色 |

**深色主题 (Dark Theme)**
| 类别 | 变量名 | 色值 | 用途 |
| :--- | :--- | :--- | :--- |
| 主背景 | `--dark-bg-primary` | #312B5B | 页面主背景色 |
| 主文本 | `--dark-text-primary` | #FFFFFF | 主要文本颜色 |
| 次要色 | `--dark-secondary` | #EBEBF5 | 次要元素颜色 |

**自动主题切换**
| 变量名 | 浅色主题值 | 深色主题值 | 说明 |
| :--- | :--- | :--- | :--- |
| `--bg-primary` | #F4F7FB | #312B5B | 自动切换的主背景 |
| `--text-primary` | #000000 | #FFFFFF | 自动切换的主文本 |
| `--color-primary` | #000000 | #FFFFFF | 自动切换的主色调 |

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

### 基础设计稿使用

1. **引入样式文件**
   ```html
   <link rel="stylesheet" href="weather-app.css">
   ```

### 高级设计稿使用

1. **引入高级样式文件**
   ```html
   <link rel="stylesheet" href="weather-app-advanced.css">
   ```

### 精确配色系统使用

1. **引入配色系统**
   ```html
   <link rel="stylesheet" href="color-system.css">
   ```

2. **使用配色变量**
   ```css
   .my-component {
     background-color: var(--bg-primary);
     color: var(--text-primary);
     border: 1px solid var(--border-primary);
   }
   ```

3. **主题切换**
   ```javascript
   // 切换到深色主题
   document.documentElement.setAttribute('data-theme', 'dark');
   
   // 切换到浅色主题
   document.documentElement.setAttribute('data-theme', 'light');
   
   // 移除主题设置，使用系统默认
   document.documentElement.removeAttribute('data-theme');
   ```

4. **查看配色展示**
   ```bash
   # 在浏览器中打开配色展示页面
   open color-showcase.html
   ```

### 主页面使用

1. **查看主页面**
   ```bash
   # 在浏览器中打开主页面
   open homepage.html
   ```

2. **主页面特性**
   - 基于Figma设计稿50-1648精确还原
   - 径向渐变背景效果
   - 完整的天气信息展示
   - 小时预报和周预报
   - 底部导航栏
   - 响应式设计
   - 实时时间显示
   - 交互式元素

3. **主页面结构**
   - 状态栏（时间、信号等）
   - 位置信息显示
   - 当前天气大图显示
   - 天气详情卡片
   - 小时预报横向滚动
   - 周预报列表
   - 底部导航栏

### 完整样式示例（推荐）

1. **查看完整示例**
   ```bash
   # 在浏览器中打开完整样式示例
   open complete-example.html
   ```

2. **示例包含内容**
   - 🎨 **配色系统展示** - 完整的颜色调色板
   - 🔘 **按钮组件** - 所有按钮样式和变体
   - 🌤️ **天气卡片** - 各种类型的卡片组件
   - 🎯 **图标组件** - 不同尺寸和样式的图标
   - 📐 **布局系统** - 网格和布局示例
   - 📱 **响应式设计** - 自适应布局演示
   - 🛠️ **工具类** - 常用辅助样式
   - 📖 **使用说明** - 代码示例和文档

3. **交互功能**
   - 实时主题切换
   - 屏幕宽度显示
   - 按钮点击效果
   - 卡片悬停动画
   - 响应式布局演示

2. **使用高级布局结构**
   ```html
   <div class="weather-app-advanced">
     <!-- 左侧边栏 -->
     <div class="weather-sidebar">
       <img src="assets/e41b3318-5f3f-4ae3-9d7d-047bff41c0ce.png" 
            class="weather-sidebar-background" alt="侧边栏背景">
     </div>
     
     <!-- 中间内容 -->
     <div class="weather-main-content">
       <div class="weather-icon-display">
         <img src="assets/3c7d24d9-1493-45b4-ba4f-731e7c1cd30a.png" 
              class="weather-icon-large" alt="天气图标">
       </div>
       
       <div class="weather-info-card">
         <!-- 天气信息卡片 -->
       </div>
     </div>
     
     <!-- 右侧内容 -->
     <div class="weather-right-content">
       <!-- 状态栏、搜索、天气详情等 -->
     </div>
   </div>
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
