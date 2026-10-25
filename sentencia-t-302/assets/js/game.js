/* =========================================================
   Juego Concéntrese – 100% JavaScript (sin dependencias)
   Parejas definidas en data.js (window.T302.juego)
   ========================================================= */
(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const { icon, esc } = window.T302ui;
  const CARDS = window.T302.juego;
  const KEY = 't302-concentrese-best';

  const board = $('#board');
  const el = { moves: $('#gMoves'), pairs: $('#gPairs'), total: $('#gTotal'), time: $('#gTime'), best: $('#gBest'), win: $('#gWin'), winMsg: $('#gWinMsg'), level: $('#gLevel') };

  let state, timer;

  const fmt = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* Mejor marca por nivel (localStorage puede no estar disponible) */
  function readBest() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function saveBest(b) { try { localStorage.setItem(KEY, JSON.stringify(b)); } catch (e) { /* sin almacenamiento */ } }
  function showBest() {
    const b = readBest()[state.n];
    el.best.textContent = b ? b.moves + ' int. · ' + fmt(b.secs) : '–';
  }

  function render() {
    board.style.gridTemplateColumns = 'repeat(' + 4 + ', 1fr)';
    board.innerHTML = state.deck.map((c, i) => `
      <button type="button" class="tile" data-i="${i}" role="gridcell" aria-label="Tarjeta ${i + 1}, boca abajo">
        <span class="tile__inner">
          <span class="tile__face tile__face--back">${icon('question')}</span>
          <span class="tile__face tile__face--front">${icon(c.icon)}<span>${esc(c.label)}</span></span>
        </span>
      </button>`).join('');
  }

  function update() {
    el.moves.textContent = state.moves;
    el.pairs.textContent = state.found;
    el.total.textContent = state.n;
    el.time.textContent = fmt(state.secs);
  }

  function start() {
    clearInterval(timer);
    const n = +el.level.value;
    const picks = shuffle(CARDS.slice()).slice(0, n);
    state = {
      n, moves: 0, found: 0, secs: 0, open: [], lock: false, running: false,
      deck: shuffle(picks.concat(picks.map((c) => ({ ...c }))))
    };
    el.win.hidden = true;
    render(); update(); showBest();
  }

  function setLabel(t, i, text) { t.setAttribute('aria-label', 'Tarjeta ' + (i + 1) + ', ' + text); }

  function flip(t) {
    const i = +t.dataset.i;
    if (state.lock || t.classList.contains('is-flipped') || t.classList.contains('is-matched')) return;
    if (!state.running) {
      state.running = true;
      timer = setInterval(() => { state.secs++; el.time.textContent = fmt(state.secs); }, 1000);
    }
    t.classList.add('is-flipped');
    setLabel(t, i, state.deck[i].label);
    state.open.push(t);
    if (state.open.length < 2) return;

    state.moves++;
    state.lock = true;
    const [a, b] = state.open;
    const same = state.deck[+a.dataset.i].id === state.deck[+b.dataset.i].id;
    if (same) {
      [a, b].forEach((x) => { x.classList.add('is-matched'); x.disabled = true; setLabel(x, +x.dataset.i, state.deck[+x.dataset.i].label + ', pareja encontrada'); });
      state.found++;
      state.open = []; state.lock = false;
      update();
      if (state.found === state.n) finish();
    } else {
      [a, b].forEach((x) => x.classList.add('is-miss'));
      update();
      setTimeout(() => {
        [a, b].forEach((x) => { x.classList.remove('is-flipped', 'is-miss'); setLabel(x, +x.dataset.i, 'boca abajo'); });
        state.open = []; state.lock = false;
      }, 850);
    }
  }

  function finish() {
    clearInterval(timer);
    const all = readBest();
    const prev = all[state.n];
    const record = !prev || state.moves < prev.moves || (state.moves === prev.moves && state.secs < prev.secs);
    if (record) { all[state.n] = { moves: state.moves, secs: state.secs }; saveBest(all); showBest(); }
    el.winMsg.textContent = state.moves + ' intentos en ' + fmt(state.secs) + (record ? ' · ¡Nueva mejor marca!' : '');
    el.win.hidden = false;
    el.win.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  board.addEventListener('click', (e) => { const t = e.target.closest('.tile'); if (t) flip(t); });
  $('#gReset').addEventListener('click', start);
  $('#gAgain').addEventListener('click', start);
  el.level.addEventListener('change', start);

  start();
})();
