'use strict';
/* Pomocnicze funkcje do zapisu treści (używane też przez tools/validate.js) */
var ACAD = (typeof window !== 'undefined' && window.ACAD) || { modules: [], tests: [], project: null };
if (typeof window !== 'undefined') window.ACAD = ACAD;
var J = String.raw;
var CR = 'critical', MD = 'medium', MN = 'minor';

function Q(q, o, a, why, concept, extra) {
  return Object.assign({ q: q, o: o, a: Array.isArray(a) ? a : [a], why: why || '', concept: concept }, extra || {});
}
function CK(sev, label, code, concept) { return { sev: sev, label: label, code: code, concept: concept }; }

function finalizeChecks(checks, defConcept) {
  (checks || []).forEach(function (c, i) { c.id = 'c' + i; if (!c.concept) c.concept = defConcept; });
}
function finalizeContent() {
  ACAD.modules.forEach(function (m) {
    m.lessons.forEach(function (l) {
      var ex = ACAD.explain && ACAD.explain[l.id];
      if (ex && !l.explained) { l.explained = true; l.content = (ex.start || []).concat(l.content, ex.end || []); }
      if (l.exercise) finalizeChecks(l.exercise.checks, l.id);
      if (l.guide && l.guide.checks) finalizeChecks(l.guide.checks, l.id);
      (l.quiz || []).forEach(function (q) { if (!q.concept) q.concept = l.id; });
    });
    (m.labs || []).forEach(function (lb) { finalizeChecks(lb.checks, lb.concepts[0]); });
    (m.quiz || []).forEach(function (q) { if (!q.concept) q.concept = m.lessons[0].id; });
  });
  ACAD.tests.forEach(function (t) {
    t.tasks.forEach(function (tk) { finalizeChecks(tk.checks, tk.concepts[0]); });
  });
}

/* Skróty do pisania mikrolekcji */
function ANA(icon, x) { return { t: 'analogy', icon: icon, title: 'Wyobraź to sobie tak', x: x }; }
function VIZ(kind, o) { o.t = 'viz'; o.kind = kind; return o; }
function TERMS(rows) { return { t: 'terms', x: rows }; }
function PP(x) { return { t: 'p', x: x }; }
function LI(x) { return { t: 'ul', x: x }; }
function NOTE(k, x) { return { t: 'note', k: k, x: x }; }
function CODE(x, out, o) { return Object.assign({ t: 'code', run: true, title: 'Main.java', out: out, x: x }, o || {}); }
function WALK(code, notes, title) { return { t: 'walk', title: title || '🔍 Przeczytaj kod linijka po linijce', code: code, notes: notes }; }
function FL(name, code) { return { name: name, code: code }; }
function OUTQ(q, o, a, why, code) { return Q(q, o, a, why, undefined, { code: code }); }
function MAINW(lines) { return 'public class Main {\n    public static void main(String[] args) {\n' + lines.map(function (l) { return '        ' + l + '\n'; }).join('') + '    }\n}\n'; }
