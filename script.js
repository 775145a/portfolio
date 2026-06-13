/* ============================
   LOADER
   ============================ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  loader.classList.add('hidden');
});

/* ============================
   THEME TOGGLE
   ============================ */
const themeToggle = document.getElementById('themeToggle');
const icon = themeToggle.querySelector('i');

function getTheme() {
  return localStorage.getItem('theme') || 'light';
}
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}
setTheme(getTheme());

themeToggle.addEventListener('click', () => {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark');
});

/* ============================
   NAVBAR SCROLL
   ============================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ============================
   MOBILE MENU
   ============================ */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('show');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('show');
  });
});

/* ============================
   ACTIVE NAV LINK
   ============================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 150;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

/* ============================
   SCROLL TOP
   ============================ */
const scrollTop = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  scrollTop.classList.toggle('show', window.scrollY > 500);
});
scrollTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================
   STATS COUNTER (يبدأ من الرقم الموجود)
   ============================ */
function animateCounters() {
  const stats = document.querySelectorAll('.stat-num');
  stats.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-count'));
    const start = parseInt(stat.textContent) || 0;
    if (start >= target) return;
    const steps = 30;
    const increment = (target - start) / steps;
    let current = start;
    let i = 0;
    const update = () => {
      i++;
      current = start + increment * i;
      if (i >= steps) {
        stat.textContent = target + '+';
        return;
      }
      stat.textContent = Math.round(current) + '+';
      requestAnimationFrame(update);
    };
    update();
  });
}

/* ============================
   SKILLS ANIMATION
   ============================ */
function animateSkills() {
  const bars = document.querySelectorAll('.skill-bar');
  bars.forEach(bar => {
    const percent = bar.getAttribute('data-percent');
    const fill = bar.querySelector('.bar-fill');
    fill.style.width = percent + '%';
  });
}

/* ============================
   INTERSECTION OBSERVER (مرة واحدة فقط)
   ============================ */
const obsCallback = (entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains('skills-container')) animateSkills();
      if (entry.target.classList.contains('hero-stats')) animateCounters();
      obs.unobserve(entry.target);
    }
  });
};
const observer = new IntersectionObserver(obsCallback, { threshold: 0.3 });
const skillSection = document.querySelector('.skills-container');
if (skillSection) observer.observe(skillSection);
const heroStats = document.querySelector('.hero-stats');
if (heroStats) observer.observe(heroStats);

/* ============================
   SERVICE CARDS STAGGER
   ============================ */
const serviceCards = document.querySelectorAll('.service-card');
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
      entry.target.style.transitionDelay = delay + 'ms';
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.2 });

serviceCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(40px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  cardObserver.observe(card);
});

/* ============================
   CONTACT FORM — Email client
   ============================ */
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
  const btn = contactForm.querySelector('.btn');
  const original = btn.innerHTML;
  btn.innerHTML = 'جاري الفتح... <i class="fas fa-spinner fa-spin"></i>';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = original;
    btn.disabled = false;
  }, 4000);
});

/* ============================
   PARALLAX SHAPES
   ============================ */
document.addEventListener('mousemove', (e) => {
  const shapes = document.querySelectorAll('.hero-shapes .shape');
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  shapes.forEach((shape, i) => {
    const speed = (i + 1) * 15;
    shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
  });
});
