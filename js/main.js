/* =====================================================
   I-Pro Solutions + AccellX — main.js
   =====================================================
   SITE_CONFIG — edit these to update contact details
   ===================================================== */
const SITE_CONFIG = {
  wa:         '919324090425',
  phone:      '+91 93240 90425',
  email:      'help@iprosolutions.co.in',
  address:    '102, Ahmed Manor, Mazgaon, Mumbai – 400010',
  formAudit:  'xgonqopg',   // Formspree: audit / lead modal
  formMain:   'xqeyjedg',   // Formspree: main contact form
};

/* ── WhatsApp links ──────────────────────────────────────── */
function initWA() {
  document.querySelectorAll('[data-wa]').forEach(el => {
    const msg = el.dataset.wa || 'Hello! I need help with IP services.';
    const url = `https://wa.me/${SITE_CONFIG.wa}?text=${encodeURIComponent(msg)}`;
    if (el.tagName === 'A') { el.href = url; el.target = '_blank'; el.rel = 'noopener noreferrer'; }
    else { el.addEventListener('click', () => window.open(url, '_blank', 'noopener')); }
  });
}

/* ── Promo bar ───────────────────────────────────────────── */
/*  TO EDIT PROMOTION: open the HTML file and find the div.promo-bar
    Just change the text inside it — no JS changes needed.          */
function initPromoBar() {
  const bar = document.getElementById('promo-bar');
  const x   = document.getElementById('promo-bar-x');
  if (!bar) return;
  // Show if not dismissed in this session
  if (!sessionStorage.getItem('promo_dismissed')) {
    bar.style.display = 'block';
  }
  if (x) x.addEventListener('click', () => {
    bar.style.display = 'none';
    sessionStorage.setItem('promo_dismissed','1');
  });
}

/* ── Nav ─────────────────────────────────────────────────── */
function initNav() {
  const nav  = document.getElementById('main-nav');
  const ham  = document.getElementById('nav-ham');
  const list = document.getElementById('nav-links');
  if (!nav) return;

  const lightPage = document.body.dataset.navLight === 'true';
  if (lightPage) nav.classList.add('light');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', scrollY > 50);
  }, { passive: true });

  if (ham && list) {
    ham.addEventListener('click', () => {
      list.classList.toggle('open');
      const spans = ham.querySelectorAll('span');
      if (list.classList.contains('open')) {
        spans[0].style.cssText = 'transform:rotate(45deg) translateY(7px)';
        spans[1].style.opacity = '0';
        spans[2].style.cssText = 'transform:rotate(-45deg) translateY(-7px)';
      } else {
        spans.forEach(s => s.style.cssText = '');
      }
    });
    list.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
      list.classList.remove('open');
      ham.querySelectorAll('span').forEach(s => s.style.cssText = '');
    }));
  }

  const cur = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(l => {
    const href = (l.getAttribute('href') || '').split('/').pop().split('#')[0];
    l.classList.toggle('active', href === cur && href !== '');
  });
}

/* ── Modal ───────────────────────────────────────────────── */
function initModal() {
  const ov = document.getElementById('lead-modal');
  const x  = document.getElementById('modal-x');
  if (!ov) return;
  document.querySelectorAll('[data-modal]').forEach(b => b.addEventListener('click', () => ov.classList.add('open')));
  if (x) x.addEventListener('click', () => ov.classList.remove('open'));
  ov.addEventListener('click', e => { if (e.target === ov) ov.classList.remove('open'); });
  // Exit intent (once per session)
  if (!sessionStorage.getItem('exit_modal_s')) {
    let triggered = false;
    document.addEventListener('mouseleave', e => {
      if (e.clientY < 0 && !triggered) {
        triggered = true;
        ov.classList.add('open');
        sessionStorage.setItem('exit_modal_s','1');
      }
    });
  }
}

/* ── FAQ ─────────────────────────────────────────────────── */
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!open) item.classList.add('open');
    });
  });
}

/* ── Scroll reveal ───────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('visible')); return; }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -28px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ── Animated counters ───────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '+';
      const dur    = 1800;
      const start  = performance.now();
      function step(now) {
        const p    = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const val  = Math.floor(ease * target);
        el.textContent = val >= 1000 ? val.toLocaleString('en-IN') + (p < 1 ? '' : suffix) : val + (p < 1 ? '' : suffix);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target >= 1000 ? target.toLocaleString('en-IN') + suffix : target + suffix;
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.3 });
  counters.forEach(el => obs.observe(el));
}

/* ── Forms (Formspree) ───────────────────────────────────── */
function initForms() {
  document.querySelectorAll('.ipro-form').forEach(form => {
    const isAudit = form.dataset.form === 'audit';
    const formId  = isAudit ? SITE_CONFIG.formAudit : SITE_CONFIG.formMain;
    form.action   = `https://formspree.io/f/${formId}`;

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn  = form.querySelector('[type=submit]');
      const ok   = form.querySelector('.form-ok');
      const orig = btn.textContent;
      btn.disabled = true; btn.textContent = 'Sending…';
      try {
        const res = await fetch(form.action, {
          method: 'POST', body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          if (ok) ok.style.display = 'block';
          form.reset();
          btn.textContent = 'Sent ✓';
          setTimeout(() => {
            btn.disabled = false; btn.textContent = orig;
            document.getElementById('lead-modal')?.classList.remove('open');
          }, 3500);
        } else throw new Error();
      } catch { btn.disabled = false; btn.textContent = 'Try again'; }
    });
  });
}

/* ── Hash-anchor scroll (AccellX sub-sections) ───────────── */
function initAnchorScroll() {
  const hash = location.hash;
  if (hash) {
    const el = document.querySelector(hash);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350);
  }
}

/* ── Boot ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initWA();
  initPromoBar();
  initNav();
  initModal();
  initFAQ();
  initReveal();
  initCounters();
  initForms();
  initAnchorScroll();
});

/*
 * ══════════════════════════════════════════════════════
 * FORMSPREE SETUP — what to put in integration settings:
 * ══════════════════════════════════════════════════════
 * Form xgonqopg (Audit/Modal): 
 *   - Email subject: "Free Trademark Audit Request — I-Pro Solutions"
 *   - Redirect: (leave blank for AJAX)
 *   - Spam filter: enabled
 *
 * Form xqeyjedg (Main Contact):
 *   - Email subject: "New Enquiry — I-Pro Solutions"
 *   - Redirect: (leave blank for AJAX)
 *
 * TO EDIT PROMO BAR:
 *   Open any HTML file, find <div class="promo-bar" id="promo-bar">
 *   Edit the text between the opening div and the closing span.
 *   The bar is hidden by default — set display:block in CSS or
 *   remove the sessionStorage check in initPromoBar() to always show.
 *   Current setting: shows once per browser session.
 *
 * TO ADD A NEW PAGE:
 *   1. Copy pages/about.html → pages/your-page.html
 *   2. Add <li><a href="your-page.html" class="nav-link">Label</a></li>
 *      in nav-links of EVERY page (use "../../" from root)
 *   3. Add footer link in every page under the right column
 * ══════════════════════════════════════════════════════
 */
