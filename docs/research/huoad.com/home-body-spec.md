# HUOAD 首页正文 — Extraction Spec

Source: https://huoad.com/zh (redirects to /zh/category/ig-account content, extracted 2026-07-15, viewport 1440×900)
Complements: header-spec.md (fixed header, 143px). Body starts below at padding-top 20px.
Site tokens: `--primary-color #fa6b1f` · `--bg-gray-50 #f9fafb` · `--text-green-600 #00a63e`
· `--text-gray-500 (clear-btn gray)` · `--gap 20px` · `--secondary-gap 15px`

## Page topology (INTERACTION MODEL: click-driven; no scroll animations)

```
body bg #f5f5f5
└── container            same .inner: max-w 1320; min-w 1200; margin 0 auto; padding 20px
    ├── CategorySidebar  position: FIXED; top 163px; w 256; h calc(100vh - 183px);
    │                    bg #fff; radius 10px; overflow hidden
    └── .right           margin-left 276px (256+20); w calc(100% - 276px) ≈ 1004;
        │                flex column; gap 20px
        ├── FilterTags   bg #fff; radius 10; padding 14px 20px 20px
        ├── SortToolbar  bg #fff; radius 10; padding 10px 20px; h 54; flex between
        └── ProductList (list OR grid view) | ant-empty when 0 products
FloatingButtons          position fixed; right 15px; bottom 198px; z-index 1000
```

## CategorySidebar

- `.title` h 50; padding 0 20; flex between center; border-bottom 1px #eee
  - span: 18px/600, color `#2c3e50`, line-height 50px
  - `.sort` btn: 12px/400 #2c3e50; flex center gap 4px; cursor pointer; user-select none;
    icon lucide-settings-2 14×14; hover & .sorting → color #fa6b1f (装饰按钮,克隆只做 hover)
- `nav.categories` h calc(100% - 50px); overflow-y auto
  - scrollbar: width 3px; display none → block on nav:hover; thumb #d1d5db radius 3px,
    thumb hover #b0b4ba; track transparent
  - group row `.tag`: h 50; padding 10px 0 10px 25px; flex center(row); 16px/600
    rgba(0,0,0,.88); line-height 30px; img 25×25 + gap(≈8px margin) + label
  - child link `.category`: h 40; margin 0 10px 0 50px; padding 10px 0 10px 8px; radius 6;
    14px/400 #4a5565; flex center; cursor pointer; transition background-color .1s
    - hover: bg #f9fafb; font-weight 600
    - active(current): bg #fff7ed; color #fa6b1f; font-weight 600

### Category data (16 groups / 33 links; active = Instagram账号)

Instagram(cat/instagram.png): Instagram账号* /zh/category/ig-account · Instagram地区号
/zh/category/buy-geo-targeted-ig-accounts · Threads账号 /zh/category/th-account ·
Instagram认证 /zh/category/ig-accounts-verified
Facebook(cat/facebook.png): Facebook账号 /zh/category/fb-account · Facebook账号(指定国家)
/zh/category/fb-account-specific-country-geo-targeted · Facebook账号(指定货币)
/zh/category/fb-account-specific-currency-ad-manager · Facebook主页 /zh/category/fb-page ·
BM商务管理平台 /zh/category/fb-bm-business-manager · Facebook广告账户 /zh/category/fb-ad-account
TikTok(cat/tiktok.png): TikTok账号 /zh/category/tiktok-account · TikTok广告户
/zh/category/tiktok-ads-account · TikTok橱窗号 /zh/category/tiktok-showcase-account ·
TikTok店铺 /zh/category/tiktok-shop-store-seller-center-account
X / Twitter(cat/twitter.png): X(Twitter)账号 /zh/category/x-twitter-account ·
X(Twitter)广告账户 /zh/category/x-twitter-ads-account · X(Twitter)认证
/zh/category/x-twitter-accounts-verified
Telegram(cat/telegram.png): Telegram账号 /zh/category/telegram-account · Telegram频道
/zh/category/telegram-channel · Telegram会员 /zh/category/telegram-premium
Google(cat/google.png): Google广告账户 /zh/category/google-ads-accounts · Gmail账号
/zh/category/gmail-accounts · YouTube账号 /zh/category/youtube-account
Quora(cat/quora.png): Quora账号 /zh/category/quora-account
Snapchat(cat/snapchat.png): Snapchat账号 /zh/category/snapchat-account
VKontakte(cat/vkontakte.png): VKontakte账号 /zh/category/vkontakte-account
Reddit(cat/reddit.png): Reddit账号 /zh/category/reddit-account
Discord(cat/discord.jpg): Discord账户 /zh/category/discord-account
Apple ID(cat/appleid.png): Apple ID账号 /zh/category/apple-id-account
LinkedIn(cat/linkedin.jpeg): LinkedIn账号 /zh/category/linkedin-account
Line(cat/line.png): Line账号 /zh/category/line-account
Pinterest(cat/pinterest.png): Pinterest账号 /zh/category/pinterest-account
虚拟信用卡(cat/vcc.png): 虚拟信用卡 /zh/category/virtual-credit-card

## FilterTags (标签筛选)

- `.tag_box_title`: 14px/500 #364153; flex center gap 10px — text `标签筛选`
  - `.clear_tags` (仅选中标签时显示): 12px/400 gray-500; flex center; cursor pointer;
    hover color #fa6b1f; content: `×` icon + `清除筛选`
- `.tags`: margin-top 13.33px (=gap/1.5); flex wrap center; gap 10px (=gap/2)
- pill `> a`: padding 5px 10px; radius 6; border 1px #e0e0e0; 13.6px/600 #333;
  cursor pointer; user-select none; transition .2s
  - hover: bg #f9fafb; border-color #fa6b1f; color #fa6b1f
  - `.selected`: bg #fa6b1f; color #fff (border 保持 #e0e0e0)
- Pills: 贴文号 · 风景号 · 粉丝号 · 耐用推荐 · 新号 · 真人号 · 老号
- 行为: 点击切换选中(多选, AND 过滤商品), 计数即时更新; 0 结果 → ant-empty

### Tag→product mapping (extracted by clicking each pill live)

- 贴文号: p7, p8, p10, p11, p12, p13, p14
- 风景号: p7
- 粉丝号: p2, p10, p11, p12, p13, p14
- 耐用推荐: p2
- 新号: p1, p9
- 真人号: p10, p11, p12, p13, p14
- 老号: p3, p4, p5, p6, p7, p8, p10, p11, p12, p13, p14

## SortToolbar

- `.product_count`: 14px/400 rgba(0,0,0,.88) — `共 {n} 个商品`
- `.right`: flex center gap 15px — span `排序：` 14px + Select + view switch
- Select (antd): w 180; h 34; padding 6px 11px; radius 8; border 1px #d9d9d9; bg #fff;
  cursor pointer; 选项: 默认排序(默认) · 价格由低到高 · 价格由高到低
  - dropdown: bg #fff; radius 10; padding 4px; shadow 0 6px 16px rgba(0,0,0,.08),
    0 3px 6px -4px rgba(0,0,0,.12), 0 9px 28px 8px rgba(0,0,0,.05)
- `.display_type`: w 70; h 34; radius 8; border 1px #e0e0e0; flex; overflow hidden
  - item: 34×32; flex center; cursor pointer; icons 18×18 (lucide grid-3x3 | lucide list)
  - selected: bg #eee; cursor default。默认选中 list(右)

## ProductList — list view (默认)

- container `.product_list`: flex column; gap 15px (--secondary-gap)
- `.item`: flex center; gap 15px; padding 20px; bg #fff; radius 10 (h ≈140)
  - `img.cover` 100×100; radius 10
  - `.center` flex 1:
    - `a.link`: 15px/500 #000; line-height 21px; transition color .15s; hover #fa6b1f;
      display -webkit-box; -webkit-line-clamp 2 (list 视图单行即可,同源规则为 2 行 clamp)
    - `.product_info`: flex; gap 20px; margin-top 12px; 13px #666
      - `a.shop_name`: flex center gap 5px; color #155dfc; transition color .3s
        - `span.avatar`: 18×18; radius 50%; bg #fa6b1f; color #fff; 10px; flex center — `官`
        - text `官方`
      - p `规格：{n}`
      - p `库存：` + span(充足→ color #00a63e | 数字→继承灰)
  - `.footer`: flex center; gap 20px
    - `.price`: 20px/700 rgba(0,0,0,.88); inner `.money` inline-flex gap 2px: `$`+`1.00`
    - buy button (antd primary): h 36; padding 0 15px; radius 8; gap 8px; 14px/500 #fff;
      bg #fa6b1f; border 1px transparent; shadow 0 2px 0 rgba(255,130,5,.08);
      transition .2s cubic-bezier(.645,.045,.355,1); hover bg #e55a0f; active #d44d0f;
      icon lucide-shopping-cart 14×14 + `加入购物车`

## ProductList — grid view

- container `.product_grids`: grid; grid-template-columns repeat(3, 1fr); gap 15px
- card `.item`: flex column; gap 10px; padding 10px; bg #fff; radius 10 (h ≈246)
  - cover 70×70 radius 10 (左上)
  - center: link 2-line clamp (h 42); product_info flex wrap; gap 10px 20px; margin-top 12
  - footer: flex between center — price 左, buy button 右

## Empty state (0 商品)

antd Empty (PRESENTED_IMAGE_DEFAULT): svg 184×152 居中 (image 区 h 112.5, margin-bottom 8),
description `无数据` 14px rgba(0,0,0,.45), 整体 margin 0 8px, text-align center

## FloatingButtons

- group: fixed; right 15px; bottom 198px; w 50; z 1000; flex column; gap 16px
- 每个按钮 50×50 圆形; shadow 0 6px 16px rgba(0,0,0,.08), 0 3px 6px -4px rgba(0,0,0,.12),
  0 9px 28px 8px rgba(0,0,0,.05); hover transform scale(1.1) (transition .2s)
- 购物车: bg #fa6b1f; lucide-shopping-cart 24×24 #fff; badge: 18×18 sup at top-right
  translate(50%,-50%) 内缩 margin 4px 4px 0 0; bg #ff4d4f; #fff 12px/18px; radius 9px;
  shadow 0 0 0 1px #fff — 数字 `0`
- Telegram: bg #0088cc; → https://t.me/HUOAD (fab fa-telegram → 内联 SVG)
- WhatsApp: bg #25d366; → https://wa.me/37060084934 (fab fa-whatsapp → 内联 SVG)
- 在线聊天: bg #008aff; → https://chat.huoaccs.com/ ; img online-chat.svg 22×22 (自带动画)

## Products (verbatim, p1–p14)

| # | title | img | 规格 | 库存 | price | href (/zh/product/…) |
|---|-------|-----|-----|------|-------|----------------------|
| 1 | Instagram账号 \| 小白号 - 随机贴文 - 随机粉丝 - 轻松登录 | ig-1 | 2 | 充足 | $1.00 | buy-ig-new-account-random-followers-posts |
| 2 | Instagram账号 \| 50+粉丝 - 包含Email - 随机贴文 - 启用2FA - 推荐购买 | ig-2 | 3 | 充足 | $2.96 | buy-ig-account-50-followers-email-2fa |
| 3 | Instagram账号 \| 老号 - 2025年注册 - 启用2FA - 随机贴文 - 随机粉丝 | ig-3 | 1 | 充足 | $2.00 | buy-2fa-aged-ig-accounts-2025 |
| 4 | Instagram账号 \| 老号 - 2024年注册 - 启用2FA - 随机贴文 - 随机粉丝 | ig-3 | 1 | 98 | $2.60 | buy-2fa-aged-ig-accounts-2024 |
| 5 | Instagram账号 \| 老白号 - 注册1-3年 - 启用2FA | ig-4 | 3 | 充足 | $2.79 | buy-aged-ig-blank-account-one-to-three-years-two-factor-authentication |
| 6 | Instagram账号 \| 2020-2024年 - 开启2FA - 随机贴文 - 随机粉丝 - 关注100-200 - 适合批量关注 | ig-3 | 3 | 充足 | $7.00 | buy-2fa-aged-ig-accounts-for-mass-following |
| 7 | Instagram账号 \| 欧美女性 - 高端名媛贴文号 - 2018-2024年 - 帖子8-50 - 启用2FA - 包含邮箱 Firstmail.ltd/ - 耐用推荐 | ig-3 | 3 | 充足 | $12.00 | buy-us-eu-female-socialite-ig-accounts |
| 8 | Instagram账号 \| 2022-2024年 - 0-5贴文 - 随机粉丝 - 开启2FA - 邮箱 tr.ee/pC8amj | ig-3 | 3 | 充足 | $4.50 | buy-2fa-aged-ig-accounts-2022-2024 |
| 9 | Instagram账号 \| 英文名 - 1-3个月 - 开启2FA - 邮箱 temp-mail.io - 已解锁282 | ig-3 | 3 | 充足 | $2.10 | buy-2fa-ig-accounts-282-unlocked |
| 10 | Instagram账号｜真人老号 - 2010-2019年注册 - 带老帖文 - 真实粉丝50-100 - 启用2FA - 包含邮箱 | ig-5 | 1 | 充足 | $10.00 | instagram-real-old-2010-2019-posts-followers-50-100-2fa-email |
| 11 | Instagram账号｜真人老号 - 2010-2019年注册 - 带老帖文 - 真实粉丝100-200 - 启用2FA - 包含邮箱 | ig-6 | 1 | 充足 | $12.00 | instagram-real-old-2010-2019-posts-followers-100-200-2fa-email |
| 12 | Instagram账号｜真人老号 - 2010-2019年注册 - 带老帖文 - 真实粉丝200-400 - 启用2FA - 包含邮箱 | ig-6 | 1 | 充足 | $15.00 | instagram-real-old-2010-2019-posts-followers-200-400-2fa-email |
| 13 | Instagram账号｜真人老号 - 2010-2019年注册 - 带老帖文 - 真实粉丝400-600 - 启用2FA - 包含邮箱 | ig-6 | 1 | 充足 | $18.00 | instagram-real-old-2010-2019-posts-followers-400-600-2fa-email |
| 14 | Instagram账号｜真人老号 - 2010-2019年注册 - 带老帖文 - 真实粉丝600-1000 - 启用2FA - 包含邮箱 | ig-6 | 1 | 充足 | $20.00 | instagram-real-old-2010-2019-followers-600-to-1k-2fa-email |

## Responsive

原站桌面版 min-width 1200(与 header 相同, <1200 溢出滚动)。存在独立 category-mobile
模块的移动端布局,但克隆范围与已完成的 header 一致: 仅桌面版。
