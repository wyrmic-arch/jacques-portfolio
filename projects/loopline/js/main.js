document.addEventListener('DOMContentLoaded', () => {

  /* ─── Smooth Scroll ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─── Mobile Nav Toggle ─── */
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* ─── Nav Background on Scroll ─── */
  const nav = document.querySelector('.nav');
  const hero = document.querySelector('.hero');
  const observer = new IntersectionObserver(
    ([entry]) => {
      nav.classList.toggle('scrolled', !entry.isIntersecting);
    },
    { rootMargin: '-64px 0px 0px 0px' }
  );
  if (hero) observer.observe(hero);

  /* ─── Dashboard Card Animation ─── */
  const backlogCol = document.querySelector('#kanban-backlog .kanban-cards');
  const progressCol = document.querySelector('#kanban-progress .kanban-cards');
  const doneCol = document.querySelector('#kanban-done .kanban-cards');
  const counts = document.querySelectorAll('.kanban-col-count');

  function updateCounts() {
    document.querySelectorAll('.kanban-col').forEach((col, i) => {
      const cards = col.querySelectorAll('.kanban-card');
      const countEl = col.querySelector('.kanban-col-count');
      if (countEl) countEl.textContent = cards.length;
    });
  }

  function moveCards() {
    if (!backlogCol || !progressCol || !doneCol) return;

    const backlogCards = backlogCol.querySelectorAll('.kanban-card');
    const progressCards = progressCol.querySelectorAll('.kanban-card');
    const doneCards = doneCol.querySelectorAll('.kanban-card');

    if (doneCards.length > 0) {
      const card = doneCards[0];
      doneCol.removeChild(card);
      backlogCol.appendChild(card);
      card.style.animation = 'none';
      requestAnimationFrame(() => {
        card.style.animation = 'cardSlideIn 0.4s ease';
      });
    } else if (progressCards.length > 0) {
      const card = progressCards[0];
      progressCol.removeChild(card);
      doneCol.appendChild(card);
      card.style.animation = 'none';
      requestAnimationFrame(() => {
        card.style.animation = 'cardSlideIn 0.4s ease';
      });
    } else if (backlogCards.length > 0) {
      const card = backlogCards[0];
      backlogCol.removeChild(card);
      progressCol.appendChild(card);
      card.style.animation = 'none';
      requestAnimationFrame(() => {
        card.style.animation = 'cardSlideIn 0.4s ease';
      });
    }
    updateCounts();
  }

  if (backlogCol && progressCol && doneCol) {
    setInterval(moveCards, 3000);
    updateCounts();
  }

  /* ─── Pricing Toggle ─── */
  const toggleSwitch = document.querySelector('.toggle-switch');
  const monthlyLabel = document.querySelector('.toggle-label-monthly');
  const annualLabel = document.querySelector('.toggle-label-annual');
  let isAnnual = false;

  const prices = {
    monthly: [
      { amount: '$0', period: '/mo', yearly: '$0' },
      { amount: '$29', period: '/mo', yearly: '$290' },
      { amount: '$99', period: '/mo', yearly: '$990' }
    ],
    annual: [
      { amount: '$0', period: '/yr', yearly: null },
      { amount: '$290', period: '/yr', yearly: '$348' },
      { amount: '$990', period: '/yr', yearly: '$1,188' }
    ]
  };

  function updatePricing(annual) {
    const cards = document.querySelectorAll('.pricing-card');
    const mode = annual ? 'annual' : 'monthly';
    const data = prices[mode];

    cards.forEach((card, i) => {
      const amountEl = card.querySelector('.amount');
      const periodEl = card.querySelector('.period');
      const strikeEl = card.querySelector('.strikethrough');
      const priceData = data[i] || data[data.length - 1];

      if (amountEl) {
        amountEl.style.opacity = '0';
        amountEl.style.transform = 'translateY(4px)';
        setTimeout(() => {
          amountEl.textContent = priceData.amount;
          amountEl.style.opacity = '1';
          amountEl.style.transform = 'translateY(0)';
        }, 150);
      }
      if (periodEl) {
        periodEl.style.opacity = '0';
        setTimeout(() => {
          periodEl.textContent = priceData.period;
          periodEl.style.opacity = '1';
        }, 150);
      }
      if (strikeEl) {
        if (priceData.yearly) {
          strikeEl.textContent = priceData.yearly;
          strikeEl.classList.add('show');
        } else {
          strikeEl.classList.remove('show');
        }
      }
    });

    const badges = document.querySelectorAll('.save-badge');
    badges.forEach(b => { b.style.display = annual ? 'inline-block' : 'none'; });

    monthlyLabel.classList.toggle('active', !annual);
    annualLabel.classList.toggle('active', annual);
  }

  if (toggleSwitch) {
    toggleSwitch.addEventListener('click', () => {
      isAnnual = !isAnnual;
      toggleSwitch.classList.toggle('active', isAnnual);
      updatePricing(isAnnual);
    });
  }

  /* ─── FAQ Accordion ─── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const inner = item.querySelector('.faq-answer-inner');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Option: close others (uncomment to make single open)
      // faqItems.forEach(i => {
      //   if (i !== item) {
      //     i.classList.remove('open');
      //     i.querySelector('.faq-answer').style.maxHeight = '0';
      //   }
      // });

      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        answer.style.maxHeight = inner.scrollHeight + 'px';
      }
    });
  });

  /* ─── CTA Form ─── */
  const ctaForm = document.querySelector('.cta-form');
  const ctaInput = ctaForm ? ctaForm.querySelector('input') : null;
  const ctaSuccess = document.querySelector('.cta-success');
  const ctaError = document.querySelector('.cta-error');

  if (ctaForm) {
    ctaForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = ctaInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      ctaError.classList.remove('show');

      if (!email) {
        ctaError.textContent = 'Please enter your email address.';
        ctaError.classList.add('show');
        return;
      }

      if (!emailRegex.test(email)) {
        ctaError.textContent = 'Please enter a valid email address.';
        ctaError.classList.add('show');
        return;
      }

      ctaForm.style.display = 'none';
      ctaSuccess.classList.add('show');
    });
  }

});
