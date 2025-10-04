# Water Buddy - 家庭喝水管理 PWA

帮助全家养成健康喝水习惯的渐进式 Web 应用。

## 📦 环境要求

- **Node.js**: 18.x 或更高版本
- **npm**: 9.x 或更高版本
- **Angular CLI**: 17.x

## 🚀 快速开始

### 1. 安装 Node.js 和 npm

#### macOS (使用 Homebrew)
```bash
# 安装 Homebrew（如果还未安装）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 Node.js（包含 npm）
brew install node

# 验证安装
node --version
npm --version
```

#### 或使用 nvm（推荐）
```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重启终端，然后安装 Node.js
nvm install 18
nvm use 18

# 验证安装
node --version
npm --version
```

### 2. 安装项目依赖

```bash
cd ng-water-buddy
npm install
```

### 3. 安装 Angular CLI（全局）

```bash
npm install -g @angular/cli@17
```

### 4. 启动开发服务器

```bash
npm start
# 或
ng serve
```

应用将在 `http://localhost:4200` 运行。

### 5. 构建生产版本

```bash
npm run build:prod
```

生产文件将输出到 `dist/ng-water-buddy/` 目录。

## 📂 项目结构

详细的项目结构说明请查看 [`PROJECT-STRUCTURE.md`](./PROJECT-STRUCTURE.md)。

```
src/app/
├── core/           # 核心模块（全局单例服务）
├── shared/         # 共享模块（可复用组件、管道）
├── features/       # 功能模块（业务功能）
├── layout/         # 布局模块
└── models/         # 数据模型
```

## 🎯 主要功能

- ✅ **家庭成员管理**：添加、编辑、删除家庭成员
- ✅ **喝水记录**：快速记录喝水量（200ml/500ml/750ml）
- ✅ **进度可视化**：环形进度条、水杯动画
- ✅ **定时提醒**：每小时提醒喝水（可自定义）
- ✅ **历史记录**：查看每日喝水历史
- ✅ **PWA 支持**：离线使用、添加到主屏幕

## 🛠️ 技术栈

- **框架**: Angular 17
- **语言**: TypeScript 5.2
- **状态管理**: RxJS
- **UI**: 自定义设计系统（基于现有天气应用）
- **PWA**: Angular Service Worker
- **存储**: LocalStorage（开发）/ Supabase（生产）

## 📱 PWA 功能

### 本地测试 PWA

1. 构建生产版本：
   ```bash
   npm run build:prod
   ```

2. 安装 http-server：
   ```bash
   npm install -g http-server
   ```

3. 启动服务器：
   ```bash
   cd dist/ng-water-buddy
   http-server -p 8080
   ```

4. 在浏览器中访问 `http://localhost:8080`

### iPhone 安装测试

1. 使用 Safari 浏览器访问应用
2. 点击分享按钮
3. 选择"添加到主屏幕"
4. 确认安装

## 🔧 开发指南

### 当前状态

- ✅ 项目结构已完成
- ✅ 所有模块骨架已创建
- ✅ 路由配置已完成
- ✅ 环境配置已完成
- ⏳ 具体功能待实现（所有 `TODO` 标记）

### 推荐开发顺序

1. **实现 LocalStorageAdapter**
   - 文件：`src/app/core/services/adapters/local-storage.adapter.ts`
   - 功能：CRUD 操作、UUID 生成、邀请码生成

2. **实现家庭仪表盘**
   - 容器：`src/app/features/family-progress/containers/family-dashboard.component.ts`
   - 组件：进度总览、成员列表

3. **实现提醒功能**
   - 服务：`notification.service.ts`, `audio.service.ts`
   - 页面：`reminder-page.component.ts`

4. **添加资源文件**
   - PWA 图标：`src/assets/icons/`
   - 提醒声音：`src/assets/sounds/`

## 📚 相关文档

- [项目架构设计](./architecture.md)
- [后端架构设计](./backend-architecture.md)
- [项目结构说明](./PROJECT-STRUCTURE.md)

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 License

MIT License

## 👨‍💻 作者

kreiven

---

**最后更新**: 2025-10-04

