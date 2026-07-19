
  // ============================================================
  //  EDIT ME — CMYKForge social links
  //  Paste your real URLs between the quotes (keep the quotes).
  //  Until a real https:// link is set, the buttons stay inert.
  // ============================================================
  var SOCIAL_LINKS = {
    youtube:   'https://www.youtube.com/@CMYKForge',      // CMYKForge channel
    tiktok:    'https://www.tiktok.com/@cmykforge',       // @cmykforge
    instagram: 'https://www.instagram.com/cmykforge/',    // @cmykforge
    facebook:  'https://www.facebook.com/profile.php?id=61592027522383'  // CMYKForge page
  };
  // ============================================================
  //  EDIT ME — "Latest from CMYKForge" video section (index.html)
  //  mode 'latest'  -> automatically embeds the channel's NEWEST upload
  //                    via the uploads playlist (UU + channel id). No API
  //                    key or backend needed; updates by itself.
  //  mode 'video'   -> pins one specific video; set videoId below.
  //  To pin a video: change mode to 'video' and paste the 11-char id
  //  from the watch URL (youtube.com/watch?v=XXXXXXXXXXX).
  // ============================================================
  var YT_CONFIG = {
    mode: 'latest',
    uploadsPlaylist: 'UUTCiZCn0ITbsFN-emVXjIUQ',  // UU + channel id (auto-newest)
    videoId: 'RBGMRvxuz4E',                        // used only when mode==='video'
    channelUrl: 'https://www.youtube.com/@CMYKForge'
  };
  // ============================================================

  // Sticky header, progress, and back-to-top state share one animation-frame
  // update so a fast scroll cannot trigger several layout reads per event.
  var header = document.querySelector('header.site');
  var progress = document.getElementById('scrollProgress');
  var toTop = document.getElementById('toTop');
  var scrollUiQueued = false;
  function updateScrollUi(){
    scrollUiQueued = false;
    var y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 12);
    if (progress){
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
    if (toTop) toTop.classList.toggle('show', y > 640);
  }
  function queueScrollUi(){
    if (!scrollUiQueued){
      scrollUiQueued = true;
      requestAnimationFrame(updateScrollUi);
    }
  }
  window.addEventListener('scroll', queueScrollUi, { passive:true });
  window.addEventListener('resize', queueScrollUi);
  updateScrollUi();

  // Mobile menu toggle
  var burger = document.getElementById('burger');
  var navLinks = document.getElementById('navLinks');
  if (burger && navLinks){
    function closeMenu(){
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open main menu');
    }
    burger.addEventListener('click', function(){
      var open = navLinks.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close main menu' : 'Open main menu');
    });
    // Close menu when a link is tapped (mobile)
    navLinks.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && navLinks.classList.contains('open')){
        closeMenu();
        burger.focus();
      }
    });
    document.addEventListener('click', function(e){
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !burger.contains(e.target)){
        closeMenu();
      }
    });
  }

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
        i.querySelector('.faq-a').setAttribute('aria-hidden','true');
        i.querySelector('.faq-q').setAttribute('aria-expanded','false');
      });
      if (!isOpen){
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.setAttribute('aria-hidden','false');
        btn.setAttribute('aria-expanded','true');
      }
    });
  });

  // Respect reduced-motion for the showcase video
  var showcase = document.getElementById('showcaseVideo');
  var showcaseReduced = showcase && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (showcaseReduced){
    showcase.removeAttribute('loop');
    showcase.pause();
  }

  // Auto-play the showcase video (muted) as its section scrolls into view;
  // pause again when the reader scrolls away. Skipped under reduced-motion.
  // Safari note: Safari only allows muted autoplay while the VIDEO ELEMENT
  // itself is visible, and a too-early play() is rejected. So we observe the
  // video (not just the heading) and keep retrying on scroll until it sticks.
  if (showcase && !showcaseReduced && 'IntersectionObserver' in window){
    var showcaseWant = false;   // true while the video should be playing
    var showcasePlayPending = false;
    function tryPlayShowcase(){
      if (!showcaseWant || !showcase.paused || showcasePlayPending) return;
      showcase.muted = true;    // required for browsers to allow autoplay
      var pr = showcase.play();
      if (pr && pr.then){
        showcasePlayPending = true;
        pr.then(function(){ showcasePlayPending = false; })
          .catch(function(){ showcasePlayPending = false; /* Safari may reject while barely visible; scroll retries */ });
      }
    }
    var showcaseIO = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        showcaseWant = en.isIntersecting;
        if (en.isIntersecting) tryPlayShowcase();
        else if (!showcase.paused) showcase.pause();
      });
    }, { threshold: 0.01 });
    showcaseIO.observe(showcase);
    // Retry while scrolling: succeeds as soon as Safari deems the video visible.
    window.addEventListener('scroll', tryPlayShowcase, { passive: true });
    // Retry once media data is ready (covers preload="metadata" races).
    showcase.addEventListener('loadeddata', tryPlayShowcase);
  }

  // (The old placeholder beta form was replaced by the live Brevo embed on
  //  standard.html#beta. No local form handler or email logging remains.)

  // ===== Back to top (only if present on this page) =====
  if (toTop) toTop.addEventListener('click', function(){
    window.scrollTo({ top:0, behavior:reduceMotion ? 'auto' : 'smooth' });
  });

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

    // Hero entrance choreography: number each [data-hi] element in document
    // order (90ms apart), then flip .hero-in on the next frame so the whole
    // hero cascades in. Delays are cleared afterwards so they never affect
    // later hover/scroll transitions.
    var heroEls = Array.prototype.slice.call(document.querySelectorAll('[data-hi]'));
    heroEls.forEach(function(el, i){ el.style.transitionDelay = (i * 90) + 'ms'; });
    requestAnimationFrame(function(){ requestAnimationFrame(function(){
      document.documentElement.classList.add('hero-in');
      setTimeout(function(){
        heroEls.forEach(function(el){ el.style.transitionDelay = ''; });
      }, 900 + heroEls.length * 90);
    }); });

    var revealSel = 'section h2, section > .wrap > .section-tag, section > .wrap > .lead, .card, .product, .fstep, .pstep, .wstep, .sysrow, .folder, .tnode, .video-showcase, .matrix-wrap, .faq-item, .finalcta, .process, .timeline, .placeholder, .colorviz, .prod-hero-media, .spec-list li, .story-points li, .dlog-entry, .progress-card, [data-reveal]';
    var revealEls = Array.prototype.slice.call(document.querySelectorAll(revealSel))
      .filter(function(el){ return !el.closest('.hero') && !el.closest('.pinned') && !el.closest('.hero-stage') && !el.closest('[hidden]') && !el.classList.contains('sr-only') && !el.hasAttribute('data-hi'); });
    revealEls.forEach(function(el){ el.classList.add('reveal'); });
    // Variant-aware cleanup times: classes are removed once the longest
    // transition (container or inner image) has finished, restoring each
    // element's natural transition behavior for hovers.
    function revealDur(el){
      var v = el.getAttribute('data-reveal');
      return (v === 'clip') ? 1250 : (v === 'scale') ? 1050 : 750;
    }
    var revealIO = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (!en.isIntersecting) return;
        var el = en.target;
        var sibs = Array.prototype.slice.call(el.parentElement.children)
          .filter(function(c){ return c.classList.contains('reveal'); });
        var delay = Math.min(sibs.indexOf(el), 6) * 80;
        el.style.transitionDelay = delay + 'ms';
        el.classList.add('in');
        setTimeout(function(){
          el.style.transitionDelay = '';
          el.classList.remove('reveal','in');
          el.removeAttribute('data-reveal');
        }, revealDur(el) + delay + 60);
        revealIO.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
    revealEls.forEach(function(el){ revealIO.observe(el); });
  }

  // ===== Hero compare slider: real original vs real physical print =====
  (function(){
    var cmp = document.getElementById('heroCompare');
    if (!cmp) return;
    var range = cmp.querySelector('.cmp-range');
    function setPos(pct){
      pct = Math.max(0, Math.min(100, pct));
      cmp.style.setProperty('--pos', pct + '%');
      if (range.value != pct) range.value = pct;
    }
    // range input drives it (keyboard + assistive tech + drag, since it overlays the card)
    range.addEventListener('input', function(){ setPos(+range.value); });
    // direct pointer tracking for a 1:1 drag feel
    function fromEvent(e){
      var r = cmp.getBoundingClientRect();
      setPos((e.clientX - r.left) / r.width * 100);
    }
    cmp.addEventListener('pointerdown', function(e){
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      cmp.setPointerCapture(e.pointerId);
      fromEvent(e);
    });
    cmp.addEventListener('pointermove', function(e){
      if (cmp.hasPointerCapture && cmp.hasPointerCapture(e.pointerId)) fromEvent(e);
    });
    setPos(50);
  })();

  // ===== Cursor-reactive hero spotlight (pointer devices only, motion-safe) =====
  (function(){
    var hero = document.querySelector('.hero');
    if (!hero) return;
    if (window.matchMedia && (window.matchMedia('(prefers-reduced-motion: reduce)').matches
        || !window.matchMedia('(hover: hover) and (pointer: fine)').matches)) return;
    hero.addEventListener('pointermove', function(e){
      var r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      hero.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      hero.classList.add('spotlight');
    });
    hero.addEventListener('pointerleave', function(){ hero.classList.remove('spotlight'); });
  })();

  // ===== Scroll-driven pinned visuals + hero parallax (Apple-style) =====
  var heroVisual = document.querySelector('.hero-visual');
  var pinnedSections = Array.prototype.slice.call(document.querySelectorAll('.pinned'));
  var illuminated = Array.prototype.slice.call(document.querySelectorAll('[data-illuminate]'))
    .map(function(sec){ return { sec: sec, words: Array.prototype.slice.call(sec.querySelectorAll('.word')) }; });
  // Smoothed scroll values: each tracked value eases toward its target every
  // frame (simple lerp), so pinned stages and the hero parallax scrub with a
  // touch of inertia instead of 1:1 rawness. The rAF loop self-terminates
  // once every value has settled, and restarts on the next scroll/resize.
  var LERP = 0.16, SETTLE = 0.0006;
  var heroSm = 0;
  pinnedSections.forEach(function(sec){ sec._sm = 0; });
  illuminated.forEach(function(item){ item.sm = 0; });
  function sectionProgress(sec){
    var total = sec.offsetHeight - window.innerHeight;
    return total > 0 ? Math.min(Math.max(-sec.getBoundingClientRect().top / total, 0), 1) : 0;
  }
  function driveScroll(){
    if (reduceMotion) return false;
    var busy = false;
    function ease(cur, target){
      var next = cur + (target - cur) * LERP;
      if (Math.abs(target - next) > SETTLE) busy = true;
      else next = target;
      return next;
    }
    // Hero visual parallax: drift up, ease back, and fade as the hero scrolls away
    if (heroVisual){
      heroSm = ease(heroSm, Math.min(Math.max(window.scrollY / window.innerHeight, 0), 1));
      heroVisual.style.transform = 'translateY(' + (heroSm * -60) + 'px) scale(' + (1 - heroSm * 0.05) + ')';
      heroVisual.style.opacity = String(1 - heroSm * 0.45);
    }
    // Pinned sections: smoothed 0..1 progress exposed as --p, captions advance
    pinnedSections.forEach(function(sec){
      sec._sm = ease(sec._sm, sectionProgress(sec));
      var p = sec._sm;
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
      item.sm = ease(item.sm, sectionProgress(item.sec));
      var words = item.words;
      var lead = 4; // how many words are mid-transition at once
      var lit = item.sm * (words.length + lead * 2) - lead;
      words.forEach(function(w, i){
        var t = Math.max(0, Math.min(1, lit - i));
        // Keep every word above the WCAG large-text contrast threshold while
        // preserving the progressive illumination effect.
        w.style.opacity = (0.42 + t * 0.58).toFixed(3);
      });
    });
    return busy;
  }
  var driving = false;
  function driveTick(){
    if (driveScroll()) requestAnimationFrame(driveTick);
    else driving = false;
  }
  function queueDrive(){ if (!driving){ driving = true; requestAnimationFrame(driveTick); } }
  window.addEventListener('scroll', queueDrive, { passive: true });
  window.addEventListener('resize', queueDrive);
  queueDrive();

  // ===== "Planned for a future release" notice for unannounced products =====
  (function(){
    var modal = document.getElementById('wipModal');
    if (!modal) return;
    var tagEl = document.getElementById('wipTag');
    var titleEl = document.getElementById('wipTitle');
    var textEl = document.getElementById('wipText');
    var closeBtn = document.getElementById('wipClose');
    var lastFocused = null;
    var inertSiblings = Array.prototype.slice.call(document.body.children)
      .filter(function(el){ return el !== modal && el.tagName !== 'SCRIPT'; });
    function setPageInert(value){
      inertSiblings.forEach(function(el){ el.inert = value; });
    }
    function focusable(){
      return Array.prototype.slice.call(
        modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
      ).filter(function(el){ return el.offsetParent !== null; });
    }
    function openModal(name){
      var label = name || 'This section';
      tagEl.textContent = (name ? name + ' — ' : '') + 'planned';
      titleEl.textContent = label + ' is planned for a future release';
      textEl.textContent = label + " is planned for a future release. Detailed features, pricing, and availability have not been announced yet. Join the newsletter to hear when it's ready.";
      lastFocused = document.activeElement;
      modal.hidden = false;
      setPageInert(true);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(function(){
        modal.classList.add('open');
        if (closeBtn) closeBtn.focus();   // move keyboard focus into the modal
      });
    }
    function closeModal(){
      modal.classList.remove('open');
      document.body.style.overflow = '';
      setPageInert(false);
      setTimeout(function(){ modal.hidden = true; }, reduceMotion ? 0 : 260);
      if (lastFocused && lastFocused.focus) lastFocused.focus();  // return focus
    }
    document.addEventListener('click', function(e){
      var trigger = e.target.closest('[data-wip]');
      if (trigger){ e.preventDefault(); openModal(trigger.getAttribute('data-wip')); return; }
      if (e.target === modal || e.target.id === 'wipClose'){ closeModal(); }
    });
    document.addEventListener('keydown', function(e){
      if (modal.hidden) return;
      if (e.key === 'Escape'){ closeModal(); return; }
      if (e.key === 'Tab'){                 // trap Tab / Shift+Tab inside the modal
        var f = focusable();
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
      }
    });
  })();

  // ===== Interactive color-engine demo: pick a color, see its CMYK mix =====
  (function(){
    var demo = document.getElementById('engineDemo');
    if (!demo) return;
    var swatchEl = document.getElementById('evSwatch');
    var hexEl = document.getElementById('evHex');
    var bars = { c:document.getElementById('evBarC'), m:document.getElementById('evBarM'),
                 y:document.getElementById('evBarY'), k:document.getElementById('evBarK'),
                 w:document.getElementById('evBarW') };
    var vals = { c:document.getElementById('evValC'), m:document.getElementById('evValM'),
                 y:document.getElementById('evValY'), k:document.getElementById('evValK'),
                 w:document.getElementById('evValW') };
    // Normalized CMYK+W filament blend: split the colour into cyan, magenta,
    // yellow, black, and white fractions, then normalize so they always total
    // exactly 100% (largest-remainder rounding keeps the displayed sum at 100).
    function hexToBlend(hex){
      var r = parseInt(hex.slice(1,3),16)/255,
          g = parseInt(hex.slice(3,5),16)/255,
          b = parseInt(hex.slice(5,7),16)/255;
      var k = 1 - Math.max(r,g,b);          // shared darkness -> black
      var parts = {
        c: (1-r) - k,                        // channel density beyond black
        m: (1-g) - k,
        y: (1-b) - k,
        k: k,
        w: Math.min(r,g,b)                   // shared lightness -> white
      };
      var keys = ['c','m','y','k','w'];
      var total = keys.reduce(function(s,ch){ return s + parts[ch]; }, 0) || 1;
      var exact = keys.map(function(ch){ return parts[ch] / total * 100; });
      var floors = exact.map(Math.floor);
      var left = 100 - floors.reduce(function(s,v){ return s + v; }, 0);
      keys.map(function(ch,i){ return { i:i, rem: exact[i] - floors[i] }; })
        .sort(function(a,b){ return b.rem - a.rem; })
        .slice(0, left)
        .forEach(function(o){ floors[o.i]++; });
      var out = {};
      keys.forEach(function(ch,i){ out[ch] = floors[i]; });
      return out;
    }
    function select(btn){
      demo.querySelectorAll('.ev-sw.sel').forEach(function(s){ s.classList.remove('sel'); s.setAttribute('aria-pressed','false'); });
      btn.classList.add('sel');
      btn.setAttribute('aria-pressed','true');
      var hex = btn.getAttribute('data-hex');
      var mix = hexToBlend(hex);
      swatchEl.style.background = hex;
      swatchEl.style.boxShadow = '0 8px 22px -8px ' + hex + ', inset 0 1px 0 rgba(255,255,255,.35)';
      hexEl.textContent = hex.toUpperCase();
      ['c','m','y','k','w'].forEach(function(ch){
        bars[ch].style.width = mix[ch] + '%';
        vals[ch].textContent = mix[ch] + '%';
      });
    }
    demo.addEventListener('click', function(e){
      var b = e.target.closest('.ev-sw');
      if (b) select(b);
    });
    var start = demo.querySelector('.ev-sw[data-default]') || demo.querySelector('.ev-sw');
    if (start) select(start);
  })();

  // ===== "Latest from CMYKForge" — lazy YouTube embed (config: YT_CONFIG, top of file) =====
  (function(){
    var mount = document.getElementById('ytLatest');
    if (!mount) return;
    // Wire the channel buttons from the single config location
    document.querySelectorAll('[data-yt-channel]').forEach(function(a){
      var sub = a.hasAttribute('data-yt-subscribe');
      a.setAttribute('href', YT_CONFIG.channelUrl + (sub ? '?sub_confirmation=1' : ''));
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    });
    // Build the embed src: uploads playlist auto-plays the newest video first
    var src = (YT_CONFIG.mode === 'video')
      ? 'https://www.youtube-nocookie.com/embed/' + YT_CONFIG.videoId
      : 'https://www.youtube-nocookie.com/embed/videoseries?list=' + YT_CONFIG.uploadsPlaylist;
    function inject(){
      if (mount.dataset.loaded) return;
      mount.dataset.loaded = '1';
      var f = document.createElement('iframe');
      f.src = src;
      f.title = 'Latest video from the CMYKForge YouTube channel';
      f.loading = 'lazy';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      f.allowFullscreen = true;
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      mount.appendChild(f);
    }
    // Inject only when the section approaches the viewport (true lazy-load)
    if ('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if (en.isIntersecting){ inject(); io.disconnect(); }
        });
      }, { rootMargin: '400px 0px' });
      io.observe(mount);
    } else {
      inject(); // very old browsers: load immediately
    }
  })();

  // ===== Wire up social links from the SOCIAL_LINKS config at the top of this file =====
  (function(){
    function isReal(u){ return u && u.indexOf('URL_HERE') === -1 && /^https?:\/\//i.test(u); }
    var els = document.querySelectorAll('[data-social]');
    els.forEach(function(el){
      var url = SOCIAL_LINKS[el.getAttribute('data-social')];
      if (isReal(url)){
        el.setAttribute('href', url);
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
        el.classList.remove('is-pending');
        el.removeAttribute('aria-disabled');
      } else {
        el.setAttribute('href', '#');
        el.classList.add('is-pending');
        el.setAttribute('aria-disabled', 'true');
        el.setAttribute('title', 'Link coming soon');
      }
    });
    // Placeholder links shouldn't navigate anywhere until a real URL is set.
    document.addEventListener('click', function(e){
      var a = e.target.closest('[data-social]');
      if (a && a.classList.contains('is-pending')) e.preventDefault();
    });
  })();

  // ===== Product sub-nav (standard.html): stick after hero, scroll-spy =====
  (function(){
    var subnav = document.getElementById('subnav');
    if (!subnav) return;
    var hero = document.querySelector('.prod-hero') || document.querySelector('.hero');
    var stickQueued = false;
    function updateStick(){
      stickQueued = false;
      var past = hero ? window.scrollY > hero.offsetTop + hero.offsetHeight - 120 : window.scrollY > 480;
      subnav.classList.toggle('stuck', past);
      document.body.classList.toggle('subnav-active', past);
    }
    window.addEventListener('scroll', function(){
      if (!stickQueued){ stickQueued = true; requestAnimationFrame(updateStick); }
    }, { passive:true });
    updateStick();
    // Scroll-spy: highlight the link of the section currently in view
    var links = Array.prototype.slice.call(subnav.querySelectorAll('a[href^="#"]'));
    var targets = links
      .map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); })
      .filter(Boolean);
    if ('IntersectionObserver' in window && targets.length){
      var spy = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if (!en.isIntersecting) return;
          links.forEach(function(a){
            a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id);
          });
        });
      }, { rootMargin: '-30% 0px -55% 0px' });
      targets.forEach(function(t){ spy.observe(t); });
    }
  })();

  // ===== Big-stat band: count numerals up on first reveal (motion-safe) =====
  (function(){
    var stats = Array.prototype.slice.call(document.querySelectorAll('.stat-n[data-count]'));
    if (!stats.length) return;
    var rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function finalText(el){ return el.getAttribute('data-count') + (el.getAttribute('data-suffix') || ''); }
    if (rm || !('IntersectionObserver' in window)){
      stats.forEach(function(el){ el.textContent = finalText(el); });
      return;
    }
    function count(el){
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var t0 = null, DUR = 900;
      function frame(ts){
        if (!t0) t0 = ts;
        var t = Math.min((ts - t0) / DUR, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (t < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (!en.isIntersecting) return;
        count(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0.5 });
    stats.forEach(function(el){ io.observe(el); });
  })();

  // ===== Feature rail (What's Included): paddle buttons + keyboard =====
  (function(){
    var rail = document.getElementById('includedRail');
    if (!rail) return;
    var prev = document.getElementById('railPrev');
    var next = document.getElementById('railNext');
    if (!prev || !next) return;
    var rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function step(){
      var card = rail.querySelector('.card');
      return card ? card.getBoundingClientRect().width + 20 : 340;
    }
    function updatePaddles(){
      prev.disabled = rail.scrollLeft <= 4;
      next.disabled = rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 4;
    }
    function go(dir){
      rail.scrollBy({ left: dir * step(), behavior: rm ? 'auto' : 'smooth' });
    }
    prev.addEventListener('click', function(){ go(-1); });
    next.addEventListener('click', function(){ go(1); });
    rail.addEventListener('scroll', updatePaddles, { passive:true });
    window.addEventListener('resize', updatePaddles);
    rail.addEventListener('keydown', function(e){
      if (e.key === 'ArrowRight'){ e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft'){ e.preventDefault(); go(-1); }
    });
    updatePaddles();
  })();
