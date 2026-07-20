// ============================================================
// INIT LUCIDE ICONS & YEAR
// ============================================================
lucide.createIcons();
document.getElementById('current-year').textContent = new Date().getFullYear();

// ============================================================
// THEME SWITCHING
// ============================================================
const themeToggleBtn = document.getElementById('theme-toggle');
const bodyElement = document.body;
const savedTheme = localStorage.getItem('theme') || 'light-theme';
bodyElement.className = savedTheme;

themeToggleBtn.addEventListener('click', () => {
  if (bodyElement.classList.contains('light-theme')) {
    bodyElement.classList.replace('light-theme', 'dark-theme');
    localStorage.setItem('theme', 'dark-theme');
  } else {
    bodyElement.classList.replace('dark-theme', 'light-theme');
    localStorage.setItem('theme', 'light-theme');
  }
  // Restart particles on theme change
  resizeParticleCanvas();
});

// ============================================================
// SCROLL PROGRESS BAR
// ============================================================
const scrollProgressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgressBar.style.width = pct + '%';
}, { passive: true });

// ============================================================
// CUSTOM CURSOR
// ============================================================
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

let ringX = 0, ringY = 0;
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

// Smooth lerp animation for cursor ring
function animateCursorRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateCursorRing);
}
animateCursorRing();

// Expand ring on interactive elements
const interactiveEls = document.querySelectorAll('a, button, .project-card, .skill-pill, .scrabble-tile');
interactiveEls.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.style.width  = '12px';
    cursorDot.style.height = '12px';
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.style.width  = '8px';
    cursorDot.style.height = '8px';
  });
});

// ============================================================
// NAVBAR — SCROLL + ACTIVE LINK
// ============================================================
const navbar   = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

function updateActiveNavLink() {
  let currentId = 'home';
  sections.forEach(section => {
    const top    = section.offsetTop - 150;
    const height = section.clientHeight;
    if (window.scrollY >= top && window.scrollY < top + height) {
      currentId = section.getAttribute('id') || currentId;
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentId}`) link.classList.add('active');
  });
}

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNavLink();
}, { passive: true });

// Mobile menu
const menuToggle  = document.querySelector('.menu-toggle');
const mobileMenu  = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

menuToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const isOpen = mobileMenu.classList.contains('open');
  menuToggle.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
  lucide.createIcons();
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuToggle.innerHTML = '<i data-lucide="menu"></i>';
    lucide.createIcons();
  });
});

// ============================================================
// PARTICLE SYSTEM — HERO BACKGROUND
// ============================================================
const canvas = document.getElementById('hero-particles');
const ctx    = canvas.getContext('2d');
let particles = [];

function resizeParticleCanvas() {
  const hero = document.getElementById('home');
  canvas.width  = hero.offsetWidth;
  canvas.height = hero.offsetHeight;
  initParticles();
}

function initParticles() {
  particles = [];
  const count = Math.floor((canvas.width * canvas.height) / 12000);
  const isDark = bodyElement.classList.contains('dark-theme');
  for (let i = 0; i < count; i++) {
    particles.push({
      x:      Math.random() * canvas.width,
      y:      Math.random() * canvas.height,
      radius: Math.random() * 1.8 + 0.4,
      vx:     (Math.random() - 0.5) * 0.4,
      vy:     (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.15,
      color:  isDark ? 'rgba(163,230,53,' : 'rgba(101,163,13,',
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const isDark = bodyElement.classList.contains('dark-theme');

  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    // Draw particle
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = (isDark ? 'rgba(163,230,53,' : 'rgba(101,163,13,') + p.opacity + ')';
    ctx.fill();

    // Draw connecting lines between close particles
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        const alpha = (1 - dist / 120) * 0.18;
        ctx.strokeStyle = (isDark ? 'rgba(163,230,53,' : 'rgba(101,163,13,') + alpha + ')';
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(drawParticles);
}

resizeParticleCanvas();
drawParticles();
window.addEventListener('resize', resizeParticleCanvas);

// ============================================================
// TYPEWRITER EFFECT ON HERO SUBTITLE
// ============================================================
const typewriterEl = document.getElementById('typewriter-text');
const typewriterPhrases = [
  'AWS Cloud Engineer',
  'VPC Architect',
  'EC2 & RDS Specialist',
  'Linux Administrator',
  'Cloud Automation Builder'
];
let twPhraseIndex = 0;
let twCharIndex   = 0;
let twDeleting    = false;
let twPaused      = false;

function typewriterTick() {
  if (twPaused) return;

  const phrase = typewriterPhrases[twPhraseIndex];

  if (!twDeleting) {
    typewriterEl.textContent = phrase.slice(0, twCharIndex + 1);
    twCharIndex++;
    if (twCharIndex === phrase.length) {
      twPaused = true;
      setTimeout(() => { twDeleting = true; twPaused = false; }, 2200);
    }
  } else {
    typewriterEl.textContent = phrase.slice(0, twCharIndex - 1);
    twCharIndex--;
    if (twCharIndex === 0) {
      twDeleting = false;
      twPhraseIndex = (twPhraseIndex + 1) % typewriterPhrases.length;
    }
  }
  const speed = twDeleting ? 45 : 90;
  setTimeout(typewriterTick, speed);
}
typewriterTick();

// ============================================================
// INTERSECTION OBSERVER — SCROLL REVEAL
// ============================================================
const observerOpts = {
  root: null,
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px'
};

const mainObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el = entry.target;
    el.classList.add('animate-in');

    // Animate process timeline line
    if (el.id === 'process') {
      const line = document.getElementById('process-timeline-line');
      if (line) line.style.width = '100%';
    }

    obs.unobserve(el);
  });
}, observerOpts);

document.querySelectorAll(
  '.fade-in-slide, .fade-in-scale, .fade-in-left, .fade-in-right, #process'
).forEach(el => mainObserver.observe(el));

// Staggered skill pills observer
const pillObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const pills = entry.target.querySelectorAll('.stagger-pill');
    pills.forEach(pill => pill.classList.add('pill-visible'));
    obs.unobserve(entry.target);
  });
}, { threshold: 0.1 });

const skillsCloud = document.getElementById('skills-cloud');
if (skillsCloud) pillObserver.observe(skillsCloud);

// ============================================================
// ANIMATED COUNTER ON STATS
// ============================================================
const statNums = document.querySelectorAll('.stat-num');
let countersStarted = false;

function startCounters() {
  if (countersStarted) return;
  countersStarted = true;
  statNums.forEach(el => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1200;
    const step = target / (duration / 16);
    let current = 0;
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target;
        clearInterval(interval);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 16);
  });
}

// Trigger counters when hero section is in view
const heroSection = document.getElementById('home');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) startCounters();
  });
}, { threshold: 0.4 });
if (heroSection) counterObserver.observe(heroSection);

// ============================================================
// HERO CARD PARALLAX / TILT
// ============================================================
const heroCard = document.getElementById('hero-tilt-card');
if (heroCard) {
  const heroSec = document.getElementById('home');
  heroSec.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth  / 2 - e.pageX) / 45;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 45;
    heroCard.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    heroCard.style.transition = 'none';
  });
  heroSec.addEventListener('mouseleave', () => {
    heroCard.style.transform = 'rotateY(0deg) rotateX(0deg)';
    heroCard.style.transition = 'transform 0.5s ease';
  });
}

// ============================================================
// PROJECT CARD — 3D TILT ON HOVER
// ============================================================
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const rx   = (e.clientY - cy) / (rect.height / 2) * 6;
    const ry   = -(e.clientX - cx) / (rect.width  / 2) * 6;
    card.style.transform  = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
    card.style.transition = 'none';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
  });
});

// ============================================================
// MAGNETIC BUTTON EFFECT
// ============================================================
document.querySelectorAll('.magnetic-btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) * 0.35;
    const dy   = (e.clientY - cy) * 0.35;
    btn.style.transform  = `translate(${dx}px, ${dy}px)`;
    btn.style.transition = 'transform 0.1s ease';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform  = 'translate(0, 0)';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
  });
});

// ============================================================
// INTERACTIVE SKILLS CLOUD — CURSOR REPEL
// ============================================================
const skillsCloudEl = document.getElementById('skills-cloud');
if (skillsCloudEl) {
  skillsCloudEl.addEventListener('mousemove', (e) => {
    const pills = skillsCloudEl.querySelectorAll('.skill-pill');
    const rect  = skillsCloudEl.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    pills.forEach(pill => {
      const pr  = pill.getBoundingClientRect();
      const px  = (pr.left + pr.right)  / 2 - rect.left;
      const py  = (pr.top  + pr.bottom) / 2 - rect.top;
      const dx  = mx - px;
      const dy  = my - py;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        const force = (120 - dist) / 120;
        const pushX = (dx / dist) * -14 * force;
        const pushY = (dy / dist) * -14 * force;
        pill.style.transform = `translate(${pushX}px, ${pushY}px) scale(${1 + 0.07 * force})`;
      } else {
        pill.style.transform = '';
      }
    });
  });

  skillsCloudEl.addEventListener('mouseleave', () => {
    skillsCloudEl.querySelectorAll('.skill-pill').forEach(p => (p.style.transform = ''));
  });
}

// ============================================================
// PROJECT MODALS
// ============================================================
const projectData = {
  threetier: {
    title: 'AWS Three-Tier Architecture Deployment',
    image: 'assets/architecture-diagram.png',
    category: 'Secure Infrastructure Deployment',
    tags: ['VPC', 'EC2', 'RDS', 'Linux', 'MySQL', 'IAM'],
    bullets: [
      'Designed and deployed a highly secure three-tier architecture using Amazon VPC, EC2, RDS, IAM, and Linux.',
      'Configured custom VPC with public/private subnets, Internet Gateways, Route Tables, and NAT Gateway pathways.',
      'Enforced network isolation by restricting RDS ingress strictly to EC2 instances via AWS Security Groups.',
      'Administered Amazon Linux OS, deployed Apache Web Server, and established secure remote access via SSH.'
    ]
  },
  staticwebsite: {
    title: 'Static Website Hosting on AWS',
    image: 'assets/website-mockup.png',
    category: 'Cloud Storage & Access Configuration',
    tags: ['S3', 'IAM', 'Bucket Policy', 'Storage Security', 'Static Hosting'],
    bullets: [
      'Engineered and launched an automated static website using Amazon S3 Static Website Hosting.',
      'Enforced AWS security best practices by writing strict IAM policies and S3 Bucket Policies.',
      'Demonstrated deep mastery of cloud storage concepts, access policy inheritance, and custom domain mapping.'
    ]
  }
};

const modal               = document.getElementById('project-modal');
const modalDetailsContainer = document.getElementById('modal-project-details');

window.openProjectModal = function(projectId) {
  const data = projectData[projectId];
  if (!data) return;

  modalDetailsContainer.innerHTML = `
    <div class="modal-project-header">
      <span class="section-tag cursive">${data.category}</span>
      <h3 class="modal-project-title">${data.title}</h3>
      <div class="modal-project-meta">
        <div class="modal-meta-item"><i data-lucide="cloud"></i><span>AWS Platform</span></div>
        <div class="modal-meta-item"><i data-lucide="shield-check"></i><span>Secure Architecture</span></div>
      </div>
    </div>
    <img src="${data.image}" alt="${data.title}" class="modal-project-img">
    <div class="modal-project-section-title">
      <i data-lucide="check-square" style="color:var(--accent-color)"></i>
      <span>Key Accomplishments</span>
    </div>
    <ul class="modal-bullets">
      ${data.bullets.map(b => `<li>${b}</li>`).join('')}
    </ul>
    <div class="modal-project-section-title">
      <i data-lucide="cpu" style="color:var(--accent-color)"></i>
      <span>Core Technology Stack</span>
    </div>
    <div class="modal-project-tags-group">
      ${data.tags.map(t => `<span>${t}</span>`).join('')}
    </div>
  `;

  lucide.createIcons();
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeProjectModal = function() {
  modal.classList.remove('open');
  document.body.style.overflow = 'auto';
};

modal.addEventListener('click', (e) => { if (e.target === modal) closeProjectModal(); });
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeProjectModal(); });

// ============================================================
// CONTACT FORM — ANIMATED SUBMIT
// ============================================================
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn-submit');
    const orig = btn.innerHTML;

    btn.disabled = true;
    btn.style.opacity = '0.75';
    btn.innerHTML = `<span>Sending...</span><i data-lucide="loader"></i>`;
    lucide.createIcons();

    setTimeout(() => {
      btn.innerHTML = `<span>Message Sent!</span><i data-lucide="check-circle-2"></i>`;
      btn.style.backgroundColor = '#22c55e';
      btn.style.color = '#fff';
      btn.style.opacity = '1';
      lucide.createIcons();
      contactForm.reset();

      setTimeout(() => {
        btn.disabled = false;
        btn.style.backgroundColor = '';
        btn.style.color = '';
        btn.innerHTML = orig;
        lucide.createIcons();
      }, 3000);
    }, 1500);
  });
}

// ============================================================
// LIFECYCLE CARD — FLIP INTERACTION
// ============================================================
const lcCards = document.querySelectorAll('.lc-card');

lcCards.forEach(card => {
  // Click to flip
  card.addEventListener('click', () => {
    // Close any other open card
    lcCards.forEach(other => {
      if (other !== card) other.classList.remove('flipped');
    });
    card.classList.toggle('flipped');
  });

  // Keyboard accessibility: Enter / Space to flip
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
    // Escape to close
    if (e.key === 'Escape') {
      card.classList.remove('flipped');
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!card.contains(e.target)) {
      card.classList.remove('flipped');
    }
  });
});

// Re-init lucide icons for newly added lc-card icons
lucide.createIcons();
