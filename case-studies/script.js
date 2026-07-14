function initPreview(slug) {
  var container = document.getElementById('livePreview');
  var cover = document.getElementById('coverState');
  var frame = document.getElementById('frameState');
  var closeBtn = document.getElementById('frameClose');
  var openBtn = document.getElementById('frameOpen');
  var isOpen = false;

  if (!container || !cover || !frame) return;

  function openPreview() {
    if (isOpen) return;
    isOpen = true;

    var startH = container.offsetHeight;

    frame.style.display = 'block';
    var endH = container.offsetHeight;
    frame.style.display = '';

    container.style.overflow = 'hidden';

    gsap.set(container, { height: startH });

    frame.style.display = 'block';
    gsap.set(frame, { opacity: 0 });

    var tl = gsap.timeline({
      onComplete: function () {
        container.style.overflow = '';
        gsap.set(container, { height: '' });
        cover.style.display = 'none';
        gsap.set(frame, { opacity: 1 });
        frame.classList.add('is-open');
      }
    });

    tl.to(container, { height: endH, duration: 0.4, ease: 'power2.out' }, 0);
    tl.to(cover, { opacity: 0, duration: 0.35, ease: 'power2.out' }, 0);
    tl.to(frame, { opacity: 1, duration: 0.35, ease: 'power2.out' }, 0.05);
  }

  function closePreview() {
    if (!isOpen) return;
    isOpen = false;

    frame.classList.remove('is-open');

    var startH = container.offsetHeight;

    cover.style.display = 'block';
    var endH = container.offsetHeight;
    cover.style.display = '';

    container.style.overflow = 'hidden';

    gsap.set(container, { height: startH });

    cover.style.display = 'block';
    gsap.set(cover, { opacity: 0 });

    var tl = gsap.timeline({
      onComplete: function () {
        container.style.overflow = '';
        gsap.set(container, { height: '' });
        frame.style.display = 'none';
        gsap.set(cover, { opacity: 1 });
      }
    });

    tl.to(container, { height: endH, duration: 0.4, ease: 'power2.in' }, 0);
    tl.to(cover, { opacity: 1, duration: 0.35, ease: 'power2.in' }, 0);
    tl.to(frame, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0);
  }

  cover.addEventListener('click', function () {
    if (!isOpen) openPreview();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      closePreview();
    });
  }

  if (openBtn) {
    openBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var projectUrl = openBtn.getAttribute('data-url');
      if (projectUrl) window.open(projectUrl, '_blank');
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) closePreview();
  });
}
