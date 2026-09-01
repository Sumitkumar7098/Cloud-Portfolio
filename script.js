/* ==========================================================================
   AWS CLOUD ENGINEER PORTFOLIO — JAVASCRIPT
   Sumit Kumar | Cloud Infrastructure & 3-Tier Architecture Specialist
   ========================================================================== */

'use strict';

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

// Toast Notification
function showToast(message, duration = 3000) {
  let toast = $('#toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// Copy to Clipboard
function copyText(text, successMsg = 'Copied to clipboard!') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => showToast(successMsg));
  } else {
    // Fallback
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(successMsg);
    } catch (err) {
      showToast('⚠️ Failed to copy');
    }
    document.body.removeChild(textArea);
  }
}

// ============================================================
// 1. LOADING SCREEN
// ============================================================
function initLoadingScreen() {
  const screen = $('#loading-screen');
  if (!screen) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      screen.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1200);
  });

  // Prevent scroll during loading
  document.body.style.overflow = 'hidden';
}

// ============================================================
// 2. CUSTOM CURSOR
// ============================================================
function initCursor() {
  const dot = $('#cursor-dot');
  const ring = $('#cursor-ring');
  if (!dot || !ring) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover enlargement on interactive elements
  $$('a, button, .project-card, .skill-category-card, .arch-tab, .contact-card, .term-quick-btn').forEach(el => {
    on(el, 'mouseenter', () => ring.classList.add('hovered'));
    on(el, 'mouseleave', () => ring.classList.remove('hovered'));
  });
}

// ============================================================
// 3. SCROLL PROGRESS BAR
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
// 4. NAVBAR SCROLL & ACTIVE LINK TRACKING
// ============================================================
function initNavbar() {
  const navbar = $('#navbar');
  const sections = $$('section[id]');
  const links = $$('.nav-link');
  const backToTop = $('#back-to-top');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if (window.scrollY >= top) current = sec.id;
    });

    links.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });

    // Back to top button visibility
    if (backToTop) {
      if (window.scrollY > 450) backToTop.classList.add('visible');
      else backToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ============================================================
// 5. MOBILE MENU
// ============================================================
function initMobileMenu() {
  const toggle = $('#menu-toggle');
  const menu = $('#mobile-menu');
  if (!toggle || !menu) return;

  function close() {
    toggle.classList.remove('open');
    menu.classList.remove('open');
  }

  on(toggle, 'click', () => {
    toggle.classList.toggle('open');
    menu.classList.toggle('open');
  });

  $$('.mobile-link').forEach(a => on(a, 'click', close));

  document.addEventListener('click', e => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) close();
  });
}

// ============================================================
// 6. THEME TOGGLE
// ============================================================
function initTheme() {
  const btn = $('#theme-toggle');
  const body = document.body;
  if (!btn) return;

  const saved = localStorage.getItem('sumit_aws_theme');
  if (saved === 'light') body.classList.add('light-theme');

  on(btn, 'click', () => {
    body.classList.toggle('light-theme');
    localStorage.setItem('sumit_aws_theme', body.classList.contains('light-theme') ? 'light' : 'dark');
  });
}

// ============================================================
// 7. TYPEWRITER (HERO ROLE)
// ============================================================
function initTypewriter() {
  const el = $('#typed-text');
  if (!el) return;

  const roles = [
    'AWS Cloud Engineer',
    'Cloud Infrastructure Specialist',
    '3-Tier Architecture Builder',
    'Linux & Cloud Automation Engineer',
    'AWS VPC & Security Enthusiast'
  ];

  if (typeof Typed !== 'undefined') {
    new Typed(el, {
      strings: roles,
      typeSpeed: 55,
      backSpeed: 30,
      backDelay: 2000,
      startDelay: 400,
      loop: true,
      cursorChar: '|'
    });
  } else {
    // Simple fallback
    let roleIdx = 0, charIdx = 0, isDeleting = false;
    function type() {
      const currentRole = roles[roleIdx];
      if (!isDeleting) {
        el.textContent = currentRole.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === currentRole.length) {
          isDeleting = true;
          setTimeout(type, 2000);
          return;
        }
      } else {
        el.textContent = currentRole.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
        }
      }
      setTimeout(type, isDeleting ? 30 : 60);
    }
    setTimeout(type, 500);
  }
}

// ============================================================
// 8. CLOUD PARTICLE NETWORK CANVAS (HERO BG)
// ============================================================
function initParticles() {
  const canvas = $('#particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: -1000, y: -1000 };

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class CloudNode {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.r = Math.random() * 2.2 + 0.8;
      this.alpha = Math.random() * 0.4 + 0.15;
      this.isAwsNode = Math.random() > 0.75;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        this.x += (dx / dist) * 1.5;
        this.y += (dy / dist) * 1.5;
      }

      if (this.x < -10) this.x = W + 10;
      if (this.x > W + 10) this.x = -10;
      if (this.y < -10) this.y = H + 10;
      if (this.y > H + 10) this.y = -10;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.isAwsNode
        ? `rgba(255, 153, 0, ${this.alpha})`
        : `rgba(56, 189, 248, ${this.alpha})`;
      ctx.fill();
    }
  }

  function connectNodes() {
    const maxDist = 135;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.16;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }
  }

  function init() {
    resize();
    const count = Math.min(Math.floor((W * H) / 9000), 90);
    particles = Array.from({ length: count }, () => new CloudNode());
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connectNodes();
    requestAnimationFrame(animate);
  }

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  window.addEventListener('resize', () => {
    resize();
    init();
  }, { passive: true });

  init();
  animate();
}

// ============================================================
// 9. ANIMATED COUNTERS
// ============================================================
function initCounters() {
  const nums = $$('.stat-num[data-target]');
  if (!nums.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      const dur = 1500;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / dur, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
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
// 10. ANIMATED SKILL BARS
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
  }, { threshold: 0.25 });

  bars.forEach(b => observer.observe(b));
}

// ============================================================
// 11. INTERACTIVE ARCHITECTURE TABS
// ============================================================
function initArchitectureTabs() {
  const tabs = $$('.arch-tab');
  const panes = $$('.arch-pane');
  if (!tabs.length || !panes.length) return;

  tabs.forEach(tab => {
    on(tab, 'click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetTier = tab.dataset.tier;
      const activePane = $(`#pane-${targetTier}`);
      if (activePane) activePane.classList.add('active');

      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  });
}

// ============================================================
// 12. INTERACTIVE CLOUD TERMINAL (CLI SIMULATOR)
// ============================================================
function initTerminal() {
  const termBody = $('#terminal-body');
  const termInput = $('#terminal-input');
  const outputHistory = $('#term-output-history');
  const clearBtn = $('#term-clear-btn');
  const quickBtns = $$('.term-quick-btn');
  const demoTriggers = $$('.terminal-demo-trigger');

  if (!termInput || !outputHistory) return;

  const cmdHistory = [];
  let historyIdx = -1;

  // Command Responses Database
  const commandResponses = {
    'help': `Available AWS Cloud Shell Commands:
  - whoami                   : Display engineer profile summary
  - cat skills.json          : Inspect technical skills & AWS services
  - aws s3 ls                : List configured S3 buckets & static sites
  - aws ec2 describe-instances: Describe deployed compute instances
  - cat architecture.json    : View 3-Tier Architecture deployment spec
  - cat vpc-config.json      : View VPC subnet & routing topology
  - cat education.txt        : View academic background & university info
  - cat alarms.json          : View CloudWatch metrics & SNS alarms
  - contact                  : Display email, phone, and LinkedIn
  - clear                    : Clear the terminal screen`,

    'whoami': `SUMIT KUMAR
Role       : AWS Cloud Engineer
Speciality : Amazon VPC, EC2, RDS (MySQL), S3, IAM, Linux Admin, 3-Tier Architecture
Education  : B.Tech in CSE (2022-2026) | CGPA 7.6
Status     : Available for AWS Cloud Engineer roles`,

    'cat skills.json': `{
  "cloudPlatform": ["AWS", "IAM", "EC2", "S3", "RDS", "VPC", "CloudWatch", "SNS", "Lambda"],
  "networking": ["Public/Private Subnets", "Route Tables", "Internet Gateway", "Security Groups", "CIDR"],
  "operatingSystems": ["Linux (Amazon Linux)", "Ubuntu (Basic)", "Windows"],
  "database": ["MySQL", "Amazon RDS"],
  "versionControl": ["Git", "GitHub"],
  "softSkills": ["Collaboration", "Product Thinking", "Problem Solving", "Continuous Learning"]
}`,

    'aws s3 ls': `2026-09-01 10:15:20 s3://sumitkumar-static-portfolio-bucket/ (Public Read)
2026-09-01 10:20:14 s3://production-web-assets-us-east-1/ (Encrypted AES-256)
2026-09-01 10:45:00 s3://rds-database-mysql-backups/ (Private)`,

    'aws ec2 describe-instances': `[
  {
    "InstanceId": "i-0a89d71c89f412a9b",
    "InstanceType": "t2.micro",
    "State": "running",
    "PublicIp": "54.210.88.14",
    "PrivateIp": "10.0.1.45",
    "SubnetId": "subnet-public-1a (10.0.1.0/24)",
    "SecurityGroup": "sg-web-public (HTTP:80, HTTPS:443, SSH:22)",
    "OS": "Amazon Linux 2023",
    "Services": "Apache HTTPD, MySQL Client, UserData Bootstrap"
  }
]`,

    'cat architecture.json': `{
  "architecture": "AWS 3-Tier Web Application",
  "tier1_presentation": {
    "subnet": "10.0.1.0/24 (Public)",
    "gateway": "Internet Gateway (IGW)",
    "service": "Apache HTTP Server on EC2"
  },
  "tier2_compute": {
    "subnet": "10.0.1.0/24",
    "instance": "Amazon Linux 2023 EC2",
    "access": "SSH Key-Pair Authentication"
  },
  "tier3_database": {
    "subnet": "10.0.2.0/24 (Private)",
    "engine": "Amazon RDS MySQL 8.0",
    "security": "Port 3306 restricted ONLY to EC2 Security Group ID"
  }
}`,

    'cat vpc-config.json': `{
  "VPC_CIDR": "10.0.0.0/16",
  "PublicSubnet": "10.0.1.0/24 (AZ-1a)",
  "PrivateSubnet": "10.0.2.0/24 (AZ-1b)",
  "RouteTable_Public": "0.0.0.0/0 -> igw-0b89cf12",
  "RouteTable_Private": "10.0.0.0/16 -> Local"
}`,

    'cat education.txt': `Degree     : Bachelor of Technology (B.Tech)
Field      : Computer Science & Engineering
University : IK Gujral Punjab Technical University
Duration   : 2022 – 2026
CGPA       : 7.6 / 10`,

    'cat alarms.json': `{
  "CloudWatchAlarms": [
    { "AlarmName": "EC2-High-CPU-Utilization", "Threshold": "> 80%", "Action": "SNS:NotifyOpsTeam" },
    { "AlarmName": "RDS-Storage-Low", "Threshold": "< 15%", "Action": "SNS:NotifyOpsTeam" },
    { "AlarmName": "StatusCheckFailed", "Threshold": ">= 1", "Action": "SNS:TriggerAutoRecovery" }
  ]
}`,

    'contact': `📞 Phone    : +91 7091313798
✉️ Email    : sumitkumar10102004@gmail.com
🔗 LinkedIn : https://linkedin.com/in/sumit7098
🐙 GitHub   : https://github.com/Sumitkumar7098`,

    'pwd': '/home/ec2-user',
    'date': new Date().toUTCString(),
    'ls': 'alarms.json  architecture.json  education.txt  skills.json  vpc-config.json'
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    cmdHistory.push(cmd);
    historyIdx = cmdHistory.length;

    if (cmd === 'clear') {
      outputHistory.innerHTML = '';
      termInput.value = '';
      return;
    }

    const outputBlock = document.createElement('div');
    outputBlock.className = 'term-output-block';

    const echoLine = document.createElement('div');
    echoLine.className = 'term-command-echo';
    echoLine.innerHTML = `<span class="term-prompt"><span class="user-host">ec2-user@sumit-aws</span>:<span class="term-path">~</span>$ </span><strong>${escapeHtml(cmd)}</strong>`;
    outputBlock.appendChild(echoLine);

    const responseLine = document.createElement('div');
    responseLine.className = 'term-response';

    const lowerCmd = cmd.toLowerCase();
    if (commandResponses[lowerCmd]) {
      responseLine.textContent = commandResponses[lowerCmd];
      if (lowerCmd === 'whoami' || lowerCmd === 'contact') {
        responseLine.classList.add('highlight');
      }
    } else if (lowerCmd.startsWith('echo ')) {
      responseLine.textContent = cmd.slice(5);
    } else if (lowerCmd.startsWith('sudo')) {
      responseLine.textContent = '🔒 Permission granted: ec2-user is in the sudoers file (NOPASSWD: ALL)';
      responseLine.classList.add('success');
    } else {
      responseLine.textContent = `bash: ${cmd}: command not found. Type "help" to view available commands.`;
      responseLine.classList.add('error');
    }

    outputBlock.appendChild(responseLine);
    outputHistory.appendChild(outputBlock);

    termInput.value = '';
    termBody.scrollTop = termBody.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Keyboard navigation & Enter key
  termInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      executeCommand(termInput.value);
    } else if (e.key === 'ArrowUp') {
      if (cmdHistory.length && historyIdx > 0) {
        historyIdx--;
        termInput.value = cmdHistory[historyIdx];
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (cmdHistory.length && historyIdx < cmdHistory.length - 1) {
        historyIdx++;
        termInput.value = cmdHistory[historyIdx];
      } else {
        historyIdx = cmdHistory.length;
        termInput.value = '';
      }
      e.preventDefault();
    }
  });

  // Quick Command buttons inside terminal
  quickBtns.forEach(btn => {
    on(btn, 'click', () => {
      const cmdToRun = btn.dataset.run;
      executeCommand(cmdToRun);
    });
  });

  // External triggers to run terminal command & scroll to terminal
  demoTriggers.forEach(btn => {
    on(btn, 'click', () => {
      const cmdToRun = btn.dataset.cmd;
      const termSection = $('#terminal');
      if (termSection) {
        termSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          executeCommand(cmdToRun);
        }, 500);
      }
    });
  });

  // Clear button
  if (clearBtn) {
    on(clearBtn, 'click', () => {
      outputHistory.innerHTML = '';
      showToast('Terminal cleared');
    });
  }
}

// ============================================================
// 13. COPY TO CLIPBOARD BUTTONS
// ============================================================
function initCopyButtons() {
  $$('.copy-email-btn').forEach(btn => {
    on(btn, 'click', e => {
      e.preventDefault();
      e.stopPropagation();
      const email = btn.dataset.email || 'sumitkumar10102004@gmail.com';
      copyText(email, '✅ Email copied: ' + email);
    });
  });

  $$('.copy-phone-btn').forEach(btn => {
    on(btn, 'click', e => {
      e.preventDefault();
      e.stopPropagation();
      const phone = btn.dataset.phone || '+917091313798';
      copyText(phone, '✅ Phone copied: ' + phone);
    });
  });
}

// ============================================================
// 14. CONTACT FORM SUBMISSION
// ============================================================
function initContactForm() {
  const form = $('#contact-form');
  const status = $('#form-status');
  if (!form || !status) return;

  on(form, 'submit', e => {
    e.preventDefault();

    const name = $('#contact-name').value.trim();
    const email = $('#contact-email-input').value.trim();
    const subject = $('#contact-subject').value.trim();
    const message = $('#contact-message').value.trim();

    if (!name || !email || !subject || !message) {
      status.textContent = '⚠️ Please fill in all fields before sending.';
      status.className = 'form-status error';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = '⚠️ Please enter a valid email address.';
      status.className = 'form-status error';
      return;
    }

    const mailto = `mailto:sumitkumar10102004@gmail.com?subject=${encodeURIComponent(subject + ' — from ' + name)}&body=${encodeURIComponent('Sender Name: ' + name + '\nSender Email: ' + email + '\n\n' + message)}`;

    window.location.href = mailto;

    status.textContent = '🚀 Opening your email client to dispatch message...';
    status.className = 'form-status success';

    setTimeout(() => {
      form.reset();
      status.textContent = '';
      status.className = 'form-status';
    }, 5000);
  });
}

// ============================================================
// 15. BACK TO TOP & FOOTER YEAR
// ============================================================
function initBackToTop() {
  const btn = $('#back-to-top');
  if (btn) on(btn, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const yr = $('#current-year');
  if (yr) yr.textContent = new Date().getFullYear();
}

// ============================================================
// 16. SUBTLE 3D CARD TILT
// ============================================================
function initCardTilt() {
  $$('.project-card, .skill-category-card').forEach(card => {
    on(card, 'mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -4;
      const rotY = ((x - cx) / cx) * 4;
      card.style.transform = `translateY(-6px) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    on(card, 'mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ============================================================
// 17. INITIALIZE AOS
// ============================================================
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 650,
      easing: 'ease-out-cubic',
      once: true,
      offset: 70
    });
  }
}

// ============================================================
// 18. LUCIDE ICONS
// ============================================================
function initIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// ============================================================
// DOM READY BOOTSTRAP
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
  initArchitectureTabs();
  initTerminal();
  initCopyButtons();
  initContactForm();
  initBackToTop();
  initCardTilt();
  initAOS();
  initIcons();

  setTimeout(initIcons, 300);
});
