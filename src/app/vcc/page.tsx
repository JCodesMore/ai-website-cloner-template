import DesignPage from "@/components/DesignPage";
import { loadDesignPage, type BootStep } from "@/lib/design";
import { applyMerchantDemoData } from "@/lib/merchant-demo";
import { SiteHeader } from "@/components/site-header";
import { MobileHeader } from "@/components/mobile-header";

/** 虚拟卡页 — HUOAD 站点骨架内嵌 Faorbit 商户端仪表盘：
 *  头部沿用 SiteHeader；左侧是 HUOAD 白卡风格侧边栏（只放概览四项）；
 *  右侧注入设计稿（无 authed 标记 → preview-identity.js DEMO 模式；
 *  merchant-demo.ts 按生产同构方式替换占位符，注入整套演示数据），
 *  自带深色侧栏由 merchant-embed.css 隐藏。
 *
 *  视图切换：设计稿的内联脚本在 document 上委托了所有 [data-view] 点击，
 *  所以左侧栏的 <a data-view> 天然可切视图；下面的 boot 步骤只负责
 *  同步各导航高亮 + 处理 /vcc?view= 深链。
 *
 *  移动端（≤768px，样式在 merchant-mobile.css）：桌面头部/侧栏隐藏，
 *  换成 MobileHeader 黑顶条 + 底部五格 tab 栏（同一套 data-view 委托）。 */

function DashboardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="12" rx="1" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  );
}

function TxIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m16 3 4 4-4 4" />
      <path d="M20 7H4" />
      <path d="m8 21-4-4 4-4" />
      <path d="M4 17h16" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default async function Page() {
  const page = applyMerchantDemoData(await loadDesignPage("dashboard.html"));

  const shellGlue: BootStep = {
    type: "inline",
    code: `(function(){
  function sync(v){ document.querySelectorAll('[data-huoad-merchant-nav] a[data-view]').forEach(function(a){ a.classList.toggle('on', a.getAttribute('data-view')===v); }); }
  document.addEventListener('click', function(e){ var t = e.target && e.target.closest ? e.target.closest('[data-view]') : null; if(t) sync(t.getAttribute('data-view')); });
  // 进入页面：无 ?view= 一律回到仪表盘（设计稿脚本会用 localStorage 记住上次视图，这里覆盖它）
  var v = new URLSearchParams(location.search).get('view') || 'dashboard';
  var a = document.querySelector('.dnav a[data-view="'+v+'"]');
  if(a) a.click();
  sync(v);
  // 「我的」tab：登录页未做，不跳转，弹站内 toast（复用设计稿 toast 样式）
  var me = document.querySelector('[data-mtab-me]');
  if(me) me.addEventListener('click', function(){
    var w = document.querySelector('[data-toast-wrap]');
    if(!w) return;
    var t = document.createElement('div');
    t.className = 'toast warn';
    t.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>个人中心即将上线，敬请期待';
    w.appendChild(t);
    requestAnimationFrame(function(){ t.classList.add('show'); });
    setTimeout(function(){ t.classList.remove('show'); setTimeout(function(){ t.remove(); }, 300); }, 2600);
  });
  // 移动端表格砍掉了 kebab 操作列（merchant-mobile.css），
  // 改为整行点击开卡片详情抽屉；避开行内自带的 data-open-detail/菜单，防止双开
  if (window.matchMedia('(max-width: 768px)').matches || /\\/m\\/?$/.test(location.pathname)) {
    document.addEventListener('click', function(e){
      var el = e.target;
      if(!el || !el.closest) return;
      if(el.closest('[data-open-detail],[data-menu],.menu')) return;
      var row = el.closest('tr[data-card]');
      if(!row) return;
      var t = row.querySelector('[data-open-detail]');
      if(t) t.click();
    });
  }
})();`,
  };

  return (
    <>
      <div className="huoad-desktop-only">
        <SiteHeader />
      </div>
      <MobileHeader />
      <div className="huoad-merchant-page">
        <div className="huoad-merchant-inner">
          <aside className="huoad-merchant-side">
            <nav data-huoad-merchant-nav>
              <a data-view="dashboard" className="on"><DashboardIcon />概览</a>
              <a data-view="cards"><CardIcon />我的卡片</a>
              <a data-view="newcard"><PlusIcon />开新卡</a>
              <a data-view="transactions"><TxIcon />交易记录</a>
            </nav>
          </aside>
          <section className="huoad-merchant-content">
            <DesignPage body={page.body} steps={[...page.steps, shellGlue]} />
          </section>
        </div>
      </div>
      {/* 移动端底部五格 tab 栏 — 前四格走设计稿的 data-view 点击委托切视图；
          「我的」登录页暂不做（后续与原站同步），点击只弹 toast 不跳转 */}
      <nav className="huoad-mtab" data-huoad-merchant-nav aria-label="移动端导航">
        <a data-view="dashboard" className="on"><DashboardIcon />概览</a>
        <a data-view="cards"><CardIcon />我的卡片</a>
        <a data-view="newcard"><PlusIcon />开新卡</a>
        <a data-view="transactions"><TxIcon />交易记录</a>
        <a data-mtab-me><UserIcon />我的</a>
      </nav>
    </>
  );
}
