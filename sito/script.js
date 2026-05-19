// ═══════════════════════════════════════════════════
//  WILDFIRE — script.js  Cinematic Research
// ═══════════════════════════════════════════════════

/* ── DOM ─────────────────────────────────────────── */
const navbar     = document.getElementById('navbar');
const burger     = document.getElementById('burger');
const navLinks   = document.getElementById('navLinks');
const progress   = document.getElementById('progressBar');
const heroImg    = document.getElementById('heroImg');
const tocLinks   = document.querySelectorAll('.toc-sidebar a');
const navAnchors = document.querySelectorAll('.nav-links a');
const sections   = document.querySelectorAll('section[id]');
const fsOverlay  = document.getElementById('fsOverlay');
const fsContent  = document.getElementById('fsContent');
const fsClose    = document.getElementById('fsClose');

/* ── Scroll ──────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 30);
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (y / total * 100) + '%';
  if (heroImg && y < window.innerHeight)
    heroImg.style.transform = `scale(1) translateY(${y * 0.2}px)`;
}, { passive: true });

/* ── Mobile menu ─────────────────────────────────── */
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open'))
    navLinks.classList.remove('open');
});

/* ── Hero image load ─────────────────────────────── */
if (heroImg) {
  if (heroImg.complete) heroImg.classList.add('loaded');
  else heroImg.addEventListener('load', () => heroImg.classList.add('loaded'));
}

/* ── Scroll Reveal ───────────────────────────────── */
const revealEls = document.querySelectorAll('[data-reveal], .factor-card, .vc');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const parent = entry.target.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children);
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = Math.min(idx * 60, 400) + 'ms';
      }
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });
revealEls.forEach(el => revealObs.observe(el));

/* ── Active nav / TOC ────────────────────────────── */
const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
    tocLinks.forEach(a => a.classList.toggle('toc-active', a.getAttribute('href') === `#${id}`));
  });
}, { threshold: 0.25, rootMargin: `-${navbar.offsetHeight + 15}px 0px 0px 0px` });
sections.forEach(s => sectionObs.observe(s));

/* ── Accordion timeline ──────────────────────────── */
document.querySelectorAll('[data-toggle]').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.closest('.tl-item');
    if (item) item.classList.toggle('open');
  });
});

/* ── Solution card toggle ────────────────────────── */
document.querySelectorAll('[data-toggle-sol]').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('open');
  });
});

/* ── Animated counters ───────────────────────────── */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  if (isNaN(target)) return;
  const isFloat = String(target).includes('.');
  const duration = 2000;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const v = target * (p === 1 ? 1 : 1 - Math.pow(2, -10 * p));
    el.textContent = isFloat ? v.toFixed(1) : Math.round(v).toLocaleString('it-IT');
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { animateCounter(entry.target); counterObs.unobserve(entry.target); }
  });
}, { threshold: 0.4 });
document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

/* ── Bar chart ───────────────────────────────────── */
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('animated'); barObs.unobserve(entry.target); }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.bar-fill').forEach(b => barObs.observe(b));

/* ── Before/After Slider ─────────────────────────── */
function initSlider(id) {
  const slider = document.getElementById(id);
  if (!slider) return;
  const afterWrap = slider.querySelector('.cs-after-wrap');
  const handle    = slider.querySelector('.cs-handle');
  let drag = false;

  function setPos(x) {
    const r = slider.getBoundingClientRect();
    let pct = (x - r.left) / r.width;
    pct = Math.max(0.03, Math.min(0.97, pct));
    afterWrap.style.left = (pct * 100) + '%';
    handle.style.left    = (pct * 100) + '%';
  }

  slider.addEventListener('mousedown', e => { drag = true; setPos(e.clientX); e.preventDefault(); });
  window.addEventListener('mousemove', e => { if (drag) setPos(e.clientX); });
  window.addEventListener('mouseup', () => { drag = false; });
  slider.addEventListener('touchstart', e => { drag = true; setPos(e.touches[0].clientX); }, { passive: true });
  slider.addEventListener('touchmove', e => { if (drag) { setPos(e.touches[0].clientX); e.preventDefault(); } }, { passive: false });
  slider.addEventListener('touchend', () => { drag = false; });

  slider.setAttribute('tabindex', '0');
  slider.setAttribute('role', 'slider');
  slider.addEventListener('keydown', e => {
    let cur = parseFloat(afterWrap.style.left) || 50;
    if (e.key === 'ArrowLeft')  cur = Math.max(3, cur - 3);
    if (e.key === 'ArrowRight') cur = Math.min(97, cur + 3);
    afterWrap.style.left = cur + '%';
    handle.style.left     = cur + '%';
  });
}

['cs1','cs2','cs3'].forEach(initSlider);

/* ── Fullscreen ──────────────────────────────────── */
function openFullscreen(wrap) {
  const clone = wrap.cloneNode(true);
  const slider = clone.querySelector('.compare-slider');
  if (slider) {
    slider.style.maxHeight = '85vh';
    // Re-init slider on clone
    const afterWrap = slider.querySelector('.cs-after-wrap');
    const handle    = slider.querySelector('.cs-handle');
    let drag = false;
    function setPos(x) {
      const r = slider.getBoundingClientRect();
      let pct = (x - r.left) / r.width;
      pct = Math.max(0.03, Math.min(0.97, pct));
      afterWrap.style.left = (pct * 100) + '%';
      handle.style.left    = (pct * 100) + '%';
    }
    slider.addEventListener('mousedown', e => { drag = true; setPos(e.clientX); e.preventDefault(); });
    window.addEventListener('mousemove', e => { if (drag) setPos(e.clientX); });
    window.addEventListener('mouseup', () => { drag = false; });
    slider.addEventListener('touchstart', e => { drag = true; setPos(e.touches[0].clientX); }, { passive: true });
    slider.addEventListener('touchmove', e => { if (drag) { setPos(e.touches[0].clientX); e.preventDefault(); } }, { passive: false });
    slider.addEventListener('touchend', () => { drag = false; });
  }
  const btn = clone.querySelector('.cs-expand');
  if (btn) btn.remove();
  fsContent.innerHTML = '';
  fsContent.appendChild(clone);
  fsOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeFullscreen() {
  fsOverlay.classList.remove('open');
  document.body.style.overflow = '';
  fsContent.innerHTML = '';
}

// Track drag vs click on sliders
let fsDragStart = null;

document.querySelectorAll('[data-fs]').forEach(wrap => {
  const slider = wrap.querySelector('.compare-slider');
  const expandBtn = wrap.querySelector('.cs-expand');

  if (expandBtn) {
    expandBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openFullscreen(wrap);
    });
  }

  // Track mousedown for click-vs-drag detection
  wrap.addEventListener('mousedown', (e) => {
    fsDragStart = { x: e.clientX, y: e.clientY };
  });
  wrap.addEventListener('mouseup', (e) => {
    if (!fsDragStart) return;
    const dx = Math.abs(e.clientX - fsDragStart.x);
    const dy = Math.abs(e.clientY - fsDragStart.y);
    fsDragStart = null;
    // If it was a click (not a drag) and not on the expand btn, open fullscreen
    if (dx + dy < 8 && !e.target.closest('.cs-expand')) {
      openFullscreen(wrap);
    }
  });
  wrap.addEventListener('touchstart', (e) => {
    fsDragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });
  wrap.addEventListener('touchend', (e) => {
    if (!fsDragStart) return;
    const dx = Math.abs(e.changedTouches[0].clientX - fsDragStart.x);
    const dy = Math.abs(e.changedTouches[0].clientY - fsDragStart.y);
    fsDragStart = null;
    if (dx + dy < 8 && !e.target.closest('.cs-expand')) {
      openFullscreen(wrap);
    }
  });
});

fsClose.addEventListener('click', closeFullscreen);
fsOverlay.addEventListener('click', (e) => {
  if (e.target === fsOverlay) closeFullscreen();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && fsOverlay.classList.contains('open')) closeFullscreen();
});
