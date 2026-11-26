'use strict';
ACAD.modules.push({
  id: 'abs', num: 7, level: 2, icon: '🧩', title: 'Klasy abstrakcyjne i wyjątki',
  source: 'Wykład 3 – klasy i metody abstrakcyjne, instanceof, wyjątki · Laboratoria 4 (Zadania 4)',
  summary: 'abstract, metody bez ciała, try/catch/finally, własne wyjątki oraz duże zadanie „system wynagrodzeń”.',
  goals: ['zadeklarować klasę i metodę abstrakcyjną oraz wiedzieć, czego nie wolno', 'obsłużyć wyjątek przez <code>try</code>/<code>catch</code>/<code>finally</code>', 'wybrać właściwą kolejność bloków <code>catch</code>', 'napisać własny wyjątek i wyrzucić go przez <code>throw</code>'],
  lessons: [

    {
      id: 'abs-idea', micro: true, title: 'Po co klasy abstrakcyjne?', blurb: 'szablon, z którego nie robi się obiektów', minutes: 4,
      content: [
        ANA('📐', 'Czy widziałeś kiedyś „zwierzę w ogóle”? Nie: zawsze jest to pies, kot albo żaba. <b>Zwierze</b> jest tylko pojęciem ogólnym, <b>szablonem</b>. <b>Klasa abstrakcyjna</b> to właśnie taki szablon: opisuje to, co wspólne, ale <b>nie wolno z niej zrobić obiektu</b> (<code>new Zwierze()</code> to błąd). Obiekty robisz z klas konkretnych: Pies, Kot.'),
        VIZ('tree', { nodes: [{ id: 'z', l: 'Zwierze', k: 'abs', s: ['imie', 'dajGlos() - bez treści'] }, { id: 'p', l: 'Pies', p: 'z', s: ['dajGlos() = Hau'] }, { id: 'k', l: 'Kot', p: 'z', s: ['dajGlos() = Miau'] }], cap: 'Klasa abstrakcyjna (u góry) wymusza, że każda konkretna klasa pod nią ma swoją wersję <code>dajGlos()</code>.' }),
        TERMS([['<code>abstract class</code>', 'klasa-szablon, nie da się z niej zrobić obiektu'], ['<code>abstract</code> metoda', 'metoda <b>bez treści</b>: „każda klasa pochodna musi ją napisać”'], ['klasa konkretna', 'zwykła klasa, z której można tworzyć obiekty']]),
        NOTE('info', 'W projekcie klasa abstrakcyjna pasuje tam, gdzie masz wspólny „rodzaj” (Postać, Pracownik, Figura), a dokładna wersja zależy od klasy pochodnej.'),
      ],
      quiz: [
        Q('Czego <b>nie</b> można zrobić z klasą abstrakcyjną?', ['utworzyć jej obiektu przez new', 'dziedziczyć po niej', 'dodać do niej pól', 'napisać w niej konstruktora'], 0, 'Obiekty tworzy się z klas konkretnych.'),
        Q('Do czego służy klasa abstrakcyjna?', ['jako szablon dla klas pochodnych', 'do wypisywania tekstu', 'do tworzenia tablic', 'do obsługi błędów'], 0, 'Opisuje to, co wspólne, i wymusza uzupełnienie reszty.'),
      ],
    },

    {
      id: 'abs-klasa', title: 'Klasa abstrakcyjna', blurb: 'abstract class Zwierze', minutes: 5,
      content: [
        ANA('📐', 'Słowo <code>abstract</code> przed <code>class</code> zamienia klasę w <b>szablon</b>. Wszystko poza tym działa jak zwykle: pola, konstruktor, metody i dziedziczenie. Jedyna różnica: <b>nie utworzysz obiektu</b> przez <code>new Zwierze(...)</code>.'),
        CODE(J`abstract class Zwierze {
    String imie;

    public Zwierze(String imie) {
        this.imie = imie;
    }
}

class Pies extends Zwierze {
    public Pies(String imie) {
        super(imie);
    }
}

public class Main {
    public static void main(String[] args) {
        Zwierze z = new Pies("Reks");
        System.out.println(z.imie);
    }
}
`, 'Reks'),
        NOTE('warn', 'Konstruktor klasy abstrakcyjnej istnieje i jest wołany przez <code>super(...)</code> z klas pochodnych. Ale <code>new Zwierze("X")</code> daje błąd kompilacji: „Zwierze is abstract; cannot be instantiated”.'),
      ],
      guide: {
        files: [FL('Zwierze.java', 'public class Zwierze {\n    String imie;\n\n    public Zwierze(String imie) {\n        this.imie = imie;\n    }\n}\n'), FL('Pies.java', 'public class Pies extends Zwierze {\n    public Pies(String imie) {\n        super(imie);\n    }\n}\n')],
        steps: [
          { say: '<p>Zamień <code>Zwierze</code> w klasę abstrakcyjną: dopisz <code>abstract</code> przed <code>class</code>.</p>', type: 'public abstract class Zwierze {', expect: J`abstract\s+class\s+Zwierze` },
        ],
        solution: [FL('Zwierze.java', 'public abstract class Zwierze {\n    String imie;\n\n    public Zwierze(String imie) {\n        this.imie = imie;\n    }\n}\n'), FL('Pies.java', 'public class Pies extends Zwierze {\n    public Pies(String imie) {\n        super(imie);\n    }\n}\n')],
        checks: [
          CK(CR, 'Zwierze jest abstrakcyjna', J`isTrue("Zwierze ma być abstract", Modifier.isAbstract(cls("Zwierze").getModifiers()));`),
          CK(CR, 'Pies nadal działa jak wcześniej', J`Object p = make("Pies", "Reks"); eq("Reks", field(p, "imie")); isTrue("Pies ma dziedziczyć po Zwierze", isSubclass("Pies", "Zwierze"));`),
        ],
      },
      exercise: {
        prompt: '<p>Zrób z <code>Pojazd</code> klasę <b>abstrakcyjną</b>. Klasa <code>Auto</code> (konkretna) ma pozostać bez zmian.</p>',
        files: [FL('Pojazd.java', 'public class Pojazd {\n    String marka;\n\n    public Pojazd(String marka) {\n        this.marka = marka;\n    }\n}\n'), FL('Auto.java', 'public class Auto extends Pojazd {\n    public Auto(String marka) {\n        super(marka);\n    }\n}\n')],
        hints: ['Dopisz <code>abstract</code> przed <code>class Pojazd</code>.'],
        solution: [FL('Pojazd.java', 'public abstract class Pojazd {\n    String marka;\n\n    public Pojazd(String marka) {\n        this.marka = marka;\n    }\n}\n'), FL('Auto.java', 'public class Auto extends Pojazd {\n    public Auto(String marka) {\n        super(marka);\n    }\n}\n')],
        checks: [
          CK(CR, 'Pojazd jest abstrakcyjna', J`isTrue("Pojazd ma być abstract", Modifier.isAbstract(cls("Pojazd").getModifiers()));`),
          CK(MD, 'Auto jest konkretna i działa', J`isFalse("Auto nie powinno być abstract", Modifier.isAbstract(cls("Auto").getModifiers())); eq("Fiat", field(make("Auto", "Fiat"), "marka"));`),
        ],
      },
      quiz: [
        Q('Jak zapisać klasę abstrakcyjną?', ['abstract class Zwierze { }', 'class abstract Zwierze { }', 'class Zwierze abstract { }', 'abstract Zwierze { }'], 0, '<code>abstract</code> przed <code>class</code>.'),
        Q('Co zrobi kompilator przy <code>new Zwierze("X")</code>, gdy Zwierze jest abstrakcyjne?', ['zgłosi błąd kompilacji', 'utworzy obiekt', 'utworzy obiekt null', 'zgłosi wyjątek w czasie działania'], 0, 'Nie można tworzyć obiektów klas abstrakcyjnych.'),
        Q('Czy klasa abstrakcyjna może mieć konstruktor i pola?', ['tak', 'nie', 'tylko pola', 'tylko konstruktor'], 0, 'Jest zwykłą klasą, tylko bez możliwości tworzenia obiektów.'),
        Q('Czy po klasie abstrakcyjnej można dziedziczyć?', ['tak, to jej główny cel', 'nie', 'tylko w tym samym pliku', 'tylko jeśli jest public'], 0, 'Klasy pochodne uzupełniają szablon.'),
      ],
    },

    {
      id: 'abs-metoda', title: 'Metoda abstrakcyjna', blurb: 'abstract void dajGlos();', minutes: 5,
      content: [
        ANA('📜', 'Metoda abstrakcyjna to <b>punkt w regulaminie bez treści</b>: „każde zwierzę musi umieć dać głos, ale <b>jak</b> to wymyśla samo”. W nadklasie jest tylko nagłówek zakończony średnikiem, a <b>każda konkretna klasa pochodna musi ją napisać</b>, inaczej kod się nie skompiluje.'),
        VIZ('compare', { cols: [
          { icon: '📜', title: 'w klasie abstrakcyjnej', c: 'accent', items: ['<code>abstract void dajGlos();</code>', 'nagłówek <b>bez klamer i treści</b>, ze średnikiem'] },
          { icon: '🛠️', title: 'w klasie pochodnej', c: 'ok', items: ['<code>@Override void dajGlos() { ... }</code>', 'konkretna treść, obowiązkowa'] }] }),
        CODE(J`abstract class Zwierze {
    public abstract void dajGlos();
}

class Pies extends Zwierze {
    @Override
    public void dajGlos() {
        System.out.println("Hau!");
    }
}

public class Main {
    public static void main(String[] args) {
        Zwierze z = new Pies();
        z.dajGlos();
    }
}
`, 'Hau!'),
        NOTE('warn', 'Metoda abstrakcyjna może być <b>tylko</b> w klasie abstrakcyjnej. Jeśli klasa pochodna jest konkretna i nie zaimplementuje wszystkich metod abstrakcyjnych, kompilator zgłosi błąd.'),
      ],
      guide: {
        files: [FL('Zwierze.java', 'public abstract class Zwierze {\n}\n'), FL('Kot.java', 'public class Kot extends Zwierze {\n}\n')],
        steps: [
          { say: '<p>W klasie abstrakcyjnej dodaj metodę <b>bez treści</b>: <code>abstract</code>, nagłówek i od razu średnik (bez klamer).</p>', type: '    public abstract void dajGlos();', expect: J`public\s+abstract\s+void\s+dajGlos\s*\(\s*\)\s*;` },
          { say: '<p>Teraz <code>Kot</code> musi napisać własną wersję. Nadpisz metodę.</p>', type: '    @Override\n    public void dajGlos() {', expect: J`class\s+Kot\s+extends\s+Zwierze\s*\{\s*@Override\s+public\s+void\s+dajGlos\s*\(\s*\)\s*\{` },
          { say: '<p>Wypisz dźwięk kota i zamknij metodę.</p>', type: '        System.out.println("Miau!");\n    }', expect: J`dajGlos\s*\(\s*\)\s*\{\s*System\.out\.println\s*\(\s*"Miau!"\s*\)\s*;\s*\}` },
        ],
        solution: [FL('Zwierze.java', 'public abstract class Zwierze {\n    public abstract void dajGlos();\n}\n'), FL('Kot.java', 'public class Kot extends Zwierze {\n    @Override\n    public void dajGlos() {\n        System.out.println("Miau!");\n    }\n}\n')],
        checks: [
          CK(CR, 'dajGlos() w Zwierze jest abstrakcyjna', J`isTrue("dajGlos ma być abstract", Modifier.isAbstract(methodMods("Zwierze", "dajGlos")));`),
          CK(CR, 'Kot.dajGlos() wypisuje „Miau!”', J`List<String> o = lines(out(() -> call(make("Kot"), "dajGlos"))); isTrue("Oczekiwano: [Miau!] – wypisano: " + o, o.equals(Arrays.asList("Miau!")));`),
        ],
      },
      exercise: {
        prompt: '<p>W abstrakcyjnej klasie <code>Figura</code> dodaj <b>abstrakcyjną</b> metodę <code>double pole()</code>. Następnie klasa <code>Kwadrat</code> (pole <code>bok</code>, konstruktor gotowy) ma ją zaimplementować: <code>bok * bok</code>.</p>',
        files: [FL('Figura.java', 'public abstract class Figura {\n}\n'), FL('Kwadrat.java', 'public class Kwadrat extends Figura {\n    private double bok;\n\n    public Kwadrat(double bok) {\n        this.bok = bok;\n    }\n}\n')],
        hints: ['W Figura: <code>public abstract double pole();</code>', 'W Kwadrat: <code>@Override public double pole() { return bok * bok; }</code>'],
        solution: [FL('Figura.java', 'public abstract class Figura {\n    public abstract double pole();\n}\n'), FL('Kwadrat.java', 'public class Kwadrat extends Figura {\n    private double bok;\n\n    public Kwadrat(double bok) {\n        this.bok = bok;\n    }\n\n    @Override\n    public double pole() {\n        return bok * bok;\n    }\n}\n')],
        checks: [
          CK(CR, 'pole() w Figura jest abstrakcyjna', J`isTrue("pole ma być abstract", Modifier.isAbstract(methodMods("Figura", "pole")));`),
          CK(CR, 'Kwadrat.pole() liczy bok * bok', J`eq(9.0, call(make("Kwadrat", 3.0), "pole")); eq(2.25, call(make("Kwadrat", 1.5), "pole"));`),
        ],
      },
      quiz: [
        Q('Jak wygląda metoda abstrakcyjna?', ['nagłówek ze słowem abstract, zakończony średnikiem, bez klamer', 'metoda z pustymi klamrami', 'metoda z return null', 'metoda static'], 0, 'Nie ma treści.'),
        Q('Co musi zrobić konkretna klasa pochodna z metodą abstrakcyjną nadklasy?', ['zaimplementować ją', 'usunąć ją', 'zrobić ją static', 'zignorować'], 0, 'Inaczej kompilator zgłosi błąd.'),
        Q('Gdzie może być metoda abstrakcyjna?', ['tylko w klasie abstrakcyjnej', 'w każdej klasie', 'tylko w klasie Main', 'w enumie'], 0, 'Klasa zawierająca metodę abstrakcyjną musi sama być abstrakcyjna.'),
        OUTQ('Co wypisze program?', ['Miau!', 'Hau!', '...', 'błąd'], 0, 'Zmienna jest typu nadklasy, ale obiektem jest Kot.', 'abstract class Zwierze {\n    abstract void dajGlos();\n}\n\nclass Kot extends Zwierze {\n    @Override\n    void dajGlos() {\n        System.out.println("Miau!");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Zwierze z = new Kot();\n        z.dajGlos();\n    }\n}\n'),
      ],
    },

    {
      id: 'abs-mieszane', title: 'Klasa abstrakcyjna z metodami zwykłymi', blurb: 'gotowy kod + luki do uzupełnienia', minutes: 5,
      content: [
        ANA('🧩', 'Klasa abstrakcyjna to <b>gotowy formularz z kilkoma pustymi rubrykami</b>. Część metod jest już napisana (wspólna dla wszystkich), a część <b>abstrakcyjna</b> (każdy wypełnia po swojemu). Zwykła metoda może nawet <b>korzystać z abstrakcyjnej</b>, bo w chwili działania będzie już prawdziwy obiekt z wypełnioną luką.'),
        CODE(J`abstract class Figura {
    public abstract double pole();

    public void opisz() {
        System.out.println("Pole: " + pole());
    }
}

class Kwadrat extends Figura {
    private double bok;

    public Kwadrat(double bok) {
        this.bok = bok;
    }

    @Override
    public double pole() {
        return bok * bok;
    }
}

public class Main {
    public static void main(String[] args) {
        Figura f = new Kwadrat(2);
        f.opisz();
    }
}
`, 'Pole: 4.0'),
        NOTE('tip', 'Ten wzorzec jest bardzo wygodny: wspólna logika (<code>opisz()</code>) jest napisana raz, a różnice (<code>pole()</code>) każda klasa pochodna definiuje sama.'),
      ],
      guide: {
        files: [FL('Figura.java', 'public abstract class Figura {\n    public abstract double pole();\n}\n'), FL('Kwadrat.java', 'public class Kwadrat extends Figura {\n    private double bok;\n\n    public Kwadrat(double bok) {\n        this.bok = bok;\n    }\n\n    @Override\n    public double pole() {\n        return bok * bok;\n    }\n}\n')],
        steps: [
          { say: '<p>W klasie abstrakcyjnej <code>Figura</code> dopisz <b>zwykłą metodę</b> (z treścią) <code>opisz()</code>.</p>', type: '    public void opisz() {', expect: J`public\s+void\s+opisz\s*\(\s*\)\s*\{` },
          { say: '<p>Metoda wypisuje wynik <code>pole()</code>, czyli metody, którą napisze każda klasa pochodna. Zamknij metodę.</p>', type: '        System.out.println("Pole: " + pole());\n    }', expect: J`opisz\s*\(\s*\)\s*\{\s*System\.out\.println\s*\(\s*"Pole: "\s*\+\s*pole\s*\(\s*\)\s*\)\s*;\s*\}` },
        ],
        solution: [FL('Figura.java', 'public abstract class Figura {\n    public abstract double pole();\n\n    public void opisz() {\n        System.out.println("Pole: " + pole());\n    }\n}\n'), FL('Kwadrat.java', 'public class Kwadrat extends Figura {\n    private double bok;\n\n    public Kwadrat(double bok) {\n        this.bok = bok;\n    }\n\n    @Override\n    public double pole() {\n        return bok * bok;\n    }\n}\n')],
        checks: [
          CK(CR, 'opisz() wypisuje „Pole: 4.0” dla kwadratu o boku 2', J`List<String> o = lines(out(() -> call(make("Kwadrat", 2.0), "opisz"))); isTrue("Oczekiwano: [Pole: 4.0] – wypisano: " + o, o.equals(Arrays.asList("Pole: 4.0")));`),
          CK(MD, 'opisz() jest metodą zwykłą (nie abstrakcyjną)', J`isFalse("opisz ma mieć treść", Modifier.isAbstract(methodMods("Figura", "opisz"))); isTrue("pole ma pozostać abstrakcyjne", Modifier.isAbstract(methodMods("Figura", "pole")));`),
        ],
      },
      exercise: {
        prompt: '<p>Abstrakcyjna klasa <code>Pracownik</code> ma pole <code>imie</code> i abstrakcyjną metodę <code>double pensja()</code>. Dopisz <b>zwykłą</b> metodę <code>String opis()</code>, która zwraca <code>imie + ": " + pensja()</code> (np. <code>Ala: 3000.0</code>). Klasa <code>Etatowy</code> jest gotowa.</p>',
        files: [FL('Pracownik.java', 'public abstract class Pracownik {\n    protected String imie;\n\n    public Pracownik(String imie) {\n        this.imie = imie;\n    }\n\n    public abstract double pensja();\n}\n'), FL('Etatowy.java', 'public class Etatowy extends Pracownik {\n    public Etatowy(String imie) {\n        super(imie);\n    }\n\n    @Override\n    public double pensja() {\n        return 3000.0;\n    }\n}\n')],
        hints: ['<code>public String opis() { return imie + ": " + pensja(); }</code>'],
        solution: [FL('Pracownik.java', 'public abstract class Pracownik {\n    protected String imie;\n\n    public Pracownik(String imie) {\n        this.imie = imie;\n    }\n\n    public abstract double pensja();\n\n    public String opis() {\n        return imie + ": " + pensja();\n    }\n}\n'), FL('Etatowy.java', 'public class Etatowy extends Pracownik {\n    public Etatowy(String imie) {\n        super(imie);\n    }\n\n    @Override\n    public double pensja() {\n        return 3000.0;\n    }\n}\n')],
        checks: [
          CK(CR, 'opis() zwraca „Ala: 3000.0”', J`eq("Ala: 3000.0", call(make("Etatowy", "Ala"), "opis")); eq("Jan: 3000.0", call(make("Etatowy", "Jan"), "opis"));`),
          CK(MD, 'opis() jest zwykła, pensja() pozostaje abstrakcyjna', J`isFalse("opis ma mieć treść", Modifier.isAbstract(methodMods("Pracownik", "opis"))); isTrue("pensja ma pozostać abstrakcyjna", Modifier.isAbstract(methodMods("Pracownik", "pensja")));`),
        ],
      },
      quiz: [
        Q('Co może zawierać klasa abstrakcyjna?', ['metody abstrakcyjne', 'zwykłe metody z treścią', 'pola i konstruktor', 'tylko metody abstrakcyjne'], [0, 1, 2], 'To zwykła klasa, w której część metod może być bez treści.'),
        OUTQ('Co wypisze program?', ['Pole: 9.0', 'Pole: 3.0', 'Pole: 0.0', 'błąd'], 0, 'Zwykła metoda woła abstrakcyjną, a wykonuje się wersja Kwadratu.', 'abstract class Figura {\n    abstract double pole();\n\n    void opisz() {\n        System.out.println("Pole: " + pole());\n    }\n}\n\nclass Kwadrat extends Figura {\n    double bok;\n\n    Kwadrat(double bok) {\n        this.bok = bok;\n    }\n\n    @Override\n    double pole() {\n        return bok * bok;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        new Kwadrat(3).opisz();\n    }\n}\n'),
        Q('Czy zwykła metoda klasy abstrakcyjnej może wywołać metodę abstrakcyjną?', ['tak, wykona się wersja klasy pochodnej', 'nie, to błąd kompilacji', 'tak, ale zwróci null', 'tylko jeśli jest static'], 0, 'W chwili działania mamy już obiekt klasy konkretnej.'),
      ],
    },

    {
      id: 'wyj-idea', micro: true, title: 'Czym jest wyjątek?', blurb: 'błąd w czasie działania programu', minutes: 4,
      content: [
        ANA('🧯', 'Wyjątek to <b>alarm przeciwpożarowy</b>: coś poszło nie tak w czasie działania programu (dzielenie przez zero, zły indeks w tablicy, brak obiektu). Bez reakcji program <b>zatrzymuje się</b> i wypisuje czerwony komunikat. Możesz jednak ustawić „straż pożarną”, czyli <code>try / catch</code>, która obsłuży alarm i pozwoli programowi działać dalej.'),
        TERMS([['<code>ArithmeticException</code>', 'np. dzielenie liczby całkowitej przez zero: <code>10 / 0</code>'], ['<code>ArrayIndexOutOfBoundsException</code>', 'indeks poza tablicą: <code>t[5]</code> przy 3 elementach'], ['<code>NullPointerException</code>', 'użycie pola lub metody obiektu, który jest <code>null</code>'], ['<code>NumberFormatException</code>', 'zły tekst w <code>Integer.parseInt("abc")</code>'], ['<code>ClassCastException</code>', 'zły downcasting']]),
        { t: 'code', title: 'Przykład (bez obsługi): program kończy się błędem', x: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Start");\n        int x = 10 / 0;\n        System.out.println("Koniec");\n    }\n}\n' },
        NOTE('info', 'Powyższy program wypisze „Start”, a potem zgłosi <code>ArithmeticException: / by zero</code>. Polecenie „Koniec” <b>nigdy się nie wykona</b>. W następnych lekcjach nauczysz się to obsługiwać.'),
      ],
      quiz: [
        Q('Kiedy powstaje wyjątek?', ['gdy w czasie działania programu stanie się coś niedozwolonego, np. dzielenie przez zero', 'gdy brakuje średnika w kodzie', 'gdy zapomnisz zapisać plik', 'gdy nazwa klasy jest za długa'], 0, 'Braki w zapisie kodu to błędy kompilacji, a wyjątki dotyczą czasu działania.'),
        Q('Który wyjątek zgłosi <code>10 / 0</code> dla liczb całkowitych?', ['ArithmeticException', 'NullPointerException', 'NumberFormatException', 'ClassCastException'], 0, 'Dzielenie przez zero.'),
        Q('Który wyjątek zgłosi <code>t[5]</code> dla tablicy 3-elementowej?', ['ArrayIndexOutOfBoundsException', 'ArithmeticException', 'NullPointerException', 'IllegalStateException'], 0, 'Indeks poza zakresem.'),
        Q('Co się dzieje z programem, gdy wyjątek nie zostanie obsłużony?', ['program kończy się z komunikatem błędu', 'program działa dalej bez zmian', 'wyjątek jest ignorowany', 'program uruchamia się od nowa'], 0, 'Dalsze polecenia nie są wykonywane.'),
      ],
    },

    {
      id: 'wyj-trycatch', title: 'try i catch', blurb: 'łapanie wyjątku i działanie dalej', minutes: 5,
      content: [
        ANA('🪂', '<code>try</code> to „<b>spróbuj</b> to zrobić”. Jeśli coś w środku zgłosi wyjątek, Java <b>natychmiast przeskakuje</b> do bloku <code>catch</code>, który mówi, co zrobić zamiast awarii. Po bloku <code>catch</code> program <b>działa dalej</b>.'),
        VIZ('flow', { title: 'try { 10 / 0 } catch (ArithmeticException e) { … }', steps: [{ t: 'try', s: 'wykonuje polecenia po kolei', c: 'accent' }, { t: '10 / 0', s: 'ArithmeticException!', c: 'bad' }, { t: 'catch', s: 'przeskok tutaj, reszta try pominięta', c: 'warn' }, { t: 'dalej', s: 'program działa dalej', c: 'ok' }] }),
        CODE(J`public class Main {
    public static void main(String[] args) {
        try {
            int x = 10 / 0;
            System.out.println("To sie nie wypisze");
        } catch (ArithmeticException e) {
            System.out.println("Nie dziel przez zero");
        }
        System.out.println("Koniec");
    }
}
`, 'Nie dziel przez zero\nKoniec'),
        NOTE('tip', 'W nawiasie po <code>catch</code> podajesz <b>typ wyjątku</b> i nazwę zmiennej (<code>e</code>). Przez <code>e.getMessage()</code> odczytasz komunikat błędu.'),
      ],
      guide: {
        files: [FL('Main.java', MAINW(['int a = 10;', 'int b = 0;']))],
        steps: [
          { say: '<p>Ryzykowny kod umieść w bloku <code>try</code>.</p>', type: 'try {', expect: J`\btry\s*\{` },
          { say: '<p>W środku wypisz wynik dzielenia. Przy <code>b = 0</code> tu pojawi się wyjątek.</p>', type: '    System.out.println(a / b);', expect: J`try\s*\{\s*System\.out\.println\s*\(\s*a\s*/\s*b\s*\)\s*;` },
          { say: '<p>Zamknij <code>try</code> i od razu dopisz <code>catch</code> łapiący konkretny wyjątek.</p>', type: '} catch (ArithmeticException e) {', expect: J`\}\s*catch\s*\(\s*ArithmeticException\s+e\s*\)\s*\{` },
          { say: '<p>Co zrobić po złapaniu błędu – wypisz komunikat i zamknij <code>catch</code>.</p>', type: '    System.out.println("Nie dziel przez zero");\n}', expect: J`catch\s*\(\s*ArithmeticException\s+e\s*\)\s*\{\s*System\.out\.println\s*\(\s*"Nie dziel przez zero"\s*\)\s*;\s*\}` },
          { say: '<p>Na końcu polecenie <b>po</b> bloku <code>catch</code> – dowód, że program działa dalej.</p>', type: 'System.out.println("Koniec");', expect: J`Nie dziel przez zero"\s*\)\s*;\s*\}\s*System\.out\.println\s*\(\s*"Koniec"\s*\)\s*;` },
        ],
        solution: [FL('Main.java', MAINW(['int a = 10;', 'int b = 0;', 'try {', '    System.out.println(a / b);', '} catch (ArithmeticException e) {', '    System.out.println("Nie dziel przez zero");', '}', 'System.out.println("Koniec");']))],
        checks: [
          CK(CR, 'Wynik: Nie dziel przez zero i Koniec', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Nie dziel przez zero, Koniec] – program wypisał: " + o, o.equals(Arrays.asList("Nie dziel przez zero", "Koniec")));`),
          CK(MD, 'Użyto try i catch ArithmeticException', J`isTrue("Użyj try { } catch (ArithmeticException e) { }", srcHas("Main", "\\btry\\s*\\{") && srcHas("Main", "catch\\s*\\(\\s*ArithmeticException"));`),
        ],
      },
      exercise: {
        prompt: '<p>Dana tablica <code>int[] t = {1, 2, 3};</code>. W bloku <code>try</code> wypisz <code>t[5]</code>. Złap <code>ArrayIndexOutOfBoundsException</code> i wypisz <code>Zly indeks</code>. Po <code>catch</code> wypisz <code>Dalej</code>.</p><pre>Zly indeks\nDalej</pre>',
        files: [FL('Main.java', MAINW(['int[] t = {1, 2, 3};']))],
        hints: ['<code>try { System.out.println(t[5]); } catch (ArrayIndexOutOfBoundsException e) { ... }</code>'],
        solution: [FL('Main.java', MAINW(['int[] t = {1, 2, 3};', 'try {', '    System.out.println(t[5]);', '} catch (ArrayIndexOutOfBoundsException e) {', '    System.out.println("Zly indeks");', '}', 'System.out.println("Dalej");']))],
        checks: [
          CK(CR, 'Wynik: Zly indeks i Dalej', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Zly indeks, Dalej] – program wypisał: " + o, o.equals(Arrays.asList("Zly indeks", "Dalej")));`),
          CK(MD, 'Użyto catch ArrayIndexOutOfBoundsException', J`isTrue("Użyj catch (ArrayIndexOutOfBoundsException e)", srcHas("Main", "catch\\s*\\(\\s*ArrayIndexOutOfBoundsException"));`),
        ],
      },
      quiz: [
        Q('Co robi blok <code>catch</code>?', ['obsługuje wyjątek zgłoszony w try', 'tworzy wyjątek', 'kończy program', 'powtarza try'], 0, 'Wykonuje się tylko wtedy, gdy w try wystąpi pasujący wyjątek.'),
        OUTQ('Co wypisze program?', ['Blad<br>Koniec', 'Start<br>Koniec', 'Start<br>Blad<br>Koniec', 'Blad'], 0, 'Po wyjątku reszta <code>try</code> jest pomijana, a po <code>catch</code> program idzie dalej.', 'public class Main {\n    public static void main(String[] args) {\n        try {\n            int x = 5 / 0;\n            System.out.println("Start");\n        } catch (ArithmeticException e) {\n            System.out.println("Blad");\n        }\n        System.out.println("Koniec");\n    }\n}\n'),
        OUTQ('Co wypisze program (brak wyjątku)?', ['A<br>C', 'A<br>B<br>C', 'B<br>C', 'A'], 0, 'Skoro wyjątku nie ma, <code>catch</code> jest pomijany.', 'public class Main {\n    public static void main(String[] args) {\n        try {\n            System.out.println("A");\n        } catch (ArithmeticException e) {\n            System.out.println("B");\n        }\n        System.out.println("C");\n    }\n}\n'),
        Q('Co się stanie, jeśli w <code>try</code> wystąpi wyjątek, a żaden <code>catch</code> do niego nie pasuje?', ['program zakończy się błędem', 'wykona się pierwszy catch', 'wyjątek zostanie zignorowany', 'wykona się finally i program ruszy dalej'], 0, 'Wyjątek leci wyżej, a bez obsługi kończy program.'),
      ],
    },

    {
      id: 'wyj-wiele', title: 'Kilka bloków catch', blurb: 'od konkretnego do ogólnego', minutes: 5,
      content: [
        ANA('🚑', 'Na jedno miejsce wypadku może przyjechać <b>kilka służb</b>: straż, pogotowie, policja. Jeden blok <code>try</code> też może mieć <b>kilka bloków <code>catch</code></b>, każdy dla innego rodzaju błędu. Wybierany jest <b>pierwszy pasujący</b>, więc ustawiaj je od <b>najbardziej szczegółowego</b> do najogólniejszego (<code>Exception</code> na końcu).'),
        CODE(J`public class Main {
    public static void main(String[] args) {
        try {
            int x = Integer.parseInt("abc");
            System.out.println(x);
        } catch (NumberFormatException e) {
            System.out.println("To nie liczba");
        } catch (Exception e) {
            System.out.println("Inny blad");
        }
    }
}
`, 'To nie liczba'),
        NOTE('warn', 'Odwrócona kolejność (<code>catch (Exception e)</code> przed <code>catch (NumberFormatException e)</code>) to <b>błąd kompilacji</b>: ogólny blok „połknąłby” wszystko i szczegółowy nigdy by się nie wykonał.'),
      ],
      guide: {
        files: [FL('Main.java', MAINW([]))],
        steps: [
          { say: '<p>W <code>try</code> zamień tekst na liczbę. <code>"abc"</code> to nie liczba, więc pojawi się <code>NumberFormatException</code>.</p>', type: 'try {\n    int x = Integer.parseInt("abc");', expect: J`try\s*\{\s*int\s+x\s*=\s*Integer\.parseInt\s*\(\s*"abc"\s*\)\s*;` },
          { say: '<p>Najpierw <b>szczegółowy</b> <code>catch</code> dla złego formatu liczby.</p>', type: '} catch (NumberFormatException e) {\n    System.out.println("To nie liczba");', expect: J`\}\s*catch\s*\(\s*NumberFormatException\s+e\s*\)\s*\{\s*System\.out\.println\s*\(\s*"To nie liczba"\s*\)\s*;` },
          { say: '<p>Na końcu <b>ogólny</b> <code>catch</code> na wszelki wypadek. Zamknij go klamrą.</p>', type: '} catch (Exception e) {\n    System.out.println("Inny blad");\n}', expect: J`\}\s*catch\s*\(\s*Exception\s+e\s*\)\s*\{\s*System\.out\.println\s*\(\s*"Inny blad"\s*\)\s*;\s*\}` },
        ],
        solution: [FL('Main.java', MAINW(['try {', '    int x = Integer.parseInt("abc");', '} catch (NumberFormatException e) {', '    System.out.println("To nie liczba");', '} catch (Exception e) {', '    System.out.println("Inny blad");', '}']))],
        checks: [
          CK(CR, 'Program wypisuje „To nie liczba”', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [To nie liczba] – program wypisał: " + o, o.equals(Arrays.asList("To nie liczba")));`),
          CK(MD, 'Dwa bloki catch: szczegółowy i ogólny', J`isTrue("Dodaj catch (NumberFormatException e)", srcHas("Main", "catch\\s*\\(\\s*NumberFormatException")); isTrue("Dodaj catch (Exception e)", srcHas("Main", "catch\\s*\\(\\s*Exception"));`),
        ],
      },
      exercise: {
        prompt: '<p>Napisz w <code>Main</code> metodę <code>static String bezpiecznie(String s)</code>: próbuje zamienić tekst na liczbę (<code>Integer.parseInt</code>) i zwraca <code>"Liczba: " + x</code>. Gdy tekst jest zły, zwraca <code>"Zly format"</code>.</p>',
        files: [FL('Main.java', 'public class Main {\n    public static void main(String[] args) {\n    }\n}\n')],
        hints: ['<code>try { int x = Integer.parseInt(s); return "Liczba: " + x; } catch (NumberFormatException e) { return "Zly format"; }</code>'],
        solution: [FL('Main.java', 'public class Main {\n    static String bezpiecznie(String s) {\n        try {\n            int x = Integer.parseInt(s);\n            return "Liczba: " + x;\n        } catch (NumberFormatException e) {\n            return "Zly format";\n        }\n    }\n\n    public static void main(String[] args) {\n    }\n}\n')],
        checks: [
          CK(CR, 'bezpiecznie("42") zwraca „Liczba: 42”', J`eq("Liczba: 42", callStatic("Main", "bezpiecznie", "42")); eq("Liczba: -7", callStatic("Main", "bezpiecznie", "-7"));`),
          CK(CR, 'bezpiecznie("abc") zwraca „Zly format”', J`eq("Zly format", callStatic("Main", "bezpiecznie", "abc")); eq("Zly format", callStatic("Main", "bezpiecznie", ""));`),
        ],
      },
      quiz: [
        Q('Który catch wykona się, gdy pasuje kilka?', ['pierwszy pasujący, od góry', 'ostatni pasujący', 'wszystkie pasujące', 'losowy'], 0, 'Dlatego ogólne wyjątki umieszczamy na końcu.'),
        Q('Co zgłosi kompilator, gdy <code>catch (Exception e)</code> stoi przed <code>catch (NumberFormatException e)</code>?', ['błąd kompilacji (wyjątek już obsłużony)', 'ostrzeżenie, ale program ruszy', 'nic', 'wyjątek w czasie działania'], 0, 'Drugi blok byłby nieosiągalny.'),
        Q('Który wyjątek zgłosi <code>Integer.parseInt("12x")</code>?', ['NumberFormatException', 'ArithmeticException', 'ClassCastException', 'IOException'], 0, 'Tekst nie jest poprawną liczbą.'),
      ],
    },

    {
      id: 'wyj-finally', title: 'finally: kod, który wykona się zawsze', blurb: 'sprzątanie po try/catch', minutes: 4,
      content: [
        ANA('🧹', 'Niezależnie od tego, czy impreza się udała, czy wybuchł pożar, <b>trzeba posprzątać</b>. Blok <code>finally</code> wykonuje się <b>zawsze</b>: zarówno gdy wyjątku nie było, jak i gdy został złapany. Służy do „sprzątania” (np. zamknięcia pliku).'),
        CODE(J`public class Main {
    public static void main(String[] args) {
        try {
            System.out.println("Start");
            int x = 10 / 0;
        } catch (ArithmeticException e) {
            System.out.println("Blad");
        } finally {
            System.out.println("Sprzatanie");
        }
    }
}
`, 'Start\nBlad\nSprzatanie'),
        NOTE('info', '<code>finally</code> jest opcjonalny i stoi <b>na końcu</b>, po wszystkich <code>catch</code>.'),
      ],
      guide: {
        files: [FL('Main.java', MAINW(['try {', '    System.out.println("Start");', '    int x = 10 / 0;', '} catch (ArithmeticException e) {', '    System.out.println("Blad");', '}']))],
        steps: [
          { say: '<p>Po bloku <code>catch</code> dopisz blok <code>finally</code>. Zamień zamykającą klamrę <code>catch</code> tak, żeby po niej szedł <code>finally</code>.</p>', type: '} finally {', expect: J`\}\s*finally\s*\{` },
          { say: '<p>Co ma się wykonać zawsze – wypisz „Sprzatanie” i zamknij blok.</p>', type: '    System.out.println("Sprzatanie");\n}', expect: J`finally\s*\{\s*System\.out\.println\s*\(\s*"Sprzatanie"\s*\)\s*;\s*\}` },
        ],
        solution: [FL('Main.java', MAINW(['try {', '    System.out.println("Start");', '    int x = 10 / 0;', '} catch (ArithmeticException e) {', '    System.out.println("Blad");', '} finally {', '    System.out.println("Sprzatanie");', '}']))],
        checks: [
          CK(CR, 'Wynik: Start, Blad, Sprzatanie', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Start, Blad, Sprzatanie] – program wypisał: " + o, o.equals(Arrays.asList("Start", "Blad", "Sprzatanie")));`),
          CK(MN, 'Użyto finally', J`isTrue("Dodaj blok finally", srcHas("Main", "\\bfinally\\s*\\{"));`),
        ],
      },
      exercise: {
        prompt: '<p>W <code>main</code> w bloku <code>try</code> wypisz <code>Ok</code> (bez błędu), dodaj <code>catch (Exception e)</code> wypisujący <code>Blad</code> oraz <code>finally</code> wypisujący <code>Koniec</code>. Wynik powinien być taki:</p><pre>Ok\nKoniec</pre>',
        files: [FL('Main.java', MAINW([]))],
        hints: ['<code>try { println("Ok"); } catch (Exception e) { println("Blad"); } finally { println("Koniec"); }</code>'],
        solution: [FL('Main.java', MAINW(['try {', '    System.out.println("Ok");', '} catch (Exception e) {', '    System.out.println("Blad");', '} finally {', '    System.out.println("Koniec");', '}']))],
        checks: [
          CK(CR, 'Wynik: Ok i Koniec', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Ok, Koniec] – program wypisał: " + o, o.equals(Arrays.asList("Ok", "Koniec")));`),
          CK(MD, 'Użyto try, catch i finally', J`isTrue("Użyj try, catch i finally", srcHas("Main", "\\btry\\s*\\{") && srcHas("Main", "\\bcatch\\s*\\(") && srcHas("Main", "\\bfinally\\s*\\{"));`),
        ],
      },
      quiz: [
        Q('Kiedy wykonuje się blok <code>finally</code>?', ['zawsze, niezależnie od wyjątku', 'tylko gdy wystąpi wyjątek', 'tylko gdy wyjątku nie było', 'nigdy'], 0, 'Służy do sprzątania.'),
        OUTQ('Co wypisze program?', ['A<br>C', 'A<br>B<br>C', 'B<br>C', 'A'], 0, '<code>catch</code> jest pominięty, a <code>finally</code> wykonuje się zawsze.', 'public class Main {\n    public static void main(String[] args) {\n        try {\n            System.out.println("A");\n        } catch (Exception e) {\n            System.out.println("B");\n        } finally {\n            System.out.println("C");\n        }\n    }\n}\n'),
        Q('Gdzie stawiamy blok <code>finally</code>?', ['po wszystkich blokach catch', 'przed try', 'między try a catch', 'w osobnej metodzie'], 0, 'Jest ostatnim elementem konstrukcji.'),
      ],
    },

    {
      id: 'wyj-throw', title: 'throw: zgłaszanie własnego wyjątku', blurb: 'throw new IllegalArgumentException(...)', minutes: 5,
      content: [
        ANA('🚨', 'Do tej pory wyjątki zgłaszała Java. Ty też możesz <b>sam podnieść alarm</b>, gdy dane są niepoprawne: <code>throw new IllegalArgumentException("Wiek ujemny");</code>. Metoda <b>przerywa działanie</b> w tym miejscu, a ten, kto ją wywołał, decyduje (<code>try/catch</code>), co z tym zrobić.'),
        VIZ('compare', { cols: [
          { icon: '🤫', title: 'setter z if', c: 'accent', sub: 'z hermetyzacji', items: ['zły wiek jest po cichu ignorowany'] },
          { icon: '🚨', title: 'setter z throw', c: 'ok', sub: 'teraz', items: ['zły wiek <b>zgłasza wyjątek</b>', 'wywołujący wie, że coś poszło nie tak'] }] }),
        CODE(J`public class Main {
    static void ustawWiek(int wiek) {
        if (wiek < 0) {
            throw new IllegalArgumentException("Wiek ujemny");
        }
        System.out.println("Wiek: " + wiek);
    }

    public static void main(String[] args) {
        try {
            ustawWiek(20);
            ustawWiek(-5);
        } catch (IllegalArgumentException e) {
            System.out.println("Blad: " + e.getMessage());
        }
    }
}
`, 'Wiek: 20\nBlad: Wiek ujemny'),
        NOTE('tip', '<code>IllegalArgumentException</code> to gotowy wyjątek na „niepoprawny argument”. W konstruktorze podajesz <b>komunikat</b>, który potem odczytasz przez <code>e.getMessage()</code>.'),
      ],
      guide: {
        files: [FL('Main.java', 'public class Main {\n    static void ustawWiek(int wiek) {\n        System.out.println("Wiek: " + wiek);\n    }\n\n    public static void main(String[] args) {\n    }\n}\n')],
        steps: [
          { say: '<p>Na początku metody sprawdź warunek niepoprawnych danych.</p>', type: '        if (wiek < 0) {', expect: J`ustawWiek\s*\(\s*int\s+wiek\s*\)\s*\{\s*if\s*\(\s*wiek\s*<\s*0\s*\)\s*\{` },
          { say: '<p>Zgłoś wyjątek: <code>throw</code>, <code>new</code> i typ z komunikatem. Zamknij <code>if</code>.</p>', type: '            throw new IllegalArgumentException("Wiek ujemny");\n        }', expect: J`throw\s+new\s+IllegalArgumentException\s*\(\s*"Wiek ujemny"\s*\)\s*;\s*\}` },
        ],
        solution: [FL('Main.java', 'public class Main {\n    static void ustawWiek(int wiek) {\n        if (wiek < 0) {\n            throw new IllegalArgumentException("Wiek ujemny");\n        }\n        System.out.println("Wiek: " + wiek);\n    }\n\n    public static void main(String[] args) {\n    }\n}\n')],
        checks: [
          CK(CR, 'ustawWiek(-5) zgłasza IllegalArgumentException z komunikatem', J`Throwable t = thrown(() -> callStatic("Main", "ustawWiek", -5)); isTrue("Oczekiwano IllegalArgumentException, a było: " + t, t instanceof IllegalArgumentException); eq("Wiek ujemny", t.getMessage());`),
          CK(CR, 'ustawWiek(20) działa bez błędu', J`List<String> o = lines(out(() -> callStatic("Main", "ustawWiek", 20))); isTrue("Oczekiwano: [Wiek: 20] – wypisano: " + o, o.equals(Arrays.asList("Wiek: 20")));`),
        ],
      },
      exercise: {
        prompt: '<p>Napisz w <code>Main</code> metodę <code>static int dziel(int a, int b)</code>. Gdy <code>b == 0</code>, ma zgłosić <code>IllegalArgumentException</code> z komunikatem <code>Dzielnik zero</code>. W przeciwnym razie zwraca <code>a / b</code>.</p>',
        files: [FL('Main.java', 'public class Main {\n    public static void main(String[] args) {\n    }\n}\n')],
        hints: ['<code>if (b == 0) { throw new IllegalArgumentException("Dzielnik zero"); }</code>', '<code>return a / b;</code>'],
        solution: [FL('Main.java', 'public class Main {\n    static int dziel(int a, int b) {\n        if (b == 0) {\n            throw new IllegalArgumentException("Dzielnik zero");\n        }\n        return a / b;\n    }\n\n    public static void main(String[] args) {\n    }\n}\n')],
        checks: [
          CK(CR, 'dziel(a, b) zwraca iloraz', J`eq(5, callStatic("Main", "dziel", 10, 2)); eq(-3, callStatic("Main", "dziel", 9, -3));`),
          CK(CR, 'dziel(a, 0) zgłasza IllegalArgumentException', J`Throwable t = thrown(() -> callStatic("Main", "dziel", 1, 0)); isTrue("Oczekiwano IllegalArgumentException, a było: " + t, t instanceof IllegalArgumentException); eq("Dzielnik zero", t.getMessage());`),
        ],
      },
      quiz: [
        Q('Co robi <code>throw new IllegalArgumentException("x")</code>?', ['zgłasza wyjątek i przerywa metodę', 'tworzy obiekt, ale nic nie robi', 'wypisuje komunikat', 'kończy program zawsze'], 0, 'Wyjątek leci do wywołującego, który może go złapać.'),
        Q('Jak odczytać komunikat z wyjątku <code>e</code>?', ['e.getMessage()', 'e.message', 'e.toText', 'print(e)'], 0, 'Zwraca tekst podany w konstruktorze.'),
        OUTQ('Co wypisze program?', ['Blad: zle', 'Koniec', 'Blad: zle<br>Koniec', 'błąd'], 2, 'Wyjątek jest złapany, więc program idzie dalej.', 'public class Main {\n    static void f() {\n        throw new IllegalArgumentException("zle");\n    }\n\n    public static void main(String[] args) {\n        try {\n            f();\n        } catch (IllegalArgumentException e) {\n            System.out.println("Blad: " + e.getMessage());\n        }\n        System.out.println("Koniec");\n    }\n}\n'),
      ],
    },

    {
      id: 'wyj-throws', title: 'Wyjątki kontrolowane i throws', blurb: 'Exception: kompilator wymaga obsługi', minutes: 6,
      content: [
        ANA('📝', 'Niektóre wyjątki (rodzina <code>Exception</code>, np. problemy z plikami) to <b>wyjątki kontrolowane</b>. Kompilator jak surowy nauczyciel mówi: „zaznacz w nagłówku, że metoda może rzucić taki błąd (<code>throws</code>), a ten, kto ją woła, musi go obsłużyć <code>try/catch</code> <b>albo</b> też zadeklarować <code>throws</code>”. Wyjątki z rodziny <code>RuntimeException</code> (np. <code>IllegalArgumentException</code>) takiego wymogu <b>nie mają</b>.'),
        VIZ('compare', { cols: [
          { icon: '🔔', title: 'kontrolowane', c: 'warn', sub: 'np. Exception', items: ['<b>musisz</b> obsłużyć lub zadeklarować <code>throws</code>', 'kompilator pilnuje'] },
          { icon: '🔕', title: 'niekontrolowane', c: 'accent', sub: 'RuntimeException i dzieci', items: ['obsługa dobrowolna', 'np. <code>IllegalArgumentException</code>'] }] }),
        CODE(J`public class Main {
    static void wczytaj() throws Exception {
        throw new Exception("Brak pliku");
    }

    public static void main(String[] args) {
        try {
            wczytaj();
        } catch (Exception e) {
            System.out.println("Blad: " + e.getMessage());
        }
    }
}
`, 'Blad: Brak pliku'),
        NOTE('exam', 'Rozróżnienie <code>throw</code> i <code>throws</code>: <code>throw</code> <b>rzuca</b> wyjątek (w ciele metody), a <code>throws</code> <b>zapowiada</b>, że metoda może rzucić (w nagłówku).'),
      ],
      guide: {
        files: [FL('Main.java', 'public class Main {\n    static void wczytaj() {\n        throw new Exception("Brak pliku");\n    }\n\n    public static void main(String[] args) {\n    }\n}\n')],
        steps: [
          { say: '<p>Ta metoda się nie skompiluje: rzuca wyjątek kontrolowany, a nagłówek tego nie zapowiada. Dopisz do nagłówka <code>throws Exception</code>.</p>', type: '    static void wczytaj() throws Exception {', expect: J`static\s+void\s+wczytaj\s*\(\s*\)\s*throws\s+Exception\s*\{` },
          { say: '<p>Wywołując taką metodę w <code>main</code>, musisz ją obsłużyć. Otocz wywołanie blokiem <code>try</code>.</p>', type: '        try {\n            wczytaj();', expect: J`main\s*\(\s*String\s*\[\s*\]\s*args\s*\)\s*\{\s*try\s*\{\s*wczytaj\s*\(\s*\)\s*;` },
          { say: '<p>Złap wyjątek i wypisz komunikat z <code>e.getMessage()</code>.</p>', type: '        } catch (Exception e) {\n            System.out.println("Blad: " + e.getMessage());\n        }', expect: J`\}\s*catch\s*\(\s*Exception\s+e\s*\)\s*\{\s*System\.out\.println\s*\(\s*"Blad: "\s*\+\s*e\.getMessage\s*\(\s*\)\s*\)\s*;\s*\}` },
        ],
        solution: [FL('Main.java', 'public class Main {\n    static void wczytaj() throws Exception {\n        throw new Exception("Brak pliku");\n    }\n\n    public static void main(String[] args) {\n        try {\n            wczytaj();\n        } catch (Exception e) {\n            System.out.println("Blad: " + e.getMessage());\n        }\n    }\n}\n')],
        checks: [
          CK(CR, 'Program wypisuje „Blad: Brak pliku”', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Blad: Brak pliku] – program wypisał: " + o, o.equals(Arrays.asList("Blad: Brak pliku")));`),
          CK(MD, 'Metoda wczytaj deklaruje throws Exception', J`isTrue("Dodaj throws Exception w nagłówku wczytaj()", method("Main", "wczytaj").getExceptionTypes().length == 1);`),
        ],
      },
      exercise: {
        prompt: '<p>Napisz w <code>Main</code> metodę <code>static void sprawdz(int x) throws Exception</code>, która dla <code>x &lt; 0</code> rzuca <code>new Exception("Ujemna")</code>, a w przeciwnym razie wypisuje <code>OK</code>. W <code>main</code> wywołaj <code>sprawdz(-1)</code> w <code>try/catch</code> i wypisz <code>Blad: Ujemna</code>.</p>',
        files: [FL('Main.java', 'public class Main {\n    public static void main(String[] args) {\n    }\n}\n')],
        hints: ['Nagłówek: <code>static void sprawdz(int x) throws Exception</code>', '<code>if (x < 0) { throw new Exception("Ujemna"); } System.out.println("OK");</code>', 'W main: <code>try { sprawdz(-1); } catch (Exception e) { System.out.println("Blad: " + e.getMessage()); }</code>'],
        solution: [FL('Main.java', 'public class Main {\n    static void sprawdz(int x) throws Exception {\n        if (x < 0) {\n            throw new Exception("Ujemna");\n        }\n        System.out.println("OK");\n    }\n\n    public static void main(String[] args) {\n        try {\n            sprawdz(-1);\n        } catch (Exception e) {\n            System.out.println("Blad: " + e.getMessage());\n        }\n    }\n}\n')],
        checks: [
          CK(CR, 'sprawdz(-1) rzuca Exception „Ujemna”, a sprawdz(1) wypisuje OK', J`Throwable t = thrown(() -> callStatic("Main", "sprawdz", -1)); isTrue("Oczekiwano Exception, a było: " + t, t != null && t.getClass() == Exception.class); eq("Ujemna", t.getMessage()); List<String> o = lines(out(() -> callStatic("Main", "sprawdz", 1))); isTrue("Oczekiwano: [OK] – wypisano: " + o, o.equals(Arrays.asList("OK")));`),
          CK(CR, 'main wypisuje „Blad: Ujemna”', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Blad: Ujemna] – program wypisał: " + o, o.equals(Arrays.asList("Blad: Ujemna")));`),
          CK(MD, 'Nagłówek zawiera throws Exception', J`isTrue("Dodaj throws Exception w nagłówku sprawdz", method("Main", "sprawdz", int.class).getExceptionTypes().length == 1);`),
        ],
      },
      quiz: [
        Q('Co robi słowo <code>throws</code> w nagłówku metody?', ['zapowiada, że metoda może zgłosić wyjątek', 'zgłasza wyjątek', 'łapie wyjątek', 'tworzy nowy wyjątek'], 0, '<code>throw</code> rzuca, <code>throws</code> zapowiada.'),
        Q('Co musi zrobić kod wywołujący metodę z <code>throws Exception</code>?', ['obsłużyć wyjątek try/catch lub sam zadeklarować throws', 'nic', 'zawsze użyć finally', 'zamienić metodę na static'], 0, 'Wyjątki kontrolowane muszą być obsłużone lub przekazane dalej.'),
        Q('Który z wyjątków <b>nie</b> wymaga obowiązkowej obsługi?', ['IllegalArgumentException (RuntimeException)', 'Exception', 'IOException', 'żaden nie wymaga'], 0, 'RuntimeException i jego dzieci są niekontrolowane.'),
        Q('Gdzie piszemy <code>throw</code>, a gdzie <code>throws</code>?', ['throw w ciele metody, throws w nagłówku', 'throws w ciele, throw w nagłówku', 'oba w nagłówku', 'oba w ciele'], 0, 'To dwa różne słowa o różnych rolach.'),
      ],
    },

    {
      id: 'wyj-wlasne', title: 'Własna klasa wyjątku', blurb: 'class ... extends Exception', minutes: 6,
      content: [
        ANA('🏷️', 'Gotowe wyjątki są ogólne. Czasem chcesz mieć <b>własny, opisowy alarm</b>: „ZaMaloSrodkowException”, gdy w banku brakuje pieniędzy. Tworzysz go jak każdą klasę: <b>dziedziczy po <code>Exception</code></b> i przekazuje komunikat do konstruktora nadklasy przez <code>super(...)</code>.'),
        CODE(J`class ZaMaloSrodkowException extends Exception {
    public ZaMaloSrodkowException(String komunikat) {
        super(komunikat);
    }
}

class Konto {
    private double saldo = 100;

    public void wyplac(double kwota) throws ZaMaloSrodkowException {
        if (kwota > saldo) {
            throw new ZaMaloSrodkowException("Brakuje srodkow");
        }
        saldo -= kwota;
    }
}

public class Main {
    public static void main(String[] args) {
        Konto k = new Konto();
        try {
            k.wyplac(500);
        } catch (ZaMaloSrodkowException e) {
            System.out.println(e.getMessage());
        }
    }
}
`, 'Brakuje srodkow'),
        NOTE('tip', 'Własne wyjątki to też wymóg w wielu projektach. Pamiętaj o trzech elementach: <b>klasa dziedziczy po Exception</b>, <b>konstruktor wołający super(komunikat)</b>, <b>metoda z throws</b> i <b>throw new</b>.'),
      ],
      guide: {
        files: [FL('ZaMaloSrodkowException.java', ''), FL('Konto.java', 'public class Konto {\n    private double saldo = 100;\n\n    public void wyplac(double kwota) throws ZaMaloSrodkowException {\n        if (kwota > saldo) {\n            throw new ZaMaloSrodkowException("Brakuje srodkow");\n        }\n        saldo -= kwota;\n    }\n\n    public double getSaldo() {\n        return saldo;\n    }\n}\n')],
        steps: [
          { say: '<p>W pliku <code>ZaMaloSrodkowException.java</code> utwórz klasę, która <b>dziedziczy po <code>Exception</code></b>. Dzięki temu jest wyjątkiem kontrolowanym.</p>', type: 'public class ZaMaloSrodkowException extends Exception {', expect: J`class\s+ZaMaloSrodkowException\s+extends\s+Exception\s*\{` },
          { say: '<p>Dodaj konstruktor z komunikatem i przekaż go do nadklasy przez <code>super(...)</code>.</p>', type: '    public ZaMaloSrodkowException(String komunikat) {\n        super(komunikat);\n    }', expect: J`ZaMaloSrodkowException\s*\(\s*String\s+komunikat\s*\)\s*\{\s*super\s*\(\s*komunikat\s*\)\s*;\s*\}` },
          { say: '<p>Zamknij klasę klamrą.</p>', type: '}', expect: J`super\s*\(\s*komunikat\s*\)\s*;\s*\}\s*\}` },
        ],
        solution: [FL('ZaMaloSrodkowException.java', 'public class ZaMaloSrodkowException extends Exception {\n    public ZaMaloSrodkowException(String komunikat) {\n        super(komunikat);\n    }\n}\n'), FL('Konto.java', 'public class Konto {\n    private double saldo = 100;\n\n    public void wyplac(double kwota) throws ZaMaloSrodkowException {\n        if (kwota > saldo) {\n            throw new ZaMaloSrodkowException("Brakuje srodkow");\n        }\n        saldo -= kwota;\n    }\n\n    public double getSaldo() {\n        return saldo;\n    }\n}\n')],
        checks: [
          CK(CR, 'ZaMaloSrodkowException dziedziczy po Exception', J`isTrue("Klasa ma dziedziczyć po Exception", Exception.class.isAssignableFrom(cls("ZaMaloSrodkowException")));`),
          CK(CR, 'wyplac(500) zgłasza wyjątek z komunikatem', J`Throwable t = thrown(() -> call(make("Konto"), "wyplac", 500.0)); isTrue("Oczekiwano ZaMaloSrodkowException, a było: " + t, t != null && t.getClass().getSimpleName().equals("ZaMaloSrodkowException")); eq("Brakuje srodkow", t.getMessage());`),
          CK(MD, 'wyplac(50) działa bez błędu', J`Object k = make("Konto"); noThrow(() -> call(k, "wyplac", 50.0)); eq(50.0, call(k, "getSaldo"));`),
        ],
      },
      exercise: {
        prompt: '<p>Napisz klasę wyjątku <code>NiepoprawnyWiekException</code> (dziedziczy po <code>Exception</code>, konstruktor z komunikatem). W klasie <code>Osoba</code> uzupełnij <code>setWiek(int wiek) throws NiepoprawnyWiekException</code>: dla <code>wiek &lt; 0</code> rzuca wyjątek z komunikatem <code>Wiek ujemny</code>, inaczej zapisuje wiek.</p>',
        files: [FL('NiepoprawnyWiekException.java', ''), FL('Osoba.java', 'public class Osoba {\n    private int wiek;\n\n    public int getWiek() {\n        return wiek;\n    }\n\n    public void setWiek(int wiek) {\n        this.wiek = wiek;\n    }\n}\n')],
        hints: ['<code>public class NiepoprawnyWiekException extends Exception { public NiepoprawnyWiekException(String m) { super(m); } }</code>', 'Dopisz <code>throws NiepoprawnyWiekException</code> do nagłówka <code>setWiek</code> i <code>if (wiek < 0) { throw new NiepoprawnyWiekException("Wiek ujemny"); }</code>'],
        solution: [FL('NiepoprawnyWiekException.java', 'public class NiepoprawnyWiekException extends Exception {\n    public NiepoprawnyWiekException(String komunikat) {\n        super(komunikat);\n    }\n}\n'), FL('Osoba.java', 'public class Osoba {\n    private int wiek;\n\n    public int getWiek() {\n        return wiek;\n    }\n\n    public void setWiek(int wiek) throws NiepoprawnyWiekException {\n        if (wiek < 0) {\n            throw new NiepoprawnyWiekException("Wiek ujemny");\n        }\n        this.wiek = wiek;\n    }\n}\n')],
        checks: [
          CK(CR, 'NiepoprawnyWiekException dziedziczy po Exception', J`isTrue("Klasa ma dziedziczyć po Exception", Exception.class.isAssignableFrom(cls("NiepoprawnyWiekException")));`),
          CK(CR, 'setWiek(-1) zgłasza wyjątek „Wiek ujemny”', J`Throwable t = thrown(() -> call(make("Osoba"), "setWiek", -1)); isTrue("Oczekiwano NiepoprawnyWiekException, a było: " + t, t != null && t.getClass().getSimpleName().equals("NiepoprawnyWiekException")); eq("Wiek ujemny", t.getMessage());`),
          CK(CR, 'setWiek(20) zapisuje wiek', J`Object o = make("Osoba"); noThrow(() -> call(o, "setWiek", 20)); eq(20, call(o, "getWiek"));`),
        ],
      },
      quiz: [
        Q('Po której klasie dziedziczy własny wyjątek kontrolowany?', ['Exception', 'Object (bez extends)', 'String', 'RuntimeException tylko'], 0, 'Dziedziczenie po Exception daje wyjątek kontrolowany.'),
        Q('Po co w konstruktorze własnego wyjątku wywołujemy <code>super(komunikat)</code>?', ['żeby komunikat był dostępny przez getMessage()', 'żeby wyjątek był niekontrolowany', 'żeby zablokować dziedziczenie', 'to nie ma sensu'], 0, 'Nadklasa <code>Exception</code> przechowuje komunikat.'),
        Q('Co jest potrzebne, żeby metoda mogła zgłosić własny wyjątek kontrolowany?', ['throws w nagłówku i throw new w ciele', 'samo throws', 'samo catch', 'słowo static'], 0, 'Zapowiadamy w nagłówku i rzucamy w ciele.'),
        Q('Jak odczytać komunikat własnego wyjątku <code>e</code>?', ['e.getMessage()', 'e.komunikat', 'e.toString() zawsze zwraca sam komunikat', 'nie da się'], 0, 'Dziedziczysz tę metodę po Exception.'),
      ],
    },
  ],
  labs: [
    {
      id: 'lab4-z1', title: 'Zadanie: System wynagrodzeń (Osoba, Pracownik, Kierownik)', source: 'Zadania 4 – Klasy i Metody Abstrakcyjne (skan PDF)', concepts: ['abs-klasa', 'abs-metoda', 'wyj-wlasne', 'pol-downcast'],
      statement: J`<p>Utwórz system do wyliczania wynagrodzeń w firmie. Pracują w niej Pracownicy oraz Kierownicy.</p>
<h3>Klasa Osoba</h3>
<ul>
<li>Klasa <b>abstrakcyjna</b> <code>Osoba</code> z prywatnymi polami: <code>imie</code>, <code>nazwisko</code> (String), <code>rokUrodzenia</code> (int).</li>
<li>Konstruktor <code>(imie, nazwisko, rokUrodzenia)</code> przypisujący wszystkie pola.</li>
<li>Abstrakcyjna metoda <code>public int obliczRocznaWyplate()</code>.</li>
<li><code>toString()</code>: wszystkie pola oddzielone spacją, np. <code>Jan Kowalski 1980</code>.</li>
</ul>
<h3>Klasa Pracownik (dziedziczy po Osoba)</h3>
<ul>
<li>Prywatne pola: <code>pesel</code> (String), <code>pensja</code>, <code>liczbaNagodzin</code>, <code>kwotaZaNadgodzine</code> (int).</li>
<li>Konstruktor <code>(imie, nazwisko, rokUrodzenia, pesel, pensja, liczbaNagodzin, kwotaZaNadgodzine)</code>.</li>
<li><code>obliczRocznaWyplate()</code> zwraca <code>pensja + liczbaNagodzin * kwotaZaNadgodzine</code>.</li>
<li><code>toString()</code>: wszystkie pola Pracownika <b>i nadklasy</b> (przez <code>super.toString()</code>) oddzielone spacją, a na końcu wysokość rocznej wypłaty, np. <code>Jan Kowalski 1980 80010112345 5000 10 30 5300</code>.</li>
<li>W klasie Pracownik utwórz klasę <b><code>PracownikException</code></b> dziedziczącą po <code>Exception</code> z konstruktorem przyjmującym <code>String message</code>. Konstruktor Pracownika wyrzuca ją, gdy:
  <ul><li><code>kwotaZaNadgodzine</code> &lt; 28 → komunikat: <code>Nie możesz tak mało zapłacić pracownikowi za godzinę pracy!</code></li>
  <li><code>pensja</code> &lt; 4242 → komunikat: <code>Nie możesz tak mało zapłacić pracownikowi za miesiąc pracy na etacie!</code></li></ul></li>
</ul>
<h3>Klasa Kierownik (dziedziczy po Pracownik)</h3>
<ul>
<li>Publiczne pola: <code>Pracownik[] podwladni</code>, <code>int dodatekZaPodwladnego</code>.</li>
<li>Konstruktor <code>(imie, nazwisko, rokUrodzenia, pesel, pensja, liczbaNagodzin, kwotaZaNadgodzine, podwladni, dodatekZaPodwladnego)</code> (wyrzuca ten sam wyjątek).</li>
<li><code>obliczRocznaWyplate()</code>: <code>pensja + liczbaNagodzin * kwotaZaNadgodzine + liczbaPodwladnych * dodatekZaPodwladnego</code>.</li>
<li><code>toString()</code>: <code>super.toString()</code> + spacja + liczba podwładnych + spacja + <code>dodatekZaPodwladnego</code>.</li>
</ul>
<h3>Klasa WynagrodzenieMinimalne</h3>
<ul>
<li>Statyczne pola <code>int minimalnaKwotaZaGodzine = 28</code> i <code>int minimalnaKwotaZaMiesiac = 4242</code>.</li>
<li>Zastąp w konstruktorze Pracownika wartości 28 i 4242 tymi polami.</li>
</ul>
<h3>Main</h3>
<ul>
<li>W <code>try</code> utwórz 4 pracowników (jeśli płace będą niewłaściwe, wyjątek trzeba obsłużyć – wyświetl <code>getMessage()</code>).</li>
<li>Tablica <code>pracownicy</code> typu <code>Pracownik[]</code> z tymi 4 osobami; utwórz kierownika, przekaż mu tablicę.</li>
<li>Umieść kierownika i pracowników w jednej tablicy <code>osoby</code> typu <code>Osoba[]</code>.</li>
<li>Wywołaj <code>toString()</code> oraz <code>obliczRocznaWyplate()</code> na każdym obiekcie z tablicy <code>osoby</code>.</li>
<li>Wyświetl liczbę podwładnych wszystkich kierowników z tablicy <code>osoby</code> (jest tam tylko jeden kierownik – pracowników pomiń): użyj <code>instanceof</code> i, jeśli zwróci <code>true</code>, zrób downcasting.</li>
</ul>`,
      notes: 'Treść pochodzi ze skanu PDF (Zadania 4). Dla jednoznaczności testów przyjęto: pola liczbowe to <code>int</code>, a <code>PracownikException</code> może być klasą zagnieżdżoną w <code>Pracownik</code> (<code>public static class</code>) albo osobnym plikiem – test sprawdza tylko nazwę wyjątku. Użyj nazw bez polskich znaków (np. <code>obliczRocznaWyplate</code>). Plik <code>Pracownik.java</code> z zagnieżdżoną klasą: <code>public static class PracownikException extends Exception { ... }</code>; łapiesz ją w Main jako <code>Pracownik.PracownikException</code>.',
      files: [
        { name: 'Osoba.java', code: J`public abstract class Osoba {

}
` },
        { name: 'Pracownik.java', code: J`public class Pracownik {

}
` },
        { name: 'Kierownik.java', code: J`public class Kierownik {

}
` },
        { name: 'WynagrodzenieMinimalne.java', code: J`public class WynagrodzenieMinimalne {

}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {

    }
}
` }],
      hints: ['Osoba: <code>public abstract int obliczRocznaWyplate();</code> – bez ciała.', 'Wyjątek zagnieżdżony: <code>public static class PracownikException extends Exception { public PracownikException(String message) { super(message); } }</code> w środku klasy Pracownik.', 'Konstruktor Pracownika: <code>super(...)</code> musi być pierwszą instrukcją, więc sprawdzenia robisz zaraz <b>po</b> nim: <code>if (kwotaZaNadgodzine < WynagrodzenieMinimalne.minimalnaKwotaZaGodzine) { throw new PracownikException("…"); }</code>.', 'Kierownik: liczba podwładnych to <code>podwladni.length</code>.', 'Main: <code>if (osoba instanceof Kierownik) { Kierownik k = (Kierownik) osoba; ... k.podwladni.length ... }</code>'],
      solution: [
        { name: 'Osoba.java', code: J`public abstract class Osoba {
    private String imie;
    private String nazwisko;
    private int rokUrodzenia;

    public Osoba(String imie, String nazwisko, int rokUrodzenia) {
        this.imie = imie;
        this.nazwisko = nazwisko;
        this.rokUrodzenia = rokUrodzenia;
    }

    public abstract int obliczRocznaWyplate();

    @Override
    public String toString() {
        return imie + " " + nazwisko + " " + rokUrodzenia;
    }
}
` },
        { name: 'WynagrodzenieMinimalne.java', code: J`public class WynagrodzenieMinimalne {
    public static int minimalnaKwotaZaGodzine = 28;
    public static int minimalnaKwotaZaMiesiac = 4242;
}
` },
        { name: 'Pracownik.java', code: J`public class Pracownik extends Osoba {
    private String pesel;
    private int pensja;
    private int liczbaNagodzin;
    private int kwotaZaNadgodzine;

    public Pracownik(String imie, String nazwisko, int rokUrodzenia, String pesel,
                     int pensja, int liczbaNagodzin, int kwotaZaNadgodzine) throws PracownikException {
        super(imie, nazwisko, rokUrodzenia);
        if (kwotaZaNadgodzine < WynagrodzenieMinimalne.minimalnaKwotaZaGodzine) {
            throw new PracownikException("Nie możesz tak mało zapłacić pracownikowi za godzinę pracy!");
        }
        if (pensja < WynagrodzenieMinimalne.minimalnaKwotaZaMiesiac) {
            throw new PracownikException("Nie możesz tak mało zapłacić pracownikowi za miesiąc pracy na etacie!");
        }
        this.pesel = pesel;
        this.pensja = pensja;
        this.liczbaNagodzin = liczbaNagodzin;
        this.kwotaZaNadgodzine = kwotaZaNadgodzine;
    }

    @Override
    public int obliczRocznaWyplate() {
        return pensja + liczbaNagodzin * kwotaZaNadgodzine;
    }

    @Override
    public String toString() {
        return super.toString() + " " + pesel + " " + pensja + " " + liczbaNagodzin + " "
                + kwotaZaNadgodzine + " " + obliczRocznaWyplate();
    }

    public static class PracownikException extends Exception {
        public PracownikException(String message) {
            super(message);
        }
    }
}
` },
        { name: 'Kierownik.java', code: J`public class Kierownik extends Pracownik {
    public Pracownik[] podwladni;
    public int dodatekZaPodwladnego;

    public Kierownik(String imie, String nazwisko, int rokUrodzenia, String pesel,
                     int pensja, int liczbaNagodzin, int kwotaZaNadgodzine,
                     Pracownik[] podwladni, int dodatekZaPodwladnego) throws PracownikException {
        super(imie, nazwisko, rokUrodzenia, pesel, pensja, liczbaNagodzin, kwotaZaNadgodzine);
        this.podwladni = podwladni;
        this.dodatekZaPodwladnego = dodatekZaPodwladnego;
    }

    @Override
    public int obliczRocznaWyplate() {
        return super.obliczRocznaWyplate() + podwladni.length * dodatekZaPodwladnego;
    }

    @Override
    public String toString() {
        return super.toString() + " " + podwladni.length + " " + dodatekZaPodwladnego;
    }
}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {
        try {
            Pracownik[] pracownicy = new Pracownik[4];
            pracownicy[0] = new Pracownik("Jan", "Kowalski", 1980, "80010112345", 5000, 10, 30);
            pracownicy[1] = new Pracownik("Ewa", "Lis", 1985, "85020223456", 4500, 0, 28);
            pracownicy[2] = new Pracownik("Adam", "Nowak", 1990, "90030334567", 5200, 5, 35);
            pracownicy[3] = new Pracownik("Zofia", "Maj", 1992, "92040445678", 4800, 8, 40);

            Kierownik kierownik = new Kierownik("Anna", "Wrona", 1975, "75050556789", 7000, 5, 40, pracownicy, 100);

            Osoba[] osoby = new Osoba[5];
            for (int i = 0; i < pracownicy.length; i++) {
                osoby[i] = pracownicy[i];
            }
            osoby[4] = kierownik;

            for (Osoba o : osoby) {
                System.out.println(o.toString());
            }
            for (Osoba o : osoby) {
                System.out.println(o.obliczRocznaWyplate());
            }
            for (Osoba o : osoby) {
                if (o instanceof Kierownik) {
                    Kierownik k = (Kierownik) o;
                    System.out.println("Liczba podwładnych kierownika: " + k.podwladni.length);
                }
            }
        } catch (Pracownik.PracownikException e) {
            System.out.println(e.getMessage());
        }
    }
}
` }],
      prelude: J`static Object[] gp(int n) throws Throwable {
    Object arr = java.lang.reflect.Array.newInstance(cls("Pracownik"), n);
    for (int i = 0; i < n; i++) java.lang.reflect.Array.set(arr, i, make("Pracownik", "P" + i, "N" + i, 1990, "9001011234" + i, 5000, 0, 30));
    return (Object[]) arr;
}
static Object prac() throws Throwable { return make("Pracownik", "Jan", "Kowalski", 1980, "80010112345", 5000, 10, 30); }
static Object kier() throws Throwable { return make("Kierownik", "Anna", "Wrona", 1975, "75050556789", 6000, 5, 40, gp(4), 100); }`,
      checks: [
        CK(CR, 'Osoba jest klasą abstrakcyjną z abstrakcyjną metodą obliczRocznaWyplate', J`isTrue("Osoba powinna być abstract", Modifier.isAbstract(cls("Osoba").getModifiers()));
java.lang.reflect.Method m = method("Osoba", "obliczRocznaWyplate");
isTrue("obliczRocznaWyplate powinna być abstract", Modifier.isAbstract(m.getModifiers()));
isTrue("obliczRocznaWyplate powinna być public", Modifier.isPublic(m.getModifiers()));
eq(int.class, m.getReturnType());`),
        CK(MD, 'Osoba: prywatne pola imie, nazwisko, rokUrodzenia', J`for (String n : new String[]{"imie", "nazwisko", "rokUrodzenia"}) {
    isTrue("Brak pola " + n + " w Osoba", hasField("Osoba", n));
    isTrue("Pole " + n + " ma być private", Modifier.isPrivate(fieldMods("Osoba", n)));
}`),
        CK(CR, 'Pracownik dziedziczy po Osoba; konstruktor ustawia pola', J`isTrue("Pracownik musi dziedziczyć po Osoba", isSubclass("Pracownik", "Osoba"));
Object p = prac();
eq("80010112345", field(p, "pesel")); eq(5000, field(p, "pensja")); eq(10, field(p, "liczbaNagodzin")); eq(30, field(p, "kwotaZaNadgodzine"));
eq("Jan", field(p, "imie")); eq(1980, field(p, "rokUrodzenia"));
for (String n : new String[]{"pesel", "pensja", "liczbaNagodzin", "kwotaZaNadgodzine"}) isTrue("Pole " + n + " ma być private", Modifier.isPrivate(fieldMods("Pracownik", n)));`),
        CK(CR, 'Pracownik.obliczRocznaWyplate() = pensja + nadgodziny × stawka', J`eq(5300, call(prac(), "obliczRocznaWyplate"));`),
        CK(MD, 'Pracownik.toString() = Osoba + pola + roczna wypłata', J`eq("Jan Kowalski 1980 80010112345 5000 10 30 5300", prac().toString());`),
        CK(CR, 'Zbyt niska stawka za nadgodzinę → PracownikException z właściwym komunikatem', J`Throwable e = thrown(() -> make("Pracownik", "A", "B", 1990, "1", 5000, 10, 27));
isTrue("Oczekiwano PracownikException, jest: " + e, e != null && isInstanceOfName(e, "PracownikException"));
isTrue("PracownikException ma dziedziczyć po Exception", e instanceof Exception);
eq("Nie możesz tak mało zapłacić pracownikowi za godzinę pracy!", e.getMessage());
noThrow(() -> make("Pracownik", "A", "B", 1990, "1", 5000, 10, 28));`),
        CK(CR, 'Zbyt niska pensja → PracownikException z właściwym komunikatem', J`Throwable e = thrown(() -> make("Pracownik", "A", "B", 1990, "1", 4241, 10, 30));
isTrue("Oczekiwano PracownikException, jest: " + e, e != null && isInstanceOfName(e, "PracownikException"));
eq("Nie możesz tak mało zapłacić pracownikowi za miesiąc pracy na etacie!", e.getMessage());
noThrow(() -> make("Pracownik", "A", "B", 1990, "1", 4242, 10, 30));`),
        CK(MD, 'WynagrodzenieMinimalne: statyczne pola 28 i 4242', J`eq(28, staticField("WynagrodzenieMinimalne", "minimalnaKwotaZaGodzine"));
eq(4242, staticField("WynagrodzenieMinimalne", "minimalnaKwotaZaMiesiac"));
isTrue("Pola mają być static", Modifier.isStatic(fieldMods("WynagrodzenieMinimalne", "minimalnaKwotaZaGodzine")) && Modifier.isStatic(fieldMods("WynagrodzenieMinimalne", "minimalnaKwotaZaMiesiac")));`),
        CK(MN, 'Konstruktor Pracownika używa pól WynagrodzenieMinimalne zamiast liczb 28 i 4242', J`String s = src("Pracownik");
isTrue("Użyj WynagrodzenieMinimalne.minimalnaKwotaZaGodzine", s.contains("WynagrodzenieMinimalne.minimalnaKwotaZaGodzine"));
isTrue("Użyj WynagrodzenieMinimalne.minimalnaKwotaZaMiesiac", s.contains("WynagrodzenieMinimalne.minimalnaKwotaZaMiesiac"));`),
        CK(CR, 'Kierownik dziedziczy po Pracownik; publiczne pola podwladni i dodatekZaPodwladnego', J`isTrue("Kierownik musi dziedziczyć po Pracownik", isSubclass("Kierownik", "Pracownik"));
Object k = kier();
eq(100, field(k, "dodatekZaPodwladnego")); eq(4, ((Object[]) field(k, "podwladni")).length);
isTrue("podwladni ma być public", Modifier.isPublic(fieldMods("Kierownik", "podwladni")));
isTrue("dodatekZaPodwladnego ma być public", Modifier.isPublic(fieldMods("Kierownik", "dodatekZaPodwladnego")));`),
        CK(CR, 'Kierownik.obliczRocznaWyplate() = pensja + nadgodziny + podwładni × dodatek', J`eq(6000 + 5 * 40 + 4 * 100, call(kier(), "obliczRocznaWyplate"));`),
        CK(MD, 'Kierownik.toString() = Pracownik.toString + liczba podwładnych + dodatek', J`eq("Anna Wrona 1975 75050556789 6000 5 40 6600 4 100", kier().toString());`),
        CK(MD, 'Kierownik w tablicy Osoba[]: polimorficzne wywołanie wypłaty', J`Object k = kier();
Object arr = java.lang.reflect.Array.newInstance(cls("Osoba"), 2);
java.lang.reflect.Array.set(arr, 0, prac()); java.lang.reflect.Array.set(arr, 1, k);
Object[] t = (Object[]) arr;
eq(5300, call(t[0], "obliczRocznaWyplate")); eq(6600, call(t[1], "obliczRocznaWyplate"));`),
        CK(MD, 'Main: wypisuje toString, wypłaty i liczbę podwładnych kierownika', J`String o = runMain();
List<String> l = lines(o);
isTrue("Main powinien wypisać min. 11 linii (5 × toString, 5 × wypłata, liczba podwładnych) – jest: " + l.size(), l.size() >= 11);
isTrue("Ostatnia linia powinna zawierać liczbę podwładnych (4) – jest: " + l.get(l.size() - 1), l.get(l.size() - 1).contains("4"));`),
        CK(MN, 'Main: tablica Osoba[], instanceof Kierownik, downcasting i try/catch', J`isTrue("Użyj tablicy Osoba[]", srcHas("Main", "Osoba\\s*\\[\\s*\\]"));
isTrue("Użyj instanceof Kierownik", srcHas("Main", "instanceof\\s+Kierownik"));
isTrue("Zrób downcasting (Kierownik)", srcHas("Main", "\\(\\s*Kierownik\\s*\\)"));
isTrue("Obsłuż wyjątek w try/catch", srcHas("Main", "\\btry\\b") && srcHas("Main", "\\bcatch\\b"));
isTrue("Wyświetl getMessage()", srcHas("Main", "getMessage\\s*\\("));`),
      ],
    },
  ],

  quiz: [
    Q('Co jest prawdą o klasie abstrakcyjnej?', ['nie można utworzyć jej instancji', 'można utworzyć jej instancję'], 0, 'To podstawowa cecha: <code>new KlasaAbstrakcyjna()</code> → błąd kompilacji.', 'abs-klasa'),
    Q('Co jest prawdą o metodzie abstrakcyjnej?', ['nie posiada ona ciała', 'posiada ona ciało'], 0, 'Deklaracja kończy się średnikiem.', 'abs-metoda'),
    Q('Co jest prawdą o metodzie abstrakcyjnej?', ['można deklarować je jedynie w abstrakcyjnych klasach', 'można deklarować je w każdej klasie', 'należy nadpisać tę metodę w klasie pochodnej nieabstrakcyjnej', 'należy nadpisać tę metodę w klasie pochodnej abstrakcyjnej'], [0, 2], 'Klasa pochodna abstrakcyjna nie musi jej nadpisywać.', 'abs-metoda'),
    Q('Co jest prawdą o klasie abstrakcyjnej?', ['można tworzyć obiekty tej klasy', 'można tworzyć tablice jej typu i przechowywać w nich obiekty klas pochodnych (jeśli są nieabstrakcyjne)', 'mogą mieć tylko prywatne metody'], 1, 'Tablica typu abstrakcyjnego przechowuje referencje do obiektów podklas.', 'abs-klasa'),
    Q('Co jest prawdą o klasie abstrakcyjnej?', ['nie może posiadać konstruktora', 'nie może posiadać pól', 'nie może posiadać metod', 'może posiadać konstruktor, pola i metody'], 3, 'Konstruktor jest wywoływany przez <code>super(...)</code> z podklasy.', 'abs-klasa'),
    Q('Co wydarzy się, jeżeli downcasting zakończy się niepowodzeniem?', ['zostanie wyrzucony wyjątek (<code>ClassCastException</code>)', 'linijka kodu zostanie pominięta', 'zostanie zwrócone <code>null</code>'], 0, 'Dlatego przed rzutowaniem w dół używamy <code>instanceof</code>.', 'pol-downcast'),
    Q('Czy prawdą jest, że może być wiele bloków <code>catch</code> dla jednego bloku <code>try</code>?', ['tak, to prawda', 'nie, to fałsz'], 0, 'Wykonuje się tylko pierwszy pasujący, więc ustawiaj je od szczegółowych do ogólnych.', 'wyj-trycatch'),
    Q('Co jest prawdą o wyjątkach?', ['to obiekty', 'możemy tworzyć własne wyjątki', 'posiadają hierarchię'], [0, 1, 2], 'Wszystkie trzy.', 'wyj-trycatch'),
    Q('Do sprawdzenia, czy obiekt możemy przekonwertować na dany typ, używamy słowa:', ['<code>canCast</code>', '<code>instanceof</code>', '<code>throw</code>', '<code>extends</code>'], 1, 'Operator binarny zwracający <code>boolean</code>.', 'pol-downcast'),
    Q('Jeżeli klasa <code>Person</code> jest abstrakcyjna, to prawdą jest, że:', ['nie można z niej dziedziczyć', 'nie można utworzyć obiektów tej klasy', 'nie może posiadać metod'], 1, 'Dziedziczyć można – po to jest abstrakcyjna.', 'abs-klasa'),
    Q('Słowo kluczowe używane do wyrzucania wyjątków to:', ['<code>extends</code>', '<code>throw</code>', '<code>create</code>', '<code>except</code>'], 1, '<code>throw new Wyjatek(...)</code>.', 'wyj-wlasne'),
    Q('Jeśli w bloku <code>try</code> są linie 11 i 12, wyjątek wystąpił w linii 11 i został obsłużony w <code>catch</code>, to:', ['kod z linii 12 nie wykona się', 'kod z linii 12 wykona się po bloku catch', 'kod z linii 12 wykona się po linii 11'], 0, 'Po wyjątku następuje skok do <code>catch</code>.', 'wyj-trycatch'),
    Q('Co wypisze program?', ['F1', '1F', '1', 'F'], 0, 'W <code>return</code> wartość 1 jest obliczona, ale zanim metoda się zakończy, wykona się <code>finally</code> (wypisze F). Dopiero potem <code>println</code> wypisze 1.', 'wyj-trycatch', { code: J`public class Main {
    static int f() {
        try {
            return 1;
        } finally {
            System.out.print("F");
        }
    }

    public static void main(String[] args) {
        System.out.println(f());
    }
}` }),
  ],
});
