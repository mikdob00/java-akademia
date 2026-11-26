'use strict';
/* ===== Widoki: powtórki, sprawdziany, projekt, ustawienia ===== */

/* ---------- DO POWTÓRKI ---------- */
function viewReview(app) {
  const groups = reviewGroups();
  const c = h('div', { class: 'container narrow' });
  c.append(h('h1', null, '🔁 Do powtórki'),
    h('p', { class: 'muted' }, 'Lista miejsc, do których warto wrócić – zbudowana automatycznie z wyników ćwiczeń, zadań z zajęć, quizów i sprawdzianów. Kiedy poprawisz błąd i zaliczysz ćwiczenie ponownie, znika sam.'));
  c.append(h('div', { class: 'grid g3', style: { margin: '16px 0 24px' } },
    ['critical', 'medium', 'minor'].map(s => {
      const n = groups.filter(g => g.sev === s).length;
      return h('div', { class: 'card flat' }, h('div', { class: 'row spread' }, h('b', null, SEV[s].icon + ' ' + SEV[s].label), h('b', { style: { fontSize: '1.4rem' } }, n)), h('div', { class: 'muted small' }, SEV[s].desc));
    })));
  if (!groups.length) {
    c.append(h('div', { class: 'card center' }, h('h2', null, '🎉 Brak zaległości'), h('p', { class: 'muted' }, 'Na razie nic nie wymaga powtórki. Rób dalej lekcje i zadania – błędy pojawią się tutaj same.')));
    return app.append(c);
  }
  groups.forEach(g => {
    const M = Idx.modOfLesson[g.lessonId];
    const card = h('div', { class: 'card rev ' + g.sev, style: { marginBottom: '14px' } },
      h('div', { class: 'row spread' }, h('div', null, h('span', { class: 'badge ' + (g.sev === 'critical' ? 'crit' : g.sev === 'medium' ? 'med' : 'minor') }, SEV[g.sev].icon + ' ' + SEV[g.sev].label), ' ', h('b', null, g.lesson.title), h('span', { class: 'muted small' }, ' · ' + M.title))),
      h('ul', null, g.items.slice(0, 8).map(i => h('li', null, h('span', { html: i.text }), h('span', { class: 'tag' }, i.src)))),
      g.items.length > 8 ? h('div', { class: 'muted small' }, '… i ' + (g.items.length - 8) + ' więcej') : null,
      h('div', { class: 'row' },
        h('a', { class: 'btn small primary', href: '#/lesson/' + g.lessonId }, 'Powtórz lekcję'),
        h('a', { class: 'btn small', href: '#/lesson/' + g.lessonId + '/zadanie' }, 'Zrób ćwiczenie ponownie'),
        h('button', { class: 'btn small ghost', onclick: () => { Store.data.reviewed[g.lessonId] = Date.now(); Store.save(); updateBadge(); route(); } }, '✔ Oznacz jako powtórzone')));
    c.append(card);
  });
  app.append(c);
}

/* ---------- SPRAWDZIANY: lista + prognoza ---------- */
function testSummary() {
  const done = ACAD.tests.map(t => { const a = Store.test(t.id).attempts; return a.length ? { t, last: a[a.length - 1], best: Math.max(...a.map(x => x.pct)) } : null; }).filter(Boolean);
  return done;
}

function viewTests(app) {
  const unlocked = materialDone() || Store.setting('unlockTests', false);
  const c = h('div', { class: 'container' });
  c.append(h('h1', null, '🎓 Sprawdziany próbne'),
    h('p', { class: 'muted' }, 'Pięć kompletnych sprawdzianów: pytania zamknięte (jak „Q&A” z wykładów), „co wypisze program?” oraz zadania programistyczne oceniane automatycznie. Skala ocen jest taka jak u prowadzącej: >90% = 5, 80–89% = 4,5, 70–79% = 4, 60–69% = 3,5, 50–59% = 3, <50% = 2. Zaliczenie od 50%.'),
    h('div', { class: 'note info' }, h('b', { class: 'lbl' }, 'Założenie'), 'Nie znam dokładnego formatu sprawdzianu prowadzącej (jest „pisemny”), więc przygotowałem mieszankę pytań zamkniętych, analizy kodu i pisania kodu. Domyślnie zadania programistyczne piszesz bez kompilatora – jak na kartce. Możesz to zmienić w Ustawieniach.'));
  if (!unlocked) {
    const ov = overall();
    c.append(h('div', { class: 'card', style: { margin: '16px 0' } }, h('h3', null, '🔒 Sprawdziany odblokują się po przerobieniu całego materiału'),
      h('p', { class: 'muted' }, 'Ukończone: ' + ov.done + ' z ' + ov.total + ' kroków. Wszystkie lekcje muszą być zaliczone, a każde zadanie z zajęć podjęte.'),
      h('button', { class: 'btn', onclick: () => { Store.setSetting('unlockTests', true); route(); } }, 'Odblokuj mimo wszystko (mam mało czasu)')));
  }
  const grid = h('div', { class: 'grid g2' });
  ACAD.tests.forEach((t, i) => {
    const ts = Store.test(t.id), a = ts.attempts, last = a[a.length - 1];
    const q = t.questions.length, tk = t.tasks.length;
    grid.appendChild(h('div', { class: 'card' + (unlocked ? '' : ' lock') },
      h('div', { class: 'row spread' }, h('h3', null, 'Sprawdzian ' + (i + 1)), last ? h('span', { class: 'badge ' + (last.pct >= 50 ? 'ok' : 'crit') }, last.pct >= 50 ? 'zaliczony' : 'niezaliczony') : h('span', { class: 'badge' }, 'nie podjęty')),
      h('div', { class: 'muted small' }, t.focus),
      h('p', { class: 'small' }, q + ' pytań · ' + tk + ' zadania programistyczne · ' + (Store.setting('examMinutes', t.minutes || 60)) + ' min'),
      last ? h('div', { class: 'row' }, h('div', { class: 'ring', style: { '--p': Math.round(last.pct), width: '64px', height: '64px' } }, h('b', { style: { fontSize: '.9rem' } }, Math.round(last.pct) + '%')), h('div', null, h('div', null, 'Ocena: ', h('b', null, last.grade)), h('div', { class: 'muted small' }, 'Podejść: ' + a.length + ' · najlepszy: ' + Math.round(Math.max(...a.map(x => x.pct))) + '%'))) : null,
      h('div', { class: 'row', style: { marginTop: '12px' } },
        h('a', { class: 'btn primary' + (unlocked ? '' : ' disabled'), href: unlocked ? '#/test/' + t.id : null, onclick: unlocked ? null : (() => toast('Najpierw ukończ materiał (lub odblokuj w tym widoku)')) }, ts.draft ? 'Wznów' : (last ? 'Spróbuj ponownie' : 'Rozpocznij')),
        last ? h('a', { class: 'btn', href: '#/test/' + t.id + '/result' }, 'Wynik') : null)));
  });
  c.append(grid);
  c.append(verdictCard());
  app.append(c);
}

function verdictCard() {
  const sum = testSummary();
  const box = h('div', { style: { marginTop: '28px' } }, h('h2', null, '🔮 Czy zdasz Javę?'));
  if (!sum.length) { box.append(h('div', { class: 'card flat muted' }, 'Po pierwszym sprawdzianie pojawi się tu ocena. Pełna prognoza – po pięciu.')); return box; }
  const pcts = sum.map(s => s.last.pct);
  const avg = pcts.reduce((a, b) => a + b, 0) / pcts.length, mn = Math.min(...pcts);
  const n = sum.length;
  let cls, head, text;
  if (avg >= 75 && mn >= 55) { cls = 'good'; head = 'Wygląda bardzo dobrze'; text = 'Średni wynik i brak słabych sprawdzianów sugerują, że zaliczenie jest bardzo prawdopodobne.'; }
  else if (avg >= 60 && mn >= 45) { cls = 'good'; head = 'Zaliczenie prawdopodobne'; text = 'Wyniki są ponad progiem, ale jeszcze sporo można poprawić – popraw luki z „Do powtórki”.'; }
  else if (avg >= 50) { cls = 'mid'; head = 'Na granicy'; text = 'Jesteś blisko progu 50%. Jedno słabsze podejście wystarczy, by nie zdać – skup się na poważnych błędach (🔴).'; }
  else { cls = 'low'; head = 'Zagrożone zaliczenie'; text = 'Średnia poniżej 50%. Wróć do modułów z największą liczbą błędów, powtórz lekcje z „Do powtórki” i podejdź do kolejnego sprawdzianu.'; }
  if (n < 5) head += ' (wstępnie – ' + n + ' z 5 sprawdzianów)';
  const wrong = {};
  sum.forEach(s => (s.last.wrong || []).forEach(w => { wrong[w.concept] = (wrong[w.concept] || 0) + 1; }));
  const weak = Object.entries(wrong).sort((a, b) => b[1] - a[1]).slice(0, 5);
  box.append(h('div', { class: 'verdict ' + cls },
    h('h3', null, head),
    h('p', null, text),
    h('div', { class: 'row' }, h('span', { class: 'badge' }, 'Średnia: ' + avg.toFixed(1) + '%'), h('span', { class: 'badge' }, 'Najsłabszy: ' + mn.toFixed(0) + '%'), h('span', { class: 'badge acc' }, 'Szacowana ocena: ' + gradeOf(avg))),
    weak.length ? h('div', { style: { marginTop: '12px' } }, h('b', null, 'Najczęstsze luki: '), weak.map(([id, k]) => Idx.lessons[id] ? h('a', { class: 'tag', href: '#/lesson/' + id }, Idx.lessons[id].title + ' (' + k + '×)') : null)) : null,
    h('p', { class: 'muted small', style: { marginTop: '10px' } }, 'To szacunek na podstawie moich sprawdzianów, a nie gwarancja – prawdziwy sprawdzian może mieć inny rozkład trudności.')));
  box.append(h('div', { class: 'card flat' }, h('b', null, 'Wyniki ostatnich podejść'), sum.map(s => h('div', { class: 'bar' }, h('span', { class: 'lb' }, s.t.title), h('div', { class: 'progress' }, h('i', { style: { width: s.last.pct + '%', background: s.last.pct >= 50 ? '' : 'var(--bad)' } })), h('span', { class: 'v' }, Math.round(s.last.pct) + '%')))));
  return box;
}

/* ---------- SPRAWDZIAN: wykonanie ---------- */
function fmtTime(sec) { sec = Math.max(0, sec); const m = Math.floor(sec / 60), s = sec % 60; return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0'); }

function viewTest(app, id) {
  const T = ACAD.tests.find(t => t.id === id);
  if (!T) return app.append(h('div', { class: 'container' }, 'Brak sprawdzianu.'));
  const ts = Store.test(id);
  const limit = Store.setting('examMinutes', T.minutes || 60) * 60;
  const training = Store.setting('examCompiler', false);
  if (!ts.draft) {
    const c = h('div', { class: 'container narrow' });
    c.append(h('div', { class: 'crumbs' }, h('a', { href: '#/tests' }, 'Sprawdziany'), ' / ' + T.title),
      h('h1', null, T.title), h('p', { class: 'muted' }, T.focus),
      h('div', { class: 'card' }, h('ul', null,
        h('li', null, h('b', null, T.questions.length + ' pytań'), ' (zamknięte i „co wypisze program?”) + ', h('b', null, T.tasks.length + ' zadania programistyczne'), '.'),
        h('li', null, 'Czas: ', h('b', null, (limit / 60) + ' minut'), ' – po jego upływie praca zostanie oceniona automatycznie.'),
        h('li', null, 'Zadania programistyczne: ', training ? 'tryb treningowy – możesz uruchamiać kod i testy.' : 'tryb egzaminacyjny – piszesz bez kompilatora, tak jak na kartce. Ocena po zakończeniu.'),
        h('li', null, 'Zaliczenie: ≥ 50% punktów. Skala ocen jak u prowadzącej.')),
        h('button', { class: 'btn primary', onclick: () => { ts.draft = { start: Date.now(), sel: {}, code: {} }; Store.save(); route(); } }, 'Rozpocznij sprawdzian ▶')));
    return app.append(c);
  }
  const d = ts.draft;
  const timerT = h('span', { class: 't' }, '--:--');
  const answered = h('span', { class: 'muted small' });
  const timerBar = h('div', { class: 'timer' }, h('b', null, T.title), timerT, answered, h('span', { style: { flex: 1 } }),
    h('button', { class: 'btn small danger', onclick: () => { if (confirm('Przerwać i odrzucić to podejście?')) { delete ts.draft; Store.save(); location.hash = '#/tests'; } } }, 'Porzuć'),
    h('button', { class: 'btn small primary', onclick: () => finish(false) }, 'Zakończ i oceń'));
  app.append(timerBar);
  const c = h('div', { class: 'container narrow' });
  const closed = T.questions.filter(q => q.kind !== 'output'), outq = T.questions.filter(q => q.kind === 'output');
  const qEls = {};
  const upd = () => { const n = T.questions.filter(q => (d.sel[q.id] || []).length).length; answered.textContent = 'Odpowiedzi: ' + n + ' / ' + T.questions.length; };
  let num = 0;
  const section = (title, hint, qs) => {
    if (!qs.length) return;
    c.append(h('h2', { style: { marginTop: '26px' } }, title), h('p', { class: 'muted small' }, hint));
    qs.forEach(q => {
      const e = questionEl(q, num++, { mode: 'batch', sel: d.sel[q.id], onChange: sel => { d.sel[q.id] = sel; Store.save(); upd(); } });
      qEls[q.id] = e; c.appendChild(e.el);
    });
  };
  section('Część A – pytania zamknięte', 'Jedna lub kilka poprawnych odpowiedzi – tak jak w „Q&A” z wykładów.', closed);
  section('Część B – co wypisze program?', 'Przeanalizuj kod i wybierz dokładnie to, co pojawi się w konsoli.', outq);
  c.append(h('h2', { style: { marginTop: '30px' } }, 'Część C – zadania programistyczne'));
  const wbs = {};
  T.tasks.forEach((tk, i) => {
    c.append(h('div', { class: 'card', style: { margin: '14px 0' } },
      h('div', { class: 'row spread' }, h('h3', null, 'Zadanie ' + (i + 1) + ': ' + tk.title), h('span', { class: 'badge' }, (tk.pts || 8) + ' pkt')),
      h('div', { class: 'instr', html: tk.statement })));
    const wrapEd = h('div', { style: { height: '470px', display: 'flex', flexDirection: 'column', border: '1px solid var(--line)', borderRadius: '12px', overflow: 'hidden' } });
    const wb = Workbench({
      files: applySaved(tk.files, d.code[tk.id]), checks: tk.checks, prelude: tk.prelude, main: tk.main, stdin: tk.stdin,
      hideRun: !training, hideCheck: !training, onReset: false,
      onChange: debounce(fs => { d.code[tk.id] = codeMap(fs); Store.save(); }, 600),
      onResult: () => { /* wynik końcowy liczony przy zakończeniu */ },
    });
    wrapEd.appendChild(wb.el); wbs[tk.id] = wb;
    c.append(wrapEd);
  });
  c.append(h('div', { style: { margin: '28px 0' } }, h('button', { class: 'btn primary', onclick: () => finish(false) }, 'Zakończ sprawdzian i oceń')));
  app.append(c);
  upd();

  let finishing = false;
  async function finish(auto) {
    if (finishing) return;
    if (!auto) {
      const left = T.questions.filter(q => !(d.sel[q.id] || []).length).length;
      if (!confirm(left ? 'Masz ' + left + ' bez odpowiedzi. Zakończyć sprawdzian?' : 'Zakończyć sprawdzian i ocenić?')) return;
    }
    finishing = true; clearInterval(tick);
    const overlay = h('div', { class: 'modal-bg' }, h('div', { class: 'modal center' }, h('h3', null, 'Oceniam…'), h('p', { class: 'muted' }, 'Kompiluję i testuję Twoje zadania programistyczne.')));
    document.body.appendChild(overlay);
    const att = { ts: Date.now(), minutes: Math.round((Date.now() - d.start) / 60000), mcq: [], code: [], wrong: [], sel: Object.assign({}, d.sel) };
    let pts = 0, max = 0;
    T.questions.forEach(q => {
      const p = q.pts || (q.kind === 'output' ? 2 : 1);
      max += p;
      const r = evalQ(q, d.sel[q.id] || []);
      const got = q.kind === 'output' ? (r.ok ? p : 0) : p * r.frac;
      pts += got;
      att.mcq.push({ id: q.id, ok: r.ok, got, p });
      if (!r.ok) att.wrong.push({ concept: q.concept, sev: q.sev || 'medium', text: q.q.replace(/<[^>]+>/g, '') });
    });
    for (const tk of T.tasks) {
      const p = tk.pts || 8; max += p;
      const files = applySaved(tk.files, d.code[tk.id]);
      let pct = 0, map = {}, compileFail = false, errs = [];
      try {
        const r = await Api.check(files, tk.checks, tk.prelude);
        if (r.phase === 'compile') { compileFail = true; errs = r.compile.errors; tk.checks.forEach(c0 => { map[c0.id] = false; }); }
        else if (r.phase === 'check') { r.results.forEach((x, i) => { map[tk.checks[i].id] = x.pass; }); pct = scoreChecks(tk.checks, map); }
        else tk.checks.forEach(c0 => { map[c0.id] = false; });
      } catch (e) { tk.checks.forEach(c0 => { map[c0.id] = false; }); }
      pts += p * pct / 100;
      att.code.push({ id: tk.id, pct, checks: map, compileFail, errs: errs.slice(0, 3).map(e => e.file + ':' + e.line + ' ' + e.msg), files: files });
      if (compileFail) att.wrong.push({ concept: tk.concepts[0], sev: 'critical', text: 'Zadanie „' + tk.title + '” – kod się nie kompilował' });
      else tk.checks.forEach(c0 => { if (map[c0.id] === false) att.wrong.push({ concept: c0.concept || tk.concepts[0], sev: c0.sev, text: tk.title + ': ' + c0.label }); });
    }
    att.points = Math.round(pts * 10) / 10; att.max = max; att.pct = max ? Math.round(pts / max * 1000) / 10 : 0; att.grade = gradeOf(att.pct);
    ts.attempts.push(att); delete ts.draft; Store.save(); updateBadge();
    overlay.remove(); location.hash = '#/test/' + id + '/result';
  }
  const tick = setInterval(() => {
    const left = limit - Math.floor((Date.now() - d.start) / 1000);
    timerT.textContent = fmtTime(left); timerT.classList.toggle('low', left < 300);
    if (left <= 0) finish(true);
  }, 1000);
  routeCleanup.push(() => clearInterval(tick));
  timerT.textContent = fmtTime(limit - Math.floor((Date.now() - d.start) / 1000));
}

/* ---------- SPRAWDZIAN: wynik ---------- */
function viewTestResult(app, id) {
  const T = ACAD.tests.find(t => t.id === id);
  const ts = Store.test(id), a = ts.attempts[ts.attempts.length - 1];
  if (!T || !a) return app.append(h('div', { class: 'container' }, 'Brak wyniku. ', h('a', { href: '#/tests' }, 'Wróć')));
  const c = h('div', { class: 'container narrow' });
  const pass = a.pct >= 50;
  c.append(h('div', { class: 'crumbs' }, h('a', { href: '#/tests' }, 'Sprawdziany'), ' / ' + T.title + ' / wynik'),
    h('div', { class: 'verdict ' + (a.pct >= 70 ? 'good' : pass ? 'mid' : 'low') },
      h('div', { class: 'row spread' }, h('div', null, h('h1', null, pass ? 'Zaliczone ✅' : 'Niezaliczone ❌'), h('div', { class: 'muted' }, a.points + ' / ' + a.max + ' pkt · ' + a.minutes + ' min')),
        h('div', { class: 'center' }, h('div', { style: { fontSize: '2.8rem', fontWeight: 800 } }, a.grade), h('div', { class: 'muted small' }, Math.round(a.pct) + '%'))),
      h('p', { class: 'muted' }, 'Próg zaliczenia: 50%. Skala: >90% = 5 · 80–89% = 4,5 · 70–79% = 4 · 60–69% = 3,5 · 50–59% = 3.')));
  const mcqPts = a.mcq.reduce((s, x) => s + x.got, 0), mcqMax = a.mcq.reduce((s, x) => s + x.p, 0);
  const codeMax = T.tasks.reduce((s, t) => s + (t.pts || 8), 0), codePts = a.points - mcqPts;
  c.append(h('div', { class: 'card flat' }, h('b', null, 'Podział punktów'),
    h('div', { class: 'bar' }, h('span', { class: 'lb' }, 'Pytania (A + B)'), h('div', { class: 'progress' }, h('i', { style: { width: (mcqMax ? mcqPts / mcqMax * 100 : 0) + '%' } })), h('span', { class: 'v' }, (Math.round(mcqPts * 10) / 10) + '/' + mcqMax)),
    h('div', { class: 'bar' }, h('span', { class: 'lb' }, 'Zadania programistyczne'), h('div', { class: 'progress' }, h('i', { style: { width: (codeMax ? codePts / codeMax * 100 : 0) + '%' } })), h('span', { class: 'v' }, (Math.round(codePts * 10) / 10) + '/' + codeMax))));
  if (a.wrong.length) {
    const rank = { critical: 0, medium: 1, minor: 2 };
    c.append(h('h2', { style: { marginTop: '24px' } }, 'Gdzie tracisz punkty'), h('p', { class: 'muted small' }, 'Pogrupowane wg wagi błędu – zacznij od czerwonych.'));
    const byC = {};
    a.wrong.forEach(w => { (byC[w.concept] = byC[w.concept] || []).push(w); });
    Object.entries(byC).sort((x, y) => Math.min(...x[1].map(w => rank[w.sev])) - Math.min(...y[1].map(w => rank[w.sev]))).forEach(([cid, ws]) => {
      const L = Idx.lessons[cid]; const sv = ws.reduce((s, w) => rank[w.sev] < rank[s] ? w.sev : s, 'minor');
      c.append(h('div', { class: 'card rev ' + sv, style: { marginBottom: '10px' } }, h('div', { class: 'row spread' }, h('div', null, sevBadge(sv), ' ', h('b', null, L ? L.title : cid)), L ? h('a', { class: 'btn small', href: '#/lesson/' + cid }, 'Powtórz') : null), h('ul', null, ws.slice(0, 4).map(w => h('li', { class: 'small' }, w.text)))));
    });
  }
  c.append(h('h2', { style: { marginTop: '28px' } }, 'Przegląd pytań'));
  let n = 0;
  T.questions.forEach(q => { c.appendChild(questionEl(q, n++, { mode: 'review', sel: (a.sel || {})[q.id] || [] }).el); });
  c.append(h('h2', { style: { marginTop: '28px' } }, 'Zadania programistyczne'));
  T.tasks.forEach((tk, i) => {
    const r = a.code.find(x => x.id === tk.id) || { pct: 0, checks: {} };
    const box = h('div', { class: 'card', style: { margin: '12px 0' } },
      h('div', { class: 'row spread' }, h('h3', null, 'Zadanie ' + (i + 1) + ': ' + tk.title), h('span', { class: 'badge ' + (r.pct >= 70 ? 'ok' : 'med') }, Math.round(r.pct) + '% z ' + (tk.pts || 8) + ' pkt')));
    if (r.compileFail) box.append(h('div', { class: 'errbox' }, h('b', null, 'Kod się nie kompilował. '), (r.errs || []).join(' | ')));
    tk.checks.forEach(ck => { const ok = r.checks[ck.id]; box.append(h('div', { class: 'chk ' + (ok ? 'pass' : 'fail') }, h('div', { class: 'mk' }, ok ? '✓' : '✗'), h('div', null, ck.label, sevBadge(ck.sev || 'medium')))); });
    box.append(h('button', { class: 'btn small', style: { marginTop: '8px' }, onclick: () => { const m = h('div', null, h('h3', null, 'Rozwiązanie wzorcowe: ' + tk.title)); tk.solution.forEach(f => m.appendChild(codeBlock(f.code, { title: f.name }))); if (r.files) { m.appendChild(h('h3', { style: { marginTop: '16px' } }, 'Twoje rozwiązanie')); r.files.forEach(f => m.appendChild(codeBlock(f.code, { title: f.name }))); } showModal(m); } }, 'Porównaj z rozwiązaniem wzorcowym'));
    c.append(box);
  });
  c.append(h('div', { class: 'row', style: { margin: '24px 0' } }, h('a', { class: 'btn primary', href: '#/test/' + id }, 'Spróbuj ponownie'), h('a', { class: 'btn', href: '#/review' }, 'Do powtórki'), h('a', { class: 'btn', href: '#/tests' }, 'Wszystkie sprawdziany')));
  app.append(c);
}

/* ---------- PROJEKT ---------- */
function viewProject(app) {
  const P = ACAD.project;
  const c = h('div', { class: 'container narrow' });
  c.append(h('h1', null, '📁 Projekt – przygotowanie'), h('p', { class: 'muted' }, P.intro));
  c.append(h('div', { class: 'note exam' }, h('b', { class: 'lbl' }, 'Ważna zasada prowadzącej'), h('div', { html: P.aiRule })));
  c.append(h('h2', { style: { marginTop: '24px' } }, 'Terminy'), h('div', { class: 'card flat' }, P.deadlines.map(d => h('div', { class: 'row spread', style: { padding: '5px 0' } }, h('span', null, d[0]), h('b', null, fmtDate(d[1]) + ' (' + (daysTo(d[1]).past ? 'minęło' : 'za ' + daysTo(d[1]).d + ' dni') + ')')))));
  const st = Store.data.project; st.checked = st.checked || {};
  const doneN = P.requirements.filter(r => st.checked[r.id]).length;
  c.append(h('h2', { style: { marginTop: '24px' } }, 'Lista wymagań (' + doneN + ' / ' + P.requirements.length + ')'),
    h('p', { class: 'muted small' }, 'Zaznaczaj to, co masz już w swoim projekcie. Niespełnienie którejkolwiek z pierwszych pozycji „koniecznych” = 0 punktów. Przy każdym wymaganiu jest odnośnik do lekcji, w której go przećwiczysz.'),
    h('div', { class: 'progress', style: { margin: '8px 0 14px' } }, h('i', { style: { width: (doneN / P.requirements.length * 100) + '%' } })));
  const box = h('div', { class: 'card flat', style: { padding: 0 } });
  P.requirements.forEach(r => {
    const cb = h('input', { type: 'checkbox' }); cb.checked = !!st.checked[r.id];
    cb.onchange = () => { st.checked[r.id] = cb.checked; Store.save(); route(); };
    box.append(h('div', { class: 'checkrow' }, cb, h('div', null, h('b', { html: r.text }), r.must ? h('span', { class: 'badge crit', style: { marginLeft: '8px' } }, 'konieczne') : null,
      r.tip ? h('div', { class: 'muted small', html: r.tip }) : null,
      r.lessons ? h('div', null, r.lessons.map(id => Idx.lessons[id] ? h('a', { class: 'tag', href: '#/lesson/' + id }, '📖 ' + Idx.lessons[id].title) : null)) : null)));
  });
  c.append(box);
  c.append(h('h2', { style: { marginTop: '28px' } }, 'Jak przygotować się do obrony'), h('div', { class: 'card flat' }, h('ul', null, P.defenseTips.map(t => h('li', { html: t })))));
  c.append(h('h2', { style: { marginTop: '28px' } }, 'Fiszki: pytania obronne'), h('p', { class: 'muted small' }, 'Podczas obrony możesz usłyszeć pytania o projekt, prośbę o modyfikację albo napisanie podobnego kodu. Odpowiedz na głos, zanim odwrócisz fiszkę.'));
  let i = 0;
  const fl = h('div', { class: 'flash' }); let shown = false;
  const draw = () => { const q = P.flashcards[i]; fl.innerHTML = ''; fl.append(h('div', null, h('div', { class: 'muted small' }, 'Pytanie ' + (i + 1) + ' / ' + P.flashcards.length), h('div', { style: { fontWeight: 700, margin: '8px 0' }, html: q[0] }), shown ? h('div', { class: 'note tip', style: { textAlign: 'left' }, html: q[1] }) : h('div', { class: 'muted small' }, '(kliknij, aby zobaczyć odpowiedź)'))); };
  fl.onclick = () => { shown = !shown; draw(); };
  draw();
  c.append(fl, h('div', { class: 'row', style: { marginTop: '10px' } }, h('button', { class: 'btn', onclick: () => { i = (i - 1 + P.flashcards.length) % P.flashcards.length; shown = false; draw(); } }, '←'), h('button', { class: 'btn', onclick: () => { i = (i + 1) % P.flashcards.length; shown = false; draw(); } }, '→'), h('button', { class: 'btn', onclick: () => { i = Math.floor(Math.random() * P.flashcards.length); shown = false; draw(); } }, '🔀 Losowa')));
  app.append(c);
}

/* ---------- USTAWIENIA ---------- */
function viewSettings(app) {
  const c = h('div', { class: 'container narrow' });
  c.append(h('h1', null, '⚙️ Ustawienia'));
  const jdkBox = h('div', { class: 'card' });
  const drawJdk = () => {
    jdkBox.innerHTML = '';
    const j = Api.jdk || {};
    jdkBox.append(h('h3', null, 'Kompilator Javy (JDK)'),
      j.found ? h('p', null, '✅ Znaleziono JDK ', h('b', null, j.version), h('br'), h('span', { class: 'muted small' }, j.home)) :
        h('p', null, '❌ Nie znaleziono JDK. Zainstaluj IntelliJ IDEA (zawiera JDK) lub JDK 21, albo utwórz plik ', h('code', null, 'config.json'), ' z wpisem ', h('code', null, '{"jdkHome": "C:\\\\ścieżka\\\\do\\\\jdk"}'), ' obok server.js.'),
      h('button', { class: 'btn small', onclick: async () => { await Api.status(true); updateJdkPill(); drawJdk(); } }, 'Wykryj ponownie'));
  };
  drawJdk(); c.append(jdkBox);
  const sw = (label, desc, key, def) => {
    const cb = h('input', { type: 'checkbox' }); cb.checked = Store.setting(key, def);
    cb.onchange = () => Store.setSetting(key, cb.checked);
    return h('label', { class: 'checkrow', style: { cursor: 'pointer' } }, cb, h('div', null, h('b', null, label), h('div', { class: 'muted small' }, desc)));
  };
  const minIn = h('input', { type: 'number', min: 10, max: 180, value: Store.setting('examMinutes', 60), style: { width: '80px' } });
  minIn.onchange = () => Store.setSetting('examMinutes', Math.max(10, Math.min(180, +minIn.value || 60)));
  c.append(h('div', { class: 'card', style: { marginTop: '16px', padding: 0 } },
    sw('Odblokuj sprawdziany od razu', 'Domyślnie odblokowują się po ukończeniu całego materiału.', 'unlockTests', false),
    sw('Tryb treningowy sprawdzianów (kompilator w zadaniach)', 'Domyślnie zadania programistyczne pisze się bez uruchamiania kodu, jak na kartce.', 'examCompiler', false),
    h('div', { class: 'checkrow' }, h('div', null, h('b', null, 'Czas sprawdzianu (minuty): '), minIn))));
  const file = h('input', { type: 'file', accept: '.json', hidden: true });
  file.onchange = () => { const f = file.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { const d = JSON.parse(r.result); if (d.v !== 1) throw new Error('format'); Store.data = d; Store.save(); toast('Zaimportowano postęp'); route(); } catch (e) { toast('Niepoprawny plik'); } }; r.readAsText(f); };
  c.append(h('div', { class: 'card', style: { marginTop: '16px' } }, h('h3', null, 'Twój postęp'),
    h('p', { class: 'muted small' }, 'Zapisuje się automatycznie w pliku data/progress.json obok aplikacji.'),
    h('div', { class: 'row' },
      h('button', { class: 'btn', onclick: () => { const a = h('a', { href: URL.createObjectURL(new Blob([JSON.stringify(Store.data, null, 1)], { type: 'application/json' })), download: 'java-akademia-postep.json' }); a.click(); } }, '⬇ Eksportuj'),
      h('button', { class: 'btn', onclick: () => file.click() }, '⬆ Importuj'), file,
      h('button', { class: 'btn danger', onclick: () => { if (confirm('Na pewno usunąć CAŁY postęp (lekcje, zadania, sprawdziany)?')) { Store.reset(); toast('Postęp wyzerowany'); location.hash = '#/'; route(); } } }, 'Wyzeruj postęp'))));
  app.append(c);
}
