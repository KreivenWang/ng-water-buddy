# 🏗️ Water Buddy 后端架构设计方案

> **核心方案：Supabase Serverless BaaS**  
> 零部署成本 | 实时同步 | 完全免费

---

## 🎯 技术架构概览

```
┌──────────────────────────────────────────────────┐
│         Angular PWA (iPhone 15/16)              │
│  ┌──────────────┐  ┌───────────────────────┐   │
│  │ IndexedDB    │  │  Service Worker       │   │
│  │ 离线存储     │  │  - 缓存策略           │   │
│  │ - 喝水记录   │  │  - 后台同步           │   │
│  └──────────────┘  └───────────────────────┘   │
└─────────────┬────────────────────────────────────┘
              │ HTTPS + WebSocket (实时双向通信)
┌─────────────▼────────────────────────────────────┐
│              Supabase (BaaS 平台)                │
│  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ Realtime     │  │  PostgreSQL Database     │ │
│  │ - WebSocket  │  │  - 家庭数据              │ │
│  │ - 推送更新   │  │  - 喝水记录              │ │
│  │              │  │  - RLS 安全策略          │ │
│  └──────────────┘  └──────────────────────────┘ │
│  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ Auth (可选)  │  │  Storage (可选)          │ │
│  │ - 匿名登录   │  │  - 成员头像              │ │
│  └──────────────┘  └──────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

---

## 🚀 为什么选择 Supabase？

| 优势 | 说明 | 对比传统方案 |
|:-----|:-----|:------------|
| **💰 成本** | 免费额度充足（500MB + 5GB带宽/月） | 传统后端：$20+/月 |
| **⚡ 实时同步** | 内置 WebSocket，自动推送数据变更 | 需自行实现 WebSocket 服务 |
| **🔒 安全** | Row Level Security (RLS) 行级权限控制 | 需编写后端权限逻辑 |
| **🚀 开发速度** | 零后端代码，直连数据库 | 需开发完整 REST API |
| **📴 离线支持** | 配合 IndexedDB 轻松实现离线优先 | 需自行设计同步机制 |
| **🔄 自动扩展** | 无需运维，自动扩容 | 需配置负载均衡、数据库扩容 |

### 核心特性

1. **PostgreSQL 数据库** - 强大的 SQL 查询能力
2. **Realtime Subscriptions** - 表级实时订阅，支持过滤
3. **RESTful API** - 自动生成 CRUD API
4. **Row Level Security** - 数据库级别的权限控制
5. **Storage** - 文件存储（可选，用于成员头像）
6. **Auth** - 用户认证（可选，支持匿名登录）

---

## 📋 数据库设计

### Schema 设计 (PostgreSQL)

```sql
-- ========== 家庭表 ==========
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  invite_code VARCHAR(8) UNIQUE NOT NULL, -- 家庭邀请码
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ========== 家庭成员表 ==========
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  avatar VARCHAR(10) NOT NULL, -- emoji 或颜色代码
  daily_goal INTEGER DEFAULT 2000, -- 毫升
  device_id VARCHAR(100), -- 用于标识设备（可选）
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 索引：快速查询家庭成员
CREATE INDEX idx_family_members_family_id ON family_members(family_id);

-- ========== 喝水记录表 ==========
CREATE TABLE water_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- 毫升
  recorded_at TIMESTAMP DEFAULT NOW(),
  synced BOOLEAN DEFAULT TRUE -- 同步状态标记
);

-- 索引：优化日期范围查询
CREATE INDEX idx_water_records_member_recorded 
  ON water_records(member_id, recorded_at DESC);

-- 索引：优化按日期查询
CREATE INDEX idx_water_records_date 
  ON water_records(DATE(recorded_at));

-- ========== 提醒配置表 ==========
CREATE TABLE reminder_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES family_members(id) ON DELETE CASCADE UNIQUE,
  enabled BOOLEAN DEFAULT TRUE,
  intervals JSONB DEFAULT '[]', -- [8, 10, 12, 14, 16, 18, 20]
  sound_type VARCHAR(20) DEFAULT 'water-drop',
  vibrate BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ========== 设备令牌表（用于推送通知）==========
CREATE TABLE device_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform VARCHAR(20), -- 'ios' | 'android' | 'web'
  created_at TIMESTAMP DEFAULT NOW()
);

-- ========== 数据库函数：生成家庭邀请码 ==========
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- 去掉易混淆字符 0O1I
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ========== 数据库函数：创建家庭并返回邀请码 ==========
CREATE OR REPLACE FUNCTION create_family(family_name TEXT, creator_name TEXT, creator_avatar TEXT)
RETURNS JSON AS $$
DECLARE
  new_family_id UUID;
  new_member_id UUID;
  invite_code TEXT;
BEGIN
  -- 生成唯一邀请码
  LOOP
    invite_code := generate_invite_code();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM families WHERE families.invite_code = invite_code);
  END LOOP;
  
  -- 创建家庭
  INSERT INTO families (name, invite_code)
  VALUES (family_name, invite_code)
  RETURNING id INTO new_family_id;
  
  -- 添加创建者为第一个成员
  INSERT INTO family_members (family_id, name, avatar, daily_goal)
  VALUES (new_family_id, creator_name, creator_avatar, 2000)
  RETURNING id INTO new_member_id;
  
  -- 返回家庭信息
  RETURN json_build_object(
    'family_id', new_family_id,
    'member_id', new_member_id,
    'invite_code', invite_code
  );
END;
$$ LANGUAGE plpgsql;

-- ========== 数据库函数：通过邀请码加入家庭 ==========
CREATE OR REPLACE FUNCTION join_family(
  invite_code_param TEXT,
  member_name TEXT,
  member_avatar TEXT
)
RETURNS JSON AS $$
DECLARE
  target_family_id UUID;
  new_member_id UUID;
BEGIN
  -- 查找家庭
  SELECT id INTO target_family_id
  FROM families
  WHERE invite_code = invite_code_param;
  
  IF target_family_id IS NULL THEN
    RAISE EXCEPTION '邀请码无效';
  END IF;
  
  -- 添加新成员
  INSERT INTO family_members (family_id, name, avatar, daily_goal)
  VALUES (target_family_id, member_name, member_avatar, 2000)
  RETURNING id INTO new_member_id;
  
  -- 返回成员信息
  RETURN json_build_object(
    'family_id', target_family_id,
    'member_id', new_member_id
  );
END;
$$ LANGUAGE plpgsql;

-- ========== 数据库函数：获取今日喝水统计 ==========
CREATE OR REPLACE FUNCTION get_today_summary(family_id_param UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(
    json_build_object(
      'member_id', fm.id,
      'member_name', fm.name,
      'avatar', fm.avatar,
      'daily_goal', fm.daily_goal,
      'total_amount', COALESCE(SUM(wr.amount), 0),
      'percentage', ROUND((COALESCE(SUM(wr.amount), 0)::NUMERIC / fm.daily_goal) * 100, 1),
      'record_count', COUNT(wr.id)
    )
  ) INTO result
  FROM family_members fm
  LEFT JOIN water_records wr ON wr.member_id = fm.id 
    AND DATE(wr.recorded_at) = CURRENT_DATE
  WHERE fm.family_id = family_id_param
  GROUP BY fm.id, fm.name, fm.avatar, fm.daily_goal;
  
  RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql;
```

---

## 🔐 安全策略 (Row Level Security)

### 设备识别方案

**使用浏览器指纹 + LocalStorage 组合**：

```typescript
// core/services/device.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DeviceService {
  private readonly STORAGE_KEY = 'water_buddy_device_id';
  
  /**
   * 获取或生成设备 ID
   */
  getDeviceId(): string {
    let deviceId = localStorage.getItem(this.STORAGE_KEY);
    
    if (!deviceId) {
      // 生成基于浏览器指纹的设备 ID
      deviceId = this.generateDeviceId();
      localStorage.setItem(this.STORAGE_KEY, deviceId);
    }
    
    return deviceId;
  }
  
  private generateDeviceId(): string {
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      !!navigator.maxTouchPoints // 检测是否触摸设备
    ].join('|');
    
    // 生成简单哈希
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return `device_${Math.abs(hash)}_${Date.now()}`;
  }
}
```

### 完整 RLS 策略

```sql
-- ========== 启用所有表的 RLS ==========
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_configs ENABLE ROW LEVEL SECURITY;

-- ========== 家庭表策略 ==========
-- 所有人可以创建家庭（通过函数创建）
CREATE POLICY "允许所有人创建家庭"
  ON families
  FOR INSERT
  WITH CHECK (true);

-- 家庭成员可以查看自己的家庭信息
CREATE POLICY "家庭成员可查看家庭信息"
  ON families
  FOR SELECT
  USING (
    id IN (
      SELECT family_id FROM family_members 
      WHERE id = current_setting('app.current_member_id', true)::UUID
    )
  );

-- 家庭创建者可以更新家庭名称（可选扩展）
CREATE POLICY "允许更新家庭信息"
  ON families
  FOR UPDATE
  USING (
    id IN (
      SELECT family_id FROM family_members 
      WHERE id = current_setting('app.current_member_id', true)::UUID
    )
  );

-- ========== 家庭成员表策略 ==========
-- 所有人可以加入家庭（通过 join_family 函数）
CREATE POLICY "允许加入家庭"
  ON family_members
  FOR INSERT
  WITH CHECK (true);

-- 只能查看同一家庭的成员
CREATE POLICY "查看同家庭成员"
  ON family_members
  FOR SELECT
  USING (
    family_id IN (
      SELECT family_id FROM family_members 
      WHERE id = current_setting('app.current_member_id', true)::UUID
    )
  );

-- 只能更新自己的信息
CREATE POLICY "更新自己的成员信息"
  ON family_members
  FOR UPDATE
  USING (id = current_setting('app.current_member_id', true)::UUID);

-- 只能删除自己（退出家庭）
CREATE POLICY "删除自己的成员资料"
  ON family_members
  FOR DELETE
  USING (id = current_setting('app.current_member_id', true)::UUID);

-- ========== 喝水记录表策略 ==========
-- 只能为同家庭成员添加记录
CREATE POLICY "为家庭成员添加喝水记录"
  ON water_records
  FOR INSERT
  WITH CHECK (
    member_id IN (
      SELECT fm.id FROM family_members fm
      WHERE fm.family_id IN (
        SELECT family_id FROM family_members 
        WHERE id = current_setting('app.current_member_id', true)::UUID
      )
    )
  );

-- 只能查看同家庭的喝水记录
CREATE POLICY "查看家庭喝水记录"
  ON water_records
  FOR SELECT
  USING (
    member_id IN (
      SELECT fm.id FROM family_members fm
      WHERE fm.family_id IN (
        SELECT family_id FROM family_members 
        WHERE id = current_setting('app.current_member_id', true)::UUID
      )
    )
  );

-- 只能删除同家庭的记录（可选：限制只能删除自己的）
CREATE POLICY "删除家庭喝水记录"
  ON water_records
  FOR DELETE
  USING (
    member_id IN (
      SELECT fm.id FROM family_members fm
      WHERE fm.family_id IN (
        SELECT family_id FROM family_members 
        WHERE id = current_setting('app.current_member_id', true)::UUID
      )
    )
  );

-- ========== 提醒配置表策略 ==========
-- 只能查看自己的提醒配置
CREATE POLICY "查看自己的提醒配置"
  ON reminder_configs
  FOR SELECT
  USING (member_id = current_setting('app.current_member_id', true)::UUID);

-- 只能创建自己的提醒配置
CREATE POLICY "创建自己的提醒配置"
  ON reminder_configs
  FOR INSERT
  WITH CHECK (member_id = current_setting('app.current_member_id', true)::UUID);

-- 只能更新自己的提醒配置
CREATE POLICY "更新自己的提醒配置"
  ON reminder_configs
  FOR UPDATE
  USING (member_id = current_setting('app.current_member_id', true)::UUID);
```

---

## 💻 前端集成方案

### 1. 安装依赖

```bash
npm install @supabase/supabase-js uuid
npm install --save-dev @types/uuid
```

### 2. 环境配置

```typescript
// environments/environment.ts
export const environment = {
  production: false,
  supabaseUrl: 'https://your-project.supabase.co',
  supabaseAnonKey: 'your-anon-key-here'
};

// environments/environment.prod.ts
export const environment = {
  production: true,
  supabaseUrl: 'https://your-project.supabase.co',
  supabaseAnonKey: 'your-anon-key-here'
};
```

### 3. Supabase Service（核心服务）

```typescript
// core/services/supabase.service.ts
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;
  private currentMemberId: string | null = null;
  
  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }
  
  get client(): SupabaseClient {
    return this.supabase;
  }
  
  /**
   * 设置当前成员 ID（用于 RLS）
   * 每次API调用前设置，确保 RLS 策略生效
   */
  async setCurrentMember(memberId: string): Promise<void> {
    this.currentMemberId = memberId;
    // 设置 PostgreSQL 会话变量
    await this.supabase.rpc('set_config', {
      setting_name: 'app.current_member_id',
      setting_value: memberId,
      is_local: false
    });
  }
  
  /**
   * 执行 RPC 调用（数据库函数）
   */
  async callFunction<T = any>(functionName: string, params?: any): Promise<T> {
    const { data, error } = await this.supabase.rpc(functionName, params);
    if (error) throw error;
    return data as T;
  }
}
```

### 4. 家庭管理服务（完整版）

```typescript
// features/family-progress/services/family.service.ts
import { Injectable } from '@angular/core';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Observable, from, map } from 'rxjs';
import { FamilyMember, Family } from '../models/family-member.interface';

interface CreateFamilyResult {
  family_id: string;
  member_id: string;
  invite_code: string;
}

interface JoinFamilyResult {
  family_id: string;
  member_id: string;
}

@Injectable({ providedIn: 'root' })
export class FamilyService {
  constructor(private supabase: SupabaseService) {}
  
  /**
   * 创建新家庭
   */
  createFamily(
    familyName: string,
    creatorName: string,
    creatorAvatar: string
  ): Observable<CreateFamilyResult> {
    return from(
      this.supabase.callFunction<CreateFamilyResult>('create_family', {
        family_name: familyName,
        creator_name: creatorName,
        creator_avatar: creatorAvatar
      })
    );
  }
  
  /**
   * 通过邀请码加入家庭
   */
  joinFamily(
    inviteCode: string,
    memberName: string,
    memberAvatar: string
  ): Observable<JoinFamilyResult> {
    return from(
      this.supabase.callFunction<JoinFamilyResult>('join_family', {
        invite_code_param: inviteCode.toUpperCase(),
        member_name: memberName,
        member_avatar: memberAvatar
      })
    );
  }
  
  /**
   * 获取家庭信息
   */
  getFamily(familyId: string): Observable<Family> {
    return from(
      this.supabase.client
        .from('families')
        .select('*')
        .eq('id', familyId)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Family;
      })
    );
  }
  
  /**
   * 获取家庭成员列表
   */
  getMembers(familyId: string): Observable<FamilyMember[]> {
    return from(
      this.supabase.client
        .from('family_members')
        .select('*')
        .eq('family_id', familyId)
        .order('created_at', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as FamilyMember[];
      })
    );
  }
  
  /**
   * 获取今日家庭喝水统计
   */
  getTodaySummary(familyId: string): Observable<any> {
    return from(
      this.supabase.callFunction('get_today_summary', {
        family_id_param: familyId
      })
    );
  }
  
  /**
   * 更新家庭成员信息
   */
  updateMember(id: string, updates: Partial<FamilyMember>): Observable<void> {
    return from(
      this.supabase.client
        .from('family_members')
        .update({ ...updates, updated_at: new Date() })
        .eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }
  
  /**
   * 退出家庭（删除成员）
   */
  leaveFamily(memberId: string): Observable<void> {
    return from(
      this.supabase.client
        .from('family_members')
        .delete()
        .eq('id', memberId)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }
}
```

### 4. 喝水记录管理服务

```typescript
// features/family-progress/services/water-record.service.ts
import { Injectable } from '@angular/core';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Observable, from, map } from 'rxjs';
import { WaterRecord } from '../models/water-record.interface';

@Injectable({ providedIn: 'root' })
export class WaterRecordService {
  constructor(private supabase: SupabaseService) {}
  
  /**
   * 添加喝水记录
   */
  addRecord(record: Partial<WaterRecord>): Observable<WaterRecord> {
    return from(
      this.supabase.client
        .from('water_records')
        .insert(record)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as WaterRecord;
      })
    );
  }
  
  /**
   * 获取指定日期的记录
   */
  getRecordsByDate(memberId: string, date: string): Observable<WaterRecord[]> {
    return from(
      this.supabase.client
        .from('water_records')
        .select('*')
        .eq('member_id', memberId)
        .gte('recorded_at', `${date}T00:00:00`)
        .lte('recorded_at', `${date}T23:59:59`)
        .order('recorded_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as WaterRecord[];
      })
    );
  }
  
  /**
   * 删除记录
   */
  deleteRecord(id: string): Observable<void> {
    return from(
      this.supabase.client
        .from('water_records')
        .delete()
        .eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }
}
```

---

## 🔄 实时同步实现

### Realtime Service

```typescript
// core/services/realtime.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Subject, Observable } from 'rxjs';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface RealtimeEvent<T = any> {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  new: T;
  old: T;
}

@Injectable({ providedIn: 'root' })
export class RealtimeService implements OnDestroy {
  private channels: Map<string, RealtimeChannel> = new Map();
  private events$ = new Subject<RealtimeEvent>();
  
  constructor(private supabase: SupabaseService) {}
  
  /**
   * 订阅表变更
   */
  subscribe(table: string, filter?: string): Observable<RealtimeEvent> {
    if (!this.channels.has(table)) {
      const channel = this.supabase.client
        .channel(`public:${table}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table, filter },
          (payload) => {
            this.events$.next({
              type: payload.eventType as any,
              table,
              new: payload.new,
              old: payload.old
            });
          }
        )
        .subscribe();
      
      this.channels.set(table, channel);
    }
    
    return this.events$.asObservable();
  }
  
  /**
   * 取消订阅
   */
  unsubscribe(table: string): void {
    const channel = this.channels.get(table);
    if (channel) {
      this.supabase.client.removeChannel(channel);
      this.channels.delete(table);
    }
  }
  
  ngOnDestroy(): void {
    this.channels.forEach((channel) => {
      this.supabase.client.removeChannel(channel);
    });
    this.channels.clear();
  }
}
```

### 在组件中使用实时同步

```typescript
// features/family-progress/containers/family-dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RealtimeService } from '../../../core/services/realtime.service';
import { WaterRecordService } from '../services/water-record.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-family-dashboard',
  templateUrl: './family-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FamilyDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  constructor(
    private realtime: RealtimeService,
    private waterRecordService: WaterRecordService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    // 订阅喝水记录实时更新
    this.realtime
      .subscribe('water_records')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (event.type === 'INSERT') {
          console.log('新增喝水记录:', event.new);
          this.refreshData();
        } else if (event.type === 'UPDATE') {
          console.log('更新喝水记录:', event.new);
          this.refreshData();
        } else if (event.type === 'DELETE') {
          console.log('删除喝水记录:', event.old);
          this.refreshData();
        }
        this.cdr.markForCheck();
      });
  }
  
  refreshData(): void {
    // 刷新数据逻辑
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.realtime.unsubscribe('water_records');
  }
}
```

---

## 📴 离线优先策略 (Offline-First)

### 混合存储策略

```typescript
// core/services/storage.service.ts (改进版)
import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private db: IDBDatabase | null = null;
  
  constructor(private supabase: SupabaseService) {
    this.initIndexedDB();
  }
  
  /**
   * 添加记录（离线优先）
   */
  addRecord(record: WaterRecord): Observable<WaterRecord> {
    // 1. 先存本地 IndexedDB
    return from(this.saveToIndexedDB(record)).pipe(
      // 2. 再同步到 Supabase（如果在线）
      switchMap(() => {
        if (navigator.onLine) {
          return from(
            this.supabase.client
              .from('water_records')
              .insert({ ...record, synced: true })
              .select()
              .single()
          ).pipe(
            catchError((error) => {
              // 同步失败，标记为未同步
              this.markAsUnsynced(record.id);
              return throwError(() => error);
            })
          );
        } else {
          // 离线状态，标记为未同步
          return of({ ...record, synced: false });
        }
      })
    );
  }
  
  /**
   * 后台同步未同步数据
   */
  syncPendingRecords(): Observable<void> {
    return from(this.getUnsyncedRecords()).pipe(
      switchMap((records) => {
        const syncTasks = records.map((record) =>
          this.supabase.client
            .from('water_records')
            .upsert({ ...record, synced: true })
        );
        return from(Promise.all(syncTasks));
      }),
      tap(() => console.log('同步完成'))
    );
  }
  
  private async initIndexedDB(): Promise<void> {
    // IndexedDB 初始化逻辑
  }
  
  private async saveToIndexedDB(record: WaterRecord): Promise<void> {
    // 保存到 IndexedDB
  }
  
  private async markAsUnsynced(id: string): Promise<void> {
    // 标记为未同步
  }
  
  private async getUnsyncedRecords(): Promise<WaterRecord[]> {
    // 获取未同步记录
    return [];
  }
}
```

---

## 💰 成本分析

### Supabase 免费额度（足够家庭使用）

| 资源 | 免费额度 | 预估使用 | 是否足够 |
|:-----|:---------|:---------|:---------|
| 数据库存储 | 500 MB | < 10 MB (1万条记录) | ✅ 足够 |
| 带宽 | 5 GB/月 | < 100 MB/月 | ✅ 足够 |
| 实时连接 | 200 并发 | < 10 并发 | ✅ 足够 |
| API 请求 | 无限 | 约 1000/天 | ✅ 足够 |

**总成本：$0/月** 🎉

---

---

## 🎬 应用初始化流程

### 首次打开应用

```typescript
// app.component.ts
import { Component, OnInit } from '@angular/core';
import { DeviceService } from './core/services/device.service';
import { SupabaseService } from './core/services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(
    private deviceService: DeviceService,
    private supabase: SupabaseService,
    private router: Router
  ) {}
  
  async ngOnInit(): Promise<void> {
    // 1. 获取设备 ID
    const deviceId = this.deviceService.getDeviceId();
    
    // 2. 检查是否已加入家庭
    const localData = localStorage.getItem('water_buddy_user');
    
    if (localData) {
      const { familyId, memberId } = JSON.parse(localData);
      // 设置当前成员（用于 RLS）
      await this.supabase.setCurrentMember(memberId);
      // 跳转到仪表盘
      this.router.navigate(['/dashboard']);
    } else {
      // 首次使用，跳转到欢迎页
      this.router.navigate(['/welcome']);
    }
  }
}
```

### 欢迎页流程

```typescript
// features/welcome/welcome.component.ts
@Component({
  selector: 'app-welcome',
  template: `
    <div class="welcome-container">
      <h1>欢迎使用 Water Buddy</h1>
      <p>开始您的健康喝水之旅</p>
      
      <button (click)="createNewFamily()">创建家庭</button>
      <button (click)="joinExistingFamily()">加入家庭</button>
    </div>
  `
})
export class WelcomeComponent {
  constructor(
    private familyService: FamilyService,
    private router: Router
  ) {}
  
  createNewFamily(): void {
    // 打开创建家庭对话框
    this.showCreateFamilyDialog();
  }
  
  joinExistingFamily(): void {
    // 打开输入邀请码对话框
    this.showJoinFamilyDialog();
  }
  
  private showCreateFamilyDialog(): void {
    // 弹窗输入：家庭名称、您的名字、选择头像
    const familyName = prompt('家庭名称');
    const memberName = prompt('您的名字');
    const avatar = '👤'; // 可以是 emoji 选择器
    
    this.familyService.createFamily(familyName, memberName, avatar)
      .subscribe({
        next: (result) => {
          // 保存到本地
          localStorage.setItem('water_buddy_user', JSON.stringify({
            familyId: result.family_id,
            memberId: result.member_id,
            inviteCode: result.invite_code
          }));
          
          // 显示邀请码
          alert(`家庭创建成功！邀请码：${result.invite_code}`);
          
          // 跳转到仪表盘
          this.router.navigate(['/dashboard']);
        },
        error: (err) => console.error('创建失败:', err)
      });
  }
  
  private showJoinFamilyDialog(): void {
    const inviteCode = prompt('请输入邀请码');
    const memberName = prompt('您的名字');
    const avatar = '👤';
    
    this.familyService.joinFamily(inviteCode, memberName, avatar)
      .subscribe({
        next: (result) => {
          localStorage.setItem('water_buddy_user', JSON.stringify({
            familyId: result.family_id,
            memberId: result.member_id
          }));
          
          alert('加入成功！');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => alert('加入失败，请检查邀请码')
      });
  }
}
```

---

## 📴 离线优先完整实现

### IndexedDB 封装服务

```typescript
// core/services/indexed-db.service.ts
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IndexedDBService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'water_buddy_db';
  private readonly DB_VERSION = 1;
  
  constructor() {
    this.initDB();
  }
  
  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // 创建喝水记录表
        if (!db.objectStoreNames.contains('water_records')) {
          const recordStore = db.createObjectStore('water_records', { keyPath: 'id' });
          recordStore.createIndex('member_id', 'member_id', { unique: false });
          recordStore.createIndex('synced', 'synced', { unique: false });
          recordStore.createIndex('recorded_at', 'recorded_at', { unique: false });
        }
        
        // 创建家庭成员缓存表
        if (!db.objectStoreNames.contains('family_members_cache')) {
          db.createObjectStore('family_members_cache', { keyPath: 'id' });
        }
      };
    });
  }
  
  /**
   * 保存记录到 IndexedDB
   */
  saveRecord(record: any): Observable<void> {
    return from(new Promise<void>((resolve, reject) => {
      if (!this.db) return reject('DB not initialized');
      
      const transaction = this.db.transaction(['water_records'], 'readwrite');
      const store = transaction.objectStore('water_records');
      const request = store.put(record);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    }));
  }
  
  /**
   * 获取未同步的记录
   */
  getUnsyncedRecords(): Observable<any[]> {
    return from(new Promise<any[]>((resolve, reject) => {
      if (!this.db) return reject('DB not initialized');
      
      const transaction = this.db.transaction(['water_records'], 'readonly');
      const store = transaction.objectStore('water_records');
      const index = store.index('synced');
      const request = index.getAll(false);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }));
  }
  
  /**
   * 标记记录为已同步
   */
  markAsSynced(recordId: string): Observable<void> {
    return from(new Promise<void>((resolve, reject) => {
      if (!this.db) return reject('DB not initialized');
      
      const transaction = this.db.transaction(['water_records'], 'readwrite');
      const store = transaction.objectStore('water_records');
      const getRequest = store.get(recordId);
      
      getRequest.onsuccess = () => {
        const record = getRequest.result;
        if (record) {
          record.synced = true;
          const updateRequest = store.put(record);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          resolve();
        }
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    }));
  }
}
```

### 同步服务

```typescript
// core/services/sync.service.ts
import { Injectable } from '@angular/core';
import { IndexedDBService } from './indexed-db.service';
import { SupabaseService } from './supabase.service';
import { interval, fromEvent, merge } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SyncService {
  constructor(
    private indexedDB: IndexedDBService,
    private supabase: SupabaseService
  ) {
    this.setupAutoSync();
  }
  
  /**
   * 设置自动同步
   */
  private setupAutoSync(): void {
    // 监听网络状态变化
    const online$ = fromEvent(window, 'online');
    
    // 定期同步（每5分钟）
    const periodic$ = interval(5 * 60 * 1000);
    
    // 合并触发器
    merge(online$, periodic$)
      .pipe(
        filter(() => navigator.onLine),
        switchMap(() => this.syncPendingRecords())
      )
      .subscribe({
        next: () => console.log('✅ 同步完成'),
        error: (err) => console.error('❌ 同步失败:', err)
      });
  }
  
  /**
   * 同步待同步的记录
   */
  async syncPendingRecords(): Promise<void> {
    const unsyncedRecords = await this.indexedDB.getUnsyncedRecords().toPromise();
    
    if (!unsyncedRecords || unsyncedRecords.length === 0) {
      return;
    }
    
    console.log(`开始同步 ${unsyncedRecords.length} 条记录...`);
    
    for (const record of unsyncedRecords) {
      try {
        await this.supabase.client
          .from('water_records')
          .upsert(record);
        
        await this.indexedDB.markAsSynced(record.id).toPromise();
        console.log(`✅ 已同步记录 ${record.id}`);
      } catch (error) {
        console.error(`❌ 同步失败 ${record.id}:`, error);
      }
    }
  }
}
```

---

## 🛠️ 部署方案

### 前端部署：Cloudflare Pages（推荐）

```bash
# 1. 构建生产版本
ng build --configuration production

# 2. 部署（两种方式）

# 方式一：自动部署（推荐）
# - 连接 GitHub 仓库
# - 每次 push 自动构建部署
# - 访问 https://pages.cloudflare.com/

# 方式二：手动部署
npx wrangler pages publish dist/ng-water-buddy
```

**Cloudflare Pages 配置**：
- Build command: `ng build --prod`
- Build output directory: `dist/ng-water-buddy`
- Environment variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`

### 备选部署平台

| 平台 | 免费额度 | CDN | 自动部署 | 推荐度 |
|:-----|:---------|:----|:---------|:-------|
| **Cloudflare Pages** | 无限 | ✅ 全球 | ✅ | ⭐⭐⭐⭐⭐ |
| **Vercel** | 100GB/月 | ✅ 全球 | ✅ | ⭐⭐⭐⭐⭐ |
| **Netlify** | 100GB/月 | ✅ 全球 | ✅ | ⭐⭐⭐⭐ |

---

## 🚀 快速开始指南（5步上线）

### 第1步：创建 Supabase 项目（10分钟）

1. 访问 [supabase.com](https://supabase.com) 注册账号
2. 点击 "New Project"，填写项目名称
3. 等待项目初始化完成
4. 进入 SQL Editor，复制并执行本文档中的 SQL 代码（包括表创建 + 函数 + RLS 策略）
5. 在 Settings → API 中获取：
   - `Project URL` (复制为 `SUPABASE_URL`)
   - `anon public` key (复制为 `SUPABASE_ANON_KEY`)

### 第2步：克隆项目并配置（5分钟）

```bash
# 克隆仓库
git clone https://github.com/yourusername/ng-water-buddy.git
cd ng-water-buddy

# 安装依赖
npm install

# 配置环境变量
# 编辑 src/environments/environment.ts 和 environment.prod.ts
# 填入上一步获取的 SUPABASE_URL 和 SUPABASE_ANON_KEY
```

### 第3步：本地开发测试（30分钟）

```bash
# 启动开发服务器
ng serve

# 浏览器访问 http://localhost:4200
# 测试功能：
# - 创建家庭（获得邀请码）
# - 用另一个浏览器窗口加入家庭
# - 添加喝水记录，验证实时同步
```

### 第4步：部署到 Cloudflare Pages（15分钟）

```bash
# 构建生产版本
ng build --prod

# 推送到 GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 在 Cloudflare Pages 连接 GitHub 仓库
# 1. 访问 https://pages.cloudflare.com/
# 2. 点击 "Create a project"
# 3. 选择 GitHub 仓库
# 4. 配置构建设置：
#    - Build command: ng build --prod
#    - Output: dist/ng-water-buddy
# 5. 添加环境变量
# 6. 点击 "Save and Deploy"
```

### 第5步：iPhone 安装 PWA（5分钟）

1. 用 Safari 浏览器访问部署后的网址
2. 点击底部分享按钮
3. 选择"添加到主屏幕"
4. 确认，PWA 安装完成！
5. 从主屏幕打开 Water Buddy，享受原生 App 体验

---

## 📋 完整实施检查清单

### ✅ Supabase 后端设置（30分钟）
- [ ] 注册 Supabase 账号并创建项目
- [ ] 执行数据库 Schema（表 + 索引）
- [ ] 执行数据库函数（创建家庭、加入家庭、统计）
- [ ] 配置 RLS 安全策略
- [ ] 测试 SQL 函数是否正常工作
- [ ] 获取 API URL 和 Key

### ✅ 前端开发（4-5天）
- [ ] 安装依赖：`@supabase/supabase-js`, `uuid`
- [ ] 创建 DeviceService（设备识别）
- [ ] 创建 SupabaseService（数据库连接）
- [ ] 创建 FamilyService（家庭管理）
- [ ] 创建 WaterRecordService（喝水记录）
- [ ] 创建 RealtimeService（实时同步）
- [ ] 创建 IndexedDBService（离线存储）
- [ ] 创建 SyncService（后台同步）
- [ ] 实现欢迎页（创建/加入家庭）
- [ ] 实现仪表盘（进度展示）
- [ ] 实现提醒功能
- [ ] 实现设置页面

### ✅ 测试（2天）
- [ ] 单设备功能测试
- [ ] 多设备实时同步测试
- [ ] 离线模式测试（飞行模式）
- [ ] 网络恢复自动同步测试
- [ ] iPhone Safari 兼容性测试
- [ ] PWA 安装流程测试
- [ ] 通知权限测试

### ✅ 部署上线（1天）
- [ ] 配置生产环境变量
- [ ] 构建生产版本并测试
- [ ] 部署到 Cloudflare Pages
- [ ] 配置自定义域名（可选）
- [ ] 配置 HTTPS（自动）
- [ ] PWA Lighthouse 审计（目标 >90 分）
- [ ] 真机测试（iPhone 15/16）

---

## 🔒 安全最佳实践

### 1. 环境变量配置

```typescript
// environments/environment.prod.ts
export const environment = {
  production: true,
  supabaseUrl: 'https://your-project.supabase.co',
  supabaseAnonKey: 'your-anon-key', // 这是公开的，安全的
};
```

### 2. RLS 策略强制执行

```sql
-- 确保所有表都启用 RLS
ALTER TABLE families FORCE ROW LEVEL SECURITY;
ALTER TABLE family_members FORCE ROW LEVEL SECURITY;
ALTER TABLE water_records FORCE ROW LEVEL SECURITY;
```

### 3. 输入验证

```typescript
// 在服务层验证输入
addRecord(record: WaterRecord): Observable<WaterRecord> {
  if (record.amount <= 0 || record.amount > 5000) {
    return throwError(() => new Error('无效的水量'));
  }
  // ...
}
```

---

## 📚 参考资源

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase Realtime 文档](https://supabase.com/docs/guides/realtime)
- [PostgreSQL RLS 文档](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)

---

## 🎯 方案总结

### 最终技术选型

| 组件 | 技术方案 | 成本 |
|:-----|:---------|:-----|
| **数据库** | Supabase PostgreSQL | $0/月（免费额度） |
| **实时同步** | Supabase Realtime (WebSocket) | $0/月（包含在免费额度） |
| **前端框架** | Angular 17 + PWA | 无 |
| **离线存储** | IndexedDB | 无 |
| **部署平台** | Cloudflare Pages | $0/月（免费） |
| **CDN** | Cloudflare 全球 CDN | $0/月（包含） |

**总成本：$0/月** 🎉

### 架构优势

✅ **零成本** - 完全免费，适合个人和家庭使用  
✅ **零运维** - 无需管理服务器，Supabase 自动扩展和备份  
✅ **实时同步** - 多设备自动同步，无需轮询  
✅ **离线优先** - IndexedDB + 后台同步，网络恢复自动推送  
✅ **安全可靠** - RLS 行级权限控制，数据隔离  
✅ **快速开发** - 前端直连数据库，无需编写后端 API  
✅ **全球加速** - Cloudflare CDN，访问速度快  
✅ **PWA 支持** - iPhone 可安装，原生 App 体验

### 为什么不需要传统后端？

| 传统方案 | Supabase 方案 |
|:---------|:-------------|
| 需要编写 REST API | ✅ 自动生成 RESTful API |
| 需要实现 WebSocket 服务 | ✅ 内置 Realtime |
| 需要编写权限验证逻辑 | ✅ RLS 数据库级权限 |
| 需要部署服务器（Docker/K8s） | ✅ 无需部署，直连 |
| 需要配置负载均衡 | ✅ 自动扩展 |
| 需要配置数据库备份 | ✅ 自动每日备份 |
| 成本：$20+/月 | ✅ 成本：$0/月 |

---

## ⚠️ 注意事项

### Supabase 免费版限制

| 限制项 | 免费额度 | 应对方案 |
|:------|:---------|:--------|
| 数据库大小 | 500 MB | 定期清理历史记录（保留3个月） |
| 带宽 | 5 GB/月 | PWA 离线缓存减少请求 |
| 实时连接数 | 200 并发 | 家庭应用足够 |

### iPhone PWA 限制

- iOS 16.4+ 才支持 PWA 通知
- 必须"添加到主屏幕"后通知才生效
- 需引导用户完成安装流程

### 数据备份建议

虽然 Supabase 会自动备份，但建议：
- 实现数据导出功能（JSON 格式）
- 定期下载备份到本地
- 重要数据可双存储（Supabase + LocalStorage）

---

## 📚 参考资源

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase Realtime 文档](https://supabase.com/docs/guides/realtime)
- [PostgreSQL RLS 文档](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Angular PWA 文档](https://angular.io/guide/service-worker-intro)
- [iOS PWA 支持](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)

---

## 💬 需要帮助？

如有问题，请查看：
1. 本文档的"快速开始指南"部分
2. Supabase 官方文档
3. GitHub Issues（如果项目开源）

---

**文档版本**: v2.0  
**最后更新**: 2025-10-03  
**维护者**: kreiven

**变更记录**：
- v2.0 (2025-10-03): 完整重构，聚焦 Supabase 方案，添加完整代码示例和快速开始指南
- v1.0 (2025-10-03): 初始版本

