// scripts.js

document.addEventListener('DOMContentLoaded', () => {
  // -----------------------------
  // YEAR UPDATE (for footer)
  // -----------------------------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // -----------------------------
  // MOBILE MENU TOGGLE
  // -----------------------------
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('primary-nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      nav.style.display = expanded ? '' : 'block';
    });
  }

  // -----------------------------
  // SMOOTH SCROLL FOR INTERNAL LINKS
  // -----------------------------
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // -----------------------------
  // HEADER SCROLL EFFECT
  // -----------------------------
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.hero');

  const checkHeaderScroll = () => {
    if (!header || !hero) return;
    const scrollY = window.scrollY;
    const heroBottom = hero.offsetTop + hero.offsetHeight;
    if (scrollY > heroBottom - 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', checkHeaderScroll);
  window.addEventListener('resize', checkHeaderScroll);
  checkHeaderScroll(); // initial check

  // -----------------------------
  // GALLERY LIGHTBOX
  // -----------------------------
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  const lbClose = document.getElementById('lb-close');

  if (lb && lbImg && lbCaption && lbClose) {
    document.querySelectorAll('#gallery-grid img').forEach(img => {
      img.addEventListener('click', () => {
        lbImg.src = img.src.replace(/&w=\d+/, '&w=1600'); // try larger if available
        lbImg.alt = img.alt || '';
        lbCaption.textContent = img.alt || '';
        lb.style.visibility = 'visible';
        lb.style.opacity = '1';
        lb.setAttribute('aria-hidden', 'false');
      });
    });

    function closeLB() {
      lb.style.opacity = '0';
      lb.style.visibility = 'hidden';
      lb.setAttribute('aria-hidden', 'true');
      lbImg.src = '';
      lbCaption.textContent = '';
    }

    lbClose.addEventListener('click', closeLB);
    lb.addEventListener('click', (e) => {
      if (e.target === lb) closeLB();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lb.getAttribute('aria-hidden') === 'false') closeLB();
    });
  }

  // -----------------------------
  // IMAGE SLIDER FOR ROOM CARDS
  // -----------------------------
  document.querySelectorAll('.card-slider').forEach(slider => {
    const images = slider.querySelectorAll('img');
    let current = 0;
    images[current].classList.add('active');
    setInterval(() => {
      images[current].classList.remove('active');
      current = (current + 1) % images.length;
      images[current].classList.add('active');
    }, 5000);
  });

  // -----------------------------
  // QUICK-FILL ROOM WHEN BOOK BUTTON CLICKED
  // -----------------------------
  document.querySelectorAll('.card .btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const room = btn.dataset.room;
      const roomSel = document.querySelector('#booking-form select[name="room"]');
      if (room && roomSel) {
        roomSel.value = room;
      }
    });
  });

  // -----------------------------
  // BOOKING FORM HANDLING
  // -----------------------------
  const form = document.getElementById('booking-form');
  const feedback = document.getElementById('form-feedback');
  const clearBtn = document.getElementById('clear-btn');

  if (clearBtn && form) {
    clearBtn.addEventListener('click', () => {
      form.reset();
      if (feedback) feedback.textContent = '';
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!feedback) return;

      feedback.textContent = '';

      // Validation
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const checkin = form.checkin.value;
      const checkout = form.checkout.value;

      if (!name) return showFeedback('Please enter your full name.', true);
      if (!validateEmail(email)) return showFeedback('Please enter a valid email address.', true);
      if (!checkin || !checkout) return showFeedback('Please choose check-in and check-out dates.', true);
      if (new Date(checkout) <= new Date(checkin)) return showFeedback('Check-out must be after check-in.', true);

      // Demo: normally submit to backend
      showFeedback('Thanks! Your booking request has been sent. We will reply shortly.', false);
      form.reset();
    });
  }

  function showFeedback(message, isError) {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.style.color = isError ? '#b00020' : '#333';
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});
