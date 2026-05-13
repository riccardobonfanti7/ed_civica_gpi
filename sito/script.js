// ═══════════════════════════════════════════════════
//  WILDFIRE — script.js  Redesign cinematografico
// ═══════════════════════════════════════════════════

/* ── Navbar scroll behavior ───────────────────────── */
const navbar  = document.getElementById('navbar');
const burger  = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

/* ── Progress bar ─────────────────────────────────── */
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (window.scrollY / total * 100) + '%';
}, { passive: true });

/* ── Hero image zoom ──────────────────────────────── */
window.addEventListener('load', () => {
  document.querySelector('.hero-img')?.classList.add('loaded');
});

/* ── Scroll Reveal (IntersectionObserver) ─────────── */
const revealEls = document.querySelectorAll('[data-reveal], .tv-item, .sol-card');

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children in grids
      const siblings = Array.from(entry.target.parentElement.children);
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = (idx * 80) + 'ms';
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => revealObs.observe(el));

/* ── Animated counters ────────────────────────────── */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const isFloat = String(target).includes('.');
  const duration = 1800;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out-expo
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const val = target * ease;
    el.textContent = isFloat
      ? val.toFixed(1)
      : Math.round(val).toLocaleString('it-IT');
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = isFloat
      ? target.toFixed(1)
      : target.toLocaleString('it-IT');
  }
  requestAnimationFrame(tick);
}

const counterEls = document.querySelectorAll('[data-target]');
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObs.observe(el));

/* ── Bar chart animation ──────────────────────────── */
const bars = document.querySelectorAll('.bar-fill');
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      barObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
bars.forEach(b => barObs.observe(b));

/* ── Before/After Image Comparison Sliders ────────── */
function initSlider(sliderId) {
  const slider   = document.getElementById(sliderId);
  if (!slider) return;
  const afterWrap = slider.querySelector('.cs-after-wrap');
  const handle    = slider.querySelector('.cs-handle');
  let dragging = false;

  function setPosition(x) {
    const rect = slider.getBoundingClientRect();
    let pct = (x - rect.left) / rect.width;
    pct = Math.max(0.03, Math.min(0.97, pct));
    afterWrap.style.left = (pct * 100) + '%';
    handle.style.left     = (pct * 100) + '%';
  }

  // Mouse events
  slider.addEventListener('mousedown', e => {
    dragging = true;
    setPosition(e.clientX);
    e.preventDefault();
  });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    setPosition(e.clientX);
  });
  window.addEventListener('mouseup', () => { dragging = false; });

  // Touch events
  slider.addEventListener('touchstart', e => {
    dragging = true;
    setPosition(e.touches[0].clientX);
  }, { passive: true });
  slider.addEventListener('touchmove', e => {
    if (!dragging) return;
    setPosition(e.touches[0].clientX);
    e.preventDefault();
  }, { passive: false });
  slider.addEventListener('touchend', () => { dragging = false; });

  // Hint animation on load
  setTimeout(() => {
    const rect = slider.getBoundingClientRect();
    if (rect.width === 0) return; // not visible yet
    // subtle sweep hint
    let pos = 0.5;
    const sweep = setInterval(() => {
      pos -= 0.008;
      if (pos < 0.3) { clearInterval(sweep); }
      afterWrap.style.left = (pos * 100) + '%';
      handle.style.left     = (pos * 100) + '%';
    }, 16);
  }, 800);
}

['cs1','cs2','cs3'].forEach(initSlider);

/* ── Active nav link on scroll ────────────────────── */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${id}`) a.classList.add('active');
      });
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => sectionObs.observe(s));

/* ── Parallax on hero ─────────────────────────────── */
const heroImg = document.querySelector('.hero-img');
if (heroImg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight * 1.5) {
      heroImg.style.transform = `scale(1) translateY(${y * 0.25}px)`;
    }
  }, { passive: true });
}

/* ── Keyboard accessibility for sliders ──────────── */
['cs1','cs2','cs3'].forEach(id => {
  const slider = document.getElementById(id);
  if (!slider) return;
  slider.setAttribute('tabindex', '0');
  slider.setAttribute('role', 'slider');
  slider.setAttribute('aria-label', 'Confronto immagini prima/dopo');
  slider.addEventListener('keydown', e => {
    const afterWrap = slider.querySelector('.cs-after-wrap');
    const handle    = slider.querySelector('.cs-handle');
    let cur = parseFloat(afterWrap.style.left) || 50;
    if (e.key === 'ArrowLeft') cur = Math.max(3, cur - 3);
    if (e.key === 'ArrowRight') cur = Math.min(97, cur + 3);
    afterWrap.style.left = cur + '%';
    handle.style.left     = cur + '%';
  });
});
