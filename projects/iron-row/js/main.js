(function () {
  'use strict';

  // PUNCH COUNTER
  const counterEl = document.getElementById('punchCounter');
  const targetCount = 18427;

  function animatePunchCounter() {
    let current = 0;
    const duration = 3000;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      current = Math.floor(progress * targetCount);
      counterEl.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        counterEl.textContent = targetCount.toLocaleString();
      }
    }

    requestAnimationFrame(step);
  }

  // SCHEDULE FILTER
  const filterBtns = document.querySelectorAll('.filter-btn');
  const scheduleCells = document.querySelectorAll('.schedule__cell');

  function filterSchedule(filter) {
    scheduleCells.forEach(function (cell) {
      if (!cell.dataset.day) return;

      if (filter === 'all') {
        cell.classList.remove('schedule__cell--hidden');
      } else if (filter === 'weekend') {
        if (cell.dataset.time === 'weekend') {
          cell.classList.remove('schedule__cell--hidden');
        } else {
          cell.classList.add('schedule__cell--hidden');
        }
      } else {
        if (cell.dataset.time === filter) {
          cell.classList.remove('schedule__cell--hidden');
        } else {
          cell.classList.add('schedule__cell--hidden');
        }
      }
    });
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      filterSchedule(btn.dataset.filter);
    });
  });

  // MEMBERSHIP CALCULATOR
  const planSelect = document.getElementById('planSelect');
  const addonCheckboxes = document.querySelectorAll('.calculator__input[data-addon]');
  const baseDisplay = document.getElementById('baseDisplay');
  const addonsDisplay = document.getElementById('addonsDisplay');
  const totalDisplay = document.getElementById('totalDisplay');

  function calculateTotal() {
    const baseVal = parseInt(planSelect.value, 10);
    let addonsVal = 0;
    addonCheckboxes.forEach(function (cb) {
      if (cb.checked) {
        addonsVal += parseInt(cb.dataset.addon, 10);
      }
    });
    const total = baseVal + addonsVal;

    animateNumber(baseDisplay, baseVal);
    animateNumber(addonsDisplay, addonsVal);
    animateNumber(totalDisplay, total, true);
  }

  function animateNumber(el, target, isTotal) {
    el.classList.remove('calculator__num--pop');
    void el.offsetWidth;
    el.textContent = '$' + target;

    if (isTotal) {
      el.classList.add('calculator__num--pop');
    }
  }

  planSelect.addEventListener('change', calculateTotal);
  addonCheckboxes.forEach(function (cb) {
    cb.addEventListener('change', calculateTotal);
  });

  // TESTIMONIALS AUTO-SCROLL
  const testimonialsStrip = document.getElementById('testimonialsStrip');
  const testimonialEls = document.querySelectorAll('.testimonial');
  let currentTestimonial = 0;
  let testimonialInterval;

  function scrollToTestimonial(index) {
    if (!testimonialEls.length) return;
    if (index >= testimonialEls.length) {
      index = 0;
    }
    currentTestimonial = index;
    const offset = -currentTestimonial * 100;
    testimonialsStrip.style.transition = 'transform 300ms ease-in-out';
    testimonialsStrip.style.transform = 'translateX(' + offset + '%)';
  }

  function startTestimonialAutoScroll() {
    testimonialInterval = setInterval(function () {
      scrollToTestimonial(currentTestimonial + 1);
    }, 3000);
  }

  function resetTestimonialInterval() {
    clearInterval(testimonialInterval);
    startTestimonialAutoScroll();
  }

  testimonialsStrip.addEventListener('pointerdown', function () {
    clearInterval(testimonialInterval);
  });

  testimonialsStrip.addEventListener('pointerup', function () {
    resetTestimonialInterval();
  });

  // NAV SCROLL
  const nav = document.getElementById('nav');

  function handleNavScroll() {
    if (window.scrollY > 100) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // SMOOTH SCROLL FOR INTERNAL LINKS
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  internalLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // INIT
  document.addEventListener('DOMContentLoaded', function () {
    animatePunchCounter();
    calculateTotal();
    scrollToTestimonial(0);
    startTestimonialAutoScroll();
    handleNavScroll();
  });

})();
