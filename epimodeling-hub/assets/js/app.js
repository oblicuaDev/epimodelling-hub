/* =========================================================
   EpiModelling Hub – INS · Lógica del micrositio
   Enrutamiento por hash: #/pagina[/ancla]
   ========================================================= */
(function () {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const icon = (id, cls = '') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const pages = $$('.page');
  const ROUTES = pages.map((p) => p.dataset.page);
  const SITE = 'EpiModelling Hub | Instituto Nacional de Salud';

  /* ---------- Modal y toast (compartidos con sharepoint.js) ---------- */
  const modal = $('#modal');
  let lastFocus = null;
  function openModal(html) {
    lastFocus = document.activeElement;
    $('#modalBody').innerHTML = html;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    $('.modal__close', modal).focus();
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    lastFocus && lastFocus.focus();
  }
  modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(); });

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.innerHTML = icon('check') + '<span>' + esc(msg) + '</span>';
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 3200);
  }
  window.HubUI = { openModal, closeModal, toast };

  /* ---------- Enrutador ---------- */
  function parseHash() {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    const page = ROUTES.includes(parts[0]) ? parts[0] : 'inicio';
    return { page, anchor: parts[1] || null };
  }

  let currentPage = null;
  function route() {
    const { page, anchor } = parseHash();
    const changed = page !== currentPage;

    if (changed) {
      pages.forEach((p) => {
        const on = p.dataset.page === page;
        p.hidden = !on;
        p.classList.toggle('is-entering', on);
      });
      $$('.mainnav__link').forEach((a) => {
        const on = a.dataset.route === page;
        a.classList.toggle('is-active', on);
        on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
      });
      const title = $(`.page[data-page="${page}"]`).dataset.title;
      document.title = page === 'inicio' ? SITE : `${title} | ${SITE}`;
      currentPage = page;
      closeMobileNav();
      setupScrollSpy();
      revealInit();
    }

    if (anchor) {
      const target = document.getElementById(anchor);
      if (target) {
        requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: changed ? 'auto' : 'smooth', block: 'start' });
          target.classList.remove('flash'); void target.offsetWidth; target.classList.add('flash');
        });
      }
    } else if (changed) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      $('#main').focus({ preventScroll: true });
    }
  }
  window.addEventListener('hashchange', route);

  /* ---------- Navegación móvil ---------- */
  const nav = $('#mainNav');
  const toggle = $('#menuToggle');
  function closeMobileNav() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    $('use', toggle).setAttribute('href', '#i-menu');
  }
  toggle.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    $('use', toggle).setAttribute('href', open ? '#i-x' : '#i-menu');
    if (open) window.scrollTo({ top: nav.offsetTop - 1, behavior: 'smooth' });
  });

  /* ---------- Scroll-spy del submenú lateral ---------- */
  let spyObserver;
  function setupScrollSpy() {
    spyObserver && spyObserver.disconnect();
    const page = $(`.page[data-page="${currentPage}"]`);
    const links = $$('[data-spy]', page);
    if (!links.length) return;
    const setActive = (id) => links.forEach((l) => l.classList.toggle('is-active', l.dataset.spy === id));
    setActive(links[0].dataset.spy);
    spyObserver = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: '-35% 0px -60% 0px' });
    links.forEach((l) => { const el = document.getElementById(l.dataset.spy); el && spyObserver.observe(el); });
  }

  /* ---------- Animación de aparición ---------- */
  let revealObserver;
  function revealInit() {
    revealObserver && revealObserver.disconnect();
    const page = $(`.page[data-page="${currentPage}"]`);
    const els = $$('.quick-card, .topic-card, .goal-card, .news-card', page);
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); revealObserver.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach((el, i) => {
      if (el.classList.contains('is-visible')) return;
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 4) * 60 + 'ms';
      revealObserver.observe(el);
    });
  }

  /* ---------- Ejes temáticos: pestañas ---------- */
  const axes = $('#axes');
  const tabs = $$('.axes__tab', axes);
  function selectAxis(tab, focus) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).classList.toggle('is-active', on);
    });
    if (focus) tab.focus();
    tab.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectAxis(t));
    t.addEventListener('keydown', (e) => {
      const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (keys[e.key]) { e.preventDefault(); selectAxis(tabs[(i + keys[e.key] + tabs.length) % tabs.length], true); }
      if (e.key === 'Home') { e.preventDefault(); selectAxis(tabs[0], true); }
      if (e.key === 'End') { e.preventDefault(); selectAxis(tabs[tabs.length - 1], true); }
    });
  });
  $$('[data-axes-view]').forEach((b) => b.addEventListener('click', () => {
    axes.dataset.view = b.dataset.axesView;
    $$('[data-axes-view]').forEach((x) => { const on = x === b; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', String(on)); });
    $$('.axis', axes).forEach((p) => p.setAttribute('role', b.dataset.axesView === 'all' ? 'region' : 'tabpanel'));
  }));

  /* ---------- Noticias ---------- */
  const { news } = window.HUB_DATA;
  const fmtDate = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  const newsCard = (n) => `
    <button class="news-card" data-news="${n.id}" aria-label="Abrir noticia: ${esc(n.title)} (${esc(n.category)})">
      <figure class="img-ph">${icon('image')}</figure>
      <div class="news-card__body">
        <div class="news-card__meta"><span class="news-card__tag">${esc(n.category)}</span>·${icon('calendar')}<time datetime="${n.date}">${fmtDate(n.date)}</time></div>
        <h3>${esc(n.title)}</h3>
        <p>${esc(n.summary)}</p>
        <span class="news-card__more">Leer más ${icon('arrow-right', 'ico--sm')}</span>
      </div>
    </button>`;

  $('#homeNews').innerHTML = news.slice(0, 3).map(newsCard).join('');

  function renderNews() {
    const list = news;
    $('#newsList').innerHTML = list.map(newsCard).join('');
    $('#newsEmpty').hidden = list.length > 0;
    if (currentPage === 'noticias') revealInit();
  }
  renderNews();

  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-news]'); if (!card) return;
    const n = news.find((x) => x.id === Number(card.dataset.news));
    openModal(`
      <span class="badge">${esc(n.category)}</span>
      <h2 id="modalTitle">${esc(n.title)}</h2>
      <p class="muted">${icon('calendar', 'ico--sm')} ${fmtDate(n.date)}</p>
      <figure class="img-ph" style="aspect-ratio:16/9;margin-top:1rem">${icon('image')}</figure>
      <div class="article-ph">
        <p class="muted" style="margin:0">${esc(n.summary)}</p>
        <div class="skeleton"></div><div class="skeleton"></div><div class="skeleton" style="width:80%"></div>
        <div class="skeleton"></div><div class="skeleton" style="width:60%"></div>
      </div>`);
  });

  /* ---------- Volver arriba / Escape global ---------- */
  const toTop = $('#toTop');
  window.addEventListener('scroll', () => { toTop.hidden = window.scrollY < 600; }, { passive: true });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  /* ---------- Inicio ---------- */
  window.SPLibrary.mountAll();
  route();
})();
