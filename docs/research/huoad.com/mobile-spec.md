# huoad.com 移动版规格（UA 分流布局）

> 2026-07-20 用 iPhone UA 抓取 https://www.huoad.com/zh/category/ig-account 提取
> （桌面 UA 在窄视口拿到的仍是桌面布局，移动版必须带手机 UA 才能抓到）。
> 原始 HTML/CSS 抓取件见抓取会话 scratchpad；模块名 `*-mobile-module-scss-module__*`。

## 关键结论

- **服务端按 User-Agent 分流**：手机 UA 返回一套独立移动布局（黑顶条 + 底部导航），
  与桌面 DOM 完全不同。我们用 CSS `@media (max-width: 768px)` 切换模拟同样效果。
- viewport meta：`width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no`
- 根字号 `html { font-size: 14px }`；**全局行高 1.4**（12px→16.8 / 14px→19.6 / 18px→25.2 / 20px→28，
  不是 Tailwind 的 1.5）；body 背景 `#f5f5f5`
- CSS 变量（移动值）：`--gap: 16px`、`--secondary-gap: 12px`、`--header-height-mobile: 56px`、
  `--footer-height-mobile: 64px`、`--primary-color: #fa6b1f`

## 黑色顶条 header-mobile

- `position: sticky; top: 0`，**56px 高**，`padding: 12px 16px`，`background: #000`，z-index 10
- 左：logo 链接（`href="/zh"`）flex 撑满内容高 → **logo 图 32px**；`<h1>HUOAD</h1>` 20px/700，`margin-left: 8px`
- 右：语言切换「简体中文  |  USD-$」14px/500，`gap: 5px`，`padding: 5px 0`，lucide chevron-down 16px

## 内容区 page-content-mobile

- `padding: 16px`，`gap: 16px`，flex column，有底栏时 `margin-bottom: 64px`
- `min-height: calc(100vh - 56px - 64px)`

## 置顶分类 category-mobile pin_categories

- `grid repeat(4, 1fr)`，gap 16，条目居中
- 图：**60px 圆**，`border: 2px solid #e8e8e8`；当前分类 border 色 `#fa6b1f`
- 名：12px，`margin-top: 8px`
- 「更多」：60px 圆底 `#e5e7eb`（--text-gray-200），antd product 图标 32px

## 搜索框 search-mobile

- antd outlined affix 输入框：白底，`border-radius: 16px`，宽 100%，**实测高 40px**（controlHeight 40）
- placeholder「搜索商品...」，右侧灰色放大镜

## 标签筛选 filter-tag-mobile

- `padding: 16px 0`，上下 `1px solid #e9e9e9` 边线，wrap，gap 8
- 药丸：`padding: 8px 16px`，`border: 1px solid #e0e0e0`，`border-radius: 24px`，500 字重
- 选中：`background: #fa6b1f`，白字，边透明；页面初始「全部」选中（单选模型）

## 商品卡 product-mobile

- 列表：`grid repeat(2, 1fr)`，gap 12（--secondary-gap）
- 卡：白底，圆角 8，overflow hidden，`:active` 底色 `#fbfbfb`；整卡是 `<a>`
- 封面全宽；左上收藏钮：32px 圆，`background: #0006`，antd heart 描边 16px，色 `#e7000b`
- 内衬 12px；商品名 `#161616`/500，3 行截断
- 标签：橙底白字 10px，`padding: 2px 8px`，圆角 4，gap 8，`margin-top: 8px`
- 价格：**红 `#d40924`**（非桌面橙），18px/700，`margin-top: 8px`；`$` 与数字 gap 2px
- 库存行：flex 两端对齐；「充足」绿 `#00a63e` + 6px 圆点（间距 5px），12px；
  右侧 antd 主题 icon-only 主按钮**实测 40×40**、圆角 8、lucide cart 14px
- 卡脚：`padding: 8px 12px`，`border-top: 1px solid #f0f0f0`；
  店铺名 12px 蓝 `#155dfc`，「官」头像 14px 圆（橙底白字 10px）
- 移动版**无**分页、**无**右侧浮动按钮组

## 底部导航 navbar-mobile

- `position: fixed; bottom: 0`，**64px 高**，白底，`border-top: 1px solid #e0e0e0`，z-index 100
- 五格 `<a>` flex:1 竖排居中，gap 4，**12px** 字（行高 16.8），色 `#636363`，图标 lucide **17px**：
  首页(house `/zh`) / 购物车(shopping-cart `/zh/cart`，antd badge) /
  客服(headset `/zh/contact`) / 订单(file-text `/zh/user/order`，badge 容器无数字) / 我的(user `/zh/user`)
- badge「0」实测：18px 高、min-width 18、radius 9、**无内衬**、fs 12/lh 18、`zoom: .95`（→17.1px）、
  白描边 1px、`translate(50%,-50%)`；badge 容器高 19px → 购物车/订单两格图标比其余格高 1px、文字低 1px
- 激活：色 `#fa6b1f`，底 `#fff7ed`（--text-orange-50），600 字重
