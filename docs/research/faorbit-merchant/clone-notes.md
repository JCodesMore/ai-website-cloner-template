# Faorbit 商户端仪表盘克隆笔记

来源：Faorbit Vcc 仓库（只读），2026-07-13。

## 机制（与生产完全同构）

- `design-src/dashboard.html`：设计稿原文，**未替换任何占位符**（`__AUTH_STATE__` 等保持原样）。
  preview-identity.js 检测不到 `data-auth-state="authed"` 即进入 DEMO 模式：
  林一帆(owner)/陈墨(member) 身份切换器 + 设计稿自带 mock 数据；所有占位符消费方都有兜底
  （JSON.parse try/catch、parseInt||0、data-series 空 → 演示数据）。
- `src/lib/design.ts`：从 Vcc 移植，仅改路由映射 `dashboard.html → /merchant`。
- `src/components/DesignPage.tsx`：原样移植。**关键**：它给宿主 div 加 `merchant-surface` 类，
  merchant.css 的深色侧边栏皮肤（337 处选择器）全部挂在这个作用域下——缺了它就退回浅色旧皮肤。
- `src/app/merchant/layout.tsx`：挂 `/css/site.css` + `/css/merchant.css`（顺序与 Vcc
  (site)/layout.tsx 一致），并把克隆站根布局的 `body{display:flex}` 还原为 block。
- `src/app/merchant/page.tsx`：**HUOAD 站点骨架内嵌**（2026-07-13 第二版，按用户要求）——
  顶部 SiteHeader + 左侧 HUOAD 白卡风格侧边栏（只放概览四项）+ 右侧注入仪表盘；
  Faorbit 自带深色侧栏由 `public/css/merchant-embed.css` 隐藏（.dash 改单列圆角卡）。
- 侧栏切换原理：设计稿内联脚本在 document 上委托一切 `[data-view]` 点击，白卡侧栏的
  `<a data-view>` 天然可切视图；boot 末尾的 glue 脚本负责同步侧栏高亮 + `?view=` 深链 +
  入场强制回仪表盘（设计稿会用 localStorage 记住上次视图，这里覆盖）。
- 站点头部「虚拟卡」点击 → `/merchant`（同壳换内容，与 huoad 原站导航体验一致）；
  下拉四项指向 `?view=` 深链。
- 字体隔离：site.css 的 body 字体会外溢，SiteHeader 与白卡侧栏显式锁 Geist；
  注入内容保持 Faorbit 自己的字体栈（原样）。
- KPI 数值由设计稿 demo store（localStorage）动态计算，交互后会变，属原型自身行为。

## 对拍结果（2026-07-13）

基准 = 设计稿原型 + merchant-surface 包装 + site.css/merchant.css（生产顺序），与克隆版
在 1440×900 下 17 项指标（侧栏/顶栏/dash-body 矩形、4 张 KPI 卡矩形、donut、导航项矩形与
字体颜色、主按钮矩形与颜色、表格行矩形、身份、问候语）**逐项完全一致**。

## 注意

- 对拍基准临时目录 `public/proto/` 已删除；需要复现时把 design-src/dashboard.html + Vcc
  public 资源复制过来并做上述两处 patch（加 merchant.css、包 merchant-surface）即可。
- 侧边栏内 my-wallet / team-permissions 等跨页链接指向未克隆的路由，点击 404，属预期范围外。
