'use strict';
var ZOO6 = [
  FL('Zwierze.java', 'public class Zwierze {\n    public void dajGlos() {\n        System.out.println("...");\n    }\n}\n'),
  FL('Pies.java', 'public class Pies extends Zwierze {\n    @Override\n    public void dajGlos() {\n        System.out.println("Hau!");\n    }\n\n    public void szczekaj() {\n        System.out.println("Pies szczeka glosno");\n    }\n}\n'),
  FL('Kot.java', 'public class Kot extends Zwierze {\n    @Override\n    public void dajGlos() {\n        System.out.println("Miau!");\n    }\n\n    public void miaucz() {\n        System.out.println("Kot miauczy glosno");\n    }\n}\n'),
];
function ZOO6_RUN(body, extra) {
  return 'class Zwierze {\n    public void dajGlos() {\n        System.out.println("...");\n    }\n}\n\nclass Pies extends Zwierze {\n    @Override\n    public void dajGlos() {\n        System.out.println("Hau!");\n    }\n\n    public void szczekaj() {\n        System.out.println("Pies szczeka glosno");\n    }\n}\n\nclass Kot extends Zwierze {\n    @Override\n    public void dajGlos() {\n        System.out.println("Miau!");\n    }\n\n    public void miaucz() {\n        System.out.println("Kot miauczy glosno");\n    }\n}\n\npublic class Main {\n' + (extra || '') + '    public static void main(String[] args) {\n        ' + body + '\n    }\n}\n';
}
ACAD.modules.push({
  id: 'polim', num: 6, level: 2, icon: '🎭', title: 'Polimorfizm',
  source: 'Wykład 2 – dziedziczenie i polimorfizm (część 2) · Laboratoria 3 (Zadania 3, zad. 3)',
  summary: 'Upcasting, downcasting, instanceof, dynamiczne wiązanie metod – oraz większe zadanie z bohaterem i ekwipunkiem.',
  goals: ['przypisać obiekt podklasy do zmiennej nadklasy (upcasting)', 'bezpiecznie sprawdzić typ operatorem <code>instanceof</code> i rzutować w dół', 'przewidzieć, która wersja nadpisanej metody się wykona', 'zbudować kolekcję różnych obiektów w jednej tablicy'],
  lessons: [

    {
      id: 'pol-idea', micro: true, title: 'Polimorfizm: jeden pilot, wiele urządzeń', blurb: 'zmienna nadklasy, zachowanie podklasy', minutes: 4,
      content: [
        ANA('📺', 'Masz <b>jeden pilot</b> z przyciskiem „włącz”. Naciskasz go przy telewizorze, radiu i klimatyzacji. Każde urządzenie <b>reaguje po swojemu</b>, a Ty nie musisz wiedzieć, które to. <b>Polimorfizm</b> („wiele form”) to to samo w Javie: wołasz tę samą metodę na zmiennej typu nadklasy, a wykona się wersja <b>prawdziwego obiektu</b>.'),
        VIZ('flow', { title: 'Zwierze z = new Pies(); z.dajGlos();', steps: [{ t: 'zmienna typu Zwierze', s: 'pilot, zna tylko metody Zwierze', c: 'accent' }, { t: 'w środku obiekt Pies', s: 'prawdziwe urządzenie', c: 'warn' }, { t: 'wykonuje się dajGlos() Psa', s: 'Hau!', c: 'ok' }] }),
        TERMS([['upcasting', 'traktowanie obiektu klasy pochodnej jak obiektu nadklasy (<code>Zwierze z = new Pies()</code>)'], ['późne wiązanie', 'o tym, <b>którą wersję</b> metody wykonać, decyduje <b>prawdziwy obiekt</b> w trakcie działania programu'], ['downcasting', 'powrót z nadklasy do konkretnej klasy (<code>(Pies) z</code>)']]),
        NOTE('info', 'Dzięki polimorfizmowi jedna pętla może obsłużyć listę zwierząt, kształtów czy pracowników bez sprawdzania, czym dokładnie każdy jest. To jedna z najważniejszych idei programowania obiektowego.'),
      ],
      quiz: [
        Q('Na czym polega polimorfizm?', ['ta sama metoda wywołana na zmiennej nadklasy wykonuje się inaczej w zależności od prawdziwego obiektu', 'klasa ma kilka konstruktorów', 'wszystkie klasy mają tę samą nazwę', 'pola są prywatne'], 0, 'Decyduje typ obiektu, a nie typ zmiennej.'),
        Q('Co to jest upcasting?', ['przypisanie obiektu klasy pochodnej do zmiennej typu nadklasy', 'zmiana typu liczby na tekst', 'usunięcie obiektu', 'tworzenie tablicy'], 0, 'Np. <code>Zwierze z = new Pies();</code>.'),
      ],
    },

    {
      id: 'pol-upcast', title: 'Upcasting: obiekt pod postacią nadklasy', blurb: 'Zwierze z = new Pies()', minutes: 5,
      content: [
        ANA('🎭', 'Pies <b>jest</b> zwierzęciem, więc możesz go trzymać w zmiennej typu <code>Zwierze</code>. To tak, jakbyś zrobił pieskowi zdjęcie do dokumentów zwierząt: urzędnik widzi tylko „zwierzę”, a w środku nadal jest pies. Zmiana typu „w górę” drzewa jest <b>automatyczna</b>, bez żadnego rzutowania.'),
        VIZ('objects', { vars: [{ t: 'Zwierze', n: 'z', to: 'o1' }], objs: [{ id: 'o1', c: 'Pies', f: [['imie', '"Reks"']] }], cap: 'Zmienna jest typu <code>Zwierze</code>, ale obiekt, na który wskazuje, to nadal <b>Pies</b>.' }),
        CODE(ZOO6_RUN('Zwierze z = new Pies();\n        z.dajGlos();'), 'Hau!'),
        NOTE('warn', 'Przez zmienną typu <code>Zwierze</code> możesz wołać <b>tylko</b> metody zdefiniowane w <code>Zwierze</code>. Wołanie <code>z.szczekaj()</code> (metody tylko Psa) to błąd kompilacji.'),
      ],
      guide: {
        files: [...ZOO6, FL('Main.java', MAINW([]))],
        steps: [
          { say: '<p>W <code>main</code> zrób upcasting: zmienna typu <b>nadklasy</b> (<code>Zwierze</code>), a po <code>new</code> obiekt <b>klasy pochodnej</b> (<code>Pies</code>). Nie potrzeba rzutowania.</p>', type: 'Zwierze z = new Pies();', expect: J`Zwierze\s+z\s*=\s*new\s+Pies\s*\(\s*\)\s*;` },
          { say: '<p>Wywołaj metodę przez zmienną nadklasy. <code>dajGlos()</code> jest w <code>Zwierze</code>, więc wolno.</p>', type: 'z.dajGlos();', expect: J`\bz\.dajGlos\s*\(\s*\)\s*;` },
        ],
        solution: [...ZOO6, FL('Main.java', MAINW(['Zwierze z = new Pies();', 'z.dajGlos();']))],
        checks: [
          CK(CR, 'Program wypisuje „Hau!”', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Hau!] – program wypisał: " + o, o.equals(Arrays.asList("Hau!")));`),
          CK(MD, 'Zmienna jest typu Zwierze', J`isTrue("Zadeklaruj zmienną jako Zwierze z = new Pies();", srcHas("Main", "Zwierze\\s+z\\s*=\\s*new\\s+Pies"));`),
        ],
      },
      exercise: {
        prompt: '<p>Zadeklaruj zmienną <code>Zwierze k</code> z obiektem <b>Kota</b> (<code>new Kot()</code>) i wywołaj na niej <code>dajGlos()</code>. Program ma wypisać <code>Miau!</code>.</p>',
        files: [...ZOO6, FL('Main.java', MAINW([]))],
        hints: ['<code>Zwierze k = new Kot();</code>', '<code>k.dajGlos();</code>'],
        solution: [...ZOO6, FL('Main.java', MAINW(['Zwierze k = new Kot();', 'k.dajGlos();']))],
        checks: [
          CK(CR, 'Program wypisuje „Miau!”', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Miau!] – program wypisał: " + o, o.equals(Arrays.asList("Miau!")));`),
          CK(MD, 'Zmienna jest typu Zwierze, obiekt to Kot', J`isTrue("Użyj: Zwierze k = new Kot();", srcHas("Main", "Zwierze\\s+k\\s*=\\s*new\\s+Kot"));`),
        ],
      },
      quiz: [
        Q('Które przypisanie jest poprawnym upcastingiem?', ['Zwierze z = new Pies();', 'Pies p = new Zwierze();', 'Pies p = new Kot();', 'Zwierze z = new Zwierze;'], 0, 'Każdy Pies jest Zwierzęciem, ale nie odwrotnie.'),
        OUTQ('Co wypisze program?', ['Hau!', '...', 'Pies', 'błąd'], 0, 'Zmienna jest typu Zwierze, ale wykona się wersja Psa.', 'class Zwierze {\n    void dajGlos() {\n        System.out.println("...");\n    }\n}\n\nclass Pies extends Zwierze {\n    @Override\n    void dajGlos() {\n        System.out.println("Hau!");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Zwierze z = new Pies();\n        z.dajGlos();\n    }\n}\n'),
        Q('Co zrobi kompilator, gdy przez zmienną typu <code>Zwierze</code> wywołasz metodę zdefiniowaną tylko w <code>Pies</code>?', ['zgłosi błąd kompilacji', 'wywoła ją normalnie', 'zgłosi wyjątek w czasie działania', 'zignoruje wywołanie'], 0, 'Zmienna „zna” tylko metody swojego typu.'),
      ],
    },

    {
      id: 'pol-dynamiczne', title: 'Która metoda się wykona?', blurb: 'decyduje obiekt, nie zmienna', minutes: 5,
      content: [
        ANA('🔁', 'Jedna zmienna, różne obiekty. W <code>Zwierze z</code> raz leży pies, raz kot. Za każdym razem <code>z.dajGlos()</code> wykona się <b>inaczej</b>, bo Java zagląda do środka i sprawdza, <b>jaki obiekt tam naprawdę jest</b>. To dzieje się w czasie działania programu.'),
        VIZ('compare', { cols: [
          { icon: '🏷️', title: 'typ zmiennej', c: 'accent', sub: 'sprawdza kompilator', items: ['decyduje, <b>jakie metody wolno wołać</b>'] },
          { icon: '📦', title: 'typ obiektu', c: 'ok', sub: 'sprawdza Java w trakcie działania', items: ['decyduje, <b>która wersja się wykona</b>'] }] }),
        CODE(ZOO6_RUN('Zwierze z = new Pies();\n        z.dajGlos();\n        z = new Kot();\n        z.dajGlos();'), 'Hau!\nMiau!'),
        NOTE('exam', 'Pytanie na sprawdzian: „Zmienna typu nadklasy, obiekt klasy pochodnej, nadpisana metoda. Co się wykona?” Zawsze <b>wersja obiektu</b>. Jeśli metody nie nadpisano, wykona się wersja z nadklasy.'),
      ],
      guide: {
        files: [...ZOO6, FL('Main.java', MAINW(['Zwierze z = new Pies();', 'z.dajGlos();']))],
        steps: [
          { say: '<p>Ta sama zmienna <code>z</code> ma teraz wskazywać na <b>inny obiekt</b>: Kota. Typ zmiennej się nie zmienia.</p>', type: 'z = new Kot();', expect: J`\bz\s*=\s*new\s+Kot\s*\(\s*\)\s*;` },
          { say: '<p>Wywołaj <b>to samo polecenie</b> jeszcze raz. Efekt będzie inny, bo w środku jest teraz kot.</p>', type: 'z.dajGlos();', expect: J`z\.dajGlos\s*\(\s*\)\s*;.*z\.dajGlos\s*\(\s*\)\s*;` },
        ],
        solution: [...ZOO6, FL('Main.java', MAINW(['Zwierze z = new Pies();', 'z.dajGlos();', 'z = new Kot();', 'z.dajGlos();']))],
        checks: [
          CK(CR, 'Wynik: Hau! i Miau!', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Hau!, Miau!] – program wypisał: " + o, o.equals(Arrays.asList("Hau!", "Miau!")));`),
        ],
      },
      exercise: {
        prompt: '<p>W klasie <code>Main</code> napisz metodę <code>static Zwierze stworz(boolean pies)</code>: dla <code>true</code> zwraca <code>new Pies()</code>, w przeciwnym razie <code>new Kot()</code>. W <code>main</code> wywołaj <code>stworz(true).dajGlos()</code> i <code>stworz(false).dajGlos()</code>.</p><pre>Hau!\nMiau!</pre>',
        files: [...ZOO6, FL('Main.java', MAINW([]))],
        hints: ['<code>static Zwierze stworz(boolean pies) { if (pies) { return new Pies(); } return new Kot(); }</code>', 'Typ zwracany to nadklasa <code>Zwierze</code>.'],
        solution: [...ZOO6, FL('Main.java', 'public class Main {\n    static Zwierze stworz(boolean pies) {\n        if (pies) {\n            return new Pies();\n        }\n        return new Kot();\n    }\n\n    public static void main(String[] args) {\n        stworz(true).dajGlos();\n        stworz(false).dajGlos();\n    }\n}\n')],
        checks: [
          CK(CR, 'stworz(true) zwraca Pies, stworz(false) zwraca Kot', J`Method m = method("Main", "stworz", boolean.class); eq("Pies", m.invoke(null, true).getClass().getSimpleName()); eq("Kot", m.invoke(null, false).getClass().getSimpleName());`),
          CK(CR, 'Wynik: Hau! i Miau!', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Hau!, Miau!] – program wypisał: " + o, o.equals(Arrays.asList("Hau!", "Miau!")));`),
          CK(MD, 'Typ zwracany to Zwierze', J`isTrue("stworz ma zwracać Zwierze", method("Main", "stworz", boolean.class).getReturnType().getSimpleName().equals("Zwierze"));`),
        ],
      },
      quiz: [
        Q('Co decyduje o tym, którą wersję nadpisanej metody wykona Java?', ['typ obiektu, na który wskazuje zmienna', 'typ zmiennej', 'kolejność metod w pliku', 'nazwa zmiennej'], 0, 'Dzieje się to w trakcie działania programu.'),
        OUTQ('Co wypisze program?', ['Miau!', '...', 'Hau!', 'błąd'], 0, 'Zmienna wskazuje na Kota, więc wykona się wersja Kota.', 'class Zwierze {\n    void dajGlos() {\n        System.out.println("...");\n    }\n}\n\nclass Pies extends Zwierze {\n    @Override\n    void dajGlos() {\n        System.out.println("Hau!");\n    }\n}\n\nclass Kot extends Zwierze {\n    @Override\n    void dajGlos() {\n        System.out.println("Miau!");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Zwierze z = new Pies();\n        z = new Kot();\n        z.dajGlos();\n    }\n}\n'),
        OUTQ('Co wypisze program (Kot nie nadpisuje metody)?', ['...', 'Miau!', 'Kot', 'błąd'], 0, 'Skoro Kot nie nadpisał metody, wykona się wersja z nadklasy.', 'class Zwierze {\n    void dajGlos() {\n        System.out.println("...");\n    }\n}\n\nclass Kot extends Zwierze {\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Zwierze z = new Kot();\n        z.dajGlos();\n    }\n}\n'),
      ],
    },

    {
      id: 'pol-tablica', title: 'Tablica nadklasy i pętla', blurb: 'jedna pętla, różne zachowania', minutes: 5,
      content: [
        ANA('🎪', 'W tablicy typu <code>Zwierze[]</code> możesz trzymać <b>psy, koty i inne zwierzęta razem</b>. Pętla przechodzi po wszystkich i każdemu mówi „daj głos”. <b>Nie musisz wiedzieć, kto jest kim</b>, bo każdy zareaguje po swojemu. To największa korzyść polimorfizmu.'),
        CODE(ZOO6_RUN('Zwierze[] zoo = { new Pies(), new Kot(), new Pies() };\n        for (int i = 0; i < zoo.length; i++) {\n            zoo[i].dajGlos();\n        }'), 'Hau!\nMiau!\nHau!'),
      ],
      guide: {
        files: [...ZOO6, FL('Main.java', MAINW([]))],
        steps: [
          { say: '<p>Zrób tablicę typu <b>nadklasy</b> i włóż do niej różne zwierzęta.</p>', type: 'Zwierze[] zoo = { new Pies(), new Kot(), new Pies() };', expect: J`Zwierze\s*\[\s*\]\s*zoo\s*=\s*\{\s*new\s+Pies\s*\(\s*\)\s*,\s*new\s+Kot\s*\(\s*\)\s*,\s*new\s+Pies\s*\(\s*\)\s*\}\s*;` },
          { say: '<p>Pętla po całej tablicy.</p>', type: 'for (int i = 0; i < zoo.length; i++) {', expect: J`for\s*\(\s*int\s+i\s*=\s*0\s*;\s*i\s*<\s*zoo\.length\s*;\s*i\+\+\s*\)\s*\{` },
          { say: '<p>Każdemu zwierzęciu każ dać głos i zamknij pętlę.</p>', type: '    zoo[i].dajGlos();\n}', expect: J`zoo\s*\[\s*i\s*\]\.dajGlos\s*\(\s*\)\s*;\s*\}` },
        ],
        solution: [...ZOO6, FL('Main.java', MAINW(['Zwierze[] zoo = { new Pies(), new Kot(), new Pies() };', 'for (int i = 0; i < zoo.length; i++) {', '    zoo[i].dajGlos();', '}']))],
        checks: [
          CK(CR, 'Wynik: Hau!, Miau!, Hau!', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Hau!, Miau!, Hau!] – program wypisał: " + o, o.equals(Arrays.asList("Hau!", "Miau!", "Hau!")));`),
          CK(MD, 'Tablica ma typ nadklasy i pętla', J`isTrue("Użyj tablicy Zwierze[]", srcHas("Main", "Zwierze\\s*\\[\\s*\\]")); isTrue("Użyj pętli for", srcHas("Main", "\\bfor\\s*\\("));`),
        ],
      },
      exercise: {
        prompt: '<p>Klasy <code>Figura</code> (<code>int pole()</code> zwraca 0), <code>Kwadrat(int bok)</code> i <code>Prostokat(int a, int b)</code> są gotowe i nadpisują <code>pole()</code>. W <code>main</code> zrób tablicę <code>Figura[]</code>: <code>new Kwadrat(2)</code>, <code>new Prostokat(3, 4)</code>, <code>new Kwadrat(3)</code>. W pętli zsumuj pola i wypisz <code>Razem: 25</code>.</p>',
        files: [FL('Figura.java', 'public class Figura {\n    public int pole() {\n        return 0;\n    }\n}\n'), FL('Kwadrat.java', 'public class Kwadrat extends Figura {\n    private int bok;\n\n    public Kwadrat(int bok) {\n        this.bok = bok;\n    }\n\n    @Override\n    public int pole() {\n        return bok * bok;\n    }\n}\n'), FL('Prostokat.java', 'public class Prostokat extends Figura {\n    private int a;\n    private int b;\n\n    public Prostokat(int a, int b) {\n        this.a = a;\n        this.b = b;\n    }\n\n    @Override\n    public int pole() {\n        return a * b;\n    }\n}\n'), FL('Main.java', MAINW([]))],
        hints: ['<code>Figura[] figury = { new Kwadrat(2), new Prostokat(3, 4), new Kwadrat(3) };</code>', '<code>suma += figury[i].pole();</code> w pętli, wynik po pętli.'],
        solution: [FL('Figura.java', 'public class Figura {\n    public int pole() {\n        return 0;\n    }\n}\n'), FL('Kwadrat.java', 'public class Kwadrat extends Figura {\n    private int bok;\n\n    public Kwadrat(int bok) {\n        this.bok = bok;\n    }\n\n    @Override\n    public int pole() {\n        return bok * bok;\n    }\n}\n'), FL('Prostokat.java', 'public class Prostokat extends Figura {\n    private int a;\n    private int b;\n\n    public Prostokat(int a, int b) {\n        this.a = a;\n        this.b = b;\n    }\n\n    @Override\n    public int pole() {\n        return a * b;\n    }\n}\n'), FL('Main.java', MAINW(['Figura[] figury = { new Kwadrat(2), new Prostokat(3, 4), new Kwadrat(3) };', 'int suma = 0;', 'for (int i = 0; i < figury.length; i++) {', '    suma += figury[i].pole();', '}', 'System.out.println("Razem: " + suma);']))],
        checks: [
          CK(CR, 'Wynik: Razem: 25', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Razem: 25] – program wypisał: " + o, o.equals(Arrays.asList("Razem: 25")));`),
          CK(MD, 'Użyto tablicy Figura[] i pętli', J`isTrue("Użyj tablicy Figura[]", srcHas("Main", "Figura\\s*\\[\\s*\\]")); isTrue("Użyj pętli for", srcHas("Main", "\\bfor\\s*\\("));`),
        ],
      },
      quiz: [
        Q('Jakiego typu tablicę zrobić dla psów i kotów razem?', ['Zwierze[] (typ nadklasy)', 'Pies[]', 'Kot[]', 'int[]'], 0, 'Tablica nadklasy pomieści obiekty wszystkich klas pochodnych.'),
        OUTQ('Co wypisze program?', ['Hau!<br>Miau!', 'Miau!<br>Hau!', 'Hau!<br>Hau!', 'błąd'], 0, 'Pętla woła <code>dajGlos()</code> po kolei, a każdy obiekt reaguje po swojemu.', 'class Zwierze {\n    void dajGlos() {\n        System.out.println("...");\n    }\n}\n\nclass Pies extends Zwierze {\n    @Override\n    void dajGlos() {\n        System.out.println("Hau!");\n    }\n}\n\nclass Kot extends Zwierze {\n    @Override\n    void dajGlos() {\n        System.out.println("Miau!");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Zwierze[] zoo = { new Pies(), new Kot() };\n        for (int i = 0; i < zoo.length; i++) {\n            zoo[i].dajGlos();\n        }\n    }\n}\n'),
        Q('Na czym polega zaleta pętli po tablicy typu nadklasy?', ['nie musimy sprawdzać, jaki dokładnie obiekt jest w każdej szafce', 'pętla działa szybciej', 'nie trzeba nadpisywać metod', 'tablica zajmuje mniej pamięci'], 0, 'Polimorfizm sam wybierze właściwą wersję metody.'),
      ],
    },

    {
      id: 'pol-parametr', title: 'Parametr typu nadklasy', blurb: 'jedna metoda przyjmuje każde zwierzę', minutes: 4,
      content: [
        ANA('🍽️', 'Miska na karmę pasuje do <b>każdego zwierzaka</b>. Metoda <code>nakarm(Zwierze z)</code> też: przyjmie psa, kota i każde inne zwierzę, które kiedyś dodasz, bez przepisywania. Wystarczy jedna metoda zamiast osobnej dla każdej klasy.'),
        CODE(ZOO6_RUN('nakarm(new Pies());\n        nakarm(new Kot());', '    static void nakarm(Zwierze z) {\n        System.out.print("Karmie: ");\n        z.dajGlos();\n    }\n\n'), 'Karmie: Hau!\nKarmie: Miau!'),
        NOTE('tip', 'To bardzo wygodne w projekcie: metoda przyjmująca <code>Postac</code> obsłuży każdą klasę pochodną, także te, które dopiszesz później.'),
      ],
      guide: {
        files: [...ZOO6, FL('Main.java', 'public class Main {\n    public static void main(String[] args) {\n        nakarm(new Pies());\n        nakarm(new Kot());\n    }\n}\n')],
        steps: [
          { say: '<p>W <code>main</code> wołamy <code>nakarm</code> dla psa i kota, ale takiej metody jeszcze nie ma. Napisz ją <b>nad main</b>. Parametr ma typ <b>nadklasy</b>, więc przyjmie obie klasy.</p>', type: '    static void nakarm(Zwierze z) {', expect: J`static\s+void\s+nakarm\s*\(\s*Zwierze\s+z\s*\)\s*\{` },
          { say: '<p>W środku każ zwierzęciu dać głos i zamknij metodę.</p>', type: '        z.dajGlos();\n    }', expect: J`nakarm\s*\(\s*Zwierze\s+z\s*\)\s*\{\s*z\.dajGlos\s*\(\s*\)\s*;\s*\}` },
        ],
        solution: [...ZOO6, FL('Main.java', 'public class Main {\n    static void nakarm(Zwierze z) {\n        z.dajGlos();\n    }\n\n    public static void main(String[] args) {\n        nakarm(new Pies());\n        nakarm(new Kot());\n    }\n}\n')],
        checks: [
          CK(CR, 'Wynik: Hau! i Miau!', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Hau!, Miau!] – program wypisał: " + o, o.equals(Arrays.asList("Hau!", "Miau!")));`),
          CK(MD, 'Metoda nakarm przyjmuje Zwierze', J`method("Main", "nakarm", cls("Zwierze"));`),
        ],
      },
      exercise: {
        prompt: '<p>Klasa <code>Figura</code> i jej podklasy <code>Kwadrat</code>, <code>Prostokat</code> są gotowe. W <code>Main</code> napisz metodę <code>static void wypisz(Figura f)</code>, która wypisuje <code>Pole: </code> i wynik <code>f.pole()</code>. W <code>main</code> wywołaj ją dla <code>new Kwadrat(4)</code> i <code>new Prostokat(2, 5)</code>.</p><pre>Pole: 16\nPole: 10</pre>',
        files: [FL('Figura.java', 'public class Figura {\n    public int pole() {\n        return 0;\n    }\n}\n'), FL('Kwadrat.java', 'public class Kwadrat extends Figura {\n    private int bok;\n\n    public Kwadrat(int bok) {\n        this.bok = bok;\n    }\n\n    @Override\n    public int pole() {\n        return bok * bok;\n    }\n}\n'), FL('Prostokat.java', 'public class Prostokat extends Figura {\n    private int a;\n    private int b;\n\n    public Prostokat(int a, int b) {\n        this.a = a;\n        this.b = b;\n    }\n\n    @Override\n    public int pole() {\n        return a * b;\n    }\n}\n'), FL('Main.java', MAINW([]))],
        hints: ['<code>static void wypisz(Figura f) { System.out.println("Pole: " + f.pole()); }</code>', 'W main: <code>wypisz(new Kwadrat(4)); wypisz(new Prostokat(2, 5));</code>'],
        solution: [FL('Figura.java', 'public class Figura {\n    public int pole() {\n        return 0;\n    }\n}\n'), FL('Kwadrat.java', 'public class Kwadrat extends Figura {\n    private int bok;\n\n    public Kwadrat(int bok) {\n        this.bok = bok;\n    }\n\n    @Override\n    public int pole() {\n        return bok * bok;\n    }\n}\n'), FL('Prostokat.java', 'public class Prostokat extends Figura {\n    private int a;\n    private int b;\n\n    public Prostokat(int a, int b) {\n        this.a = a;\n        this.b = b;\n    }\n\n    @Override\n    public int pole() {\n        return a * b;\n    }\n}\n'), FL('Main.java', 'public class Main {\n    static void wypisz(Figura f) {\n        System.out.println("Pole: " + f.pole());\n    }\n\n    public static void main(String[] args) {\n        wypisz(new Kwadrat(4));\n        wypisz(new Prostokat(2, 5));\n    }\n}\n')],
        checks: [
          CK(CR, 'Wynik: Pole: 16 i Pole: 10', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Pole: 16, Pole: 10] – program wypisał: " + o, o.equals(Arrays.asList("Pole: 16", "Pole: 10")));`),
          CK(MD, 'Metoda wypisz przyjmuje Figura', J`method("Main", "wypisz", cls("Figura"));`),
        ],
      },
      quiz: [
        Q('Jaki obiekt można przekazać do metody <code>void f(Zwierze z)</code>?', ['Pies, Kot i każdy inny obiekt klasy pochodnej Zwierze', 'tylko obiekt klasy Zwierze', 'tylko Pies', 'dowolny obiekt'], 0, 'Obiekt klasy pochodnej jest też obiektem nadklasy.'),
        Q('Zaleta metody z parametrem nadklasy?', ['jedna metoda obsługuje wszystkie klasy pochodne', 'metoda jest szybsza', 'nie trzeba pisać konstruktorów', 'można pominąć słowo static'], 0, 'Nie trzeba pisać osobnej metody dla każdej podklasy.'),
      ],
    },

    {
      id: 'pol-downcast', title: 'Downcasting: powrót do konkretnej klasy', blurb: '(Pies) z i ClassCastException', minutes: 5,
      content: [
        ANA('🔍', 'Urzędnik widzi tylko „zwierzę”. Jeśli <b>wiesz</b>, że to pies, możesz „zdjąć przebranie”: <code>(Pies) z</code>. To <b>rzutowanie w dół</b> (downcasting). Dzięki niemu wolno Ci wywołać metody <b>specyficzne dla Psa</b>, np. <code>szczekaj()</code>. Musisz jednak mieć rację: jeśli w środku jest kot, program wyrzuci <code>ClassCastException</code>.'),
        VIZ('compare', { cols: [
          { icon: '✅', title: '(Pies) z', c: 'ok', sub: 'gdy w z jest Pies', items: ['można wołać <code>szczekaj()</code>'] },
          { icon: '💥', title: '(Pies) z', c: 'bad', sub: 'gdy w z jest Kot', items: ['<code>ClassCastException</code> w czasie działania'] }] }),
        CODE(ZOO6_RUN('Zwierze z = new Pies();\n        Pies p = (Pies) z;\n        p.szczekaj();'), 'Pies szczeka glosno'),
        NOTE('warn', 'Rzutowanie w dół jest <b>jawne</b> (piszesz <code>(Pies)</code>), bo kompilator nie ma pewności. Rzutowanie w górę (upcasting) jest automatyczne, bo zawsze bezpieczne.'),
      ],
      guide: {
        files: [...ZOO6, FL('Main.java', MAINW(['Zwierze z = new Pies();']))],
        steps: [
          { say: '<p>Zmienna <code>z</code> jest typu <code>Zwierze</code>, więc nie widzi metody <code>szczekaj()</code>. Zrób rzutowanie w dół: w nawiasie podaj docelową klasę.</p>', type: 'Pies p = (Pies) z;', expect: J`Pies\s+p\s*=\s*\(\s*Pies\s*\)\s*z\s*;` },
          { say: '<p>Teraz przez zmienną typu <code>Pies</code> możesz wołać metodę specyficzną dla psa.</p>', type: 'p.szczekaj();', expect: J`\bp\.szczekaj\s*\(\s*\)\s*;` },
        ],
        solution: [...ZOO6, FL('Main.java', MAINW(['Zwierze z = new Pies();', 'Pies p = (Pies) z;', 'p.szczekaj();']))],
        checks: [
          CK(CR, 'Program wypisuje „Pies szczeka glosno”', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Pies szczeka glosno] – program wypisał: " + o, o.equals(Arrays.asList("Pies szczeka glosno")));`),
          CK(MD, 'Użyto rzutowania (Pies)', J`isTrue("Zrzutuj: (Pies) z", srcHas("Main", "\\(\\s*Pies\\s*\\)\\s*z"));`),
        ],
      },
      exercise: {
        prompt: '<p>Masz <code>Zwierze z = new Kot();</code>. Zrzutuj ją na <code>Kot</code> do zmiennej <code>k</code> i wywołaj metodę specyficzną dla kota <code>miaucz()</code>. Program ma wypisać <code>Kot miauczy glosno</code>.</p>',
        files: [...ZOO6, FL('Main.java', MAINW(['Zwierze z = new Kot();']))],
        hints: ['<code>Kot k = (Kot) z;</code>', '<code>k.miaucz();</code>'],
        solution: [...ZOO6, FL('Main.java', MAINW(['Zwierze z = new Kot();', 'Kot k = (Kot) z;', 'k.miaucz();']))],
        checks: [
          CK(CR, 'Program wypisuje „Kot miauczy glosno”', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Kot miauczy glosno] – program wypisał: " + o, o.equals(Arrays.asList("Kot miauczy glosno")));`),
          CK(MD, 'Użyto rzutowania (Kot)', J`isTrue("Zrzutuj: (Kot) z", srcHas("Main", "\\(\\s*Kot\\s*\\)\\s*z"));`),
        ],
      },
      quiz: [
        Q('Po co robimy downcasting?', ['żeby użyć metod specyficznych dla klasy pochodnej', 'żeby przyspieszyć program', 'żeby zmienić obiekt w inny', 'żeby usunąć obiekt'], 0, 'Zmienna nadklasy nie widzi metod podklasy.'),
        Q('Co się stanie przy <code>Zwierze z = new Kot(); Pies p = (Pies) z;</code>?', ['ClassCastException w czasie działania', 'błąd kompilacji', 'p będzie null', 'zadziała normalnie'], 0, 'Obiekt jest Kotem, więc nie da się go zrzutować na Psa.'),
        Q('Które rzutowanie jest automatyczne (bez zapisu w nawiasie)?', ['w górę: Pies → Zwierze', 'w dół: Zwierze → Pies', 'oba', 'żadne'], 0, 'Upcasting jest zawsze bezpieczny.'),
      ],
    },

    {
      id: 'pol-instanceof', title: 'instanceof: bezpieczne sprawdzanie typu', blurb: 'if (z instanceof Pies)', minutes: 5,
      content: [
        ANA('🪪', 'Zanim zdejmiesz przebranie, <b>zerknij na dowód osobisty</b>: <code>z instanceof Pies</code> odpowiada <code>true</code>, jeśli w środku jest pies (lub klasa po nim dziedzicząca). Dopiero wtedy rzutujesz. W ten sposób unikasz <code>ClassCastException</code>.'),
        CODE(ZOO6_RUN('Zwierze[] zoo = { new Pies(), new Kot(), new Pies() };\n        int psy = 0;\n        for (int i = 0; i < zoo.length; i++) {\n            if (zoo[i] instanceof Pies) {\n                Pies p = (Pies) zoo[i];\n                p.szczekaj();\n                psy++;\n            }\n        }\n        System.out.println("Psow: " + psy);'), 'Pies szczeka glosno\nPies szczeka glosno\nPsow: 2'),
        NOTE('tip', 'Schemat bezpiecznego rzutowania: <code>if (x instanceof Klasa) { Klasa k = (Klasa) x; ... }</code>. Nowsza Java pozwala to skrócić do <code>if (x instanceof Klasa k)</code>, ale na zajęciach używa się zwykle wersji powyżej.'),
      ],
      guide: {
        files: [...ZOO6, FL('Main.java', MAINW(['Zwierze[] zoo = { new Pies(), new Kot(), new Pies() };']))],
        steps: [
          { say: '<p>Licznik psów i pętla po tablicy.</p>', type: 'int psy = 0;\nfor (int i = 0; i < zoo.length; i++) {', expect: J`int\s+psy\s*=\s*0\s*;\s*for\s*\(\s*int\s+i\s*=\s*0\s*;\s*i\s*<\s*zoo\.length\s*;\s*i\+\+\s*\)\s*\{` },
          { say: '<p>Sprawdź, czy bieżące zwierzę to pies.</p>', type: '    if (zoo[i] instanceof Pies) {', expect: J`if\s*\(\s*zoo\s*\[\s*i\s*\]\s*instanceof\s+Pies\s*\)\s*\{` },
          { say: '<p>Jeśli tak – zwiększ licznik. Zamknij <code>if</code> i pętlę.</p>', type: '        psy++;\n    }\n}', expect: J`instanceof\s+Pies\s*\)\s*\{\s*psy\s*(\+\+|\+=\s*1)\s*;\s*\}\s*\}` },
          { say: '<p>Po pętli wypisz wynik.</p>', type: 'System.out.println("Psow: " + psy);', expect: J`println\s*\(\s*"Psow: "\s*\+\s*psy\s*\)` },
        ],
        solution: [...ZOO6, FL('Main.java', MAINW(['Zwierze[] zoo = { new Pies(), new Kot(), new Pies() };', 'int psy = 0;', 'for (int i = 0; i < zoo.length; i++) {', '    if (zoo[i] instanceof Pies) {', '        psy++;', '    }', '}', 'System.out.println("Psow: " + psy);']))],
        checks: [
          CK(CR, 'Wynik: Psow: 2', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Psow: 2] – program wypisał: " + o, o.equals(Arrays.asList("Psow: 2")));`),
          CK(MD, 'Użyto instanceof', J`isTrue("Użyj operatora instanceof", srcHas("Main", "instanceof\\s+Pies"));`),
        ],
      },
      exercise: {
        prompt: '<p>Tablica <code>zoo</code> zawiera <code>new Kot(), new Pies(), new Kot(), new Kot()</code>. Policz w pętli, ile jest <b>kotów</b> (<code>instanceof Kot</code>), i wypisz <code>Kotow: 3</code>.</p>',
        files: [...ZOO6, FL('Main.java', MAINW(['Zwierze[] zoo = { new Kot(), new Pies(), new Kot(), new Kot() };']))],
        hints: ['<code>int koty = 0;</code> i pętla po <code>zoo.length</code>', '<code>if (zoo[i] instanceof Kot) { koty++; }</code>'],
        solution: [...ZOO6, FL('Main.java', MAINW(['Zwierze[] zoo = { new Kot(), new Pies(), new Kot(), new Kot() };', 'int koty = 0;', 'for (int i = 0; i < zoo.length; i++) {', '    if (zoo[i] instanceof Kot) {', '        koty++;', '    }', '}', 'System.out.println("Kotow: " + koty);']))],
        checks: [
          CK(CR, 'Wynik: Kotow: 3', J`List<String> o = lines(runMain()); isTrue("Oczekiwano: [Kotow: 3] – program wypisał: " + o, o.equals(Arrays.asList("Kotow: 3")));`),
          CK(MD, 'Użyto instanceof Kot', J`isTrue("Użyj operatora instanceof Kot", srcHas("Main", "instanceof\\s+Kot"));`),
        ],
      },
      quiz: [
        Q('Co sprawdza <code>z instanceof Pies</code>?', ['czy obiekt w z jest Psem (lub podklasą Psa)', 'czy zmienna z ma nazwę Pies', 'czy z jest null', 'czy klasa Pies istnieje'], 0, 'Zwraca true lub false.'),
        Q('Jak uniknąć <code>ClassCastException</code> przy rzutowaniu w dół?', ['sprawdzić instanceof przed rzutowaniem', 'użyć słowa final', 'zamienić klasę na static', 'rzutować dwa razy'], 0, 'Najpierw sprawdź typ, potem rzutuj.'),
        OUTQ('Co wypisze program?', ['1', '2', '0', 'błąd'], 0, 'Tylko jeden element tablicy jest Psem.', 'class Zwierze {\n}\n\nclass Pies extends Zwierze {\n}\n\nclass Kot extends Zwierze {\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Zwierze[] zoo = { new Pies(), new Kot(), new Kot() };\n        int n = 0;\n        for (int i = 0; i < zoo.length; i++) {\n            if (zoo[i] instanceof Pies) {\n                n++;\n            }\n        }\n        System.out.println(n);\n    }\n}\n'),
      ],
    },
  ],
  labs: [
    {
      id: 'lab3-z3', title: 'Zadanie 3: Bohater, ekwipunek i przedmioty', source: 'Zadania 3.pdf – zadanie 3', concepts: ['pol-downcast', 'pol-dynamiczne', 'dz-override'],
      statement: J`<ol>
<li><b>Przedmiot</b> – prywatne pola <code>nazwa</code> (String), <code>wartosc</code> (int); konstruktor (nazwa, wartosc); <code>toString()</code> zwraca <code>nazwa wartosc</code>, np. <code>Miecz 50</code>. Dodaj gettery <code>getNazwa()</code>, <code>getWartosc()</code>.</li>
<li><b>Bohater</b> – prywatne pola: <code>nazwa</code> (String), <code>punktyZycia</code>, <code>maxPunktyZycia</code>, <code>zloto</code> (int), <code>przedmioty</code> (tablica typu <code>Przedmiot</code>). Konstruktor (nazwa, punktyZycia, maxPunktyZycia, zloto) tworzy też tablicę <code>przedmioty</code> o <b>10</b> elementach. <code>toString()</code>: <code>nazwa punktyZycia maxPunktyZycia zloto</code>, np. <code>Geralt 80 100 50</code>.</li>
<li><b>Pokarm</b> dziedziczy po <code>Przedmiot</code>, ma dodatkowe pole <code>punktyOdnowyZycia</code> (int). Konstruktor (nazwa, wartosc, punktyOdnowyZycia). <code>toString()</code>: tekst z Przedmiotu + spacja + punktyOdnowyZycia, np. <code>Chleb 5 20</code>.</li>
<li>W Bohaterze: <code>boolean sprzedaj(int indeks)</code> – jeśli na indeksie jest przedmiot: usuń go z tablicy (<code>null</code>), dodaj jego wartość do <code>zloto</code> i zwróć <code>true</code>; w przeciwnym razie <code>false</code>.</li>
<li><code>boolean dodajDoEkwipunku(Przedmiot przedmiot)</code> – wstawia przedmiot na <b>pierwsze puste</b> miejsce i zwraca <code>true</code>; gdy brak miejsca – <code>false</code>.</li>
<li><code>void wyswietlEkwipunek()</code> – wypisuje (po jednym w linii) <code>toString()</code> każdego przedmiotu z ekwipunku (puste miejsca pomiń).</li>
<li><code>boolean zjedzPrzedmiot(int indeks)</code> – jeśli na indeksie jest <b>Pokarm</b> (sprawdź <code>instanceof</code>): zwiększ <code>punktyZycia</code> o <code>punktyOdnowyZycia</code> (nie więcej niż <code>maxPunktyZycia</code>), usuń przedmiot z ekwipunku i zwróć <code>true</code>. Pusty slot lub przedmiot niebędący pokarmem → <code>false</code> (przedmiot zostaje).</li>
<li>W <code>main</code> utwórz Bohatera i przetestuj wszystkie metody.</li>
</ol>`,
      notes: 'PDF nie precyzuje, co dokładnie robi „zjedzenie” – przyjęto: dodanie punktów życia z limitem do <code>maxPunktyZycia</code> i usunięcie przedmiotu. Na zaliczeniu sprawdź u prowadzącej, czy tak samo to rozumie. Kod w <code>zjedzPrzedmiot</code> to klasyczne <b>downcasting po instanceof</b>: <code>if (przedmioty[i] instanceof Pokarm) { Pokarm p = (Pokarm) przedmioty[i]; ... }</code>.',
      files: [
        { name: 'Przedmiot.java', code: J`public class Przedmiot {

}
` },
        { name: 'Pokarm.java', code: J`public class Pokarm {

}
` },
        { name: 'Bohater.java', code: J`public class Bohater {

}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {

    }
}
` }],
      hints: ['Tablicę utwórz w konstruktorze: <code>przedmioty = new Przedmiot[10];</code>', 'Pętla w <code>dodajDoEkwipunku</code>: pierwszy indeks, na którym <code>przedmioty[i] == null</code> → wstaw i <code>return true</code>.', 'W <code>zjedzPrzedmiot</code> nie zapomnij, że przedmiot na indeksie może być <code>null</code> – <code>null instanceof Pokarm</code> daje <code>false</code>, więc to bezpieczne.', '<code>Pokarm</code> musi mieć getter punktów odnowy (pole jest prywatne), np. <code>getPunktyOdnowyZycia()</code>.'],
      solution: [
        { name: 'Przedmiot.java', code: J`public class Przedmiot {
    private String nazwa;
    private int wartosc;

    public Przedmiot(String nazwa, int wartosc) {
        this.nazwa = nazwa;
        this.wartosc = wartosc;
    }

    public String getNazwa() {
        return nazwa;
    }

    public int getWartosc() {
        return wartosc;
    }

    @Override
    public String toString() {
        return nazwa + " " + wartosc;
    }
}
` },
        { name: 'Pokarm.java', code: J`public class Pokarm extends Przedmiot {
    private int punktyOdnowyZycia;

    public Pokarm(String nazwa, int wartosc, int punktyOdnowyZycia) {
        super(nazwa, wartosc);
        this.punktyOdnowyZycia = punktyOdnowyZycia;
    }

    public int getPunktyOdnowyZycia() {
        return punktyOdnowyZycia;
    }

    @Override
    public String toString() {
        return super.toString() + " " + punktyOdnowyZycia;
    }
}
` },
        { name: 'Bohater.java', code: J`public class Bohater {
    private String nazwa;
    private int punktyZycia;
    private int maxPunktyZycia;
    private int zloto;
    private Przedmiot[] przedmioty;

    public Bohater(String nazwa, int punktyZycia, int maxPunktyZycia, int zloto) {
        this.nazwa = nazwa;
        this.punktyZycia = punktyZycia;
        this.maxPunktyZycia = maxPunktyZycia;
        this.zloto = zloto;
        this.przedmioty = new Przedmiot[10];
    }

    public boolean sprzedaj(int indeks) {
        if (indeks < 0 || indeks >= przedmioty.length || przedmioty[indeks] == null) {
            return false;
        }
        zloto += przedmioty[indeks].getWartosc();
        przedmioty[indeks] = null;
        return true;
    }

    public boolean dodajDoEkwipunku(Przedmiot przedmiot) {
        for (int i = 0; i < przedmioty.length; i++) {
            if (przedmioty[i] == null) {
                przedmioty[i] = przedmiot;
                return true;
            }
        }
        return false;
    }

    public void wyswietlEkwipunek() {
        for (int i = 0; i < przedmioty.length; i++) {
            if (przedmioty[i] != null) {
                System.out.println(przedmioty[i].toString());
            }
        }
    }

    public boolean zjedzPrzedmiot(int indeks) {
        if (indeks < 0 || indeks >= przedmioty.length) {
            return false;
        }
        if (przedmioty[indeks] instanceof Pokarm) {
            Pokarm pokarm = (Pokarm) przedmioty[indeks];
            punktyZycia += pokarm.getPunktyOdnowyZycia();
            if (punktyZycia > maxPunktyZycia) {
                punktyZycia = maxPunktyZycia;
            }
            przedmioty[indeks] = null;
            return true;
        }
        return false;
    }

    @Override
    public String toString() {
        return nazwa + " " + punktyZycia + " " + maxPunktyZycia + " " + zloto;
    }
}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {
        Bohater b = new Bohater("Geralt", 80, 100, 50);
        System.out.println(b);
        b.dodajDoEkwipunku(new Przedmiot("Miecz", 50));
        b.dodajDoEkwipunku(new Pokarm("Chleb", 5, 20));
        b.wyswietlEkwipunek();
        System.out.println(b.zjedzPrzedmiot(0));
        System.out.println(b.zjedzPrzedmiot(1));
        System.out.println(b);
        System.out.println(b.sprzedaj(0));
        System.out.println(b.sprzedaj(0));
        System.out.println(b);
    }
}
` }],
      checks: [
        CK(CR, 'Przedmiot: pola prywatne, konstruktor, toString', J`isTrue("nazwa ma być private", Modifier.isPrivate(fieldMods("Przedmiot", "nazwa")));
isTrue("wartosc ma być private", Modifier.isPrivate(fieldMods("Przedmiot", "wartosc")));
Object p = make("Przedmiot", "Miecz", 50);
eq("Miecz", field(p, "nazwa")); eq(50, field(p, "wartosc")); eq("Miecz 50", p.toString());`),
        CK(CR, 'Pokarm dziedziczy po Przedmiot; toString = Przedmiot + punkty odnowy', J`isTrue("Pokarm musi dziedziczyć po Przedmiot", isSubclass("Pokarm", "Przedmiot"));
Object p = make("Pokarm", "Chleb", 5, 20);
eq("Chleb", field(p, "nazwa")); eq(20, field(p, "punktyOdnowyZycia"));
eq("Chleb 5 20", p.toString());`),
        CK(CR, 'Bohater: pola prywatne, konstruktor, tablica 10 elementów, toString', J`for (String n : new String[]{"nazwa", "punktyZycia", "maxPunktyZycia", "zloto", "przedmioty"}) {
    isTrue("Brak pola " + n, hasField("Bohater", n));
    isTrue("Pole " + n + " ma być private", Modifier.isPrivate(fieldMods("Bohater", n)));
}
Object b = make("Bohater", "Geralt", 80, 100, 50);
eq(10, ((Object[]) field(b, "przedmioty")).length);
eq("Geralt 80 100 50", b.toString());`),
        CK(CR, 'dodajDoEkwipunku: wstawia na pierwsze wolne miejsce; true/false', J`Object b = make("Bohater", "G", 1, 1, 0);
for (int i = 0; i < 10; i++) eq(true, call(b, "dodajDoEkwipunku", make("Przedmiot", "p" + i, i)));
eq(false, call(b, "dodajDoEkwipunku", make("Przedmiot", "za dużo", 1)));
Object[] t = (Object[]) field(b, "przedmioty");
eq("p0 0", t[0].toString()); eq("p9 9", t[9].toString());`),
        CK(CR, 'dodajDoEkwipunku zajmuje zwolnione miejsce (pierwsze puste)', J`Object b = make("Bohater", "G", 1, 1, 0);
for (int i = 0; i < 5; i++) call(b, "dodajDoEkwipunku", make("Przedmiot", "p" + i, i));
call(b, "sprzedaj", 2);
call(b, "dodajDoEkwipunku", make("Przedmiot", "nowy", 7));
eq("nowy 7", ((Object[]) field(b, "przedmioty"))[2].toString());`),
        CK(CR, 'sprzedaj: dodaje wartość do złota, usuwa przedmiot, zwraca true/false', J`Object b = make("Bohater", "G", 10, 10, 100);
call(b, "dodajDoEkwipunku", make("Przedmiot", "Miecz", 50));
eq(true, call(b, "sprzedaj", 0));
eq(150, field(b, "zloto"));
isTrue("Slot powinien być pusty", ((Object[]) field(b, "przedmioty"))[0] == null);
eq(false, call(b, "sprzedaj", 0));
eq(150, field(b, "zloto"));
eq(false, call(b, "sprzedaj", 5));`),
        CK(MD, 'wyswietlEkwipunek: po jednej linii na przedmiot (bez pustych miejsc)', J`Object b = make("Bohater", "G", 10, 10, 0);
call(b, "dodajDoEkwipunku", make("Przedmiot", "Miecz", 50));
call(b, "dodajDoEkwipunku", make("Pokarm", "Chleb", 5, 20));
String o = out(() -> call(b, "wyswietlEkwipunek"));
eq(java.util.Arrays.asList("Miecz 50", "Chleb 5 20"), lines(o));`),
        CK(CR, 'zjedzPrzedmiot: pokarm leczy, znika z ekwipunku, zwraca true', J`Object b = make("Bohater", "G", 50, 100, 0);
call(b, "dodajDoEkwipunku", make("Pokarm", "Chleb", 5, 20));
eq(true, call(b, "zjedzPrzedmiot", 0));
eq(70, field(b, "punktyZycia"));
isTrue("Pokarm powinien zniknąć", ((Object[]) field(b, "przedmioty"))[0] == null);`),
        CK(MD, 'zjedzPrzedmiot: leczenie nie przekracza maxPunktyZycia', J`Object b = make("Bohater", "G", 90, 100, 0);
call(b, "dodajDoEkwipunku", make("Pokarm", "Chleb", 5, 20));
call(b, "zjedzPrzedmiot", 0);
eq(100, field(b, "punktyZycia"));`),
        CK(CR, 'zjedzPrzedmiot: zwykły przedmiot i puste miejsce → false, nic się nie zmienia', J`Object b = make("Bohater", "G", 50, 100, 0);
call(b, "dodajDoEkwipunku", make("Przedmiot", "Miecz", 50));
eq(false, call(b, "zjedzPrzedmiot", 0));
isTrue("Miecz powinien zostać w ekwipunku", ((Object[]) field(b, "przedmioty"))[0] != null);
eq(50, field(b, "punktyZycia"));
eq(false, call(b, "zjedzPrzedmiot", 3));`),
        CK(MD, 'Main tworzy bohatera i wypisuje wyniki', J`String o = runMain();
isTrue("Main powinien wypisać wyniki testów (min. 5 linii) – jest: " + lines(o).size(), lines(o).size() >= 5);
isTrue("W Main utwórz instancję Bohater", srcHas("Main", "new\\s+Bohater\\s*\\("));`),
        CK(MN, 'Użyto instanceof i rzutowania na Pokarm', J`isTrue("W zjedzPrzedmiot użyj instanceof Pokarm", srcHas("Bohater", "instanceof\\s+Pokarm"));
isTrue("Rzutuj (Pokarm) po sprawdzeniu", srcHas("Bohater", "\\(\\s*Pokarm\\s*\\)"));`),
      ],
    },
  ],

  quiz: [
    Q('Co wypisze program?', ['true true false', 'true false false', 'true true true', 'false true false'], 0, 'Obiekt jest <code>Pies</code>-em, który jest też <code>Zwierze</code>-ciem, ale nie <code>Kot</code>-em.', 'pol-downcast', { code: J`class Zwierze {}
class Pies extends Zwierze {}
class Kot extends Zwierze {}

public class Main {
    public static void main(String[] args) {
        Zwierze z = new Pies();
        System.out.println((z instanceof Zwierze) + " " + (z instanceof Pies) + " " + (z instanceof Kot));
    }
}` }),
    Q('Co wypisze program?', ['Hau', 'Zwierze', 'błąd kompilacji', 'wyjątek ClassCastException'], 0, 'Wiązanie dynamiczne: wykona się metoda z rzeczywistej klasy obiektu (Pies).', 'pol-dynamiczne', { code: J`class Zwierze {
    String glos() { return "Zwierze"; }
}
class Pies extends Zwierze {
    @Override
    String glos() { return "Hau"; }
}

public class Main {
    public static void main(String[] args) {
        Zwierze z = new Pies();
        System.out.println(z.glos());
    }
}` }),
    Q('Które z poniższych zdań o upcastingu jest prawdziwe?', ['jest niejawny (nie wymaga operatora rzutowania)', 'zawsze jest bezpieczny', 'wymaga <code>instanceof</code>', 'pozwala wywołać metody tylko podklasy przez zmienną nadklasy'], [0, 1], 'Upcasting jest bezpieczny i automatyczny; przez zmienną nadklasy widać tylko składowe nadklasy.', 'pol-upcast'),
    Q('Kiedy potrzebne jest jawne rzutowanie (downcasting)?', ['gdy przypisujemy <code>Pies</code> do zmiennej <code>Zwierze</code>', 'gdy przypisujemy <code>Zwierze</code> (zmienną) do zmiennej <code>Pies</code>', 'gdy wywołujemy <code>toString()</code>', 'nigdy'], 1, 'Z nadklasy do podklasy rzutujemy jawnie, po sprawdzeniu <code>instanceof</code>.', 'pol-downcast'),
    Q('Co wypisze program?', ['A', 'B', 'AB', 'błąd kompilacji'], 0, 'Metoda statyczna zależy od typu zmiennej (A), a nie od rzeczywistego obiektu.', 'pol-dynamiczne', { code: J`class A { static String kto() { return "A"; } }
class B extends A { static String kto() { return "B"; } }

public class Main {
    public static void main(String[] args) {
        A x = new B();
        System.out.println(x.kto());
    }
}` }),
    Q('Co zawiera <code>Zwierze[] zoo = { new Pies(), new Kot() };</code>?', ['błąd kompilacji – tablica musi mieć jeden typ', 'dwa obiekty różnych podklas widziane jako Zwierze', 'tylko obiekty typu Zwierze', 'wyjątek w czasie działania'], 1, 'Tablica typu nadklasy może zawierać dowolne obiekty podklas – to podstawa polimorfizmu.', 'pol-dynamiczne'),
  ],
});
