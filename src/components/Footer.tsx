import Link from "next/link";

export default function Footer() {
  return (
    <div className="ley-footer">
      <div className="top">
        <div className="ley-inner">
          <div className="layui-row">
            <div className="layui-col-md9">
              <ul className="desc">
                <li>
                  <img className="ley-footer-logo" src="/statics/images/logo_write.png" alt="比比信" />
                </li>
                <li>比比信&bull;贷款口碑-bbxin.com 致力于为个人和企业提供全面详实的贷款产品口碑信息！</li>
                <li>比比信的服务宗旨是：助力企业个人资金需求，降低信贷融资成本，用服务创造价值。</li>
                <li>比比信的服务理念是：秉承&ldquo;诚信创造财富&rdquo;的理念，让普惠金融惠及千企万户。</li>
              </ul>
            </div>
            <div className="layui-col-md2 layui-col-md-offset1">
              <ul className="menus">
                <li><Link href="/pages/about">关于我们</Link></li>
                <li><Link href="/pages/contact">联系我们</Link></li>
                <li><Link href="/pages/statement">免责声明</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom">
        <div className="ley-inner">
          <p>Copyright 2008-2025&copy;北京捌捌科技有限公司版权所有 www.bbxin.com 京ICP备2023027192号-1</p>
        </div>
      </div>
    </div>
  );
}
