/* Faorbit shared site behaviours */
(function () {
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded',fn); }
  ready(function () {
    if (window.lucide) lucide.createIcons();

    /* ---- year ---- */
    document.querySelectorAll('[data-year]').forEach(function(e){ e.textContent=new Date().getFullYear(); });

    /* ---- scroll reveal ---- */
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var revs = document.querySelectorAll('.reveal');
    if (reduce || !('IntersectionObserver' in window)) {
      revs.forEach(function(el){ el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      revs.forEach(function(el){ io.observe(el); });
      /* safety: anything still hidden after 3s becomes visible */
      setTimeout(function(){ revs.forEach(function(el){ el.classList.add('in'); }); }, 3000);
    }

    /* ---- count up (data-count or .stat .n / .metric .n / .kpi .v) ---- */
    function parseNum(str){
      var m = String(str).match(/^([^\d-]*)(-?[\d,.]+)(.*)$/);
      if (!m) return null;
      return { pre:m[1], num:parseFloat(m[2].replace(/,/g,'')), suf:m[3], raw:m[2] };
    }
    function decimals(raw){ var i = raw.indexOf('.'); return i<0?0:raw.length-i-1; }
    function animateCount(el){
      var p = parseNum(el.dataset.count || el.textContent);
      if (!p) return;
      var dec = decimals(p.raw), dur = 1300, t0 = null;
      function step(t){
        if (!t0) t0 = t;
        var k = Math.min(1, (t - t0) / dur);
        var e = 1 - Math.pow(1 - k, 3);
        var val = (p.num * e).toFixed(dec);
        el.textContent = p.pre + Number(val).toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec}) + p.suf;
        if (k < 1) requestAnimationFrame(step);
        else el.textContent = p.pre + p.num.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec}) + p.suf;
      }
      requestAnimationFrame(step);
    }
    var counters = document.querySelectorAll('.stat .n, .metric .n, .kpi .v, [data-count]');
    if (!reduce && 'IntersectionObserver' in window){
      var cio = new IntersectionObserver(function(entries){
        entries.forEach(function(en){ if(en.isIntersecting){ animateCount(en.target); cio.unobserve(en.target);} });
      }, { threshold: 0.5 });
      counters.forEach(function(el){ cio.observe(el); });
    }

    /* ---- generic segmented toggles (data-toggle group) ---- */
    document.querySelectorAll('[data-toggle]').forEach(function(group){
      group.addEventListener('click', function(e){
        var btn = e.target.closest('button'); if(!btn) return;
        group.querySelectorAll('button').forEach(function(b){ b.classList.toggle('on', b===btn); });
        var t = btn.dataset.target;
        if (t){
          document.querySelectorAll('[data-toggle-target="'+group.dataset.toggle+'"]').forEach(function(el){
            el.style.display = el.dataset.key===t ? '' : 'none';
          });
        }
        if (group.dataset.toggle === 'billing'){
          var yearly = btn.dataset.target === 'yearly';
          document.querySelectorAll('[data-mo]').forEach(function(el){
            el.textContent = yearly ? el.dataset.yr : el.dataset.mo;
          });
        }
      });
    });

    /* ---- auth tabs ---- */
    var authTabs = document.querySelector('.auth-tabs');
    if (authTabs){
      authTabs.addEventListener('click', function(e){
        var b = e.target.closest('button'); if(!b) return;
        authTabs.querySelectorAll('button').forEach(function(x){
          x.classList.toggle('on', x===b);
          x.setAttribute('aria-selected', x===b ? 'true' : 'false');
        });
        var mode = b.dataset.mode;
        document.querySelectorAll('[data-auth]').forEach(function(el){ el.style.display = el.dataset.auth===mode?'':'none'; });
      });
    }
    /* password show/hide */
    document.querySelectorAll('[data-pw-toggle]').forEach(function(t){
      t.addEventListener('click', function(){
        var inp = document.getElementById(t.dataset.pwToggle);
        if(!inp) return;
        if (inp.type==='password'){
          inp.type='text'; t.textContent='隐藏'; t.setAttribute('aria-label','隐藏密码');
        }
        else {
          inp.type='password'; t.textContent='显示'; t.setAttribute('aria-label','显示密码');
        }
      });
    });

    /* ---- cloudflare turnstile-style widget ---- */
    document.querySelectorAll('.turnstile').forEach(function(ts){
      var fire = function(){
        if (ts.classList.contains('done') || ts.classList.contains('loading')) return;
        ts.classList.add('loading');
        setTimeout(function(){ ts.classList.remove('loading'); ts.classList.add('done');
          var t = ts.querySelector('.ts-label'); if(t) t.textContent='验证成功';
        }, 1400);
      };
      ts.querySelector('.ts-check').addEventListener('click', fire);
    });

    /* ---- docs scrollspy ---- */
    var docSecs = document.querySelectorAll('.docs-main section[id]');
    var docLinks = document.querySelectorAll('.docs-side a[href^="#"]');
    if (docSecs.length){
      var dio = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if (en.isIntersecting){
            docLinks.forEach(function(a){ a.classList.toggle('on', a.getAttribute('href')==='#'+en.target.id); });
          }
        });
      }, { rootMargin: '-10% 0px -70% 0px' });
      docSecs.forEach(function(s){ dio.observe(s); });
    }

    /* ---- nav scrolled state ---- */
    var nav = document.querySelector('header.nav');
    if (nav){
      var onScroll = function(){ nav.classList.toggle('scrolled', window.scrollY>10); };
      onScroll(); window.addEventListener('scroll', onScroll, {passive:true});
    }
  });
})();
