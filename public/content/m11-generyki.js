'use strict';
ACAD.modules.push({
  id: 'gen', num: 11, level: 3, icon: '🧪', title: 'Klasy i metody generyczne',
  source: 'Prezentacja 5 – klasy i metody generyczne · (zadanie własne ArraySorting)',
  summary: 'Szablony typów: metody <T>, ograniczenia extends, klasy generyczne i kilka parametrów typu.',
  goals: ['napisać metodę generyczną <code>&lt;T&gt;</code>', 'nałożyć ograniczenie <code>&lt;T extends Comparable&lt;T&gt;&gt;</code>', 'napisać klasę generyczną z polem typu <code>T</code> lub <code>T[]</code>', 'wyjaśnić, czym różni się T klasy od T metody'],
  lessons: [

    {
      id: 'gen-idea', micro: true, title: 'Po co generyki?', blurb: 'szablon z „dziurą” na typ', minutes: 4,
      content: [
        ANA('📦', 'Pudełko na buty i pudełko na książki to <b>ten sam pomysł</b>, tylko zawartość inna. Zamiast pisać osobną klasę <code>PudelkoInt</code>, <code>PudelkoString</code>…, piszesz <b>jedną</b> klasę <code>Pudelko&lt;T&gt;</code>, gdzie <code>T</code> to „dziura na typ”. Dopiero przy użyciu mówisz, co tam wkładasz: <code>Pudelko&lt;String&gt;</code>.'),
        VIZ('compare', { cols: [
          { icon: '😩', title: 'bez generyków', c: 'bad', items: ['osobna klasa dla każdego typu', 'albo <code>Object</code> i rzutowanie (ryzyko błędu)'] },
          { icon: '😎', title: 'z generykami', c: 'ok', items: ['<b>jeden</b> szablon <code>&lt;T&gt;</code>', 'kompilator pilnuje typów'] }] }),
        TERMS([['<code>&lt;T&gt;</code>', 'parametr typu: „jakiś typ, ustalimy go później”'], ['<code>Pudelko&lt;String&gt;</code>', 'pudełko, w którym <code>T</code> = <code>String</code>'], ['metoda generyczna', 'metoda ze swoim <code>&lt;T&gt;</code> przed typem zwracanym'], ['klasa generyczna', 'klasa z <code>&lt;T&gt;</code> przy nazwie']]),
        NOTE('warn', 'Parametrem typu nie może być typ prosty: piszesz <code>Pudelko&lt;Integer&gt;</code>, a nie <code>Pudelko&lt;int&gt;</code> (<code>Integer</code> to „obiektowy” odpowiednik <code>int</code>).'),
      ],
      quiz: [
        Q('Co oznacza <code>T</code> w <code>Pudelko&lt;T&gt;</code>?', ['dowolny typ ustalany przy użyciu klasy', 'konkretny typ String', 'zmienną tekstową', 'nazwę metody'], 0, 'To parametr typu.'),
        Q('Którego typu <b>nie</b> możesz użyć jako parametru generyków?', ['int', 'Integer', 'String', 'Osoba'], 0, 'Zamiast <code>int</code> używamy <code>Integer</code>.'),
        Q('Co daje generyk w porównaniu z <code>Object</code>?', ['kompilator pilnuje typów, bez ręcznego rzutowania', 'program jest krótszy o jedną linię', 'program działa bez klasy Main', 'nic'], 0, 'Błędy typów wychodzą na etapie kompilacji.'),
      ],
    },

    {
      id: 'gen-metody', title: 'Metoda generyczna', blurb: 'public static <T> void wypisz(T x)', minutes: 5,
      content: [
        ANA('🔧', 'Chcesz metodę, która wypisze <b>cokolwiek</b>: liczbę, napis, osobę? Dopisz przed typem zwracanym <code>&lt;T&gt;</code> i używaj <code>T</code> jak zwykłego typu. Java sama domyśli się, czym jest <code>T</code>, po przekazanym argumencie.'),
        VIZ('flow', { title: 'static &lt;T&gt; void wypisz(T x)', steps: [{ t: 'wypisz(5)', s: 'T = Integer', c: 'accent' }, { t: 'wypisz("Ala")', s: 'T = String', c: 'ok' }, { t: 'jedno ciało metody', s: 'działa dla obu', c: 'warn' }] }),
        CODE(J`public class Main {
    static <T> void wypisz(T x) {
        System.out.println("Wartosc: " + x);
    }

    public static void main(String[] args) {
        wypisz(5);
        wypisz("Ala");
        wypisz(2.5);
    }
}
`, 'Wartosc: 5\nWartosc: Ala\nWartosc: 2.5'),
        NOTE('info', 'Miejsce zapisu: <code>&lt;T&gt;</code> stoi <b>przed typem zwracanym</b> (przed <code>void</code>, <code>T</code>, <code>int</code>...).'),
      ],
      guide: {
        files: [FL('Narzedzia.java', 'public class Narzedzia {\n}\n')],
        steps: [
          { say: '<p>Zadeklaruj metodę generyczną. <code>&lt;T&gt;</code> wstawiasz <b>przed typ zwracany</b>.</p>', type: '    public static <T> void wypisz(T x) {', expect: J`public\s+static\s*<\s*T\s*>\s*void\s+wypisz\s*\(\s*T\s+x\s*\)\s*\{` },
          { say: '<p>Wypisz wartość z napisem i zamknij metodę.</p>', type: '        System.out.println("Wartosc: " + x);\n    }', expect: J`System\.out\.println\s*\(\s*"Wartosc: "\s*\+\s*x\s*\)\s*;\s*\}` },
        ],
        solution: [FL('Narzedzia.java', 'public class Narzedzia {\n    public static <T> void wypisz(T x) {\n        System.out.println("Wartosc: " + x);\n    }\n}\n')],
        checks: [
          CK(CR, 'Działa dla liczby i napisu', J`List<String> o1 = lines(out(() -> Narzedzia.wypisz(5))); List<String> o2 = lines(out(() -> Narzedzia.wypisz("Ala"))); isTrue("wypisz(5): " + o1, o1.equals(Arrays.asList("Wartosc: 5"))); isTrue("wypisz(\"Ala\"): " + o2, o2.equals(Arrays.asList("Wartosc: Ala")));`),
          CK(MD, 'Metoda jest generyczna', J`isTrue("Dodaj <T> przed typem zwracanym", method("Narzedzia", "wypisz", Object.class).getTypeParameters().length == 1);`),
        ],
      },
      exercise: {
        prompt: '<p>W <code>Narzedzia</code> napisz metodę generyczną <code>static &lt;T&gt; T pierwszyZDwoch(T a, T b)</code>, która zwraca <b>pierwszy</b> argument.</p>',
        files: [FL('Narzedzia.java', 'public class Narzedzia {\n}\n')],
        hints: ['<code>public static <T> T pierwszyZDwoch(T a, T b) { return a; }</code>'],
        solution: [FL('Narzedzia.java', 'public class Narzedzia {\n    public static <T> T pierwszyZDwoch(T a, T b) {\n        return a;\n    }\n}\n')],
        checks: [
          CK(CR, 'Zwraca pierwszy argument', J`eq("a", Narzedzia.pierwszyZDwoch("a", "b")); eq(7, Narzedzia.pierwszyZDwoch(7, 8));`),
          CK(MD, 'Metoda ma parametr typu T', J`isTrue("Dodaj <T> przed typem zwracanym", method("Narzedzia", "pierwszyZDwoch", Object.class, Object.class).getTypeParameters().length == 1);`),
        ],
      },
      quiz: [
        Q('Gdzie zapisujemy <code>&lt;T&gt;</code> w metodzie generycznej?', ['przed typem zwracanym', 'po nazwie metody', 'po nawiasach', 'w klamrach'], 0, '<code>static &lt;T&gt; void f(T x)</code>.'),
        OUTQ('Co wypisze program?', ['A<br>5', '5<br>A', 'A', 'błąd'], 0, 'Ta sama metoda działa dla napisu i liczby.', 'public class Main {\n    static <T> void pokaz(T x) {\n        System.out.println(x);\n    }\n\n    public static void main(String[] args) {\n        pokaz("A");\n        pokaz(5);\n    }\n}\n'),
        Q('Skąd Java wie, czym jest <code>T</code> przy wywołaniu <code>wypisz("Ala")</code>?', ['z typu przekazanego argumentu', 'zawsze to Object', 'z nazwy metody', 'musisz podać ręcznie'], 0, 'Kompilator wnioskuje typ z argumentu.'),
      ],
    },

    {
      id: 'gen-tablica', title: 'Generyczna metoda na tablicy', blurb: '<T> T pierwszy(T[] t)', minutes: 5,
      content: [
        ANA('🗃️', 'Najczęstszy zastosowanie: metoda działająca na tablicy <b>dowolnego</b> typu. Argument ma typ <code>T[]</code> (tablica elementów typu T), a wynik może być po prostu <code>T</code>. Zadziała dla <code>Integer[]</code>, <code>String[]</code>, <code>Osoba[]</code>…'),
        CODE(J`public class Main {
    static <T> T pierwszy(T[] t) {
        return t[0];
    }

    static <T> void wypiszWszystkie(T[] t) {
        for (T x : t) {
            System.out.println(x);
        }
    }

    public static void main(String[] args) {
        Integer[] liczby = { 4, 5, 6 };
        String[] napisy = { "a", "b" };
        System.out.println(pierwszy(liczby));
        System.out.println(pierwszy(napisy));
        wypiszWszystkie(napisy);
    }
}
`, '4\na\na\nb'),
        NOTE('warn', 'Tablica musi być typu <b>obiektowego</b> (<code>Integer[]</code>, <code>String[]</code>), a nie <code>int[]</code>. Dla <code>int[]</code> metoda <code>&lt;T&gt; ... T[]</code> nie zadziała.'),
      ],
      guide: {
        files: [FL('Narzedzia.java', 'public class Narzedzia {\n}\n')],
        steps: [
          { say: '<p>Metoda generyczna biorąca tablicę dowolnego typu i zwracająca jej pierwszy element.</p>', type: '    public static <T> T pierwszy(T[] t) {', expect: J`public\s+static\s*<\s*T\s*>\s*T\s+pierwszy\s*\(\s*T\s*\[\s*\]\s+t\s*\)\s*\{` },
          { say: '<p>Zwróć element o indeksie 0 i zamknij metodę.</p>', type: '        return t[0];\n    }', expect: J`return\s+t\s*\[\s*0\s*\]\s*;\s*\}` },
        ],
        solution: [FL('Narzedzia.java', 'public class Narzedzia {\n    public static <T> T pierwszy(T[] t) {\n        return t[0];\n    }\n}\n')],
        checks: [
          CK(CR, 'Zwraca pierwszy element tablicy Integer i String', J`eq(4, Narzedzia.pierwszy(new Integer[]{ 4, 5, 6 })); eq("a", Narzedzia.pierwszy(new String[]{ "a", "b" }));`),
        ],
      },
      exercise: {
        prompt: '<p>Dopisz do <code>Narzedzia</code> metodę generyczną <code>static &lt;T&gt; T ostatni(T[] t)</code>, która zwraca <b>ostatni</b> element tablicy.</p>',
        files: [FL('Narzedzia.java', 'public class Narzedzia {\n}\n')],
        hints: ['Ostatni indeks to <code>t.length - 1</code>.'],
        solution: [FL('Narzedzia.java', 'public class Narzedzia {\n    public static <T> T ostatni(T[] t) {\n        return t[t.length - 1];\n    }\n}\n')],
        checks: [
          CK(CR, 'Zwraca ostatni element', J`eq(6, Narzedzia.ostatni(new Integer[]{ 4, 5, 6 })); eq("b", Narzedzia.ostatni(new String[]{ "a", "b" })); eq("x", Narzedzia.ostatni(new String[]{ "x" }));`),
        ],
      },
      quiz: [
        Q('Jaki typ ma parametr metody wypisującej tablicę dowolnego typu?', ['T[]', 'T', 'Object', 'int[]'], 0, 'Tablica elementów typu T.'),
        Q('Dla której tablicy metoda <code>&lt;T&gt; T pierwszy(T[] t)</code> <b>nie</b> zadziała?', ['int[]', 'Integer[]', 'String[]', 'Osoba[]'], 0, 'Generyki nie przyjmują typów prostych.'),
        OUTQ('Co wypisze program?', ['c', 'a', 'b', 'błąd'], 0, 'Zwracany jest element o ostatnim indeksie.', 'public class Main {\n    static <T> T ostatni(T[] t) {\n        return t[t.length - 1];\n    }\n\n    public static void main(String[] args) {\n        String[] s = { "a", "b", "c" };\n        System.out.println(ostatni(s));\n    }\n}\n'),
      ],
    },

    {
      id: 'gen-ograniczenia', title: 'Ograniczenie typu: extends', blurb: '<T extends Comparable<T>>', minutes: 6,
      content: [
        ANA('🛂', 'Dowolny typ <code>T</code> to czasem za dużo swobody. Gdy chcesz <b>porównywać</b> elementy (<code>compareTo</code>), nie każdy typ to potrafi. Dlatego nakładasz <b>ograniczenie</b>: <code>&lt;T extends Comparable&lt;T&gt;&gt;</code> czyli „T musi być porównywalny”. Wtedy wewnątrz metody wolno użyć <code>a.compareTo(b)</code>.'),
        CODE(J`public class Main {
    static <T extends Comparable<T>> T wiekszy(T a, T b) {
        if (a.compareTo(b) >= 0) {
            return a;
        }
        return b;
    }

    public static void main(String[] args) {
        System.out.println(wiekszy(3, 9));
        System.out.println(wiekszy("ala", "ola"));
    }
}
`, '9\nola'),
        NOTE('exam', 'W ograniczeniach używamy słowa <code>extends</code> <b>także dla interfejsów</b> (nie <code>implements</code>): <code>&lt;T extends Comparable&lt;T&gt;&gt;</code>.'),
      ],
      guide: {
        files: [FL('Narzedzia.java', 'public class Narzedzia {\n}\n')],
        steps: [
          { say: '<p>Metoda zwracająca większy z dwóch elementów. Ogranicz <code>T</code> do typów porównywalnych.</p>', type: '    public static <T extends Comparable<T>> T wiekszy(T a, T b) {', expect: J`<\s*T\s+extends\s+Comparable\s*<\s*T\s*>\s*>\s*T\s+wiekszy\s*\(\s*T\s+a\s*,\s*T\s+b\s*\)\s*\{` },
          { say: '<p>Dzięki ograniczeniu możesz użyć <code>compareTo</code>. Gdy <code>a</code> nie jest mniejsze, zwróć <code>a</code>.</p>', type: '        if (a.compareTo(b) >= 0) {\n            return a;\n        }', expect: J`if\s*\(\s*a\.compareTo\s*\(\s*b\s*\)\s*>=\s*0\s*\)\s*\{\s*return\s+a\s*;\s*\}` },
          { say: '<p>W przeciwnym razie większe jest <code>b</code>.</p>', type: '        return b;\n    }', expect: J`\}\s*return\s+b\s*;\s*\}` },
        ],
        solution: [FL('Narzedzia.java', 'public class Narzedzia {\n    public static <T extends Comparable<T>> T wiekszy(T a, T b) {\n        if (a.compareTo(b) >= 0) {\n            return a;\n        }\n        return b;\n    }\n}\n')],
        checks: [
          CK(CR, 'Liczby: większa', J`eq(9, Narzedzia.wiekszy(3, 9)); eq(9, Narzedzia.wiekszy(9, 3));`),
          CK(CR, 'Napisy: alfabetycznie późniejszy', J`eq("ola", Narzedzia.wiekszy("ala", "ola")); eq("ola", Narzedzia.wiekszy("ola", "ala"));`),
          CK(MD, 'T ma ograniczenie Comparable', J`java.lang.reflect.TypeVariable<?> tv = method("Narzedzia", "wiekszy", Comparable.class, Comparable.class).getTypeParameters()[0]; isTrue("T ma extends Comparable<T>", tv.getBounds().length == 1 && tv.getBounds()[0].getTypeName().contains("Comparable"));`),
        ],
      },
      exercise: {
        prompt: '<p>Napisz w <code>Narzedzia</code> metodę <code>static &lt;T extends Comparable&lt;T&gt;&gt; T najmniejszy(T[] t)</code>: zwraca najmniejszy element tablicy (tablica ma co najmniej 1 element).</p>',
        files: [FL('Narzedzia.java', 'public class Narzedzia {\n}\n')],
        hints: ['<code>T min = t[0];</code>', 'W pętli: <code>if (t[i].compareTo(min) < 0) { min = t[i]; }</code>'],
        solution: [FL('Narzedzia.java', 'public class Narzedzia {\n    public static <T extends Comparable<T>> T najmniejszy(T[] t) {\n        T min = t[0];\n        for (int i = 1; i < t.length; i++) {\n            if (t[i].compareTo(min) < 0) {\n                min = t[i];\n            }\n        }\n        return min;\n    }\n}\n')],
        checks: [
          CK(CR, 'Najmniejsza liczba', J`eq(1, Narzedzia.najmniejszy(new Integer[]{ 3, 1, 2 })); eq(5, Narzedzia.najmniejszy(new Integer[]{ 5 }));`),
          CK(CR, 'Najmniejszy napis', J`eq("ala", Narzedzia.najmniejszy(new String[]{ "ola", "ala", "ewa" }));`),
        ],
      },
      quiz: [
        Q('Co oznacza <code>&lt;T extends Comparable&lt;T&gt;&gt;</code>?', ['T musi być typem porównywalnym', 'T dziedziczy po klasie Comparable', 'T to zawsze String', 'T jest liczbą'], 0, 'To ograniczenie typu.'),
        Q('Dlaczego bez ograniczenia nie wolno wywołać <code>a.compareTo(b)</code>?', ['bo dowolny T nie musi mieć metody compareTo', 'bo compareTo jest prywatne', 'bo T to liczba', 'bo brakuje static'], 0, 'Kompilator nie ma gwarancji.'),
        Q('Którego słowa używamy w ograniczeniu typu także dla interfejsów?', ['extends', 'implements', 'inherits', 'super'], 0, 'Zapis <code>T extends Comparable&lt;T&gt;</code>.'),
        OUTQ('Co wypisze program?', ['Zosia', 'Ala', 'Ola', 'błąd'], 0, 'Alfabetycznie największy jest „Zosia”.', 'public class Main {\n    static <T extends Comparable<T>> T max(T a, T b) {\n        return a.compareTo(b) >= 0 ? a : b;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(max("Ala", "Zosia"));\n    }\n}\n'),
      ],
    },

    {
      id: 'gen-klasy', title: 'Klasa generyczna', blurb: 'class Pudelko<T>', minutes: 6,
      content: [
        ANA('📦', 'Pora na pudełko z początku modułu. <code>&lt;T&gt;</code> dopisujesz <b>przy nazwie klasy</b>, a potem używasz <code>T</code> jako typu pola, parametru i wyniku metody. Typ „wskazujesz” przy tworzeniu obiektu: <code>new Pudelko&lt;String&gt;("kot")</code>.'),
        VIZ('objects', { vars: [{ t: 'Pudelko&lt;String&gt;', n: 'p', to: 'o1' }, { t: 'Pudelko&lt;Integer&gt;', n: 'q', to: 'o2' }], objs: [{ id: 'o1', c: 'Pudelko', f: [['zawartosc', '"kot"']] }, { id: 'o2', c: 'Pudelko', f: [['zawartosc', '42']] }], cap: 'Ta sama klasa, ale <code>T</code> raz jest Stringiem, raz Integerem.' }),
        CODE(J`class Pudelko<T> {
    private T zawartosc;

    Pudelko(T zawartosc) {
        this.zawartosc = zawartosc;
    }

    T getZawartosc() {
        return zawartosc;
    }

    void setZawartosc(T zawartosc) {
        this.zawartosc = zawartosc;
    }
}

public class Main {
    public static void main(String[] args) {
        Pudelko<String> p = new Pudelko<>("kot");
        Pudelko<Integer> q = new Pudelko<>(42);
        String s = p.getZawartosc();
        int n = q.getZawartosc();
        System.out.println(s + " " + n);
    }
}
`, 'kot 42'),
        NOTE('tip', 'Zapis <code>new Pudelko&lt;&gt;(...)</code> (z pustym <code>&lt;&gt;</code>) pozwala Javie samej odgadnąć typ z lewej strony. Dzięki generykom nie trzeba rzutować wyniku <code>getZawartosc()</code>.'),
      ],
      guide: {
        files: [FL('Pudelko.java', 'public class Pudelko {\n}\n')],
        steps: [
          { say: '<p>Dodaj parametr typu <code>&lt;T&gt;</code> do nazwy klasy.</p>', type: 'public class Pudelko<T> {', expect: J`class\s+Pudelko\s*<\s*T\s*>\s*\{` },
          { say: '<p>Pole prywatne typu <code>T</code>.</p>', type: '    private T zawartosc;', expect: J`private\s+T\s+zawartosc\s*;` },
          { say: '<p>Konstruktor przyjmujący zawartość typu <code>T</code>.</p>', type: '    public Pudelko(T zawartosc) {\n        this.zawartosc = zawartosc;\n    }', expect: J`public\s+Pudelko\s*\(\s*T\s+zawartosc\s*\)\s*\{\s*this\.zawartosc\s*=\s*zawartosc\s*;\s*\}` },
          { say: '<p>Getter zwraca <code>T</code>. Zamknij klasę.</p>', type: '    public T getZawartosc() {\n        return zawartosc;\n    }\n}', expect: J`public\s+T\s+getZawartosc\s*\(\s*\)\s*\{\s*return\s+zawartosc\s*;\s*\}` },
        ],
        solution: [FL('Pudelko.java', 'public class Pudelko<T> {\n    private T zawartosc;\n\n    public Pudelko(T zawartosc) {\n        this.zawartosc = zawartosc;\n    }\n\n    public T getZawartosc() {\n        return zawartosc;\n    }\n}\n')],
        checks: [
          CK(CR, 'Pudełko na napis i na liczbę', J`Pudelko<String> p = new Pudelko<>("kot"); eq("kot", p.getZawartosc()); Pudelko<Integer> q = new Pudelko<>(42); eq(42, q.getZawartosc());`),
          CK(MD, 'Klasa ma parametr typu', J`isTrue("Dodaj <T> przy nazwie klasy", cls("Pudelko").getTypeParameters().length == 1);`),
        ],
      },
      exercise: {
        prompt: '<p>Do <code>Pudelko&lt;T&gt;</code> dopisz metodę <code>void setZawartosc(T nowa)</code> oraz <code>boolean czyPuste()</code> (<code>true</code>, gdy zawartość to <code>null</code>).</p>',
        files: [FL('Pudelko.java', 'public class Pudelko<T> {\n    private T zawartosc;\n\n    public Pudelko(T zawartosc) {\n        this.zawartosc = zawartosc;\n    }\n\n    public T getZawartosc() {\n        return zawartosc;\n    }\n}\n')],
        hints: ['<code>this.zawartosc = nowa;</code>', '<code>return zawartosc == null;</code>'],
        solution: [FL('Pudelko.java', 'public class Pudelko<T> {\n    private T zawartosc;\n\n    public Pudelko(T zawartosc) {\n        this.zawartosc = zawartosc;\n    }\n\n    public T getZawartosc() {\n        return zawartosc;\n    }\n\n    public void setZawartosc(T nowa) {\n        this.zawartosc = nowa;\n    }\n\n    public boolean czyPuste() {\n        return zawartosc == null;\n    }\n}\n')],
        checks: [
          CK(CR, 'setZawartosc zmienia zawartość', J`Pudelko<String> p = new Pudelko<>("a"); p.setZawartosc("b"); eq("b", p.getZawartosc());`),
          CK(CR, 'czyPuste rozpoznaje null', J`eq(true, new Pudelko<String>(null).czyPuste()); eq(false, new Pudelko<>(5).czyPuste());`),
        ],
      },
      quiz: [
        Q('Gdzie zapisujemy <code>&lt;T&gt;</code> w klasie generycznej?', ['przy nazwie klasy', 'przed słowem class', 'w main', 'po nawiasie klamrowym'], 0, '<code>class Pudelko&lt;T&gt;</code>.'),
        Q('Co daje <code>Pudelko&lt;String&gt;</code> zamiast <code>Pudelko</code> z Object?', ['getZawartosc() zwraca String bez rzutowania', 'szybszy program', 'mniej pamięci', 'nic'], 0, 'Typ jest znany kompilatorowi.'),
        OUTQ('Co wypisze program?', ['5', 'Pudelko', 'null', 'błąd'], 0, 'W środku jest liczba 5.', 'class Pudelko<T> {\n    T z;\n\n    Pudelko(T z) { this.z = z; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Pudelko<Integer> p = new Pudelko<>(5);\n        System.out.println(p.z);\n    }\n}\n'),
        Q('Czy da się utworzyć <code>Pudelko&lt;int&gt;</code>?', ['nie, trzeba użyć Integer', 'tak', 'tak, w Main', 'tak, jeśli jest static'], 0, 'Parametr typu musi być typem obiektowym.'),
      ],
    },

    {
      id: 'gen-klasa-tablica', title: 'Tablica w klasie generycznej', blurb: 'pole T[] i ograniczenie typu klasy', minutes: 6,
      content: [
        ANA('🗂️', 'Klasa generyczna może trzymać <b>całą tablicę</b> elementów typu <code>T</code>: pole <code>T[] dane</code>. Możesz też nałożyć ograniczenie na całą klasę: <code>class Zbior&lt;T extends Comparable&lt;T&gt;&gt;</code>. Wtedy <b>każda</b> jej metoda może porównywać elementy, a w metodach <b>nie dopisujesz już własnego</b> <code>&lt;T&gt;</code>: używają <code>T</code> klasy.'),
        CODE(J`class Zbior<T extends Comparable<T>> {
    private T[] dane;

    Zbior(T[] dane) {
        this.dane = dane;
    }

    T najwiekszy() {
        T max = dane[0];
        for (int i = 1; i < dane.length; i++) {
            if (dane[i].compareTo(max) > 0) {
                max = dane[i];
            }
        }
        return max;
    }
}

public class Main {
    public static void main(String[] args) {
        Zbior<Integer> a = new Zbior<>(new Integer[] { 4, 9, 2 });
        Zbior<String> b = new Zbior<>(new String[] { "ala", "ola" });
        System.out.println(a.najwiekszy());
        System.out.println(b.najwiekszy());
    }
}
`, '9\nola'),
        NOTE('warn', 'Pomyłka z <code>T</code> klasy a <code>T</code> metody to częsty błąd: w metodzie <b>instancyjnej</b> klasy generycznej piszesz po prostu <code>T</code>, bez <code>&lt;T&gt;</code>. Własne <code>&lt;T&gt;</code> mają tylko metody <b>statyczne</b> (bo nie widzą <code>T</code> klasy).'),
      ],
      guide: {
        files: [FL('Zbior.java', 'public class Zbior<T extends Comparable<T>> {\n    private T[] dane;\n\n    public Zbior(T[] dane) {\n        this.dane = dane;\n    }\n}\n')],
        steps: [
          { say: '<p>Dopisz metodę zwracającą największy element. Zwraca typ <code>T</code> klasy (bez własnego <code>&lt;T&gt;</code>).</p>', type: '    public T najwiekszy() {\n        T max = dane[0];', expect: J`public\s+T\s+najwiekszy\s*\(\s*\)\s*\{\s*T\s+max\s*=\s*dane\s*\[\s*0\s*\]\s*;` },
          { say: '<p>Przejdź po reszcie elementów i zapamiętaj większy.</p>', type: '        for (int i = 1; i < dane.length; i++) {\n            if (dane[i].compareTo(max) > 0) {\n                max = dane[i];\n            }\n        }', expect: J`for\s*\(\s*int\s+i\s*=\s*1\s*;\s*i\s*<\s*dane\.length\s*;\s*i\+\+\s*\)\s*\{\s*if\s*\(\s*dane\s*\[\s*i\s*\]\.compareTo\s*\(\s*max\s*\)\s*>\s*0\s*\)\s*\{\s*max\s*=\s*dane\s*\[\s*i\s*\]\s*;\s*\}\s*\}` },
          { say: '<p>Zwróć wynik i zamknij metodę.</p>', type: '        return max;\n    }', expect: J`return\s+max\s*;\s*\}` },
        ],
        solution: [FL('Zbior.java', 'public class Zbior<T extends Comparable<T>> {\n    private T[] dane;\n\n    public Zbior(T[] dane) {\n        this.dane = dane;\n    }\n\n    public T najwiekszy() {\n        T max = dane[0];\n        for (int i = 1; i < dane.length; i++) {\n            if (dane[i].compareTo(max) > 0) {\n                max = dane[i];\n            }\n        }\n        return max;\n    }\n}\n')],
        checks: [
          CK(CR, 'Największa liczba i napis', J`eq(9, new Zbior<Integer>(new Integer[]{ 4, 9, 2 }).najwiekszy()); eq("ola", new Zbior<String>(new String[]{ "ala", "ola" }).najwiekszy());`),
          CK(CR, 'Jeden element', J`eq(5, new Zbior<Integer>(new Integer[]{ 5 }).najwiekszy());`),
        ],
      },
      exercise: {
        prompt: '<p>Do klasy <code>Zbior&lt;T&gt;</code> dopisz metodę <code>int ileMniejszych(T granica)</code>: zwraca, ile elementów tablicy <code>dane</code> jest <b>mniejszych</b> od <code>granica</code>.</p>',
        files: [FL('Zbior.java', 'public class Zbior<T extends Comparable<T>> {\n    private T[] dane;\n\n    public Zbior(T[] dane) {\n        this.dane = dane;\n    }\n}\n')],
        hints: ['<code>int licznik = 0;</code> i pętla po <code>dane</code>', '<code>if (dane[i].compareTo(granica) < 0) { licznik++; }</code>'],
        solution: [FL('Zbior.java', 'public class Zbior<T extends Comparable<T>> {\n    private T[] dane;\n\n    public Zbior(T[] dane) {\n        this.dane = dane;\n    }\n\n    public int ileMniejszych(T granica) {\n        int licznik = 0;\n        for (int i = 0; i < dane.length; i++) {\n            if (dane[i].compareTo(granica) < 0) {\n                licznik++;\n            }\n        }\n        return licznik;\n    }\n}\n')],
        checks: [
          CK(CR, 'Liczby mniejsze od granicy', J`eq(2, new Zbior<Integer>(new Integer[]{ 1, 2, 5, 9 }).ileMniejszych(5)); eq(0, new Zbior<Integer>(new Integer[]{ 7, 8 }).ileMniejszych(5));`),
          CK(CR, 'Napisy mniejsze od granicy', J`eq(1, new Zbior<String>(new String[]{ "ala", "ola", "zosia" }).ileMniejszych("kasia"));`),
        ],
      },
      quiz: [
        Q('Czy metoda instancyjna klasy <code>Zbior&lt;T&gt;</code> potrzebuje własnego <code>&lt;T&gt;</code>?', ['nie, używa T klasy', 'tak, zawsze', 'tak, ale tylko w main', 'tylko gdy zwraca void'], 0, 'T pochodzi z nagłówka klasy.'),
        Q('Co daje ograniczenie <code>T extends Comparable&lt;T&gt;</code> na całą klasę?', ['wszystkie metody mogą używać compareTo', 'klasa działa szybciej', 'klasa staje się abstrakcyjna', 'tylko konstruktor widzi T'], 0, 'Ograniczenie obowiązuje wszędzie w klasie.'),
        Q('Które metody własne <code>&lt;T&gt;</code> deklarują?', ['statyczne (nie widzą T klasy)', 'wszystkie instancyjne', 'konstruktory', 'żadne'], 0, 'T klasy jest związane z obiektem.'),
      ],
    },

    {
      id: 'gen-wiele', title: 'Dwa parametry typu', blurb: 'class Para<A, B>', minutes: 5,
      content: [
        ANA('👫', 'Czasem potrzebujesz <b>dwóch różnych typów naraz</b>, np. para „imię + wiek” (<code>String</code> + <code>Integer</code>). Po przecinku wymieniasz kilka parametrów typu: <code>Para&lt;A, B&gt;</code>. Przy tworzeniu obiektu podajesz oba typy. Tak działają też mapy: <code>Map&lt;String, Integer&gt;</code> (zobaczysz je w następnym module).'),
        CODE(J`class Para<A, B> {
    private A pierwszy;
    private B drugi;

    Para(A pierwszy, B drugi) {
        this.pierwszy = pierwszy;
        this.drugi = drugi;
    }

    A getPierwszy() { return pierwszy; }
    B getDrugi() { return drugi; }
}

public class Main {
    public static void main(String[] args) {
        Para<String, Integer> p = new Para<>("Ala", 20);
        System.out.println(p.getPierwszy() + " " + p.getDrugi());
    }
}
`, 'Ala 20'),
        NOTE('info', 'Typowe nazwy parametrów: <code>T</code> (Type), <code>E</code> (Element), <code>K</code> (Key), <code>V</code> (Value). To tylko umowa: możesz użyć dowolnej wielkiej litery.'),
      ],
      guide: {
        files: [FL('Para.java', 'public class Para {\n}\n')],
        steps: [
          { say: '<p>Zadeklaruj klasę z <b>dwoma</b> parametrami typu, rozdzielonymi przecinkiem.</p>', type: 'public class Para<A, B> {', expect: J`class\s+Para\s*<\s*A\s*,\s*B\s*>\s*\{` },
          { say: '<p>Dwa pola o różnych typach.</p>', type: '    private A pierwszy;\n    private B drugi;', expect: J`private\s+A\s+pierwszy\s*;\s*private\s+B\s+drugi\s*;` },
          { say: '<p>Konstruktor z oboma wartościami.</p>', type: '    public Para(A pierwszy, B drugi) {\n        this.pierwszy = pierwszy;\n        this.drugi = drugi;\n    }', expect: J`public\s+Para\s*\(\s*A\s+pierwszy\s*,\s*B\s+drugi\s*\)\s*\{\s*this\.pierwszy\s*=\s*pierwszy\s*;\s*this\.drugi\s*=\s*drugi\s*;\s*\}` },
          { say: '<p>Dwa gettery, każdy z innym typem wyniku. Zamknij klasę.</p>', type: '    public A getPierwszy() {\n        return pierwszy;\n    }\n\n    public B getDrugi() {\n        return drugi;\n    }\n}', expect: J`public\s+A\s+getPierwszy\s*\(\s*\)\s*\{\s*return\s+pierwszy\s*;\s*\}\s*public\s+B\s+getDrugi\s*\(\s*\)\s*\{\s*return\s+drugi\s*;\s*\}` },
        ],
        solution: [FL('Para.java', 'public class Para<A, B> {\n    private A pierwszy;\n    private B drugi;\n\n    public Para(A pierwszy, B drugi) {\n        this.pierwszy = pierwszy;\n        this.drugi = drugi;\n    }\n\n    public A getPierwszy() {\n        return pierwszy;\n    }\n\n    public B getDrugi() {\n        return drugi;\n    }\n}\n')],
        checks: [
          CK(CR, 'Para String + Integer', J`Para<String, Integer> p = new Para<>("Ala", 20); eq("Ala", p.getPierwszy()); eq(20, p.getDrugi());`),
          CK(MD, 'Klasa ma dwa parametry typu', J`eq(2, cls("Para").getTypeParameters().length);`),
        ],
      },
      exercise: {
        prompt: '<p>Do klasy <code>Para&lt;A, B&gt;</code> dopisz metodę <code>Para&lt;B, A&gt; odwroc()</code>, która zwraca nową parę z <b>zamienionymi</b> elementami.</p>',
        files: [FL('Para.java', 'public class Para<A, B> {\n    private A pierwszy;\n    private B drugi;\n\n    public Para(A pierwszy, B drugi) {\n        this.pierwszy = pierwszy;\n        this.drugi = drugi;\n    }\n\n    public A getPierwszy() {\n        return pierwszy;\n    }\n\n    public B getDrugi() {\n        return drugi;\n    }\n}\n')],
        hints: ['<code>return new Para<>(drugi, pierwszy);</code>'],
        solution: [FL('Para.java', 'public class Para<A, B> {\n    private A pierwszy;\n    private B drugi;\n\n    public Para(A pierwszy, B drugi) {\n        this.pierwszy = pierwszy;\n        this.drugi = drugi;\n    }\n\n    public A getPierwszy() {\n        return pierwszy;\n    }\n\n    public B getDrugi() {\n        return drugi;\n    }\n\n    public Para<B, A> odwroc() {\n        return new Para<>(drugi, pierwszy);\n    }\n}\n')],
        checks: [
          CK(CR, 'odwroc zamienia elementy', J`Para<String, Integer> p = new Para<>("Ala", 20); Para<Integer, String> r = p.odwroc(); eq(20, r.getPierwszy()); eq("Ala", r.getDrugi());`),
          CK(MD, 'Oryginał się nie zmienia', J`Para<String, Integer> p = new Para<>("Ala", 20); p.odwroc(); eq("Ala", p.getPierwszy()); eq(20, p.getDrugi());`),
        ],
      },
      quiz: [
        Q('Jak zapisać klasę z dwoma parametrami typu?', ['class Para<A, B>', 'class Para<A><B>', 'class Para(A, B)', 'class Para<A B>'], 0, 'Po przecinku w jednych nawiasach ostrych.'),
        Q('Co oznaczają zwykle litery <code>K</code> i <code>V</code>?', ['klucz (Key) i wartość (Value)', 'Klasa i Variable', 'Kolekcja i Vector', 'nic'], 0, 'Spotkasz je w mapach.'),
        OUTQ('Co wypisze program?', ['Ala<br>20', '20<br>Ala', 'Ala', 'błąd'], 0, 'Dwa pola o różnych typach.', 'class Para<A, B> {\n    A a;\n    B b;\n\n    Para(A a, B b) { this.a = a; this.b = b; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Para<String, Integer> p = new Para<>("Ala", 20);\n        System.out.println(p.a);\n        System.out.println(p.b);\n    }\n}\n'),
      ],
    },
  ],
  labs: [
    {
      id: 'lab-gen', title: 'Zadanie własne: ArraySorting (klasa generyczna)', source: 'zadanie własne (przykład ArraySorting z Prezentacji 5)', own: true, concepts: ['gen-metody', 'gen-ograniczenia', 'gen-klasy'],
      statement: J`<p>Odtwórz przykład z prezentacji: klasa, która sortuje i wyświetla tablicę dowolnego typu <b>porównywalnego</b>.</p>
<ol>
<li><b>ArraySorting</b> – klasa generyczna <code>ArraySorting&lt;T extends Comparable&lt;T&gt;&gt;</code> z prywatnym polem <code>T[] myArray</code> i konstruktorem <code>ArraySorting(T[] myArray)</code>.</li>
<li>Metoda <code>void sortuj()</code> – sortuje <code>myArray</code> (<code>Arrays.sort</code>).</li>
<li>Metoda <code>void wyswietl()</code> – wypisuje elementy <code>myArray</code> (przez <code>toString</code>), każdy w osobnej linii.</li>
<li>Metoda <code>void sortujIWyswietl()</code> – wywołuje <code>sortuj()</code>, potem <code>wyswietl()</code>.</li>
<li><b>Narzedzia</b> – statyczna metoda generyczna <code>&lt;T extends Comparable&lt;T&gt;&gt; int ileMniejszych(T[] t, T granica)</code> – zlicza elementy mniejsze od <code>granica</code>.</li>
<li><b>Main</b>: utwórz <code>Integer[]</code> i <code>String[]</code>, posortuj je klasą <code>ArraySorting</code> (po jednym obiekcie dla każdej tablicy) i wypisz wyniki, a także wynik <code>ileMniejszych</code> dla obu tablic.</li>
</ol>`,
      notes: 'Zadanie własne. Ponieważ tablice przekazujemy przez referencję, <code>sortuj()</code> zmienia oryginał – nie trzeba nic zwracać. Typ <code>T</code> klasy ma ograniczenie, więc metody klasy nie deklarują własnego <code>&lt;T&gt;</code>.',
      files: [
        { name: 'ArraySorting.java', code: J`public class ArraySorting {

}
` },
        { name: 'Narzedzia.java', code: J`public class Narzedzia {

}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {

    }
}
` }],
      hints: ['<code>public class ArraySorting&lt;T extends Comparable&lt;T&gt;&gt;</code>', 'W <code>sortuj</code>: <code>Arrays.sort(myArray);</code> (import <code>java.util.Arrays</code>).', 'W Main: <code>ArraySorting&lt;Integer&gt; a = new ArraySorting&lt;&gt;(liczby);</code>'],
      solution: [
        { name: 'ArraySorting.java', code: J`import java.util.Arrays;

public class ArraySorting<T extends Comparable<T>> {
    private T[] myArray;

    public ArraySorting(T[] myArray) {
        this.myArray = myArray;
    }

    public void sortuj() {
        Arrays.sort(myArray);
    }

    public void wyswietl() {
        for (T element : myArray) {
            System.out.println(element.toString());
        }
    }

    public void sortujIWyswietl() {
        sortuj();
        wyswietl();
    }
}
` },
        { name: 'Narzedzia.java', code: J`public class Narzedzia {
    public static <T extends Comparable<T>> int ileMniejszych(T[] t, T granica) {
        int licznik = 0;
        for (T element : t) {
            if (element.compareTo(granica) < 0) {
                licznik++;
            }
        }
        return licznik;
    }
}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {
        Integer[] liczby = { 5, 2, 9, 1 };
        String[] slowa = { "kot", "ala", "zebra" };

        ArraySorting<Integer> a = new ArraySorting<>(liczby);
        a.sortujIWyswietl();
        ArraySorting<String> b = new ArraySorting<>(slowa);
        b.sortujIWyswietl();

        System.out.println(Narzedzia.ileMniejszych(liczby, 5));
        System.out.println(Narzedzia.ileMniejszych(slowa, "kot"));
    }
}
` }],
      checks: [
        CK(CR, 'ArraySorting jest klasą generyczną z ograniczeniem T extends Comparable<T>', J`java.lang.reflect.TypeVariable<?>[] tv = cls("ArraySorting").getTypeParameters();
eq(1, tv.length);
isTrue("T powinno mieć ograniczenie Comparable", tv[0].getBounds()[0].getTypeName().startsWith("java.lang.Comparable"));`),
        CK(CR, 'Pole myArray jest prywatne', J`isTrue("Brak pola myArray", hasField("ArraySorting", "myArray"));
isTrue("myArray ma być private", Modifier.isPrivate(fieldMods("ArraySorting", "myArray")));`),
        CK(CR, 'sortuj() sortuje tablicę liczb (oryginał)', J`Integer[] t = { 5, 2, 9, 1 };
new ArraySorting<Integer>(t).sortuj();
eq(java.util.Arrays.asList(1, 2, 5, 9), java.util.Arrays.asList(t));`),
        CK(CR, 'sortuj() sortuje tablicę napisów', J`String[] t = { "kot", "ala", "zebra" };
new ArraySorting<String>(t).sortuj();
eq(java.util.Arrays.asList("ala", "kot", "zebra"), java.util.Arrays.asList(t));`),
        CK(CR, 'wyswietl() wypisuje elementy po jednym w linii', J`Integer[] t = { 3, 1, 2 };
ArraySorting<Integer> a = new ArraySorting<>(t);
eq(java.util.Arrays.asList("3", "1", "2"), lines(out(() -> a.wyswietl())));`),
        CK(CR, 'sortujIWyswietl() najpierw sortuje, potem wyświetla', J`String[] t = { "b", "c", "a" };
ArraySorting<String> a = new ArraySorting<>(t);
eq(java.util.Arrays.asList("a", "b", "c"), lines(out(() -> a.sortujIWyswietl())));`),
        CK(CR, 'Narzedzia.ileMniejszych: metoda generyczna z ograniczeniem', J`eq(2, Narzedzia.ileMniejszych(new Integer[]{1, 2, 5, 9}, 5));
eq(1, Narzedzia.ileMniejszych(new String[]{"ala", "kot", "zebra"}, "kot"));
eq(0, Narzedzia.ileMniejszych(new Integer[]{7, 8}, 1));
for (java.lang.reflect.Method m : cls("Narzedzia").getDeclaredMethods())
    if (m.getName().equals("ileMniejszych")) {
        isTrue("ileMniejszych ma być static", Modifier.isStatic(m.getModifiers()));
        isTrue("ileMniejszych ma mieć parametr typu <T>", m.getTypeParameters().length == 1);
        isTrue("T ma mieć ograniczenie Comparable", m.getTypeParameters()[0].getBounds()[0].getTypeName().startsWith("java.lang.Comparable"));
    }`),
        CK(MD, 'Main: sortuje obie tablice i wypisuje wyniki', J`List<String> l = lines(runMain());
isTrue("Main powinien wypisać co najmniej 9 linii (4 + 3 + 2) – jest: " + l.size(), l.size() >= 9);
isTrue("Posortowane liczby powinny się pojawić: 1 2 5 9", l.subList(0, 4).equals(java.util.Arrays.asList("1", "2", "5", "9")));`),
        CK(MN, 'W klasie nie ma osobnego <T> w metodach; użyto Arrays.sort', J`isTrue("Użyj Arrays.sort(myArray)", srcHas("ArraySorting", "Arrays\\s*\\.\\s*sort"));
isFalse("Metody klasy nie powinny deklarować własnego <T> (zasłaniają T klasy)", srcHas("ArraySorting", "(public|private|protected)\\s+(static\\s+)?<\\s*T"));`),
      ],
    },
  ],

  quiz: [
    Q('Co wypisze program?', ['5<br>ja', '5ja', 'błąd kompilacji', 'wyjątek'], 0, 'Metoda generyczna wywołana najpierw z <code>Integer</code>, potem z <code>String</code>; <code>println</code> wypisuje w osobnych liniach.', 'gen-metody', { code: J`public class Main {
    static <T> void pokaz(T x) {
        System.out.println(x.toString());
    }

    public static void main(String[] args) {
        pokaz(5);
        pokaz("ja");
    }
}` }),
    Q('Na typie generycznym <code>T</code> (bez ograniczeń) możemy wywołać metodę <code>toString()</code>, ponieważ:', ['jest zdefiniowana w klasie <code>Object</code>, z której dziedziczą wszystkie klasy', 'T zawsze implementuje Comparable', 'każdy typ generyczny jest typem String', 'metoda jest statyczna'], 0, 'Dostępne są tylko metody klasy <code>Object</code>.', 'gen-metody'),
    Q('Klasa opakowująca typ <code>int</code>, która implementuje m.in. <code>Comparable&lt;T&gt;</code>, to:', ['<code>IntWrapper</code>', '<code>Integer</code>', '<code>IntHash</code>', '<code>IntInter</code>'], 1, '<code>Integer</code>.', 'gen-ograniczenia'),
    Q('Aby obiekty były właściwie porównywane (równość), musimy nadpisać:', ['<code>toString</code>', '<code>hashCode</code> oraz <code>equals</code>', '<code>override</code> oraz <code>toString</code>', '<code>object</code> oraz <code>extends</code>'], 1, 'To para metod do porównywania obiektów.', 'eq-hashcode'),
    Q('Dlaczego w klasie <code>Klasa&lt;T extends Comparable&lt;T&gt;&gt;</code> metoda <code>&lt;T&gt; void f(T[] a) { a[0].compareTo(a[1]); }</code> się nie kompiluje?', ['bo <code>T</code> metody zasłania <code>T</code> klasy i nie ma ograniczenia Comparable', 'bo metody nie mogą być generyczne', 'bo tablice nie mogą być generyczne', 'bo brakuje <code>static</code>'], 0, 'Nowe <code>&lt;T&gt;</code> w metodzie to inny typ niż <code>T</code> klasy.', 'gen-klasy'),
    Q('Co zawiera <code>Pudelko&lt;Integer&gt; p = new Pudelko&lt;&gt;(7);</code> po wywołaniu <code>p.pobierz()</code>?', ['wartość 7 typu <code>Integer</code>', 'napis „7”', 'błąd – nie można użyć Integer', 'null'], 0, 'Typ generyczny wybrany przy tworzeniu obiektu to <code>Integer</code>.', 'gen-klasy'),
  ],
});
