# 💎 Angular 架构方案：家庭喝水管理 PWA（Water Buddy）

---

## 📋 需求分析与功能拆解

### 核心功能模块
1. **个人喝水提醒模块** (`features/reminder/`)
   - 定时声音提醒
   - 提醒时间自定义设置
   - 声音类型选择（水滴声、铃声等）
   - 提醒开关控制

2. **家庭进度管理模块** (`features/family-progress/`)
   - 家庭成员管理（添加、编辑、删除成员）
   - 每日喝水目标设置（成人建议2000ml）
   - 喝水记录快速添加（200ml、500ml 快捷按钮）
   - 进度可视化（环形进度条、水杯动画）
   - 历史记录查看（日历视图）

3. **持久化与数据管理** (`core/services/`)
   - LocalStorage/IndexedDB 存储
   - PWA Cache API 离线支持
   - 数据导出/导入（备份功能）

4. **PWA 基础设施** (`core/`)
   - Service Worker 配置
   - 通知权限管理
   - 离线页面支持
   - 添加到主屏幕引导

---

## 🎯 项目结构规划

### 1.1 完整文件组织

```
ng-water-buddy/
├── src/
│   ├── app/
│   │   ├── core/                          # 核心模块（全局单例）
│   │   │   ├── services/
│   │   │   │   ├── storage.service.ts     # 本地存储服务
│   │   │   │   ├── notification.service.ts # 通知/提醒服务
│   │   │   │   ├── audio.service.ts       # 声音播放服务
│   │   │   │   └── pwa.service.ts         # PWA 安装/更新服务
│   │   │   ├── guards/
│   │   │   │   └── notification-permission.guard.ts # 通知权限守卫
│   │   │   └── core.module.ts
│   │   │
│   │   ├── shared/                        # 共享模块
│   │   │   ├── components/
│   │   │   │   ├── water-wave/            # 水波动画组件
│   │   │   │   ├── progress-ring/         # 环形进度条组件
│   │   │   │   ├── water-cup/             # 水杯图标组件
│   │   │   │   ├── quick-add-buttons/     # 快捷添加按钮组
│   │   │   │   └── family-member-card/    # 家庭成员卡片
│   │   │   ├── pipes/
│   │   │   │   ├── ml-to-liter.pipe.ts    # 毫升转升
│   │   │   │   └── progress-percent.pipe.ts # 进度百分比
│   │   │   └── shared.module.ts
│   │   │
│   │   ├── features/
│   │   │   ├── reminder/                  # 提醒功能模块
│   │   │   │   ├── components/
│   │   │   │   │   ├── reminder-settings.component.ts  # 提醒设置表单
│   │   │   │   │   └── sound-picker.component.ts       # 声音选择器
│   │   │   │   ├── containers/
│   │   │   │   │   └── reminder-page.component.ts      # 提醒页面容器
│   │   │   │   ├── services/
│   │   │   │   │   └── reminder.service.ts             # 提醒业务逻辑
│   │   │   │   ├── models/
│   │   │   │   │   └── reminder-config.interface.ts    # 提醒配置接口
│   │   │   │   ├── reminder.module.ts
│   │   │   │   └── reminder-routing.module.ts
│   │   │   │
│   │   │   ├── family-progress/          # 家庭进度模块
│   │   │   │   ├── components/
│   │   │   │   │   ├── progress-overview.component.ts  # 进度总览
│   │   │   │   │   ├── member-list.component.ts        # 成员列表
│   │   │   │   │   ├── add-water-modal.component.ts    # 添加喝水弹窗
│   │   │   │   │   └── history-calendar.component.ts   # 历史日历
│   │   │   │   ├── containers/
│   │   │   │   │   └── family-dashboard.component.ts   # 家庭仪表盘容器
│   │   │   │   ├── services/
│   │   │   │   │   ├── family.service.ts               # 家庭成员管理
│   │   │   │   │   └── water-record.service.ts         # 喝水记录管理
│   │   │   │   ├── models/
│   │   │   │   │   ├── family-member.interface.ts
│   │   │   │   │   └── water-record.interface.ts
│   │   │   │   ├── family-progress.module.ts
│   │   │   │   └── family-progress-routing.module.ts
│   │   │   │
│   │   │   └── settings/                 # 设置模块
│   │   │       ├── components/
│   │   │       │   ├── theme-toggle.component.ts      # 主题切换
│   │   │       │   └── data-export.component.ts       # 数据导出
│   │   │       ├── containers/
│   │   │       │   └── settings-page.component.ts
│   │   │       ├── settings.module.ts
│   │   │       └── settings-routing.module.ts
│   │   │
│   │   ├── layout/                       # 布局模块
│   │   │   ├── header/
│   │   │   │   └── header.component.ts   # 顶部导航栏
│   │   │   ├── bottom-nav/
│   │   │   │   └── bottom-nav.component.ts # 底部导航（移动端）
│   │   │   └── layout.module.ts
│   │   │
│   │   ├── app.component.ts
│   │   ├── app-routing.module.ts
│   │   └── app.module.ts
│   │
│   ├── assets/
│   │   ├── sounds/                       # 提醒声音文件
│   │   │   ├── water-drop.mp3
│   │   │   ├── gentle-bell.mp3
│   │   │   └── chime.mp3
│   │   ├── icons/                        # PWA 图标
│   │   │   ├── icon-72x72.png
│   │   │   ├── icon-96x96.png
│   │   │   ├── icon-128x128.png
│   │   │   ├── icon-192x192.png
│   │   │   └── icon-512x512.png
│   │   └── animations/                   # Lottie 动画 JSON（可选）
│   │       └── water-wave.json
│   │
│   ├── styles/                           # 现有设计系统（已存在）
│   │   └── ...
│   │
│   ├── manifest.webmanifest              # PWA Manifest
│   └── ngsw-config.json                  # Service Worker 配置
│
├── angular.json
├── package.json
└── tsconfig.json
```

---

### 1.2 模块依赖关系

| 模块 | 依赖 | 提供内容 | 懒加载 |
|:-----|:-----|:---------|:-------|
| **CoreModule** | - | 全局服务（Storage、Notification、Audio、PWA） | ❌ |
| **SharedModule** | - | 可复用组件、管道 | ❌ |
| **LayoutModule** | Shared | 导航栏、底部菜单 | ❌ |
| **ReminderModule** | Core, Shared | 提醒设置页面 | ✅ |
| **FamilyProgressModule** | Core, Shared | 家庭进度仪表盘 | ✅ |
| **SettingsModule** | Core, Shared | 设置页面 | ✅ |

---

## 🗺️ 路由规划

### 2.1 路由表设计

| 路由路径 | 模块 | 页面标题 | 权限控制 | 预加载 |
|:---------|:-----|:---------|:---------|:-------|
| `/` | Redirect to `/dashboard` | - | - | - |
| `/dashboard` | FamilyProgressModule | 家庭仪表盘 | - | 立即加载 |
| `/reminder` | ReminderModule | 喝水提醒 | NotificationPermissionGuard | 空闲预加载 |
| `/settings` | SettingsModule | 设置 | - | 空闲预加载 |

### 2.2 底部导航栏（移动端）

```
┌─────────────────────────────────────┐
│     [仪表盘]  [提醒]  [设置]        │
└─────────────────────────────────────┘
```

---

## 📊 数据模型设计

### 3.1 核心接口定义

```typescript
// models/family.interface.ts
export interface Family {
  id: string;                    // UUID
  name: string;                  // 家庭名称
  inviteCode: string;            // 邀请码（6位大写字母数字）
  createdAt: Date;
  updatedAt: Date;
}

// models/family-member.interface.ts
export interface FamilyMember {
  id: string;                    // UUID
  familyId: string;              // 关联家庭 ID
  name: string;                  // 成员名称
  avatar: string;                // 头像（emoji，如 '👤'）
  avatarBgColor: string;         // 头像背景色（如 '#FF6B6B'）
  dailyGoal: number;             // 每日目标（毫升），默认 2000
  createdAt: Date;
  updatedAt: Date;
}

// 预设头像颜色
export const AVATAR_COLORS = [
  '#FF6B6B', // 红色
  '#4ECDC4', // 青色
  '#45B7D1', // 蓝色
  '#FFA07A', // 橙色
  '#98D8C8', // 绿色
  '#F7DC6F', // 黄色
  '#BB8FCE', // 紫色
  '#85C1E2'  // 浅蓝
];

// 预设头像 Emoji
export const AVATAR_EMOJIS = [
  '👤', '👨', '👩', '🧑', '👶', '👧', '👦', '🧒', '👴', '👵'
];

// models/water-record.interface.ts
export interface WaterRecord {
  id: string;
  memberId: string;              // 关联成员 ID
  amount: number;                // 喝水量（毫升）
  recordedAt: Date;              // 记录时间
  synced?: boolean;              // 是否已同步到云端（Supabase）
}

// models/reminder-config.interface.ts
export interface ReminderConfig {
  enabled: boolean;              // 是否启用提醒
  interval: number;              // 提醒间隔（小时），默认 1
  startHour: number;             // 开始时间（小时），默认 8
  endHour: number;               // 结束时间（小时），默认 22
  soundType: 'water-drop' | 'bell' | 'chime';
  vibrate: boolean;              // 是否震动
  autoRecordAmount: number;      // "已喝完"自动记录的水量（毫升），默认 200
}

// models/daily-summary.interface.ts
export interface DailySummary {
  date: string;                  // YYYY-MM-DD
  memberRecords: {               // 成员ID -> 记录汇总
    [memberId: string]: {
      memberId: string;
      memberName: string;
      avatar: string;
      avatarBgColor: string;
      dailyGoal: number;
      totalAmount: number;
      percentage: number;         // 0-100
      recordCount: number;
      records: WaterRecord[];
    };
  };
}

// models/app-state.interface.ts（本地应用状态）
export interface AppState {
  currentFamilyId: string | null;
  currentMemberId: string | null;
  inviteCode: string | null;      // 当前家庭的邀请码
  lastSyncTime: Date | null;       // 最后同步时间（Supabase）
  isFirstLaunch: boolean;          // 是否首次启动
}
```

---

## 🛠️ 核心服务设计

### 4.1 StorageService（数据持久化 - 适配器模式）

**职责**：统一管理数据存储，支持多种存储后端

**实现方案**：采用**适配器模式**，轻松切换 LocalStorage ↔ Supabase

#### 抽象接口定义

```typescript
// core/interfaces/storage-adapter.interface.ts
export interface IStorageAdapter {
  // 家庭管理
  createFamily(name: string, creatorName: string, creatorAvatar: string): Observable<{
    familyId: string;
    memberId: string;
    inviteCode: string;
  }>;
  joinFamily(inviteCode: string, memberName: string, memberAvatar: string): Observable<{
    familyId: string;
    memberId: string;
  }>;
  getFamily(familyId: string): Observable<Family>;
  
  // 成员管理
  getMembers(familyId: string): Observable<FamilyMember[]>;
  addMember(member: FamilyMember): Observable<FamilyMember>;
  updateMember(id: string, data: Partial<FamilyMember>): Observable<void>;
  deleteMember(id: string): Observable<void>;
  
  // 喝水记录
  getRecordsByDate(memberId: string, date: string): Observable<WaterRecord[]>;
  addRecord(record: WaterRecord): Observable<WaterRecord>;
  deleteRecord(id: string): Observable<void>;
  getTodaySummary(familyId: string): Observable<DailySummary>;
  
  // 提醒配置
  getReminderConfig(memberId: string): Observable<ReminderConfig>;
  saveReminderConfig(memberId: string, config: ReminderConfig): Observable<void>;
}
```

#### LocalStorage 实现（阶段1 - 开发测试）

```typescript
// core/services/adapters/local-storage.adapter.ts
@Injectable()
export class LocalStorageAdapter implements IStorageAdapter {
  private readonly STORAGE_KEYS = {
    FAMILIES: 'wb_families',
    MEMBERS: 'wb_members',
    RECORDS: 'wb_records',
    REMINDERS: 'wb_reminders'
  };
  
  createFamily(name: string, creatorName: string, creatorAvatar: string): Observable<{
    familyId: string;
    memberId: string;
    inviteCode: string;
  }> {
    const familyId = this.generateUUID();
    const memberId = this.generateUUID();
    const inviteCode = this.generateInviteCode();
    
    // 保存到 LocalStorage
    const family = { id: familyId, name, inviteCode, createdAt: new Date() };
    const member = { id: memberId, familyId, name: creatorName, avatar: creatorAvatar, dailyGoal: 2000 };
    
    this.saveToStorage(this.STORAGE_KEYS.FAMILIES, [family]);
    this.saveToStorage(this.STORAGE_KEYS.MEMBERS, [member]);
    
    return of({ familyId, memberId, inviteCode });
  }
  
  // ... 其他方法实现
  
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  private generateInviteCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }
  
  private saveToStorage(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }
  
  private getFromStorage<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
}
```

#### Supabase 实现（阶段2 - 生产环境）

```typescript
// core/services/adapters/supabase.adapter.ts
@Injectable()
export class SupabaseAdapter implements IStorageAdapter {
  constructor(private supabase: SupabaseService) {}
  
  createFamily(name: string, creatorName: string, creatorAvatar: string): Observable<{
    familyId: string;
    memberId: string;
    inviteCode: string;
  }> {
    return from(
      this.supabase.callFunction('create_family', {
        family_name: name,
        creator_name: creatorName,
        creator_avatar: creatorAvatar
      })
    ).pipe(
      map(result => ({
        familyId: result.family_id,
        memberId: result.member_id,
        inviteCode: result.invite_code
      }))
    );
  }
  
  // ... 其他方法实现（参考 backend-architecture.md）
}
```

#### StorageService（统一门面）

```typescript
// core/services/storage.service.ts
@Injectable({ providedIn: 'root' })
export class StorageService {
  constructor(
    @Inject('STORAGE_ADAPTER') private adapter: IStorageAdapter
  ) {}
  
  // 直接委托给适配器
  createFamily = this.adapter.createFamily.bind(this.adapter);
  joinFamily = this.adapter.joinFamily.bind(this.adapter);
  getMembers = this.adapter.getMembers.bind(this.adapter);
  addMember = this.adapter.addMember.bind(this.adapter);
  // ... 其他方法
}
```

#### 环境切换配置

```typescript
// app.module.ts
import { environment } from '../environments/environment';

@NgModule({
  providers: [
    {
      provide: 'STORAGE_ADAPTER',
      useClass: environment.production ? SupabaseAdapter : LocalStorageAdapter
    }
  ]
})
export class AppModule { }
```

---

### 4.2 NotificationService（通知提醒 - 交互式）

**职责**：管理定时提醒、通知权限、提醒后交互

**实现方案**：
- 使用 **Web Notifications API**
- 结合 **Service Worker** 实现后台通知
- iOS Safari 特殊处理（需用户添加到主屏幕后才支持通知）

**提醒流程**：

```
每1小时 → 触发通知 → 用户点击 → 弹窗交互
                                    ↓
                    ┌───────────────┼───────────────┐
                    ↓               ↓               ↓
                已喝完           稍后提醒          忽略
              (添加200ml)       (15分钟后)      (关闭)
```

**关键方法**：
```typescript
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private reminderInterval: any;
  private snoozeTimer: any;
  
  /**
   * 请求通知权限
   */
  requestPermission(): Observable<NotificationPermission> {
    return from(Notification.requestPermission());
  }
  
  /**
   * 启动提醒
   * @param config 提醒配置（间隔、开始/结束时间）
   */
  startReminders(config: ReminderConfig): void {
    this.cancelAllReminders();
    
    // 每1小时提醒
    this.reminderInterval = setInterval(() => {
      const now = new Date();
      const hour = now.getHours();
      
      // 检查是否在提醒时段内（如 8:00-22:00）
      if (hour >= config.startHour && hour <= config.endHour) {
        this.showReminderNotification();
      }
    }, 60 * 60 * 1000); // 1小时
  }
  
  /**
   * 显示提醒通知
   */
  private showReminderNotification(): void {
    const notification = new Notification('该喝水啦！💧', {
      body: '保持健康，记得补充水分',
      icon: '/assets/icons/icon-192x192.png',
      badge: '/assets/icons/badge-72x72.png',
      tag: 'water-reminder',
      requireInteraction: true, // 需要用户交互才关闭
      actions: [
        { action: 'confirm', title: '已喝完' },
        { action: 'snooze', title: '稍后提醒' },
        { action: 'dismiss', title: '忽略' }
      ]
    });
    
    notification.onclick = () => {
      // 打开应用并显示交互弹窗
      this.handleNotificationClick();
    };
  }
  
  /**
   * 处理通知点击
   */
  private handleNotificationClick(): void {
    // 通过 Router 导航并打开弹窗
    // 或发送事件给应用层处理
    this.onReminderClicked.emit();
  }
  
  /**
   * 稍后提醒（15分钟后）
   */
  snoozeReminder(): void {
    this.snoozeTimer = setTimeout(() => {
      this.showReminderNotification();
    }, 15 * 60 * 1000); // 15分钟
  }
  
  /**
   * 取消所有提醒
   */
  cancelAllReminders(): void {
    if (this.reminderInterval) {
      clearInterval(this.reminderInterval);
      this.reminderInterval = null;
    }
    if (this.snoozeTimer) {
      clearTimeout(this.snoozeTimer);
      this.snoozeTimer = null;
    }
  }
  
  // 事件发射器，用于通知应用层
  onReminderClicked = new EventEmitter<void>();
}
```

**提醒配置模型更新**：
```typescript
// models/reminder-config.interface.ts
export interface ReminderConfig {
  enabled: boolean;              // 是否启用提醒
  interval: number;              // 提醒间隔（小时），默认 1
  startHour: number;             // 开始时间（小时），默认 8
  endHour: number;               // 结束时间（小时），默认 22
  soundType: 'water-drop' | 'bell' | 'chime';
  vibrate: boolean;              // 是否震动
  autoRecordAmount: number;      // "已喝完"自动记录的水量，默认 200ml
}
```

**交互弹窗组件**：
```typescript
// shared/components/reminder-action-dialog/reminder-action-dialog.component.ts
@Component({
  selector: 'app-reminder-action-dialog',
  template: `
    <div class="dialog-overlay" *ngIf="isOpen">
      <div class="dialog-content">
        <div class="emoji-icon">💧</div>
        <h2>是否已喝完一杯水？</h2>
        <p class="hint">点击"已喝完"将自动添加 200ml 记录</p>
        
        <div class="action-buttons">
          <button class="btn-primary" (click)="onConfirm()">
            ✅ 已喝完
          </button>
          <button class="btn-secondary" (click)="onSnooze()">
            ⏰ 稍后提醒
          </button>
          <button class="btn-text" (click)="onDismiss()">
            ❌ 忽略
          </button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReminderActionDialogComponent {
  @Input() isOpen = false;
  @Output() confirmed = new EventEmitter<void>();
  @Output() snoozed = new EventEmitter<void>();
  @Output() dismissed = new EventEmitter<void>();
  
  onConfirm(): void {
    this.confirmed.emit();
    this.close();
  }
  
  onSnooze(): void {
    this.snoozed.emit();
    this.close();
  }
  
  onDismiss(): void {
    this.dismissed.emit();
    this.close();
  }
  
  private close(): void {
    this.isOpen = false;
  }
}
```

**iPhone 兼容性注意**：
- iOS 16.4+ 支持 PWA 通知，但需用户明确授权
- 提供友好的引导流程（"添加到主屏幕" 提示）
- Service Worker 的 `actions` 在 iOS 上可能不支持，需降级处理

---

### 4.3 AudioService（声音播放）

**职责**：播放提醒声音

**实现方案**：
- 使用 **Web Audio API** 或 `<audio>` 元素
- 预加载声音文件避免延迟
- 支持音量控制

```typescript
@Injectable({ providedIn: 'root' })
export class AudioService {
  preloadSounds(soundPaths: string[]): void
  play(soundType: string): void
  setVolume(volume: number): void // 0-1
}
```

---

### 4.4 PWAService（PWA 管理）

**职责**：PWA 安装提示、更新检测

```typescript
@Injectable({ providedIn: 'root' })
export class PWAService {
  // 检测是否可安装
  canInstall$: Observable<boolean>
  
  // 显示安装提示
  promptInstall(): void
  
  // 检测应用更新
  checkForUpdates(): Observable<boolean>
  
  // 是否在独立模式运行
  isStandalone(): boolean
}
```

---

## 🎨 UI/UX 设计要点

### 5.1 视觉风格调整（参考 Duolingo）

**基于现有设计系统的改造**：

| 原天气应用元素 | 喝水应用改造 |
|:---------------|:-------------|
| `--color-primary: #4A90E2`（蓝色） | 保持，与"水"主题契合 ✅ |
| `--color-sunny` 等天气色 | 改为 `--color-water-blue`、`--color-drop-cyan` 等水相关颜色 |
| 温度显示字号 `--font-size-6xl` | 复用为喝水量显示（如 "1500ml"） |

**Duolingo 风格元素**：

| 设计元素 | 实现方式 | 应用场景 |
|:---------|:---------|:---------|
| 🎨 **明亮活泼配色** | 使用高饱和度颜色 + 柔和渐变 | 整体界面、按钮、卡片 |
| 🎭 **卡通化图标** | 圆润的线条 + 可爱的表情 | 水杯图标、成员头像、状态图标 |
| ✨ **流畅微动画** | CSS transitions + transform | 按钮点击、卡片切换、进度更新 |
| 🎉 **庆祝动画** | 五彩纸屑 + 缩放效果 | 完成每日目标、连续打卡 |
| 💬 **友好文案** | 鼓励性语言 + Emoji | 提醒通知、完成提示、空状态 |
| 🔥 **成就徽章** | 连续打卡火焰图标 | 设置页面、统计页面 |

**新增设计 Token**：
```css
:root {
  /* 水主题色（Duolingo 风格：明亮活泼） */
  --color-water-blue: #1CB0F6;      /* 更鲜艳的蓝色 */
  --color-water-light: #6DD3FF;
  --color-drop-cyan: #22D3EE;
  --color-wave-gradient: linear-gradient(135deg, #1CB0F6 0%, #58CC02 100%);
  
  /* 进度状态色（Duolingo 配色） */
  --color-progress-low: #FF4B4B;    /* <30% 鲜红色 */
  --color-progress-medium: #FFC800; /* 30-70% 黄色 */
  --color-progress-high: #58CC02;   /* >70% 绿色（Duolingo 经典绿） */
  
  /* 成就与激励色 */
  --color-fire: #FF9600;            /* 连续打卡火焰 */
  --color-celebration: #FFD700;     /* 庆祝金色 */
  
  /* 卡片阴影（更柔和） */
  --shadow-card: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-card-hover: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

**文案风格示例**：
```typescript
// 鼓励性文案（参考 Duolingo）
export const ENCOURAGEMENT_MESSAGES = [
  '太棒了！继续保持 💪',
  '你真是喝水小能手！🎉',
  '今天也要好好喝水哦 💧',
  '已经完成一半啦！加油 🚀',
  '完美！明天继续努力 ⭐',
  '连续 {{days}} 天打卡！厉害 🔥'
];

// 空状态文案
export const EMPTY_STATE_MESSAGES = {
  noRecords: '还没有喝水记录呢\n点击按钮开始记录吧 🎯',
  noMembers: '快来添加家庭成员\n一起养成健康习惯 👨‍👩‍👧‍👦',
  goalComplete: '恭喜完成今日目标！\n明天继续加油 🎊'
};
```

**动画设计**：
```css
/* 水杯填充动画（类似 Duolingo 进度条） */
@keyframes fillWater {
  0% {
    height: 0;
    opacity: 0.6;
  }
  100% {
    height: var(--target-height);
    opacity: 1;
  }
}

/* 庆祝动画（缩放 + 旋转） */
@keyframes celebrate {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
}

/* 五彩纸屑（使用 JS 动态生成） */
.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--color-celebration);
  animation: confettiFall 2s ease-out;
}

@keyframes confettiFall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(500px) rotate(720deg);
    opacity: 0;
  }
}

/* 火焰图标跳动 */
@keyframes fireJump {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
```

---

### 5.2 关键组件设计

#### 📌 环形进度条（Progress Ring）

**用途**：显示每个家庭成员的喝水进度

**交互**：
- 点击进入详情/添加记录
- 颜色根据进度动态变化（红→橙→绿）
- 动画效果：水波纹填充动画

**技术实现**：
- SVG `<circle>` + `stroke-dasharray` 动画
- 或使用 Canvas 绘制水波动画

```html
<app-progress-ring
  [progress]="75"
  [total]="2000"
  [memberName]="'妈妈'"
  (click)="onMemberClick()">
</app-progress-ring>
```

**代码示例**：
```typescript
@Component({
  selector: 'app-progress-ring',
  templateUrl: './progress-ring.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressRingComponent {
  @Input() progress!: number;
  @Input() total!: number;
  @Input() memberName!: string;
  @Output() ringClick = new EventEmitter<void>();
  
  get percentage(): number {
    return Math.min((this.progress / this.total) * 100, 100);
  }
  
  get strokeColor(): string {
    if (this.percentage < 30) return 'var(--color-progress-low)';
    if (this.percentage < 70) return 'var(--color-progress-medium)';
    return 'var(--color-progress-high)';
  }
}
```

---

#### 💧 水杯动画组件（Water Cup）

**用途**：个人进度页面的主视觉元素

**交互**：
- 水位根据进度上升/下降
- 添加记录时有"倒水"动画
- 达成目标时播放庆祝动画（气泡上升）

**技术实现**：
- CSS `clip-path` + 贝塞尔曲线模拟水面
- 或使用 Lottie 动画库

**代码示例**：
```typescript
@Component({
  selector: 'app-water-cup',
  template: `
    <div class="water-cup">
      <div class="water" [style.height.%]="percentage">
        <div class="wave"></div>
      </div>
      <span class="amount">{{ currentAmount }}ml</span>
    </div>
  `,
  styles: [`
    .water-cup {
      position: relative;
      width: 200px;
      height: 300px;
      border: 3px solid var(--color-border);
      border-radius: 0 0 var(--radius-xl) var(--radius-xl);
      overflow: hidden;
    }
    
    .water {
      position: absolute;
      bottom: 0;
      width: 100%;
      background: var(--color-water-blue);
      transition: height 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .wave {
      position: absolute;
      top: -10px;
      width: 200%;
      height: 20px;
      background: url('wave-pattern.svg');
      animation: wave 2s linear infinite;
    }
    
    @keyframes wave {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WaterCupComponent {
  @Input() currentAmount!: number;
  @Input() dailyGoal!: number;
  
  get percentage(): number {
    return (this.currentAmount / this.dailyGoal) * 100;
  }
}
```

---

#### ⏰ 快捷添加按钮（Quick Add Buttons）

**设计**：
```
┌───────────────────────────────────┐
│  [+200ml]  [+500ml]  [+750ml]     │
│            [自定义]                │
└───────────────────────────────────┘
```

**交互**：
- 点击后立即记录，带触觉反馈（vibrate）
- 显示 Toast 提示："已添加 500ml 🎉"

**代码示例**：
```typescript
@Component({
  selector: 'app-quick-add-buttons',
  template: `
    <div class="quick-add-container">
      <button 
        *ngFor="let amount of presetAmounts"
        class="quick-add-btn"
        (click)="onAddWater(amount)">
        +{{ amount }}ml
      </button>
      <button class="quick-add-btn custom" (click)="onCustomAmount()">
        自定义
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickAddButtonsComponent {
  @Output() waterAdded = new EventEmitter<number>();
  
  presetAmounts = [200, 500, 750];
  
  onAddWater(amount: number): void {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    this.waterAdded.emit(amount);
  }
  
  onCustomAmount(): void {
    // 打开自定义输入对话框
  }
}
```

---

### 5.3 性能优化清单

| 优化项 | 实现方式 | 优先级 |
|:-------|:---------|:-------|
| OnPush 变更检测 | 所有组件使用 `ChangeDetectionStrategy.OnPush` | 🔴 高 |
| 虚拟滚动 | 历史记录列表使用 `cdk-virtual-scroll-viewport` | 🟡 中 |
| 图片懒加载 | 成员头像使用 `loading="lazy"` | 🟢 低 |
| Service Worker 缓存 | 缓存静态资源、API 数据 | 🔴 高 |
| 声音预加载 | App 初始化时预加载提醒声音 | 🔴 高 |
| TrackBy 函数 | 所有 `*ngFor` 提供 trackBy | 🔴 高 |

---

### 5.4 移动端优化（iPhone 15/16）

**安全区域适配**：
```css
.header {
  padding-top: max(var(--spacing-4), env(safe-area-inset-top));
}

.bottom-nav {
  padding-bottom: max(var(--spacing-3), env(safe-area-inset-bottom));
}
```

**触摸优化**：
- 所有可点击元素最小 44x44px
- 使用 `touch-action: manipulation` 移除点击延迟
- 添加触觉反馈（Vibration API）

**PWA 独立窗口**：
```json
// manifest.webmanifest
{
  "name": "Water Buddy - 家庭喝水管理",
  "short_name": "Water Buddy",
  "description": "帮助全家养成健康喝水习惯",
  "display": "standalone",
  "theme_color": "#4A90E2",
  "background_color": "#F5F7FA",
  "orientation": "portrait",
  "start_url": "/",
  "icons": [
    {
      "src": "assets/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "assets/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 🧪 测试策略

### 6.1 单元测试

| 测试对象 | 覆盖率目标 | 重点测试 |
|:---------|:-----------|:---------|
| StorageService | ≥90% | CRUD 操作、错误处理 |
| NotificationService | ≥80% | 权限检测、定时器管理 |
| MlToLiterPipe | 100% | 数据转换准确性 |
| WaterRecordService | ≥85% | 计算逻辑、日期处理 |

### 6.2 集成测试

- 添加喝水记录 → 进度更新 → LocalStorage 同步
- 设置提醒 → 通知触发 → 声音播放

### 6.3 PWA 测试清单

- ✅ Lighthouse PWA 评分 ≥ 90
- ✅ 离线可访问
- ✅ 添加到主屏幕成功
- ✅ 通知权限引导流程
- ✅ 在 iPhone 15/16 真机测试

---

## 📦 依赖包建议

```json
{
  "dependencies": {
    "@angular/core": "^17.0.0",
    "@angular/common": "^17.0.0",
    "@angular/router": "^17.0.0",
    "@angular/pwa": "^17.0.0",
    "@angular/service-worker": "^17.0.0",
    "@angular/cdk": "^17.0.0",
    "rxjs": "^7.8.0",
    "uuid": "^9.0.0",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "@angular/cli": "^17.0.0",
    "@angular/compiler-cli": "^17.0.0",
    "typescript": "~5.2.0",
    "karma": "~6.4.0",
    "jasmine-core": "~5.1.0"
  }
}
```

**可选增强**：
- `dexie`: IndexedDB 封装库（如果需要复杂查询）
- `lottie-web`: 复杂动画支持
- `workbox-webpack-plugin`: Service Worker 高级配置

---

## 🚀 实施步骤建议

### 阶段一：基础架构搭建（1-2天）
1. ✅ 创建模块结构（Core、Shared、Features）
2. ✅ 配置路由懒加载
3. ✅ 实现 StorageService（基于 LocalStorage）
4. ✅ 设置 PWA 基础配置（manifest、service worker）
5. ✅ 实现底部导航栏

### 阶段二：核心功能开发（3-4天）
1. ✅ 家庭成员管理（增删改查）
2. ✅ 喝水记录添加（快捷按钮 + 自定义）
3. ✅ 进度可视化（环形进度条 + 水杯动画）
4. ✅ 历史记录查看

### 阶段三：提醒功能（2-3天）
1. ✅ NotificationService 实现
2. ✅ AudioService 实现
3. ✅ 提醒设置页面
4. ✅ 定时任务调度

### 阶段四：优化与测试（2天）
1. ✅ 动画效果完善
2. ✅ 性能优化（OnPush、虚拟滚动）
3. ✅ iPhone 真机测试
4. ✅ PWA Lighthouse 审计

---

## ✅ 需求确认（已确定）

### 1. 家庭成员管理
- **确定方案**：5个成员以内
- **实现方式**：简单列表，无需分页功能
- **UI 设计**：卡片式布局，支持左右滑动删除

### 2. 数据持久化方案
- **确定方案**：前期 LocalStorage 测试 → 后期接入 Supabase
- **接口统一**：参考 `backend-architecture.md`，Service 层接口保持一致
- **迁移策略**：
  ```typescript
  // 抽象接口，支持多种存储实现
  export interface IStorageAdapter {
    getMembers(): Observable<FamilyMember[]>;
    addMember(member: FamilyMember): Observable<void>;
    // ... 其他方法
  }
  
  // 实现1：LocalStorage（开发测试）
  export class LocalStorageAdapter implements IStorageAdapter { }
  
  // 实现2：Supabase（生产环境）
  export class SupabaseAdapter implements IStorageAdapter { }
  ```

### 3. 提醒功能细节
- **确定方案**：默认每1小时提醒一次
- **交互设计**：
  1. 提醒触发 → 显示通知："该喝水啦！💧"
  2. 用户点击通知 → 弹窗询问："是否已喝完一杯？"
  3. 选项：
     - ✅ **已喝完** → 自动添加 200ml 记录（一杯水的标准量）
     - ⏰ **稍后提醒** → 15分钟后再次提醒
     - ❌ **忽略** → 关闭通知
- **提醒时段**：可设置开始/结束时间（如 8:00-22:00）

### 4. 视觉风格
- **确定方案**：参考多邻国（Duolingo）的动画和插画设计
- **设计特点**：
  - 🎨 明亮活泼的配色
  - 🎭 卡通化的角色和图标
  - ✨ 流畅的微动画和过渡效果
  - 🎉 庆祝动画（完成目标时）
  - 💬 友好的文案和鼓励提示
- **动画参考**：
  - 添加喝水记录时的"倒水"动画
  - 完成每日目标的"庆祝"动画（五彩纸屑）
  - 连续打卡的"火焰"图标动画

### 5. 成员头像
- **确定方案**：Emoji + 预设背景颜色
- **实现细节**：
  - Emoji 选择器：提供常用表情（👤👨👩🧑👶👧👦🧒👴👵）
  - 背景颜色：6-8种预设颜色
    ```typescript
    const AVATAR_COLORS = [
      '#FF6B6B', // 红色
      '#4ECDC4', // 青色
      '#45B7D1', // 蓝色
      '#FFA07A', // 橙色
      '#98D8C8', // 绿色
      '#F7DC6F', // 黄色
      '#BB8FCE', // 紫色
      '#85C1E2'  // 浅蓝
    ];
    ```
  - 展示方式：圆形头像，Emoji居中显示

---

## 📝 技术决策记录

### 变更检测策略
- **决策**：所有组件使用 OnPush
- **理由**：移动端性能优化，减少不必要的渲染

### 状态管理方案
- **决策**：使用 RxJS + Service（不引入 NgRx）
- **理由**：应用规模小（≤5个成员），Service 层足够管理状态

### 数据持久化（适配器模式）
- **决策**：采用适配器模式，支持多种存储后端
- **阶段规划**：
  - **阶段1（开发测试）**：LocalStorage - 快速开发，测试功能
  - **阶段2（生产环境）**：Supabase - 云端同步，多设备实时更新
- **接口统一**：与 `backend-architecture.md` 中的 Supabase 接口保持一致
- **迁移成本**：低（仅需切换 Service 的依赖注入）

### 提醒交互设计
- **决策**：提醒后弹窗确认，支持快速记录
- **理由**：
  - 避免误触或遗忘记录
  - 提供"已喝完"快捷操作，减少用户操作步骤
  - "稍后提醒"功能提升用户体验
- **默认杯量**：200ml（符合中国家庭常用水杯容量）

### 视觉设计风格
- **决策**：参考多邻国（Duolingo）风格
- **核心要素**：
  - 明亮活泼的配色（符合健康、积极的主题）
  - 卡通化设计（降低使用门槛，老少皆宜）
  - 庆祝动画（正向激励，养成习惯）
- **技术实现**：CSS 动画 + SVG + Lottie（可选）

### 头像系统
- **决策**：Emoji + 预设背景色（8色）
- **理由**：
  - 无需上传功能，降低开发成本
  - Emoji 跨平台统一，识别度高
  - 预设颜色快速区分家庭成员

### PWA 策略
- **决策**：使用 `@angular/pwa` 官方方案
- **理由**：维护成本低，社区支持好，iPhone 15/16 完全兼容

---

## 📚 参考资料

- [Angular PWA 官方文档](https://angular.io/guide/service-worker-intro)
- [Web Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
- [iOS PWA Support](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)
- [Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API)

---

**文档版本**: v2.0  
**最后更新**: 2025-10-03  
**维护者**: kreiven

**版本更新日志**：
- v2.0 (2025-10-03): 
  - ✅ 确认需求（5个成员、每1小时提醒、Duolingo风格）
  - ✅ 添加适配器模式设计（LocalStorage ↔ Supabase）
  - ✅ 完善提醒交互流程（已喝完/稍后提醒/忽略）
  - ✅ 添加 Duolingo 风格设计规范
  - ✅ 更新数据模型（Family、头像系统）
- v1.0 (2025-10-03): 初始架构方案

