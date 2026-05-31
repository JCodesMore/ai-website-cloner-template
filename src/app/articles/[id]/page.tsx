import Link from "next/link";
import { notFound } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { articleDetails, newsItems, discussionItems } from "@/lib/data";
import type { Metadata } from "next";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = articleDetails.find((a) => a.id === Number(id));
  if (!article) return { title: "文章不存在" };
  return { title: article.title + " - 比比信", description: article.title };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;
  const article = articleDetails.find((a) => a.id === Number(id));
  if (!article) notFound();

  return (
    <>
      <div className="ley-breadcrumb">
        <div className="ley-inner">
          <span className="layui-breadcrumb">
            <a href="/">首页</a>
            <a><cite>文章详情</cite></a>
          </span>
        </div>
      </div>

      <div className="ley-page ley-page-detail-news">
        <div className="ley-inner">
          <div className="layui-row layui-col-space16">
            <div className="layui-col-md9">
              <div className="ley-detail-content">
                <div className="section-top">
                  <h1 className="title">{article.title}</h1>
                  <div className="desc">
                    <div><i className="layui-icon layui-icon-time"></i><span>{article.date}</span></div>
                    <div><i className="layui-icon layui-icon-read"></i><span>{article.viewCount} 阅读</span></div>
                    <button className="layui-btn layui-btn-primary layui-btn-sm" style={{borderRadius:20,color:"#666",borderColor:"#e5e5e5"}}>
                      <i className="layui-icon layui-icon-share"></i> 分享
                    </button>
                  </div>
                </div>
                <div className="layui-text rich-text-content" dangerouslySetInnerHTML={{__html:article.body}} />
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
