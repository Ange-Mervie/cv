(() => {
  document.documentElement.classList.add('js');

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ---------- Année dynamique ----------
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Navbar : ombre au scroll ----------
  const navbar = $('#navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // ---------- Menu hamburger ----------
  const hamburger = $('#hamburger');
  const navLinks = $('#nav-links');
  const toggleMenu = (open) => {
    navLinks.classList.toggle('open', open);
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  };
  hamburger.addEventListener('click', () => toggleMenu(!navLinks.classList.contains('open')));
  hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(!navLinks.classList.contains('open')); }
  });
  $$('#nav-links a').forEach((a) => a.addEventListener('click', () => toggleMenu(false)));

  // ---------- Reveal au scroll + barres de compétences ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('visible');
        el.querySelectorAll('.level-fill').forEach((bar) => {
          bar.style.width = (bar.dataset.w || '60') + '%';
        });
        io.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  $$('.reveal').forEach((el) => io.observe(el));

  // ---------- Mode sombre / clair ----------
  const themeBtn = $('#theme-btn');
  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    themeBtn.setAttribute('aria-pressed', String(theme === 'dark'));
    themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre');
    localStorage.setItem('theme', theme);
  };
  const savedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (systemDark ? 'dark' : 'light'));
  themeBtn.addEventListener('click', () => {
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  // ---------- Internationalisation FR / EN ----------
  const langBtn = $('#lang-btn');
  const langEls = $$('.lang');
  let lang = localStorage.getItem('lang') || 'fr';

  const applyLang = (l) => {
    lang = l;
    document.documentElement.lang = l;
    langBtn.textContent = l === 'fr' ? 'EN' : 'FR';
    langBtn.setAttribute('aria-label', l === 'fr' ? 'Passer en anglais / Switch to English' : 'Passer en français / Switch to French');
    langEls.forEach((el) => {
      const val = el.getAttribute(l === 'fr' ? 'data-fr' : 'data-en');
      if (val !== null) el.innerHTML = val;
    });
    localStorage.setItem('lang', l);
  };
  langBtn.addEventListener('click', () => applyLang(lang === 'fr' ? 'en' : 'fr'));
  applyLang(lang);

  // ---------- Formulaire de contact (Formspree) ----------
  const form = $('#contact-form');
  const formStatus = $('#form-status');

  const msg = (fr, en) => (lang === 'fr' ? fr : en);

  if (form) {
    const fieldErr = (input) => {
      if (!input.value.trim()) return msg('Ce champ est obligatoire.', 'This field is required.');
      if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        return msg('Adresse email invalide.', 'Invalid email address.');
      }
      return null;
    };

    const showStatus = (state, text) => {
      formStatus.className = 'form-status ' + state;
      formStatus.textContent = text;
      formStatus.style.display = 'block';
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const inputs = $$('#contact-form input, #contact-form textarea');
      let firstBad = null;
      inputs.forEach((input) => {
        const err = fieldErr(input);
        if (err) {
          input.setCustomValidity(err);
          input.reportValidity();
          if (!firstBad) firstBad = input;
        } else {
          input.setCustomValidity('');
        }
      });
      if (firstBad) { firstBad.focus(); return; }

      showStatus('pending', msg('Envoi en cours...', 'Sending...'));
      const btn = form.querySelector('.btn-submit');
      btn.disabled = true;

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.ok !== false) {
          showStatus('success', msg(
            '✅ Message bien envoyé ! Merci, je vous répondrai très rapidement.',
            '✅ Message sent! Thank you, I will reply very soon.'
          ));
          form.reset();
        } else {
          showStatus('error', msg(
            "❌ Une erreur est survenue. Réessayez, ou écrivez-moi directement à ndemerveille644@gmail.com",
            "❌ Something went wrong. Retry, or email me directly at ndemerveille644@gmail.com"
          ));
        }
      } catch (err) {
        showStatus('error', msg(
          "❌ Envoi impossible (pas de connexion ?). Réessayez, ou écrivez-moi à ndemerveille644@gmail.com",
          "❌ Cannot send (offline?). Retry, or email me at ndemerveille644@gmail.com"
        ));
      } finally {
        btn.disabled = false;
      }
    });

    if (form.action.includes('XXXXXXX')) {
      console.warn('⚠️ Portfolio : remplacez "XXXXXXX" par votre identifiant Formspree dans l\'attribut action du formulaire (index.html ET script.js si besoin).');
    }
  }

  // ---------- Avatar : repli si photo absente ----------
  const avatarPhoto = $('#avatar-photo');
  if (avatarPhoto) {
    const initials = $('#avatar-initials');
    avatarPhoto.addEventListener('error', function onImgError() {
      avatarPhoto.style.display = 'none';
      if (initials) initials.style.display = 'flex';
    });
  }
})();