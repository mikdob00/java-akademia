const fs = require('fs');
const [,, mod, nw, num] = process.argv;
let s = fs.readFileSync(mod, 'utf8');
const a = s.indexOf('\n  lessons: [');
if (a < 0) throw new Error('no lessons');
const cands = ['\n  labs: [', '\n  quiz: ['].map(k => s.indexOf(k, a)).filter(i => i > a);
const b = Math.min(...cands);
const add = fs.readFileSync(nw, 'utf8').replace(/\s+$/, '');
fs.writeFileSync(mod, s.slice(0, a) + '\n' + add + '\n' + s.slice(b + 1));
if (num) {
  for (const f of ['explain1.js', 'explain2.js', 'explain3.js']) {
    const p = require('path').join(require('path').dirname(mod), f);
    let t = fs.readFileSync(p, 'utf8');
    const re = new RegExp(String.raw`\n  /\* =+ MODU[ŁL] ` + num + String.raw`\b[^*]*\*/[\s\S]*?(?=\n  /\* =+ MODU|\n\}\)\(\);)`);
    if (re.test(t)) { t = t.replace(re, ''); fs.writeFileSync(p, t); console.log('explain cleared in', f); }
  }
}
console.log('spliced', mod);
