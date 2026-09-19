document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initActiveLinkOnScroll();
  initTypingAnimation();
  initScrollReveal();
  initContactForm();
});

/* ---------------------------------------------------------------------- */
/* Sticky navbar shadow on scroll                                          */
/* ---------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const toggleShadow = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 8);
  };

  toggleShadow();
  window.addEventListener('scroll', toggleShadow, { passive: true });
}

/* ---------------------------------------------------------------------- */
/* Mobile hamburger menu                                                   */
/* ---------------------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('.nav-link, .navbar__resume--mobile').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------------------------------------------------------------- */
/* Highlight the active nav link based on scroll position                  */
/* ---------------------------------------------------------------------- */
function initActiveLinkOnScroll() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
    updateNavIndicator();
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        setActive(entry.target.getAttribute('id'));
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));

  // Position the indicator correctly on first load and whenever the
  // viewport resizes (link widths/positions shift at different breakpoints).
  updateNavIndicator();
  window.addEventListener('resize', debounce(updateNavIndicator, 150));
}

/* ---------------------------------------------------------------------- */
/* Slide the blue underline indicator beneath the currently active link    */
/* ---------------------------------------------------------------------- */
function updateNavIndicator() {
  const indicator = document.getElementById('navIndicator');
  const activeLink = document.querySelector('.nav-link.active');
  if (!indicator || !activeLink) return;

  const linkCenter = activeLink.offsetLeft + activeLink.offsetWidth / 2;
  const indicatorWidth = indicator.offsetWidth || 60;

  indicator.style.left = `${linkCenter - indicatorWidth / 2}px`;
  indicator.style.opacity = '1';
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* ---------------------------------------------------------------------- */
/* Continuous typing animation cycling through roles                       */
/* ---------------------------------------------------------------------- */
function initTypingAnimation() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const roles = window.__TYPING_ROLES__ && window.__TYPING_ROLES__.length
    ? window.__TYPING_ROLES__
    : ['Software Engineer', 'Software Developer', 'Python Developer'];

  const TYPE_SPEED = 90;
  const DELETE_SPEED = 45;
  const HOLD_DELAY = 1400;
  const SWITCH_DELAY = 400;

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      charIndex++;
      el.textContent = currentRole.slice(0, charIndex);

      if (charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(tick, HOLD_DELAY);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      charIndex--;
      el.textContent = currentRole.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tick, SWITCH_DELAY);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  tick();
}

/* ---------------------------------------------------------------------- */
/* Fade-in sections as they enter the viewport                             */
/* ---------------------------------------------------------------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll('.fade-in');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------------------- */
/* Contact form — submit via fetch to the Flask /contact endpoint          */
/* ---------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const submitBtn = document.getElementById('formSubmit');
  if (!form || !status) return;

  const submitLabel = submitBtn.querySelector('span');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      showStatus('Please fill in every field.', 'error');
      return;
    }

    submitBtn.disabled = true;
    if (submitLabel) submitLabel.textContent = 'Sending...';

    try {
      const response = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showStatus(data.message || 'Message sent!', 'success');
        form.reset();
      } else {
        showStatus(data.error || 'Something went wrong. Please try again.', 'error');
      }
    } catch (err) {
      showStatus('Network error. Please try again later.', 'error');
    } finally {
      submitBtn.disabled = false;
      if (submitLabel) submitLabel.textContent = 'Send Message';
    }
  });

  function showStatus(msg, type) {
    status.textContent = msg;
    status.className = `form-status ${type}`;
  }
}
