# bbxin UI/UX 全面重设计 — 设计文档

**日期**：2026-05-30
**范围**：全面翻新，首页打样后推广
**方案**：B — 首页先行验证，其余页面跟随

---

## 1. 设计目标

- **风格**：经典黑白 + 高端奢华
- **用户**：普通消费者，浏览金融产品/机构/文章
- **核心痛点**：移动端体验差，以 375px 为基准重新设计
- **原则**：移动端优先，简洁克制，信任感第一

---

## 2. 视觉设计系统

### 2.1 色彩

| 角色 | 色值 | CSS 变量 | 用途 |
|------|------|----------|------|
| Primary | `#171717` | `--color-primary` | 文字、标题、按钮背景 |
| Secondary | `#404040` | `--color-secondary` | 次要文字、图标 |
| Accent | `#D4AF37` | `--color-accent` | CTA 按钮、链接、高亮 |
| Background | `#FFFFFF` | `--color-bg` | 页面主背景 |
| Muted | `#737373` | `--color-muted` | 辅助文字、placeholder |
| Border | `#E5E5E5` | `--color-border` | 分割线、卡片边框 |

### 2.2 字体

- **字体族**：IBM Plex Sans（Google Fonts）
- **字重**：300 / 400 / 500 / 600 / 700
- **排版层级**：

| 层级 | 移动端 | 桌面端 | 字重 |
|------|--------|--------|------|
| H1 (Hero 标题) | 28px / 1.2 | 48px / 1.15 | 600 |
| H2 (区块标题) | 20px / 1.3 | 28px / 1.25 | 600 |
| H3 (卡片标题) | 16px / 1.4 | 18px / 1.4 | 500 |
| Body | 15px / 1.6 | 16px / 1.6 | 400 |
| Caption | 13px / 1.5 | 14px / 1.5 | 400 |

### 2.3 间距系统（4px 基准）

| Token | 值 | 用途 |
|-------|-----|------|
| `space-xs` | 4px | 图标与文字间距 |
| `space-sm` | 8px | 紧凑内边距 |
| `space-md` | 16px | 卡片内边距、列表间距 |
| `space-lg` | 24px | 区块内边距 |
| `space-xl` | 32px | 区块间距 |
| `space-2xl` | 48px | 大区块间距 |
| `space-3xl` | 64px | Hero 上下间距 |

### 2.4 圆角

| Token | 值 | 适用 |
|-------|-----|------|
| `radius-sm` | 6px | 输入框、标签 |
| `radius-md` | 8px | 按钮、小卡片 |
| `radius-lg` | 12px | 产品卡片 |
| `radius-xl` | 16px | 模态框、大卡片 |

### 2.5 阴影

| Token | 值 | 用途 |
|-------|-----|------|
| `shadow-none` | none | 默认文字、平面元素 |
| `shadow-sm` | 0 1px 3px rgba(0,0,0,0.08) | 卡片默认态 |
| `shadow-md` | 0 4px 12px rgba(0,0,0,0.1) | 卡片 hover、下拉菜单 |
| `shadow-lg` | 0 8px 24px rgba(0,0,0,0.12) | 模态框 |

---

## 3. 响应式断点

以移动端（375px）为基准，渐进增强：

| 断点 | 宽度 | 目标设备 |
|------|------|----------|
| base | 375px+ | 手机 |
| sm | 640px+ | 大屏手机 |
| md | 768px+ | 平板 |
| lg | 1024px+ | 桌面 |

桌面端内容区最大宽度 `max-w-6xl`（1152px）居中。

---

## 4. 首页布局（移动端优先）

```
┌─────────────────────────┐
│  Logo          [菜单]   │  ← 固定顶栏 · 56px · glass
├─────────────────────────┤
│                         │
│  找到最适合你的          │
│  金融产品               │  ← Hero · 大标题 + 搜索框
│  ┌─────────────────┐    │
│  │ 🔍 搜索产品/机构 │    │    搜索框 48px · 金边
│  └─────────────────┘    │
│                         │
├─────────────────────────┤
│  热门产品               │  ← 横向滑动卡片 · 260px宽
│  [卡片] [卡片] [卡片]   │    gap 12px · glass质感
│                         │
├─────────────────────────┤
│  合作机构               │  ← 机构 Logo 网格 · 2列
│  [logo] [logo]          │
│  [logo] [logo]          │
│                         │
├─────────────────────────┤
│  最新文章               │  ← 简洁列表 · 标题+日期
│  ─ 文章标题  2026-05    │
│  ─ 文章标题  2026-05    │
│                         │
├─────────────────────────┤
│  Logo  链接  版权        │  ← 深色 Footer · #171717
└─────────────────────────┘
```

5 个区块，每个区块间距 `space-2xl`（48px）。

---

## 5. 核心组件规格

### 5.1 导航栏
- 固定顶部，`sticky top-0 z-50`
- 玻璃质感：`bg-white/85 backdrop-blur-xl`
- 高度 56px，下方 1px `border-[--color-border]`
- 移动端：Logo 左 + 汉堡菜单右，展开为全屏遮罩面板，从右滑入 300ms ease-out
- 菜单项最小触摸目标 44×44px

### 5.2 搜索框
- 圆角 `radius-md`（8px），`border-[--color-accent]` 金色边框
- focus 状态：`ring-2 ring-[--color-accent]/30`
- 高度 48px，文字 16px
- 右侧金色按钮"搜索"，`bg-[--color-accent] text-black font-medium`

### 5.3 产品卡片
- 白底 + `shadow-sm`，圆角 `radius-lg`（12px）
- hover：`shadow-md`，向上位移 2px，过渡 200ms
- 内容：产品名 + 利率 + 期限 + 机构 Logo
- 移动端：固定宽度 260px，横向滑动容器，`gap-3`

### 5.4 按钮
- 主按钮：`bg-[--color-primary] text-white`，hover → `bg-[--color-secondary]`
- 强调按钮：`bg-[--color-accent] text-black font-medium`
- 最小高度 44px，最小宽度 80px，圆角 `radius-md`
- loading 态：禁用 + spinner

### 5.5 文章列表项
- 标题 `font-medium`（16px）+ 日期 `text-[--color-muted]`（13px）
- 底部分割线 `border-[--color-border]`
- 整行可点击，hover 时标题颜色变为 accent

### 5.6 Footer
- 背景 `bg-[--color-primary]`（#171717），白色文字
- 移动端单列堆叠，桌面端三列
- 包含 Logo、链接组、版权信息

---

## 6. 交互动效

- 所有微交互过渡 200-300ms
- 使用 `transition-colors` / `transition-shadow` / `transition-opacity`，禁用 `transition-all`
- 卡片 hover：阴影加深 + 上浮 2px（`translateY(-2px)`）
- 菜单面板：从右滑入，300ms ease-out
- 页面间导航：opacity 淡入淡出
- 遵守 `prefers-reduced-motion`：用户开启时禁用所有动效
- 加载态：骨架屏（skeleton）而非全屏 spinner

---

## 7. 图标

- 使用 **Lucide React**（已安装），统一 24×24 viewBox
- 禁用 emoji 作为 UI 图标
- 图标颜色继承当前文字色，通过 `currentColor` 控制

---

## 8. 反模式禁则

| 禁止 | 原因 |
|------|------|
| emoji 做图标 | 不专业，跨平台渲染不一致 |
| `transition-all` | 性能差，可能触发不必要 repaint |
| scale transform hover | 导致布局偏移 |
| 移动端浅色文字 | 对比度不足 4.5:1 |
| `overflow-x: hidden` 滥用 | 掩盖布局问题而非解决 |
| 固定宽度破坏响应式 | 移动端优先用相对单位 |

---

## 9. 实施策略

1. **Phase 1 — 设计系统落地**：更新 `globals.css`（CSS 变量）、配置 Tailwind、引入 IBM Plex Sans
2. **Phase 2 — 通用组件重写**：Nav、Footer、按钮、搜索框、卡片
3. **Phase 3 — 首页重写**：`src/app/page.tsx`，移动端基准
4. **Phase 4 — 验证**：375px / 768px / 1024px / 1440px 四种宽度截图对比
5. **Phase 5 — 推广**：确认首页后，按同样风格逐页重写
