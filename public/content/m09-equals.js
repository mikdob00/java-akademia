'use strict';
ACAD.modules.push({
  id: 'eq', num: 9, level: 3, icon: '⚖️', title: 'Porównywanie obiektów: equals i hashCode',
  source: 'Wykład 4 – porównywanie obiektów, equals, hashCode · (zadanie własne)',
  summary: 'Dlaczego == nie wystarcza, jak napisać poprawne equals() i hashCode() i jak je wykorzystać do wyszukiwania w tablicy.',
  goals: ['wyjaśnić różnicę między <code>==</code> a <code>equals()</code>', 'napisać poprawną metodę <code>equals(Object o)</code>', 'napisać zgodną z nią metodę <code>hashCode()</code>', 'wyszukać obiekt w tablicy na podstawie jego stanu'],
  lessons: [

    {
      id: 'eq-idea', micro: true, title: 'Dwa pojęcia „takie same”', blurb: 'ten sam obiekt czy taka sama zawartość?', minutes: 4,
      content: [
        ANA('👯', 'Dwie osoby o imieniu Jan Kowalski, ur. 1990, to <b>dwie różne osoby</b> (każda ma swój dowód), ale na papierze mają <b>te same dane</b>. W Javie jest tak samo: obiekt może być <b>tym samym obiektem</b> (ta sama „kartka” w pamięci) albo tylko <b>mieć taką samą zawartość</b>. To dwa różne pytania i Java odpowiada na nie różnymi narzędziami.'),
        VIZ('compare', { cols: [
          { icon: '🪪', title: 'to samo miejsce w pamięci?', c: 'accent', sub: 'operator <code>==</code>', items: ['czy to <b>ten sam</b> obiekt', 'dla obiektów porównuje <b>adresy</b>'] },
          { icon: '📋', title: 'taka sama zawartość?', c: 'ok', sub: 'metoda <code>equals()</code>', items: ['czy dane są <b>takie same</b>', 'klasa sama decyduje, co znaczy „równe”'] }] }),
        NOTE('info', 'W tym module nauczysz się: (1) dlaczego <code>==</code> nie wystarcza, (2) jak napisać własne <code>equals</code>, (3) po co potrzebny jest <code>hashCode</code>, (4) jak wyszukać obiekt w tablicy.'),
      ],
      quiz: [
        Q('Co sprawdza operator <code>==</code> dla dwóch obiektów?', ['czy to ten sam obiekt (ten sam adres)', 'czy mają takie same pola', 'czy są tej samej klasy', 'czy są różne'], 0, 'Dla obiektów porównuje referencje.'),
        Q('Co powinna sprawdzać metoda <code>equals()</code> w klasie Osoba?', ['czy dane osób (np. imię, rok) są takie same', 'czy osoby są w tej samej tablicy', 'czy zmienne mają tę samą nazwę', 'czy osoby są static'], 0, 'To klasa definiuje, co znaczy „równe”.'),
      ],
    },

    {
      id: 'eq-porownanie', title: '== kontra equals na obiektach', blurb: 'dlaczego == zawodzi', minutes: 5,
      content: [
        ANA('🔖', 'Zmienna z obiektem to <b>karteczka z adresem</b>. Operator <code>==</code> porównuje <b>same karteczki</b>: czy wskazują to samo miejsce. Dwa osobno utworzone obiekty (<code>new</code>) mają <b>różne adresy</b>, nawet gdy zawartość jest identyczna, więc <code>==</code> da <code>false</code>.'),
        VIZ('objects', { vars: [{ t: 'Punkt', n: 'a', to: 'o1' }, { t: 'Punkt', n: 'b', to: 'o2' }], objs: [{ id: 'o1', c: 'Punkt', f: [['x', '1'], ['y', '2']] }, { id: 'o2', c: 'Punkt', f: [['x', '1'], ['y', '2']] }], cap: 'Dane identyczne, ale to dwa różne obiekty. Dlatego <code>a == b</code> daje false.' }),
        CODE(J`class Punkt {
    int x, y;

    Punkt(int x, int y) {
        this.x = x;
        this.y = y;
    }
}

public class Main {
    public static void main(String[] args) {
        Punkt a = new Punkt(1, 2);
        Punkt b = new Punkt(1, 2);
        Punkt c = a;
        System.out.println(a == b);
        System.out.println(a == c);
        System.out.println(a.equals(b));
    }
}
`, 'false\ntrue\nfalse'),
        NOTE('warn', 'Ostatnia linia zaskakuje: <code>a.equals(b)</code> też daje <code>false</code>, bo domyślne <code>equals</code> (odziedziczone z <code>Object</code>) robi to samo co <code>==</code>. Żeby działało „po zawartości”, trzeba je <b>nadpisać</b> (następne lekcje).'),
      ],
      guide: {
        files: [FL('Main.java', 'class Punkt {\n    int x, y;\n\n    Punkt(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n    }\n}\n')],
        steps: [
          { say: '<p>W <code>main</code> utwórz dwa osobne punkty o tych samych współrzędnych.</p>', type: 'Punkt a = new Punkt(1, 2);\nPunkt b = new Punkt(1, 2);', expect: J`Punkt\s+a\s*=\s*new\s+Punkt\s*\(\s*1\s*,\s*2\s*\)\s*;\s*Punkt\s+b\s*=\s*new\s+Punkt\s*\(\s*1\s*,\s*2\s*\)\s*;` },
          { say: '<p>Porównaj je operatorem <code>==</code> i wypisz wynik. Spodziewaj się <code>false</code>.</p>', type: 'System.out.println(a == b);', expect: J`System\.out\.println\s*\(\s*a\s*==\s*b\s*\)\s*;` },
          { say: '<p>Zrób trzecią zmienną wskazującą na <b>ten sam</b> obiekt co <code>a</code> i porównaj z nią.</p>', type: 'Punkt c = a;\nSystem.out.println(a == c);', expect: J`Punkt\s+c\s*=\s*a\s*;\s*System\.out\.println\s*\(\s*a\s*==\s*c\s*\)\s*;` },
        ],
        solution: [FL('Main.java', 'class Punkt {\n    int x, y;\n\n    Punkt(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Punkt a = new Punkt(1, 2);\n        Punkt b = new Punkt(1, 2);\n        System.out.println(a == b);\n        Punkt c = a;\n        System.out.println(a == c);\n    }\n}\n')],
        checks: [
          CK(CR, 'Wynik: false, true', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [false, true] – program wypisał: " + o, o.equals(Arrays.asList("false", "true")));`),
        ],
      },
      exercise: {
        prompt: '<p>Utwórz dwa osobne obiekty <code>Osoba("Ala")</code> w zmiennych <code>o1</code>, <code>o2</code> oraz <code>o3 = o1</code>. Wypisz po kolei <code>o1 == o2</code>, <code>o1 == o3</code> i <code>o1.equals(o2)</code>.</p><pre>false\ntrue\nfalse</pre>',
        files: [FL('Main.java', 'class Osoba {\n    String imie;\n\n    Osoba(String imie) {\n        this.imie = imie;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n    }\n}\n')],
        hints: ['<code>Osoba o1 = new Osoba("Ala"); Osoba o2 = new Osoba("Ala"); Osoba o3 = o1;</code>'],
        solution: [FL('Main.java', 'class Osoba {\n    String imie;\n\n    Osoba(String imie) {\n        this.imie = imie;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Osoba o1 = new Osoba("Ala");\n        Osoba o2 = new Osoba("Ala");\n        Osoba o3 = o1;\n        System.out.println(o1 == o2);\n        System.out.println(o1 == o3);\n        System.out.println(o1.equals(o2));\n    }\n}\n')],
        checks: [
          CK(CR, 'Wynik: false, true, false', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [false, true, false] – program wypisał: " + o, o.equals(Arrays.asList("false", "true", "false")));`),
        ],
      },
      quiz: [
        OUTQ('Co wypisze program?', ['false', 'true', 'błąd', '0'], 0, 'To dwa różne obiekty; <code>==</code> porównuje adresy.', 'class A {\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        A x = new A();\n        A y = new A();\n        System.out.println(x == y);\n    }\n}\n'),
        OUTQ('Co wypisze program?', ['true', 'false', 'błąd', 'null'], 0, 'Obie zmienne wskazują ten sam obiekt.', 'class A {\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        A x = new A();\n        A y = x;\n        System.out.println(x == y);\n    }\n}\n'),
        Q('Co robi domyślne <code>equals</code> odziedziczone z Object?', ['to samo co ==, czyli porównuje adresy', 'porównuje wszystkie pola', 'zawsze zwraca true', 'zawsze zwraca false'], 0, 'Żeby porównywać dane, trzeba je nadpisać.'),
      ],
    },

    {
      id: 'eq-string', title: 'Napisy: equals zamiast ==', blurb: 'najczęstszy błąd początkujących', minutes: 4,
      content: [
        ANA('✉️', 'Napis to też obiekt. Dwa napisy z literałem <code>"ala"</code> bywają przypadkiem tą samą kartką, ale napis zbudowany przez <code>new String("ala")</code> to <b>nowa kartka</b>. Dlatego napisy zawsze porównujemy przez <code>equals</code>, które sprawdza <b>znaki</b>.'),
        CODE(J`public class Main {
    public static void main(String[] args) {
        String a = new String("ala");
        String b = new String("ala");
        System.out.println(a == b);
        System.out.println(a.equals(b));
    }
}
`, 'false\ntrue'),
        NOTE('exam', 'Na sprawdzianie: napisy porównujemy <b>zawsze</b> przez <code>equals</code> (albo <code>equalsIgnoreCase</code>, gdy wielkość liter nie ma znaczenia). <code>==</code> na napisach to klasyczny błąd.'),
      ],
      guide: {
        files: [FL('Main.java', MAINW(['String a = new String("ala");', 'String b = new String("ala");']))],
        steps: [
          { say: '<p>Sprawdź <code>==</code>: to osobne obiekty, więc wynik to <code>false</code>.</p>', type: 'System.out.println(a == b);', expect: J`System\.out\.println\s*\(\s*a\s*==\s*b\s*\)\s*;` },
          { say: '<p>Sprawdź zawartość metodą <code>equals</code>.</p>', type: 'System.out.println(a.equals(b));', expect: J`System\.out\.println\s*\(\s*a\.equals\s*\(\s*b\s*\)\s*\)\s*;` },
        ],
        solution: [FL('Main.java', MAINW(['String a = new String("ala");', 'String b = new String("ala");', 'System.out.println(a == b);', 'System.out.println(a.equals(b));']))],
        checks: [
          CK(CR, 'Wynik: false, true', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [false, true] – program wypisał: " + o, o.equals(Arrays.asList("false", "true")));`),
        ],
      },
      exercise: {
        prompt: '<p>Napisz w <code>Main</code> metodę <code>static boolean takieSame(String a, String b)</code>, która porównuje napisy po <b>zawartości</b> (użyj <code>equals</code>).</p>',
        files: [FL('Main.java', 'public class Main {\n    public static void main(String[] args) {\n    }\n}\n')],
        hints: ['<code>return a.equals(b);</code>'],
        solution: [FL('Main.java', 'public class Main {\n    static boolean takieSame(String a, String b) {\n        return a.equals(b);\n    }\n\n    public static void main(String[] args) {\n    }\n}\n')],
        checks: [
          CK(CR, 'Działa dla napisów z różnych obiektów', J`eq(true, callStatic("Main", "takieSame", new String("ala"), new String("ala"))); eq(false, callStatic("Main", "takieSame", "ala", "ola"));`),
          CK(MN, 'Użyto equals i nie użyto ==', J`isTrue("Użyj equals(...)", srcHas("Main", "\\.equals\\s*\\(")); isFalse("Nie używaj == do napisów", srcHas("Main", "a\\s*==\\s*b"));`),
        ],
      },
      quiz: [
        Q('Jak poprawnie porównać zawartość dwóch napisów?', ['a.equals(b)', 'a == b', 'a = b', 'a.same(b)'], 0, '<code>equals</code> porównuje znaki.'),
        OUTQ('Co wypisze program?', ['false<br>true', 'true<br>true', 'false<br>false', 'true<br>false'], 0, 'Dwa nowe obiekty String: różne adresy, ta sama zawartość.', 'public class Main {\n    public static void main(String[] args) {\n        String a = new String("x");\n        String b = new String("x");\n        System.out.println(a == b);\n        System.out.println(a.equals(b));\n    }\n}\n'),
        Q('Którą metodą porównasz napisy bez względu na wielkość liter?', ['equalsIgnoreCase', 'equals', 'compare', '=='], 0, 'Ignoruje różnice małych i dużych liter.'),
      ],
    },

    {
      id: 'eq-equals', title: 'Własne equals()', blurb: 'równość po zawartości', minutes: 7,
      content: [
        ANA('📋', 'Chcesz, żeby dwa punkty o tych samych współrzędnych były „równe”? Nadpisz <code>equals(Object o)</code> i sam zdecyduj, co znaczy „równe”. Szkielet jest zawsze podobny: <b>(1)</b> ten sam obiekt → <code>true</code>, <b>(2)</b> <code>null</code> lub inna klasa → <code>false</code>, <b>(3)</b> rzutowanie i porównanie pól.'),
        VIZ('flow', { title: 'equals(Object o)', steps: [{ t: 'this == o ?', s: 'tak → true', c: 'ok' }, { t: 'o == null lub inna klasa ?', s: 'tak → false', c: 'bad' }, { t: 'rzutuj o na Punkt', s: 'Punkt p = (Punkt) o;', c: 'accent' }, { t: 'porównaj pola', s: 'x == p.x && y == p.y', c: 'ok' }] }),
        CODE(J`class Punkt {
    int x, y;

    Punkt(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Punkt p = (Punkt) o;
        return x == p.x && y == p.y;
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Punkt(1, 2).equals(new Punkt(1, 2)));
        System.out.println(new Punkt(1, 2).equals(new Punkt(1, 3)));
    }
}
`, 'true\nfalse'),
        NOTE('warn', 'Parametr musi mieć typ <code>Object</code>! Jeśli napiszesz <code>equals(Punkt p)</code>, to <b>nie nadpisujesz</b>, tylko przeciążasz, i kolekcje dalej używają starego. Dlatego warto pisać <code>@Override</code>: kompilator wtedy zgłosi błąd.'),
      ],
      guide: {
        files: [FL('Punkt.java', 'public class Punkt {\n    private int x;\n    private int y;\n\n    public Punkt(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n}\n')],
        steps: [
          { say: '<p>Nagłówek metody: <code>@Override</code>, <code>public boolean equals(Object o)</code>. Parametr to <code>Object</code>.</p>', type: '    @Override\n    public boolean equals(Object o) {', expect: J`@Override\s+public\s+boolean\s+equals\s*\(\s*Object\s+o\s*\)\s*\{` },
          { say: '<p>Ten sam obiekt jest zawsze równy sobie.</p>', type: '        if (this == o) {\n            return true;\n        }', expect: J`if\s*\(\s*this\s*==\s*o\s*\)\s*\{\s*return\s+true\s*;\s*\}` },
          { say: '<p><code>null</code> albo obiekt innej klasy nie może być równy.</p>', type: '        if (o == null || getClass() != o.getClass()) {\n            return false;\n        }', expect: J`if\s*\(\s*o\s*==\s*null\s*\|\|\s*getClass\s*\(\s*\)\s*!=\s*o\.getClass\s*\(\s*\)\s*\)\s*\{\s*return\s+false\s*;\s*\}` },
          { say: '<p>Zrzutuj <code>o</code> na <code>Punkt</code>, żeby mieć dostęp do jego pól.</p>', type: '        Punkt p = (Punkt) o;', expect: J`Punkt\s+p\s*=\s*\(\s*Punkt\s*\)\s*o\s*;` },
          { say: '<p>Porównaj pola i zamknij metodę.</p>', type: '        return x == p.x && y == p.y;\n    }', expect: J`return\s+x\s*==\s*p\.x\s*&&\s*y\s*==\s*p\.y\s*;` },
        ],
        solution: [FL('Punkt.java', 'public class Punkt {\n    private int x;\n    private int y;\n\n    public Punkt(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n\n    @Override\n    public boolean equals(Object o) {\n        if (this == o) {\n            return true;\n        }\n        if (o == null || getClass() != o.getClass()) {\n            return false;\n        }\n        Punkt p = (Punkt) o;\n        return x == p.x && y == p.y;\n    }\n}\n')],
        checks: [
          CK(CR, 'Punkty o tych samych współrzędnych są równe', J`eq(true, new Punkt(1, 2).equals(new Punkt(1, 2)));`),
          CK(CR, 'Punkty o różnych współrzędnych nie są równe', J`eq(false, new Punkt(1, 2).equals(new Punkt(1, 3)));`),
          CK(CR, 'null i obiekt innej klasy → false (bez wyjątku)', J`Punkt p = new Punkt(1, 2); eq(false, p.equals(null)); eq(false, p.equals("tekst"));`),
          CK(MD, 'Metoda ma sygnaturę equals(Object)', J`method("Punkt", "equals", Object.class);`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Osoba</code> ma pola <code>imie</code> (String) i <code>wiek</code> (int). Nadpisz <code>equals(Object o)</code>: osoby są równe, gdy mają to samo imię (<code>equals</code> na napisach) i wiek.</p>',
        files: [FL('Osoba.java', 'public class Osoba {\n    private String imie;\n    private int wiek;\n\n    public Osoba(String imie, int wiek) {\n        this.imie = imie;\n        this.wiek = wiek;\n    }\n}\n')],
        hints: ['Szkielet: this == o, null / getClass, rzutowanie.', '<code>return wiek == os.wiek && imie.equals(os.imie);</code>'],
        solution: [FL('Osoba.java', 'public class Osoba {\n    private String imie;\n    private int wiek;\n\n    public Osoba(String imie, int wiek) {\n        this.imie = imie;\n        this.wiek = wiek;\n    }\n\n    @Override\n    public boolean equals(Object o) {\n        if (this == o) {\n            return true;\n        }\n        if (o == null || getClass() != o.getClass()) {\n            return false;\n        }\n        Osoba os = (Osoba) o;\n        return wiek == os.wiek && imie.equals(os.imie);\n    }\n}\n')],
        checks: [
          CK(CR, 'Takie same dane → równe', J`eq(true, new Osoba("Ala", 20).equals(new Osoba("Ala", 20)));`),
          CK(CR, 'Inne imię lub wiek → nierówne', J`eq(false, new Osoba("Ala", 20).equals(new Osoba("Ola", 20))); eq(false, new Osoba("Ala", 20).equals(new Osoba("Ala", 21)));`),
          CK(CR, 'null i inna klasa → false', J`Osoba o = new Osoba("Ala", 20); eq(false, o.equals(null)); eq(false, o.equals("Ala"));`),
          CK(MD, 'Sygnatura equals(Object)', J`method("Osoba", "equals", Object.class);`),
        ],
      },
      quiz: [
        Q('Jaki typ musi mieć parametr nadpisywanej metody <code>equals</code>?', ['Object', 'ten sam typ co klasa', 'String', 'boolean'], 0, 'Inaczej nie nadpisujesz, tylko przeciążasz.'),
        Q('Po co w <code>equals</code> sprawdzamy <code>o == null</code>?', ['żeby uniknąć NullPointerException i zwrócić false', 'żeby przyspieszyć program', 'bo tego wymaga hashCode', 'to nie jest potrzebne'], 0, 'Obiekt <code>null</code> nigdy nie jest równy.'),
        Q('Po co rzutujemy <code>(Punkt) o</code>?', ['żeby dostać się do pól typu Punkt', 'żeby zmienić klasę obiektu', 'żeby uniknąć błędu null', 'żeby wywołać konstruktor'], 0, 'Parametr jest typu Object, więc nie widać pól Punkt.'),
        Q('Co daje adnotacja <code>@Override</code> przy equals?', ['kompilator zgłosi błąd, gdy sygnatura nie nadpisuje metody', 'przyspiesza program', 'zmienia typ zwracany', 'nic'], 0, 'Chroni przed pomyłką np. w typie parametru.'),
      ],
    },

    {
      id: 'eq-objects', title: 'Objects.equals i pola null', blurb: 'bezpieczne porównanie napisów', minutes: 4,
      content: [
        ANA('🛟', 'W <code>equals</code> często porównujesz napisy: <code>imie.equals(os.imie)</code>. A co, gdy <code>imie</code> jest <code>null</code>? Wtedy <b>NullPointerException</b>. Gotowa pomoc: <code>Objects.equals(a, b)</code> działa też dla <code>null</code> (dwa <code>null</code> są równe). Potrzebny jest <code>import java.util.Objects;</code>.'),
        CODE(J`import java.util.Objects;

public class Main {
    public static void main(String[] args) {
        String a = null;
        String b = null;
        System.out.println(Objects.equals(a, b));
        System.out.println(Objects.equals("x", null));
        System.out.println(Objects.equals("x", "x"));
    }
}
`, 'true\nfalse\ntrue'),
        NOTE('tip', 'Dla pól typu <code>int</code> używasz zwykłego <code>==</code>; <code>Objects.equals</code> jest dla pól-obiektów (napisów).'),
      ],
      guide: {
        files: [FL('Osoba.java', 'import java.util.Objects;\n\npublic class Osoba {\n    private String imie;\n    private int wiek;\n\n    public Osoba(String imie, int wiek) {\n        this.imie = imie;\n        this.wiek = wiek;\n    }\n\n    @Override\n    public boolean equals(Object o) {\n        if (this == o) {\n            return true;\n        }\n        if (o == null || getClass() != o.getClass()) {\n            return false;\n        }\n        Osoba os = (Osoba) o;\n        return wiek == os.wiek && imie.equals(os.imie);\n    }\n}\n')],
        steps: [
          { say: '<p>Zamień <code>imie.equals(os.imie)</code> na bezpieczne <code>Objects.equals(imie, os.imie)</code>.</p>', type: '        return wiek == os.wiek && Objects.equals(imie, os.imie);', expect: J`return\s+wiek\s*==\s*os\.wiek\s*&&\s*Objects\.equals\s*\(\s*imie\s*,\s*os\.imie\s*\)\s*;` },
        ],
        solution: [FL('Osoba.java', 'import java.util.Objects;\n\npublic class Osoba {\n    private String imie;\n    private int wiek;\n\n    public Osoba(String imie, int wiek) {\n        this.imie = imie;\n        this.wiek = wiek;\n    }\n\n    @Override\n    public boolean equals(Object o) {\n        if (this == o) {\n            return true;\n        }\n        if (o == null || getClass() != o.getClass()) {\n            return false;\n        }\n        Osoba os = (Osoba) o;\n        return wiek == os.wiek && Objects.equals(imie, os.imie);\n    }\n}\n')],
        checks: [
          CK(CR, 'Imię null nie powoduje wyjątku', J`eq(true, new Osoba(null, 5).equals(new Osoba(null, 5))); eq(false, new Osoba(null, 5).equals(new Osoba("Ala", 5)));`),
          CK(CR, 'Zwykłe dane nadal działają', J`eq(true, new Osoba("Ala", 5).equals(new Osoba("Ala", 5))); eq(false, new Osoba("Ala", 5).equals(new Osoba("Ola", 5)));`),
          CK(MN, 'Użyto Objects.equals', J`isTrue("Użyj Objects.equals(...)", srcHas("Osoba", "Objects\\.equals\\s*\\("));`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Ksiazka</code> ma pola <code>tytul</code> i <code>autor</code> (oba String, mogą być <code>null</code>). Napisz <code>equals(Object o)</code> z użyciem <code>Objects.equals</code> dla obu pól.</p>',
        files: [FL('Ksiazka.java', 'import java.util.Objects;\n\npublic class Ksiazka {\n    private String tytul;\n    private String autor;\n\n    public Ksiazka(String tytul, String autor) {\n        this.tytul = tytul;\n        this.autor = autor;\n    }\n}\n')],
        hints: ['<code>return Objects.equals(tytul, k.tytul) && Objects.equals(autor, k.autor);</code>'],
        solution: [FL('Ksiazka.java', 'import java.util.Objects;\n\npublic class Ksiazka {\n    private String tytul;\n    private String autor;\n\n    public Ksiazka(String tytul, String autor) {\n        this.tytul = tytul;\n        this.autor = autor;\n    }\n\n    @Override\n    public boolean equals(Object o) {\n        if (this == o) {\n            return true;\n        }\n        if (o == null || getClass() != o.getClass()) {\n            return false;\n        }\n        Ksiazka k = (Ksiazka) o;\n        return Objects.equals(tytul, k.tytul) && Objects.equals(autor, k.autor);\n    }\n}\n')],
        checks: [
          CK(CR, 'Równe książki', J`eq(true, new Ksiazka("Lalka", "Prus").equals(new Ksiazka("Lalka", "Prus"))); eq(true, new Ksiazka(null, null).equals(new Ksiazka(null, null)));`),
          CK(CR, 'Różne książki', J`eq(false, new Ksiazka("Lalka", "Prus").equals(new Ksiazka("Lalka", "Inny"))); eq(false, new Ksiazka(null, "Prus").equals(new Ksiazka("Lalka", "Prus")));`),
          CK(CR, 'null i inna klasa → false', J`Ksiazka k = new Ksiazka("A", "B"); eq(false, k.equals(null)); eq(false, k.equals("A"));`),
        ],
      },
      quiz: [
        OUTQ('Co wypisze program?', ['true', 'false', 'błąd NullPointerException', 'null'], 0, 'Dwa <code>null</code> są równe dla Objects.equals.', 'import java.util.Objects;\n\npublic class Main {\n    public static void main(String[] args) {\n        String a = null;\n        String b = null;\n        System.out.println(Objects.equals(a, b));\n    }\n}\n'),
        Q('Co się stanie przy <code>null.equals("x")</code> (zmienna null)?', ['NullPointerException', 'false', 'true', 'nic'], 0, 'Nie można wywołać metody na null.'),
        Q('Do czego służy <code>Objects.equals(a, b)</code>?', ['bezpiecznie porównuje dwa obiekty także gdy są null', 'sortuje obiekty', 'kopiuje obiekt', 'liczy hasz'], 0, 'Chroni przed NullPointerException.'),
      ],
    },

    {
      id: 'eq-hashcode-idea', micro: true, title: 'Po co hashCode()?', blurb: 'numerek szufladki', minutes: 4,
      content: [
        ANA('🗄️', 'Wyobraź sobie szafę z szufladami. Zamiast przeglądać wszystkie papiery, <b>liczysz numerek szuflady</b> z danych (np. z imienia i nazwiska) i zaglądasz tylko tam. Taki numerek to <code>hashCode()</code>. Kolekcje typu <code>HashSet</code> i <code>HashMap</code> najpierw patrzą na numerek, a dopiero potem w szufladzie wołają <code>equals</code>.'),
        VIZ('flow', { title: 'Szukanie w HashSet', steps: [{ t: 'hashCode()', s: 'wylicz numer szuflady', c: 'accent' }, { t: 'otwórz szufladę', s: 'tylko tę jedną', c: 'warn' }, { t: 'equals()', s: 'porównaj z zawartością szuflady', c: 'ok' }] }),
        NOTE('exam', '<b>Złota zasada:</b> jeśli <code>a.equals(b)</code> jest <code>true</code>, to <code>a.hashCode() == b.hashCode()</code> <b>musi</b> też być prawdą. Zmieniając <code>equals</code>, zawsze zmieniaj też <code>hashCode</code>.'),
        NOTE('info', 'Odwrotnie nie musi działać: dwa różne obiekty mogą mieć ten sam numerek (kolizja), to normalne.'),
      ],
      quiz: [
        Q('Jaka zasada łączy <code>equals</code> i <code>hashCode</code>?', ['obiekty równe w equals muszą mieć ten sam hashCode', 'różne obiekty muszą mieć różny hashCode', 'hashCode nie ma związku z equals', 'hashCode musi być zawsze 0'], 0, 'Inaczej HashSet/HashMap nie znajdą obiektu.'),
        Q('Gdzie hashCode jest głównie używany?', ['w HashSet i HashMap', 'w pętlach for', 'w konstruktorach', 'w interfejsach'], 0, 'Do szybkiego wybierania „szuflady”.'),
        Q('Co zrobić po nadpisaniu <code>equals</code>?', ['nadpisać też hashCode', 'nic', 'usunąć konstruktor', 'dodać static'], 0, 'Para jest nierozłączna.'),
      ],
    },

    {
      id: 'eq-hashcode', title: 'Własne hashCode()', blurb: 'Objects.hash(...)', minutes: 5,
      content: [
        ANA('🧮', 'Liczenie numerka ułatwia <code>Objects.hash(pole1, pole2, ...)</code>. Podajesz <b>te same pola, których używasz w <code>equals</code></b>, a Java zrobi z nich jedną liczbę. Dwa obiekty o takich samych polach dostaną ten sam numerek.'),
        CODE(J`import java.util.Objects;

class Punkt {
    int x, y;

    Punkt(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Punkt p = (Punkt) o;
        return x == p.x && y == p.y;
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y);
    }
}

public class Main {
    public static void main(String[] args) {
        Punkt a = new Punkt(1, 2);
        Punkt b = new Punkt(1, 2);
        System.out.println(a.hashCode() == b.hashCode());
    }
}
`, 'true'),
        NOTE('warn', 'Pola użyte w <code>hashCode</code> muszą być <b>tymi samymi</b>, co w <code>equals</code> (lub ich podzbiorem). Dodatkowe pole tylko w <code>hashCode</code> psuje zasadę.'),
      ],
      guide: {
        files: [FL('Punkt.java', 'import java.util.Objects;\n\npublic class Punkt {\n    private int x;\n    private int y;\n\n    public Punkt(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n\n    @Override\n    public boolean equals(Object o) {\n        if (this == o) {\n            return true;\n        }\n        if (o == null || getClass() != o.getClass()) {\n            return false;\n        }\n        Punkt p = (Punkt) o;\n        return x == p.x && y == p.y;\n    }\n}\n')],
        steps: [
          { say: '<p>Dopisz metodę <code>hashCode()</code> zwracającą <code>int</code>.</p>', type: '    @Override\n    public int hashCode() {', expect: J`@Override\s+public\s+int\s+hashCode\s*\(\s*\)\s*\{` },
          { say: '<p>Zwróć numerek zbudowany z pól użytych w <code>equals</code>. Zamknij metodę.</p>', type: '        return Objects.hash(x, y);\n    }', expect: J`return\s+Objects\.hash\s*\(\s*x\s*,\s*y\s*\)\s*;` },
        ],
        solution: [FL('Punkt.java', 'import java.util.Objects;\n\npublic class Punkt {\n    private int x;\n    private int y;\n\n    public Punkt(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n\n    @Override\n    public boolean equals(Object o) {\n        if (this == o) {\n            return true;\n        }\n        if (o == null || getClass() != o.getClass()) {\n            return false;\n        }\n        Punkt p = (Punkt) o;\n        return x == p.x && y == p.y;\n    }\n\n    @Override\n    public int hashCode() {\n        return Objects.hash(x, y);\n    }\n}\n')],
        checks: [
          CK(CR, 'Równe punkty mają równy hasz', J`eq(new Punkt(1, 2).hashCode(), new Punkt(1, 2).hashCode());`),
          CK(CR, 'HashSet traktuje takie same punkty jako jeden element', J`java.util.HashSet<Punkt> s = new java.util.HashSet<>(); s.add(new Punkt(1, 2)); s.add(new Punkt(1, 2)); s.add(new Punkt(3, 4)); eq(2, s.size());`),
          CK(MD, 'Hasz zależy od obu współrzędnych', J`java.util.Set<Integer> h = new java.util.HashSet<>(); for (int i = 0; i < 5; i++) { for (int j = 0; j < 5; j++) { h.add(new Punkt(i, j).hashCode()); } } isTrue("hashCode nie powinien być (prawie) stały", h.size() > 5);`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Osoba</code> ma już <code>equals</code> (imie + wiek). Dopisz zgodne <code>hashCode()</code> z użyciem <code>Objects.hash</code>.</p>',
        files: [FL('Osoba.java', 'import java.util.Objects;\n\npublic class Osoba {\n    private String imie;\n    private int wiek;\n\n    public Osoba(String imie, int wiek) {\n        this.imie = imie;\n        this.wiek = wiek;\n    }\n\n    @Override\n    public boolean equals(Object o) {\n        if (this == o) {\n            return true;\n        }\n        if (o == null || getClass() != o.getClass()) {\n            return false;\n        }\n        Osoba os = (Osoba) o;\n        return wiek == os.wiek && Objects.equals(imie, os.imie);\n    }\n}\n')],
        hints: ['<code>return Objects.hash(imie, wiek);</code>'],
        solution: [FL('Osoba.java', 'import java.util.Objects;\n\npublic class Osoba {\n    private String imie;\n    private int wiek;\n\n    public Osoba(String imie, int wiek) {\n        this.imie = imie;\n        this.wiek = wiek;\n    }\n\n    @Override\n    public boolean equals(Object o) {\n        if (this == o) {\n            return true;\n        }\n        if (o == null || getClass() != o.getClass()) {\n            return false;\n        }\n        Osoba os = (Osoba) o;\n        return wiek == os.wiek && Objects.equals(imie, os.imie);\n    }\n\n    @Override\n    public int hashCode() {\n        return Objects.hash(imie, wiek);\n    }\n}\n')],
        checks: [
          CK(CR, 'Równe osoby mają równy hasz', J`eq(new Osoba("Ala", 20).hashCode(), new Osoba("Ala", 20).hashCode());`),
          CK(CR, 'HashSet usuwa duplikaty osób', J`java.util.HashSet<Osoba> s = new java.util.HashSet<>(); s.add(new Osoba("Ala", 20)); s.add(new Osoba("Ala", 20)); s.add(new Osoba("Ola", 20)); eq(2, s.size());`),
          CK(CR, 'null w imieniu nie powoduje wyjątku', J`new Osoba(null, 3).hashCode();`),
        ],
      },
      quiz: [
        Q('Jak zbudować <code>hashCode</code> z pól x i y?', ['Objects.hash(x, y)', 'x + y + hash', 'hash(x)(y)', 'new Hash(x, y)'], 0, 'Gotowa metoda pomocnicza.'),
        Q('Czy równe w <code>equals</code> obiekty mogą mieć różne <code>hashCode</code>?', ['nie, to złamanie kontraktu', 'tak, to normalne', 'tylko dla napisów', 'tylko dla tablic'], 0, 'To najważniejsza zasada.'),
        Q('Co się stanie w HashSet, jeśli nadpiszesz tylko <code>equals</code>, a hashCode zostawisz domyślny?', ['duplikaty mogą się zmieścić, bo obiekty trafią do różnych szuflad', 'wszystko zadziała poprawnie', 'program się nie skompiluje', 'HashSet będzie pusty'], 0, 'Dlatego trzeba nadpisać oba.'),
      ],
    },

    {
      id: 'eq-szukanie', title: 'Wyszukiwanie w tablicy', blurb: 'pętla + equals + null w tablicy', minutes: 6,
      content: [
        ANA('🔎', 'Po co to wszystko? Żeby np. sprawdzić, czy w tablicy znajduje się użytkownik o podanych danych. Przechodzisz po tablicy i dla każdego elementu pytasz <code>equals</code>. Uwaga: elementy mogą być <code>null</code>, więc pytaj <b>od strony szukanego</b>: <code>szukany.equals(t[i])</code>.'),
        CODE(J`import java.util.Objects;

class Punkt {
    int x, y;

    Punkt(int x, int y) { this.x = x; this.y = y; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Punkt p = (Punkt) o;
        return x == p.x && y == p.y;
    }

    @Override
    public int hashCode() { return Objects.hash(x, y); }
}

public class Main {
    static boolean zawiera(Punkt[] t, Punkt szukany) {
        for (int i = 0; i < t.length; i++) {
            if (szukany.equals(t[i])) {
                return true;
            }
        }
        return false;
    }

    public static void main(String[] args) {
        Punkt[] t = { new Punkt(1, 2), null, new Punkt(3, 4) };
        System.out.println(zawiera(t, new Punkt(3, 4)));
        System.out.println(zawiera(t, new Punkt(9, 9)));
    }
}
`, 'true\nfalse'),
        NOTE('warn', 'Gdybyś napisał <code>t[i].equals(szukany)</code>, to dla pustego miejsca (<code>null</code>) dostałbyś <b>NullPointerException</b>.'),
      ],
      guide: {
        files: [FL('Baza.java', 'public class Baza {\n}\n'), FL('Punkt.java', 'import java.util.Objects;\n\npublic class Punkt {\n    private int x;\n    private int y;\n\n    public Punkt(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n\n    @Override\n    public boolean equals(Object o) {\n        if (this == o) {\n            return true;\n        }\n        if (o == null || getClass() != o.getClass()) {\n            return false;\n        }\n        Punkt p = (Punkt) o;\n        return x == p.x && y == p.y;\n    }\n\n    @Override\n    public int hashCode() {\n        return Objects.hash(x, y);\n    }\n}\n')],
        steps: [
          { say: '<p>W <code>Baza</code> napisz statyczną metodę <code>zawiera</code>: tablica punktów i punkt szukany, wynik <code>boolean</code>.</p>', type: '    public static boolean zawiera(Punkt[] t, Punkt szukany) {', expect: J`static\s+boolean\s+zawiera\s*\(\s*Punkt\s*\[\s*\]\s+t\s*,\s*Punkt\s+szukany\s*\)\s*\{` },
          { say: '<p>Przejdź po wszystkich elementach i zapytaj o równość <b>od strony szukanego</b>. Gdy pasuje, zwróć <code>true</code>.</p>', type: '        for (int i = 0; i < t.length; i++) {\n            if (szukany.equals(t[i])) {\n                return true;\n            }\n        }', expect: J`for\s*\(\s*int\s+i\s*=\s*0\s*;\s*i\s*<\s*t\.length\s*;\s*i\+\+\s*\)\s*\{\s*if\s*\(\s*szukany\.equals\s*\(\s*t\s*\[\s*i\s*\]\s*\)\s*\)\s*\{\s*return\s+true\s*;\s*\}\s*\}` },
          { say: '<p>Po pętli nic nie znaleziono: zwróć <code>false</code> i zamknij metodę.</p>', type: '        return false;\n    }', expect: J`\}\s*return\s+false\s*;\s*\}` },
        ],
        solution: [FL('Baza.java', 'public class Baza {\n    public static boolean zawiera(Punkt[] t, Punkt szukany) {\n        for (int i = 0; i < t.length; i++) {\n            if (szukany.equals(t[i])) {\n                return true;\n            }\n        }\n        return false;\n    }\n}\n'), FL('Punkt.java', 'import java.util.Objects;\n\npublic class Punkt {\n    private int x;\n    private int y;\n\n    public Punkt(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n\n    @Override\n    public boolean equals(Object o) {\n        if (this == o) {\n            return true;\n        }\n        if (o == null || getClass() != o.getClass()) {\n            return false;\n        }\n        Punkt p = (Punkt) o;\n        return x == p.x && y == p.y;\n    }\n\n    @Override\n    public int hashCode() {\n        return Objects.hash(x, y);\n    }\n}\n')],
        checks: [
          CK(CR, 'Znajduje istniejący punkt', J`eq(true, Baza.zawiera(new Punkt[]{ new Punkt(1, 2), new Punkt(3, 4) }, new Punkt(3, 4)));`),
          CK(CR, 'Zwraca false, gdy punktu nie ma', J`eq(false, Baza.zawiera(new Punkt[]{ new Punkt(1, 2) }, new Punkt(9, 9)));`),
          CK(CR, 'Radzi sobie z null w tablicy', J`eq(true, Baza.zawiera(new Punkt[]{ null, new Punkt(1, 2) }, new Punkt(1, 2))); eq(false, Baza.zawiera(new Punkt[]{ null, null }, new Punkt(1, 2)));`),
        ],
      },
      exercise: {
        prompt: '<p>W <code>Baza</code> napisz statyczną metodę <code>int ile(Punkt[] t, Punkt szukany)</code>, która zwraca, <b>ile elementów</b> tablicy jest równych szukanemu. Elementy mogą być <code>null</code>. (<code>Punkt</code> ma gotowe <code>equals</code>.)</p>',
        files: [FL('Baza.java', 'public class Baza {\n}\n'), FL('Punkt.java', 'import java.util.Objects;\n\npublic class Punkt {\n    private int x;\n    private int y;\n\n    public Punkt(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n\n    @Override\n    public boolean equals(Object o) {\n        if (this == o) {\n            return true;\n        }\n        if (o == null || getClass() != o.getClass()) {\n            return false;\n        }\n        Punkt p = (Punkt) o;\n        return x == p.x && y == p.y;\n    }\n\n    @Override\n    public int hashCode() {\n        return Objects.hash(x, y);\n    }\n}\n')],
        hints: ['Licznik <code>int licznik = 0;</code> przed pętlą.', '<code>if (szukany.equals(t[i])) { licznik++; }</code>', 'Po pętli <code>return licznik;</code>'],
        solution: [FL('Baza.java', 'public class Baza {\n    public static int ile(Punkt[] t, Punkt szukany) {\n        int licznik = 0;\n        for (int i = 0; i < t.length; i++) {\n            if (szukany.equals(t[i])) {\n                licznik++;\n            }\n        }\n        return licznik;\n    }\n}\n'), FL('Punkt.java', 'import java.util.Objects;\n\npublic class Punkt {\n    private int x;\n    private int y;\n\n    public Punkt(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n\n    @Override\n    public boolean equals(Object o) {\n        if (this == o) {\n            return true;\n        }\n        if (o == null || getClass() != o.getClass()) {\n            return false;\n        }\n        Punkt p = (Punkt) o;\n        return x == p.x && y == p.y;\n    }\n\n    @Override\n    public int hashCode() {\n        return Objects.hash(x, y);\n    }\n}\n')],
        checks: [
          CK(CR, 'Liczy powtórzenia', J`eq(2, Baza.ile(new Punkt[]{ new Punkt(1, 2), new Punkt(3, 4), new Punkt(1, 2) }, new Punkt(1, 2)));`),
          CK(CR, 'Zero, gdy brak', J`eq(0, Baza.ile(new Punkt[]{ new Punkt(1, 2) }, new Punkt(7, 7)));`),
          CK(CR, 'Radzi sobie z null w tablicy', J`eq(1, Baza.ile(new Punkt[]{ null, new Punkt(1, 2), null }, new Punkt(1, 2)));`),
        ],
      },
      quiz: [
        Q('Dlaczego piszemy <code>szukany.equals(t[i])</code>, a nie <code>t[i].equals(szukany)</code>?', ['bo t[i] może być null i dałoby NullPointerException', 'bo tak jest szybciej', 'bo equals działa tylko w jedną stronę', 'to bez różnicy'], 0, 'Szukany jest znanym, niepustym obiektem.'),
        Q('Którego warunku brakuje pętli, by policzyć powtórzenia?', ['licznik zwiększany przy każdym trafieniu', 'return w środku pętli', 'break na początku', 'static przy t'], 0, 'Zliczanie wymaga licznika.'),
        OUTQ('Co wypisze program?', ['2', '1', '3', 'błąd'], 0, 'Dwa elementy mają taką samą zawartość jak szukany.', 'import java.util.Objects;\n\nclass P {\n    int x;\n\n    P(int x) { this.x = x; }\n\n    @Override\n    public boolean equals(Object o) {\n        if (o == null || getClass() != o.getClass()) return false;\n        return x == ((P) o).x;\n    }\n\n    @Override\n    public int hashCode() { return Objects.hash(x); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        P[] t = { new P(1), new P(2), new P(1) };\n        P s = new P(1);\n        int ile = 0;\n        for (int i = 0; i < t.length; i++) {\n            if (s.equals(t[i])) {\n                ile++;\n            }\n        }\n        System.out.println(ile);\n    }\n}\n'),
      ],
    },
  ],
  labs: [
    {
      id: 'lab-eq', title: 'Zadanie własne: Użytkownicy i wyszukiwanie', source: 'zadanie własne (przykład User z Wykładu 4)', own: true, concepts: ['eq-porownanie', 'eq-equals', 'eq-hashcode'],
      statement: J`<p>Odtwórz przykład z wykładu: w tablicy są obiekty <code>Uzytkownik</code>, a zadaniem jest sprawdzić, czy znajduje się w niej użytkownik o wskazanych danych.</p>
<ol>
<li><b>Uzytkownik</b> – prywatne pola <code>imie</code>, <code>nazwisko</code> (String), <code>rokUrodzenia</code> (int); konstruktor <code>(imie, nazwisko, rokUrodzenia)</code>; <code>toString()</code> zwraca <code>imie nazwisko rokUrodzenia</code>.</li>
<li>Nadpisz <code>equals(Object o)</code>: dwaj użytkownicy są równi, gdy mają <b>te same imię, nazwisko i rok urodzenia</b>. (Użyj <code>Objects.equals</code> dla napisów.)</li>
<li>Nadpisz <code>hashCode()</code> zgodnie z <code>equals</code>.</li>
<li><b>Baza</b> – publiczne statyczne metody: <code>boolean zawiera(Uzytkownik[] t, Uzytkownik szukany)</code> oraz <code>int ile(Uzytkownik[] t, Uzytkownik szukany)</code> – ile elementów jest równych szukanemu. Elementy tablicy mogą być <code>null</code> – nie wolno ich wywoływać (bez <code>NullPointerException</code>).</li>
<li><b>Main</b>: utwórz tablicę 4 użytkowników (jeden duplikat), wyszukaj <code>new Uzytkownik("Jan", "Kowalski", 1990)</code> i wypisz <code>true</code>/<code>false</code> oraz liczbę wystąpień.</li>
</ol>`,
      notes: 'Zadanie własne – ćwiczy dokładnie to, co na wykładzie (problem z <code>==</code>, nadpisanie <code>equals</code> i <code>hashCode</code>). Uwaga: wywołuj <code>szukany.equals(element)</code> albo sprawdzaj <code>null</code>, aby elementy <code>null</code> nie powodowały wyjątku.',
      files: [
        { name: 'Uzytkownik.java', code: J`public class Uzytkownik {

}
` },
        { name: 'Baza.java', code: J`public class Baza {

}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {

    }
}
` }],
      hints: ['equals: <code>rokUrodzenia == u.rokUrodzenia && Objects.equals(imie, u.imie) && Objects.equals(nazwisko, u.nazwisko)</code>', 'hashCode: <code>Objects.hash(imie, nazwisko, rokUrodzenia)</code>', 'W Baza: <code>if (szukany.equals(t[i]))</code> – <code>equals</code> sam poradzi sobie z <code>null</code> w argumencie.'],
      solution: [
        { name: 'Uzytkownik.java', code: J`import java.util.Objects;

public class Uzytkownik {
    private String imie;
    private String nazwisko;
    private int rokUrodzenia;

    public Uzytkownik(String imie, String nazwisko, int rokUrodzenia) {
        this.imie = imie;
        this.nazwisko = nazwisko;
        this.rokUrodzenia = rokUrodzenia;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Uzytkownik u = (Uzytkownik) o;
        return rokUrodzenia == u.rokUrodzenia
                && Objects.equals(imie, u.imie)
                && Objects.equals(nazwisko, u.nazwisko);
    }

    @Override
    public int hashCode() {
        return Objects.hash(imie, nazwisko, rokUrodzenia);
    }

    @Override
    public String toString() {
        return imie + " " + nazwisko + " " + rokUrodzenia;
    }
}
` },
        { name: 'Baza.java', code: J`public class Baza {
    public static boolean zawiera(Uzytkownik[] t, Uzytkownik szukany) {
        for (int i = 0; i < t.length; i++) {
            if (szukany.equals(t[i])) {
                return true;
            }
        }
        return false;
    }

    public static int ile(Uzytkownik[] t, Uzytkownik szukany) {
        int licznik = 0;
        for (int i = 0; i < t.length; i++) {
            if (szukany.equals(t[i])) {
                licznik++;
            }
        }
        return licznik;
    }
}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {
        Uzytkownik[] uzytkownicy = {
            new Uzytkownik("Jan", "Kowalski", 1990),
            new Uzytkownik("Ewa", "Nowak", 1985),
            new Uzytkownik("Jan", "Kowalski", 1990),
            null
        };
        Uzytkownik szukany = new Uzytkownik("Jan", "Kowalski", 1990);
        System.out.println(Baza.zawiera(uzytkownicy, szukany));
        System.out.println(Baza.ile(uzytkownicy, szukany));
    }
}
` }],
      checks: [
        CK(CR, 'Uzytkownik: pola prywatne, konstruktor, toString', J`for (String n : new String[]{"imie", "nazwisko", "rokUrodzenia"}) { isTrue("Brak pola " + n, hasField("Uzytkownik", n)); isTrue("Pole " + n + " ma być private", Modifier.isPrivate(fieldMods("Uzytkownik", n))); }
Object u = make("Uzytkownik", "Jan", "Kowalski", 1990);
eq("Jan Kowalski 1990", u.toString());`),
        CK(CR, 'equals: równość po imieniu, nazwisku i roku', J`Object a = make("Uzytkownik", "Jan", "Kowalski", 1990);
eq(true, a.equals(make("Uzytkownik", "Jan", "Kowalski", 1990)));
eq(false, a.equals(make("Uzytkownik", "Jan", "Kowalski", 1991)));
eq(false, a.equals(make("Uzytkownik", "Jan", "Nowak", 1990)));
eq(false, a.equals(make("Uzytkownik", "Ewa", "Kowalski", 1990)));`),
        CK(CR, 'equals: ten sam obiekt, null, inna klasa', J`Object a = make("Uzytkownik", "Jan", "Kowalski", 1990);
eq(true, a.equals(a)); eq(false, a.equals(null)); eq(false, a.equals("Jan Kowalski 1990"));`),
        CK(MD, 'equals ma sygnaturę equals(Object) i działa dla pól null', J`method("Uzytkownik", "equals", Object.class);
Object a = make("Uzytkownik", null, "Kowalski", 1990);
eq(true, a.equals(make("Uzytkownik", null, "Kowalski", 1990)));
eq(false, a.equals(make("Uzytkownik", "Jan", "Kowalski", 1990)));`),
        CK(CR, 'hashCode jest zgodny z equals', J`eq(make("Uzytkownik", "Jan", "Kowalski", 1990).hashCode(), make("Uzytkownik", "Jan", "Kowalski", 1990).hashCode());
java.util.HashSet<Object> s = new java.util.HashSet<>();
s.add(make("Uzytkownik", "Jan", "Kowalski", 1990)); s.add(make("Uzytkownik", "Jan", "Kowalski", 1990)); s.add(make("Uzytkownik", "Ewa", "Nowak", 1985));
eq(2, s.size());`),
        CK(CR, 'Baza.zawiera: znajduje równego użytkownika (inna referencja), pomija null', J`Object[] t = new Object[]{ make("Uzytkownik", "Ewa", "Nowak", 1985), null, make("Uzytkownik", "Jan", "Kowalski", 1990) };
Object arr = java.lang.reflect.Array.newInstance(cls("Uzytkownik"), 3);
for (int i = 0; i < 3; i++) java.lang.reflect.Array.set(arr, i, t[i]);
eq(true, callStatic("Baza", "zawiera", arr, make("Uzytkownik", "Jan", "Kowalski", 1990)));
eq(false, callStatic("Baza", "zawiera", arr, make("Uzytkownik", "Adam", "Mak", 2000)));`),
        CK(CR, 'Baza.ile: liczy wszystkie równe elementy', J`Object arr = java.lang.reflect.Array.newInstance(cls("Uzytkownik"), 4);
java.lang.reflect.Array.set(arr, 0, make("Uzytkownik", "Jan", "Kowalski", 1990));
java.lang.reflect.Array.set(arr, 1, make("Uzytkownik", "Ewa", "Nowak", 1985));
java.lang.reflect.Array.set(arr, 2, make("Uzytkownik", "Jan", "Kowalski", 1990));
eq(2, callStatic("Baza", "ile", arr, make("Uzytkownik", "Jan", "Kowalski", 1990)));
eq(0, callStatic("Baza", "ile", arr, make("Uzytkownik", "X", "Y", 1)));`),
        CK(MD, 'Main wypisuje true i liczbę wystąpień', J`List<String> l = lines(runMain());
isTrue("Main powinien wypisać co najmniej 2 linie – jest: " + l, l.size() >= 2);
eq("true", l.get(0)); eq("2", l.get(1));`),
        CK(MN, 'Użyto Objects.equals/Objects.hash i @Override', J`isTrue("Użyj Objects.equals(...) dla napisów", srcHas("Uzytkownik", "Objects\\s*\\.\\s*equals"));
isTrue("Użyj Objects.hash(...)", srcHas("Uzytkownik", "Objects\\s*\\.\\s*hash"));
isTrue("Dodaj @Override", srcHas("Uzytkownik", "@Override"));
isFalse("W Baza nie porównuj elementów przez ==", srcHas("Baza", "t\\s*\\[\\s*i\\s*\\]\\s*==\\s*szukany"));`),
      ],
    },
  ],

  quiz: [
    Q('Co zwróci <code>a == b</code> dla dwóch różnych obiektów <code>User</code> o identycznych polach?', ['<code>true</code>', '<code>false</code>', 'zależy od pól', 'błąd kompilacji'], 1, '<code>==</code> sprawdza, czy to ten sam obiekt w pamięci.', 'eq-porownanie'),
    Q('Co robi domyślna metoda <code>equals()</code> z klasy <code>Object</code>?', ['porównuje referencje (jak <code>==</code>)', 'porównuje wszystkie pola', 'zawsze zwraca <code>true</code>'], 0, 'Dlatego trzeba ją nadpisać, żeby porównywać stan.', 'eq-porownanie'),
    Q('Dlaczego dla pól typu <code>String</code> używamy <code>Objects.equals</code>, a nie <code>==</code>?', ['bo String to klasa (typ referencyjny), a nie typ prymitywny', 'bo <code>==</code> nie kompiluje się dla String', 'bo String jest zawsze null', 'bo tak szybciej'], 0, '<code>==</code> porównałoby referencje.', 'eq-equals'),
    Q('Jeżeli nadpisujesz <code>equals</code>, to powinieneś też nadpisać:', ['<code>toString</code> – obowiązkowo', '<code>hashCode</code>', '<code>clone</code>', '<code>finalize</code>'], 1, 'Obiekty równe muszą mieć równy hasz – inaczej <code>HashSet</code>/<code>HashMap</code> będą działać błędnie.', 'eq-hashcode'),
    Q('Co wypisze program?', ['true false', 'false false', 'true true', 'false true'], 0, 'Pierwszy zwraca <code>true</code> (ta sama referencja), drugi – <code>false</code>, bo <code>equals</code> nie został nadpisany i porównuje referencje.', 'eq-porownanie', { code: J`class A { int x = 1; }

public class Main {
    public static void main(String[] args) {
        A a = new A();
        A b = new A();
        System.out.println(a.equals(a) + " " + a.equals(b));
    }
}` }),
    Q('Co wypisze program?', ['true', 'false', 'błąd kompilacji', 'wyjątek'], 0, 'Nadpisane <code>equals</code> porównuje wartość pola <code>x</code>.', 'eq-equals', { code: J`class A {
    int x;
    A(int x) { this.x = x; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        return x == ((A) o).x;
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new A(3).equals(new A(3)));
    }
}` }),
  ],
});
