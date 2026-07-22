/* Faorbit demo: funds store + service layer.
 *
 * Persists to localStorage so the same data is visible across owner/member
 * preview switches. All mutations go through service functions so swapping to
 * a real API later is a single-file change.
 *
 * Public surface:
 *   FundsStore.createRequest({ userId, amount, purpose, approver })
 *   FundsStore.approveRequest(requestId, byUserId)
 *   FundsStore.rejectRequest(requestId, byUserId)
 *   FundsStore.allocateDirect({ userId, amount, byUserId })   // owner direct alloc
 *   FundsStore.recallFromMember({ userId, amount, byUserId }) // owner recall
 *   FundsStore.getUnallocated() / getMember(userId) / getTeamTotals()
 *   FundsStore.listRequestsForUser(userId)
 *   FundsStore.listPendingRequests() / listAllRequests()
 *   FundsStore.listTransactionsForUser(userId)
 *   FundsStore.subscribe(fn) -> unsubscribe
 *   FundsStore.reset()
 */
(function(){
  const KEY = 'faorbit_funds_state_v3';

  const SEED = {
    unallocated: 0,
    cardBalance: 0, // sum of card-loaded balances (display-only here)
    members: {
      leo:    { name: '林一帆',  email: 'leo@acme.com',    role: 'owner',       walletBalance: 0       },
      vivian: { name: '赵薇',    email: 'vivian@acme.com', role: 'admin',       walletBalance: 0 },
      mo:     { name: '陈墨',    email: 'mo@acme.com',     role: 'media_buyer', walletBalance: 0  },
      ray:    { name: '王睿',    email: 'ray@acme.com',    role: 'member',      walletBalance: 0  },
      sara:   { name: 'Sara Hu', email: 'sara@acme.com',   role: 'media_buyer', walletBalance: 0 }
    },
    requests: [],
    transactions: []
  };

  // ---------- persistence ----------
  function deepClone(v){ return JSON.parse(JSON.stringify(v)); }
  function load(){
    try {
      const raw = localStorage.getItem(KEY);
      if(!raw) return deepClone(SEED);
      const parsed = JSON.parse(raw);
      // Light schema check; if the stored shape is unexpected, reseed.
      if(!parsed || !parsed.members || typeof parsed.unallocated !== 'number'){
        return deepClone(SEED);
      }
      return parsed;
    } catch(_){ return deepClone(SEED); }
  }
  let state = load();
  function save(){
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  // ---------- pub/sub ----------
  const listeners = new Set();
  function subscribe(fn){ listeners.add(fn); return ()=>listeners.delete(fn); }
  function emit(){ listeners.forEach(fn => { try{ fn(state); }catch(e){ console.error(e); } }); }

  // Re-emit when another tab/page mutates the same key.
  window.addEventListener('storage', e => {
    if(e.key === KEY){ state = load(); emit(); }
  });

  // ---------- helpers ----------
  function uid(prefix){
    return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
  }
  function round2(n){ return Math.round(n * 100) / 100; }

  // ---------- services ----------
  function createRequest({ userId, amount, purpose, approver }){
    if(!userId || !state.members[userId]) throw new Error('请先以成员身份登录');
    const amt = typeof amount === 'string' ? parseFloat(String(amount).replace(/,/g,'')) : amount;
    if(!(amt > 0)) throw new Error('申请金额必须大于 0');
    if(!purpose || !String(purpose).trim()) throw new Error('请填写用途说明');
    if(!approver || !String(approver).trim()) throw new Error('请选择审批人');
    const m = state.members[userId];
    const req = {
      id: uid('req'),
      userId, name: m.name, email: m.email,
      amount: round2(amt),
      purpose: String(purpose).trim(),
      approver: String(approver).trim(),
      createdAt: Date.now(),
      status: 'pending',
      decidedAt: null, decidedBy: null
    };
    state.requests.push(req);
    save(); emit();
    return req;
  }

  function approveRequest(requestId, byUserId){
    const req = state.requests.find(r => r.id === requestId);
    if(!req) throw new Error('申请不存在');
    if(req.status !== 'pending') throw new Error('该申请已被处理');
    if(req.amount > state.unallocated) throw new Error('未分配余额不足，无法批准');
    state.unallocated = round2(state.unallocated - req.amount);
    state.members[req.userId].walletBalance = round2(state.members[req.userId].walletBalance + req.amount);
    req.status = 'approved';
    req.decidedAt = Date.now();
    req.decidedBy = byUserId || 'leo';
    const ownerName = (state.members[req.decidedBy] && state.members[req.decidedBy].name) || '所有者';
    state.transactions.push({
      id: uid('tx'), ts: Date.now(),
      userId: req.userId, type: '所有者分配',
      amount: req.amount, party: ownerName,
      status: '成功', requestId: req.id
    });
    save(); emit();
    return req;
  }

  function rejectRequest(requestId, byUserId){
    const req = state.requests.find(r => r.id === requestId);
    if(!req) throw new Error('申请不存在');
    if(req.status !== 'pending') throw new Error('该申请已被处理');
    req.status = 'rejected';
    req.decidedAt = Date.now();
    req.decidedBy = byUserId || 'leo';
    save(); emit();
    return req;
  }

  function allocateDirect({ userId, amount, byUserId }){
    if(!state.members[userId]) throw new Error('成员不存在');
    const amt = typeof amount === 'string' ? parseFloat(String(amount).replace(/,/g,'')) : amount;
    if(!(amt > 0)) throw new Error('分配金额必须大于 0');
    if(amt > state.unallocated) throw new Error('未分配余额不足');
    state.unallocated = round2(state.unallocated - amt);
    state.members[userId].walletBalance = round2(state.members[userId].walletBalance + amt);
    const ownerName = (state.members[byUserId] && state.members[byUserId].name) || '所有者';
    state.transactions.push({
      id: uid('tx'), ts: Date.now(),
      userId, type: '所有者分配',
      amount: round2(amt), party: ownerName, status: '成功'
    });
    save(); emit();
  }

  function recallFromMember({ userId, amount, byUserId }){
    if(!state.members[userId]) throw new Error('成员不存在');
    const amt = typeof amount === 'string' ? parseFloat(String(amount).replace(/,/g,'')) : amount;
    if(!(amt > 0)) throw new Error('收回金额必须大于 0');
    if(amt > state.members[userId].walletBalance) throw new Error('该成员钱包余额不足');
    state.members[userId].walletBalance = round2(state.members[userId].walletBalance - amt);
    state.unallocated = round2(state.unallocated + amt);
    const ownerName = (state.members[byUserId] && state.members[byUserId].name) || '所有者';
    state.transactions.push({
      id: uid('tx'), ts: Date.now(),
      userId, type: '所有者收回',
      amount: -round2(amt), party: ownerName, status: '成功'
    });
    save(); emit();
  }

  // ---------- readers ----------
  function getUnallocated(){ return state.unallocated; }
  function getMember(userId){ return state.members[userId]; }
  function getTeamTotals(){
    let walletSum = 0;
    Object.keys(state.members).forEach(k => {
      if(state.members[k].role !== 'owner') walletSum += state.members[k].walletBalance;
    });
    walletSum = round2(walletSum);
    return {
      unallocated:   state.unallocated,
      memberWallets: walletSum,
      cardBalance:   state.cardBalance,
      total:         round2(state.unallocated + walletSum + state.cardBalance)
    };
  }
  function listRequestsForUser(userId){
    return state.requests.filter(r => r.userId === userId).sort((a,b) => b.createdAt - a.createdAt);
  }
  function listPendingRequests(){
    return state.requests.filter(r => r.status === 'pending').sort((a,b) => a.createdAt - b.createdAt);
  }
  function listAllRequests(){
    return state.requests.slice().sort((a,b) => b.createdAt - a.createdAt);
  }
  function listTransactionsForUser(userId){
    return state.transactions.filter(t => t.userId === userId).sort((a,b) => b.ts - a.ts);
  }
  function reset(){ state = deepClone(SEED); save(); emit(); }

  // ---------- format / helpers exposed for views ----------
  function fmtMoney(n){
    const sign = n < 0 ? '-' : '';
    return sign + '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 });
  }
  function fmtMoneyPlain(n){
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 });
  }
  function fmtTime(ts){
    const d = new Date(ts);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    const yest = new Date(now); yest.setDate(now.getDate() - 1);
    const isYesterday = d.toDateString() === yest.toDateString();
    const hh = String(d.getHours()).padStart(2,'0');
    const mm = String(d.getMinutes()).padStart(2,'0');
    if(sameDay) return '今天 ' + hh + ':' + mm;
    if(isYesterday) return '昨天 ' + hh + ':' + mm;
    const days = Math.floor((now - d) / 86400000);
    if(days < 7) return days + ' 天前';
    return (d.getMonth()+1) + '-' + d.getDate() + ' ' + hh + ':' + mm;
  }

  // ---------- toast helper (uses existing .toast-wrap markup) ----------
  function toast(msg, kind){
    let wrap = document.querySelector('[data-toast-wrap]');
    if(!wrap){
      wrap = document.createElement('div');
      wrap.className = 'toast-wrap';
      wrap.setAttribute('data-toast-wrap','');
      document.body.appendChild(wrap);
    }
    const t = document.createElement('div');
    t.className = 'toast ' + (kind || 'ok');
    const icon = kind === 'err' ? '✕' : kind === 'warn' ? '!' : '✓';
    t.innerHTML = '<span style="display:inline-grid;place-items:center;width:18px;height:18px;border-radius:50%;background:rgba(255,255,255,.15);font-size:11px;font-weight:700">' + icon + '</span>' + msg;
    wrap.appendChild(t);
    requestAnimationFrame(()=> t.classList.add('show'));
    setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(), 250); }, 2800);
  }

  window.FundsStore = {
    createRequest, approveRequest, rejectRequest,
    allocateDirect, recallFromMember,
    getUnallocated, getMember, getTeamTotals,
    listRequestsForUser, listPendingRequests, listAllRequests,
    listTransactionsForUser,
    subscribe, reset,
    fmtMoney, fmtMoneyPlain, fmtTime, toast
  };
})();
