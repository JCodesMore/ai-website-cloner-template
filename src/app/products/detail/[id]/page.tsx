import Link from "next/link";
import { notFound } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ShareButton from "@/components/ShareButton";
import { productDetails, newsItems, discussionItems } from "@/lib/data";
import type { Metadata } from "next";

interface Props { params: Promise<{ id: string }> }

const fallbackCategory = "fast";

const DEFAULT_DESC = "找贷款，查询\"比比信•贷款口碑-bbxin.com\"，找贷款先查贷款产品口碑，贷款产品好坏一查便知。收录全网贷款产品，聚合贷款人口碑反馈，提供贷款产品查询、比对，贷款路上规避风险，\"比比信•贷款口碑\"致力于为个人和企业提供全面详实的信贷产品口碑信息！";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = productDetails.find(x => x.id === id);
  const title = p ? `${p.institution} "${p.name}"，最高额度${p.maxAmount} - 比比信•贷款口碑-bbxin.com` : "产品 - 比比信";
  return { title, description: p?.summary || DEFAULT_DESC };
}

export default async function ProductDirectDetailPage({ params }: Props) {
  const { id } = await params;
  const product = productDetails.find(x => x.id === id);
  if (!product) notFound();

  return (
    <>
      <div className="ley-breadcrumb">
        <div className="ley-inner">
          <span className="layui-breadcrumb">
            <a href="/">首页</a>
            <a href={`/products/${product.category}`}><cite>{product.name}</cite></a>
          </span>
        </div>
      </div>

      <div className="ley-page ley-page-detail-stock">
        <div className="ley-inner">
          <div className="layui-row layui-col-space16">
            <div className="layui-col-md9">
              <div className="ley-detail-content ley-radius layui-text product-main-card">
                <div className="product-head">
                  <div className="product-head-main"><h1 className="product-title">{product.name}</h1></div>
                  <div className="product-head-actions">
                    <button className="layui-btn layui-btn-primary product-follow-btn" type="button">关注产品</button>
                  </div>
                </div>

                <div className="product-info-wrapper">
                  <div className="product-logo-container">
                    <img className="product-detail-logo-v2" src={product.image} alt={product.name} />
                  </div>
                  <div className="product-table-container">
                    <table className="layui-table product-info-table">
                      <tbody>
                        <tr><td className="label">产品名称</td><td>{product.name}</td><td className="label">贷款利率</td><td>{product.rate}</td></tr>
                        <tr><td className="label">贷款期限</td><td>{product.term}</td><td className="label">最高额度</td><td>{product.maxAmount}</td></tr>
                        <tr><td className="label">还款方式</td><td>{product.repayment}</td><td className="label">所属机构</td><td><a href={product.institutionHref} className="bbxin-keyword" target="_blank">{product.institutionFullName}</a></td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="product-summary-panel">
                  <p>{product.summary}</p>
                  <div className="product-summary-meta">
                    <div className="summary-meta-row">
                      <span className="summary-meta-label">产品优势</span>
                      <div className="summary-meta-values">
                        {product.advantages.map((a: any, i) => <span key={i} className="summary-meta-chip">{a}</span>)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="product-jump-panel">
                  <div className="product-jump-main">
                    <div className="product-jump-title">快速申请</div>
                    <p className="product-jump-desc">优先推荐网页直达申请，扫码可在微信中继续办理。</p>
                    <div className="product-jump-actions">
                      <a className="layui-btn product-apply-btn" href={`/api/products/${id}/jump?source=click`} target="_blank" rel="nofollow noopener">立即申请</a>
                    </div>
                  </div>
                  <div className="product-jump-qr-card">
                    <div className="product-jump-qr-head"><span>微信扫码申请</span></div>
                    <div className="product-jump-qr-body">
                      <img src="/images/qr_code.png" alt="申请二维码" />
                    </div>
                  </div>
                </div>

                <div className="product-intro-wrap">
                  <div className="product-section-title">产品介绍</div>
                  <div className="product-intro rich-text" dangerouslySetInnerHTML={{ __html: product.introHtml }} />
                </div>
              </div>
            </div>
            <div className="layui-col-md3">
              <Sidebar newsItems={newsItems} discussionItems={discussionItems} />
            </div>
          </div>
        </div>
      </div>
      <ShareButton productId={id} productName={product.name} rate={product.rate} amount={product.maxAmount} term={product.term} repayment={product.repayment} />
    </>
  );
}
