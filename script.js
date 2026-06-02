/* ========================================
   BALAJI GLASS STORE - JavaScript
   ======================================== */

'use strict';

// ---- Utility ----
const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const on = (el, ev, fn) => el && el.addEventListener(ev, fn);

// ---- Page Loader ----
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = $('#page-loader');
    if (loader) loader.style.display = 'none';
  }, 1300);
});

// ---- Sticky Header ----
const header = $('#header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
  // Scroll to top
  const st = $('#scroll-top');
  st && st.classList.toggle('visible', window.scrollY > 400);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---- Hamburger / Mobile Nav ----
const hamburger = $('.hamburger');
const mobileNav = $('.mobile-nav');
on(hamburger, 'click', () => {
  hamburger.classList.toggle('active');
  mobileNav.classList.toggle('open');
  document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
});

$$('.mobile-nav a').forEach(a => {
  on(a, 'click', () => {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ---- Smooth Scroll ----
$$('a[href^="#"]').forEach(anchor => {
  on(anchor, 'click', e => {
    const target = $(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- Scroll Reveal ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

$$('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

// ---- Counter Animation ----
function animateCounter(el, target, suffix = '', duration = 1800) {
  const start = performance.now();
  const isDecimal = target.toString().includes('.');
  const update = (time) => {
    const elapsed = Math.min((time - start) / duration, 1);
    const ease = 1 - Math.pow(1 - elapsed, 3);
    const value = isDecimal ? (ease * target).toFixed(1) : Math.floor(ease * target);
    el.textContent = value + suffix;
    if (elapsed < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

$$('[data-target]').forEach(el => counterObserver.observe(el));

// ---- Gallery Filter ----
const filterBtns = $$('.filter-btn');
const galleryItems = $$('.gallery-item');

filterBtns.forEach(btn => {
  on(btn, 'click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      const show = filter === 'all' || item.dataset.category === filter;
      item.style.opacity = show ? '1' : '0.2';
      item.style.transform = show ? 'scale(1)' : 'scale(0.95)';
      item.style.pointerEvents = show ? 'all' : 'none';
      item.style.transition = 'all 0.3s ease';
    });
  });
});

// ---- Lightbox ----
const lightbox = $('#lightbox');
const lightboxImg = $('#lightbox-img');

$$('.gallery-item img, .project-card img').forEach(img => {
  on(img, 'click', () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

on($('.lightbox-close'), 'click', closeLightbox);
on(lightbox, 'click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ---- FAQ Accordion ----
$$('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  on(question, 'click', () => {
    const isOpen = item.classList.contains('open');
    $$('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ---- Quote Form ----
const quoteForm = $('#quote-form');
on(quoteForm, 'submit', e => {
  e.preventDefault();
  const btn = quoteForm.querySelector('button[type="submit"]');
  const original = btn.innerHTML;
  btn.innerHTML = '⏳ Sending...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '✅ Request Sent!';
    showToast('🎉 Quote request sent! We\'ll call you within 30 minutes.');
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      quoteForm.reset();
    }, 3000);
  }, 1500);
});

// ---- Popup Form ----
const popup = $('#quote-popup');
const popupForm = $('#popup-form');

function openPopup() {
  popup.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePopup() {
  popup.classList.remove('open');
  document.body.style.overflow = '';
}

on($('.popup-close'), 'click', closePopup);
on(popup, 'click', e => { if (e.target === popup) closePopup(); });
$$('[data-popup]').forEach(btn => on(btn, 'click', openPopup));

on(popupForm, 'submit', e => {
  e.preventDefault();
  closePopup();
  showToast('🎉 Great! We\'ll contact you within 30 minutes.');
  popupForm.reset();
});

// ---- Exit Intent ----
let exitShown = false;
document.addEventListener('mouseleave', e => {
  if (e.clientY < 0 && !exitShown && !sessionStorage.getItem('exitShown')) {
    exitShown = true;
    sessionStorage.setItem('exitShown', '1');
    setTimeout(openPopup, 400);
  }
});

// ---- Toast ----
function showToast(msg) {
  const toast = $('#toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ---- Scroll Top ----
on($('#scroll-top'), 'click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- WhatsApp Click Tracking ----
$$('[href*="wa.me"], [href*="whatsapp"]').forEach(el => {
  on(el, 'click', () => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'whatsapp_click', { event_category: 'lead', event_label: 'whatsapp' });
    }
  });
});

// ---- Testimonials Scroll ----
const track = $('.testimonials-track');
let isDragging = false, startX, scrollLeft;

if (track) {
  on(track, 'mousedown', e => {
    isDragging = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    track.style.cursor = 'grabbing';
  });

  on(track, 'mouseleave', () => { isDragging = false; track.style.cursor = 'grab'; });
  on(track, 'mouseup', () => { isDragging = false; track.style.cursor = 'grab'; });

  on(track, 'mousemove', e => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX) * 1.3;
  });

  track.style.cursor = 'grab';
}

// ---- Active nav link on scroll ----
const sections = $$('section[id]');
const navLinks = $$('nav a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = $(`nav a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));

// ---- Glass reflection effect on cards ----
$$('.service-card, .glass-card').forEach(card => {
  on(card, 'mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });
});