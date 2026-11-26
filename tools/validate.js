'use strict';
/* Walidacja treści: rozwiązania wzorcowe muszą przechodzić WSZYSTKIE testy,
   kody startowe nie mogą ich przechodzić, przykłady z teorii muszą się kompilować,
   pytania „co wypisze program” muszą mieć poprawną odpowiedź zgodną z prawdziwym wynikiem.
   Użycie:  node tools/validate.js [fragment-nazwy-pliku]   np.  node tools/validate.js m01 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const server = require('../server.js');

const ROOT = path.join(__dirname, '..', 'public');
const filter = process.argv[2] || '';
const ctx = { console };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/content-helpers.js'), 'utf8'), ctx, { filename: 'content-helpers.js' });
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const files = [...html.matchAll(/src="(content\/[^"]+)"/g)].map(m => m[1]);
let loadErrors = 0;
for (const f of files) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) { console.log('  (brak pliku ' + f + ')'); continue; }
  try { vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: f }); }
  catch (e) { console.log('BŁĄD ŁADOWANIA ' + f + ': ' + e.message); loadErrors++; }
}
vm.runInContext('finalizeContent()', ctx);
const ACAD = ctx.ACAD;

const jobs = [];
const problems = [];
const lessonIds = new Set();
ACAD.modules.forEach(m => m.lessons.forEach(l => lessonIds.add(l.id)));

function problem(where, msg) { problems.push(where + ' :: ' + msg); }
function weight(s) { return { critical: 3, medium: 2, minor: 1 }[s] || 1; }

function addTask(where, files0, solution, checks, prelude, opts) {
  opts = opts || {};
  if (!checks || !checks.length) { problem(where, 'brak testów'); return; }
  checks.forEach((c, i) => {
    if (!c.concept || !lessonIds.has(c.concept)) problem(where, 'test ' + i + ' ma nieznane concept: ' + c.concept);
    if (!['critical', 'medium', 'minor'].includes(c.sev)) problem(where, 'test ' + i + ' ma złą wagę ' + c.sev);
  });
  jobs.push(async () => {
    const r = await server.runCheck({ files: solution, checks, prelude });
    if (r.phase === 'compile') problem(where, 'ROZWIĄZANIE SIĘ NIE KOMPILUJE: ' + r.compile.errors.map(e => e.file + ':' + e.line + ' ' + e.msg).join(' | '));
    else if (r.phase !== 'check') problem(where, 'rozwiązanie: ' + (r.error || r.phase));
    else {
      r.results.forEach((x, i) => { if (!x.pass) problem(where, 'rozwiązanie NIE przechodzi testu #' + i + ' „' + checks[i].label + '”: ' + x.msg + (x.nocompile ? ' [nocompile ' + (x.extra || []).join(' ') + ']' : '')); });
    }
    if (!opts.skipStarter) {
      const s = await server.runCheck({ files: files0, checks, prelude });
      if (s.phase === 'compile') { /* kod startowy może się nie kompilować – to w porządku */ }
      else if (s.phase !== 'check') problem(where, 'starter: ' + (s.error || s.phase));
      else if (s.results.every(x => x.pass)) problem(where, 'KOD STARTOWY PRZECHODZI WSZYSTKIE TESTY (ćwiczenie nic nie sprawdza)');
    }
  });
}
function addRun(where, code, stdin, expected) {
  jobs.push(async () => {
    const r = await server.runProgram({ files: [{ name: 'Main.java', code }], main: 'Main', stdin: stdin || '' });
    if (r.phase === 'compile') return problem(where, 'PRZYKŁAD SIĘ NIE KOMPILUJE: ' + r.compile.errors.map(e => e.line + ' ' + e.msg).join(' | '));
    if (r.timedOut) return problem(where, 'przykład: timeout');
    if (r.stderr && !opts_allowStderr(code)) return problem(where, 'przykład: stderr: ' + r.stderr.split('\n')[0]);
    if (expected != null) {
      const act = r.stdout.replace(/\r/g, '').trim(), exp = String(expected).replace(/\r/g, '').trim();
      if (act !== exp) problem(where, 'zły wynik przykładu.\n     oczekiwano: ' + JSON.stringify(exp) + '\n     otrzymano:  ' + JSON.stringify(act));
    }
  });
}
function opts_allowStderr(code) { return /Exception|Error/.test(code) && /catch|uncaught|throw/.test(code); }

function addOutputQuestion(where, q) {
  jobs.push(async () => {
    const r = await server.runProgram({ files: [{ name: 'Main.java', code: q.code }], main: 'Main', stdin: q.stdin || '' });
    if (r.phase === 'compile') return problem(where, 'KOD PYTANIA SIĘ NIE KOMPILUJE: ' + r.compile.errors.map(e => e.line + ' ' + e.msg).join(' | '));
    const act = r.stdout.replace(/\r/g, '').trim() + (q.withErr ? '\n' + r.stderr.split('\n')[0] : '');
    const norm = s => s.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim();
    const right = q.a.map(i => norm(q.o[i]));
    if (q.a.length !== 1) problem(where, 'pytanie „co wypisze” powinno mieć jedną poprawną odpowiedź');
    if (right[0] !== act) problem(where, 'zła odpowiedź w pytaniu.\n     zaznaczona jako poprawna: ' + JSON.stringify(right[0]) + '\n     prawdziwy wynik:          ' + JSON.stringify(act));
    const dup = new Set(q.o.map(norm)); if (dup.size !== q.o.length) problem(where, 'powtarzające się opcje');
  });
}

function checkQuestion(where, q) {
  if (!q.o || q.o.length < 2) problem(where, 'za mało opcji');
  if (!q.a || !q.a.length || q.a.some(i => i < 0 || i >= q.o.length)) problem(where, 'zły indeks odpowiedzi');
  if (!q.concept || !lessonIds.has(q.concept)) problem(where, 'nieznane concept: ' + q.concept);
  if (!q.why) problem(where, 'brak wyjaśnienia');
}

for (const m of ACAD.modules) {
  if (filter && !('m' + String(m.num).padStart(2, '0') + '-' + m.id).includes(filter) && filter !== 'all') continue;
  const seen = new Set();
  for (const l of m.lessons) {
    const w = m.num + '/' + l.id;
    if (seen.has(l.id)) problem(w, 'powtórzone id lekcji'); seen.add(l.id);
    (l.content || []).forEach((b, i) => { if (b.t === 'code' && b.run) addRun(w + ' blok#' + i, b.x, b.stdin, b.out); });
    (l.quiz || []).forEach((q, i) => { checkQuestion(w + ' quiz#' + i, q); if (q.code && /^Co wypisze/.test(q.q)) addOutputQuestion(w + ' quiz#' + i, q); });
    if (l.guide) {
      const g = l.guide;
      if (!g.steps || !g.steps.length) problem(w, 'krok po kroku: brak kroków');
      const strip = c => c.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '').replace(/\s+/g, ' ');
      const solSrc = strip(g.solution.map(f => f.code).join('\n')), startSrc = strip(g.files.map(f => f.code).join('\n'));
      let startAll = true;
      (g.steps || []).forEach((s, i) => {
        if (!s.say || !s.expect) problem(w, 'krok ' + (i + 1) + ': brak say/expect');
        let re; try { re = new RegExp(s.expect); } catch (e) { return problem(w, 'krok ' + (i + 1) + ': zły regex'); }
        if (!re.test(solSrc)) problem(w, 'krok ' + (i + 1) + ': rozwiązanie NIE spełnia expect ' + s.expect);
        if (!re.test(startSrc)) startAll = false;
      });
      if (startAll) problem(w, 'krok po kroku: kod startowy spełnia wszystkie kroki');
      addTask(w + ' krok po kroku', g.files, g.solution, g.checks, g.prelude);
    }
    if (!l.exercise) { if (!l.micro) problem(w, 'brak ćwiczenia'); continue; }
    addTask(w + ' ćwiczenie', l.exercise.files, l.exercise.solution, l.exercise.checks, l.exercise.prelude);
  }
  (m.labs || []).forEach(lb => addTask(m.num + '/' + lb.id + ' LAB', lb.files, lb.solution, lb.checks, lb.prelude));
  (m.quiz || []).forEach((q, i) => { checkQuestion(m.num + ' quiz modułu#' + i, q); if (q.code && /^Co wypisze/.test(q.q)) addOutputQuestion(m.num + ' quiz modułu#' + i, q); });
  if (!m.quiz) problem('M' + m.num, 'brak quizu modułu');
}
if (!filter || filter === 'all' || filter.startsWith('t')) {
  for (const t of ACAD.tests) {
    t.questions.forEach((q, i) => {
      const w = t.id + ' pyt#' + i;
      checkQuestion(w, q);
      if (q.kind === 'output') addOutputQuestion(w, q);
    });
    t.tasks.forEach(tk => addTask(t.id + '/' + tk.id + ' ZADANIE', tk.files, tk.solution, tk.checks, tk.prelude));
  }
}

(async () => {
  const jdk = server.findJdk();
  if (!jdk.found) { console.log('Brak JDK'); process.exit(2); }
  console.log('Zadań do sprawdzenia: ' + jobs.length + ' (JDK ' + jdk.version + ')');
  let i = 0, done = 0;
  const worker = async () => { while (i < jobs.length) { const k = i++; try { await jobs[k](); } catch (e) { problem('job ' + k, 'wyjątek: ' + e.message); } done++; if (done % 20 === 0) process.stdout.write('.'); } };
  await Promise.all([worker(), worker(), worker(), worker()]);
  console.log('\n');
  if (!problems.length && !loadErrors) console.log('OK – brak problemów.');
  else { problems.forEach(p => console.log(' ✗ ' + p)); console.log('\nProblemów: ' + problems.length); }
  process.exit(problems.length || loadErrors ? 1 : 0);
})();
