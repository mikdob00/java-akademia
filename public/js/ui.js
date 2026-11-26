'use strict';
/* ===== Wspólne komponenty UI: bloki teorii, quizy, warsztat (edytor+konsola), modale ===== */

function sevBadge(s) { return h('span', { class: 'sev ' + s, title: SEV[s].desc }, SEV[s].label); }

function showModal(content, onClose) {
  const bg = h('div', { class: 'modal-bg' }, h('div', { class: 'modal' }, content));
  const close = () => { bg.remove(); if (onClose) onClose(); };
  bg.addEventListener('mousedown', ev => { if (ev.target === bg) close(); });
  document.body.appendChild(bg);
  return close;
}

/* ---------- blok kodu ---------- */
function codeBlock(code, o) {
  o = o || {};
  const pre = h('pre', { html: Hl.highlight(code.replace(/\n$/, '')) });
  const box = h('div', { class: 'codeblock' });
  const head = h('div', { class: 'cb-head' }, h('span', null, o.title || 'Java'));
  const outEl = h('div', { class: 'out', hidden: true });
  if (o.run) {
    const btn = h('button', { class: 'btn small primary' }, '▶ Uruchom');
    btn.onclick = async () => {
      btn.disabled = true; btn.textContent = 'Kompiluję…';
      const r = await Api.run([{ name: 'Main.java', code }], 'Main', o.stdin || '');
      btn.disabled = false; btn.textContent = '▶ Uruchom ponownie';
      outEl.hidden = false; outEl.className = 'out';
      if (r.error === 'NO_JDK') { outEl.className = 'out err'; outEl.textContent = 'Nie znaleziono JDK – zobacz Ustawienia.'; }
      else if (r.phase === 'compile') { outEl.className = 'out err'; outEl.textContent = r.compile.errors.map(e => e.file + ':' + e.line + ' ' + e.msg).join('\n'); }
      else { outEl.textContent = (r.stdout || '').replace(/\r/g, '') + (r.stderr ? '\n' + r.stderr : ''); if (r.stderr) outEl.className = 'out err'; }
    };
    head.appendChild(btn);
  }
  box.append(head, pre, outEl);
  if (o.out && !o.run) { outEl.hidden = false; outEl.textContent = o.out; }
  return box;
}

/* ---------- bloki teorii ---------- */
function renderBlocks(blocks) {
  const root = h('div', { class: 'theory' });
  for (const b of blocks) {
    switch (b.t) {
      case 'h': root.appendChild(h('h2', { html: b.x })); break;
      case 'h3': root.appendChild(h('h3', { html: b.x })); break;
      case 'p': root.appendChild(h('p', { html: b.x })); break;
      case 'ul': root.appendChild(h('ul', null, b.x.map(i => h('li', { html: i })))); break;
      case 'ol': root.appendChild(h('ol', null, b.x.map(i => h('li', { html: i })))); break;
      case 'code': root.appendChild(codeBlock(b.x, b)); break;
      case 'note': {
        const lbl = { tip: '💡 Wskazówka', warn: '⚠️ Uwaga', exam: '🎯 Na kolokwium', info: 'ℹ️ Warto wiedzieć' }[b.k || 'info'];
        root.appendChild(h('div', { class: 'note ' + (b.k || 'info') }, h('b', { class: 'lbl' }, lbl), h('div', { html: b.x })));
        break;
      }
      case 'table': {
        root.appendChild(h('table', { class: 't' },
          h('thead', null, h('tr', null, b.head.map(x => h('th', { html: x })))),
          h('tbody', null, b.rows.map(r => h('tr', null, r.map(c => h('td', { html: c })))))));
        break;
      }
      case 'analogy': root.appendChild(h('div', { class: 'analogy' }, h('div', { class: 'an-ic' }, b.icon || '💡'), h('div', null, h('b', { class: 'an-t', html: b.title || 'Po ludzku' }), h('div', { html: b.x })))); break;
      case 'terms': root.appendChild(h('div', { class: 'terms' }, b.x.map(r => h('div', { class: 'term' }, h('b', { html: r[0] }), h('span', { html: r[1] }))))); break;
      case 'viz': root.appendChild(Viz.render(b)); break;
      case 'walk': root.appendChild(Viz.walk(b)); break;
      default: break;
    }
  }
  return root;
}

/* ---------- pytania zamknięte ---------- */
function evalQ(q, sel) {
  const right = new Set(q.a), picked = new Set(sel);
  let hits = 0, wrong = 0;
  picked.forEach(i => { if (right.has(i)) hits++; else wrong++; });
  const ok = hits === right.size && wrong === 0;
  const frac = Math.max(0, (hits - wrong) / right.size);
  return { ok, frac };
}

/* mode: 'instant' (sprawdź po kliknięciu), 'batch' (bez podpowiedzi), 'review' (pokaż wynik) */
function questionEl(q, idx, o) {
  o = o || {};
  const multi = q.a.length > 1 || q.multi;
  const name = 'q' + Math.random().toString(36).slice(2);
  const sel = new Set(o.sel || []);
  const box = h('div', { class: 'q' });
  box.appendChild(h('div', { class: 'qt' }, (idx != null ? (idx + 1) + '. ' : ''), h('span', { html: q.q })));
  if (q.code) box.appendChild(h('div', { class: 'qcode' }, codeBlock(q.code, { title: q.codeTitle || 'Kod' })));
  if (multi) box.appendChild(h('div', { class: 'multi' }, 'Zaznacz wszystkie poprawne odpowiedzi'));
  const optEls = q.o.map((t, i) => {
    const inp = h('input', { type: multi ? 'checkbox' : 'radio', name });
    if (sel.has(i)) inp.checked = true;
    const el = h('label', { class: 'opt' + (sel.has(i) ? ' sel' : '') }, inp, h('span', { html: t }));
    inp.onchange = () => {
      if (multi) { inp.checked ? sel.add(i) : sel.delete(i); }
      else { sel.clear(); sel.add(i); }
      optEls.forEach((x, k) => x.classList.toggle('sel', sel.has(k)));
      if (o.onChange) o.onChange([...sel]);
    };
    box.appendChild(el);
    return el;
  });
  const fb = h('div');
  box.appendChild(fb);
  function reveal() {
    const right = new Set(q.a);
    optEls.forEach((el, i) => {
      el.classList.remove('sel');
      el.querySelector('input').disabled = true;
      if (sel.has(i) && right.has(i)) el.classList.add('right');
      else if (sel.has(i) && !right.has(i)) el.classList.add('wrong');
      else if (!sel.has(i) && right.has(i)) el.classList.add('miss');
    });
    const r = evalQ(q, [...sel]);
    fb.innerHTML = '';
    fb.appendChild(h('div', { class: 'why' }, h('b', null, r.ok ? '✔ Dobrze. ' : '✘ Nie do końca. '), h('span', { html: q.why || '' })));
    return r;
  }
  if (o.mode === 'instant') {
    const btn = h('button', { class: 'btn small primary', style: { marginTop: '8px' } }, 'Sprawdź odpowiedź');
    btn.onclick = () => {
      if (!sel.size) return toast('Zaznacz odpowiedź');
      const r = reveal(); btn.remove();
      if (o.onAnswer) o.onAnswer(r.ok, [...sel]);
    };
    box.appendChild(btn);
    if (o.sel && o.answered) { reveal(); btn.remove(); }
  } else if (o.mode === 'review') reveal();
  return { el: box, getSel: () => [...sel], reveal };
}

/* ---------- warsztat: edytor + przyciski + konsola ---------- */
function Workbench(cfg) {
  const checks = (cfg.checks || []);
  checks.forEach((c, i) => { c.id = c.id || ('c' + i); c.sev = c.sev || 'medium'; });
  let hintN = 0;
  const editor = createEditor({
    files: cfg.files, canAdd: cfg.canAdd,
    onChange: () => { if (cfg.onChange) cfg.onChange(editor.getFiles()); },
    onSubmit: () => doCheck(),
  });
  const wrap = h('div', { class: 'ed-wrap' });
  const btnRun = h('button', { class: 'btn' }, '▶ Uruchom');
  const btnChk = h('button', { class: 'btn primary' }, cfg.checkLabel || '✔ Sprawdź');
  const btnHint = h('button', { class: 'btn ghost' }, '💡 Podpowiedź');
  const btnReset = h('button', { class: 'btn ghost' }, '↺ Reset');
  const btnSol = h('button', { class: 'btn ghost' }, '🔑 Rozwiązanie');
  const tb = h('div', { class: 'toolbar' });
  if (!cfg.hideRun) tb.appendChild(btnRun);
  if (!cfg.hideCheck) tb.appendChild(btnChk);
  tb.appendChild(h('span', { class: 'sp' }));
  if ((cfg.hints || []).length) tb.appendChild(btnHint);
  if (cfg.onReset !== false) tb.appendChild(btnReset);
  if (cfg.onSolution) tb.appendChild(btnSol);

  const usesInput = cfg.stdin !== undefined || (cfg.files || []).some(f => /Scanner/.test(f.code));
  const stdinEl = h('textarea', { class: 'stdin', placeholder: 'Dane wejściowe (to, co wpisałbyś z klawiatury – każda linia = Enter)', rows: 2 });
  stdinEl.value = cfg.stdin || '';
  const outBody = h('div', { class: 'cbody' });
  const tabOut = h('div', { class: 'ctab active' }, 'Wynik');
  const tabTest = h('div', { class: 'ctab' }, 'Testy');
  const body = h('div', { class: 'cbody' });
  const cons = h('div', { class: 'console' }, h('div', { class: 'ctabs' }, tabOut, tabTest), body);
  wrap.append(editor.el, tb, cons);
  let tab = 'out';
  const panes = { out: h('div'), test: h('div') };
  panes.out.appendChild(h('div', { class: 'muted small' }, cfg.hideRun ? 'Tryb sprawdzianu: kod zostanie oceniony po zakończeniu.' : 'Kliknij „Uruchom”, aby zobaczyć wynik programu.' + (cfg.hideCheck ? '' : ' „Sprawdź” uruchamia testy zadania (Ctrl+Enter).')));
  panes.test.appendChild(h('div', { class: 'muted small' }, 'Tu pojawią się wyniki testów po kliknięciu „Sprawdź”.'));
  function showTab(t) {
    tab = t; tabOut.classList.toggle('active', t === 'out'); tabTest.classList.toggle('active', t === 'test');
    body.innerHTML = ''; body.appendChild(panes[t]);
  }
  tabOut.onclick = () => showTab('out'); tabTest.onclick = () => showTab('test');
  showTab('out');
  if (cfg.hideRun) { tabOut.style.display = 'none'; showTab('test'); }

  function jdkMissing() {
    return h('div', { class: 'errbox' }, h('b', null, 'Nie znaleziono JDK. '), 'Zainstaluj IntelliJ IDEA lub JDK 21 i odśwież status w Ustawieniach.');
  }
  function renderCompile(errors) {
    const root = h('div');
    root.appendChild(h('div', { class: 'score low' }, h('div', { class: 'big' }, '✘'), h('div', null, h('b', null, 'Kod się nie kompiluje'), h('div', { class: 'muted small' }, 'Popraw błędy poniżej – dopóki program się nie skompiluje, testy nie ruszą.'))));
    errors.slice(0, 8).forEach(e => {
      const ex = explainJavac(e);
      const code = (e.extra || []).filter(x => !/^\s*(symbol|location):/.test(x));
      root.appendChild(h('div', { class: 'errbox' },
        h('div', { class: 'loc', onclick: () => editor.jump(e.file, e.line) }, e.file + ' : linia ' + e.line),
        h('div', null, e.msg),
        ex ? h('div', { class: 'expl' }, '💬 ' + ex) : null,
        code.length ? h('pre', null, code.join('\n')) : null));
    });
    if (errors.length > 8) root.appendChild(h('div', { class: 'muted small' }, '… i ' + (errors.length - 8) + ' kolejnych błędów.'));
    return root;
  }
  async function doRun() {
    const files = editor.getFiles();
    const main = detectMain(files, cfg.main);
    showTab('out');
    if (!main) { panes.out.innerHTML = ''; panes.out.appendChild(h('div', { class: 'errbox' }, 'Żaden plik nie zawiera metody ', h('code', null, 'public static void main(String[] args)'), '. Dodaj klasę Main z metodą main, aby uruchomić program (testy „Sprawdź” działają też bez niej).')); return; }
    btnRun.disabled = true; btnRun.textContent = 'Uruchamiam…';
    panes.out.innerHTML = ''; panes.out.appendChild(h('div', { class: 'muted' }, 'Kompilacja i uruchomienie…'));
    editor.markErrors([]);
    let r;
    try { r = await Api.run(files, main, stdinEl.value); } catch (e) { r = { error: 'NET' }; }
    btnRun.disabled = false; btnRun.textContent = '▶ Uruchom';
    panes.out.innerHTML = '';
    if (r.error === 'NO_JDK') return panes.out.appendChild(jdkMissing());
    if (r.error) return panes.out.appendChild(h('div', { class: 'errbox' }, 'Błąd połączenia z serwerem aplikacji: ' + r.error));
    if (r.phase === 'compile') { editor.markErrors(r.compile.errors); return panes.out.appendChild(renderCompile(r.compile.errors)); }
    if (r.timedOut) panes.out.appendChild(h('div', { class: 'errbox' }, '⏱ Program działał zbyt długo i został przerwany (nieskończona pętla albo czekanie na dane wejściowe?).'));
    panes.out.appendChild(h('pre', { class: 'out-pre' }, (r.stdout || '').replace(/\r/g, '') || (r.stderr ? '' : '(program nic nie wypisał)')));
    if (r.stderr) panes.out.appendChild(h('pre', { class: 'out-pre', style: { color: 'var(--bad)' } }, r.stderr.replace(/\r/g, '')));
  }
  async function doCheck() {
    if (!checks.length) return;
    const files = editor.getFiles();
    showTab('test');
    btnChk.disabled = true; const old = btnChk.textContent; btnChk.textContent = 'Sprawdzam…';
    panes.test.innerHTML = ''; panes.test.appendChild(h('div', { class: 'muted' }, 'Kompilacja i uruchamianie testów…'));
    editor.markErrors([]);
    let r;
    try { r = await Api.check(files, checks, cfg.prelude); } catch (e) { r = { error: 'NET' }; }
    btnChk.disabled = false; btnChk.textContent = old;
    panes.test.innerHTML = '';
    if (r.error === 'NO_JDK') return panes.test.appendChild(jdkMissing());
    if (r.error || r.phase === 'internal') return panes.test.appendChild(h('div', { class: 'errbox' }, 'Błąd: ' + (r.error || '') + '\n' + (r.raw || '')));
    if (r.phase === 'compile') {
      editor.markErrors(r.compile.errors);
      panes.test.appendChild(renderCompile(r.compile.errors));
      if (cfg.onResult) cfg.onResult({ compileFail: true, checks: Object.fromEntries(checks.map(c => [c.id, false])), pct: 0, results: [] });
      return;
    }
    const map = {}; const rows = [];
    r.results.forEach((res, i) => { map[checks[i].id] = res.pass; rows.push({ check: checks[i], res }); });
    const pct = scoreChecks(checks, map);
    panes.test.appendChild(renderResults(rows, pct, cfg));
    if (cfg.onResult) cfg.onResult({ compileFail: false, checks: map, pct, results: rows });
  }
  btnRun.onclick = doRun; btnChk.onclick = doCheck;
  btnHint.onclick = () => {
    const hs = cfg.hints || [];
    const m = h('div', null, h('h3', null, '💡 Podpowiedzi'), h('p', { class: 'muted small' }, 'Odsłaniaj po jednej – zacznij od najmniej zdradzającej.'));
    const list = h('div'); m.appendChild(list);
    const more = h('button', { class: 'btn small' }, 'Pokaż kolejną');
    const draw = () => { list.innerHTML = ''; hs.slice(0, hintN).forEach((x, i) => list.appendChild(h('div', { class: 'note tip', html: '<b class="lbl">Podpowiedź ' + (i + 1) + '</b>' + x }))); more.hidden = hintN >= hs.length; };
    more.onclick = () => { hintN = Math.min(hs.length, hintN + 1); if (cfg.onHint) cfg.onHint(hintN); draw(); };
    if (hintN === 0) hintN = 1; draw(); m.appendChild(more);
    if (cfg.onHint) cfg.onHint(hintN);
    showModal(m);
  };
  btnReset.onclick = () => { if (confirm('Przywrócić kod startowy? Twój obecny kod zostanie utracony.')) { editor.setFiles(cfg.files); if (cfg.onChange) cfg.onChange(editor.getFiles()); } };
  btnSol.onclick = () => cfg.onSolution && cfg.onSolution();

  if (usesInput && !cfg.hideRun) { cons.insertBefore(h('div', { style: { padding: '6px 12px 0' } }, stdinEl), body); }
  return { el: wrap, editor, doRun, doCheck, getFiles: () => editor.getFiles(), setFiles: f => editor.setFiles(f) };
}

function renderResults(rows, pct, cfg) {
  const root = h('div');
  const pass = rows.filter(r => r.res.pass).length;
  const sc = h('div', { class: 'score ' + scoreClass(pct) },
    h('div', { class: 'big' }, Math.round(pct) + '%'),
    h('div', null, h('b', null, pass + ' z ' + rows.length + ' testów zaliczonych'),
      cfg.showGrade ? h('div', null, 'Ocena wg skali prowadzącej: ', h('b', null, gradeOf(pct))) : null,
      h('div', { class: 'muted small' }, pass === rows.length ? 'Wszystko działa 🎉' : 'Sprawdź czerwone punkty poniżej – przy każdym jest powód.')));
  root.appendChild(sc);
  rows.forEach(({ check: c, res }) => {
    const why = res.pass ? null : (res.nocompile
      ? 'Test nie mógł się uruchomić, bo w Twoim kodzie czegoś brakuje lub ma inny podpis: ' + res.msg + ((res.extra || []).find(x => /symbol:/.test(x)) ? ' — ' + (res.extra.find(x => /symbol:/.test(x)) || '').trim() : '') + '. Sprawdź nazwy, typy i parametry wymagane w treści zadania.'
      : res.msg);
    root.appendChild(h('div', { class: 'chk ' + (res.pass ? 'pass' : 'fail') },
      h('div', { class: 'mk' }, res.pass ? '✓' : '✗'),
      h('div', null, h('span', null, c.label), sevBadge(c.sev), why ? h('div', { class: 'why' }, why) : null)));
  });
  return root;
}

function backLink(href, text) { return h('a', { href, class: 'muted small' }, '← ' + text); }
