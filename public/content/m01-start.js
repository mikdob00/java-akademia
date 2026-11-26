'use strict';
/* Moduł 1 – lekcje atomowe: jedno pojęcie na lekcję.
   Kolejność w każdej lekcji: lektura → krok po kroku (piszemy razem) → spróbuj sam → pytania. */
(function () {
  function A(icon, x) { return { t: 'analogy', icon: icon, title: 'Wyobraź to sobie tak', x: x }; }
  function V(kind, o) { o.t = 'viz'; o.kind = kind; return o; }
  function T(rows) { return { t: 'terms', x: rows }; }
  function P(x) { return { t: 'p', x: x }; }
  function UL(x) { return { t: 'ul', x: x }; }
  function Wk(code, notes, title) { return { t: 'walk', title: title || '🔍 Przeczytaj kod linijka po linijce', code: code, notes: notes }; }
  function M(lines) { return 'public class Main {\n    public static void main(String[] args) {\n' + lines.map(function (l) { return '        ' + l + '\n'; }).join('') + '    }\n}\n'; }
  function MI(lines) { return 'import java.util.Scanner;\n\n' + M(lines); }
  var EMPTY_MAIN = M([]);
  var F = function (name, code) { return { name: name, code: code }; };
  var MAINF = [F('Main.java', EMPTY_MAIN)];
  function OUT(q, o, a, why, code) { return Q(q, o, a, why, undefined, { code: code }); }

  ACAD.modules.push({
    id: 'start', num: 1, level: 0, icon: '🌱', title: 'Pierwsze kroki w Javie',
    source: 'Wykład 1 (wstęp) · baza do wszystkich zadań',
    summary: '26 krótkich lekcji, każda o jednym pojęciu: klasa, public, main, wypisywanie, zmienne, warunki, pętle, tablice, metody, Scanner.',
    goals: ['rozumieć, co znaczą <code>class</code>, <code>public</code>, <code>static</code>, <code>void</code>, <code>main</code>', 'wypisywać tekst i wartości zmiennych', 'używać zmiennych, warunków i pętli', 'tworzyć tablice i metody', 'wczytywać dane z klawiatury klasą <code>Scanner</code>'],
    lessons: [

      /* ============ 1. PROGRAM ============ */
      {
        id: 'start-program', micro: true, title: 'Czym jest program i Java', blurb: 'program, kompilator, JDK, IntelliJ', minutes: 4,
        content: [
          A('🍳', 'Program to <b>przepis kuchenny</b> dla komputera: lista poleceń wykonywanych jedno po drugim. Komputer jest bardzo posłuszny, ale bardzo <b>dosłowny</b> – robi dokładnie to, co napisano, nic więcej.'),
          P('Programy w Javie piszesz w plikach tekstowych z końcówką <code>.java</code>. Komputer nie rozumie jednak Javy wprost – potrzebny jest <b>tłumacz</b>, czyli <b>kompilator</b>.'),
          V('flow', { title: 'Droga od kodu do wyniku', steps: [
            { t: 'Piszesz kod', s: 'plik Main.java', c: 'accent' },
            { t: 'Kompilator (javac)', s: 'tłumaczy kod', c: 'warn' },
            { t: 'Plik Main.class', s: 'tzw. bytecode', c: 'accent' },
            { t: 'JVM', s: 'maszyna wirtualna Javy uruchamia program', c: 'ok' },
            { t: 'Wynik', s: 'np. tekst w konsoli' }] }),
          T([['Java', 'język programowania, którego się uczysz'], ['kompilator <code>javac</code>', 'tłumaczy plik <code>.java</code> na <code>.class</code> (i zgłasza błędy w zapisie)'], ['JVM', 'maszyna wirtualna: uruchamia gotowy program, dzięki niej ten sam program działa na Windowsie, macOS i Linuksie'], ['JDK', 'zestaw narzędzi do <b>tworzenia</b> programów (m.in. kompilator)'], ['IntelliJ IDEA', 'wygodny edytor (IDE): podpowiada, podkreśla błędy – ale <b>nie jest</b> kompilatorem, korzysta z JDK']]),
          { t: 'note', k: 'exam', x: 'Pytanie, które lubi wracać: <b>czym różni się JDK od IntelliJ?</b> JDK to narzędzia (kompilator, biblioteki). IntelliJ to wygodny edytor, który z tych narzędzi korzysta.' },
        ],
        quiz: [
          Q('Co robi kompilator?', ['tłumaczy kod Javy na postać, którą rozumie JVM, i zgłasza błędy w zapisie', 'uruchamia gotowy program', 'pobiera Javę z internetu', 'sprawdza pisownię w komentarzach'], 0, 'Kompilator (javac) zamienia <code>.java</code> na <code>.class</code>.'),
          Q('Co jest prawdą o JDK i IntelliJ IDEA?', ['IntelliJ IDEA jest kompilatorem Javy', 'JDK zawiera kompilator javac i bibliotekę standardową', 'IntelliJ IDEA korzysta z JDK do kompilowania i uruchamiania kodu', 'Kod Java działa wyłącznie w Windowsie'], [1, 2], 'JDK to narzędzia i biblioteki, IntelliJ to IDE, które z nich korzysta. Java jest wieloplatformowa dzięki JVM.'),
          Q('Jakie rozszerzenie ma plik z kodem źródłowym w Javie?', ['.java', '.class', '.exe', '.jdk'], 0, 'Kod piszesz w <code>.java</code>, a kompilator tworzy z niego <code>.class</code>.'),
          Q('Za co odpowiada JVM?', ['uruchamia skompilowany program', 'pisze kod za programistę', 'zamienia kod na zdjęcia', 'zastępuje system Windows'], 0, 'JVM = Java Virtual Machine, uruchamia program i zapewnia przenośność.'),
        ],
      },

      /* ============ 2. CLASS ============ */
      {
        id: 'start-class', title: 'Słowo class – klasa', blurb: 'klasa to pojemnik na kod, klamry, nazwa pliku', minutes: 4,
        content: [
          A('📦', 'Klasa to <b>pudełko na kod</b>. W Javie <b>cały kod musi leżeć w jakiejś klasie</b> – nie ma kodu „luzem”. Pudełko ma <b>nazwę</b> (my użyjemy <code>Main</code>) i <b>ścianki</b>: klamry <code>{</code> i <code>}</code>.'),
          V('cells', { title: 'Z czego składa się najprostsza klasa', rows: [
            { cells: ['class', 'Main', '{', '}'], top: ['słowo „tworzę klasę”', 'nazwa klasy', 'początek', 'koniec'], hl: [0] }],
            cap: 'Cały kod klasy leży <b>pomiędzy</b> klamrami.' }),
          UL(['<code>class</code> – słowo kluczowe: „<b>tworzę klasę</b>”. Pisze się je zawsze małymi literami.', 'Nazwę klasy piszemy <b>z wielkiej litery</b>: <code>Main</code>, <code>Sklep</code>, <code>Klient</code>.', 'Klamry <code>{ }</code> wyznaczają granice pudełka – co jest w środku, należy do klasy.', 'Klasa <code>Sklep</code> zapisana jest w pliku <code>Sklep.java</code> – <b>nazwa pliku = nazwa klasy</b>.']),
          { t: 'note', k: 'tip', x: 'Java <b>rozróżnia małe i wielkie litery</b>: <code>class</code> to nie to samo co <code>Class</code>, a <code>Main</code> to nie <code>main</code>.' },
        ],
        guide: {
          files: [F('Main.java', '')],
          steps: [
            { say: '<p>Zacznij od słowa <code>class</code> – to znaczy „<b>tworzę klasę</b>”. Po spacji wpisz jej nazwę: <code>Main</code>.</p>', type: 'class Main', expect: J`class\s+Main` },
            { say: '<p>Pudełko potrzebuje ścianek. Dopisz otwierającą klamrę <code>{</code> i, w następnej linijce, zamykającą <code>}</code>. Wszystko, co kiedyś wpiszesz między nie, będzie w klasie <code>Main</code>.</p>', type: 'class Main {\n}', expect: J`class\s+Main\s*\{\s*\}` },
          ],
          solution: [F('Main.java', 'class Main {\n}\n')],
          checks: [
            CK(CR, 'Istnieje klasa o nazwie Main', J`isTrue("Nie znaleziono klasy Main. Czy napisałeś: class Main { }?", hasClass("Main"));`),
            CK(MN, 'Klasa ma otwierającą i zamykającą klamrę', J`isTrue("Brakuje klamer { } wokół klasy", srcHas("Main", "class\\s+Main\\s*\\{.*\\}"));`),
          ],
        },
        exercise: {
          prompt: '<p>Masz dwa puste pliki. W <code>Sklep.java</code> utwórz klasę <b>Sklep</b>, a w <code>Klient.java</code> klasę <b>Klient</b>.</p><p class="muted small">Każda klasa leży w osobnym pliku o takiej samej nazwie – dokładnie tak będzie w Twoim projekcie.</p>',
          files: [F('Sklep.java', ''), F('Klient.java', '')],
          hints: ['Wzór: <code>class Nazwa {</code> w jednej linijce i <code>}</code> w następnej.', 'Nazwy klas piszemy z wielkiej litery: <code>Sklep</code>, <code>Klient</code>.'],
          solution: [F('Sklep.java', 'class Sklep {\n}\n'), F('Klient.java', 'class Klient {\n}\n')],
          checks: [
            CK(CR, 'Istnieje klasa Sklep', J`isTrue("Brak klasy Sklep", hasClass("Sklep"));`),
            CK(CR, 'Istnieje klasa Klient', J`isTrue("Brak klasy Klient", hasClass("Klient"));`),
            CK(MN, 'Klasy są w plikach o tych samych nazwach', J`isTrue("Sklep.java powinien zawierać class Sklep", srcHas("Sklep", "class\\s+Sklep")); isTrue("Klient.java powinien zawierać class Klient", srcHas("Klient", "class\\s+Klient"));`),
          ],
        },
        quiz: [
          Q('Czym jest klasa (na tym etapie nauki)?', ['pudełkiem (pojemnikiem) na kod programu', 'nazwą zmiennej', 'poleceniem wypisującym tekst', 'plikiem graficznym'], 0, 'Cały kod w Javie leży w klasach.'),
          Q('Które słowo służy do utworzenia klasy?', ['class', 'new', 'void', 'int'], 0, '<code>class Nazwa { }</code>.'),
          Q('Co oznaczają klamry <code>{ }</code> przy klasie?', ['początek i koniec zawartości klasy', 'komentarz', 'wypisanie tekstu', 'błąd składni'], 0, 'To granice „pudełka”.'),
          Q('W jakim pliku zapiszesz klasę <code>Sklep</code>?', ['Sklep.java', 'sklep.txt', 'Sklep.class', 'Main.java'], 0, 'Nazwa pliku = nazwa klasy, z rozszerzeniem <code>.java</code>.'),
          Q('Który zapis jest <b>niepoprawny</b>?', ['Class Sklep { }', 'class Sklep { }', 'class Klient { }', 'class Main { }'], 0, 'Słowo <code>class</code> piszemy małymi literami.'),
        ],
      },

      /* ============ 3. PUBLIC ============ */
      {
        id: 'start-public', title: 'Słowo public – kto może korzystać', blurb: 'public = dostęp dla wszystkich', minutes: 3,
        content: [
          A('🏟️', '<code>public</code> to <b>rynek miejski</b> – wejść może każdy. Gdy napiszesz <code>public</code> przed klasą, mówisz: „ta klasa jest <b>dostępna dla całego programu</b>”. (Jest też przeciwieństwo – <code>private</code>, czyli „tylko dla mnie”, ale to dopiero w module o hermetyzacji.)'),
          V('compare', { cols: [
            { icon: '🏟️', title: 'public', c: 'ok', sub: 'dla wszystkich', items: ['widoczne w całym programie', 'przed klasą: <code>public class Sklep</code>'] },
            { icon: '🚪', title: 'private', c: 'warn', sub: 'tylko dla siebie (później)', items: ['ukryte przed resztą programu', 'poznasz w module 3'] }] }),
          UL(['Zapis: <code>public class Nazwa { }</code> – <code>public</code> stoi <b>przed</b> <code>class</code>.', 'Klasę publiczną zapisujemy w pliku o <b>takiej samej nazwie</b>: <code>public class Sklep</code> → <code>Sklep.java</code>.', 'W jednym pliku może być tylko jedna klasa publiczna.']),
        ],
        guide: {
          files: [F('Main.java', 'class Main {\n}\n')],
          steps: [
            { say: '<p>Masz zwykłą klasę <code>Main</code>. Zrób z niej klasę <b>publiczną</b>: dopisz słowo <code>public</code> <b>przed</b> <code>class</code> (i spację po nim).</p>', type: 'public class Main {\n}', expect: J`public\s+class\s+Main` },
          ],
          solution: [F('Main.java', 'public class Main {\n}\n')],
          checks: [
            CK(CR, 'Klasa Main jest publiczna', J`isTrue("Klasa Main powinna być publiczna: public class Main", Modifier.isPublic(cls("Main").getModifiers()));`),
          ],
        },
        exercise: {
          prompt: '<p>Obie klasy są na razie zwykłe (nie publiczne). Zrób z <b>Sklep</b> i <b>Klient</b> klasy publiczne.</p>',
          files: [F('Sklep.java', 'class Sklep {\n}\n'), F('Klient.java', 'class Klient {\n}\n')],
          hints: ['Wystarczy dopisać słowo <code>public</code> i spację przed <code>class</code>.'],
          solution: [F('Sklep.java', 'public class Sklep {\n}\n'), F('Klient.java', 'public class Klient {\n}\n')],
          checks: [
            CK(CR, 'Sklep jest publiczna', J`isTrue("Sklep ma być public", Modifier.isPublic(cls("Sklep").getModifiers()));`),
            CK(CR, 'Klient jest publiczna', J`isTrue("Klient ma być public", Modifier.isPublic(cls("Klient").getModifiers()));`),
          ],
        },
        quiz: [
          Q('Co oznacza słowo <code>public</code>?', ['dostęp dla wszystkich – z całego programu', 'dostęp tylko z tej samej klasy', 'klasa, której nie można używać', 'komentarz'], 0, '<code>public</code> = publiczne, widoczne wszędzie.'),
          Q('Który zapis klasy publicznej jest poprawny?', ['public class Sklep { }', 'class public Sklep { }', 'public Sklep class { }', 'Public Class Sklep { }'], 0, '<code>public</code> stoi przed <code>class</code>, wszystko małymi literami.'),
          Q('W jakim pliku musi być zapisana klasa <code>public class Klient</code>?', ['Klient.java', 'klient.java', 'Main.java', 'Public.java'], 0, 'Nazwa pliku = nazwa klasy publicznej (z zachowaniem wielkości liter).'),
          Q('Które słowo jest przeciwieństwem <code>public</code> (dostęp „tylko dla siebie”)?', ['private', 'static', 'class', 'void'], 0, '<code>private</code> – poznasz je przy hermetyzacji.'),
        ],
      },

      /* ============ 4. MAIN ============ */
      {
        id: 'start-main', title: 'Metoda main – tu startuje program', blurb: 'czym jest metoda, dlaczego main', minutes: 5,
        content: [
          A('🎬', 'Zanim zacznie się film, ktoś musi powiedzieć: „<b>akcja!</b>” od konkretnej sceny. W Javie taką sceną startową jest metoda o nazwie <b>main</b>. Komputer uruchamia program, szuka w klasie metody <code>main</code> i wykonuje jej polecenia <b>jedno po drugim, od góry do dołu</b>.'),
          P('<b>Metoda</b> to nazwany blok poleceń w klasie – mały „podprogram” z własnymi klamrami. Klasa może mieć wiele metod, ale program startuje od <code>main</code>.'),
          V('flow', { title: 'Co robi komputer po uruchomieniu', steps: [
            { t: 'Szuka metody main', s: 'w klasie Main', c: 'accent' },
            { t: 'Wykonuje polecenia', s: 'od góry do dołu', c: 'ok' },
            { t: 'Dochodzi do klamry }', s: 'koniec main', c: 'warn' },
            { t: 'Program się kończy' }] }),
          { t: 'code', title: 'Nagłówek metody main (na razie przepisz dokładnie)', x: 'public static void main(String[] args) {\n}' },
          { t: 'note', k: 'info', x: 'Ten nagłówek składa się z kilku słów. W <b>następnej lekcji</b> rozbierzemy je po kolei: <code>static</code>, <code>void</code>, <code>String[] args</code>. Na razie ważne jest jedno: <b>to jest miejsce startu programu</b>.' },
        ],
        guide: {
          files: [F('Main.java', 'public class Main {\n}\n')],
          steps: [
            { say: '<p>Wewnątrz klamer klasy (między <code>{</code> a <code>}</code>) wpisz nagłówek metody <code>main</code>. Na razie <b>przepisz go dokładnie</b> – sens każdego słowa wyjaśnimy w kolejnej lekcji. Na końcu jest otwierająca klamra metody.</p>', type: 'public static void main(String[] args) {', expect: J`public\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]\s*args\s*\)\s*\{` },
            { say: '<p>Metoda też jest „pudełkiem” – zamknij ją klamrą <code>}</code> w następnej linijce (przed klamrą kończącą klasę). Wnętrze zostawiamy puste: program wystartuje i od razu się skończy.</p>', type: '}', expect: J`main\s*\([^)]*\)\s*\{\s*\}\s*\}` },
          ],
          solution: [F('Main.java', 'public class Main {\n    public static void main(String[] args) {\n    }\n}\n')],
          checks: [
            CK(CR, 'Klasa Main ma metodę main(String[] args)', J`method("Main", "main", String[].class);`),
            CK(MD, 'Metoda main jest public static', J`int m = methodMods("Main", "main"); isTrue("main ma być public static", Modifier.isPublic(m) && Modifier.isStatic(m));`),
          ],
        },
        exercise: {
          prompt: '<p>Klasa <code>Gra</code> nie ma jeszcze punktu startu. Dopisz w niej (wewnątrz klamer) pustą metodę <code>main</code>.</p>',
          files: [F('Gra.java', 'public class Gra {\n}\n')],
          hints: ['Nagłówek: <code>public static void main(String[] args) {</code> i w następnej linijce <code>}</code>.'],
          solution: [F('Gra.java', 'public class Gra {\n    public static void main(String[] args) {\n    }\n}\n')],
          checks: [
            CK(CR, 'Klasa Gra ma metodę main(String[] args)', J`method("Gra", "main", String[].class);`),
            CK(MD, 'Metoda main jest public static', J`int m = methodMods("Gra", "main"); isTrue("main ma być public static", Modifier.isPublic(m) && Modifier.isStatic(m));`),
          ],
        },
        quiz: [
          Q('Od czego zaczyna się wykonywanie programu w Javie?', ['od metody main', 'od pierwszej klasy w alfabecie', 'od ostatniej linijki pliku', 'od słowa public'], 0, 'Java szuka metody <code>main</code> i od niej zaczyna.'),
          Q('Gdzie piszemy metodę <code>main</code>?', ['wewnątrz klasy', 'poza klasą', 'w osobnym pliku tekstowym', 'w komentarzu'], 0, 'Wszystko w Javie leży w klasach – także metody.'),
          Q('Czym jest metoda?', ['nazwanym blokiem poleceń w klasie', 'pojedynczą liczbą', 'nazwą pliku', 'komentarzem'], 0, 'Metoda to „podprogram” z własną nazwą i klamrami.'),
          Q('Co się stanie, gdy w klasie startowej nie ma metody <code>main</code>?', ['Java nie wie, od czego zacząć – program się nie uruchomi', 'program wypisze 0', 'kompilator doda ją sam', 'program wystartuje od pierwszej linijki'], 0, 'Bez <code>main</code> nie ma punktu startu.'),
        ],
      },

      /* ============ 5. STATIC / VOID / ARGS ============ */
      {
        id: 'start-static-void', title: 'static, void i (String[] args)', blurb: 'co znaczy każde słowo w nagłówku main', minutes: 5,
        content: [
          A('🧩', 'Nagłówek <code>main</code> to jedno długie zdanie. Rozbierzmy je na <b>wyrazy</b>, tak jak na lekcji polskiego – każdy ma swoją rolę.'),
          V('cells', { title: 'public static void main(String[] args)', rows: [
            { cells: ['public', 'static', 'void', 'main', '(String[] args)'], top: ['kto może uruchomić', 'bez tworzenia obiektu', 'nic nie zwraca', 'nazwa metody', 'dodatkowe dane'], hl: [1, 2, 4] }] }),
          T([['<code>public</code>', 'metoda jest publiczna – Java może ją uruchomić z zewnątrz'], ['<code>static</code>', 'metodę można uruchomić <b>bez tworzenia obiektu</b> (jak automat przykręcony do ściany – nie trzeba go najpierw „kupować”). Dokładnie poznasz to w module 4.'], ['<code>void</code>', '„pustka” – metoda <b>nic nie oddaje</b>, tylko wykonuje polecenia'], ['<code>main</code>', 'nazwa metody; zawsze dokładnie tak'], ['<code>(String[] args)</code>', 'pudełko na ewentualne dodatkowe dane przekazane programowi przy starcie – <b>na razie go nie używamy</b>, ale musi być']]),
          { t: 'note', k: 'tip', x: 'Gdy zapomnisz którekolwiek z tych słów, Java nie rozpozna metody jako punktu startu. Dlatego nagłówek <code>main</code> zawsze zapisujemy <b>identycznie</b>.' },
        ],
        guide: {
          files: [F('Main.java', 'public class Main {\n    public main() {\n    }\n}\n')],
          steps: [
            { say: '<p>W nagłówku brakuje słowa <code>static</code>. Wstaw je po <code>public</code>: dzięki niemu Java uruchomi <code>main</code> bez tworzenia obiektu.</p>', type: 'public static main() {', expect: J`public\s+static\s+(void\s+)?main` },
            { say: '<p>Metoda <code>main</code> niczego nie oddaje, więc przed jej nazwą potrzebne jest <code>void</code>. Wstaw je między <code>static</code> a <code>main</code>.</p>', type: 'public static void main() {', expect: J`static\s+void\s+main` },
            { say: '<p>Na końcu dopisz w nawiasach <code>String[] args</code> – pudełko na dodatkowe dane startowe (nie będziemy go używać, ale musi tam być).</p>', type: 'public static void main(String[] args) {', expect: J`main\s*\(\s*String\s*\[\s*\]\s*args\s*\)` },
          ],
          solution: [F('Main.java', 'public class Main {\n    public static void main(String[] args) {\n    }\n}\n')],
          checks: [
            CK(CR, 'Metoda main(String[] args) istnieje', J`method("Main", "main", String[].class);`),
            CK(CR, 'main jest public static', J`int m = methodMods("Main", "main"); isTrue("main ma być public static", Modifier.isPublic(m) && Modifier.isStatic(m));`),
            CK(MD, 'main ma typ void', J`isTrue("main ma zwracać void", method("Main", "main", String[].class).getReturnType() == void.class);`),
          ],
        },
        exercise: {
          prompt: '<p>W klasie <code>Aplikacja</code> metoda <code>main</code> jest zapisana niepoprawnie – <b>brakuje dwóch słów</b>. Znajdź je i popraw nagłówek.</p>',
          files: [F('Aplikacja.java', 'public class Aplikacja {\n    static main(String[] args) {\n    }\n}\n')],
          hints: ['Brakuje słowa przed <code>static</code> (kto może uruchomić) i słowa po <code>static</code> (co metoda zwraca).', 'Pełny nagłówek: <code>public static void main(String[] args)</code>.'],
          solution: [F('Aplikacja.java', 'public class Aplikacja {\n    public static void main(String[] args) {\n    }\n}\n')],
          checks: [
            CK(CR, 'Metoda main(String[] args) istnieje i się kompiluje', J`method("Aplikacja", "main", String[].class);`),
            CK(CR, 'main jest public static', J`int m = methodMods("Aplikacja", "main"); isTrue("main ma być public static", Modifier.isPublic(m) && Modifier.isStatic(m));`),
            CK(MD, 'main ma typ void', J`isTrue("main ma zwracać void", method("Aplikacja", "main", String[].class).getReturnType() == void.class);`),
          ],
        },
        quiz: [
          Q('Co znaczy <code>void</code> w nagłówku metody?', ['metoda nic nie zwraca', 'metoda zwraca liczbę', 'metoda jest prywatna', 'metoda nie ma nazwy'], 0, '<code>void</code> = „pustka”, brak wartości zwracanej.'),
          Q('Po co jest <code>static</code> przy <code>main</code> (na razie)?', ['żeby Java mogła uruchomić metodę bez tworzenia obiektu', 'żeby metoda była szybsza', 'żeby ukryć metodę', 'żeby nie dało się jej wywołać'], 0, 'Szczegóły w module o elementach statycznych.'),
          Q('Czym jest <code>String[] args</code> w nagłówku <code>main</code>?', ['pudełkiem na dodatkowe dane przekazane programowi przy starcie (na razie nieużywanym)', 'nazwą klasy', 'liczbą całkowitą', 'wynikiem programu'], 0, 'Jest wymagane, ale w naszych programach go nie używamy.'),
          Q('Który nagłówek <code>main</code> jest poprawny?', ['public static void main(String[] args)', 'public void main(String args)', 'static main(String[] args)', 'public static int main()'], 0, 'Wszystkie słowa muszą być na swoim miejscu.'),
        ],
      },

      /* ============ 6. PRINTLN ============ */
      {
        id: 'start-println', title: 'System.out.println – wypisywanie tekstu', blurb: 'ekran, println, cudzysłów, średnik', minutes: 5,
        content: [
          A('📢', 'Program pracuje „w ciszy”, dopóki nie każesz mu coś <b>powiedzieć</b>. Do tego służy polecenie <code>System.out.println(...)</code> – to jak <b>krzyknięcie na ekran</b> tego, co jest w nawiasie.'),
          V('cells', { title: 'System.out.println("Hej!");', rows: [
            { cells: ['System.out', '.', 'println', '(', '"Hej!"', ')', ';'], top: ['ekran (konsola)', 'weź z środka', 'wypisz linię', 'otwórz', 'tekst w cudzysłowie', 'zamknij', 'koniec polecenia'], hl: [4] }] }),
          UL(['<code>System.out</code> – „ekran” (konsola), na który program wypisuje tekst.', '<code>println</code> – od „print line”: <b>wypisz i przejdź do nowej linii</b>.', 'Tekst piszemy w <b>cudzysłowie</b> <code>"..."</code>. Bez cudzysłowu Java pomyśli, że to nazwa czegoś innego.', 'Każde polecenie kończymy <b>średnikiem</b> <code>;</code> – jak kropką w zdaniu.']),
          { t: 'code', run: true, title: 'Main.java', out: 'Java\nsuper', x: M(['System.out.println("Java");', 'System.out.println("super");']) },
          { t: 'note', k: 'warn', x: 'Częste błędy początkujących: brak średnika na końcu, brak cudzysłowu, <b>nawiasy klamrowe zamiast okrągłych</b> (<code>println {"x"}</code> jest błędem – po <code>println</code> zawsze <code>( )</code>) oraz literówka w wielkości liter (<code>system.out</code> zamiast <code>System.out</code>).' },
        ],
        guide: {
          files: MAINF,
          steps: [
            { say: '<p>Wewnątrz metody <code>main</code> (między jej klamrami) zacznij od <code>System.out.println(</code>. <code>System.out</code> to ekran, kropka znaczy „weź z środka”, <code>println</code> to „wypisz linię”, a nawias <b>okrągły</b> otwiera to, co chcesz wypisać.</p>', type: 'System.out.println(', expect: J`System\.out\.println\s*\(` },
            { say: '<p>Teraz tekst do wypisania. <b>Musi być w cudzysłowie</b> – tak Java wie, że to zwykły tekst. Wpisz <code>"Hej!"</code> (z cudzysłowami).</p>', type: '"Hej!"', expect: J`println\s*\(\s*"Hej!"` },
            { say: '<p>Zamknij nawias okrągły i postaw <b>średnik</b> – koniec polecenia, jak kropka w zdaniu.</p>', type: ');', expect: J`println\s*\(\s*"Hej!"\s*\)\s*;` },
          ],
          solution: [F('Main.java', M(['System.out.println("Hej!");']))],
          checks: [
            CK(CR, 'Program wypisuje „Hej!”', J`List<String> o = lines(runMain()); isTrue("Program powinien wypisać Hej! – a wypisał: " + o, o.size() == 1 && o.get(0).equals("Hej!"));`),
            CK(MN, 'Użyto System.out.println', J`isTrue("Użyj System.out.println", srcHas("Main", "System\\.out\\.println"));`),
          ],
        },
        exercise: {
          prompt: '<p>Wypisz <b>trzy linie</b> – w każdej jedno słowo:</p><pre>Ala\nma\nkota</pre><p>Każda linia to osobne polecenie <code>System.out.println</code>.</p>',
          files: MAINF,
          hints: ['Trzy razy: <code>System.out.println("...");</code>, jedno pod drugim.', 'Pamiętaj o cudzysłowie i średniku w każdej linijce.'],
          solution: [F('Main.java', M(['System.out.println("Ala");', 'System.out.println("ma");', 'System.out.println("kota");']))],
          checks: [
            CK(CR, 'Wynik to trzy linie: Ala, ma, kota', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Ala, ma, kota] – program wypisał: " + o, o.equals(Arrays.asList("Ala", "ma", "kota")));`),
            CK(MN, 'Użyto trzech poleceń println', J`isTrue("Użyj trzech razy System.out.println", srcCount(src("Main"), "System\\.out\\.println\\s*\\(") >= 3);`),
          ],
        },
        quiz: [
          Q('Co robi <code>System.out.println("Ala")</code>?', ['wypisuje Ala i przechodzi do nowej linii', 'wypisuje "Ala" razem z cudzysłowami', 'wczytuje tekst z klawiatury', 'nic nie robi'], 0, 'Cudzysłów oznacza tekst i nie jest wypisywany.'),
          Q('Czym kończymy polecenie w Javie?', ['średnikiem ;', 'kropką .', 'dwukropkiem :', 'przecinkiem ,'], 0, 'Średnik kończy instrukcję.'),
          Q('Po co jest cudzysłów w <code>"Hej"</code>?', ['oznacza, że to tekst', 'kończy polecenie', 'otwiera klasę', 'jest komentarzem'], 0, 'Bez cudzysłowu Java szuka zmiennej o takiej nazwie.'),
          Q('Co oznacza <code>System.out</code>?', ['ekran (konsolę), na który wypisujemy', 'klawiaturę', 'plik na dysku', 'nazwę klasy użytkownika'], 0, '<code>out</code> = wyjście programu.'),
          OUT('Co wypisze program?', ['Java<br>super', 'Java super', 'Javasuper', 'super<br>Java'], 0, 'Każde <code>println</code> wypisuje w nowej linii.', M(['System.out.println("Java");', 'System.out.println("super");'])),
        ],
      },

      /* ============ 7. PRINT ============ */
      {
        id: 'start-print', title: 'print kontra println', blurb: 'czy przejść do nowej linii?', minutes: 3,
        content: [
          A('⌨️', '<code>println</code> działa jak <b>Enter</b> na końcu zdania – po wypisaniu przechodzi do nowej linii. <code>print</code> to pisanie <b>bez Entera</b> – kolejny tekst pojawi się tuż obok.'),
          V('compare', { cols: [
            { icon: '↩️', title: 'println("A")', c: 'accent', sub: 'wypisz i przejdź niżej', items: ['<code>println("A"); println("B");</code>', 'wynik: A i B w dwóch liniach'] },
            { icon: '➡️', title: 'print("A")', c: 'ok', sub: 'wypisz i zostań w tej linii', items: ['<code>print("A"); print("B");</code>', 'wynik: AB w jednej linii'] }] }),
          { t: 'code', run: true, title: 'Main.java', out: 'ABC\nD', x: M(['System.out.print("A");', 'System.out.print("B");', 'System.out.println("C");', 'System.out.println("D");']) },
        ],
        guide: {
          files: MAINF,
          steps: [
            { say: '<p>Wypiszemy w jednej linii napis „Java Akademia!”, ale <b>w kawałkach</b>. Pierwszy kawałek: <code>print</code> (bez „ln”) – zostaje w tej samej linii.</p>', type: 'System.out.print("Java");', expect: J`System\.out\.print\s*\(\s*"Java"\s*\)\s*;` },
            { say: '<p>Drugi kawałek, też <code>print</code>. Zwróć uwagę na <b>spację na początku</b> tekstu – print niczego sam nie dodaje.</p>', type: 'System.out.print(" Akademia");', expect: J`print\s*\(\s*" Akademia"\s*\)\s*;` },
            { say: '<p>Na końcu <code>println</code>: wypisze wykrzyknik i dopiero teraz przejdzie do nowej linii.</p>', type: 'System.out.println("!");', expect: J`println\s*\(\s*"!"\s*\)\s*;` },
          ],
          solution: [F('Main.java', M(['System.out.print("Java");', 'System.out.print(" Akademia");', 'System.out.println("!");']))],
          checks: [
            CK(CR, 'Wynik to jedna linia: Java Akademia!', J`List<String> o = lines(runMain()); isTrue("Oczekiwano jednej linii: Java Akademia! – program wypisał: " + o, o.equals(Arrays.asList("Java Akademia!")));`),
            CK(MN, 'Użyto print (bez ln)', J`isTrue("Użyj System.out.print", srcCount(src("Main"), "System\\.out\\.print\\s*\\(") >= 2);`),
          ],
        },
        exercise: {
          prompt: '<p>Wypisz w <b>jednej linii</b> napis <code>ABC</code> – każda litera osobnym poleceniem <code>print</code>. Potem w <b>następnej linii</b> słowo <code>Koniec</code>.</p><pre>ABC\nKoniec</pre>',
          files: MAINF,
          hints: ['Trzy razy <code>System.out.print("...")</code>, a potem jedno <code>System.out.println("Koniec")</code> – ale najpierw trzeba przejść do nowej linii!', 'Ostatnia litera może być wypisana przez <code>println("C")</code>, wtedy „Koniec” pojawi się niżej.'],
          solution: [F('Main.java', M(['System.out.print("A");', 'System.out.print("B");', 'System.out.println("C");', 'System.out.println("Koniec");']))],
          checks: [
            CK(CR, 'Wynik: linia ABC i linia Koniec', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [ABC, Koniec] – program wypisał: " + o, o.equals(Arrays.asList("ABC", "Koniec")));`),
            CK(MN, 'Użyto print co najmniej dwa razy', J`isTrue("Użyj System.out.print do pojedynczych liter", srcCount(src("Main"), "System\\.out\\.print\\s*\\(") >= 2);`),
          ],
        },
        quiz: [
          Q('Czym różni się <code>print</code> od <code>println</code>?', ['println przechodzi do nowej linii, print zostaje w tej samej', 'print jest szybszy', 'println drukuje na drukarce', 'nie ma różnicy'], 0, '„ln” = line, nowa linia.'),
          OUT('Co wypisze program?', ['ABC<br>D', 'A<br>B<br>C<br>D', 'ABCD', 'DCBA'], 0, 'Trzy pierwsze polecenia kończą się w tej samej linii; dopiero <code>println("C")</code> przechodzi niżej.', M(['System.out.print("A");', 'System.out.print("B");', 'System.out.println("C");', 'System.out.println("D");'])),
          OUT('Co wypisze program?', ['123', '1<br>2<br>3', '321', '1 2 3'], 0, '<code>print</code> nie dodaje spacji ani nowych linii.', M(['System.out.print("1");', 'System.out.print("2");', 'System.out.print("3");'])),
        ],
      },

      /* ============ 8. PIERWSZY CAŁY PROGRAM ============ */
      {
        id: 'start-hello', title: 'Pierwszy kompletny program', blurb: 'składamy: class + public + main + println', minutes: 5,
        content: [
          A('🧱', 'Znasz już wszystkie klocki: <b>klasę</b>, <b>public</b>, <b>metodę main</b> i <b>wypisywanie</b>. Teraz układamy je w całość – jak klocki Lego od największego (klasa) do najmniejszego (polecenie).'),
          V('flow', { dir: 'v', title: 'Kolejne „pudełka” jedno w drugim', steps: [
            { t: 'public class Main { … }', s: 'klasa – największe pudełko', c: 'accent' },
            { t: 'public static void main(String[] args) { … }', s: 'metoda main wewnątrz klasy', c: 'warn' },
            { t: 'System.out.println("…");', s: 'polecenie wewnątrz metody', c: 'ok' }] }),
          { t: 'code', run: true, title: 'Main.java', out: 'Witaj, świecie!', x: M(['System.out.println("Witaj, świecie!");']) },
        ],
        guide: {
          files: [F('Main.java', '')],
          steps: [
            { say: '<p><b>Krok 1 – klasa.</b> Wpisz nagłówek klasy publicznej (<code>public class</code> + nazwa <code>Main</code>) i otwórz klamrę.</p>', type: 'public class Main {', expect: J`public\s+class\s+Main\s*\{` },
            { say: '<p><b>Krok 2 – metoda main.</b> Wewnątrz klasy wpisz nagłówek <code>main</code> – to miejsce startu programu.</p>', type: '    public static void main(String[] args) {', expect: J`public\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]\s*args\s*\)\s*\{` },
            { say: '<p><b>Krok 3 – polecenie.</b> W środku <code>main</code> każ programowi wypisać powitanie. Pamiętaj: nawiasy <b>okrągłe</b>, cudzysłów, średnik.</p>', type: '        System.out.println("Witaj, świecie!");', expect: J`println\s*\(\s*"Witaj, świecie!"\s*\)\s*;` },
            { say: '<p><b>Krok 4 – zamknięcie.</b> Zamknij klamrą najpierw metodę <code>main</code>, a potem klasę. Klamry zamykamy w odwrotnej kolejności niż otwieraliśmy.</p>', type: '    }\n}', expect: J`;\s*\}\s*\}` },
          ],
          solution: [F('Main.java', M(['System.out.println("Witaj, świecie!");']))],
          checks: [
            CK(CR, 'Program wypisuje „Witaj, świecie!”', J`List<String> o = lines(runMain()); isTrue("Program powinien wypisać Witaj, świecie! – a wypisał: " + o, o.size() == 1 && o.get(0).equals("Witaj, świecie!"));`),
            CK(MD, 'Klasa Main jest publiczna, a main jest public static void', J`isTrue("Klasa Main ma być public", Modifier.isPublic(cls("Main").getModifiers())); int m = methodMods("Main", "main"); isTrue("main ma być public static", Modifier.isPublic(m) && Modifier.isStatic(m));`),
          ],
        },
        exercise: {
          prompt: '<p>Napisz program, który wypisze w konsoli <b>dwie linie</b>:</p><pre>Witaj, Javo!\nZaczynamy</pre><p>Cała klasa i metoda <code>main</code> już są – dopisz tylko polecenia.</p>',
          files: [F('Main.java', 'public class Main {\n    public static void main(String[] args) {\n        // tu napisz kod\n    }\n}\n')],
          hints: ['Dwa razy <code>System.out.println("...");</code>, jedno pod drugim.', 'Tekst w cudzysłowie ma być identyczny, łącznie z przecinkiem i wykrzyknikiem.'],
          solution: [F('Main.java', M(['System.out.println("Witaj, Javo!");', 'System.out.println("Zaczynamy");']))],
          checks: [
            CK(CR, 'Pierwsza linia: „Witaj, Javo!”', J`List<String> o = lines(runMain()); isTrue("Pierwsza linia powinna brzmieć: Witaj, Javo! – a program wypisał: " + o, !o.isEmpty() && o.get(0).equals("Witaj, Javo!"));`),
            CK(MD, 'Druga linia: „Zaczynamy”', J`List<String> o = lines(runMain()); isTrue("Druga linia powinna brzmieć: Zaczynamy – a program wypisał: " + o, o.size() > 1 && o.get(1).equals("Zaczynamy"));`),
            CK(MN, 'Użyto System.out.println', J`isTrue("Użyj System.out.println do wypisania linii", srcHas("Main", "System\\.out\\.println"));`),
          ],
        },
        quiz: [
          Q('Publiczna klasa o nazwie <code>Sklep</code> musi znajdować się w pliku:', ['sklep.java', 'Sklep.java', 'Main.java', 'Sklep.class'], 1, 'Nazwa pliku = nazwa publicznej klasy, z zachowaniem wielkości liter.'),
          Q('Które elementy są potrzebne w najprostszym programie, który coś wypisuje?', ['klasa', 'metoda main', 'polecenie System.out.println', 'zmienna'], [0, 1, 2], 'Zmienna nie jest potrzebna – możesz wypisać sam tekst.'),
          Q('W jakiej kolejności zamykamy klamry na końcu programu?', ['najpierw metodę main, potem klasę', 'najpierw klasę, potem metodę main', 'kolejność nie ma znaczenia', 'klamer nie zamykamy'], 0, 'Pudełka zamykamy od najmniejszego (metoda) do największego (klasa).'),
          OUT('Co wypisze program?', ['Witaj<br>Javo', 'Witaj Javo', 'WitajJavo', 'Javo<br>Witaj'], 0, 'Dwa polecenia <code>println</code> – dwie linie, od góry do dołu.', M(['System.out.println("Witaj");', 'System.out.println("Javo");'])),
        ],
      },

      /* ============ 9. ZMIENNA ============ */
      {
        id: 'start-zmienna', title: 'Zmienna i typ int', blurb: 'pudełko z etykietą, deklaracja, zmiana wartości', minutes: 5,
        content: [
          A('📦', 'Zmienna to <b>pudełko z etykietą</b>. Na etykiecie jest <b>nazwa</b> (<code>wiek</code>), w środku <b>wartość</b> (<code>17</code>). Wartość możesz wyjąć, podejrzeć albo wymienić na inną – nazwa zostaje ta sama.'),
          V('cells', { title: 'int wiek = 17;', rows: [
            { cells: ['int', 'wiek', '=', '17', ';'], top: ['typ pudełka', 'nazwa (etykieta)', 'włóż do środka', 'wartość', 'koniec'], hl: [3] }],
            cap: '<code>int</code> mówi, że w pudełku leżą <b>liczby całkowite</b>. Nazwę zmiennej piszemy małymi literami.' }),
          UL(['<b>Deklaracja</b> – utworzenie zmiennej: <code>int wiek = 17;</code> (typ, nazwa, <code>=</code>, wartość).', 'Wartość <b>zmieniasz</b> bez powtarzania typu: <code>wiek = 18;</code>.', 'Wypisując zmienną, <b>nie</b> dajesz cudzysłowu: <code>println(wiek)</code> pokaże <code>17</code>, a <code>println("wiek")</code> pokaże słowo „wiek”.']),
          { t: 'code', run: true, title: 'Main.java', out: '17\n18', x: M(['int wiek = 17;', 'System.out.println(wiek);', 'wiek = 18;', 'System.out.println(wiek);']) },
        ],
        guide: {
          files: MAINF,
          steps: [
            { say: '<p>Utwórz zmienną. <code>int</code> – typ (liczby całkowite), <code>wiek</code> – nazwa (etykieta), <code>=</code> – „włóż do środka”, <code>17</code> – wartość. Na końcu średnik.</p>', type: 'int wiek = 17;', expect: J`int\s+wiek\s*=\s*17\s*;` },
            { say: '<p>Wypisz wartość zmiennej. <b>Bez cudzysłowu</b> – chcemy to, co leży w pudełku, a nie słowo „wiek”.</p>', type: 'System.out.println(wiek);', expect: J`println\s*\(\s*wiek\s*\)\s*;` },
            { say: '<p>Zmień wartość. Zmienna już istnieje, więc <b>nie piszemy</b> drugi raz <code>int</code> – tylko nazwa, <code>=</code> i nowa wartość.</p>', type: 'wiek = 18;', expect: J`\bwiek\s*=\s*18\s*;` },
            { say: '<p>Wypisz zmienną jeszcze raz – zobaczysz, że w pudełku leży już nowa wartość.</p>', type: 'System.out.println(wiek);', expect: J`println\s*\(\s*wiek\s*\)\s*;.*println\s*\(\s*wiek\s*\)\s*;` },
          ],
          solution: [F('Main.java', M(['int wiek = 17;', 'System.out.println(wiek);', 'wiek = 18;', 'System.out.println(wiek);']))],
          checks: [
            CK(CR, 'Program wypisuje 17, a potem 18', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [17, 18] – program wypisał: " + o, o.equals(Arrays.asList("17", "18")));`),
            CK(MN, 'Zmienna wiek jest zadeklarowana jako int', J`isTrue("Zadeklaruj: int wiek = 17;", srcHas("Main", "int\\s+wiek\\s*=\\s*17"));`),
          ],
        },
        exercise: {
          prompt: '<p>Zadeklaruj dwie zmienne całkowite: <code>ile</code> o wartości <b>3</b> i <code>cena</code> o wartości <b>20</b>. Wypisz po kolei <code>ile</code>, potem <code>cena</code>. Następnie <b>zmień</b> <code>cena</code> na <b>25</b> i wypisz ją jeszcze raz.</p><pre>3\n20\n25</pre>',
          files: MAINF,
          hints: ['<code>int ile = 3;</code> i <code>int cena = 20;</code>', 'Zmiana wartości: <code>cena = 25;</code> – bez słowa <code>int</code>.', 'Wypisywanie: <code>System.out.println(ile);</code> – bez cudzysłowu.'],
          solution: [F('Main.java', M(['int ile = 3;', 'int cena = 20;', 'System.out.println(ile);', 'System.out.println(cena);', 'cena = 25;', 'System.out.println(cena);']))],
          checks: [
            CK(CR, 'Wynik: 3, 20, 25', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [3, 20, 25] – program wypisał: " + o, o.equals(Arrays.asList("3", "20", "25")));`),
            CK(MD, 'Zmienne ile i cena są zadeklarowane jako int', J`isTrue("Zadeklaruj int ile = 3;", srcHas("Main", "int\\s+ile\\s*=\\s*3")); isTrue("Zadeklaruj int cena = 20;", srcHas("Main", "int\\s+cena\\s*=\\s*20"));`),
            CK(MN, 'Wartość cena zmieniono bez ponownego int', J`isTrue("Zmień wartość: cena = 25;", srcHas("Main", "\\bcena\\s*=\\s*25\\s*;")); isFalse("Nie deklaruj cena drugi raz", srcCount(src("Main"), "int\\s+cena") > 1);`),
          ],
        },
        quiz: [
          Q('Czym jest zmienna?', ['nazwanym miejscem w pamięci, w którym leży wartość', 'poleceniem wypisującym tekst', 'nazwą klasy', 'komentarzem w kodzie'], 0, 'To „pudełko z etykietą”.'),
          Q('Co oznacza <code>int</code>?', ['liczba całkowita', 'tekst', 'prawda lub fałsz', 'liczba z przecinkiem'], 0, '<code>int</code> – typ liczb całkowitych.'),
          Q('Jak zmienić wartość istniejącej zmiennej <code>wiek</code> na 18?', ['wiek = 18;', 'int wiek = 18;', 'wiek := 18;', 'set wiek 18;'], 0, 'Bez powtarzania typu – zmienna już istnieje (drugie <code>int wiek</code> byłoby błędem).'),
          OUT('Co wypisze program?', ['9', '5', 'x', '14'], 0, 'Zmienna po zmianie ma wartość 9.', M(['int x = 5;', 'x = 9;', 'System.out.println(x);'])),
          OUT('Co wypisze program?', ['wiek', '17', '"wiek"', 'błąd'], 0, 'Cudzysłów oznacza zwykły tekst, a nie zmienną.', M(['int wiek = 17;', 'System.out.println("wiek");'])),
        ],
      },

      /* ============ 10. TYPY ============ */
      {
        id: 'start-typy', title: 'Typy: double, String, boolean, char', blurb: 'jakie rodzaje pudełek mamy', minutes: 6,
        content: [
          A('🧰', 'Pudełka bywają różne: na śrubki, na papiery, na jedzenie. Podobnie <b>typ zmiennej</b> mówi, <b>co wolno do niej włożyć</b>. Znasz już <code>int</code> – oto reszta najważniejszych.'),
          V('cells', { title: 'Cztery kolejne rodzaje pudełek', rows: [
            { label: 'double cena', cells: ['4.99'] },
            { label: 'String imie', cells: ['"Ola"'] },
            { label: 'boolean ok', cells: ['true'] },
            { label: 'char litera', cells: ["'J'"] }] }),
          T([['<code>int</code>', 'liczby całkowite: <code>17</code>, <code>-3</code>'], ['<code>double</code>', 'liczby z <b>kropką</b>: <code>4.99</code> (nie przecinkiem!)'], ['<code>String</code>', 'tekst w <b>cudzysłowie</b>: <code>"Ola"</code>; piszemy z <b>dużej litery S</b>'], ['<code>boolean</code>', 'tylko <code>true</code> (prawda) albo <code>false</code> (fałsz)'], ['<code>char</code>', 'jeden znak w <b>apostrofach</b>: <code>\'J\'</code>']]),
          { t: 'note', k: 'warn', x: 'Uwaga na cudzysłów i apostrof: tekst <code>"Ola"</code> (podwójny) to <code>String</code>, pojedynczy znak <code>\'J\'</code> (apostrofy) to <code>char</code>. W Javie liczby zapisujemy <b>z kropką</b>: <code>4.99</code>.' },
        ],
        guide: {
          files: MAINF,
          steps: [
            { say: '<p>Liczba z kropką – typ <code>double</code>.</p>', type: 'double cena = 4.99;', expect: J`double\s+cena\s*=\s*4\.99\s*;` },
            { say: '<p>Tekst – typ <code>String</code> (duże S!) i wartość w cudzysłowie.</p>', type: 'String imie = "Ola";', expect: J`String\s+imie\s*=\s*"Ola"\s*;` },
            { say: '<p>Prawda lub fałsz – typ <code>boolean</code>. Wartość bez cudzysłowu.</p>', type: 'boolean pelnoletni = true;', expect: J`boolean\s+pelnoletni\s*=\s*true\s*;` },
            { say: '<p>Pojedynczy znak – typ <code>char</code>, wartość w <b>apostrofach</b>.</p>', type: "char litera = 'J';", expect: J`char\s+litera\s*=\s*'J'\s*;` },
            { say: '<p>Wypisz wszystkie cztery zmienne, każdą w osobnej linii. Bez cudzysłowów – chcemy wartości z pudełek.</p>', type: 'System.out.println(cena);\nSystem.out.println(imie);\nSystem.out.println(pelnoletni);\nSystem.out.println(litera);', expect: J`println\s*\(\s*cena\s*\).*println\s*\(\s*imie\s*\).*println\s*\(\s*pelnoletni\s*\).*println\s*\(\s*litera\s*\)` },
          ],
          solution: [F('Main.java', M(['double cena = 4.99;', 'String imie = "Ola";', 'boolean pelnoletni = true;', "char litera = 'J';", 'System.out.println(cena);', 'System.out.println(imie);', 'System.out.println(pelnoletni);', 'System.out.println(litera);']))],
          checks: [
            CK(CR, 'Wynik: 4.99, Ola, true, J', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [4.99, Ola, true, J] – program wypisał: " + o, o.equals(Arrays.asList("4.99", "Ola", "true", "J")));`),
            CK(MD, 'Użyto czterech typów', J`isTrue("Użyj typów double, String, boolean i char", srcHas("Main", "double\\s+cena") && srcHas("Main", "String\\s+imie") && srcHas("Main", "boolean\\s+pelnoletni") && srcHas("Main", "char\\s+litera"));`),
          ],
        },
        exercise: {
          prompt: '<p>Zadeklaruj zmienne: <code>miasto</code> (<b>String</b>) = <code>"Warszawa"</code>, <code>temperatura</code> (<b>double</b>) = <code>21.5</code>, <code>czyDeszcz</code> (<b>boolean</b>) = <code>false</code>. Wypisz je w tej kolejności, każdą w osobnej linii.</p><pre>Warszawa\n21.5\nfalse</pre>',
          files: MAINF,
          hints: ['<code>String miasto = "Warszawa";</code>', '<code>double temperatura = 21.5;</code> (kropka, nie przecinek)', '<code>boolean czyDeszcz = false;</code>'],
          solution: [F('Main.java', M(['String miasto = "Warszawa";', 'double temperatura = 21.5;', 'boolean czyDeszcz = false;', 'System.out.println(miasto);', 'System.out.println(temperatura);', 'System.out.println(czyDeszcz);']))],
          checks: [
            CK(CR, 'Wynik: Warszawa, 21.5, false', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Warszawa, 21.5, false] – program wypisał: " + o, o.equals(Arrays.asList("Warszawa", "21.5", "false")));`),
            CK(MD, 'Zmienne mają właściwe typy', J`isTrue("miasto ma być String", srcHas("Main", "String\\s+miasto")); isTrue("temperatura ma być double", srcHas("Main", "double\\s+temperatura")); isTrue("czyDeszcz ma być boolean", srcHas("Main", "boolean\\s+czyDeszcz"));`),
          ],
        },
        quiz: [
          Q('Jaki typ reprezentuje <b>tekst</b>?', ['string', 'String', 'char', 'text'], 1, 'Klasa <code>String</code> – z dużej litery.'),
          Q('Jaki typ przechowuje tylko <code>true</code> lub <code>false</code>?', ['boolean', 'int', 'String', 'double'], 0, '<code>boolean</code> – typ logiczny.'),
          Q('Jak zapisać pojedynczy znak J?', ["'J'", '"J"', 'J', '(J)'], 0, 'Znak <code>char</code> – w apostrofach. <code>"J"</code> to String.'),
          Q('Który zapis jest poprawny?', ['double x = 2.5;', 'int x = 2.5;', 'String x = 5;', 'boolean x = "true";'], 0, 'Do <code>int</code> nie wpiszesz ułamka, do <code>String</code> – liczby bez cudzysłowu, a <code>boolean</code> nie bierze tekstu.'),
        ],
      },

      /* ============ 11. KONKATENACJA ============ */
      {
        id: 'start-konkatenacja', title: 'Sklejanie tekstu plusem', blurb: 'tekst + zmienna w jednej linii', minutes: 4,
        content: [
          A('🔗', 'Znak <code>+</code> przy tekście działa jak <b>klej</b>: łączy kawałki w jeden napis. Dzięki niemu w jednej linii możesz wypisać „Imię: ” i wartość zmiennej.'),
          V('flow', { title: '"Imie: " + imie', steps: [
            { t: '"Imie: "', s: 'tekst', c: 'accent' },
            { t: '+', s: 'klej' },
            { t: 'imie', s: 'zmienna z wartością „Ola”', c: 'warn' },
            { t: 'Imie: Ola', s: 'wynik: jeden napis', c: 'ok' }] }),
          { t: 'code', run: true, title: 'Main.java', out: 'Imie: Ola\nOla ma 17 lat', x: M(['String imie = "Ola";', 'int wiek = 17;', 'System.out.println("Imie: " + imie);', 'System.out.println(imie + " ma " + wiek + " lat");']) },
          { t: 'note', k: 'warn', x: 'Pilnuj <b>spacji</b> wewnątrz cudzysłowów: <code>" ma "</code> ma spacje z obu stron, dlatego w wyniku jest „Ola ma 17 lat”, a nie „Olama17lat”.' },
        ],
        guide: {
          files: [F('Main.java', M(['String imie = "Ola";', 'int wiek = 17;']))],
          steps: [
            { say: '<p>Wypisz tekst <code>"Imie: "</code> sklejony plusem ze zmienną <code>imie</code>. Zwróć uwagę na spację po dwukropku – leży <b>w cudzysłowie</b>.</p>', type: 'System.out.println("Imie: " + imie);', expect: J`println\s*\(\s*"Imie: "\s*\+\s*imie\s*\)\s*;` },
            { say: '<p>To samo ze zmienną liczbową – plus skleja też liczbę z tekstem.</p>', type: 'System.out.println("Wiek: " + wiek);', expect: J`println\s*\(\s*"Wiek: "\s*\+\s*wiek\s*\)\s*;` },
            { say: '<p>Możesz skleić wiele kawałków naraz: zmienna, tekst, zmienna, tekst.</p>', type: 'System.out.println(imie + " ma " + wiek + " lat");', expect: J`println\s*\(\s*imie\s*\+\s*" ma "\s*\+\s*wiek\s*\+\s*" lat"\s*\)\s*;` },
          ],
          solution: [F('Main.java', M(['String imie = "Ola";', 'int wiek = 17;', 'System.out.println("Imie: " + imie);', 'System.out.println("Wiek: " + wiek);', 'System.out.println(imie + " ma " + wiek + " lat");']))],
          checks: [
            CK(CR, 'Wynik: Imie: Ola / Wiek: 17 / Ola ma 17 lat', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Imie: Ola, Wiek: 17, Ola ma 17 lat] – program wypisał: " + o, o.equals(Arrays.asList("Imie: Ola", "Wiek: 17", "Ola ma 17 lat")));`),
            CK(MN, 'Użyto sklejania plusem', J`isTrue("Użyj + do sklejenia tekstu ze zmienną", srcCount(src("Main"), "\\+") >= 4);`),
          ],
        },
        exercise: {
          prompt: '<p>Są już zmienne <code>imie</code> (<code>"Ala"</code>) i <code>punkty</code> (<code>10</code>). Wypisz <b>dwie linie</b>, korzystając ze zmiennych (nie wpisuj gotowych wyników „na sztywno”):</p><pre>Witaj, Ala!\nPunkty: 10</pre>',
          files: [F('Main.java', M(['String imie = "Ala";', 'int punkty = 10;', '// tu napisz kod']))],
          hints: ['<code>"Witaj, " + imie + "!"</code>', '<code>"Punkty: " + punkty</code>'],
          solution: [F('Main.java', M(['String imie = "Ala";', 'int punkty = 10;', 'System.out.println("Witaj, " + imie + "!");', 'System.out.println("Punkty: " + punkty);']))],
          checks: [
            CK(CR, 'Wynik: Witaj, Ala! / Punkty: 10', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Witaj, Ala!, Punkty: 10] – program wypisał: " + o, o.equals(Arrays.asList("Witaj, Ala!", "Punkty: 10")));`),
            CK(MD, 'Wartości pochodzą ze zmiennych', J`isTrue("Użyj zmiennej imie przy sklejaniu", srcHas("Main", "\\+\\s*imie\\b|\\bimie\\s*\\+")); isTrue("Użyj zmiennej punkty przy sklejaniu", srcHas("Main", "\\+\\s*punkty\\b|\\bpunkty\\s*\\+"));`),
          ],
        },
        quiz: [
          Q('Co robi znak <code>+</code> między tekstem a zmienną?', ['skleja je w jeden napis', 'zawsze dodaje liczby', 'zamienia na wielkie litery', 'kończy polecenie'], 0, 'Konkatenacja – sklejanie tekstu.'),
          OUT('Co wypisze program?', ['A12', '3', 'A3', '12A'], 0, 'Idziemy od lewej: „A” + 1 daje „A1”, potem + 2 daje „A12”.', M(['System.out.println("A" + 1 + 2);'])),
          OUT('Co wypisze program?', ['3A', 'A3', '12A', '3'], 0, 'Najpierw 1 + 2 = 3 (liczby), dopiero potem sklejenie z „A”.', M(['System.out.println(1 + 2 + "A");'])),
          OUT('Co wypisze program?', ['Ola ma 5 lat', 'Olama5lat', 'Ola ma wiek lat', 'błąd'], 0, 'Spacje są w cudzysłowach, a zamiast słowa „wiek” wstawiana jest wartość zmiennej.', M(['String imie = "Ola";', 'int wiek = 5;', 'System.out.println(imie + " ma " + wiek + " lat");'])),
        ],
      },

      /* ============ 12. OPERATORY ============ */
      {
        id: 'start-operatory', title: 'Liczenie: + − * i %', blurb: 'arytmetyka i reszta z dzielenia', minutes: 4,
        content: [
          A('🧮', 'Java to także <b>kalkulator</b>: dodaje, odejmuje, mnoży. Jest też jeden operator, którego nie ma na zwykłym kalkulatorze – <code>%</code> – oblicza <b>resztę z dzielenia</b> (tyle zostaje, gdy podzielisz „bez ułamków”).'),
          T([['<code>+</code>', 'dodawanie: <code>7 + 2</code> → 9'], ['<code>-</code>', 'odejmowanie: <code>7 - 2</code> → 5'], ['<code>*</code>', 'mnożenie: <code>7 * 2</code> → 14'], ['<code>%</code>', 'reszta z dzielenia: <code>7 % 2</code> → 1 (bo 7 = 3·2 + <b>1</b>)']]),
          V('compare', { cols: [
            { icon: '🔢', title: 'x % 2 == 0', c: 'ok', sub: 'liczba parzysta', items: ['reszta z dzielenia przez 2 wynosi 0'] },
            { icon: '1️⃣', title: 'x % 2 == 1', c: 'accent', sub: 'liczba nieparzysta', items: ['reszta z dzielenia przez 2 wynosi 1'] }],
            cap: 'Operator <code>%</code> przyda się w warunkach i pętlach (np. do sprawdzania parzystości).' }),
          { t: 'note', k: 'info', x: '<b>Kolejność działań</b> jak w matematyce: najpierw <code>*</code> i <code>%</code>, potem <code>+</code> i <code>-</code>. Nawiasy zmieniają kolejność: <code>(2 + 3) * 4</code> to 20, a <code>2 + 3 * 4</code> to 14.' },
        ],
        guide: {
          files: [F('Main.java', M(['int a = 7;', 'int b = 2;']))],
          steps: [
            { say: '<p>Dodawanie – wynik obliczenia wypisujemy wprost, bez cudzysłowu.</p>', type: 'System.out.println(a + b);', expect: J`println\s*\(\s*a\s*\+\s*b\s*\)` },
            { say: '<p>Mnożenie – gwiazdka <code>*</code>.</p>', type: 'System.out.println(a * b);', expect: J`println\s*\(\s*a\s*\*\s*b\s*\)` },
            { say: '<p>Odejmowanie.</p>', type: 'System.out.println(a - b);', expect: J`println\s*\(\s*a\s*-\s*b\s*\)` },
            { say: '<p>Reszta z dzielenia – operator <code>%</code>. 7 podzielić przez 2 to 3 i <b>zostaje 1</b>.</p>', type: 'System.out.println(a % b);', expect: J`println\s*\(\s*a\s*%\s*b\s*\)` },
          ],
          solution: [F('Main.java', M(['int a = 7;', 'int b = 2;', 'System.out.println(a + b);', 'System.out.println(a * b);', 'System.out.println(a - b);', 'System.out.println(a % b);']))],
          checks: [
            CK(CR, 'Wynik: 9, 14, 5, 1', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [9, 14, 5, 1] – program wypisał: " + o, o.equals(Arrays.asList("9", "14", "5", "1")));`),
          ],
        },
        exercise: {
          prompt: '<p>Są zmienne <code>godziny</code> (5) i <code>stawka</code> (30). Wypisz w dwóch liniach: <b>zarobek</b> (godziny razy stawka) oraz <b>resztę z dzielenia godzin przez 2</b>.</p><pre>150\n1</pre><p>Użyj zmiennych, nie wpisuj gotowych liczb.</p>',
          files: [F('Main.java', M(['int godziny = 5;', 'int stawka = 30;', '// tu napisz kod']))],
          hints: ['<code>System.out.println(godziny * stawka);</code>', 'Reszta: <code>godziny % 2</code>'],
          solution: [F('Main.java', M(['int godziny = 5;', 'int stawka = 30;', 'System.out.println(godziny * stawka);', 'System.out.println(godziny % 2);']))],
          checks: [
            CK(CR, 'Wynik: 150 i 1', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [150, 1] – program wypisał: " + o, o.equals(Arrays.asList("150", "1")));`),
            CK(MD, 'Obliczenia ze zmiennych (* i %)', J`isTrue("Policz godziny * stawka", srcHas("Main", "godziny\\s*\\*\\s*stawka|stawka\\s*\\*\\s*godziny")); isTrue("Policz godziny % 2", srcHas("Main", "godziny\\s*%\\s*2"));`),
          ],
        },
        quiz: [
          Q('Co oblicza operator <code>%</code>?', ['resztę z dzielenia', 'procent', 'mnożenie', 'potęgę'], 0, '<code>10 % 3</code> to 1.'),
          OUT('Co wypisze program?', ['14', '20', '10', '9'], 0, 'Najpierw mnożenie: 3 * 4 = 12, potem 2 + 12.', M(['System.out.println(2 + 3 * 4);'])),
          OUT('Co wypisze program?', ['20', '14', '24', '9'], 0, 'Nawiasy najpierw: (2 + 3) = 5, razy 4.', M(['System.out.println((2 + 3) * 4);'])),
          OUT('Co wypisze program?', ['1', '3', '0', '3.33'], 0, '10 = 3·3 + <b>1</b>.', M(['System.out.println(10 % 3);'])),
          Q('Który warunek sprawdza, że <code>x</code> jest parzyste?', ['x % 2 == 0', 'x / 2 == 0', 'x % 2 = 0', 'x == 2 % 0'], 0, 'Reszta z dzielenia przez 2 równa się 0.'),
        ],
      },

      /* ============ 13. DZIELENIE ============ */
      {
        id: 'start-dzielenie', title: 'Dzielenie liczb całkowitych i rzutowanie', blurb: '7 / 2 to 3 – dlaczego?', minutes: 5,
        content: [
          A('🍕', 'Dzielisz 7 pizz między 2 osoby. Gdy Java liczy na liczbach <b>całkowitych</b>, mówi: „każdy dostaje <b>3</b> całe pizze” – a <b>pół pizzy po prostu wyrzuca</b>. Dlatego <code>7 / 2</code> to 3, nie 3,5.'),
          V('compare', { cols: [
            { icon: '✂️', title: 'int / int', c: 'warn', sub: '7 / 2', items: ['wynik: <b>3</b>', 'ułamek jest obcinany'] },
            { icon: '🍰', title: 'z rzutowaniem na double', c: 'ok', sub: '(double) 7 / 2', items: ['wynik: <b>3.5</b>', 'wystarczy, że jedna liczba jest rzeczywista'] }],
            cap: '<b>Rzutowanie</b> <code>(double)</code> przed liczbą mówi: „traktuj tę liczbę jak rzeczywistą”. Wtedy dzielenie jest „normalne”.' }),
          { t: 'code', run: true, title: 'Main.java', out: '3\n3.5', x: M(['int a = 7;', 'int b = 2;', 'System.out.println(a / b);', 'System.out.println((double) a / b);']) },
          { t: 'note', k: 'exam', x: 'Klasyczna pułapka na kolokwium: <code>9 / 4</code> w Javie daje <b>2</b>, a nie 2.25. Jeśli którakolwiek liczba jest typu <code>double</code> (np. <code>9 / 4.0</code>), wynik też jest <code>double</code>.' },
        ],
        guide: {
          files: [F('Main.java', M(['int a = 7;', 'int b = 2;']))],
          steps: [
            { say: '<p>Zwykłe dzielenie dwóch liczb <code>int</code>. Zobacz, co wyjdzie – część po przecinku zniknie.</p>', type: 'System.out.println(a / b);', expect: J`println\s*\(\s*a\s*/\s*b\s*\)` },
            { say: '<p>Teraz to samo z <b>rzutowaniem</b>: <code>(double)</code> przed <code>a</code> sprawia, że <code>a</code> traktowane jest jak liczba rzeczywista, więc dzielenie jest „normalne”.</p>', type: 'System.out.println((double) a / b);', expect: J`println\s*\(\s*\(\s*double\s*\)\s*a\s*/\s*b\s*\)` },
          ],
          solution: [F('Main.java', M(['int a = 7;', 'int b = 2;', 'System.out.println(a / b);', 'System.out.println((double) a / b);']))],
          checks: [
            CK(CR, 'Wynik: 3 i 3.5', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [3, 3.5] – program wypisał: " + o, o.equals(Arrays.asList("3", "3.5")));`),
          ],
        },
        exercise: {
          prompt: '<p>Są zmienne <code>a</code> (9) i <code>b</code> (4). Wypisz <b>dwie linie</b>: wynik dzielenia całkowitego i wynik z ułamkiem.</p><pre>Calkowite: 2\nRzeczywiste: 2.25</pre><p>Wartości mają wynikać ze zmiennych.</p>',
          files: [F('Main.java', M(['int a = 9;', 'int b = 4;', '// tu napisz kod']))],
          hints: ['<code>System.out.println("Calkowite: " + (a / b));</code> – dzielenie w nawiasie!', '<code>"Rzeczywiste: " + ((double) a / b)</code>'],
          solution: [F('Main.java', M(['int a = 9;', 'int b = 4;', 'System.out.println("Calkowite: " + (a / b));', 'System.out.println("Rzeczywiste: " + ((double) a / b));']))],
          checks: [
            CK(CR, 'Linia „Calkowite: 2”', J`List<String> o = lines(runMain()); isTrue("Brak linii: Calkowite: 2 – wynik: " + o, o.contains("Calkowite: 2"));`),
            CK(CR, 'Linia „Rzeczywiste: 2.25”', J`List<String> o = lines(runMain()); isTrue("Brak linii: Rzeczywiste: 2.25 – wynik: " + o + ". Czy rzutujesz (double) a / b?", o.contains("Rzeczywiste: 2.25"));`),
            CK(MN, 'Użyto rzutowania (double)', J`isTrue("Do dzielenia rzeczywistego użyj rzutowania (double)", srcHas("Main", "\\(\\s*double\\s*\\)"));`),
          ],
        },
        quiz: [
          Q('Ile wynosi <code>7 / 2</code>, gdy obie liczby są typu <code>int</code>?', ['3', '3.5', '4', '2'], 0, 'Dzielenie dwóch int daje int – część ułamkowa jest obcinana.'),
          OUT('Co wypisze program?', ['2', '2.25', '2.0', '3'], 0, 'Obie liczby to <code>int</code>.', M(['System.out.println(9 / 4);'])),
          OUT('Co wypisze program?', ['2.25', '2', '2.0', '3'], 0, 'Skoro jedna liczba jest rzeczywista (4.0), całe dzielenie jest rzeczywiste.', M(['System.out.println(9 / 4.0);'])),
          Q('Jak w Javie uzyskać wynik 3.5 z dzielenia zmiennych <code>int a = 7, b = 2</code>?', ['(double) a / b', 'a // b', 'a % b', 'a / b'], 0, 'Rzutowanie <code>(double)</code> na pierwszej liczbie.'),
        ],
      },

      /* ============ 14. IF ============ */
      {
        id: 'start-if', title: 'Warunek if / else', blurb: 'decyzje w programie', minutes: 5,
        content: [
          A('🚦', '<code>if</code> to <b>rozwidlenie drogi</b>: „jeśli pada deszcz – weź parasol, w przeciwnym razie – okulary”. Program sprawdza <b>warunek</b> (pytanie, na które odpowiedź to „tak” albo „nie”) i wykonuje tylko jedną z dróg.'),
          V('flow', { title: 'if (wiek >= 18) … else …', steps: [
            { t: 'Warunek', s: 'wiek >= 18 ?', c: 'warn' },
            { t: 'Prawda → blok if', s: 'wypisz „Pelnoletni”', c: 'ok' },
            { t: 'Fałsz → blok else', s: 'wypisz „Niepelnoletni”', c: 'bad' }] }),
          T([['<code>==</code>', 'równe (uwaga: <b>dwa</b> znaki równości)'], ['<code>!=</code>', 'różne'], ['<code>&lt;  &gt;</code>', 'mniejsze, większe'], ['<code>&lt;=  &gt;=</code>', 'mniejsze lub równe, większe lub równe']]),
          { t: 'note', k: 'warn', x: 'Pojedyncze <code>=</code> to <b>przypisanie</b> („włóż do pudełka”), a podwójne <code>==</code> to <b>porównanie</b> („czy są równe?”). W warunku używamy <code>==</code>.' },
        ],
        guide: {
          files: [F('Main.java', M(['int wiek = 17;']))],
          steps: [
            { say: '<p>Zapytaj program o warunek: <code>if</code>, a w <b>okrągłych nawiasach</b> pytanie – czy wiek jest co najmniej 18 (<code>&gt;=</code>). Na końcu otwierająca klamra bloku.</p>', type: 'if (wiek >= 18) {', expect: J`if\s*\(\s*wiek\s*>=\s*18\s*\)\s*\{` },
            { say: '<p>Co zrobić, gdy warunek jest <b>prawdziwy</b> – polecenie w środku bloku.</p>', type: '    System.out.println("Pelnoletni");', expect: J`println\s*\(\s*"Pelnoletni"\s*\)\s*;` },
            { say: '<p>Zamknij blok <code>if</code> i od razu otwórz blok <code>else</code> – „w przeciwnym razie”.</p>', type: '} else {', expect: J`\}\s*else\s*\{` },
            { say: '<p>Co zrobić, gdy warunek jest <b>fałszywy</b>.</p>', type: '    System.out.println("Niepelnoletni");', expect: J`println\s*\(\s*"Niepelnoletni"\s*\)\s*;` },
            { say: '<p>Zamknij blok <code>else</code> klamrą. Dla <code>wiek = 17</code> program wypisze „Niepelnoletni”.</p>', type: '}', expect: J`Niepelnoletni"\s*\)\s*;\s*\}` },
          ],
          solution: [F('Main.java', M(['int wiek = 17;', 'if (wiek >= 18) {', '    System.out.println("Pelnoletni");', '} else {', '    System.out.println("Niepelnoletni");', '}']))],
          checks: [
            CK(CR, 'Dla wieku 17 program wypisuje „Niepelnoletni”', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Niepelnoletni] – program wypisał: " + o, o.equals(Arrays.asList("Niepelnoletni")));`),
            CK(MD, 'Użyto if i else z warunkiem wiek >= 18', J`isTrue("Użyj if (wiek >= 18) { ... } else { ... }", srcHas("Main", "if\\s*\\(\\s*wiek\\s*>=\\s*18\\s*\\)") && srcHas("Main", "\\}\\s*else\\s*\\{"));`),
          ],
        },
        exercise: {
          prompt: '<p>Jest zmienna <code>temperatura</code> równa 25. Jeśli temperatura jest <b>większa niż 20</b>, wypisz <code>Cieplo</code>, w przeciwnym razie <code>Zimno</code>.</p>',
          files: [F('Main.java', M(['int temperatura = 25;', '// tu napisz kod']))],
          hints: ['<code>if (temperatura > 20) { ... } else { ... }</code>', 'W każdym bloku jedno <code>System.out.println(...)</code>.'],
          solution: [F('Main.java', M(['int temperatura = 25;', 'if (temperatura > 20) {', '    System.out.println("Cieplo");', '} else {', '    System.out.println("Zimno");', '}']))],
          checks: [
            CK(CR, 'Dla 25 stopni program wypisuje „Cieplo”', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Cieplo] – program wypisał: " + o, o.equals(Arrays.asList("Cieplo")));`),
            CK(MD, 'Użyto if z warunkiem na zmiennej i bloku else', J`isTrue("Użyj if (temperatura > 20) ...", srcHas("Main", "if\\s*\\(\\s*temperatura\\s*>\\s*20\\s*\\)")); isTrue("Dodaj blok else", srcHas("Main", "\\belse\\b"));`),
          ],
        },
        quiz: [
          Q('Do czego służy instrukcja <code>if</code>?', ['do wykonania kodu tylko wtedy, gdy warunek jest prawdziwy', 'do powtarzania kodu', 'do wypisywania tekstu', 'do tworzenia klas'], 0, 'To instrukcja warunkowa.'),
          Q('Który zapis <b>porównuje</b> dwie wartości na równość?', ['==', '=', '=>', '!'], 0, 'Pojedyncze <code>=</code> to przypisanie.'),
          Q('Kiedy wykona się blok <code>else</code>?', ['gdy warunek w if jest fałszywy', 'zawsze', 'nigdy', 'gdy warunek w if jest prawdziwy'], 0, '<code>else</code> = „w przeciwnym razie”.'),
          OUT('Co wypisze program?', ['A', 'B', 'AB', 'nic'], 0, 'Warunek 5 &gt; 3 jest prawdziwy, więc wykona się tylko blok <code>if</code>.', M(['int x = 5;', 'if (x > 3) {', '    System.out.println("A");', '} else {', '    System.out.println("B");', '}'])),
          OUT('Co wypisze program?', ['B', 'A', 'AB', 'nic'], 0, 'Warunek 2 &gt; 3 jest fałszywy – wykona się <code>else</code>.', M(['int x = 2;', 'if (x > 3) {', '    System.out.println("A");', '} else {', '    System.out.println("B");', '}'])),
        ],
      },

      /* ============ 15. LOGIKA ============ */
      {
        id: 'start-logika', title: 'Warunki złożone: && i ||', blurb: 'i, lub, nie', minutes: 4,
        content: [
          A('🎟️', 'Wejście do kina: „masz bilet <b>i</b> masz skończone 16 lat”. Oba warunki muszą być spełnione – to <b>AND</b>. W innym miejscu: „płacisz kartą <b>lub</b> gotówką” – wystarczy jeden – to <b>OR</b>.'),
          T([['<code>&amp;&amp;</code>', '<b>i</b>: oba warunki muszą być prawdziwe'], ['<code>||</code>', '<b>lub</b>: wystarczy, że jeden jest prawdziwy'], ['<code>!</code>', '<b>nie</b>: odwraca prawdę w fałsz (i odwrotnie)']]),
          V('compare', { cols: [
            { icon: '✅', title: 'true && true', c: 'ok', items: ['wynik: true'] },
            { icon: '❌', title: 'true && false', c: 'bad', items: ['wynik: false'] },
            { icon: '✅', title: 'true || false', c: 'ok', items: ['wynik: true'] }] }),
          { t: 'code', run: true, title: 'Main.java', out: 'Dodatnia parzysta', x: M(['int x = 12;', 'if (x > 0 && x % 2 == 0) {', '    System.out.println("Dodatnia parzysta");', '}']) },
        ],
        guide: {
          files: [F('Main.java', M(['int x = 12;']))],
          steps: [
            { say: '<p>Złóż dwa warunki znakiem <code>&amp;&amp;</code> („i”): liczba ma być <b>dodatnia</b> i jednocześnie <b>parzysta</b> (reszta z dzielenia przez 2 równa 0).</p>', type: 'if (x > 0 && x % 2 == 0) {', expect: J`if\s*\(\s*x\s*>\s*0\s*&&\s*x\s*%\s*2\s*==\s*0\s*\)\s*\{` },
            { say: '<p>Co zrobić, gdy oba warunki są spełnione.</p>', type: '    System.out.println("Dodatnia parzysta");', expect: J`println\s*\(\s*"Dodatnia parzysta"\s*\)\s*;` },
            { say: '<p>Zamknij blok <code>if</code> klamrą.</p>', type: '}', expect: J`parzysta"\s*\)\s*;\s*\}` },
          ],
          solution: [F('Main.java', M(['int x = 12;', 'if (x > 0 && x % 2 == 0) {', '    System.out.println("Dodatnia parzysta");', '}']))],
          checks: [
            CK(CR, 'Dla 12 program wypisuje „Dodatnia parzysta”', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Dodatnia parzysta] – program wypisał: " + o, o.equals(Arrays.asList("Dodatnia parzysta")));`),
            CK(MN, 'Użyto operatora &&', J`isTrue("Połącz warunki operatorem &&", srcHas("Main", "&&"));`),
          ],
        },
        exercise: {
          prompt: '<p>Jest zmienna <code>godzina</code> równa 14. Jeśli godzina jest <b>co najmniej 9</b> <b>i</b> <b>mniejsza niż 17</b>, wypisz <code>Otwarte</code>, w przeciwnym razie <code>Zamkniete</code>.</p>',
          files: [F('Main.java', M(['int godzina = 14;', '// tu napisz kod']))],
          hints: ['Warunek: <code>godzina >= 9 && godzina < 17</code>', 'Dodaj blok <code>else</code> dla „Zamkniete”.'],
          solution: [F('Main.java', M(['int godzina = 14;', 'if (godzina >= 9 && godzina < 17) {', '    System.out.println("Otwarte");', '} else {', '    System.out.println("Zamkniete");', '}']))],
          checks: [
            CK(CR, 'Dla godziny 14 program wypisuje „Otwarte”', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Otwarte] – program wypisał: " + o, o.equals(Arrays.asList("Otwarte")));`),
            CK(MD, 'Użyto && i else', J`isTrue("Połącz oba warunki operatorem &&", srcHas("Main", "godzina\\s*>=\\s*9\\s*&&\\s*godzina\\s*<\\s*17")); isTrue("Dodaj else", srcHas("Main", "\\belse\\b"));`),
          ],
        },
        quiz: [
          Q('Co oznacza <code>&amp;&amp;</code> w warunku?', ['i – oba warunki muszą być prawdziwe', 'lub – wystarczy jeden', 'nie – odwrócenie warunku', 'równa się'], 0, '<code>&amp;&amp;</code> = AND.'),
          Q('Co oznacza <code>||</code> w warunku?', ['lub – wystarczy, że jeden warunek jest prawdziwy', 'i – oba warunki', 'nie', 'dzielenie'], 0, '<code>||</code> = OR.'),
          OUT('Co wypisze program?', ['false', 'true', '0', 'błąd'], 0, '<code>true &amp;&amp; false</code> jest fałszem – „i” wymaga obu prawd.', M(['System.out.println(true && false);'])),
          OUT('Co wypisze program?', ['true', 'false', '1', 'błąd'], 0, '„lub”: wystarczy jedna prawda.', M(['System.out.println(true || false);'])),
          OUT('Co wypisze program?', ['false', 'true', '5', 'błąd'], 0, 'Operator <code>!</code> odwraca: <code>5 &gt; 3</code> jest prawdą, więc <code>!(5 &gt; 3)</code> to fałsz.', M(['System.out.println(!(5 > 3));'])),
        ],
      },

      /* ============ 16. FOR ============ */
      {
        id: 'start-petle', title: 'Pętla for', blurb: 'powtarzanie znaną liczbę razy', minutes: 6,
        content: [
          A('🏃', 'Pętla to <b>bieg wokół stadionu</b>: „zrób 5 okrążeń”. Komputer sam liczy okrążenia i sam kończy, gdy ich starczy. Dzięki pętli nie musisz pisać pięć razy tego samego polecenia.'),
          V('flow', { title: 'for (int i = 1; i <= 3; i++)', steps: [
            { t: 'Start', s: 'int i = 1', c: 'accent' },
            { t: 'Czy i ≤ 3?', s: 'sprawdź warunek', c: 'warn' },
            { t: 'Tak → ciało pętli', s: 'wykonaj polecenia', c: 'ok' },
            { t: 'i++', s: 'zwiększ i o 1 i wróć do sprawdzania' },
            { t: 'Nie → koniec', s: 'wychodzimy z pętli', c: 'bad' }] }),
          { t: 'code', run: true, title: 'Main.java', out: '1\n2\n3', x: M(['for (int i = 1; i <= 3; i++) {', '    System.out.println(i);', '}']) },
          UL(['<b>Trzy części</b> w nawiasie, oddzielone średnikami: <i>start</i> (<code>int i = 1</code>), <i>dopóki prawda</i> (<code>i &lt;= 3</code>), <i>po każdym okrążeniu</i> (<code>i++</code> – „dodaj 1”).', 'Polecenia w klamrach (<b>ciało pętli</b>) wykonują się przy każdym okrążeniu.', 'Zmienna <code>i</code> przechowuje numer okrążenia – możesz jej używać w ciele pętli.']),
          { t: 'note', k: 'warn', x: 'Granice! <code>i &lt; 3</code> zaczynając od 0 to 3 okrążenia (0, 1, 2); <code>i &lt;= 3</code> zaczynając od 1 to też 3 okrążenia (1, 2, 3). Sprawdź zawsze, czy start i warunek dają tyle powtórzeń, ile chcesz.' },
        ],
        guide: {
          files: MAINF,
          steps: [
            { say: '<p>Zapisz pętlę, która policzy od 1 do 5. W nawiasie trzy części: <b>start</b> <code>int i = 1</code>, <b>warunek</b> <code>i &lt;= 5</code> (dopóki prawda) i <b>krok</b> <code>i++</code> (po każdym okrążeniu dodaj 1). Na końcu klamra otwierająca ciało pętli.</p>', type: 'for (int i = 1; i <= 5; i++) {', expect: J`for\s*\(\s*int\s+i\s*=\s*1\s*;\s*i\s*<=\s*5\s*;\s*i\+\+\s*\)\s*\{` },
            { say: '<p>Ciało pętli – polecenie, które wykona się przy każdym okrążeniu. Wypisujemy bieżące <code>i</code> (bez cudzysłowu!).</p>', type: '    System.out.println(i);', expect: J`println\s*\(\s*i\s*\)\s*;` },
            { say: '<p>Zamknij ciało pętli klamrą.</p>', type: '}', expect: J`println\s*\(\s*i\s*\)\s*;\s*\}` },
          ],
          solution: [F('Main.java', M(['for (int i = 1; i <= 5; i++) {', '    System.out.println(i);', '}']))],
          checks: [
            CK(CR, 'Wynik: 1, 2, 3, 4, 5', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [1, 2, 3, 4, 5] – program wypisał: " + o, o.equals(Arrays.asList("1", "2", "3", "4", "5")));`),
            CK(MD, 'Użyto pętli for', J`isTrue("Użyj pętli for", srcHas("Main", "\\bfor\\s*\\("));`),
          ],
        },
        exercise: {
          prompt: '<p>Oblicz w pętli <b>sumę liczb od 1 do 10</b> i wypisz wynik w formacie:</p><pre>Suma: 55</pre><p>Użyj zmiennej <code>suma</code> (zaczynasz od 0) i dodawaj do niej <code>i</code> przy każdym okrążeniu. Wynik wypisz <b>po</b> pętli.</p>',
          files: MAINF,
          hints: ['Przed pętlą: <code>int suma = 0;</code>', 'W ciele pętli: <code>suma = suma + i;</code> (albo skrótem <code>suma += i;</code>)', 'Po pętli: <code>System.out.println("Suma: " + suma);</code>'],
          solution: [F('Main.java', M(['int suma = 0;', 'for (int i = 1; i <= 10; i++) {', '    suma += i;', '}', 'System.out.println("Suma: " + suma);']))],
          checks: [
            CK(CR, 'Ostatnia linia: „Suma: 55”', J`List<String> o = lines(runMain()); isTrue("Ostatnia linia powinna być: Suma: 55 – a program wypisał: " + o, !o.isEmpty() && o.get(o.size() - 1).equals("Suma: 55"));`),
            CK(MD, 'Użyto pętli', J`isTrue("Użyj pętli for", srcHas("Main", "\\bfor\\s*\\("));`),
            CK(MN, 'Wynik liczony zmienną suma', J`isTrue("Zadeklaruj int suma", srcHas("Main", "int\\s+suma"));`),
          ],
        },
        quiz: [
          Q('Ile razy wykona się ciało pętli <code>for (int i = 0; i &lt; 3; i++)</code>?', ['2', '3', '4', 'nieskończenie wiele'], 1, 'Dla i = 0, 1, 2 – razem 3 razy.'),
          Q('Które pętle wykonają się dokładnie 5 razy?', ['<code>for (int i = 0; i &lt; 5; i++)</code>', '<code>for (int i = 1; i &lt; 5; i++)</code>', '<code>for (int i = 0; i &lt;= 5; i++)</code>', '<code>for (int i = 1; i &lt;= 5; i++)</code>'], [0, 3], 'Sprawdź granice: 0..4 i 1..5 to po 5 powtórzeń.'),
          Q('Co robi <code>i++</code>?', ['zwiększa i o 1', 'zmniejsza i o 1', 'zeruje i', 'podwaja i'], 0, '<code>i++</code> = „dodaj 1 do i”.'),
          OUT('Co wypisze program?', ['012', '123', '0123', '210'], 0, 'Pętla bierze i = 0, 1, 2; <code>print</code> nie dodaje nowych linii.', M(['for (int i = 0; i < 3; i++) {', '    System.out.print(i);', '}'])),
        ],
      },

      /* ============ 17. WHILE ============ */
      {
        id: 'start-while', title: 'Pętla while', blurb: 'powtarzaj, dopóki warunek jest prawdziwy', minutes: 4,
        content: [
          A('🚿', '<code>while</code> to „<b>myj ręce, dopóki są brudne</b>”. Nie wiesz z góry, ile razy – po prostu powtarzasz, dopóki warunek jest prawdziwy. Uwaga: musisz w środku pętli <b>coś zmieniać</b> (np. licznik), inaczej warunek nigdy nie stanie się fałszywy i pętla nie skończy się nigdy.'),
          V('flow', { title: 'while (i > 0)', steps: [
            { t: 'Czy warunek jest prawdziwy?', s: 'i > 0', c: 'warn' },
            { t: 'Tak → ciało pętli', s: 'wykonaj polecenia, zmień i', c: 'ok' },
            { t: 'Wróć do sprawdzania' },
            { t: 'Nie → koniec', s: 'wychodzimy z pętli', c: 'bad' }] }),
          { t: 'code', run: true, title: 'Main.java', out: '3\n2\n1', x: M(['int i = 3;', 'while (i > 0) {', '    System.out.println(i);', '    i--;', '}']) },
          UL(['<code>i--</code> to „odejmij 1 od i” (odwrotność <code>i++</code>).', '<code>for</code> wybierasz, gdy <b>znasz liczbę powtórzeń</b>; <code>while</code> – gdy powtarzasz „aż coś się wydarzy” (np. użytkownik wpisze KONIEC).']),
        ],
        guide: {
          files: [F('Main.java', M(['int i = 3;']))],
          steps: [
            { say: '<p>Zapisz pętlę: <code>while</code> i w nawiasie warunek – powtarzaj, dopóki <code>i</code> jest większe od 0.</p>', type: 'while (i > 0) {', expect: J`while\s*\(\s*i\s*>\s*0\s*\)\s*\{` },
            { say: '<p>Wypisz bieżącą wartość <code>i</code>.</p>', type: '    System.out.println(i);', expect: J`println\s*\(\s*i\s*\)\s*;` },
            { say: '<p><b>Najważniejsze:</b> zmniejsz <code>i</code> o 1. Bez tego warunek zawsze byłby prawdziwy i pętla trwałaby w nieskończoność.</p>', type: '    i--;', expect: J`i\s*--\s*;|i\s*=\s*i\s*-\s*1\s*;|i\s*-=\s*1\s*;` },
            { say: '<p>Zamknij ciało pętli klamrą.</p>', type: '}', expect: J`(i\s*--\s*;|i\s*=\s*i\s*-\s*1\s*;|i\s*-=\s*1\s*;)\s*\}` },
          ],
          solution: [F('Main.java', M(['int i = 3;', 'while (i > 0) {', '    System.out.println(i);', '    i--;', '}']))],
          checks: [
            CK(CR, 'Wynik: 3, 2, 1', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [3, 2, 1] – program wypisał: " + o, o.equals(Arrays.asList("3", "2", "1")));`),
            CK(MD, 'Użyto pętli while', J`isTrue("Użyj pętli while", srcHas("Main", "\\bwhile\\s*\\("));`),
          ],
        },
        exercise: {
          prompt: '<p>Zrób <b>odliczanie</b>: wypisz liczby od 5 do 1 (każda w osobnej linii), a na końcu napis <code>Start!</code>. Użyj pętli <code>while</code> i zmiennej <code>licznik</code> (zaczynasz od 5).</p><pre>5\n4\n3\n2\n1\nStart!</pre>',
          files: MAINF,
          hints: ['<code>int licznik = 5;</code> i <code>while (licznik > 0) { ... }</code>', 'W środku: wypisz <code>licznik</code> i zmniejsz go: <code>licznik--;</code>', '„Start!” wypisz <b>po</b> pętli.'],
          solution: [F('Main.java', M(['int licznik = 5;', 'while (licznik > 0) {', '    System.out.println(licznik);', '    licznik--;', '}', 'System.out.println("Start!");']))],
          checks: [
            CK(CR, 'Wynik: 5, 4, 3, 2, 1, Start!', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [5, 4, 3, 2, 1, Start!] – program wypisał: " + o, o.equals(Arrays.asList("5", "4", "3", "2", "1", "Start!")));`),
            CK(MD, 'Użyto pętli while', J`isTrue("Użyj pętli while", srcHas("Main", "\\bwhile\\s*\\("));`),
          ],
        },
        quiz: [
          Q('Kiedy kończy się pętla <code>while</code>?', ['gdy warunek staje się fałszywy', 'po 10 powtórzeniach', 'nigdy', 'od razu po pierwszym okrążeniu'], 0, 'Warunek jest sprawdzany przed każdym okrążeniem.'),
          Q('Co się stanie, gdy w ciele <code>while (i &gt; 0)</code> nie zmieniasz <code>i</code>?', ['pętla będzie nieskończona', 'program wypisze 0', 'kompilator zgłosi błąd', 'pętla wykona się raz'], 0, 'Warunek zawsze będzie prawdziwy.'),
          Q('Którą pętlę najlepiej wybrać do „powtarzaj, aż użytkownik wpisze KONIEC”?', ['while', 'for', 'if', 'switch'], 0, 'Nie znasz z góry liczby powtórzeń.'),
          OUT('Co wypisze program?', ['123', '321', '012', '1'], 0, 'Najpierw wypisuje 1, potem zwiększa i do 2 itd., aż i przestanie być ≤ 3.', M(['int i = 1;', 'while (i <= 3) {', '    System.out.print(i);', '    i++;', '}'])),
        ],
      },

      /* ============ 18. TABLICE ============ */
      {
        id: 'start-tablice', title: 'Tablice', blurb: 'szafki z numerami od 0, indeks, length', minutes: 6,
        content: [
          A('🗄️', 'Tablica to <b>rząd szafek w szatni</b>. Każda szafka ma numer i mieści jedną rzecz tego samego typu. Najważniejsze: numeracja zaczyna się od <b>0</b>, nie od 1! Pierwsza szafka to numer 0.'),
          V('cells', { title: 'int[] oceny = { 4, 5, 3 };', rows: [{ label: 'tablica oceny', cells: ['4', '5', '3'], idx: true, hl: [0] }],
            cap: '<code>oceny[0]</code> to <b>4</b> (pierwsza), <code>oceny[2]</code> to <b>3</b> (ostatnia). <code>oceny.length</code> to 3 – ale ostatni numer to 2.' }),
          V('cells', { title: 'Co się stanie przy oceny[3]?', rows: [{ label: 'tablica oceny', cells: ['4', '5', '3', '???'], idx: true, bad: [3] }],
            cap: 'Szafki nr 3 <b>nie ma</b> → <code>ArrayIndexOutOfBoundsException</code>. Ostatni indeks to zawsze <code>length - 1</code>.' }),
          UL(['<code>int[]</code> – „tablica liczb całkowitych”. Elementy podajemy w klamrach, oddzielone przecinkami.', '<code>oceny[0]</code> – odczyt elementu o indeksie 0. <code>oceny.length</code> – liczba elementów (bez nawiasów!).', '<code>new int[5]</code> – tablica 5 elementów, na początku wszystkie to 0.']),
          { t: 'code', run: true, title: 'Main.java', out: 'Długość: 3\nPierwsza: 4\nOstatnia: 3', x: M(['int[] oceny = {4, 5, 3};', 'System.out.println("Długość: " + oceny.length);', 'System.out.println("Pierwsza: " + oceny[0]);', 'System.out.println("Ostatnia: " + oceny[oceny.length - 1]);']) },
        ],
        guide: {
          files: MAINF,
          steps: [
            { say: '<p>Utwórz tablicę: <code>int[]</code> to „tablica liczb całkowitych”, <code>oceny</code> – jej nazwa, a w klamrach kolejne elementy (szafki o numerach 0, 1, 2).</p>', type: 'int[] oceny = {4, 5, 3};', expect: J`int\s*\[\s*\]\s*oceny\s*=\s*\{\s*4\s*,\s*5\s*,\s*3\s*\}\s*;` },
            { say: '<p>Odczytaj <b>pierwszy</b> element – numer <b>0</b> w nawiasach kwadratowych.</p>', type: 'System.out.println(oceny[0]);', expect: J`println\s*\(\s*oceny\s*\[\s*0\s*\]\s*\)` },
            { say: '<p>Odczytaj <b>ostatni</b> element – numer 2 (bo mamy 3 elementy, a liczymy od 0).</p>', type: 'System.out.println(oceny[2]);', expect: J`println\s*\(\s*oceny\s*\[\s*2\s*\]\s*\)` },
            { say: '<p>Sprawdź <b>długość</b> tablicy: <code>oceny.length</code> – bez nawiasów okrągłych!</p>', type: 'System.out.println(oceny.length);', expect: J`println\s*\(\s*oceny\.length\s*\)` },
          ],
          solution: [F('Main.java', M(['int[] oceny = {4, 5, 3};', 'System.out.println(oceny[0]);', 'System.out.println(oceny[2]);', 'System.out.println(oceny.length);']))],
          checks: [
            CK(CR, 'Wynik: 4, 3, 3', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [4, 3, 3] – program wypisał: " + o, o.equals(Arrays.asList("4", "3", "3")));`),
            CK(MD, 'Tablica jest zadeklarowana jako int[]', J`isTrue("Zadeklaruj: int[] oceny = {4, 5, 3};", srcHas("Main", "int\\s*\\[\\s*\\]\\s*oceny"));`),
          ],
        },
        exercise: {
          prompt: '<p>Jest tablica imion <code>String[] imiona</code> ({"Ala", "Ola", "Ewa"}). Wypisz <b>ostatnie imię</b> tablicy (użyj <code>imiona.length - 1</code>, nie wpisuj indeksu „na sztywno”) i w drugiej linii <b>liczbę imion</b>.</p><pre>Ewa\n3</pre>',
          files: [F('Main.java', M(['String[] imiona = {"Ala", "Ola", "Ewa"};', '// tu napisz kod']))],
          hints: ['Ostatni indeks to <code>imiona.length - 1</code>: <code>imiona[imiona.length - 1]</code>', 'Długość: <code>imiona.length</code>'],
          solution: [F('Main.java', M(['String[] imiona = {"Ala", "Ola", "Ewa"};', 'System.out.println(imiona[imiona.length - 1]);', 'System.out.println(imiona.length);']))],
          checks: [
            CK(CR, 'Wynik: Ewa i 3', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Ewa, 3] – program wypisał: " + o, o.equals(Arrays.asList("Ewa", "3")));`),
            CK(MN, 'Ostatni element wskazany przez length - 1', J`isTrue("Użyj imiona[imiona.length - 1]", srcHas("Main", "imiona\\s*\\[\\s*imiona\\.length\\s*-\\s*1\\s*\\]"));`),
          ],
        },
        quiz: [
          Q('Jaki indeks ma <b>pierwszy</b> element tablicy?', ['0', '1', '-1', 'length'], 0, 'Tablice numerujemy od zera.'),
          Q('Tablica <code>int[] t = new int[4];</code> – jaki jest indeks ostatniego elementu?', ['4', '3', '0', '5'], 1, 'Indeksy to 0, 1, 2, 3.'),
          Q('Co zawiera <code>new int[3]</code> tuż po utworzeniu?', ['trzy zera', 'trzy wartości null', 'puste miejsca bez wartości', 'losowe liczby'], 0, 'Dla int domyślnie 0; dla obiektów <code>null</code>.'),
          Q('Dla <code>int[] t = {3, 5, 7};</code> wyrażenie <code>t[3]</code> spowoduje:', ['zwrócenie 0', 'zwrócenie null', 'ArrayIndexOutOfBoundsException', 'błąd kompilacji'], 2, 'Poprawne indeksy to 0, 1, 2. Błąd wychodzi dopiero w trakcie działania programu.'),
          OUT('Co wypisze program?', ['8', '5', '2', '3'], 0, 'Indeks 1 to drugi element.', M(['int[] t = {5, 8, 2};', 'System.out.println(t[1]);'])),
        ],
      },

      /* ============ 19. TABLICA + PĘTLA ============ */
      {
        id: 'start-tablice-petla', title: 'Pętla po tablicy', blurb: 'przejście po wszystkich elementach', minutes: 5,
        content: [
          A('🚶', 'Masz rząd szafek – zamiast otwierać każdą ręcznie (<code>t[0]</code>, <code>t[1]</code>, <code>t[2]</code>…), <b>idziesz wzdłuż rzędu</b> i otwierasz po kolei. Robi to pętla <code>for</code>, a numer szafki to <code>i</code>.'),
          V('flow', { title: 'for (int i = 0; i < liczby.length; i++)', steps: [
            { t: 'i = 0', s: 'pierwsza szafka', c: 'accent' },
            { t: 'liczby[i]', s: 'weź element', c: 'ok' },
            { t: 'i++', s: 'następna szafka' },
            { t: 'i = length', s: 'koniec – nie ma takiej szafki', c: 'bad' }] }),
          { t: 'code', run: true, title: 'Main.java', out: 'Suma: 33', x: M(['int[] liczby = {10, 4, 12, 7};', 'int suma = 0;', 'for (int i = 0; i < liczby.length; i++) {', '    suma += liczby[i];', '}', 'System.out.println("Suma: " + suma);']) },
          { t: 'note', k: 'warn', x: 'Warunek to <code>i &lt; liczby.length</code>, a <b>nie</b> <code>&lt;=</code>: ostatni indeks to <code>length - 1</code>. Użycie <code>&lt;=</code> sięgnęłoby szafki, której nie ma (<code>ArrayIndexOutOfBoundsException</code>).' },
        ],
        guide: {
          files: [F('Main.java', M(['int[] liczby = {10, 4, 12, 7};', 'int suma = 0;']))],
          steps: [
            { say: '<p>Pętla po całej tablicy: <code>i</code> zaczyna od 0, a idziemy dopóki <code>i &lt; liczby.length</code> (ostatnia szafka ma numer <code>length - 1</code>).</p>', type: 'for (int i = 0; i < liczby.length; i++) {', expect: J`for\s*\(\s*int\s+i\s*=\s*0\s*;\s*i\s*<\s*liczby\.length\s*;\s*i\+\+\s*\)\s*\{` },
            { say: '<p>W środku dodajemy bieżący element <code>liczby[i]</code> do sumy. <code>suma += x</code> to skrót od <code>suma = suma + x</code>.</p>', type: '    suma += liczby[i];', expect: J`suma\s*\+=\s*liczby\s*\[\s*i\s*\]|suma\s*=\s*suma\s*\+\s*liczby\s*\[\s*i\s*\]` },
            { say: '<p>Zamknij pętlę klamrą.</p>', type: '}', expect: J`liczby\s*\[\s*i\s*\]\s*;\s*\}` },
            { say: '<p>Po pętli wypisz sumę.</p>', type: 'System.out.println(suma);', expect: J`println\s*\(\s*suma\s*\)` },
          ],
          solution: [F('Main.java', M(['int[] liczby = {10, 4, 12, 7};', 'int suma = 0;', 'for (int i = 0; i < liczby.length; i++) {', '    suma += liczby[i];', '}', 'System.out.println(suma);']))],
          checks: [
            CK(CR, 'Wynik: 33', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [33] – program wypisał: " + o, o.equals(Arrays.asList("33")));`),
            CK(MD, 'Użyto pętli po tablicy z length', J`isTrue("Użyj pętli for do liczby.length", srcHas("Main", "\\bfor\\s*\\(.*liczby\\.length"));`),
          ],
        },
        exercise: {
          prompt: '<p>Dana jest tablica ocen <code>int[] oceny = {4, 5, 3, 5, 2};</code>. Wypisz dwie linie:</p><pre>Srednia: 3.8\nNajwyzsza: 5</pre><p>Oblicz wartości w pętli po tablicy. Średnia to suma / liczba elementów (wynik typu <code>double</code> – pamiętaj o rzutowaniu!).</p>',
          files: [F('Main.java', M(['int[] oceny = {4, 5, 3, 5, 2};', '// tu napisz kod']))],
          hints: ['Zadeklaruj <code>int suma = 0;</code> i <code>int max = oceny[0];</code> przed pętlą.', 'W pętli: dodaj do sumy i jeśli <code>oceny[i] &gt; max</code>, zapisz nowe maksimum.', 'Średnia: <code>(double) suma / oceny.length</code>.'],
          solution: [F('Main.java', M(['int[] oceny = {4, 5, 3, 5, 2};', 'int suma = 0;', 'int max = oceny[0];', 'for (int i = 0; i < oceny.length; i++) {', '    suma += oceny[i];', '    if (oceny[i] > max) {', '        max = oceny[i];', '    }', '}', 'double srednia = (double) suma / oceny.length;', 'System.out.println("Srednia: " + srednia);', 'System.out.println("Najwyzsza: " + max);']))],
          checks: [
            CK(CR, 'Linia „Srednia: 3.8”', J`List<String> o = lines(runMain()); isTrue("Brak linii: Srednia: 3.8 – wynik: " + o, o.contains("Srednia: 3.8"));`),
            CK(CR, 'Linia „Najwyzsza: 5”', J`List<String> o = lines(runMain()); isTrue("Brak linii: Najwyzsza: 5 – wynik: " + o, o.contains("Najwyzsza: 5"));`),
            CK(MD, 'Wynik liczony w pętli po tablicy', J`isTrue("Użyj pętli po tablicy oceny", srcHas("Main", "\\b(for|while)\\s*\\("));`),
            CK(MN, 'Użyto oceny.length zamiast stałej liczby', J`isTrue("Zamiast wpisywać 5, użyj oceny.length", srcHas("Main", "oceny\\.length"));`),
          ],
        },
        quiz: [
          Q('Dlaczego w pętli po tablicy piszemy <code>i &lt; t.length</code>, a nie <code>i &lt;= t.length</code>?', ['bo ostatni indeks to length - 1', 'bo tak jest szybciej', 'bo length zaczyna się od 0', 'nie ma różnicy'], 0, 'Szafki o numerze <code>length</code> nie ma.'),
          Q('Co robi <code>suma += liczby[i];</code>?', ['dodaje bieżący element do sumy', 'zeruje sumę', 'wypisuje element', 'zamienia dwa elementy'], 0, '<code>+=</code> to skrót od <code>suma = suma + ...</code>.'),
          OUT('Co wypisze program?', ['6', '3', '123', '0'], 0, 'Pętla dodaje 1 + 2 + 3.', M(['int[] t = {1, 2, 3};', 'int s = 0;', 'for (int i = 0; i < t.length; i++) {', '    s += t[i];', '}', 'System.out.println(s);'])),
        ],
      },

      /* ============ 20. METODY ============ */
      {
        id: 'start-metody', title: 'Własna metoda', blurb: 'nazwany blok, który wywołujesz', minutes: 5,
        content: [
          A('🥤', 'Metoda to <b>przycisk na automacie</b>: raz ustalasz, co robi (np. nalewa kawę), a potem wciskasz go wiele razy, nie powtarzając za każdym razem całego procesu. W kodzie: raz piszesz metodę, potem ją <b>wywołujesz</b> po nazwie.'),
          V('flow', { title: 'Definicja i wywołanie', steps: [
            { t: 'Definicja', s: 'static void przywitaj() { … }', c: 'accent' },
            { t: 'Wywołanie w main', s: 'przywitaj();', c: 'warn' },
            { t: 'Java skacze do metody', s: 'wykonuje jej polecenia', c: 'ok' },
            { t: 'Wraca do main', s: 'i idzie dalej' }] }),
          { t: 'code', run: true, title: 'Main.java', out: 'Hej!\nHej!', x: 'public class Main {\n    static void przywitaj() {\n        System.out.println("Hej!");\n    }\n\n    public static void main(String[] args) {\n        przywitaj();\n        przywitaj();\n    }\n}\n' },
          UL(['<code>static void przywitaj()</code> – <b>nagłówek</b>: <code>static</code> (na razie „metoda pomocnicza obok main”), <code>void</code> (nic nie zwraca), nazwa, puste nawiasy (nie przyjmuje danych).', 'Metoda leży <b>wewnątrz klasy, obok</b> <code>main</code> (nie w środku main!).', 'Wywołanie: nazwa + nawiasy + średnik: <code>przywitaj();</code>.']),
        ],
        guide: {
          files: [F('Main.java', 'public class Main {\n    public static void main(String[] args) {\n        przywitaj();\n        przywitaj();\n    }\n}\n')],
          steps: [
            { say: '<p>W <code>main</code> już dwa razy wołamy <code>przywitaj()</code>, ale takiej metody jeszcze nie ma. Napiszemy ją <b>w klasie, nad metodą main</b>. Nagłówek: <code>static</code> (jak w main), <code>void</code> (nic nie zwraca), nazwa <code>przywitaj</code>, puste nawiasy.</p>', type: 'static void przywitaj() {', expect: J`static\s+void\s+przywitaj\s*\(\s*\)\s*\{` },
            { say: '<p>Co metoda ma zrobić – wypisać „Hej!”.</p>', type: '    System.out.println("Hej!");', expect: J`przywitaj\s*\(\s*\)\s*\{\s*System\.out\.println\s*\(\s*"Hej!"\s*\)\s*;` },
            { say: '<p>Zamknij metodę klamrą. Ważne: metoda leży <b>obok</b> <code>main</code>, a nie w jej środku.</p>', type: '}', expect: J`"Hej!"\s*\)\s*;\s*\}\s*public\s+static\s+void\s+main|public\s+static\s+void\s+main[^}]*\}[^}]*przywitaj\s*\(\s*\)\s*\{[^}]*\}` },
          ],
          solution: [F('Main.java', 'public class Main {\n    static void przywitaj() {\n        System.out.println("Hej!");\n    }\n\n    public static void main(String[] args) {\n        przywitaj();\n        przywitaj();\n    }\n}\n')],
          checks: [
            CK(CR, 'Wynik: dwa razy „Hej!”', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Hej!, Hej!] – program wypisał: " + o, o.equals(Arrays.asList("Hej!", "Hej!")));`),
            CK(MD, 'Zdefiniowano metodę przywitaj', J`method("Main", "przywitaj");`),
          ],
        },
        exercise: {
          prompt: '<p>Napisz metodę <code>static void linia()</code>, która wypisuje <code>-----</code> (pięć myślników). W <code>main</code> wywołaj ją <b>trzy razy</b>.</p><pre>-----\n-----\n-----</pre>',
          files: MAINF,
          hints: ['Metoda leży w klasie <b>obok</b> main: <code>static void linia() { ... }</code>', 'Wywołanie: <code>linia();</code> – trzy razy, jedno pod drugim.'],
          solution: [F('Main.java', 'public class Main {\n    static void linia() {\n        System.out.println("-----");\n    }\n\n    public static void main(String[] args) {\n        linia();\n        linia();\n        linia();\n    }\n}\n')],
          checks: [
            CK(CR, 'Wynik: trzy linie -----', J`List<String> o = lines(runMain()); isTrue("Oczekiwano trzech linii ----- – program wypisał: " + o, o.equals(Arrays.asList("-----", "-----", "-----")));`),
            CK(MD, 'Metoda linia() istnieje', J`method("Main", "linia");`),
            CK(MN, 'Metoda wywołana co najmniej 3 razy', J`isTrue("Wywołaj linia(); trzy razy w main", srcCount(src("Main"), "\\blinia\\s*\\(\\s*\\)\\s*;") >= 3);`),
          ],
        },
        quiz: [
          Q('Po co tworzymy metody?', ['żeby nadać fragmentowi kodu nazwę i nie powtarzać go', 'żeby program działał szybciej', 'żeby ukryć kod przed kompilatorem', 'nie są potrzebne'], 0, 'Raz napisana metoda działa przy każdym wywołaniu.'),
          Q('Co znaczy „wywołać metodę”?', ['uruchomić jej kod, pisząc jej nazwę z nawiasami', 'napisać jej nagłówek', 'usunąć ją', 'skompilować ją'], 0, 'Na przykład <code>przywitaj();</code>.'),
          Q('Gdzie piszemy własną metodę?', ['wewnątrz klasy, obok metody main', 'wewnątrz metody main', 'poza klasą', 'w komentarzu'], 0, 'Metoda to osobny blok w klasie.'),
          OUT('Co wypisze program?', ['Hej<br>Hej', 'Hej', 'HejHej', 'nic'], 0, 'Metoda wywołana dwa razy wypisuje dwa razy.', 'public class Main {\n    static void hej() {\n        System.out.println("Hej");\n    }\n\n    public static void main(String[] args) {\n        hej();\n        hej();\n    }\n}\n'),
        ],
      },

      /* ============ 21. PARAMETRY ============ */
      {
        id: 'start-parametry', title: 'Parametry metody', blurb: 'dane „na wejściu” do metody', minutes: 5,
        content: [
          A('☕', 'Automat z kawą pyta: „<b>jaką kawę</b>?”. Metoda też może pytać o dane – to jej <b>parametry</b>. Gdy ją wywołujesz, podajesz <b>argumenty</b> (konkretne wartości), a metoda wkłada je do swoich „pudełek” (parametrów).'),
          V('flow', { title: 'przywitaj("Ola")', steps: [
            { t: 'Wywołanie', s: 'przywitaj("Ola")', c: 'accent' },
            { t: 'Parametr imie', s: 'dostaje wartość "Ola"', c: 'warn' },
            { t: 'Ciało metody', s: 'używa imie', c: 'ok' },
            { t: 'Wynik', s: 'Czesc, Ola!' }] }),
          { t: 'code', run: true, title: 'Main.java', out: 'Czesc, Ola!\nCzesc, Adam!', x: 'public class Main {\n    static void przywitaj(String imie) {\n        System.out.println("Czesc, " + imie + "!");\n    }\n\n    public static void main(String[] args) {\n        przywitaj("Ola");\n        przywitaj("Adam");\n    }\n}\n' },
          T([['parametr', 'zmienna w <b>nagłówku</b> metody: <code>String imie</code> (typ + nazwa)'], ['argument', 'wartość podana <b>przy wywołaniu</b>: <code>"Ola"</code>']]),
        ],
        guide: {
          files: [F('Main.java', 'public class Main {\n    public static void main(String[] args) {\n        przywitaj("Ola");\n    }\n}\n')],
          steps: [
            { say: '<p>W <code>main</code> wołamy <code>przywitaj("Ola")</code> – przekazujemy imię. Metoda musi więc <b>przyjmować parametr</b>: w nawiasach nagłówka wpisz jego typ i nazwę (<code>String imie</code>).</p>', type: 'static void przywitaj(String imie) {', expect: J`static\s+void\s+przywitaj\s*\(\s*String\s+imie\s*\)\s*\{` },
            { say: '<p>W środku używamy parametru jak zwykłej zmiennej – sklejamy go z tekstem.</p>', type: '    System.out.println("Czesc, " + imie + "!");', expect: J`println\s*\(\s*"Czesc, "\s*\+\s*imie\s*\+\s*"!"\s*\)\s*;` },
            { say: '<p>Zamknij metodę klamrą (obok main, nie w jej środku).</p>', type: '}', expect: J`"!"\s*\)\s*;\s*\}\s*public\s+static\s+void\s+main|public\s+static\s+void\s+main[^}]*\}[^}]*przywitaj[^}]*\}` },
          ],
          solution: [F('Main.java', 'public class Main {\n    static void przywitaj(String imie) {\n        System.out.println("Czesc, " + imie + "!");\n    }\n\n    public static void main(String[] args) {\n        przywitaj("Ola");\n    }\n}\n')],
          checks: [
            CK(CR, 'Wynik: Czesc, Ola!', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Czesc, Ola!] – program wypisał: " + o, o.equals(Arrays.asList("Czesc, Ola!")));`),
            CK(MD, 'Metoda przywitaj przyjmuje parametr String', J`method("Main", "przywitaj", String.class);`),
          ],
        },
        exercise: {
          prompt: '<p>Napisz metodę <code>static void powtorz(String tekst, int ile)</code>, która wypisuje <code>tekst</code> <b>tyle razy</b>, ile wynosi <code>ile</code> (każdy raz w osobnej linii). W <code>main</code> wywołaj <code>powtorz("Hej", 3)</code>.</p>',
          files: [F('Main.java', 'public class Main {\n    public static void main(String[] args) {\n    }\n}\n')],
          hints: ['Nagłówek ma <b>dwa</b> parametry oddzielone przecinkiem: <code>String tekst, int ile</code>.', 'W metodzie pętla <code>for (int i = 0; i &lt; ile; i++)</code> i <code>println(tekst)</code>.'],
          solution: [F('Main.java', 'public class Main {\n    static void powtorz(String tekst, int ile) {\n        for (int i = 0; i < ile; i++) {\n            System.out.println(tekst);\n        }\n    }\n\n    public static void main(String[] args) {\n        powtorz("Hej", 3);\n    }\n}\n')],
          checks: [
            CK(CR, 'Metoda powtorz(String, int) istnieje', J`method("Main", "powtorz", String.class, int.class);`),
            CK(CR, 'powtorz("Ok", 2) wypisuje dwa razy Ok', J`String o = out(() -> callStatic("Main", "powtorz", "Ok", 2)); isTrue("Oczekiwano dwóch linii Ok – wypisano: " + lines(o), lines(o).equals(Arrays.asList("Ok", "Ok")));`),
            CK(MD, 'main wywołuje powtorz("Hej", 3)', J`List<String> o = lines(runMain()); isTrue("main powinno wypisać trzy razy Hej – wypisano: " + o, o.equals(Arrays.asList("Hej", "Hej", "Hej")));`),
          ],
        },
        quiz: [
          Q('Czym jest parametr metody?', ['zmienną w nagłówku metody, która przyjmuje dane', 'nazwą klasy', 'wynikiem metody', 'komentarzem'], 0, 'Np. <code>String imie</code> w <code>przywitaj(String imie)</code>.'),
          Q('Ile parametrów ma metoda <code>static void f(int a, String b)</code>?', ['2', '1', '0', '3'], 0, 'Dwa: <code>a</code> i <code>b</code>.'),
          Q('Czym jest argument?', ['wartością podaną przy wywołaniu metody', 'nazwą metody', 'typem zmiennej', 'klasą'], 0, 'W <code>przywitaj("Ola")</code> argumentem jest <code>"Ola"</code>.'),
        ],
      },

      /* ============ 22. RETURN ============ */
      {
        id: 'start-return', title: 'Wartość zwracana: return', blurb: 'metoda oddaje wynik', minutes: 5,
        content: [
          A('🥫', 'Automat z napojami nie tylko „coś robi” – <b>oddaje Ci puszkę</b>. Metoda też może coś oddać: <b>wynik obliczeń</b>. Robi to słowo <code>return</code>, a typ wyniku wpisujesz w nagłówku <b>zamiast</b> <code>void</code>.'),
          V('flow', { title: 'int kwadrat(int x)', steps: [
            { t: 'wchodzi 5', s: 'parametr x', c: 'accent' },
            { t: 'x * x', s: 'metoda liczy', c: 'warn' },
            { t: 'return 25', s: 'wynik wraca do miejsca wywołania', c: 'ok' }] }),
          { t: 'code', run: true, title: 'Main.java', out: '25', x: 'public class Main {\n    static int kwadrat(int x) {\n        return x * x;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(kwadrat(5));\n    }\n}\n' },
          UL(['Zamiast <code>void</code> piszesz <b>typ wyniku</b>: <code>int</code>, <code>double</code>, <code>boolean</code>, <code>String</code>…', '<code>return wartość;</code> oddaje wynik <b>i kończy metodę</b>.', 'Metoda z typem innym niż <code>void</code> musi zwrócić wartość <b>na każdej ścieżce</b> (inaczej błąd „missing return statement”).', 'Wynik możesz wypisać (<code>println(kwadrat(5))</code>) albo zapisać w zmiennej (<code>int k = kwadrat(5);</code>).']),
        ],
        guide: {
          files: [F('Main.java', 'public class Main {\n    public static void main(String[] args) {\n        System.out.println(kwadrat(5));\n    }\n}\n')],
          steps: [
            { say: '<p>W <code>main</code> wypisujemy <code>kwadrat(5)</code> – metoda ma więc <b>oddać liczbę całkowitą</b>. Zamiast <code>void</code> wpisz typ wyniku: <code>int</code>. W nawiasach parametr <code>int x</code>.</p>', type: 'static int kwadrat(int x) {', expect: J`static\s+int\s+kwadrat\s*\(\s*int\s+x\s*\)\s*\{` },
            { say: '<p><code>return</code> oddaje wynik: kwadrat to <code>x * x</code>.</p>', type: '    return x * x;', expect: J`return\s+x\s*\*\s*x\s*;` },
            { say: '<p>Zamknij metodę klamrą.</p>', type: '}', expect: J`return\s+x\s*\*\s*x\s*;\s*\}` },
          ],
          solution: [F('Main.java', 'public class Main {\n    static int kwadrat(int x) {\n        return x * x;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(kwadrat(5));\n    }\n}\n')],
          checks: [
            CK(CR, 'Wynik: 25', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [25] – program wypisał: " + o, o.equals(Arrays.asList("25")));`),
            CK(MD, 'kwadrat(int) zwraca int', J`isTrue("kwadrat ma zwracać int", method("Main", "kwadrat", int.class).getReturnType() == int.class);`),
          ],
        },
        exercise: {
          prompt: '<p>W klasie <code>Main</code> uzupełnij dwie metody (obie <code>static</code>):</p><ol><li><code>boolean czyParzysta(int x)</code> – zwraca <code>true</code> dla liczb parzystych</li><li><code>int dodaj(int a, int b)</code> – zwraca sumę</li></ol>',
          files: [F('Main.java', 'public class Main {\n    static boolean czyParzysta(int x) {\n        return false;\n    }\n\n    static int dodaj(int a, int b) {\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(czyParzysta(8));\n    }\n}\n')],
          hints: ['Warunek parzystości: <code>return x % 2 == 0;</code>', 'Suma: <code>return a + b;</code>'],
          solution: [F('Main.java', 'public class Main {\n    static boolean czyParzysta(int x) {\n        return x % 2 == 0;\n    }\n\n    static int dodaj(int a, int b) {\n        return a + b;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(czyParzysta(8));\n    }\n}\n')],
          checks: [
            CK(CR, 'czyParzysta rozróżnia liczby parzyste i nieparzyste', J`eq(true, callStatic("Main", "czyParzysta", 8)); eq(false, callStatic("Main", "czyParzysta", 7)); eq(true, callStatic("Main", "czyParzysta", 0));`),
            CK(CR, 'dodaj(int, int) zwraca sumę', J`Method m = method("Main", "dodaj", int.class, int.class); isTrue("dodaj(int,int) powinna zwracać int", m.getReturnType() == int.class); eq(7, m.invoke(null, 3, 4)); eq(-1, m.invoke(null, 2, -3));`),
          ],
        },
        quiz: [
          Q('Co robi słowo <code>return</code>?', ['oddaje wynik z metody i kończy ją', 'wypisuje tekst', 'tworzy zmienną', 'zaczyna pętlę'], 0, 'Wynik wraca w miejsce wywołania metody.'),
          Q('Co zwraca metoda typu <code>void</code>?', ['nic', 'liczbę 0', 'wartość logiczną', 'null'], 0, '<code>void</code> oznacza brak wartości zwracanej.'),
          Q('Metoda zadeklarowana jako <code>int f(int x)</code> musi:', ['zwracać wartość typu int na każdej ścieżce', 'wypisywać wynik na ekran', 'mieć nazwę main', 'być wywołana z klasy Scanner'], 0, 'Brak <code>return</code> na którejś ścieżce to błąd kompilacji.'),
          OUT('Co wypisze program?', ['4', '2', '22', '0'], 0, 'Dwa wywołania zwracają po 2 – wyniki się dodają.', 'public class Main {\n    static int dwa() {\n        return 2;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(dwa() + dwa());\n    }\n}\n'),
        ],
      },

      /* ============ 23. PRZECIĄŻANIE ============ */
      {
        id: 'start-przeciazanie', title: 'Przeciążanie metod', blurb: 'ta sama nazwa, różne parametry', minutes: 4,
        content: [
          A('☕', 'W kawiarni mówisz „poproszę <b>kawę</b>” – a barista wie, co robić, zarówno gdy dodasz „z mlekiem”, jak i „bez”. <b>Ta sama nazwa</b>, ale inna liczba lub rodzaj szczegółów. W Javie możesz mieć kilka metod o tej samej nazwie, jeśli różnią się <b>parametrami</b> – Java sama wybierze właściwą.'),
          V('compare', { cols: [
            { icon: '🔢', title: 'dodaj(2, 3)', c: 'accent', sub: 'liczby całkowite', items: ['wybiera <code>dodaj(int, int)</code>'] },
            { icon: '🔣', title: 'dodaj(2.5, 3.5)', c: 'ok', sub: 'liczby z ułamkiem', items: ['wybiera <code>dodaj(double, double)</code>'] }],
            cap: 'Sam <b>typ zwracany</b> nie wystarcza do przeciążenia – muszą różnić się parametry.' }),
          { t: 'code', run: true, title: 'Main.java', out: '5\n6.0', x: 'public class Main {\n    static int dodaj(int a, int b) {\n        return a + b;\n    }\n\n    static double dodaj(double a, double b) {\n        return a + b;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(dodaj(2, 3));\n        System.out.println(dodaj(2.5, 3.5));\n    }\n}\n' },
        ],
        guide: {
          files: [F('Main.java', 'public class Main {\n    static int dodaj(int a, int b) {\n        return a + b;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(dodaj(2, 3));\n        System.out.println(dodaj(2.5, 3.5));\n    }\n}\n')],
          steps: [
            { say: '<p>Druga linijka w <code>main</code> woła <code>dodaj(2.5, 3.5)</code> – z liczbami z ułamkiem – a mamy tylko wersję dla <code>int</code>. Dopisz drugą metodę o <b>tej samej nazwie</b>, ale z parametrami <code>double</code> i wynikiem <code>double</code>.</p>', type: 'static double dodaj(double a, double b) {', expect: J`static\s+double\s+dodaj\s*\(\s*double\s+a\s*,\s*double\s+b\s*\)\s*\{` },
            { say: '<p>W środku też zwracamy sumę.</p>', type: '    return a + b;', expect: J`double\s+dodaj[^}]*return\s+a\s*\+\s*b\s*;` },
            { say: '<p>Zamknij nową metodę klamrą.</p>', type: '}', expect: J`double\s+dodaj[^}]*return\s+a\s*\+\s*b\s*;\s*\}` },
          ],
          solution: [F('Main.java', 'public class Main {\n    static int dodaj(int a, int b) {\n        return a + b;\n    }\n\n    static double dodaj(double a, double b) {\n        return a + b;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(dodaj(2, 3));\n        System.out.println(dodaj(2.5, 3.5));\n    }\n}\n')],
          checks: [
            CK(CR, 'Wynik: 5 i 6.0', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [5, 6.0] – program wypisał: " + o, o.equals(Arrays.asList("5", "6.0")));`),
            CK(MD, 'Są dwie metody dodaj: int i double', J`method("Main", "dodaj", int.class, int.class); method("Main", "dodaj", double.class, double.class);`),
          ],
        },
        exercise: {
          prompt: '<p>Napisz dwie metody o tej samej nazwie <code>opisz</code> (obie <code>static String</code>): <code>opisz(int n)</code> zwraca tekst <code>"liczba " + n</code>, a <code>opisz(String s)</code> zwraca <code>"tekst " + s</code>.</p>',
          files: [F('Main.java', 'public class Main {\n    public static void main(String[] args) {\n    }\n}\n')],
          hints: ['<code>static String opisz(int n) { return "liczba " + n; }</code>', 'Druga wersja ma parametr <code>String s</code> i zwraca <code>"tekst " + s</code>.'],
          solution: [F('Main.java', 'public class Main {\n    static String opisz(int n) {\n        return "liczba " + n;\n    }\n\n    static String opisz(String s) {\n        return "tekst " + s;\n    }\n\n    public static void main(String[] args) {\n    }\n}\n')],
          checks: [
            CK(CR, 'opisz(int) zwraca „liczba n”', J`eq("liczba 5", method("Main", "opisz", int.class).invoke(null, 5));`),
            CK(CR, 'opisz(String) zwraca „tekst s”', J`eq("tekst Ola", method("Main", "opisz", String.class).invoke(null, "Ola"));`),
          ],
        },
        quiz: [
          Q('Które metody mogą współistnieć w jednej klasie (przeciążanie)?', ['<code>int f(int a)</code> i <code>int f(double a)</code>', '<code>int f(int a)</code> i <code>double f(int a)</code>', '<code>void f(int a)</code> i <code>void f(int a, int b)</code>'], [0, 2], 'Przeciążenie wymaga różnych <b>parametrów</b>. Sam typ zwracany nie wystarczy.'),
          Q('Czym jest przeciążanie metod?', ['kilka metod o tej samej nazwie i różnych parametrach', 'wywołanie metody z zbyt wieloma argumentami', 'napisanie metody dwa razy w tym samym pliku', 'metoda, która nic nie robi'], 0, 'Java wybiera wersję na podstawie argumentów.'),
        ],
      },

      /* ============ 24. SCANNER ============ */
      {
        id: 'start-scanner', title: 'Scanner – dane z klawiatury', blurb: 'import, new Scanner(System.in), nextInt, next', minutes: 6,
        content: [
          A('🎧', '<b>Scanner</b> to „uszy” programu. Program zadaje pytanie na ekranie, Ty wpisujesz odpowiedź i naciskasz <b>Enter</b>, a Scanner przekazuje ją do zmiennej. Bez Scannera program nie umie usłyszeć użytkownika – a w projekcie ma być interaktywny.'),
          V('flow', { title: 'Rozmowa programu z użytkownikiem', steps: [
            { t: 'Program pyta', s: 'print("Podaj wiek: ")', c: 'accent' },
            { t: 'Ty piszesz', s: '17 + Enter', c: 'warn' },
            { t: 'Scanner czyta', s: 'scanner.nextInt()', c: 'ok' },
            { t: 'Zmienna', s: 'int wiek = 17' }] }),
          UL(['<code>import java.util.Scanner;</code> – na samej górze pliku: „pożyczam narzędzie Scanner”.', '<code>new Scanner(System.in)</code> – tworzymy „uszy” podłączone do klawiatury (<code>System.in</code> to wejście z klawiatury).', 'Metody czytania: <code>nextInt()</code> – liczba całkowita, <code>nextDouble()</code> – liczba rzeczywista, <code>next()</code> – jedno słowo.']),
          { t: 'code', run: true, title: 'Main.java', stdin: '17\n', out: 'Podaj wiek: Masz 17 lat', x: MI(['Scanner scanner = new Scanner(System.in);', 'System.out.print("Podaj wiek: ");', 'int wiek = scanner.nextInt();', 'System.out.println("Masz " + wiek + " lat");']) },
          { t: 'note', k: 'warn', x: '<b>Polskie ustawienia regionalne:</b> <code>nextDouble()</code> oczekuje liczby z <b>przecinkiem</b> (<code>4,5</code>), a nie z kropką. Wypisana wartość <code>double</code> i tak ma kropkę (<code>4.5</code>).' },
        ],
        guide: {
          stdin: '17\n',
          files: [F('Main.java', MI([]))],
          steps: [
            { say: '<p>Stwórz „uszy” programu. <code>Scanner</code> to typ, <code>scanner</code> – nazwa zmiennej, <code>new Scanner(System.in)</code> – podłączenie do klawiatury. (<code>import</code> na górze już jest.)</p>', type: 'Scanner scanner = new Scanner(System.in);', expect: J`Scanner\s+scanner\s*=\s*new\s+Scanner\s*\(\s*System\.in\s*\)\s*;` },
            { say: '<p>Zapytaj użytkownika. Użyj <code>print</code> (bez „ln”), żeby kursor został zaraz za pytaniem.</p>', type: 'System.out.print("Podaj wiek: ");', expect: J`print\s*\(\s*"Podaj wiek: "\s*\)\s*;` },
            { say: '<p>Wczytaj liczbę całkowitą do zmiennej <code>wiek</code>. Program zatrzyma się i poczeka, aż wpiszesz liczbę i naciśniesz Enter.</p>', type: 'int wiek = scanner.nextInt();', expect: J`int\s+wiek\s*=\s*scanner\.nextInt\s*\(\s*\)\s*;` },
            { say: '<p>Wypisz odpowiedź ze zmienną.</p>', type: 'System.out.println("Masz " + wiek + " lat");', expect: J`println\s*\(\s*"Masz "\s*\+\s*wiek\s*\+\s*" lat"\s*\)\s*;` },
          ],
          solution: [F('Main.java', MI(['Scanner scanner = new Scanner(System.in);', 'System.out.print("Podaj wiek: ");', 'int wiek = scanner.nextInt();', 'System.out.println("Masz " + wiek + " lat");']))],
          checks: [
            CK(CR, 'Dla wpisanego 17 program wypisuje „Masz 17 lat”', J`List<String> o = lines(runMain("17\n")); isTrue("Oczekiwano linii kończącej się: Masz 17 lat – program wypisał: " + o, !o.isEmpty() && o.get(o.size() - 1).endsWith("Masz 17 lat"));`),
            CK(CR, 'Program działa też dla innych danych (25)', J`List<String> o = lines(runMain("25\n")); isTrue("Dla 25 oczekiwano: Masz 25 lat – program wypisał: " + o + ". Nie wpisuj wyniku na sztywno.", !o.isEmpty() && o.get(o.size() - 1).endsWith("Masz 25 lat"));`),
            CK(MN, 'Użyto new Scanner(System.in) i nextInt()', J`isTrue("Użyj new Scanner(System.in)", srcHas("Main", "new\\s+Scanner\\s*\\(\\s*System\\.in\\s*\\)")); isTrue("Użyj nextInt()", srcHas("Main", "nextInt\\s*\\("));`),
          ],
        },
        exercise: {
          prompt: '<p>Wczytaj z klawiatury: <b>imię</b> (<code>next()</code>), potem <b>dwie liczby całkowite</b>. Wypisz dwie linie:</p><pre>Czesc, Ola!\nSuma: 7</pre><p>(dla danych: <code>Ola</code>, <code>3</code>, <code>4</code>). Możesz przetestować w polu „Dane wejściowe” pod edytorem – każda wartość w osobnej linii.</p>',
          stdin: 'Ola\n3\n4\n',
          files: [F('Main.java', MI(['Scanner scanner = new Scanner(System.in);', '// tu napisz kod']))],
          hints: ['<code>String imie = scanner.next();</code> a potem dwa razy <code>scanner.nextInt()</code>.', 'Wypisz: <code>"Czesc, " + imie + "!"</code> oraz <code>"Suma: " + (a + b)</code>.'],
          solution: [F('Main.java', MI(['Scanner scanner = new Scanner(System.in);', 'String imie = scanner.next();', 'int a = scanner.nextInt();', 'int b = scanner.nextInt();', 'System.out.println("Czesc, " + imie + "!");', 'System.out.println("Suma: " + (a + b));']))],
          checks: [
            CK(CR, 'Dla danych Ola, 3, 4 program wypisuje „Czesc, Ola!” i „Suma: 7”', J`List<String> o = lines(runMain("Ola\n3\n4\n")); isTrue("Spodziewane: [Czesc, Ola!, Suma: 7] – wynik: " + o, o.size() >= 2 && o.get(0).equals("Czesc, Ola!") && o.get(1).equals("Suma: 7"));`),
            CK(CR, 'Program działa też dla innych danych (Adam, 10, -2)', J`List<String> o = lines(runMain("Adam\n10\n-2\n")); isTrue("Spodziewane: [Czesc, Adam!, Suma: 8] – wynik: " + o + ". Nie wpisuj wyników na sztywno.", o.size() >= 2 && o.get(0).equals("Czesc, Adam!") && o.get(1).equals("Suma: 8"));`),
            CK(MN, 'Użyto klasy Scanner z System.in', J`isTrue("Użyj new Scanner(System.in)", srcHas("Main", "new\\s+Scanner\\s*\\(\\s*System\\.in\\s*\\)"));`),
          ],
        },
        quiz: [
          Q('Do wczytania liczby całkowitej z klawiatury służy:', ['scanner.nextInt()', 'scanner.readInt()', 'Integer.scan()', 'System.in.int()'], 0, '<code>nextInt()</code>.'),
          Q('Co oznacza <code>System.in</code>?', ['wejście z klawiatury', 'ekran', 'plik na dysku', 'nazwę klasy'], 0, 'Odwrotność <code>System.out</code>.'),
          Q('Która metoda wczytuje jedno słowo (do spacji)?', ['next()', 'nextInt()', 'nextDouble()', 'readWord()'], 0, '<code>next()</code> czyta do pierwszego białego znaku.'),
          Q('Co trzeba dopisać na górze pliku, żeby używać klasy Scanner?', ['import java.util.Scanner;', 'import java.io.Scanner;', 'include Scanner;', 'nic – Scanner jest zawsze dostępny'], 0, 'Klasa Scanner leży w pakiecie <code>java.util</code>.'),
        ],
      },

      /* ============ 25. NEXTLINE I KONIEC ============ */
      {
        id: 'start-nextline', title: 'nextLine i pętla do słowa KONIEC', blurb: 'czytanie linii, pułapka z Enterem, break', minutes: 6,
        content: [
          A('📬', '<code>nextLine()</code> czyta <b>całą linijkę</b> do Entera. Pułapka: po <code>nextInt()</code> w „skrzynce” zostaje <b>niewidoczny Enter</b>. Jeśli zaraz potem użyjesz <code>nextLine()</code>, wczyta on tylko ten pusty Enter, a nie to, co wpiszesz. Wystarczy raz wywołać <code>nextLine()</code> „na pusto”, żeby go wyrzucić.'),
          V('flow', { title: 'Pułapka po nextInt()', steps: [
            { t: 'nextInt()', s: 'czyta 17, Enter zostaje', c: 'warn' },
            { t: 'nextLine()', s: 'zjada zostawiony Enter → pusty napis', c: 'bad' },
            { t: 'nextLine() jeszcze raz', s: 'dopiero teraz czyta Twój tekst', c: 'ok' }] }),
          UL(['<code>while (true) { … }</code> – pętla „bez końca”, którą przerywamy poleceniem <code>break</code>.', '<code>break</code> – natychmiast wychodzi z pętli.', 'Teksty porównujemy metodą <code>equals</code>: <code>imie.equals("KONIEC")</code> (nie <code>==</code>!).']),
          { t: 'code', run: true, title: 'Main.java', stdin: 'Ala\nOla\nKONIEC\n', out: 'Wpisano 2 imion', x: MI(['Scanner scanner = new Scanner(System.in);', 'int licznik = 0;', 'while (true) {', '    String imie = scanner.nextLine();', '    if (imie.equals("KONIEC")) {', '        break;', '    }', '    licznik++;', '}', 'System.out.println("Wpisano " + licznik + " imion");']) },
        ],
        guide: {
          stdin: 'Ala\nOla\nKONIEC\n',
          files: [F('Main.java', MI(['Scanner scanner = new Scanner(System.in);']))],
          steps: [
            { say: '<p>Zaczniemy od licznika i pętli „bez końca”. <code>while (true)</code> powtarza w nieskończoność – wyjdziemy z niej poleceniem <code>break</code>.</p>', type: 'int licznik = 0;\nwhile (true) {', expect: J`int\s+licznik\s*=\s*0\s*;\s*while\s*\(\s*true\s*\)\s*\{` },
            { say: '<p>W pętli wczytaj całą linijkę tekstu.</p>', type: '    String imie = scanner.nextLine();', expect: J`String\s+imie\s*=\s*scanner\.nextLine\s*\(\s*\)\s*;` },
            { say: '<p>Jeśli użytkownik wpisał słowo KONIEC – przerwij pętlę. Tekst porównujemy metodą <code>equals</code>, <b>nie</b> przez <code>==</code>.</p>', type: '    if (imie.equals("KONIEC")) {\n        break;\n    }', expect: J`if\s*\(\s*imie\.equals\s*\(\s*"KONIEC"\s*\)\s*\)\s*\{\s*break\s*;\s*\}` },
            { say: '<p>Jeśli to nie było KONIEC – policz wpisane imię i zamknij pętlę klamrą.</p>', type: '    licznik++;\n}', expect: J`licznik\s*\+\+\s*;\s*\}` },
            { say: '<p>Po pętli wypisz podsumowanie.</p>', type: 'System.out.println("Wpisano " + licznik + " imion");', expect: J`println\s*\(\s*"Wpisano "\s*\+\s*licznik\s*\+\s*" imion"\s*\)\s*;` },
          ],
          solution: [F('Main.java', MI(['Scanner scanner = new Scanner(System.in);', 'int licznik = 0;', 'while (true) {', '    String imie = scanner.nextLine();', '    if (imie.equals("KONIEC")) {', '        break;', '    }', '    licznik++;', '}', 'System.out.println("Wpisano " + licznik + " imion");']))],
          checks: [
            CK(CR, 'Dla Ala, Ola, KONIEC program wypisuje „Wpisano 2 imion”', J`List<String> o = lines(runMain("Ala\nOla\nKONIEC\n")); isTrue("Oczekiwano: [Wpisano 2 imion] – program wypisał: " + o, !o.isEmpty() && o.get(o.size() - 1).equals("Wpisano 2 imion"));`),
            CK(CR, 'Program działa też dla innych danych', J`List<String> o = lines(runMain("A\nB\nC\nD\nKONIEC\n")); isTrue("Dla 4 imion oczekiwano: Wpisano 4 imion – program wypisał: " + o, !o.isEmpty() && o.get(o.size() - 1).equals("Wpisano 4 imion"));`),
            CK(MN, 'Użyto break i equals', J`isTrue("Użyj break do przerwania pętli", srcHas("Main", "\\bbreak\\s*;")); isTrue("Porównuj tekst przez equals", srcHas("Main", "\\.equals\\s*\\("));`),
          ],
        },
        exercise: {
          prompt: '<p>Wczytuj <b>liczby całkowite</b> (<code>nextInt()</code>) i dodawaj je do sumy, <b>aż użytkownik wpisze 0</b>. Na końcu wypisz sumę:</p><pre>Suma: 7</pre><p>(dla danych: <code>3</code>, <code>4</code>, <code>0</code>). Użyj pętli <code>while</code> i <code>break</code>.</p>',
          stdin: '3\n4\n0\n',
          files: [F('Main.java', MI(['Scanner scanner = new Scanner(System.in);', '// tu napisz kod']))],
          hints: ['<code>int suma = 0;</code> i <code>while (true) { int x = scanner.nextInt(); ... }</code>', 'Jeśli <code>x == 0</code> – <code>break;</code>, w przeciwnym razie <code>suma += x;</code>.'],
          solution: [F('Main.java', MI(['Scanner scanner = new Scanner(System.in);', 'int suma = 0;', 'while (true) {', '    int x = scanner.nextInt();', '    if (x == 0) {', '        break;', '    }', '    suma += x;', '}', 'System.out.println("Suma: " + suma);']))],
          checks: [
            CK(CR, 'Dla 3, 4, 0 program wypisuje „Suma: 7”', J`List<String> o = lines(runMain("3\n4\n0\n")); isTrue("Oczekiwano: [Suma: 7] – program wypisał: " + o, !o.isEmpty() && o.get(o.size() - 1).equals("Suma: 7"));`),
            CK(CR, 'Program działa też dla innych danych (10, -2, 5, 0)', J`List<String> o = lines(runMain("10\n-2\n5\n0\n")); isTrue("Dla 10,-2,5 oczekiwano: Suma: 13 – program wypisał: " + o, !o.isEmpty() && o.get(o.size() - 1).equals("Suma: 13"));`),
            CK(MN, 'Użyto pętli i break', J`isTrue("Użyj pętli while", srcHas("Main", "\\bwhile\\s*\\(")); isTrue("Użyj break", srcHas("Main", "\\bbreak\\s*;"));`),
          ],
        },
        quiz: [
          Q('Co zwróci <code>nextLine()</code> zaraz po <code>nextInt()</code>, jeśli nie „zjesz” Entera?', ['pusty napis', 'wpisaną liczbę', 'wyjątek', 'null'], 0, 'Po <code>nextInt()</code> w buforze zostaje znak nowej linii.'),
          Q('Jak poprawnie porównać tekst <code>imie</code> z <code>"KONIEC"</code>?', ['imie.equals("KONIEC")', 'imie == "KONIEC"', 'imie = "KONIEC"', 'imie.is("KONIEC")'], 0, 'Teksty porównujemy metodą <code>equals</code>.'),
          Q('Co robi <code>break</code> w pętli?', ['natychmiast wychodzi z pętli', 'pomija jedno okrążenie', 'zamyka program', 'nic'], 0, 'Pętla kończy się od razu.'),
          Q('Jak działa <code>while (true)</code>?', ['pętla bez końca, którą trzeba przerwać (np. break)', 'pętla, która nie wykona się ani razu', 'pętla, która wykona się raz', 'jest błędem składni'], 0, 'Warunek jest zawsze prawdziwy.'),
        ],
      },

      /* ============ 26. RANDOM ============ */
      {
        id: 'start-random', title: 'Losowanie: Random', blurb: 'nextInt(n), przedziały', minutes: 4,
        content: [
          A('🎲', '<b>Random</b> to rzut kostką. Za każdym razem dostajesz inną liczbę. <code>rand.nextInt(6)</code> to kostka z sześcioma ściankami, ale numerowanymi <b>od 0 do 5</b> – dlatego, żeby dostać 1–6, dodajesz 1.'),
          V('compare', { cols: [
            { icon: '🎲', title: 'rand.nextInt(6)', c: 'accent', sub: 'liczby 0, 1, 2, 3, 4, 5', items: ['górna granica (6) jest <b>wyłączona</b>'] },
            { icon: '🎲', title: 'rand.nextInt(6) + 1', c: 'ok', sub: 'liczby 1, 2, 3, 4, 5, 6', items: ['jak zwykła kostka'] }] }),
          UL(['<code>import java.util.Random;</code> na górze pliku.', '<code>Random rand = new Random();</code> – „kostka”.', 'Liczba z przedziału [a, b]: <code>a + rand.nextInt(b - a + 1)</code>.']),
          { t: 'code', run: true, title: 'Main.java', x: 'import java.util.Random;\n\n' + M(['Random rand = new Random();', 'int a = 5, b = 10;', 'for (int i = 0; i < 5; i++) {', '    System.out.println(a + rand.nextInt(b - a + 1));', '}']) },
        ],
        guide: {
          files: [F('Main.java', 'import java.util.Random;\n\n' + M([]))],
          steps: [
            { say: '<p>Utwórz „kostkę” – obiekt <code>Random</code>.</p>', type: 'Random rand = new Random();', expect: J`Random\s+rand\s*=\s*new\s+Random\s*\(\s*\)\s*;` },
            { say: '<p>Wylosuj liczbę od 1 do 6: <code>nextInt(6)</code> daje 0–5, więc dodajemy 1.</p>', type: 'int oczka = rand.nextInt(6) + 1;', expect: J`int\s+oczka\s*=\s*rand\.nextInt\s*\(\s*6\s*\)\s*\+\s*1\s*;` },
            { say: '<p>Wypisz wynik rzutu.</p>', type: 'System.out.println(oczka);', expect: J`println\s*\(\s*oczka\s*\)\s*;` },
          ],
          solution: [F('Main.java', 'import java.util.Random;\n\n' + M(['Random rand = new Random();', 'int oczka = rand.nextInt(6) + 1;', 'System.out.println(oczka);']))],
          checks: [
            CK(CR, 'Wypisywana liczba jest zawsze z przedziału 1–6', J`for (int k = 0; k < 20; k++) { List<String> o = lines(runMain()); isTrue("Program powinien wypisać jedną liczbę 1–6, a wypisał: " + o, o.size() == 1 && Integer.parseInt(o.get(0)) >= 1 && Integer.parseInt(o.get(0)) <= 6); }`),
            CK(MN, 'Użyto klasy Random', J`isTrue("Użyj new Random()", srcHas("Main", "new\\s+Random\\s*\\("));`),
          ],
        },
        exercise: {
          prompt: '<p>Wylosuj liczbę <b>od 5 do 10 włącznie</b> i wypisz ją (jedna liczba w jednej linii). Wzór: <code>a + rand.nextInt(b - a + 1)</code>.</p>',
          files: [F('Main.java', 'import java.util.Random;\n\n' + M(['Random rand = new Random();', '// tu napisz kod']))],
          hints: ['<code>nextInt(6)</code> daje 0–5, a my chcemy 5–10 (sześć możliwości).', '<code>System.out.println(5 + rand.nextInt(6));</code>'],
          solution: [F('Main.java', 'import java.util.Random;\n\n' + M(['Random rand = new Random();', 'System.out.println(5 + rand.nextInt(6));']))],
          checks: [
            CK(CR, 'Wypisywana liczba jest zawsze z przedziału 5–10', J`for (int k = 0; k < 40; k++) { List<String> o = lines(runMain()); isTrue("Program powinien wypisać jedną liczbę 5–10, a wypisał: " + o, o.size() == 1 && Integer.parseInt(o.get(0)) >= 5 && Integer.parseInt(o.get(0)) <= 10); }`),
            CK(MN, 'Użyto nextInt na obiekcie Random', J`isTrue("Użyj rand.nextInt(...)", srcHas("Main", "\\.nextInt\\s*\\("));`),
          ],
        },
        quiz: [
          Q('<code>new Random().nextInt(10)</code> zwraca:', ['liczbę od 1 do 10', 'liczbę od 0 do 10', 'liczbę od 0 do 9', 'liczbę od 0 do 99'], 2, 'Górna granica jest <b>wyłączona</b>.'),
          Q('Jak wylosować liczbę od 1 do 6 (jak kostka)?', ['rand.nextInt(6) + 1', 'rand.nextInt(6)', 'rand.nextInt(7)', 'rand.nextInt(1, 6)'], 0, '<code>nextInt(6)</code> daje 0–5, po dodaniu 1 mamy 1–6.'),
        ],
      },
    ],
    quiz: [
      Q('Co jest prawdą o plikach i klasach w Javie?', ['Publiczna klasa leży w pliku o tej samej nazwie', 'W jednym projekcie może być tylko jedna klasa', 'Program startuje od metody <code>main</code>', 'Java nie rozróżnia małych i wielkich liter'], [0, 2], 'W projekcie wiele klas, każda w osobnym pliku. Java rozróżnia wielkość liter.', 'start-class'),
      Q('Typ reprezentujący liczby całkowite to:', ['string', 'integer', 'int', 'float'], 2, '<code>int</code>. „integer” to nie jest typ Javy (a <code>Integer</code> to klasa-opakowanie).', 'start-typy'),
      Q('Wynik instrukcji <code>System.out.println(9 / 4);</code> to:', ['2.25', '2', '2.0', '3'], 1, 'Dzielenie całkowite obcina część ułamkową.', 'start-dzielenie'),
      Q('Która pętla wykona się dokładnie 5 razy?', ['<code>for (int i = 0; i &lt; 5; i++)</code>', '<code>for (int i = 1; i &lt; 5; i++)</code>', '<code>for (int i = 0; i &lt;= 5; i++)</code>', '<code>for (int i = 1; i &lt;= 5; i++)</code>'], [0, 3], 'Sprawdź granice: 0..4 i 1..5 to po 5 powtórzeń.', 'start-petle'),
      Q('Dla <code>int[] t = {3, 5, 7};</code> wyrażenie <code>t[3]</code> spowoduje:', ['zwrócenie 0', 'zwrócenie null', 'ArrayIndexOutOfBoundsException', 'błąd kompilacji'], 2, 'Poprawne indeksy to 0, 1, 2. Błąd wychodzi dopiero w trakcie działania programu.', 'start-tablice'),
      Q('Metoda zadeklarowana jako <code>int f(int x)</code> musi:', ['wypisywać wynik na ekran', 'zwracać wartość typu int na każdej ścieżce', 'mieć nazwę main', 'być wywołana z klasy Scanner'], 1, 'Brak <code>return</code> na którejś ścieżce to błąd kompilacji.', 'start-return'),
      Q('Do wczytania liczby całkowitej z klawiatury służy:', ['scanner.nextInt()', 'scanner.readInt()', 'Integer.scan()', 'System.in.int()'], 0, '<code>nextInt()</code>.', 'start-scanner'),
    ],
  });
})();
