import { notFound } from "next/navigation";
import { counselors } from "@/lib/data";
import type { Metadata } from "next";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const c = counselors.find(x => x.id === id);
  return { title: (c?.name||"顾问") + " - 比比信", description: c?.bio };
}

export default async function CounselorPage({ params }: Props) {
  const { id } = await params;
  const c = counselors.find(x => x.id === id);
  if (!c) notFound();

  return (
    <div className="ley-page ley-page-detail-advisor">
      <div className="ley-inner">
        <div className="layui-card ley-panel" style={{marginTop:0}}>
          <div className="layui-card-body">
            <div className="advisor-info">
              <img className="avatar" src={c.avatar} alt={c.name} />
              <div className="info">
                <div className="name"><span>{c.name}</span><span>{c.title}</span></div>
                <div className="tag"><i className="bg-id_card"></i><span>实名认证</span></div>
                <div className="desc">
                  <div className="subtitle">个人简介：</div>
                  <p>{c.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="layui-card ley-panel">
          <div className="layui-card-header"><div className="title">一对一服务</div></div>
          <div className="layui-card-body">
            <div className="section-contact">
              <div className="item">
                <div className="bg-wechat_bg"></div>
                <div className="title">微信咨询</div>
                <div className="desc">金融难题随时在线解答</div>
                <button className="layui-btn layui-btn-radius">查看</button>
              </div>
              <div className="item">
                <div className="bg-phone_bg"></div>
                <div className="title">电话咨询</div>
                <div className="desc">电话高效沟通，快速解答疑惑</div>
                <button className="layui-btn layui-btn-radius">查看</button>
              </div>
            </div>
          </div>
        </div>

        <div className="layui-card ley-panel" style={{marginBottom:15}}>
          <div className="layui-card-header"><div className="title">成功案例</div></div>
          <div className="layui-card-body">
            <ul className="news">
              {c.cases.map((cs: string, i: number)=>(
                <li key={i} className="item"><p className="context">{cs}</p></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
