'use strict';
/* ===== Router i start aplikacji ===== */
const routeCleanup = [];

function updateBadge() {
  const n = reviewGroups().length;
  const b = $('#reviewBadge');
  if (!b) return;
  b.hidden = !n; b.textContent = n;
}
function updateJdkPill() {
  const p = $('#jdkPill'), j = Api.jdk || {};
  p.className = 'pill ' + (j.found ? 'ok' : 'bad');
  p.textContent = j.found ? 'JDK ' + j.version : 'brak JDK';
  p.title = j.found ? j.home : 'Zainstaluj IntelliJ IDEA lub JDK 21';
}

function route() {
  while (routeCleanup.length) { try { routeCleanup.pop()(); } catch (e) { /* */ } }
  const app = $('#app');
  app.innerHTML = '';
  const parts = location.hash.replace(/^#\/?/, '').split('/');
  const [r, a, b] = parts;
  const active = r === 'lesson' || r === 'module' || r === 'lab' || r === 'quiz' || !r ? 'home' : r === 'test' ? 'tests' : r;
  document.querySelectorAll('#nav a').forEach(x => x.classList.toggle('active', x.dataset.r === active));
  try {
    if (!r) viewHome(app);
    else if (r === 'module') viewModule(app, a);
    else if (r === 'lesson') viewLesson(app, a, b);
    else if (r === 'lab') viewLab(app, a);
    else if (r === 'quiz') viewQuiz(app, a);
    else if (r === 'review') viewReview(app);
    else if (r === 'tests') viewTests(app);
    else if (r === 'test') (b === 'result' ? viewTestResult(app, a) : viewTest(app, a));
    else if (r === 'project') viewProject(app);
    else if (r === 'settings') viewSettings(app);
    else viewHome(app);
  } catch (e) {
    console.error(e);
    app.innerHTML = '';
    app.append(h('div', { class: 'container' }, h('div', { class: 'errbox' }, 'Błąd wyświetlania: ' + e.message), h('a', { href: '#/' }, '← Strona główna')));
  }
  updateBadge();
  window.scrollTo(0, 0);
}

function applyTheme(t) {
  const theme = t || localStorage.getItem('ja-theme2') || 'dark';
  document.documentElement.dataset.theme = theme;
}

async function init() {
  applyTheme();
  $('#themeBtn').onclick = () => { const n = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; localStorage.setItem('ja-theme2', n); applyTheme(n); };
  Idx.build();
  await Store.load();
  Api.status().then(updateJdkPill);
  window.addEventListener('hashchange', route);
  route();
}
init();
