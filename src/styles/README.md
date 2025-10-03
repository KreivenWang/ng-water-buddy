# Weather App CSS 设计系统

完整的 CSS 设计系统，专为天气应用设计。支持深色模式、响应式设计和丰富的工具类。

## 📁 目录结构

```
src/styles/
├── tokens/              # 设计令牌 (Design Tokens)
│   ├── colors.css       # 颜色系统
│   ├── typography.css   # 字体系统
│   ├── spacing.css      # 间距系统
│   ├── shadows.css      # 阴影系统
│   ├── borders.css      # 边框/圆角系统
│   └── breakpoints.css  # 响应式断点
├── base/                # 基础样式
│   ├── reset.css        # CSS Reset
│   ├── global.css       # 全局样式
│   └── dark-mode.css    # 深色模式
├── utilities/           # 工具类
│   ├── spacing.css      # 间距工具类
│   ├── typography.css   # 字体工具类
│   ├── layout.css       # 布局工具类
│   ├── colors.css       # 颜色工具类
│   └── responsive.css   # 响应式工具类
├── design-system.css    # 主入口文件
└── README.md           # 本文档
```

## 🚀 快速开始

### 1. 引入设计系统

在 `angular.json` 中添加：

```json
"styles": [
  "src/styles/design-system.css"
]
```

或在 `styles.css` 中导入：

```css
@import './styles/design-system.css';
```

### 2. 使用工具类

```html
<div class="container p-4">
  <div class="bg-surface rounded-lg shadow-md p-6">
    <h1 class="text-2xl font-bold text-primary mb-4">天气预报</h1>
    <div class="flex items-center gap-4">
      <span class="text-6xl font-bold">25°</span>
      <span class="text-lg text-secondary">晴天</span>
    </div>
  </div>
</div>
```

### 3. 深色模式切换

```typescript
// 切换深色模式
document.documentElement.setAttribute('data-theme', 'dark');

// 切换浅色模式
document.documentElement.setAttribute('data-theme', 'light');
```

## 🎨 设计令牌

所有设计令牌都使用 CSS 自定义属性（CSS Variables），方便统一管理和主题切换。

### 颜色系统

- `--color-primary`: 主色调
- `--color-background`: 页面背景
- `--color-text-primary`: 主文字颜色
- `--color-sunny/cloudy/rainy/snowy/stormy`: 天气状态色

### 间距系统

基于 4px 的间距比例：
- `--spacing-1` (4px)
- `--spacing-2` (8px)
- `--spacing-4` (16px)
- `--spacing-6` (24px)
- 等等...

## 📱 响应式设计

移动端优先策略，使用以下断点：

- `sm`: >= 640px
- `md`: >= 768px  
- `lg`: >= 1024px
- `xl`: >= 1280px

```html
<!-- 移动端单列，平板2列，桌面3列 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- 内容 -->
</div>
```

## 💡 使用示例

查看各个 CSS 文件中的详细注释和使用说明。

---

Created for ng-water-buddy Weather App

