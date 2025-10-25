// Basic interactive behaviour: mobile menu, lightbox, form validation, quick-fill room on card button
document.addEventListener('DOMContentLoaded', () => {
// year
document.getElementById('year').textContent = new Date().getFullYear();

// mobile menu
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('primary-nav');
menuToggle.addEventListener('click', () => {
const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
menuToggle.setAttribute('aria-expanded', String(!expanded));
nav.style.display = expanded ? '' : 'block';
});

// smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(a => {
a.addEventListener('click', (e) => {
const href = a.getAttribute('href');
if (!href || href === '#') return;
e.preventDefault();
const el = document.querySelector(href);
if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
});
});

// gallery lightbox
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCaption = document.getElementById('lb-caption');
const lbClose = document.getElementById('lb-close');

document.querySelectorAll('#gallery-grid img').forEach(img => {
img.addEventListener('click', () => {
lbImg.src = img.src.replace(/&w=\d+/, '&w=1600'); // try larger if available
lbImg.alt = img.alt || '';
lbCaption.textContent = img.alt || '';
lb.style.visibility = 'visible';
lb.style.opacity = '1';
lb.setAttribute('aria-hidden','false');
});
});

function closeLB() {
lb.style.opacity = '0';
lb.style.visibility = 'hidden';
lb.setAttribute('aria-hidden','true');
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

// Quick-fill room when clicking "Book" on a card
document.querySelectorAll('.card .btn').forEach(btn => {
btn.addEventListener('click', (e) => {
const room = btn.dataset.room;
const roomSel = document.getElementById('room');
if (room && roomSel) {
roomSel.value = room;
}
// allow scroll to contact (handled by smooth scroll)
});
});

// Form handling (client-side only)
const form = document.getElementById('booking-form');
const feedback = document.getElementById('form-feedback');
const clearBtn = document.getElementById('clear-btn');

clearBtn.addEventListener('click', () => {
form.reset();
feedback.textContent = '';
});

form.addEventListener('submit', (e) => {
e.preventDefault();
feedback.textContent = '';

// simple validation
const name = form.name.value.trim();
const email = form.email.value.trim();
const checkin = form.checkin.value;
const checkout = form.checkout.value;

if (!name) return showFeedback('Please enter your full name.', true);
if (!validateEmail(email)) return showFeedback('Please enter a valid email address.', true);
if (!checkin || !checkout) return showFeedback('Please choose check-in and check-out dates.', true);
if (new Date(checkout) <= new Date(checkin)) return showFeedback('Check-out must be after check-in.', true);

// Here: normally you'd POST to your booking backend or third-party service.
// For demo we show a success message.
showFeedback('Thanks! Your booking request has been sent. We will reply shortly.', false);
form.reset();
});

function showFeedback(message, isError) {
feedback.textContent = message;
feedback.style.color = isError ? '#b00020' : '';
}

function validateEmail(email) {
// simple regex
return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
});