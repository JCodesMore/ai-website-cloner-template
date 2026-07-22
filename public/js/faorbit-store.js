/* Faorbit demo store: persistent fund-flow state + service layer.
 *
 * Backed by localStorage['faorbit_store']. Service methods are shaped like
 * future API calls (single async-ish entry point per action) and enforce
 * role-based permission against the active preview identity. Other pages
 * react to changes via the `faorbit:store-changed` window event.
 */
(function(){
  const KEY = 'faorbit_store_v2';
  function todayAt(h, m){ const d = new Date(); d.setHours(h,m,0,0); return d.toISOString(); }
  function daysAgoAt(n, h, m){ const d = new Date(); d.setDate(d.getDate()-n); d.setHours(h,m,0,0); return d.toISOString(); }

  const SEED = {
    team: { unallocated: 0 },
    wallets: {
      // userId -> available wallet balance (USD)
      leo:     0,         // owner spends from team unallocated, not personal wallet
      vivian:  0,
      mo:      0,
      ray:     0,
      sara:    0
    },
    cardBalances: {},
    fundRequests: [],
    transactions: [],
    notifications: []   // {id, userId, type, title, message, relatedRequestId?, read, createdAt}
  };
  const USERS = {
    leo:    { name:'林一帆', email:'leo@acme.com',    role:'owner',        av:{text:'林',bg:'linear-gradient(135deg,#7c5cff,#4a2fb0)'} },
    vivian: { name:'赵薇',   email:'vivian@acme.com', role:'admin',        av:{text:'赵',bg:'linear-gradient(135deg,#1f6dff,#0a3aa8)'} },
    mo:     { name:'陈墨',   email:'mo@acme.com',     role:'media_buyer',  av:{text:'陈',bg:'linear-gradient(135deg,#0bb583,#077a58)'} },
    ray:    { name:'王睿',   email:'ray@acme.com',    role:'member',       av:{text:'王',bg:'linear-gradient(135deg,#f6821f,#c2610f)'} },
    sara:   { name:'Sara Hu',email:'sara@acme.com',   role:'media_buyer',  av:{text:'S',bg:'linear-gradient(135deg,#15268c,#0c1640)'} }
  };

  function load(){
    try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch(e){ return null; }
  }
  function save(s){
    localStorage.setItem(KEY, JSON.stringify(s));
    window.dispatchEvent(new CustomEvent('faorbit:store-changed', { detail: s }));
  }
  let state = load();
  if(!state){
    state = JSON.parse(JSON.stringify(SEED));
    save(state);
  } else {
    // Migrate: ensure any new top-level fields added since the user's
    // saved-state was first written exist (otherwise reads crash).
    let migrated = false;
    for(const k of Object.keys(SEED)){
      if(!(k in state)){
        state[k] = JSON.parse(JSON.stringify(SEED[k]));
        migrated = true;
      }
    }
    if(migrated) save(state);
  }
  // sync across tabs
  window.addEventListener('storage', e=>{
    if(e.key !== KEY) return;
    state = load() || state;
    window.dispatchEvent(new CustomEvent('faorbit:store-changed', { detail: state }));
  });

  function uid(prefix){ return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
  function now(){ return new Date().toISOString(); }
  function currentUser(){
    const id = window.FaorbitIdentity ? window.FaorbitIdentity.currentId() : 'leo';
    return { userId: id, ...USERS[id] };
  }
  function deny(msg){ const e = new Error(msg); e.code = 'PERMISSION_DENIED'; throw e; }

  // ===== Read =====
  function getTeamUnallocated(){ return state.team.unallocated; }
  function getWallet(userId){ return state.wallets[userId] || 0; }
  function getCardBalance(userId){ return state.cardBalances[userId] || 0; }
  function getUser(userId){ return USERS[userId] || null; }
  function listUsers(){ return Object.keys(USERS).map(id => ({ userId:id, ...USERS[id] })); }

  function getTeamTotals(){
    const memberWallets = Object.entries(state.wallets)
      .filter(([id]) => USERS[id] && USERS[id].role !== 'owner')
      .reduce((s,[,v])=>s+v, 0);
    const cards = Object.values(state.cardBalances).reduce((s,v)=>s+v,0);
    const unallocated = state.team.unallocated;
    return {
      unallocated,
      memberWallets,
      cards,
      total: unallocated + memberWallets + cards
    };
  }

  function listFundRequests({ status, userId } = {}){
    let list = state.fundRequests.slice().sort((a,b)=> b.createdAt.localeCompare(a.createdAt));
    if(status) list = list.filter(r => r.status === status);
    if(userId) list = list.filter(r => r.userId === userId);
    return list;
  }

  function listNotifications({ userId, unreadOnly } = {}){
    let list = state.notifications.slice().sort((a,b)=> b.createdAt.localeCompare(a.createdAt));
    if(userId) list = list.filter(n => n.userId === userId);
    if(unreadOnly) list = list.filter(n => !n.read);
    return list;
  }
  function getUnreadNotificationCount(userId){
    return state.notifications.reduce((s,n) => s + ((n.userId === userId && !n.read) ? 1 : 0), 0);
  }
  function markNotificationRead(id){
    const n = state.notifications.find(x => x.id === id);
    if(!n || n.read) return;
    n.read = true;
    save(state);
  }
  function markAllNotificationsRead(userId){
    let any = false;
    state.notifications.forEach(n => { if(n.userId === userId && !n.read){ n.read = true; any = true; } });
    if(any) save(state);
  }

  function listTransactions({ userId } = {}){
    let list = state.transactions.slice().sort((a,b)=> b.at.localeCompare(a.at));
    if(userId) list = list.filter(t => t.userId === userId);
    return list;
  }

  // ===== Write (actions) =====
  function createFundRequest({ amount, purpose, approverId }){
    const me = currentUser();
    if(me.role === 'owner') deny('所有者无需提交资金申请');
    const amt = Number(amount);
    if(!isFinite(amt) || amt <= 0) throw new Error('金额必须大于 0');
    if(!purpose || !String(purpose).trim()) throw new Error('用途说明不能为空');
    if(!approverId || !USERS[approverId] || USERS[approverId].role !== 'owner') throw new Error('审批人无效');

    const req = {
      id: uid('req'),
      userId: me.userId,
      name: me.name,
      email: me.email,
      amount: amt,
      purpose: String(purpose).trim(),
      approverId,
      status: 'pending',
      createdAt: now()
    };
    state.fundRequests.unshift(req);
    save(state);
    return req;
  }

  function approveFundRequest(reqId){
    const me = currentUser();
    if(me.role !== 'owner') deny('仅所有者可审核资金申请');
    const req = state.fundRequests.find(r => r.id === reqId);
    if(!req) throw new Error('申请不存在');
    if(req.status !== 'pending') throw new Error('申请已被处理');
    if(state.team.unallocated < req.amount) throw new Error('未分配余额不足');

    // Move money + write transactions atomically.
    state.team.unallocated = round2(state.team.unallocated - req.amount);
    state.wallets[req.userId] = round2((state.wallets[req.userId] || 0) + req.amount);

    req.status = 'approved';
    req.decidedAt = now();
    req.decidedBy = me.userId;
    req.decidedByName = me.name;

    // Member-side transaction (income) — with balance snapshot + actor for audit drawer.
    const beforeBal = round2((state.wallets[req.userId] || 0) - req.amount);
    state.transactions.unshift({
      id: uid('tx'),
      userId: req.userId,
      type: '申请资金到账',
      direction: 'in',
      amount: req.amount,
      counterparty: me.name,
      status: 'success',
      at: req.decidedAt,
      actorId: me.userId,
      actorName: me.name,
      balanceBefore: beforeBal,
      balanceAfter: state.wallets[req.userId],
      requestId: req.id,
      note: req.purpose || ''
    });
    // Applicant notification
    state.notifications.unshift({
      id: uid('ntf'),
      userId: req.userId,
      type: 'fund_request_approved',
      title: '资金申请已通过',
      message: '你的资金申请 ' + fmtMoney(req.amount) + ' 已通过，资金已转入你的钱包。' + (req.purpose ? '用途：' + req.purpose : ''),
      relatedRequestId: req.id,
      read: false,
      createdAt: req.decidedAt
    });
    save(state);
    return req;
  }

  // Owner-only manual allocation: bypasses the request/approve flow and writes
  // a single "owner allocation" transaction. Used by the "分配资金" drawer.
  function allocateToMember({ userId, amount, note }){
    const me = currentUser();
    if(me.role !== 'owner') deny('仅所有者可分配资金');
    const target = USERS[userId];
    if(!target) throw new Error('成员不存在');
    if(target.role === 'owner') throw new Error('不能分配给所有者');
    const amt = Number(amount);
    if(!isFinite(amt) || amt <= 0) throw new Error('金额必须大于 0');
    if(state.team.unallocated < amt) throw new Error('未分配余额不足');

    const beforeBal = round2((state.wallets[userId] || 0) - amt);
    state.team.unallocated = round2(state.team.unallocated - amt);
    state.wallets[userId]  = round2((state.wallets[userId] || 0) + amt);
    state.transactions.unshift({
      id: uid('tx'),
      userId,
      type: '资金分配',
      direction: 'in',
      amount: amt,
      counterparty: me.name,
      status: 'success',
      at: now(),
      actorId: me.userId,
      actorName: me.name,
      balanceBefore: beforeBal,
      balanceAfter: state.wallets[userId],
      note: note || ''
    });
    // Notify the recipient — every money movement surfaces in their bell.
    state.notifications.unshift({
      id: uid('ntf'),
      userId,
      type: 'fund_allocated',
      title: '收到所有者分配资金',
      message: me.name + ' 划转 ' + fmtMoney(amt) + ' 到你的钱包' + (note ? '。备注：' + note : '。'),
      read: false,
      createdAt: now()
    });
    save(state);
    return { ok: true };
  }

  function rejectFundRequest(reqId, reason){
    const me = currentUser();
    if(me.role !== 'owner') deny('仅所有者可审核资金申请');
    const req = state.fundRequests.find(r => r.id === reqId);
    if(!req) throw new Error('申请不存在');
    if(req.status !== 'pending') throw new Error('申请已被处理');

    req.status = 'rejected';
    req.decidedAt = now();
    req.decidedBy = me.userId;
    req.decidedByName = me.name;
    req.reason = (reason && String(reason).trim()) || '';
    state.notifications.unshift({
      id: uid('ntf'),
      userId: req.userId,
      type: 'fund_request_rejected',
      title: '资金申请被拒绝',
      message: '你的资金申请 ' + fmtMoney(req.amount) + ' 已被拒绝。' + (req.purpose ? '用途：' + req.purpose : '') + (req.reason ? ' 原因：' + req.reason : ''),
      relatedRequestId: req.id,
      read: false,
      createdAt: req.decidedAt
    });
    save(state);
    return req;
  }

  function fmtMoney(n){ return '$' + Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}); }

  function round2(n){ return Math.round(n * 100) / 100; }

  function resetState(){ state = JSON.parse(JSON.stringify(SEED)); save(state); }

  window.FaorbitStore = {
    // reads
    getTeamUnallocated, getTeamTotals, getWallet, getCardBalance,
    getUser, listUsers, listFundRequests, listTransactions,
    listNotifications, getUnreadNotificationCount,
    // writes
    createFundRequest, approveFundRequest, rejectFundRequest, allocateToMember,
    markNotificationRead, markAllNotificationsRead,
    // utils
    USERS, resetState,
    onChange(fn){ window.addEventListener('faorbit:store-changed', e => fn(e.detail)); }
  };

  // === Toast helper (reuses css/site.css `.toast-wrap` styles) ===
  function ensureToastWrap(){
    let w = document.querySelector('[data-toast-wrap]');
    if(!w){ w = document.createElement('div'); w.className = 'toast-wrap'; w.setAttribute('data-toast-wrap',''); document.body.appendChild(w); }
    return w;
  }
  const ICONS = {
    ok:   '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    err:  '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>',
    warn: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/></svg>'
  };
  function toast(msg, kind, ms){
    kind = kind || 'ok';
    const w = ensureToastWrap();
    const el = document.createElement('div');
    el.className = 'toast ' + kind;
    el.innerHTML = (ICONS[kind] || '') + '<span>' + String(msg).replace(/</g,'&lt;') + '</span>';
    w.appendChild(el);
    requestAnimationFrame(()=>el.classList.add('show'));
    setTimeout(()=>{ el.classList.remove('show'); setTimeout(()=>el.remove(), 280); }, ms || 2600);
  }
  window.FaorbitToast = toast;

  /* === Notification bell: drop-down attached to any `[data-notification-bell]`
   *    button. Pulls the current preview identity from FaorbitIdentity and
   *    auto-rerenders on store changes. Inline SVG icons so it works regardless
   *    of lucide load order. */
  const N_ICONS = {
    bell: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
    check:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    x:    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l18 12"/></svg>'
  };

  function fmtTimeAgo(iso){
    const d = new Date(iso), s = (Date.now() - d.getTime())/1000;
    if(s < 60)   return '刚刚';
    if(s < 3600) return Math.floor(s/60) + ' 分钟前';
    if(s < 86400)return Math.floor(s/3600) + ' 小时前';
    const days = Math.floor(s/86400);
    if(days < 7) return days + ' 天前';
    return (d.getMonth()+1) + '/' + d.getDate();
  }

  const BELL_CSS = `
    .nbell-wrap{position:relative;display:inline-flex}
    .nbell-badge{position:absolute;top:-2px;right:-2px;min-width:16px;height:16px;border-radius:999px;background:#e54848;color:#fff;font-size:10px;font-weight:700;font-family:var(--ff-disp);display:flex;align-items:center;justify-content:center;padding:0 4px;border:2px solid #fff;line-height:1;pointer-events:none}
    .nbell-pop{position:fixed;width:380px;max-width:calc(100vw - 24px);background:#fff;border:1px solid var(--line);border-radius:14px;box-shadow:0 24px 60px -16px rgba(12,22,64,.28);z-index:90;display:none;overflow:hidden}
    .nbell-pop.on{display:flex;flex-direction:column}
    .nbell-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--line)}
    .nbell-head h4{font-family:var(--ff-disp);font-weight:700;font-size:14.5px}
    .nbell-head button{background:transparent;border:0;color:var(--blue);font-size:12.5px;font-family:var(--ff-disp);font-weight:600;cursor:pointer;padding:4px 6px;border-radius:6px}
    .nbell-head button:disabled{color:var(--ink-3);cursor:default}
    .nbell-list{flex:1;overflow-y:auto;max-height:420px}
    .nbell-empty{padding:36px 18px;text-align:center;color:var(--ink-3);font-size:13px}
    .nbell-item{display:grid;grid-template-columns:32px 1fr auto;gap:11px;padding:13px 16px;border-bottom:1px solid var(--line);cursor:default;align-items:flex-start;position:relative;background:#fff;transition:background .12s}
    .nbell-item.nav{cursor:pointer}
    .nbell-item:hover{background:var(--bg-2)}
    .nbell-item:last-child{border-bottom:0}
    .nbell-item.unread::before{content:"";position:absolute;left:6px;top:50%;transform:translateY(-50%);width:6px;height:6px;border-radius:50%;background:var(--blue)}
    .nbell-item .ni{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;flex:none}
    .nbell-item.approved .ni{background:rgba(11,143,104,.14);color:#0a8f68}
    .nbell-item.rejected .ni{background:rgba(210,59,59,.10);color:#c44}
    .nbell-item .nm{min-width:0}
    .nbell-item .nt{font-family:var(--ff-disp);font-weight:600;font-size:13.5px;color:var(--ink);line-height:1.35}
    .nbell-item.unread .nt{color:var(--ink)}
    .nbell-item:not(.unread) .nt{color:var(--ink-2)}
    .nbell-item .nd{color:var(--ink-3);font-size:12.5px;margin-top:3px;line-height:1.45;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
    .nbell-item .ng{color:var(--ink-3);font-size:11.5px;font-family:var(--ff-mono);flex:none;white-space:nowrap}
  `;
  let cssInjected = false;
  function injectCss(){
    if(cssInjected) return;
    const s = document.createElement('style');
    s.id = '__faorbit-bell-css';
    s.textContent = BELL_CSS;
    document.head.appendChild(s);
    cssInjected = true;
  }

  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  function mountBell(btn){
    if(!btn || btn.__bellMounted) return;
    btn.__bellMounted = true;
    injectCss();

    // Wrap button so we can absolutely-position the badge against it.
    const wrap = document.createElement('span');
    wrap.className = 'nbell-wrap';
    btn.parentNode.insertBefore(wrap, btn);
    wrap.appendChild(btn);
    const badge = document.createElement('span');
    badge.className = 'nbell-badge';
    badge.style.display = 'none';
    wrap.appendChild(badge);

    // Make sure the icon is rendered (lucide may load after this script).
    if(!btn.querySelector('svg')){
      btn.innerHTML = N_ICONS.bell;
    }

    const pop = document.createElement('div');
    pop.className = 'nbell-pop';
    pop.innerHTML = '<div class="nbell-head"><h4>通知</h4><button data-mark-all>全部标记已读</button></div><div class="nbell-list"></div>';
    document.body.appendChild(pop);
    const list = pop.querySelector('.nbell-list');
    const markAll = pop.querySelector('[data-mark-all]');

    function currentUserId(){
      return window.FaorbitIdentity ? window.FaorbitIdentity.currentId() : 'leo';
    }
    // 登录态：铃铛走真实接口 /api/merchant/notifications；否则用演示 store。
    const am = document.querySelector('[data-auth-state]');
    const AUTHED = !!(am && am.getAttribute('data-auth-state') === 'authed');

    function paint(items, unread){
      if(unread > 0){
        badge.style.display = '';
        badge.textContent = unread > 99 ? '99+' : String(unread);
      } else {
        badge.style.display = 'none';
      }
      markAll.disabled = unread === 0;
      if(!items || items.length === 0){
        list.innerHTML = '<div class="nbell-empty">还没有通知</div>';
        return;
      }
      list.innerHTML = items.map(n => {
        const kind = (n.type === 'fund_request_approved' || /批准|已通过/.test(n.title)) ? 'approved'
                   : (n.type === 'fund_request_rejected' || /驳回|拒绝/.test(n.title)) ? 'rejected' : '';
        const icon = kind === 'approved' ? N_ICONS.check : (kind === 'rejected' ? N_ICONS.x : N_ICONS.bell);
        const nav = notifTarget(n.type, n.relatedType, n.relatedId, kind) ? ' nav' : '';
        return '<div class="nbell-item ' + kind + nav + (n.read ? '' : ' unread') + '" data-ntf-id="' + esc(n.id)
          + '" data-ntype="' + esc(n.type || '') + '" data-rel-type="' + esc(n.relatedType || '') + '" data-rel-id="' + esc(n.relatedId || '') + '" data-kind="' + kind + '">'
          + '<span class="ni">' + icon + '</span>'
          + '<div class="nm"><div class="nt">' + esc(n.title) + '</div><div class="nd">' + esc(n.message) + '</div></div>'
          + '<span class="ng">' + fmtTimeAgo(n.createdAt) + '</span>'
        + '</div>';
      }).join('');
    }

    /* 通知 → 处理入口（登录态）。仅对「有对应操作页」的通知设置跳转；其余只标记已读、不跳转。 */
    function notifTarget(ntype, relType, relId, kind){
      if(relType === 'card')                                                    // 卡片充值/提现/销卡/冻结/解冻 → 直达该卡详情
        return '/dashboard?view=cards' + (relId ? '&card=' + encodeURIComponent(relId) : '');
      if(relType === 'fund_request')                                            // 待审批 → 审批视图；已批准/驳回结果 → 钱包看到账
        return (kind === 'approved' || kind === 'rejected') ? '/my-wallet' : '/dashboard?view=approvals';
      if(ntype === 'wallet')         return '/my-wallet';                      // 充值/提现/资金分配到账 → 钱包
      // KYB 审核结果、商户冻结/解冻公告、角色/启用变更、Webhook 死信等纯告知类无对应页 → 不跳转。
      return null;
    }

    function render(){
      if(AUTHED){
        fetch('/api/merchant/notifications', { credentials: 'same-origin' })
          .then(r => r.ok ? r.json() : { items: [], unread: 0 })
          .then(j => paint(j.items || [], j.unread || 0))
          .catch(() => paint([], 0));
      } else {
        const items = listNotifications({ userId: currentUserId() });
        paint(items, items.filter(n => !n.read).length);
      }
    }

    function place(){
      const r = btn.getBoundingClientRect();
      const vw = window.innerWidth, margin = 12;
      let left = r.right - pop.offsetWidth;
      if(left < margin) left = margin;
      if(left + pop.offsetWidth > vw - margin) left = vw - margin - pop.offsetWidth;
      pop.style.top  = (r.bottom + 8) + 'px';
      pop.style.left = left + 'px';
    }

    btn.addEventListener('click', e=>{
      e.stopPropagation();
      const opening = !pop.classList.contains('on');
      if(opening){
        render();
        pop.classList.add('on');
        place();
      } else {
        pop.classList.remove('on');
      }
    });
    document.addEventListener('click', e=>{
      if(pop.classList.contains('on') && !pop.contains(e.target) && !wrap.contains(e.target)){
        pop.classList.remove('on');
      }
    });
    window.addEventListener('resize', ()=>{ if(pop.classList.contains('on')) place(); });
    window.addEventListener('scroll', ()=>{ if(pop.classList.contains('on')) place(); }, true);

    function apiPost(body){
      return fetch('/api/merchant/notifications', { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(body) });
    }
    markAll.addEventListener('click', e=>{
      e.stopPropagation();
      if(AUTHED){ apiPost({ action: 'read_all' }).then(render).catch(render); }
      else { markAllNotificationsRead(currentUserId()); }
    });
    list.addEventListener('click', e=>{
      const it = e.target.closest('.nbell-item');
      if(!it) return;
      const id = it.getAttribute('data-ntf-id');
      if(AUTHED){
        const target = notifTarget(it.getAttribute('data-ntype'), it.getAttribute('data-rel-type'), it.getAttribute('data-rel-id'), it.getAttribute('data-kind'));
        if(target){
          // 先标已读再跳转（标记失败也照样跳，处理优先）。
          apiPost({ action: 'read', id: id }).catch(function(){}).then(function(){ window.location.href = target; });
        } else {
          apiPost({ action: 'read', id: id }).then(render).catch(render);
        }
      }
      else { markNotificationRead(id); }
    });

    window.addEventListener('faorbit:store-changed', render);
    render();
  }

  function mountAllBells(){
    document.querySelectorAll('[data-notification-bell]').forEach(mountBell);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountAllBells);
  else mountAllBells();

  window.FaorbitNotifications = {
    mount: mountBell,
    list: listNotifications,
    unreadCount: getUnreadNotificationCount,
    markRead: markNotificationRead,
    markAllRead: markAllNotificationsRead
  };
})();

/* === Faorbit in-app dialog：替换原生 alert/confirm/prompt 的应用内对话框 ===
 * FaorbitDialog.confirm({title, message, danger, okText, cancelText}) → Promise<boolean>
 * FaorbitDialog.form({..., fields:[{key,label,type,placeholder,value,required,validate,options}]}) → Promise<object|null>
 * type: text | password | number | select（select 用 options:[{value,label}]）
 */
(function(){
  const CSS = `
    .fdlg-ov{position:fixed;inset:0;background:rgba(12,20,48,.45);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .15s}
    .fdlg-ov.on{opacity:1}
    .fdlg{background:#fff;border-radius:16px;box-shadow:0 30px 80px -20px rgba(12,22,64,.4);width:100%;max-width:400px;padding:22px 22px 18px;transform:translateY(8px) scale(.98);transition:transform .15s}
    .fdlg-ov.on .fdlg{transform:none}
    .fdlg h3{font-family:var(--ff-disp);font-weight:700;font-size:16.5px;color:var(--ink);margin:0 0 8px}
    .fdlg .msg{color:var(--ink-2);font-size:13.5px;line-height:1.6;margin:0 0 6px}
    .fdlg .fld{margin-top:12px}
    .fdlg .fld label{display:block;font-family:var(--ff-disp);font-weight:600;font-size:12.5px;color:var(--ink-2);margin-bottom:6px}
    .fdlg .fld input,.fdlg .fld select{width:100%;border:1px solid var(--line-2);border-radius:10px;padding:10px 12px;font-size:14px;color:var(--ink);background:#fff;font-family:var(--ff-body);outline:none;box-sizing:border-box}
    .fdlg .fld input:focus,.fdlg .fld select:focus{border-color:var(--blue)}
    .fdlg .pwd-wrap{position:relative}
    .fdlg .pwd-wrap input{padding-right:58px}
    .fdlg .pwd-toggle{position:absolute;right:8px;top:50%;transform:translateY(-50%);border:0;background:transparent;color:var(--blue);font-family:var(--ff-disp);font-size:12px;font-weight:600;padding:5px 6px;cursor:pointer;border-radius:6px}
    .fdlg .pwd-toggle:hover{background:rgba(31,109,255,.08)}
    .fdlg .pwd-toggle:focus-visible{outline:2px solid rgba(31,109,255,.28);outline-offset:1px}
    .fdlg .err{color:#c44;font-size:12.5px;margin-top:10px;min-height:16px}
    .fdlg .acts{display:flex;justify-content:flex-end;gap:10px;margin-top:14px}
    .fdlg .acts button{font-family:var(--ff-disp);font-weight:600;font-size:13.5px;border-radius:10px;padding:9px 16px;cursor:pointer;border:1px solid var(--line-2);background:#fff;color:var(--ink)}
    .fdlg .acts button:hover{background:var(--bg-2)}
    .fdlg .acts .ok{border:0;background:var(--blue);color:#fff}
    .fdlg .acts .ok:hover{filter:brightness(1.06);background:var(--blue)}
    .fdlg .acts .ok.danger{background:#c44}
  `;
  let injected = false;
  function inject(){ if(injected) return; const s=document.createElement('style'); s.id='__faorbit-dlg-css'; s.textContent=CSS; document.head.appendChild(s); injected=true; }
  function esc(v){ return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  function open(opts){
    inject();
    return new Promise(function(resolve){
      const ov = document.createElement('div'); ov.className='fdlg-ov';
      const fields = opts.fields || [];
      ov.innerHTML = '<div class="fdlg" role="dialog" aria-modal="true">'
        + '<h3>' + esc(opts.title || '确认') + '</h3>'
        + (opts.message ? '<p class="msg">' + esc(opts.message) + '</p>' : '')
        + fields.map(function(f){
            if((f.type||'text') === 'select'){
              return '<div class="fld"><label>' + esc(f.label||'') + '</label><select data-fdlg-k="'+esc(f.key)+'">'
                + (f.options||[]).map(function(o){ return '<option value="'+esc(o.value)+'"'+(o.value===f.value?' selected':'')+'>'+esc(o.label)+'</option>'; }).join('')
                + '</select></div>';
            }
            const input = '<input data-fdlg-k="'+esc(f.key)+'" type="'+esc(f.type||'text')+'" placeholder="'+esc(f.placeholder||'')+'" value="'+esc(f.value||'')+'">';
            return '<div class="fld"><label>' + esc(f.label||'') + '</label>'
              + (((f.type||'text') === 'password' && f.reveal)
                ? '<div class="pwd-wrap">' + input + '<button type="button" class="pwd-toggle" data-fdlg-reveal aria-label="显示密码">显示</button></div>'
                : input)
              + '</div>';
          }).join('')
        + '<div class="err" data-fdlg-err></div>'
        + '<div class="acts"><button type="button" data-fdlg-cancel>' + esc(opts.cancelText||'取消') + '</button>'
        + '<button type="button" class="ok'+(opts.danger?' danger':'')+'" data-fdlg-ok>' + esc(opts.okText||'确认') + '</button></div>'
        + '</div>';
      document.body.appendChild(ov);
      requestAnimationFrame(function(){ ov.classList.add('on'); });
      ov.querySelectorAll('[data-fdlg-reveal]').forEach(function(btn){
        btn.addEventListener('click', function(){
          const input = btn.parentNode.querySelector('[data-fdlg-k]');
          const showing = input.type === 'text';
          input.type = showing ? 'password' : 'text';
          btn.textContent = showing ? '显示' : '隐藏';
          btn.setAttribute('aria-label', showing ? '显示密码' : '隐藏密码');
          input.focus();
          input.setSelectionRange(input.value.length, input.value.length);
        });
      });
      const first = ov.querySelector('[data-fdlg-k]'); if(first) setTimeout(function(){ first.focus(); }, 80);
      function close(val){ ov.classList.remove('on'); document.removeEventListener('keydown', onKey, true); setTimeout(function(){ ov.remove(); }, 150); resolve(val); }
      function submit(){
        const out = {};
        ov.querySelectorAll('[data-fdlg-k]').forEach(function(el){ out[el.getAttribute('data-fdlg-k')] = el.value; });
        let bad = null;
        fields.forEach(function(f){
          if(bad) return;
          const v = out[f.key] || '';
          if(f.required && !String(v).trim()) { bad = (f.label||'该项') + '不能为空'; return; }
          if(f.validate){ const m = f.validate(v, out); if(m) bad = m; }
        });
        if(bad){ ov.querySelector('[data-fdlg-err]').textContent = bad; return; }
        close(fields.length ? out : true);
      }
      function onKey(e){
        if(e.key === 'Escape'){ e.stopPropagation(); close(null); }
        else if(e.key === 'Enter' && e.target && e.target.tagName !== 'SELECT'){ e.preventDefault(); submit(); }
      }
      ov.querySelector('[data-fdlg-cancel]').addEventListener('click', function(){ close(null); });
      ov.querySelector('[data-fdlg-ok]').addEventListener('click', submit);
      ov.addEventListener('mousedown', function(e){ if(e.target === ov) close(null); });
      document.addEventListener('keydown', onKey, true);
    });
  }
  window.FaorbitDialog = {
    confirm: function(o){ return open(Object.assign({}, o, { fields: [] })).then(function(v){ return v !== null; }); },
    form: open
  };
})();
