'use strict';
ACAD.modules.push({
  id: 'dz', num: 5, level: 2, icon: '🧬', title: 'Dziedziczenie',
  source: 'Wykład 2 – dziedziczenie i polimorfizm (część 1) · Laboratoria 3 (Zadania 3, zad. 1–2)',
  summary: 'extends, super, kolejność konstruktorów, dostęp do pól nadklasy, nadpisywanie metod i toString.',
  goals: ['utworzyć klasę pochodną przez <code>extends</code>', 'wywołać konstruktor nadklasy przez <code>super(...)</code>', 'wyjaśnić, jakie składowe nadklasy są widoczne w podklasie', 'nadpisać metodę, w tym <code>toString</code>, i wywołać wersję bazową przez <code>super.metoda()</code>'],
  lessons: [

    {
      id: 'dz-idea', micro: true, title: 'Po co dziedziczenie?', blurb: 'wspólny kod w jednym miejscu, relacja „jest”', minutes: 4,
      content: [
        ANA('🌳', 'Pies <b>jest</b> zwierzęciem, kot <b>jest</b> zwierzęciem. Oba mają imię i oba jedzą. Zamiast pisać to samo dwa razy, wspólne rzeczy opisujesz <b>raz</b> w klasie <b>Zwierze</b> (nadklasa), a <b>Pies</b> i <b>Kot</b> (klasy pochodne) tylko po niej <b>dziedziczą</b>, czyli dostają to wszystko „w prezencie”. Dodają jedynie to, co własne.'),
        VIZ('tree', { title: 'Drzewo dziedziczenia', nodes: [{ id: 'z', l: 'Zwierze', s: ['imie', 'jedz()'] }, { id: 'p', l: 'Pies', p: 'z', s: ['+ szczekaj()'] }, { id: 'k', l: 'Kot', p: 'z', s: ['+ miaucz()'] }] }),
        TERMS([['nadklasa (klasa bazowa)', 'klasa, po której się dziedziczy (<code>Zwierze</code>)'], ['klasa pochodna (podklasa)', 'klasa, która dziedziczy (<code>Pies</code>)'], ['<code>extends</code>', 'słowo mówiące „dziedziczy po”'], ['relacja „jest”', 'dziedziczenie stosujemy, gdy da się powiedzieć „Pies <b>jest</b> Zwierzęciem”']]),
        NOTE('warn', 'Dziedziczenie to <b>nie</b> „ma”. Samochód <b>ma</b> silnik (to pole), ale samochód <b>nie jest</b> silnikiem. Wtedy robimy pole, a nie dziedziczenie.'),
      ],
      quiz: [
        Q('Co daje dziedziczenie?', ['klasa pochodna dostaje pola i metody nadklasy, bez ich przepisywania', 'klasa pochodna traci swoje pola', 'wszystkie klasy stają się publiczne', 'program działa szybciej'], 0, 'Wspólny kod jest w jednym miejscu.'),
        Q('Kiedy pasuje dziedziczenie?', ['gdy zachodzi relacja „jest” (Pies jest Zwierzęciem)', 'gdy zachodzi relacja „ma” (Samochód ma Silnik)', 'zawsze, gdy dwie klasy mają pola', 'nigdy'], 0, '„Ma” to pole, „jest” to dziedziczenie.'),
        Q('Którą klasę nazywamy nadklasą w <code>class Pies extends Zwierze</code>?', ['Zwierze', 'Pies', 'obie', 'żadną'], 0, 'Po <code>extends</code> stoi nadklasa.'),
      ],
    },

    {
      id: 'dz-extends', title: 'extends: klasa pochodna', blurb: 'class Pies extends Zwierze', minutes: 5,
      content: [
        ANA('🎁', '<code>extends</code> to „<b>odziedzicz po</b>”. Po napisaniu <code>class Pies extends Zwierze</code> pies <b>od razu</b> ma imię i umie jeść, mimo że w klasie <code>Pies</code> nie ma o tym ani linijki.'),
        CODE(J`class Zwierze {
    String imie;

    void jedz() {
        System.out.println(imie + " je");
    }
}

class Pies extends Zwierze {
}

public class Main {
    public static void main(String[] args) {
        Pies p = new Pies();
        p.imie = "Reks";
        p.jedz();
    }
}
`, 'Reks je'),
        NOTE('info', 'W Javie klasa może dziedziczyć <b>tylko po jednej</b> klasie (<code>extends</code> z jedną nazwą). Wielu „rodziców” nie ma.'),
      ],
      guide: {
        files: [FL('Zwierze.java', 'public class Zwierze {\n    String imie;\n\n    public void jedz() {\n        System.out.println(imie + " je");\n    }\n}\n'), FL('Pies.java', 'public class Pies {\n}\n')],
        steps: [
          { say: '<p>Sprawimy, żeby <code>Pies</code> dziedziczył po <code>Zwierze</code>. Po nazwie klasy dopisz <code>extends</code> i nazwę nadklasy.</p>', type: 'public class Pies extends Zwierze {', expect: J`class\s+Pies\s+extends\s+Zwierze\s*\{` },
        ],
        solution: [FL('Zwierze.java', 'public class Zwierze {\n    String imie;\n\n    public void jedz() {\n        System.out.println(imie + " je");\n    }\n}\n'), FL('Pies.java', 'public class Pies extends Zwierze {\n}\n')],
        checks: [
          CK(CR, 'Pies dziedziczy po Zwierze', J`isTrue("Pies ma dziedziczyć po Zwierze (extends)", isSubclass("Pies", "Zwierze"));`),
          CK(CR, 'Pies korzysta z odziedziczonych pól i metod', J`Object p = make("Pies"); setField(p, "imie", "Reks"); List<String> o = lines(out(() -> call(p, "jedz"))); isTrue("Oczekiwano: [Reks je] – wypisano: " + o, o.equals(Arrays.asList("Reks je")));`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Pojazd</code> ma pole <code>marka</code> i metodę <code>start()</code>. Napisz klasę <code>Auto</code>, która <b>dziedziczy</b> po <code>Pojazd</code>. Sama klasa ma pozostać pusta.</p>',
        files: [FL('Pojazd.java', 'public class Pojazd {\n    String marka;\n\n    public void start() {\n        System.out.println(marka + " rusza");\n    }\n}\n'), FL('Auto.java', '')],
        hints: ['<code>class Auto extends Pojazd { }</code>'],
        solution: [FL('Pojazd.java', 'public class Pojazd {\n    String marka;\n\n    public void start() {\n        System.out.println(marka + " rusza");\n    }\n}\n'), FL('Auto.java', 'public class Auto extends Pojazd {\n}\n')],
        checks: [
          CK(CR, 'Auto dziedziczy po Pojazd', J`isTrue("Auto ma dziedziczyć po Pojazd", isSubclass("Auto", "Pojazd"));`),
          CK(CR, 'Auto ma odziedziczoną metodę start()', J`Object a = make("Auto"); setField(a, "marka", "Fiat"); List<String> o = lines(out(() -> call(a, "start"))); isTrue("Oczekiwano: [Fiat rusza] – wypisano: " + o, o.equals(Arrays.asList("Fiat rusza")));`),
        ],
      },
      quiz: [
        Q('Co oznacza <code>class Pies extends Zwierze</code>?', ['Pies dziedziczy pola i metody po Zwierze', 'Zwierze dziedziczy po Pies', 'Pies i Zwierze to ta sama klasa', 'Pies nie może mieć własnych metod'], 0, 'Pies jest klasą pochodną, Zwierze nadklasą.'),
        OUTQ('Co wypisze program?', ['Reks je', 'null je', 'je', 'błąd'], 0, 'Pies odziedziczył pole i metodę po klasie Zwierze.', 'class Zwierze {\n    String imie;\n\n    void jedz() {\n        System.out.println(imie + " je");\n    }\n}\n\nclass Pies extends Zwierze {\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Pies p = new Pies();\n        p.imie = "Reks";\n        p.jedz();\n    }\n}\n'),
        Q('Po ilu klasach może dziedziczyć jedna klasa w Javie?', ['po jednej', 'po dwóch', 'po dowolnie wielu', 'po żadnej'], 0, 'Java nie ma dziedziczenia wielokrotnego klas.'),
      ],
    },

    {
      id: 'dz-wlasne', title: 'Własne pola i metody w klasie pochodnej', blurb: 'dziedziczysz wszystko i dodajesz swoje', minutes: 4,
      content: [
        ANA('🧩', 'Klasa pochodna dostaje wszystko od nadklasy i może <b>dodać coś swojego</b>. Pies ma imię (od Zwierze), a do tego własną <b>rasę</b> i umiejętność <code>szczekaj()</code>, których zwykłe zwierzę nie ma.'),
        VIZ('tree', { title: 'Co ma Pies?', nodes: [{ id: 'z', l: 'Zwierze', s: ['imie', 'jedz()'] }, { id: 'p', l: 'Pies', p: 'z', s: ['imie', 'jedz() (odziedziczone) + rasa', 'szczekaj() (własne)'] }] }),
        CODE(J`class Zwierze {
    String imie;
}

class Pies extends Zwierze {
    String rasa;

    void szczekaj() {
        System.out.println(imie + " szczeka");
    }
}

public class Main {
    public static void main(String[] args) {
        Pies p = new Pies();
        p.imie = "Reks";
        p.rasa = "owczarek";
        p.szczekaj();
    }
}
`, 'Reks szczeka'),
        NOTE('warn', 'Odwrotnie to <b>nie działa</b>: zwykłe <code>Zwierze</code> nie ma metody <code>szczekaj()</code>. Nadklasa nie zna dodatków swoich dzieci.'),
      ],
      guide: {
        files: [FL('Zwierze.java', 'public class Zwierze {\n    String imie;\n}\n'), FL('Pies.java', 'public class Pies extends Zwierze {\n}\n')],
        steps: [
          { say: '<p>Dodaj do klasy <code>Pies</code> <b>własne pole</b>, którego nie ma w <code>Zwierze</code>.</p>', type: '    String rasa;', expect: J`Pies\s+extends\s+Zwierze\s*\{\s*String\s+rasa\s*;` },
          { say: '<p>Dodaj własną metodę. Korzysta z odziedziczonego pola <code>imie</code>.</p>', type: '    public void szczekaj() {\n        System.out.println(imie + " szczeka");\n    }', expect: J`void\s+szczekaj\s*\(\s*\)\s*\{\s*System\.out\.println\s*\(\s*imie\s*\+\s*" szczeka"\s*\)\s*;\s*\}` },
        ],
        solution: [FL('Zwierze.java', 'public class Zwierze {\n    String imie;\n}\n'), FL('Pies.java', 'public class Pies extends Zwierze {\n    String rasa;\n\n    public void szczekaj() {\n        System.out.println(imie + " szczeka");\n    }\n}\n')],
        checks: [
          CK(CR, 'Pies ma pole rasa', J`isTrue("Dodaj pole String rasa w klasie Pies", cls("Pies").getDeclaredField("rasa").getType() == String.class);`),
          CK(CR, 'szczekaj() używa odziedziczonego imienia', J`Object p = make("Pies"); setField(p, "imie", "Reks"); List<String> o = lines(out(() -> call(p, "szczekaj"))); isTrue("Oczekiwano: [Reks szczeka] – wypisano: " + o, o.equals(Arrays.asList("Reks szczeka")));`),
          CK(MD, 'Zwierze nie zostało zmienione (nie ma szczekaj)', J`isFalse("Metoda szczekaj ma być w klasie Pies, nie w Zwierze", hasMethod("Zwierze", "szczekaj"));`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Kot</code> dziedziczy po <code>Zwierze</code> (pole <code>imie</code>). Dodaj do <code>Kot</code> metodę <code>void miaucz()</code>, która wypisuje <code>imie</code> + <code>" miauczy"</code> (np. <code>Filemon miauczy</code>) oraz pole <code>int liczbaZyc</code>.</p>',
        files: [FL('Zwierze.java', 'public class Zwierze {\n    String imie;\n}\n'), FL('Kot.java', 'public class Kot extends Zwierze {\n}\n')],
        hints: ['<code>int liczbaZyc;</code>', '<code>public void miaucz() { System.out.println(imie + " miauczy"); }</code>'],
        solution: [FL('Zwierze.java', 'public class Zwierze {\n    String imie;\n}\n'), FL('Kot.java', 'public class Kot extends Zwierze {\n    int liczbaZyc;\n\n    public void miaucz() {\n        System.out.println(imie + " miauczy");\n    }\n}\n')],
        checks: [
          CK(CR, 'Kot ma pole liczbaZyc typu int', J`isTrue("Dodaj pole int liczbaZyc w klasie Kot", cls("Kot").getDeclaredField("liczbaZyc").getType() == int.class);`),
          CK(CR, 'miaucz() wypisuje „Filemon miauczy”', J`Object k = make("Kot"); setField(k, "imie", "Filemon"); List<String> o = lines(out(() -> call(k, "miaucz"))); isTrue("Oczekiwano: [Filemon miauczy] – wypisano: " + o, o.equals(Arrays.asList("Filemon miauczy")));`),
        ],
      },
      quiz: [
        Q('Czy klasa pochodna może mieć własne pola i metody, których nie ma nadklasa?', ['tak', 'nie', 'tylko metody', 'tylko pola'], 0, 'Dziedziczenie rozszerza klasę.'),
        Q('Czy obiekt typu <code>Zwierze</code> ma metodę <code>szczekaj()</code> zdefiniowaną w <code>Pies</code>?', ['nie', 'tak', 'tak, jeśli jest public', 'tak, po rzutowaniu'], 0, 'Nadklasa nie zna dodatków podklas.'),
        Q('Które elementy ma obiekt <code>Pies</code>, gdy <code>Zwierze</code> ma <code>imie</code>, a <code>Pies</code> ma <code>rasa</code>?', ['imie', 'rasa', 'żadnego z nich', 'tylko rasa'], [0, 1], 'Odziedziczone plus własne.'),
      ],
    },

    {
      id: 'dz-konstruktory', title: 'Konstruktor klasy pochodnej i super(...)', blurb: 'najpierw buduje się nadklasa', minutes: 6,
      content: [
        ANA('🏗️', 'Dom buduje się od <b>fundamentów</b>. Obiekt <code>Pies</code> też: najpierw musi powstać jego „część zwierzęca”. Konstruktory <b>nie są dziedziczone</b>, więc konstruktor Psa musi jawnie zawołać konstruktor Zwierzęcia przez <code>super(...)</code> i przekazać mu dane. <code>super(...)</code> musi być <b>pierwszą linijką</b>.'),
        VIZ('flow', { title: 'new Pies("Reks")', steps: [{ t: 'Pies(String imie)', s: 'zaczyna się konstruktor Psa', c: 'accent' }, { t: 'super(imie)', s: 'woła konstruktor Zwierze', c: 'warn' }, { t: 'Zwierze ustawia imie', s: 'fundament gotowy', c: 'ok' }, { t: 'reszta konstruktora Psa', s: 'dopiero teraz' }] }),
        CODE(J`class Zwierze {
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
        Pies p = new Pies("Reks");
        System.out.println(p.imie);
    }
}
`, 'Reks'),
        NOTE('warn', 'Gdy nadklasa ma konstruktor z parametrami, a w klasie pochodnej nie ma <code>super(...)</code>, kompilator zgłasza błąd („constructor Zwierze in class Zwierze cannot be applied…”). Java próbuje bowiem wywołać pusty konstruktor, którego nie ma.'),
      ],
      guide: {
        files: [FL('Zwierze.java', 'public class Zwierze {\n    String imie;\n\n    public Zwierze(String imie) {\n        this.imie = imie;\n    }\n}\n'), FL('Pies.java', 'public class Pies extends Zwierze {\n}\n')],
        steps: [
          { say: '<p><code>Pies</code> nie skompiluje się, bo <code>Zwierze</code> wymaga imienia. Dopisz w <code>Pies</code> konstruktor przyjmujący imię.</p>', type: '    public Pies(String imie) {', expect: J`public\s+Pies\s*\(\s*String\s+imie\s*\)\s*\{` },
          { say: '<p>Przekaż imię do konstruktora nadklasy słowem <code>super</code>. Musi to być <b>pierwsza instrukcja</b>. Zamknij konstruktor klamrą.</p>', type: '        super(imie);\n    }', expect: J`Pies\s*\(\s*String\s+imie\s*\)\s*\{\s*super\s*\(\s*imie\s*\)\s*;\s*\}` },
        ],
        solution: [FL('Zwierze.java', 'public class Zwierze {\n    String imie;\n\n    public Zwierze(String imie) {\n        this.imie = imie;\n    }\n}\n'), FL('Pies.java', 'public class Pies extends Zwierze {\n    public Pies(String imie) {\n        super(imie);\n    }\n}\n')],
        checks: [
          CK(CR, 'Pies ma konstruktor Pies(String)', J`ctor("Pies", String.class);`),
          CK(CR, 'Konstruktor ustawia imię przez nadklasę', J`Object p = make("Pies", "Reks"); eq("Reks", field(p, "imie"));`),
          CK(MN, 'Użyto super(...)', J`isTrue("Wywołaj konstruktor nadklasy przez super(imie)", srcHas("Pies", "super\\s*\\(\\s*imie\\s*\\)"));`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Pojazd</code> ma konstruktor <code>Pojazd(String marka)</code>. Napisz klasę <code>Auto</code> dziedziczącą po <code>Pojazd</code> z konstruktorem <code>Auto(String marka)</code>, który woła <code>super(marka)</code>.</p>',
        files: [FL('Pojazd.java', 'public class Pojazd {\n    String marka;\n\n    public Pojazd(String marka) {\n        this.marka = marka;\n    }\n}\n'), FL('Auto.java', 'public class Auto extends Pojazd {\n}\n')],
        hints: ['<code>public Auto(String marka) { super(marka); }</code>'],
        solution: [FL('Pojazd.java', 'public class Pojazd {\n    String marka;\n\n    public Pojazd(String marka) {\n        this.marka = marka;\n    }\n}\n'), FL('Auto.java', 'public class Auto extends Pojazd {\n    public Auto(String marka) {\n        super(marka);\n    }\n}\n')],
        checks: [
          CK(CR, 'Auto(String) ustawia markę', J`eq("Fiat", field(make("Auto", "Fiat"), "marka"));`),
          CK(MN, 'Użyto super(marka)', J`isTrue("Użyj super(marka)", srcHas("Auto", "super\\s*\\(\\s*marka\\s*\\)"));`),
        ],
      },
      quiz: [
        Q('Co robi <code>super(imie)</code> w konstruktorze klasy pochodnej?', ['wywołuje konstruktor nadklasy', 'wywołuje inny konstruktor tej samej klasy', 'tworzy nowy obiekt nadklasy', 'usuwa obiekt'], 0, '<code>this(...)</code> to inny konstruktor tej samej klasy.'),
        Q('Gdzie musi stać <code>super(...)</code>?', ['jako pierwsza instrukcja konstruktora', 'na końcu konstruktora', 'w main', 'gdziekolwiek'], 0, 'Najpierw budujemy „część” nadklasy.'),
        Q('Dlaczego klasa pochodna nie skompiluje się bez <code>super(imie)</code>, gdy nadklasa ma tylko konstruktor <code>Zwierze(String)</code>?', ['Java próbuje wywołać pusty konstruktor nadklasy, którego nie ma', 'bo super jest wymagane zawsze', 'bo pole imie jest private', 'bo klasa jest abstrakcyjna'], 0, 'Domyślnie wywoływane jest <code>super()</code> bez argumentów.'),
        OUTQ('Co wypisze program?', ['Reks', 'null', 'Pies', 'błąd'], 0, 'Imię trafiło do pola przez konstruktor nadklasy.', 'class Zwierze {\n    String imie;\n\n    public Zwierze(String imie) {\n        this.imie = imie;\n    }\n}\n\nclass Pies extends Zwierze {\n    public Pies(String imie) {\n        super(imie);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(new Pies("Reks").imie);\n    }\n}\n'),
      ],
    },

    {
      id: 'dz-super-pola', title: 'super(...) plus własne pola', blurb: 'część do nadklasy, resztę ustawiasz sam', minutes: 5,
      content: [
        ANA('📦➕', 'Zamówienie: imię idzie do „fundamentów” (<code>super</code>), a <b>dodatkowe rzeczy</b> psa (rasa) ustawiasz samodzielnie, już po <code>super(...)</code>. Konstruktor klasy pochodnej przyjmuje <b>wszystkie</b> potrzebne dane: i dla nadklasy, i własne.'),
        CODE(J`class Zwierze {
    String imie;

    public Zwierze(String imie) {
        this.imie = imie;
    }
}

class Pies extends Zwierze {
    String rasa;

    public Pies(String imie, String rasa) {
        super(imie);
        this.rasa = rasa;
    }
}

public class Main {
    public static void main(String[] args) {
        Pies p = new Pies("Reks", "owczarek");
        System.out.println(p.imie + " " + p.rasa);
    }
}
`, 'Reks owczarek'),
      ],
      guide: {
        files: [FL('Zwierze.java', 'public class Zwierze {\n    String imie;\n\n    public Zwierze(String imie) {\n        this.imie = imie;\n    }\n}\n'), FL('Pies.java', 'public class Pies extends Zwierze {\n    String rasa;\n}\n')],
        steps: [
          { say: '<p>Konstruktor Psa ma przyjąć <b>dwie</b> rzeczy: imię (dla nadklasy) i rasę (własne pole).</p>', type: '    public Pies(String imie, String rasa) {', expect: J`public\s+Pies\s*\(\s*String\s+imie\s*,\s*String\s+rasa\s*\)\s*\{` },
          { say: '<p>Imię przekaż do nadklasy – jako pierwszą instrukcję.</p>', type: '        super(imie);', expect: J`\{\s*super\s*\(\s*imie\s*\)\s*;` },
          { say: '<p>Własne pole ustaw sam i zamknij konstruktor.</p>', type: '        this.rasa = rasa;\n    }', expect: J`super\s*\(\s*imie\s*\)\s*;\s*this\.rasa\s*=\s*rasa\s*;\s*\}` },
        ],
        solution: [FL('Zwierze.java', 'public class Zwierze {\n    String imie;\n\n    public Zwierze(String imie) {\n        this.imie = imie;\n    }\n}\n'), FL('Pies.java', 'public class Pies extends Zwierze {\n    String rasa;\n\n    public Pies(String imie, String rasa) {\n        super(imie);\n        this.rasa = rasa;\n    }\n}\n')],
        checks: [
          CK(CR, 'Konstruktor ustawia imię i rasę', J`Object p = make("Pies", "Reks", "owczarek"); eq("Reks", field(p, "imie")); eq("owczarek", field(p, "rasa"));`),
          CK(MN, 'Użyto super(imie)', J`isTrue("Użyj super(imie)", srcHas("Pies", "super\\s*\\(\\s*imie\\s*\\)"));`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Osoba</code> ma konstruktor <code>(String imie)</code>. Napisz <code>Student extends Osoba</code> z polem <code>String indeks</code> i konstruktorem <code>Student(String imie, String indeks)</code>.</p>',
        files: [FL('Osoba.java', 'public class Osoba {\n    String imie;\n\n    public Osoba(String imie) {\n        this.imie = imie;\n    }\n}\n'), FL('Student.java', '')],
        hints: ['<code>public class Student extends Osoba { ... }</code>', 'W konstruktorze: <code>super(imie); this.indeks = indeks;</code>'],
        solution: [FL('Osoba.java', 'public class Osoba {\n    String imie;\n\n    public Osoba(String imie) {\n        this.imie = imie;\n    }\n}\n'), FL('Student.java', 'public class Student extends Osoba {\n    String indeks;\n\n    public Student(String imie, String indeks) {\n        super(imie);\n        this.indeks = indeks;\n    }\n}\n')],
        checks: [
          CK(CR, 'Student dziedziczy po Osoba', J`isTrue("Student ma dziedziczyć po Osoba", isSubclass("Student", "Osoba"));`),
          CK(CR, 'Konstruktor ustawia imię i indeks', J`Object s = make("Student", "Ola", "S1"); eq("Ola", field(s, "imie")); eq("S1", field(s, "indeks"));`),
        ],
      },
      quiz: [
        Q('Jak ustawić własne pole klasy pochodnej w konstruktorze?', ['po wywołaniu super(...) przypisać je przez this', 'przez super.pole', 'nie da się', 'przed super(...)'], 0, 'Najpierw super(...), potem własne przypisania.'),
        OUTQ('Co wypisze program?', ['Ola S1', 'null null', 'Ola null', 'błąd'], 0, 'Konstruktor ustawił oba pola.', 'class Osoba {\n    String imie;\n\n    public Osoba(String imie) {\n        this.imie = imie;\n    }\n}\n\nclass Student extends Osoba {\n    String indeks;\n\n    public Student(String imie, String indeks) {\n        super(imie);\n        this.indeks = indeks;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Student s = new Student("Ola", "S1");\n        System.out.println(s.imie + " " + s.indeks);\n    }\n}\n'),
        Q('Ile argumentów powinien przyjmować konstruktor Psa, gdy Zwierze potrzebuje imienia, a Pies dodatkowo rasy?', ['2: imię i rasę', '1: tylko imię', '0', 'zawsze tyle co nadklasa'], 0, 'Wszystko, co potrzebne do zbudowania obiektu.'),
      ],
    },

    {
      id: 'dz-dostep', title: 'Dostęp do pól nadklasy: private i protected', blurb: 'czego dziecko nie widzi', minutes: 5,
      content: [
        ANA('🏠', 'Dziecko dziedziczy dom, ale <b>nie ma kluczy do prywatnego sejfu rodziców</b> (<code>private</code>). Może za to wejść do pokoju rodzinnego (<code>protected</code>) albo poprosić rodziców o pomoc przez <b>getter</b>. Pole <code>private</code> istnieje w obiekcie, ale klasa pochodna <b>nie widzi go wprost</b>.'),
        TERMS([['<code>private</code>', 'widoczne tylko w tej klasie, <b>klasa pochodna nie ma dostępu</b>'], ['<code>protected</code>', 'widoczne w klasie, w klasach pochodnych i w tym samym pakiecie'], ['getter nadklasy', 'zawsze możesz odczytać prywatne pole przez publiczny getter']]),
        CODE(J`class Zwierze {
    protected String imie;

    public Zwierze(String imie) {
        this.imie = imie;
    }
}

class Pies extends Zwierze {
    public Pies(String imie) {
        super(imie);
    }

    public void przedstaw() {
        System.out.println("Jestem " + imie);
    }
}

public class Main {
    public static void main(String[] args) {
        new Pies("Reks").przedstaw();
    }
}
`, 'Jestem Reks'),
        NOTE('tip', 'W projekcie zwykle lepiej zostawić pola <code>private</code> i korzystać z getterów. <code>protected</code> jest wygodne, ale otwiera pole dla wszystkich klas pochodnych.'),
      ],
      guide: {
        files: [FL('Zwierze.java', 'public class Zwierze {\n    private String imie;\n\n    public Zwierze(String imie) {\n        this.imie = imie;\n    }\n}\n'), FL('Pies.java', 'public class Pies extends Zwierze {\n    public Pies(String imie) {\n        super(imie);\n    }\n\n    public void przedstaw() {\n        System.out.println("Jestem " + imie);\n    }\n}\n')],
        steps: [
          { say: '<p><code>Pies</code> nie kompiluje się: pole <code>imie</code> jest <code>private</code> w <code>Zwierze</code>. Zmień dostęp w klasie <code>Zwierze</code> na <code>protected</code> (widoczne dla klas pochodnych).</p>', type: '    protected String imie;', expect: J`protected\s+String\s+imie\s*;` },
        ],
        solution: [FL('Zwierze.java', 'public class Zwierze {\n    protected String imie;\n\n    public Zwierze(String imie) {\n        this.imie = imie;\n    }\n}\n'), FL('Pies.java', 'public class Pies extends Zwierze {\n    public Pies(String imie) {\n        super(imie);\n    }\n\n    public void przedstaw() {\n        System.out.println("Jestem " + imie);\n    }\n}\n')],
        checks: [
          CK(CR, 'Pies.przedstaw() wypisuje „Jestem Reks”', J`Object p = make("Pies", "Reks"); List<String> o = lines(out(() -> call(p, "przedstaw"))); isTrue("Oczekiwano: [Jestem Reks] – wypisano: " + o, o.equals(Arrays.asList("Jestem Reks")));`),
          CK(MD, 'Pole imie jest protected', J`isTrue("imie ma być protected", Modifier.isProtected(fieldMods("Zwierze", "imie")));`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Osoba</code> ma <b>prywatne</b> pole <code>nazwisko</code> i getter <code>getNazwisko()</code>. W klasie <code>Student</code> dopisz metodę <code>void przedstaw()</code>, która wypisuje <code>Student: </code> i nazwisko (np. <code>Student: Kowalski</code>). <b>Nie zmieniaj</b> klasy <code>Osoba</code>, tylko użyj gettera.</p>',
        files: [FL('Osoba.java', 'public class Osoba {\n    private String nazwisko;\n\n    public Osoba(String nazwisko) {\n        this.nazwisko = nazwisko;\n    }\n\n    public String getNazwisko() {\n        return nazwisko;\n    }\n}\n'), FL('Student.java', 'public class Student extends Osoba {\n    public Student(String nazwisko) {\n        super(nazwisko);\n    }\n}\n')],
        hints: ['<code>System.out.println("Student: " + getNazwisko());</code>'],
        solution: [FL('Osoba.java', 'public class Osoba {\n    private String nazwisko;\n\n    public Osoba(String nazwisko) {\n        this.nazwisko = nazwisko;\n    }\n\n    public String getNazwisko() {\n        return nazwisko;\n    }\n}\n'), FL('Student.java', 'public class Student extends Osoba {\n    public Student(String nazwisko) {\n        super(nazwisko);\n    }\n\n    public void przedstaw() {\n        System.out.println("Student: " + getNazwisko());\n    }\n}\n')],
        checks: [
          CK(CR, 'przedstaw() wypisuje „Student: Kowalski”', J`Object s = make("Student", "Kowalski"); List<String> o = lines(out(() -> call(s, "przedstaw"))); isTrue("Oczekiwano: [Student: Kowalski] – wypisano: " + o, o.equals(Arrays.asList("Student: Kowalski")));`),
          CK(MD, 'Pole nazwisko nadal jest private', J`isTrue("Nie zmieniaj dostępu: nazwisko ma być private", isPrivate("Osoba", "nazwisko"));`),
        ],
      },
      quiz: [
        Q('Czy klasa pochodna może bezpośrednio użyć pola <code>private</code> nadklasy?', ['nie', 'tak', 'tak, jeśli ma tę samą nazwę', 'tak, przez this'], 0, 'Dostęp ma tylko klasa, w której pole zadeklarowano.'),
        Q('Jak odczytać prywatne pole nadklasy w klasie pochodnej?', ['przez publiczny getter nadklasy', 'przez słowo super.pole', 'nie da się nigdy', 'przez słowo static'], 0, 'Albo zrobić pole <code>protected</code>.'),
        Q('Który modyfikator udostępnia pole klasom pochodnym?', ['protected', 'private', 'final', 'static'], 0, '<code>protected</code> = klasa, pakiet i klasy pochodne.'),
      ],
    },

    {
      id: 'dz-override', title: 'Nadpisywanie metod (@Override)', blurb: 'klasa pochodna po swojemu', minutes: 5,
      content: [
        ANA('🎭', 'Każde zwierzę „robi dźwięk”, ale pies szczeka, a kot miauczy. W nadklasie jest ogólna metoda <code>dajGlos()</code>, a klasa pochodna <b>pisze własną wersję o tej samej nazwie i parametrach</b>. To <b>nadpisanie</b> (override). Dla obiektu Psa wykona się wersja Psa.'),
        VIZ('compare', { cols: [
          { icon: '🐾', title: 'Zwierze.dajGlos()', c: 'accent', items: ['wypisuje „...”'] },
          { icon: '🐕', title: 'Pies.dajGlos()', c: 'ok', sub: '@Override', items: ['wypisuje „Hau!”', 'zastępuje wersję z nadklasy'] }] }),
        CODE(J`class Zwierze {
    public void dajGlos() {
        System.out.println("...");
    }
}

class Pies extends Zwierze {
    @Override
    public void dajGlos() {
        System.out.println("Hau!");
    }
}

public class Main {
    public static void main(String[] args) {
        new Zwierze().dajGlos();
        new Pies().dajGlos();
    }
}
`, '...\nHau!'),
        NOTE('info', '<code>@Override</code> to „zabezpieczenie”: jeśli zrobisz literówkę w nazwie metody, kompilator zgłosi błąd, zamiast po cichu stworzyć nową metodę. Nadpisanie wymaga <b>identycznej nazwy i parametrów</b>.'),
      ],
      guide: {
        files: [FL('Zwierze.java', 'public class Zwierze {\n    public void dajGlos() {\n        System.out.println("...");\n    }\n}\n'), FL('Pies.java', 'public class Pies extends Zwierze {\n}\n')],
        steps: [
          { say: '<p>W klasie <code>Pies</code> dopisz adnotację <code>@Override</code> i metodę o <b>tej samej nazwie i parametrach</b> co w nadklasie.</p>', type: '    @Override\n    public void dajGlos() {', expect: J`@Override\s+public\s+void\s+dajGlos\s*\(\s*\)\s*\{` },
          { say: '<p>Wypisz dźwięk psa i zamknij metodę.</p>', type: '        System.out.println("Hau!");\n    }', expect: J`dajGlos\s*\(\s*\)\s*\{\s*System\.out\.println\s*\(\s*"Hau!"\s*\)\s*;\s*\}` },
        ],
        solution: [FL('Zwierze.java', 'public class Zwierze {\n    public void dajGlos() {\n        System.out.println("...");\n    }\n}\n'), FL('Pies.java', 'public class Pies extends Zwierze {\n    @Override\n    public void dajGlos() {\n        System.out.println("Hau!");\n    }\n}\n')],
        checks: [
          CK(CR, 'Pies.dajGlos() wypisuje „Hau!”', J`List<String> o = lines(out(() -> call(make("Pies"), "dajGlos"))); isTrue("Oczekiwano: [Hau!] – wypisano: " + o, o.equals(Arrays.asList("Hau!")));`),
          CK(CR, 'Zwierze.dajGlos() nadal wypisuje „...”', J`List<String> o = lines(out(() -> call(make("Zwierze"), "dajGlos"))); isTrue("Oczekiwano: [...] – wypisano: " + o, o.equals(Arrays.asList("...")));`),
          CK(MN, 'Użyto @Override', J`isTrue("Dodaj @Override nad dajGlos()", srcHas("Pies", "@Override\\s+public\\s+void\\s+dajGlos"));`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Kot</code> dziedziczy po <code>Zwierze</code>. Nadpisz w niej <code>dajGlos()</code> tak, żeby wypisywała <code>Miau!</code>.</p>',
        files: [FL('Zwierze.java', 'public class Zwierze {\n    public void dajGlos() {\n        System.out.println("...");\n    }\n}\n'), FL('Kot.java', 'public class Kot extends Zwierze {\n}\n')],
        hints: ['<code>@Override public void dajGlos() { System.out.println("Miau!"); }</code>'],
        solution: [FL('Zwierze.java', 'public class Zwierze {\n    public void dajGlos() {\n        System.out.println("...");\n    }\n}\n'), FL('Kot.java', 'public class Kot extends Zwierze {\n    @Override\n    public void dajGlos() {\n        System.out.println("Miau!");\n    }\n}\n')],
        checks: [
          CK(CR, 'Kot.dajGlos() wypisuje „Miau!”', J`List<String> o = lines(out(() -> call(make("Kot"), "dajGlos"))); isTrue("Oczekiwano: [Miau!] – wypisano: " + o, o.equals(Arrays.asList("Miau!")));`),
          CK(MN, 'Użyto @Override', J`isTrue("Dodaj @Override nad dajGlos()", srcHas("Kot", "@Override\\s+public\\s+void\\s+dajGlos"));`),
        ],
      },
      quiz: [
        Q('Czym jest nadpisanie metody?', ['napisaniem w klasie pochodnej metody o tej samej nazwie i parametrach co w nadklasie', 'napisaniem dwóch metod o różnych parametrach w jednej klasie', 'usunięciem metody z nadklasy', 'wywołaniem metody statycznej'], 0, 'Dwie metody w jednej klasie o różnych parametrach to przeciążanie.'),
        Q('Do czego służy <code>@Override</code>?', ['kompilator sprawdza, czy naprawdę nadpisujemy istniejącą metodę', 'przyspiesza program', 'ukrywa metodę', 'tworzy nową klasę'], 0, 'Chroni przed literówkami w nazwie.'),
        OUTQ('Co wypisze program?', ['Miau!', '...', 'Miau! ...', 'błąd'], 0, 'Dla obiektu Kota wykonuje się wersja z klasy Kot.', 'class Zwierze {\n    void dajGlos() {\n        System.out.println("...");\n    }\n}\n\nclass Kot extends Zwierze {\n    @Override\n    void dajGlos() {\n        System.out.println("Miau!");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        new Kot().dajGlos();\n    }\n}\n'),
      ],
    },

    {
      id: 'dz-super-wywolanie', title: 'super.metoda(): wersja z nadklasy', blurb: 'rozszerz, zamiast zastępować', minutes: 4,
      content: [
        ANA('➕', 'Czasem nie chcesz <b>zastąpić</b> zachowania rodzica, tylko go <b>uzupełnić</b>: „zrób to, co robi każde zwierzę, a potem jeszcze dodatkowo szczekaj”. Wersję z nadklasy wołasz przez <code>super.nazwaMetody()</code>.'),
        CODE(J`class Zwierze {
    public void przedstawSie() {
        System.out.println("Jestem zwierzeciem");
    }
}

class Pies extends Zwierze {
    @Override
    public void przedstawSie() {
        super.przedstawSie();
        System.out.println("A dokladnie psem");
    }
}

public class Main {
    public static void main(String[] args) {
        new Pies().przedstawSie();
    }
}
`, 'Jestem zwierzeciem\nA dokladnie psem'),
        NOTE('tip', '<code>super(...)</code> (z nawiasem, w konstruktorze) woła <b>konstruktor</b> nadklasy, a <code>super.metoda()</code> woła <b>metodę</b> nadklasy.'),
      ],
      guide: {
        files: [FL('Zwierze.java', 'public class Zwierze {\n    public void przedstawSie() {\n        System.out.println("Jestem zwierzeciem");\n    }\n}\n'), FL('Pies.java', 'public class Pies extends Zwierze {\n    @Override\n    public void przedstawSie() {\n    }\n}\n')],
        steps: [
          { say: '<p>W nadpisanej metodzie najpierw wywołaj wersję z nadklasy.</p>', type: '        super.przedstawSie();', expect: J`przedstawSie\s*\(\s*\)\s*\{\s*super\.przedstawSie\s*\(\s*\)\s*;` },
          { say: '<p>Potem dopisz własną część.</p>', type: '        System.out.println("A dokladnie psem");', expect: J`super\.przedstawSie\s*\(\s*\)\s*;\s*System\.out\.println\s*\(\s*"A dokladnie psem"\s*\)\s*;` },
        ],
        solution: [FL('Zwierze.java', 'public class Zwierze {\n    public void przedstawSie() {\n        System.out.println("Jestem zwierzeciem");\n    }\n}\n'), FL('Pies.java', 'public class Pies extends Zwierze {\n    @Override\n    public void przedstawSie() {\n        super.przedstawSie();\n        System.out.println("A dokladnie psem");\n    }\n}\n')],
        checks: [
          CK(CR, 'Pies wypisuje dwie linie: najpierw z nadklasy', J`List<String> o = lines(out(() -> call(make("Pies"), "przedstawSie"))); isTrue("Oczekiwano: [Jestem zwierzeciem, A dokladnie psem] – wypisano: " + o, o.equals(Arrays.asList("Jestem zwierzeciem", "A dokladnie psem")));`),
          CK(MN, 'Użyto super.przedstawSie()', J`isTrue("Wywołaj super.przedstawSie()", srcHas("Pies", "super\\.przedstawSie\\s*\\(\\s*\\)"));`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Osoba</code> ma metodę <code>przedstaw()</code> (wypisuje <code>Jestem osoba</code>). W klasie <code>Student</code> nadpisz ją tak, żeby <b>najpierw wywołała wersję z Osoba</b>, a potem wypisała <code>Jestem studentem</code>.</p>',
        files: [FL('Osoba.java', 'public class Osoba {\n    public void przedstaw() {\n        System.out.println("Jestem osoba");\n    }\n}\n'), FL('Student.java', 'public class Student extends Osoba {\n}\n')],
        hints: ['<code>@Override public void przedstaw() { super.przedstaw(); System.out.println("Jestem studentem"); }</code>'],
        solution: [FL('Osoba.java', 'public class Osoba {\n    public void przedstaw() {\n        System.out.println("Jestem osoba");\n    }\n}\n'), FL('Student.java', 'public class Student extends Osoba {\n    @Override\n    public void przedstaw() {\n        super.przedstaw();\n        System.out.println("Jestem studentem");\n    }\n}\n')],
        checks: [
          CK(CR, 'Student wypisuje dwie linie', J`List<String> o = lines(out(() -> call(make("Student"), "przedstaw"))); isTrue("Oczekiwano: [Jestem osoba, Jestem studentem] – wypisano: " + o, o.equals(Arrays.asList("Jestem osoba", "Jestem studentem")));`),
          CK(MN, 'Użyto super.przedstaw()', J`isTrue("Wywołaj super.przedstaw()", srcHas("Student", "super\\.przedstaw\\s*\\(\\s*\\)"));`),
        ],
      },
      quiz: [
        Q('Co robi <code>super.przedstawSie()</code> w nadpisanej metodzie?', ['wywołuje wersję metody z nadklasy', 'wywołuje samą siebie w nieskończoność', 'tworzy obiekt nadklasy', 'usuwa metodę'], 0, 'Dzięki temu rozszerzasz zachowanie, a nie zastępujesz go w całości.'),
        OUTQ('Co wypisze program?', ['A<br>B', 'B', 'A', 'B<br>A'], 0, 'Najpierw wywołana jest wersja z nadklasy, potem własny kod.', 'class X {\n    void f() {\n        System.out.println("A");\n    }\n}\n\nclass Y extends X {\n    @Override\n    void f() {\n        super.f();\n        System.out.println("B");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        new Y().f();\n    }\n}\n'),
        Q('Czym różni się <code>super(...)</code> od <code>super.metoda()</code>?', ['pierwsze woła konstruktor nadklasy, drugie metodę', 'nie ma różnicy', 'pierwsze woła metodę, drugie konstruktor', 'oba wołają konstruktor'], 0, '<code>super(...)</code> jest tylko w konstruktorze, na jego początku.'),
      ],
    },

    {
      id: 'dz-tostring', title: 'toString() w dziedziczeniu', blurb: 'super.toString() + własne pola', minutes: 5,
      content: [
        ANA('🏷️', 'Każdy obiekt w Javie ma już metodę <code>toString()</code> (dziedziczy ją po <code>Object</code>, „matce wszystkich klas”). Gdy ją <b>nadpiszesz</b> w klasie pochodnej, zwykle chcesz zachować opis z nadklasy i <b>dołożyć własne pola</b>: <code>super.toString() + ", rasa " + rasa</code>.'),
        CODE(J`class Zwierze {
    String imie;

    public Zwierze(String imie) {
        this.imie = imie;
    }

    @Override
    public String toString() {
        return "Zwierze " + imie;
    }
}

class Pies extends Zwierze {
    String rasa;

    public Pies(String imie, String rasa) {
        super(imie);
        this.rasa = rasa;
    }

    @Override
    public String toString() {
        return super.toString() + ", rasa " + rasa;
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Pies("Reks", "owczarek"));
    }
}
`, 'Zwierze Reks, rasa owczarek'),
      ],
      guide: {
        files: [FL('Zwierze.java', 'public class Zwierze {\n    String imie;\n\n    public Zwierze(String imie) {\n        this.imie = imie;\n    }\n\n    @Override\n    public String toString() {\n        return "Zwierze " + imie;\n    }\n}\n'), FL('Pies.java', 'public class Pies extends Zwierze {\n    String rasa;\n\n    public Pies(String imie, String rasa) {\n        super(imie);\n        this.rasa = rasa;\n    }\n}\n')],
        steps: [
          { say: '<p>Nadpisz <code>toString()</code> w klasie <code>Pies</code>.</p>', type: '    @Override\n    public String toString() {', expect: J`@Override\s+public\s+String\s+toString\s*\(\s*\)\s*\{` },
          { say: '<p>Zwróć opis z nadklasy (<code>super.toString()</code>) i dołóż rasę. Zamknij metodę.</p>', type: '        return super.toString() + ", rasa " + rasa;\n    }', expect: J`return\s+super\.toString\s*\(\s*\)\s*\+\s*", rasa "\s*\+\s*rasa\s*;\s*\}` },
        ],
        solution: [FL('Zwierze.java', 'public class Zwierze {\n    String imie;\n\n    public Zwierze(String imie) {\n        this.imie = imie;\n    }\n\n    @Override\n    public String toString() {\n        return "Zwierze " + imie;\n    }\n}\n'), FL('Pies.java', 'public class Pies extends Zwierze {\n    String rasa;\n\n    public Pies(String imie, String rasa) {\n        super(imie);\n        this.rasa = rasa;\n    }\n\n    @Override\n    public String toString() {\n        return super.toString() + ", rasa " + rasa;\n    }\n}\n')],
        checks: [
          CK(CR, 'toString() psa: „Zwierze Reks, rasa owczarek”', J`eq("Zwierze Reks, rasa owczarek", String.valueOf(make("Pies", "Reks", "owczarek")));`),
          CK(MN, 'Użyto super.toString()', J`isTrue("Użyj super.toString()", srcHas("Pies", "super\\.toString\\s*\\(\\s*\\)"));`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Osoba</code> ma <code>toString()</code> zwracające <code>Osoba: imie</code>. Napisz <code>Student extends Osoba</code> (pole <code>indeks</code>, konstruktor <code>(imie, indeks)</code>) i nadpisz <code>toString()</code> tak, by zwracał <code>Osoba: Ola, indeks S1</code> (korzystając z <code>super.toString()</code>).</p>',
        files: [FL('Osoba.java', 'public class Osoba {\n    String imie;\n\n    public Osoba(String imie) {\n        this.imie = imie;\n    }\n\n    @Override\n    public String toString() {\n        return "Osoba: " + imie;\n    }\n}\n'), FL('Student.java', '')],
        hints: ['<code>public class Student extends Osoba { String indeks; ... }</code>', '<code>return super.toString() + ", indeks " + indeks;</code>'],
        solution: [FL('Osoba.java', 'public class Osoba {\n    String imie;\n\n    public Osoba(String imie) {\n        this.imie = imie;\n    }\n\n    @Override\n    public String toString() {\n        return "Osoba: " + imie;\n    }\n}\n'), FL('Student.java', 'public class Student extends Osoba {\n    String indeks;\n\n    public Student(String imie, String indeks) {\n        super(imie);\n        this.indeks = indeks;\n    }\n\n    @Override\n    public String toString() {\n        return super.toString() + ", indeks " + indeks;\n    }\n}\n')],
        checks: [
          CK(CR, 'Student dziedziczy po Osoba', J`isTrue("Student ma dziedziczyć po Osoba", isSubclass("Student", "Osoba"));`),
          CK(CR, 'toString() studenta: „Osoba: Ola, indeks S1”', J`eq("Osoba: Ola, indeks S1", String.valueOf(make("Student", "Ola", "S1")));`),
          CK(MN, 'Użyto super.toString()', J`isTrue("Użyj super.toString()", srcHas("Student", "super\\.toString\\s*\\(\\s*\\)"));`),
        ],
      },
      quiz: [
        Q('Po której klasie dziedziczy każda klasa w Javie, jeśli nie napiszesz <code>extends</code>?', ['Object', 'String', 'Main', 'System'], 0, '<code>Object</code> jest korzeniem drzewa dziedziczenia, stąd każdy obiekt ma <code>toString()</code>.'),
        Q('Po co w <code>toString()</code> klasy pochodnej wywołujemy <code>super.toString()</code>?', ['żeby użyć opisu z nadklasy i dołożyć własne pola', 'żeby metoda była szybsza', 'żeby metoda nie była nadpisana', 'bo to wymóg kompilatora'], 0, 'Unikamy powtarzania opisu pól nadklasy.'),
        OUTQ('Co wypisze program?', ['Zwierze Reks, rasa owczarek', 'Zwierze Reks', 'Pies', 'błąd'], 0, 'Wersja psa dokłada rasę do opisu nadklasy.', 'class Zwierze {\n    String imie = "Reks";\n\n    @Override\n    public String toString() {\n        return "Zwierze " + imie;\n    }\n}\n\nclass Pies extends Zwierze {\n    String rasa = "owczarek";\n\n    @Override\n    public String toString() {\n        return super.toString() + ", rasa " + rasa;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(new Pies());\n    }\n}\n'),
      ],
    },
  ],
  labs: [
    {
      id: 'lab3-z1', title: 'Zadanie 1: Człowiek, Student, Wykładowca', source: 'Zadania 3.pdf – zadanie 1', concepts: ['dz-extends', 'dz-konstruktory', 'dz-override'],
      statement: J`<ol>
<li>Utwórz klasę <b>Czlowiek</b> z publicznymi polami <code>rokUrodzenia</code> (int), <code>imie</code>, <code>nazwisko</code>, <code>pesel</code> (String). Konstruktor przypisuje wszystkie pola – <b>kolejność parametrów: rokUrodzenia, imie, nazwisko, pesel</b>. Nadpisz <code>toString()</code>. Utwórz w <code>main</code> dwie instancje: <code>c1</code> i <code>c2</code>.</li>
<li>Klasa <b>Student</b> dziedziczy po <code>Czlowiek</code>, ma publiczne pola <code>numerIndeksu</code> (String), <code>rokRozpoczeciaStudiow</code> (int), <code>rokStudiow</code> (int). Konstruktor przypisuje <b>wszystkie</b> pola (najpierw te z Czlowieka w tej samej kolejności, potem numerIndeksu, rokRozpoczeciaStudiow, rokStudiow) – użyj <code>super</code>. Instancje w <code>main</code>: <code>s1</code>, <code>s2</code>.</li>
<li>Klasa <b>Wykladowca</b> dziedziczy po <code>Czlowiek</code>; pola publiczne: <code>stanowisko</code> (enum: ASYSTENT, ADIUNKT, PROFESOR), <code>wyksztalcenie</code> (enum: MAGISTER, DOKTOR, DOKTORHAB, PROFESOR), <code>rokZatrudnienia</code> (int). Konstruktor jak wyżej (pola z Czlowieka, potem stanowisko, wyksztalcenie, rokZatrudnienia). Instancje: <code>w1</code>, <code>w2</code>.</li>
<li>Wywołaj <code>toString</code> na wszystkich instancjach.</li>
<li>Nadpisz <code>toString</code> w Student i Wykladowca: tekst z Czlowieka <b>i</b> dopisane po spacji wartości własnych pól (np. <code>1999 Adam Kowalski 99010112345 123456 2018 2</code>). Format w Czlowieku: <code>rokUrodzenia imie nazwisko pesel</code>.</li>
<li>Wywołaj <code>toString</code> na wszystkich instancjach.</li>
<li>Wyświetl imię studenta oraz rok zatrudnienia wykładowcy.</li>
<li>Stwórz <code>Czlowiek czlowiek1 = s1;</code> (upcasting, niejawny) i wyświetl numer indeksu przez <b>downcasting</b> <code>((Student) czlowiek1).numerIndeksu</code>.</li>
</ol>`,
      notes: 'W oryginale klasy nazywają się <code>Człowiek</code> i <code>Wykładowca</code>; tu użyj nazw bez polskich znaków (<code>Czlowiek</code>, <code>Wykladowca</code>), żeby uniknąć problemów z nazwami plików. Enumy zapisz jako osobne pliki, np. <code>Stanowisko.java</code> i <code>Wyksztalcenie.java</code> (nazwa dowolna – test sprawdza typ pola). Słowo <code>base</code> z treści PDF to w Javie <code>super</code>.',
      files: [
        { name: 'Czlowiek.java', code: J`public class Czlowiek {

}
` },
        { name: 'Student.java', code: J`public class Student {

}
` },
        { name: 'Wykladowca.java', code: J`public class Wykladowca {

}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {

    }
}
` }],
      hints: ['Student: <code>public class Student extends Czlowiek</code>, konstruktor zaczyna się od <code>super(rokUrodzenia, imie, nazwisko, pesel);</code>', 'toString w Student: <code>return super.toString() + " " + numerIndeksu + " " + ...;</code>', 'Enumy: <code>public enum Stanowisko { ASYSTENT, ADIUNKT, PROFESOR }</code> w osobnym pliku.', 'Downcasting: <code>Student s = (Student) czlowiek1;</code> – dopiero wtedy widzisz <code>numerIndeksu</code>.'],
      solution: [
        { name: 'Czlowiek.java', code: J`public class Czlowiek {
    public int rokUrodzenia;
    public String imie;
    public String nazwisko;
    public String pesel;

    public Czlowiek(int rokUrodzenia, String imie, String nazwisko, String pesel) {
        this.rokUrodzenia = rokUrodzenia;
        this.imie = imie;
        this.nazwisko = nazwisko;
        this.pesel = pesel;
    }

    @Override
    public String toString() {
        return rokUrodzenia + " " + imie + " " + nazwisko + " " + pesel;
    }
}
` },
        { name: 'Student.java', code: J`public class Student extends Czlowiek {
    public String numerIndeksu;
    public int rokRozpoczeciaStudiow;
    public int rokStudiow;

    public Student(int rokUrodzenia, String imie, String nazwisko, String pesel,
                   String numerIndeksu, int rokRozpoczeciaStudiow, int rokStudiow) {
        super(rokUrodzenia, imie, nazwisko, pesel);
        this.numerIndeksu = numerIndeksu;
        this.rokRozpoczeciaStudiow = rokRozpoczeciaStudiow;
        this.rokStudiow = rokStudiow;
    }

    @Override
    public String toString() {
        return super.toString() + " " + numerIndeksu + " " + rokRozpoczeciaStudiow + " " + rokStudiow;
    }
}
` },
        { name: 'Stanowisko.java', code: J`public enum Stanowisko {
    ASYSTENT, ADIUNKT, PROFESOR
}
` },
        { name: 'Wyksztalcenie.java', code: J`public enum Wyksztalcenie {
    MAGISTER, DOKTOR, DOKTORHAB, PROFESOR
}
` },
        { name: 'Wykladowca.java', code: J`public class Wykladowca extends Czlowiek {
    public Stanowisko stanowisko;
    public Wyksztalcenie wyksztalcenie;
    public int rokZatrudnienia;

    public Wykladowca(int rokUrodzenia, String imie, String nazwisko, String pesel,
                      Stanowisko stanowisko, Wyksztalcenie wyksztalcenie, int rokZatrudnienia) {
        super(rokUrodzenia, imie, nazwisko, pesel);
        this.stanowisko = stanowisko;
        this.wyksztalcenie = wyksztalcenie;
        this.rokZatrudnienia = rokZatrudnienia;
    }

    @Override
    public String toString() {
        return super.toString() + " " + stanowisko + " " + wyksztalcenie + " " + rokZatrudnienia;
    }
}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {
        Czlowiek c1 = new Czlowiek(1980, "Jan", "Nowak", "80010112345");
        Czlowiek c2 = new Czlowiek(1985, "Ewa", "Lis", "85020223456");
        Student s1 = new Student(2001, "Adam", "Kowalski", "01030334567", "123456", 2020, 2);
        Student s2 = new Student(2002, "Ola", "Zielska", "02040445678", "123457", 2021, 1);
        Wykladowca w1 = new Wykladowca(1975, "Anna", "Konopka", "75050556789", Stanowisko.ADIUNKT, Wyksztalcenie.DOKTOR, 2005);
        Wykladowca w2 = new Wykladowca(1970, "Karol", "Struniawski", "70060667890", Stanowisko.PROFESOR, Wyksztalcenie.DOKTORHAB, 1999);

        System.out.println(c1);
        System.out.println(c2);
        System.out.println(s1);
        System.out.println(s2);
        System.out.println(w1);
        System.out.println(w2);

        System.out.println(s1.imie);
        System.out.println(w1.rokZatrudnienia);

        Czlowiek czlowiek1 = s1;
        System.out.println(((Student) czlowiek1).numerIndeksu);
    }
}
` }],
      checks: [
        CK(CR, 'Czlowiek: pola publiczne i konstruktor (rokUrodzenia, imie, nazwisko, pesel)', J`Object c = make("Czlowiek", 1990, "Adam", "Kowalski", "90010112345");
eq(1990, field(c, "rokUrodzenia")); eq("Adam", field(c, "imie")); eq("Kowalski", field(c, "nazwisko")); eq("90010112345", field(c, "pesel"));
for (String n : new String[]{"rokUrodzenia", "imie", "nazwisko", "pesel"}) isTrue("Pole " + n + " ma być public", Modifier.isPublic(fieldMods("Czlowiek", n)));`),
        CK(CR, 'Czlowiek.toString() = „rok imię nazwisko pesel”', J`eq("1990 Adam Kowalski 90010112345", make("Czlowiek", 1990, "Adam", "Kowalski", "90010112345").toString());`),
        CK(CR, 'Student dziedziczy po Czlowiek i nie powtarza jego pól', J`isTrue("Student musi dziedziczyć po Czlowiek", isSubclass("Student", "Czlowiek"));
for (java.lang.reflect.Field f : cls("Student").getDeclaredFields())
    isFalse("Pole " + f.getName() + " jest już w Czlowiek – nie powtarzaj go", java.util.Arrays.asList("imie", "nazwisko", "pesel", "rokUrodzenia").contains(f.getName()));`),
        CK(CR, 'Student: konstruktor przypisuje wszystkie 7 pól (przez super)', J`Object s = make("Student", 2001, "Ola", "Nowak", "01010112345", "123456", 2020, 2);
eq("Ola", field(s, "imie")); eq(2001, field(s, "rokUrodzenia")); eq("123456", field(s, "numerIndeksu")); eq(2020, field(s, "rokRozpoczeciaStudiow")); eq(2, field(s, "rokStudiow"));`),
        CK(MD, 'Student.toString() = toString Czlowieka + własne pola', J`eq("2001 Ola Nowak 01010112345 123456 2020 2", make("Student", 2001, "Ola", "Nowak", "01010112345", "123456", 2020, 2).toString());`),
        CK(CR, 'Wykladowca dziedziczy po Czlowiek; stanowisko i wyksztalcenie są enumami', J`isTrue("Wykladowca musi dziedziczyć po Czlowiek", isSubclass("Wykladowca", "Czlowiek"));
Class<?> st = findF(cls("Wykladowca"), "stanowisko").getType();
Class<?> wy = findF(cls("Wykladowca"), "wyksztalcenie").getType();
isTrue("stanowisko ma być enumem", st.isEnum()); isTrue("wyksztalcenie ma być enumem", wy.isEnum());
List<String> a = new ArrayList<>(); for (Object o : st.getEnumConstants()) a.add(o.toString());
eq(java.util.Arrays.asList("ASYSTENT", "ADIUNKT", "PROFESOR"), a);
List<String> b = new ArrayList<>(); for (Object o : wy.getEnumConstants()) b.add(o.toString());
eq(java.util.Arrays.asList("MAGISTER", "DOKTOR", "DOKTORHAB", "PROFESOR"), b);`),
        CK(CR, 'Wykladowca: konstruktor przypisuje wszystkie pola', J`Class<?> st = findF(cls("Wykladowca"), "stanowisko").getType();
Class<?> wy = findF(cls("Wykladowca"), "wyksztalcenie").getType();
Object w = make("Wykladowca", 1975, "Anna", "Konopka", "75050556789", st.getEnumConstants()[1], wy.getEnumConstants()[1], 2005);
eq("Anna", field(w, "imie")); eq(2005, field(w, "rokZatrudnienia")); eq(st.getEnumConstants()[1], field(w, "stanowisko")); eq(wy.getEnumConstants()[1], field(w, "wyksztalcenie"));`),
        CK(MD, 'Wykladowca.toString() zaczyna się od danych Czlowieka i zawiera własne pola', J`Class<?> st = findF(cls("Wykladowca"), "stanowisko").getType();
Class<?> wy = findF(cls("Wykladowca"), "wyksztalcenie").getType();
String s = make("Wykladowca", 1975, "Anna", "Konopka", "75050556789", st.getEnumConstants()[1], wy.getEnumConstants()[1], 2005).toString();
isTrue("toString powinien zaczynać się od „1975 Anna Konopka 75050556789” – jest: " + s, s.startsWith("1975 Anna Konopka 75050556789 "));
isTrue("toString powinien zawierać ADIUNKT, DOKTOR i 2005 – jest: " + s, s.contains("ADIUNKT") && s.contains("DOKTOR") && s.contains("2005"));`),
        CK(MD, 'Main wypisuje wyniki i działa bez wyjątków', J`String o = runMain();
isTrue("Main powinien wypisać co najmniej 9 linii (6 × toString + imię + rok + numer indeksu) – jest: " + lines(o).size(), lines(o).size() >= 9);`),
        CK(MN, 'Main: instancje c1,c2,s1,s2,w1,w2 oraz upcasting i downcasting', J`for (String v : new String[]{"c1", "c2", "s1", "s2", "w1", "w2"})
    isTrue("W Main brakuje zmiennej " + v, srcHas("Main", "\\b" + v + "\\s*="));
isTrue("Brak upcastingu: Czlowiek czlowiek1 = ...", srcHas("Main", "Czlowiek\\s+czlowiek1\\s*="));
isTrue("Brak jawnego rzutowania (Student)", srcHas("Main", "\\(\\s*Student\\s*\\)"));`),
        CK(MN, 'Użyto super(...) w konstruktorach i @Override', J`isTrue("Student powinien wywołać super(...)", srcHas("Student", "super\\s*\\("));
isTrue("Wykladowca powinien wywołać super(...)", srcHas("Wykladowca", "super\\s*\\("));
isTrue("Dodaj @Override przy toString", srcHas("Czlowiek", "@Override"));`),
      ],
    },

    {
      id: 'lab3-z2', title: 'Zadanie 2: Postać, Ork, Smok', source: 'Zadania 3.pdf – zadanie 2', concepts: ['dz-dostep', 'dz-override'],
      statement: J`<ol>
<li>Klasa <b>Postac</b> z <b>prywatnymi</b> polami <code>nazwa</code> (String), <code>punktyZycia</code>, <code>punktyMany</code>, <code>punktyAtaku</code> (int). Konstruktor w kolejności (nazwa, punktyZycia, punktyMany, punktyAtaku). <code>toString()</code> zwraca wartości pól oddzielone spacją, np. <code>Gruk 100 20 15</code>.</li>
<li>Publiczna metoda <code>przywitajSie()</code> wypisuje <code>Jestem {nazwa}</code>.</li>
<li>W <code>main</code>: utwórz instancję Postac, wywołaj <code>przywitajSie()</code> i <code>toString()</code>.</li>
<li>Klasa <b>Ork</b> dziedziczy po Postac, ma pole <code>typ</code> (enum <code>TypOrka</code>: BOJOWY, KUCHARZ, GARNCARZ). Konstruktor: (nazwa, punktyZycia, punktyMany, punktyAtaku, typ).</li>
<li>Ork nadpisuje <code>przywitajSie()</code> → <code>Grr, jestem orkiem o imieniu {nazwa}</code>. (Pole <code>nazwa</code> jest prywatne w Postac – dodaj w Postac publiczną metodę <code>getNazwa()</code>.)</li>
<li>Ork nadpisuje <code>toString()</code>: wartość z Postac (przez <code>super.toString()</code>) + spacja + typ, np. <code>Gruk 100 20 15 BOJOWY</code>.</li>
<li>W <code>main</code>: utwórz Orka, wywołaj <code>przywitajSie()</code> i <code>toString()</code>.</li>
<li>Klasa <b>Smok</b> dziedziczy po Postac, ma prywatne pole <code>String kolor</code>. Konstruktor: (nazwa, punktyZycia, punktyMany, punktyAtaku, kolor).</li>
<li>Smok nadpisuje <code>toString()</code>: super.toString() + spacja + kolor, np. <code>Wawel 500 80 70 zielony</code>.</li>
<li>W <code>main</code>: utwórz Smoka i sprawdź, czy może wywołać <code>przywitajSie()</code> (tak – dziedziczy ją z Postac).</li>
</ol>`,
      notes: 'Użyj nazw bez polskich znaków: <code>Postac</code>, <code>przywitajSie</code>. Pole prywatne nadklasy jest niewidoczne w podklasie – to dlatego potrzebny jest <code>getNazwa()</code> (albo pole <code>protected</code>).',
      files: [
        { name: 'Postac.java', code: J`public class Postac {

}
` },
        { name: 'Ork.java', code: J`public class Ork {

}
` },
        { name: 'Smok.java', code: J`public class Smok {

}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {

    }
}
` }],
      hints: ['Enum <code>TypOrka</code> zapisz w osobnym pliku <code>TypOrka.java</code>.', 'W Ork: <code>System.out.println("Grr, jestem orkiem o imieniu " + getNazwa());</code>', '<code>Smok</code> nie pisze własnej <code>przywitajSie</code> – po prostu ją dziedziczy.'],
      solution: [
        { name: 'Postac.java', code: J`public class Postac {
    private String nazwa;
    private int punktyZycia;
    private int punktyMany;
    private int punktyAtaku;

    public Postac(String nazwa, int punktyZycia, int punktyMany, int punktyAtaku) {
        this.nazwa = nazwa;
        this.punktyZycia = punktyZycia;
        this.punktyMany = punktyMany;
        this.punktyAtaku = punktyAtaku;
    }

    public String getNazwa() {
        return nazwa;
    }

    public void przywitajSie() {
        System.out.println("Jestem " + nazwa);
    }

    @Override
    public String toString() {
        return nazwa + " " + punktyZycia + " " + punktyMany + " " + punktyAtaku;
    }
}
` },
        { name: 'TypOrka.java', code: J`public enum TypOrka {
    BOJOWY, KUCHARZ, GARNCARZ
}
` },
        { name: 'Ork.java', code: J`public class Ork extends Postac {
    private TypOrka typ;

    public Ork(String nazwa, int punktyZycia, int punktyMany, int punktyAtaku, TypOrka typ) {
        super(nazwa, punktyZycia, punktyMany, punktyAtaku);
        this.typ = typ;
    }

    @Override
    public void przywitajSie() {
        System.out.println("Grr, jestem orkiem o imieniu " + getNazwa());
    }

    @Override
    public String toString() {
        return super.toString() + " " + typ;
    }
}
` },
        { name: 'Smok.java', code: J`public class Smok extends Postac {
    private String kolor;

    public Smok(String nazwa, int punktyZycia, int punktyMany, int punktyAtaku, String kolor) {
        super(nazwa, punktyZycia, punktyMany, punktyAtaku);
        this.kolor = kolor;
    }

    @Override
    public String toString() {
        return super.toString() + " " + kolor;
    }
}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {
        Postac p = new Postac("Frodo", 50, 10, 5);
        p.przywitajSie();
        System.out.println(p.toString());

        Ork o = new Ork("Gruk", 100, 20, 15, TypOrka.BOJOWY);
        o.przywitajSie();
        System.out.println(o.toString());

        Smok s = new Smok("Wawel", 500, 80, 70, "zielony");
        s.przywitajSie();
        System.out.println(s.toString());
    }
}
` }],
      checks: [
        CK(CR, 'Postac: pola prywatne i konstruktor', J`for (String n : new String[]{"nazwa", "punktyZycia", "punktyMany", "punktyAtaku"}) {
    isTrue("Brak pola " + n, hasField("Postac", n));
    isTrue("Pole " + n + " ma być private", Modifier.isPrivate(fieldMods("Postac", n)));
}
Object p = make("Postac", "Frodo", 50, 10, 5);
eq("Frodo", field(p, "nazwa")); eq(50, field(p, "punktyZycia")); eq(10, field(p, "punktyMany")); eq(5, field(p, "punktyAtaku"));`),
        CK(CR, 'Postac.toString() = „nazwa zycie mana atak”', J`eq("Frodo 50 10 5", make("Postac", "Frodo", 50, 10, 5).toString());`),
        CK(CR, 'Postac.przywitajSie() wypisuje „Jestem {nazwa}”', J`Object p = make("Postac", "Frodo", 50, 10, 5);
eq("Jestem Frodo", out(() -> call(p, "przywitajSie")).trim());`),
        CK(CR, 'Ork dziedziczy po Postac i ma pole typ będące enumem z 3 wartościami', J`isTrue("Ork musi dziedziczyć po Postac", isSubclass("Ork", "Postac"));
Class<?> t = findF(cls("Ork"), "typ").getType();
isTrue("typ ma być enumem", t.isEnum());
List<String> n = new ArrayList<>(); for (Object o : t.getEnumConstants()) n.add(o.toString());
eq(java.util.Arrays.asList("BOJOWY", "KUCHARZ", "GARNCARZ"), n);`),
        CK(CR, 'Ork.przywitajSie() wypisuje „Grr, jestem orkiem o imieniu {nazwa}”', J`Class<?> t = findF(cls("Ork"), "typ").getType();
Object o = make("Ork", "Gruk", 100, 20, 15, t.getEnumConstants()[0]);
eq("Grr, jestem orkiem o imieniu Gruk", out(() -> call(o, "przywitajSie")).trim());`),
        CK(MD, 'Ork.toString() = toString Postaci + typ', J`Class<?> t = findF(cls("Ork"), "typ").getType();
eq("Gruk 100 20 15 BOJOWY", make("Ork", "Gruk", 100, 20, 15, t.getEnumConstants()[0]).toString());`),
        CK(CR, 'Smok dziedziczy po Postac, ma prywatne pole kolor i działający konstruktor', J`isTrue("Smok musi dziedziczyć po Postac", isSubclass("Smok", "Postac"));
isTrue("Brak pola kolor", hasField("Smok", "kolor"));
isTrue("kolor ma być private", Modifier.isPrivate(fieldMods("Smok", "kolor")));
eq("zielony", field(make("Smok", "Wawel", 500, 80, 70, "zielony"), "kolor"));`),
        CK(MD, 'Smok.toString() = toString Postaci + kolor', J`eq("Wawel 500 80 70 zielony", make("Smok", "Wawel", 500, 80, 70, "zielony").toString());`),
        CK(MD, 'Smok dziedziczy przywitajSie z Postac (nie nadpisuje jej)', J`Object s = make("Smok", "Wawel", 500, 80, 70, "zielony");
eq("Jestem Wawel", out(() -> call(s, "przywitajSie")).trim());`),
        CK(MD, 'Main wypisuje wyniki dla Postaci, Orka i Smoka', J`String o = runMain();
isTrue("Main powinien wypisać co najmniej 6 linii – jest: " + lines(o).size(), lines(o).size() >= 6);
isTrue("Powitanie orka powinno być w wydruku", o.contains("Grr, jestem orkiem"));`),
        CK(MN, 'Użyto super(...), super.toString() i @Override', J`isTrue("Ork powinien wywołać super(...)", srcHas("Ork", "super\\s*\\("));
isTrue("Ork.toString powinien użyć super.toString()", srcHas("Ork", "super\\s*\\.\\s*toString\\s*\\("));
isTrue("Dodaj @Override", srcHas("Ork", "@Override"));`),
      ],
    },
  ],

  quiz: [
    Q('Co jest prawdą o dziedziczeniu w Javie?', ['klasa może dziedziczyć z wielu klas', 'klasa może dziedziczyć z tylko jednej klasy', 'z jednej klasy może dziedziczyć wiele klas', 'każda klasa dziedziczy pośrednio z <code>Object</code>'], [1, 2, 3], 'Brak wielodziedziczenia klas, ale hierarchia może być szeroka i głęboka; na szczycie zawsze <code>Object</code>.', 'dz-extends'),
    Q('Co wypisze program?', ['A B C', 'C B A', 'C', 'A C'], 0, 'Konstruktory wykonują się od najbardziej bazowej klasy w dół: A → B → C.', 'dz-konstruktory', { code: J`class A { A() { System.out.print("A "); } }
class B extends A { B() { System.out.print("B "); } }
class C extends B { C() { System.out.print("C"); } }

public class Main {
    public static void main(String[] args) {
        new C();
    }
}` }),
    Q('Klasa bazowa ma jedynie konstruktor <code>Item(String name)</code>. Co musi zawierać konstruktor klasy pochodnej?', ['nic – kompilator domyślnie wywoła <code>super()</code> i wszystko się skompiluje', 'jawne wywołanie <code>super(...)</code> z argumentem typu String', 'wywołanie <code>this()</code>', 'nic, jeśli klasa pochodna jest pusta'], 1, 'Bez konstruktora bezparametrowego w nadklasie podklasa musi wywołać <code>super(argument)</code>.', 'dz-konstruktory'),
    Q('Pole <code>int x</code> w klasie bazowej jest <code>private</code>. Jak odczytać je w klasie pochodnej?', ['<code>x</code>', '<code>super.x</code>', 'przez publiczną/chronioną metodę nadklasy, np. <code>getX()</code>', 'przez <code>this.x</code>'], 2, 'Pola prywatne są niewidoczne w podklasie – dostęp tylko przez metody.', 'dz-dostep'),
    Q('Które modyfikatory pozwalają podklasie (w innym pakiecie) odwołać się do pola nadklasy?', ['<code>public</code>', '<code>protected</code>', '<code>private</code>', 'brak modyfikatora (package-private)'], [0, 1], 'W innym pakiecie widać tylko <code>public</code> i <code>protected</code>. Brak modyfikatora = tylko ten sam pakiet.', 'dz-dostep'),
    Q('Czy klasa bazowa ma dostęp do pól klasy pochodnej?', ['tak, jeśli są <code>public</code>', 'tak, jeśli są <code>protected</code>', 'nie – niezależnie od modyfikatora', 'tak, zawsze'], 2, 'Nadklasa nie wie o polach podklas.', 'dz-dostep'),
    Q('Co wypisze program?', ['Pies szczeka', 'Zwierze dźwięk', 'Pies szczeka<br>Zwierze dźwięk', 'błąd kompilacji'], 0, 'Metoda <code>glos()</code> w <code>Pies</code> nadpisuje wersję z nadklasy; <code>super.glos()</code> nie jest wywołane.', 'dz-override', { code: J`class Zwierze {
    void glos() { System.out.println("Zwierze dźwięk"); }
}
class Pies extends Zwierze {
    @Override
    void glos() { System.out.println("Pies szczeka"); }
}

public class Main {
    public static void main(String[] args) {
        new Pies().glos();
    }
}` }),
    Q('Co wypisze program?', ['Pies szczeka<br>Zwierze dźwięk', 'Zwierze dźwięk<br>Pies szczeka', 'Pies szczeka', 'Zwierze dźwięk'], 0, '<code>super.glos()</code> uruchamia wersję bazową <b>w miejscu, w którym je wpiszesz</b> – tu po wypisaniu „Pies szczeka”.', 'dz-override', { code: J`class Zwierze {
    void glos() { System.out.println("Zwierze dźwięk"); }
}
class Pies extends Zwierze {
    @Override
    void glos() {
        System.out.println("Pies szczeka");
        super.glos();
    }
}

public class Main {
    public static void main(String[] args) {
        new Pies().glos();
    }
}` }),
    Q('Co jest prawdą o <code>@Override</code>?', ['bez niej nadpisywanie nie zadziała', 'nie zmienia działania programu', 'powoduje błąd kompilacji, gdy metoda nie nadpisuje żadnej z nadklasy', 'jest wymagana przy <code>toString</code>'], [1, 2], 'To adnotacja pomocnicza: nieobowiązkowa, ale kompilator weryfikuje, że faktycznie nadpisujesz.', 'dz-override'),
  ],
});
