import Link from "next/link";
import { notFound } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import FollowButton from "@/components/FollowButton";
import ShareButton from "@/components/ShareButton";
import ProductComments from "@/components/ProductComments";
import { productDetails, newsItems, discussionItems, opinionItems, faqItems, fastProducts, companyProducts, personProducts, pledgeProducts } from "@/lib/data";
import { sanitizeIntroHtml } from "@/lib/product-utils";
import { WECHAT_QR_URL } from "@/lib/constants";
import type { Metadata } from "next";

const categoryNames: Record<string, string> = { person: "个人贷款", company: "企业贷款", fast: "极速贷款", pledge: "抵押贷款" };
const allProducts = [...fastProducts, ...companyProducts, ...personProducts, ...pledgeProducts];

interface Props { params: Promise<{ category: string; id: string }> }

const DEFAULT_DESC = "找贷款，查询\"银脉圈-贷款随心选-yinmaiquan.com\"，找贷款先查贷款产品口碑，贷款产品好坏一查便知。收录全网贷款产品，聚合贷款人口碑反馈，提供贷款产品查询、比对，贷款路上规避风险，\"银脉圈-贷款随心选\"致力于为个人和企业提供全面详实的信贷产品口碑信息！";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, id } = await params;
  const pid = Number(id);
  let p = productDetails.find(x => x.category === category && x.id === pid);
  if (!p) p = productDetails.find(x => x.id === pid);
  if (!p) {
    const listing = allProducts.find(x => x.id === pid);
    if (listing) return { title: `${listing.name} - 银脉圈` };
  }
  const title = p ? `${p.institution} "${p.name}"，最高额度${p.maxAmount} - 银脉圈-贷款随心选-yinmaiquan.com` : "产品 - 银脉圈";
  return { title, description: p?.summary || DEFAULT_DESC };
}

export default async function ProductDetailPage({ params }: Props) {
  const { category, id } = await params;
  const pid = Number(id);

  // Try to find full detail first
  let detail = productDetails.find(x => x.category === category && x.id === pid);
  if (!detail) detail = productDetails.find(x => x.id === pid);

  // Fallback: build minimal info from listing data
  const listing = allProducts.find(x => x.id === pid);
  if (!detail && !listing) notFound();

  // Merge listing fields (name, image, rate, etc.) with detail fields (introHtml, summary, advantages)
  const product = {
    id: pid,
    category,
    name: listing?.name || "",
    image: listing?.image || "",
    institution: listing?.institution || "",
    institutionFullName: detail?.institutionFullName || listing?.institution || "",
    institutionHref: detail?.institutionHref || "/institutions",
    maxAmount: listing?.maxAmount || "",
    term: listing?.term || "",
    rate: listing?.rate || "",
    repayment: listing?.repayment || "",
    advantages: detail?.advantages || [],
    summary: detail?.summary || `${listing?.name || ""} - 由${listing?.institution || ""}提供`,
    introHtml: detail?.introHtml || `<p>${listing?.name || ""}是${listing?.institution || ""}旗下贷款产品。最高额度${listing?.maxAmount || ""}，还款期限${listing?.term || ""}，参考利率${listing?.rate || ""}，还款方式${listing?.repayment || ""}。</p>`,
  };

  return (
    <>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-600 transition-colors duration-200">首页</Link>
          <span className="mx-2">/</span>
          <Link href={`/products/${category}`} className="hover:text-blue-600 transition-colors duration-200">{categoryNames[category] || category}</Link>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <div className="mb-6 flex items-start justify-between">
                <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
                <div className="flex items-center gap-2">
                  <ShareButton url={`/products/${category}/${id}`} title={product.name} variant="product" />
                  <FollowButton productId={id} />
                </div>
              </div>
              <div className="mb-6 flex items-start gap-6">
                <img className="h-16 w-16 shrink-0 rounded-xl border border-slate-100 object-cover" src={product.image} alt={product.name} />
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-2.5 pr-4 text-slate-500 w-20">产品名称</td><td className="py-2.5 font-medium text-slate-900">{product.name}</td>
                      <td className="py-2.5 pr-4 text-slate-500 w-20">贷款利率</td><td className="py-2.5 font-medium text-slate-900">{product.rate}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-2.5 pr-4 text-slate-500">贷款期限</td><td className="py-2.5 font-medium text-slate-900">{product.term}</td>
                      <td className="py-2.5 pr-4 text-slate-500">最高额度</td><td className="py-2.5 font-medium text-slate-900">{product.maxAmount}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 text-slate-500">还款方式</td><td className="py-2.5 font-medium text-slate-900">{product.repayment}</td>
                      <td className="py-2.5 pr-4 text-slate-500">所属机构</td>
                      <td className="py-2.5 font-medium">
                        <a href={product.institutionHref} className="text-blue-600 hover:underline" target="_blank">{product.institutionFullName}</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {product.advantages.length > 0 && (
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="mb-3 text-sm text-slate-600">{product.summary}</p>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 text-sm text-slate-500">产品优势</span>
                    <div className="flex flex-wrap gap-1.5">
                      {product.advantages.map((a: any, i: number) => (
                        <span key={i} className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">{a}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <h3 className="mb-1 text-lg font-semibold text-slate-900">快速申请</h3>
                  <p className="mb-4 text-sm text-slate-500">优先推荐网页直达申请，扫码可在微信中继续办理。</p>
                  <a className="inline-flex items-center rounded-lg bg-yellow-600 px-8 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-yellow-700" href={`/api/products/${id}/jump?source=click`} target="_blank" rel="nofollow noopener">立即申请</a>
                </div>
                <div className="shrink-0 text-center">
                  <p className="mb-2 text-xs text-slate-400">微信扫码申请</p>
                  <img src={WECHAT_QR_URL} alt="微信咨询" className="mx-auto h-[120px] w-[120px] rounded-lg border border-slate-200" />
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">产品介绍</h2>
              <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600" dangerouslySetInnerHTML={{ __html: sanitizeIntroHtml(product.introHtml) }} />
            </div>
            <ProductComments productId={id} productName={product.name} />
          </div>
          <Sidebar newsItems={newsItems} discussionItems={discussionItems} opinionItems={opinionItems} faqItems={faqItems} />
        </div>
      </div>
    </>
  );
}
