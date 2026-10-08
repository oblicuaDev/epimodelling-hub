/* =========================================================
   Biblioteca de documentos con apariencia SharePoint (Modern UI)
   Uso: <div class="sp-library" data-library="clave"></div>
   Datos: window.HUB_DATA.libraries[clave]
   ========================================================= */
(function () {
  'use strict';

  const FILE_COLORS = {
    pdf:  { c: '#D13438', l: 'PDF' },
    docx: { c: '#185ABD', l: 'W' },
    xlsx: { c: '#107C41', l: 'X' },
    pptx: { c: '#C43E1C', l: 'P' },
    csv:  { c: '#107C41', l: 'CSV' },
    zip:  { c: '#7A7574', l: 'ZIP' }
  };
  const TYPE_NAMES = { folder: 'Carpeta', pdf: 'Documento PDF', docx: 'Documento de Word', xlsx: 'Libro de Excel', pptx: 'Presentación de PowerPoint', csv: 'Archivo CSV', zip: 'Archivo comprimido' };
  const STATUS = { pub: ['Publicado', 'sp-status--pub'], soon: ['Próximamente', 'sp-status--soon'], draft: ['En revisión', 'sp-status--draft'] };

  const esc = (s) => String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const icon = (id) => `<svg aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const fmtDate = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });

  function fileIcon(type) {
    if (type === 'folder') {
      return `<span class="sp-fileicon"><svg viewBox="0 0 24 28"><path d="M1 6.5A1.5 1.5 0 0 1 2.5 5h6.4l2 2.2h10.6A1.5 1.5 0 0 1 23 8.7V22a1.5 1.5 0 0 1-1.5 1.5h-19A1.5 1.5 0 0 1 1 22z" fill="#FFB900"/><path d="M1 10.2A1.5 1.5 0 0 1 2.5 8.7h19A1.5 1.5 0 0 1 23 10.2V22a1.5 1.5 0 0 1-1.5 1.5h-19A1.5 1.5 0 0 1 1 22z" fill="#FFD75E"/></svg></span>`;
    }
    const f = FILE_COLORS[type] || { c: '#605E5C', l: '?' };
    const fs = f.l.length > 1 ? 5 : 8;
    return `<span class="sp-fileicon"><svg viewBox="0 0 24 28"><path d="M6 1h11l6 6v19a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" fill="#fff" stroke="#C8C6C4"/><path d="M17 1v5a1 1 0 0 0 1 1h5" fill="#EDEBE9" stroke="#C8C6C4"/><path d="M9 13h10M9 16h10M9 19h7" stroke="${f.c}" stroke-opacity=".35" stroke-width="1.2"/><rect x="0.5" y="11" width="13" height="11" rx="1.5" fill="${f.c}"/><text x="7" y="18.6" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="${fs}" fill="#fff">${f.l}</text></svg></span>`;
  }

  function EmptyArt() {
    return `<div class="sp-empty__art"><svg viewBox="0 0 120 90"><rect x="18" y="22" width="84" height="58" rx="4" fill="#FFD75E"/><path d="M18 26a4 4 0 0 1 4-4h22l6 7h48a4 4 0 0 1 4 4v4H18z" fill="#FFB900"/><rect x="34" y="10" width="44" height="40" rx="3" fill="#fff" stroke="#C8C6C4"/><path d="M42 22h28M42 29h28M42 36h18" stroke="#C8C6C4" stroke-width="2"/><rect x="18" y="38" width="84" height="42" rx="4" fill="#FFD75E"/></svg></div>`;
  }

  class Library {
    constructor(el, key) {
      this.el = el;
      this.key = key;
      this.cfg = window.HUB_DATA.libraries[key];
      this.state = { path: [], sort: { key: 'name', dir: 1 }, view: 'list', filter: '', selected: new Set(), details: false };
      this.el.addEventListener('click', (e) => this.onClick(e));
      this.el.addEventListener('dblclick', (e) => this.onDblClick(e));
      this.el.addEventListener('input', (e) => { if (e.target.matches('[data-sp-filter]')) { this.state.filter = e.target.value; this.renderBody(); } });
      this.render();
    }

    get folder() { const p = this.state.path; return p.length ? p[p.length - 1].children : this.cfg.items; }

    get items() {
      const { filter, sort } = this.state;
      const q = filter.trim().toLowerCase();
      const list = this.folder.filter((i) => !q || i.name.toLowerCase().includes(q));
      return list.sort((a, b) => {
        if ((a.type === 'folder') !== (b.type === 'folder')) return a.type === 'folder' ? -1 : 1;
        const va = a[sort.key] || '', vb = b[sort.key] || '';
        return va.localeCompare(vb, 'es', { numeric: true }) * sort.dir;
      });
    }

    get selectedItems() { return this.items.filter((i) => this.state.selected.has(i)); }

    /* ---------- Render ---------- */
    render() {
      this.el.innerHTML = `
        <div class="sp-header"><nav class="sp-crumbs" aria-label="Ubicación en la biblioteca" data-sp-crumbs></nav></div>
        
        <div class="sp-body"><div class="sp-main" data-sp-main></div><aside class="sp-details" data-sp-details hidden aria-label="Panel de detalles"></aside></div>
        <div class="sp-footer" data-sp-footer></div>`;
      this.renderBody();
    }

    renderBody() {
      const sel = this.selectedItems;
      this.el.classList.toggle('has-selection', sel.length > 0);
      this.renderCrumbs();
      this.renderMain();
      this.renderDetails(sel);
      const items = this.items;
      const nFolders = items.filter((i) => i.type === 'folder').length;
      this.el.querySelector('[data-sp-footer]').innerHTML =
        `<span>${items.length} elemento${items.length === 1 ? '' : 's'} · ${nFolders} carpeta${nFolders === 1 ? '' : 's'}</span><span>EpiModelling Hub › ${esc(this.cfg.title)}</span>`;
    }

    renderCmdbar(sel) {
      const bar = this.el.querySelector('[data-sp-cmdbar]');
      const focusFilter = document.activeElement && document.activeElement.matches('[data-sp-filter]');
      const infoBtn = `<button class="sp-cmd ${this.state.details ? 'is-on' : ''}" data-sp-act="details" title="Abrir el panel de detalles" aria-pressed="${this.state.details}">${icon('info')}</button>`;
      if (sel.length) {
        const one = sel.length === 1;
        bar.innerHTML = `
          ${one ? `<button class="sp-cmd" data-sp-act="open">${icon('external')}<span class="sp-cmd__label">Abrir</span></button>` : ''}
          <button class="sp-cmd" data-sp-act="download">${icon('download')}<span class="sp-cmd__label">Descargar</span></button>
          ${one ? `<button class="sp-cmd" data-sp-act="link">${icon('link')}<span class="sp-cmd__label">Copiar vínculo</span></button>` : ''}
          <span class="sp-cmdbar__spacer"></span>
          <span class="sp-select-count"><button data-sp-act="clear" title="Borrar selección">${icon('x')}</button>${sel.length} seleccionado${one ? '' : 's'}</span>
          ${infoBtn}`;
      } else {
        const s = this.state.sort;
        bar.innerHTML = `
          <button class="sp-cmd" disabled title="Disponible solo para administradores del sitio">${icon('plus')}<span class="sp-cmd__label">Nuevo</span></button>
          <button class="sp-cmd" disabled title="Disponible solo para administradores del sitio">${icon('upload')}<span class="sp-cmd__label">Cargar</span></button>
          <button class="sp-cmd" data-sp-act="link-folder">${icon('link')}<span class="sp-cmd__label">Copiar vínculo</span></button>
          <span class="sp-cmdbar__spacer"></span>
          <button class="sp-cmd" data-sp-act="sort-menu" aria-haspopup="menu">${icon('sort')}<span class="sp-cmd__label">Ordenar</span></button>
          <button class="sp-cmd" data-sp-act="view-menu" aria-haspopup="menu">${icon(this.state.view === 'list' ? 'list' : 'grid')}<span class="sp-cmd__label">${this.state.view === 'list' ? 'Lista' : 'Mosaicos'}</span>${icon('chevron-down')}</button>
          <span class="sp-cmd-sep"></span>
          <div class="sp-filter">${icon('search')}<input type="search" data-sp-filter placeholder="Filtrar por nombre" aria-label="Filtrar documentos por nombre" value="${esc(this.state.filter)}"></div>
          ${infoBtn}`;
        if (focusFilter) { const inp = bar.querySelector('[data-sp-filter]'); inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
      }
    }

    renderCrumbs() {
      const nav = this.el.querySelector('[data-sp-crumbs]');
      const parts = [{ name: this.cfg.title, depth: 0 }, ...this.state.path.map((f, i) => ({ name: f.name, depth: i + 1 }))];
      nav.innerHTML = parts.map((p, i) => i === parts.length - 1
        ? `<span class="is-current" aria-current="location">${esc(p.name)}</span>`
        : `<button data-sp-crumb="${p.depth}">${esc(p.name)}</button>${icon('chevron-right')}`).join('');
    }

    renderMain() {
      const main = this.el.querySelector('[data-sp-main]');
      const items = this.items;
      if (!items.length) {
        main.innerHTML = `<div class="sp-empty">${EmptyArt()}<strong>${this.state.filter ? 'No hay resultados' : 'Esta carpeta está vacía'}</strong>${this.state.filter ? 'Pruebe con otro término de búsqueda.' : 'Los documentos se publicarán oportunamente.'}</div>`;
        return;
      }
      const { sort } = this.state;
      const arrow = (k) => sort.key === k ? icon(sort.dir === 1 ? 'arrow-up' : 'chevron-down') : '';
      const allSel = items.every((i) => this.state.selected.has(i));
      const checkBtn = (checked, label, attr) => `<button class="sp-check ${checked ? 'is-checked' : ''}" ${attr} role="checkbox" aria-checked="${checked}" aria-label="${esc(label)}">${icon('check')}</button>`;

      if (this.state.view === 'grid') {
        main.innerHTML = `<div class="sp-tiles">${items.map((it, idx) => {
          const s = this.state.selected.has(it);
          const meta = it.type === 'folder' ? `${it.children.length} elementos` : fmtDate(it.modified);
          return `<div class="sp-tile ${s ? 'is-selected' : ''}" data-sp-idx="${idx}" data-sp-open="${idx}" role="button" tabindex="0" aria-label="Abrir ${esc(it.name)}">
            ${checkBtn(s, 'Seleccionar ' + it.name, `data-sp-check="${idx}"`)}
            <div class="sp-tile__thumb">${fileIcon(it.type)}</div>
            <div class="sp-tile__name">${esc(it.name)}</div>
            <div class="sp-tile__meta">${meta}</div></div>`;
        }).join('')}</div>`;
        return;
      }

      main.innerHTML = `<table class="sp-table" role="grid">
        <thead><tr>
          <th class="sp-col-check">${checkBtn(allSel, 'Seleccionar todos', 'data-sp-checkall')}</th>
          <th class="sp-col-icon"><span class="sr-only">Tipo de archivo</span></th>
          <th><button data-sp-sort="name">Nombre ${arrow('name')}</button></th>
          <th><button data-sp-sort="modified">Modificado ${arrow('modified')}</button></th>
          <th class="sp-col-hide-sm"><button data-sp-sort="by">Modificado por ${arrow('by')}</button></th>
          <th class="sp-col-hide-sm">Tamaño</th>
          ${this.cfg.showStatus ? '<th class="sp-col-hide-sm">Estado</th>' : ''}
        </tr></thead>
        <tbody>${items.map((it, idx) => {
          const s = this.state.selected.has(it);
          const size = it.type === 'folder' ? `${it.children.length} elemento${it.children.length === 1 ? '' : 's'}` : esc(it.size || '—');
          const st = it.status && STATUS[it.status];
          return `<tr class="sp-row ${s ? 'is-selected' : ''}" data-sp-idx="${idx}" aria-selected="${s}">
            <td class="sp-col-check">${checkBtn(s, 'Seleccionar ' + it.name, `data-sp-check="${idx}"`)}</td>
            <td class="sp-col-icon">${fileIcon(it.type)}</td>
            <td class="sp-col-name"><span class="sp-name"><button data-sp-open="${idx}">${esc(it.name)}</button><button class="sp-name__more" data-sp-more="${idx}" aria-label="Más acciones para ${esc(it.name)}" aria-haspopup="menu">${icon('more')}</button></span></td>
            <td>${fmtDate(it.modified)}</td>
            <td class="sp-col-hide-sm">${esc(it.by)}</td>
            <td class="sp-col-hide-sm">${size}</td>
            ${this.cfg.showStatus ? `<td class="sp-col-hide-sm">${st ? `<span class="sp-status ${st[1]}">${st[0]}</span>` : ''}</td>` : ''}
          </tr>`;
        }).join('')}</tbody></table>`;
    }

    renderDetails(sel) {
      const pane = this.el.querySelector('[data-sp-details]');
      pane.hidden = !this.state.details;
      if (!this.state.details) return;
      const it = sel.length === 1 ? sel[0] : null;
      const folderName = this.state.path.length ? this.state.path[this.state.path.length - 1].name : this.cfg.title;
      const head = (title) => `<div class="sp-details__head"><h3>${esc(title)}</h3><button data-sp-act="details" aria-label="Cerrar panel de detalles">${icon('x')}</button></div>`;
      if (!it) {
        pane.innerHTML = head(sel.length > 1 ? `${sel.length} elementos seleccionados` : folderName) +
          `<div class="sp-details__preview">${fileIcon('folder')}</div><p class="sp-details__empty">${sel.length > 1 ? 'Seleccione un solo elemento para ver sus propiedades.' : 'Seleccione un archivo o carpeta para ver sus detalles.'}</p>`;
        return;
      }
      const st = it.status && STATUS[it.status];
      pane.innerHTML = head(it.name) + `
        <div class="sp-details__preview">${fileIcon(it.type)}</div>
        <h4>Propiedades</h4>
        <dl>
          <div><dt>Tipo</dt><dd>${TYPE_NAMES[it.type] || it.type}</dd></div>
          <div><dt>Modificado</dt><dd>${fmtDate(it.modified)}</dd></div>
          <div><dt>Modificado por</dt><dd>${esc(it.by)}</dd></div>
          <div><dt>${it.type === 'folder' ? 'Contenido' : 'Tamaño'}</dt><dd>${it.type === 'folder' ? it.children.length + ' elementos' : esc(it.size || '—')}</dd></div>
          ${st ? `<div><dt>Estado</dt><dd><span class="sp-status ${st[1]}">${st[0]}</span></dd></div>` : ''}
          <div><dt>Ruta</dt><dd>/${esc([this.cfg.title, ...this.state.path.map((p) => p.name)].join('/'))}</dd></div>
        </dl>`;
    }

    /* ---------- Acciones ---------- */
    itemAt(idx) { return this.items[Number(idx)]; }

    open(it) {
      if (!it) return;
      if (it.type === 'folder') {
        this.state.path.push(it);
        this.state.selected.clear();
        this.state.filter = '';
        this.renderBody();
        return;
      }
      window.HubUI.openModal(`
        <div class="sp-preview">
          <div class="sp-preview__bar">${fileIcon(it.type)}<strong id="modalTitle">${esc(it.name)}</strong></div>
          <div class="sp-preview__page"><div class="sp-preview__sheet">
            <div class="skeleton" style="width:60%;height:16px"></div>
            <div class="skeleton"></div><div class="skeleton"></div><div class="skeleton" style="width:85%"></div>
            <div class="skeleton" style="height:90px;margin-top:8px"></div>
            <div class="skeleton"></div><div class="skeleton" style="width:70%"></div>
          </div></div>
          <div style="display:flex;gap:.5rem;justify-content:flex-end;margin-top:1rem">
            <button class="btn btn--outline btn--sm" data-close>Cerrar</button>
            <button class="btn btn--primary btn--sm" onclick="HubUI.toast('Descarga no disponible')">${icon('download')} Descargar</button>
          </div>
        </div>`);
    }

    download(items) {
      const n = items.length;
      window.HubUI.toast(n === 1 ? 'Descarga no disponible por el momento' : 'Descarga no disponible por el momento');
    }

    copyLink(name) {
      const url = location.href.split('#')[0] + '#/' + (this.key === 'convocatoria' ? 'convocatoria' : 'documentos');
      const done = () => window.HubUI.toast(name ? `Vínculo a “${name}” copiado` : 'Vínculo a la biblioteca copiado');
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, done); else done();
    }

    toggleSelect(it, only) {
      const s = this.state.selected;
      if (only) { const was = s.has(it) && s.size === 1; s.clear(); if (!was) s.add(it); }
      else if (s.has(it)) s.delete(it); else s.add(it);
      this.renderBody();
    }

    showMenu(anchor, entries) {
      closeMenus();
      const menu = document.createElement('div');
      menu.className = 'sp-menu';
      menu.setAttribute('role', 'menu');
      menu.innerHTML = entries.map((e) => e === '-' ? '<hr>' : `<button role="menuitem" class="${e.checked ? 'is-checked' : ''}">${e.icon ? icon(e.icon) : ''}${esc(e.label)}</button>`).join('');
      const btns = menu.querySelectorAll('button');
      entries.filter((e) => e !== '-').forEach((e, i) => btns[i].addEventListener('click', () => { closeMenus(); e.run(); }));
      document.body.appendChild(menu);
      const r = anchor.getBoundingClientRect();
      const left = Math.min(r.left, window.innerWidth - menu.offsetWidth - 8);
      menu.style.left = Math.max(8, left) + 'px';
      menu.style.top = (r.bottom + 4) + 'px';
      btns[0] && btns[0].focus();
    }

    onDblClick(e) {
      const row = e.target.closest('tr.sp-row');
      if (row && !e.target.closest('button')) this.open(this.itemAt(row.dataset.spIdx));
    }

    onClick(e) {
      const t = e.target;
      let b;
      if ((b = t.closest('[data-sp-check]'))) { e.stopPropagation(); return this.toggleSelect(this.itemAt(b.dataset.spCheck), false); }
      if (t.closest('[data-sp-checkall]')) {
        const items = this.items; const all = items.every((i) => this.state.selected.has(i));
        this.state.selected.clear(); if (!all) items.forEach((i) => this.state.selected.add(i));
        return this.renderBody();
      }
      if ((b = t.closest('[data-sp-more]'))) {
        const it = this.itemAt(b.dataset.spMore);
        return this.showMenu(b, [
          { label: 'Abrir', icon: 'external', run: () => this.open(it) },
          ...(it.type !== 'folder' ? [{ label: 'Descargar', icon: 'download', run: () => this.download([it]) }] : []),
          { label: 'Copiar vínculo', icon: 'link', run: () => this.copyLink(it.name) },
          '-',
          { label: 'Detalles', icon: 'info', run: () => { this.state.selected = new Set([it]); this.state.details = true; this.renderBody(); } }
        ]);
      }
      if ((b = t.closest('[data-sp-open]'))) return this.open(this.itemAt(b.dataset.spOpen));
      if ((b = t.closest('[data-sp-crumb]'))) { this.state.path = this.state.path.slice(0, Number(b.dataset.spCrumb)); this.state.selected.clear(); this.state.filter = ''; return this.renderBody(); }
      if ((b = t.closest('[data-sp-sort]'))) {
        const k = b.dataset.spSort, s = this.state.sort;
        this.state.sort = { key: k, dir: s.key === k ? -s.dir : 1 };
        return this.renderBody();
      }
      if ((b = t.closest('[data-sp-act]'))) {
        const sel = this.selectedItems;
        switch (b.dataset.spAct) {
          case 'details': this.state.details = !this.state.details; return this.renderBody();
          case 'clear': this.state.selected.clear(); return this.renderBody();
          case 'open': return this.open(sel[0]);
          case 'download': return this.download(sel.filter((i) => i.type !== 'folder').length ? sel.filter((i) => i.type !== 'folder') : sel);
          case 'link': return this.copyLink(sel[0].name);
          case 'link-folder': return this.copyLink(null);
          case 'sort-menu': {
            const s = this.state.sort;
            const set = (key, dir) => () => { this.state.sort = { key, dir }; this.renderBody(); };
            return this.showMenu(b, [
              { label: 'Nombre: A a Z', checked: s.key === 'name' && s.dir === 1, run: set('name', 1) },
              { label: 'Nombre: Z a A', checked: s.key === 'name' && s.dir === -1, run: set('name', -1) },
              '-',
              { label: 'Modificado: más reciente', checked: s.key === 'modified' && s.dir === -1, run: set('modified', -1) },
              { label: 'Modificado: más antiguo', checked: s.key === 'modified' && s.dir === 1, run: set('modified', 1) }
            ]);
          }
          case 'view-menu':
            return this.showMenu(b, [
              { label: 'Lista', icon: 'list', checked: this.state.view === 'list', run: () => { this.state.view = 'list'; this.renderBody(); } },
              { label: 'Mosaicos', icon: 'grid', checked: this.state.view === 'grid', run: () => { this.state.view = 'grid'; this.renderBody(); } }
            ]);
        }
        return;
      }
      // Clic en fila (fuera de botones): selección única, como SharePoint
      const row = t.closest('tr.sp-row');
      if (row && !t.closest('button')) this.toggleSelect(this.itemAt(row.dataset.spIdx), true);
    }
  }

  function closeMenus() { document.querySelectorAll('.sp-menu').forEach((m) => m.remove()); }
  document.addEventListener('click', (e) => { if (!e.target.closest('.sp-menu') && !e.target.closest('[data-sp-more],[data-sp-act$="-menu"]')) closeMenus(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenus();
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.sp-tile')) { e.preventDefault(); e.target.click(); }
  });
  window.addEventListener('scroll', closeMenus, { passive: true });

  window.SPLibrary = {
    mountAll() {
      document.querySelectorAll('.sp-library[data-library]').forEach((el) => {
        if (!el._sp) el._sp = new Library(el, el.dataset.library);
      });
    }
  };
})();
