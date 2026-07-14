// ===== Nav scroll effect =====
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ===== Stats counter animation =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const speed = 60;

  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const increment = target / speed;

    function updateCount() {
      const current = parseInt(counter.innerText.replace(/[+,]/g, ''));
      if (current < target) {
        let next = Math.ceil(current + increment);
        if (next > target) next = target;
        counter.innerText = next.toLocaleString() + '+';
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = target.toLocaleString() + '+';
      }
    }

    updateCount();
  });
}

// Trigger stats counter when visible
const statsSection = document.querySelector('.stats-grid');
if (statsSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  observer.observe(statsSection);
}

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== Form submission alert =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your inquiry. A member of the Vertex team will contact you within 24 hours.');
    contactForm.reset();
  });
}

// ===== Set active nav link =====
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPath) {
    link.classList.add('active');
  }
});
