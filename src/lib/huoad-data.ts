// 数据来源: docs/research/huoad.com/home-body-spec.md (2026-07-15 从 huoad.com/zh 提取)

export interface CategoryGroup {
  label: string;
  icon: string; // /images/huoad/cat/*
  children: { label: string; href: string; active?: boolean }[];
}

export interface Product {
  id: number;
  title: string;
  href: string;
  image: string; // /images/huoad/products/*
  spec: number;
  stock: "充足" | number;
  price: number;
  tags: string[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    label: "Instagram",
    icon: "/images/huoad/cat/instagram.png",
    children: [
      { label: "Instagram账号", href: "/zh/category/ig-account", active: true },
      { label: "Instagram地区号", href: "/zh/category/buy-geo-targeted-ig-accounts" },
      { label: "Threads账号", href: "/zh/category/th-account" },
      { label: "Instagram认证", href: "/zh/category/ig-accounts-verified" },
    ],
  },
  {
    label: "Facebook",
    icon: "/images/huoad/cat/facebook.png",
    children: [
      { label: "Facebook账号", href: "/zh/category/fb-account" },
      { label: "Facebook账号(指定国家)", href: "/zh/category/fb-account-specific-country-geo-targeted" },
      { label: "Facebook账号(指定货币)", href: "/zh/category/fb-account-specific-currency-ad-manager" },
      { label: "Facebook主页", href: "/zh/category/fb-page" },
      { label: "BM商务管理平台", href: "/zh/category/fb-bm-business-manager" },
      { label: "Facebook广告账户", href: "/zh/category/fb-ad-account" },
    ],
  },
  {
    label: "TikTok",
    icon: "/images/huoad/cat/tiktok.png",
    children: [
      { label: "TikTok账号", href: "/zh/category/tiktok-account" },
      { label: "TikTok广告户", href: "/zh/category/tiktok-ads-account" },
      { label: "TikTok橱窗号", href: "/zh/category/tiktok-showcase-account" },
      { label: "TikTok店铺", href: "/zh/category/tiktok-shop-store-seller-center-account" },
    ],
  },
  {
    label: "X / Twitter",
    icon: "/images/huoad/cat/twitter.png",
    children: [
      { label: "X(Twitter)账号", href: "/zh/category/x-twitter-account" },
      { label: "X(Twitter)广告账户", href: "/zh/category/x-twitter-ads-account" },
      { label: "X(Twitter)认证", href: "/zh/category/x-twitter-accounts-verified" },
    ],
  },
  {
    label: "Telegram",
    icon: "/images/huoad/cat/telegram.png",
    children: [
      { label: "Telegram账号", href: "/zh/category/telegram-account" },
      { label: "Telegram频道", href: "/zh/category/telegram-channel" },
      { label: "Telegram会员", href: "/zh/category/telegram-premium" },
    ],
  },
  {
    label: "Google",
    icon: "/images/huoad/cat/google.png",
    children: [
      { label: "Google广告账户", href: "/zh/category/google-ads-accounts" },
      { label: "Gmail账号", href: "/zh/category/gmail-accounts" },
      { label: "YouTube账号", href: "/zh/category/youtube-account" },
    ],
  },
  {
    label: "Quora",
    icon: "/images/huoad/cat/quora.png",
    children: [{ label: "Quora账号", href: "/zh/category/quora-account" }],
  },
  {
    label: "Snapchat",
    icon: "/images/huoad/cat/snapchat.png",
    children: [{ label: "Snapchat账号", href: "/zh/category/snapchat-account" }],
  },
  {
    label: "VKontakte",
    icon: "/images/huoad/cat/vkontakte.png",
    children: [{ label: "VKontakte账号", href: "/zh/category/vkontakte-account" }],
  },
  {
    label: "Reddit",
    icon: "/images/huoad/cat/reddit.png",
    children: [{ label: "Reddit账号", href: "/zh/category/reddit-account" }],
  },
  {
    label: "Discord",
    icon: "/images/huoad/cat/discord.jpg",
    children: [{ label: "Discord账户", href: "/zh/category/discord-account" }],
  },
  {
    label: "Apple ID",
    icon: "/images/huoad/cat/appleid.png",
    children: [{ label: "Apple ID账号", href: "/zh/category/apple-id-account" }],
  },
  {
    label: "LinkedIn",
    icon: "/images/huoad/cat/linkedin.jpeg",
    children: [{ label: "LinkedIn账号", href: "/zh/category/linkedin-account" }],
  },
  {
    label: "Line",
    icon: "/images/huoad/cat/line.png",
    children: [{ label: "Line账号", href: "/zh/category/line-account" }],
  },
  {
    label: "Pinterest",
    icon: "/images/huoad/cat/pinterest.png",
    children: [{ label: "Pinterest账号", href: "/zh/category/pinterest-account" }],
  },
  {
    label: "虚拟信用卡",
    icon: "/images/huoad/cat/vcc.png",
    children: [{ label: "虚拟信用卡", href: "/zh/category/virtual-credit-card" }],
  },
];

export const FILTER_TAGS = ["贴文号", "风景号", "粉丝号", "耐用推荐", "新号", "真人号", "老号"];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    title: "Instagram账号 | 小白号 - 随机贴文 - 随机粉丝 - 轻松登录",
    href: "/zh/product/buy-ig-new-account-random-followers-posts",
    image: "/images/huoad/products/ig-1.jpg",
    spec: 2,
    stock: "充足",
    price: 1.0,
    tags: ["新号"],
  },
  {
    id: 2,
    title: "Instagram账号 | 50+粉丝 - 包含Email - 随机贴文 - 启用2FA - 推荐购买",
    href: "/zh/product/buy-ig-account-50-followers-email-2fa",
    image: "/images/huoad/products/ig-2.jpg",
    spec: 3,
    stock: "充足",
    price: 2.96,
    tags: ["耐用推荐", "粉丝号"],
  },
  {
    id: 3,
    title: "Instagram账号 | 老号 - 2025年注册 - 启用2FA - 随机贴文 - 随机粉丝",
    href: "/zh/product/buy-2fa-aged-ig-accounts-2025",
    image: "/images/huoad/products/ig-3.jpg",
    spec: 1,
    stock: "充足",
    price: 2.0,
    tags: ["老号"],
  },
  {
    id: 4,
    title: "Instagram账号 | 老号 - 2024年注册 - 启用2FA - 随机贴文 - 随机粉丝",
    href: "/zh/product/buy-2fa-aged-ig-accounts-2024",
    image: "/images/huoad/products/ig-3.jpg",
    spec: 1,
    stock: 98,
    price: 2.6,
    tags: ["老号"],
  },
  {
    id: 5,
    title: "Instagram账号 | 老白号 - 注册1-3年 - 启用2FA",
    href: "/zh/product/buy-aged-ig-blank-account-one-to-three-years-two-factor-authentication",
    image: "/images/huoad/products/ig-4.jpg",
    spec: 3,
    stock: "充足",
    price: 2.79,
    tags: ["老号"],
  },
  {
    id: 6,
    title: "Instagram账号 | 2020-2024年 - 开启2FA - 随机贴文 - 随机粉丝 - 关注100-200 - 适合批量关注",
    href: "/zh/product/buy-2fa-aged-ig-accounts-for-mass-following",
    image: "/images/huoad/products/ig-3.jpg",
    spec: 3,
    stock: "充足",
    price: 7.0,
    tags: ["老号"],
  },
  {
    id: 7,
    title: "Instagram账号 | 欧美女性 - 高端名媛贴文号 - 2018-2024年 - 帖子8-50 - 启用2FA - 包含邮箱 Firstmail.ltd/ - 耐用推荐",
    href: "/zh/product/buy-us-eu-female-socialite-ig-accounts",
    image: "/images/huoad/products/ig-3.jpg",
    spec: 3,
    stock: "充足",
    price: 12.0,
    tags: ["老号", "贴文号", "风景号"],
  },
  {
    id: 8,
    title: "Instagram账号 | 2022-2024年 - 0-5贴文 - 随机粉丝 - 开启2FA - 邮箱 tr.ee/pC8amj",
    href: "/zh/product/buy-2fa-aged-ig-accounts-2022-2024",
    image: "/images/huoad/products/ig-3.jpg",
    spec: 3,
    stock: "充足",
    price: 4.5,
    tags: ["贴文号", "老号"],
  },
  {
    id: 9,
    title: "Instagram账号 | 英文名 - 1-3个月 - 开启2FA - 邮箱 temp-mail.io - 已解锁282",
    href: "/zh/product/buy-2fa-ig-accounts-282-unlocked",
    image: "/images/huoad/products/ig-3.jpg",
    spec: 3,
    stock: "充足",
    price: 2.1,
    tags: ["新号"],
  },
  {
    id: 10,
    title: "Instagram账号｜真人老号 - 2010-2019年注册 - 带老帖文 - 真实粉丝50-100 - 启用2FA - 包含邮箱",
    href: "/zh/product/instagram-real-old-2010-2019-posts-followers-50-100-2fa-email",
    image: "/images/huoad/products/ig-5.jpg",
    spec: 1,
    stock: "充足",
    price: 10.0,
    tags: ["真人号", "老号", "贴文号", "粉丝号"],
  },
  {
    id: 11,
    title: "Instagram账号｜真人老号 - 2010-2019年注册 - 带老帖文 - 真实粉丝100-200 - 启用2FA - 包含邮箱",
    href: "/zh/product/instagram-real-old-2010-2019-posts-followers-100-200-2fa-email",
    image: "/images/huoad/products/ig-6.jpg",
    spec: 1,
    stock: "充足",
    price: 12.0,
    tags: ["真人号", "老号", "贴文号", "粉丝号"],
  },
  {
    id: 12,
    title: "Instagram账号｜真人老号 - 2010-2019年注册 - 带老帖文 - 真实粉丝200-400 - 启用2FA - 包含邮箱",
    href: "/zh/product/instagram-real-old-2010-2019-posts-followers-200-400-2fa-email",
    image: "/images/huoad/products/ig-6.jpg",
    spec: 1,
    stock: "充足",
    price: 15.0,
    tags: ["真人号", "老号", "贴文号", "粉丝号"],
  },
  {
    id: 13,
    title: "Instagram账号｜真人老号 - 2010-2019年注册 - 带老帖文 - 真实粉丝400-600 - 启用2FA - 包含邮箱",
    href: "/zh/product/instagram-real-old-2010-2019-posts-followers-400-600-2fa-email",
    image: "/images/huoad/products/ig-6.jpg",
    spec: 1,
    stock: "充足",
    price: 18.0,
    tags: ["真人号", "老号", "贴文号", "粉丝号"],
  },
  {
    id: 14,
    title: "Instagram账号｜真人老号 - 2010-2019年注册 - 带老帖文 - 真实粉丝600-1000 - 启用2FA - 包含邮箱",
    href: "/zh/product/instagram-real-old-2010-2019-followers-600-to-1k-2fa-email",
    image: "/images/huoad/products/ig-6.jpg",
    spec: 1,
    stock: "充足",
    price: 20.0,
    tags: ["真人号", "老号", "贴文号", "粉丝号"],
  },
];
