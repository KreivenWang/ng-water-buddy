# 🚀 快速启动指南

## ⚠️ 前提条件检查

目前系统上**尚未安装** Node.js 和 Angular CLI，需要先完成环境安装。

---

## 📦 第一步：安装 Node.js

### 方式 1：使用 Homebrew（推荐 macOS）

```bash
# 1. 安装 Homebrew（如果还未安装）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. 安装 Node.js（包含 npm）
brew install node

# 3. 验证安装
node --version   # 应显示 v18.x.x 或更高
npm --version    # 应显示 9.x.x 或更高
```

### 方式 2：使用 nvm（更灵活）

```bash
# 1. 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 2. 重启终端，然后安装 Node.js LTS
nvm install 18
nvm use 18

# 3. 验证安装
node --version
npm --version
```

### 方式 3：官方下载

访问 [Node.js 官网](https://nodejs.org/) 下载安装包（推荐 LTS 版本）

---

## 🔧 第二步：安装项目依赖

```bash
# 1. 进入项目目录（如果还没有）
cd /Users/kreiven/Repo/ng-water-buddy

# 2. 安装项目依赖（可能需要 3-5 分钟）
npm install
```

**预期输出**：
```
added 1200+ packages in 3m
```

---

## 🎯 第三步：安装 Angular CLI（全局）

```bash
# 安装 Angular CLI
npm install -g @angular/cli@17

# 验证安装
ng version
```

**预期输出**：
```
Angular CLI: 17.x.x
Node: 18.x.x
Package Manager: npm 9.x.x
```

---

## 🚀 第四步：启动开发服务器

```bash
# 方式 1：使用 npm 脚本
npm start

# 方式 2：使用 ng 命令
ng serve

# 指定端口
ng serve --port 4200
```

**预期输出**：
```
✔ Browser application bundle generation complete.
Initial Chunk Files   | Names         |  Raw Size
main.js               | main          |   xxx KB |

✔ Compiled successfully.
✔ Browser application bundle generation complete.

** Angular Live Development Server is listening on localhost:4200 **
```

---

## 🌐 第五步：访问应用

打开浏览器访问：**http://localhost:4200**

---

## 📊 当前项目状态

### ✅ 已完成
- ✅ 完整的项目结构（100+ 文件）
- ✅ 所有模块骨架代码
- ✅ 路由配置（懒加载）
- ✅ 环境配置（开发/生产）
- ✅ PWA 配置文件
- ✅ TypeScript 配置
- ✅ Angular 配置

### ⏳ 待实现
- ⏳ LocalStorageAdapter 具体实现
- ⏳ 所有组件的业务逻辑（标记为 `TODO`）
- ⏳ PWA 图标和声音文件
- ⏳ 单元测试

---

## 🐛 常见问题

### 问题 1：`npm install` 失败

**解决方案**：
```bash
# 清理缓存
npm cache clean --force

# 删除 node_modules（如果存在）
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 问题 2：`ng` 命令找不到

**解决方案**：
```bash
# 确保 Angular CLI 已全局安装
npm install -g @angular/cli@17

# 或使用 npx
npx ng serve
```

### 问题 3：端口 4200 被占用

**解决方案**：
```bash
# 使用其他端口
ng serve --port 4201
```

### 问题 4：编译错误

**可能原因**：
- 某些 `TODO` 方法抛出错误导致编译失败
- 需要先实现基础的服务方法

**临时解决方案**：
将所有 `throw new Error('Method not implemented.');` 改为 `return of(null);` 或其他默认返回值。

---

## 📝 下一步开发建议

### 优先级 1：实现 LocalStorageAdapter
```
src/app/core/services/adapters/local-storage.adapter.ts
```
这是所有功能的基础，完成后可以测试整个应用流程。

### 优先级 2：实现家庭仪表盘
```
src/app/features/family-progress/
```
核心功能，用户第一眼看到的页面。

### 优先级 3：实现提醒功能
```
src/app/features/reminder/
```
增值功能，提升用户体验。

---

## 🔗 相关文档

- [README.md](./README.md) - 完整项目说明
- [PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md) - 项目结构详解
- [architecture.md](./architecture.md) - 架构设计文档

---

**创建时间**: 2025-10-03  
**预计首次启动耗时**: 5-10 分钟（安装依赖）  
**状态**: ✅ 配置文件已就绪，等待环境安装

