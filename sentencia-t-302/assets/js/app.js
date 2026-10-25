/* =========================================================
   Sentencia T-302 – INS · render de contenidos, modal y navegación
   ========================================================= */
(function () {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const icon = (id, cls = '') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const D = window.T302;

  /* ---------- Modal y toast ---------- */
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
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.innerHTML = icon('check') + '<span>' + esc(msg) + '</span>';
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 3200);
  }
  window.T302ui = { toast, icon, esc };

  /* ---------- Videos ---------- */
  function videoFrame(v) {
    if (!v.url) {
      return `<button type="button" class="video-ph" data-video="${esc(v.id)}" aria-label="Reproducir: ${esc(v.title)} (${esc(v.lang)})">
        <span class="video-ph__play">${icon('play')}</span>
        <span class="video-ph__label">Video próximamente · ${esc(v.lang)}</span>
      </button>`;
    }
    if (/\.(mp4|webm|ogg)(\?|$)/i.test(v.url)) {
      return `<video src="${esc(v.url)}" controls preload="metadata" title="${esc(v.title)}"></video>`;
    }
    return `<iframe src="${esc(v.url)}" title="${esc(v.title)} (${esc(v.lang)})" allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe>`;
  }
  $('#videoGrid').innerHTML = D.videos.map((v) => `
    <article class="video-card">
      <div class="video-card__frame">${videoFrame(v)}</div>
      <div class="video-card__body">
        <span class="badge">${esc(v.num)} · ${esc(v.lang)}</span>
        <h4>${esc(v.title)}</h4>
        <p>${esc(v.desc)}</p>
      </div>
    </article>`).join('');
  $('#videoGrid').addEventListener('click', (e) => {
    if (e.target.closest('[data-video]')) toast('El video estará disponible próximamente.');
  });

  /* ---------- Material pedagógico ---------- */
  $('#matGrid').innerHTML = D.materiales.map((m, i) => {
    const dl = m.url
      ? `<a class="btn btn--primary btn--sm" href="${esc(m.url)}" download target="_blank" rel="noopener">${icon('download', 'ico--sm')} Descargar ${esc(m.type)}</a>`
      : `<button class="btn btn--outline btn--sm" type="button" data-soon="${i}">${icon('download', 'ico--sm')} Descargar ${esc(m.type)}</button>`;
    const play = m.game ? `<a class="btn btn--primary btn--sm" href="#juego">Jugar en línea ${icon('arrow-right', 'ico--sm')}</a>` : '';
    return `
    <article class="mat-card">
      <span class="icon-bubble">${icon(m.icon)}</span>
      <span class="mat-card__num">${esc(m.num)}</span>
      <h4>${esc(m.title)}</h4>
      <p>${esc(m.desc)}</p>
      <div class="mat-card__actions">${play}${dl}</div>
    </article>`;
  }).join('');
  $('#matGrid').addEventListener('click', (e) => {
    const b = e.target.closest('[data-soon]');
    if (b) toast(D.materiales[b.dataset.soon].title + ': documento próximamente.');
  });

  /* ---------- Indicadores ---------- */
  function phHtml(it, cls = '') {
    return `<figure class="img-ph ${cls}">${icon('image')}<figcaption><strong>Imagen</strong>${esc(it.title)}<em>Placeholder · 4:3</em></figcaption></figure>`;
  }
  $('#indGrid').innerHTML = D.indicadores.map((it, i) => `
    <button type="button" class="ind-card" data-ind="${i}" aria-label="Ampliar: ${esc(it.title)}">
      ${it.img ? `<img src="${esc(it.img)}" alt="${esc(it.title)}" loading="lazy" />` : phHtml(it)}
      <div class="ind-card__body"><h4>${esc(it.title)}</h4><p>${esc(it.desc)}</p></div>
    </button>`).join('');
  $('#indGrid').addEventListener('click', (e) => {
    const b = e.target.closest('[data-ind]');
    if (!b) return;
    const it = D.indicadores[b.dataset.ind];
    openModal(`<div class="lightbox">
      ${it.img ? `<img src="${esc(it.img)}" alt="${esc(it.title)}" />` : phHtml(it, 'lightbox-ph')}
      <h2>${esc(it.title)}</h2><p class="muted">${esc(it.desc)}</p></div>`);
  });

  /* ---------- Scroll: volver arriba + sección activa ---------- */
  const toTop = $('#toTop');
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  const links = $$('[data-spy]');
  const secs = links.map((l) => document.getElementById(l.dataset.spy));
  function onScroll() {
    toTop.hidden = window.scrollY < 500;
    const y = window.scrollY + 140;
    let cur = null;
    secs.forEach((s, i) => { if (s.offsetTop <= y) cur = links[i]; });
    links.forEach((l) => l.classList.toggle('is-active', l === cur));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
