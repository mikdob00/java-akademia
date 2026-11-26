'use strict';
/* Pięć sprawdzianów: pytania zamknięte (1 pkt), „co wypisze program?” (2 pkt) i zadania programistyczne (8–12 pkt). */
(function () {
  function O(q, o, a, why, concept, code) { return Q(q, o, a, why, concept, { kind: 'output', code: code }); }
  function add(t) {
    t.questions.forEach(function (q, i) { q.id = t.id + '-q' + i; });
    ACAD.tests.push(t);
  }

  /* ============================================================ S1 */
  add({
    id: 's1', title: 'Sprawdzian 1 – Podstawy, klasy i hermetyzacja', minutes: 60,
    focus: 'Moduły 1–4: składnia, tablice, klasy i obiekty, konstruktory, enum, hermetyzacja, pola i metody statyczne.',
    questions: [
      Q('Który zapis poprawnie tworzy obiekt klasy <code>Student</code> (z konstruktorem bezparametrowym)?', ['<code>Student s = new Student();</code>', '<code>Student s = Student();</code>', '<code>new Student s;</code>', '<code>Student s = new Student;</code>'], 0, 'Obiekt tworzymy operatorem <code>new</code> i wywołaniem konstruktora z nawiasami.', 'klasy-klasa'),
      Q('Co jest prawdą o konstruktorze?', ['ma taką samą nazwę jak klasa', 'ma typ zwracany <code>void</code>', 'jest wywoływany przy użyciu <code>new</code>', 'można go wywołać na istniejącym obiekcie jak zwykłą metodę'], [0, 2], 'Konstruktor nie ma typu zwracanego i uruchamia się przy tworzeniu obiektu.', 'klasy-konstruktor'),
      Q('Klasa <code>Osoba</code> ma tylko konstruktor <code>Osoba(String imie)</code>. Co się stanie przy <code>new Osoba()</code>?', ['obiekt powstanie z imieniem <code>null</code>', 'błąd kompilacji – nie ma konstruktora bezparametrowego', 'wyjątek w czasie działania', 'imię zostanie ustawione na pusty napis'], 1, 'Gdy napiszesz własny konstruktor, domyślny bezparametrowy nie jest już tworzony.', 'klasy-przeciazanie'),
      Q('Pole z modyfikatorem <code>private</code> jest widoczne:', ['tylko w klasie, w której je zadeklarowano', 'w podklasach i w tym samym pakiecie', 'wszędzie', 'tylko w klasie <code>Main</code>'], 0, 'Prywatne = tylko własna klasa.', 'klasy-modyfikatory'),
      Q('Po co robimy pola prywatne i udostępniamy je przez gettery/settery?', ['aby kontrolować dostęp i walidować dane przy zapisie', 'aby program działał szybciej', 'bo Java tego wymaga', 'aby pola były statyczne'], 0, 'To istota hermetyzacji.', 'herm-gettery'),
      Q('Wartość „wiek”, zależną od bieżącego roku, najlepiej:', ['obliczać w metodzie (np. <code>getWiek()</code>) na podstawie roku urodzenia', 'przechowywać w polu i ręcznie aktualizować co rok', 'zapisać jako stałą', 'pobrać od użytkownika przy każdym uruchomieniu'], 0, 'Rok urodzenia jest stały, wiek się zmienia – wyliczamy go dynamicznie.', 'herm-wyliczane'),
      Q('W metodzie statycznej można:', ['użyć pola statycznego', 'użyć pola niestatycznego', 'wywołać inną metodę statyczną', 'użyć <code>this</code>'], [0, 2], 'Do składowych niestatycznych (i <code>this</code>) potrzebny jest konkretny obiekt.', 'stat-zasady'),
      Q('Co spowoduje <code>NullPointerException</code>?', ['wywołanie metody na zmiennej referencyjnej równej <code>null</code>', 'dzielenie liczby całkowitej przez zero', 'przypisanie <code>null</code> do zmiennej typu <code>String</code>', 'odwołanie do indeksu spoza tablicy'], 0, 'Dzielenie przez 0 to <code>ArithmeticException</code>, a zły indeks – <code>ArrayIndexOutOfBoundsException</code>.', 'klasy-referencje'),
      Q('Co zawiera <code>Osoba[] t = new Osoba[3];</code> zaraz po utworzeniu?', ['trzy obiekty <code>Osoba</code> z wartościami domyślnymi', 'trzy wartości <code>null</code>', 'trzy zera', 'nic – tablica jest niepoprawna'], 1, 'Tworzymy tylko tablicę referencji – obiekty trzeba utworzyć osobno.', 'klasy-tablica-obiektow'),
      Q('Jak odwołać się do stałej <code>PROFESOR</code> z enumu <code>Stanowisko</code> (osobny plik)?', ['<code>Stanowisko.PROFESOR</code>', '<code>PROFESOR</code>', '<code>Stanowisko-&gt;PROFESOR</code>', '<code>new Stanowisko().PROFESOR</code>'], 0, 'Nazwa enumu, kropka, stała.', 'klasy-enum'),
      Q('Którą metodą <code>Scanner</code> wczytasz całą linię tekstu?', ['<code>nextLine()</code>', '<code>next()</code>', '<code>readLine()</code>', '<code>line()</code>'], 0, '<code>next()</code> czyta jedno słowo.', 'start-scanner'),
      Q('<code>System.out.println(obiekt)</code> wypisze tekst zwrócony przez metodę:', ['<code>toString()</code>', '<code>equals()</code>', '<code>hashCode()</code>', '<code>getClass()</code>'], 0, 'Dlatego nadpisujemy <code>toString()</code>.', 'klasy-tostring'),
      O('Co wypisze program?', ['0', '7', 'błąd kompilacji', 'null'], 1, 'Zmienne <code>a</code> i <code>b</code> wskazują na ten sam obiekt.', 'klasy-referencje', J`class Licznik { int n; }

public class Main {
    public static void main(String[] args) {
        Licznik a = new Licznik();
        Licznik b = a;
        b.n = 7;
        System.out.println(a.n);
    }
}`),
      O('Co wypisze program?', ['1', '2', '3', '0'], 1, 'Pole <code>c</code> jest statyczne – wspólne dla obu obiektów.', 'stat-pola', J`class K {
    static int c;
    K() { c++; }
}

public class Main {
    public static void main(String[] args) {
        new K();
        new K();
        System.out.println(K.c);
    }
}`),
      O('Co wypisze program?', ['6', '12', '3', '9'], 1, 'Pierwsze wywołanie zmienia <code>x</code> na 6, drugie – na 12.', 'klasy-metody', J`class P {
    int x;
    P(int x) { this.x = x; }
    int podwoj() { x = x * 2; return x; }
}

public class Main {
    public static void main(String[] args) {
        P p = new P(3);
        p.podwoj();
        System.out.println(p.podwoj());
    }
}`),
      O('Co wypisze program?', ['4', '6', '10', '3'], 0, 'Pętla bierze elementy o indeksach 0 i 2: 1 + 3.', 'start-petle', J`public class Main {
    public static void main(String[] args) {
        int[] t = { 1, 2, 3, 4 };
        int s = 0;
        for (int i = 0; i < t.length; i += 2) {
            s += t[i];
        }
        System.out.println(s);
    }
}`),
    ],
    tasks: [
      {
        id: 'z1', title: 'Statystyka tablicy', pts: 8, concepts: ['stat-metody', 'start-tablice'],
        statement: J`<p>W klasie <code>Statystyka</code> napisz publiczne metody <b>statyczne</b>:</p>
<ul><li><code>int suma(int[] t)</code> – suma elementów (pusta tablica → 0),</li>
<li><code>double srednia(int[] t)</code> – średnia arytmetyczna (pusta tablica → 0.0),</li>
<li><code>int ileWiekszychOdSredniej(int[] t)</code> – ile elementów jest <b>większych</b> od średniej (pusta tablica → 0).</li></ul>`,
        files: [{ name: 'Statystyka.java', code: J`public class Statystyka {

}
` }],
        solution: [{ name: 'Statystyka.java', code: J`public class Statystyka {
    public static int suma(int[] t) {
        int s = 0;
        for (int i = 0; i < t.length; i++) {
            s += t[i];
        }
        return s;
    }

    public static double srednia(int[] t) {
        if (t.length == 0) {
            return 0.0;
        }
        return (double) suma(t) / t.length;
    }

    public static int ileWiekszychOdSredniej(int[] t) {
        double sr = srednia(t);
        int n = 0;
        for (int i = 0; i < t.length; i++) {
            if (t[i] > sr) {
                n++;
            }
        }
        return n;
    }
}
` }],
        checks: [
          CK(CR, 'suma', J`eq(10, Statystyka.suma(new int[]{1, 2, 3, 4})); eq(0, Statystyka.suma(new int[0])); eq(-1, Statystyka.suma(new int[]{-3, 2}));`),
          CK(CR, 'srednia jest typu double (bez obcinania części ułamkowej)', J`eq(2.5, Statystyka.srednia(new int[]{1, 2, 3, 4})); eq(1.5, Statystyka.srednia(new int[]{1, 2}));`),
          CK(MD, 'srednia pustej tablicy = 0.0', J`eq(0.0, Statystyka.srednia(new int[0]));`),
          CK(CR, 'ileWiekszychOdSredniej', J`eq(2, Statystyka.ileWiekszychOdSredniej(new int[]{1, 2, 3, 4}));
eq(0, Statystyka.ileWiekszychOdSredniej(new int[]{5, 5, 5}));
eq(1, Statystyka.ileWiekszychOdSredniej(new int[]{1, 1, 10}));`),
          CK(MD, 'ileWiekszychOdSredniej: pusta tablica → 0', J`eq(0, Statystyka.ileWiekszychOdSredniej(new int[0]));`),
          CK(MN, 'Wszystkie metody są publiczne i statyczne', J`for (String n : new String[]{"suma", "srednia", "ileWiekszychOdSredniej"}) { int m = methodMods("Statystyka", n); isTrue(n + " ma być public static", Modifier.isPublic(m) && Modifier.isStatic(m)); }`),
        ],
      },
      {
        id: 'z2', title: 'Produkt z walidacją ceny i licznikiem', pts: 10, concepts: ['herm-walidacja', 'stat-pola'],
        statement: J`<p>Utwórz klasę <code>Produkt</code>:</p>
<ul>
<li>prywatne pola <code>String nazwa</code>, <code>double cena</code>,</li>
<li><b>publiczne statyczne</b> pole <code>int ileProduktow</code> – liczba utworzonych obiektów (zwiększane w konstruktorze),</li>
<li>konstruktor <code>(String nazwa, double cena)</code> – ujemna cena zostaje zamieniona na <code>0</code>,</li>
<li>gettery <code>getNazwa()</code>, <code>getCena()</code>,</li>
<li><code>void setCena(double cena)</code> – <b>ujemna wartość jest ignorowana</b> (cena się nie zmienia),</li>
<li><code>double cenaPoRabacie(int procent)</code> – zwraca <code>cena * (100 - procent) / 100.0</code>,</li>
<li><code>toString()</code> – np. <code>Chleb: 4.5 zl</code> (<code>nazwa: cena zl</code>).</li>
</ul>`,
        files: [{ name: 'Produkt.java', code: J`public class Produkt {

}
` }],
        solution: [{ name: 'Produkt.java', code: J`public class Produkt {
    public static int ileProduktow = 0;
    private String nazwa;
    private double cena;

    public Produkt(String nazwa, double cena) {
        this.nazwa = nazwa;
        if (cena < 0) {
            this.cena = 0;
        } else {
            this.cena = cena;
        }
        ileProduktow++;
    }

    public String getNazwa() {
        return nazwa;
    }

    public double getCena() {
        return cena;
    }

    public void setCena(double cena) {
        if (cena >= 0) {
            this.cena = cena;
        }
    }

    public double cenaPoRabacie(int procent) {
        return cena * (100 - procent) / 100.0;
    }

    @Override
    public String toString() {
        return nazwa + ": " + cena + " zl";
    }
}
` }],
        checks: [
          CK(CR, 'Konstruktor i gettery', J`Produkt p = new Produkt("Chleb", 4.5);
eq("Chleb", p.getNazwa()); eq(4.5, p.getCena());`),
          CK(CR, 'Pola nazwa i cena są prywatne', J`isTrue("nazwa ma być private", Modifier.isPrivate(fieldMods("Produkt", "nazwa"))); isTrue("cena ma być private", Modifier.isPrivate(fieldMods("Produkt", "cena")));`),
          CK(CR, 'Konstruktor: ujemna cena → 0', J`eq(0.0, new Produkt("X", -5).getCena());`),
          CK(CR, 'setCena ignoruje wartości ujemne i przyjmuje poprawne', J`Produkt p = new Produkt("X", 10);
p.setCena(-1); eq(10.0, p.getCena());
p.setCena(25); eq(25.0, p.getCena());
p.setCena(0); eq(0.0, p.getCena());`),
          CK(CR, 'cenaPoRabacie', J`eq(150.0, new Produkt("X", 200).cenaPoRabacie(25)); eq(40.0, new Produkt("Y", 80).cenaPoRabacie(50)); eq(80.0, new Produkt("Z", 80).cenaPoRabacie(0));`),
          CK(MD, 'ileProduktow: statyczne, publiczne i zlicza obiekty', J`isTrue("ileProduktow ma być public static", Modifier.isPublic(fieldMods("Produkt", "ileProduktow")) && Modifier.isStatic(fieldMods("Produkt", "ileProduktow")));
int przed = Produkt.ileProduktow; new Produkt("A", 1); new Produkt("B", 2);
eq(przed + 2, Produkt.ileProduktow);`),
          CK(MD, 'toString: „nazwa: cena zl”', J`eq("Chleb: 4.5 zl", new Produkt("Chleb", 4.5).toString());`),
        ],
      },
    ],
  });

  /* ============================================================ S2 */
  add({
    id: 's2', title: 'Sprawdzian 2 – Dziedziczenie i polimorfizm', minutes: 60,
    focus: 'Moduły 5–6: extends, super, kolejność konstruktorów, widoczność pól, nadpisywanie, upcasting/downcasting, instanceof.',
    questions: [
      Q('Którego słowa kluczowego używamy do dziedziczenia po klasie?', ['<code>extends</code>', '<code>implements</code>', '<code>inherits</code>', '<code>super</code>'], 0, '<code>class B extends A</code>.', 'dz-extends'),
      Q('Co jest prawdą o dziedziczeniu w Javie?', ['klasa może dziedziczyć po wielu klasach naraz', 'klasa dziedziczy bezpośrednio tylko po jednej klasie', 'z jednej klasy może dziedziczyć wiele klas'], [1, 2], 'Brak wielodziedziczenia klas, ale hierarchia może się rozgałęziać.', 'dz-extends'),
      Q('Który konstruktor wykona się <b>jako pierwszy</b> przy <code>new Pochodna()</code>?', ['konstruktor klasy bazowej', 'konstruktor klasy pochodnej', 'zależy od kolejności plików', 'żaden – konstruktory się nie dziedziczą'], 0, 'Zawsze od nadklasy w dół.', 'dz-konstruktory'),
      Q('Wywołanie <code>super(...)</code> w konstruktorze musi być:', ['pierwszą instrukcją', 'ostatnią instrukcją', 'umieszczone gdziekolwiek', 'w metodzie <code>main</code>'], 0, 'Najpierw trzeba utworzyć „część” nadklasy.', 'dz-konstruktory'),
      Q('Czy klasa pochodna widzi pole <code>private</code> nadklasy?', ['nie', 'tak', 'tak, przez <code>super.pole</code>', 'tak, ale tylko do odczytu'], 0, 'Dostęp tylko przez metody (np. getter) nadklasy.', 'dz-dostep'),
      Q('Co robi adnotacja <code>@Override</code>?', ['zmienia działanie metody', 'informuje kompilator, że metoda nadpisuje metodę nadklasy – i pozwala wykryć literówki', 'jest obowiązkowa przy nadpisywaniu', 'ukrywa metodę'], 1, 'Nie zmienia logiki, a jedynie sprawdza poprawność nadpisania.', 'dz-override'),
      Q('Które przypisania są poprawne (<code>Pies</code> i <code>Kot</code> dziedziczą po <code>Zwierze</code>)?', ['<code>Zwierze z = new Pies();</code>', '<code>Pies p = new Zwierze();</code>', '<code>Zwierze z = new Kot();</code>', '<code>Pies p = new Kot();</code>'], [0, 2], 'Upcasting jest niejawny; pozostałe wymagałyby rzutowania (i nie mają sensu).', 'pol-upcast'),
      Q('Co się stanie, gdy downcasting się nie powiedzie?', ['zostanie wyrzucony wyjątek <code>ClassCastException</code>', 'linijka zostanie pominięta', 'zostanie zwrócony <code>null</code>', 'błąd kompilacji'], 0, 'Dlatego przed rzutowaniem w dół sprawdzamy <code>instanceof</code>.', 'pol-downcast'),
      Q('Co zwróci <code>null instanceof Zwierze</code>?', ['<code>false</code>', '<code>true</code>', 'wyjątek <code>NullPointerException</code>', 'błąd kompilacji'], 0, 'Dla <code>null</code> zawsze <code>false</code>.', 'pol-downcast'),
      Q('Metody statyczne o tej samej sygnaturze w klasie pochodnej są:', ['nadpisywane polimorficznie', 'przesłaniane – wynik zależy od typu zmiennej', 'zabronione', 'automatycznie zamieniane na niestatyczne'], 1, 'Statyczne nie są polimorficzne.', 'pol-dynamiczne'),
      Q('Metoda <code>toString()</code> jest zdefiniowana w klasie:', ['<code>Object</code>', '<code>String</code>', '<code>Main</code>', '<code>System</code>'], 0, 'Każda klasa dziedziczy ją po <code>Object</code>.', 'dz-override'),
      Q('Jak w klasie pochodnej wywołać bazową implementację metody <code>opis()</code>?', ['<code>super.opis()</code>', '<code>base.opis()</code>', '<code>parent.opis()</code>', '<code>this.super.opis()</code>'], 0, '<code>base</code> to C#.', 'dz-override'),
      O('Co wypisze program?', ['O1 S', 'S O1', 'O1', 'S'], 0, 'Najpierw konstruktor nadklasy (z parametrem „1”), potem podklasy.', 'dz-konstruktory', J`class Osoba {
    Osoba(String s) { System.out.print("O" + s + " "); }
}
class Student extends Osoba {
    Student() {
        super("1");
        System.out.print("S");
    }
}

public class Main {
    public static void main(String[] args) {
        new Student();
    }
}`),
      O('Co wypisze program?', ['Hau<br>Miau<br>...', '...<br>...<br>...', 'Hau<br>Hau<br>Hau', 'błąd kompilacji'], 0, 'Dla każdego elementu wykona się nadpisana metoda z jego rzeczywistej klasy.', 'pol-dynamiczne', J`class Zwierze {
    String glos() { return "..."; }
}
class Pies extends Zwierze {
    @Override
    String glos() { return "Hau"; }
}
class Kot extends Zwierze {
    @Override
    String glos() { return "Miau"; }
}

public class Main {
    public static void main(String[] args) {
        Zwierze[] t = { new Pies(), new Kot(), new Zwierze() };
        for (Zwierze z : t) {
            System.out.println(z.glos());
        }
    }
}`),
      O('Co wypisze program?', ['A B', 'B B', 'A A', 'B A'], 0, 'Pola nie są polimorficzne: <code>z.x</code> zależy od typu zmiennej, a po rzutowaniu na <code>B</code> widzimy pole z klasy <code>B</code>.', 'pol-dynamiczne', J`class A { String x = "A"; }
class B extends A { String x = "B"; }

public class Main {
    public static void main(String[] args) {
        A z = new B();
        System.out.println(z.x + " " + ((B) z).x);
    }
}`),
      O('Co wypisze program?', ['ABC', 'CBA', 'C', 'A'], 0, '<code>super.f()</code> w każdej klasie dopisuje wynik klasy bazowej: „A” + „B” + „C”.', 'dz-override', J`class A { String f() { return "A"; } }
class B extends A { String f() { return super.f() + "B"; } }
class C extends B { String f() { return super.f() + "C"; } }

public class Main {
    public static void main(String[] args) {
        System.out.println(new C().f());
    }
}`),
    ],
    tasks: [
      {
        id: 'z1', title: 'Pojazdy i garaż', pts: 10, concepts: ['dz-override', 'pol-dynamiczne'],
        statement: J`<ol>
<li><code>Pojazd</code> – prywatne pola <code>String nazwa</code>, <code>int predkosc</code>; konstruktor <code>(nazwa, predkosc)</code>; gettery <code>getNazwa()</code>, <code>getPredkosc()</code>; <code>toString()</code> zwraca <code>nazwa predkosc</code>, np. <code>Fiat 120</code>.</li>
<li><code>Samochod extends Pojazd</code> – dodatkowe pole <code>int liczbaDrzwi</code>; konstruktor <code>(nazwa, predkosc, liczbaDrzwi)</code> (użyj <code>super</code>); <code>getLiczbaDrzwi()</code>; <code>toString()</code> = <code>toString()</code> nadklasy + spacja + liczba drzwi (np. <code>Fiat 120 4</code>).</li>
<li><code>Garaz</code> – publiczna metoda statyczna <code>Pojazd najszybszy(Pojazd[] t)</code> zwraca pojazd o największej prędkości (przy remisie – pierwszy z nich); dla pustej tablicy <code>null</code>.</li>
</ol>`,
        files: [{ name: 'Pojazd.java', code: J`public class Pojazd {

}
` }, { name: 'Samochod.java', code: J`public class Samochod {

}
` }, { name: 'Garaz.java', code: J`public class Garaz {

}
` }],
        solution: [
          { name: 'Pojazd.java', code: J`public class Pojazd {
    private String nazwa;
    private int predkosc;

    public Pojazd(String nazwa, int predkosc) {
        this.nazwa = nazwa;
        this.predkosc = predkosc;
    }

    public String getNazwa() {
        return nazwa;
    }

    public int getPredkosc() {
        return predkosc;
    }

    @Override
    public String toString() {
        return nazwa + " " + predkosc;
    }
}
` },
          { name: 'Samochod.java', code: J`public class Samochod extends Pojazd {
    private int liczbaDrzwi;

    public Samochod(String nazwa, int predkosc, int liczbaDrzwi) {
        super(nazwa, predkosc);
        this.liczbaDrzwi = liczbaDrzwi;
    }

    public int getLiczbaDrzwi() {
        return liczbaDrzwi;
    }

    @Override
    public String toString() {
        return super.toString() + " " + liczbaDrzwi;
    }
}
` },
          { name: 'Garaz.java', code: J`public class Garaz {
    public static Pojazd najszybszy(Pojazd[] t) {
        Pojazd naj = null;
        for (int i = 0; i < t.length; i++) {
            if (t[i] != null && (naj == null || t[i].getPredkosc() > naj.getPredkosc())) {
                naj = t[i];
            }
        }
        return naj;
    }
}
` }],
        checks: [
          CK(CR, 'Pojazd: konstruktor, gettery i toString', J`Pojazd p = new Pojazd("Fiat", 120);
eq("Fiat", p.getNazwa()); eq(120, p.getPredkosc()); eq("Fiat 120", p.toString());`),
          CK(MD, 'Pojazd: pola prywatne', J`isTrue("nazwa ma być private", Modifier.isPrivate(fieldMods("Pojazd", "nazwa"))); isTrue("predkosc ma być private", Modifier.isPrivate(fieldMods("Pojazd", "predkosc")));`),
          CK(CR, 'Samochod dziedziczy po Pojazd i ustawia wszystkie pola', J`isTrue("Samochod ma dziedziczyć po Pojazd", isSubclass("Samochod", "Pojazd"));
Samochod s = new Samochod("Fiat", 120, 4);
eq("Fiat", s.getNazwa()); eq(120, s.getPredkosc()); eq(4, s.getLiczbaDrzwi());`),
          CK(CR, 'Samochod.toString = toString nadklasy + liczba drzwi', J`eq("Fiat 120 4", new Samochod("Fiat", 120, 4).toString());`),
          CK(CR, 'Garaz.najszybszy: wskazuje najszybszy pojazd', J`Pojazd a = new Pojazd("A", 50), b = new Samochod("B", 150, 4), c = new Pojazd("C", 100);
Pojazd[] t = { a, b, c };
isTrue("powinien zostać wskazany B", Garaz.najszybszy(t) == b);`),
          CK(MD, 'Garaz.najszybszy: remis → pierwszy, pusta tablica → null', J`Pojazd a = new Pojazd("A", 100), b = new Pojazd("B", 100);
isTrue("przy remisie pierwszy", Garaz.najszybszy(new Pojazd[]{a, b}) == a);
isTrue("pusta tablica → null", Garaz.najszybszy(new Pojazd[0]) == null);`),
          CK(MN, 'Użyto super(...), super.toString() i @Override', J`isTrue("Samochod: super(...)", srcHas("Samochod", "super\\s*\\("));
isTrue("Samochod: super.toString()", srcHas("Samochod", "super\\s*\\.\\s*toString"));
isTrue("@Override", srcHas("Samochod", "@Override"));`),
        ],
      },
      {
        id: 'z2', title: 'Magazyn: instanceof i downcasting', pts: 8, concepts: ['pol-downcast', 'pol-upcast'],
        statement: J`<p>Klasy <code>Przedmiot</code>, <code>Narzedzie</code> i <code>Material</code> (z polem <code>ilosc</code> i getterem <code>getIlosc()</code>) są gotowe. W klasie <code>Magazyn</code> napisz publiczne metody statyczne:</p>
<ul><li><code>int policzMaterialy(Przedmiot[] t)</code> – suma pól <code>ilosc</code> wszystkich elementów typu <code>Material</code> (inne przedmioty i elementy <code>null</code> pomijamy),</li>
<li><code>int ileNarzedzi(Przedmiot[] t)</code> – liczba elementów typu <code>Narzedzie</code>.</li></ul>`,
        files: [
          { name: 'Przedmiot.java', code: J`public class Przedmiot {
    protected String nazwa;

    public Przedmiot(String nazwa) {
        this.nazwa = nazwa;
    }
}
` },
          { name: 'Narzedzie.java', code: J`public class Narzedzie extends Przedmiot {
    public Narzedzie(String nazwa) {
        super(nazwa);
    }
}
` },
          { name: 'Material.java', code: J`public class Material extends Przedmiot {
    private int ilosc;

    public Material(String nazwa, int ilosc) {
        super(nazwa);
        this.ilosc = ilosc;
    }

    public int getIlosc() {
        return ilosc;
    }
}
` },
          { name: 'Magazyn.java', code: J`public class Magazyn {

}
` }],
        solution: [
          { name: 'Przedmiot.java', code: J`public class Przedmiot {
    protected String nazwa;

    public Przedmiot(String nazwa) {
        this.nazwa = nazwa;
    }
}
` },
          { name: 'Narzedzie.java', code: J`public class Narzedzie extends Przedmiot {
    public Narzedzie(String nazwa) {
        super(nazwa);
    }
}
` },
          { name: 'Material.java', code: J`public class Material extends Przedmiot {
    private int ilosc;

    public Material(String nazwa, int ilosc) {
        super(nazwa);
        this.ilosc = ilosc;
    }

    public int getIlosc() {
        return ilosc;
    }
}
` },
          { name: 'Magazyn.java', code: J`public class Magazyn {
    public static int policzMaterialy(Przedmiot[] t) {
        int suma = 0;
        for (int i = 0; i < t.length; i++) {
            if (t[i] instanceof Material) {
                Material m = (Material) t[i];
                suma += m.getIlosc();
            }
        }
        return suma;
    }

    public static int ileNarzedzi(Przedmiot[] t) {
        int n = 0;
        for (int i = 0; i < t.length; i++) {
            if (t[i] instanceof Narzedzie) {
                n++;
            }
        }
        return n;
    }
}
` }],
        checks: [
          CK(CR, 'policzMaterialy sumuje ilości tylko materiałów', J`Przedmiot[] t = { new Material("drewno", 5), new Narzedzie("mlotek"), new Material("stal", 7), new Przedmiot("cos") };
eq(12, Magazyn.policzMaterialy(t));`),
          CK(CR, 'null i pusta tablica nie powodują wyjątku', J`eq(0, Magazyn.policzMaterialy(new Przedmiot[0]));
eq(3, Magazyn.policzMaterialy(new Przedmiot[]{ null, new Material("a", 3), null }));
eq(0, Magazyn.ileNarzedzi(new Przedmiot[]{ null, null }));`),
          CK(CR, 'ileNarzedzi liczy narzędzia', J`Przedmiot[] t = { new Narzedzie("a"), new Material("b", 1), new Narzedzie("c") };
eq(2, Magazyn.ileNarzedzi(t));`),
          CK(MN, 'Użyto instanceof i downcastingu (Material)', J`isTrue("Użyj instanceof", srcHas("Magazyn", "instanceof"));
isTrue("Użyj rzutowania (Material)", srcHas("Magazyn", "\\(\\s*Material\\s*\\)"));`),
        ],
      },
    ],
  });

  /* ============================================================ S3 */
  add({
    id: 's3', title: 'Sprawdzian 3 – Klasy abstrakcyjne i wyjątki', minutes: 60,
    focus: 'Moduł 7: abstract, metody abstrakcyjne, try/catch/finally, własne wyjątki, throw/throws.',
    questions: [
      Q('Co jest prawdą o klasie abstrakcyjnej?', ['nie można utworzyć jej instancji', 'można utworzyć jej instancję', 'nie może mieć konstruktora', 'nie można z niej dziedziczyć'], 0, 'Dziedziczyć można – po to jest tworzona.', 'abs-klasa'),
      Q('Co jest prawdą o metodzie abstrakcyjnej?', ['nie ma ciała', 'ma ciało', 'można ją deklarować w każdej klasie', 'można ją deklarować tylko w klasach abstrakcyjnych'], [0, 3], 'Metoda abstrakcyjna kończy się średnikiem i może być tylko w klasie abstrakcyjnej.', 'abs-metoda'),
      Q('Klasa <b>nieabstrakcyjna</b> dziedzicząca po klasie abstrakcyjnej:', ['musi zaimplementować wszystkie metody abstrakcyjne', 'nie musi nic implementować', 'musi sama być abstrakcyjna', 'nie może mieć konstruktora'], 0, 'Inaczej nie da się utworzyć jej obiektu.', 'abs-metoda'),
      Q('Klasa abstrakcyjna może zawierać:', ['konstruktor', 'pola', 'zwykłe metody', 'metody abstrakcyjne'], [0, 1, 2, 3], 'Wszystkie wymienione.', 'abs-klasa'),
      Q('Jaki wyjątek wystąpi przy nieudanym rzutowaniu w dół (np. <code>Customer</code> → <code>Employee</code>)?', ['<code>ClassCastException</code>', '<code>ArithmeticException</code>', '<code>NullPointerException</code>', '<code>IOException</code>'], 0, 'Błąd rzutowania typów.', 'pol-downcast'),
      Q('Jaki wyjątek wystąpi przy <code>int x = 5 / 0;</code>?', ['<code>ArithmeticException</code>', '<code>NumberFormatException</code>', '<code>IllegalStateException</code>', 'żaden – wynik to nieskończoność'], 0, 'Dzielenie całkowite przez zero.', 'wyj-trycatch'),
      Q('Które ułożenie bloków <code>catch</code> jest poprawne?', ['najpierw <code>catch (ArithmeticException e)</code>, potem <code>catch (Exception e)</code>', 'najpierw <code>catch (Exception e)</code>, potem <code>catch (ArithmeticException e)</code>', 'kolejność nie ma znaczenia'], 0, 'Od najbardziej szczegółowego do ogólnego – inaczej błąd kompilacji.', 'wyj-trycatch'),
      Q('Blok <code>finally</code> wykona się:', ['zawsze, niezależnie od tego, czy wystąpił wyjątek', 'tylko gdy wystąpił wyjątek', 'tylko gdy wyjątku nie było', 'nigdy, jeśli w <code>try</code> jest <code>return</code>'], 0, 'To miejsce na zwalnianie zasobów i końcową logikę.', 'wyj-trycatch'),
      Q('Co zadeklaruje w nagłówku metody, że może ona rzucić wyjątek kontrolowany?', ['<code>throws</code>', '<code>throw</code>', '<code>catch</code>', '<code>try</code>'], 0, '<code>void f() throws MojWyjatek</code>; <code>throw</code> to instrukcja wyrzucenia.', 'wyj-wlasne'),
      Q('Własny wyjątek kontrolowany dziedziczy po klasie:', ['<code>Exception</code>', '<code>Object</code> (bez <code>extends</code>)', '<code>Error</code>', '<code>Main</code>'], 0, '<code>class MojWyjatek extends Exception</code>.', 'wyj-wlasne'),
      Q('Konstruktor wyrzucił wyjątek (instrukcja <code>throw</code>). Co z obiektem?', ['obiekt nie zostaje utworzony', 'powstaje z wartościami domyślnymi', 'powstaje, a wyjątek jest ignorowany', 'powstaje, ale program się kończy'], 0, 'Konstruktor nie dokończył działania.', 'wyj-wlasne'),
      Q('Jeśli w bloku <code>try</code> wyjątek poleci w linii 11, to linia 12 (też w <code>try</code>):', ['nie wykona się', 'wykona się po bloku catch', 'wykona się przed linią 11', 'wykona się zawsze'], 0, 'Po wyjątku następuje skok do <code>catch</code>.', 'wyj-trycatch'),
      O('Co wypisze program?', ['1234', '124', '134', '1324'], 0, '„1” przed wyjątkiem, „2” w <code>catch</code>, „3” w <code>finally</code> i „4” po całym bloku.', 'wyj-trycatch', J`public class Main {
    public static void main(String[] args) {
        try {
            System.out.print("1");
            throw new RuntimeException("x");
        } catch (RuntimeException e) {
            System.out.print("2");
        } finally {
            System.out.print("3");
        }
        System.out.print("4");
    }
}`),
      O('Co wypisze program?', ['/ by zero', 'ArithmeticException', 'null', 'zero'], 0, '<code>getMessage()</code> dla dzielenia przez zero zwraca „/ by zero”.', 'wyj-trycatch', J`public class Main {
    public static void main(String[] args) {
        try {
            int x = 10 / 0;
        } catch (ArithmeticException e) {
            System.out.println(e.getMessage());
        }
    }
}`),
      O('Co wypisze program?', ['4.0<br>6.0', '4<br>6', '6.0<br>4.0', 'błąd kompilacji'], 0, 'Każda figura liczy pole po swojemu (metoda abstrakcyjna z nadklasy).', 'abs-metoda', J`abstract class Figura {
    abstract double pole();
}
class Kwadrat extends Figura {
    double a;
    Kwadrat(double a) { this.a = a; }
    double pole() { return a * a; }
}
class Prostokat extends Figura {
    double a, b;
    Prostokat(double a, double b) { this.a = a; this.b = b; }
    double pole() { return a * b; }
}

public class Main {
    public static void main(String[] args) {
        Figura[] t = { new Kwadrat(2), new Prostokat(2, 3) };
        for (Figura f : t) {
            System.out.println(f.pole());
        }
    }
}`),
      O('Co wypisze program?', ['acd', 'abcd', 'ad', 'acbd'], 0, 'Wyjątek z metody <code>a()</code> przerywa <code>try</code> – „b” się nie wypisze; „c” z <code>catch</code>, „d” po bloku.', 'wyj-trycatch', J`public class Main {
    static void a() {
        System.out.print("a");
        throw new IllegalStateException();
    }

    public static void main(String[] args) {
        try {
            a();
            System.out.print("b");
        } catch (IllegalStateException e) {
            System.out.print("c");
        }
        System.out.print("d");
    }
}`),
    ],
    tasks: [
      {
        id: 'z1', title: 'Konta bankowe', pts: 12, concepts: ['abs-metoda', 'wyj-wlasne'],
        statement: J`<ol>
<li><code>BrakSrodkowException</code> – własny wyjątek kontrolowany (konstruktor przyjmuje <code>String message</code>).</li>
<li><code>Konto</code> – klasa <b>abstrakcyjna</b>: prywatne pole <code>double saldo</code>; konstruktor <code>(double saldo)</code>; <code>double getSaldo()</code>; <b>abstrakcyjna</b> metoda <code>public abstract double oplata()</code>; metoda <code>void wyplac(double kwota) throws BrakSrodkowException</code>: jeśli <code>kwota + oplata()</code> jest większa niż saldo – wyrzuca <code>BrakSrodkowException</code> z komunikatem <code>Brak srodkow</code> (saldo bez zmian); w przeciwnym razie zmniejsza saldo o <code>kwota + oplata()</code>.</li>
<li><code>KontoStandard extends Konto</code> – opłata <code>2.0</code>; <code>KontoPremium extends Konto</code> – opłata <code>0.0</code>. Oba mają konstruktor <code>(double saldo)</code>.</li>
</ol>`,
        files: [{ name: 'BrakSrodkowException.java', code: J`public class BrakSrodkowException {

}
` }, { name: 'Konto.java', code: J`public class Konto {

}
` }, { name: 'KontoStandard.java', code: J`public class KontoStandard {

}
` }, { name: 'KontoPremium.java', code: J`public class KontoPremium {

}
` }],
        solution: [
          { name: 'BrakSrodkowException.java', code: J`public class BrakSrodkowException extends Exception {
    public BrakSrodkowException(String message) {
        super(message);
    }
}
` },
          { name: 'Konto.java', code: J`public abstract class Konto {
    private double saldo;

    public Konto(double saldo) {
        this.saldo = saldo;
    }

    public double getSaldo() {
        return saldo;
    }

    public abstract double oplata();

    public void wyplac(double kwota) throws BrakSrodkowException {
        double razem = kwota + oplata();
        if (razem > saldo) {
            throw new BrakSrodkowException("Brak srodkow");
        }
        saldo -= razem;
    }
}
` },
          { name: 'KontoStandard.java', code: J`public class KontoStandard extends Konto {
    public KontoStandard(double saldo) {
        super(saldo);
    }

    @Override
    public double oplata() {
        return 2.0;
    }
}
` },
          { name: 'KontoPremium.java', code: J`public class KontoPremium extends Konto {
    public KontoPremium(double saldo) {
        super(saldo);
    }

    @Override
    public double oplata() {
        return 0.0;
    }
}
` }],
        checks: [
          CK(CR, 'Konto jest klasą abstrakcyjną z abstrakcyjną metodą oplata()', J`isTrue("Konto ma być abstract", Modifier.isAbstract(cls("Konto").getModifiers()));
isTrue("oplata() ma być abstract", Modifier.isAbstract(method("Konto", "oplata").getModifiers()));`),
          CK(CR, 'BrakSrodkowException jest wyjątkiem kontrolowanym', J`Class<?> c = cls("BrakSrodkowException");
isTrue("Ma dziedziczyć po Exception", Exception.class.isAssignableFrom(c));
isFalse("Nie po RuntimeException", RuntimeException.class.isAssignableFrom(c));`),
          CK(CR, 'KontoStandard i KontoPremium dziedziczą po Konto; opłaty 2.0 i 0.0', J`isTrue("KontoStandard ma dziedziczyć po Konto", isSubclass("KontoStandard", "Konto"));
isTrue("KontoPremium ma dziedziczyć po Konto", isSubclass("KontoPremium", "Konto"));
eq(2.0, call(make("KontoStandard", 100.0), "oplata")); eq(0.0, call(make("KontoPremium", 100.0), "oplata"));`),
          CK(CR, 'wyplac: zmniejsza saldo o kwotę + opłatę', J`Object s = make("KontoStandard", 100.0);
call(s, "wyplac", 50.0);
eq(48.0, call(s, "getSaldo"));
Object p = make("KontoPremium", 100.0);
call(p, "wyplac", 30.0);
eq(70.0, call(p, "getSaldo"));`),
          CK(CR, 'wyplac: przy braku środków rzuca wyjątek z komunikatem i nie zmienia salda', J`Object s = make("KontoStandard", 100.0);
Throwable e = thrown(() -> call(s, "wyplac", 99.0));
isTrue("Oczekiwano BrakSrodkowException, jest: " + e, e != null && isInstanceOfName(e, "BrakSrodkowException"));
eq("Brak srodkow", e.getMessage());
eq(100.0, call(s, "getSaldo"));`),
          CK(MD, 'Granica: Premium może wypłacić całe saldo, Standard nie', J`Object p = make("KontoPremium", 100.0);
noThrow(() -> call(p, "wyplac", 100.0));
eq(0.0, call(p, "getSaldo"));
Object s = make("KontoStandard", 100.0);
noThrow(() -> call(s, "wyplac", 98.0));
eq(0.0, call(s, "getSaldo"));`),
          CK(MD, 'wyplac deklaruje throws BrakSrodkowException; saldo jest prywatne', J`boolean ok = false;
for (Class<?> t : method("Konto", "wyplac", double.class).getExceptionTypes()) if (t.getSimpleName().equals("BrakSrodkowException")) ok = true;
isTrue("wyplac powinna deklarować throws BrakSrodkowException", ok);
isTrue("saldo ma być private", Modifier.isPrivate(fieldMods("Konto", "saldo")));`),
        ],
      },
      {
        id: 'z2', title: 'Bezpieczne parsowanie liczb', pts: 8, concepts: ['wyj-trycatch'],
        statement: J`<p>W klasie <code>Parser</code> napisz:</p>
<ul>
<li>publiczne statyczne pole <code>int bledy = 0</code>,</li>
<li><code>boolean czyLiczba(String s)</code> – <code>true</code>, gdy <code>Integer.parseInt(s)</code> się powiedzie, <code>false</code>, gdy rzuci <code>NumberFormatException</code> (obsłuż ją <code>try/catch</code>),</li>
<li><code>int sumaPoprawnych(String[] t)</code> – suma wszystkich elementów, które są poprawnymi liczbami całkowitymi (także ujemnymi); każdy niepoprawny element <b>zwiększa</b> <code>bledy</code> o 1 i jest pomijany.</li>
</ul>
<p>Obie metody publiczne i statyczne.</p>`,
        files: [{ name: 'Parser.java', code: J`public class Parser {

}
` }],
        solution: [{ name: 'Parser.java', code: J`public class Parser {
    public static int bledy = 0;

    public static boolean czyLiczba(String s) {
        try {
            Integer.parseInt(s);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public static int sumaPoprawnych(String[] t) {
        int suma = 0;
        for (int i = 0; i < t.length; i++) {
            try {
                suma += Integer.parseInt(t[i]);
            } catch (NumberFormatException e) {
                bledy++;
            }
        }
        return suma;
    }
}
` }],
        checks: [
          CK(CR, 'czyLiczba rozpoznaje liczby', J`eq(true, Parser.czyLiczba("12")); eq(true, Parser.czyLiczba("-5")); eq(true, Parser.czyLiczba("0"));`),
          CK(CR, 'czyLiczba nie rzuca wyjątku dla niepoprawnych napisów', J`eq(false, Parser.czyLiczba("abc")); eq(false, Parser.czyLiczba("")); eq(false, Parser.czyLiczba("1.5")); eq(false, Parser.czyLiczba("12a"));`),
          CK(CR, 'sumaPoprawnych sumuje tylko poprawne', J`eq(2, Parser.sumaPoprawnych(new String[]{"1", "x", "3", "-2"}));
eq(0, Parser.sumaPoprawnych(new String[0]));
eq(10, Parser.sumaPoprawnych(new String[]{"10"}));`),
          CK(MD, 'bledy rośnie o liczbę niepoprawnych elementów', J`int przed = Parser.bledy;
Parser.sumaPoprawnych(new String[]{"a", "5", "b", "c"});
eq(przed + 3, Parser.bledy);`),
          CK(MN, 'Użyto try/catch z NumberFormatException', J`isTrue("Użyj try/catch", srcHas("Parser", "\\btry\\b") && srcHas("Parser", "\\bcatch\\b"));
isTrue("Złap NumberFormatException", srcHas("Parser", "NumberFormatException"));`),
        ],
      },
    ],
  });

  /* ============================================================ S4 */
  add({
    id: 's4', title: 'Sprawdzian 4 – Interfejsy, equals/hashCode, sortowanie', minutes: 60,
    focus: 'Moduły 8–10: interface, default, implements, equals/hashCode, Comparable, Comparator.',
    questions: [
      Q('Co jest prawdą o metodach w interfejsie (bez słów <code>default</code>, <code>static</code>, <code>private</code>)?', ['są domyślnie publiczne', 'są domyślnie abstrakcyjne', 'mają ciało', 'są domyślnie prywatne'], [0, 1], 'Deklarujemy tylko sygnaturę.', 'if-podstawy'),
      Q('Pola zadeklarowane w interfejsie są domyślnie:', ['<code>public static final</code>', '<code>private</code>', 'zwykłe polami instancyjnymi', '<code>protected</code>'], 0, 'To stałe.', 'if-default'),
      Q('Ile interfejsów może zaimplementować jedna klasa?', ['zero lub wiele', 'najwyżej jeden', 'dokładnie dwa', 'tyle, ile ma metod'], 0, 'Nie ma limitu.', 'if-wiele'),
      Q('Klasa abstrakcyjna implementuje interfejs z metodą abstrakcyjną <code>f()</code>. Czy musi ją nadpisać?', ['nie – zrobi to pierwsza klasa nieabstrakcyjna niżej', 'tak, zawsze', 'nie, a podklasy też nie muszą', 'tak, w klasie nieabstrakcyjnej – a abstrakcyjna nie'], 0, 'Obowiązek „przesuwa się” do klasy konkretnej.', 'if-wiele'),
      Q('Czy klasa musi nadpisać metodę <code>default</code> interfejsu?', ['nie, ale może', 'tak', 'nie, nie może jej nadpisać', 'tylko gdy jest abstrakcyjna'], 0, 'Ma gotową implementację.', 'if-default'),
      Q('Co robi domyślna implementacja <code>equals()</code> z klasy <code>Object</code>?', ['porównuje referencje (tak jak <code>==</code>)', 'porównuje wszystkie pola', 'zawsze zwraca <code>true</code>', 'zawsze zwraca <code>false</code>'], 0, 'Dlatego nadpisujemy ją w klasach do porównywania stanu.', 'eq-porownanie'),
      Q('Jeśli <code>a.equals(b)</code> zwraca <code>true</code>, to:', ['<code>a.hashCode()</code> musi być równe <code>b.hashCode()</code>', 'hasze mogą być dowolne', 'hasze muszą się różnić', '<code>a == b</code> musi być <code>true</code>'], 0, 'Kontrakt equals/hashCode.', 'eq-hashcode'),
      Q('Co powinno zwrócić <code>a.compareTo(b)</code>, gdy <code>a</code> jest mniejsze od <code>b</code>?', ['liczbę ujemną', '0', 'liczbę dodatnią', '<code>false</code>'], 0, 'Ujemną; 0 – równe; dodatnią – większe.', 'sort-comparable'),
      Q('Jak posortujesz tablicę <code>t</code> według komparatora <code>PoRoku</code>?', ['<code>Arrays.sort(t, new PoRoku())</code>', '<code>Arrays.sort(t)</code>', '<code>t.sort(PoRoku)</code>', '<code>Comparator.sort(t)</code>'], 0, 'Komparator to drugi argument.', 'sort-comparator'),
      Q('Dlaczego komparator zwykle umieszczamy w <b>statycznej</b> klasie wewnętrznej?', ['aby używać go bez tworzenia obiektu klasy zewnętrznej', 'bo Java tego wymaga', 'aby skrócić kod', 'aby ukryć metodę compare'], 0, 'Komparator nie potrzebuje instancji klasy zewnętrznej.', 'sort-comparator'),
      Q('Które zapisy deklaracji klasy są poprawne?', ['<code>class A extends B implements C, D</code>', '<code>class A implements C extends B</code>', '<code>class A implements C, D</code>', '<code>class A extends B, C</code> (B, C – klasy)'], [0, 2], 'Najpierw <code>extends</code>, potem <code>implements</code>; po <code>extends</code> tylko jedna klasa.', 'if-wiele'),
      Q('Czym jest <code>Integer</code>?', ['klasą opakowującą typ <code>int</code>, implementującą <code>Comparable&lt;Integer&gt;</code>', 'synonimem typu <code>int</code>', 'interfejsem', 'klasą abstrakcyjną'], 0, 'Daje metody dla liczb całkowitych, np. <code>compareTo</code>.', 'sort-comparable'),
      O('Co wypisze program?', ['IB', 'II', 'BB', 'BI'], 0, '<code>A</code> używa metody domyślnej („I”), <code>B</code> ją nadpisuje („B”).', 'if-default', J`interface I {
    default String f() { return "I"; }
}
class A implements I { }
class B implements I {
    public String f() { return "B"; }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new A().f() + new B().f());
    }
}`),
      O('Co wypisze program?', ['false true', 'true true', 'false false', 'true false'], 0, 'Różne obiekty (<code>==</code> daje false), ale nadpisane <code>equals</code> porównuje pole <code>x</code>.', 'eq-equals', J`class P {
    int x;
    P(int x) { this.x = x; }

    @Override
    public boolean equals(Object o) {
        return o instanceof P && ((P) o).x == x;
    }
}

public class Main {
    public static void main(String[] args) {
        P a = new P(1);
        P b = new P(1);
        System.out.println((a == b) + " " + a.equals(b));
    }
}`),
      O('Co wypisze program?', ['C a b', 'a b C', 'a C b', 'b a C'], 0, 'Naturalny porządek napisów jest leksykograficzny: wielkie litery (kody 65–90) są przed małymi (97–122).', 'sort-comparable', J`import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        String[] t = { "b", "C", "a" };
        Arrays.sort(t);
        System.out.println(t[0] + " " + t[1] + " " + t[2]);
    }
}`),
      O('Co wypisze program?', ['0 1', '1 0', '0 0', '-1 1'], 0, '<code>"a".compareTo("a")</code> daje 0, a <code>Integer.compare(5, 2)</code> – 1.', 'sort-comparable', J`public class Main {
    public static void main(String[] args) {
        System.out.println("a".compareTo("a") + " " + Integer.compare(5, 2));
    }
}`),
    ],
    tasks: [
      {
        id: 'z1', title: 'Interfejs Platny i rachunki', pts: 8, concepts: ['if-default', 'if-podstawy'],
        statement: J`<ol>
<li>Interfejs <code>Platny</code>: metoda abstrakcyjna <code>double kwota()</code> oraz metoda <b>domyślna</b> <code>double zNarzutem()</code> zwracająca <code>kwota() + 10</code>.</li>
<li><code>Faktura implements Platny</code> – konstruktor <code>(double kwota)</code>; <code>kwota()</code> zwraca tę wartość.</li>
<li><code>Abonament implements Platny</code> – konstruktor <code>(int miesiace, double cena)</code>; <code>kwota()</code> zwraca <code>miesiace * cena</code>.</li>
<li><code>Rachunki</code> – publiczna statyczna metoda <code>double sumaZNarzutem(Platny[] t)</code> – suma <code>zNarzutem()</code> wszystkich elementów.</li>
</ol>`,
        files: [{ name: 'Platny.java', code: J`public interface Platny {

}
` }, { name: 'Faktura.java', code: J`public class Faktura {

}
` }, { name: 'Abonament.java', code: J`public class Abonament {

}
` }, { name: 'Rachunki.java', code: J`public class Rachunki {

}
` }],
        solution: [
          { name: 'Platny.java', code: J`public interface Platny {
    double kwota();

    default double zNarzutem() {
        return kwota() + 10;
    }
}
` },
          { name: 'Faktura.java', code: J`public class Faktura implements Platny {
    private double kwota;

    public Faktura(double kwota) {
        this.kwota = kwota;
    }

    @Override
    public double kwota() {
        return kwota;
    }
}
` },
          { name: 'Abonament.java', code: J`public class Abonament implements Platny {
    private int miesiace;
    private double cena;

    public Abonament(int miesiace, double cena) {
        this.miesiace = miesiace;
        this.cena = cena;
    }

    @Override
    public double kwota() {
        return miesiace * cena;
    }
}
` },
          { name: 'Rachunki.java', code: J`public class Rachunki {
    public static double sumaZNarzutem(Platny[] t) {
        double suma = 0;
        for (int i = 0; i < t.length; i++) {
            suma += t[i].zNarzutem();
        }
        return suma;
    }
}
` }],
        checks: [
          CK(CR, 'Platny to interfejs z abstrakcyjną kwota() i domyślną zNarzutem()', J`isTrue("Platny ma być interface", cls("Platny").isInterface());
isTrue("kwota() ma być abstrakcyjna", Modifier.isAbstract(method("Platny", "kwota").getModifiers()));
isTrue("zNarzutem() ma być default", method("Platny", "zNarzutem").isDefault());`),
          CK(CR, 'Faktura i Abonament implementują Platny', J`isTrue("Faktura implementuje Platny", implementsIface("Faktura", "Platny")); isTrue("Abonament implementuje Platny", implementsIface("Abonament", "Platny"));`),
          CK(CR, 'kwota() obu klas', J`eq(100.0, new Faktura(100).kwota()); eq(60.0, new Abonament(3, 20).kwota());`),
          CK(CR, 'zNarzutem() = kwota + 10 (metoda domyślna)', J`eq(110.0, new Faktura(100).zNarzutem()); eq(70.0, new Abonament(3, 20).zNarzutem());`),
          CK(CR, 'Rachunki.sumaZNarzutem sumuje obiekty różnych klas', J`Platny[] t = { new Faktura(100), new Abonament(3, 20) };
eq(180.0, Rachunki.sumaZNarzutem(t)); eq(0.0, Rachunki.sumaZNarzutem(new Platny[0]));`),
          CK(MD, 'Klasy nie nadpisują zNarzutem (korzystają z wersji domyślnej)', J`for (String c : new String[]{"Faktura", "Abonament"})
    for (java.lang.reflect.Method m : cls(c).getDeclaredMethods()) isFalse(c + " nie powinna nadpisywać zNarzutem", m.getName().equals("zNarzutem"));`),
        ],
      },
      {
        id: 'z2', title: 'Student: equals, hashCode, Comparable', pts: 10, concepts: ['eq-equals', 'sort-kryteria'],
        statement: J`<p>Klasa <code>Student</code> – prywatne pola <code>String nazwisko</code>, <code>int rok</code>; konstruktor <code>(nazwisko, rok)</code>; gettery <code>getNazwisko()</code>, <code>getRok()</code>.</p>
<ul>
<li><code>equals(Object o)</code> – studenci są równi, gdy mają to samo nazwisko i ten sam rok (obsłuż: ten sam obiekt, <code>null</code>, inną klasę);</li>
<li><code>hashCode()</code> – zgodny z <code>equals</code>;</li>
<li><code>Student implements Comparable&lt;Student&gt;</code> – sortowanie najpierw po nazwisku (alfabetycznie), a przy takim samym nazwisku – po roku rosnąco.</li>
</ul>`,
        files: [{ name: 'Student.java', code: J`public class Student {

}
` }],
        solution: [{ name: 'Student.java', code: J`import java.util.Objects;

public class Student implements Comparable<Student> {
    private String nazwisko;
    private int rok;

    public Student(String nazwisko, int rok) {
        this.nazwisko = nazwisko;
        this.rok = rok;
    }

    public String getNazwisko() {
        return nazwisko;
    }

    public int getRok() {
        return rok;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Student s = (Student) o;
        return rok == s.rok && Objects.equals(nazwisko, s.nazwisko);
    }

    @Override
    public int hashCode() {
        return Objects.hash(nazwisko, rok);
    }

    @Override
    public int compareTo(Student o) {
        int w = nazwisko.compareTo(o.nazwisko);
        if (w != 0) {
            return w;
        }
        return Integer.compare(rok, o.rok);
    }
}
` }],
        checks: [
          CK(CR, 'Konstruktor i gettery; pola prywatne', J`Student s = new Student("Kot", 2);
eq("Kot", s.getNazwisko()); eq(2, s.getRok());
isTrue("nazwisko private", Modifier.isPrivate(fieldMods("Student", "nazwisko"))); isTrue("rok private", Modifier.isPrivate(fieldMods("Student", "rok")));`),
          CK(CR, 'equals: równość po nazwisku i roku', J`Student a = new Student("Kot", 2);
eq(true, a.equals(new Student("Kot", 2))); eq(false, a.equals(new Student("Kot", 3))); eq(false, a.equals(new Student("Mak", 2)));`),
          CK(CR, 'equals: ten sam obiekt, null, inna klasa', J`Student a = new Student("Kot", 2);
eq(true, a.equals(a)); eq(false, a.equals(null)); eq(false, a.equals("Kot"));`),
          CK(CR, 'hashCode zgodny z equals (HashSet)', J`eq(new Student("Kot", 2).hashCode(), new Student("Kot", 2).hashCode());
java.util.HashSet<Student> z = new java.util.HashSet<>();
z.add(new Student("Kot", 2)); z.add(new Student("Kot", 2)); z.add(new Student("Mak", 1));
eq(2, z.size());`),
          CK(CR, 'Comparable: po nazwisku, potem po roku', J`Student[] t = { new Student("Nowak", 1), new Student("Kot", 3), new Student("Kot", 1), new Student("Adam", 2) };
java.util.Arrays.sort(t);
eq("Adam", t[0].getNazwisko()); eq("Kot", t[1].getNazwisko()); eq(1, t[1].getRok()); eq(3, t[2].getRok()); eq("Nowak", t[3].getNazwisko());`),
          CK(MD, 'compareTo zwraca 0 tylko dla równych', J`eq(0, new Student("A", 1).compareTo(new Student("A", 1)));
isTrue("różne nazwiska", new Student("A", 1).compareTo(new Student("B", 1)) < 0);
isTrue("różne lata", new Student("A", 2).compareTo(new Student("A", 1)) > 0);`),
          CK(MN, 'Użyto Objects.equals/hash, Integer.compare i @Override', J`isTrue("Objects.equals", srcHas("Student", "Objects\\s*\\.\\s*equals"));
isTrue("Objects.hash", srcHas("Student", "Objects\\s*\\.\\s*hash"));
isTrue("Integer.compare", srcHas("Student", "Integer\\s*\\.\\s*compare"));
isTrue("@Override", srcHas("Student", "@Override"));`),
        ],
      },
    ],
  });

  /* ============================================================ S5 */
  add({
    id: 's5', title: 'Sprawdzian 5 – Finał (cały materiał)', minutes: 90,
    focus: 'Wszystko: od klas po generyki i kolekcje. To najbliższe prawdziwemu kolokwium – pytania ze wszystkich działów i trzy większe zadania.',
    questions: [
      Q('W metodach statycznych można odwoływać się do:', ['pól statycznych', 'pól niestatycznych', 'metod statycznych', 'metod niestatycznych'], [0, 2], 'Do niestatycznych potrzebny jest obiekt.', 'stat-zasady'),
      Q('Co jest prawdą o polach statycznych?', ['ich wartość jest taka sama dla każdej instancji klasy', 'można się do nich odwołać przez <code>NazwaKlasy.pole</code>', 'mogą być prywatne', 'każdy obiekt ma własną kopię'], [0, 1, 2], 'Pole statyczne należy do klasy, nie do obiektu.', 'stat-pola'),
      Q('Klasa bazowa ma tylko konstruktor <code>Item(String name)</code>. Co musi zawierać konstruktor klasy pochodnej?', ['jawne wywołanie <code>super(...)</code> z argumentem typu String', 'nic – kompilator wywoła domyślny <code>super()</code>', 'wywołanie <code>this()</code>', 'nic, jeśli klasa pochodna nie ma pól'], 0, 'Bez konstruktora bezparametrowego w nadklasie trzeba wywołać konstruktor z parametrem.', 'dz-konstruktory'),
      Q('Czy metoda klasy bazowej może użyć pola zadeklarowanego tylko w klasie pochodnej?', ['nie – niezależnie od modyfikatora', 'tak, jeśli pole jest <code>public</code>', 'tak, jeśli <code>protected</code>', 'tak, po rzutowaniu <code>this</code>'], 0, 'Nadklasa nie wie o polach podklas.', 'dz-dostep'),
      Q('Co jest prawdą o klasie abstrakcyjnej i interfejsie?', ['z obu nie można tworzyć obiektów', 'klasa może dziedziczyć po wielu klasach abstrakcyjnych', 'klasa może implementować wiele interfejsów', 'interfejs może mieć konstruktor'], [0, 2], 'Brak wielodziedziczenia klas; interfejsy – dowolnie wiele; interfejs nie ma konstruktora.', 'if-wiele'),
      Q('Jeśli w bloku <code>try</code> wystąpił wyjątek niepasujący do żadnego <code>catch</code>, a jest blok <code>finally</code>:', ['<code>finally</code> i tak się wykona, a program zakończy się błędem', '<code>finally</code> się nie wykona', 'program kontynuuje po bloku', 'wyjątek zostanie zignorowany'], 0, '<code>finally</code> wykonuje się zawsze.', 'wyj-trycatch'),
      Q('Jakie słowo służy do wyrzucenia wyjątku?', ['<code>throw</code>', '<code>throws</code>', '<code>catch</code>', '<code>raise</code>'], 0, '<code>throws</code> deklaruje w nagłówku.', 'wyj-wlasne'),
      Q('Do czego służy <code>instanceof</code>?', ['sprawdza, czy obiekt jest instancją danej klasy lub jej podklasy', 'porównuje zawartość obiektów', 'tworzy nowy obiekt', 'wywołuje konstruktor nadklasy'], 0, 'Zwraca <code>boolean</code>.', 'pol-downcast'),
      Q('Aby własna klasa działała poprawnie jako element <code>HashSet</code> (bez duplikatów „po treści”), trzeba w niej nadpisać:', ['<code>equals</code> i <code>hashCode</code>', '<code>toString</code>', '<code>compareTo</code>', '<code>clone</code>'], 0, 'Zbiór używa haszów i <code>equals</code>.', 'eq-hashcode'),
      Q('Aby typ generyczny T w metodzie mógł wywołać <code>compareTo</code>, deklarujemy:', ['<code>&lt;T extends Comparable&lt;T&gt;&gt;</code>', '<code>&lt;T implements Comparable&lt;T&gt;&gt;</code>', '<code>&lt;T&gt;</code>', '<code>&lt;T : Comparable&gt;</code>'], 0, 'W ograniczeniach używamy <code>extends</code> także dla interfejsów.', 'gen-ograniczenia'),
      Q('Która kolekcja pozwala na duplikaty i dostęp po indeksie?', ['<code>ArrayList</code>', '<code>HashSet</code>', '<code>HashMap</code>', 'żadna'], 0, 'Lista.', 'kol-lista'),
      Q('Co jest prawdą o <code>HashMap</code>?', ['klucze są unikalne', 'wartości mogą się powtarzać', '<code>get</code> dla nieistniejącego klucza zwraca <code>null</code>', 'zachowuje kolejność wstawiania'], [0, 1, 2], 'Kolejności <code>HashMap</code> nie gwarantuje.', 'kol-mapa'),
      Q('Które zdania o typach generycznych są prawdziwe?', ['klasa generyczna może mieć generyczne metody', 'klasa niegeneryczna może mieć generyczne metody', 'typ generyczny musi nazywać się T', 'typ generyczny może mieć ograniczenie'], [0, 1, 3], 'Nazwa jest dowolna.', 'gen-klasy'),
      Q('Czym różni się <code>Comparable</code> od <code>Comparator</code>?', ['<code>Comparable</code> implementuje porównywana klasa (porządek naturalny), <code>Comparator</code> – osobna klasa (dodatkowy porządek)', 'nie ma różnicy', '<code>Comparator</code> implementuje porównywana klasa', '<code>Comparable</code> służy tylko do równości'], 0, 'compareTo vs compare.', 'sort-comparator'),
      O('Co wypisze program?', ['5<br>ja', '5ja', 'błąd kompilacji', 'wyjątek'], 0, 'Metoda generyczna wywołana z <code>Integer</code> i <code>String</code>; <code>println</code> wypisuje każdy wynik w osobnej linii.', 'gen-metody', J`public class Main {
    static <T> void pokaz(T x) {
        System.out.println(x.toString());
    }

    public static void main(String[] args) {
        pokaz(5);
        pokaz("ja");
    }
}`),
      O('Co wypisze program?', ['3<br>2', '3<br>3', '2<br>2', '2<br>3'], 0, 'Lista trzyma duplikaty (3), zbiór tylko unikalne (2).', 'kol-zbior', J`import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<Integer> l = new ArrayList<>(List.of(1, 2, 1));
        Set<Integer> s = new HashSet<>(l);
        System.out.println(l.size());
        System.out.println(s.size());
    }
}`),
      O('Co wypisze program?', ['2<br>Ola', '1<br>Ola', '2<br>Ala', '1<br>Ala'], 1, 'Drugi <code>put</code> z tym samym kluczem zastępuje wartość – w mapie jest jeden wpis.', 'kol-mapa', J`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Map<Integer, String> m = new HashMap<>();
        m.put(1, "Ala");
        m.put(1, "Ola");
        System.out.println(m.size());
        System.out.println(m.get(1));
    }
}`),
      O('Co wypisze program?', ['F1', '1F', '1', 'F'], 0, 'Zanim metoda zwróci 1, wykona się <code>finally</code> (wypisze „F”).', 'wyj-trycatch', J`public class Main {
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
}`),
      O('Co wypisze program?', ['B B A', 'A A A', 'B A A', 'B B B'], 0, 'Metoda niestatyczna – wersja z <code>B</code> (rzeczywisty typ). Metoda statyczna zależy od typu zmiennej lub nazwy klasy.', 'pol-dynamiczne', J`class A {
    static String s() { return "A"; }
    String n() { return "A"; }
}
class B extends A {
    static String s() { return "B"; }
    @Override
    String n() { return "B"; }
}

public class Main {
    public static void main(String[] args) {
        A z = new B();
        System.out.println(z.n() + " " + B.s() + " " + z.s());
    }
}`),
    ],
    tasks: [
      {
        id: 'z1', title: 'Generyczny magazynek', pts: 8, concepts: ['gen-klasy', 'kol-lista'],
        statement: J`<p>Napisz klasę generyczną <code>Magazynek&lt;T extends Comparable&lt;T&gt;&gt;</code>, która wewnątrz trzyma elementy na liście (<code>ArrayList</code>) i ma publiczne metody:</p>
<ul><li><code>void dodaj(T element)</code>,</li>
<li><code>int rozmiar()</code> – liczba elementów,</li>
<li><code>T najwiekszy()</code> – największy element (według <code>compareTo</code>); dla pustego magazynka <code>null</code>.</li></ul>`,
        files: [{ name: 'Magazynek.java', code: J`public class Magazynek {

}
` }],
        solution: [{ name: 'Magazynek.java', code: J`import java.util.ArrayList;
import java.util.List;

public class Magazynek<T extends Comparable<T>> {
    private List<T> elementy = new ArrayList<>();

    public void dodaj(T element) {
        elementy.add(element);
    }

    public int rozmiar() {
        return elementy.size();
    }

    public T najwiekszy() {
        if (elementy.isEmpty()) {
            return null;
        }
        T naj = elementy.get(0);
        for (T e : elementy) {
            if (e.compareTo(naj) > 0) {
                naj = e;
            }
        }
        return naj;
    }
}
` }],
        checks: [
          CK(CR, 'Klasa jest generyczna z ograniczeniem T extends Comparable<T>', J`java.lang.reflect.TypeVariable<?>[] tv = cls("Magazynek").getTypeParameters();
eq(1, tv.length);
isTrue("T ma mieć ograniczenie Comparable", tv[0].getBounds()[0].getTypeName().startsWith("java.lang.Comparable"));`),
          CK(CR, 'dodaj i rozmiar', J`Magazynek<Integer> m = new Magazynek<>();
eq(0, m.rozmiar()); m.dodaj(5); m.dodaj(5); m.dodaj(1);
eq(3, m.rozmiar());`),
          CK(CR, 'najwiekszy dla liczb i napisów', J`Magazynek<Integer> m = new Magazynek<>();
m.dodaj(3); m.dodaj(9); m.dodaj(4);
eq(9, m.najwiekszy());
Magazynek<String> s = new Magazynek<>();
s.dodaj("kot"); s.dodaj("zebra"); s.dodaj("ala");
eq("zebra", s.najwiekszy());`),
          CK(MD, 'najwiekszy pustego magazynka = null', J`isTrue("powinno być null", new Magazynek<Integer>().najwiekszy() == null);`),
          CK(MN, 'Użyto ArrayList/List', J`isTrue("Użyj ArrayList", srcHas("Magazynek", "ArrayList"));`),
        ],
      },
      {
        id: 'z2', title: 'Dziennik ocen (mapa + lista + zbiór)', pts: 10, concepts: ['kol-mapa', 'kol-lista'],
        statement: J`<p>Klasa <code>Dziennik</code> przechowuje oceny uczniów w mapie <code>Map&lt;String, List&lt;Integer&gt;&gt;</code> (klucz – nazwisko ucznia). Napisz publiczne metody:</p>
<ul><li><code>void dodajOcene(String uczen, int ocena)</code> – dopisuje ocenę (jeśli uczeń nie ma jeszcze wpisu, tworzy go),</li>
<li><code>int liczbaOcen(String uczen)</code> – liczba ocen (0, gdy brak ucznia),</li>
<li><code>double srednia(String uczen)</code> – średnia ocen (0.0, gdy brak ocen),</li>
<li><code>Set&lt;String&gt; uczniowie()</code> – zbiór nazwisk uczniów, którzy mają wpis.</li></ul>`,
        files: [{ name: 'Dziennik.java', code: J`public class Dziennik {

}
` }],
        solution: [{ name: 'Dziennik.java', code: J`import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class Dziennik {
    private Map<String, List<Integer>> oceny = new HashMap<>();

    public void dodajOcene(String uczen, int ocena) {
        if (!oceny.containsKey(uczen)) {
            oceny.put(uczen, new ArrayList<>());
        }
        oceny.get(uczen).add(ocena);
    }

    public int liczbaOcen(String uczen) {
        List<Integer> l = oceny.get(uczen);
        if (l == null) {
            return 0;
        }
        return l.size();
    }

    public double srednia(String uczen) {
        List<Integer> l = oceny.get(uczen);
        if (l == null || l.isEmpty()) {
            return 0.0;
        }
        int suma = 0;
        for (int o : l) {
            suma += o;
        }
        return (double) suma / l.size();
    }

    public Set<String> uczniowie() {
        return new HashSet<>(oceny.keySet());
    }
}
` }],
        checks: [
          CK(CR, 'dodajOcene i liczbaOcen', J`Dziennik d = new Dziennik();
d.dodajOcene("Kot", 5); d.dodajOcene("Kot", 3); d.dodajOcene("Mak", 4);
eq(2, d.liczbaOcen("Kot")); eq(1, d.liczbaOcen("Mak")); eq(0, d.liczbaOcen("Nikt"));`),
          CK(CR, 'srednia ocen', J`Dziennik d = new Dziennik();
d.dodajOcene("Kot", 5); d.dodajOcene("Kot", 4); d.dodajOcene("Kot", 3);
eq(4.0, d.srednia("Kot"));
d.dodajOcene("Mak", 5); d.dodajOcene("Mak", 4);
eq(4.5, d.srednia("Mak"));`),
          CK(MD, 'srednia dla nieistniejącego ucznia = 0.0', J`eq(0.0, new Dziennik().srednia("Nikt"));`),
          CK(CR, 'uczniowie zwraca zbiór nazwisk', J`Dziennik d = new Dziennik();
d.dodajOcene("Kot", 5); d.dodajOcene("Mak", 4); d.dodajOcene("Kot", 1);
Set<String> z = d.uczniowie();
eq(2, z.size()); isTrue("Kot i Mak", z.contains("Kot") && z.contains("Mak"));`),
          CK(MD, 'Pole z mapą jest prywatne', J`boolean found = false;
for (java.lang.reflect.Field f : cls("Dziennik").getDeclaredFields()) if (java.util.Map.class.isAssignableFrom(f.getType())) { found = true; isTrue("pole z mapą ma być private", Modifier.isPrivate(f.getModifiers())); }
isTrue("Dziennik powinien mieć pole typu Map", found);`),
          CK(MN, 'Użyto HashMap', J`isTrue("Użyj HashMap", srcHas("Dziennik", "HashMap"));`),
        ],
      },
      {
        id: 'z3', title: 'Schronisko: abstrakcja, interfejs i wyjątek', pts: 12, concepts: ['abs-metoda', 'if-wiele', 'wyj-wlasne'],
        statement: J`<ol>
<li><code>Zwierze</code> – klasa <b>abstrakcyjna</b>: prywatne pole <code>String nazwa</code>, konstruktor <code>(nazwa)</code>, <code>getNazwa()</code>, abstrakcyjna metoda <code>String dzwiek()</code>.</li>
<li>Interfejs <code>Aportujacy</code> z metodą <code>String aportuj()</code>.</li>
<li><code>Pies extends Zwierze implements Aportujacy</code> – konstruktor <code>(nazwa)</code>; <code>dzwiek()</code> zwraca <code>Hau</code>; <code>aportuj()</code> zwraca <code>NAZWA aportuje</code>.</li>
<li><code>Kot extends Zwierze</code> – konstruktor <code>(nazwa)</code>; <code>dzwiek()</code> zwraca <code>Miau</code>.</li>
<li><code>PelneSchroniskoException</code> – własny wyjątek kontrolowany (konstruktor z <code>String message</code>).</li>
<li><code>Schronisko</code> – konstruktor <code>(int pojemnosc)</code> tworzy tablicę <code>Zwierze[]</code> o tej długości. Metody:
  <ul><li><code>void dodaj(Zwierze z) throws PelneSchroniskoException</code> – wstawia na pierwsze wolne miejsce; gdy brak miejsca – wyrzuca wyjątek z komunikatem <code>Schronisko pelne</code>;</li>
  <li><code>String koncert()</code> – dźwięki wszystkich zwierząt oddzielone przecinkiem i spacją (np. <code>Hau, Miau</code>); dla pustego schroniska pusty napis;</li>
  <li><code>int ileAportujacych()</code> – liczba zwierząt umiejących aportować (<code>instanceof Aportujacy</code>).</li></ul></li>
</ol>`,
        files: [
          { name: 'Zwierze.java', code: J`public class Zwierze {

}
` }, { name: 'Aportujacy.java', code: J`public interface Aportujacy {

}
` }, { name: 'Pies.java', code: J`public class Pies {

}
` }, { name: 'Kot.java', code: J`public class Kot {

}
` }, { name: 'PelneSchroniskoException.java', code: J`public class PelneSchroniskoException {

}
` }, { name: 'Schronisko.java', code: J`public class Schronisko {

}
` }],
        solution: [
          { name: 'Zwierze.java', code: J`public abstract class Zwierze {
    private String nazwa;

    public Zwierze(String nazwa) {
        this.nazwa = nazwa;
    }

    public String getNazwa() {
        return nazwa;
    }

    public abstract String dzwiek();
}
` },
          { name: 'Aportujacy.java', code: J`public interface Aportujacy {
    String aportuj();
}
` },
          { name: 'Pies.java', code: J`public class Pies extends Zwierze implements Aportujacy {
    public Pies(String nazwa) {
        super(nazwa);
    }

    @Override
    public String dzwiek() {
        return "Hau";
    }

    @Override
    public String aportuj() {
        return getNazwa() + " aportuje";
    }
}
` },
          { name: 'Kot.java', code: J`public class Kot extends Zwierze {
    public Kot(String nazwa) {
        super(nazwa);
    }

    @Override
    public String dzwiek() {
        return "Miau";
    }
}
` },
          { name: 'PelneSchroniskoException.java', code: J`public class PelneSchroniskoException extends Exception {
    public PelneSchroniskoException(String message) {
        super(message);
    }
}
` },
          { name: 'Schronisko.java', code: J`public class Schronisko {
    private Zwierze[] klatki;

    public Schronisko(int pojemnosc) {
        klatki = new Zwierze[pojemnosc];
    }

    public void dodaj(Zwierze z) throws PelneSchroniskoException {
        for (int i = 0; i < klatki.length; i++) {
            if (klatki[i] == null) {
                klatki[i] = z;
                return;
            }
        }
        throw new PelneSchroniskoException("Schronisko pelne");
    }

    public String koncert() {
        String wynik = "";
        for (int i = 0; i < klatki.length; i++) {
            if (klatki[i] != null) {
                if (!wynik.isEmpty()) {
                    wynik += ", ";
                }
                wynik += klatki[i].dzwiek();
            }
        }
        return wynik;
    }

    public int ileAportujacych() {
        int n = 0;
        for (int i = 0; i < klatki.length; i++) {
            if (klatki[i] instanceof Aportujacy) {
                n++;
            }
        }
        return n;
    }
}
` }],
        checks: [
          CK(CR, 'Zwierze jest abstrakcyjne z abstrakcyjną metodą dzwiek()', J`isTrue("Zwierze ma być abstract", Modifier.isAbstract(cls("Zwierze").getModifiers()));
isTrue("dzwiek() ma być abstract", Modifier.isAbstract(method("Zwierze", "dzwiek").getModifiers()));
isTrue("nazwa ma być private", Modifier.isPrivate(fieldMods("Zwierze", "nazwa")));`),
          CK(CR, 'Aportujacy to interfejs; Pies go implementuje i dziedziczy po Zwierze', J`isTrue("Aportujacy ma być interface", cls("Aportujacy").isInterface());
isTrue("Pies dziedziczy po Zwierze", isSubclass("Pies", "Zwierze"));
isTrue("Pies implementuje Aportujacy", implementsIface("Pies", "Aportujacy"));
isTrue("Kot dziedziczy po Zwierze", isSubclass("Kot", "Zwierze"));
isFalse("Kot nie implementuje Aportujacy", implementsIface("Kot", "Aportujacy"));`),
          CK(CR, 'Dźwięki i aportowanie', J`eq("Hau", new Pies("Rex").dzwiek()); eq("Miau", new Kot("Mruczek").dzwiek());
eq("Rex aportuje", new Pies("Rex").aportuj()); eq("Rex", new Pies("Rex").getNazwa());`),
          CK(CR, 'PelneSchroniskoException jest wyjątkiem kontrolowanym', J`Class<?> c = cls("PelneSchroniskoException");
isTrue("Dziedziczy po Exception", Exception.class.isAssignableFrom(c)); isFalse("Nie po RuntimeException", RuntimeException.class.isAssignableFrom(c));`),
          CK(CR, 'Schronisko.dodaj wypełnia klatki, a po zapełnieniu rzuca wyjątek z komunikatem', J`Schronisko s = new Schronisko(2);
s.dodaj(new Pies("A")); s.dodaj(new Kot("B"));
Throwable e = thrown(() -> s.dodaj(new Kot("C")));
isTrue("Oczekiwano PelneSchroniskoException, jest: " + e, e != null && isInstanceOfName(e, "PelneSchroniskoException"));
eq("Schronisko pelne", e.getMessage());`),
          CK(CR, 'koncert zwraca dźwięki oddzielone „, ”', J`Schronisko s = new Schronisko(5);
eq("", s.koncert());
s.dodaj(new Pies("A")); s.dodaj(new Kot("B")); s.dodaj(new Pies("C"));
eq("Hau, Miau, Hau", s.koncert());`),
          CK(CR, 'ileAportujacych liczy psy', J`Schronisko s = new Schronisko(5);
eq(0, s.ileAportujacych());
s.dodaj(new Pies("A")); s.dodaj(new Kot("B")); s.dodaj(new Pies("C"));
eq(2, s.ileAportujacych());`),
          CK(MD, 'Schronisko: metoda dodaj deklaruje throws; użyto instanceof', J`boolean ok = false;
for (Class<?> t : method("Schronisko", "dodaj", cls("Zwierze")).getExceptionTypes()) if (t.getSimpleName().equals("PelneSchroniskoException")) ok = true;
isTrue("dodaj powinna deklarować throws PelneSchroniskoException", ok);
isTrue("Użyj instanceof Aportujacy", srcHas("Schronisko", "instanceof\\s+Aportujacy"));`),
        ],
      },
    ],
  });
})();
