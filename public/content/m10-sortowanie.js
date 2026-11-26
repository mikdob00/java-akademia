'use strict';
ACAD.modules.push({
  id: 'sort', num: 10, level: 3, icon: '↕️', title: 'Sortowanie: Comparable i Comparator',
  source: 'Wykład 4 – interfejsy wbudowane: Comparable, Comparator, klasy wewnętrzne statyczne · (zadanie własne)',
  summary: 'Naturalny porządek obiektów przez compareTo, sortowanie wielokryterialne i alternatywne porządki przez Comparator w statycznej klasie wewnętrznej.',
  goals: ['zaimplementować <code>Comparable&lt;T&gt;</code> i metodę <code>compareTo</code>', 'posortować tablicę obiektów przez <code>Arrays.sort</code>', 'sortować według kilku kryteriów', 'dodać alternatywny porządek przez <code>Comparator&lt;T&gt;</code> w statycznej klasie wewnętrznej'],
  lessons: [

    {
      id: 'sort-idea', micro: true, title: 'Jak komputer sortuje obiekty?', blurb: 'potrzebna reguła: kto jest „mniejszy”', minutes: 4,
      content: [
        ANA('🧑‍🏫', 'Liczby sortujesz bez zastanowienia: 3 jest mniejsze niż 5. Ale jak posortować <b>osoby</b>? Po nazwisku? Po wieku? Po wzroście? Java <b>nie zgaduje</b>: musisz podać regułę „kto jest przed kim”. Tę regułę zapisujesz w kodzie na dwa sposoby: <code>Comparable</code> (jedna <b>domyślna</b> reguła „wbudowana” w klasę) i <code>Comparator</code> (<b>dodatkowe</b> reguły osobno).'),
        VIZ('compare', { cols: [
          { icon: '🏷️', title: 'Comparable', c: 'accent', sub: 'porządek naturalny', items: ['<b>klasa sama</b> wie, jak się porównać', 'metoda <code>compareTo</code> w klasie', 'jedna reguła na klasę'] },
          { icon: '🧰', title: 'Comparator', c: 'ok', sub: 'porządki dodatkowe', items: ['<b>osobna klasa</b> z regułą', 'metoda <code>compare</code>', 'wiele reguł do wyboru'] }] }),
        NOTE('info', 'Sortowanie tablicy to potem jedna linijka: <code>Arrays.sort(t)</code> (porządek naturalny) albo <code>Arrays.sort(t, komparator)</code> (konkretna reguła).'),
      ],
      quiz: [
        Q('Dlaczego Java nie umie sama posortować tablicy osób?', ['bo nie wie, po czym porównywać (nazwisko, wiek...)', 'bo tablice nie da się sortować', 'bo osoby to napisy', 'bo brakuje pętli'], 0, 'Trzeba podać regułę porównywania.'),
        Q('Który mechanizm daje <b>domyślną</b> regułę zapisaną w samej klasie?', ['Comparable', 'Comparator', 'Iterator', 'Runnable'], 0, 'Porządek naturalny.'),
        Q('Którym narzędziem dodasz kilka różnych reguł sortowania tej samej klasy?', ['Comparator', 'Comparable', 'toString', 'equals'], 0, 'Każda reguła to osobny komparator.'),
      ],
    },

    {
      id: 'sort-compareto', title: 'Porównywanie: ujemna, zero, dodatnia', blurb: 'jak działa compareTo', minutes: 5,
      content: [
        ANA('⚖️', 'Każde porównanie w Javie odpowiada <b>liczbą</b>, jak waga: <b>ujemna</b> = „pierwszy jest przed drugim”, <b>zero</b> = „równe”, <b>dodatnia</b> = „pierwszy jest po drugim”. Dla liczb służy <code>Integer.compare(a, b)</code>, dla napisów <code>a.compareTo(b)</code> (kolejność alfabetyczna).'),
        VIZ('cells', { rows: [{ label: 'compare(3, 5)', cells: ['-1'], hl: [0] }, { label: 'compare(5, 5)', cells: ['0'], hl: [0] }, { label: 'compare(7, 5)', cells: ['1'], hl: [0] }], cap: 'Mniejsze → ujemna, równe → 0, większe → dodatnia.' }),
        CODE(J`public class Main {
    public static void main(String[] args) {
        System.out.println(Integer.compare(3, 5));
        System.out.println(Integer.compare(5, 5));
        System.out.println(Integer.compare(7, 5));
        System.out.println("ala".compareTo("ola") < 0);
    }
}
`, '-1\n0\n1\ntrue'),
        NOTE('warn', 'Dla napisów <code>compareTo</code> zwraca „jakąś” liczbę ujemną/dodatnią (niekoniecznie -1 i 1), więc zawsze porównuj ją z <code>0</code>, a nie z konkretną wartością.'),
      ],
      guide: {
        files: [FL('Main.java', MAINW([]))],
        steps: [
          { say: '<p>Porównaj liczby 3 i 5 metodą <code>Integer.compare</code> i wypisz wynik.</p>', type: 'System.out.println(Integer.compare(3, 5));', expect: J`System\.out\.println\s*\(\s*Integer\.compare\s*\(\s*3\s*,\s*5\s*\)\s*\)\s*;` },
          { say: '<p>Porównaj dwie jednakowe liczby.</p>', type: 'System.out.println(Integer.compare(5, 5));', expect: J`Integer\.compare\s*\(\s*5\s*,\s*5\s*\)` },
          { say: '<p>Pierwsza większa od drugiej.</p>', type: 'System.out.println(Integer.compare(7, 5));', expect: J`Integer\.compare\s*\(\s*7\s*,\s*5\s*\)` },
        ],
        solution: [FL('Main.java', MAINW(['System.out.println(Integer.compare(3, 5));', 'System.out.println(Integer.compare(5, 5));', 'System.out.println(Integer.compare(7, 5));']))],
        checks: [
          CK(CR, 'Wynik: -1, 0, 1', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [-1, 0, 1] – program wypisał: " + o, o.equals(Arrays.asList("-1", "0", "1")));`),
        ],
      },
      exercise: {
        prompt: '<p>W <code>Main</code> napisz <code>static boolean przed(String a, String b)</code>: zwraca <code>true</code>, gdy <code>a</code> jest alfabetycznie <b>przed</b> <code>b</code> (użyj <code>compareTo</code>).</p>',
        files: [FL('Main.java', 'public class Main {\n    public static void main(String[] args) {\n    }\n}\n')],
        hints: ['<code>return a.compareTo(b) < 0;</code>'],
        solution: [FL('Main.java', 'public class Main {\n    static boolean przed(String a, String b) {\n        return a.compareTo(b) < 0;\n    }\n\n    public static void main(String[] args) {\n    }\n}\n')],
        checks: [
          CK(CR, 'przed("ala", "ola") → true', J`eq(true, callStatic("Main", "przed", "ala", "ola")); eq(true, callStatic("Main", "przed", "Adam", "Ewa"));`),
          CK(CR, 'przed("ola", "ala") i równe → false', J`eq(false, callStatic("Main", "przed", "ola", "ala")); eq(false, callStatic("Main", "przed", "x", "x"));`),
        ],
      },
      quiz: [
        Q('Co oznacza wynik ujemny <code>a.compareTo(b)</code>?', ['a jest przed b', 'a jest po b', 'a jest równe b', 'błąd'], 0, 'Ujemna = pierwszy wcześniej.'),
        Q('Co oznacza wynik 0?', ['elementy są równe pod względem porównania', 'pierwszy jest większy', 'błąd', 'drugi jest większy'], 0, 'Zero to remis.'),
        OUTQ('Co wypisze program?', ['-1', '0', '1', 'błąd'], 0, '3 jest mniejsze niż 5.', 'public class Main {\n    public static void main(String[] args) {\n        System.out.println(Integer.compare(3, 5));\n    }\n}\n'),
        OUTQ('Co wypisze program?', ['true', 'false', '-1', 'błąd'], 0, '„Ala” jest alfabetycznie przed „Ola”.', 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Ala".compareTo("Ola") < 0);\n    }\n}\n'),
      ],
    },

    {
      id: 'sort-comparable', title: 'Comparable i compareTo', blurb: 'naturalny porządek klasy', minutes: 7,
      content: [
        ANA('🏷️', 'Jeśli klasa ma <b>jedną oczywistą regułę</b> porządkowania (np. osoby według roku urodzenia), podpisz interfejs <code>Comparable&lt;Osoba&gt;</code> i napisz metodę <code>compareTo(Osoba o)</code>: zwraca liczbę ujemną/0/dodatnią według reguły z poprzedniej lekcji. Potem <code>Arrays.sort(tablica)</code> robi resztę.'),
        CODE(J`import java.util.Arrays;

class Osoba implements Comparable<Osoba> {
    String nazwisko;
    int rok;

    Osoba(String nazwisko, int rok) {
        this.nazwisko = nazwisko;
        this.rok = rok;
    }

    @Override
    public int compareTo(Osoba o) {
        return Integer.compare(rok, o.rok);
    }

    @Override
    public String toString() {
        return nazwisko + " " + rok;
    }
}

public class Main {
    public static void main(String[] args) {
        Osoba[] t = { new Osoba("Jan", 1990), new Osoba("Ewa", 1985), new Osoba("Ola", 2001) };
        Arrays.sort(t);
        for (Osoba o : t) {
            System.out.println(o);
        }
    }
}
`, 'Ewa 1985\nJan 1990\nOla 2001'),
        NOTE('tip', 'W <code>Comparable&lt;Osoba&gt;</code> typ w nawiasach ostrych mówi, <b>z czym</b> się porównujemy. Dlatego <code>compareTo</code> ma parametr <code>Osoba</code>, a nie <code>Object</code>.'),
      ],
      guide: {
        files: [FL('Osoba.java', 'public class Osoba {\n    private String nazwisko;\n    private int rok;\n\n    public Osoba(String nazwisko, int rok) {\n        this.nazwisko = nazwisko;\n        this.rok = rok;\n    }\n\n    public String getNazwisko() {\n        return nazwisko;\n    }\n\n    public int getRok() {\n        return rok;\n    }\n}\n')],
        steps: [
          { say: '<p>Klasa „podpisuje umowę” <code>Comparable</code> dla swojego typu.</p>', type: 'public class Osoba implements Comparable<Osoba> {', expect: J`class\s+Osoba\s+implements\s+Comparable\s*<\s*Osoba\s*>\s*\{` },
          { say: '<p>Na końcu klasy dopisz <code>compareTo</code>. Porównaj lata urodzenia: mniejszy rok jest „wcześniej”.</p>', type: '    @Override\n    public int compareTo(Osoba o) {\n        return Integer.compare(rok, o.rok);\n    }', expect: J`public\s+int\s+compareTo\s*\(\s*Osoba\s+o\s*\)\s*\{\s*return\s+Integer\.compare\s*\(\s*rok\s*,\s*o\.rok\s*\)\s*;\s*\}` },
        ],
        solution: [FL('Osoba.java', 'public class Osoba implements Comparable<Osoba> {\n    private String nazwisko;\n    private int rok;\n\n    public Osoba(String nazwisko, int rok) {\n        this.nazwisko = nazwisko;\n        this.rok = rok;\n    }\n\n    public String getNazwisko() {\n        return nazwisko;\n    }\n\n    public int getRok() {\n        return rok;\n    }\n\n    @Override\n    public int compareTo(Osoba o) {\n        return Integer.compare(rok, o.rok);\n    }\n}\n')],
        checks: [
          CK(CR, 'Osoba implementuje Comparable', J`isTrue("Osoba ma implementować Comparable", Comparable.class.isAssignableFrom(cls("Osoba")));`),
          CK(CR, 'Arrays.sort układa osoby rosnąco po roku', J`Osoba[] t = { new Osoba("Jan", 1990), new Osoba("Ewa", 1985), new Osoba("Ola", 2001) }; Arrays.sort(t); eq("Ewa", t[0].getNazwisko()); eq("Jan", t[1].getNazwisko()); eq("Ola", t[2].getNazwisko());`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Produkt</code> ma pola <code>nazwa</code> i <code>cena</code> (int). Zaimplementuj <code>Comparable&lt;Produkt&gt;</code> tak, aby sortowanie szło <b>rosnąco po cenie</b>.</p>',
        files: [FL('Produkt.java', 'public class Produkt {\n    private String nazwa;\n    private int cena;\n\n    public Produkt(String nazwa, int cena) {\n        this.nazwa = nazwa;\n        this.cena = cena;\n    }\n\n    public String getNazwa() {\n        return nazwa;\n    }\n\n    public int getCena() {\n        return cena;\n    }\n}\n')],
        hints: ['<code>implements Comparable<Produkt></code>', '<code>return Integer.compare(cena, o.cena);</code>'],
        solution: [FL('Produkt.java', 'public class Produkt implements Comparable<Produkt> {\n    private String nazwa;\n    private int cena;\n\n    public Produkt(String nazwa, int cena) {\n        this.nazwa = nazwa;\n        this.cena = cena;\n    }\n\n    public String getNazwa() {\n        return nazwa;\n    }\n\n    public int getCena() {\n        return cena;\n    }\n\n    @Override\n    public int compareTo(Produkt o) {\n        return Integer.compare(cena, o.cena);\n    }\n}\n')],
        checks: [
          CK(CR, 'Produkt implementuje Comparable', J`isTrue("Produkt ma implementować Comparable", Comparable.class.isAssignableFrom(cls("Produkt")));`),
          CK(CR, 'Sortowanie rosnąco po cenie', J`Produkt[] t = { new Produkt("a", 30), new Produkt("b", 10), new Produkt("c", 20) }; Arrays.sort(t); eq("b", t[0].getNazwa()); eq("c", t[1].getNazwa()); eq("a", t[2].getNazwa());`),
        ],
      },
      quiz: [
        Q('Który interfejs daje klasie porządek naturalny?', ['Comparable', 'Comparator', 'Serializable', 'Runnable'], 0, 'Z metodą <code>compareTo</code>.'),
        Q('Jaki typ ma parametr <code>compareTo</code> w <code>Comparable&lt;Osoba&gt;</code>?', ['Osoba', 'Object', 'String', 'int'], 0, 'Typ z nawiasów ostrych.'),
        Q('Co zrobi <code>Arrays.sort(t)</code> dla tablicy obiektów bez Comparable?', ['błąd w czasie działania (ClassCastException)', 'posortuje alfabetycznie', 'posortuje po rozmiarze', 'nic'], 0, 'Java nie zna reguły porównania.'),
        OUTQ('Co wypisze program?', ['2<br>5<br>9', '9<br>5<br>2', '5<br>2<br>9', 'błąd'], 0, 'Sortowanie rosnąco po liczbie.', 'import java.util.Arrays;\n\nclass L implements Comparable<L> {\n    int n;\n\n    L(int n) { this.n = n; }\n\n    @Override\n    public int compareTo(L o) {\n        return Integer.compare(n, o.n);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        L[] t = { new L(5), new L(9), new L(2) };\n        Arrays.sort(t);\n        for (L l : t) {\n            System.out.println(l.n);\n        }\n    }\n}\n'),
      ],
    },

    {
      id: 'sort-kryteria', title: 'Sortowanie według kilku kryteriów', blurb: 'najpierw nazwisko, potem rok', minutes: 6,
      content: [
        ANA('📚', 'Jak w książce telefonicznej: najpierw <b>nazwisko</b>, a gdy są takie same, dopiero wtedy <b>rok</b> (albo imię). W <code>compareTo</code> sprawdzasz pierwsze kryterium; jeśli wynik jest <b>różny od zera</b>, już wiadomo, kto jest pierwszy. Jeśli <b>zero</b>, przechodzisz do drugiego kryterium.'),
        VIZ('flow', { title: 'compareTo: nazwisko, potem rok', steps: [{ t: 'porównaj nazwiska', s: 'wynik = nazwisko.compareTo(o.nazwisko)', c: 'accent' }, { t: 'wynik ≠ 0 ?', s: 'tak → zwróć wynik', c: 'ok' }, { t: 'wynik = 0', s: 'nazwiska takie same', c: 'warn' }, { t: 'porównaj lata', s: 'Integer.compare(rok, o.rok)', c: 'ok' }] }),
        CODE(J`import java.util.Arrays;

class Osoba implements Comparable<Osoba> {
    String nazwisko;
    int rok;

    Osoba(String nazwisko, int rok) {
        this.nazwisko = nazwisko;
        this.rok = rok;
    }

    @Override
    public int compareTo(Osoba o) {
        int wynik = nazwisko.compareTo(o.nazwisko);
        if (wynik != 0) {
            return wynik;
        }
        return Integer.compare(rok, o.rok);
    }

    @Override
    public String toString() {
        return nazwisko + " " + rok;
    }
}

public class Main {
    public static void main(String[] args) {
        Osoba[] t = { new Osoba("Nowak", 1980), new Osoba("Kot", 2001), new Osoba("Kot", 1990) };
        Arrays.sort(t);
        for (Osoba o : t) {
            System.out.println(o);
        }
    }
}
`, 'Kot 1990\nKot 2001\nNowak 1980'),
      ],
      guide: {
        files: [FL('Osoba.java', 'public class Osoba implements Comparable<Osoba> {\n    private String nazwisko;\n    private int rok;\n\n    public Osoba(String nazwisko, int rok) {\n        this.nazwisko = nazwisko;\n        this.rok = rok;\n    }\n\n    public String getNazwisko() {\n        return nazwisko;\n    }\n\n    public int getRok() {\n        return rok;\n    }\n\n    @Override\n    public int compareTo(Osoba o) {\n        return 0;\n    }\n}\n')],
        steps: [
          { say: '<p>Zamień <code>return 0;</code>. Najpierw porównaj nazwiska i zapamiętaj wynik.</p>', type: '        int wynik = nazwisko.compareTo(o.nazwisko);', expect: J`int\s+wynik\s*=\s*nazwisko\.compareTo\s*\(\s*o\.nazwisko\s*\)\s*;` },
          { say: '<p>Jeśli nazwiska się różnią, ten wynik rozstrzyga.</p>', type: '        if (wynik != 0) {\n            return wynik;\n        }', expect: J`if\s*\(\s*wynik\s*!=\s*0\s*\)\s*\{\s*return\s+wynik\s*;\s*\}` },
          { say: '<p>Nazwiska takie same – rozstrzyga rok urodzenia.</p>', type: '        return Integer.compare(rok, o.rok);', expect: J`return\s+Integer\.compare\s*\(\s*rok\s*,\s*o\.rok\s*\)\s*;` },
        ],
        solution: [FL('Osoba.java', 'public class Osoba implements Comparable<Osoba> {\n    private String nazwisko;\n    private int rok;\n\n    public Osoba(String nazwisko, int rok) {\n        this.nazwisko = nazwisko;\n        this.rok = rok;\n    }\n\n    public String getNazwisko() {\n        return nazwisko;\n    }\n\n    public int getRok() {\n        return rok;\n    }\n\n    @Override\n    public int compareTo(Osoba o) {\n        int wynik = nazwisko.compareTo(o.nazwisko);\n        if (wynik != 0) {\n            return wynik;\n        }\n        return Integer.compare(rok, o.rok);\n    }\n}\n')],
        checks: [
          CK(CR, 'Sortuje po nazwisku, a przy remisie po roku', J`Osoba[] t = { new Osoba("Nowak", 1980), new Osoba("Kot", 2001), new Osoba("Kot", 1990) }; Arrays.sort(t); eq("Kot", t[0].getNazwisko()); eq(1990, t[0].getRok()); eq("Kot", t[1].getNazwisko()); eq(2001, t[1].getRok()); eq("Nowak", t[2].getNazwisko());`),
          CK(MD, 'Nazwisko ma pierwszeństwo przed rokiem', J`isTrue("Nazwisko A (rok 2000) ma być przed nazwiskiem B (rok 1900)", new Osoba("A", 2000).compareTo(new Osoba("B", 1900)) < 0);`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Student</code> ma pola <code>kierunek</code> i <code>nazwisko</code> (oba String). Zaimplementuj <code>compareTo</code>: najpierw po <b>kierunku</b>, a przy tym samym kierunku po <b>nazwisku</b> (alfabetycznie).</p>',
        files: [FL('Student.java', 'public class Student implements Comparable<Student> {\n    private String kierunek;\n    private String nazwisko;\n\n    public Student(String kierunek, String nazwisko) {\n        this.kierunek = kierunek;\n        this.nazwisko = nazwisko;\n    }\n\n    public String getKierunek() {\n        return kierunek;\n    }\n\n    public String getNazwisko() {\n        return nazwisko;\n    }\n\n    @Override\n    public int compareTo(Student o) {\n        return 0;\n    }\n}\n')],
        hints: ['<code>int w = kierunek.compareTo(o.kierunek); if (w != 0) { return w; }</code>', '<code>return nazwisko.compareTo(o.nazwisko);</code>'],
        solution: [FL('Student.java', 'public class Student implements Comparable<Student> {\n    private String kierunek;\n    private String nazwisko;\n\n    public Student(String kierunek, String nazwisko) {\n        this.kierunek = kierunek;\n        this.nazwisko = nazwisko;\n    }\n\n    public String getKierunek() {\n        return kierunek;\n    }\n\n    public String getNazwisko() {\n        return nazwisko;\n    }\n\n    @Override\n    public int compareTo(Student o) {\n        int w = kierunek.compareTo(o.kierunek);\n        if (w != 0) {\n            return w;\n        }\n        return nazwisko.compareTo(o.nazwisko);\n    }\n}\n')],
        checks: [
          CK(CR, 'Sortowanie: kierunek, potem nazwisko', J`Student[] t = { new Student("IT", "Zet"), new Student("Prawo", "Abc"), new Student("IT", "Bak") }; Arrays.sort(t); eq("Bak", t[0].getNazwisko()); eq("Zet", t[1].getNazwisko()); eq("Abc", t[2].getNazwisko());`),
        ],
      },
      quiz: [
        Q('Kiedy w <code>compareTo</code> sprawdzamy drugie kryterium?', ['gdy pierwsze dało wynik 0', 'zawsze', 'gdy pierwsze dało wynik ujemny', 'nigdy'], 0, 'Remis w pierwszym kryterium.'),
        Q('Co robi <code>if (wynik != 0) return wynik;</code>?', ['kończy porównanie, gdy pierwsze kryterium rozstrzyga', 'kończy program', 'zamienia elementy', 'to błąd'], 0, 'Skoro znamy kolejność, nie sprawdzamy dalej.'),
        OUTQ('Co wypisze program?', ['A 1<br>A 2<br>B 1', 'B 1<br>A 1<br>A 2', 'A 2<br>A 1<br>B 1', 'błąd'], 0, 'Najpierw litera, potem liczba.', 'import java.util.Arrays;\n\nclass X implements Comparable<X> {\n    String a;\n    int n;\n\n    X(String a, int n) { this.a = a; this.n = n; }\n\n    @Override\n    public int compareTo(X o) {\n        int w = a.compareTo(o.a);\n        if (w != 0) return w;\n        return Integer.compare(n, o.n);\n    }\n\n    @Override\n    public String toString() { return a + " " + n; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        X[] t = { new X("B", 1), new X("A", 2), new X("A", 1) };\n        Arrays.sort(t);\n        for (X x : t) {\n            System.out.println(x);\n        }\n    }\n}\n'),
      ],
    },

    {
      id: 'sort-comparator', title: 'Comparator: dodatkowy porządek', blurb: 'statyczna klasa wewnętrzna + Arrays.sort(t, cmp)', minutes: 8,
      content: [
        ANA('🧰', 'Klasa ma już porządek naturalny (np. po nazwisku), a Ty chcesz <b>czasem</b> sortować po roku. Zamiast psuć <code>compareTo</code>, dopisz <b>osobny „komparator”</b>: małą klasę z regułą, którą podajesz do <code>Arrays.sort(tablica, komparator)</code>. Najwygodniej zrobić ją jako <b>statyczną klasę wewnętrzną</b> w klasie <code>Osoba</code> (<code>Osoba.PoRoku</code>).'),
        CODE(J`import java.util.Arrays;
import java.util.Comparator;

class Osoba implements Comparable<Osoba> {
    String nazwisko;
    int rok;

    Osoba(String nazwisko, int rok) {
        this.nazwisko = nazwisko;
        this.rok = rok;
    }

    @Override
    public int compareTo(Osoba o) {
        return nazwisko.compareTo(o.nazwisko);
    }

    @Override
    public String toString() {
        return nazwisko + " " + rok;
    }

    public static class PoRoku implements Comparator<Osoba> {
        @Override
        public int compare(Osoba a, Osoba b) {
            return Integer.compare(a.rok, b.rok);
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Osoba[] t = { new Osoba("Nowak", 1980), new Osoba("Adam", 1970), new Osoba("Kot", 2001) };
        Arrays.sort(t, new Osoba.PoRoku());
        for (Osoba o : t) {
            System.out.println(o);
        }
    }
}
`, 'Adam 1970\nNowak 1980\nKot 2001'),
        NOTE('info', 'Różnica w metodach: <code>compareTo(o)</code> ma <b>jeden</b> parametr (porównuje „siebie” z innym), a <code>compare(a, b)</code> ma <b>dwa</b> (stoi z boku).'),
      ],
      guide: {
        files: [FL('Osoba.java', 'import java.util.Comparator;\n\npublic class Osoba implements Comparable<Osoba> {\n    private String nazwisko;\n    private int rok;\n\n    public Osoba(String nazwisko, int rok) {\n        this.nazwisko = nazwisko;\n        this.rok = rok;\n    }\n\n    public String getNazwisko() {\n        return nazwisko;\n    }\n\n    public int getRok() {\n        return rok;\n    }\n\n    @Override\n    public int compareTo(Osoba o) {\n        return nazwisko.compareTo(o.nazwisko);\n    }\n}\n')],
        steps: [
          { say: '<p>Na końcu klasy <code>Osoba</code> dodaj <b>statyczną klasę wewnętrzną</b> implementującą <code>Comparator&lt;Osoba&gt;</code>.</p>', type: '    public static class PoRoku implements Comparator<Osoba> {', expect: J`public\s+static\s+class\s+PoRoku\s+implements\s+Comparator\s*<\s*Osoba\s*>\s*\{` },
          { say: '<p>Napisz metodę <code>compare</code> z <b>dwoma</b> parametrami. Porównaj lata.</p>', type: '        @Override\n        public int compare(Osoba a, Osoba b) {\n            return Integer.compare(a.rok, b.rok);\n        }\n    }', expect: J`public\s+int\s+compare\s*\(\s*Osoba\s+a\s*,\s*Osoba\s+b\s*\)\s*\{\s*return\s+Integer\.compare\s*\(\s*a\.rok\s*,\s*b\.rok\s*\)\s*;\s*\}` },
        ],
        solution: [FL('Osoba.java', 'import java.util.Comparator;\n\npublic class Osoba implements Comparable<Osoba> {\n    private String nazwisko;\n    private int rok;\n\n    public Osoba(String nazwisko, int rok) {\n        this.nazwisko = nazwisko;\n        this.rok = rok;\n    }\n\n    public String getNazwisko() {\n        return nazwisko;\n    }\n\n    public int getRok() {\n        return rok;\n    }\n\n    @Override\n    public int compareTo(Osoba o) {\n        return nazwisko.compareTo(o.nazwisko);\n    }\n\n    public static class PoRoku implements Comparator<Osoba> {\n        @Override\n        public int compare(Osoba a, Osoba b) {\n            return Integer.compare(a.rok, b.rok);\n        }\n    }\n}\n')],
        checks: [
          CK(CR, 'Osoba.PoRoku sortuje rosnąco po roku', J`Osoba[] t = { new Osoba("Nowak", 1980), new Osoba("Adam", 1970), new Osoba("Kot", 2001) }; Arrays.sort(t, new Osoba.PoRoku()); eq(1970, t[0].getRok()); eq(1980, t[1].getRok()); eq(2001, t[2].getRok());`),
          CK(MD, 'Porządek naturalny (po nazwisku) działa dalej', J`Osoba[] t = { new Osoba("Nowak", 1980), new Osoba("Adam", 1970), new Osoba("Kot", 2001) }; Arrays.sort(t); eq("Adam", t[0].getNazwisko()); eq("Kot", t[1].getNazwisko()); eq("Nowak", t[2].getNazwisko());`),
          CK(MN, 'Klasa PoRoku jest statyczna', J`Class<?> c = null; for (Class<?> k : cls("Osoba").getDeclaredClasses()) if (k.getSimpleName().equals("PoRoku")) c = k; isTrue("Brak klasy wewnętrznej PoRoku", c != null); isTrue("PoRoku ma być static", Modifier.isStatic(c.getModifiers()));`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Ksiazka</code> ma porządek naturalny po tytule. Dodaj <b>statyczną klasę wewnętrzną</b> <code>PoStronach</code> implementującą <code>Comparator&lt;Ksiazka&gt;</code>: rosnąco po liczbie stron.</p>',
        files: [FL('Ksiazka.java', 'import java.util.Comparator;\n\npublic class Ksiazka implements Comparable<Ksiazka> {\n    private String tytul;\n    private int strony;\n\n    public Ksiazka(String tytul, int strony) {\n        this.tytul = tytul;\n        this.strony = strony;\n    }\n\n    public String getTytul() {\n        return tytul;\n    }\n\n    public int getStrony() {\n        return strony;\n    }\n\n    @Override\n    public int compareTo(Ksiazka o) {\n        return tytul.compareTo(o.tytul);\n    }\n}\n')],
        hints: ['<code>public static class PoStronach implements Comparator<Ksiazka> { ... }</code>', '<code>return Integer.compare(a.strony, b.strony);</code>'],
        solution: [FL('Ksiazka.java', 'import java.util.Comparator;\n\npublic class Ksiazka implements Comparable<Ksiazka> {\n    private String tytul;\n    private int strony;\n\n    public Ksiazka(String tytul, int strony) {\n        this.tytul = tytul;\n        this.strony = strony;\n    }\n\n    public String getTytul() {\n        return tytul;\n    }\n\n    public int getStrony() {\n        return strony;\n    }\n\n    @Override\n    public int compareTo(Ksiazka o) {\n        return tytul.compareTo(o.tytul);\n    }\n\n    public static class PoStronach implements Comparator<Ksiazka> {\n        @Override\n        public int compare(Ksiazka a, Ksiazka b) {\n            return Integer.compare(a.strony, b.strony);\n        }\n    }\n}\n')],
        checks: [
          CK(CR, 'PoStronach sortuje rosnąco', J`Ksiazka[] t = { new Ksiazka("C", 300), new Ksiazka("A", 100), new Ksiazka("B", 200) }; Arrays.sort(t, new Ksiazka.PoStronach()); eq(100, t[0].getStrony()); eq(200, t[1].getStrony()); eq(300, t[2].getStrony());`),
          CK(MD, 'Porządek naturalny po tytule bez zmian', J`Ksiazka[] t = { new Ksiazka("C", 300), new Ksiazka("A", 100), new Ksiazka("B", 200) }; Arrays.sort(t); eq("A", t[0].getTytul()); eq("C", t[2].getTytul());`),
        ],
      },
      quiz: [
        Q('Ile parametrów ma metoda <code>compare</code> z <code>Comparator</code>?', ['dwa', 'jeden', 'trzy', 'żadnego'], 0, 'Porównuje dwa obiekty „z boku”.'),
        Q('Jak posortować tablicę <code>t</code> według komparatora <code>PoRoku</code>?', ['Arrays.sort(t, new Osoba.PoRoku())', 'Arrays.sort(t)', 'Osoba.sort(t)', 't.sort()'], 0, 'Komparator jest drugim argumentem.'),
        Q('Dlaczego klasa komparatora jest <code>static</code>?', ['żeby używać jej bez tworzenia obiektu Osoba', 'bo tak jest szybciej', 'bo inaczej nie ma konstruktora', 'to nie ma sensu'], 0, 'Statyczna klasa wewnętrzna nie wymaga obiektu zewnętrznego.'),
        OUTQ('Co wypisze program?', ['1<br>2<br>3', '3<br>2<br>1', '2<br>1<br>3', 'błąd'], 0, 'Komparator sortuje rosnąco po liczbie.', 'import java.util.Arrays;\nimport java.util.Comparator;\n\nclass L {\n    int n;\n\n    L(int n) { this.n = n; }\n\n    static class Rosnaco implements Comparator<L> {\n        public int compare(L a, L b) {\n            return Integer.compare(a.n, b.n);\n        }\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        L[] t = { new L(3), new L(1), new L(2) };\n        Arrays.sort(t, new L.Rosnaco());\n        for (L l : t) {\n            System.out.println(l.n);\n        }\n    }\n}\n'),
      ],
    },

    {
      id: 'sort-malejaco', title: 'Sortowanie malejące', blurb: 'zamień kolejność argumentów', minutes: 5,
      content: [
        ANA('🔄', 'Chcesz od największego do najmniejszego? Nie pisz niczego nowego: w komparatorze <b>zamień miejscami</b> dwa argumenty. Zamiast <code>Integer.compare(a.rok, b.rok)</code> napisz <code>Integer.compare(b.rok, a.rok)</code>. Duże liczby zaczną być „mniejsze” i pojawią się na początku.'),
        VIZ('compare', { cols: [
          { icon: '📈', title: 'rosnąco', c: 'accent', items: ['<code>Integer.compare(a.rok, b.rok)</code>', '1970, 1980, 2001'] },
          { icon: '📉', title: 'malejąco', c: 'warn', items: ['<code>Integer.compare(b.rok, a.rok)</code>', '2001, 1980, 1970'] }] }),
        CODE(J`import java.util.Arrays;
import java.util.Comparator;

class Osoba {
    String nazwisko;
    int rok;

    Osoba(String nazwisko, int rok) {
        this.nazwisko = nazwisko;
        this.rok = rok;
    }

    @Override
    public String toString() {
        return nazwisko + " " + rok;
    }

    public static class PoRokuMalejaco implements Comparator<Osoba> {
        @Override
        public int compare(Osoba a, Osoba b) {
            return Integer.compare(b.rok, a.rok);
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Osoba[] t = { new Osoba("Nowak", 1980), new Osoba("Adam", 1970), new Osoba("Kot", 2001) };
        Arrays.sort(t, new Osoba.PoRokuMalejaco());
        for (Osoba o : t) {
            System.out.println(o);
        }
    }
}
`, 'Kot 2001\nNowak 1980\nAdam 1970'),
        NOTE('warn', 'Nie używaj sztuczki z minusem (<code>return -(a - b)</code>) przy liczbach: może się przekręcić zakres <code>int</code>. Zamiana kolejności w <code>Integer.compare</code> jest bezpieczna.'),
      ],
      guide: {
        files: [FL('Osoba.java', 'import java.util.Comparator;\n\npublic class Osoba {\n    private String nazwisko;\n    private int rok;\n\n    public Osoba(String nazwisko, int rok) {\n        this.nazwisko = nazwisko;\n        this.rok = rok;\n    }\n\n    public String getNazwisko() {\n        return nazwisko;\n    }\n\n    public int getRok() {\n        return rok;\n    }\n}\n')],
        steps: [
          { say: '<p>Dodaj statyczną klasę wewnętrzną komparatora do sortowania <b>malejącego</b> po roku.</p>', type: '    public static class PoRokuMalejaco implements Comparator<Osoba> {', expect: J`public\s+static\s+class\s+PoRokuMalejaco\s+implements\s+Comparator\s*<\s*Osoba\s*>\s*\{` },
          { say: '<p>W <code>compare</code> zamień kolejność argumentów: najpierw <code>b</code>, potem <code>a</code>.</p>', type: '        @Override\n        public int compare(Osoba a, Osoba b) {\n            return Integer.compare(b.rok, a.rok);\n        }\n    }', expect: J`public\s+int\s+compare\s*\(\s*Osoba\s+a\s*,\s*Osoba\s+b\s*\)\s*\{\s*return\s+Integer\.compare\s*\(\s*b\.rok\s*,\s*a\.rok\s*\)\s*;\s*\}` },
        ],
        solution: [FL('Osoba.java', 'import java.util.Comparator;\n\npublic class Osoba {\n    private String nazwisko;\n    private int rok;\n\n    public Osoba(String nazwisko, int rok) {\n        this.nazwisko = nazwisko;\n        this.rok = rok;\n    }\n\n    public String getNazwisko() {\n        return nazwisko;\n    }\n\n    public int getRok() {\n        return rok;\n    }\n\n    public static class PoRokuMalejaco implements Comparator<Osoba> {\n        @Override\n        public int compare(Osoba a, Osoba b) {\n            return Integer.compare(b.rok, a.rok);\n        }\n    }\n}\n')],
        checks: [
          CK(CR, 'Sortowanie malejące po roku', J`Osoba[] t = { new Osoba("Nowak", 1980), new Osoba("Adam", 1970), new Osoba("Kot", 2001) }; Arrays.sort(t, new Osoba.PoRokuMalejaco()); eq(2001, t[0].getRok()); eq(1980, t[1].getRok()); eq(1970, t[2].getRok());`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Film</code> ma pole <code>minuty</code> (int). Dodaj statyczną klasę wewnętrzną <code>PoDlugosciMalejaco</code> (<code>Comparator&lt;Film&gt;</code>): najdłuższe filmy na początku.</p>',
        files: [FL('Film.java', 'import java.util.Comparator;\n\npublic class Film {\n    private String tytul;\n    private int minuty;\n\n    public Film(String tytul, int minuty) {\n        this.tytul = tytul;\n        this.minuty = minuty;\n    }\n\n    public String getTytul() {\n        return tytul;\n    }\n\n    public int getMinuty() {\n        return minuty;\n    }\n}\n')],
        hints: ['<code>return Integer.compare(b.minuty, a.minuty);</code>'],
        solution: [FL('Film.java', 'import java.util.Comparator;\n\npublic class Film {\n    private String tytul;\n    private int minuty;\n\n    public Film(String tytul, int minuty) {\n        this.tytul = tytul;\n        this.minuty = minuty;\n    }\n\n    public String getTytul() {\n        return tytul;\n    }\n\n    public int getMinuty() {\n        return minuty;\n    }\n\n    public static class PoDlugosciMalejaco implements Comparator<Film> {\n        @Override\n        public int compare(Film a, Film b) {\n            return Integer.compare(b.minuty, a.minuty);\n        }\n    }\n}\n')],
        checks: [
          CK(CR, 'Najdłuższe filmy na początku', J`Film[] t = { new Film("a", 90), new Film("b", 150), new Film("c", 120) }; Arrays.sort(t, new Film.PoDlugosciMalejaco()); eq(150, t[0].getMinuty()); eq(120, t[1].getMinuty()); eq(90, t[2].getMinuty());`),
        ],
      },
      quiz: [
        Q('Jak odwrócić kierunek sortowania w komparatorze?', ['zamienić miejscami argumenty w Integer.compare', 'dodać słowo reverse', 'zmienić static na final', 'usunąć @Override'], 0, 'compare(b, a) zamiast compare(a, b).'),
        OUTQ('Co wypisze program?', ['3<br>2<br>1', '1<br>2<br>3', '2<br>3<br>1', 'błąd'], 0, 'Zamiana argumentów daje kolejność malejącą.', 'import java.util.Arrays;\nimport java.util.Comparator;\n\nclass L {\n    int n;\n\n    L(int n) { this.n = n; }\n\n    static class Malejaco implements Comparator<L> {\n        public int compare(L a, L b) {\n            return Integer.compare(b.n, a.n);\n        }\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        L[] t = { new L(2), new L(3), new L(1) };\n        Arrays.sort(t, new L.Malejaco());\n        for (L l : t) {\n            System.out.println(l.n);\n        }\n    }\n}\n'),
        Q('Co robi <code>Arrays.sort(t, komparator)</code>?', ['sortuje według reguły z komparatora', 'sortuje zawsze po compareTo', 'usuwa duplikaty', 'kopiuje tablicę'], 0, 'Komparator wygrywa z porządkiem naturalnym.'),
      ],
    },
  ],
  labs: [
    {
      id: 'lab-sort', title: 'Zadanie własne: Biblioteka i sortowanie książek', source: 'zadanie własne (Comparable + Comparator z Wykładu 4)', own: true, concepts: ['sort-comparable', 'sort-kryteria', 'sort-comparator'],
      statement: J`<p>Zaimplementuj sortowanie książek na kilka sposobów – dokładnie tak, jak na wykładzie dla klasy <code>Person</code>.</p>
<ol>
<li><b>Ksiazka</b> – prywatne pola <code>tytul</code>, <code>autor</code> (String), <code>rokWydania</code>, <code>liczbaStron</code> (int); konstruktor w tej kolejności; gettery <code>getTytul()</code>, <code>getAutor()</code>, <code>getRokWydania()</code>, <code>getLiczbaStron()</code>; <code>toString()</code>: <code>autor: tytul (rokWydania)</code>.</li>
<li><b>Porządek domyślny</b> (<code>Comparable&lt;Ksiazka&gt;</code>): najpierw po <code>autor</code>, a przy tym samym autorze po <code>tytul</code> (alfabetycznie).</li>
<li>Statyczna klasa wewnętrzna <b>Ksiazka.PoRoku</b> (<code>Comparator&lt;Ksiazka&gt;</code>) – rosnąco po roku wydania.</li>
<li>Statyczna klasa wewnętrzna <b>Ksiazka.PoStronach</b> (<code>Comparator&lt;Ksiazka&gt;</code>) – <b>malejąco</b> po liczbie stron.</li>
<li><b>Biblioteka</b> – publiczne metody statyczne <code>void sortujDomyslnie(Ksiazka[] t)</code>, <code>void sortujPoRoku(Ksiazka[] t)</code>, <code>void sortujPoStronach(Ksiazka[] t)</code> (użyj <code>Arrays.sort</code>).</li>
<li><b>Main</b>: utwórz tablicę 4 książek, posortuj ją trzema sposobami i po każdym sortowaniu wypisz książki (po jednej w linii).</li>
</ol>`,
      notes: 'Zadanie własne. Użyj nazw bez polskich znaków. Format toString: <code>Autor: Tytul (1999)</code>.',
      files: [
        { name: 'Ksiazka.java', code: J`public class Ksiazka {

}
` },
        { name: 'Biblioteka.java', code: J`public class Biblioteka {

}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {

    }
}
` }],
      hints: ['compareTo: <code>int w = autor.compareTo(o.autor); if (w != 0) return w; return tytul.compareTo(o.tytul);</code>', 'Dwie klasy wewnętrzne: <code>public static class PoRoku implements Comparator&lt;Ksiazka&gt;</code> i <code>PoStronach</code> – importuj <code>java.util.Comparator</code>.', '<code>Arrays.sort(t, new Ksiazka.PoRoku());</code>'],
      solution: [
        { name: 'Ksiazka.java', code: J`import java.util.Comparator;

public class Ksiazka implements Comparable<Ksiazka> {
    private String tytul;
    private String autor;
    private int rokWydania;
    private int liczbaStron;

    public Ksiazka(String tytul, String autor, int rokWydania, int liczbaStron) {
        this.tytul = tytul;
        this.autor = autor;
        this.rokWydania = rokWydania;
        this.liczbaStron = liczbaStron;
    }

    public String getTytul() {
        return tytul;
    }

    public String getAutor() {
        return autor;
    }

    public int getRokWydania() {
        return rokWydania;
    }

    public int getLiczbaStron() {
        return liczbaStron;
    }

    @Override
    public int compareTo(Ksiazka o) {
        int w = autor.compareTo(o.autor);
        if (w != 0) {
            return w;
        }
        return tytul.compareTo(o.tytul);
    }

    @Override
    public String toString() {
        return autor + ": " + tytul + " (" + rokWydania + ")";
    }

    public static class PoRoku implements Comparator<Ksiazka> {
        @Override
        public int compare(Ksiazka a, Ksiazka b) {
            return Integer.compare(a.rokWydania, b.rokWydania);
        }
    }

    public static class PoStronach implements Comparator<Ksiazka> {
        @Override
        public int compare(Ksiazka a, Ksiazka b) {
            return Integer.compare(b.liczbaStron, a.liczbaStron);
        }
    }
}
` },
        { name: 'Biblioteka.java', code: J`import java.util.Arrays;

public class Biblioteka {
    public static void sortujDomyslnie(Ksiazka[] t) {
        Arrays.sort(t);
    }

    public static void sortujPoRoku(Ksiazka[] t) {
        Arrays.sort(t, new Ksiazka.PoRoku());
    }

    public static void sortujPoStronach(Ksiazka[] t) {
        Arrays.sort(t, new Ksiazka.PoStronach());
    }
}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void wypisz(Ksiazka[] t) {
        for (Ksiazka k : t) {
            System.out.println(k);
        }
    }

    public static void main(String[] args) {
        Ksiazka[] t = {
            new Ksiazka("Pan Tadeusz", "Mickiewicz", 1834, 400),
            new Ksiazka("Dziady", "Mickiewicz", 1822, 250),
            new Ksiazka("Lalka", "Prus", 1890, 700),
            new Ksiazka("Quo Vadis", "Sienkiewicz", 1896, 550)
        };
        Biblioteka.sortujDomyslnie(t);
        wypisz(t);
        Biblioteka.sortujPoRoku(t);
        wypisz(t);
        Biblioteka.sortujPoStronach(t);
        wypisz(t);
    }
}
` }],
      checks: [
        CK(CR, 'Ksiazka: konstruktor, gettery i toString', J`Ksiazka k = new Ksiazka("Lalka", "Prus", 1890, 700);
eq("Lalka", k.getTytul()); eq("Prus", k.getAutor()); eq(1890, k.getRokWydania()); eq(700, k.getLiczbaStron());
eq("Prus: Lalka (1890)", k.toString());`),
        CK(CR, 'Ksiazka implementuje Comparable', J`isTrue("Ksiazka powinna implementować Comparable<Ksiazka>", Comparable.class.isAssignableFrom(cls("Ksiazka")));`),
        CK(CR, 'Porządek domyślny: autor, potem tytuł', J`Ksiazka[] t = { new Ksiazka("Pan Tadeusz", "Mickiewicz", 1834, 400), new Ksiazka("Lalka", "Prus", 1890, 700), new Ksiazka("Dziady", "Mickiewicz", 1822, 250) };
java.util.Arrays.sort(t);
eq("Dziady", t[0].getTytul()); eq("Pan Tadeusz", t[1].getTytul()); eq("Lalka", t[2].getTytul());`),
        CK(CR, 'PoRoku i PoStronach są statycznymi klasami wewnętrznymi implementującymi Comparator', J`for (String n : new String[]{"Ksiazka$PoRoku", "Ksiazka$PoStronach"}) {
    Class<?> c = cls(n);
    isTrue(n + " powinna być static", Modifier.isStatic(c.getModifiers()));
    isTrue(n + " powinna implementować Comparator", java.util.Comparator.class.isAssignableFrom(c));
}`),
        CK(CR, 'Ksiazka.PoRoku sortuje rosnąco po roku', J`Ksiazka[] t = { new Ksiazka("A", "x", 1900, 1), new Ksiazka("B", "y", 1800, 1), new Ksiazka("C", "z", 1850, 1) };
java.util.Arrays.sort(t, new Ksiazka.PoRoku());
eq(1800, t[0].getRokWydania()); eq(1850, t[1].getRokWydania()); eq(1900, t[2].getRokWydania());`),
        CK(CR, 'Ksiazka.PoStronach sortuje malejąco po liczbie stron', J`Ksiazka[] t = { new Ksiazka("A", "x", 1, 100), new Ksiazka("B", "y", 1, 500), new Ksiazka("C", "z", 1, 300) };
java.util.Arrays.sort(t, new Ksiazka.PoStronach());
eq(500, t[0].getLiczbaStron()); eq(300, t[1].getLiczbaStron()); eq(100, t[2].getLiczbaStron());`),
        CK(CR, 'Biblioteka: trzy metody sortujące tablicę', J`Ksiazka[] t = { new Ksiazka("Pan Tadeusz", "Mickiewicz", 1834, 400), new Ksiazka("Dziady", "Mickiewicz", 1822, 250), new Ksiazka("Lalka", "Prus", 1890, 700) };
Biblioteka.sortujDomyslnie(t); eq("Dziady", t[0].getTytul());
Biblioteka.sortujPoRoku(t); eq(1822, t[0].getRokWydania()); eq(1890, t[2].getRokWydania());
Biblioteka.sortujPoStronach(t); eq(700, t[0].getLiczbaStron()); eq(250, t[2].getLiczbaStron());`),
        CK(MD, 'Metody Biblioteki są publiczne i statyczne', J`for (String n : new String[]{"sortujDomyslnie", "sortujPoRoku", "sortujPoStronach"}) {
    int m = methodMods("Biblioteka", n);
    isTrue(n + " ma być static", Modifier.isStatic(m)); isTrue(n + " ma być public", Modifier.isPublic(m));
}`),
        CK(MD, 'Main wypisuje 12 linii (3 sortowania × 4 książki)', J`List<String> l = lines(runMain());
isTrue("Main powinien wypisać 12 linii – jest: " + l.size(), l.size() >= 12);`),
        CK(MN, 'Porównania liczb przez Integer.compare, napisów przez compareTo', J`isTrue("Użyj Integer.compare(...)", srcHas("Ksiazka", "Integer\\s*\\.\\s*compare"));
isTrue("Użyj String.compareTo dla autora/tytułu", srcHas("Ksiazka", "\\.compareTo\\s*\\("));
isTrue("Użyj Arrays.sort", srcHas("Biblioteka", "Arrays\\s*\\.\\s*sort"));`),
      ],
    },
  ],

  quiz: [
    Q('Co powinna zwracać metoda <code>compareTo(T o)</code>?', ['ujemną, jeśli bieżący obiekt jest mniejszy od <code>o</code>', 'zero, jeśli równe', 'dodatnią, jeśli bieżący obiekt jest większy od <code>o</code>', 'zawsze <code>true</code>/<code>false</code>'], [0, 1, 2], 'Zwraca <code>int</code>, nie <code>boolean</code>.', 'sort-comparable'),
    Q('Który interfejs implementujemy w <b>porównywanej</b> klasie, a który w <b>osobnej</b> klasie komparatora?', ['<code>Comparable</code> w porównywanej, <code>Comparator</code> w osobnej', '<code>Comparator</code> w porównywanej, <code>Comparable</code> w osobnej', 'oba w porównywanej klasie', 'oba w osobnej klasie'], 0, '<code>Comparable</code> – porządek naturalny; <code>Comparator</code> – dodatkowe porządki.', 'sort-comparator'),
    Q('Co wypisze program?', ['1 2 3', '3 2 1', '2 1 3', '1 3 2'], 0, '<code>Arrays.sort</code> na <code>Integer[]</code> korzysta z naturalnego porządku (<code>Integer</code> implementuje <code>Comparable</code>).', 'sort-comparable', { code: J`import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        Integer[] t = { 3, 1, 2 };
        Arrays.sort(t);
        System.out.println(t[0] + " " + t[1] + " " + t[2]);
    }
}` }),
    Q('Co wypisze program?', ['3 2 1', '1 2 3', '2 3 1', 'błąd kompilacji'], 0, 'Komparator odwraca kolejność argumentów – porządek malejący.', 'sort-comparator', { code: J`import java.util.Arrays;
import java.util.Comparator;

class Malejaco implements Comparator<Integer> {
    @Override
    public int compare(Integer a, Integer b) {
        return Integer.compare(b, a);
    }
}

public class Main {
    public static void main(String[] args) {
        Integer[] t = { 3, 1, 2 };
        Arrays.sort(t, new Malejaco());
        System.out.println(t[0] + " " + t[1] + " " + t[2]);
    }
}` }),
    Q('Klasa wewnętrzna statyczna (<code>static class</code>)…', ['może być używana bez instancji klasy zewnętrznej', 'ma dostęp do niestatycznych pól klasy zewnętrznej bez obiektu', 'może używać <code>this</code> klasy zewnętrznej', 'jest niezależna od instancji klasy zewnętrznej'], [0, 3], 'Statyczna klasa zagnieżdżona nie ma dostępu do instancji klasy zewnętrznej.', 'sort-comparator'),
    Q('Czym różni się <code>int</code> od <code>Integer</code>?', ['<code>int</code> to typ prosty, <code>Integer</code> – klasa opakowująca z metodami (np. <code>compareTo</code>)', 'nie różnią się niczym', '<code>Integer</code> to typ prosty, <code>int</code> – klasa', '<code>int</code> może być null'], 0, 'Klasa opakowująca pozwala traktować liczbę jak obiekt.', 'sort-comparable'),
  ],
});
