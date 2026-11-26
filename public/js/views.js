'use strict';
/* ===== Widoki: roadmapa, moduł, lekcja, zadanie z zajęć, quiz modułu ===== */

const LEVELS = ['Podstawy', 'Łatwy', 'Średni', 'Trudny'];

function daysTo(iso) {
  const ms = new Date(iso).getTime() - Date.now();
  return { d: Math.ceil(ms / 86400000), past: ms < 0 };
}
function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
}

function statusIcon(s) { return s === 'done' ? '✓' : s === 'part' ? '◐' : '○'; }

/* ---------- ROADMAPA ---------- */
function viewHome(app) {
  const ov = overall(), ns = nextStep();
  const dates = [
    ['Oddanie projektu (term. 1)', '2026-12-05T23:59'],
    ['Sprawdzian pisemny (term. 1)', '2026-12-06T08:00'],
    ['Oddanie projektu (term. 2)', '2026-12-19T23:59'],
    ['Sprawdzian pisemny (term. 2)', '2027-01-10T08:00'],
  ].filter(x => !daysTo(x[1]).past).slice(0, 3);
  const hero = h('div', { class: 'hero' },
    h('div', null,
      h('h1', null, 'Twoja droga do zaliczenia Javy'),
      h('p', { class: 'muted' }, 'Od pierwszej klasy po kolekcje i generyki. Każda lekcja = krótka teoria + małe zadanie. Po module robisz zadanie z zajęć, a na końcu piszesz 5 sprawdzianów próbnych.'),
      ns ? h('a', { href: ns.route, class: 'btn primary' }, (ov.done ? 'Kontynuuj' : 'Zacznij') + ' → ' + ns.label)
        : h('a', { href: '#/tests', class: 'btn primary' }, 'Materiał ukończony – przejdź do sprawdzianów →'),
      h('div', { class: 'countdown' }, dates.map(([t, d]) => h('div', { class: 'cd' }, t + ': ', h('b', null, daysTo(d).d + ' dni'), h('span', { class: 'muted small' }, ' (' + fmtDate(d) + ')'))))),
    h('div', { class: 'center' }, h('div', { class: 'ring', style: { '--p': ov.pct } }, h('b', null, ov.pct + '%')), h('div', { class: 'muted small', style: { marginTop: '8px' } }, ov.done + ' / ' + ov.total + ' kroków')));
  const road = h('div', { class: 'road' });
  const firstOpen = ACAD.modules.find(m => moduleProgress(m).pct < 100);
  ACAD.modules.forEach(m => {
    const p = moduleProgress(m);
    const dots = h('div', { class: 'dots' },
      m.lessons.map(l => h('div', { class: 'dot ' + lessonStatus(l), title: l.title })),
      (m.labs || []).map(lb => h('div', { class: 'dot lab ' + labStatus(lb), title: 'Zadanie: ' + lb.title })),
      m.quiz ? h('div', { class: 'dot quiz ' + quizStatus(m), title: 'Quiz modułu' }) : null);
    road.appendChild(h('div', { class: 'card mod' + (p.pct === 100 ? ' done' : m === firstOpen ? ' active' : ''), 'data-n': m.num, onclick: () => { location.hash = '#/module/' + m.id; } },
      h('div', { class: 'row spread' }, h('span', { class: 'lvl l' + m.level }, LEVELS[m.level]), h('span', { class: 'muted small' }, m.source)),
      h('h3', null, m.icon + ' ' + m.title),
      h('div', { class: 'muted small' }, m.summary),
      dots,
      h('div', { class: 'row spread small muted' }, h('span', null, m.lessons.length + ' lekcji' + ((m.labs || []).length ? ' · ' + m.labs.length + ' zad. z zajęć' : '') + (m.quiz ? ' · quiz' : '')), h('span', null, p.pct + '%')),
      h('div', { class: 'progress' }, h('i', { style: { width: p.pct + '%' } }))));
  });
  const unlocked = materialDone() || Store.setting('unlockTests', false);
  road.appendChild(h('div', { class: 'card mod' + (unlocked ? ' active' : ' lock'), 'data-n': '🏁', onclick: () => { location.hash = '#/tests'; } },
    h('span', { class: 'lvl l3' }, 'Finał'),
    h('h3', null, '🎓 5 sprawdzianów próbnych'),
    h('div', { class: 'muted small' }, unlocked ? 'Odblokowane. Na ich podstawie ocenimy, czy zdasz.' : 'Odblokują się po ukończeniu wszystkich lekcji i zadań (możesz je odblokować wcześniej w zakładce Sprawdziany).')));
  app.append(h('div', { class: 'container' }, hero, h('h2', null, 'Roadmapa – od najprostszego do najtrudniejszego'), road));
}

/* ---------- MODUŁ ---------- */
function viewModule(app, id) {
  const m = Idx.module(id);
  if (!m) return app.append(h('div', { class: 'container' }, 'Nie ma takiego modułu.'));
  const p = moduleProgress(m);
  const c = h('div', { class: 'container narrow' });
  c.append(h('div', { class: 'crumbs' }, h('a', { href: '#/' }, 'Roadmapa'), ' / ', 'Moduł ' + m.num),
    h('div', { class: 'row spread' }, h('span', { class: 'lvl l' + m.level }, LEVELS[m.level]), h('span', { class: 'muted small' }, 'Materiał: ' + m.source)),
    h('h1', null, m.icon + ' ' + m.title),
    h('p', { class: 'muted' }, m.summary),
    h('div', { class: 'progress', style: { margin: '14px 0 22px' } }, h('i', { style: { width: p.pct + '%' } })));
  if (m.goals) c.append(h('div', { class: 'card flat' }, h('b', null, 'Po tym module potrafisz:'), h('ul', null, m.goals.map(g => h('li', { html: g })))));
  c.append(h('h2', { style: { marginTop: '24px' } }, 'Lekcje'));
  const list = h('div', { class: 'list' });
  m.lessons.forEach((l, i) => {
    const s = lessonStatus(l);
    list.appendChild(h('a', { href: '#/lesson/' + l.id, class: 'item ' + s },
      h('div', { class: 'ico' }, s === 'done' ? '✓' : (i + 1)),
      h('div', { class: 'grow' }, h('b', null, l.title), h('div', { class: 'muted small' }, l.blurb || '')),
      h('span', { class: 'badge' }, '~' + (l.minutes || 8) + ' min'),
      s === 'part' ? h('span', { class: 'badge acc' }, 'w trakcie') : null));
  });
  c.append(list);
  if ((m.labs || []).length) {
    c.append(h('h2', { style: { marginTop: '28px' } }, 'Zadania z zajęć'), h('p', { class: 'muted small' }, 'To samo, co robiła prowadząca na laboratoriach – po kolei, z oceną i raportem błędów.'));
    const ll = h('div', { class: 'list' });
    m.labs.forEach(lb => {
      const s = labStatus(lb), st = Store.data.labs[lb.id];
      ll.appendChild(h('a', { href: '#/lab/' + lb.id, class: 'item ' + (s === 'done' ? 'done' : '') },
        h('div', { class: 'ico' }, s === 'done' ? '✓' : '🧪'),
        h('div', { class: 'grow' }, h('b', null, lb.title), h('div', { class: 'muted small' }, lb.source)),
        st && st.last ? h('span', { class: 'badge ' + (st.last.pct >= 70 ? 'ok' : 'med') }, 'ocena ' + gradeOf(st.last.pct) + ' · ' + Math.round(st.last.pct) + '%') : h('span', { class: 'badge' }, 'nie rozpoczęte')));
    });
    c.append(ll);
  }
  if (m.quiz) {
    const s = quizStatus(m), q = Store.data.quizzes[m.id];
    c.append(h('h2', { style: { marginTop: '28px' } }, 'Quiz modułu'),
      h('a', { href: '#/quiz/' + m.id, class: 'item ' + (s === 'done' ? 'done' : '') }, h('div', { class: 'ico' }, s === 'done' ? '✓' : '❓'),
        h('div', { class: 'grow' }, h('b', null, 'Quiz: ' + m.title), h('div', { class: 'muted small' }, m.quiz.length + ' pytań w stylu kolokwium')),
        q && q.last ? h('span', { class: 'badge ' + (q.last.pct >= 70 ? 'ok' : 'med') }, Math.round(q.last.pct) + '%') : h('span', { class: 'badge' }, 'nie rozpoczęty')));
  }
  const idx = ACAD.modules.indexOf(m), nx = ACAD.modules[idx + 1];
  if (nx) c.append(h('div', { style: { marginTop: '30px' } }, h('a', { href: '#/module/' + nx.id, class: 'btn' }, 'Następny moduł: ' + nx.title + ' →')));
  app.append(c);
}

/* ---------- LEKCJA ---------- */
function applySaved(files, saved) {
  return files.map(f => ({ name: f.name, code: saved && saved[f.name] != null ? saved[f.name] : f.code })).concat(
    Object.keys(saved || {}).filter(n => !files.some(f => f.name === n)).map(n => ({ name: n, code: saved[n] })));
}
function codeMap(files) { const o = {}; files.forEach(f => { o[f.name] = f.code; }); return o; }

function showSolution(files, title, onConfirmed) {
  if (!confirm('Podejrzenie rozwiązania zostanie zapisane w „Do powtórki”, bo uczysz się najlepiej, gdy dojdziesz do niego sam. Pokazać rozwiązanie?')) return;
  onConfirmed();
  const m = h('div', null, h('h3', null, '🔑 Rozwiązanie wzorcowe: ' + title), h('p', { class: 'muted small' }, 'To jedno z możliwych rozwiązań. Porównaj je ze swoim i zrozum różnice.'));
  files.forEach(f => m.appendChild(codeBlock(f.code, { title: f.name })));
  showModal(m);
}

/* ---------- LEKCJA ATOMOWA: lektura → krok po kroku → spróbuj sam → pytania ---------- */
function stripCode(c) { return c.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '').replace(/\s+/g, ' '); }

function viewMicroLesson(app, id) {
  const L = Idx.lessons[id], M = Idx.modOfLesson[id], st = Store.lesson(id);
  const seg = location.hash.split('/').pop();
  const tabs = [['teoria', '📖 Lektura']];
  if (L.guide) tabs.push(['krok', '🧭 Krok po kroku']);
  if (L.exercise) tabs.push(['zadanie', '✏️ Spróbuj sam']);
  if (L.quiz && L.quiz.length) tabs.push(['pytania', '❓ Pytania']);
  const avail = tabs.map(t => t[0]);
  const step = avail.includes(seg) ? seg : 'teoria';
  if (!st.theory) { st.theory = true; Store.save(); }
  const idx = M.lessons.indexOf(L), next = M.lessons[idx + 1], prev = M.lessons[idx - 1];
  const nextHref = next ? '#/lesson/' + next.id : '#/module/' + M.id;
  const hrefOf = s => '#/lesson/' + id + (s === 'teoria' ? '' : '/' + s);
  const quizN = st.quiz ? Object.keys(st.quiz).length : 0;
  const doneOf = { teoria: true, krok: !!st.guided, zadanie: !!st.done, pytania: !!(L.quiz && quizN >= L.quiz.length) };
  app.append(h('div', { class: 'lesson-top' },
    h('a', { href: '#/module/' + M.id, class: 'muted small' }, '← ' + M.title),
    h('b', null, L.title),
    h('div', { class: 'steps' }, tabs.map(t => h('a', { class: 'step' + (step === t[0] ? ' active' : '') + (doneOf[t[0]] && t[0] !== 'teoria' ? ' ok' : ''), href: hrefOf(t[0]) }, (doneOf[t[0]] && t[0] !== 'teoria' ? '✓ ' : '') + t[1]))),
    h('span', { class: 'sp', style: { flex: 1 } }),
    prev ? h('a', { class: 'btn small ghost', href: '#/lesson/' + prev.id }, '←') : null,
    h('a', { class: 'btn small ghost', href: nextHref }, next ? 'Następna →' : 'Do modułu')));
  const nextTab = avail[avail.indexOf(step) + 1];
  const nextLabel = { krok: 'Dalej: krok po kroku →', zadanie: 'Dalej: spróbuj sam →', pytania: 'Dalej: pytania →' };
  const forward = (label) => nextTab
    ? h('a', { class: 'btn primary', href: hrefOf(nextTab) }, label || nextLabel[nextTab])
    : h('a', { class: 'btn primary', href: nextHref }, next ? 'Następna lekcja →' : 'Wróć do modułu →');

  if (step === 'teoria') {
    const pane = h('div', { class: 'pane', style: { overflow: 'auto', height: 'calc(100vh - 108px)' } });
    const th = renderBlocks(L.content);
    th.insertBefore(h('div', { class: 'muted small' }, 'Moduł ' + M.num + ' · ' + M.title + ' · ~' + (L.minutes || 4) + ' min'), th.firstChild);
    th.insertBefore(h('h1', null, L.title), th.children[1]);
    th.appendChild(h('div', { style: { marginTop: '28px' } }, forward()));
    pane.appendChild(th); app.appendChild(pane);
    return;
  }

  if (step === 'pytania') {
    const pane = h('div', { class: 'pane', style: { overflow: 'auto', height: 'calc(100vh - 108px)' } });
    const th = h('div', { class: 'theory' }, h('h1', null, 'Pytania: ' + L.title), h('p', { class: 'muted' }, 'Sprawdź, czy zapamiętałeś to, o czym była lektura. Błędne odpowiedzi trafią do „Do powtórki”.'));
    L.quiz.forEach((q, i) => {
      const a = st.quiz && st.quiz[i];
      th.appendChild(questionEl(q, i, {
        mode: 'instant', sel: a && a.sel, answered: !!a,
        onAnswer: (ok, sel) => { st.quiz = st.quiz || {}; st.quiz[i] = { ok, sel, ts: Date.now() }; Store.save(); updateBadge(); },
      }).el);
    });
    th.appendChild(h('div', { style: { marginTop: '28px' } }, forward()));
    pane.appendChild(th); app.appendChild(pane);
    return;
  }

  if (step === 'krok') {
    const g = L.guide;
    const left = h('div', { class: 'pane left instr' });
    left.append(h('span', { class: 'badge acc' }, 'Krok po kroku'), h('h2', { style: { marginTop: '8px' } }, L.title),
      h('div', { class: 'note tip' }, h('b', { class: 'lbl' }, '🧭 Piszemy razem'), h('div', { html: g.intro || 'Wykonuj kroki po kolei. Przy każdym widzisz, <b>co wpisać</b> i <b>dlaczego</b>. Zielony ptaszek pojawi się sam, gdy kod w edytorze będzie poprawny.' })));
    const ol = h('ol', { class: 'gsteps' });
    const els = g.steps.map((s, i) => {
      const body = h('div', { class: 'gs-body' }, h('div', { html: s.say }));
      if (s.type) {
        const copy = h('button', { class: 'btn small ghost', onclick: () => { try { navigator.clipboard.writeText(s.type); copy.textContent = '✓ Skopiowano'; setTimeout(() => { copy.textContent = '📋 Kopiuj'; }, 1200); } catch (e) { /* */ } } }, '📋 Kopiuj');
        body.append(h('div', { class: 'gtype' }, h('div', { class: 'gtype-h' }, h('span', null, 'Wpisz:'), copy), h('pre', { html: Hl.highlight(s.type) })));
      }
      const li = h('li', { class: 'gstep' }, h('div', { class: 'gs-num' }, String(i + 1)), body);
      ol.appendChild(li); return li;
    });
    const banner = h('div', { class: 'dock-wrap' });
    left.append(ol, banner);
    const paint = fs => {
      const src = stripCode(fs.map(f => f.code).join('\n'));
      let first = -1;
      g.steps.forEach((s, i) => { let ok = false; try { ok = new RegExp(s.expect).test(src); } catch (e) { /* */ } els[i].classList.toggle('done', ok); if (!ok && first < 0) first = i; });
      els.forEach((el, i) => el.classList.toggle('active', i === first));
      banner.innerHTML = '';
      if (first < 0 && !st.guided) banner.appendChild(h('div', { class: 'note info' }, h('b', { class: 'lbl' }, 'Wszystkie kroki wykonane'), 'Kliknij <b>▶ Uruchom</b>, żeby zobaczyć efekt, a potem <b>✔ Sprawdź</b>.'));
      if (st.guided) banner.appendChild(h('div', { class: 'dock' }, h('span', { class: 'dock-t' }, '✻ Gotowe, poszło!'), forward('Dalej →')));
    };
    const files = applySaved(g.files, st.gcode);
    const wb = Workbench({
      files, checks: g.checks || [], prelude: g.prelude, main: g.run, stdin: g.stdin, canAdd: false,
      onChange: fs => { st.gcode = codeMap(fs); Store.save(); paint(fs); },
      onResult: r => {
        if (!r.compileFail && r.pct === 100 && !st.guided) { st.guided = true; Store.save(); updateBadge(); }
        paint(wb.getFiles ? wb.getFiles() : files);
      },
    });
    paint(files);
    app.appendChild(h('div', { class: 'split' }, left, h('div', { class: 'pane right' }, wb.el)));
    return;
  }

  // zadanie (spróbuj sam)
  const ex = L.exercise;
  const left = h('div', { class: 'pane left instr' });
  left.append(h('span', { class: 'badge acc' }, 'Spróbuj sam'), h('h2', { style: { marginTop: '8px' } }, L.title),
    h('div', { class: 'note info' }, h('b', { class: 'lbl' }, '✏️ Teraz Ty'), h('div', { html: 'Masz tylko opis zadania. Utknąłeś? Kliknij <b>💡 Podpowiedź</b> albo ' }, L.guide ? h('a', { href: hrefOf('krok') }, 'wróć do kroku po kroku') : null, '.')),
    h('div', { html: ex.prompt }));
  const list = h('ul', { class: 'task-chk' });
  const items = ex.checks.map(c => { const li = h('li', null, c.label, sevBadge(c.sev || 'medium')); list.appendChild(li); return li; });
  const paintList = last => ex.checks.forEach((c, i) => { items[i].className = last && last.checks && last.checks[c.id] === true ? 'ok' : last && last.checks && last.checks[c.id] === false ? 'no' : ''; });
  const banner = h('div', { class: 'dock-wrap' });
  left.append(h('h3', null, 'Co sprawdzimy'), list, banner);
  const showOk = () => { banner.innerHTML = ''; banner.appendChild(h('div', { class: 'dock' }, h('span', { class: 'dock-t' }, '✻ Zadanie zaliczone, świetnie!'), forward())); };
  const wb = Workbench({
    files: applySaved(ex.files, st.code), checks: ex.checks, prelude: ex.prelude, main: ex.run, stdin: ex.stdin, hints: ex.hints, canAdd: ex.canAdd,
    onChange: debounce(fs => { st.code = codeMap(fs); Store.save(); }, 600),
    onHint: n => { st.hints = Math.max(st.hints || 0, n); Store.save(); },
    onSolution: () => showSolution(ex.solution, L.title, () => { st.solutionViewed = true; st.solutionTs = Date.now(); Store.save(); updateBadge(); }),
    onResult: r => {
      st.attempts = (st.attempts || 0) + 1;
      st.last = { checks: r.checks, pct: r.pct, compileFail: r.compileFail, ts: Date.now() };
      const ok = !r.compileFail && r.pct === 100;
      if (ok && !st.done) { st.done = true; st.doneTs = Date.now(); }
      Store.save(); updateBadge(); paintList(st.last);
      if (ok) showOk(); else banner.innerHTML = '';
    },
  });
  paintList(st.last);
  if (st.done) showOk();
  app.appendChild(h('div', { class: 'split' }, left, h('div', { class: 'pane right' }, wb.el)));
}

function viewLesson(app, id, step) {
  const L = Idx.lessons[id];
  if (!L) return app.append(h('div', { class: 'container' }, 'Nie ma takiej lekcji.'));
  if (isMicro(L)) return viewMicroLesson(app, id);
  const M = Idx.modOfLesson[id];
  const st = Store.lesson(id);
  const ex = L.exercise;
  step = step || 'teoria';
  if (ex && location.hash.endsWith('/zadanie')) step = 'zadanie';
  if (ex && location.hash.endsWith('/razem')) step = 'razem';
  if (!st.theory) { st.theory = true; Store.save(); }
  const idx = M.lessons.indexOf(L), next = M.lessons[idx + 1], prev = M.lessons[idx - 1];
  const nextHref = next ? '#/lesson/' + next.id : '#/module/' + M.id;

  const top = h('div', { class: 'lesson-top' },
    h('a', { href: '#/module/' + M.id, class: 'muted small' }, '← ' + M.title),
    h('b', null, L.title),
    h('div', { class: 'steps' },
      h('a', { class: 'step' + (step === 'teoria' ? ' active' : ''), href: '#/lesson/' + id }, '📖 Teoria'),
      ex ? h('a', { class: 'step' + (step === 'razem' ? ' active' : '') + (st.guided ? ' ok' : ''), href: '#/lesson/' + id + '/razem' }, st.guided ? '✓ Razem' : '👀 Razem') : null,
      ex ? h('a', { class: 'step' + (step === 'zadanie' ? ' active' : '') + (st.done ? ' ok' : ''), href: '#/lesson/' + id + '/zadanie' }, st.done ? '✓ Samodzielnie' : '✏️ Samodzielnie') : null),
    h('span', { class: 'sp', style: { flex: 1 } }),
    prev ? h('a', { class: 'btn small ghost', href: '#/lesson/' + prev.id }, '←') : null,
    h('a', { class: 'btn small ghost', href: nextHref }, next ? 'Następna →' : 'Do modułu'));
  app.append(top);

  if (step === 'teoria') {
    const pane = h('div', { class: 'pane', style: { overflow: 'auto', height: 'calc(100vh - 108px)' } });
    const th = renderBlocks(L.content);
    th.insertBefore(h('div', { class: 'muted small' }, 'Moduł ' + M.num + ' · ' + M.title + ' · ~' + (L.minutes || 8) + ' min'), th.firstChild);
    th.insertBefore(h('h1', null, L.title), th.children[1]);
    if (L.quiz && L.quiz.length) {
      th.appendChild(h('h2', null, 'Sprawdź się'));
      L.quiz.forEach((q, i) => {
        const a = st.quiz && st.quiz[i];
        const qe = questionEl(q, i, {
          mode: 'instant', sel: a && a.sel, answered: !!a,
          onAnswer: (ok, sel) => { st.quiz = st.quiz || {}; st.quiz[i] = { ok, sel, ts: Date.now() }; Store.save(); updateBadge(); },
        });
        th.appendChild(qe.el);
      });
    }
    th.appendChild(h('div', { style: { marginTop: '28px' } },
      ex ? h('a', { class: 'btn primary', href: '#/lesson/' + id + '/razem' }, 'Dalej: zróbmy to razem →') : h('a', { class: 'btn primary', href: nextHref }, 'Dalej →')));
    pane.appendChild(th); app.appendChild(pane);
    return;
  }

  if (step === 'razem') {
    const gl = h('div', { class: 'pane left instr' });
    const gBanner = h('div');
    const toSelf = h('a', { class: 'btn primary', href: '#/lesson/' + id + '/zadanie' }, 'Teraz ja – krok 2 →');
    gl.append(h('span', { class: 'badge acc' }, 'Krok 1 z 2 · Robimy to razem'), h('h2', { style: { marginTop: '8px' } }, L.title),
      h('div', { class: 'note tip' }, h('b', { class: 'lbl' }, '👀 Nic nie musisz wymyślać'),
        h('div', { html: 'Po prawej jest <b>gotowy kod</b>. Zrób tylko trzy rzeczy:<ol><li><b>Przeczytaj go powoli</b> – każdy fragment odpowiada punktowi zadania poniżej.</li><li>Kliknij <b>▶ Uruchom</b> i zobacz, co kod robi.</li><li>Kliknij <b>✔ Sprawdź</b> – gotowy kod przejdzie wszystkie testy. Tak właśnie wygląda poprawne rozwiązanie.</li></ol>Możesz też coś w nim zmienić i sprawdzić, co się stanie.' })),
      h('h3', null, 'Zadanie, które ten kod rozwiązuje'), h('div', { html: ex.prompt }));
    const gList = h('ul', { class: 'task-chk' });
    ex.checks.forEach(c => gList.appendChild(h('li', null, c.label, sevBadge(c.sev || 'medium'))));
    gl.append(h('h3', null, 'Co sprawdzimy'), gList, gBanner, h('div', { style: { marginTop: '14px' } }, toSelf));
    const gwb = Workbench({
      files: ex.solution.map(f => ({ name: f.name, code: f.code })), checks: ex.checks, prelude: ex.prelude, main: ex.run, stdin: ex.stdin, canAdd: ex.canAdd,
      onResult: r => {
        const ok = !r.compileFail && r.pct === 100;
        gBanner.innerHTML = '';
        if (ok) {
          if (!st.guided) { st.guided = true; Store.save(); }
          gBanner.appendChild(h('div', { class: 'note tip' }, h('b', { class: 'lbl' }, '✅ Rozumiesz już, jak to wygląda'), 'Teraz zrób to samo sam – dostaniesz tylko instrukcję, bez gotowego kodu.'));
        }
      },
    });
    app.appendChild(h('div', { class: 'split' }, gl, h('div', { class: 'pane right' }, gwb.el)));
    return;
  }

  // zadanie
  const left = h('div', { class: 'pane left instr' });
  const sol = L.exercise.solution;
  left.append(h('span', { class: 'badge acc' }, 'Krok 2 z 2 · Teraz Ty'), h('h2', { style: { marginTop: '8px' } }, L.title),
    h('div', { class: 'note info' }, h('b', { class: 'lbl' }, '✏️ Tylko instrukcja'),
      h('div', { html: 'Poniżej masz instrukcję, a w edytorze tylko szkielet. Utknąłeś? Kliknij <b>💡 Podpowiedź</b> albo ' }, h('a', { href: '#/lesson/' + id + '/razem' }, 'wróć do gotowego kodu z kroku 1'), '.')),
    h('div', { html: ex.prompt }));
  const list = h('ul', { class: 'task-chk' });
  const items = ex.checks.map(c => { const li = h('li', null, c.label, sevBadge(c.sev || 'medium')); list.appendChild(li); return li; });
  const paintList = last => {
    ex.checks.forEach((c, i) => { items[i].className = last && last.checks && last.checks[c.id] === true ? 'ok' : last && last.checks && last.checks[c.id] === false ? 'no' : ''; });
  };
  left.append(h('h3', null, 'Co sprawdzimy'), list);
  const banner = h('div', { class: 'dock-wrap' });
  left.append(banner);
  const files0 = ex.files;
  const wb = Workbench({
    files: applySaved(files0, st.code), checks: ex.checks, prelude: ex.prelude, main: ex.run, stdin: ex.stdin, hints: ex.hints, canAdd: ex.canAdd,
    onChange: debounce(fs => { st.code = codeMap(fs); Store.save(); }, 600),
    onHint: n => { st.hints = Math.max(st.hints || 0, n); Store.save(); },
    onSolution: () => showSolution(sol, L.title, () => { st.solutionViewed = true; st.solutionTs = Date.now(); Store.save(); updateBadge(); }),
    onResult: r => {
      st.attempts = (st.attempts || 0) + 1;
      st.last = { checks: r.checks, pct: r.pct, compileFail: r.compileFail, ts: Date.now() };
      const ok = !r.compileFail && r.pct === 100;
      if (ok && !st.done) { st.done = true; st.doneTs = Date.now(); }
      Store.save(); updateBadge(); paintList(st.last);
      banner.innerHTML = '';
      if (ok) banner.appendChild(h('div', { class: 'dock' }, h('span', { class: 'dock-t' }, '✻ Zadanie zaliczone, świetnie!'), h('a', { class: 'btn primary', href: nextHref }, next ? 'Następna lekcja →' : 'Wróć do modułu →')));
    },
  });
  paintList(st.last);
  const right = h('div', { class: 'pane right' }, wb.el);
  app.appendChild(h('div', { class: 'split' }, left, right));
}

/* ---------- ZADANIE Z ZAJĘĆ ---------- */
function viewLab(app, id) {
  const lb = Idx.labs[id];
  if (!lb) return app.append(h('div', { class: 'container' }, 'Nie ma takiego zadania.'));
  const M = Idx.modOfLab[id];
  const st = Store.lab(id);
  const top = h('div', { class: 'lesson-top' },
    h('a', { href: '#/module/' + M.id, class: 'muted small' }, '← ' + M.title),
    h('b', null, '🧪 ' + lb.title),
    h('span', { class: 'badge' }, lb.source),
    h('span', { style: { flex: 1 } }),
    st.last ? h('span', { class: 'badge ' + (st.last.pct >= 70 ? 'ok' : 'med') }, 'ostatnio: ' + gradeOf(st.last.pct) + ' (' + Math.round(st.last.pct) + '%)') : null);
  app.append(top);
  const left = h('div', { class: 'pane left instr' });
  left.append(h('span', { class: 'badge ' + (lb.own ? 'acc' : 'ok') }, lb.own ? 'Zadanie przygotowane przeze mnie (brak PDF od prowadzącej dla tego działu)' : 'Zadanie z zajęć: ' + lb.source),
    h('h2', { style: { marginTop: '8px' } }, lb.title), h('div', { html: lb.statement }));
  if (lb.notes) left.append(h('div', { class: 'note info' }, h('b', { class: 'lbl' }, 'Uwagi do wersji w Javie'), h('div', { html: lb.notes })));
  const list = h('ul', { class: 'task-chk' });
  const items = lb.checks.map(c => { const li = h('li', null, c.label, sevBadge(c.sev || 'medium')); list.appendChild(li); return li; });
  const paintList = last => lb.checks.forEach((c, i) => { items[i].className = last && last.checks && last.checks[c.id] === true ? 'ok' : last && last.checks && last.checks[c.id] === false ? 'no' : ''; });
  left.append(h('h3', null, 'Za co dostaniesz punkty'), h('p', { class: 'muted small' }, 'Ocena: ' + SEV.critical.icon + ' poważny błąd = 3 pkt · ' + SEV.medium.icon + ' średni = 2 pkt · ' + SEV.minor.icon + ' powierzchowny = 1 pkt'), list);
  const reportBtn = h('button', { class: 'btn', style: { marginTop: '12px' }, hidden: true }, '📋 Pokaż raport z oceną');
  left.append(reportBtn);
  let lastRes = null;
  reportBtn.onclick = () => lastRes && labReport(lb, lastRes);
  const wb = Workbench({
    files: applySaved(lb.files, st.code), checks: lb.checks, prelude: lb.prelude, main: lb.main, stdin: lb.stdin, hints: lb.hints, canAdd: true, showGrade: true,
    checkLabel: '✔ Oceń zadanie',
    onChange: debounce(fs => { st.code = codeMap(fs); Store.save(); }, 600),
    onHint: n => { st.hints = Math.max(st.hints || 0, n); Store.save(); },
    onSolution: () => showSolution(lb.solution, lb.title, () => { st.solutionViewed = true; st.solutionTs = Date.now(); Store.save(); updateBadge(); }),
    onResult: r => {
      st.attempts = (st.attempts || 0) + 1;
      st.last = { checks: r.checks, pct: r.pct, compileFail: r.compileFail, ts: Date.now() };
      st.best = Math.max(st.best || 0, r.pct);
      Store.save(); updateBadge(); paintList(st.last);
      lastRes = r; reportBtn.hidden = false;
      labReport(lb, r);
    },
  });
  paintList(st.last);
  app.appendChild(h('div', { class: 'split' }, left, h('div', { class: 'pane right' }, wb.el)));
}

function labReport(lb, r) {
  const m = h('div');
  const pct = r.pct;
  m.append(h('h2', null, '📋 Raport: ' + lb.title));
  if (r.compileFail) {
    m.append(h('div', { class: 'score low' }, h('div', { class: 'big' }, '2'), h('div', null, h('b', null, 'Kod się nie kompiluje (0%)'), h('div', { class: 'muted small' }, 'To błąd poważny: program, który się nie kompiluje, nie działa. Popraw błędy kompilacji w edytorze i oceń ponownie.'))));
    return showModal(m);
  }
  m.append(h('div', { class: 'score ' + scoreClass(pct) }, h('div', { class: 'big' }, gradeOf(pct)),
    h('div', null, h('b', null, Math.round(pct) + '% punktów'), h('div', { class: 'muted small' }, 'Skala prowadzącej: >90% = 5 · 80–89% = 4,5 · 70–79% = 4 · 60–69% = 3,5 · 50–59% = 3 · <50% = 2'))));
  const failed = r.results.filter(x => !x.res.pass), passed = r.results.filter(x => x.res.pass);
  if (!failed.length) m.append(h('div', { class: 'note tip' }, h('b', { class: 'lbl' }, 'Bez uwag'), 'Wszystkie wymagania spełnione. Możesz spokojnie przejść dalej.'));
  ['critical', 'medium', 'minor'].forEach(sv => {
    const g = failed.filter(x => x.check.sev === sv);
    if (!g.length) return;
    m.append(h('h3', { style: { marginTop: '18px' } }, SEV[sv].icon + ' ' + SEV[sv].label + ' (' + g.length + ')'), h('div', { class: 'muted small' }, SEV[sv].desc));
    g.forEach(x => {
      const cid = x.check.concept || lb.concepts[0], les = Idx.lessons[cid];
      m.append(h('div', { class: 'chk fail' }, h('div', { class: 'mk' }, '✗'),
        h('div', null, h('div', null, x.check.label),
          h('div', { class: 'why' }, x.res.nocompile ? 'Brakuje elementu wymaganego przez zadanie: ' + x.res.msg : x.res.msg),
          les ? h('div', { class: 'small', style: { marginTop: '4px' } }, '↩ Wróć do: ', h('a', { href: '#/lesson/' + cid, onclick: () => { document.querySelector('.modal-bg') && document.querySelector('.modal-bg').remove(); } }, les.title)) : null)));
    });
  });
  if (passed.length) m.append(h('h3', { style: { marginTop: '18px' } }, '✅ Zaliczone (' + passed.length + ')'), h('div', { class: 'muted small' }, passed.map(x => x.check.label).join(' · ')));
  m.append(h('p', { class: 'muted small', style: { marginTop: '16px' } }, 'Miejsca do powtórki zapisały się w zakładce „Do powtórki”.'), h('div', { class: 'row' }, h('a', { class: 'btn', href: '#/review', onclick: () => document.querySelector('.modal-bg') && document.querySelector('.modal-bg').remove() }, 'Otwórz „Do powtórki”')));
  showModal(m);
}

/* ---------- QUIZ MODUŁU ---------- */
function viewQuiz(app, id) {
  const M = Idx.module(id);
  if (!M || !M.quiz) return app.append(h('div', { class: 'container' }, 'Brak quizu.'));
  const st = Store.quiz(id);
  const c = h('div', { class: 'container narrow' });
  c.append(h('div', { class: 'crumbs' }, h('a', { href: '#/' }, 'Roadmapa'), ' / ', h('a', { href: '#/module/' + id }, M.title), ' / Quiz'),
    h('h1', null, '❓ Quiz: ' + M.title),
    h('p', { class: 'muted' }, 'Pytania w stylu slajdów „Q&A” z wykładów. Zaznacz odpowiedzi i sprawdź całość na końcu. Pytania z kilkoma poprawnymi odpowiedziami mają znaczek „wielokrotny wybór”.'));
  const qes = M.quiz.map((q, i) => { const e = questionEl(q, i, { mode: 'batch' }); c.appendChild(e.el); return e; });
  const res = h('div');
  const btn = h('button', { class: 'btn primary' }, 'Sprawdź quiz');
  btn.onclick = () => {
    btn.disabled = true; let pts = 0; const ok = [];
    qes.forEach((e, i) => { const r = e.reveal(); pts += r.frac; ok.push(r.ok); });
    const pct = pts / M.quiz.length * 100;
    st.last = { pct, ok, ts: Date.now() }; st.best = Math.max(st.best || 0, pct); Store.save(); updateBadge();
    res.innerHTML = '';
    res.append(h('div', { class: 'score ' + scoreClass(pct) }, h('div', { class: 'big' }, Math.round(pct) + '%'), h('div', null, h('b', null, ok.filter(Boolean).length + ' z ' + ok.length + ' poprawnie'), h('div', { class: 'muted small' }, 'Błędne odpowiedzi trafiły do „Do powtórki”.'))),
      h('div', { class: 'row' }, h('a', { class: 'btn', href: '#/quiz/' + id, onclick: () => setTimeout(route, 0) }, 'Spróbuj ponownie'), h('a', { class: 'btn primary', href: '#/module/' + id }, 'Wróć do modułu')));
    res.scrollIntoView({ behavior: 'smooth' });
  };
  c.append(h('div', { style: { margin: '18px 0' } }, btn), res);
  app.append(c);
}
