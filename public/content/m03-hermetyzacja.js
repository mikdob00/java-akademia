'use strict';
ACAD.modules.push({
  id: 'herm', num: 3, level: 1, icon: '🔒', title: 'Hermetyzacja: gettery i settery',
  source: 'Wykład 4 (początek) · wymóg projektu',
  summary: 'Ukrywanie pól za publicznymi metodami: kontrola dostępu, walidacja wartości i właściwości wyliczane.',
  goals: ['ukryć pola przez <code>private</code> i udostępnić je przez gettery/settery', 'dopisać walidację do settera', 'zrobić pole „tylko do odczytu”', 'wyliczać wartość (np. wiek) zamiast ją przechowywać'],
  lessons: [

    {
      id: 'herm-idea', micro: true, title: 'Po co ukrywać pola?', blurb: 'private + metody zamiast otwartych pól', minutes: 4,
      content: [
        ANA('🏧', 'W bankomacie nie wsadzasz ręki do skarbca i nie wpisujesz sobie salda. Masz <b>przyciski</b> (wypłać, wpłać), a bank pilnuje zasad. <b>Hermetyzacja</b> to to samo w kodzie: pola są <code>private</code> (skarbiec zamknięty), a świat korzysta z <b>publicznych metod</b> (przyciski).'),
        VIZ('compare', { cols: [
          { icon: '🔓', title: 'pole public', c: 'bad', sub: 'każdy może zrobić cokolwiek', items: ['<code>konto.saldo = -500;</code>', 'nikt nie sprawdza, czy to ma sens'] },
          { icon: '🔒', title: 'pole private + metody', c: 'ok', sub: 'klasa pilnuje zasad', items: ['do pola dostęp przez metody', 'metoda może odrzucić zły wynik'] }] }),
        CODE(J`class Konto {
    public int saldo;
}

public class Main {
    public static void main(String[] args) {
        Konto k = new Konto();
        k.saldo = -500;
        System.out.println(k.saldo);
    }
}
`, '-500'),
        NOTE('info', 'Powyższy kod działa, ale pozwala na nielogiczne saldo. W kolejnych lekcjach zamkniemy pole (<code>private</code>) i dodamy metody: <b>gettery</b> (odczyt), <b>settery</b> (zapis z kontrolą).'),
      ],
      quiz: [
        Q('Na czym polega hermetyzacja?', ['pola są prywatne, a dostęp do nich dają publiczne metody', 'wszystkie pola są publiczne', 'klasa nie ma żadnych pól', 'program jest zaszyfrowany'], 0, 'Klasa ukrywa swoje wnętrze i sama pilnuje poprawności danych.'),
        Q('Dlaczego publiczne pole to zły pomysł?', ['każdy może ustawić dowolną, nawet bezsensowną wartość', 'program się nie skompiluje', 'pole zajmuje więcej pamięci', 'nie da się go odczytać'], 0, 'Nikt nie sprawdza, czy wartość jest poprawna.'),
        Q('Jak nazywamy metody służące do odczytu i zapisu prywatnych pól?', ['gettery i settery', 'konstruktory', 'iteratory', 'enumy'], 0, 'getXxx() czyta, setXxx() zapisuje.'),
      ],
    },

    {
      id: 'herm-gettery', title: 'Getter: odczyt prywatnego pola', blurb: 'public String getImie()', minutes: 5,
      content: [
        ANA('🪟', 'Pole <code>private</code> to pokój za zamkniętymi drzwiami. <b>Getter</b> to <b>okienko</b> w drzwiach: możesz zajrzeć i zobaczyć wartość, ale nie możesz niczego zmienić. Nazwa getteru: <code>get</code> + nazwa pola z wielkiej litery.'),
        TERMS([['<code>private String imie;</code>', 'pole zamknięte przed światem'], ['<code>public String getImie()</code>', 'getter: zwraca wartość pola; typ zwracany = typ pola, brak parametrów'], ['<code>return imie;</code>', 'to jedyna rzecz, którą getter robi']]),
        CODE(J`class Osoba {
    private String imie;

    public Osoba(String imie) {
        this.imie = imie;
    }

    public String getImie() {
        return imie;
    }
}

public class Main {
    public static void main(String[] args) {
        Osoba o = new Osoba("Ola");
        System.out.println(o.getImie());
    }
}
`, 'Ola'),
        NOTE('tip', 'Dla pól typu <code>boolean</code> zwykle pisze się <code>isXxx()</code> zamiast <code>getXxx()</code> (np. <code>isAktywny()</code>).'),
      ],
      guide: {
        files: [FL('Osoba.java', 'public class Osoba {\n    private String imie;\n    private int wiek;\n\n    public Osoba(String imie, int wiek) {\n        this.imie = imie;\n        this.wiek = wiek;\n    }\n}\n')],
        steps: [
          { say: '<p>Dodaj getter imienia: <code>public</code>, typ taki jak pole (<code>String</code>), nazwa <code>getImie</code>, puste nawiasy.</p>', type: '    public String getImie() {', expect: J`public\s+String\s+getImie\s*\(\s*\)\s*\{` },
          { say: '<p>Getter zwraca wartość pola i kończy się klamrą.</p>', type: '        return imie;\n    }', expect: J`getImie\s*\(\s*\)\s*\{\s*return\s+(this\.)?imie\s*;\s*\}` },
          { say: '<p>Teraz getter wieku: typ <code>int</code>, nazwa <code>getWiek</code>, a w środku <code>return wiek;</code>.</p>', type: '    public int getWiek() {\n        return wiek;\n    }', expect: J`public\s+int\s+getWiek\s*\(\s*\)\s*\{\s*return\s+(this\.)?wiek\s*;\s*\}` },
        ],
        solution: [FL('Osoba.java', 'public class Osoba {\n    private String imie;\n    private int wiek;\n\n    public Osoba(String imie, int wiek) {\n        this.imie = imie;\n        this.wiek = wiek;\n    }\n\n    public String getImie() {\n        return imie;\n    }\n\n    public int getWiek() {\n        return wiek;\n    }\n}\n')],
        checks: [
          CK(CR, 'getImie() zwraca imię', J`Object o = make("Osoba", "Ola", 20); eq("Ola", call(o, "getImie")); eq("Adam", call(make("Osoba", "Adam", 5), "getImie"));`),
          CK(CR, 'getWiek() zwraca wiek', J`Object o = make("Osoba", "Ola", 20); eq(20, call(o, "getWiek"));`),
          CK(MD, 'Pola pozostają private', J`isTrue("Pole imie ma być private", isPrivate("Osoba", "imie")); isTrue("Pole wiek ma być private", isPrivate("Osoba", "wiek"));`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Produkt</code> ma prywatne pola <code>nazwa</code> (String) i <code>cena</code> (double) oraz konstruktor. Dodaj gettery <code>getNazwa()</code> i <code>getCena()</code>.</p>',
        files: [FL('Produkt.java', 'public class Produkt {\n    private String nazwa;\n    private double cena;\n\n    public Produkt(String nazwa, double cena) {\n        this.nazwa = nazwa;\n        this.cena = cena;\n    }\n}\n')],
        hints: ['<code>public String getNazwa() { return nazwa; }</code>', '<code>public double getCena() { return cena; }</code>'],
        solution: [FL('Produkt.java', 'public class Produkt {\n    private String nazwa;\n    private double cena;\n\n    public Produkt(String nazwa, double cena) {\n        this.nazwa = nazwa;\n        this.cena = cena;\n    }\n\n    public String getNazwa() {\n        return nazwa;\n    }\n\n    public double getCena() {\n        return cena;\n    }\n}\n')],
        checks: [
          CK(CR, 'getNazwa() zwraca nazwę', J`eq("Chleb", call(make("Produkt", "Chleb", 4.5), "getNazwa"));`),
          CK(CR, 'getCena() zwraca cenę', J`eq(4.5, call(make("Produkt", "Chleb", 4.5), "getCena")); eq(10.0, call(make("Produkt", "X", 10.0), "getCena"));`),
          CK(MD, 'Pola są private', J`isTrue("nazwa ma być private", isPrivate("Produkt", "nazwa")); isTrue("cena ma być private", isPrivate("Produkt", "cena"));`),
        ],
      },
      quiz: [
        Q('Co robi getter?', ['zwraca wartość prywatnego pola', 'ustawia wartość pola', 'tworzy obiekt', 'usuwa pole'], 0, 'Getter służy do odczytu.'),
        Q('Jaki jest poprawny getter pola <code>private int wiek;</code>?', ['public int getWiek() { return wiek; }', 'public void getWiek() { return wiek; }', 'public int getWiek(int wiek) { }', 'private int getWiek() { }'], 0, 'Typ zwracany = typ pola, brak parametrów, publiczny.'),
        OUTQ('Co wypisze program?', ['Ola', 'null', 'imie', 'błąd'], 0, 'Getter zwraca pole ustawione w konstruktorze.', 'class Osoba {\n    private String imie;\n\n    public Osoba(String imie) {\n        this.imie = imie;\n    }\n\n    public String getImie() {\n        return imie;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Osoba o = new Osoba("Ola");\n        System.out.println(o.getImie());\n    }\n}\n'),
        Q('Jak nazwiesz getter pola <code>boolean aktywny</code> (konwencja)?', ['isAktywny()', 'getAktywny()', 'aktywny()', 'readAktywny()'], 0, 'Dla boolean przyjęło się <code>is</code>.'),
      ],
    },

    {
      id: 'herm-settery', title: 'Setter: zmiana prywatnego pola', blurb: 'public void setImie(String imie)', minutes: 5,
      content: [
        ANA('📮', 'Getter to okienko do patrzenia. <b>Setter</b> to <b>skrzynka na listy</b>: możesz wrzucić nową wartość, ale to klasa decyduje, co z nią zrobi. Nazwa: <code>set</code> + nazwa pola z wielkiej litery. Setter nic nie zwraca (<code>void</code>) i ma <b>jeden parametr</b>.'),
        CODE(J`class Osoba {
    private String imie;

    public Osoba(String imie) {
        this.imie = imie;
    }

    public String getImie() {
        return imie;
    }

    public void setImie(String imie) {
        this.imie = imie;
    }
}

public class Main {
    public static void main(String[] args) {
        Osoba o = new Osoba("Ola");
        o.setImie("Ala");
        System.out.println(o.getImie());
    }
}
`, 'Ala'),
        NOTE('info', 'Parametr nazywa się tak samo jak pole, więc w środku piszemy <code>this.imie = imie;</code> (tak jak w konstruktorze).'),
      ],
      guide: {
        files: [FL('Osoba.java', 'public class Osoba {\n    private String imie;\n    private int wiek;\n\n    public Osoba(String imie, int wiek) {\n        this.imie = imie;\n        this.wiek = wiek;\n    }\n\n    public String getImie() {\n        return imie;\n    }\n\n    public int getWiek() {\n        return wiek;\n    }\n}\n')],
        steps: [
          { say: '<p>Setter imienia: <code>public void</code> (nic nie zwraca), nazwa <code>setImie</code>, jeden parametr <code>String imie</code>.</p>', type: '    public void setImie(String imie) {', expect: J`public\s+void\s+setImie\s*\(\s*String\s+imie\s*\)\s*\{` },
          { say: '<p>Przypisz parametr do pola. Po lewej <code>this.imie</code> (pole), po prawej <code>imie</code> (parametr).</p>', type: '        this.imie = imie;\n    }', expect: J`setImie\s*\(\s*String\s+imie\s*\)\s*\{\s*this\.imie\s*=\s*imie\s*;\s*\}` },
          { say: '<p>Setter wieku według tego samego wzoru.</p>', type: '    public void setWiek(int wiek) {\n        this.wiek = wiek;\n    }', expect: J`public\s+void\s+setWiek\s*\(\s*int\s+wiek\s*\)\s*\{\s*this\.wiek\s*=\s*wiek\s*;\s*\}` },
        ],
        solution: [FL('Osoba.java', 'public class Osoba {\n    private String imie;\n    private int wiek;\n\n    public Osoba(String imie, int wiek) {\n        this.imie = imie;\n        this.wiek = wiek;\n    }\n\n    public String getImie() {\n        return imie;\n    }\n\n    public int getWiek() {\n        return wiek;\n    }\n\n    public void setImie(String imie) {\n        this.imie = imie;\n    }\n\n    public void setWiek(int wiek) {\n        this.wiek = wiek;\n    }\n}\n')],
        checks: [
          CK(CR, 'setImie() zmienia imię', J`Object o = make("Osoba", "Ola", 20); call(o, "setImie", "Ala"); eq("Ala", call(o, "getImie"));`),
          CK(CR, 'setWiek() zmienia wiek', J`Object o = make("Osoba", "Ola", 20); call(o, "setWiek", 30); eq(30, call(o, "getWiek"));`),
          CK(MD, 'Settery są void i public', J`isTrue("setImie ma być public", Modifier.isPublic(methodMods("Osoba", "setImie"))); isTrue("setImie ma być void", method("Osoba", "setImie", String.class).getReturnType() == void.class);`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Produkt</code> ma prywatne pola i gettery. Dopisz settery <code>setNazwa(String nazwa)</code> i <code>setCena(double cena)</code>.</p>',
        files: [FL('Produkt.java', 'public class Produkt {\n    private String nazwa;\n    private double cena;\n\n    public Produkt(String nazwa, double cena) {\n        this.nazwa = nazwa;\n        this.cena = cena;\n    }\n\n    public String getNazwa() {\n        return nazwa;\n    }\n\n    public double getCena() {\n        return cena;\n    }\n}\n')],
        hints: ['<code>public void setNazwa(String nazwa) { this.nazwa = nazwa; }</code>', '<code>public void setCena(double cena) { this.cena = cena; }</code>'],
        solution: [FL('Produkt.java', 'public class Produkt {\n    private String nazwa;\n    private double cena;\n\n    public Produkt(String nazwa, double cena) {\n        this.nazwa = nazwa;\n        this.cena = cena;\n    }\n\n    public String getNazwa() {\n        return nazwa;\n    }\n\n    public double getCena() {\n        return cena;\n    }\n\n    public void setNazwa(String nazwa) {\n        this.nazwa = nazwa;\n    }\n\n    public void setCena(double cena) {\n        this.cena = cena;\n    }\n}\n')],
        checks: [
          CK(CR, 'setNazwa() zmienia nazwę', J`Object p = make("Produkt", "Chleb", 4.5); call(p, "setNazwa", "Bulka"); eq("Bulka", call(p, "getNazwa"));`),
          CK(CR, 'setCena() zmienia cenę', J`Object p = make("Produkt", "Chleb", 4.5); call(p, "setCena", 6.0); eq(6.0, call(p, "getCena"));`),
        ],
      },
      quiz: [
        Q('Co robi setter?', ['ustawia nową wartość prywatnego pola', 'zwraca wartość pola', 'tworzy nowy obiekt', 'usuwa obiekt'], 0, 'Setter służy do zapisu.'),
        Q('Jaki jest poprawny setter pola <code>private int wiek;</code>?', ['public void setWiek(int wiek) { this.wiek = wiek; }', 'public int setWiek() { return wiek; }', 'public void setWiek() { }', 'private void setWiek(int wiek) { }'], 0, 'void, jeden parametr tego samego typu co pole, publiczny.'),
        OUTQ('Co wypisze program?', ['Ala', 'Ola', 'null', 'błąd'], 0, 'Setter zmienił pole po utworzeniu obiektu.', 'class Osoba {\n    private String imie;\n\n    public Osoba(String imie) {\n        this.imie = imie;\n    }\n\n    public String getImie() {\n        return imie;\n    }\n\n    public void setImie(String imie) {\n        this.imie = imie;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Osoba o = new Osoba("Ola");\n        o.setImie("Ala");\n        System.out.println(o.getImie());\n    }\n}\n'),
      ],
    },

    {
      id: 'herm-walidacja', title: 'Walidacja w setterze', blurb: 'klasa nie przyjmie bezsensownych danych', minutes: 6,
      content: [
        ANA('🛂', 'Setter to <b>strażnik przy bramie</b>. Zamiast wpuszczać każdą wartość, sprawdza dokument: wiek ujemny? Nie wpuszczamy. W kodzie to zwykłe <code>if</code> w setterze, a niepoprawne dane są <b>ignorowane</b> (pole zostaje jak było).'),
        VIZ('flow', { title: 'setWiek(-5)', steps: [{ t: 'setWiek(-5)', s: 'ktoś próbuje ustawić wiek', c: 'accent' }, { t: 'if (wiek >= 0) ?', s: 'sprawdzenie', c: 'warn' }, { t: 'fałsz', s: 'pole się nie zmienia', c: 'bad' }] }),
        CODE(J`class Osoba {
    private int wiek = 10;

    public int getWiek() {
        return wiek;
    }

    public void setWiek(int wiek) {
        if (wiek >= 0) {
            this.wiek = wiek;
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Osoba o = new Osoba();
        o.setWiek(25);
        o.setWiek(-5);
        System.out.println(o.getWiek());
    }
}
`, '25'),
        NOTE('exam', 'W projekcie często wymaga się walidacji: tekst nie może być pusty, liczba nie może być ujemna. Zawsze rób to w <b>setterze</b>, nie w <code>main</code>.'),
      ],
      guide: {
        files: [FL('Osoba.java', 'public class Osoba {\n    private int wiek = 10;\n\n    public int getWiek() {\n        return wiek;\n    }\n\n    public void setWiek(int wiek) {\n        this.wiek = wiek;\n    }\n}\n')],
        steps: [
          { say: '<p>W setterze wstaw sprawdzenie: przypisanie ma się wykonać <b>tylko</b> wtedy, gdy wiek nie jest ujemny.</p>', type: '        if (wiek >= 0) {', expect: J`setWiek\s*\(\s*int\s+wiek\s*\)\s*\{\s*if\s*\(\s*wiek\s*>=\s*0\s*\)\s*\{` },
          { say: '<p>Wewnątrz <code>if</code> zostaw przypisanie do pola i zamknij blok. Gdy warunek jest fałszywy, nic się nie dzieje.</p>', type: '            this.wiek = wiek;\n        }', expect: J`if\s*\(\s*wiek\s*>=\s*0\s*\)\s*\{\s*this\.wiek\s*=\s*wiek\s*;\s*\}` },
        ],
        solution: [FL('Osoba.java', 'public class Osoba {\n    private int wiek = 10;\n\n    public int getWiek() {\n        return wiek;\n    }\n\n    public void setWiek(int wiek) {\n        if (wiek >= 0) {\n            this.wiek = wiek;\n        }\n    }\n}\n')],
        checks: [
          CK(CR, 'Poprawny wiek jest ustawiany', J`Object o = make("Osoba"); call(o, "setWiek", 25); eq(25, call(o, "getWiek")); call(o, "setWiek", 0); eq(0, call(o, "getWiek"));`),
          CK(CR, 'Ujemny wiek jest odrzucany', J`Object o = make("Osoba"); call(o, "setWiek", 25); call(o, "setWiek", -5); eq(25, call(o, "getWiek"));`),
        ],
      },
      exercise: {
        prompt: '<p>W klasie <code>Produkt</code> uzupełnij <code>setCena(double cena)</code> tak, żeby cena była ustawiana <b>tylko wtedy, gdy jest większa od 0</b>. W przeciwnym razie cena ma się nie zmienić.</p>',
        files: [FL('Produkt.java', 'public class Produkt {\n    private double cena = 1.0;\n\n    public double getCena() {\n        return cena;\n    }\n\n    public void setCena(double cena) {\n        this.cena = cena;\n    }\n}\n')],
        hints: ['<code>if (cena > 0) { this.cena = cena; }</code>'],
        solution: [FL('Produkt.java', 'public class Produkt {\n    private double cena = 1.0;\n\n    public double getCena() {\n        return cena;\n    }\n\n    public void setCena(double cena) {\n        if (cena > 0) {\n            this.cena = cena;\n        }\n    }\n}\n')],
        checks: [
          CK(CR, 'Dodatnia cena jest ustawiana', J`Object p = make("Produkt"); call(p, "setCena", 9.5); eq(9.5, call(p, "getCena"));`),
          CK(CR, 'Zero i ujemna cena są odrzucane', J`Object p = make("Produkt"); call(p, "setCena", 0.0); eq(1.0, call(p, "getCena")); call(p, "setCena", -3.0); eq(1.0, call(p, "getCena"));`),
        ],
      },
      quiz: [
        Q('Po co walidacja w setterze?', ['żeby klasa nie przyjmowała niepoprawnych danych', 'żeby setter działał szybciej', 'żeby ukryć getter', 'żeby pole stało się public'], 0, 'Setter jest jedyną drogą zapisu, więc tam sprawdzamy dane.'),
        OUTQ('Co wypisze program?', ['10', '-5', '0', 'błąd'], 0, 'Setter odrzucił ujemną wartość, więc pole ma wartość początkową.', 'class Osoba {\n    private int wiek = 10;\n\n    public int getWiek() {\n        return wiek;\n    }\n\n    public void setWiek(int wiek) {\n        if (wiek >= 0) {\n            this.wiek = wiek;\n        }\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Osoba o = new Osoba();\n        o.setWiek(-5);\n        System.out.println(o.getWiek());\n    }\n}\n'),
        Q('Gdzie powinna być walidacja wartości pola?', ['w setterze', 'w metodzie main', 'w getterze', 'w komentarzu'], 0, 'Klasa sama pilnuje swoich danych.'),
      ],
    },

    {
      id: 'herm-konstruktor', title: 'Konstruktor i walidacja', blurb: 'konstruktor woła setter – jedno miejsce sprawdzania', minutes: 4,
      content: [
        ANA('🚪', 'Walidacja w setterze to strażnik tylnych drzwi. A <b>konstruktor</b> to drzwi frontowe: jeśli wpisuje wartość do pola bezpośrednio, <b>omija strażnika</b>. Dlatego konstruktor powinien <b>wołać setter</b> zamiast przypisywać pole samemu.'),
        VIZ('compare', { cols: [
          { icon: '🙅', title: 'this.wiek = wiek;', c: 'bad', sub: 'w konstruktorze', items: ['ujemny wiek przejdzie bez sprawdzenia'] },
          { icon: '✅', title: 'setWiek(wiek);', c: 'ok', sub: 'w konstruktorze', items: ['wartość przechodzi przez walidację'] }] }),
        CODE(J`class Osoba {
    private int wiek;

    public Osoba(int wiek) {
        setWiek(wiek);
    }

    public int getWiek() {
        return wiek;
    }

    public void setWiek(int wiek) {
        if (wiek >= 0) {
            this.wiek = wiek;
        }
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Osoba(-3).getWiek());
        System.out.println(new Osoba(8).getWiek());
    }
}
`, '0\n8'),
      ],
      guide: {
        files: [FL('Osoba.java', 'public class Osoba {\n    private int wiek;\n\n    public Osoba(int wiek) {\n        this.wiek = wiek;\n    }\n\n    public int getWiek() {\n        return wiek;\n    }\n\n    public void setWiek(int wiek) {\n        if (wiek >= 0) {\n            this.wiek = wiek;\n        }\n    }\n}\n')],
        steps: [
          { say: '<p>Konstruktor omija walidację, bo sam wpisuje do pola. Zamień jego treść na wywołanie settera.</p>', type: '        setWiek(wiek);', expect: J`public\s+Osoba\s*\(\s*int\s+wiek\s*\)\s*\{\s*setWiek\s*\(\s*wiek\s*\)\s*;\s*\}` },
        ],
        solution: [FL('Osoba.java', 'public class Osoba {\n    private int wiek;\n\n    public Osoba(int wiek) {\n        setWiek(wiek);\n    }\n\n    public int getWiek() {\n        return wiek;\n    }\n\n    public void setWiek(int wiek) {\n        if (wiek >= 0) {\n            this.wiek = wiek;\n        }\n    }\n}\n')],
        checks: [
          CK(CR, 'Poprawny wiek w konstruktorze jest zapisany', J`eq(8, call(make("Osoba", 8), "getWiek"));`),
          CK(CR, 'Ujemny wiek w konstruktorze jest odrzucony (zostaje 0)', J`eq(0, call(make("Osoba", -3), "getWiek"));`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Produkt</code> ma setter z walidacją <code>setCena</code> (tylko cena &gt; 0). Zmień konstruktor <code>Produkt(double cena)</code> tak, żeby <b>korzystał z settera</b>. Dla ceny −5 pole ma zostać <code>1.0</code> (wartość początkowa).</p>',
        files: [FL('Produkt.java', 'public class Produkt {\n    private double cena = 1.0;\n\n    public Produkt(double cena) {\n        this.cena = cena;\n    }\n\n    public double getCena() {\n        return cena;\n    }\n\n    public void setCena(double cena) {\n        if (cena > 0) {\n            this.cena = cena;\n        }\n    }\n}\n')],
        hints: ['W konstruktorze wywołaj <code>setCena(cena);</code> zamiast przypisywać pole.'],
        solution: [FL('Produkt.java', 'public class Produkt {\n    private double cena = 1.0;\n\n    public Produkt(double cena) {\n        setCena(cena);\n    }\n\n    public double getCena() {\n        return cena;\n    }\n\n    public void setCena(double cena) {\n        if (cena > 0) {\n            this.cena = cena;\n        }\n    }\n}\n')],
        checks: [
          CK(CR, 'Poprawna cena w konstruktorze', J`eq(7.5, call(make("Produkt", 7.5), "getCena"));`),
          CK(CR, 'Niepoprawna cena w konstruktorze jest odrzucona', J`eq(1.0, call(make("Produkt", -5.0), "getCena"));`),
        ],
      },
      quiz: [
        Q('Dlaczego konstruktor powinien wołać setter?', ['żeby wartości początkowe przeszły przez tę samą walidację', 'bo konstruktor nie może przypisywać pól', 'bo setter jest szybszy', 'bo tak wymaga kompilator'], 0, 'Walidacja jest w jednym miejscu.'),
        Q('Co się stanie, gdy konstruktor przypisze pole bezpośrednio (<code>this.wiek = wiek</code>), a setter ma walidację?', ['początkowa wartość nie zostanie sprawdzona', 'program się nie skompiluje', 'setter przestanie działać', 'walidacja zadziała automatycznie'], 0, 'Konstruktor omija setter.'),
      ],
    },

    {
      id: 'herm-tylko-odczyt', title: 'Pole tylko do odczytu', blurb: 'getter bez settera, final', minutes: 4,
      content: [
        ANA('🪪', 'Numer PESEL dostajesz raz i nikt nie powinien go zmieniać. Takie pole ma <b>getter, ale nie ma settera</b>. Wartość ustawiasz tylko w konstruktorze. Dodatkowe słowo <code>final</code> mówi kompilatorowi: „to pole można przypisać <b>tylko raz</b>”.'),
        CODE(J`class Student {
    private final String indeks;

    public Student(String indeks) {
        this.indeks = indeks;
    }

    public String getIndeks() {
        return indeks;
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student("S123");
        System.out.println(s.getIndeks());
    }
}
`, 'S123'),
        NOTE('info', 'Próba przypisania do pola <code>final</code> w innej metodzie (np. <code>indeks = "X";</code>) to <b>błąd kompilacji</b>. Więcej o <code>final</code> będzie w module o elementach statycznych.'),
      ],
      guide: {
        files: [FL('Student.java', 'public class Student {\n    private String indeks;\n\n    public Student(String indeks) {\n        this.indeks = indeks;\n    }\n\n    public void setIndeks(String indeks) {\n        this.indeks = indeks;\n    }\n}\n')],
        steps: [
          { say: '<p>Zablokuj zmiany: pole ma być <code>final</code> (przypisywane tylko raz).</p>', type: '    private final String indeks;', expect: J`private\s+final\s+String\s+indeks\s*;` },
          { say: '<p>Usuń setter <code>setIndeks</code>, bo pole ma być tylko do odczytu (przy polu <code>final</code> kompilator i tak by go nie przyjął).</p>', expect: J`^(?!.*setIndeks).*$` },
          { say: '<p>Dodaj getter, żeby dało się odczytać numer.</p>', type: '    public String getIndeks() {\n        return indeks;\n    }', expect: J`public\s+String\s+getIndeks\s*\(\s*\)\s*\{\s*return\s+(this\.)?indeks\s*;\s*\}` },
        ],
        solution: [FL('Student.java', 'public class Student {\n    private final String indeks;\n\n    public Student(String indeks) {\n        this.indeks = indeks;\n    }\n\n    public String getIndeks() {\n        return indeks;\n    }\n}\n')],
        checks: [
          CK(CR, 'getIndeks() zwraca numer', J`eq("S123", call(make("Student", "S123"), "getIndeks"));`),
          CK(CR, 'Brak settera setIndeks', J`isFalse("Pole tylko do odczytu nie powinno mieć settera setIndeks", hasMethod("Student", "setIndeks"));`),
          CK(MD, 'Pole jest private final', J`int m = fieldMods("Student", "indeks"); isTrue("indeks ma być private", Modifier.isPrivate(m)); isTrue("indeks ma być final", Modifier.isFinal(m));`),
        ],
      },
      exercise: {
        prompt: '<p>Napisz klasę <code>Ksiazka</code> z polem <code>private final String isbn</code>, konstruktorem <code>Ksiazka(String isbn)</code> i getterem <code>getIsbn()</code>. <b>Bez settera.</b></p>',
        files: [FL('Ksiazka.java', 'public class Ksiazka {\n}\n')],
        hints: ['<code>private final String isbn;</code>', 'Konstruktor: <code>this.isbn = isbn;</code>', 'Getter: <code>public String getIsbn() { return isbn; }</code>'],
        solution: [FL('Ksiazka.java', 'public class Ksiazka {\n    private final String isbn;\n\n    public Ksiazka(String isbn) {\n        this.isbn = isbn;\n    }\n\n    public String getIsbn() {\n        return isbn;\n    }\n}\n')],
        checks: [
          CK(CR, 'getIsbn() zwraca isbn podany w konstruktorze', J`eq("123-X", call(make("Ksiazka", "123-X"), "getIsbn"));`),
          CK(MD, 'Pole isbn jest private final', J`int m = fieldMods("Ksiazka", "isbn"); isTrue("isbn ma być private", Modifier.isPrivate(m)); isTrue("isbn ma być final", Modifier.isFinal(m));`),
          CK(MD, 'Brak settera', J`isFalse("Nie dodawaj settera setIsbn", hasMethod("Ksiazka", "setIsbn"));`),
        ],
      },
      quiz: [
        Q('Jak zrobić pole tylko do odczytu?', ['dać getter, nie dawać settera (i najlepiej final)', 'dać setter, nie dawać gettera', 'zrobić pole public', 'usunąć konstruktor'], 0, 'Wartość ustawia tylko konstruktor.'),
        Q('Co oznacza <code>final</code> przy polu?', ['pole można przypisać tylko raz', 'pole jest statyczne', 'pole jest publiczne', 'pole może przyjmować tylko liczby'], 0, 'Po pierwszym przypisaniu wartości nie da się zmienić.'),
        Q('Gdzie można przypisać wartość polu <code>private final String indeks;</code>?', ['w konstruktorze lub przy deklaracji', 'w dowolnej metodzie', 'w setterze', 'w main'], 0, 'Tylko jednorazowo, w konstruktorze lub od razu przy deklaracji.'),
      ],
    },

    {
      id: 'herm-wyliczane', title: 'Właściwość wyliczana', blurb: 'wartość liczona w getterze zamiast przechowywana', minutes: 5,
      content: [
        ANA('🧾', 'Na paragonie jest cena netto. Cenę brutto <b>nie trzeba zapisywać w osobnej rubryce</b>, bo zawsze da się ją <b>policzyć</b> (netto razy 1,23). Dzięki temu nie ma ryzyka, że dwie liczby „rozjadą się”. W klasie robi to getter, który <b>oblicza</b> wynik na bieżąco.'),
        TERMS([['pole', '<code>cenaNetto</code> zapisana w obiekcie'], ['wartość wyliczana', '<code>getCenaBrutto()</code> liczy <code>cenaNetto * 1.23</code>, bez własnego pola'], ['zaleta', 'zmieniasz netto, a brutto zawsze jest aktualne']]),
        CODE(J`class Produkt {
    private double cenaNetto;

    public Produkt(double cenaNetto) {
        this.cenaNetto = cenaNetto;
    }

    public double getCenaBrutto() {
        return cenaNetto * 1.23;
    }
}

public class Main {
    public static void main(String[] args) {
        Produkt p = new Produkt(100);
        System.out.println(p.getCenaBrutto());
    }
}
`, '123.0'),
      ],
      guide: {
        files: [FL('Produkt.java', 'public class Produkt {\n    private double cenaNetto;\n\n    public Produkt(double cenaNetto) {\n        this.cenaNetto = cenaNetto;\n    }\n}\n')],
        steps: [
          { say: '<p>Dodaj getter <code>getCenaBrutto</code> zwracający <code>double</code>. Nie ma dla niego żadnego pola.</p>', type: '    public double getCenaBrutto() {', expect: J`public\s+double\s+getCenaBrutto\s*\(\s*\)\s*\{` },
          { say: '<p>Oblicz wynik z istniejącego pola: netto razy 1.23. Zamknij metodę.</p>', type: '        return cenaNetto * 1.23;\n    }', expect: J`return\s+cenaNetto\s*\*\s*1\.23\s*;\s*\}` },
        ],
        solution: [FL('Produkt.java', 'public class Produkt {\n    private double cenaNetto;\n\n    public Produkt(double cenaNetto) {\n        this.cenaNetto = cenaNetto;\n    }\n\n    public double getCenaBrutto() {\n        return cenaNetto * 1.23;\n    }\n}\n')],
        checks: [
          CK(CR, 'getCenaBrutto() liczy netto * 1.23', J`double b = (Double) call(make("Produkt", 100.0), "getCenaBrutto"); isTrue("Dla 100 oczekiwano 123.0, otrzymano " + b, Math.abs(b - 123.0) < 0.001); double c = (Double) call(make("Produkt", 10.0), "getCenaBrutto"); isTrue("Dla 10 oczekiwano 12.3, otrzymano " + c, Math.abs(c - 12.3) < 0.001);`),
          CK(MD, 'Nie dodano osobnego pola cenaBrutto', J`isFalse("Wartość wyliczaną liczymy w getterze, bez pola cenaBrutto", hasField("Produkt", "cenaBrutto"));`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Osoba</code> ma prywatne pola <code>imie</code> i <code>nazwisko</code>. Dodaj getter <code>getPelneImie()</code>, który <b>zwraca</b> tekst w formacie <code>Imie Nazwisko</code> (np. <code>Jan Kowalski</code>). Nie dodawaj nowego pola.</p>',
        files: [FL('Osoba.java', 'public class Osoba {\n    private String imie;\n    private String nazwisko;\n\n    public Osoba(String imie, String nazwisko) {\n        this.imie = imie;\n        this.nazwisko = nazwisko;\n    }\n}\n')],
        hints: ['<code>return imie + " " + nazwisko;</code>', 'Typ zwracany: <code>String</code>'],
        solution: [FL('Osoba.java', 'public class Osoba {\n    private String imie;\n    private String nazwisko;\n\n    public Osoba(String imie, String nazwisko) {\n        this.imie = imie;\n        this.nazwisko = nazwisko;\n    }\n\n    public String getPelneImie() {\n        return imie + " " + nazwisko;\n    }\n}\n')],
        checks: [
          CK(CR, 'getPelneImie() zwraca „Jan Kowalski”', J`eq("Jan Kowalski", call(make("Osoba", "Jan", "Kowalski"), "getPelneImie")); eq("Ala Nowak", call(make("Osoba", "Ala", "Nowak"), "getPelneImie"));`),
          CK(MD, 'Brak osobnego pola pelneImie', J`isFalse("Nie dodawaj pola pelneImie, wylicz wartość w getterze", hasField("Osoba", "pelneImie"));`),
        ],
      },
      quiz: [
        Q('Czym jest właściwość wyliczana?', ['wartością obliczaną w getterze na podstawie innych pól', 'polem tylko do odczytu zapisanym w konstruktorze', 'polem statycznym', 'zmienną lokalną w main'], 0, 'Nie przechowujemy jej, tylko liczymy przy każdym odczycie.'),
        Q('Co jest zaletą liczenia wartości w getterze zamiast przechowywania jej w polu?', ['wartość jest zawsze aktualna', 'program działa szybciej', 'nie trzeba pisać konstruktora', 'pole staje się publiczne'], 0, 'Zmiana pól źródłowych od razu zmienia wynik.'),
        OUTQ('Co wypisze program?', ['Jan Kowalski', 'Jan', 'Kowalski Jan', 'błąd'], 0, 'Getter skleja imię i nazwisko.', 'class Osoba {\n    private String imie = "Jan";\n    private String nazwisko = "Kowalski";\n\n    public String getPelneImie() {\n        return imie + " " + nazwisko;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(new Osoba().getPelneImie());\n    }\n}\n'),
      ],
    },

    {
      id: 'herm-wiek', title: 'Wiek wyliczany z roku urodzenia', blurb: 'LocalDate.now().getYear()', minutes: 5,
      content: [
        ANA('🎂', 'Wiek zmienia się co roku. Gdybyś zapisał go w polu, po roku byłby nieaktualny. Rozsądniej zapisać <b>rok urodzenia</b> (ten nie zmienia się nigdy), a wiek <b>policzyć w getterze</b> jako: bieżący rok minus rok urodzenia.'),
        TERMS([['<code>import java.time.LocalDate;</code>', 'na górze pliku: pożyczamy klasę od dat'], ['<code>LocalDate.now()</code>', 'dzisiejsza data'], ['<code>.getYear()</code>', 'z daty wyciąga numer roku (np. 2026)']]),
        CODE(J`import java.time.LocalDate;

class Osoba {
    private int rokUrodzenia;

    public Osoba(int rokUrodzenia) {
        this.rokUrodzenia = rokUrodzenia;
    }

    public int getWiek() {
        return LocalDate.now().getYear() - rokUrodzenia;
    }
}

public class Main {
    public static void main(String[] args) {
        Osoba o = new Osoba(LocalDate.now().getYear() - 20);
        System.out.println(o.getWiek());
    }
}
`, '20'),
      ],
      guide: {
        files: [FL('Osoba.java', 'public class Osoba {\n    private int rokUrodzenia;\n\n    public Osoba(int rokUrodzenia) {\n        this.rokUrodzenia = rokUrodzenia;\n    }\n}\n')],
        steps: [
          { say: '<p>Na samej górze pliku dopisz import klasy z datami.</p>', type: 'import java.time.LocalDate;', expect: J`import\s+java\.time\.LocalDate\s*;` },
          { say: '<p>Dodaj getter <code>getWiek</code> zwracający <code>int</code>.</p>', type: '    public int getWiek() {', expect: J`public\s+int\s+getWiek\s*\(\s*\)\s*\{` },
          { say: '<p>Wiek to bieżący rok minus rok urodzenia. Zamknij metodę.</p>', type: '        return LocalDate.now().getYear() - rokUrodzenia;\n    }', expect: J`return\s+LocalDate\.now\s*\(\s*\)\.getYear\s*\(\s*\)\s*-\s*rokUrodzenia\s*;\s*\}` },
        ],
        solution: [FL('Osoba.java', 'import java.time.LocalDate;\n\npublic class Osoba {\n    private int rokUrodzenia;\n\n    public Osoba(int rokUrodzenia) {\n        this.rokUrodzenia = rokUrodzenia;\n    }\n\n    public int getWiek() {\n        return LocalDate.now().getYear() - rokUrodzenia;\n    }\n}\n')],
        checks: [
          CK(CR, 'getWiek() liczy bieżący rok minus rok urodzenia', J`int rok = java.time.LocalDate.now().getYear(); eq(20, call(make("Osoba", rok - 20), "getWiek")); eq(0, call(make("Osoba", rok), "getWiek")); eq(35, call(make("Osoba", rok - 35), "getWiek"));`),
          CK(MD, 'Brak osobnego pola wiek', J`isFalse("Wiek ma być wyliczany w getterze, bez pola wiek", hasField("Osoba", "wiek"));`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Auto</code> ma pole <code>rokProdukcji</code>. Dodaj getter <code>getWiek()</code>, który zwraca wiek auta (bieżący rok minus rok produkcji) oraz <code>boolean czyStare()</code>, które zwraca <code>true</code>, gdy auto ma <b>więcej niż 10</b> lat.</p>',
        files: [FL('Auto.java', 'public class Auto {\n    private int rokProdukcji;\n\n    public Auto(int rokProdukcji) {\n        this.rokProdukcji = rokProdukcji;\n    }\n}\n')],
        hints: ['Na górze: <code>import java.time.LocalDate;</code>', '<code>czyStare()</code> może wywołać <code>getWiek() > 10</code>.'],
        solution: [FL('Auto.java', 'import java.time.LocalDate;\n\npublic class Auto {\n    private int rokProdukcji;\n\n    public Auto(int rokProdukcji) {\n        this.rokProdukcji = rokProdukcji;\n    }\n\n    public int getWiek() {\n        return LocalDate.now().getYear() - rokProdukcji;\n    }\n\n    public boolean czyStare() {\n        return getWiek() > 10;\n    }\n}\n')],
        checks: [
          CK(CR, 'getWiek() zwraca poprawny wiek', J`int rok = java.time.LocalDate.now().getYear(); eq(5, call(make("Auto", rok - 5), "getWiek"));`),
          CK(CR, 'czyStare() działa dla granicy 10 lat', J`int rok = java.time.LocalDate.now().getYear(); eq(true, call(make("Auto", rok - 11), "czyStare")); eq(false, call(make("Auto", rok - 10), "czyStare")); eq(false, call(make("Auto", rok - 2), "czyStare"));`),
        ],
      },
      quiz: [
        Q('Dlaczego lepiej przechowywać rok urodzenia niż wiek?', ['wiek zmienia się z czasem, a rok urodzenia nie', 'rok urodzenia zajmuje mniej pamięci', 'Java nie pozwala na pole wiek', 'wiek nie może być liczbą'], 0, 'Wiek da się zawsze policzyć.'),
        Q('Co zwraca <code>LocalDate.now().getYear()</code>?', ['bieżący rok jako liczbę', 'bieżący miesiąc', 'tekst z datą', 'rok urodzenia'], 0, 'Np. 2026.'),
        Q('Jak obliczyć wiek, mając <code>rokUrodzenia</code>?', ['LocalDate.now().getYear() - rokUrodzenia', 'rokUrodzenia - LocalDate.now().getYear()', 'rokUrodzenia * 2', 'LocalDate.now() - rokUrodzenia'], 0, 'Bieżący rok minus rok urodzenia.'),
      ],
    },
  ],
  labs: [
    {
      id: 'lab-herm', title: 'Mini-laboratorium: Konto bankowe', source: 'przygotowane przeze mnie', own: true, concepts: ['herm-gettery', 'herm-walidacja'],
      statement: J`<p>Napisz klasę <b>KontoBankowe</b> zgodnie z zasadami hermetyzacji:</p>
<ul>
<li>prywatne pola: <code>String numer</code>, <code>double saldo</code>,</li>
<li>konstruktor <code>(String numer, double saldoPoczatkowe)</code>,</li>
<li>gettery <code>getNumer()</code> i <code>getSaldo()</code> (bez setterów – pola tylko do odczytu),</li>
<li><code>boolean wplac(double kwota)</code> – dopuszcza tylko kwoty <b>dodatnie</b>; zwraca <code>true</code>, gdy operacja się powiodła,</li>
<li><code>boolean wyplac(double kwota)</code> – kwota dodatnia i <b>nie większa niż saldo</b>; zwraca <code>true</code>/<code>false</code>,</li>
<li><code>boolean przelej(KontoBankowe cel, double kwota)</code> – wypłaca z tego konta i wpłaca na konto <code>cel</code> (gdy się nie da – nic się nie zmienia, <code>false</code>),</li>
<li><code>toString()</code>: <code>„Konto PL01: 100.0 zł”</code>.</li>
</ul>
<p>W <code>Main</code> utwórz dwa konta i przetestuj operacje.</p>`,
      files: [
        { name: 'KontoBankowe.java', code: J`public class KontoBankowe {

}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {

    }
}
` }],
      hints: ['Walidacja kwoty zawsze na początku: <code>if (kwota <= 0) return false;</code>', 'przelej może użyć <code>wyplac</code> i <code>cel.wplac</code> – wpłacaj tylko, gdy wypłata się udała.'],
      solution: [
        { name: 'KontoBankowe.java', code: J`public class KontoBankowe {
    private String numer;
    private double saldo;

    public KontoBankowe(String numer, double saldoPoczatkowe) {
        this.numer = numer;
        this.saldo = saldoPoczatkowe;
    }

    public String getNumer() {
        return numer;
    }

    public double getSaldo() {
        return saldo;
    }

    public boolean wplac(double kwota) {
        if (kwota <= 0) {
            return false;
        }
        saldo += kwota;
        return true;
    }

    public boolean wyplac(double kwota) {
        if (kwota <= 0 || kwota > saldo) {
            return false;
        }
        saldo -= kwota;
        return true;
    }

    public boolean przelej(KontoBankowe cel, double kwota) {
        if (!wyplac(kwota)) {
            return false;
        }
        cel.wplac(kwota);
        return true;
    }

    @Override
    public String toString() {
        return "Konto " + numer + ": " + saldo + " zł";
    }
}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {
        KontoBankowe a = new KontoBankowe("PL01", 100);
        KontoBankowe b = new KontoBankowe("PL02", 20);
        a.wplac(50);
        System.out.println(a);
        a.przelej(b, 70);
        System.out.println(a);
        System.out.println(b);
        System.out.println(a.wyplac(1000));
    }
}
` }],
      checks: [
        CK(CR, 'Pola są prywatne (hermetyzacja)', J`isTrue("numer powinno być private", Modifier.isPrivate(fieldMods("KontoBankowe", "numer")));
isTrue("saldo powinno być private", Modifier.isPrivate(fieldMods("KontoBankowe", "saldo")));`),
        CK(CR, 'Konstruktor i gettery działają', J`KontoBankowe k = new KontoBankowe("PL01", 100);
eq("PL01", k.getNumer()); eq(100.0, k.getSaldo());`),
        CK(MD, 'Brak setterów (pola tylko do odczytu)', J`isFalse("Nie twórz setSaldo", hasMethod("KontoBankowe", "setSaldo"));
isFalse("Nie twórz setNumer", hasMethod("KontoBankowe", "setNumer"));`),
        CK(CR, 'wplac dodaje dodatnią kwotę i zwraca true', J`KontoBankowe k = new KontoBankowe("A", 10);
eq(true, k.wplac(5.5)); eq(15.5, k.getSaldo());`),
        CK(CR, 'wplac odrzuca kwoty ≤ 0', J`KontoBankowe k = new KontoBankowe("A", 10);
eq(false, k.wplac(0)); eq(false, k.wplac(-5)); eq(10.0, k.getSaldo());`),
        CK(CR, 'wyplac zmniejsza saldo, ale nie pozwala wypłacić więcej niż saldo', J`KontoBankowe k = new KontoBankowe("A", 100);
eq(true, k.wyplac(40)); eq(60.0, k.getSaldo());
eq(false, k.wyplac(60.01)); eq(60.0, k.getSaldo());
eq(true, k.wyplac(60)); eq(0.0, k.getSaldo());`),
        CK(MD, 'wyplac odrzuca kwoty ≤ 0', J`KontoBankowe k = new KontoBankowe("A", 100);
eq(false, k.wyplac(-1)); eq(false, k.wyplac(0)); eq(100.0, k.getSaldo());`),
        CK(CR, 'przelej przenosi środki między kontami', J`KontoBankowe a = new KontoBankowe("A", 100), b = new KontoBankowe("B", 5);
eq(true, a.przelej(b, 30));
eq(70.0, a.getSaldo()); eq(35.0, b.getSaldo());`),
        CK(CR, 'przelej przy zbyt małym saldzie nic nie zmienia i zwraca false', J`KontoBankowe a = new KontoBankowe("A", 10), b = new KontoBankowe("B", 5);
eq(false, a.przelej(b, 30));
eq(10.0, a.getSaldo()); eq(5.0, b.getSaldo());`),
        CK(MN, 'toString w formacie „Konto PL01: 100.0 zł”', J`eq("Konto PL01: 100.0 zł", new KontoBankowe("PL01", 100).toString());`),
        CK(MN, 'Main tworzy dwa konta i coś wypisuje', J`isTrue("Utwórz w Main dwa konta", srcCount(src("Main"), "new\\s+KontoBankowe\\s*\\(") >= 2);
isTrue("Main powinien wypisać wyniki", !runMain().trim().isEmpty());`),
      ],
    },
  ],

  quiz: [
    Q('Hermetyzacja w Javie polega na:', ['ukrywaniu pól i udostępnianiu ich przez metody publiczne', 'użyciu słowa kluczowego <code>final</code> przy każdej metodzie', 'dziedziczeniu po klasie abstrakcyjnej', 'zamianie wszystkich pól na statyczne'], 0, 'Pola <code>private</code> + publiczne gettery/settery.', 'herm-gettery'),
    Q('Getter i setter:', ['jedno może istnieć bez drugiego', 'muszą występować zawsze razem', 'mogą zawierać dodatkową logikę (np. walidację)', 'muszą być statyczne'], [0, 2], 'Brak settera = pole tylko do odczytu; setter często waliduje dane.', 'herm-walidacja'),
    Q('Dlaczego wiek lepiej wyliczać z roku urodzenia, niż trzymać w polu?', ['bo wiek zmienia się z czasem, a rok urodzenia nie', 'bo pola typu int zajmują za dużo pamięci', 'bo Java nie pozwala na pole wiek', 'bo wiek jest zawsze statyczny'], 0, 'Wartość wyliczana jest zawsze aktualna.', 'herm-wyliczane'),
    Q('Setter <code>setWiek(int w)</code> powinien przy <code>w = -5</code>:', ['zapisać -5', 'zignorować wartość lub zgłosić błąd', 'zawsze zapisać 0', 'zmienić pole na static'], 1, 'Chronimy spójność danych – odrzucamy lub rzucamy wyjątek.', 'herm-walidacja'),
  ],
});
