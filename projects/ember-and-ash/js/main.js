/* ========================================
   Ember & Ash — Main Script
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ----------------------------------------
     Nav scroll effect
     ---------------------------------------- */
  const nav = document.getElementById('nav');

  function handleNavScroll() {
    if (window.scrollY > 80) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ----------------------------------------
     Mobile nav toggle
     ---------------------------------------- */
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');

  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('nav__links--open');
  });

  document.querySelectorAll('.nav__links a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('nav__links--open');
    });
  });

  /* ----------------------------------------
     Smooth scroll for anchor links
     ---------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navH = nav.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    });
  });

  /* ----------------------------------------
     Hero parallax
     ---------------------------------------- */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    window.addEventListener('scroll', function () {
      const scrollY = window.scrollY;
      const heroHeight = document.querySelector('.hero').offsetHeight;
      if (scrollY <= heroHeight) {
        heroBg.style.transform = 'translateY(' + scrollY * 0.35 + 'px)';
      }
    }, { passive: true });
  }

  /* ----------------------------------------
     IntersectionObserver — scroll reveal
     ---------------------------------------- */
  const menuItems = document.querySelectorAll('.menu__item');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
          setTimeout(function () {
            entry.target.classList.add('revealed');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    menuItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    menuItems.forEach(function (item) {
      item.classList.add('revealed');
    });
  }

  /* ----------------------------------------
     Reservation form
     ---------------------------------------- */
  const form = document.getElementById('reservationForm');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalDetails = document.getElementById('modalDetails');
  const modalClose = document.getElementById('modalClose');

  function formatTime(val) {
    if (!val) return '';
    var parts = val.split(':');
    var h = parseInt(parts[0], 10);
    var m = parts[1];
    var suffix = h >= 12 ? 'PM' : 'AM';
    var display = h > 12 ? h - 12 : h;
    if (display === 0) display = 12;
    return display + ':' + m + ' ' + suffix;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('resName').value.trim();
    var date = document.getElementById('resDate').value;
    var time = document.getElementById('resTime').value;
    var party = document.getElementById('resParty').value;
    var email = document.getElementById('resEmail').value.trim();

    if (!name || !date || !time || !party || !email) return;

    var dateObj = new Date(date + 'T00:00:00');
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var formattedDate = dateObj.toLocaleDateString('en-US', options);

    modalDetails.innerHTML =
      '<span>' + name + '</span> — party of <span>' + party + '</span><br>' +
      '<span>' + formattedDate + '</span> at <span>' + formatTime(time) + '</span>';

    modalOverlay.classList.add('modal-overlay--open');
    form.reset();
  });

  function closeModal() {
    modalOverlay.classList.remove('modal-overlay--open');
  }

  modalClose.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

});
