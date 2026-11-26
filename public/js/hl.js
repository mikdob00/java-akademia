'use strict';
(function () {
  const KW = new Set(('abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while var true false null').split(' '));
  const RE = /(\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$))|("(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?)|(@\w+)|(\b\d[\d_]*(?:\.\d+)?[fFdDlL]?\b)|([A-Za-z_$][\w$]*)/g;
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function highlight(code) {
    let out = '', last = 0, m;
    RE.lastIndex = 0;
    while ((m = RE.exec(code))) {
      out += esc(code.slice(last, m.index));
      const t = m[0];
      if (m[1]) out += '<span class="cm">' + esc(t) + '</span>';
      else if (m[2]) out += '<span class="str">' + esc(t) + '</span>';
      else if (m[3]) out += '<span class="an">' + esc(t) + '</span>';
      else if (m[4]) out += '<span class="num">' + esc(t) + '</span>';
      else {
        const next = code[m.index + t.length];
        if (KW.has(t)) out += '<span class="kw">' + t + '</span>';
        else if (/^[A-Z]/.test(t)) out += '<span class="ty">' + t + '</span>';
        else if (next === '(') out += '<span class="fn">' + t + '</span>';
        else out += t;
      }
      last = m.index + t.length;
    }
    return out + esc(code.slice(last));
  }
  window.Hl = { highlight, esc };
})();
