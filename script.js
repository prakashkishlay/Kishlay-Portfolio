(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Footer year
  $('#year').textContent = new Date().getFullYear();

  // Mobile menu (Escape closes it and returns focus to the button)
  const burger = $('.burger'), menu = $('#menu');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); burger.focus(); }
  });

  // Active section indicator in the nav
  const navLinks = $$('.menu a');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('active', a.hash === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => spy.observe(s));

  // Reveal on scroll (content stays visible if JavaScript fails)
  const reveal = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => reveal.observe(el));

  // Cursor light (desktop with a mouse only)
  if (matchMedia('(hover: hover)').matches && !reduce) {
    const glow = $('.glow');
    addEventListener('pointermove', e => {
      glow.style.setProperty('--x', e.clientX + 'px');
      glow.style.setProperty('--y', e.clientY + 'px');
    }, { passive: true });
  }

  // Terminal typewriter (full text is in the HTML, so it is readable without JS)
  const term = $('#type');
  if (term && !reduce) {
    const full = term.textContent;
    let i = 0;
    term.textContent = '';
    const tick = () => {
      term.textContent = full.slice(0, ++i);
      if (i < full.length) setTimeout(tick, 28);
    };
    tick();
  }

  // Project filters with an empty state
  const buttons = $$('.filters button'), cards = $$('.card'), empty = $('#empty');
  buttons.forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.f;
    buttons.forEach(b => {
      b.classList.toggle('on', b === btn);
      b.setAttribute('aria-pressed', b === btn);
    });
    let shown = 0;
    cards.forEach(c => {
      const match = f === 'all' || c.dataset.cat === f;
      c.hidden = !match;
      if (match) shown++;
    });
    empty.hidden = shown > 0;
  }));

  // Back to top
  const top = $('#top');
  addEventListener('scroll', () => top.classList.toggle('show', scrollY > 600), { passive: true });
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  // Placeholder links (any URL containing "YOUR-") are disabled until you replace them
  $$('a[href*="YOUR-"]').forEach(a => {
    a.classList.add('placeholder');
    a.title = 'Placeholder: replace this URL in index.html';
    a.addEventListener('click', e => e.preventDefault());
  });
})();
