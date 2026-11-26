'use strict';
/* ===== Wspólne narzędzia, magazyn postępu, API, ocenianie, lista powtórek ===== */
function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  if (attrs) for (const k in attrs) {
    const v = attrs[k];
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'text') el.textContent = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, v);
  }
  const add = k => {
    if (k == null || k === false) return;
    if (Array.isArray(k)) return k.forEach(add);
    el.appendChild(k.nodeType ? k : document.createTextNode(String(k)));
  };
  kids.forEach(add);
  return el;
}
const $ = (s, r) => (r || document).querySelector(s);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toast._t); toast._t = setTimeout(() => { t.hidden = true; }, 2600);
}
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

/* ---------- indeks treści ---------- */
const Idx = {
  lessons: {}, labs: {}, modOfLesson: {}, modOfLab: {}, lessonList: [],
  build() {
    finalizeContent();
    this.lessons = {}; this.labs = {}; this.lessonList = [];
    ACAD.modules.sort((a, b) => a.num - b.num);
    for (const m of ACAD.modules) {
      for (const l of m.lessons) { this.lessons[l.id] = l; this.modOfLesson[l.id] = m; this.lessonList.push(l); }
      for (const lb of (m.labs || [])) { this.labs[lb.id] = lb; this.modOfLab[lb.id] = m; }
    }
  },
  module: id => ACAD.modules.find(m => m.id === id),
};

/* ---------- ocena ---------- */
const W = { critical: 3, medium: 2, minor: 1 };
const SEV = {
  critical: { label: 'Poważny', icon: '🔴', desc: 'Dotyczy zrozumienia kluczowej koncepcji lub program nie działa' },
  medium: { label: 'Średni', icon: '🟠', desc: 'Koncepcja jest znana, ale wykonanie ma istotny błąd' },
  minor: { label: 'Powierzchowny', icon: '🟡', desc: 'Format, nazwa, konwencja – drobiazg' },
};
function gradeOf(p) {
  if (p >= 90) return '5';
  if (p >= 80) return '4,5';
  if (p >= 70) return '4';
  if (p >= 60) return '3,5';
  if (p >= 50) return '3';
  return '2';
}
function scoreChecks(checks, resultMap) {
  let got = 0, tot = 0;
  for (const c of checks) { const w = W[c.sev] || 1; tot += w; if (resultMap[c.id]) got += w; }
  return tot ? Math.round(got / tot * 1000) / 10 : 0;
}
function scoreClass(p) { return p >= 80 ? 'good' : p >= 50 ? 'mid' : 'low'; }

/* ---------- magazyn ---------- */
const Store = {
  data: { v: 1, lessons: {}, labs: {}, quizzes: {}, tests: {}, reviewed: {}, project: {}, settings: {} },
  async load() {
    let d = null;
    try { const r = await fetch('/api/progress'); const j = await r.json(); d = j.data; } catch (e) { /* offline */ }
    if (!d) { try { d = JSON.parse(localStorage.getItem('javaakademia') || 'null'); } catch (e) { /* */ } }
    if (d && d.v === 1) this.data = Object.assign(this.data, d);
  },
  _push: debounce(async function () {
    const s = JSON.stringify(Store.data);
    try { localStorage.setItem('javaakademia', s); } catch (e) { /* */ }
    try { await fetch('/api/progress', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: s }); } catch (e) { /* */ }
  }, 400),
  save() { this._push(); },
  lesson(id) { return this.data.lessons[id] || (this.data.lessons[id] = {}); },
  lab(id) { return this.data.labs[id] || (this.data.labs[id] = {}); },
  quiz(id) { return this.data.quizzes[id] || (this.data.quizzes[id] = {}); },
  test(id) { return this.data.tests[id] || (this.data.tests[id] = { attempts: [] }); },
  setting(k, d) { const v = this.data.settings[k]; return v === undefined ? d : v; },
  setSetting(k, v) { this.data.settings[k] = v; this.save(); },
  reset() { this.data = { v: 1, lessons: {}, labs: {}, quizzes: {}, tests: {}, reviewed: {}, project: {}, settings: this.data.settings }; this.save(); },
};

/* ---------- API ---------- */
const Api = {
  jdk: null,
  async status(refresh) {
    try { const r = await fetch('/api/status' + (refresh ? '?refresh=1' : '')); this.jdk = (await r.json()).jdk; } catch (e) { this.jdk = { found: false, offline: true }; }
    return this.jdk;
  },
  async post(path, body) {
    const r = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    return r.json();
  },
  run(files, main, stdin) { return this.post('/api/run', { files, main, stdin }); },
  check(files, checks, prelude) { return this.post('/api/check', { files, checks: checks.map(c => ({ code: c.code })), prelude }); },
};

/* ---------- tłumaczenie błędów javac ---------- */
function explainJavac(e) {
  const m = e.msg;
  const sym = (e.extra || []).find(x => /symbol:/.test(x));
  let r;
  if (/cannot find symbol/.test(m)) return 'Nie znaleziono symbolu' + (sym ? ' (' + sym.trim().replace(/^symbol:\s*/, '') + ')' : '') + '. Sprawdź literówki, wielkość liter, czy zmienna/metoda jest zadeklarowana i czy masz potrzebny import.';
  if (/';' expected/.test(m)) return 'Brakuje średnika „;” – zwykle na końcu tej lub poprzedniej linii.';
  if (/'\)' expected|'\(' expected|'\]' expected|'\{' expected|'\}' expected/.test(m)) return 'Niedomknięty lub brakujący nawias – sprawdź parowanie ( ) { } [ ].';
  if ((r = /incompatible types: (.*) cannot be converted to (.*)/.exec(m))) return 'Niezgodne typy: wartości typu ' + r[1] + ' nie da się użyć tam, gdzie oczekiwany jest ' + r[2] + '.';
  if ((r = /possible lossy conversion from (\w+) to (\w+)/.exec(m))) return 'Utrata precyzji (' + r[1] + ' → ' + r[2] + '). Użyj odpowiedniego typu albo jawnego rzutowania.';
  if (/missing return statement/.test(m)) return 'Metoda ma zwracać wartość na KAŻDEJ ścieżce – brakuje instrukcji return.';
  if (/is public, should be declared in a file named/.test(m)) return 'Klasa publiczna musi leżeć w pliku o tej samej nazwie (Klasa.java).';
  if (/non-static .* cannot be referenced from a static context/.test(m)) return 'Z metody statycznej nie można użyć elementu niestatycznego bez obiektu (np. w main utwórz obiekt przez new).';
  if (/constructor .* cannot be applied to given types|no suitable constructor/.test(m)) return 'Wywołanie konstruktora nie pasuje do żadnego zdefiniowanego – zła liczba lub typy argumentów (a może brakuje konstruktora?).';
  if (/method .* cannot be applied to given types|no suitable method/.test(m)) return 'Wywołanie metody nie pasuje do jej definicji – zła liczba lub typy argumentów.';
  if (/has private access in/.test(m)) return 'To pole/metoda jest prywatne – spoza klasy nie ma do niego dostępu. Użyj gettera/settera.';
  if (/unreported exception/.test(m)) return 'Wyjątek „checked” trzeba obsłużyć w try/catch albo zadeklarować w metodzie przez throws.';
  if (/is abstract; cannot be instantiated/.test(m)) return 'Nie można tworzyć obiektów klasy abstrakcyjnej/interfejsu przez new.';
  if (/is not abstract and does not override abstract method/.test(m)) return 'Klasa nieabstrakcyjna musi zaimplementować WSZYSTKIE metody abstrakcyjne z nadklasy/interfejsu.';
  if (/method does not override or implement a method from a supertype/.test(m)) return '@Override, ale w nadklasie/interfejsie nie ma takiej metody (literówka w nazwie albo inne parametry?).';
  if (/already defined/.test(m)) return 'Ta nazwa została już zadeklarowana w tym zakresie.';
  if (/might not have been initialized/.test(m)) return 'Zmienna może zostać użyta bez przypisania wartości.';
  if (/class, interface, enum, or record expected/.test(m)) return 'Za dużo nawiasów „}” albo kod leży poza klasą.';
  if (/reached end of file while parsing/.test(m)) return 'Brakuje zamykającego nawiasu „}” (plik kończy się za wcześnie).';
  if (/illegal start of expression/.test(m)) return 'Niedozwolona konstrukcja w tym miejscu – często brakujący nawias lub średnik wcześniej.';
  if (/unclosed string literal/.test(m)) return 'Napis w cudzysłowie nie został zamknięty.';
  if (/bad operand types|incomparable types/.test(m)) return 'Operator nie pasuje do tych typów (np. porównanie/dodawanie niezgodnych typów).';
  if (/is never thrown in body of corresponding try/.test(m)) return 'Łapiesz wyjątek, który w bloku try nigdy nie może wystąpić.';
  if (/call to super must be first statement|call to this must be first statement/.test(m)) return 'super(...) / this(...) musi być PIERWSZĄ instrukcją konstruktora.';
  if (/has already been caught/.test(m)) return 'Kolejność catch: najpierw wyjątki najbardziej szczegółowe, na końcu ogólne (Exception).';
  if (/cannot be dereferenced/.test(m)) return 'Na typie prostym (int, double…) nie wywołuje się metod przez kropkę.';
  if (/array required, but/.test(m)) return 'Operator [] działa tylko na tablicach.';
  if (/not a statement/.test(m)) return 'To nie jest poprawna instrukcja (brakuje np. przypisania lub wywołania).';
  if (/does not take parameters/.test(m)) return 'Ta metoda/typ nie przyjmuje parametrów.';
  if (/variable .* is already defined/.test(m)) return 'Zmienna o tej nazwie już istnieje w tym zakresie.';
  if (/class .* is already defined|duplicate class/.test(m)) return 'Klasa o tej nazwie jest już zdefiniowana (w innym pliku?).';
  if (/attempting to assign weaker access privileges/.test(m)) return 'Nadpisując metodę nie można zawęzić jej dostępu (np. metoda interfejsu musi być public).';
  if (/cannot inherit from final/.test(m)) return 'Nie można dziedziczyć po klasie oznaczonej final.';
  if (/is not within bounds of type-variable/.test(m)) return 'Ten typ nie spełnia ograniczenia typu generycznego (np. T extends Comparable<T>).';
  return '';
}

/* ---------- lista powtórek (wyliczana z zapisanych wyników) ---------- */
function allQuestionsOfModule(m) { return (m.quiz || []); }

function collectIssues() {
  const out = [];
  const push = (lessonId, sev, text, src, route, ts) => { if (Idx.lessons[lessonId]) out.push({ lessonId, sev, text, src, route, ts: ts || 0 }); };
  for (const l of Idx.lessonList) {
    const st = Store.data.lessons[l.id]; if (!st) continue;
    const ex = l.exercise;
    if (ex && st.last) {
      if (st.last.compileFail) push(l.id, 'critical', 'Kod z ćwiczenia nie kompilował się przy ostatniej próbie', 'Lekcja: ' + l.title, '#/lesson/' + l.id, st.last.ts);
      else for (const c of ex.checks) if (st.last.checks && st.last.checks[c.id] === false) push(l.id, c.sev, c.label, 'Ćwiczenie: ' + l.title, '#/lesson/' + l.id, st.last.ts);
    }
    if (st.solutionViewed) push(l.id, st.done ? 'minor' : 'medium', 'Zajrzałeś do rozwiązania – spróbuj zrobić to ćwiczenie samodzielnie od zera', 'Lekcja: ' + l.title, '#/lesson/' + l.id, st.solutionTs);
    (l.quiz || []).forEach((q, i) => { const a = st.quiz && st.quiz[i]; if (a && a.ok === false) push(l.id, q.sev || 'medium', q.q, 'Quiz w lekcji: ' + l.title, '#/lesson/' + l.id, a.ts); });
  }
  for (const m of ACAD.modules) {
    for (const lb of (m.labs || [])) {
      const st = Store.data.labs[lb.id]; if (!st || !st.last) continue;
      if (st.last.compileFail) push(lb.concepts[0], 'critical', 'Zadanie „' + lb.title + '” – kod się nie kompilował', 'Zadanie: ' + lb.title, '#/lab/' + lb.id, st.last.ts);
      else for (const c of lb.checks) if (st.last.checks && st.last.checks[c.id] === false) push(c.concept || lb.concepts[0], c.sev, c.label, 'Zadanie: ' + lb.title, '#/lab/' + lb.id, st.last.ts);
      if (st.solutionViewed) push(lb.concepts[0], 'minor', 'Zajrzałeś do rozwiązania zadania „' + lb.title + '”', 'Zadanie: ' + lb.title, '#/lab/' + lb.id, st.solutionTs);
    }
    const qs = Store.data.quizzes[m.id];
    if (qs && qs.last && m.quiz) m.quiz.forEach((q, i) => { if (qs.last.ok && qs.last.ok[i] === false) push(q.concept, q.sev || 'medium', q.q, 'Quiz modułu: ' + m.title, '#/quiz/' + m.id, qs.last.ts); });
  }
  for (const t of ACAD.tests) {
    const ts = Store.data.tests[t.id]; if (!ts || !ts.attempts.length) continue;
    const a = ts.attempts[ts.attempts.length - 1];
    (a.wrong || []).forEach(w => push(w.concept, w.sev || 'medium', w.text, 'Sprawdzian: ' + t.title, '#/test/' + t.id + '/result', a.ts));
  }
  return out;
}

function reviewGroups() {
  const iss = collectIssues();
  const by = {};
  for (const i of iss) {
    const rv = Store.data.reviewed[i.lessonId];
    if (rv && i.ts && i.ts <= rv) continue;
    (by[i.lessonId] = by[i.lessonId] || []).push(i);
  }
  const rank = { critical: 0, medium: 1, minor: 2 };
  const groups = Object.keys(by).map(id => {
    const items = by[id];
    const sev = items.reduce((a, b) => (rank[b.sev] < rank[a] ? b.sev : a), 'minor');
    return { lessonId: id, lesson: Idx.lessons[id], sev, items };
  });
  groups.sort((a, b) => rank[a.sev] - rank[b.sev] || b.items.length - a.items.length);
  return groups;
}

/* ---------- postęp ---------- */
function isMicro(l) { return !!(l.micro || l.guide); }
function lessonStatus(l) {
  const st = Store.data.lessons[l.id] || {};
  if (isMicro(l)) {
    const quizOk = !(l.quiz && l.quiz.length) || (st.quiz && Object.keys(st.quiz).length >= l.quiz.length);
    if ((!l.guide || st.guided) && (!l.exercise || st.done) && quizOk && st.theory) return 'done';
  } else if (st.done) return 'done';
  if (st.theory || st.guided || st.last || (st.quiz && Object.keys(st.quiz).length)) return 'part';
  return 'new';
}
function labStatus(lb) {
  const st = Store.data.labs[lb.id];
  if (!st || !st.last) return 'new';
  return st.last.pct >= 70 ? 'done' : 'part';
}
function quizStatus(m) { const q = Store.data.quizzes[m.id]; return q && q.last ? (q.last.pct >= 70 ? 'done' : 'part') : 'new'; }
function moduleProgress(m) {
  const total = m.lessons.length + (m.labs || []).length + (m.quiz ? 1 : 0);
  let done = 0;
  m.lessons.forEach(l => { if (lessonStatus(l) === 'done') done++; });
  (m.labs || []).forEach(lb => { if (labStatus(lb) !== 'new') done++; });
  if (m.quiz && quizStatus(m) !== 'new') done++;
  return { done, total, pct: total ? Math.round(done / total * 100) : 0 };
}
function overall() {
  let done = 0, total = 0;
  ACAD.modules.forEach(m => { const p = moduleProgress(m); done += p.done; total += p.total; });
  return { done, total, pct: total ? Math.round(done / total * 100) : 0 };
}
function materialDone() {
  return ACAD.modules.every(m => m.lessons.every(l => lessonStatus(l) === 'done') && (m.labs || []).every(lb => labStatus(lb) !== 'new'));
}
function nextStep() {
  for (const m of ACAD.modules) {
    for (const l of m.lessons) if (lessonStatus(l) !== 'done') return { route: '#/lesson/' + l.id, label: 'Lekcja: ' + l.title, mod: m };
    for (const lb of (m.labs || [])) if (labStatus(lb) === 'new') return { route: '#/lab/' + lb.id, label: 'Zadanie: ' + lb.title, mod: m };
    if (m.quiz && quizStatus(m) === 'new') return { route: '#/quiz/' + m.id, label: 'Quiz: ' + m.title, mod: m };
  }
  return null;
}
