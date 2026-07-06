
  // Sticky header shadow on scroll
  var header = document.querySelector('header.site');
  window.addEventListener('scroll', function(){
    if (window.scrollY > 12) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });

  // Mobile menu toggle
  var burger = document.getElementById('burger');
  var navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', function(){
    var open = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  // Close menu when a link is tapped (mobile)
  navLinks.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded','false');
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function(btn){
    btn.addEventListener('click', function(){
      var item = btn.parentElement;
      var answer = item.querySelector('.faq-a');
      var isOpen = item.classList.contains('open');
      // close all
      document.querySelectorAll('.faq-item').forEach(function(i){
        i.classList.remove('open');
        i.querySelector('.faq-a').style.maxHeight = null;
        i.querySelector('.faq-q').setAttribute('aria-expanded','false');
      });
      if (!isOpen){
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded','true');
      }
    });
  });

  // Respect reduced-motion for the showcase video
  var showcase = document.getElementById('showcaseVideo');
  if (showcase && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    showcase.removeAttribute('loop');
    showcase.pause();
  }

  // Beta form — harmless placeholder interaction (no backend)
  var betaForm = document.getElementById('betaForm');
  var betaMsg = document.getElementById('betaMsg');
  if (betaForm && betaMsg) betaForm.addEventListener('submit', function(e){
    e.preventDefault();
    var email = document.getElementById('betaEmail').value.trim();
    if (!email || email.indexOf('@') === -1){
      betaMsg.style.color = 'var(--magenta)';
      betaMsg.textContent = 'Please enter a valid email address.';
      return;
    }
    betaMsg.style.color = 'var(--cyan)';
    betaMsg.textContent = 'Thanks — beta update signup placeholder received.';
    console.log('Beta signup placeholder:', email);
    betaForm.reset();
  });

  // ===== Scroll progress bar =====
  var progress = document.getElementById('scrollProgress');
  function onScrollProgress(){
    var h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  }

  // ===== Back to top =====
  var toTop = document.getElementById('toTop');
  toTop.addEventListener('click', function(){ window.scrollTo({ top:0, behavior:'smooth' }); });

  window.addEventListener('scroll', function(){
    onScrollProgress();
    if (window.scrollY > 640) toTop.classList.add('show'); else toTop.classList.remove('show');
  });
  onScrollProgress();

  // ===== Watch preview → scroll to the video and play it (muted) =====
  var watch = document.getElementById('watchPreview');
  if (watch && showcase){
    watch.addEventListener('click', function(){
      setTimeout(function(){ try { showcase.muted = true; showcase.play(); } catch(e){} }, 650);
    });
  }

  // ===== Scroll-reveal animations (progressive enhancement) =====
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduceMotion){
    document.documentElement.classList.add('js-anim');
    var revealSel = 'section h2, section > .wrap > .section-tag, section > .wrap > .lead, .card, .product, .fstep, .pstep, .sysrow, .folder, .tnode, .video-showcase, .matrix-wrap, .betaform, .faq-item, .finalcta, .process, .timeline, .placeholder, .colorviz';
    var revealEls = Array.prototype.slice.call(document.querySelectorAll(revealSel))
      .filter(function(el){ return !el.closest('.hero') && !el.closest('.pinned'); });
    revealEls.forEach(function(el){ el.classList.add('reveal'); });
    var revealIO = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (!en.isIntersecting) return;
        var el = en.target;
        var sibs = Array.prototype.slice.call(el.parentElement.children)
          .filter(function(c){ return c.classList.contains('reveal'); });
        el.style.transitionDelay = Math.min(sibs.indexOf(el), 6) * 70 + 'ms';
        el.classList.add('in');
        el.addEventListener('transitionend', function te(){
          el.style.transitionDelay = '';
          el.classList.remove('reveal','in');
          el.removeEventListener('transitionend', te);
        });
        revealIO.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function(el){ revealIO.observe(el); });
  }

  // ===== Scroll-driven pinned visuals + hero parallax (Apple-style) =====
  var heroVisual = document.querySelector('.hero-visual');
  var pinnedSections = Array.prototype.slice.call(document.querySelectorAll('.pinned'));
  var illuminated = Array.prototype.slice.call(document.querySelectorAll('[data-illuminate]'))
    .map(function(sec){ return { sec: sec, words: Array.prototype.slice.call(sec.querySelectorAll('.word')) }; });
  var driveQueued = false;
  function driveScroll(){
    driveQueued = false;
    if (reduceMotion) return;
    // Hero visual parallax: drift up, ease back, and fade as the hero scrolls away
    if (heroVisual){
      var t = Math.min(Math.max(window.scrollY / window.innerHeight, 0), 1);
      heroVisual.style.transform = 'translateY(' + (t * -60) + 'px) scale(' + (1 - t * 0.05) + ')';
      heroVisual.style.opacity = String(1 - t * 0.45);
    }
    // Pinned sections: compute 0..1 progress and expose it as --p, advance captions
    pinnedSections.forEach(function(sec){
      var total = sec.offsetHeight - window.innerHeight;
      var p = total > 0 ? Math.min(Math.max(-sec.getBoundingClientRect().top / total, 0), 1) : 0;
      sec.style.setProperty('--p', p.toFixed(4));
      var steps = sec.querySelectorAll('[data-step]');
      if (steps.length){
        var active = Math.min(steps.length - 1, Math.floor(p * steps.length + 0.0001));
        steps.forEach(function(s, i){ s.classList.toggle('active', i === active); });
        var rail = sec.querySelectorAll('.pin-rail i');
        rail.forEach(function(r, i){ r.classList.toggle('on', i === active); });
      }
    });
    // Scroll-illuminated statements: sweep word brightness from dim to full
    illuminated.forEach(function(item){
      var sec = item.sec, words = item.words;
      var total = sec.offsetHeight - window.innerHeight;
      var p = total > 0 ? Math.min(Math.max(-sec.getBoundingClientRect().top / total, 0), 1) : 0;
      var lead = 4; // how many words are mid-transition at once
      var lit = p * (words.length + lead * 2) - lead;
      words.forEach(function(w, i){
        var t = Math.max(0, Math.min(1, lit - i));
        w.style.opacity = (0.16 + t * 0.84).toFixed(3);
      });
    });
  }
  function queueDrive(){ if (!driveQueued){ driveQueued = true; requestAnimationFrame(driveScroll); } }
  window.addEventListener('scroll', queueDrive, { passive: true });
  window.addEventListener('resize', queueDrive);
  driveScroll();

  // ===== Login form (visual only, no backend) =====
  var loginForm = document.getElementById('loginForm');
  if (loginForm){
    loginForm.addEventListener('submit', function(e){
      e.preventDefault();
      var msg = document.getElementById('loginMsg');
      var email = (document.getElementById('loginEmail').value || '').trim();
      if (!email || email.indexOf('@') === -1){
        msg.style.color = 'var(--magenta)';
        msg.textContent = 'Enter a valid email to continue.';
        return;
      }
      msg.style.color = 'var(--cyan)';
      msg.textContent = 'Accounts aren\u2019t live yet — thanks for trying the preview.';
    });
  }

  // ===== Land correctly on cross-page #anchors once layout has settled =====
  window.addEventListener('load', function(){
    if (location.hash.length > 1){
      var el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (el) setTimeout(function(){ el.scrollIntoView(); }, 80);
    }
  });
