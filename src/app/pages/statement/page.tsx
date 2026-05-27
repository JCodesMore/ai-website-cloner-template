import Link from "next/link";

const sidebarItems = [
  { href: "/pages/privacy", label: "隐私保护" },
  { href: "/pages/agreement", label: "使用协议" },
  { href: "/pages/statement", label: "免责声明", active: true },
  { href: "/pages/contact", label: "联系我们" },
  { href: "/pages/about", label: "关于我们" },
];

export default function StatementPage() {
  return (
    <>
      <div className="ley-breadcrumb">
        <div className="ley-inner">
          <span className="layui-breadcrumb">
            <a href="/">首页</a>
            <a><cite>免责声明</cite></a>
          </span>
        </div>
      </div>
      <div className="ley-page ley-page-about-us">
        <div className="ley-inner">
          <div className="page-container">
            <div className="page-sidebar">
              <div className="sidebar-title">相关页面</div>
              <ul className="sidebar-menu">
                {sidebarItems.map((item) => (
                  <li key={item.href} className={`sidebar-menu-item${item.active ? " active" : ""}`}>
                    <Link href={item.href}>
                      <i className="layui-icon layui-icon-right"></i>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="page-content">
              <div className="content-header">
                <h1>免责声明</h1>
              </div>
              <div className="content-body layui-text">
                <div id="editor-container">
                  <p><strong>免责声明</strong></p>
                  <p>本网站在此特别声明对如下事宜不承担任何法律责任：</p>
                  <p>1）对您使用本网站、与本网站相关的任何内容、服务或其它链接至本网站的站点、内容均不作直接、间接、法定、约定的保证。您必须独自承担由于使用本网站或通过本网站登录到其他站点而形成的全部风险，并独立承担与他人交流信息所造成的后果，本网站对此不承担任何责任。本网站并不能时时监控此网址，但保留进行随时监控的权利。</p>
                  <p>2）本网站虽然对用户进行资质审查，但本网站并非司法机关，仅能要求用户提交真实、有效的资质证明文件，并对该提交的资质证明文件进行形式审核。如用户提交虚假、伪造、变造文件的，本网站对此概不承担法律责任。本网站不对用户的线下行为负责。</p>
                  <p>3）对于本网站为用户提供便利而设置的信息或由本网站链接的信息，本网站并不保证其准确性、安全性和完整性，亦并不代表本网站对其链接内容的认可，请您谨慎确认后使用。</p>
                  <p>4）本网站负责向您提供本网站平台服务。但本网站对本网站平台服务不作任何明示或暗示的保证，包括但不限于本网站平台服务的适用性、没有错误或疏漏、持续性、准确性、可靠性、适用于某一特定用途。</p>
                  <p>5）本网站仅向您提供本网站平台服务，您了解本网站平台上的信息系用户自行发布，由于海量信息的存在，且本网站平台无法杜绝可能存在风险和瑕疵。</p>
                  <p>6）本网站仅为网络信息发布平台，用户在通过本网站得到资讯和信息后，与信息发布人所进行的任何交易均系其双方自主交易，双方若发生纠纷，皆与本网站无关，本网站不承担任何法律责任。</p>
                  <p>7）尽管本网站已作好了全面的安全防范措施后，以下情况仍然有可能发生，例如某一第三方躲过了我们的安全措施并进入我们的数据库，查找到您的信息。本网站认为在您注册时，您已经意识到了这种风险的存在，并同意承担这样的风险。对于因此而引起的任何法律纠纷，本网站不承担任何法律责任。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
