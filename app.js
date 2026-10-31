(() => {
  'use strict';

  const DEFAULTS = Object.freeze({
    version: 1,
    brand: 'hatch.',
    headline: "Make room for | what's next.",
    description: 'A fresh canvas for ambitious ideas. Beautifully flexible, unapologetically different, and ready to become your own.',
    accent: 'lime',
    mode: 'light'
  });
  const STORAGE_KEY = 'hatch-independent-site-config-v1';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const pick = (value, choices, fallback) => choices.includes(value) ? value : fallback;
  const safeText = (value, fallback, limit) => typeof value === 'string' && value.trim() ? value.trim().slice(0, limit) : fallback;
  let settings = { ...DEFAULTS };
  let activeOverlay = null;
  let previousFocus = null;
  let toastTimer;

  const projects = {
    signal: { title: 'Signal', category: 'DIGITAL EXPERIENCE / 01', description: 'An energetic landing page concept built around expressive typography, bold color, and an impossible-to-ignore visual rhythm. This sample demonstrates how a project detail view could work.', discipline: 'Web design', mark: 'S.', color: '#f4a68f', ink: '#452733' },
    flora: { title: 'Flora', category: 'VISUAL IDENTITY / 02', description: 'A playful botanical identity concept that balances soft tones and strong, simple shapes. The artwork is made entirely in CSS and works without image downloads.', discipline: 'Brand identity', mark: '✿', color: '#bdb4f1', ink: '#2e2456' },
    sunday: { title: 'Sunday Club', category: 'DIGITAL PLATFORM / 03', description: 'A laid-back digital community concept with a sunny attitude. Designed to feel approachable, optimistic, and memorable on any screen.', discipline: 'Digital platform', mark: '☼', color: '#d5e3ba', ink: '#2c513a' },
    tempo: { title: 'Tempo', category: 'EXPERIMENTAL CONCEPT / 04', description: 'A high-energy experiment in geometric composition, contrast, and movement. An example of a concept page with its own visual language.', discipline: 'Art direction', mark: 'T.', color: '#252322', ink: '#ff794c' },
    fieldnotes: { title: 'Fieldnotes', category: 'EDITORIAL WEBSITE / 05', description: 'An editorial layout inspired by discovering places, collecting experiences, and sharing stories. A flexible pattern for future articles or project posts.', discipline: 'Editorial design', mark: 'f.', color: '#a5c2a0', ink: '#1f4030' },
    prism: { title: 'Prism', category: 'BRAND SYSTEM / 06', description: 'A striking identity study using transparent overlapping forms, minimal lettering, and a distinctive color palette.', discipline: 'Visual identity', mark: 'P.', color: '#ebe9a3', ink: '#24251e' }
  };

  function normalize(source) {
    const s = source && typeof source === 'object' && !Array.isArray(source) ? source : {};
    return {
      version: 1,
      brand: safeText(s.brand, DEFAULTS.brand, 28),
      headline: safeText(s.headline, DEFAULTS.headline, 95),
      description: safeText(s.description, DEFAULTS.description, 280),
      accent: pick(s.accent, ['lime', 'coral', 'lavender'], DEFAULTS.accent),
      mode: pick(s.mode, ['light', 'dark'], DEFAULTS.mode)
    };
  }

  function readLocal() {
    try { const json = localStorage.getItem(STORAGE_KEY); return json ? JSON.parse(json) : null; }
    catch { return null; }
  }
  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); }
    catch { showToast('Your browser is not allowing local settings to be saved.'); }
  }

  function applySettings() {
    document.documentElement.dataset.accent = settings.accent;
    document.documentElement.dataset.theme = settings.mode;
    $$('[data-bind="brand"]').forEach(el => { el.textContent = settings.brand; });
    const heroTitle = $('#heroTitle');
    const pieces = settings.headline.split('|');
    heroTitle.replaceChildren();
    heroTitle.append(document.createTextNode((pieces.shift() || '').trim() + ' '));
    const em = document.createElement('em');
    em.textContent = (pieces.join('|') || ' ').trim();
    if (em.textContent) heroTitle.append(em);
    const description = $('.hero-lead');
    description.textContent = settings.description;
    document.title = `${settings.brand} — An independent website`;
    const themeButton = $('#themeToggle');
    themeButton.setAttribute('aria-label', settings.mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    themeButton.setAttribute('title', settings.mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    themeButton.innerHTML = settings.mode === 'light'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.2 15.8A8.8 8.8 0 0 1 8.2 3.8 8.9 8.9 0 1 0 20.2 15.8Z"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
    $('#brandInput').value = settings.brand;
    $('#headlineInput').value = settings.headline;
    $('#descriptionInput').value = settings.description;
    $$('[data-accent]').forEach(button => { const active = button.dataset.accent === settings.accent; button.classList.toggle('is-selected', active); button.setAttribute('aria-pressed', String(active)); });
    $$('[data-mode]').forEach(button => { const active = button.dataset.mode === settings.mode; button.classList.toggle('is-selected', active); button.setAttribute('aria-pressed', String(active)); });
  }

  function updateSetting(key, value) { settings[key] = value; applySettings(); persist(); }
  function showToast(message) {
    clearTimeout(toastTimer);
    const toast = $('#toast'); toast.textContent = message; toast.classList.add('visible');
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3200);
  }
  function focusablesWithin(element) {
    return [...element.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter(el => !el.hidden && getComputedStyle(el).visibility !== 'hidden');
  }
  function openOverlay(name) {
    if (activeOverlay) closeOverlay();
    previousFocus = document.activeElement;
    activeOverlay = name;
    const isDrawer = name === 'drawer';
    const backdrop = $(isDrawer ? '#drawerBackdrop' : '#modalBackdrop');
    const panel = $(isDrawer ? '#customizer' : '#projectModal');
    backdrop.hidden = false;
    document.body.classList.add('no-scroll');
    panel.setAttribute('aria-hidden', 'false');
    panel.classList.add('is-open');
    const focusTarget = $(isDrawer ? '#closeCustomizer' : '#closeModal');
    focusTarget.focus({ preventScroll: true });
  }
  function closeOverlay() {
    if (!activeOverlay) return;
    const isDrawer = activeOverlay === 'drawer';
    const backdrop = $(isDrawer ? '#drawerBackdrop' : '#modalBackdrop');
    const panel = $(isDrawer ? '#customizer' : '#projectModal');
    panel.setAttribute('aria-hidden', 'true');
    panel.classList.remove('is-open');
    backdrop.hidden = true;
    document.body.classList.remove('no-scroll');
    activeOverlay = null;
    if (previousFocus && document.contains(previousFocus)) previousFocus.focus({ preventScroll: true });
  }
  function showProject(id) {
    const project = projects[id]; if (!project) return;
    $('#modalTitle').textContent = project.title;
    $('#modalCategory').textContent = project.category;
    $('#modalDescription').textContent = project.description;
    $('#modalDiscipline').textContent = project.discipline;
    $('#modalImageMark').textContent = project.mark;
    $('#modalImage').style.backgroundColor = project.color;
    $('#modalImageMark').style.color = project.ink;
    openOverlay('modal');
  }

  function setFilter(category) {
    let visible = 0;
    $$('.project-card').forEach(card => { const matches = category === 'all' || card.dataset.category === category; card.hidden = !matches; if (matches) visible++; });
    $$('.filter-chip').forEach(button => { const active = button.dataset.filter === category; button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active)); });
    $('#resultsLabel').textContent = category === 'all' ? `Showing all ${visible} projects` : `Showing ${visible} ${category} projects`;
  }
  function closeMobileNav() {
    $('#mobileNav').hidden = true;
    $('#menuToggle').setAttribute('aria-expanded', 'false');
    $('#menuToggle').setAttribute('aria-label', 'Open navigation');
  }

  async function copyLink() {
    const text = window.location.href;
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
      else {
        const input = document.createElement('textarea'); input.value = text; input.style.position = 'fixed'; input.style.opacity = '0'; document.body.append(input); input.select();
        if (!document.execCommand('copy')) throw new Error('Unsupported clipboard');
        input.remove();
      }
      showToast(location.protocol === 'file:' ? 'Local file link copied. Publish the site to share it publicly.' : 'Page link copied to clipboard.');
    } catch { showToast('Could not copy automatically. Use the address bar to copy the link.'); }
  }
  function exportConfig() {
    const data = JSON.stringify(settings, null, 2) + '\n';
    const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = 'site-config.json'; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('Settings exported! Replace site-config.json in your website folder with this file.');
  }

  function bindEvents() {
    $$('[data-open-customizer]').forEach(el => el.addEventListener('click', () => { closeMobileNav(); openOverlay('drawer'); }));
    $('#closeCustomizer').addEventListener('click', closeOverlay);
    $('#closeModal').addEventListener('click', closeOverlay);
    $('#modalDone').addEventListener('click', closeOverlay);
    $('#drawerBackdrop').addEventListener('click', closeOverlay);
    $('#modalBackdrop').addEventListener('click', closeOverlay);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') { if (activeOverlay) closeOverlay(); else closeMobileNav(); }
      if (event.key !== 'Tab' || !activeOverlay) return;
      const panel = $(activeOverlay === 'drawer' ? '#customizer' : '#projectModal');
      const elements = focusablesWithin(panel);
      if (!elements.length) { event.preventDefault(); panel.focus(); return; }
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    $('#themeToggle').addEventListener('click', () => updateSetting('mode', settings.mode === 'light' ? 'dark' : 'light'));
    $('#brandInput').addEventListener('input', event => updateSetting('brand', event.target.value || DEFAULTS.brand));
    $('#headlineInput').addEventListener('input', event => updateSetting('headline', event.target.value || DEFAULTS.headline));
    $('#descriptionInput').addEventListener('input', event => updateSetting('description', event.target.value || DEFAULTS.description));
    $$('[data-accent]').forEach(el => el.addEventListener('click', () => updateSetting('accent', el.dataset.accent)));
    $$('[data-mode]').forEach(el => el.addEventListener('click', () => updateSetting('mode', el.dataset.mode)));
    $('#resetConfig').addEventListener('click', () => { settings = { ...DEFAULTS }; persist(); applySettings(); showToast('Original design restored.'); });
    $('#exportConfig').addEventListener('click', exportConfig);
    $$('.filter-chip').forEach(el => el.addEventListener('click', () => setFilter(el.dataset.filter)));
    $$('.project-card').forEach(el => el.addEventListener('click', () => showProject(el.dataset.project)));
    $('#shareSite').addEventListener('click', copyLink);
    $('#menuToggle').addEventListener('click', () => {
      const nav = $('#mobileNav'); nav.hidden = !nav.hidden;
      const open = !nav.hidden;
      $('#menuToggle').setAttribute('aria-expanded', String(open));
      $('#menuToggle').setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    $$('.mobile-nav a').forEach(el => el.addEventListener('click', closeMobileNav));
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          $$('.desktop-nav .nav-link').forEach(el => el.classList.toggle('active', el.getAttribute('href') === '#' + entry.target.id));
        });
      }, { rootMargin: '-20% 0px -65% 0px', threshold: 0 });
      ['home', 'work', 'studio', 'contact'].forEach(id => observer.observe(document.getElementById(id)));
    }
    $('#year').textContent = String(new Date().getFullYear());
  }

  async function boot() {
    let publishedConfig = null;
    try {
      // On GitHub Pages, this is the shared configuration file. In file:// previews,
      // fetch is usually unavailable, so built-in defaults and local edits still work.
      const response = await fetch('./site-config.json', { cache: 'no-store' });
      if (response.ok) publishedConfig = await response.json();
    } catch { /* Running as a local file is supported. */ }
    settings = normalize({ ...DEFAULTS, ...(publishedConfig || {}), ...(readLocal() || {}) });
    applySettings();
    bindEvents();
  }
  boot();
})();