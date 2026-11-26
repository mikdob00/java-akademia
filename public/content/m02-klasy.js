'use strict';
ACAD.modules.push({
  id: 'klasy', num: 2, level: 1, icon: '📦', title: 'Klasy, obiekty i konstruktory',
  source: 'Wykład 1 / Prezentacja 1 · Laboratoria 1 (Zadania 1)',
  summary: 'Fundament programowania obiektowego: klasa jako szablon, obiekt jako jego instancja, pola, konstruktory, metody, toString, tablice obiektów, enum i modyfikatory dostępu.',
  goals: ['napisać klasę z polami i konstruktorem', 'wywołać jeden konstruktor z drugiego przez <code>this(...)</code>', 'nadpisać <code>toString()</code>', 'pracować na tablicy obiektów (<code>null</code>!)', 'użyć <code>enum</code> i dobrać modyfikator dostępu'],
  lessons: [

    /* ---------- 1. IDEA ---------- */
    {
      id: 'klasy-idea', micro: true, title: 'Po co klasy i obiekty?', blurb: 'foremka i ciastka, pola i metody', minutes: 4,
      content: [
        ANA('🍪', '<b>Klasa to foremka do ciastek</b>, a <b>obiekty to ciastka</b>. Foremka opisuje tylko kształt: jakie ciastko ma cechy i co potrafi. Z jednej foremki zrobisz setki ciastek, a każde może mieć inną polewę.'),
        VIZ('compare', { cols: [
          { icon: '📐', title: 'Klasa Pies', c: 'accent', sub: 'opis, projekt – sama niczego nie robi', items: ['cechy: <code>imie</code>, <code>wiek</code>', 'umiejętność: <code>szczekaj()</code>'] },
          { icon: '🐕', title: 'Obiekt „Reks”', c: 'ok', sub: 'prawdziwy egzemplarz', items: ['imie = „Reks”', 'wiek = 3'] },
          { icon: '🐩', title: 'Obiekt „Fifi”', c: 'ok', sub: 'drugi egzemplarz tej samej klasy', items: ['imie = „Fifi”', 'wiek = 5'] }] }),
        TERMS([['klasa', 'opis: jakie cechy i umiejętności mają obiekty (foremka)'], ['obiekt', 'konkretny „egzemplarz” zrobiony według klasy (ciastko)'], ['pole', 'cecha obiektu, czyli zmienna w środku obiektu (np. <code>imie</code>)'], ['metoda', 'umiejętność obiektu, czyli to, co potrafi zrobić (np. <code>szczekaj()</code>)']]),
        NOTE('info', 'W kolejnych lekcjach zbudujemy to krok po kroku: najpierw pola, potem tworzenie obiektów, konstruktor, metody. W Twoim projekcie każda klasa będzie w osobnym pliku.'),
      ],
      quiz: [
        Q('Czym jest klasa?', ['opisem (projektem), według którego powstają obiekty', 'konkretnym obiektem w pamięci', 'nazwą zmiennej', 'metodą main'], 0, 'Klasa to foremka, a obiekty to ciastka.'),
        Q('Ile obiektów można stworzyć z jednej klasy?', ['dowolnie wiele', 'tylko jeden', 'dokładnie dwa', 'tyle, ile jest pól'], 0, 'Z jednej foremki wiele ciastek.'),
        Q('Czym jest pole?', ['cechą obiektu, zmienną zapisaną wewnątrz obiektu', 'umiejętnością obiektu', 'nazwą klasy', 'nazwą pliku'], 0, 'Pole przechowuje dane obiektu, np. imię psa.'),
        Q('Czym jest metoda obiektu?', ['umiejętnością, czyli czymś, co obiekt potrafi zrobić', 'cechą obiektu', 'plikiem z kodem', 'komentarzem'], 0, 'Np. pies potrafi <code>szczekaj()</code>.'),
      ],
    },

    /* ---------- 2. POLA ---------- */
    {
      id: 'klasy-pola', title: 'Pola klasy', blurb: 'cechy obiektu: typ i nazwa', minutes: 4,
      content: [
        ANA('🪪', 'Pola to <b>rubryki na karcie psa</b>: „imię”, „wiek”. Każda rubryka ma <b>typ</b> (co wolno wpisać) i <b>nazwę</b>. Sama klasa to czysta karta, a dopiero obiekt ma w rubrykach konkretne wartości.'),
        VIZ('cells', { title: 'Klasa Pies ma dwa pola', rows: [{ cells: ['String', 'imie', ';'], top: ['typ', 'nazwa pola', 'koniec'], hl: [1] }, { cells: ['int', 'wiek', ';'], top: ['typ', 'nazwa pola', 'koniec'], hl: [1] }] }),
        PP('Pola zapisujemy <b>wewnątrz klamer klasy, ale poza metodami</b>, tak jak zmienne: typ, nazwa, średnik.'),
        CODE(J`class Pies {
    String imie;
    int wiek;
}

public class Main {
    public static void main(String[] args) {
        Pies p = new Pies();
        System.out.println(p.imie + " " + p.wiek);
    }
}
`, 'null 0'),
        NOTE('info', 'Pole, któremu nie nadano wartości, ma wartość domyślną: <code>0</code> dla liczb, <code>false</code> dla boolean i <code>null</code> („nic”) dla tekstu i obiektów.'),
      ],
      guide: {
        files: [FL('Pies.java', 'public class Pies {\n}\n')],
        steps: [
          { say: '<p>Wewnątrz klamer klasy dodaj pierwsze pole: typ <code>String</code> (tekst), nazwa <code>imie</code>, średnik.</p>', type: '    String imie;', expect: J`String\s+imie\s*;` },
          { say: '<p>Drugie pole: liczba całkowita <code>wiek</code>.</p>', type: '    int wiek;', expect: J`int\s+wiek\s*;` },
        ],
        solution: [FL('Pies.java', 'public class Pies {\n    String imie;\n    int wiek;\n}\n')],
        checks: [
          CK(CR, 'Klasa Pies ma pole imie typu String', J`isTrue("Dodaj pole String imie;", hasField("Pies", "imie")); isTrue("imie ma być typu String", cls("Pies").getDeclaredField("imie").getType() == String.class);`),
          CK(CR, 'Klasa Pies ma pole wiek typu int', J`isTrue("Dodaj pole int wiek;", hasField("Pies", "wiek")); isTrue("wiek ma być typu int", cls("Pies").getDeclaredField("wiek").getType() == int.class);`),
        ],
      },
      exercise: {
        prompt: '<p>W klasie <code>Ksiazka</code> dodaj trzy pola: <code>tytul</code> (String), <code>liczbaStron</code> (int) oraz <code>cena</code> (double).</p>',
        files: [FL('Ksiazka.java', 'public class Ksiazka {\n}\n')],
        hints: ['<code>String tytul;</code>', '<code>int liczbaStron;</code> i <code>double cena;</code> – każde w osobnej linijce, ze średnikiem.'],
        solution: [FL('Ksiazka.java', 'public class Ksiazka {\n    String tytul;\n    int liczbaStron;\n    double cena;\n}\n')],
        checks: [
          CK(CR, 'Pole tytul typu String', J`isTrue("Brak pola String tytul", hasField("Ksiazka", "tytul") && cls("Ksiazka").getDeclaredField("tytul").getType() == String.class);`),
          CK(CR, 'Pole liczbaStron typu int', J`isTrue("Brak pola int liczbaStron", hasField("Ksiazka", "liczbaStron") && cls("Ksiazka").getDeclaredField("liczbaStron").getType() == int.class);`),
          CK(CR, 'Pole cena typu double', J`isTrue("Brak pola double cena", hasField("Ksiazka", "cena") && cls("Ksiazka").getDeclaredField("cena").getType() == double.class);`),
        ],
      },
      quiz: [
        Q('Gdzie w klasie zapisujemy pola?', ['wewnątrz klasy, poza metodami', 'wewnątrz metody main', 'poza klasą', 'w komentarzu'], 0, 'Pola należą do klasy, a nie do konkretnej metody.'),
        Q('Jaką wartość ma pole <code>int wiek;</code>, któremu niczego nie przypisano?', ['0', 'null', 'pusty napis', '-1'], 0, 'Domyślnie liczby mają 0, a obiekty i tekst <code>null</code>.'),
        Q('Jaką wartość ma pole <code>String imie;</code>, któremu niczego nie przypisano?', ['null', '0', 'pusty napis', 'false'], 0, 'Dla tekstu i obiektów domyślnie jest <code>null</code>.'),
        OUTQ('Co wypisze program?', ['null 0', '0 null', 'Pies 0', 'błąd'], 0, 'Pola mają wartości domyślne: <code>null</code> i <code>0</code>.', 'class Pies {\n    String imie;\n    int wiek;\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Pies p = new Pies();\n        System.out.println(p.imie + " " + p.wiek);\n    }\n}\n'),
      ],
    },

    /* ---------- 3. NEW + KROPKA ---------- */
    {
      id: 'klasy-klasa', title: 'Tworzenie obiektu: new i kropka', blurb: 'new Pies(), p.imie', minutes: 5,
      content: [
        ANA('🍪', '<code>new Pies()</code> to <b>wypieczenie ciastka z foremki</b>: powstaje nowy, konkretny obiekt. Zmienna <code>p</code> to etykieta ze <b>strzałką</b> do tego obiektu. Kropka (<code>p.imie</code>) znaczy „zajrzyj do środka obiektu p i weź pole imie”.'),
        VIZ('objects', { vars: [{ t: 'Pies', n: 'p', to: 'o1' }], objs: [{ id: 'o1', c: 'Pies', f: [['imie', '"Reks"'], ['wiek', '3']] }], cap: 'Po lewej etykieta (zmienna), po prawej prawdziwy obiekt w pamięci z własnymi polami.' }),
        TERMS([['<code>new Pies()</code>', 'tworzy nowy obiekt klasy Pies'], ['<code>Pies p</code>', 'zmienna <code>p</code>, która może wskazywać na obiekt typu Pies'], ['<code>p.imie</code>', 'pole <code>imie</code> w obiekcie, na który wskazuje <code>p</code>']]),
        CODE(J`class Pies {
    String imie;
    int wiek;
}

public class Main {
    public static void main(String[] args) {
        Pies p = new Pies();
        p.imie = "Reks";
        p.wiek = 3;
        System.out.println(p.imie + " " + p.wiek);
    }
}
`, 'Reks 3'),
      ],
      guide: {
        files: [FL('Pies.java', 'public class Pies {\n    String imie;\n    int wiek;\n}\n'), FL('Main.java', MAINW([]))],
        steps: [
          { say: '<p>W <code>main</code> stwórz obiekt: typ <code>Pies</code>, nazwa zmiennej <code>p</code>, a po <code>=</code> słowo <code>new</code> i <code>Pies()</code> – „zrób nowego psa”.</p>', type: 'Pies p = new Pies();', expect: J`Pies\s+p\s*=\s*new\s+Pies\s*\(\s*\)\s*;` },
          { say: '<p>Wpisz imię do pola obiektu: nazwa zmiennej, kropka, nazwa pola.</p>', type: 'p.imie = "Reks";', expect: J`\bp\.imie\s*=\s*"Reks"\s*;` },
          { say: '<p>To samo dla wieku.</p>', type: 'p.wiek = 3;', expect: J`\bp\.wiek\s*=\s*3\s*;` },
          { say: '<p>Wypisz oba pola, sklejając je plusem. Spacja w cudzysłowie oddziela imię od wieku.</p>', type: 'System.out.println(p.imie + " " + p.wiek);', expect: J`println\s*\(\s*p\.imie\s*\+\s*" "\s*\+\s*p\.wiek\s*\)` },
        ],
        solution: [FL('Pies.java', 'public class Pies {\n    String imie;\n    int wiek;\n}\n'), FL('Main.java', MAINW(['Pies p = new Pies();', 'p.imie = "Reks";', 'p.wiek = 3;', 'System.out.println(p.imie + " " + p.wiek);']))],
        checks: [
          CK(CR, 'Program wypisuje „Reks 3”', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Reks 3] – program wypisał: " + o, o.equals(Arrays.asList("Reks 3")));`),
          CK(MD, 'Użyto new Pies()', J`isTrue("Utwórz obiekt przez new Pies()", srcHas("Main", "new\\s+Pies\\s*\\(\\s*\\)"));`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Ksiazka</code> ma pola <code>tytul</code> i <code>liczbaStron</code>. W <code>main</code> stwórz obiekt <code>k</code>, wpisz tytuł <code>Wiedzmin</code> i <code>320</code> stron, a potem wypisz oba pola w jednej linii:</p><pre>Wiedzmin 320</pre>',
        files: [FL('Ksiazka.java', 'public class Ksiazka {\n    String tytul;\n    int liczbaStron;\n}\n'), FL('Main.java', MAINW([]))],
        hints: ['<code>Ksiazka k = new Ksiazka();</code>', '<code>k.tytul = "Wiedzmin";</code> i <code>k.liczbaStron = 320;</code>', '<code>System.out.println(k.tytul + " " + k.liczbaStron);</code>'],
        solution: [FL('Ksiazka.java', 'public class Ksiazka {\n    String tytul;\n    int liczbaStron;\n}\n'), FL('Main.java', MAINW(['Ksiazka k = new Ksiazka();', 'k.tytul = "Wiedzmin";', 'k.liczbaStron = 320;', 'System.out.println(k.tytul + " " + k.liczbaStron);']))],
        checks: [
          CK(CR, 'Wynik: Wiedzmin 320', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Wiedzmin 320] – program wypisał: " + o, o.equals(Arrays.asList("Wiedzmin 320")));`),
          CK(MD, 'Obiekt tworzony przez new Ksiazka()', J`isTrue("Utwórz obiekt przez new Ksiazka()", srcHas("Main", "new\\s+Ksiazka\\s*\\(\\s*\\)"));`),
        ],
      },
      quiz: [
        Q('Co robi słowo <code>new</code> w <code>new Pies()</code>?', ['tworzy nowy obiekt klasy Pies', 'usuwa obiekt', 'tworzy nową klasę', 'wypisuje tekst'], 0, '<code>new</code> uruchamia tworzenie obiektu.'),
        Q('Co oznacza <code>p.imie</code>?', ['pole <code>imie</code> obiektu, na który wskazuje p', 'metodę imie klasy Pies', 'nową zmienną', 'błąd składni'], 0, 'Kropka = „wejdź do środka obiektu”.'),
        Q('Czym różni się klasa <code>Pies</code> od obiektu <code>p</code>?', ['klasa to opis (foremka), obiekt to konkretny egzemplarz', 'nie ma różnicy', 'klasa to egzemplarz, obiekt to opis', 'obiekt to inna nazwa pliku'], 0, 'Klasa = foremka, obiekt = ciastko.'),
        OUTQ('Co wypisze program?', ['Reks 3', 'null 0', 'Pies 3', 'błąd'], 0, 'Pola obiektu <code>p</code> dostały wartości przed wypisaniem.', 'class Pies {\n    String imie;\n    int wiek;\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Pies p = new Pies();\n        p.imie = "Reks";\n        p.wiek = 3;\n        System.out.println(p.imie + " " + p.wiek);\n    }\n}\n'),
      ],
    },

    /* ---------- 4. WIELE OBIEKTÓW ---------- */
    {
      id: 'klasy-wiele', title: 'Kilka obiektów z jednej klasy', blurb: 'każdy obiekt ma własne pola', minutes: 4,
      content: [
        ANA('🍪🍪', 'Z jednej foremki robisz dwa ciastka. Polewę jednego ciastka możesz zmienić, a <b>drugie się nie zmieni</b>, bo to osobne ciastka. Tak samo każdy obiekt ma <b>własny komplet pól</b>.'),
        VIZ('objects', { vars: [{ t: 'Pies', n: 'a', to: 'o1' }, { t: 'Pies', n: 'b', to: 'o2' }], objs: [{ id: 'o1', c: 'Pies', f: [['imie', '"Reks"'], ['wiek', '3']] }, { id: 'o2', c: 'Pies', f: [['imie', '"Fifi"'], ['wiek', '5']] }], cap: 'Dwie etykiety, dwa osobne obiekty. Zmiana <code>b.wiek</code> nie dotyka obiektu <code>a</code>.' }),
        CODE(J`class Pies {
    String imie;
    int wiek;
}

public class Main {
    public static void main(String[] args) {
        Pies a = new Pies();
        a.imie = "Reks";
        a.wiek = 3;
        Pies b = new Pies();
        b.imie = "Fifi";
        b.wiek = 5;
        b.wiek = 6;
        System.out.println(a.imie + " " + a.wiek);
        System.out.println(b.imie + " " + b.wiek);
    }
}
`, 'Reks 3\nFifi 6'),
      ],
      guide: {
        files: [FL('Pies.java', 'public class Pies {\n    String imie;\n    int wiek;\n}\n'), FL('Main.java', MAINW(['Pies a = new Pies();', 'a.imie = "Reks";', 'a.wiek = 3;']))],
        steps: [
          { say: '<p>Pierwszy pies <code>a</code> już jest. Stwórz <b>drugi, osobny</b> obiekt o nazwie <code>b</code>.</p>', type: 'Pies b = new Pies();', expect: J`Pies\s+b\s*=\s*new\s+Pies\s*\(\s*\)\s*;` },
          { say: '<p>Ustaw jego pola: imię <code>Fifi</code> i wiek 5.</p>', type: 'b.imie = "Fifi";\nb.wiek = 5;', expect: J`b\.imie\s*=\s*"Fifi"\s*;\s*b\.wiek\s*=\s*5\s*;` },
          { say: '<p>Zmień wiek tylko psa <code>b</code> (urodziny!). Pies <code>a</code> ma się nie zmienić.</p>', type: 'b.wiek = 6;', expect: J`b\.wiek\s*=\s*6\s*;` },
          { say: '<p>Wypisz oba psy, każdego w osobnej linii.</p>', type: 'System.out.println(a.imie + " " + a.wiek);\nSystem.out.println(b.imie + " " + b.wiek);', expect: J`println\s*\(\s*a\.imie\s*\+\s*" "\s*\+\s*a\.wiek\s*\)\s*;\s*System\.out\.println\s*\(\s*b\.imie\s*\+\s*" "\s*\+\s*b\.wiek\s*\)` },
        ],
        solution: [FL('Pies.java', 'public class Pies {\n    String imie;\n    int wiek;\n}\n'), FL('Main.java', MAINW(['Pies a = new Pies();', 'a.imie = "Reks";', 'a.wiek = 3;', 'Pies b = new Pies();', 'b.imie = "Fifi";', 'b.wiek = 5;', 'b.wiek = 6;', 'System.out.println(a.imie + " " + a.wiek);', 'System.out.println(b.imie + " " + b.wiek);']))],
        checks: [
          CK(CR, 'Wynik: Reks 3 i Fifi 6', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Reks 3, Fifi 6] – program wypisał: " + o, o.equals(Arrays.asList("Reks 3", "Fifi 6")));`),
          CK(MN, 'Dwa osobne obiekty (dwa razy new)', J`isTrue("Utwórz dwa obiekty przez new Pies()", srcCount(src("Main"), "new\\s+Pies\\s*\\(") >= 2);`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Ksiazka</code> ma pola <code>tytul</code> i <code>cena</code> (double). Stwórz <b>dwie książki</b>: <code>k1</code> (<code>"Wiedzmin"</code>, 40.0) i <code>k2</code> (<code>"Dune"</code>, 55.5). Wypisz je w dwóch liniach w formacie <code>tytul: cena</code>.</p><pre>Wiedzmin: 40.0\nDune: 55.5</pre>',
        files: [FL('Ksiazka.java', 'public class Ksiazka {\n    String tytul;\n    double cena;\n}\n'), FL('Main.java', MAINW([]))],
        hints: ['Dwa razy <code>new Ksiazka()</code>, do dwóch różnych zmiennych.', '<code>System.out.println(k1.tytul + ": " + k1.cena);</code>'],
        solution: [FL('Ksiazka.java', 'public class Ksiazka {\n    String tytul;\n    double cena;\n}\n'), FL('Main.java', MAINW(['Ksiazka k1 = new Ksiazka();', 'k1.tytul = "Wiedzmin";', 'k1.cena = 40.0;', 'Ksiazka k2 = new Ksiazka();', 'k2.tytul = "Dune";', 'k2.cena = 55.5;', 'System.out.println(k1.tytul + ": " + k1.cena);', 'System.out.println(k2.tytul + ": " + k2.cena);']))],
        checks: [
          CK(CR, 'Wynik: dwie linie z tytułem i ceną', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Wiedzmin: 40.0, Dune: 55.5] – program wypisał: " + o, o.equals(Arrays.asList("Wiedzmin: 40.0", "Dune: 55.5")));`),
          CK(MN, 'Dwa osobne obiekty', J`isTrue("Utwórz dwa obiekty przez new Ksiazka()", srcCount(src("Main"), "new\\s+Ksiazka\\s*\\(") >= 2);`),
        ],
      },
      quiz: [
        Q('Czy zmiana pola jednego obiektu zmienia to samo pole w innym obiekcie tej samej klasy?', ['nie, każdy obiekt ma własne pola', 'tak, zawsze', 'tak, ale tylko dla liczb', 'tylko gdy mają tę samą nazwę zmiennej'], 0, 'Obiekty są od siebie niezależne.'),
        OUTQ('Co wypisze program?', ['3', '5', '8', '0'], 0, 'Zmiana <code>b.wiek</code> nie dotyczy obiektu <code>a</code>.', 'class Pies {\n    int wiek;\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Pies a = new Pies();\n        a.wiek = 3;\n        Pies b = new Pies();\n        b.wiek = 5;\n        System.out.println(a.wiek);\n    }\n}\n'),
        Q('Ile obiektów powstaje po dwóch wywołaniach <code>new Pies()</code>?', ['2', '1', '0', 'zależy od pól'], 0, 'Każde <code>new</code> tworzy nowy obiekt.'),
      ],
    },

    /* ---------- 5. KONSTRUKTOR ---------- */
    {
      id: 'klasy-konstruktor', title: 'Konstruktor', blurb: 'specjalna metoda ustawiająca pola przy tworzeniu', minutes: 6,
      content: [
        ANA('🧾', 'Zamiast najpierw robić pustego psa i potem wpisywać mu dane linijka po linijce, wypełniasz <b>formularz od razu przy urodzeniu</b>: „imię: Reks, wiek: 3”. Taki formularz to <b>konstruktor</b>. Wywołujesz go słowem <code>new</code>.'),
        VIZ('flow', { title: 'new Pies("Reks", 3)', steps: [{ t: 'new', s: 'zaczynamy tworzenie', c: 'accent' }, { t: 'konstruktor Pies(...)', s: 'dostaje "Reks" i 3', c: 'warn' }, { t: 'ustawia pola', s: 'imie = "Reks", wiek = 3', c: 'ok' }, { t: 'gotowy obiekt', s: 'zmienna dostaje strzałkę' }] }),
        TERMS([['konstruktor', 'specjalna metoda wywoływana przy <code>new</code>, która ustawia początkowe wartości pól'], ['nazwa', '<b>identyczna jak nazwa klasy</b> (wielka litera!)'], ['typ zwracany', '<b>brak</b>: nie piszemy ani <code>void</code>, ani <code>int</code>'], ['parametry', 'dane potrzebne do utworzenia obiektu (np. imię i wiek)']]),
        CODE(J`class Pies {
    String imie;
    int wiek;

    public Pies(String i, int w) {
        imie = i;
        wiek = w;
    }
}

public class Main {
    public static void main(String[] args) {
        Pies p = new Pies("Reks", 3);
        System.out.println(p.imie + " " + p.wiek);
    }
}
`, 'Reks 3'),
        NOTE('warn', 'Najczęstszy błąd: wpisanie <code>void</code> przed nazwą. Wtedy Java traktuje to jako <b>zwykłą metodę</b>, a nie konstruktor, i <code>new Pies("Reks", 3)</code> przestaje działać.'),
      ],
      guide: {
        files: [FL('Pies.java', 'public class Pies {\n    String imie;\n    int wiek;\n}\n')],
        steps: [
          { say: '<p>Dopisz konstruktor <b>pod polami</b>. Nazwa jest taka sama jak klasy (<code>Pies</code>), przed nazwą <b>nie ma</b> typu zwracanego, a w nawiasach są parametry: tekst <code>i</code> i liczba <code>w</code>.</p>', type: '    public Pies(String i, int w) {', expect: J`public\s+Pies\s*\(\s*String\s+\w+\s*,\s*int\s+\w+\s*\)\s*\{` },
          { say: '<p>W środku przepisz parametr do pola <code>imie</code>.</p>', type: '        imie = i;', expect: J`\bimie\s*=\s*i\s*;` },
          { say: '<p>To samo dla wieku, a potem zamknij konstruktor klamrą.</p>', type: '        wiek = w;\n    }', expect: J`\bwiek\s*=\s*w\s*;\s*\}` },
        ],
        solution: [FL('Pies.java', 'public class Pies {\n    String imie;\n    int wiek;\n\n    public Pies(String i, int w) {\n        imie = i;\n        wiek = w;\n    }\n}\n')],
        checks: [
          CK(CR, 'Istnieje konstruktor Pies(String, int)', J`ctor("Pies", String.class, int.class);`),
          CK(CR, 'Konstruktor ustawia pola', J`Object o = make("Pies", "Reks", 3); eq("Reks", field(o, "imie")); eq(3, field(o, "wiek")); Object p = make("Pies", "Fifi", 7); eq("Fifi", field(p, "imie")); eq(7, field(p, "wiek"));`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Ksiazka</code> ma pola <code>tytul</code> (String) i <code>liczbaStron</code> (int). Napisz <b>konstruktor</b> <code>Ksiazka(String t, int s)</code>, który wpisuje parametry do pól.</p>',
        files: [FL('Ksiazka.java', 'public class Ksiazka {\n    String tytul;\n    int liczbaStron;\n}\n')],
        hints: ['Konstruktor ma nazwę klasy i nie ma typu zwracanego: <code>public Ksiazka(String t, int s)</code>', 'W środku: <code>tytul = t;</code> i <code>liczbaStron = s;</code>'],
        solution: [FL('Ksiazka.java', 'public class Ksiazka {\n    String tytul;\n    int liczbaStron;\n\n    public Ksiazka(String t, int s) {\n        tytul = t;\n        liczbaStron = s;\n    }\n}\n')],
        checks: [
          CK(CR, 'Istnieje konstruktor Ksiazka(String, int)', J`ctor("Ksiazka", String.class, int.class);`),
          CK(CR, 'Konstruktor ustawia pola', J`Object o = make("Ksiazka", "Dune", 500); eq("Dune", field(o, "tytul")); eq(500, field(o, "liczbaStron"));`),
        ],
      },
      quiz: [
        Q('Co jest prawdą o konstruktorze?', ['ma nazwę taką samą jak klasa', 'ma typ zwracany void', 'musi nazywać się main', 'nie może mieć parametrów'], 0, 'Konstruktor ma nazwę klasy i nie ma typu zwracanego.'),
        Q('Kiedy wykonuje się konstruktor?', ['w momencie tworzenia obiektu przez new', 'przy każdym wypisaniu obiektu', 'tylko gdy go wywołamy jak zwykłą metodę', 'przy zamykaniu programu'], 0, '<code>new Pies(...)</code> uruchamia konstruktor.'),
        Q('Jaki typ zwracany ma konstruktor?', ['żadnego (nie piszemy go)', 'void', 'int', 'String'], 0, 'Dopisanie <code>void</code> zamienia konstruktor w zwykłą metodę.'),
        OUTQ('Co wypisze program?', ['Ala 5', 'null 0', '5 Ala', 'błąd'], 0, 'Konstruktor wpisał parametry do pól.', 'class Dziecko {\n    String imie;\n    int wiek;\n\n    public Dziecko(String i, int w) {\n        imie = i;\n        wiek = w;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Dziecko d = new Dziecko("Ala", 5);\n        System.out.println(d.imie + " " + d.wiek);\n    }\n}\n'),
      ],
    },

    /* ---------- 6. THIS ---------- */
    {
      id: 'klasy-this', title: 'Słowo this', blurb: 'this.imie = imie – kiedy nazwy się powtarzają', minutes: 5,
      content: [
        ANA('🧍', 'W klasie jest dwóch Jaśków: <b>pole</b> „imie” (należy do obiektu) i <b>parametr</b> „imie” (przyszedł z zewnątrz). Gdy ktoś woła „imie!”, Java zawsze wybiera tego bliższego, czyli parametr. Słowo <code>this</code> znaczy „<b>ten obiekt, w którym jestem</b>”, więc <code>this.imie</code> to na pewno pole.'),
        VIZ('compare', { cols: [
          { icon: '🙅', title: 'imie = imie;', c: 'bad', sub: 'parametr przypisany sam sobie', items: ['pole <b>zostaje puste</b>', 'kompilator nie zgłosi błędu!'] },
          { icon: '✅', title: 'this.imie = imie;', c: 'ok', sub: 'pole = parametr', items: ['po lewej pole obiektu', 'po prawej parametr konstruktora'] }] }),
        CODE(J`class Pies {
    String imie;
    int wiek;

    public Pies(String imie, int wiek) {
        this.imie = imie;
        this.wiek = wiek;
    }
}

public class Main {
    public static void main(String[] args) {
        Pies p = new Pies("Reks", 3);
        System.out.println(p.imie + " " + p.wiek);
    }
}
`, 'Reks 3'),
        NOTE('exam', 'Typowy błąd na kolokwium: napisanie w konstruktorze <code>imie = imie;</code>. Kod się kompiluje, ale pole zostaje <code>null</code>.'),
      ],
      guide: {
        files: [FL('Pies.java', 'public class Pies {\n    String imie;\n    int wiek;\n\n    public Pies(String imie, int wiek) {\n        imie = imie;\n        wiek = wiek;\n    }\n}\n')],
        steps: [
          { say: '<p>Ten konstruktor ma błąd: <code>imie = imie;</code> przypisuje parametr sam sobie, a pole zostaje puste. Zamień tę linijkę tak, żeby po lewej stało pole obiektu: <code>this.imie</code>.</p>', type: 'this.imie = imie;', expect: J`this\.imie\s*=\s*imie\s*;` },
          { say: '<p>To samo popraw dla wieku.</p>', type: 'this.wiek = wiek;', expect: J`this\.wiek\s*=\s*wiek\s*;` },
        ],
        solution: [FL('Pies.java', 'public class Pies {\n    String imie;\n    int wiek;\n\n    public Pies(String imie, int wiek) {\n        this.imie = imie;\n        this.wiek = wiek;\n    }\n}\n')],
        checks: [
          CK(CR, 'Konstruktor poprawnie ustawia pola', J`Object o = make("Pies", "Reks", 3); eq("Reks", field(o, "imie")); eq(3, field(o, "wiek"));`),
          CK(MN, 'Użyto this.', J`isTrue("Użyj this.imie i this.wiek", srcHas("Pies", "this\\.imie") && srcHas("Pies", "this\\.wiek"));`),
        ],
      },
      exercise: {
        prompt: '<p>W klasie <code>Ksiazka</code> napisz konstruktor <code>Ksiazka(String tytul, int liczbaStron)</code>, w którym <b>parametry nazywają się tak samo jak pola</b>. Użyj <code>this</code>.</p>',
        files: [FL('Ksiazka.java', 'public class Ksiazka {\n    String tytul;\n    int liczbaStron;\n}\n')],
        hints: ['<code>public Ksiazka(String tytul, int liczbaStron) { ... }</code>', '<code>this.tytul = tytul;</code> i <code>this.liczbaStron = liczbaStron;</code>'],
        solution: [FL('Ksiazka.java', 'public class Ksiazka {\n    String tytul;\n    int liczbaStron;\n\n    public Ksiazka(String tytul, int liczbaStron) {\n        this.tytul = tytul;\n        this.liczbaStron = liczbaStron;\n    }\n}\n')],
        checks: [
          CK(CR, 'Konstruktor ustawia oba pola', J`Object o = make("Ksiazka", "Dune", 500); eq("Dune", field(o, "tytul")); eq(500, field(o, "liczbaStron"));`),
          CK(MD, 'Użyto this. przy polach', J`isTrue("Użyj this.tytul i this.liczbaStron", srcHas("Ksiazka", "this\\.tytul\\s*=\\s*tytul") && srcHas("Ksiazka", "this\\.liczbaStron\\s*=\\s*liczbaStron"));`),
        ],
      },
      quiz: [
        Q('Co oznacza <code>this</code>?', ['bieżący obiekt, w którym wykonuje się kod', 'klasę nadrzędną', 'ostatnio utworzony obiekt', 'zmienną statyczną'], 0, '<code>this</code> to „ten obiekt”.'),
        Q('Co zrobi konstruktor <code>Pies(String imie) { imie = imie; }</code>?', ['pole imie pozostanie null', 'poprawnie ustawi pole imie', 'nie skompiluje się', 'wyrzuci wyjątek'], 0, 'Parametr przypisany sam sobie, a pole bez zmian.'),
        Q('Po co pisać <code>this.imie = imie;</code>?', ['żeby odróżnić pole obiektu od parametru o tej samej nazwie', 'żeby przyspieszyć program', 'żeby ukryć pole', 'to wymóg kompilatora w każdym konstruktorze'], 0, 'Po lewej pole, po prawej parametr.'),
        OUTQ('Co wypisze program?', ['null', 'Ala', '0', 'błąd'], 0, 'Parametr został przypisany sam sobie, więc pole nie dostało wartości.', 'class Dziecko {\n    String imie;\n\n    public Dziecko(String imie) {\n        imie = imie;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Dziecko d = new Dziecko("Ala");\n        System.out.println(d.imie);\n    }\n}\n'),
      ],
    },

    /* ---------- 7. WIELE KONSTRUKTORÓW ---------- */
    {
      id: 'klasy-przeciazanie', title: 'Wiele konstruktorów', blurb: 'kilka sposobów tworzenia obiektu', minutes: 5,
      content: [
        ANA('📝', 'Zapisując się do biblioteki, możesz wypełnić <b>pełny formularz</b> albo <b>krótki</b> (tylko imię). Klasa też może mieć kilka konstruktorów: <b>ta sama nazwa, różne parametry</b>. Java wybiera ten, który pasuje do podanych argumentów. To <b>przeciążanie</b>, które znasz już z metod.'),
        VIZ('compare', { cols: [
          { icon: '📄', title: 'new Pies("Reks", 3)', c: 'accent', sub: 'dwa argumenty', items: ['wybiera <code>Pies(String, int)</code>'] },
          { icon: '📃', title: 'new Pies("Azor")', c: 'ok', sub: 'jeden argument', items: ['wybiera <code>Pies(String)</code>'] }] }),
        CODE(J`class Pies {
    String imie;
    int wiek;

    public Pies(String imie, int wiek) {
        this.imie = imie;
        this.wiek = wiek;
    }

    public Pies(String imie) {
        this.imie = imie;
        this.wiek = 0;
    }
}

public class Main {
    public static void main(String[] args) {
        Pies a = new Pies("Reks", 3);
        Pies b = new Pies("Azor");
        System.out.println(a.wiek + " " + b.wiek);
    }
}
`, '3 0'),
        NOTE('warn', 'Konstruktory muszą różnić się <b>liczbą lub typami parametrów</b>. Dwa konstruktory z tymi samymi typami parametrów to błąd.'),
      ],
      guide: {
        files: [FL('Pies.java', 'public class Pies {\n    String imie;\n    int wiek;\n\n    public Pies(String imie, int wiek) {\n        this.imie = imie;\n        this.wiek = wiek;\n    }\n}\n')],
        steps: [
          { say: '<p>Dopisz <b>drugi</b> konstruktor, który przyjmuje tylko imię. Nazwa ta sama (<code>Pies</code>), ale inna lista parametrów.</p>', type: '    public Pies(String imie) {', expect: J`public\s+Pies\s*\(\s*String\s+imie\s*\)\s*\{` },
          { say: '<p>W środku ustaw imię z parametru, a wiek na 0 (nowy szczeniak).</p>', type: '        this.imie = imie;\n        this.wiek = 0;', expect: J`Pies\s*\(\s*String\s+imie\s*\)\s*\{\s*this\.imie\s*=\s*imie\s*;\s*this\.wiek\s*=\s*0\s*;` },
          { say: '<p>Zamknij konstruktor klamrą.</p>', type: '    }', expect: J`this\.wiek\s*=\s*0\s*;\s*\}` },
        ],
        solution: [FL('Pies.java', 'public class Pies {\n    String imie;\n    int wiek;\n\n    public Pies(String imie, int wiek) {\n        this.imie = imie;\n        this.wiek = wiek;\n    }\n\n    public Pies(String imie) {\n        this.imie = imie;\n        this.wiek = 0;\n    }\n}\n')],
        checks: [
          CK(CR, 'Konstruktor Pies(String) ustawia imię i wiek 0', J`ctor("Pies", String.class); Object o = make("Pies", "Azor"); eq("Azor", field(o, "imie")); eq(0, field(o, "wiek"));`),
          CK(CR, 'Konstruktor Pies(String, int) nadal działa', J`Object o = make("Pies", "Reks", 3); eq("Reks", field(o, "imie")); eq(3, field(o, "wiek"));`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Ksiazka</code> ma już konstruktor <code>(String tytul, int liczbaStron)</code>. Dopisz drugi, <b>bezparametrowy</b> <code>Ksiazka()</code>, który ustawia <code>tytul</code> na <code>"Bez tytulu"</code> i <code>liczbaStron</code> na <code>1</code>.</p>',
        files: [FL('Ksiazka.java', 'public class Ksiazka {\n    String tytul;\n    int liczbaStron;\n\n    public Ksiazka(String tytul, int liczbaStron) {\n        this.tytul = tytul;\n        this.liczbaStron = liczbaStron;\n    }\n}\n')],
        hints: ['Konstruktor bez parametrów: <code>public Ksiazka() { ... }</code>', 'W środku: <code>tytul = "Bez tytulu";</code> i <code>liczbaStron = 1;</code>'],
        solution: [FL('Ksiazka.java', 'public class Ksiazka {\n    String tytul;\n    int liczbaStron;\n\n    public Ksiazka(String tytul, int liczbaStron) {\n        this.tytul = tytul;\n        this.liczbaStron = liczbaStron;\n    }\n\n    public Ksiazka() {\n        tytul = "Bez tytulu";\n        liczbaStron = 1;\n    }\n}\n')],
        checks: [
          CK(CR, 'Konstruktor Ksiazka() ustawia wartości domyślne', J`ctor("Ksiazka"); Object o = make("Ksiazka"); eq("Bez tytulu", field(o, "tytul")); eq(1, field(o, "liczbaStron"));`),
          CK(CR, 'Konstruktor (String, int) nadal działa', J`Object o = make("Ksiazka", "Dune", 500); eq("Dune", field(o, "tytul")); eq(500, field(o, "liczbaStron"));`),
        ],
      },
      quiz: [
        Q('Czym różnią się konstruktory przeciążone?', ['liczbą lub typami parametrów', 'nazwą', 'typem zwracanym', 'niczym'], 0, 'Nazwa jest zawsze taka sama (nazwa klasy).'),
        Q('Który zestaw konstruktorów jest poprawny?', ['<code>Pies(String a)</code> i <code>Pies(String a, int b)</code>', '<code>Pies(String a)</code> i <code>Pies(String b)</code>', '<code>Pies(int a)</code> i <code>Pies(int b)</code>'], 0, 'Drugi i trzeci zestaw mają identyczne typy parametrów.'),
        Q('Co wybierze Java przy <code>new Pies("Azor")</code>?', ['konstruktor przyjmujący jeden String', 'konstruktor z dwoma parametrami', 'zawsze pierwszy w pliku', 'zgłosi błąd'], 0, 'Dopasowuje liczbę i typy argumentów.'),
      ],
    },

    /* ---------- 8. THIS(...) ---------- */
    {
      id: 'klasy-this-ctor', title: 'this(...) – konstruktor wywołuje konstruktor', blurb: 'bez kopiowania kodu', minutes: 5,
      content: [
        ANA('🔁', 'Krótki formularz nie musi od zera wymyślać wszystkiego. Może powiedzieć: „<b>wypełnij za mnie pełny formularz</b>, a brakujące rubryki daj domyślne”. W kodzie to <code>this(...)</code>: jeden konstruktor <b>przekazuje pracę</b> innemu konstruktorowi tej samej klasy.'),
        VIZ('flow', { title: 'new Pies("Azor")', steps: [{ t: 'Pies(String imie)', s: 'krótki konstruktor', c: 'accent' }, { t: 'this(imie, 0)', s: 'woła pełny konstruktor', c: 'warn' }, { t: 'Pies(String, int)', s: 'ustawia pola', c: 'ok' }] }),
        CODE(J`class Pies {
    String imie;
    int wiek;

    public Pies(String imie, int wiek) {
        this.imie = imie;
        this.wiek = wiek;
    }

    public Pies(String imie) {
        this(imie, 0);
    }
}

public class Main {
    public static void main(String[] args) {
        Pies p = new Pies("Azor");
        System.out.println(p.imie + " " + p.wiek);
    }
}
`, 'Azor 0'),
        NOTE('warn', '<code>this(...)</code> musi być <b>pierwszą instrukcją</b> w konstruktorze. Zaleta: jeśli kiedyś zmienisz sposób ustawiania pól, robisz to w jednym miejscu.'),
      ],
      guide: {
        files: [FL('Pies.java', 'public class Pies {\n    String imie;\n    int wiek;\n\n    public Pies(String imie, int wiek) {\n        this.imie = imie;\n        this.wiek = wiek;\n    }\n\n    public Pies(String imie) {\n    }\n\n    public Pies() {\n    }\n}\n')],
        steps: [
          { say: '<p>W konstruktorze z samym imieniem nie kopiuj kodu. Wywołaj pełny konstruktor, a wiek ustaw na 0.</p>', type: '        this(imie, 0);', expect: J`Pies\s*\(\s*String\s+imie\s*\)\s*\{\s*this\s*\(\s*imie\s*,\s*0\s*\)\s*;` },
          { say: '<p>Konstruktor bez parametrów też przekaż dalej: imię <code>"Bez imienia"</code> i wiek 0.</p>', type: '        this("Bez imienia", 0);', expect: J`Pies\s*\(\s*\)\s*\{\s*this\s*\(\s*"Bez imienia"\s*,\s*0\s*\)\s*;` },
        ],
        solution: [FL('Pies.java', 'public class Pies {\n    String imie;\n    int wiek;\n\n    public Pies(String imie, int wiek) {\n        this.imie = imie;\n        this.wiek = wiek;\n    }\n\n    public Pies(String imie) {\n        this(imie, 0);\n    }\n\n    public Pies() {\n        this("Bez imienia", 0);\n    }\n}\n')],
        checks: [
          CK(CR, 'Pies(String) ustawia imię i wiek 0', J`Object o = make("Pies", "Azor"); eq("Azor", field(o, "imie")); eq(0, field(o, "wiek"));`),
          CK(CR, 'Pies() ustawia „Bez imienia” i wiek 0', J`Object o = make("Pies"); eq("Bez imienia", field(o, "imie")); eq(0, field(o, "wiek"));`),
          CK(MN, 'Użyto this(...)', J`isTrue("Wywołaj inny konstruktor przez this(...)", srcCount(src("Pies"), "this\\s*\\(") >= 2);`),
        ],
      },
      exercise: {
        prompt: '<p>W klasie <code>Ksiazka</code> jest pełny konstruktor <code>(String tytul, int liczbaStron)</code> i dwa puste. Uzupełnij je, używając <code>this(...)</code>: <code>Ksiazka(String tytul)</code> ma dawać <b>100 stron</b>, a <code>Ksiazka()</code> tytuł <code>"Bez tytulu"</code> i 100 stron.</p>',
        files: [FL('Ksiazka.java', 'public class Ksiazka {\n    String tytul;\n    int liczbaStron;\n\n    public Ksiazka(String tytul, int liczbaStron) {\n        this.tytul = tytul;\n        this.liczbaStron = liczbaStron;\n    }\n\n    public Ksiazka(String tytul) {\n    }\n\n    public Ksiazka() {\n    }\n}\n')],
        hints: ['<code>this(tytul, 100);</code>', '<code>this("Bez tytulu", 100);</code>'],
        solution: [FL('Ksiazka.java', 'public class Ksiazka {\n    String tytul;\n    int liczbaStron;\n\n    public Ksiazka(String tytul, int liczbaStron) {\n        this.tytul = tytul;\n        this.liczbaStron = liczbaStron;\n    }\n\n    public Ksiazka(String tytul) {\n        this(tytul, 100);\n    }\n\n    public Ksiazka() {\n        this("Bez tytulu", 100);\n    }\n}\n')],
        checks: [
          CK(CR, 'Ksiazka(String) daje 100 stron', J`Object o = make("Ksiazka", "Dune"); eq("Dune", field(o, "tytul")); eq(100, field(o, "liczbaStron"));`),
          CK(CR, 'Ksiazka() daje domyślne wartości', J`Object o = make("Ksiazka"); eq("Bez tytulu", field(o, "tytul")); eq(100, field(o, "liczbaStron"));`),
          CK(MN, 'Użyto this(...)', J`isTrue("Wywołaj inny konstruktor przez this(...)", srcCount(src("Ksiazka"), "this\\s*\\(") >= 2);`),
        ],
      },
      quiz: [
        Q('Co robi <code>this(imie, 0);</code> w konstruktorze?', ['wywołuje inny konstruktor tej samej klasy', 'tworzy nową zmienną this', 'wywołuje konstruktor nadklasy', 'zeruje pole imie'], 0, 'To wywołanie innego konstruktora z tej samej klasy.'),
        Q('Gdzie musi stać <code>this(...)</code> w konstruktorze?', ['na samym początku', 'na samym końcu', 'w dowolnym miejscu', 'w osobnej metodzie'], 0, 'Musi to być pierwsza instrukcja.'),
        Q('Jaka jest główna zaleta <code>this(...)</code>?', ['nie powtarzamy kodu ustawiającego pola', 'konstruktor działa szybciej', 'pola stają się prywatne', 'nie trzeba pisać pełnego konstruktora'], 0, 'Logika jest w jednym miejscu.'),
      ],
    },

    /* ---------- 9. METODY ---------- */
    {
      id: 'klasy-metody', title: 'Metody obiektu', blurb: 'umiejętności obiektu, które używają jego pól', minutes: 5,
      content: [
        ANA('🐕', 'Pola mówią, <b>czym pies jest</b> (imię, wiek). Metody mówią, <b>co pies potrafi</b> (szczekać, spać). Metoda obiektu leży w klasie i ma <b>dostęp do jego pól</b>, więc „wie”, o kogo chodzi.'),
        VIZ('flow', { title: 'p.szczekaj()', steps: [{ t: 'p.szczekaj()', s: 'wołamy metodę na obiekcie p', c: 'accent' }, { t: 'ciało metody', s: 'korzysta z pola imie obiektu p', c: 'warn' }, { t: 'Reks mowi: Hau!', s: 'wynik', c: 'ok' }] }),
        PP('Metoda obiektu wygląda jak metoda, którą już znasz, ale <b>bez słowa <code>static</code></b>. Wołamy ją przez kropkę na konkretnym obiekcie.'),
        CODE(J`class Pies {
    String imie;

    public Pies(String imie) {
        this.imie = imie;
    }

    public void szczekaj() {
        System.out.println(imie + " mowi: Hau!");
    }
}

public class Main {
    public static void main(String[] args) {
        Pies p = new Pies("Reks");
        p.szczekaj();
        new Pies("Fifi").szczekaj();
    }
}
`, 'Reks mowi: Hau!\nFifi mowi: Hau!'),
      ],
      guide: {
        files: [FL('Pies.java', 'public class Pies {\n    String imie;\n\n    public Pies(String imie) {\n        this.imie = imie;\n    }\n}\n')],
        steps: [
          { say: '<p>Dodaj metodę. <code>public</code> (dostępna dla wszystkich), <code>void</code> (nic nie zwraca), nazwa <code>szczekaj</code>, puste nawiasy. <b>Bez</b> słowa <code>static</code>.</p>', type: '    public void szczekaj() {', expect: J`public\s+void\s+szczekaj\s*\(\s*\)\s*\{` },
          { say: '<p>W środku wypisz tekst z imieniem. Pole <code>imie</code> jest dostępne wprost, bo metoda należy do obiektu.</p>', type: '        System.out.println(imie + " mowi: Hau!");', expect: J`println\s*\(\s*imie\s*\+\s*" mowi: Hau!"\s*\)\s*;` },
          { say: '<p>Zamknij metodę klamrą.</p>', type: '    }', expect: J`Hau!"\s*\)\s*;\s*\}` },
        ],
        solution: [FL('Pies.java', 'public class Pies {\n    String imie;\n\n    public Pies(String imie) {\n        this.imie = imie;\n    }\n\n    public void szczekaj() {\n        System.out.println(imie + " mowi: Hau!");\n    }\n}\n')],
        checks: [
          CK(CR, 'Metoda szczekaj() istnieje', J`method("Pies", "szczekaj");`),
          CK(CR, 'szczekaj() wypisuje „Reks mowi: Hau!”', J`Object p = make("Pies", "Reks"); List<String> o = lines(out(() -> call(p, "szczekaj"))); isTrue("Oczekiwano: [Reks mowi: Hau!] – wypisano: " + o, o.equals(Arrays.asList("Reks mowi: Hau!")));`),
          CK(MD, 'Metoda nie jest static', J`isFalse("Metoda obiektu nie powinna być static", Modifier.isStatic(methodMods("Pies", "szczekaj")));`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Ksiazka</code> ma pole <code>tytul</code> i konstruktor. Dodaj metodę <code>void czytaj()</code>, która wypisuje <code>Czytam: </code> i tytuł, np. <code>Czytam: Dune</code>.</p>',
        files: [FL('Ksiazka.java', 'public class Ksiazka {\n    String tytul;\n\n    public Ksiazka(String tytul) {\n        this.tytul = tytul;\n    }\n}\n')],
        hints: ['<code>public void czytaj() { ... }</code>', '<code>System.out.println("Czytam: " + tytul);</code>'],
        solution: [FL('Ksiazka.java', 'public class Ksiazka {\n    String tytul;\n\n    public Ksiazka(String tytul) {\n        this.tytul = tytul;\n    }\n\n    public void czytaj() {\n        System.out.println("Czytam: " + tytul);\n    }\n}\n')],
        checks: [
          CK(CR, 'Metoda czytaj() istnieje', J`method("Ksiazka", "czytaj");`),
          CK(CR, 'czytaj() wypisuje „Czytam: Dune”', J`Object k = make("Ksiazka", "Dune"); List<String> o = lines(out(() -> call(k, "czytaj"))); isTrue("Oczekiwano: [Czytam: Dune] – wypisano: " + o, o.equals(Arrays.asList("Czytam: Dune")));`),
          CK(MD, 'Metoda nie jest static', J`isFalse("Metoda obiektu nie powinna być static", Modifier.isStatic(methodMods("Ksiazka", "czytaj")));`),
        ],
      },
      quiz: [
        Q('Co jest prawdą o metodach obiektu?', ['mają dostęp do pól obiektu', 'zawsze muszą być static', 'nie mogą nic wypisywać', 'nie mogą mieć nazwy'], 0, 'Dlatego mogą użyć <code>imie</code> bez żadnego prefiksu.'),
        Q('Jak wywołać metodę <code>szczekaj()</code> na obiekcie <code>p</code>?', ['p.szczekaj();', 'szczekaj(p);', 'Pies.szczekaj;', 'p->szczekaj();'], 0, 'Kropka po nazwie zmiennej obiektu.'),
        Q('Czy metoda obiektu (bez static) może być wywołana bez obiektu?', ['nie, trzeba mieć obiekt', 'tak, zawsze', 'tak, ale tylko void', 'tak, jeśli klasa jest publiczna'], 0, 'Najpierw <code>new</code>, potem kropka.'),
      ],
    },

    /* ---------- 10. METODA ZWRACAJĄCA ---------- */
    {
      id: 'klasy-metody-return', title: 'Metoda zwracająca wartość', blurb: 'return w metodzie obiektu', minutes: 5,
      content: [
        ANA('🧮', 'Niektóre metody nie tylko „coś robią”, ale <b>oddają odpowiedź</b>: „ile ten pies ma lat psich?”. Zamiast <code>void</code> piszesz typ odpowiedzi (<code>int</code>) i kończysz metodę <code>return</code>.'),
        CODE(J`class Pies {
    int wiek;

    public Pies(int wiek) {
        this.wiek = wiek;
    }

    public int wiekPsi() {
        return wiek * 7;
    }

    public boolean czyStary() {
        return wiek > 10;
    }
}

public class Main {
    public static void main(String[] args) {
        Pies p = new Pies(3);
        System.out.println(p.wiekPsi());
        System.out.println(p.czyStary());
    }
}
`, '21\nfalse'),
        LI(['Typ przed nazwą metody mówi, <b>co oddaje</b>: <code>int</code>, <code>boolean</code>, <code>String</code>…', '<code>return wartość;</code> kończy metodę i oddaje wynik.', 'Wynik można wypisać (<code>println(p.wiekPsi())</code>) albo zapisać w zmiennej.']),
      ],
      guide: {
        files: [FL('Pies.java', 'public class Pies {\n    int wiek;\n\n    public Pies(int wiek) {\n        this.wiek = wiek;\n    }\n}\n')],
        steps: [
          { say: '<p>Metoda ma <b>oddać liczbę całkowitą</b>, więc zamiast <code>void</code> wpisz <code>int</code>.</p>', type: '    public int wiekPsi() {', expect: J`public\s+int\s+wiekPsi\s*\(\s*\)\s*\{` },
          { say: '<p><code>return</code> oddaje wynik: wiek razy 7.</p>', type: '        return wiek * 7;', expect: J`return\s+wiek\s*\*\s*7\s*;` },
          { say: '<p>Zamknij metodę klamrą.</p>', type: '    }', expect: J`return\s+wiek\s*\*\s*7\s*;\s*\}` },
        ],
        solution: [FL('Pies.java', 'public class Pies {\n    int wiek;\n\n    public Pies(int wiek) {\n        this.wiek = wiek;\n    }\n\n    public int wiekPsi() {\n        return wiek * 7;\n    }\n}\n')],
        checks: [
          CK(CR, 'wiekPsi() zwraca wiek * 7', J`eq(21, call(make("Pies", 3), "wiekPsi")); eq(0, call(make("Pies", 0), "wiekPsi")); eq(70, call(make("Pies", 10), "wiekPsi"));`),
          CK(MD, 'wiekPsi() zwraca int', J`isTrue("wiekPsi ma zwracać int", method("Pies", "wiekPsi").getReturnType() == int.class);`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Ksiazka</code> ma pole <code>liczbaStron</code>. Dodaj metodę <code>boolean czyDluga()</code>, która zwraca <code>true</code>, gdy książka ma <b>więcej niż 300</b> stron.</p>',
        files: [FL('Ksiazka.java', 'public class Ksiazka {\n    int liczbaStron;\n\n    public Ksiazka(int liczbaStron) {\n        this.liczbaStron = liczbaStron;\n    }\n}\n')],
        hints: ['Typ zwracany to <code>boolean</code>.', '<code>return liczbaStron > 300;</code>'],
        solution: [FL('Ksiazka.java', 'public class Ksiazka {\n    int liczbaStron;\n\n    public Ksiazka(int liczbaStron) {\n        this.liczbaStron = liczbaStron;\n    }\n\n    public boolean czyDluga() {\n        return liczbaStron > 300;\n    }\n}\n')],
        checks: [
          CK(CR, 'czyDluga() rozróżnia długie i krótkie książki', J`eq(true, call(make("Ksiazka", 500), "czyDluga")); eq(false, call(make("Ksiazka", 100), "czyDluga")); eq(false, call(make("Ksiazka", 300), "czyDluga")); eq(true, call(make("Ksiazka", 301), "czyDluga"));`),
          CK(MD, 'czyDluga() zwraca boolean', J`isTrue("czyDluga ma zwracać boolean", method("Ksiazka", "czyDluga").getReturnType() == boolean.class);`),
        ],
      },
      quiz: [
        Q('Co trzeba zmienić w nagłówku metody, żeby zwracała liczbę całkowitą?', ['zamiast void wpisać int', 'dodać słowo return przed nazwą', 'dodać static', 'nic, każda metoda zwraca liczbę'], 0, 'Typ przed nazwą określa wynik.'),
        OUTQ('Co wypisze program?', ['14', '2', '7', '27'], 0, 'Metoda zwraca wiek razy 7: 2 * 7.', 'class Pies {\n    int wiek = 2;\n\n    public int wiekPsi() {\n        return wiek * 7;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Pies p = new Pies();\n        System.out.println(p.wiekPsi());\n    }\n}\n'),
        Q('Co zwraca metoda <code>boolean czyStary()</code>?', ['true lub false', 'liczbę', 'tekst', 'nic'], 0, 'Typ boolean to prawda lub fałsz.'),
      ],
    },

    /* ---------- 11. METODA ZMIENIAJĄCA STAN ---------- */
    {
      id: 'klasy-metody-stan', title: 'Metoda zmieniająca obiekt', blurb: 'urodziny(): wiek++', minutes: 4,
      content: [
        ANA('🎂', 'Metoda może też <b>zmienić stan obiektu</b>. Pies ma urodziny: wołasz <code>p.urodziny()</code>, a jego pole <code>wiek</code> rośnie o 1. Obiekt „pamięta” zmianę, bo pole należy do niego.'),
        CODE(J`class Pies {
    int wiek;

    public void urodziny() {
        wiek++;
    }
}

public class Main {
    public static void main(String[] args) {
        Pies p = new Pies();
        p.wiek = 3;
        p.urodziny();
        p.urodziny();
        System.out.println(p.wiek);
    }
}
`, '5'),
        NOTE('tip', '<code>wiek++</code> znaczy „dodaj 1 do wiek”. W metodzie obiektu zmienia pole <b>tego</b> obiektu, na którym metodę wywołano.'),
      ],
      guide: {
        files: [FL('Pies.java', 'public class Pies {\n    int wiek;\n}\n')],
        steps: [
          { say: '<p>Dodaj metodę <code>urodziny</code>, która nic nie zwraca (<code>void</code>) i nie ma parametrów.</p>', type: '    public void urodziny() {', expect: J`public\s+void\s+urodziny\s*\(\s*\)\s*\{` },
          { say: '<p>Zwiększ wiek o 1 i zamknij metodę.</p>', type: '        wiek++;\n    }', expect: J`urodziny\s*\(\s*\)\s*\{\s*wiek\s*(\+\+|\+=\s*1)\s*;\s*\}|urodziny\s*\(\s*\)\s*\{\s*wiek\s*=\s*wiek\s*\+\s*1\s*;\s*\}` },
        ],
        solution: [FL('Pies.java', 'public class Pies {\n    int wiek;\n\n    public void urodziny() {\n        wiek++;\n    }\n}\n')],
        checks: [
          CK(CR, 'urodziny() zwiększa wiek o 1', J`Object p = make("Pies"); setField(p, "wiek", 3); call(p, "urodziny"); eq(4, field(p, "wiek")); call(p, "urodziny"); eq(5, field(p, "wiek"));`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Licznik</code> ma pole <code>wartosc</code>. Dodaj dwie metody: <code>void dodaj()</code> (zwiększa o 1) oraz <code>void zeruj()</code> (ustawia 0).</p>',
        files: [FL('Licznik.java', 'public class Licznik {\n    int wartosc;\n}\n')],
        hints: ['<code>wartosc++;</code> w <code>dodaj</code>', '<code>wartosc = 0;</code> w <code>zeruj</code>'],
        solution: [FL('Licznik.java', 'public class Licznik {\n    int wartosc;\n\n    public void dodaj() {\n        wartosc++;\n    }\n\n    public void zeruj() {\n        wartosc = 0;\n    }\n}\n')],
        checks: [
          CK(CR, 'dodaj() zwiększa wartość', J`Object l = make("Licznik"); call(l, "dodaj"); call(l, "dodaj"); eq(2, field(l, "wartosc"));`),
          CK(CR, 'zeruj() ustawia 0', J`Object l = make("Licznik"); call(l, "dodaj"); call(l, "zeruj"); eq(0, field(l, "wartosc"));`),
        ],
      },
      quiz: [
        OUTQ('Co wypisze program?', ['2', '0', '1', '3'], 0, 'Dwa wywołania <code>dodaj()</code> zwiększają pole dwa razy.', 'class Licznik {\n    int wartosc;\n\n    public void dodaj() {\n        wartosc++;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Licznik l = new Licznik();\n        l.dodaj();\n        l.dodaj();\n        System.out.println(l.wartosc);\n    }\n}\n'),
        Q('Czy metoda <code>void</code> może zmieniać pola obiektu?', ['tak', 'nie', 'tylko publiczne', 'tylko static'], 0, 'void oznacza tylko brak wartości zwracanej.'),
        Q('Gdzie „pamiętana” jest zmiana wykonana w metodzie obiektu?', ['w polach tego obiektu', 'w klasie, dla wszystkich obiektów', 'nigdzie, znika po wywołaniu', 'w zmiennej main'], 0, 'Pola należą do konkretnego obiektu.'),
      ],
    },

    /* ---------- 12. TOSTRING ---------- */
    {
      id: 'klasy-tostring', title: 'Metoda toString()', blurb: 'ładny opis obiektu przy wypisywaniu', minutes: 5,
      content: [
        ANA('🏷️', 'Gdy wypiszesz obiekt bez przygotowania, Java pokaże dziwną „metryczkę” w stylu <code>Pies@1b6d3586</code>. Metoda <code>toString()</code> to <b>ładna etykieta</b>, którą sam definiujesz. Java wywołuje ją <b>automatycznie</b>, gdy obiekt trzeba zamienić na tekst (np. w <code>println</code>).'),
        VIZ('compare', { cols: [
          { icon: '🔢', title: 'bez toString()', c: 'bad', items: ['<code>println(p)</code>', 'wynik: <code>Pies@1b6d3586</code>'] },
          { icon: '🏷️', title: 'z toString()', c: 'ok', items: ['<code>println(p)</code>', 'wynik: <code>Reks (3)</code>'] }] }),
        CODE(J`class Pies {
    String imie;
    int wiek;

    public Pies(String imie, int wiek) {
        this.imie = imie;
        this.wiek = wiek;
    }

    @Override
    public String toString() {
        return imie + " (" + wiek + ")";
    }
}

public class Main {
    public static void main(String[] args) {
        Pies p = new Pies("Reks", 3);
        System.out.println(p);
    }
}
`, 'Reks (3)'),
        LI(['Nagłówek zawsze: <code>public String toString()</code>. Metoda <b>zwraca</b> tekst, sama niczego nie wypisuje.', '<code>@Override</code> to adnotacja („nadpisuję metodę, którą każdy obiekt już ma”). W module o dziedziczeniu dowiesz się dlaczego.']),
      ],
      guide: {
        files: [FL('Pies.java', 'public class Pies {\n    String imie;\n    int wiek;\n\n    public Pies(String imie, int wiek) {\n        this.imie = imie;\n        this.wiek = wiek;\n    }\n}\n')],
        steps: [
          { say: '<p>Dopisz adnotację <code>@Override</code> i nagłówek metody. Metoda <b>zwraca</b> <code>String</code>, więc typ to <code>String</code> (nie <code>void</code>).</p>', type: '    @Override\n    public String toString() {', expect: J`@Override\s+public\s+String\s+toString\s*\(\s*\)\s*\{` },
          { say: '<p>Zwróć tekst opisujący obiekt: imię i wiek w nawiasie. Zamknij metodę klamrą.</p>', type: '        return imie + " (" + wiek + ")";\n    }', expect: J`return\s+imie\s*\+\s*" \("\s*\+\s*wiek\s*\+\s*"\)"\s*;\s*\}` },
        ],
        solution: [FL('Pies.java', 'public class Pies {\n    String imie;\n    int wiek;\n\n    public Pies(String imie, int wiek) {\n        this.imie = imie;\n        this.wiek = wiek;\n    }\n\n    @Override\n    public String toString() {\n        return imie + " (" + wiek + ")";\n    }\n}\n')],
        checks: [
          CK(CR, 'toString() zwraca „Reks (3)”', J`eq("Reks (3)", String.valueOf(make("Pies", "Reks", 3))); eq("Fifi (7)", String.valueOf(make("Pies", "Fifi", 7)));`),
          CK(MN, 'Użyto @Override', J`isTrue("Dodaj @Override nad toString()", srcHas("Pies", "@Override\\s+public\\s+String\\s+toString"));`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Ksiazka</code> ma pola <code>tytul</code> i <code>liczbaStron</code>. Napisz <code>toString()</code>, które zwraca tekst w formacie <code>Dune, 500 str.</code>.</p>',
        files: [FL('Ksiazka.java', 'public class Ksiazka {\n    String tytul;\n    int liczbaStron;\n\n    public Ksiazka(String tytul, int liczbaStron) {\n        this.tytul = tytul;\n        this.liczbaStron = liczbaStron;\n    }\n}\n')],
        hints: ['<code>@Override public String toString() { ... }</code>', '<code>return tytul + ", " + liczbaStron + " str.";</code>'],
        solution: [FL('Ksiazka.java', 'public class Ksiazka {\n    String tytul;\n    int liczbaStron;\n\n    public Ksiazka(String tytul, int liczbaStron) {\n        this.tytul = tytul;\n        this.liczbaStron = liczbaStron;\n    }\n\n    @Override\n    public String toString() {\n        return tytul + ", " + liczbaStron + " str.";\n    }\n}\n')],
        checks: [
          CK(CR, 'toString() zwraca „Dune, 500 str.”', J`eq("Dune, 500 str.", String.valueOf(make("Ksiazka", "Dune", 500))); eq("Ala, 10 str.", String.valueOf(make("Ksiazka", "Ala", 10)));`),
          CK(MN, 'Użyto @Override', J`isTrue("Dodaj @Override nad toString()", srcHas("Ksiazka", "@Override\\s+public\\s+String\\s+toString"));`),
        ],
      },
      quiz: [
        Q('Co zwraca metoda <code>toString()</code>?', ['tekst (String) opisujący obiekt', 'liczbę', 'nic (void)', 'sam obiekt'], 0, 'Metoda tylko zwraca tekst, a wypisaniem zajmuje się println.'),
        Q('Kiedy Java wywołuje <code>toString()</code> automatycznie?', ['gdy obiekt jest wypisywany lub sklejany z tekstem', 'przy tworzeniu obiektu', 'przy każdym wywołaniu metody', 'nigdy automatycznie'], 0, 'Np. <code>println(p)</code> lub <code>"Pies: " + p</code>.'),
        OUTQ('Co wypisze program?', ['Ala (5)', 'Dziecko', 'Ala 5', 'błąd'], 0, 'Java użyła własnej metody <code>toString()</code>.', 'class Dziecko {\n    String imie;\n    int wiek;\n\n    public Dziecko(String imie, int wiek) {\n        this.imie = imie;\n        this.wiek = wiek;\n    }\n\n    @Override\n    public String toString() {\n        return imie + " (" + wiek + ")";\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(new Dziecko("Ala", 5));\n    }\n}\n'),
        Q('Jaki jest poprawny nagłówek <code>toString()</code>?', ['public String toString()', 'public void toString()', 'public String toString(String s)', 'static String toString()'], 0, 'Zwraca String, nie ma parametrów i nie jest statyczny.'),
      ],
    },

    /* ---------- 13. REFERENCJE ---------- */
    {
      id: 'klasy-referencje', title: 'Zmienna wskazuje na obiekt', blurb: 'dwie etykiety na jednym obiekcie', minutes: 5,
      content: [
        ANA('🔖', 'Zmienna obiektowa to <b>etykieta ze strzałką</b>, a nie sam obiekt. Przypisanie <code>b = a;</code> <b>nie kopiuje psa</b>. Powstaje druga etykieta na <b>tego samego</b> psa. Zmiana przez <code>b</code> jest więc widoczna przez <code>a</code>.'),
        VIZ('objects', { vars: [{ t: 'Pies', n: 'a', to: 'o1' }, { t: 'Pies', n: 'b', to: 'o1' }], objs: [{ id: 'o1', c: 'Pies', f: [['imie', '"Reks"'], ['wiek', '10']] }], cap: 'Po <code>Pies b = a;</code> dwie strzałki wskazują ten sam obiekt. <code>b.wiek = 10</code> zmienia go też dla <code>a</code>.' }),
        CODE(J`class Pies {
    int wiek;
}

public class Main {
    public static void main(String[] args) {
        Pies a = new Pies();
        a.wiek = 3;
        Pies b = a;
        b.wiek = 10;
        System.out.println(a.wiek);
        Pies c = new Pies();
        c.wiek = 1;
        System.out.println(a.wiek);
    }
}
`, '10\n10'),
        NOTE('exam', 'Klasyczne pytanie: <code>Pies b = a;</code> to <b>jeden</b> obiekt i dwie zmienne. Nowy obiekt powstaje <b>tylko</b> przez <code>new</code>.'),
      ],
      guide: {
        files: [FL('Pies.java', 'public class Pies {\n    int wiek;\n}\n'), FL('Main.java', MAINW(['Pies a = new Pies();', 'a.wiek = 3;']))],
        steps: [
          { say: '<p>Stwórz <b>drugą etykietę</b> na tym samym obiekcie: <code>b</code> dostaje to, co ma <code>a</code>. Nie ma tu <code>new</code>, więc żaden nowy obiekt nie powstaje.</p>', type: 'Pies b = a;', expect: J`Pies\s+b\s*=\s*a\s*;` },
          { say: '<p>Zmień wiek przez <code>b</code>.</p>', type: 'b.wiek = 10;', expect: J`\bb\.wiek\s*=\s*10\s*;` },
          { say: '<p>Wypisz wiek przez <code>a</code> – zobaczysz zmianę, bo to ten sam obiekt.</p>', type: 'System.out.println(a.wiek);', expect: J`println\s*\(\s*a\.wiek\s*\)` },
        ],
        solution: [FL('Pies.java', 'public class Pies {\n    int wiek;\n}\n'), FL('Main.java', MAINW(['Pies a = new Pies();', 'a.wiek = 3;', 'Pies b = a;', 'b.wiek = 10;', 'System.out.println(a.wiek);']))],
        checks: [
          CK(CR, 'Wynik: 10', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [10] – program wypisał: " + o, o.equals(Arrays.asList("10")));`),
          CK(MD, 'Drugi obiekt nie powstał (jedno new)', J`isTrue("Użyj Pies b = a; bez drugiego new", srcCount(src("Main"), "new\\s+Pies") == 1);`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Ksiazka</code> ma pole <code>tytul</code>. Stwórz <code>k1</code> z tytułem <code>"A"</code>, potem <code>k2 = k1</code>, zmień przez <code>k2</code> tytuł na <code>"B"</code>. Następnie stwórz <b>osobny</b> obiekt <code>k3</code> z tytułem <code>"C"</code>. Wypisz po kolei <code>k1.tytul</code> i <code>k3.tytul</code>.</p><pre>B\nC</pre>',
        files: [FL('Ksiazka.java', 'public class Ksiazka {\n    String tytul;\n}\n'), FL('Main.java', MAINW([]))],
        hints: ['<code>Ksiazka k2 = k1;</code> nie tworzy nowej książki.', 'Nowy, niezależny obiekt: <code>Ksiazka k3 = new Ksiazka();</code>'],
        solution: [FL('Ksiazka.java', 'public class Ksiazka {\n    String tytul;\n}\n'), FL('Main.java', MAINW(['Ksiazka k1 = new Ksiazka();', 'k1.tytul = "A";', 'Ksiazka k2 = k1;', 'k2.tytul = "B";', 'Ksiazka k3 = new Ksiazka();', 'k3.tytul = "C";', 'System.out.println(k1.tytul);', 'System.out.println(k3.tytul);']))],
        checks: [
          CK(CR, 'Wynik: B i C', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [B, C] – program wypisał: " + o, o.equals(Arrays.asList("B", "C")));`),
          CK(MD, 'Użyto przypisania k2 = k1', J`isTrue("Utwórz k2 jako drugą etykietę: Ksiazka k2 = k1;", srcHas("Main", "Ksiazka\\s+k2\\s*=\\s*k1\\s*;"));`),
        ],
      },
      quiz: [
        Q('Co robi <code>Pies b = a;</code> (a to istniejący obiekt)?', ['tworzy drugą zmienną wskazującą na ten sam obiekt', 'tworzy kopię obiektu', 'usuwa obiekt a', 'zgłasza błąd'], 0, 'Kopiowana jest strzałka, a nie obiekt.'),
        OUTQ('Co wypisze program?', ['9', '1', '0', '10'], 0, 'Obie zmienne wskazują ten sam obiekt.', 'class Pies {\n    int wiek = 1;\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Pies a = new Pies();\n        Pies b = a;\n        b.wiek = 9;\n        System.out.println(a.wiek);\n    }\n}\n'),
        OUTQ('Co wypisze program?', ['1', '9', '0', '10'], 0, 'Drugi obiekt powstał przez <code>new</code>, więc jest niezależny.', 'class Pies {\n    int wiek = 1;\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Pies a = new Pies();\n        Pies b = new Pies();\n        b.wiek = 9;\n        System.out.println(a.wiek);\n    }\n}\n'),
        Q('Ile obiektów istnieje po <code>Pies a = new Pies(); Pies b = a;</code>?', ['1', '2', '0', 'zależy od pól'], 0, 'Tylko jedno <code>new</code>.'),
      ],
    },

    /* ---------- 14. NULL ---------- */
    {
      id: 'klasy-null', title: 'null i NullPointerException', blurb: 'etykieta bez obiektu', minutes: 5,
      content: [
        ANA('🔖❓', 'Etykieta może <b>nie wskazywać na nic</b>. Tę „pustą strzałkę” zapisujemy jako <code>null</code>. Próba zajrzenia do środka (<code>p.imie</code>) obiektu, którego nie ma, kończy się błędem <code>NullPointerException</code>, czyli „zaglądasz do pudełka, którego nie ma”.'),
        VIZ('objects', { vars: [{ t: 'Pies', n: 'p', to: null }], objs: [], cap: 'Zmienna <code>p</code> ma wartość <code>null</code>, więc nie wskazuje na żaden obiekt.' }),
        CODE(J`class Pies {
    String imie = "Reks";
}

public class Main {
    public static void main(String[] args) {
        Pies p = null;
        if (p == null) {
            System.out.println("Brak psa");
        } else {
            System.out.println(p.imie);
        }
    }
}
`, 'Brak psa'),
        LI(['Pola obiektowe i tekstowe bez wartości mają domyślnie <code>null</code>.', 'Zanim użyjesz obiektu, który mógłby być pusty, sprawdź: <code>if (p != null)</code>.', 'Porównujemy z <code>null</code> przez <code>==</code> i <code>!=</code>.']),
      ],
      guide: {
        files: [FL('Pies.java', 'public class Pies {\n    String imie = "Reks";\n}\n'), FL('Main.java', MAINW([]))],
        steps: [
          { say: '<p>Zadeklaruj zmienną, która na razie nie wskazuje na żaden obiekt.</p>', type: 'Pies p = null;', expect: J`Pies\s+p\s*=\s*null\s*;` },
          { say: '<p>Sprawdź, czy obiektu nie ma. Do porównania z <code>null</code> służy <code>==</code>.</p>', type: 'if (p == null) {', expect: J`if\s*\(\s*p\s*==\s*null\s*\)\s*\{` },
          { say: '<p>W bloku wypisz komunikat i zamknij go klamrą.</p>', type: '    System.out.println("Brak psa");\n}', expect: J`println\s*\(\s*"Brak psa"\s*\)\s*;\s*\}` },
        ],
        solution: [FL('Pies.java', 'public class Pies {\n    String imie = "Reks";\n}\n'), FL('Main.java', MAINW(['Pies p = null;', 'if (p == null) {', '    System.out.println("Brak psa");', '}']))],
        checks: [
          CK(CR, 'Program wypisuje „Brak psa”', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Brak psa] – program wypisał: " + o, o.equals(Arrays.asList("Brak psa")));`),
          CK(MN, 'Porównanie z null', J`isTrue("Sprawdź p == null", srcHas("Main", "p\\s*==\\s*null"));`),
        ],
      },
      exercise: {
        prompt: '<p>W klasie <code>Main</code> napisz metodę <code>static String opis(Pies p)</code>. Gdy <code>p</code> jest <code>null</code>, zwraca <code>"brak"</code>, w przeciwnym razie pole <code>imie</code> psa.</p>',
        files: [FL('Pies.java', 'public class Pies {\n    String imie;\n\n    public Pies(String imie) {\n        this.imie = imie;\n    }\n}\n'), FL('Main.java', 'public class Main {\n    public static void main(String[] args) {\n    }\n}\n')],
        hints: ['<code>static String opis(Pies p) { ... }</code> w klasie Main, obok main.', '<code>if (p == null) { return "brak"; }</code>, a potem <code>return p.imie;</code>'],
        solution: [FL('Pies.java', 'public class Pies {\n    String imie;\n\n    public Pies(String imie) {\n        this.imie = imie;\n    }\n}\n'), FL('Main.java', 'public class Main {\n    static String opis(Pies p) {\n        if (p == null) {\n            return "brak";\n        }\n        return p.imie;\n    }\n\n    public static void main(String[] args) {\n    }\n}\n')],
        checks: [
          CK(CR, 'opis(null) zwraca „brak”', J`Method m = method("Main", "opis", cls("Pies")); eq("brak", m.invoke(null, (Object) null));`),
          CK(CR, 'opis(pies) zwraca imię', J`Method m = method("Main", "opis", cls("Pies")); eq("Reks", m.invoke(null, make("Pies", "Reks"))); eq("Fifi", m.invoke(null, make("Pies", "Fifi")));`),
        ],
      },
      quiz: [
        Q('Co oznacza <code>null</code>?', ['zmienna nie wskazuje na żaden obiekt', 'liczba 0', 'pusty tekst ""', 'wartość false'], 0, '<code>null</code> to „brak obiektu”.'),
        Q('Kiedy wystąpi <code>NullPointerException</code>?', ['gdy próbujesz użyć pola lub metody obiektu, który jest null', 'gdy dzielisz przez zero', 'gdy wyjdziesz poza tablicę', 'gdy brakuje średnika'], 0, 'Zaglądasz do środka „pustej strzałki”.'),
        OUTQ('Co wypisze program?', ['Brak', 'Reks', 'null', 'błąd'], 0, 'Zmienna ma wartość <code>null</code>, więc wykona się pierwszy blok.', 'class Pies {\n    String imie = "Reks";\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Pies p = null;\n        if (p == null) {\n            System.out.println("Brak");\n        } else {\n            System.out.println(p.imie);\n        }\n    }\n}\n'),
        Q('Jaką wartość ma domyślnie pole <code>Pies mojPies;</code> w klasie?', ['null', '0', 'nowy obiekt Pies', 'false'], 0, 'Pola obiektowe domyślnie są <code>null</code>.'),
      ],
    },

    /* ---------- 15. TABLICA OBIEKTÓW ---------- */
    {
      id: 'klasy-tablica-obiektow', title: 'Tablica obiektów', blurb: 'rząd pustych etykiet, które trzeba wypełnić', minutes: 5,
      content: [
        ANA('🗄️', 'Tablica obiektów to <b>rząd szafek na etykiety</b>. Po <code>new Pies[3]</code> szafki są <b>puste</b> (<code>null</code>), czyli psów jeszcze nie ma! Każdego psa trzeba osobno stworzyć przez <code>new</code> i włożyć do szafki.'),
        VIZ('cells', { title: 'Pies[] psy = new Pies[3];', rows: [{ label: 'po utworzeniu', cells: ['null', 'null', 'null'], idx: true }, { label: 'po psy[0] = new Pies(...)', cells: ['Reks', 'null', 'null'], idx: true, hl: [0] }] }),
        CODE(J`class Pies {
    String imie;

    public Pies(String imie) {
        this.imie = imie;
    }
}

public class Main {
    public static void main(String[] args) {
        Pies[] psy = new Pies[2];
        System.out.println(psy[0]);
        psy[0] = new Pies("Reks");
        psy[1] = new Pies("Fifi");
        System.out.println(psy[1].imie);
    }
}
`, 'null\nFifi'),
        NOTE('warn', 'Nie zapomnij o <code>new</code> dla każdego elementu. Wywołanie <code>psy[0].imie</code> przed wypełnieniem szafki daje <code>NullPointerException</code>.'),
      ],
      guide: {
        files: [FL('Pies.java', 'public class Pies {\n    String imie;\n\n    public Pies(String imie) {\n        this.imie = imie;\n    }\n}\n'), FL('Main.java', MAINW([]))],
        steps: [
          { say: '<p>Utwórz tablicę na 2 psy. Pamiętaj: tablica ma na razie <b>puste szafki</b> (<code>null</code>).</p>', type: 'Pies[] psy = new Pies[2];', expect: J`Pies\s*\[\s*\]\s*psy\s*=\s*new\s+Pies\s*\[\s*2\s*\]\s*;` },
          { say: '<p>Stwórz pierwszego psa i włóż go do szafki numer 0.</p>', type: 'psy[0] = new Pies("Reks");', expect: J`psy\s*\[\s*0\s*\]\s*=\s*new\s+Pies\s*\(\s*"Reks"\s*\)\s*;` },
          { say: '<p>Drugi pies trafia do szafki numer 1.</p>', type: 'psy[1] = new Pies("Fifi");', expect: J`psy\s*\[\s*1\s*\]\s*=\s*new\s+Pies\s*\(\s*"Fifi"\s*\)\s*;` },
          { say: '<p>Wypisz imię psa z szafki numer 1.</p>', type: 'System.out.println(psy[1].imie);', expect: J`println\s*\(\s*psy\s*\[\s*1\s*\]\.imie\s*\)` },
        ],
        solution: [FL('Pies.java', 'public class Pies {\n    String imie;\n\n    public Pies(String imie) {\n        this.imie = imie;\n    }\n}\n'), FL('Main.java', MAINW(['Pies[] psy = new Pies[2];', 'psy[0] = new Pies("Reks");', 'psy[1] = new Pies("Fifi");', 'System.out.println(psy[1].imie);']))],
        checks: [
          CK(CR, 'Wynik: Fifi', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Fifi] – program wypisał: " + o, o.equals(Arrays.asList("Fifi")));`),
          CK(MD, 'Obiekty tworzone przez new Pies(...)', J`isTrue("Utwórz dwa psy przez new Pies(...)", srcCount(src("Main"), "new\\s+Pies\\s*\\(") >= 2);`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Ksiazka</code> ma konstruktor <code>(String tytul)</code>. Utwórz tablicę <code>Ksiazka[] polka</code> na <b>3</b> książki, wypełnij ją tytułami <code>A</code>, <code>B</code>, <code>C</code> i wypisz tytuł <b>ostatniej</b> książki (indeks 2).</p><pre>C</pre>',
        files: [FL('Ksiazka.java', 'public class Ksiazka {\n    String tytul;\n\n    public Ksiazka(String tytul) {\n        this.tytul = tytul;\n    }\n}\n'), FL('Main.java', MAINW([]))],
        hints: ['<code>Ksiazka[] polka = new Ksiazka[3];</code>', '<code>polka[0] = new Ksiazka("A");</code> i tak dalej dla indeksów 1 i 2.', '<code>System.out.println(polka[2].tytul);</code>'],
        solution: [FL('Ksiazka.java', 'public class Ksiazka {\n    String tytul;\n\n    public Ksiazka(String tytul) {\n        this.tytul = tytul;\n    }\n}\n'), FL('Main.java', MAINW(['Ksiazka[] polka = new Ksiazka[3];', 'polka[0] = new Ksiazka("A");', 'polka[1] = new Ksiazka("B");', 'polka[2] = new Ksiazka("C");', 'System.out.println(polka[2].tytul);']))],
        checks: [
          CK(CR, 'Wynik: C', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [C] – program wypisał: " + o, o.equals(Arrays.asList("C")));`),
          CK(MD, 'Użyto tablicy Ksiazka[] z new Ksiazka[3]', J`isTrue("Utwórz tablicę: new Ksiazka[3]", srcHas("Main", "new\\s+Ksiazka\\s*\\[\\s*3\\s*\\]"));`),
          CK(MN, 'Trzy obiekty przez new Ksiazka(...)', J`isTrue("Stwórz trzy książki przez new Ksiazka(...)", srcCount(src("Main"), "new\\s+Ksiazka\\s*\\(") >= 3);`),
        ],
      },
      quiz: [
        Q('Co zawiera <code>new Pies[3]</code> tuż po utworzeniu?', ['trzy wartości null (puste szafki)', 'trzy nowe obiekty Pies', 'trzy zera', 'losowe obiekty'], 0, 'Tablica referencji zawiera <code>null</code>, obiekty trzeba utworzyć osobno.'),
        Q('Co spowoduje <code>psy[0].imie</code>, jeśli <code>psy[0]</code> to <code>null</code>?', ['NullPointerException', 'zwróci pusty napis', 'zwróci 0', 'błąd kompilacji'], 0, 'Zaglądasz do obiektu, którego nie ma.'),
        OUTQ('Co wypisze program?', ['null', '0', 'Reks', 'błąd'], 0, 'Szafka jest jeszcze pusta.', 'class Pies {\n    String imie = "Reks";\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Pies[] psy = new Pies[2];\n        System.out.println(psy[0]);\n    }\n}\n'),
        Q('Ile obiektów <code>Pies</code> powstało po <code>Pies[] psy = new Pies[5];</code>?', ['0', '5', '1', 'zależy od konstruktora'], 0, 'Powstała tylko tablica z pustymi szafkami.'),
      ],
    },

    /* ---------- 16. PĘTLA PO TABLICY OBIEKTÓW ---------- */
    {
      id: 'klasy-tablica-petla', title: 'Pętla po tablicy obiektów', blurb: 'obliczenia na wszystkich elementach', minutes: 5,
      content: [
        ANA('🚶', 'Masz rząd szafek z psami. Zamiast zaglądać do każdej ręcznie, <b>idziesz wzdłuż rzędu pętlą</b> i przy każdej szafce robisz to samo: np. dodajesz wiek psa do sumy albo wypisujesz jego imię.'),
        CODE(J`class Pies {
    String imie;
    int wiek;

    public Pies(String imie, int wiek) {
        this.imie = imie;
        this.wiek = wiek;
    }
}

public class Main {
    public static void main(String[] args) {
        Pies[] psy = { new Pies("Reks", 3), new Pies("Fifi", 5), new Pies("Azor", 1) };
        int suma = 0;
        for (int i = 0; i < psy.length; i++) {
            suma += psy[i].wiek;
        }
        System.out.println(suma);
    }
}
`, '9'),
        LI(['<code>psy.length</code> to liczba szafek, a ostatni indeks to <code>length - 1</code>.', '<code>psy[i]</code> to obiekt z szafki o numerze <code>i</code>, więc <code>psy[i].wiek</code> to jego wiek.', 'Tablicę z gotowymi obiektami można zapisać od razu w klamrach: <code>{ new Pies(...), new Pies(...) }</code>.']),
        NOTE('warn', 'Jeśli któraś szafka jest <code>null</code>, pętla wywoła <code>NullPointerException</code>. Wtedy sprawdź <code>if (psy[i] != null)</code>.'),
      ],
      guide: {
        files: [FL('Pies.java', 'public class Pies {\n    String imie;\n    int wiek;\n\n    public Pies(String imie, int wiek) {\n        this.imie = imie;\n        this.wiek = wiek;\n    }\n}\n'), FL('Main.java', MAINW(['Pies[] psy = { new Pies("Reks", 3), new Pies("Fifi", 5), new Pies("Azor", 1) };']))],
        steps: [
          { say: '<p>Przygotuj sumę.</p>', type: 'int suma = 0;', expect: J`int\s+suma\s*=\s*0\s*;` },
          { say: '<p>Pętla po wszystkich szafkach tablicy <code>psy</code>.</p>', type: 'for (int i = 0; i < psy.length; i++) {', expect: J`for\s*\(\s*int\s+i\s*=\s*0\s*;\s*i\s*<\s*psy\.length\s*;\s*i\+\+\s*\)\s*\{` },
          { say: '<p>Dodaj wiek psa z bieżącej szafki i zamknij pętlę.</p>', type: '    suma += psy[i].wiek;\n}', expect: J`suma\s*(\+=\s*psy\s*\[\s*i\s*\]\.wiek|=\s*suma\s*\+\s*psy\s*\[\s*i\s*\]\.wiek)\s*;\s*\}` },
          { say: '<p>Wypisz sumę po pętli.</p>', type: 'System.out.println(suma);', expect: J`\}\s*System\.out\.println\s*\(\s*suma\s*\)` },
        ],
        solution: [FL('Pies.java', 'public class Pies {\n    String imie;\n    int wiek;\n\n    public Pies(String imie, int wiek) {\n        this.imie = imie;\n        this.wiek = wiek;\n    }\n}\n'), FL('Main.java', MAINW(['Pies[] psy = { new Pies("Reks", 3), new Pies("Fifi", 5), new Pies("Azor", 1) };', 'int suma = 0;', 'for (int i = 0; i < psy.length; i++) {', '    suma += psy[i].wiek;', '}', 'System.out.println(suma);']))],
        checks: [
          CK(CR, 'Wynik: 9', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [9] – program wypisał: " + o, o.equals(Arrays.asList("9")));`),
          CK(MD, 'Użyto pętli po tablicy z length', J`isTrue("Użyj pętli for po psy.length", srcHas("Main", "\\bfor\\s*\\(.*psy\\.length"));`),
        ],
      },
      exercise: {
        prompt: '<p>Tablica <code>polka</code> ma trzy książki: <code>("A", 100)</code>, <code>("B", 250)</code>, <code>("C", 400)</code> (tytuł, liczba stron). W pętli policz <b>łączną liczbę stron</b> i wypisz ją w formacie:</p><pre>Razem stron: 750</pre>',
        files: [FL('Ksiazka.java', 'public class Ksiazka {\n    String tytul;\n    int liczbaStron;\n\n    public Ksiazka(String tytul, int liczbaStron) {\n        this.tytul = tytul;\n        this.liczbaStron = liczbaStron;\n    }\n}\n'), FL('Main.java', MAINW(['Ksiazka[] polka = { new Ksiazka("A", 100), new Ksiazka("B", 250), new Ksiazka("C", 400) };']))],
        hints: ['<code>int razem = 0;</code> przed pętlą', '<code>razem += polka[i].liczbaStron;</code> w pętli', 'Wypisz po pętli: <code>"Razem stron: " + razem</code>'],
        solution: [FL('Ksiazka.java', 'public class Ksiazka {\n    String tytul;\n    int liczbaStron;\n\n    public Ksiazka(String tytul, int liczbaStron) {\n        this.tytul = tytul;\n        this.liczbaStron = liczbaStron;\n    }\n}\n'), FL('Main.java', MAINW(['Ksiazka[] polka = { new Ksiazka("A", 100), new Ksiazka("B", 250), new Ksiazka("C", 400) };', 'int razem = 0;', 'for (int i = 0; i < polka.length; i++) {', '    razem += polka[i].liczbaStron;', '}', 'System.out.println("Razem stron: " + razem);']))],
        checks: [
          CK(CR, 'Wynik: Razem stron: 750', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Razem stron: 750] – program wypisał: " + o, o.equals(Arrays.asList("Razem stron: 750")));`),
          CK(MD, 'Użyto pętli i polka.length', J`isTrue("Użyj pętli for po polka.length", srcHas("Main", "\\bfor\\s*\\(.*polka\\.length"));`),
        ],
      },
      quiz: [
        Q('Dlaczego w pętli piszemy <code>i &lt; psy.length</code>?', ['bo ostatni indeks to length - 1', 'bo length zaczyna się od 1', 'bo tak jest szybciej', 'nie ma różnicy'], 0, 'Szafki o numerze <code>length</code> nie ma.'),
        OUTQ('Co wypisze program?', ['Reks Fifi', 'Reks', 'Fifi', 'błąd'], 0, 'Pętla wypisuje imiona po kolei w jednej linii (spacja z <code>print</code>).', 'class Pies {\n    String imie;\n\n    public Pies(String imie) {\n        this.imie = imie;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Pies[] psy = { new Pies("Reks"), new Pies("Fifi") };\n        for (int i = 0; i < psy.length; i++) {\n            System.out.print(psy[i].imie + " ");\n        }\n    }\n}\n'),
        Q('Co zrobić, gdy w tablicy mogą być puste szafki (null)?', ['sprawdzić <code>if (psy[i] != null)</code> przed użyciem', 'nic, Java sobie poradzi', 'użyć słowa void', 'zmienić typ tablicy na int'], 0, 'Inaczej wystąpi NullPointerException.'),
      ],
    },

    /* ---------- 17. ENUM ---------- */
    {
      id: 'klasy-enum', title: 'Typ wyliczeniowy enum', blurb: 'z góry ustalona lista wartości', minutes: 5,
      content: [
        ANA('🚦', 'Sygnalizator ma <b>tylko trzy</b> możliwe stany: CZERWONY, ŻÓŁTY, ZIELONY. Nie ma „fioletowego”. <b>enum</b> to typ, który wolno ustawić <b>wyłącznie</b> na jedną z wymienionych wartości. Kompilator pilnuje literówek.'),
        VIZ('cells', { title: 'enum Poziom { LATWY, SREDNI, TRUDNY }', rows: [{ label: 'wartości', cells: ['LATWY', 'SREDNI', 'TRUDNY'], shape: 'bubble' }] }),
        CODE(J`enum Poziom {
    LATWY, SREDNI, TRUDNY
}

public class Main {
    public static void main(String[] args) {
        Poziom p = Poziom.SREDNI;
        System.out.println(p);
        System.out.println(Poziom.values().length);
        if (p == Poziom.SREDNI) {
            System.out.println("Srednio");
        }
    }
}
`, 'SREDNI\n3\nSrednio'),
        LI(['Wartości zapisujemy <b>WIELKIMI LITERAMI</b>, oddzielone przecinkami.', 'Używamy ich przez nazwę typu: <code>Poziom.SREDNI</code>.', '<code>Poziom.values()</code> daje tablicę wszystkich wartości. Wartości porównujemy przez <code>==</code>.', 'Wypisanie wartości pokazuje jej nazwę.']),
      ],
      guide: {
        files: [FL('Poziom.java', ''), FL('Main.java', MAINW([]))],
        steps: [
          { say: '<p>W pliku <code>Poziom.java</code> zamiast <code>class</code> użyj słowa <code>enum</code> i nazwij typ <code>Poziom</code>.</p>', type: 'enum Poziom {', expect: J`enum\s+Poziom\s*\{` },
          { say: '<p>Wypisz trzy możliwe wartości wielkimi literami, po przecinku, i zamknij klamrę.</p>', type: '    LATWY, SREDNI, TRUDNY\n}', expect: J`LATWY\s*,\s*SREDNI\s*,\s*TRUDNY\s*\}` },
          { say: '<p>W <code>Main.java</code> (w <code>main</code>) ustaw zmienną na jedną z wartości: nazwa typu, kropka, wartość.</p>', type: 'Poziom p = Poziom.SREDNI;', expect: J`Poziom\s+p\s*=\s*Poziom\.SREDNI\s*;` },
          { say: '<p>Wypisz ją.</p>', type: 'System.out.println(p);', expect: J`println\s*\(\s*p\s*\)` },
        ],
        solution: [FL('Poziom.java', 'enum Poziom {\n    LATWY, SREDNI, TRUDNY\n}\n'), FL('Main.java', MAINW(['Poziom p = Poziom.SREDNI;', 'System.out.println(p);']))],
        checks: [
          CK(CR, 'Poziom jest enumem z trzema wartościami', J`isTrue("Poziom ma być typem enum", cls("Poziom").isEnum()); eq(3, cls("Poziom").getEnumConstants().length); eq("LATWY", String.valueOf(cls("Poziom").getEnumConstants()[0]));`),
          CK(CR, 'Program wypisuje SREDNI', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [SREDNI] – program wypisał: " + o, o.equals(Arrays.asList("SREDNI")));`),
        ],
      },
      exercise: {
        prompt: '<p>Stwórz <code>enum Kolor</code> z wartościami <code>CZERWONY</code>, <code>ZIELONY</code>, <code>NIEBIESKI</code>. W <code>main</code> wypisz <code>Kolor.ZIELONY</code>, a w drugiej linii <b>liczbę wszystkich kolorów</b> (użyj <code>Kolor.values().length</code>).</p><pre>ZIELONY\n3</pre>',
        files: [FL('Kolor.java', ''), FL('Main.java', MAINW([]))],
        hints: ['<code>enum Kolor { CZERWONY, ZIELONY, NIEBIESKI }</code> w pliku Kolor.java', '<code>System.out.println(Kolor.values().length);</code>'],
        solution: [FL('Kolor.java', 'enum Kolor {\n    CZERWONY, ZIELONY, NIEBIESKI\n}\n'), FL('Main.java', MAINW(['System.out.println(Kolor.ZIELONY);', 'System.out.println(Kolor.values().length);']))],
        checks: [
          CK(CR, 'Kolor jest enumem z właściwymi wartościami', J`isTrue("Kolor ma być typem enum", cls("Kolor").isEnum()); List<String> n = new ArrayList<>(); for (Object o : cls("Kolor").getEnumConstants()) n.add(o.toString()); eq(Arrays.asList("CZERWONY", "ZIELONY", "NIEBIESKI"), n);`),
          CK(CR, 'Wynik: ZIELONY i 3', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [ZIELONY, 3] – program wypisał: " + o, o.equals(Arrays.asList("ZIELONY", "3")));`),
        ],
      },
      quiz: [
        Q('Do czego służy enum?', ['do zdefiniowania typu z ustaloną listą możliwych wartości', 'do wczytywania danych', 'do tworzenia tablic', 'do wypisywania tekstu'], 0, 'Np. dni tygodnia, poziomy trudności, kolory.'),
        Q('Jak zapisać wartość enuma <code>Poziom</code> o nazwie <code>TRUDNY</code>?', ['Poziom.TRUDNY', 'new Poziom("TRUDNY")', 'Poziom("TRUDNY")', 'TRUDNY.Poziom'], 0, 'Nazwa typu, kropka, nazwa wartości.'),
        OUTQ('Co wypisze program?', ['2', '3', '0', '1'], 0, '<code>values()</code> zwraca tablicę wszystkich wartości enuma.', 'enum Dzien {\n    PN, WT\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(Dzien.values().length);\n    }\n}\n'),
        Q('Jak porównujemy wartości enuma?', ['przez ==', 'tylko przez equals', 'przez =', 'nie da się'], 0, 'Dla enumów <code>==</code> jest poprawne i zalecane.'),
      ],
    },

    /* ---------- 18. MODYFIKATORY ---------- */
    {
      id: 'klasy-modyfikatory', title: 'Modyfikatory dostępu', blurb: 'public, private, protected, brak', minutes: 5,
      content: [
        ANA('🏠', 'Dom ma <b>pokoje o różnym dostępie</b>: ogród (<b>public</b>, wejdzie każdy), pokój rodzinny (<b>private</b>, tylko mieszkańcy), sąsiedzi z tej samej ulicy (<b>brak modyfikatora</b>, tylko ten sam pakiet) i krewni (<b>protected</b>, ta sama ulica plus dzieci domu). Modyfikator dostępu mówi, <b>kto może używać</b> pola, metody lub konstruktora.'),
        TERMS([['<code>public</code>', 'dostęp z każdego miejsca programu'], ['<code>private</code>', 'dostęp <b>tylko wewnątrz tej samej klasy</b>'], ['<i>brak</i> (domyślny)', 'dostęp tylko z klas w tym samym pakiecie'], ['<code>protected</code>', 'jak domyślny, a dodatkowo dla klas pochodnych (dziedziczenie – później)']]),
        VIZ('compare', { cols: [
          { icon: '🏟️', title: 'public', c: 'ok', items: ['wszędzie'] },
          { icon: '🤝', title: 'protected / brak', c: 'accent', items: ['ten sam pakiet', 'protected: także klasy pochodne'] },
          { icon: '🔒', title: 'private', c: 'warn', items: ['tylko ta klasa'] }] }),
        CODE(J`class Konto {
    private int saldo = 100;
    public int pokazSaldo() {
        return saldo;
    }
}

public class Main {
    public static void main(String[] args) {
        Konto k = new Konto();
        System.out.println(k.pokazSaldo());
    }
}
`, '100'),
        NOTE('info', 'Próba odczytu <code>k.saldo</code> spoza klasy <code>Konto</code> dałaby błąd kompilacji. Właśnie po to jest <code>private</code>. W następnym module (hermetyzacja) wykorzystasz to w projekcie.'),
      ],
      guide: {
        files: [FL('Konto.java', 'public class Konto {\n    public int saldo;\n\n    public int pokazSaldo() {\n        return saldo;\n    }\n}\n')],
        steps: [
          { say: '<p>Pole <code>saldo</code> jest publiczne, więc każdy może je zmienić. Zamień <code>public</code> przy polu na <code>private</code>: dostęp tylko z wnętrza klasy <code>Konto</code>.</p>', type: '    private int saldo;', expect: J`private\s+int\s+saldo\s*;` },
        ],
        solution: [FL('Konto.java', 'public class Konto {\n    private int saldo;\n\n    public int pokazSaldo() {\n        return saldo;\n    }\n}\n')],
        checks: [
          CK(CR, 'Pole saldo jest private', J`isTrue("Pole saldo powinno być private", isPrivate("Konto", "saldo"));`),
          CK(MD, 'Metoda pokazSaldo() jest nadal public', J`isTrue("pokazSaldo ma pozostać public", Modifier.isPublic(methodMods("Konto", "pokazSaldo")));`),
        ],
      },
      exercise: {
        prompt: '<p>W klasie <code>Sejf</code> zrób pole <code>kod</code> <b>prywatne</b>, a konstruktor oraz metodę <code>otworz(int proba)</code> <b>publiczne</b> (teraz mają dostęp domyślny lub zły).</p>',
        files: [FL('Sejf.java', 'public class Sejf {\n    int kod;\n\n    Sejf(int kod) {\n        this.kod = kod;\n    }\n\n    boolean otworz(int proba) {\n        return proba == kod;\n    }\n}\n')],
        hints: ['<code>private int kod;</code>', 'Dopisz <code>public</code> przed <code>Sejf(int kod)</code> i przed <code>boolean otworz</code>.'],
        solution: [FL('Sejf.java', 'public class Sejf {\n    private int kod;\n\n    public Sejf(int kod) {\n        this.kod = kod;\n    }\n\n    public boolean otworz(int proba) {\n        return proba == kod;\n    }\n}\n')],
        checks: [
          CK(CR, 'Pole kod jest private', J`isTrue("Pole kod powinno być private", isPrivate("Sejf", "kod"));`),
          CK(MD, 'Konstruktor jest public', J`isTrue("Konstruktor ma być public", Modifier.isPublic(ctor("Sejf", int.class).getModifiers()));`),
          CK(MD, 'Metoda otworz jest public i działa', J`isTrue("otworz ma być public", Modifier.isPublic(methodMods("Sejf", "otworz"))); Object s = make("Sejf", 1234); eq(true, call(s, "otworz", 1234)); eq(false, call(s, "otworz", 1));`),
        ],
      },
      quiz: [
        Q('Co oznacza <code>private</code> przy polu?', ['pole jest dostępne tylko wewnątrz tej samej klasy', 'pole jest dostępne dla wszystkich', 'pole jest stałe', 'pole jest statyczne'], 0, '<code>private</code> to najbardziej restrykcyjny dostęp.'),
        Q('Który modyfikator daje dostęp z każdego miejsca programu?', ['public', 'private', 'protected', 'static'], 0, '<code>public</code> to dostęp dla wszystkich.'),
        Q('Co się stanie przy odczycie prywatnego pola z innej klasy (<code>k.saldo</code>)?', ['błąd kompilacji', 'zwróci 0', 'wypisze null', 'program zadziała normalnie'], 0, 'Kompilator nie pozwoli na dostęp do pola private.'),
        Q('Do czego służy brak modyfikatora (dostęp domyślny)?', ['dostęp tylko z klas w tym samym pakiecie', 'dostęp z każdej klasy', 'dostęp tylko z tej klasy', 'zabrania kompilacji'], 0, 'To tzw. dostęp pakietowy.'),
      ],
    },
  ],
  labs: [
    {
      id: 'lab1-z1', title: 'Zadanie 1: Zwierzę', source: 'Zadania 1.pdf – zadanie 1', concepts: ['klasy-przeciazanie', 'klasy-tostring'],
      statement: J`<p>Utwórz klasę <b>Zwierze</b> z publicznymi polami: <code>imie</code>, <code>waga</code>, <code>czyUdomowione</code>.</p>
<ul>
<li>Utwórz <b>konstruktor</b>, który przypisze wartości wszystkim polom klasy.</li>
<li>Utwórz <b>drugi konstruktor</b>, który skorzysta z pierwszego, ma parametry <code>imie</code> oraz <code>waga</code>, a pole <code>czyUdomowione</code> ustawia na <code>false</code>.</li>
<li>Nadpisz metodę <code>toString</code>, która zwraca informacje o zwierzęciu zgodnie z konwencją: <code>„Imię: Azor, waga: 60, czy udomowione: true”</code>.</li>
<li>Utwórz publiczną metodę <code>void czyMaNadwage()</code>, która sprawdza, czy waga jest <b>większa niż 100</b>. Jeśli tak, wyświetla <code>„Zwierzę ma nadwagę!”</code>, w przeciwnym razie <code>„Zwierzę jest zdrowe!”</code>.</li>
</ul>
<p><b>W metodzie <code>main</code> klasy <code>Main</code>:</b> utwórz trzy obiekty klasy Zwierze; wywołaj na każdym <code>toString</code>; wywołaj na każdym <code>czyMaNadwage</code>; umieść trzy zwierzęta w tablicy typu <code>Zwierze</code>; wykorzystując pętlę oblicz <b>średnią wagę</b> wszystkich zwierząt w tablicy i wyświetl ją w konsoli.</p>`,
      notes: 'Przyjmij typy: <code>String imie</code>, <code>int waga</code>, <code>boolean czyUdomowione</code>. W Javie piszemy <code>toString</code> (małą literą), a pole boolean można nazwać dokładnie <code>czyUdomowione</code>.',
      files: [
        { name: 'Zwierze.java', code: J`public class Zwierze {

}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {

    }
}
` }],
      hints: ['Zacznij od pól i pełnego konstruktora, dopiero potem drugi konstruktor z <code>this(imie, waga, false)</code>.', 'W <code>czyMaNadwage</code> użyj <code>if (waga > 100)</code> – dokładnie 100 jest jeszcze „zdrowe”.', 'Średnia: suma wag w pętli po tablicy, potem <code>(double) suma / zwierzeta.length</code>.'],
      solution: [
        { name: 'Zwierze.java', code: J`public class Zwierze {
    public String imie;
    public int waga;
    public boolean czyUdomowione;

    public Zwierze(String imie, int waga, boolean czyUdomowione) {
        this.imie = imie;
        this.waga = waga;
        this.czyUdomowione = czyUdomowione;
    }

    public Zwierze(String imie, int waga) {
        this(imie, waga, false);
    }

    @Override
    public String toString() {
        return "Imię: " + imie + ", waga: " + waga + ", czy udomowione: " + czyUdomowione;
    }

    public void czyMaNadwage() {
        if (waga > 100) {
            System.out.println("Zwierzę ma nadwagę!");
        } else {
            System.out.println("Zwierzę jest zdrowe!");
        }
    }
}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {
        Zwierze z1 = new Zwierze("Azor", 60, true);
        Zwierze z2 = new Zwierze("Lew", 190);
        Zwierze z3 = new Zwierze("Kot", 4, true);

        System.out.println(z1.toString());
        System.out.println(z2.toString());
        System.out.println(z3.toString());

        z1.czyMaNadwage();
        z2.czyMaNadwage();
        z3.czyMaNadwage();

        Zwierze[] zwierzeta = {z1, z2, z3};
        int suma = 0;
        for (int i = 0; i < zwierzeta.length; i++) {
            suma += zwierzeta[i].waga;
        }
        double srednia = (double) suma / zwierzeta.length;
        System.out.println("Średnia waga: " + srednia);
    }
}
` }],
      checks: [
        CK(CR, 'Klasa Zwierze ma pola imie, waga, czyUdomowione', J`isTrue("Brak pola imie", hasField("Zwierze", "imie"));
isTrue("Brak pola waga", hasField("Zwierze", "waga"));
isTrue("Brak pola czyUdomowione", hasField("Zwierze", "czyUdomowione"));`),
        CK(MN, 'Pola są publiczne', J`for (String f : new String[]{"imie", "waga", "czyUdomowione"})
    isTrue("Pole " + f + " powinno być public", Modifier.isPublic(fieldMods("Zwierze", f)));`),
        CK(CR, 'Konstruktor (imie, waga, czyUdomowione) ustawia wszystkie pola', J`Object z = make("Zwierze", "Azor", 60, true);
eq("Azor", field(z, "imie")); eq(60, field(z, "waga")); eq(true, field(z, "czyUdomowione"));`),
        CK(CR, 'Drugi konstruktor (imie, waga) ustawia czyUdomowione = false', J`Object z = make("Zwierze", "Lew", 190);
eq("Lew", field(z, "imie")); eq(190, field(z, "waga")); eq(false, field(z, "czyUdomowione"));`),
        CK(MD, 'Drugi konstruktor korzysta z pierwszego (this(...))', J`isTrue("Drugi konstruktor ma wywołać pierwszy przez this(imie, waga, false)", srcHas("Zwierze", "this\\s*\\("));`),
        CK(CR, 'toString zwraca dokładnie „Imię: Azor, waga: 60, czy udomowione: true”', J`Object z = make("Zwierze", "Azor", 60, true);
eq("Imię: Azor, waga: 60, czy udomowione: true", z.toString());`),
        CK(MD, 'toString tylko zwraca tekst (nie wypisuje go)', J`Object z = make("Zwierze", "Azor", 60, true);
eq("", out(() -> z.toString()));`),
        CK(CR, 'czyMaNadwage: powyżej 100 → „Zwierzę ma nadwagę!”', J`Object z = make("Zwierze", "Lew", 190);
eq("Zwierzę ma nadwagę!", out(() -> call(z, "czyMaNadwage")).trim());`),
        CK(CR, 'czyMaNadwage: do 100 włącznie → „Zwierzę jest zdrowe!”', J`Object z = make("Zwierze", "Kot", 100);
eq("Zwierzę jest zdrowe!", out(() -> call(z, "czyMaNadwage")).trim());
Object y = make("Zwierze", "Mysz", 1);
eq("Zwierzę jest zdrowe!", out(() -> call(y, "czyMaNadwage")).trim());`),
        CK(MN, 'czyMaNadwage jest metodą void', J`eq(void.class, method("Zwierze", "czyMaNadwage").getReturnType());`),
        CK(CR, 'Main tworzy co najmniej trzy obiekty Zwierze', J`isTrue("W Main utwórz trzy obiekty klasy Zwierze", srcCount(src("Main"), "new\\s+Zwierze\\s*\\(") >= 3);`),
        CK(MD, 'Main wypisuje toString (3 × „Imię:”) i komunikaty o wadze (3×)', J`String o = runMain();
isTrue("Spodziewano się 3 linii z 'Imię:' – znaleziono " + count(o, "Imię:"), count(o, "Imię:") >= 3);
isTrue("Spodziewano się 3 komunikatów 'nadwagę!' lub 'zdrowe!'", count(o, "nadwagę!") + count(o, "zdrowe!") >= 3);`),
        CK(MD, 'Zwierzęta są w tablicy typu Zwierze[]', J`isTrue("Umieść zwierzęta w tablicy typu Zwierze[]", srcHas("Main", "Zwierze\\s*\\[\\s*\\]"));`),
        CK(CR, 'Main wyświetla poprawną średnią wagę zwierząt z tablicy', J`String o = runMain();
List<Double> w = new ArrayList<>();
Matcher m = Pattern.compile("waga:\\s*(\\d+(?:[.,]\\d+)?)").matcher(o);
while (m.find()) w.add(Double.parseDouble(m.group(1).replace(',', '.')));
isTrue("Nie udało się odczytać wag z wydruku toString (3 × 'waga: N')", w.size() >= 3);
double avg = (w.get(0) + w.get(1) + w.get(2)) / 3.0;
String rest = o.substring(o.lastIndexOf("waga:"));
rest = rest.substring(rest.indexOf('\n') + 1);
List<String> cand = new ArrayList<>(Arrays.asList(String.valueOf(avg), String.format(Locale.US, "%.2f", avg), String.format(Locale.US, "%.1f", avg), String.format(Locale.US, "%.2f", avg).replace('.', ','), String.format(Locale.US, "%.1f", avg).replace('.', ',')));
if (avg == Math.rint(avg)) cand.add(String.valueOf((long) avg));
boolean ok = false;
for (String c : cand) if (rest.contains(c) || o.substring(o.lastIndexOf('\n', o.length() - 2) + 1).contains(c)) ok = true;
isTrue("Spodziewana średnia waga to " + avg + " (np. 84.666...) – nie znalazłem jej w wydruku po liniach z toString/nadwagą. Wydruk: " + o, ok);`),
        CK(MN, 'Średnia liczona w pętli', J`isTrue("Użyj pętli for/while do zsumowania wag", srcHas("Main", "\\b(for|while)\\s*\\("));`),
      ],
    },

    {
      id: 'lab1-z2', title: 'Zadanie 2: Sala, zajęcia, studenci', source: 'Zadania 1.pdf – zadanie 2', concepts: ['klasy-tablica-obiektow', 'klasy-enum'],
      statement: J`<p>Utwórz klasę <b>Student</b> z publicznymi polami: <code>imie</code>, <code>nazwisko</code>, <code>nrAlbumu</code> i konstruktor inicjalizujący wszystkie pola.</p>
<p>Utwórz klasę <b>Prowadzacy</b> z publicznymi polami: <code>imie</code>, <code>nazwisko</code>, <code>stanowisko</code> (enumerator: do wyboru tylko asystent, adiunkt, profesor) i konstruktor inicjalizujący wszystkie pola.</p>
<p>Utwórz klasę <b>BlokZajeciowy</b> z publicznymi polami: <code>nazwaPrzedmiotu</code>, <code>prowadzacy</code>, <code>studenci</code> (tablica obiektów klasy Student) i konstruktor inicjalizujący wszystkie pola.</p>
<p>Utwórz klasę <b>Sala</b> z publicznymi polami: <code>numer</code>, <code>zajecia</code> (tablica typu BlokZajeciowy o długości 8), <code>dzien</code> (enumerator: dni od poniedziałku do piątku). Zajęcia w sali odbywają się w godzinnych blokach; bloków jest 8 (numery 0–7). Sala jest dostępna tylko w jeden dzień tygodnia. Konstruktor inicjalizuje <b>numer i dzień</b>.</p>
<p>We <b>wszystkich klasach nadpisz toString</b>. W BlokZajeciowy wyświetla m.in. <b>liczbę studentów</b> (nie wypisuje wszystkich). W klasie Sala – informacje o wszystkich zajęciach: w których numerach bloków się odbywają i które bloki są jeszcze wolne.</p>
<p>W klasie Sala dodaj metodę <code>boolean DodajZajecieDoSali(BlokZajeciowy z, int numerBloku)</code> – jeżeli możliwe (na pozycji jest <code>null</code>) doda zajęcia do wybranego bloku, oraz <code>boolean UsunZajeciaZSali(int numerBloku)</code> – usuwa zajęcia z bloku (wstawia <code>null</code>). Metody zwracają <code>true</code>, gdy operacja się powiodła, a <code>false</code> w przeciwnym razie.</p>`,
      notes: 'Przyjmij: <code>Student(String imie, String nazwisko, int nrAlbumu)</code>, <code>Prowadzacy(String imie, String nazwisko, Stanowisko stanowisko)</code>, <code>BlokZajeciowy(String nazwaPrzedmiotu, Prowadzacy prowadzacy, Student[] studenci)</code>, <code>Sala(int numer, Dzien dzien)</code>. Enumy to osobne pliki: <code>Stanowisko</code> (ASYSTENT, ADIUNKT, PROFESOR) i <code>Dzien</code> (PONIEDZIALEK, WTOREK, SRODA, CZWARTEK, PIATEK). Nazwy metod z PDF zaczynają się wielką literą – test uzna też wersję z małej litery (<code>dodajZajecieDoSali</code>), zgodną z konwencją Javy. Wypisanie w Main jest dowolne.',
      files: [
        { name: 'Stanowisko.java', code: J`public enum Stanowisko {

}
` },
        { name: 'Dzien.java', code: J`public enum Dzien {

}
` },
        { name: 'Student.java', code: J`public class Student {

}
` },
        { name: 'Prowadzacy.java', code: J`public class Prowadzacy {

}
` },
        { name: 'BlokZajeciowy.java', code: J`public class BlokZajeciowy {

}
` },
        { name: 'Sala.java', code: J`public class Sala {

}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {

    }
}
` }],
      hints: ['Zacznij od enumów i prostych klas (Student, Prowadzacy). Sala: <code>public BlokZajeciowy[] zajecia = new BlokZajeciowy[8];</code>', 'DodajZajecieDoSali: najpierw sprawdź, czy <code>numerBloku</code> jest w zakresie 0–7, potem czy <code>zajecia[numerBloku] == null</code>.', 'toString Sali zbuduj w pętli po blokach: dla <code>null</code> wypisz „wolny”, w przeciwnym razie nazwę przedmiotu (<code>StringBuilder</code> lub sklejanie).'],
      solution: [
        { name: 'Stanowisko.java', code: J`public enum Stanowisko {
    ASYSTENT, ADIUNKT, PROFESOR
}
` },
        { name: 'Dzien.java', code: J`public enum Dzien {
    PONIEDZIALEK, WTOREK, SRODA, CZWARTEK, PIATEK
}
` },
        { name: 'Student.java', code: J`public class Student {
    public String imie;
    public String nazwisko;
    public int nrAlbumu;

    public Student(String imie, String nazwisko, int nrAlbumu) {
        this.imie = imie;
        this.nazwisko = nazwisko;
        this.nrAlbumu = nrAlbumu;
    }

    @Override
    public String toString() {
        return imie + " " + nazwisko + " (" + nrAlbumu + ")";
    }
}
` },
        { name: 'Prowadzacy.java', code: J`public class Prowadzacy {
    public String imie;
    public String nazwisko;
    public Stanowisko stanowisko;

    public Prowadzacy(String imie, String nazwisko, Stanowisko stanowisko) {
        this.imie = imie;
        this.nazwisko = nazwisko;
        this.stanowisko = stanowisko;
    }

    @Override
    public String toString() {
        return stanowisko + " " + imie + " " + nazwisko;
    }
}
` },
        { name: 'BlokZajeciowy.java', code: J`public class BlokZajeciowy {
    public String nazwaPrzedmiotu;
    public Prowadzacy prowadzacy;
    public Student[] studenci;

    public BlokZajeciowy(String nazwaPrzedmiotu, Prowadzacy prowadzacy, Student[] studenci) {
        this.nazwaPrzedmiotu = nazwaPrzedmiotu;
        this.prowadzacy = prowadzacy;
        this.studenci = studenci;
    }

    @Override
    public String toString() {
        return nazwaPrzedmiotu + ", prowadzący: " + prowadzacy + ", liczba studentów: " + studenci.length;
    }
}
` },
        { name: 'Sala.java', code: J`public class Sala {
    public int numer;
    public BlokZajeciowy[] zajecia = new BlokZajeciowy[8];
    public Dzien dzien;

    public Sala(int numer, Dzien dzien) {
        this.numer = numer;
        this.dzien = dzien;
    }

    public boolean DodajZajecieDoSali(BlokZajeciowy z, int numerBloku) {
        if (numerBloku < 0 || numerBloku >= zajecia.length) {
            return false;
        }
        if (zajecia[numerBloku] != null) {
            return false;
        }
        zajecia[numerBloku] = z;
        return true;
    }

    public boolean UsunZajeciaZSali(int numerBloku) {
        if (numerBloku < 0 || numerBloku >= zajecia.length || zajecia[numerBloku] == null) {
            return false;
        }
        zajecia[numerBloku] = null;
        return true;
    }

    @Override
    public String toString() {
        String opis = "Sala " + numer + " (" + dzien + ")\n";
        for (int i = 0; i < zajecia.length; i++) {
            if (zajecia[i] == null) {
                opis += "blok " + i + ": wolny\n";
            } else {
                opis += "blok " + i + ": " + zajecia[i] + "\n";
            }
        }
        return opis;
    }
}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {
        Student s1 = new Student("Ola", "Nowak", 1001);
        Student s2 = new Student("Jan", "Kowal", 1002);
        Prowadzacy p = new Prowadzacy("Anna", "Konopka", Stanowisko.ADIUNKT);
        BlokZajeciowy java = new BlokZajeciowy("Java", p, new Student[]{s1, s2});
        Sala sala = new Sala(12, Dzien.SRODA);
        sala.DodajZajecieDoSali(java, 2);
        System.out.println(sala);
    }
}
` }],
      checks: [
        CK(CR, 'Enum Stanowisko ma wartości ASYSTENT, ADIUNKT, PROFESOR', J`isTrue("Stanowisko musi być enumem", cls("Stanowisko").isEnum());
List<String> n = new ArrayList<>(); for (Object o : cls("Stanowisko").getEnumConstants()) n.add(o.toString());
eq(Arrays.asList("ASYSTENT", "ADIUNKT", "PROFESOR"), n);`),
        CK(CR, 'Enum Dzien ma dni od poniedziałku do piątku', J`isTrue("Dzien musi być enumem", cls("Dzien").isEnum());
List<String> n = new ArrayList<>(); for (Object o : cls("Dzien").getEnumConstants()) n.add(o.toString());
eq(Arrays.asList("PONIEDZIALEK", "WTOREK", "SRODA", "CZWARTEK", "PIATEK"), n);`),
        CK(CR, 'Student: pola i konstruktor (imie, nazwisko, nrAlbumu)', J`Object s = make("Student", "Ola", "Nowak", 1001);
eq("Ola", field(s, "imie")); eq("Nowak", field(s, "nazwisko")); eq(1001, field(s, "nrAlbumu"));`),
        CK(CR, 'Prowadzacy: pola i konstruktor (imie, nazwisko, stanowisko)', J`Object st = cls("Stanowisko").getEnumConstants()[1];
Object p = make("Prowadzacy", "Anna", "Konopka", st);
eq("Anna", field(p, "imie")); eq("Konopka", field(p, "nazwisko")); isTrue("stanowisko", field(p, "stanowisko") == st);`),
        CK(CR, 'BlokZajeciowy: pola i konstruktor', J`Object st = cls("Stanowisko").getEnumConstants()[0];
Object p = make("Prowadzacy", "A", "B", st);
Object s = make("Student", "Ola", "Nowak", 1);
Object[] studenci = (Object[]) java.lang.reflect.Array.newInstance(cls("Student"), 2);
studenci[0] = s; studenci[1] = make("Student", "Jan", "K", 2);
Object b = make("BlokZajeciowy", "Java", p, studenci);
eq("Java", field(b, "nazwaPrzedmiotu")); isTrue("prowadzacy", field(b, "prowadzacy") == p); isTrue("studenci", field(b, "studenci") == studenci);`),
        CK(CR, 'Sala: tablica zajecia ma długość 8, a konstruktor ustawia numer i dzień', J`Object d = cls("Dzien").getEnumConstants()[2];
Object sala = make("Sala", 12, d);
eq(12, field(sala, "numer")); isTrue("dzien", field(sala, "dzien") == d);
Object[] z = (Object[]) field(sala, "zajecia");
eq(8, z.length);
for (Object o : z) isTrue("Na początku wszystkie bloki powinny być null", o == null);`),
        CK(CR, 'DodajZajecieDoSali wstawia zajęcia w wybranym bloku i zwraca true', J`Object sala = make("Sala", 1, cls("Dzien").getEnumConstants()[0]);
Object b = make("BlokZajeciowy", "Java", null, java.lang.reflect.Array.newInstance(cls("Student"), 0));
String m = hasMethod("Sala", "DodajZajecieDoSali") ? "DodajZajecieDoSali" : "dodajZajecieDoSali";
eq(true, call(sala, m, b, 3));
isTrue("Blok 3 powinien zawierać dodane zajęcia", ((Object[]) field(sala, "zajecia"))[3] == b);`),
        CK(CR, 'Dodanie do zajętego bloku zwraca false i nic nie nadpisuje', J`Object sala = make("Sala", 1, cls("Dzien").getEnumConstants()[0]);
Object arr = java.lang.reflect.Array.newInstance(cls("Student"), 0);
Object b1 = make("BlokZajeciowy", "Java", null, arr), b2 = make("BlokZajeciowy", "Fizyka", null, arr);
String m = hasMethod("Sala", "DodajZajecieDoSali") ? "DodajZajecieDoSali" : "dodajZajecieDoSali";
eq(true, call(sala, m, b1, 4));
eq(false, call(sala, m, b2, 4));
isTrue("Zajęty blok nie może zostać nadpisany", ((Object[]) field(sala, "zajecia"))[4] == b1);`),
        CK(MD, 'Dodanie poza zakresem 0–7 zwraca false (bez wyjątku)', J`Object sala = make("Sala", 1, cls("Dzien").getEnumConstants()[0]);
Object b = make("BlokZajeciowy", "Java", null, java.lang.reflect.Array.newInstance(cls("Student"), 0));
String m = hasMethod("Sala", "DodajZajecieDoSali") ? "DodajZajecieDoSali" : "dodajZajecieDoSali";
eq(false, call(sala, m, b, 8)); eq(false, call(sala, m, b, -1));`),
        CK(CR, 'UsunZajeciaZSali: usuwa (null) i zwraca true, a dla pustego bloku false', J`Object sala = make("Sala", 1, cls("Dzien").getEnumConstants()[0]);
Object b = make("BlokZajeciowy", "Java", null, java.lang.reflect.Array.newInstance(cls("Student"), 0));
String add = hasMethod("Sala", "DodajZajecieDoSali") ? "DodajZajecieDoSali" : "dodajZajecieDoSali";
String del = hasMethod("Sala", "UsunZajeciaZSali") ? "UsunZajeciaZSali" : "usunZajeciaZSali";
call(sala, add, b, 5);
eq(true, call(sala, del, 5));
isTrue("Po usunięciu blok powinien być null", ((Object[]) field(sala, "zajecia"))[5] == null);
eq(false, call(sala, del, 5));`),
        CK(MD, 'BlokZajeciowy.toString podaje liczbę studentów', J`Object arr = java.lang.reflect.Array.newInstance(cls("Student"), 7);
Object b = make("BlokZajeciowy", "Java", null, arr);
String t = b.toString();
isTrue("toString bloku powinien zawierać liczbę studentów (7) – a zwraca: " + t, t.contains("7"));
isTrue("toString bloku powinien zawierać nazwę przedmiotu – a zwraca: " + t, t.contains("Java"));`),
        CK(MD, 'Sala.toString pokazuje zajęcia i wolne bloki', J`Object sala = make("Sala", 1, cls("Dzien").getEnumConstants()[0]);
String pusta = sala.toString();
isTrue("toString pustej sali powinien wspominać o wolnych blokach (np. słowo 'wolny') – zwraca: " + pusta, pusta.toLowerCase().contains("wol"));
Object b = make("BlokZajeciowy", "Algebra", null, java.lang.reflect.Array.newInstance(cls("Student"), 0));
String add = hasMethod("Sala", "DodajZajecieDoSali") ? "DodajZajecieDoSali" : "dodajZajecieDoSali";
call(sala, add, b, 2);
String t = sala.toString();
isTrue("toString sali powinien zawierać nazwę zajęć (Algebra) – zwraca: " + t, t.contains("Algebra"));`),
        CK(MN, 'Pozostałe klasy też nadpisują toString', J`for (String c : new String[]{"Student", "Prowadzacy", "BlokZajeciowy", "Sala"}) {
    boolean has = false;
    for (Method m : cls(c).getDeclaredMethods()) if (m.getName().equals("toString") && m.getParameterCount() == 0) has = true;
    isTrue("Klasa " + c + " powinna nadpisywać toString", has);
}`),
      ],
    },

    {
      id: 'lab1-z3', title: 'Zadanie 3: Obliczenia na tablicy', source: 'Zadania 1.pdf – zadanie 3', concepts: ['klasy-modyfikatory', 'klasy-przeciazanie'],
      statement: J`<p>Utwórz klasę <b>ObliczeniaNaTablicy</b>. Klasa posiada <b>prywatne</b> pole <code>mojaTablica</code> przechowujące tablicę typu <code>int</code>. W klasie:</p>
<ul>
<li>Dodaj <b>konstruktor</b>, przyjmujący jako parametr daną tablicę.</li>
<li>Dodaj <b>prywatną</b> metodę <code>int[] generujTablice(int rozmiar, int a, int b)</code>, która generuje tablicę o rozmiarze <code>rozmiar</code> z wartościami całkowitymi <b>losowymi z przedziału [a, b]</b>. (Zaimportuj <code>java.util.Random</code>, utwórz <code>Random rand = new Random()</code> i skorzystaj z metody <code>nextInt(gornaGranica)</code>.)</li>
<li>Dodaj <b>konstruktor</b> przyjmujący liczbę elementów tablicy i wartości a i b, który wywoła funkcję generujTablice, aby przypisać wartość tablicy mojaTablica.</li>
<li>Utwórz publiczną metodę <code>double zwrocSrednia()</code> – średnia ze wszystkich elementów.</li>
<li>Utwórz publiczną metodę <code>int zwrocSume()</code> – suma wszystkich elementów.</li>
<li>Nadpisz metodę <code>toString</code>, w której zwracane będą wszystkie elementy tablicy oddzielone przecinkami.</li>
</ul>
<p>Przetestuj działanie wszystkich dostępnych metod i konstruktorów w funkcji <code>main</code>.</p>`,
      notes: 'W treści jest zapis „zwrocSrednią/generujTablicę” z polskimi znakami – w kodzie używaj nazw bez ogonków: <code>zwrocSrednia</code>, <code>zwrocSume</code>, <code>generujTablice</code>. Przedział [a, b] jest domknięty – oba końce mogą się pojawić.',
      files: [
        { name: 'ObliczeniaNaTablicy.java', code: J`public class ObliczeniaNaTablicy {

}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {

    }
}
` }],
      hints: ['Losowanie z [a, b]: <code>a + rand.nextInt(b - a + 1)</code>.', 'Drugi konstruktor: <code>this.mojaTablica = generujTablice(liczba, a, b);</code> – wolno wołać prywatną metodę wewnątrz klasy.', 'toString: pętla budująca napis, przecinek tylko <i>pomiędzy</i> elementami (nie na końcu).'],
      solution: [
        { name: 'ObliczeniaNaTablicy.java', code: J`import java.util.Random;

public class ObliczeniaNaTablicy {
    private int[] mojaTablica;

    public ObliczeniaNaTablicy(int[] tablica) {
        this.mojaTablica = tablica;
    }

    public ObliczeniaNaTablicy(int liczbaElementow, int a, int b) {
        this.mojaTablica = generujTablice(liczbaElementow, a, b);
    }

    private int[] generujTablice(int rozmiar, int a, int b) {
        Random rand = new Random();
        int[] wynik = new int[rozmiar];
        for (int i = 0; i < rozmiar; i++) {
            wynik[i] = a + rand.nextInt(b - a + 1);
        }
        return wynik;
    }

    public double zwrocSrednia() {
        return (double) zwrocSume() / mojaTablica.length;
    }

    public int zwrocSume() {
        int suma = 0;
        for (int i = 0; i < mojaTablica.length; i++) {
            suma += mojaTablica[i];
        }
        return suma;
    }

    @Override
    public String toString() {
        String wynik = "";
        for (int i = 0; i < mojaTablica.length; i++) {
            wynik += mojaTablica[i];
            if (i < mojaTablica.length - 1) {
                wynik += ", ";
            }
        }
        return wynik;
    }
}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {
        ObliczeniaNaTablicy o1 = new ObliczeniaNaTablicy(new int[]{1, 2, 3, 4});
        ObliczeniaNaTablicy o2 = new ObliczeniaNaTablicy(5, 10, 20);
        System.out.println(o1);
        System.out.println(o1.zwrocSume());
        System.out.println(o1.zwrocSrednia());
        System.out.println(o2);
        System.out.println(o2.zwrocSume());
        System.out.println(o2.zwrocSrednia());
    }
}
` }],
      checks: [
        CK(CR, 'Konstruktor z tablicą zapisuje ją w prywatnym polu mojaTablica', J`int[] t = {1, 2, 3};
Object o = make("ObliczeniaNaTablicy", (Object) t);
isTrue("Pole mojaTablica powinno przechowywać przekazaną tablicę", Arrays.equals(t, (int[]) field(o, "mojaTablica")));`),
        CK(MD, 'Pole mojaTablica jest prywatne', J`isTrue("Pole mojaTablica powinno być private", Modifier.isPrivate(fieldMods("ObliczeniaNaTablicy", "mojaTablica")));`),
        CK(MD, 'Metoda generujTablice jest prywatna', J`isTrue("Metoda generujTablice powinna być private", Modifier.isPrivate(method("ObliczeniaNaTablicy", "generujTablice", int.class, int.class, int.class).getModifiers()));`),
        CK(CR, 'zwrocSume zwraca sumę elementów', J`Object o = make("ObliczeniaNaTablicy", (Object) new int[]{4, 5, 6, -1});
eq(14, call(o, "zwrocSume"));`),
        CK(CR, 'zwrocSrednia zwraca średnią jako double (nie dzielenie całkowite)', J`Object o = make("ObliczeniaNaTablicy", (Object) new int[]{1, 2, 4, 4});
Object r = call(o, "zwrocSrednia");
isTrue("zwrocSrednia powinna zwracać double", r instanceof Double);
eq(2.75, r);`),
        CK(CR, 'Konstruktor (liczba, a, b) generuje tablicę o podanym rozmiarze', J`Object o = make("ObliczeniaNaTablicy", 7, 1, 9);
eq(7, ((int[]) field(o, "mojaTablica")).length);`),
        CK(CR, 'Losowe wartości mieszczą się w [a, b]', J`Object o = make("ObliczeniaNaTablicy", 500, 3, 5);
for (int v : (int[]) field(o, "mojaTablica")) isTrue("Wylosowano " + v + " – poza przedziałem [3, 5]", v >= 3 && v <= 5);`),
        CK(MD, 'Oba końce przedziału [a, b] mogą się pojawić (górna granica włącznie)', J`Object o = make("ObliczeniaNaTablicy", 2000, 3, 5);
Set<Integer> s = new HashSet<>(); for (int v : (int[]) field(o, "mojaTablica")) s.add(v);
isTrue("W 2000 losowaniach z [3,5] powinny wystąpić 3, 4 i 5 – wystąpiły: " + s + ". Pamiętaj: nextInt(b - a + 1) + a", s.contains(3) && s.contains(4) && s.contains(5));`),
        CK(MD, 'toString zwraca elementy oddzielone przecinkami', J`Object o = make("ObliczeniaNaTablicy", (Object) new int[]{1, 2, 3});
String t = o.toString().replace(" ", "");
isTrue("Oczekiwano 1,2,3 (z dowolnymi spacjami) – zwrócono: " + o, t.equals("1,2,3"));`),
        CK(MN, 'toString nie kończy się przecinkiem i obsługuje 1 element', J`Object o = make("ObliczeniaNaTablicy", (Object) new int[]{9});
isTrue("Dla jednego elementu spodziewano się 9 – zwrócono: " + o, o.toString().replace(" ", "").equals("9"));`),
        CK(MD, 'Main testuje oba konstruktory i metody (działa bez błędów)', J`isTrue("W Main utwórz dwa obiekty – po jednym z każdego konstruktora", srcCount(src("Main"), "new\\s+ObliczeniaNaTablicy\\s*\\(") >= 2);
String o = runMain();
isTrue("Main powinien coś wypisać", !o.trim().isEmpty());`),
      ],
    },
  ],

  quiz: [
    Q('Do czego służy konstruktor?', ['Do wyświetlania informacji w konsoli', 'Do przypisywania wartości polom klasy', 'Do dodawania liczb', 'Do konstruowania metod'], 1, 'Inicjalizuje obiekt tuż po <code>new</code>.', 'klasy-konstruktor'),
    Q('Co jest prawdą o konstruktorze?', ['może być najwyżej jeden w danej klasie', 'może przyjmować parametry', 'może mieć różne modyfikatory dostępu', 'musi nazywać się tak samo jak klasa, w której się znajduje'], [1, 2, 3], 'Konstruktorów może być wiele (przeciążanie).', 'klasy-konstruktor'),
    Q('<code>this</code>:', ['może być używane w konstruktorach', 'pozwala na odwołanie się do składowych danej klasy', 'służy do wywołania konstruktora', 'to słowo kluczowe'], [0, 1, 2, 3], 'Wszystkie cztery są prawdziwe.', 'klasy-przeciazanie'),
    Q('Klasa to:', ['typ referencyjny', 'szablon, na podstawie którego tworzone są obiekty – instancje', 'inna nazwa na konstruktor'], [0, 1], 'Nie mylić z konstruktorem – to osobny element klasy.', 'klasy-klasa'),
    Q('Modyfikatorem dostępu jest:', ['public', 'personal', 'protected', 'private', 'static', 'package private'], [0, 2, 3, 5], '<code>static</code> nie jest modyfikatorem dostępu.', 'klasy-modyfikatory'),
    Q('Co zwraca metoda, która jest typu <code>void</code>?', ['Liczbę', 'Wartość logiczną', 'Łańcuch znaków', 'Nic nie zwraca'], 3, '<code>void</code> = brak wartości zwracanej.', 'start-metody'),
    Q('Co wypisze program?', ['10 10', '10 5', '5 10', '5 5'], 0, 'Obie zmienne wskazują na ten sam obiekt, więc zmiana przez <code>b</code> widoczna jest przez <code>a</code>.', 'klasy-referencje', { code: J`class Licznik { int n = 5; }

public class Main {
    public static void main(String[] args) {
        Licznik a = new Licznik();
        Licznik b = a;
        b.n = 10;
        System.out.println(a.n + " " + b.n);
    }
}` }),
    Q('Tablica <code>new String[3]</code> zawiera tuż po utworzeniu:', ['trzy puste napisy ""', 'trzy wartości null', 'trzy spacje', 'jest pusta (długość 0)'], 1, 'Elementy typów referencyjnych domyślnie są <code>null</code>.', 'klasy-tablica-obiektow'),
  ],
});
