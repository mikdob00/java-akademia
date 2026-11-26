'use strict';
/* Wyjaśnienia „po ludzku”, analogie i obrazki – moduły 5–8. */
(function () {
  var E = ACAD.explain = ACAD.explain || {};
  function put(id, start, end) { E[id] = { start: start, end: end || [] }; }
  function A(icon, x) { return { t: 'analogy', icon: icon, title: 'Wyobraź to sobie tak', x: x }; }
  function V(kind, o) { o.t = 'viz'; o.kind = kind; return o; }
  function W(code, notes, title) { return { t: 'walk', title: title || '🔍 Ten sam kod – linijka po linijce', code: code, notes: notes }; }
  function T(rows) { return { t: 'terms', x: rows }; }

})();
