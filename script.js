document.addEventListener('mousemove', e => {
  const g = document.getElementById('glow');
  if (g) {
    g.style.left = e.clientX + 'px';
    g.style.top = e.clientY + 'px';
  }
});

window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', scrollY > 20);
});

const obs = new IntersectionObserver(entries => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.classList.add('visible');
      el.target.querySelectorAll('.level-fill[data-w]').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
        bar.classList.add('animated');
      });
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

const words = ['Data Analytics', 'Machine Learning', 'Big Data', 'IA Prédictive', 'Classification', 'Clustering'];
let wi = 0, ci = 0, del = false;
const hl = document.querySelector('.highlight');
function type() {
  const w = words[wi];
  if (!del) {
    hl.textContent = w.slice(0, ++ci);
    if (ci === w.length) { del = true; setTimeout(type, 1800); return; }
  } else {
    hl.textContent = w.slice(0, --ci);
    if (ci === 0) { del = false; wi = (wi + 1) % words.length; }
  }
  setTimeout(type, del ? 55 : 85);
}
type();

document.getElementById('year').innerText = new Date().getFullYear();

const avatarPhoto = document.getElementById('avatar-photo');
if (avatarPhoto) {
  const handlePhoto = () => {
    const ok = avatarPhoto.complete && avatarPhoto.naturalWidth > 0;
    avatarPhoto.closest('.about-avatar').classList.toggle('fallback', !ok);
  };
  avatarPhoto.addEventListener('load', handlePhoto);
  avatarPhoto.addEventListener('error', handlePhoto);
  handlePhoto();
}

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

function toggleMenu(open) {
  hamburger.classList.toggle('nav-active', open);
  navLinks.classList.toggle('nav-active', open);
  hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
}

hamburger.addEventListener('click', () => toggleMenu(!navLinks.classList.contains('nav-active')));

hamburger.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleMenu(!navLinks.classList.contains('nav-active'));
  }
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navLinks.classList.contains('nav-active')) toggleMenu(false);
});