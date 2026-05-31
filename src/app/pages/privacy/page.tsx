import Link from "next/link";

const sidebarItems = [
  { href: "/pages/privacy", label: "隐私保护", active: true },
  { href: "/pages/agreement", label: "使用协议" },
  { href: "/pages/statement", label: "免责声明" },
  { href: "/pages/contact", label: "联系我们" },
  { href: "/pages/about", label: "关于我们" },
];

export default function PrivacyPage() {
  return (
    <>
      <div className="ley-breadcrumb">
        <div className="ley-inner">
          <span className="layui-breadcrumb">
            <a href="/">首页</a>
            <a><cite>隐私保护</cite></a>
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
                <h1>隐私保护</h1>
              </div>
              <div className="content-body layui-text">
                <div id="editor-container">
                  <p style={{ textAlign: "left" }}><strong>隐私保护</strong></p>
                  <p style={{ textAlign: "left" }}><strong>比比信</strong>尊重并保护用户个人隐私权。"隐私"是指用户在注册使用<strong>比比信</strong>服务时提供给比比信的个人身份信息，包括用户注册资料中的姓名、联系方式等用户信息。为了给用户提供更及时、准确、便捷及个性化的服务，<strong>比比信</strong>会按照本隐私保护政策的规定使用和披露用户信息。同时，<strong>比比信</strong>将以高度的勤勉审慎义务对待用户信息。本隐私权保护政策属于比比信用户服务协议不可分割的一部分。在使用比比信提供的服务前，请用户仔细阅读以下隐私权保护政策。</p>
                  <p style={{ textAlign: "left" }}>您在访问、使用比比信或申请使用比比信服务时，必须提供本人真实的个人信息，且您应该根据实际变动情况及时更新个人信息。保护用户隐私是我们的重点原则，我们通过各种技术手段和强化内部管理等办法提供隐私保护服务功能，充分保护您的个人信息安全。</p>
                  <p style={{ textAlign: "left" }}><strong>比比信</strong>不负责审核您提供的个人信息的真实性、准确性或完整性，因信息不真实、不准确或不完整而引起的任何问题及其后果，由您自行承担，且您应保证我们免受由此而产生的任何损害或责任。若我们发现您提供的个人信息是虚假、不准确或不完整的，我们有权自行决定终止向您提供服务。</p>
                  <p style={{ textAlign: "left" }}>您已明确授权，为提供服务、履行协议、解决争议、保障交易安全等目的，我们对您提供的、我们自行收集的及通过第三方收集的您的个人信息、您申请服务时的相关信息、您在使用服务时储存在<strong>比比信</strong>的非公开内容以及您的其他个人资料（以下简称"个人资料"）享有留存、整理加工、使用和披露的权利，具体方式包括但不限于：</p>
                  <p style={{ textAlign: "left" }}>（1）出于为您提供服务的需要在本网站公示您的个人资料；</p>
                  <p style={{ textAlign: "left" }}>（2）由人工或自动程序对您的个人资料进行获取、评估、整理、存储；</p>
                  <p style={{ textAlign: "left" }}>（3）使用您的个人资料以改进本网站的设计和推广；</p>
                  <p style={{ textAlign: "left" }}>（4）使用您提供的联系方式与您联络并向您传递有关服务和管理方面的信息；</p>
                  <p style={{ textAlign: "left" }}>（5）对您的个人资料进行分析整合并向为您提供服务的第三方提供为完成该项服务必要的信息。</p>
                  <p style={{ textAlign: "left" }}>其他必要的使用及披露您个人资料的情形。您已明确同意本条款不因您终止使用比比信服务而失效。如因我们行使本条款项下权利使您遭受损失，我们对该等损失免责。</p>
                  <p style={{ textAlign: "left" }}>为更好地为您提供服务，您同意并授权比比信可与其合作的第三方进行联合研究，并可将通过本协议获得的您的信息投入到该等联合研究中。但比比信与其合作的第三方在开展上述联合研究前，应要求其合作的第三方对在联合研究中所获取的您的信息予以保密。</p>
                  <p style={{ textAlign: "left" }}>我们保证采用行业惯例以保护您的资料，但您理解，鉴于技术限制，我们无法确保用户的个人信息完全不被泄露。</p>
                  <p style={{ textAlign: "left" }}>下列情形导致您的隐私信息被泄露，本网站不承担任何责任：</p>
                  <ul>
                    <li style={{ textAlign: "left" }}>不可抗力；</li>
                    <li style={{ textAlign: "left" }}>意外事件；</li>
                    <li style={{ textAlign: "left" }}>本网站采取了合理的防护措施而遭到黑客攻击、电脑病毒侵入；</li>
                    <li style={{ textAlign: "left" }}>您未能妥善保管您的隐私信息；</li>
                    <li style={{ textAlign: "left" }}>您主动向第三人透露您的隐私信息；</li>
                    <li style={{ textAlign: "left" }}>其他不可归责于本网站的原因。</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
