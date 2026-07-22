/** LamaProxy 住宅代理仪表盘 — 数据与文案。
 *  取自原站 dashboard.lamaproxy.com 打包产物与公开 API：
 *  - 套餐价格 / 折扣：/api/proxy/{type}/plans
 *  - 中文文案：打包内 i18n zh 命名空间（common / nav / proxy）
 *  纯演示壳，无真实后端。 */

export type ProxyType = "residential" | "mobile";

export interface TrafficPlan {
  id: string;
  trafficGb: number;
  /** 折扣系数，1 表示原价；小于 1 表示打折（如 0.92 = 8% off） */
  discount: number;
}

/** 住宅 / 移动流量套餐 + 每 GB 基础单价（原站 API 原样） */
export const PLANS: Record<ProxyType, { pricePerGb: number; plans: TrafficPlan[] }> = {
  residential: {
    pricePerGb: 2.5,
    plans: [
      { id: "7c75f431-8488-43c6-9320-a26d31f14d32", trafficGb: 1, discount: 1 },
      { id: "a6ff485a-ccf1-428d-9215-8bb475afabbf", trafficGb: 5, discount: 0.92 },
      { id: "3413cc92-8ac7-4603-bd45-ebb80933d275", trafficGb: 10, discount: 0.88 },
      { id: "fcc3e80a-a181-4102-8e73-6d69fb57895d", trafficGb: 50, discount: 0.84 },
      { id: "35a51c5d-4402-4801-99f8-1f9f58eaf62a", trafficGb: 100, discount: 0.72 },
    ],
  },
  mobile: {
    pricePerGb: 5,
    plans: [
      { id: "d286cad7-c69c-4fc4-9496-cca7492d3028", trafficGb: 1, discount: 1 },
      { id: "367fdfbe-5f66-4c94-9695-0b0c91f9feb2", trafficGb: 5, discount: 0.92 },
      { id: "c2f27b61-7a4e-438e-abc0-d12f792f8f3c", trafficGb: 10, discount: 0.88 },
      { id: "7d53e756-069c-403d-a91d-1cd11dfc5f33", trafficGb: 20, discount: 0.84 },
    ],
  },
};

/** 已购代理条目（演示样本，结构对齐原站 my/traffic 返回） */
export interface PurchasedProxy {
  id: string;
  usedGb: number;
  totalGb: number;
  proxyHost: string;
  proxyPort: number;
  proxyPortSocks5: number;
  stickyPortStart: number;
  stickyPortEnd: number;
  proxyUsername: string;
  proxyPassword: string;
  /** ISO 3166-1 alpha-2 国家码（渲染为国旗 emoji） */
  whitelist: string[];
}

export const SAMPLE_PURCHASED: Record<ProxyType, PurchasedProxy[]> = {
  residential: [
    {
      id: "res_8f21c40a",
      usedGb: 3.4,
      totalGb: 10,
      proxyHost: "gw.lamaproxy.com",
      proxyPort: 823,
      proxyPortSocks5: 824,
      stickyPortStart: 11000,
      stickyPortEnd: 12000,
      proxyUsername: "icVwrpJC",
      proxyPassword: "UAs1mFAB",
      whitelist: ["US", "GB", "DE"],
    },
  ],
  mobile: [],
};

/** 语言切换器选项 */
export const LANGUAGES = [
  { code: "zh", flag: "🇨🇳", label: "中文" },
  { code: "en", flag: "🇺🇸", label: "English" },
  { code: "ru", flag: "🇷🇺", label: "Русский" },
  { code: "vi", flag: "🇻🇳", label: "Tiếng Việt" },
] as const;

/** 底部悬浮联系入口（原站 /api/proxy/site-links） */
export const SITE_LINKS = {
  telegram: "https://t.me/HUOAD",
  whatsapp: "https://wa.me/37060084934",
  livechat: "https://chat.huoaccs.com/",
};

/** 中文文案（原站 zh 命名空间） */
export const T = {
  // common
  balance: "余额",
  logout: "退出登录",
  accountSecurity: "账号安全",
  logoutConfirmTitle: "确认退出",
  logoutConfirmText: "确定要退出登录吗？",
  cancel: "取消",
  tfa2faWarning: "您的账号尚未开启两步验证，建议开启以提升安全性。",
  tfa2faWarningAction: "立即开启",
  // nav
  nav: {
    dashboard: "仪表盘",
    isp: "ISP 代理",
    datacenter: "数据中心代理",
    residential: "住宅代理",
    mobile: "移动代理",
    myProxies: "已购代理",
  },
  // proxy
  order: {
    title: "您的订单",
    total: "总计",
    checkout: "结账",
    perGB: "/GB",
    empty: "请先选择套餐",
  },
  plan: {
    traffic: "流量",
    price: "单价",
    selectPlan: "选择流量套餐",
    noPlans: "暂无可用套餐，请稍后再试",
  },
  proxyList: {
    title: "代理列表",
    rotating: "轮询代理",
    sticky: "粘滞代理",
    protocol: "协议",
    quantity: "数量",
    copy: "复制",
    copied: "已复制",
    download: "下载",
  },
  myProxies: {
    purchased: "已购套餐",
    config: "配置",
    upgrade: "升级",
    used: "已使用",
    remaining: "剩余",
    connectionInfo: "连接信息",
    stickyPort: "粘滞端口",
    username: "账号",
    password: "密码",
    whitelist: "白名单国家",
    credentialsPending: "代理凭证生成中，请稍后刷新",
  },
} as const;

/** 金额格式：$X.XX */
export const fmtPrice = (n: number) => "$" + Number(n).toFixed(2);

/** 折扣系数 → 折扣百分比字符串（0.92 → "8"） */
export const discountPct = (d: number) => {
  const t = (1 - d) * 100;
  return parseFloat(t.toPrecision(4)).toString();
};

/** 国家码 → 国旗 emoji */
export const flagOf = (code: string) =>
  [...code.toUpperCase()]
    .map((c) => String.fromCodePoint(127462 + c.charCodeAt(0) - 65))
    .join("");
