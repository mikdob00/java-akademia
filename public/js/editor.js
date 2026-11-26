'use strict';
/* ===== Prosty edytor kodu Java: wiele plików, kolorowanie, numeracja, wcięcia ===== */
function createEditor(opts) {
  opts = opts || {};
  const st = { files: (opts.files || []).map(f => ({ name: f.name, code: f.code })), active: 0, errors: {} };
  const fixed = new Set((opts.files || []).map(f => f.name));

  const tabs = h('div', { class: 'ed-tabs' });
  const gutter = h('div', { class: 'gutter' });
  const pre = h('pre', { class: 'hl', 'aria-hidden': 'true' });
  const ta = h('textarea', { spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', wrap: 'off' });
  if (opts.readOnly) ta.readOnly = true;
  const ed = h('div', { class: 'ed' + (opts.readOnly ? ' ro' : '') }, gutter, h('div', { class: 'lay' }, pre, ta));
  const el = h('div', { class: 'ed-wrap' }, tabs, ed);

  function cur() { return st.files[st.active]; }

  function drawTabs() {
    tabs.innerHTML = '';
    st.files.forEach((f, i) => {
      const hasErr = st.errors[f.name] && st.errors[f.name].size;
      const t = h('div', { class: 'ed-tab' + (i === st.active ? ' active' : '') + (hasErr ? ' err' : ''), onclick: () => { st.active = i; load(); } }, f.name);
      if (opts.canAdd && !fixed.has(f.name)) {
        t.appendChild(h('span', {
          class: 'x', title: 'Usuń plik', onclick: ev => {
            ev.stopPropagation();
            if (!confirm('Usunąć plik ' + f.name + '?')) return;
            st.files.splice(i, 1); st.active = Math.max(0, Math.min(st.active, st.files.length - 1)); load(); change();
          }
        }, '✕'));
      }
      tabs.appendChild(t);
    });
    if (opts.canAdd) tabs.appendChild(h('div', {
      class: 'ed-tab add', title: 'Dodaj nową klasę (nowy plik .java)', onclick: () => {
        let n = prompt('Nazwa nowej klasy (np. Zwierze):');
        if (!n) return;
        n = n.trim().replace(/\.java$/, '');
        if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(n)) return toast('Niepoprawna nazwa klasy');
        if (st.files.some(f => f.name === n + '.java')) return toast('Taki plik już istnieje');
        st.files.push({ name: n + '.java', code: 'public class ' + n + ' {\n    \n}\n' });
        st.active = st.files.length - 1; load(); change();
      }
    }, '＋ plik'));
  }

  function drawGutter() {
    const n = (ta.value.match(/\n/g) || []).length + 1;
    const errs = (st.errors[cur() && cur().name]) || new Set();
    let s = '';
    for (let i = 1; i <= n; i++) s += '<div' + (errs.has(i) ? ' class="err"' : '') + '>' + i + '</div>';
    gutter.innerHTML = s;
    gutter.scrollTop = ta.scrollTop;
  }
  function drawHl() { pre.innerHTML = Hl.highlight(ta.value) + '\n'; pre.scrollTop = ta.scrollTop; pre.scrollLeft = ta.scrollLeft; }
  function load() {
    const f = cur();
    ta.value = f ? f.code : '';
    drawTabs(); drawHl(); drawGutter();
  }
  function change() { if (opts.onChange) opts.onChange(el.api); }

  ta.addEventListener('input', () => { cur().code = ta.value; drawHl(); drawGutter(); change(); });
  ta.addEventListener('scroll', () => { pre.scrollTop = ta.scrollTop; pre.scrollLeft = ta.scrollLeft; gutter.scrollTop = ta.scrollTop; });

  function ins(text) {
    ta.focus();
    if (!document.execCommand('insertText', false, text)) {
      ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, 'end');
      ta.dispatchEvent(new Event('input'));
    }
  }
  const PAIRS = { '(': ')', '[': ']', '{': '}', '"': '"' };
  ta.addEventListener('keydown', ev => {
    if (opts.readOnly) return;
    const v = ta.value, s = ta.selectionStart, e = ta.selectionEnd;
    if ((ev.ctrlKey || ev.metaKey) && ev.key === 'Enter') { ev.preventDefault(); if (opts.onSubmit) opts.onSubmit(); return; }
    if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 's') { ev.preventDefault(); return; }
    if (ev.key === 'Tab') {
      ev.preventDefault();
      const multi = v.slice(s, e).includes('\n');
      if (!multi && !ev.shiftKey) return ins('    ');
      const ls = v.lastIndexOf('\n', s - 1) + 1;
      let le = v.indexOf('\n', e); if (le < 0) le = v.length;
      const block = v.slice(ls, le).split('\n');
      const out = block.map(l => ev.shiftKey ? l.replace(/^( {1,4}|\t)/, '') : '    ' + l).join('\n');
      ta.setSelectionRange(ls, le); ins(out);
      ta.setSelectionRange(ls, ls + out.length);
      return;
    }
    if (ev.key === 'Enter' && !ev.shiftKey) {
      ev.preventDefault();
      const ls = v.lastIndexOf('\n', s - 1) + 1;
      const indent = /^[ \t]*/.exec(v.slice(ls, s))[0];
      const before = v[s - 1], after = v[e];
      if (before === '{' && after === '}') {
        const text = '\n' + indent + '    \n' + indent;
        ins(text);
        const p = s + 1 + indent.length + 4; ta.setSelectionRange(p, p);
      } else if (before === '{') ins('\n' + indent + '    ');
      else ins('\n' + indent);
      return;
    }
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    if (ev.key === '}') {
      const ls = v.lastIndexOf('\n', s - 1) + 1;
      const pre0 = v.slice(ls, s);
      if (v[s] === '}' && s === e) { ev.preventDefault(); ta.setSelectionRange(s + 1, s + 1); return; }
      if (/^ {4,}$/.test(pre0) && s === e) { ta.setSelectionRange(s - 4, s); }
      return;
    }
    if (ev.key === ')' || ev.key === ']') { if (v[s] === ev.key && s === e) { ev.preventDefault(); ta.setSelectionRange(s + 1, s + 1); } return; }
    if (PAIRS[ev.key]) {
      if (ev.key === '"') {
        if (v[s] === '"' && s === e) { ev.preventDefault(); ta.setSelectionRange(s + 1, s + 1); return; }
        if (/[\w]/.test(v[s - 1] || '')) return;
      }
      if (s !== e) { ev.preventDefault(); const sel = v.slice(s, e); ins(ev.key + sel + PAIRS[ev.key]); return; }
      ev.preventDefault(); ins(ev.key + PAIRS[ev.key]); ta.setSelectionRange(s + 1, s + 1);
    }
  });

  el.api = {
    el,
    getFiles: () => st.files.map(f => ({ name: f.name, code: f.code })),
    setFiles(files) {
      st.files = files.map(f => ({ name: f.name, code: f.code }));
      st.active = Math.min(st.active, st.files.length - 1);
      st.errors = {};
      load();
    },
    markErrors(list) {
      st.errors = {};
      (list || []).forEach(e => { (st.errors[e.file] = st.errors[e.file] || new Set()).add(e.line); });
      drawTabs(); drawGutter();
    },
    jump(file, line) {
      const i = st.files.findIndex(f => f.name === file);
      if (i < 0) return;
      st.active = i; load();
      const lines = ta.value.split('\n');
      let pos = 0; for (let k = 0; k < Math.min(line - 1, lines.length); k++) pos += lines[k].length + 1;
      ta.focus(); ta.setSelectionRange(pos, pos + (lines[line - 1] || '').length);
      ta.scrollTop = Math.max(0, (line - 4) * 21);
    },
    focus() { ta.focus(); },
  };
  load();
  return el.api;
}

function detectMain(files, hint) {
  if (hint) return hint;
  const f = files.find(x => /static\s+void\s+main\s*\(/.test(x.code));
  return f ? f.name.replace(/\.java$/, '') : null;
}
