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
  if (page > totalPages) return { items: [], currentPage: page, totalPages, total: items.length };
  const start = (page - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    currentPage: page,
    totalPages,
    total: items.length,
  };
}

// ── Institution type detection ──────────────────────────
const socbKeywords = ["工商银行", "建设银行", "农业银行", "中国银行", "交通银行", "邮储银行", "邮储", "邮政储蓄", "开发银行", "进出口银行", "农业发展银行"];
const jscbKeywords = ["招商银行", "浦发银行", "中信银行", "光大银行", "华夏银行", "民生银行", "广发银行", "兴业银行", "平安银行", "浙商银行", "渤海银行", "恒丰银行", "北京银行", "上海银行", "南京银行", "宁波银行", "中原银行", "新网银行", "吉林银行", "天津银行", "盛京银行", "长安银行", "华兴银行", "微众银行", "北京农商行", "百信银行", "泸州银行", "长江银行", "网商银行", "汉口银行", "徽商银行", "东莞银行", "华润银行", "宁夏银行", "成都银行", "青岛银行", "广州银行", "华瑞银行", "众邦银行", "济宁银行", "振兴银行", "上海农商银行", "邮惠万家银行", "江苏银行", "富邦华", "泰隆银行", "中银富登", "亿联银行", "中关村银行", "苏商银行", "青海银行", "杭州银行", "金城银行", "富民银行", "锡商银行", "厦门国际银行", "九银村镇银行"];
const otherKeywords = ["兴融小贷", "国融融担", "维信金科", "神机妙算", "易鑫金融", "中禾信", "祥衡科技", "中国太保", "甜橙租赁", "民生易租", "狮桥租赁", "仲利国际", "远东租赁", "远东宏信普惠", "永赢金租", "河北金租"];
	const cfcKeywords = ["消费金融", "京东消金", "唯品富邦消金", "中原消费", "杭银消费", "幸福消费", "晋商消金", "海尔消费", "哈银消费", "阳光消费", "中银消费", "宁银消金", "北银消费", "捷信", "马上消费", "招联", "苏银凯基", "长银五八", "南银法巴", "开泰银行"];

export function getInstitutionType(name: string, fullName?: string): string {
  const text = name + (fullName || "");
  if (socbKeywords.some((k) => text.includes(k))) return "socb";
  if (otherKeywords.some((k) => text.includes(k))) return "other";
  if (cfcKeywords.some((k) => text.includes(k))) return "cfc";
  if (jscbKeywords.some((k) => text.includes(k))) return "jscb";
  if (!/银行|消费金融/.test(text)) return "lmc";
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

// ── Tag/Adv filter (static ID mapping primary, keyword fallback) ──
import { productDetails } from "@/lib/data";
import { getFilteredProductIds } from "@/lib/filter-maps";

export function filterByTag<T extends { id: number }>(items: T[], tagId: string): T[] {
  if (!tagId) return items;
  return items.filter((p) => {
    const ids = getFilteredProductIds("company", tagId, "");
    if (ids) return ids.has(p.id);
    const detail = productDetails.find((d) => d.id === p.id);
    const advs = detail?.advantages || [];
    return advs.some((a: string) => a.includes(tagId));
  });
}

export function filterByAdv<T extends { id: number }>(
  items: T[],
  advId: string,
  category: string,
): T[] {
  if (!advId) return items;
  return items.filter((p) => {
    const ids = getFilteredProductIds(category, "", advId);
    if (ids) return ids.has(p.id);
    const detail = productDetails.find(
      (d) => d.id === p.id && d.category === category,
    );
    if (!detail) return false;
    return detail.advantages.some((a: string) => a.includes(advId));
  });
}

// Combined tag+adv filter using static mapping, with intersection fallback
export function filterByTagAndAdv<T extends { id: number }>(
  items: T[],
  tagId: string,
  advId: string,
  category: string,
): T[] {
  if (!tagId && !advId) return items;

  // Try static combo mapping first
  const comboIds = getFilteredProductIds(category, tagId, advId);
  if (comboIds) {
    return items.filter((p) => comboIds.has(p.id));
  }

  // Fallback: chain individual filters
  let result = items;
  if (tagId) result = filterByTag(result, tagId);
  if (advId) result = filterByAdv(result, advId, category);
  return result;
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
