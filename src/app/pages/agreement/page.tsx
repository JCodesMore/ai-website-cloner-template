import Link from "next/link";

const sidebarItems = [
  { href: "/pages/privacy", label: "隐私保护" },
  { href: "/pages/agreement", label: "使用协议", active: true },
  { href: "/pages/statement", label: "免责声明" },
  { href: "/pages/contact", label: "联系我们" },
  { href: "/pages/about", label: "关于我们" },
];

export default function AgreementPage() {
  return (
    <>
      <div className="ley-breadcrumb">
        <div className="ley-inner">
          <span className="layui-breadcrumb">
            <a href="/">首页</a>
            <a><cite>使用协议</cite></a>
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
                <h1>使用协议</h1>
              </div>
              <div className="content-body layui-text">
                <div id="editor-container">
                  <p style={{ textAlign: "left" }}><strong>使用协议</strong></p>
                  <p style={{ textAlign: "left" }}>欢迎您阅读北京捌捌科技有限公司（以下简称"捌捌科技"、"我们"）发布的"用户注册协议"（下称"本协议"）。本协议是关于您（下称"您"、"用户"）在使用比比信产品与/或服务时，约定您与捌捌科技之间权利义务关系的有效协议，自您完成注册程序时成立并生效。至您按本协议约定的方式通知比比信注销您的账户之日止，本协议将全面约束和规制您与捌捌科技间的权利义务关系。比比信发布的隐私政策、指引、规则均为本协议的补充协议，与本协议不可分割且具有同等法律效力。</p>
                  <p style={{ textAlign: "left" }}>请您在使用比比信（包括比比信PC端、比比信客户端、比比信移动网页端等）提供的产品与/或服务前，务必事先认真完整阅读并理解本协议中的各条款（特别是以粗体、下划线标准的内容），并做出您适当的选择。如您拒绝本协议，您将无法使用部分比比信产品与/或服务。</p>
                  <p style={{ textAlign: "left" }}><strong>1、声明与承诺</strong></p>
                  <p style={{ textAlign: "left" }}>比比信网站的各项电子服务的所有权和运作权归捌捌科技科技有限公司。比比信按照其发布的章程、服务条款和操作规则提供服务。用户使用或接受服务，即视为其已了解并完全同意本协议的各项内容，包括比比信就本协议随时作出的任何增加、删减或修改。</p>
                  <p style={{ textAlign: "left" }}>您应遵守本协议的各项条款，合法合理使用比比信提供的服务，否则，比比信有权依据本协议中断或终止为您提供服务。同时，比比信保留在任何时候收回您所使用的账号的权利。</p>
                  <p style={{ textAlign: "left" }}><strong>2、服务说明</strong></p>
                  <p style={{ textAlign: "left" }}>比比信向用户提供包括但不限于如下服务：贷款口碑、个人信贷、企业贷款等金融信贷产品综合比较、推荐服务、周边资讯服务及发布并分享相关评论。</p>
                  <p style={{ textAlign: "left" }}>您同意比比信有权制订或变更关于使用本服务的一般措施及限制，包括但不限于本服务将保留所发布内容或其它发布内容之最长期间。通过本服务发布或传送之任何信息、通讯资料和其它内容，如因您本人原因导致被删除或未予储存，您同意比比信无须承担任何责任。基于比比信所提供的服务的重要性，您应准确提供您本人真实、最新、最完整的个人资料。若您提供任何错误、不实、过时或不完整的资料或比比信有合理理由怀疑您的登记资料错误、不实、过时或不完整，比比信有权暂停或终止向您提供部分或全部的服务。您同意并负担因此所产生的直接或间接的任何损失、支出、费用、罚金，比比信对此不承担任何责任。</p>
                  <p style={{ textAlign: "left" }}><strong>3、服务条款的修改和服务修订</strong></p>
                  <p style={{ textAlign: "left" }}>您同意，比比信有权依据法律法规及运营需求对本协议内容进行变更，并通过官方形式（包括但不限于网站公告、电子邮件、手机短信或常规的信件传送）予以公告，且一经公告，即视为上述内容已经通知到您；若您在本协议内容公告变更后继续使用本服务的，表示您已充分阅读、理解并接受修改后的协议内容，也将遵循修改后的协议内容使用本服务；若您不同意修改后的协议内容，您应停止使用本服务。</p>
                  <p style={{ textAlign: "left" }}><strong>4、账户安全</strong></p>
                  <p style={{ textAlign: "left" }}>您一旦按照本网站的规定方式注册成功，成为比比信的注册用户，将得到一个密码和用户名。您应妥善保管您的用户名、密码，不可向其他任何人泄露、透露、告知您的用户账户和密码，亦不可使用其他任何人的用户账户和密码。由于您的原因导致您的用户账户和/或密码被其他任何人知悉，造成您的用户账户和/或密码被他人使用导致的损失，比比信不承担任何责任。您对以您用户名进行的所有活动和事件负全责，如您账号活动异常或出现其他异常现象，比比信保留采取相应行动的权利（包括但不限于删除或冻结账号、删除或冻结积分）。</p>
                  <p style={{ textAlign: "left" }}><strong>5、用户信息保护及使用</strong></p>
                  <p style={{ textAlign: "left" }}>详见<a href="/pages/privacy" target="_blank">《比比信隐私保护》</a>。</p>
                  <p style={{ textAlign: "left" }}><strong>6、责任范围及责任限制</strong></p>
                  <p style={{ textAlign: "left" }}>6.1比比信在此郑重提请您注意，任何经由比比信而发布、上传的文字、图片、图形或其他资料（以下简称"内容"），无论系公开还是非公开传送，均由内容提供者承担责任。比比信均不为任何内容负责，但比比信有权依法停止传输任何前述内容并采取相应行动。</p>
                  <p style={{ textAlign: "left" }}><strong>7、服务使用限制</strong></p>
                  <p style={{ textAlign: "left" }}>7.1您在使用本服务时应遵守中华人民共和国相关法律法规及您所属、所居住或开展经营活动或其他业务的国家或地区的法律法规，不得将本服务用于任何非法目的(包括用于禁止或限制交易物品的交易)，也不得以任何非法方式使用我们的服务。</p>
                  <p style={{ textAlign: "left" }}><strong>8、免责条款</strong></p>
                  <p style={{ textAlign: "left" }}>8.1因下列状况导致服务暂停或中断的，比比信不承担违约或赔偿责任：不可抗力、电信技术部门调整或故障、网络设备故障、云服务系统破坏、政府管制、黑客攻击、病毒侵袭、系统停机维护等。</p>
                  <p style={{ textAlign: "left" }}><strong>9、知识产权保护</strong></p>
                  <p style={{ textAlign: "left" }}>9.1除第三方产品或服务外，比比信官方渠道及所有系统上的全部内容，包括但不限于数据库、软件、著作、图片、录像、音乐、声音及其前述组合，均由比比信依法拥有其知识产权。</p>
                  <p style={{ textAlign: "left" }}><strong>10、法律适用及争议解决</strong></p>
                  <p style={{ textAlign: "left" }}>10.1本服务条款的解释与适用，以及与本服务条款有关的争议，均应依照中华人民共和国法律予以处理。</p>
                  <p style={{ textAlign: "left" }}>10.4比比信对本协议享有法律范围内的解释权。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
