/* ==========================================================================
   IT Support Engineer Portfolio — JavaScript
   Sumit Kumar | sumitkumar7098
   ========================================================================== */

'use strict';

// ============================================================
// UTILITY
// ============================================================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

// ============================================================
// LOADING SCREEN
// ============================================================
function initLoadingScreen() {
  const screen = $('#loading-screen');
  if (!screen) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      screen.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1800);
  });

  // Prevent scroll while loading
  document.body.style.overflow = 'hidden';
}

// ============================================================
// CUSTOM CURSOR
// ============================================================
function initCursor() {
  const dot  = $('#cursor-dot');
  const ring = $('#cursor-ring');
  if (!dot || !ring) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let raf;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    raf = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover enlargement
  $$('a, button, .project-card, .cert-card, .service-card, .tool-card').forEach(el => {
    on(el, 'mouseenter', () => ring.classList.add('hovered'));
    on(el, 'mouseleave', () => ring.classList.remove('hovered'));
  });
}

// ============================================================
// SCROLL PROGRESS BAR
// ============================================================
function initScrollProgress() {
  const bar = $('#scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pct = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

// ============================================================
// NAVBAR — scroll effect + active links
// ============================================================
function initNavbar() {
  const navbar   = $('#navbar');
  const sections = $$('section[id]');
  const links    = $$('.nav-link');
  if (!navbar) return;

  function onScroll() {
    // Scrolled class
    if (window.scrollY > 48) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlight
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });

    links.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });

    // Back to top button
    const btn = $('#back-to-top');
    if (btn) {
      if (window.scrollY > 400) btn.classList.add('visible');
      else btn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ============================================================
// MOBILE MENU
// ============================================================
function initMobileMenu() {
  const toggle = $('#menu-toggle');
  const menu   = $('#mobile-menu');
  if (!toggle || !menu) return;

  function close() {
    toggle.classList.remove('open');
    menu.classList.remove('open');
  }

  on(toggle, 'click', () => {
    toggle.classList.toggle('open');
    menu.classList.toggle('open');
  });

  // Close on mobile link click
  $$('.mobile-link').forEach(a => on(a, 'click', close));

  // Close on outside click
  document.addEventListener('click', e => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) close();
  });
}

// ============================================================
// THEME TOGGLE
// ============================================================
function initTheme() {
  const btn  = $('#theme-toggle');
  const body = document.body;
  if (!btn) return;

  // Load saved theme
  const saved = localStorage.getItem('theme');
  if (saved === 'light') body.classList.add('light-theme');

  on(btn, 'click', () => {
    body.classList.toggle('light-theme');
    localStorage.setItem('theme', body.classList.contains('light-theme') ? 'light' : 'dark');
  });
}

// ============================================================
// TYPEWRITER — Hero role
// ============================================================
function initTypewriter() {
  const el = $('#typed-text');
  if (!el) return;

  const roles = [
    'Desktop Support Engineer',
    'IT Support Engineer',
    'IT Infrastructure Support'
  ];

  if (typeof Typed !== 'undefined') {
    new Typed(el, {
      strings: roles,
      typeSpeed: 60,
      backSpeed: 35,
      backDelay: 2200,
      startDelay: 600,
      loop: true,
      cursorChar: '|',
    });
  } else {
    // Fallback simple typewriter
    let roleIdx = 0, charIdx = 0, deleting = false;

    function type() {
      const role = roles[roleIdx];
      if (!deleting) {
        el.textContent = role.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === role.length) {
          deleting = true;
          setTimeout(type, 2200);
          return;
        }
      } else {
        el.textContent = role.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
        }
      }
      setTimeout(type, deleting ? 30 : 65);
    }
    setTimeout(type, 700);
  }
}

// ============================================================
// PARTICLE CANVAS — Hero background
// ============================================================
function initParticles() {
  const canvas = $('#particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: -1000, y: -1000 };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.r  = Math.random() * 2.5 + 0.8;
      this.alpha = Math.random() * 0.4 + 0.1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        this.x += (dx / dist) * 1.2;
        this.y += (dy / dist) * 1.2;
      }

      // Wrap edges
      if (this.x < -5) this.x = W + 5;
      if (this.x > W + 5) this.x = -5;
      if (this.y < -5) this.y = H + 5;
      if (this.y > H + 5) this.y = -5;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(96, 165, 250, ${this.alpha})`;
      ctx.fill();
    }
  }

  function connect() {
    const maxDist = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function init() {
    resize();
    const count = Math.min(Math.floor((W * H) / 8000), 120);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(animate);
  }

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });

  window.addEventListener('resize', () => {
    resize();
    init();
  }, { passive: true });

  init();
  animate();
}

// ============================================================
// ANIMATED COUNTERS — Intersection Observer
// ============================================================
function initCounters() {
  const nums = $$('.stat-num[data-target]');
  if (!nums.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.target;
      const dur    = 1600;
      const start  = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / dur, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(ease * target);
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(n => observer.observe(n));
}

// ============================================================
// ANIMATED SKILL BARS — Intersection Observer
// ============================================================
function initSkillBars() {
  const bars = $$('.skill-bar-fill[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      bar.style.width = bar.dataset.width + '%';
      observer.unobserve(bar);
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -40px 0px' });

  bars.forEach(b => observer.observe(b));
}

// ============================================================
// AOS — Animate On Scroll
// ============================================================
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
      delay: 0,
    });
  }
}

// ============================================================
// SMOOTH SCROLL — internal anchors
// ============================================================
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    on(a, 'click', e => {
      const id  = a.getAttribute('href').slice(1);
      const sec = document.getElementById(id);
      if (!sec) return;
      e.preventDefault();
      sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ============================================================
// BACK TO TOP
// ============================================================
function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;
  on(btn, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ============================================================
// CONTACT FORM
// ============================================================
function initContactForm() {
  const form   = $('#contact-form');
  const status = $('#form-status');
  if (!form || !status) return;

  on(form, 'submit', e => {
    e.preventDefault();

    const name    = $('#contact-name').value.trim();
    const email   = $('#contact-email-input').value.trim();
    const subject = $('#contact-subject').value.trim();
    const message = $('#contact-message').value.trim();

    if (!name || !email || !subject || !message) {
      status.textContent = '⚠️ Please fill in all fields.';
      status.className = 'form-status error';
      return;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = '⚠️ Please enter a valid email address.';
      status.className = 'form-status error';
      return;
    }

    // Open mailto
    const mailtoLink =
      `mailto:sumitkumar10102004@gmail.com` +
      `?subject=${encodeURIComponent(subject + ' — from ' + name)}` +
      `&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message)}`;

    window.location.href = mailtoLink;

    status.textContent = '✅ Opening your email client...';
    status.className = 'form-status success';

    setTimeout(() => {
      form.reset();
      status.textContent = '';
      status.className = 'form-status';
    }, 4000);
  });
}

// ============================================================
// FOOTER YEAR
// ============================================================
function initFooterYear() {
  const el = $('#current-year');
  if (el) el.textContent = new Date().getFullYear();
}

// ============================================================
// CARD TILT EFFECT (subtle 3D on project cards)
// ============================================================
function initCardTilt() {
  $$('.project-card, .cert-card').forEach(card => {
    on(card, 'mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width  / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -5;
      const rotY = ((x - cx) / cx) *  5;
      card.style.transform = `translateY(-8px) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    on(card, 'mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ============================================================
// LUCIDE ICONS — reinitialize after dynamic content
// ============================================================
function initIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// ============================================================
// HOVER GLOW on skill category cards
// ============================================================
function initSkillGlow() {
  $$('.skill-category-card').forEach(card => {
    on(card, 'mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });
}

// ============================================================
// STAGGER ANIMATION for tool cards
// ============================================================
function initToolCardStagger() {
  const tools = $$('.tool-card');
  tools.forEach((card, i) => {
    card.style.transitionDelay = (i * 30) + 'ms';
  });
}

// ============================================================
// SECTION ENTRANCE for timeline items (extra stagger)
// ============================================================
function initTimelineEntrance() {
  const items = $$('.timeline-item');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, idx * 120);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  items.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-24px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(item);
  });
}

// ============================================================
// NAVBAR active link offset fix for smooth scroll
// ============================================================
function initNavActiveOnClick() {
  $$('.nav-link, .mobile-link').forEach(link => {
    on(link, 'click', () => {
      $$('.nav-link').forEach(l => l.classList.remove('active'));
      const href = link.getAttribute('href');
      const target = $(`.nav-link[href="${href}"]`);
      if (target) target.classList.add('active');
    });
  });
}

// ============================================================
// INIT — DOMContentLoaded
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initCursor();
  initScrollProgress();
  initNavbar();
  initMobileMenu();
  initTheme();
  initTypewriter();
  initParticles();
  initCounters();
  initSkillBars();
  initAOS();
  initSmoothScroll();
  initBackToTop();
  initContactForm();
  initFooterYear();
  initCardTilt();
  initIcons();
  initSkillGlow();
  initToolCardStagger();
  initTimelineEntrance();
  initNavActiveOnClick();

  // Re-run lucide after all dynamic features init
  setTimeout(initIcons, 300);
});
