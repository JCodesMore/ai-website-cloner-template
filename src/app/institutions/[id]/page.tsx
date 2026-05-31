import Link from "next/link";
import { notFound } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { institutionDetails, newsItems, discussionItems } from "@/lib/data";
import type { Metadata } from "next";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const inst = institutionDetails.find(x => x.id === id);
  return { title: (inst?.name||"机构") + " - 比比信", description: inst?.fullName };
}

export default async function InstitutionDetailPage({ params }: Props) {
  const { id } = await params;
  const inst = institutionDetails.find(x => x.id === id);
  if (!inst) notFound();

  return (
    <>
      <div className="ley-breadcrumb">
        <div className="ley-inner">
          <span className="layui-breadcrumb">
            <a href="/">首页</a>
            <a href="/institutions"><cite>机构产品</cite></a>
            <a><cite>{inst.name}</cite></a>
          </span>
        </div>
      </div>

      <div className="ley-page ley-page-detail-stock institution-info-page">
        <div className="ley-inner">
          <div className="layui-row layui-col-space16">
            <div className="layui-col-md9">
              <div className="org-profile-card">
                <div className="org-info-body">
                  <div className="org-logo"><img src={inst.logo} alt={inst.name} /></div>
                  <div className="org-main">
                    <div className="org-meta">
                      <h1 className="org-title">{inst.fullName}</h1>
                      <div className="bbx-pill-badge">{inst.name}</div>
                    </div>
                    <div className="org-link-wrap">
                      <a href={"http://"+inst.website} target="_blank" rel="noopener" className="org-link">
                        <i className="layui-icon layui-icon-link"></i> 访问官网
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="org-intro-card">
                <h2 className="org-section-title org-section-title--bordered">
                  <span className="org-section-title-mark"></span>机构介绍
                </h2>
                <div className="layui-text org-rich-text" dangerouslySetInnerHTML={{__html:inst.introHtml}} />
              </div>

              <div className="org-products-card">
                <h2 className="org-section-title">
                  <span className="org-section-title-mark"></span>在营产品
                  <span className="org-section-count">共 {inst.products.length} 款</span>
                </h2>
                <div className="org-products-grid">
                  {inst.products.map((p: any,i)=>(
                    <Link key={i} href={p.href} className="org-product-card">
                      <div className="org-product-head">
                        <div className="org-product-name">
                          {p.icon && <img src={p.icon} alt="" style={{width:16,height:16,borderRadius:"50%",marginRight:6,verticalAlign:"middle"}} />}
                          {p.name}
                        </div>
                        <div className="org-product-tag">查看详情</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="layui-col-md3">
              <Sidebar newsItems={newsItems} discussionItems={discussionItems} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
