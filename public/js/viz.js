'use strict';
/* ===== Wizualizacje do lekcji: pamięć (zmienne -> obiekty), drzewa klas, przepływy, komórki, mapy, porównania, „kod linia po linii” ===== */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var uid = 0;
  var PALETTE = ['var(--accent)', 'var(--accent2)', 'var(--ok)', 'var(--warn)', 'var(--bad)'];
  var CW = 7.6;

  function S(tag, attrs, text) {
    var el = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) { if (k === 'style' && typeof attrs[k] === 'object') Object.assign(el.style, attrs[k]); else el.setAttribute(k, attrs[k]); }
    if (text != null) el.textContent = text;
    return el;
  }
  function txt(parent, x, y, s, o) {
    o = o || {};
    var t = S('text', { x: x, y: y, 'text-anchor': o.anchor || 'start', 'font-size': o.size || 13, 'font-family': o.mono === false ? 'inherit' : 'JetBrains Mono, Consolas, monospace', style: { fill: o.fill || 'var(--text)', fontWeight: o.bold ? '700' : '400', fontStyle: o.italic ? 'italic' : 'normal' } }, s);
    parent.appendChild(t); return t;
  }
  function wrap(svg, caption, cls) {
    var box = document.createElement('div'); box.className = 'viz ' + (cls || '');
    var vb = (svg.getAttribute('viewBox') || '').split(' ');
    if (vb[2]) svg.style.minWidth = Math.min(+vb[2], 560) + 'px';
    box.appendChild(svg);
    if (caption) { var c = document.createElement('div'); c.className = 'viz-cap'; c.innerHTML = caption; box.appendChild(c); }
    return box;
  }
  function arrowDef(svg, id, color) {
    var defs = S('defs'); var m = S('marker', { id: id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' });
    m.appendChild(S('path', { d: 'M0,0 L10,5 L0,10 z', style: { fill: color } })); defs.appendChild(m); svg.appendChild(defs);
  }
  function plain(s) { return String(s).replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'); }

  /* ---------- 1. pamięć: zmienne -> obiekty ---------- */
  function objects(d) {
    var vars = d.vars || [], objs = d.objs || [];
    var VH = 34, VG = 10, TOP = 34;
    var vw = 200;
    var ow = 170;
    objs.forEach(function (o) {
      var m = plain(o.c).length + 4;
      (o.f || []).forEach(function (f) { m = Math.max(m, plain(f[0] + ': ' + f[1]).length + 2); });
      ow = Math.max(ow, m * CW + 26);
    });
    var gap = d.gap || 150, X0 = 14;
    var ox = X0 + vw + gap;
    var pos = {}, bottom = TOP;
    objs.forEach(function (o, i) {
      var first = -1;
      vars.forEach(function (v, vi) { if (v.to === o.id && first < 0) first = vi; });
      var want = first >= 0 ? TOP + first * (VH + VG) - 6 : TOP;
      var y = Math.max(bottom, want);
      var hgt = 28 + (o.f || []).length * 22 + 8;
      pos[o.id] = { y: y, h: hgt, color: PALETTE[(o.col != null ? o.col : i) % PALETTE.length] };
      bottom = y + hgt + 18;
    });
    var varsBottom = TOP + vars.length * (VH + VG);
    var H = Math.max(bottom, varsBottom) + 8, W = ox + ow + 16;
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', style: { maxWidth: W + 'px' }, role: 'img' });
    txt(svg, X0, 18, d.h1 || 'ZMIENNE (piloty)', { size: 11, fill: 'var(--muted)', bold: true, mono: false });
    txt(svg, ox, 18, d.h2 || 'OBIEKTY W PAMIĘCI', { size: 11, fill: 'var(--muted)', bold: true, mono: false });
    var mid = 'm' + (++uid);
    objs.forEach(function (o) {
      var p = pos[o.id];
      svg.appendChild(S('rect', { x: ox, y: p.y, width: ow, height: p.h, rx: 9, style: { fill: 'var(--panel)', stroke: p.color, strokeWidth: 2 } }));
      svg.appendChild(S('path', { d: 'M' + ox + ',' + (p.y + 28) + ' L' + (ox + ow) + ',' + (p.y + 28), style: { stroke: p.color, strokeWidth: 1, opacity: 0.5 } }));
      txt(svg, ox + ow / 2, p.y + 19, plain(o.c), { anchor: 'middle', bold: true, fill: p.color });
      (o.f || []).forEach(function (f, i) {
        txt(svg, ox + 12, p.y + 28 + 20 + i * 22 - 4, plain(f[0]) + ': ', { size: 12, fill: 'var(--muted)' });
        var t = txt(svg, ox + 12 + (plain(f[0]).length + 2) * 7.2, p.y + 28 + 20 + i * 22 - 4, plain(f[1]), { size: 12, bold: true });
      });
    });
    vars.forEach(function (v, i) {
      var y = TOP + i * (VH + VG);
      var tgt = v.to ? pos[v.to] : null;
      var col = tgt ? tgt.color : 'var(--muted)';
      svg.appendChild(S('rect', { x: X0, y: y, width: vw, height: VH, rx: 8, style: { fill: 'var(--panel2)', stroke: 'var(--line)', strokeWidth: 1.5 } }));
      txt(svg, X0 + 10, y + 21, plain(v.t || '') + ' ', { size: 11, fill: 'var(--muted)' });
      txt(svg, X0 + 10 + (plain(v.t || '').length + 1) * 6.6, y + 21, plain(v.n), { bold: true });
      if (v.v != null) txt(svg, X0 + vw - 10, y + 21, '= ' + plain(v.v), { anchor: 'end', bold: true, fill: 'var(--ok)' });
      else if (tgt) {
        svg.appendChild(S('circle', { cx: X0 + vw - 16, cy: y + VH / 2, r: 5, style: { fill: col } }));
        var ax = X0 + vw - 16, ay = y + VH / 2, bx = ox - 2, by = pos[v.to].y + 14;
        var id = mid + 'a' + i; arrowDef(svg, id, col);
        svg.appendChild(S('path', { d: 'M' + ax + ',' + ay + ' C' + (ax + 70) + ',' + ay + ' ' + (bx - 70) + ',' + by + ' ' + bx + ',' + by, fill: 'none', 'marker-end': 'url(#' + id + ')', style: { stroke: col, strokeWidth: 2 } }));
      } else {
        txt(svg, X0 + vw - 10, y + 21, 'null', { anchor: 'end', bold: true, fill: 'var(--bad)' });
        svg.appendChild(S('path', { d: 'M' + (X0 + vw + 6) + ',' + (y + VH / 2) + ' L' + (X0 + vw + 46) + ',' + (y + VH / 2), style: { stroke: 'var(--bad)', strokeWidth: 2, strokeDasharray: '4 4' } }));
        txt(svg, X0 + vw + 54, y + VH / 2 + 4, '✖ nic', { size: 12, fill: 'var(--bad)', bold: true, mono: false });
      }
    });
    return wrap(svg, d.cap, 'viz-mem');
  }

  /* ---------- 2. drzewo klas ---------- */
  function tree(d) {
    var nodes = d.nodes || [], by = {};
    nodes.forEach(function (n) { by[n.id] = n; n.kids = []; });
    nodes.forEach(function (n) { var p = Array.isArray(n.p) ? n.p[0] : n.p; if (p && by[p]) by[p].kids.push(n); });
    var roots = nodes.filter(function (n) { var p = Array.isArray(n.p) ? n.p[0] : n.p; return !p || !by[p]; });
    var maxSub = 0, NW = 130;
    nodes.forEach(function (n) {
      maxSub = Math.max(maxSub, (n.s || []).length);
      var lab = (n.k === 'iface' ? '«interface» ' : n.k === 'abs' ? 'abstract ' : '') + plain(n.l);
      NW = Math.max(NW, lab.length * 7.4 + 26);
      (n.s || []).forEach(function (s) { NW = Math.max(NW, plain(s).length * 6.8 + 22); });
    });
    var NH = 34 + maxSub * 17, VGAP = 56, HG = 22;
    function wid(n) { var w = 0; n.kids.forEach(function (k) { w += wid(k); }); n.w = Math.max(NW + HG, w); return n.w; }
    var total = 0; roots.forEach(function (r) { total += wid(r); });
    var depthMax = 0;
    function place(n, left, depth) {
      n.x = left + n.w / 2; n.y = 10 + depth * (NH + VGAP); depthMax = Math.max(depthMax, depth);
      var cur = left + (n.w - n.kids.reduce(function (a, k) { return a + k.w; }, 0)) / 2;
      n.kids.forEach(function (k) { place(k, cur, depth + 1); cur += k.w; });
    }
    var left = 0; roots.forEach(function (r) { place(r, left, 0); left += r.w; });
    var W = total, H = 10 + (depthMax + 1) * (NH + VGAP) - VGAP + 12;
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', style: { maxWidth: W + 'px' }, role: 'img' });
    var mid = 't' + (++uid);
    arrowDef(svg, mid + 'a', 'var(--muted)');
    function edge(n, pid, dashed) {
      var p = by[pid]; if (!p) return;
      var x1 = n.x, y1 = n.y, x2 = p.x, y2 = p.y + NH + 2;
      svg.appendChild(S('path', { d: 'M' + x1 + ',' + y1 + ' C' + x1 + ',' + (y1 - 28) + ' ' + x2 + ',' + (y2 + 28) + ' ' + x2 + ',' + y2, fill: 'none', 'marker-end': 'url(#' + mid + 'a)', style: { stroke: 'var(--muted)', strokeWidth: 1.6, strokeDasharray: (dashed || p.k === 'iface') ? '5 4' : 'none' } }));
      var lbl = p.k === 'iface' ? 'implements' : 'extends';
      if (d.labels !== false) txt(svg, (x1 + x2) / 2 + 6, (y1 + y2) / 2 + 4, lbl, { size: 10, fill: 'var(--muted)', mono: false, italic: true });
    }
    nodes.forEach(function (n) {
      var ps = Array.isArray(n.p) ? n.p : (n.p ? [n.p] : []);
      ps.forEach(function (pid, i) { edge(n, pid, i > 0); });
    });
    nodes.forEach(function (n, i) {
      var col = n.c ? 'var(--' + n.c + ')' : (!n.p ? 'var(--accent)' : 'var(--accent2)');
      var dashed = n.k === 'abs' || n.k === 'iface';
      svg.appendChild(S('rect', { x: n.x - NW / 2, y: n.y, width: NW, height: NH, rx: 9, style: { fill: 'var(--panel)', stroke: col, strokeWidth: 2, strokeDasharray: dashed ? '6 4' : 'none' } }));
      var lab = (n.k === 'iface' ? '«interface» ' : n.k === 'abs' ? 'abstract ' : '') + plain(n.l);
      txt(svg, n.x, n.y + 21, lab, { anchor: 'middle', bold: true, fill: col, italic: n.k === 'abs' });
      (n.s || []).forEach(function (s, j) { txt(svg, n.x, n.y + 21 + 17 * (j + 1), plain(s), { anchor: 'middle', size: 11, fill: 'var(--muted)' }); });
    });
    return wrap(svg, d.cap, 'viz-tree');
  }

  /* ---------- 3. przepływ (kroki ze strzałkami) ---------- */
  function flow(d) {
    var box = document.createElement('div'); box.className = 'viz flow ' + (d.dir === 'v' ? 'v' : 'h');
    if (d.title) { var t = document.createElement('div'); t.className = 'viz-title'; t.innerHTML = d.title; box.appendChild(t); }
    var row = document.createElement('div'); row.className = 'flow-row';
    (d.steps || []).forEach(function (s, i) {
      if (i) { var a = document.createElement('div'); a.className = 'farr'; a.textContent = d.dir === 'v' ? '↓' : '➜'; row.appendChild(a); }
      var st = document.createElement('div'); st.className = 'fstep ' + (s.c || '');
      st.innerHTML = '<b>' + s.t + '</b>' + (s.s ? '<span>' + s.s + '</span>' : '');
      row.appendChild(st);
    });
    box.appendChild(row);
    if (d.cap) { var c = document.createElement('div'); c.className = 'viz-cap'; c.innerHTML = d.cap; box.appendChild(c); }
    return box;
  }

  /* ---------- 4. komórki: tablica / lista / zbiór ---------- */
  function cells(d) {
    var box = document.createElement('div'); box.className = 'viz cellsviz';
    if (d.title) { var t = document.createElement('div'); t.className = 'viz-title'; t.innerHTML = d.title; box.appendChild(t); }
    (d.rows || []).forEach(function (r) {
      var row = document.createElement('div'); row.className = 'crow';
      if (r.label) { var l = document.createElement('div'); l.className = 'clabel'; l.innerHTML = r.label; row.appendChild(l); }
      var wrapEl = document.createElement('div'); wrapEl.className = 'cwrap' + (r.shape === 'bubble' ? ' bubble' : '') + (r.top ? ' labeled' : '');
      (r.cells || []).forEach(function (c, i) {
        var col = document.createElement('div'); col.className = 'ccol';
        if (r.top && r.top[i] != null) { var tp = document.createElement('div'); tp.className = 'ctop'; tp.innerHTML = r.top[i]; col.appendChild(tp); }
        var cell = document.createElement('div');
        var isNull = c === null || c === 'null';
        cell.className = 'cell' + (isNull ? ' nul' : '') + ((r.hl || []).indexOf(i) >= 0 ? ' hl' : '') + ((r.bad || []).indexOf(i) >= 0 ? ' bad' : '') + ((r.dim || []).indexOf(i) >= 0 ? ' dim' : '');
        cell.innerHTML = isNull ? 'null' : c;
        col.appendChild(cell);
        if (r.idx) { var ix = document.createElement('div'); ix.className = 'cidx'; ix.textContent = (r.idx === 'from1' ? i + 1 : i); col.appendChild(ix); }
        wrapEl.appendChild(col);
      });
      row.appendChild(wrapEl); box.appendChild(row);
    });
    if (d.cap) { var c2 = document.createElement('div'); c2.className = 'viz-cap'; c2.innerHTML = d.cap; box.appendChild(c2); }
    return box;
  }

  /* ---------- 5. mapa klucz -> wartość ---------- */
  function map(d) {
    var box = document.createElement('div'); box.className = 'viz vmap';
    if (d.title) { var t = document.createElement('div'); t.className = 'viz-title'; t.innerHTML = d.title; box.appendChild(t); }
    var tb = document.createElement('div'); tb.className = 'vm-body';
    var head = document.createElement('div'); head.className = 'vm-row vm-head';
    head.innerHTML = '<span>' + (d.kh || 'KLUCZ') + '</span><span></span><span>' + (d.vh || 'WARTOŚĆ') + '</span>'; tb.appendChild(head);
    (d.pairs || []).forEach(function (p) {
      var r = document.createElement('div'); r.className = 'vm-row';
      r.innerHTML = '<span class="k">' + p[0] + '</span><span class="a">➜</span><span class="v">' + p[1] + '</span>'; tb.appendChild(r);
    });
    box.appendChild(tb);
    if (d.cap) { var c = document.createElement('div'); c.className = 'viz-cap'; c.innerHTML = d.cap; box.appendChild(c); }
    return box;
  }

  /* ---------- 6. porównanie kolumn ---------- */
  function compare(d) {
    var box = document.createElement('div'); box.className = 'viz compare n' + (d.cols || []).length;
    (d.cols || []).forEach(function (c) {
      var col = document.createElement('div'); col.className = 'cmp-col ' + (c.c || '');
      col.innerHTML = '<div class="cmp-h"><span>' + (c.icon || '') + '</span><b>' + c.title + '</b></div>' + (c.sub ? '<div class="cmp-sub">' + c.sub + '</div>' : '') + '<ul>' + (c.items || []).map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>';
      box.appendChild(col);
    });
    if (d.cap) { var cp = document.createElement('div'); cp.className = 'viz-cap'; cp.innerHTML = d.cap; box.appendChild(cp); }
    return box;
  }

  /* ---------- 7. kod linia po linii ---------- */
  function walk(b) {
    var box = document.createElement('div'); box.className = 'walk';
    if (b.title) { var t = document.createElement('div'); t.className = 'viz-title'; t.innerHTML = b.title; box.appendChild(t); }
    var tbl = document.createElement('div'); tbl.className = 'walk-tbl';
    var lines = b.code.replace(/\n$/, '').split('\n'), notes = b.notes || {};
    lines.forEach(function (ln, i) {
      var n = notes[i + 1];
      var row = document.createElement('div'); row.className = 'wl' + (n ? ' has' : '');
      var hl = (typeof Hl !== 'undefined') ? Hl.highlight(ln) : ln;
      row.innerHTML = '<span class="wn">' + (i + 1) + '</span><code class="wc">' + (hl || '&nbsp;') + '</code><span class="wt">' + (n || '') + '</span>';
      tbl.appendChild(row);
    });
    box.appendChild(tbl);
    return box;
  }

  function render(b) {
    switch (b.kind) {
      case 'objects': return objects(b);
      case 'tree': return tree(b);
      case 'flow': return flow(b);
      case 'cells': return cells(b);
      case 'map': return map(b);
      case 'compare': return compare(b);
      default: return document.createTextNode('');
    }
  }
  window.Viz = { render: render, walk: walk };
})();
