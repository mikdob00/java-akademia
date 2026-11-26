'use strict';
ACAD.modules.push({
  id: 'iface', num: 8, level: 3, icon: '🔌', title: 'Interfejsy',
  source: 'Wykład 4 – interfejsy · (zadanie własne – brak PDF z laboratorium)',
  summary: 'interface, implements, metody default/prywatne/statyczne, stałe, wiele interfejsów i dziedziczenie jednocześnie.',
  goals: ['zadeklarować interfejs i zaimplementować go w klasie', 'wiedzieć, co może zawierać interfejs (metody abstrakcyjne, default, stałe)', 'zgrupować różne obiekty w tablicy typu interfejsu', 'połączyć <code>extends</code> z wieloma <code>implements</code>'],
  lessons: [

    {
      id: 'if-idea', micro: true, title: 'Po co interfejsy?', blurb: 'umowa: „co potrafisz”, bez „jak”', minutes: 4,
      content: [
        ANA('🔌', 'Gniazdko w ścianie to <b>interfejs</b>: obiecuje „pasuje do mnie wtyczka”, ale nie obchodzi go, czy podłączysz lampę, czy ładowarkę. Interfejs w Javie to <b>lista umiejętności</b> („potrafię latać”), bez opisu <b>jak</b> to się robi. Każda klasa, która go „podpisze”, musi te umiejętności zapewnić po swojemu.'),
        VIZ('compare', { cols: [
          { icon: '🧬', title: 'dziedziczenie (extends)', c: 'accent', sub: 'czym jesteś', items: ['Pies <b>jest</b> Zwierzęciem', 'tylko <b>jedna</b> nadklasa'] },
          { icon: '🔌', title: 'interfejs (implements)', c: 'ok', sub: 'co potrafisz', items: ['Ptak <b>potrafi</b> latać', 'klasa może mieć <b>wiele</b> interfejsów'] }] }),
        TERMS([['<code>interface</code>', 'zbiór metod do zaimplementowania (umowa)'], ['<code>implements</code>', 'klasa „podpisuje umowę” i musi napisać wszystkie jej metody'], ['różnica od klasy abstrakcyjnej', 'interfejs opisuje tylko <b>umiejętność</b>; klasa może mieć ich kilka naraz']]),
      ],
      quiz: [
        Q('Do czego służy interfejs?', ['opisuje, co klasa potrafi, bez mówienia jak', 'przechowuje dane obiektu', 'zastępuje klasę Main', 'tworzy tablice'], 0, 'To umowa: nazwy metod bez ich treści.'),
        Q('Ile interfejsów może zaimplementować jedna klasa?', ['dowolnie wiele', 'tylko jeden', 'maksymalnie dwa', 'żadnego'], 0, 'Dziedziczyć można po jednej klasie, ale interfejsów może być wiele.'),
        Q('Które słowo kluczowe łączy klasę z interfejsem?', ['implements', 'extends', 'inherits', 'uses'], 0, '<code>extends</code> jest dla klasy po klasie.'),
      ],
    },

    {
      id: 'if-podstawy', title: 'Interfejs: deklaracja i implementacja', blurb: 'interface Latajacy + implements', minutes: 6,
      content: [
        ANA('📜', 'Interfejs piszesz jak klasę, tylko ze słowem <code>interface</code>. W środku są <b>same nagłówki metod</b> (bez treści, ze średnikiem). Klasa „podpisuje umowę” słowem <code>implements</code> i <b>musi</b> napisać wszystkie te metody, każdą z <code>@Override</code> i jako <code>public</code>.'),
        CODE(J`interface Latajacy {
    void lataj();
}

class Ptak implements Latajacy {
    @Override
    public void lataj() {
        System.out.println("Ptak macha skrzydlami");
    }
}

public class Main {
    public static void main(String[] args) {
        Ptak p = new Ptak();
        p.lataj();
    }
}
`, 'Ptak macha skrzydlami'),
        NOTE('warn', 'Metody interfejsu są automatycznie <code>public</code>, więc w klasie implementującej też muszą mieć <code>public</code>. Brak <code>public</code> to częsty błąd kompilacji.'),
      ],
      guide: {
        files: [FL('Latajacy.java', ''), FL('Ptak.java', 'public class Ptak {\n}\n')],
        steps: [
          { say: '<p>W pliku <code>Latajacy.java</code> zadeklaruj interfejs słowem <code>interface</code>.</p>', type: 'public interface Latajacy {', expect: J`interface\s+Latajacy\s*\{` },
          { say: '<p>Dodaj jeden nagłówek metody: bez klamer, ze średnikiem. Zamknij interfejs.</p>', type: '    void lataj();\n}', expect: J`interface\s+Latajacy\s*\{\s*void\s+lataj\s*\(\s*\)\s*;\s*\}` },
          { say: '<p>W <code>Ptak.java</code> podpisz umowę słowem <code>implements</code>.</p>', type: 'public class Ptak implements Latajacy {', expect: J`class\s+Ptak\s+implements\s+Latajacy\s*\{` },
          { say: '<p>Napisz obowiązkową metodę (z <code>@Override</code> i <code>public</code>), która wypisze tekst.</p>', type: '    @Override\n    public void lataj() {\n        System.out.println("Ptak macha skrzydlami");\n    }\n}', expect: J`@Override\s+public\s+void\s+lataj\s*\(\s*\)\s*\{\s*System\.out\.println\s*\(\s*"Ptak macha skrzydlami"\s*\)\s*;\s*\}` },
        ],
        solution: [FL('Latajacy.java', 'public interface Latajacy {\n    void lataj();\n}\n'), FL('Ptak.java', 'public class Ptak implements Latajacy {\n    @Override\n    public void lataj() {\n        System.out.println("Ptak macha skrzydlami");\n    }\n}\n')],
        checks: [
          CK(CR, 'Latajacy jest interfejsem', J`isTrue("Latajacy ma być interface", cls("Latajacy").isInterface());`),
          CK(CR, 'Ptak implementuje Latajacy', J`isTrue("Ptak ma implementować Latajacy", implementsIface("Ptak", "Latajacy"));`),
          CK(CR, 'Ptak.lataj() wypisuje tekst', J`List<String> o = lines(out(() -> call(make("Ptak"), "lataj"))); isTrue("Oczekiwano: [Ptak macha skrzydlami] – wypisano: " + o, o.equals(Arrays.asList("Ptak macha skrzydlami")));`),
        ],
      },
      exercise: {
        prompt: '<p>Zadeklaruj interfejs <code>Plywajacy</code> z metodą <code>void plyn()</code>. Klasa <code>Ryba</code> ma go zaimplementować: <code>plyn()</code> wypisuje <code>Ryba plynie</code>.</p>',
        files: [FL('Plywajacy.java', ''), FL('Ryba.java', 'public class Ryba {\n}\n')],
        hints: ['<code>public interface Plywajacy { void plyn(); }</code>', '<code>public class Ryba implements Plywajacy { @Override public void plyn() { ... } }</code>'],
        solution: [FL('Plywajacy.java', 'public interface Plywajacy {\n    void plyn();\n}\n'), FL('Ryba.java', 'public class Ryba implements Plywajacy {\n    @Override\n    public void plyn() {\n        System.out.println("Ryba plynie");\n    }\n}\n')],
        checks: [
          CK(CR, 'Plywajacy jest interfejsem z metodą plyn()', J`isTrue("Plywajacy ma być interface", cls("Plywajacy").isInterface()); isTrue("Brak metody plyn()", hasMethod("Plywajacy", "plyn"));`),
          CK(CR, 'Ryba implementuje i wypisuje „Ryba plynie”', J`isTrue("Ryba ma implementować Plywajacy", implementsIface("Ryba", "Plywajacy")); List<String> o = lines(out(() -> call(make("Ryba"), "plyn"))); isTrue("Oczekiwano: [Ryba plynie] – wypisano: " + o, o.equals(Arrays.asList("Ryba plynie")));`),
        ],
      },
      quiz: [
        Q('Jak wygląda metoda w interfejsie?', ['sam nagłówek ze średnikiem, bez treści', 'metoda z pełną treścią w klamrach', 'metoda z słowem final', 'metoda z konstruktorem'], 0, 'Treść piszą klasy implementujące.'),
        Q('Dlaczego metoda implementująca w klasie musi mieć <code>public</code>?', ['bo metody interfejsu są domyślnie public', 'bo tak wygląda ładniej', 'bo static to wymaga', 'to nie jest wymagane'], 0, 'Nie można zawęzić dostępu względem interfejsu.'),
        Q('Co się stanie, gdy klasa implementująca nie napisze którejś metody interfejsu (a nie jest abstrakcyjna)?', ['błąd kompilacji', 'metoda będzie pusta', 'program uruchomi się normalnie', 'wyjątek w czasie działania'], 0, 'Umowa wymaga wszystkich metod.'),
        OUTQ('Co wypisze program?', ['Hau!', 'Miau!', 'Hau!<br>Miau!', 'błąd'], 0, 'Klasa Pies zaimplementowała metodę po swojemu.', 'interface Glos {\n    void daj();\n}\n\nclass Pies implements Glos {\n    @Override\n    public void daj() {\n        System.out.println("Hau!");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        new Pies().daj();\n    }\n}\n'),
      ],
    },

    {
      id: 'if-typ', title: 'Interfejs jako typ', blurb: 'Latajacy[] z różnymi obiektami', minutes: 5,
      content: [
        ANA('🎫', 'Interfejs działa jak <b>bilet wstępu</b>: nie ważne, kim jesteś, ważne, że masz bilet „potrafię latać”. Zmienna typu <code>Latajacy</code> może trzymać <b>każdy obiekt</b>, którego klasa implementuje ten interfejs: Ptaka, Samolot… To ten sam polimorfizm co przy dziedziczeniu.'),
        VIZ('objects', { vars: [{ t: 'Latajacy', n: 'a', to: 'p' }, { t: 'Latajacy', n: 'b', to: 's' }], objs: [{ id: 'p', c: 'Ptak', f: [] }, { id: 's', c: 'Samolot', f: [] }], cap: 'Obie zmienne mają typ interfejsu, ale wskazują na obiekty różnych klas.' }),
        CODE(J`interface Latajacy {
    void lataj();
}

class Ptak implements Latajacy {
    public void lataj() { System.out.println("Ptak macha skrzydlami"); }
}

class Samolot implements Latajacy {
    public void lataj() { System.out.println("Samolot startuje"); }
}

public class Main {
    public static void main(String[] args) {
        Latajacy[] t = { new Ptak(), new Samolot() };
        for (Latajacy l : t) {
            l.lataj();
        }
    }
}
`, 'Ptak macha skrzydlami\nSamolot startuje'),
        NOTE('info', 'Przez zmienną typu interfejsu widzisz <b>tylko metody z interfejsu</b>. Jeśli chcesz użyć czegoś specyficznego dla klasy, potrzebny jest <code>instanceof</code> i rzutowanie (tak jak w lekcji o downcastingu).'),
      ],
      guide: {
        files: [FL('Latajacy.java', 'public interface Latajacy {\n    void lataj();\n}\n'), FL('Ptak.java', 'public class Ptak implements Latajacy {\n    public void lataj() {\n        System.out.println("Ptak macha skrzydlami");\n    }\n}\n'), FL('Samolot.java', 'public class Samolot implements Latajacy {\n    public void lataj() {\n        System.out.println("Samolot startuje");\n    }\n}\n'), FL('Main.java', MAINW([]))],
        steps: [
          { say: '<p>W <code>main</code> zrób tablicę typu <b>interfejsu</b>, w której leżą obiekty dwóch różnych klas.</p>', type: 'Latajacy[] t = { new Ptak(), new Samolot() };', expect: J`Latajacy\s*\[\s*\]\s+t\s*=\s*\{\s*new\s+Ptak\s*\(\s*\)\s*,\s*new\s+Samolot\s*\(\s*\)\s*\}\s*;` },
          { say: '<p>Przejdź po tablicy pętlą for-each i wywołaj <code>lataj()</code> na każdym elemencie.</p>', type: 'for (Latajacy l : t) {\n    l.lataj();\n}', expect: J`for\s*\(\s*Latajacy\s+l\s*:\s*t\s*\)\s*\{\s*l\.lataj\s*\(\s*\)\s*;\s*\}` },
        ],
        solution: [FL('Latajacy.java', 'public interface Latajacy {\n    void lataj();\n}\n'), FL('Ptak.java', 'public class Ptak implements Latajacy {\n    public void lataj() {\n        System.out.println("Ptak macha skrzydlami");\n    }\n}\n'), FL('Samolot.java', 'public class Samolot implements Latajacy {\n    public void lataj() {\n        System.out.println("Samolot startuje");\n    }\n}\n'), FL('Main.java', MAINW(['Latajacy[] t = { new Ptak(), new Samolot() };', 'for (Latajacy l : t) {', '    l.lataj();', '}']))],
        checks: [
          CK(CR, 'Program wypisuje obie linie', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Ptak macha skrzydlami, Samolot startuje] – program wypisał: " + o, o.equals(Arrays.asList("Ptak macha skrzydlami", "Samolot startuje")));`),
          CK(MD, 'Użyto tablicy typu Latajacy[]', J`isTrue("Użyj tablicy Latajacy[]", srcHas("Main", "Latajacy\\s*\\[\\s*\\]"));`),
        ],
      },
      exercise: {
        prompt: '<p>Interfejs <code>Dzwiekowy</code> ma metodę <code>void graj()</code>; klasy <code>Gitara</code> (<code>Brzdek</code>) i <code>Perkusja</code> (<code>Bum</code>) go implementują. W <code>main</code> zrób tablicę <code>Dzwiekowy[]</code> z gitarą i perkusją i w pętli wywołaj <code>graj()</code>.</p><pre>Brzdek\nBum</pre>',
        files: [FL('Dzwiekowy.java', 'public interface Dzwiekowy {\n    void graj();\n}\n'), FL('Gitara.java', 'public class Gitara implements Dzwiekowy {\n    public void graj() {\n        System.out.println("Brzdek");\n    }\n}\n'), FL('Perkusja.java', 'public class Perkusja implements Dzwiekowy {\n    public void graj() {\n        System.out.println("Bum");\n    }\n}\n'), FL('Main.java', MAINW([]))],
        hints: ['<code>Dzwiekowy[] t = { new Gitara(), new Perkusja() };</code>', '<code>for (Dzwiekowy d : t) { d.graj(); }</code>'],
        solution: [FL('Dzwiekowy.java', 'public interface Dzwiekowy {\n    void graj();\n}\n'), FL('Gitara.java', 'public class Gitara implements Dzwiekowy {\n    public void graj() {\n        System.out.println("Brzdek");\n    }\n}\n'), FL('Perkusja.java', 'public class Perkusja implements Dzwiekowy {\n    public void graj() {\n        System.out.println("Bum");\n    }\n}\n'), FL('Main.java', MAINW(['Dzwiekowy[] t = { new Gitara(), new Perkusja() };', 'for (Dzwiekowy d : t) {', '    d.graj();', '}']))],
        checks: [
          CK(CR, 'Program wypisuje Brzdek i Bum', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Brzdek, Bum] – program wypisał: " + o, o.equals(Arrays.asList("Brzdek", "Bum")));`),
          CK(MD, 'Użyto tablicy typu Dzwiekowy[]', J`isTrue("Użyj tablicy Dzwiekowy[]", srcHas("Main", "Dzwiekowy\\s*\\[\\s*\\]"));`),
        ],
      },
      quiz: [
        Q('Co może trzymać zmienna typu interfejsu?', ['obiekt dowolnej klasy implementującej ten interfejs', 'tylko obiekty jednej klasy', 'tylko null', 'tylko liczby'], 0, 'To polimorfizm przez interfejs.'),
        Q('Czy można zrobić <code>new Latajacy()</code> dla interfejsu?', ['nie, interfejs nie ma obiektów', 'tak', 'tak, jeśli ma default', 'tak, ale tylko w Main'], 0, 'Obiekty tworzy się z klas implementujących.'),
        Q('Jakie metody widać przez zmienną typu interfejsu?', ['tylko te zadeklarowane w interfejsie', 'wszystkie z klasy obiektu', 'żadne', 'tylko prywatne'], 0, 'Reszta wymaga rzutowania.'),
        OUTQ('Co wypisze program?', ['Hau!<br>Miau!', 'Miau!<br>Hau!', 'Hau!', 'błąd'], 0, 'Pętla woła metodę kolejno na każdym obiekcie.', 'interface Glos {\n    void daj();\n}\n\nclass Pies implements Glos {\n    public void daj() { System.out.println("Hau!"); }\n}\n\nclass Kot implements Glos {\n    public void daj() { System.out.println("Miau!"); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Glos[] t = { new Pies(), new Kot() };\n        for (Glos g : t) {\n            g.daj();\n        }\n    }\n}\n'),
      ],
    },

    {
      id: 'if-default', title: 'Metody default', blurb: 'interfejs z gotową implementacją', minutes: 5,
      content: [
        ANA('🎁', 'Czasem interfejs chce dać klasom <b>gotowy, domyślny sposób</b>, który mogą przejąć albo nadpisać. Służy do tego <code>default</code>: metoda z treścią. Klasa implementująca <b>nie musi</b> jej pisać, ale może ją <b>nadpisać</b>.'),
        CODE(J`interface Latajacy {
    void lataj();

    default String komunikat() {
        return "Ja latam!";
    }
}

class Ptak implements Latajacy {
    public void lataj() { System.out.println("Ptak macha skrzydlami"); }
}

public class Main {
    public static void main(String[] args) {
        Ptak p = new Ptak();
        p.lataj();
        System.out.println(p.komunikat());
    }
}
`, 'Ptak macha skrzydlami\nJa latam!'),
        NOTE('tip', 'Nadpisując metodę <code>default</code>, możesz wywołać wersję z interfejsu zapisem <code>Latajacy.super.komunikat()</code>.'),
      ],
      guide: {
        files: [FL('Latajacy.java', 'public interface Latajacy {\n    void lataj();\n}\n'), FL('Ptak.java', 'public class Ptak implements Latajacy {\n    public void lataj() {\n        System.out.println("Ptak macha skrzydlami");\n    }\n}\n')],
        steps: [
          { say: '<p>W interfejsie dodaj metodę <b>z treścią</b>, oznaczoną słowem <code>default</code>.</p>', type: '    default String komunikat() {', expect: J`default\s+String\s+komunikat\s*\(\s*\)\s*\{` },
          { say: '<p>Zwróć tekst i zamknij metodę. Klasa <code>Ptak</code> nic nie musi dopisywać, bo dostaje tę metodę „w prezencie”.</p>', type: '        return "Ja latam!";\n    }', expect: J`komunikat\s*\(\s*\)\s*\{\s*return\s*"Ja latam!"\s*;\s*\}` },
        ],
        solution: [FL('Latajacy.java', 'public interface Latajacy {\n    void lataj();\n\n    default String komunikat() {\n        return "Ja latam!";\n    }\n}\n'), FL('Ptak.java', 'public class Ptak implements Latajacy {\n    public void lataj() {\n        System.out.println("Ptak macha skrzydlami");\n    }\n}\n')],
        checks: [
          CK(CR, 'komunikat() w interfejsie jest default', J`isTrue("komunikat ma być metodą default", method("Latajacy", "komunikat").isDefault());`),
          CK(CR, 'Ptak dostaje „Ja latam!” bez własnej metody', J`eq("Ja latam!", call(make("Ptak"), "komunikat"));`),
        ],
      },
      exercise: {
        prompt: '<p>W interfejsie <code>Pozdrawiacz</code> dopisz metodę <code>default String przywitaj()</code> zwracającą <code>Czesc!</code>. Klasa <code>Polak</code> ma ją <b>nadpisać</b> i zwracać <code>Czesc, Polaku!</code>. Klasa <code>Obcy</code> zostaje bez zmian.</p>',
        files: [FL('Pozdrawiacz.java', 'public interface Pozdrawiacz {\n}\n'), FL('Obcy.java', 'public class Obcy implements Pozdrawiacz {\n}\n'), FL('Polak.java', 'public class Polak implements Pozdrawiacz {\n}\n')],
        hints: ['W interfejsie: <code>default String przywitaj() { return "Czesc!"; }</code>', 'W Polak: <code>@Override public String przywitaj() { return "Czesc, Polaku!"; }</code>'],
        solution: [FL('Pozdrawiacz.java', 'public interface Pozdrawiacz {\n    default String przywitaj() {\n        return "Czesc!";\n    }\n}\n'), FL('Obcy.java', 'public class Obcy implements Pozdrawiacz {\n}\n'), FL('Polak.java', 'public class Polak implements Pozdrawiacz {\n    @Override\n    public String przywitaj() {\n        return "Czesc, Polaku!";\n    }\n}\n')],
        checks: [
          CK(CR, 'Obcy używa domyślnej wersji', J`eq("Czesc!", call(make("Obcy"), "przywitaj"));`),
          CK(CR, 'Polak nadpisuje metodę', J`eq("Czesc, Polaku!", call(make("Polak"), "przywitaj"));`),
          CK(MD, 'przywitaj jest default', J`isTrue("przywitaj ma być default", method("Pozdrawiacz", "przywitaj").isDefault());`),
        ],
      },
      quiz: [
        Q('Co daje słowo <code>default</code> przy metodzie interfejsu?', ['metoda ma treść, którą klasy mogą przejąć lub nadpisać', 'metoda jest prywatna', 'metoda jest static', 'metoda jest abstrakcyjna'], 0, 'To domyślna implementacja.'),
        Q('Czy klasa musi nadpisać metodę <code>default</code>?', ['nie, może ją przejąć', 'tak, zawsze', 'tylko gdy jest static', 'tylko gdy jest public'], 0, 'Obowiązkowe są tylko metody bez treści.'),
        OUTQ('Co wypisze program?', ['Czesc!', 'Czesc, Polaku!', 'null', 'błąd'], 0, 'Klasa nie nadpisała, więc działa wersja domyślna.', 'interface P {\n    default String witaj() {\n        return "Czesc!";\n    }\n}\n\nclass A implements P {\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(new A().witaj());\n    }\n}\n'),
        Q('Jak wywołać domyślną wersję z interfejsu <code>Latajacy</code> wewnątrz nadpisanej metody?', ['Latajacy.super.komunikat()', 'super.komunikat()', 'Latajacy.komunikat()', 'this.Latajacy()'], 0, 'Zapis „Interfejs.super.metoda()”.'),
      ],
    },

    {
      id: 'if-stale', title: 'Stałe w interfejsie', blurb: 'int MAKS = 10000;', minutes: 4,
      content: [
        ANA('📏', 'W interfejsie możesz też umieścić <b>stałe</b>: jak tabliczka z limitem prędkości, jedna dla wszystkich. Pola interfejsu są automatycznie <code>public static final</code>, nawet jeśli tego nie napiszesz. Wystarczy np. <code>int MAKSYMALNA_WYSOKOSC = 10000;</code>.'),
        CODE(J`interface Latajacy {
    int MAKSYMALNA_WYSOKOSC = 10000;
    void lataj();
}

public class Main {
    public static void main(String[] args) {
        System.out.println(Latajacy.MAKSYMALNA_WYSOKOSC);
    }
}
`, '10000'),
        NOTE('info', 'Odwołujesz się do stałej przez <b>nazwę interfejsu</b>: <code>Latajacy.MAKSYMALNA_WYSOKOSC</code>. Nazwy stałych piszemy WIELKIMI LITERAMI.'),
      ],
      guide: {
        files: [FL('Latajacy.java', 'public interface Latajacy {\n    void lataj();\n}\n')],
        steps: [
          { say: '<p>W interfejsie dopisz stałą (bez <code>public static final</code>, interfejs doda je sam).</p>', type: '    int MAKSYMALNA_WYSOKOSC = 10000;', expect: J`int\s+MAKSYMALNA_WYSOKOSC\s*=\s*10000\s*;` },
        ],
        solution: [FL('Latajacy.java', 'public interface Latajacy {\n    int MAKSYMALNA_WYSOKOSC = 10000;\n    void lataj();\n}\n')],
        checks: [
          CK(CR, 'Stała ma wartość 10000', J`eq(10000, staticField("Latajacy", "MAKSYMALNA_WYSOKOSC"));`),
          CK(MN, 'Stała jest static final', J`int m = fieldMods("Latajacy", "MAKSYMALNA_WYSOKOSC"); isTrue("Stała ma być static final", Modifier.isStatic(m) && Modifier.isFinal(m));`),
        ],
      },
      exercise: {
        prompt: '<p>W interfejsie <code>Pojazd</code> dodaj stałą <code>int MAX_PREDKOSC = 120;</code> i metodę <code>void jedz()</code>.</p>',
        files: [FL('Pojazd.java', 'public interface Pojazd {\n}\n')],
        hints: ['<code>int MAX_PREDKOSC = 120;</code>', '<code>void jedz();</code>'],
        solution: [FL('Pojazd.java', 'public interface Pojazd {\n    int MAX_PREDKOSC = 120;\n    void jedz();\n}\n')],
        checks: [
          CK(CR, 'Stała MAX_PREDKOSC = 120', J`eq(120, staticField("Pojazd", "MAX_PREDKOSC"));`),
          CK(CR, 'Metoda jedz() jest w interfejsie', J`isTrue("Brak metody jedz()", hasMethod("Pojazd", "jedz"));`),
        ],
      },
      quiz: [
        Q('Jakie modyfikatory ma pole zadeklarowane w interfejsie?', ['public static final', 'private', 'protected', 'żadne, to zwykłe pole'], 0, 'To zawsze stała.'),
        Q('Jak odwołać się do stałej interfejsu <code>Latajacy</code>?', ['Latajacy.MAKSYMALNA_WYSOKOSC', 'new Latajacy().MAKSYMALNA_WYSOKOSC', 'Latajacy->MAKS', 'tylko przez klasę Main'], 0, 'Przez nazwę interfejsu.'),
        Q('Czy można zmienić wartość stałej z interfejsu?', ['nie, jest final', 'tak, setterem', 'tak, w klasie implementującej', 'tak, w Main'], 0, 'Stała jest ustalona raz.'),
      ],
    },

    {
      id: 'if-wiele', title: 'Wiele interfejsów', blurb: 'implements Latajacy, Plywajacy', minutes: 5,
      content: [
        ANA('🦸', 'Klasa może mieć <b>wiele umiejętności naraz</b>, tak jak amfibia: i lata, i plywa. Wymieniasz interfejsy po przecinku po <code>implements</code>. Klasa musi wtedy napisać metody <b>ze wszystkich</b>. Dziedziczyć po klasach można tylko po jednej, ale interfejsów może być dowolnie wiele.'),
        VIZ('tree', { nodes: [{ id: 'l', l: 'Latajacy', k: 'iface', s: ['lataj()'] }, { id: 'p', l: 'Plywajacy', k: 'iface', s: ['plyn()'] }, { id: 'a', l: 'Amfibia', p: 'l', s: ['lataj()', 'plyn()'] }], cap: 'Amfibia implementuje oba interfejsy, więc ma obie umiejętności.' }),
        CODE(J`interface Latajacy {
    void lataj();
}

interface Plywajacy {
    void plyn();
}

class Amfibia implements Latajacy, Plywajacy {
    public void lataj() { System.out.println("Amfibia unosi sie nad woda"); }
    public void plyn() { System.out.println("Amfibia plynie"); }
}

public class Main {
    public static void main(String[] args) {
        Amfibia a = new Amfibia();
        a.lataj();
        a.plyn();
    }
}
`, 'Amfibia unosi sie nad woda\nAmfibia plynie'),
      ],
      guide: {
        files: [FL('Latajacy.java', 'public interface Latajacy {\n    void lataj();\n}\n'), FL('Plywajacy.java', 'public interface Plywajacy {\n    void plyn();\n}\n'), FL('Amfibia.java', 'public class Amfibia {\n}\n')],
        steps: [
          { say: '<p>Dopisz do klasy oba interfejsy po przecinku.</p>', type: 'public class Amfibia implements Latajacy, Plywajacy {', expect: J`class\s+Amfibia\s+implements\s+Latajacy\s*,\s*Plywajacy\s*\{` },
          { say: '<p>Zaimplementuj metodę z pierwszego interfejsu.</p>', type: '    @Override\n    public void lataj() {\n        System.out.println("Amfibia unosi sie nad woda");\n    }', expect: J`public\s+void\s+lataj\s*\(\s*\)\s*\{\s*System\.out\.println\s*\(\s*"Amfibia unosi sie nad woda"\s*\)\s*;\s*\}` },
          { say: '<p>I z drugiego. Zamknij klasę.</p>', type: '    @Override\n    public void plyn() {\n        System.out.println("Amfibia plynie");\n    }\n}', expect: J`public\s+void\s+plyn\s*\(\s*\)\s*\{\s*System\.out\.println\s*\(\s*"Amfibia plynie"\s*\)\s*;\s*\}` },
        ],
        solution: [FL('Latajacy.java', 'public interface Latajacy {\n    void lataj();\n}\n'), FL('Plywajacy.java', 'public interface Plywajacy {\n    void plyn();\n}\n'), FL('Amfibia.java', 'public class Amfibia implements Latajacy, Plywajacy {\n    @Override\n    public void lataj() {\n        System.out.println("Amfibia unosi sie nad woda");\n    }\n\n    @Override\n    public void plyn() {\n        System.out.println("Amfibia plynie");\n    }\n}\n')],
        checks: [
          CK(CR, 'Amfibia implementuje oba interfejsy', J`isTrue("Amfibia ma implementować Latajacy", implementsIface("Amfibia", "Latajacy")); isTrue("Amfibia ma implementować Plywajacy", implementsIface("Amfibia", "Plywajacy"));`),
          CK(CR, 'lataj() i plyn() wypisują teksty', J`Object a = make("Amfibia"); List<String> o1 = lines(out(() -> call(a, "lataj"))); List<String> o2 = lines(out(() -> call(a, "plyn"))); isTrue("lataj(): " + o1, o1.equals(Arrays.asList("Amfibia unosi sie nad woda"))); isTrue("plyn(): " + o2, o2.equals(Arrays.asList("Amfibia plynie")));`),
        ],
      },
      exercise: {
        prompt: '<p>Interfejsy <code>Czytelnik</code> (<code>void czytaj()</code>) i <code>Pisarz</code> (<code>void pisz()</code>) są gotowe. Klasa <code>Student</code> ma je oba zaimplementować: <code>czytaj()</code> wypisuje <code>Student czyta</code>, <code>pisz()</code> wypisuje <code>Student pisze</code>.</p>',
        files: [FL('Czytelnik.java', 'public interface Czytelnik {\n    void czytaj();\n}\n'), FL('Pisarz.java', 'public interface Pisarz {\n    void pisz();\n}\n'), FL('Student.java', 'public class Student {\n}\n')],
        hints: ['<code>public class Student implements Czytelnik, Pisarz</code>', 'Napisz obie metody z <code>@Override</code> i <code>public</code>.'],
        solution: [FL('Czytelnik.java', 'public interface Czytelnik {\n    void czytaj();\n}\n'), FL('Pisarz.java', 'public interface Pisarz {\n    void pisz();\n}\n'), FL('Student.java', 'public class Student implements Czytelnik, Pisarz {\n    @Override\n    public void czytaj() {\n        System.out.println("Student czyta");\n    }\n\n    @Override\n    public void pisz() {\n        System.out.println("Student pisze");\n    }\n}\n')],
        checks: [
          CK(CR, 'Student implementuje oba interfejsy', J`isTrue("Czytelnik", implementsIface("Student", "Czytelnik")); isTrue("Pisarz", implementsIface("Student", "Pisarz"));`),
          CK(CR, 'Metody wypisują właściwe teksty', J`Object s = make("Student"); List<String> o1 = lines(out(() -> call(s, "czytaj"))); List<String> o2 = lines(out(() -> call(s, "pisz"))); isTrue("czytaj(): " + o1, o1.equals(Arrays.asList("Student czyta"))); isTrue("pisz(): " + o2, o2.equals(Arrays.asList("Student pisze")));`),
        ],
      },
      quiz: [
        Q('Jak zapisać klasę implementującą dwa interfejsy?', ['class A implements X, Y', 'class A implements X implements Y', 'class A extends X, Y', 'class A implements X + Y'], 0, 'Po przecinku.'),
        Q('Co klasa musi zrobić przy kilku interfejsach?', ['napisać metody ze wszystkich interfejsów', 'tylko z pierwszego', 'tylko z ostatniego', 'żadnych'], 0, 'Umów jest kilka, więc spełnia je wszystkie.'),
        Q('Dlaczego Java pozwala na wiele interfejsów, ale tylko jedną klasę bazową?', ['interfejsy to umiejętności, a nie dane, więc nie powodują konfliktu pól', 'bo tak jest szybciej', 'bo klasy są droższe', 'to przypadek'], 0, 'Jedno dziedziczenie klas unika konfliktów w polach i konstruktorach.'),
      ],
    },

    {
      id: 'if-extends-impl', title: 'extends i implements razem', blurb: 'jedna klasa bazowa + interfejsy', minutes: 5,
      content: [
        ANA('🧬🔌', 'Możesz połączyć oba światy: klasa <b>dziedziczy</b> po jednej klasie (<code>extends</code>) i jednocześnie <b>podpisuje</b> dowolnie wiele umów (<code>implements</code>). Kolejność w nagłówku jest stała: <code>extends</code> pierwsze, <code>implements</code> po nim.'),
        CODE(J`class Zwierze {
    String imie;

    Zwierze(String imie) { this.imie = imie; }
}

interface Latajacy {
    void lataj();
}

class Ptak extends Zwierze implements Latajacy {
    Ptak(String imie) { super(imie); }

    public void lataj() {
        System.out.println(imie + " leci");
    }
}

public class Main {
    public static void main(String[] args) {
        Ptak p = new Ptak("Orzel");
        p.lataj();
    }
}
`, 'Orzel leci'),
        NOTE('warn', 'Zapis <code>class Ptak implements Latajacy extends Zwierze</code> (odwrotna kolejność) to błąd kompilacji. Najpierw <code>extends</code>, potem <code>implements</code>.'),
      ],
      guide: {
        files: [FL('Zwierze.java', 'public class Zwierze {\n    protected String imie;\n\n    public Zwierze(String imie) {\n        this.imie = imie;\n    }\n}\n'), FL('Latajacy.java', 'public interface Latajacy {\n    void lataj();\n}\n'), FL('Ptak.java', 'public class Ptak {\n}\n')],
        steps: [
          { say: '<p>Ptak dziedziczy po <code>Zwierze</code> <b>i</b> implementuje <code>Latajacy</code>. Pamiętaj o kolejności: najpierw <code>extends</code>.</p>', type: 'public class Ptak extends Zwierze implements Latajacy {', expect: J`class\s+Ptak\s+extends\s+Zwierze\s+implements\s+Latajacy\s*\{` },
          { say: '<p>Konstruktor przekazuje imię do nadklasy.</p>', type: '    public Ptak(String imie) {\n        super(imie);\n    }', expect: J`Ptak\s*\(\s*String\s+imie\s*\)\s*\{\s*super\s*\(\s*imie\s*\)\s*;\s*\}` },
          { say: '<p>Zaimplementuj <code>lataj()</code>, korzystając z pola odziedziczonego po <code>Zwierze</code>. Zamknij klasę.</p>', type: '    @Override\n    public void lataj() {\n        System.out.println(imie + " leci");\n    }\n}', expect: J`public\s+void\s+lataj\s*\(\s*\)\s*\{\s*System\.out\.println\s*\(\s*imie\s*\+\s*" leci"\s*\)\s*;\s*\}` },
        ],
        solution: [FL('Zwierze.java', 'public class Zwierze {\n    protected String imie;\n\n    public Zwierze(String imie) {\n        this.imie = imie;\n    }\n}\n'), FL('Latajacy.java', 'public interface Latajacy {\n    void lataj();\n}\n'), FL('Ptak.java', 'public class Ptak extends Zwierze implements Latajacy {\n    public Ptak(String imie) {\n        super(imie);\n    }\n\n    @Override\n    public void lataj() {\n        System.out.println(imie + " leci");\n    }\n}\n')],
        checks: [
          CK(CR, 'Ptak dziedziczy po Zwierze i implementuje Latajacy', J`isTrue("Ptak extends Zwierze", isSubclass("Ptak", "Zwierze")); isTrue("Ptak implements Latajacy", implementsIface("Ptak", "Latajacy"));`),
          CK(CR, 'lataj() wypisuje „Orzel leci”', J`List<String> o = lines(out(() -> call(make("Ptak", "Orzel"), "lataj"))); isTrue("Oczekiwano: [Orzel leci] – wypisano: " + o, o.equals(Arrays.asList("Orzel leci")));`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Pojazd</code> (pole <code>marka</code>) i interfejs <code>Jezdny</code> (<code>void jedz()</code>) są gotowe. Napisz klasę <code>Auto</code>: dziedziczy po <code>Pojazd</code>, implementuje <code>Jezdny</code>, konstruktor <code>Auto(String marka)</code>, a <code>jedz()</code> wypisuje <code>marka + " jedzie"</code>.</p>',
        files: [FL('Pojazd.java', 'public class Pojazd {\n    protected String marka;\n\n    public Pojazd(String marka) {\n        this.marka = marka;\n    }\n}\n'), FL('Jezdny.java', 'public interface Jezdny {\n    void jedz();\n}\n'), FL('Auto.java', 'public class Auto {\n}\n')],
        hints: ['<code>public class Auto extends Pojazd implements Jezdny</code>', '<code>super(marka);</code> w konstruktorze'],
        solution: [FL('Pojazd.java', 'public class Pojazd {\n    protected String marka;\n\n    public Pojazd(String marka) {\n        this.marka = marka;\n    }\n}\n'), FL('Jezdny.java', 'public interface Jezdny {\n    void jedz();\n}\n'), FL('Auto.java', 'public class Auto extends Pojazd implements Jezdny {\n    public Auto(String marka) {\n        super(marka);\n    }\n\n    @Override\n    public void jedz() {\n        System.out.println(marka + " jedzie");\n    }\n}\n')],
        checks: [
          CK(CR, 'Auto dziedziczy i implementuje', J`isTrue("Auto extends Pojazd", isSubclass("Auto", "Pojazd")); isTrue("Auto implements Jezdny", implementsIface("Auto", "Jezdny"));`),
          CK(CR, 'jedz() wypisuje „Fiat jedzie”', J`List<String> o = lines(out(() -> call(make("Auto", "Fiat"), "jedz"))); isTrue("Oczekiwano: [Fiat jedzie] – wypisano: " + o, o.equals(Arrays.asList("Fiat jedzie")));`),
        ],
      },
      quiz: [
        Q('Jaka jest poprawna kolejność w nagłówku klasy?', ['extends, potem implements', 'implements, potem extends', 'dowolna', 'tylko jedno z nich'], 0, 'Najpierw nadklasa, potem interfejsy.'),
        Q('Po ilu klasach może dziedziczyć klasa?', ['po jednej', 'po dwóch', 'po dowolnej liczbie', 'po żadnej'], 0, 'Java ma pojedyncze dziedziczenie klas.'),
        Q('Co jest prawdą?', ['klasa może jednocześnie dziedziczyć po klasie i implementować interfejsy', 'klasa może mieć tylko extends albo tylko implements', 'interfejs może dziedziczyć po klasie', 'klasa musi mieć zawsze interfejs'], 0, 'To normalne połączenie.'),
        OUTQ('Co wypisze program?', ['Rex plywa', 'Rex', 'plywa', 'błąd'], 0, 'Pole z nadklasy i metoda z interfejsu działają razem.', 'class Zwierze {\n    String imie;\n    Zwierze(String imie) { this.imie = imie; }\n}\n\ninterface Plywajacy {\n    void plyn();\n}\n\nclass Pies extends Zwierze implements Plywajacy {\n    Pies(String imie) { super(imie); }\n    public void plyn() { System.out.println(imie + " plywa"); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        new Pies("Rex").plyn();\n    }\n}\n'),
      ],
    },
  ],
  labs: [
    {
      id: 'lab-iface', title: 'Zadanie własne: Latający i Pływający', source: 'zadanie własne (przykład z Wykładu 4)', own: true, concepts: ['if-podstawy', 'if-default', 'if-wiele'],
      statement: J`<p>Zbuduj małą hierarchię z przykładu z wykładu: obiekty różnych klas, które <b>potrafią latać</b> lub <b>pływać</b>.</p>
<ol>
<li><b>Latajacy</b> – interfejs: stała <code>int MAKSYMALNA_WYSOKOSC = 10000</code>; metoda abstrakcyjna <code>void lataj()</code>; metoda domyślna <code>String komunikat()</code> zwracająca <code>Ja latam!</code>.</li>
<li><b>Plywajacy</b> – interfejs z metodą <code>void plyn()</code>.</li>
<li><b>Ptak implements Latajacy</b> – <code>lataj()</code> wypisuje <code>Ptak macha skrzydlami</code>; <code>komunikat()</code> zostaje domyślny.</li>
<li><b>Samolot implements Latajacy</b> – <code>lataj()</code> wypisuje <code>Samolot startuje</code>; <b>nadpisuje</b> <code>komunikat()</code>, zwracając <code>Latajacy.super.komunikat() + " Jestem samolotem."</code> (czyli <code>Ja latam! Jestem samolotem.</code>).</li>
<li><b>Amfibia implements Latajacy, Plywajacy</b> – <code>lataj()</code> wypisuje <code>Amfibia unosi sie nad woda</code>, <code>plyn()</code> wypisuje <code>Amfibia plynie</code>.</li>
<li><b>Main</b>: utwórz tablicę <code>Latajacy[]</code> z jednym Ptakiem, Samolotem i Amfibią; w pętli wywołaj <code>lataj()</code> i wypisz <code>komunikat()</code> każdego elementu. Następnie wywołaj <code>plyn()</code> na Amfibii (potrzebny <code>instanceof</code> + rzutowanie na <code>Plywajacy</code>).</li>
</ol>`,
      notes: 'Zadanie własne – do ćwiczenia interfejsów. Nazwy bez polskich znaków i teksty dokładnie jak w treści (ASCII), żeby test mógł je porównać.',
      files: [
        { name: 'Latajacy.java', code: J`public interface Latajacy {

}
` },
        { name: 'Plywajacy.java', code: J`public interface Plywajacy {

}
` },
        { name: 'Ptak.java', code: J`public class Ptak {

}
` },
        { name: 'Samolot.java', code: J`public class Samolot {

}
` },
        { name: 'Amfibia.java', code: J`public class Amfibia {

}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {

    }
}
` }],
      hints: ['Metoda domyślna w interfejsie: <code>default String komunikat() { return "Ja latam!"; }</code>', 'Wywołanie wersji domyślnej w nadpisanej metodzie: <code>Latajacy.super.komunikat()</code>.', 'W Main: <code>if (l instanceof Plywajacy) { ((Plywajacy) l).plyn(); }</code>'],
      solution: [
        { name: 'Latajacy.java', code: J`public interface Latajacy {
    int MAKSYMALNA_WYSOKOSC = 10000;

    void lataj();

    default String komunikat() {
        return "Ja latam!";
    }
}
` },
        { name: 'Plywajacy.java', code: J`public interface Plywajacy {
    void plyn();
}
` },
        { name: 'Ptak.java', code: J`public class Ptak implements Latajacy {
    @Override
    public void lataj() {
        System.out.println("Ptak macha skrzydlami");
    }
}
` },
        { name: 'Samolot.java', code: J`public class Samolot implements Latajacy {
    @Override
    public void lataj() {
        System.out.println("Samolot startuje");
    }

    @Override
    public String komunikat() {
        return Latajacy.super.komunikat() + " Jestem samolotem.";
    }
}
` },
        { name: 'Amfibia.java', code: J`public class Amfibia implements Latajacy, Plywajacy {
    @Override
    public void lataj() {
        System.out.println("Amfibia unosi sie nad woda");
    }

    @Override
    public void plyn() {
        System.out.println("Amfibia plynie");
    }
}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {
        Latajacy[] latajace = { new Ptak(), new Samolot(), new Amfibia() };
        for (Latajacy l : latajace) {
            l.lataj();
            System.out.println(l.komunikat());
        }
        for (Latajacy l : latajace) {
            if (l instanceof Plywajacy) {
                Plywajacy p = (Plywajacy) l;
                p.plyn();
            }
        }
    }
}
` }],
      checks: [
        CK(CR, 'Latajacy i Plywajacy są interfejsami; Latajacy ma stałą 10000', J`isTrue("Latajacy powinno być interface", cls("Latajacy").isInterface());
isTrue("Plywajacy powinno być interface", cls("Plywajacy").isInterface());
eq(10000, staticField("Latajacy", "MAKSYMALNA_WYSOKOSC"));
isTrue("lataj() ma być abstrakcyjna", Modifier.isAbstract(method("Latajacy", "lataj").getModifiers()));
isTrue("plyn() ma być abstrakcyjna", Modifier.isAbstract(method("Plywajacy", "plyn").getModifiers()));`),
        CK(CR, 'Latajacy.komunikat() jest metodą domyślną (default) zwracającą „Ja latam!”', J`java.lang.reflect.Method m = method("Latajacy", "komunikat");
isTrue("komunikat() ma być default", m.isDefault());
eq("Ja latam!", call(make("Ptak"), "komunikat"));`),
        CK(CR, 'Ptak implementuje Latajacy i wypisuje tekst', J`isTrue("Ptak powinien implementować Latajacy", implementsIface("Ptak", "Latajacy"));
Object p = make("Ptak");
eq("Ptak macha skrzydlami", out(() -> call(p, "lataj")).trim());`),
        CK(CR, 'Samolot: lataj() oraz nadpisane komunikat()', J`isTrue("Samolot powinien implementować Latajacy", implementsIface("Samolot", "Latajacy"));
Object s = make("Samolot");
eq("Samolot startuje", out(() -> call(s, "lataj")).trim());
eq("Ja latam! Jestem samolotem.", call(s, "komunikat"));`),
        CK(CR, 'Amfibia implementuje oba interfejsy i wypisuje właściwe teksty', J`isTrue("Amfibia powinna implementować Latajacy", implementsIface("Amfibia", "Latajacy"));
isTrue("Amfibia powinna implementować Plywajacy", implementsIface("Amfibia", "Plywajacy"));
Object a = make("Amfibia");
eq("Amfibia unosi sie nad woda", out(() -> call(a, "lataj")).trim());
eq("Amfibia plynie", out(() -> call(a, "plyn")).trim());`),
        CK(MD, 'Main: tablica Latajacy[] – lataj() i komunikat() każdego, potem plyn() amfibii', J`String o = runMain();
List<String> l = lines(o);
isTrue("Brak tekstu Ptaka", l.contains("Ptak macha skrzydlami"));
isTrue("Brak tekstu Samolotu", l.contains("Samolot startuje"));
isTrue("Brak komunikatu samolotu", l.contains("Ja latam! Jestem samolotem."));
isTrue("Brak domyslnego komunikatu", l.contains("Ja latam!"));
isTrue("Brak wywołania plyn() amfibii", l.contains("Amfibia plynie"));`),
        CK(MN, 'Użyto tablicy typu interfejsu, instanceof i Latajacy.super', J`isTrue("W Main użyj tablicy Latajacy[]", srcHas("Main", "Latajacy\\s*\\[\\s*\\]"));
isTrue("Użyj instanceof Plywajacy", srcHas("Main", "instanceof\\s+Plywajacy"));
isTrue("W Samolot wywołaj Latajacy.super.komunikat()", srcHas("Samolot", "Latajacy\\s*\\.\\s*super\\s*\\.\\s*komunikat"));`),
      ],
    },
  ],

  quiz: [
    Q('Co jest prawdą o interfejsach?', ['metody są domyślnie abstrakcyjne i publiczne', 'pola są domyślnie publiczne i statyczne', 'nie mogą zawierać konstruktora', 'można tworzyć ich obiekty'], [0, 1, 2], 'Nie tworzy się obiektów interfejsu – tak jak klas abstrakcyjnych.', 'if-podstawy'),
    Q('Klasa nieabstrakcyjna implementuje interfejs z trzema metodami abstrakcyjnymi. Co musi zrobić?', ['zaimplementować wszystkie trzy', 'zaimplementować co najmniej jedną', 'nic', 'zadeklarować się jako interfejs'], 0, 'Wszystkie metody abstrakcyjne muszą mieć implementację.', 'if-podstawy'),
    Q('Klasa jest abstrakcyjna i implementuje interfejs. Czy musi nadpisać jego metody abstrakcyjne?', ['tak, zawsze', 'nie – ale może', 'nie, nie może', 'tylko metody default'], 1, 'Nadpisze je pierwsza klasa nieabstrakcyjna dziedzicząca.', 'if-wiele'),
    Q('Co wypisze program?', ['Ja latam!', 'Ptak', 'Ja latam! Ptak', 'błąd kompilacji'], 0, 'Ptak nie nadpisuje metody domyślnej – używana jest wersja z interfejsu.', 'if-default', { code: J`interface Latajacy {
    default String komunikat() { return "Ja latam!"; }
}
class Ptak implements Latajacy { }

public class Main {
    public static void main(String[] args) {
        System.out.println(new Ptak().komunikat());
    }
}` }),
    Q('Co wypisze program?', ['Ja latam! Samolot', 'Samolot', 'Ja latam!', 'błąd kompilacji'], 0, 'Nadpisana metoda wywołuje wersję domyślną przez <code>Latajacy.super</code>.', 'if-default', { code: J`interface Latajacy {
    default String komunikat() { return "Ja latam!"; }
}
class Samolot implements Latajacy {
    @Override
    public String komunikat() { return Latajacy.super.komunikat() + " Samolot"; }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Samolot().komunikat());
    }
}` }),
    Q('Poprawna kolejność w deklaracji klasy to:', ['najpierw <code>implements</code>, potem <code>extends</code>', 'najpierw <code>extends</code>, potem <code>implements</code>', 'dowolna', 'tylko jedno z nich naraz'], 1, '<code>class A extends B implements C, D</code>.', 'if-wiele'),
    Q('Ile interfejsów może zaimplementować jedna klasa?', ['najwyżej jeden', 'zero lub wiele', 'dokładnie dwa', 'tylko tyle, ile ma metod'], 1, 'W Javie nie ma wielodziedziczenia klas, ale interfejsów można implementować wiele.', 'if-wiele'),
    Q('Czy interfejs może zawierać pole?', ['tak – będzie to stała (<code>public static final</code>)', 'tak – zwykłe pole instancyjne', 'nie – nigdy'], 0, 'Nie da się wymusić pola w klasie, ale można wymusić gettery/settery.', 'if-default'),
  ],
});
