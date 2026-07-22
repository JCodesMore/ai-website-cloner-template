/** 短信接码板块 — 领域类型 + mock 目录数据 + 纯派生函数。
 *  取自 Numo 接码平台原型（~/Desktop/接码平台/web）：数据即 UI 与后端的唯一接缝，
 *  接真实 API 时替换这里的常量/派生即可，不动组件。
 *  原型的临时邮箱产品线（MAIL_ENABLED=false，界面不可见）未随迁。 */

export interface SmsService {
  id: string;
  name: string;
  slug: string;
  /** 品牌色（hex，无 #），本地 SVG 加载失败时字母兜底用 */
  hex: string;
  stock: number;
  /** 起价（USD） */
  price: number;
}

/** 国家/运营商行（未按服务定价前） */
export interface CountryBase {
  flag: string;
  country: string;
  operator: string;
  /** 近 7 日接码成功率，0–100 */
  rate: number;
  /** 成功率的统计样本数（近 7 日） */
  samples: number;
  stock: number;
  /** 相对服务起价的价格系数 */
  factor: number;
  number: string;
}

/** 按服务算出具体价格后的国家/运营商选项 */
export interface CountryOption extends CountryBase {
  price: number;
}

export type OrderStatus = "waiting" | "received" | "expired";

/** 进行中的激活订单 */
export interface SmsOrder {
  serviceName: string;
  iconUrl: string;
  flag: string;
  place: string;
  number: string;
  price: number;
  /** 距自动退款剩余秒数 */
  secs: number;
  code: string | null;
  source: string | null;
  status: OrderStatus;
  /** 经智能路由下单 */
  smart: boolean;
  /** 已收码结算过——之后的关闭/超时不算退款 */
  settled?: boolean;
}

/** 共享状态里的激活 = 订单 + 追踪元数据 */
export interface Activation extends SmsOrder {
  id: string;
  /** 创建时间（ms） */
  createdAt: number;
  /** 本轮「等待中」的起点（ms），驱动自动收码 */
  waitStartedAt: number;
}

export type OrderHistoryStatus = "received" | "waiting" | "refunded";

/** 本次会话已关闭（完成/退款）的激活 */
export interface ClosedActivation extends Activation {
  histStatus: OrderHistoryStatus;
  /** 关闭时间（ms） */
  closedAt: number;
}

/** 充值折扣档位 */
export interface Tier {
  name: string;
  /** 累计充值门槛（USD） */
  min: number;
  /** 赠送百分比 */
  bonus: number;
}

export interface PayMethod {
  id: string;
  name: string;
  desc: string;
}

/** 钱包流水。金额带符号：+ 入账，− 出账 */
export type LedgerType = "recharge" | "bonus" | "spend" | "freeze" | "refund";

export interface LedgerEntry {
  id: string;
  type: LedgerType;
  title: string;
  amount: number;
  /** 本笔之后的可用余额 */
  balanceAfter: number;
  /** 展示时间（种子行是相对时间，实时行是时分） */
  time: string;
}

/** 订单页历史行 */
export interface OrderRow {
  service: string;
  slug: string;
  hex: string;
  flag: string;
  place: string;
  number: string;
  code: string | null;
  amount: string;
  status: OrderHistoryStatus;
  time: string;
}

/* ── mock 数据 ─────────────────────────────────────────── */

export const SMS_SERVICES: SmsService[] = [
  { id: "telegram", name: "Telegram", slug: "telegram", hex: "26A5E4", stock: 3600000, price: 0.1 },
  { id: "whatsapp", name: "WhatsApp", slug: "whatsapp", hex: "25D366", stock: 2230000, price: 0.15 },
  { id: "google", name: "Google", slug: "google", hex: "4285F4", stock: 10800000, price: 0.006 },
  { id: "openai", name: "OpenAI", slug: "openai", hex: "000000", stock: 1870000, price: 0.025 },
  { id: "instagram", name: "Instagram", slug: "instagram", hex: "E4405F", stock: 950000, price: 0.2 },
  { id: "tiktok", name: "TikTok", slug: "tiktok", hex: "000000", stock: 1420000, price: 0.18 },
  { id: "facebook", name: "Facebook", slug: "facebook", hex: "1877F2", stock: 880000, price: 0.22 },
  { id: "discord", name: "Discord", slug: "discord", hex: "5865F2", stock: 640000, price: 0.12 },
];

export const COUNTRY_BASE: CountryBase[] = [
  { flag: "🇮🇳", country: "印度", operator: "Airtel", rate: 41, samples: 3820, stock: 12880, factor: 0.9, number: "+91 98201 45732" },
  { flag: "🇮🇩", country: "印尼", operator: "Virtual53", rate: 82, samples: 6410, stock: 5144, factor: 1.9, number: "+62 812 8834 2201" },
  { flag: "🇵🇭", country: "菲律宾", operator: "Globe", rate: 76, samples: 2970, stock: 3201, factor: 1.5, number: "+63 917 620 0148" },
  { flag: "🇷🇺", country: "俄罗斯", operator: "MTS", rate: 68, samples: 5130, stock: 8760, factor: 1.4, number: "+7 903 118 4127" },
  { flag: "🇳🇬", country: "尼日利亚", operator: "MTN", rate: 37, samples: 4405, stock: 22010, factor: 0.7, number: "+234 802 551 9930" },
  { flag: "🇺🇸", country: "美国", operator: "non-VoIP", rate: 91, samples: 1180, stock: 1540, factor: 4.5, number: "+1 341 555 0132" },
];

export const TIERS: Tier[] = [
  { name: "普通", min: 0, bonus: 0 },
  { name: "白银", min: 100, bonus: 3 },
  { name: "黄金", min: 300, bonus: 6 },
  { name: "铂金", min: 600, bonus: 10 },
  { name: "钻石", min: 1000, bonus: 15 },
];

// 仅 MVP 主通道（USDT 一等 + 支付宝/银联覆盖中文客群），未接通的通道不展示
export const PAY_METHODS: PayMethod[] = [
  { id: "usdt-trc20", name: "USDT · TRC20", desc: "推荐 · 手续费最低" },
  { id: "alipay", name: "支付宝", desc: "人民币结算" },
  { id: "unionpay", name: "银联", desc: "银行卡快捷" },
];

export const QUICK_AMOUNTS = [50, 100, 300, 600, 1000];

/** 演示钱包初始状态 */
export const SMS_WALLET = {
  balance: 24.6,
  frozen: 0.45,
  cumulative: 316,
};

export const ORDER_HISTORY: OrderRow[] = [
  { service: "Telegram", slug: "telegram", hex: "26A5E4", flag: "🇮🇩", place: "印尼 · Virtual53", number: "+62 812 8834 2201", code: "834 921", amount: "$0.19", status: "received", time: "2 分钟前" },
  { service: "WhatsApp", slug: "whatsapp", hex: "25D366", flag: "🇵🇭", place: "菲律宾 · Globe", number: "+63 917 620 0148", code: "552 019", amount: "$0.23", status: "received", time: "14 分钟前" },
  { service: "OpenAI", slug: "openai", hex: "000000", flag: "🇺🇸", place: "美国 · non-VoIP", number: "+1 341 555 0132", code: null, amount: "冻结中", status: "waiting", time: "刚刚" },
  { service: "Google", slug: "google", hex: "4285F4", flag: "🇮🇳", place: "印度 · Airtel", number: "+91 98201 45732", code: null, amount: "已退回", status: "refunded", time: "22 分钟前" },
  { service: "Instagram", slug: "instagram", hex: "E4405F", flag: "🇷🇺", place: "俄罗斯 · MTS", number: "+7 903 118 4127", code: "730 244", amount: "$0.28", status: "received", time: "1 小时前" },
  { service: "TikTok", slug: "tiktok", hex: "000000", flag: "🇮🇩", place: "印尼 · Virtual53", number: "+62 813 5521 9930", code: "118 402", amount: "$0.34", status: "received", time: "2 小时前" },
  { service: "Facebook", slug: "facebook", hex: "1877F2", flag: "🇳🇬", place: "尼日利亚 · MTN", number: "+234 802 551 9930", code: null, amount: "已退回", status: "refunded", time: "3 小时前" },
];

/** 各支付方式的演示收款地址（mock，不可用） */
export const DEPOSIT_ADDRESS: Record<string, { network: string; address: string }> = {
  "usdt-trc20": { network: "TRON (TRC20)", address: "TQn9Y2khEsLJW1ChVWFMSMeRDow5Kcbm2v" },
};

/** 钱包流水种子（最新在前） */
export const LEDGER_SEED: LedgerEntry[] = [
  { id: "l1", type: "spend", title: "Telegram · 印尼 Virtual53", amount: -0.19, balanceAfter: 24.6, time: "2 分钟前" },
  { id: "l2", type: "refund", title: "Google · 印度 Airtel（超时退回）", amount: +0.09, balanceAfter: 24.79, time: "22 分钟前" },
  { id: "l3", type: "freeze", title: "OpenAI · 美国 non-VoIP（冻结）", amount: -0.45, balanceAfter: 24.7, time: "刚刚" },
  { id: "l4", type: "spend", title: "WhatsApp · 菲律宾 Globe", amount: -0.23, balanceAfter: 24.7, time: "14 分钟前" },
  { id: "l5", type: "bonus", title: "充值赠送 +6%", amount: +18.0, balanceAfter: 24.93, time: "3 天前" },
  { id: "l6", type: "recharge", title: "USDT · TRC20 充值", amount: +300.0, balanceAfter: 6.93, time: "3 天前" },
];

/** 演示态自动送达验证码的等待秒数 */
export const AUTO_RECEIVE_SECS = 4;
/** 激活有效期（秒），到期自动退款（20 分钟） */
export const ACTIVATION_SECS = 1200;

/* ── 纯派生 ───────────────────────────────────────────── */

/** 累计充值额已达到的最高档位 */
export function tierFor(amount: number): Tier {
  let tier = TIERS[0];
  for (const t of TIERS) if (amount >= t.min) tier = t;
  return tier;
}

/** 累计充值额之上的下一档，已封顶返回 null */
export function nextTierFor(amount: number): Tier | null {
  return TIERS.find((t) => t.min > amount) ?? null;
}

/** 给定服务的具体国家选项（含按系数算出的价格） */
export function countriesFor(service: SmsService): CountryOption[] {
  return COUNTRY_BASE.map((c) => ({
    ...c,
    price: +(service.price * c.factor).toFixed(3),
  }));
}

/* ── 格式化 ───────────────────────────────────────────── */

/** USD 金额：常规 2 位小数，厘位非零时 3 位 */
export function fmtPrice(p: number): string {
  return "$" + p.toFixed(3).replace(/0$/, "");
}

/** 库存数，大数带「万」 */
export function fmtStock(n: number): string {
  if (n >= 10000) {
    let v = n / 10000;
    v = v >= 100 ? Math.round(v) : Math.round(v * 10) / 10;
    return v + "万";
  }
  return n.toLocaleString("en-US");
}

/** 秒 → MM:SS */
export function fmtCountdown(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

/** 6 位验证码空格分组："123 456" */
export function spaceCode(code: string): string {
  return code.slice(0, 3) + " " + code.slice(3);
}

/** 服务品牌 SVG（scripts 从 Iconify logos 集下载到本地），BrandIcon 失败时字母兜底 */
export function iconUrl(service: Pick<SmsService, "slug">): string {
  return `/images/sms/brands/${service.slug}.svg`;
}

/** 随机 6 位验证码 */
export function genCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/** 演示短信正文 */
export function smsBody(serviceName: string, code: string): string {
  return `【${serviceName}】您的验证码是 ${code}，5 分钟内有效，请勿泄露给任何人。`;
}

/** 批量下单时随机化号码尾数，让各单看起来不同 */
export function varyNumber(n: string): string {
  const out = n.split("");
  let count = 0;
  for (let i = out.length - 1; i >= 0 && count < 4; i--) {
    if (/\d/.test(out[i])) {
      out[i] = String(Math.floor(Math.random() * 10));
      count++;
    }
  }
  return out.join("");
}

/** header + 数据行 → CSV（RFC 4180 转义） */
export function toCsv(header: string[], rows: string[][]): string {
  const esc = (v: string) => {
    const s = v ?? "";
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  return [header, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
}
