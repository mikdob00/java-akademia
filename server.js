'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const cp = require('child_process');

const ROOT = __dirname;
const PUB = path.join(ROOT, 'public');
const DATA = path.join(ROOT, 'data');
const IS_WIN = process.platform === 'win32';
const EXE = IS_WIN ? '.exe' : '';

/* ------------------------------------------------------------------ JDK */

function readConfig() {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'config.json'), 'utf8')); } catch (e) { return {}; }
}

function subdirs(dir) {
  try { return fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => path.join(dir, d.name)); }
  catch (e) { return []; }
}

function jdkCandidates() {
  const c = [];
  const cfg = readConfig();
  if (cfg.jdkHome) c.push(cfg.jdkHome);
  if (process.env.JAVA_HOME) c.push(process.env.JAVA_HOME);
  (process.env.PATH || '').split(path.delimiter).forEach(p => { if (p && fs.existsSync(path.join(p, 'javac' + EXE))) c.push(path.dirname(p)); });
  const home = os.homedir();
  subdirs(path.join(home, '.jdks')).forEach(d => c.push(d));
  ['C:\\Program Files\\Java', 'C:\\Program Files\\Eclipse Adoptium', 'C:\\Program Files\\Microsoft',
    'C:\\Program Files\\Amazon Corretto', 'C:\\Program Files\\Zulu', 'C:\\Program Files\\BellSoft',
    '/usr/lib/jvm', '/Library/Java/JavaVirtualMachines'].forEach(d => subdirs(d).forEach(x => { c.push(x); c.push(path.join(x, 'Contents', 'Home')); }));
  const pf = [process.env['ProgramFiles'], process.env['ProgramFiles(x86)'], 'C:\\Program Files'].filter(Boolean);
  pf.forEach(p => subdirs(path.join(p, 'JetBrains')).forEach(d => c.push(path.join(d, 'jbr'))));
  const la = process.env.LOCALAPPDATA;
  if (la) {
    subdirs(path.join(la, 'Programs')).filter(d => /idea|jetbrains/i.test(d)).forEach(d => c.push(path.join(d, 'jbr')));
    subdirs(path.join(la, 'JetBrains', 'Toolbox', 'apps')).forEach(app => subdirs(path.join(app, 'ch-0')).forEach(v => c.push(path.join(v, 'jbr'))));
  }
  return c;
}

let JDK = null;
function findJdk(force) {
  if (JDK && !force) return JDK;
  for (const home of jdkCandidates()) {
    const javac = path.join(home, 'bin', 'javac' + EXE);
    const java = path.join(home, 'bin', 'java' + EXE);
    if (fs.existsSync(javac) && fs.existsSync(java)) {
      let version = '';
      try {
        const r = cp.spawnSync(java, ['-version'], { encoding: 'utf8', windowsHide: true });
        const m = /version "([^"]+)"/.exec((r.stderr || '') + (r.stdout || ''));
        version = m ? m[1] : '';
      } catch (e) { /* ignore */ }
      JDK = { home, javac, java, version, found: true };
      return JDK;
    }
  }
  JDK = { found: false };
  return JDK;
}

/* ------------------------------------------------------- Java test harness */

const HARNESS_HEAD = String.raw`import java.io.*;
import java.lang.reflect.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;
import java.util.regex.*;

public class Check {
    interface Thrower { void run() throws Throwable; }
    static final PrintStream REAL = new PrintStream(new FileOutputStream(FileDescriptor.out), true, StandardCharsets.UTF_8);
    static String DIR = ".";

    static String show(Object o) {
        if (o == null) return "null";
        if (o instanceof String) return "\"" + o + "\"";
        if (o instanceof Character) return "'" + o + "'";
        if (o instanceof Object[]) return Arrays.deepToString((Object[]) o);
        if (o instanceof int[]) return Arrays.toString((int[]) o);
        if (o instanceof double[]) return Arrays.toString((double[]) o);
        if (o instanceof long[]) return Arrays.toString((long[]) o);
        if (o instanceof boolean[]) return Arrays.toString((boolean[]) o);
        if (o instanceof char[]) return Arrays.toString((char[]) o);
        return String.valueOf(o);
    }
    static boolean same(Object e, Object a) {
        if (e instanceof Number && a instanceof Number) {
            double x = ((Number) e).doubleValue(), y = ((Number) a).doubleValue();
            return Math.abs(x - y) <= 1e-6 * Math.max(1.0, Math.abs(x));
        }
        return Objects.deepEquals(e, a);
    }
    static void eq(Object e, Object a) { if (!same(e, a)) throw new AssertionError("oczekiwano: " + show(e) + ", otrzymano: " + show(a)); }
    static void eq(String what, Object e, Object a) { if (!same(e, a)) throw new AssertionError(what + " — oczekiwano: " + show(e) + ", otrzymano: " + show(a)); }
    static void isTrue(boolean c) { if (!c) throw new AssertionError("warunek nie jest spełniony"); }
    static void isTrue(String msg, boolean c) { if (!c) throw new AssertionError(msg); }
    static void isFalse(String msg, boolean c) { if (c) throw new AssertionError(msg); }
    static void fail(String msg) { throw new AssertionError(msg); }

    static String out(Thrower t) throws Throwable {
        PrintStream old = System.out;
        ByteArrayOutputStream bo = new ByteArrayOutputStream();
        PrintStream ps = new PrintStream(bo, true, StandardCharsets.UTF_8);
        System.setOut(ps);
        try { t.run(); } finally { ps.flush(); System.setOut(old); }
        return bo.toString(StandardCharsets.UTF_8).replace("\r\n", "\n");
    }
    static void stdin(String s) { System.setIn(new ByteArrayInputStream(s.getBytes(StandardCharsets.UTF_8))); }
    static String runMain(String input) throws Throwable {
        stdin(input);
        Class<?> c = cls("Main");
        Method m;
        try { m = c.getMethod("main", String[].class); } catch (NoSuchMethodException e) { throw new AssertionError("Klasa Main nie ma metody public static void main(String[] args)"); }
        return out(() -> { try { m.invoke(null, (Object) new String[0]); } catch (InvocationTargetException e) { throw e.getCause(); } });
    }
    static String runMain() throws Throwable { return runMain(""); }
    static List<String> lines(String s) {
        List<String> r = new ArrayList<>();
        for (String l : s.split("\n")) if (!l.trim().isEmpty()) r.add(l.trim());
        return r;
    }
    static int count(String text, String part) { int n = 0, i = 0; while ((i = text.indexOf(part, i)) >= 0) { n++; i += part.length(); } return n; }

    static Class<?> cls(String n) { try { return Class.forName(n); } catch (ClassNotFoundException e) { throw new AssertionError("Brak klasy " + n); } }
    static boolean hasClass(String n) { try { Class.forName(n); return true; } catch (ClassNotFoundException e) { return false; } }
    static boolean fits(Class<?> p, Object a) {
        if (a == null) return !p.isPrimitive();
        if (p.isInstance(a)) return true;
        if (p == int.class) return a instanceof Integer || a instanceof Short || a instanceof Byte || a instanceof Character;
        if (p == long.class) return a instanceof Long || a instanceof Integer;
        if (p == double.class) return a instanceof Double || a instanceof Integer || a instanceof Float || a instanceof Long;
        if (p == float.class) return a instanceof Float || a instanceof Integer;
        if (p == boolean.class) return a instanceof Boolean;
        if (p == char.class) return a instanceof Character;
        if (p == short.class) return a instanceof Short;
        if (p == byte.class) return a instanceof Byte;
        return false;
    }
    static boolean match(Class<?>[] ps, Object[] args) {
        if (ps.length != args.length) return false;
        for (int i = 0; i < ps.length; i++) if (!fits(ps[i], args[i])) return false;
        return true;
    }
    static Object make(String cn, Object... args) throws Throwable {
        Class<?> c = cls(cn);
        for (Constructor<?> k : c.getDeclaredConstructors()) {
            if (match(k.getParameterTypes(), args)) {
                k.setAccessible(true);
                try { return k.newInstance(args); } catch (InvocationTargetException e) { throw e.getCause(); }
            }
        }
        throw new AssertionError("Klasa " + cn + " nie ma konstruktora pasującego do argumentów " + show(args));
    }
    static Method findM(Class<?> c, String name, Object[] args) {
        for (Class<?> k = c; k != null; k = k.getSuperclass())
            for (Method m : k.getDeclaredMethods()) if (m.getName().equals(name) && match(m.getParameterTypes(), args)) return m;
        for (Method m : c.getMethods()) if (m.getName().equals(name) && match(m.getParameterTypes(), args)) return m;
        return null;
    }
    static Object call(Object o, String name, Object... args) throws Throwable {
        Method m = findM(o.getClass(), name, args);
        if (m == null) throw new AssertionError("Klasa " + o.getClass().getSimpleName() + " nie ma metody " + name + "(" + args.length + " arg.) o pasujących typach");
        m.setAccessible(true);
        try { return m.invoke(o, args); } catch (InvocationTargetException e) { throw e.getCause(); }
    }
    static Object callStatic(String cn, String name, Object... args) throws Throwable {
        Method m = findM(cls(cn), name, args);
        if (m == null) throw new AssertionError("Klasa " + cn + " nie ma metody " + name + "(" + args.length + " arg.) o pasujących typach");
        m.setAccessible(true);
        try { return m.invoke(null, args); } catch (InvocationTargetException e) { throw e.getCause(); }
    }
    static Field findF(Class<?> c, String n) {
        for (Class<?> k = c; k != null; k = k.getSuperclass()) { try { return k.getDeclaredField(n); } catch (NoSuchFieldException e) { } }
        return null;
    }
    static boolean hasField(String cn, String n) { return findF(cls(cn), n) != null; }
    static Object field(Object o, String n) throws Throwable {
        Field f = findF(o.getClass(), n);
        if (f == null) throw new AssertionError("Klasa " + o.getClass().getSimpleName() + " nie ma pola " + n);
        f.setAccessible(true);
        return f.get(o);
    }
    static void setField(Object o, String n, Object v) throws Throwable {
        Field f = findF(o.getClass(), n);
        if (f == null) throw new AssertionError("Klasa " + o.getClass().getSimpleName() + " nie ma pola " + n);
        f.setAccessible(true);
        f.set(o, v);
    }
    static Object staticField(String cn, String n) throws Throwable {
        Field f = findF(cls(cn), n);
        if (f == null) throw new AssertionError("Klasa " + cn + " nie ma pola " + n);
        f.setAccessible(true);
        return f.get(null);
    }
    static int fieldMods(String cn, String n) {
        Field f = findF(cls(cn), n);
        if (f == null) throw new AssertionError("Klasa " + cn + " nie ma pola " + n);
        return f.getModifiers();
    }
    static Method method(String cn, String name, Class<?>... p) {
        try { Method m = cls(cn).getDeclaredMethod(name, p); m.setAccessible(true); return m; }
        catch (NoSuchMethodException e) { throw new AssertionError("Klasa " + cn + " nie ma metody " + name + "(" + Arrays.toString(p).replace("class ", "") + ")"); }
    }
    static Constructor<?> ctor(String cn, Class<?>... p) {
        try { Constructor<?> k = cls(cn).getDeclaredConstructor(p); k.setAccessible(true); return k; }
        catch (NoSuchMethodException e) { throw new AssertionError("Klasa " + cn + " nie ma konstruktora (" + Arrays.toString(p).replace("class ", "") + ")"); }
    }
    static boolean hasMethod(String cn, String n) {
        for (Class<?> k = cls(cn); k != null; k = k.getSuperclass()) for (Method m : k.getDeclaredMethods()) if (m.getName().equals(n)) return true;
        return false;
    }
    static int methodMods(String cn, String n) {
        for (Class<?> k = cls(cn); k != null; k = k.getSuperclass()) for (Method m : k.getDeclaredMethods()) if (m.getName().equals(n)) return m.getModifiers();
        throw new AssertionError("Klasa " + cn + " nie ma metody " + n);
    }
    static boolean isPrivate(String cn, String field) { return Modifier.isPrivate(fieldMods(cn, field)); }
    static boolean isSubclass(String sub, String sup) { return cls(sup).isAssignableFrom(cls(sub)) && !sub.equals(sup); }
    static boolean implementsIface(String cn, String iface) { return cls(iface).isAssignableFrom(cls(cn)); }

    static Throwable thrown(Thrower t) { try { t.run(); } catch (Throwable e) { return e; } return null; }
    static boolean isInstanceOfName(Throwable e, String name) {
        for (Class<?> k = e.getClass(); k != null; k = k.getSuperclass()) if (k.getSimpleName().equals(name) || k.getName().equals(name)) return true;
        return false;
    }
    static void throwsEx(String name, Thrower t) {
        Throwable e = thrown(t);
        if (e == null) throw new AssertionError("Oczekiwano wyjątku " + name + ", ale nic nie zostało rzucone");
        if (!isInstanceOfName(e, name)) throw new AssertionError("Oczekiwano wyjątku " + name + ", otrzymano " + e);
    }
    static void noThrow(Thrower t) {
        Throwable e = thrown(t);
        if (e != null) throw new AssertionError("Nie powinien zostać rzucony wyjątek, a rzucono: " + e);
    }

    static String src(String file) {
        try {
            String s = new String(Files.readAllBytes(Paths.get(DIR, file + ".java")), StandardCharsets.UTF_8);
            return s.replaceAll("(?s)/\\*.*?\\*/", "").replaceAll("//[^\\n]*", "");
        } catch (IOException e) { return ""; }
    }
    static String allSrc() {
        StringBuilder sb = new StringBuilder();
        File[] fs = new File(DIR).listFiles((d, n) -> n.endsWith(".java") && !n.equals("Check.java"));
        if (fs != null) for (File f : fs) sb.append(src(f.getName().replace(".java", ""))).append("\n");
        return sb.toString();
    }
    static boolean has(String text, String regex) { return Pattern.compile(regex, Pattern.DOTALL).matcher(text).find(); }
    static boolean srcHas(String file, String regex) { return has(src(file), regex); }
    static boolean anyHas(String regex) { return has(allSrc(), regex); }
    static int srcCount(String text, String regex) { Matcher m = Pattern.compile(regex, Pattern.DOTALL).matcher(text); int n = 0; while (m.find()) n++; return n; }
`;

function buildHarness(checks, prelude) {
  const head = HARNESS_HEAD + '\n' + (prelude || '') + '\n';
  let text = head;
  let line = head.split('\n').length; // first line of what follows is line (count)
  const ranges = [];
  checks.forEach((ch, i) => {
    const open = `    static void c${i}() throws Throwable {\n`;
    const start = line + 1;
    const body = ch.__nc ? '        throw new AssertionError("@@NC");\n' : String(ch.code).split('\n').map(l => '        ' + l).join('\n') + '\n';
    const bodyLines = body.split('\n').length - 1;
    text += open + body + '    }\n';
    ranges.push([line, line + 1 + bodyLines]);
    line += 1 + bodyLines + 1;
  });
  let sw = '';
  checks.forEach((_, i) => { sw += `            case ${i}: c${i}(); break;\n`; });
  text += `
    static void runOne(int k) throws Throwable {
        switch (k) {
${sw}            default: break;
        }
    }
    static String clean(String s) { return s == null ? "" : s.replace("\\\\", "\\\\\\\\").replace("\\n", "\\\\n").replace("\\r", "").replace("\\t", " "); }
    public static void main(String[] args) throws Exception {
        if (args.length > 0) DIR = args[0];
        System.setIn(new ByteArrayInputStream(new byte[0]));
        for (int i = 0; i < ${checks.length}; i++) {
            final int k = i;
            REAL.println("@@S\\t" + k);
            final Throwable[] err = new Throwable[1];
            final boolean[] fin = new boolean[1];
            Thread t = new Thread(null, () -> {
                try { runOne(k); } catch (Throwable e) { err[0] = e; }
                fin[0] = true;
            }, "chk", 64L * 1024 * 1024);
            t.setDaemon(true);
            t.start();
            t.join(4000);
            System.setOut(REAL);
            if (!fin[0]) {
                REAL.println("@@R\\t" + k + "\\tF\\tProgram działał zbyt długo (podejrzenie nieskończonej pętli).");
            } else if (err[0] == null) {
                REAL.println("@@R\\t" + k + "\\tP\\t");
            } else {
                Throwable e = err[0];
                String msg;
                if (e instanceof AssertionError) msg = String.valueOf(e.getMessage());
                else {
                    msg = "Wyjątek " + e.getClass().getSimpleName() + (e.getMessage() != null ? ": " + e.getMessage() : "");
                    for (StackTraceElement el : e.getStackTrace()) {
                        String f = el.getFileName(), cn = el.getClassName();
                        if (f != null && !f.equals("Check.java") && f.endsWith(".java") && !cn.startsWith("java.") && !cn.startsWith("jdk.") && !cn.startsWith("sun.")) { msg += " (w " + f + ":" + el.getLineNumber() + ")"; break; }
                    }
                }
                REAL.println("@@R\\t" + k + "\\tF\\t" + clean(msg));
            }
        }
        REAL.flush();
        System.exit(0);
    }
}
`;
  return { text, ranges };
}

/* ------------------------------------------------------------ java runner */

const JAVA_FLAGS = ['-Dfile.encoding=UTF-8', '-Dstdout.encoding=UTF-8', '-Dstderr.encoding=UTF-8', '-Duser.language=pl',
  '-XX:+UseSerialGC', '-XX:TieredStopAtLevel=1', '-Xshare:auto', '-Xmx256m'];

function exec(file, args, opts) {
  return new Promise(resolve => {
    const t0 = Date.now();
    let stdout = '', stderr = '', timedOut = false, done = false;
    const child = cp.spawn(file, args, { cwd: opts.cwd, windowsHide: true });
    const MAX = 200000;
    child.stdout.on('data', d => { if (stdout.length < MAX) stdout += d.toString('utf8'); });
    child.stderr.on('data', d => { if (stderr.length < MAX) stderr += d.toString('utf8'); });
    const timer = setTimeout(() => { timedOut = true; try { child.kill('SIGKILL'); } catch (e) { /* */ } }, opts.timeout || 8000);
    child.on('error', err => { if (done) return; done = true; clearTimeout(timer); resolve({ code: -1, stdout, stderr: stderr + String(err), timedOut, ms: Date.now() - t0 }); });
    child.on('close', code => { if (done) return; done = true; clearTimeout(timer); resolve({ code, stdout, stderr, timedOut, ms: Date.now() - t0 }); });
    child.stdin.on('error', () => { /* ignore EPIPE */ });
    try { child.stdin.end(opts.stdin || ''); } catch (e) { /* */ }
  });
}

function parseJavac(text) {
  const errors = [];
  const lines = text.replace(/\r/g, '').split('\n');
  let cur = null;
  const re = /^([\w$./\\-]+\.java):(\d+): (error|warning): (.*)$/;
  for (const l of lines) {
    const m = re.exec(l);
    if (m) {
      cur = { file: path.basename(m[1]), line: +m[2], kind: m[3], msg: m[4], extra: [], col: null };
      errors.push(cur);
    } else if (cur) {
      if (/^\d+ errors?$/.test(l.trim()) || /^\d+ warnings?$/.test(l.trim())) { cur = null; continue; }
      if (/^\s*\^\s*$/.test(l)) { cur.col = l.indexOf('^'); continue; }
      if (l.trim() !== '') cur.extra.push(l);
    }
  }
  return errors.filter(e => e.kind === 'error');
}

function safeName(n) { return /^[A-Za-z_][A-Za-z0-9_]*\.java$/.test(n) && n !== 'Check.java'; }

function prepareFiles(files, dir) {
  const names = [];
  for (const f of files) {
    if (!safeName(f.name)) throw new Error('Niedozwolona nazwa pliku: ' + f.name);
    let code = String(f.code || '').replace(/^\s*package\s+[\w.]+\s*;/m, '');
    fs.writeFileSync(path.join(dir, f.name), code, 'utf8');
    names.push(f.name);
  }
  return names;
}

function mkTmp() { return fs.mkdtempSync(path.join(os.tmpdir(), 'javaakademia-')); }
function rmTmp(d) { try { fs.rmSync(d, { recursive: true, force: true }); } catch (e) { /* */ } }

async function javac(dir, names, out) {
  const jdk = findJdk();
  fs.mkdirSync(out, { recursive: true });
  const args = ['-J-Dfile.encoding=UTF-8', '-J-Dstderr.encoding=UTF-8', '-J-Duser.language=en', '-J-Duser.country=US',
    '-encoding', 'UTF-8', '-Xlint:none', '-proc:none', '-nowarn', '-d', out, ...names];
  const r = await exec(jdk.javac, args, { cwd: dir, timeout: 30000 });
  const errors = parseJavac(r.stderr + '\n' + r.stdout);
  return { ok: r.code === 0 && errors.length === 0, errors, raw: (r.stderr + r.stdout).trim() };
}

async function runProgram(req) {
  const jdk = findJdk();
  if (!jdk.found) return { error: 'NO_JDK' };
  const dir = mkTmp();
  try {
    const names = prepareFiles(req.files || [], dir);
    const out = path.join(dir, 'out');
    const c = await javac(dir, names, out);
    if (!c.ok) return { phase: 'compile', compile: c };
    const main = /^[A-Za-z_][A-Za-z0-9_]*$/.test(req.main || '') ? req.main : 'Main';
    const r = await exec(jdk.java, [...JAVA_FLAGS, '-cp', out, main], { cwd: dir, timeout: 6000, stdin: req.stdin || '' });
    return { phase: 'run', compile: { ok: true, errors: [] }, stdout: r.stdout, stderr: r.stderr, exitCode: r.code, timedOut: r.timedOut, ms: r.ms };
  } finally { rmTmp(dir); }
}

function unescapeMsg(s) { return s.replace(/\\(n|\\)/g, (m, c) => (c === 'n' ? '\n' : '\\')); }

async function runCheck(req) {
  const jdk = findJdk();
  if (!jdk.found) return { error: 'NO_JDK' };
  const dir = mkTmp();
  try {
    const names = prepareFiles(req.files || [], dir);
    const out = path.join(dir, 'out');
    const checks = (req.checks || []).map(c => ({ code: c.code }));
    let h = buildHarness(checks, req.prelude);
    fs.writeFileSync(path.join(dir, 'Check.java'), h.text, 'utf8');
    let c = await javac(dir, [...names, 'Check.java'], out);
    const ncMsg = {};
    if (!c.ok) {
      const studentErrs = c.errors.filter(e => e.file !== 'Check.java');
      if (studentErrs.length) return { phase: 'compile', compile: { ok: false, errors: studentErrs, raw: c.raw } };
      const bad = new Set();
      for (const e of c.errors) {
        const idx = h.ranges.findIndex(r => e.line >= r[0] && e.line <= r[1]);
        if (idx < 0) return { phase: 'internal', error: 'Błąd wewnętrzny harnessu: ' + e.msg + ' (linia ' + e.line + ')', raw: c.raw };
        bad.add(idx);
        if (!ncMsg[idx]) ncMsg[idx] = { msg: e.msg, extra: e.extra };
      }
      bad.forEach(i => { checks[i].__nc = true; });
      h = buildHarness(checks, req.prelude);
      fs.writeFileSync(path.join(dir, 'Check.java'), h.text, 'utf8');
      fs.rmSync(out, { recursive: true, force: true });
      c = await javac(dir, [...names, 'Check.java'], out);
      if (!c.ok) return { phase: 'internal', error: 'Nie udało się skompilować testów: ' + c.raw };
    }
    const r = await exec(jdk.java, [...JAVA_FLAGS, '-cp', out, 'Check', dir], { cwd: dir, timeout: 6000 + checks.length * 800 });
    const results = checks.map((_, i) => ({ i, pass: false, msg: 'Nie uruchomiono (program został przerwany).' }));
    let lastStarted = -1;
    for (const l of r.stdout.split('\n')) {
      if (l.startsWith('@@S\t')) lastStarted = +l.split('\t')[1];
      else if (l.startsWith('@@R\t')) {
        const p = l.replace(/\r$/, '').split('\t');
        const i = +p[1];
        if (results[i]) { results[i] = { i, pass: p[2] === 'P', msg: unescapeMsg(p.slice(3).join('\t')) }; }
      }
    }
    const unfinished = results.filter(x => !x.pass && x.msg.startsWith('Nie uruchomiono'));
    if (unfinished.length && lastStarted >= 0 && results[lastStarted] && results[lastStarted].msg.startsWith('Nie uruchomiono')) {
      results[lastStarted].msg = r.timedOut ? 'Przekroczono limit czasu (nieskończona pętla?).' : 'Program został przerwany w trakcie tego testu (np. przez System.exit).';
    }
    for (const k of Object.keys(ncMsg)) {
      results[k] = { i: +k, pass: false, nocompile: true, msg: ncMsg[k].msg, extra: ncMsg[k].extra };
    }
    return { phase: 'check', compile: { ok: true, errors: [] }, results, timedOut: r.timedOut, ms: r.ms };
  } finally { rmTmp(dir); }
}

/* ---------------------------------------------------------------- server */

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };

function readBody(req) {
  return new Promise((resolve, reject) => {
    let b = '';
    req.on('data', d => { b += d; if (b.length > 5e6) { reject(new Error('too large')); req.destroy(); } });
    req.on('end', () => resolve(b));
    req.on('error', reject);
  });
}

function sendJson(res, obj, status) {
  const s = JSON.stringify(obj);
  res.writeHead(status || 200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(s);
}

async function handler(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const p = decodeURIComponent(url.pathname);
  try {
    if (p === '/api/status') {
      const j = findJdk(url.searchParams.get('refresh') === '1');
      return sendJson(res, { jdk: j.found ? { found: true, home: j.home, version: j.version } : { found: false } });
    }
    if (p === '/api/run' && req.method === 'POST') return sendJson(res, await runProgram(JSON.parse(await readBody(req))));
    if (p === '/api/check' && req.method === 'POST') return sendJson(res, await runCheck(JSON.parse(await readBody(req))));
    if (p === '/api/progress') {
      const f = path.join(DATA, 'progress.json');
      if (req.method === 'GET') {
        let d = null;
        try { d = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { /* none */ }
        return sendJson(res, { data: d });
      }
      if (req.method === 'POST') {
        const body = await readBody(req);
        JSON.parse(body);
        fs.mkdirSync(DATA, { recursive: true });
        if (fs.existsSync(f)) { try { fs.copyFileSync(f, path.join(DATA, 'progress.bak.json')); } catch (e) { /* */ } }
        fs.writeFileSync(f, body, 'utf8');
        return sendJson(res, { ok: true });
      }
    }
    let rel = p === '/' ? '/index.html' : p;
    const file = path.normalize(path.join(PUB, rel));
    if (!file.startsWith(PUB)) { res.writeHead(403); return res.end('Forbidden'); }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404); return res.end('Not found'); }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(buf);
    });
  } catch (e) {
    sendJson(res, { error: String(e && e.message || e) }, 500);
  }
}

function start(port0) {
  let port = port0;
  const srv = http.createServer(handler);
  srv.on('error', e => {
    if (e.code === 'EADDRINUSE' && port < port0 + 20) { port++; srv.listen(port, '127.0.0.1'); }
    else { console.error(e); process.exit(1); }
  });
  srv.on('listening', () => {
    const j = findJdk();
    console.log('\n  Java Akademia dziala na  http://localhost:' + port);
    console.log(j.found ? '  JDK: ' + j.version + '  (' + j.home + ')' : '  UWAGA: nie znaleziono JDK (javac). Zainstaluj IntelliJ IDEA lub JDK 21.');
    console.log('  Zamknij to okno, aby zatrzymac aplikacje.\n');
    if (!process.env.NO_OPEN) {
      const u = 'http://localhost:' + port;
      try {
        if (IS_WIN) cp.exec('start "" "' + u + '"');
        else if (process.platform === 'darwin') cp.exec('open ' + u);
        else cp.exec('xdg-open ' + u);
      } catch (e) { /* */ }
    }
  });
  srv.listen(port, '127.0.0.1');
  return srv;
}

if (require.main === module) start(+process.env.PORT || 4321);
module.exports = { runProgram, runCheck, findJdk, buildHarness };
