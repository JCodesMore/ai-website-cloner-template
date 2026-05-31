// Malformed introHtml patterns from scraper failures (e.g. ".product-intro-wrap" template not matched)
const BROKEN_PREFIX_RE = /^product-intro-wrap">\s*/;

/** Sanitize introHtml: strip known scraper-corruption patterns before rendering. */
export function sanitizeIntroHtml(html: string): string {
  const trimmed = html.trim();
  if (BROKEN_PREFIX_RE.test(trimmed)) {
    return '<div class="product-intro-wrap">' + trimmed.replace(BROKEN_PREFIX_RE, "");
  }
  return html;
}

export const categoryNames: Record<string, string> = {
  person: "个人贷款", company: "企业贷款", fast: "极速贷款", pledge: "抵押贷款",
};

export const advantageLabels: Record<string, string> = {
  person: "个人贷款产品优势", company: "企业贷款产品优势", fast: "贷款产品优势", pledge: "抵押贷款产品优势",
};

const tagKeywords = ["专精特新", "国高新", "科技类", "创新类", "涉农类", "小巨人", "专利贷"];

export function splitAdvantages(advantages: string[], category: string) {
  if (category !== "company") return { advs: advantages, tags: [] as string[] };
  const tags = advantages.filter(a => tagKeywords.some(k => a.includes(k)));
  const advs = advantages.filter(a => !tagKeywords.some(k => a.includes(k)));
  return { advs, tags };
}

export function genSummary(product: { name: string; institutionFullName: string; summary: string }) {
  return product.summary || `${product.name}，是由${product.institutionFullName}提供的一款贷款产品。`;
}

export const institutionTypes = [
  { label: "全部", value: "" },
  { label: "国有银行", value: "socb" },
  { label: "商业银行", value: "jscb" },
  { label: "消费金融", value: "cfc" },
  { label: "贷款撮合", value: "lmc" },
  { label: "其他", value: "other" },
] as const;
