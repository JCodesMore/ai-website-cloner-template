/* Faorbit sidebar identity (dual-mode).
 *
 * REAL-SESSION mode — used by the live Next app. When the server injects an
 * authed marker (<span data-auth-state="authed" data-user-name=… data-user-email=…
 * data-user-role=…>), the sidebar slot <div data-identity-switcher> shows the REAL
 * logged-in user as a static profile (no switching), and data-allow visibility is
 * driven by the real role. Page-level owner-only/member-only access is enforced
 * server-side in this mode, so the localStorage guard is skipped.
 *
 * DEMO mode — used when opening the raw design-src prototype directly (no authed
 * marker). Falls back to the original localStorage identity switcher (林一帆/陈墨)
 * so the design handoff can still preview owner vs member layouts.
 *
 * window.FaorbitIdentity (the demo mock store's identity source) is left intact in
 * both modes for backward compatibility with prototype client scripts.
 */
(function(){
  const IDENTITIES = {
    leo: {
      userId: 'leo',
      name:   '林一帆',
      email:  'leo@acme.com',
      role:   'owner',
      av:     { text: '林', bg: 'linear-gradient(135deg,#7c5cff,#4a2fb0)' },
      badgeLabel: '所有者',
      badgeCls:   'owner'
    },
    mo: {
      userId: 'mo',
      name:   '陈墨',
      email:  'mo@acme.com',
      role:   'media_buyer',
      av:     { text: '陈', bg: 'linear-gradient(135deg,#0bb583,#077a58)' },
      badgeLabel: '投放成员',
      badgeCls:   'member-mkt'
    }
  };
  const KEY = 'faorbit_preview_identity';
  const DEFAULT_OWNER_PAGE  = 'dashboard.html';
  const DEFAULT_MEMBER_PAGE = 'my-wallet.html';
  const ROLE_LABEL = { owner: '所有者', admin: '管理员', media_buyer: '投放', member: '成员' };

  function esc(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  // Real logged-in user injected by the server, or null in the raw prototype.
  function realUser(){
    const m = document.querySelector('[data-auth-state]');
    if(!m || m.getAttribute('data-auth-state') !== 'authed') return null;
    const name = (m.getAttribute('data-user-name') || '').trim();
    if(!name) return null;
    return {
      name,
      email: (m.getAttribute('data-user-email') || '').trim(),
      role:  (m.getAttribute('data-user-role')  || 'member').trim(),
    };
  }

  function currentId(){
    const id = localStorage.getItem(KEY) || 'leo';
    return IDENTITIES[id] ? id : 'leo';
  }
  function current(){ return IDENTITIES[currentId()]; }
  function isOwner(){ return current().role === 'owner'; }

  function pageRole(){
    const m = document.querySelector('meta[name="faorbit-page-role"]');
    return m ? m.getAttribute('content') : null;
  }

  // Demo guard: redirect before paint if the saved mock identity isn't allowed
  // on this page. Skipped in real-session mode (server enforces access).
  function guard(){
    if(realUser()) return false;
    const role  = pageRole();
    const owner = isOwner();
    if(role === 'owner-only'  && !owner){ location.replace(DEFAULT_MEMBER_PAGE); return true; }
    if(role === 'member-only' &&  owner){ location.replace(DEFAULT_OWNER_PAGE);  return true; }
    return false;
  }
  if(guard()) return;

  function setIdentity(newId){
    if(!IDENTITIES[newId]) return;
    localStorage.setItem(KEY, newId);
    const owner = IDENTITIES[newId].role === 'owner';
    const role  = pageRole();
    if(role === 'owner-only'  && !owner){ location.href = DEFAULT_MEMBER_PAGE; return; }
    if(role === 'member-only' &&  owner){ location.href = DEFAULT_OWNER_PAGE;  return; }
    location.reload();
  }

  // Hide/show elements tagged with data-allow="owner|member|all". No tag =
  // visible to both. Uses the real role when authed, else the mock identity.
  function applyVisibility(){
    const real  = realUser();
    const owner = real ? (real.role === 'owner' || real.role === 'admin') : isOwner();
    document.querySelectorAll('[data-allow]').forEach(el=>{
      const allow = (el.getAttribute('data-allow')||'').split(/[\s,]+/).filter(Boolean);
      const ok = allow.includes('all') ||
                 (owner && allow.includes('owner')) ||
                 (!owner && (allow.includes('member') || allow.includes('media_buyer')));
      el.style.display = ok ? '' : 'none';
    });
  }

  // Inline SVGs so the switcher renders instantly regardless of lucide load.
  const SVG_CHEV  = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>';
  const SVG_CHECK = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  const SVG_INFO  = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>';

  const SVG_LOGOUT = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>';

  function doLogout(e){
    if(e) e.preventDefault();
    fetch('/api/merchant/auth/logout', { method: 'POST', credentials: 'same-origin' })
      .then(function(){ location.href = '/login'; })
      .catch(function(){ location.href = '/login'; });
  }

  // Real-session: render the logged-in user as a static (non-switchable) profile
  // pinned to the sidebar bottom (.role-switch → margin-top:auto), with logout.
  function renderRealProfile(user){
    const slot = document.querySelector('[data-identity-switcher]');
    if(!slot) return;
    slot.classList.add('role-switch'); // 复用底部吸附 + 顶部分隔线，避免名片上浮
    const initial = user.name.trim()[0] || '·';
    const label   = ROLE_LABEL[user.role] || user.role;
    slot.innerHTML =
      '<div style="display:flex;align-items:center;gap:10px;padding:6px 12px 8px">' +
      '<span style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#1f6dff,#0a3aa8);color:#fff;display:grid;place-items:center;font-weight:700;flex:none">' + esc(initial) + '</span>' +
      '<div style="min-width:0"><div style="display:flex;align-items:center;gap:6px;min-width:0">' +
      '<span style="font-family:var(--ff-disp);font-weight:600;font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(user.name) + '</span>' +
      '<span style="flex:none;font-size:10px;font-weight:600;line-height:1;padding:3px 7px;border-radius:999px;background:rgba(125,162,255,.18);color:#a9c4ff">' + esc(label) + '</span></div>' +
      '<div style="font-size:11.5px;color:var(--ink-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(user.email) + '</div></div></div>' +
      '<button type="button" data-logout style="display:flex;align-items:center;gap:11px;width:100%;padding:10px 12px;border-radius:10px;color:var(--ink-2);font-size:14.5px;font-weight:500;background:transparent;border:none;cursor:pointer;text-align:left;font-family:inherit">' +
      SVG_LOGOUT + '退出登录</button>';
    const btn = slot.querySelector('[data-logout]');
    if(btn){
      btn.addEventListener('mouseenter', function(){ btn.style.background = 'var(--bg-2)'; btn.style.color = 'var(--ink)'; });
      btn.addEventListener('mouseleave', function(){ btn.style.background = 'transparent'; btn.style.color = 'var(--ink-2)'; });
      btn.addEventListener('click', doLogout);
    }
  }

  function renderSwitcher(){
    const slot = document.querySelector('[data-identity-switcher]');
    if(!slot) return;
    const cur = current();
    slot.classList.add('role-switch');

    function optHtml(id){
      const i = IDENTITIES[id];
      const on = i.userId === cur.userId;
      return `<a href="#" class="rs-opt${on ? ' on' : ''}" data-switch-to="${esc(id)}">
        <span class="rs-av" style="background:${esc(i.av.bg)}">${esc(i.av.text)}</span>
        <div class="rs-info"><div class="rs-name">${esc(i.name)}</div><div class="rs-em">${esc(i.email)}</div></div>
        <span class="role ${esc(i.badgeCls)} sm">${esc(i.badgeLabel)}</span>
        <span class="check">${SVG_CHECK}</span>
      </a>`;
    }

    slot.innerHTML = `
      <div class="rs-cap">当前视角</div>
      <button class="rs-trigger" data-rs-toggle type="button">
        <span class="rs-av" style="background:${esc(cur.av.bg)}">${esc(cur.av.text)}</span>
        <div class="rs-info"><div class="rs-name">${esc(cur.name)}</div><div class="rs-em">${esc(cur.email)}</div></div>
        <span class="role ${esc(cur.badgeCls)} sm">${esc(cur.badgeLabel)}</span>
        <span class="chev">${SVG_CHEV}</span>
      </button>
      <div class="rs-pop" data-rs-pop>
        <div class="rs-pop-h">切换预览身份</div>
        ${optHtml('leo')}
        ${optHtml('mo')}
        <div class="rs-pop-foot">${SVG_INFO}仅用于 Demo 预览不同角色</div>
      </div>`;

    const tog = slot.querySelector('[data-rs-toggle]');
    const pop = slot.querySelector('[data-rs-pop]');
    tog.addEventListener('click', e=>{
      e.stopPropagation();
      pop.classList.toggle('on');
      tog.classList.toggle('open');
    });
    document.addEventListener('click', e=>{
      if(!slot.contains(e.target)){
        pop.classList.remove('on');
        tog.classList.remove('open');
      }
    });
    slot.querySelectorAll('[data-switch-to]').forEach(a=>{
      a.addEventListener('click', e=>{
        e.preventDefault();
        setIdentity(a.getAttribute('data-switch-to'));
      });
    });
  }

  function init(){
    applyVisibility();
    const real = realUser();
    if(real) renderRealProfile(real);
    else     renderSwitcher();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.FaorbitIdentity = { current, currentId, setIdentity, IDENTITIES };
})();
