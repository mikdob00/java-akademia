'use strict';
ACAD.modules.push({
  id: 'stat', num: 4, level: 1, icon: '📊', title: 'Pola i metody statyczne',
  source: 'Wykład 1 / Prezentacja 1 (koniec) · Laboratoria 2 (Zadania 2)',
  summary: 'Elementy należące do klasy, a nie do obiektu: liczniki, narzędziowe metody, stałe. Z zadaniami o geometrii i głosowaniu.',
  goals: ['zadeklarować pole <code>static</code> wspólne dla wszystkich obiektów', 'napisać i wywołać metodę statyczną przez nazwę klasy', 'wyjaśnić, czemu metoda statyczna nie widzi pól niestatycznych', 'użyć <code>static final</code> jako stałej'],
  lessons: [

    {
      id: 'stat-idea', micro: true, title: 'Co znaczy static?', blurb: 'należy do klasy, a nie do obiektu', minutes: 4,
      content: [
        ANA('🏫', 'Każdy uczeń ma <b>własny zeszyt</b> (to pola zwykłe: każdy obiekt ma swoje). Ale <b>tablica z licznikiem uczniów na korytarzu jest jedna</b> dla całej szkoły (to pole <code>static</code>). Elementy statyczne należą do <b>klasy</b>, a nie do żadnego obiektu. Istnieją nawet wtedy, gdy nie powstał żaden obiekt.'),
        VIZ('compare', { cols: [
          { icon: '📓', title: 'pole zwykłe', c: 'accent', sub: 'każdy obiekt ma własne', items: ['<code>String imie;</code>', 'dostęp: <code>p.imie</code>'] },
          { icon: '🪧', title: 'pole static', c: 'ok', sub: 'jedno na całą klasę', items: ['<code>static int licznik;</code>', 'dostęp: <code>Pies.licznik</code>'] }] }),
        VIZ('objects', { vars: [{ t: 'Pies', n: 'a', to: 'o1' }, { t: 'Pies', n: 'b', to: 'o2' }], objs: [{ id: 'o1', c: 'Pies', f: [['imie', '"Reks"']] }, { id: 'o2', c: 'Pies', f: [['imie', '"Fifi"']] }], cap: 'Każdy pies ma własne <code>imie</code>. Licznik <code>static</code> nie jest w żadnym z nich, bo należy do klasy <code>Pies</code>.' }),
        TERMS([['pole statyczne', 'jedna wartość wspólna dla wszystkich obiektów klasy'], ['metoda statyczna', 'metoda wywoływana przez nazwę klasy, bez tworzenia obiektu'], ['stała', '<code>static final</code>: wspólna i niezmienna']]),
      ],
      quiz: [
        Q('Do kogo należy pole <code>static</code>?', ['do klasy, jedno wspólne dla wszystkich obiektów', 'do każdego obiektu osobno', 'tylko do pierwszego obiektu', 'do metody main'], 0, 'Pole statyczne ma jedną wartość na całą klasę.'),
        Q('Czy pole statyczne istnieje, gdy nie powstał jeszcze żaden obiekt?', ['tak', 'nie', 'tylko gdy jest private', 'tylko w klasie Main'], 0, 'Należy do klasy, a nie do obiektu.'),
        Q('Przez co odwołujemy się do elementów statycznych?', ['przez nazwę klasy (np. <code>Pies.licznik</code>)', 'tylko przez obiekt', 'przez słowo this', 'przez słowo new'], 0, 'Np. <code>Pies.licznik</code>, <code>Math.sqrt(4)</code>.'),
      ],
    },

    {
      id: 'stat-pola', title: 'Pole statyczne: wspólny licznik', blurb: 'static int liczbaPsow', minutes: 5,
      content: [
        ANA('🪧', 'Tablica przy wejściu do schroniska: „Liczba psów: 2”. Gdy przychodzi nowy pies, <b>nie zakładamy mu osobnej tablicy</b>, tylko poprawiamy tę jedną wspólną. W kodzie: <code>static int liczbaPsow;</code> zwiększane w konstruktorze.'),
        CODE(J`class Pies {
    static int liczbaPsow = 0;
    String imie;

    public Pies(String imie) {
        this.imie = imie;
        liczbaPsow++;
    }
}

public class Main {
    public static void main(String[] args) {
        new Pies("Reks");
        new Pies("Fifi");
        System.out.println(Pies.liczbaPsow);
    }
}
`, '2'),
        NOTE('tip', 'Każdy <code>new Pies(...)</code> uruchamia konstruktor, a ten zwiększa <b>jeden wspólny</b> licznik. Odczyt przez nazwę klasy: <code>Pies.liczbaPsow</code>.'),
      ],
      guide: {
        files: [FL('Pies.java', 'public class Pies {\n    String imie;\n\n    public Pies(String imie) {\n        this.imie = imie;\n    }\n}\n')],
        steps: [
          { say: '<p>Dodaj pole <b>statyczne</b> (<code>static</code>) typu <code>int</code> – wspólny licznik dla całej klasy, na początku 0.</p>', type: '    static int liczbaPsow = 0;', expect: J`static\s+int\s+liczbaPsow\s*(=\s*0\s*)?;` },
          { say: '<p>W konstruktorze zwiększ licznik. Każdy nowy pies zwiększy ten sam licznik.</p>', type: '        liczbaPsow++;', expect: J`this\.imie\s*=\s*imie\s*;\s*liczbaPsow\s*(\+\+|\+=\s*1)\s*;` },
        ],
        solution: [FL('Pies.java', 'public class Pies {\n    static int liczbaPsow = 0;\n    String imie;\n\n    public Pies(String imie) {\n        this.imie = imie;\n        liczbaPsow++;\n    }\n}\n')],
        checks: [
          CK(CR, 'liczbaPsow jest polem static typu int', J`isTrue("liczbaPsow ma być static", Modifier.isStatic(fieldMods("Pies", "liczbaPsow")));`),
          CK(CR, 'Każdy nowy pies zwiększa licznik o 1', J`int a = (Integer) staticField("Pies", "liczbaPsow"); make("Pies", "Reks"); make("Pies", "Fifi"); make("Pies", "Azor"); int b = (Integer) staticField("Pies", "liczbaPsow"); eq(a + 3, b);`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Ksiazka</code> ma konstruktor <code>(String tytul)</code>. Dodaj pole statyczne <code>int liczbaKsiazek</code> i zwiększaj je w konstruktorze.</p>',
        files: [FL('Ksiazka.java', 'public class Ksiazka {\n    String tytul;\n\n    public Ksiazka(String tytul) {\n        this.tytul = tytul;\n    }\n}\n')],
        hints: ['<code>static int liczbaKsiazek = 0;</code> jako pole klasy', '<code>liczbaKsiazek++;</code> w konstruktorze'],
        solution: [FL('Ksiazka.java', 'public class Ksiazka {\n    static int liczbaKsiazek = 0;\n    String tytul;\n\n    public Ksiazka(String tytul) {\n        this.tytul = tytul;\n        liczbaKsiazek++;\n    }\n}\n')],
        checks: [
          CK(CR, 'liczbaKsiazek jest static', J`isTrue("liczbaKsiazek ma być static", Modifier.isStatic(fieldMods("Ksiazka", "liczbaKsiazek")));`),
          CK(CR, 'Licznik rośnie przy każdej książce', J`int a = (Integer) staticField("Ksiazka", "liczbaKsiazek"); make("Ksiazka", "A"); make("Ksiazka", "B"); eq(a + 2, (Integer) staticField("Ksiazka", "liczbaKsiazek"));`),
        ],
      },
      quiz: [
        OUTQ('Co wypisze program?', ['3', '1', '0', 'błąd'], 0, 'Wspólny licznik zwiększył się trzy razy.', 'class Pies {\n    static int licznik = 0;\n\n    public Pies() {\n        licznik++;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        new Pies();\n        new Pies();\n        new Pies();\n        System.out.println(Pies.licznik);\n    }\n}\n'),
        Q('Ile kopii pola <code>static int licznik</code> istnieje, gdy powstało 100 obiektów?', ['1', '100', '0', '101'], 0, 'Pole statyczne jest jedno dla całej klasy.'),
        Q('Gdzie zwykle zwiększa się licznik utworzonych obiektów?', ['w konstruktorze', 'w metodzie main po każdym new', 'w getterze', 'w komentarzu'], 0, 'Konstruktor wykonuje się przy każdym new.'),
      ],
    },

    {
      id: 'stat-dostep', title: 'Dostęp przez nazwę klasy', blurb: 'Pies.licznik, Math.PI', minutes: 4,
      content: [
        ANA('📞', 'Do zwykłego pola dzwonisz „do konkretnej osoby” (<code>p.imie</code>). Pole statyczne jest <b>w biurze szkoły</b>, więc dzwonisz do biura, czyli podajesz <b>nazwę klasy</b>: <code>Pies.liczbaPsow</code>. Znasz to już z Javy: <code>Math.PI</code>, <code>Math.sqrt(9)</code>, <code>Integer.parseInt("5")</code>.'),
        CODE(J`class Sklep {
    static int sprzedane = 0;
}

public class Main {
    public static void main(String[] args) {
        Sklep.sprzedane = 5;
        Sklep.sprzedane++;
        System.out.println(Sklep.sprzedane);
        System.out.println(Math.max(3, 8));
    }
}
`, '6\n8'),
        NOTE('info', 'Dostęp przez obiekt (<code>obiekt.licznik</code>) też zadziała, ale to <b>zła praktyka</b>. Zawsze pisz <code>Klasa.pole</code>, dzięki temu od razu widać, że pole jest statyczne.'),
      ],
      guide: {
        files: [FL('Sklep.java', 'public class Sklep {\n    static int sprzedane = 0;\n}\n'), FL('Main.java', MAINW([]))],
        steps: [
          { say: '<p>W <code>main</code> ustaw pole statyczne przez <b>nazwę klasy</b>. Nie tworzysz żadnego obiektu <code>Sklep</code>.</p>', type: 'Sklep.sprzedane = 5;', expect: J`Sklep\.sprzedane\s*=\s*5\s*;` },
          { say: '<p>Zwiększ je o 1.</p>', type: 'Sklep.sprzedane++;', expect: J`Sklep\.sprzedane\s*(\+\+|\+=\s*1)\s*;` },
          { say: '<p>Wypisz wartość.</p>', type: 'System.out.println(Sklep.sprzedane);', expect: J`println\s*\(\s*Sklep\.sprzedane\s*\)` },
        ],
        solution: [FL('Sklep.java', 'public class Sklep {\n    static int sprzedane = 0;\n}\n'), FL('Main.java', MAINW(['Sklep.sprzedane = 5;', 'Sklep.sprzedane++;', 'System.out.println(Sklep.sprzedane);']))],
        checks: [
          CK(CR, 'Wynik: 6', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [6] – program wypisał: " + o, o.equals(Arrays.asList("6")));`),
          CK(MD, 'Dostęp przez nazwę klasy, bez new Sklep', J`isFalse("Nie twórz obiektu Sklep, użyj Sklep.sprzedane", srcHas("Main", "new\\s+Sklep"));`),
        ],
      },
      exercise: {
        prompt: '<p>W klasie <code>Gra</code> jest pole statyczne <code>int rekord</code> (0). W <code>main</code> ustaw <code>Gra.rekord</code> na <b>120</b>, potem zwiększ o <b>30</b> (<code>+=</code>) i wypisz wartość.</p><pre>150</pre>',
        files: [FL('Gra.java', 'public class Gra {\n    static int rekord = 0;\n}\n'), FL('Main.java', MAINW([]))],
        hints: ['<code>Gra.rekord = 120;</code>', '<code>Gra.rekord += 30;</code>'],
        solution: [FL('Gra.java', 'public class Gra {\n    static int rekord = 0;\n}\n'), FL('Main.java', MAINW(['Gra.rekord = 120;', 'Gra.rekord += 30;', 'System.out.println(Gra.rekord);']))],
        checks: [
          CK(CR, 'Wynik: 150', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [150] – program wypisał: " + o, o.equals(Arrays.asList("150")));`),
          CK(MD, 'Dostęp przez Gra.rekord', J`isTrue("Użyj Gra.rekord", srcHas("Main", "Gra\\.rekord")); isFalse("Nie twórz obiektu Gra", srcHas("Main", "new\\s+Gra"));`),
        ],
      },
      quiz: [
        Q('Jak odwołać się do statycznego pola <code>licznik</code> klasy <code>Pies</code>?', ['Pies.licznik', 'pies.licznik', 'new Pies().licznik', 'this.licznik z main'], 0, 'Przez nazwę klasy.'),
        Q('Czy trzeba tworzyć obiekt, żeby użyć pola statycznego?', ['nie', 'tak', 'tak, ale tylko jeden', 'tylko dla int'], 0, 'Pole statyczne istnieje od razu.'),
        OUTQ('Co wypisze program?', ['8', '3', '0', '5'], 0, 'To zwykłe działanie na polu statycznym.', 'class Sklep {\n    static int sprzedane = 3;\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Sklep.sprzedane += 5;\n        System.out.println(Sklep.sprzedane);\n    }\n}\n'),
      ],
    },

    {
      id: 'stat-metody', title: 'Metoda statyczna', blurb: 'wywołanie bez obiektu: Klasa.metoda()', minutes: 5,
      content: [
        ANA('🧮', 'Kalkulator na ścianie biura nie wymaga „własnego kalkulatora ucznia”: podchodzisz i liczysz. <b>Metoda statyczna</b> to takie narzędzie klasy: wywołujesz je przez <b>nazwę klasy</b>, bez tworzenia obiektu. Idealna do obliczeń, które nie zależą od żadnego obiektu (np. <code>Math.max(3, 8)</code>).'),
        CODE(J`class Matma {
    static int kwadrat(int x) {
        return x * x;
    }

    static int max(int a, int b) {
        if (a > b) {
            return a;
        }
        return b;
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(Matma.kwadrat(6));
        System.out.println(Matma.max(3, 8));
    }
}
`, '36\n8'),
        LI(['Przed typem zwracanym stoi <code>static</code>.', 'Wywołanie: <code>Matma.kwadrat(6)</code>, a nie <code>new Matma().kwadrat(6)</code>.', 'Dlatego <code>main</code> jest <code>static</code>: Java uruchamia ją, zanim istnieje jakikolwiek obiekt.']),
      ],
      guide: {
        files: [FL('Matma.java', 'public class Matma {\n}\n'), FL('Main.java', MAINW([]))],
        steps: [
          { say: '<p>W klasie <code>Matma</code> dodaj metodę <b>statyczną</b>: <code>static</code>, zwraca <code>int</code>, jeden parametr <code>x</code>.</p>', type: '    static int kwadrat(int x) {', expect: J`static\s+int\s+kwadrat\s*\(\s*int\s+x\s*\)\s*\{` },
          { say: '<p>Zwróć kwadrat i zamknij metodę.</p>', type: '        return x * x;\n    }', expect: J`return\s+x\s*\*\s*x\s*;\s*\}` },
          { say: '<p>W <code>main</code> wywołaj ją przez <b>nazwę klasy</b> i wypisz wynik.</p>', type: 'System.out.println(Matma.kwadrat(6));', expect: J`println\s*\(\s*Matma\.kwadrat\s*\(\s*6\s*\)\s*\)` },
        ],
        solution: [FL('Matma.java', 'public class Matma {\n    static int kwadrat(int x) {\n        return x * x;\n    }\n}\n'), FL('Main.java', MAINW(['System.out.println(Matma.kwadrat(6));']))],
        checks: [
          CK(CR, 'Matma.kwadrat(x) zwraca kwadrat', J`eq(36, callStatic("Matma", "kwadrat", 6)); eq(0, callStatic("Matma", "kwadrat", 0)); eq(25, callStatic("Matma", "kwadrat", -5));`),
          CK(MD, 'Metoda kwadrat jest static', J`isTrue("kwadrat ma być static", Modifier.isStatic(methodMods("Matma", "kwadrat")));`),
          CK(CR, 'main wypisuje 36', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [36] – program wypisał: " + o, o.equals(Arrays.asList("36")));`),
        ],
      },
      exercise: {
        prompt: '<p>W klasie <code>Narzedzia</code> napisz dwie metody <code>static</code>: <code>int max(int a, int b)</code> (większa z dwóch liczb) oraz <code>boolean czyParzysta(int x)</code>.</p>',
        files: [FL('Narzedzia.java', 'public class Narzedzia {\n}\n')],
        hints: ['<code>if (a > b) { return a; } return b;</code>', '<code>return x % 2 == 0;</code>'],
        solution: [FL('Narzedzia.java', 'public class Narzedzia {\n    static int max(int a, int b) {\n        if (a > b) {\n            return a;\n        }\n        return b;\n    }\n\n    static boolean czyParzysta(int x) {\n        return x % 2 == 0;\n    }\n}\n')],
        checks: [
          CK(CR, 'max(a, b) zwraca większą liczbę', J`eq(8, callStatic("Narzedzia", "max", 3, 8)); eq(8, callStatic("Narzedzia", "max", 8, 3)); eq(-1, callStatic("Narzedzia", "max", -1, -5));`),
          CK(CR, 'czyParzysta(x) rozróżnia parzyste', J`eq(true, callStatic("Narzedzia", "czyParzysta", 4)); eq(false, callStatic("Narzedzia", "czyParzysta", 7)); eq(true, callStatic("Narzedzia", "czyParzysta", 0));`),
          CK(MD, 'Metody są static', J`isTrue("max ma być static", Modifier.isStatic(methodMods("Narzedzia", "max"))); isTrue("czyParzysta ma być static", Modifier.isStatic(methodMods("Narzedzia", "czyParzysta")));`),
        ],
      },
      quiz: [
        Q('Jak wywołać metodę statyczną <code>kwadrat</code> klasy <code>Matma</code>?', ['Matma.kwadrat(6)', 'new Matma().kwadrat(6)', 'kwadrat.Matma(6)', 'Matma->kwadrat(6)'], 0, 'Przez nazwę klasy, bez tworzenia obiektu.'),
        Q('Dlaczego metoda <code>main</code> jest <code>static</code>?', ['Java uruchamia ją, zanim istnieje jakikolwiek obiekt', 'bo main musi być szybka', 'bo main jest prywatna', 'bo tak wygląda ładniej'], 0, 'Nie ma obiektu, na którym można by ją wywołać.'),
        OUTQ('Co wypisze program?', ['16', '8', '4', '44'], 0, 'Metoda zwraca x * x: 4 * 4.', 'class Matma {\n    static int kwadrat(int x) {\n        return x * x;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(Matma.kwadrat(4));\n    }\n}\n'),
      ],
    },

    {
      id: 'stat-zasady', title: 'Co może metoda statyczna?', blurb: 'nie widzi pól obiektu ani this', minutes: 5,
      content: [
        ANA('🏢', 'Biuro szkoły (<b>klasa</b>) nie wie, <b>który</b> uczeń pyta. Dlatego metoda statyczna <b>nie widzi pól konkretnego obiektu</b> i nie może używać <code>this</code>, bo nie wiadomo „czyje” by to było. Odwrotnie jest łatwo: <b>zwykła metoda obiektu</b> widzi i swoje pola, i pola statyczne.'),
        VIZ('compare', { cols: [
          { icon: '🏢', title: 'metoda static', c: 'warn', items: ['✅ pola static', '✅ inne metody static', '❌ pola obiektu', '❌ <code>this</code>'] },
          { icon: '🧑', title: 'metoda zwykła', c: 'ok', items: ['✅ pola obiektu', '✅ pola static', '✅ metody static', '✅ <code>this</code>'] }] }),
        CODE(J`class Pies {
    static int licznik = 0;
    String imie = "Reks";

    static void pokazLicznik() {
        System.out.println("Psow: " + licznik);
    }

    void przedstawSie() {
        System.out.println(imie + ", jeden z " + licznik);
    }
}

public class Main {
    public static void main(String[] args) {
        Pies.licznik = 3;
        Pies.pokazLicznik();
        new Pies().przedstawSie();
    }
}
`, 'Psow: 3\nReks, jeden z 3'),
        NOTE('warn', 'Najczęstszy błąd: użycie pola obiektu w metodzie <code>static</code>. Kompilator zgłasza „non-static variable cannot be referenced from a static context”. Rozwiązanie: usuń <code>static</code> z metody albo użyj obiektu.'),
      ],
      guide: {
        files: [FL('Pies.java', 'public class Pies {\n    static int licznik = 3;\n    String imie = "Reks";\n\n    static void przedstawSie() {\n        System.out.println(imie + ", jeden z " + licznik);\n    }\n}\n')],
        steps: [
          { say: '<p>Ta metoda nie skompiluje się: jest <code>static</code>, a używa pola <code>imie</code> należącego do obiektu. Wypisuje imię konkretnego psa, więc powinna być <b>zwykłą metodą</b>. Usuń z jej nagłówka słowo <code>static</code>.</p>', type: '    void przedstawSie() {', expect: J`(?<!static\s)void\s+przedstawSie\s*\(\s*\)` },
        ],
        solution: [FL('Pies.java', 'public class Pies {\n    static int licznik = 3;\n    String imie = "Reks";\n\n    void przedstawSie() {\n        System.out.println(imie + ", jeden z " + licznik);\n    }\n}\n')],
        checks: [
          CK(CR, 'Klasa Pies się kompiluje i istnieje metoda przedstawSie', J`method("Pies", "przedstawSie");`),
          CK(MD, 'Metoda przedstawSie nie jest static', J`isFalse("przedstawSie używa pola obiektu, więc nie może być static", Modifier.isStatic(methodMods("Pies", "przedstawSie")));`),
          CK(CR, 'przedstawSie() wypisuje imię i licznik', J`Object p = make("Pies"); List<String> o = lines(out(() -> call(p, "przedstawSie"))); isTrue("Oczekiwano: [Reks, jeden z " + staticField("Pies", "licznik") + "] – wypisano: " + o, o.size() == 1 && o.get(0).startsWith("Reks, jeden z "));`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Sklep</code> ma pole statyczne <code>int sprzedane</code> i pole obiektu <code>String nazwa</code>. Dopisz:<br>1. <code>static int ile()</code> zwraca <code>sprzedane</code>,<br>2. <code>String opis()</code> (zwykła metoda) zwraca <code>nazwa + ": " + sprzedane</code>.</p>',
        files: [FL('Sklep.java', 'public class Sklep {\n    static int sprzedane = 7;\n    String nazwa;\n\n    public Sklep(String nazwa) {\n        this.nazwa = nazwa;\n    }\n}\n')],
        hints: ['<code>static int ile() { return sprzedane; }</code>', '<code>String opis() { return nazwa + ": " + sprzedane; }</code> (bez static)'],
        solution: [FL('Sklep.java', 'public class Sklep {\n    static int sprzedane = 7;\n    String nazwa;\n\n    public Sklep(String nazwa) {\n        this.nazwa = nazwa;\n    }\n\n    static int ile() {\n        return sprzedane;\n    }\n\n    String opis() {\n        return nazwa + ": " + sprzedane;\n    }\n}\n')],
        checks: [
          CK(CR, 'ile() jest static i zwraca sprzedane', J`isTrue("ile ma być static", Modifier.isStatic(methodMods("Sklep", "ile"))); eq(staticField("Sklep", "sprzedane"), callStatic("Sklep", "ile"));`),
          CK(CR, 'opis() zwraca nazwę i liczbę', J`Object s = make("Sklep", "Zabka"); eq("Zabka: " + staticField("Sklep", "sprzedane"), call(s, "opis"));`),
          CK(MD, 'opis() nie jest static', J`isFalse("opis używa pola obiektu, więc nie może być static", Modifier.isStatic(methodMods("Sklep", "opis")));`),
        ],
      },
      quiz: [
        Q('Co jest prawdą o metodzie <code>static</code>?', ['nie może używać pól obiektu ani this', 'może używać wszystkich pól obiektu', 'musi być private', 'nie może mieć parametrów'], 0, 'Nie wie, na którym obiekcie działa.'),
        Q('Czy zwykła metoda obiektu może użyć pola statycznego?', ['tak', 'nie', 'tylko gdy jest public', 'tylko w main'], 0, 'Pola statyczne widzą wszyscy.'),
        Q('Co zgłosi kompilator, gdy metoda <code>static</code> użyje pola obiektu?', ['błąd kompilacji (non-static … from a static context)', 'ostrzeżenie, ale program ruszy', 'NullPointerException w czasie działania', 'nic'], 0, 'To błąd kompilacji.'),
        Q('Które odwołania są dozwolone wewnątrz metody <code>static</code>?', ['do pola static', 'do innej metody static', 'do pola zwykłego obiektu', 'do this'], [0, 1], 'Nie ma tam obiektu, więc nie ma pól obiektu ani this.'),
      ],
    },

    {
      id: 'stat-id', title: 'Automatyczne numery: licznik id', blurb: 'static nastepneId + final id', minutes: 5,
      content: [
        ANA('🎟️', 'W kolejce po bilety automat wydaje numerki 1, 2, 3… Każdy klient ma <b>własny numerek</b> (pole zwykłe, niezmienne), a automat pamięta <b>następny wolny numer</b> (pole statyczne). To bardzo częsty wzorzec w projektach: nadawanie obiektom unikalnych <code>id</code>.'),
        VIZ('flow', { title: 'new Klient("Ola"), new Klient("Adam")', steps: [{ t: 'nastepneId = 1', s: 'licznik wspólny (static)', c: 'accent' }, { t: 'Ola: id = 1', s: 'potem nastepneId = 2', c: 'ok' }, { t: 'Adam: id = 2', s: 'potem nastepneId = 3', c: 'ok' }] }),
        CODE(J`class Klient {
    private static int nastepneId = 1;
    private final int id;
    private String imie;

    public Klient(String imie) {
        this.imie = imie;
        this.id = nastepneId;
        nastepneId++;
    }

    public int getId() {
        return id;
    }
}

public class Main {
    public static void main(String[] args) {
        Klient a = new Klient("Ola");
        Klient b = new Klient("Adam");
        System.out.println(a.getId() + " " + b.getId());
    }
}
`, '1 2'),
        NOTE('tip', 'Skrót: <code>this.id = nastepneId++;</code> (przypisz bieżącą wartość, a potem zwiększ licznik).'),
      ],
      guide: {
        files: [FL('Klient.java', 'public class Klient {\n    private final int id;\n    private String imie;\n\n    public Klient(String imie) {\n        this.imie = imie;\n    }\n\n    public int getId() {\n        return id;\n    }\n}\n')],
        steps: [
          { say: '<p>Dodaj <b>wspólny licznik</b> – pole statyczne, które pamięta następny wolny numer (start od 1).</p>', type: '    private static int nastepneId = 1;', expect: J`private\s+static\s+int\s+nastepneId\s*=\s*1\s*;` },
          { say: '<p>W konstruktorze nadaj klientowi bieżący numer z licznika.</p>', type: '        this.id = nastepneId;', expect: J`this\.id\s*=\s*nastepneId\s*(\+\+)?\s*;` },
          { say: '<p>Zwiększ licznik, żeby następny klient dostał kolejny numer. (Możesz też połączyć oba kroki: <code>this.id = nastepneId++;</code>.)</p>', type: '        nastepneId++;', expect: J`nastepneId\s*(\+\+|\+=\s*1)\s*;|this\.id\s*=\s*nastepneId\+\+\s*;` },
        ],
        solution: [FL('Klient.java', 'public class Klient {\n    private static int nastepneId = 1;\n    private final int id;\n    private String imie;\n\n    public Klient(String imie) {\n        this.imie = imie;\n        this.id = nastepneId;\n        nastepneId++;\n    }\n\n    public int getId() {\n        return id;\n    }\n}\n')],
        checks: [
          CK(CR, 'Kolejne obiekty dostają kolejne numery', J`Object a = make("Klient", "Ola"); Object b = make("Klient", "Adam"); Object c = make("Klient", "Ewa"); int ia = (Integer) call(a, "getId"); eq(ia + 1, call(b, "getId")); eq(ia + 2, call(c, "getId"));`),
          CK(MD, 'Licznik jest static', J`isTrue("nastepneId ma być static", Modifier.isStatic(fieldMods("Klient", "nastepneId")));`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Zamowienie</code> ma pole <code>private final int numer</code> i getter <code>getNumer()</code>. Dodaj <b>statyczny licznik</b> <code>nastepnyNumer</code> (start od <b>100</b>) i w konstruktorze nadawaj numery: 100, 101, 102…</p>',
        files: [FL('Zamowienie.java', 'public class Zamowienie {\n    private final int numer;\n\n    public Zamowienie() {\n    }\n\n    public int getNumer() {\n        return numer;\n    }\n}\n')],
        hints: ['<code>private static int nastepnyNumer = 100;</code>', 'W konstruktorze: <code>this.numer = nastepnyNumer++;</code>'],
        solution: [FL('Zamowienie.java', 'public class Zamowienie {\n    private static int nastepnyNumer = 100;\n    private final int numer;\n\n    public Zamowienie() {\n        this.numer = nastepnyNumer++;\n    }\n\n    public int getNumer() {\n        return numer;\n    }\n}\n')],
        checks: [
          CK(CR, 'Numery rosną o 1', J`Object a = make("Zamowienie"); Object b = make("Zamowienie"); int na = (Integer) call(a, "getNumer"); eq(na + 1, call(b, "getNumer")); isTrue("Numer ma być co najmniej 100", na >= 100);`),
          CK(MD, 'Licznik jest static', J`isTrue("nastepnyNumer ma być static", Modifier.isStatic(fieldMods("Zamowienie", "nastepnyNumer")));`),
        ],
      },
      quiz: [
        Q('Dlaczego licznik id jest <code>static</code>?', ['musi być wspólny dla wszystkich obiektów', 'żeby był prywatny', 'żeby był stały', 'bo tak wymaga konstruktor'], 0, 'Każdy obiekt ma tylko swoje id, ale licznik jest jeden.'),
        Q('Dlaczego pole <code>id</code> jest zwykłe (nie static)?', ['każdy obiekt ma własny numer', 'bo static nie działa z int', 'bo id jest tylko do odczytu', 'to błąd w kodzie'], 0, 'Id jest cechą konkretnego obiektu.'),
        OUTQ('Co wypisze program?', ['1 2 3', '1 1 1', '3 3 3', '0 1 2'], 0, 'Każdy nowy obiekt bierze bieżący numer i zwiększa licznik.', 'class Klient {\n    private static int nastepne = 1;\n    final int id;\n\n    public Klient() {\n        id = nastepne++;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Klient a = new Klient();\n        Klient b = new Klient();\n        Klient c = new Klient();\n        System.out.println(a.id + " " + b.id + " " + c.id);\n    }\n}\n'),
      ],
    },

    {
      id: 'stat-stale', title: 'Stałe: static final', blurb: 'jedna wspólna wartość, której nie zmienisz', minutes: 4,
      content: [
        ANA('🧱', 'Liczba dni w tygodniu to 7 i nigdy się nie zmieni. Taką wartość robimy <b>stałą</b>: <code>static final</code>. <code>static</code> = jedna wspólna dla całej klasy, <code>final</code> = po przypisaniu <b>nie da się zmienić</b>. Nazwę piszemy <b>WIELKIMI_LITERAMI</b>.'),
        VIZ('compare', { cols: [
          { icon: '🔁', title: 'static', c: 'accent', items: ['jedna wartość dla całej klasy', 'ale można ją zmieniać'] },
          { icon: '🔒', title: 'final', c: 'warn', items: ['po przypisaniu nie da się zmienić', 'zmiana = błąd kompilacji'] },
          { icon: '🪨', title: 'static final', c: 'ok', items: ['jedna wspólna i niezmienna', 'np. <code>MAX_PRZEDMIOTOW = 10</code>'] }] }),
        CODE(J`class Plecak {
    static final int MAX_PRZEDMIOTOW = 3;
    static final double PI = 3.14;
}

public class Main {
    public static void main(String[] args) {
        System.out.println(Plecak.MAX_PRZEDMIOTOW);
        System.out.println(Plecak.PI * 2);
    }
}
`, '3\n6.28'),
        NOTE('exam', 'Stałe używamy zamiast „magicznych liczb” rozsianych po kodzie. Zmieniasz wartość w jednym miejscu, a nazwa mówi, co ta liczba znaczy.'),
      ],
      guide: {
        files: [FL('Plecak.java', 'public class Plecak {\n}\n')],
        steps: [
          { say: '<p>Dodaj stałą: <code>static final</code>, typ <code>int</code>, nazwa WIELKIMI literami i wartość przypisana od razu.</p>', type: '    static final int MAX_PRZEDMIOTOW = 3;', expect: J`static\s+final\s+int\s+MAX_PRZEDMIOTOW\s*=\s*3\s*;` },
        ],
        solution: [FL('Plecak.java', 'public class Plecak {\n    static final int MAX_PRZEDMIOTOW = 3;\n}\n')],
        checks: [
          CK(CR, 'MAX_PRZEDMIOTOW = 3', J`eq(3, staticField("Plecak", "MAX_PRZEDMIOTOW"));`),
          CK(CR, 'Stała jest static final', J`int m = fieldMods("Plecak", "MAX_PRZEDMIOTOW"); isTrue("ma być static", Modifier.isStatic(m)); isTrue("ma być final", Modifier.isFinal(m));`),
        ],
      },
      exercise: {
        prompt: '<p>W klasie <code>Sklep</code> dodaj dwie stałe: <code>static final double VAT = 0.23;</code> oraz <code>static final int MAX_KOSZYK = 20;</code>. Dopisz metodę <code>static double brutto(double netto)</code>, która zwraca <code>netto * (1 + VAT)</code>.</p>',
        files: [FL('Sklep.java', 'public class Sklep {\n}\n')],
        hints: ['<code>static final double VAT = 0.23;</code>', '<code>static double brutto(double netto) { return netto * (1 + VAT); }</code>'],
        solution: [FL('Sklep.java', 'public class Sklep {\n    static final double VAT = 0.23;\n    static final int MAX_KOSZYK = 20;\n\n    static double brutto(double netto) {\n        return netto * (1 + VAT);\n    }\n}\n')],
        checks: [
          CK(CR, 'Stałe VAT i MAX_KOSZYK mają właściwe wartości', J`eq(0.23, staticField("Sklep", "VAT")); eq(20, staticField("Sklep", "MAX_KOSZYK"));`),
          CK(MD, 'Stałe są static final', J`int a = fieldMods("Sklep", "VAT"); int b = fieldMods("Sklep", "MAX_KOSZYK"); isTrue("VAT ma być static final", Modifier.isStatic(a) && Modifier.isFinal(a)); isTrue("MAX_KOSZYK ma być static final", Modifier.isStatic(b) && Modifier.isFinal(b));`),
          CK(CR, 'brutto(netto) liczy z VAT', J`double r = (Double) callStatic("Sklep", "brutto", 100.0); isTrue("Dla 100 oczekiwano 123.0, otrzymano " + r, Math.abs(r - 123.0) < 0.001);`),
        ],
      },
      quiz: [
        Q('Co oznacza <code>static final</code>?', ['wspólna dla klasy wartość, której nie można zmienić', 'zmienna lokalna', 'metoda prywatna', 'pole obiektu'], 0, 'static = jedna dla klasy, final = niezmienna.'),
        Q('Jak zgodnie z konwencją nazywamy stałe?', ['WIELKIMI_LITERAMI_Z_PODKRESLENIAMI', 'camelCase', 'małymi literami', 'PascalCase'], 0, 'Np. <code>MAX_ROZMIAR</code>.'),
        Q('Co zrobi kompilator przy próbie zmiany stałej <code>static final</code>?', ['zgłosi błąd kompilacji', 'zmieni wartość', 'zignoruje zmianę', 'zgłosi wyjątek w czasie działania'], 0, 'Pola final można przypisać tylko raz.'),
        OUTQ('Co wypisze program?', ['10', '5', '0', 'błąd'], 0, 'Stała jest odczytywana przez nazwę klasy.', 'class Limit {\n    static final int MAX = 10;\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(Limit.MAX);\n    }\n}\n'),
      ],
    },
  ],
  labs: [
    {
      id: 'lab2-z1', title: 'Zadanie 1: Pola i obwody (geometria)', source: 'Zadania 2.pdf – zadanie 1', concepts: ['stat-metody', 'stat-stale'],
      statement: J`<p>Zdefiniuj klasę <b>PolaiObwody</b> o następujących elementach:</p>
<p><b>Atrybuty</b> – publiczne, statyczne pola typu <code>double</code>:</p>
<ul><li><code>Pi</code> – wartość domyślna <code>3.14</code></li><li><code>PierwiastekZTrzech</code> – wartość domyślna <code>1.73</code></li></ul>
<p><b>Metody</b> – publiczne, statyczne:</p>
<ul>
<li><code>double poleKola(double promien)</code> – korzysta z pola <code>Pi</code> z tej klasy</li>
<li><code>double obwodKola(double promien)</code> – korzysta z pola <code>Pi</code></li>
<li><code>double poleProstokata(double a, double b)</code></li>
<li><code>double obwodProstokata(double a, double b)</code></li>
<li><code>double poleTrojkataRownobocznego(double a)</code> – (wzór: a² · √3 / 4; użyj pola <code>PierwiastekZTrzech</code>)</li>
<li><code>double obwodTrojkataRownobocznego(double a)</code></li>
</ul>
<p><b>W klasie Main</b> (testy): wyświetl wartość zmiennej <code>Pi</code> z klasy PolaiObwody oraz wyniki każdej z metod statycznych dla przykładowych długości promieni/boków.</p>`,
      notes: 'W treści PDF jest literówka „klasie Geometria” – chodzi o klasę <code>PolaiObwody</code>. Metody statyczne wywołujesz przez nazwę klasy: <code>PolaiObwody.poleKola(3)</code>.',
      files: [
        { name: 'PolaiObwody.java', code: J`public class PolaiObwody {

}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {

    }
}
` }],
      hints: ['Pola: <code>public static double Pi = 3.14;</code>', 'Pole trójkąta: <code>a * a * PierwiastekZTrzech / 4</code>', 'W Main nie twórz obiektu – <code>PolaiObwody.poleKola(2.0)</code>.'],
      solution: [
        { name: 'PolaiObwody.java', code: J`public class PolaiObwody {
    public static double Pi = 3.14;
    public static double PierwiastekZTrzech = 1.73;

    public static double poleKola(double promien) {
        return Pi * promien * promien;
    }

    public static double obwodKola(double promien) {
        return 2 * Pi * promien;
    }

    public static double poleProstokata(double a, double b) {
        return a * b;
    }

    public static double obwodProstokata(double a, double b) {
        return 2 * (a + b);
    }

    public static double poleTrojkataRownobocznego(double a) {
        return a * a * PierwiastekZTrzech / 4;
    }

    public static double obwodTrojkataRownobocznego(double a) {
        return 3 * a;
    }
}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {
        System.out.println("Pi = " + PolaiObwody.Pi);
        System.out.println("Pole koła: " + PolaiObwody.poleKola(3));
        System.out.println("Obwód koła: " + PolaiObwody.obwodKola(3));
        System.out.println("Pole prostokąta: " + PolaiObwody.poleProstokata(3, 4));
        System.out.println("Obwód prostokąta: " + PolaiObwody.obwodProstokata(3, 4));
        System.out.println("Pole trójkąta: " + PolaiObwody.poleTrojkataRownobocznego(4));
        System.out.println("Obwód trójkąta: " + PolaiObwody.obwodTrojkataRownobocznego(4));
    }
}
` }],
      checks: [
        CK(CR, 'Pola Pi = 3.14 i PierwiastekZTrzech = 1.73 (publiczne, statyczne, double)', J`for (String n : new String[]{"Pi", "PierwiastekZTrzech"}) {
    int m = fieldMods("PolaiObwody", n);
    isTrue("Pole " + n + " powinno być static", Modifier.isStatic(m));
    isTrue("Pole " + n + " powinno być public", Modifier.isPublic(m));
    eq(double.class, findF(cls("PolaiObwody"), n).getType());
}
eq(3.14, staticField("PolaiObwody", "Pi")); eq(1.73, staticField("PolaiObwody", "PierwiastekZTrzech"));`),
        CK(CR, 'poleKola(3) = 28.26, obwodKola(3) = 18.84', J`eq(28.26, PolaiObwody.poleKola(3)); eq(18.84, PolaiObwody.obwodKola(3));`),
        CK(CR, 'Prostokąt (3×4): pole 12, obwód 14', J`eq(12.0, PolaiObwody.poleProstokata(3, 4)); eq(14.0, PolaiObwody.obwodProstokata(3, 4));`),
        CK(CR, 'Trójkąt równoboczny a=4: pole 6.92, obwód 12', J`eq(6.92, PolaiObwody.poleTrojkataRownobocznego(4)); eq(12.0, PolaiObwody.obwodTrojkataRownobocznego(4));`),
        CK(MD, 'Wszystkie metody są publiczne i statyczne', J`for (String n : new String[]{"poleKola", "obwodKola", "poleProstokata", "obwodProstokata", "poleTrojkataRownobocznego", "obwodTrojkataRownobocznego"}) {
    int m = methodMods("PolaiObwody", n);
    isTrue("Metoda " + n + " powinna być static", Modifier.isStatic(m));
    isTrue("Metoda " + n + " powinna być public", Modifier.isPublic(m));
}`),
        CK(MD, 'Metody koła używają pola Pi (a nie wpisanej na sztywno liczby)', J`Field f = findF(cls("PolaiObwody"), "Pi");
f.setAccessible(true);
if (Modifier.isFinal(f.getModifiers())) return;
double old = f.getDouble(null);
try {
    f.setDouble(null, 3.0);
    eq(3.0, PolaiObwody.poleKola(1));
    eq(6.0, PolaiObwody.obwodKola(1));
} finally { f.setDouble(null, old); }`),
        CK(MD, 'Pole trójkąta używa pola PierwiastekZTrzech', J`Field f = findF(cls("PolaiObwody"), "PierwiastekZTrzech");
f.setAccessible(true);
if (Modifier.isFinal(f.getModifiers())) return;
double old = f.getDouble(null);
try {
    f.setDouble(null, 2.0);
    eq(2.0, PolaiObwody.poleTrojkataRownobocznego(2));
} finally { f.setDouble(null, old); }`),
        CK(MD, 'Main wyświetla Pi oraz wyniki metod', J`String o = runMain();
isTrue("Main powinien wypisać wartość Pi (3.14) – wydruk: " + o, o.contains("3.14"));
isTrue("Main powinien wypisać co najmniej 7 linii (Pi + 6 wyników)", lines(o).size() >= 7);`),
        CK(MN, 'Metody wywołane przez nazwę klasy, bez tworzenia obiektu', J`isTrue("Wywołuj metody statycznie: PolaiObwody.poleKola(...)", srcHas("Main", "PolaiObwody\\s*\\.\\s*poleKola"));
isFalse("Nie twórz obiektu new PolaiObwody() – metody są statyczne", srcHas("Main", "new\\s+PolaiObwody\\s*\\("));`),
      ],
    },

    {
      id: 'lab2-z2', title: 'Zadanie 2: Głosowanie na grę (e-sport)', source: 'Zadania 2.pdf – zadanie 2', concepts: ['stat-pola', 'start-scanner'],
      statement: J`<p>Na uczelni ma odbyć się turniej e-sportowy. Studenci w głosowaniu wybierają grę: <b>Fortnite</b> albo <b>Counter Strike</b>. Napisz konsolowy system do obsługi głosowań dla Pani z dziekanatu, do której ustawiają się studenci w kolejce. Student podaje imię, nazwisko, numer albumu i informację, na którą grę głosuje. Pani wpisuje kolejnych studentów jeden po drugim aż do momentu, gdy jako imię wpisze <code>KONIEC</code> – wtedy na ekranie wyświetla się podsumowanie wyników.</p>
<p><b>GlosZaGraCounterStrike</b> – prywatne statyczne pole <code>int ileGlosow</code>; publiczny konstruktor bezparametrowy zwiększający <code>ileGlosow</code> o 1; publiczna statyczna metoda <code>int ZwrocIloscGlosow()</code> zwracająca <code>ileGlosow</code>.</p>
<p><b>GlosZaGraFortnite</b> – analogicznie.</p>
<p><b>Student</b> – publiczne pola <code>imie</code>, <code>nazwisko</code>, <code>numerAlbumu</code> (String); prywatne pola <code>counterstrike</code> (GlosZaGraCounterStrike) i <code>fortnite</code> (GlosZaGraFortnite); konstruktor z trzema parametrami; publiczne metody <code>void ZaglosujZaGraFortnite()</code> (tworzy nową instancję GlosZaGraFortnite i przypisuje do pola <code>fortnite</code>) oraz <code>void ZaglosujZaCounterStrike()</code> (analogicznie).</p>
<p><b>Main</b> – pętla pobierająca z klawiatury imię, nazwisko, numer albumu i literę <code>C</code> lub <code>F</code>. Po wpisaniu imienia, nazwiska i numeru tworzony jest nowy student. Litera <code>C</code> = głos na Counter Strike, <code>F</code> = na Fortnite. Imię <code>KONIEC</code> kończy pętlę i wyświetla statystyki głosowania.</p>`,
      notes: 'Typ <code>uint</code> z PDF nie istnieje w Javie (to C#) – użyj <code>int</code>. W Javie dane wczytujesz klasą <code>Scanner</code>: <code>scanner.nextLine()</code>, pierwszy znak linii: <code>.charAt(0)</code>, porównanie tekstu: <code>imie.equals("KONIEC")</code>. Test uznaje obie wersje nazw metod (np. <code>ZwrocIloscGlosow</code> i <code>zwrocIloscGlosow</code>). Do testowania programu wpisz dane w polu „Dane wejściowe” pod edytorem.',
      stdin: 'Jan\nKowalski\n1001\nF\nAnna\nNowak\n1002\nC\nOla\nKot\n1003\nC\nKONIEC\n',
      prelude: J`static String pick(String cn, String... alts) {
    for (String a : alts) if (hasMethod(cn, a)) return a;
    throw new AssertionError("Klasa " + cn + " nie ma metody " + alts[0]);
}
static void resetVotes() throws Throwable {
    for (String c : new String[]{"GlosZaGraCounterStrike", "GlosZaGraFortnite"}) {
        Field f = findF(cls(c), "ileGlosow");
        if (f == null) throw new AssertionError("Klasa " + c + " nie ma pola ileGlosow");
        f.setAccessible(true); f.setInt(null, 0);
    }
}
static int votes(String c) throws Throwable {
    return (int) callStatic(c, pick(c, "ZwrocIloscGlosow", "zwrocIloscGlosow"));
}`,
      files: [
        { name: 'GlosZaGraCounterStrike.java', code: J`public class GlosZaGraCounterStrike {

}
` },
        { name: 'GlosZaGraFortnite.java', code: J`public class GlosZaGraFortnite {

}
` },
        { name: 'Student.java', code: J`public class Student {

}
` },
        { name: 'Main.java', code: J`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

    }
}
` }],
      hints: ['Licznik głosów jest <code>private static int ileGlosow</code>, a konstruktor robi tylko <code>ileGlosow++;</code>.', 'W Student: <code>public void ZaglosujZaGraFortnite() { this.fortnite = new GlosZaGraFortnite(); }</code>', 'Pętla: <code>while (true) { String imie = scanner.nextLine(); if (imie.equals("KONIEC")) break; ... }</code>'],
      solution: [
        { name: 'GlosZaGraCounterStrike.java', code: J`public class GlosZaGraCounterStrike {
    private static int ileGlosow = 0;

    public GlosZaGraCounterStrike() {
        ileGlosow++;
    }

    public static int ZwrocIloscGlosow() {
        return ileGlosow;
    }
}
` },
        { name: 'GlosZaGraFortnite.java', code: J`public class GlosZaGraFortnite {
    private static int ileGlosow = 0;

    public GlosZaGraFortnite() {
        ileGlosow++;
    }

    public static int ZwrocIloscGlosow() {
        return ileGlosow;
    }
}
` },
        { name: 'Student.java', code: J`public class Student {
    public String imie;
    public String nazwisko;
    public String numerAlbumu;
    private GlosZaGraCounterStrike counterstrike;
    private GlosZaGraFortnite fortnite;

    public Student(String imie, String nazwisko, String numerAlbumu) {
        this.imie = imie;
        this.nazwisko = nazwisko;
        this.numerAlbumu = numerAlbumu;
    }

    public void ZaglosujZaGraFortnite() {
        this.fortnite = new GlosZaGraFortnite();
    }

    public void ZaglosujZaCounterStrike() {
        this.counterstrike = new GlosZaGraCounterStrike();
    }
}
` },
        { name: 'Main.java', code: J`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        while (true) {
            System.out.print("Imię (KONIEC kończy): ");
            String imie = scanner.nextLine();
            if (imie.equals("KONIEC")) {
                break;
            }
            System.out.print("Nazwisko: ");
            String nazwisko = scanner.nextLine();
            System.out.print("Numer albumu: ");
            String album = scanner.nextLine();
            System.out.print("Głos (C lub F): ");
            char litera = scanner.nextLine().charAt(0);

            Student s = new Student(imie, nazwisko, album);
            if (litera == 'C') {
                s.ZaglosujZaCounterStrike();
            } else if (litera == 'F') {
                s.ZaglosujZaGraFortnite();
            }
        }
        System.out.println("Counter Strike: " + GlosZaGraCounterStrike.ZwrocIloscGlosow());
        System.out.println("Fortnite: " + GlosZaGraFortnite.ZwrocIloscGlosow());
    }
}
` }],
      checks: [
        CK(CR, 'Liczniki głosów są prywatne i statyczne (ileGlosow)', J`for (String c : new String[]{"GlosZaGraCounterStrike", "GlosZaGraFortnite"}) {
    isTrue("Klasa " + c + " nie ma pola ileGlosow", hasField(c, "ileGlosow"));
    int m = fieldMods(c, "ileGlosow");
    isTrue("ileGlosow w " + c + " powinno być static", Modifier.isStatic(m));
    isTrue("ileGlosow w " + c + " powinno być private", Modifier.isPrivate(m));
}`),
        CK(CR, 'Konstruktor bezparametrowy zwiększa licznik, a ZwrocIloscGlosow go zwraca', J`resetVotes();
eq(0, votes("GlosZaGraCounterStrike"));
make("GlosZaGraCounterStrike"); make("GlosZaGraCounterStrike");
eq(2, votes("GlosZaGraCounterStrike"));
make("GlosZaGraFortnite");
eq(1, votes("GlosZaGraFortnite"));
eq(2, votes("GlosZaGraCounterStrike"));`),
        CK(MD, 'ZwrocIloscGlosow jest publiczną metodą statyczną', J`for (String c : new String[]{"GlosZaGraCounterStrike", "GlosZaGraFortnite"}) {
    int m = methodMods(c, pick(c, "ZwrocIloscGlosow", "zwrocIloscGlosow"));
    isTrue("Metoda w " + c + " powinna być static", Modifier.isStatic(m));
    isTrue("Metoda w " + c + " powinna być public", Modifier.isPublic(m));
}`),
        CK(CR, 'Student: pola publiczne i konstruktor (imie, nazwisko, numerAlbumu)', J`Object s = make("Student", "Jan", "Kowalski", "1001");
eq("Jan", field(s, "imie")); eq("Kowalski", field(s, "nazwisko")); eq("1001", field(s, "numerAlbumu"));`),
        CK(MD, 'Student ma prywatne pola counterstrike i fortnite', J`isTrue("Brak pola counterstrike", hasField("Student", "counterstrike"));
isTrue("Brak pola fortnite", hasField("Student", "fortnite"));
isTrue("counterstrike powinno być private", Modifier.isPrivate(fieldMods("Student", "counterstrike")));
isTrue("fortnite powinno być private", Modifier.isPrivate(fieldMods("Student", "fortnite")));`),
        CK(CR, 'ZaglosujZaGraFortnite tworzy głos i przypisuje go do pola fortnite', J`resetVotes();
Object s = make("Student", "A", "B", "1");
call(s, pick("Student", "ZaglosujZaGraFortnite", "zaglosujZaGraFortnite", "ZaglosujZaFortnite", "zaglosujZaFortnite"));
eq(1, votes("GlosZaGraFortnite")); eq(0, votes("GlosZaGraCounterStrike"));
isTrue("Pole fortnite powinno wskazywać na utworzony głos", field(s, "fortnite") != null);`),
        CK(CR, 'ZaglosujZaCounterStrike tworzy głos i przypisuje go do pola counterstrike', J`resetVotes();
Object s = make("Student", "A", "B", "1");
call(s, pick("Student", "ZaglosujZaCounterStrike", "zaglosujZaCounterStrike", "ZaglosujZaGraCounterStrike", "zaglosujZaGraCounterStrike"));
eq(1, votes("GlosZaGraCounterStrike")); eq(0, votes("GlosZaGraFortnite"));
isTrue("Pole counterstrike powinno wskazywać na utworzony głos", field(s, "counterstrike") != null);`),
        CK(CR, 'Main: pętla zlicza głosy (2 × C, 1 × F) i kończy się na KONIEC', J`resetVotes();
runMain("Jan\nKowalski\n1001\nF\nAnna\nNowak\n1002\nC\nOla\nKot\n1003\nC\nKONIEC\n");
eq(2, votes("GlosZaGraCounterStrike")); eq(1, votes("GlosZaGraFortnite"));`),
        CK(MD, 'Main wyświetla statystyki po wpisaniu KONIEC', J`resetVotes();
String o = runMain("Jan\nKowalski\n1001\nF\nAnna\nNowak\n1002\nC\nOla\nKot\n1003\nC\nKONIEC\n");
List<String> l = lines(o);
String tail = String.join(" ", l.subList(Math.max(0, l.size() - 4), l.size()));
isTrue("Na końcu powinny być statystyki: 2 głosy na CS i 1 na Fortnite – ostatnie linie: " + tail, tail.contains("2") && tail.contains("1"));`),
        CK(MD, 'Student jest tworzony dla każdego wpisanego studenta, a imię „KONIEC” nie tworzy studenta', J`resetVotes();
runMain("KONIEC\n");
eq(0, votes("GlosZaGraCounterStrike")); eq(0, votes("GlosZaGraFortnite"));`),
        CK(MN, 'Porównanie tekstu przez equals, nie ==', J`isFalse("Napisy porównuj przez equals(\"KONIEC\"), nie ==", srcHas("Main", "==\\s*\"KONIEC\""));
isTrue("Użyj imie.equals(\"KONIEC\")", srcHas("Main", "equals\\s*\\(\\s*\"KONIEC\"\\s*\\)|\"KONIEC\"\\s*\\.equals"));`),
      ],
    },
  ],

  quiz: [
    Q('W metodach statycznych:', ['Możemy odwoływać się do pól niestatycznych', 'Możemy odwoływać się do pól statycznych', 'Możemy wywoływać metody statyczne', 'Możemy wywoływać metody niestatyczne'], [1, 2], 'Do składowych niestatycznych potrzebny jest obiekt.', 'stat-zasady'),
    Q('Co jest prawdą o polach statycznych?', ['Ich wartość jest niezależna od instancji klasy', 'Ich wartość jest taka sama dla każdej instancji klasy', 'Można się do nich odwołać: NazwaKlasy.nazwaPola', 'Można się do nich odwołać: nazwaObiektu.nazwaPola'], [0, 1, 2, 3], 'Wszystkie cztery są prawdziwe.', 'stat-pola'),
    Q('Co jest prawdą o polach statycznych?', ['Mogą być prywatne', 'Mogą być tylko publiczne', 'Mogą być tylko prywatne'], 0, 'Modyfikatory dostępu działają zwyczajnie.', 'stat-pola'),
    Q('Co wypisze program?', ['2 2', '1 2', '2 1', '0 2'], 0, 'Pole <code>n</code> jest statyczne – jedno dla klasy. Odwołanie przez obiekt i przez klasę daje ten sam wynik.', 'stat-pola', { code: J`class A {
    static int n = 0;
    A() { n++; }
}

public class Main {
    public static void main(String[] args) {
        A x = new A();
        A y = new A();
        System.out.println(x.n + " " + A.n);
    }
}` }),
    Q('Który kod wywoła metodę statyczną <code>double poleKola(double r)</code> z klasy <code>PolaiObwody</code>?', ['<code>PolaiObwody.poleKola(2.0)</code>', '<code>new PolaiObwody().poleKola(2.0)</code>', '<code>poleKola(2.0)</code> poza klasą PolaiObwody', '<code>PolaiObwody->poleKola(2.0)</code>'], [0, 1], 'Przez nazwę klasy (zalecane) albo przez obiekt (działa, ale mylące). Samo <code>poleKola()</code> działa tylko wewnątrz tej klasy.', 'stat-metody'),
    Q('Które deklaracje tworzą stałą?', ['<code>public static final double PI = 3.14;</code>', '<code>public static double PI = 3.14;</code>', '<code>final double PI = 3.14;</code> jako pole klasy', '<code>static void PI = 3.14;</code>'], [0, 2], '<code>final</code> zakazuje ponownego przypisania (z <code>static</code> stała jest jedna dla klasy).', 'stat-stale'),
  ],
});
