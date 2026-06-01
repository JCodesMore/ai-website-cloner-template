import type { Product, Institution } from "@/types";

export const PAGE_SIZE = 18;
export const PAGE_SIZE_FAST = 18;

export function getPage(searchParams: URLSearchParams): number {
  const p = parseInt(searchParams.get("page") || "1", 10);
  return Math.max(1, isNaN(p) ? 1 : p);
}

export function getWd(searchParams: URLSearchParams): string {
  return (searchParams.get("wd") || "").trim();
}

export function paginate<T>(items: T[], page: number, perPage: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    currentPage: safePage,
    totalPages,
    total: items.length,
  };
}

// ── Institution type detection ──────────────────────────
const socbKeywords = ["工商银行", "建设银行", "农业银行", "中国银行", "交通银行", "邮储银行", "邮储", "邮政储蓄", "开发银行", "进出口银行", "农业发展银行"];
const jscbKeywords = ["招商银行", "浦发银行", "中信银行", "光大银行", "华夏银行", "民生银行", "广发银行", "兴业银行", "平安", "浙商银行", "渤海银行", "恒丰银行", "北京银行", "上海银行", "南京银行", "宁波银行", "中原银行", "新网银行", "吉林银行", "天津银行", "盛京银行", "长安银行", "华兴银行", "微众银行", "北京农商行", "百信银行", "泸州银行", "长江银行", "网商银行", "汉口银行", "徽商银行", "东莞银行", "华润银行", "宁夏银行", "成都银行", "青岛银行", "广州银行", "华瑞银行", "众邦银行", "济宁银行", "振兴银行", "上海农商银行", "邮惠万家银行", "江苏银行", "富邦华"];
const cfcKeywords = ["消费金融", "消金", "捷信", "马上消费", "招联"];

export function getInstitutionType(name: string, fullName?: string): string {
  const text = name + (fullName || "");
  if (socbKeywords.some((k) => text.includes(k))) return "socb";
  if (jscbKeywords.some((k) => text.includes(k))) return "jscb";
  if (cfcKeywords.some((k) => text.includes(k))) return "cfc";
  if (/(担保|咨询|科技|服务|信息|商务|小贷|小额贷款|租赁|金融|车融|典当)/.test(text)) return "lmc";
  return "other";
}

export function filterByIk<T extends { institution: string }>(items: T[], ik: string): T[] {
  if (!ik) return items;
  return items.filter((p) => getInstitutionType(p.institution) === ik);
}

export function filterInstitutionsByIk(items: Institution[], ik: string): Institution[] {
  if (!ik) return items;
  return items.filter((inst) => getInstitutionType(inst.name, inst.fullName) === ik);
}

// ── Tag filter (company page — promo field) ─────────────
const tagPromoMap: Record<string, string[]> = {
  "24": ["专精特新"],
  "25": ["国高新"],
  "26": ["科技类"],
  "27": ["创新类"],
  "29": ["涉农类"],
  "37": ["小巨人"],
  "38": ["专利贷"],
};

export function filterByTag<T extends { promo?: string }>(items: T[], tagId: string): T[] {
  if (!tagId || !tagPromoMap[tagId]) return items;
  const keywords = tagPromoMap[tagId];
  return items.filter((p) => p.promo && keywords.some((k) => p.promo!.includes(k)));
}

// ── Advantage filter (cross-ref with productDetails) ────
import { productDetails } from "@/lib/data";

const companyAdvMap: Record<string, string[]> = {
  "35": ["3-5年"],
  "40": ["国有银行"],
  "41": ["先息后本"],
  "42": ["法人不连带"],
  "44": ["法人不占股"],
  "51": ["轻视征信"],
  "58": ["负债高"],
  "60": ["线下"],
};

const personAdvMap: Record<string, string[]> = {
  "45": ["极速下款"],
  "46": ["社保公积金"],
  "53": ["征信宽松"],
  "54": ["3-5年"],
  "55": ["先息后本"],
  "61": ["线下"],
  "62": ["消费分期"],
};

export function filterByAdv<T extends { id: number }>(
  items: T[],
  advId: string,
  category: string,
): T[] {
  if (!advId) return items;
  const advMap = category === "person" ? personAdvMap : companyAdvMap;
  const keywords = advMap[advId];
  if (!keywords) return items;

  return items.filter((p) => {
    const detail = productDetails.find(
      (d) => d.id === p.id && d.category === category,
    );
    if (!detail) return false;
    return keywords.some((k) => detail.advantages.some((a) => a.includes(k)));
  });
}

// ── Institution search ──────────────────────────────────
export function searchInstitutions(items: Institution[], wd: string): Institution[] {
  if (!wd) return items;
  const q = wd.toLowerCase();
  return items.filter(
    (inst) =>
      inst.name.toLowerCase().includes(q) ||
      (inst.fullName && inst.fullName.toLowerCase().includes(q)),
  );
}

// ── Institution sort ────────────────────────────────────
export function sortInstitutions(
  items: Institution[],
  ob: string,
  od: string,
): Institution[] {
  const order = ob === "productNum" && od === "asc" ? "asc" : "desc";
  return [...items].sort((a, b) =>
    order === "asc" ? a.productCount - b.productCount : b.productCount - a.productCount,
  );
}
