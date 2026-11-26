'use strict';
ACAD.modules.push({
  id: 'kol', num: 12, level: 3, icon: '🗃️', title: 'Kolekcje: listy, zbiory, mapy',
  source: 'Prezentacja 5 – kolekcje (List, Set, Map) · (zadanie własne)',
  summary: 'ArrayList, HashSet, HashMap – kiedy której użyć, najważniejsze metody i związek z equals/hashCode.',
  goals: ['użyć <code>List</code>/<code>ArrayList</code> z indeksami i duplikatami', 'użyć <code>Set</code>/<code>HashSet</code> do unikalnych elementów', 'użyć <code>Map</code>/<code>HashMap</code> do par klucz–wartość', 'dobrać kolekcję do problemu (tablica, lista, zbiór, mapa)'],
  lessons: [

    {
      id: 'kol-idea', micro: true, title: 'Po co kolekcje?', blurb: 'tablica ma stały rozmiar, kolekcja rośnie', minutes: 4,
      content: [
        ANA('🧳', 'Tablica to <b>walizka o stałym rozmiarze</b>: mieści dokładnie tyle rzeczy, ile ustaliłeś na początku. Kolekcje to <b>worki, które się rozciągają</b>: dodajesz i usuwasz elementy, a rozmiar sam się zmienia. Są trzy podstawowe „rodzaje worków”: <b>lista</b> (kolejność + duplikaty), <b>zbiór</b> (tylko unikalne), <b>mapa</b> (pary klucz → wartość).'),
        VIZ('compare', { cols: [
          { icon: '📋', title: 'List', c: 'accent', sub: 'ArrayList', items: ['zachowuje <b>kolejność</b>', 'dostęp po <b>indeksie</b>', '<b>duplikaty</b> dozwolone'] },
          { icon: '🎯', title: 'Set', c: 'ok', sub: 'HashSet', items: ['<b>unikalne</b> elementy', 'bez gwarancji kolejności', 'szybkie sprawdzanie „czy jest?”'] },
          { icon: '🗝️', title: 'Map', c: 'warn', sub: 'HashMap', items: ['pary <b>klucz → wartość</b>', 'klucze unikalne', 'szybkie wyszukiwanie po kluczu'] }] }),
        NOTE('info', 'Wszystkie kolekcje są <b>generyczne</b> (poprzedni moduł): <code>List&lt;String&gt;</code>, <code>Set&lt;Integer&gt;</code>, <code>Map&lt;String, Integer&gt;</code>. Potrzebny jest import z <code>java.util</code>.'),
      ],
      quiz: [
        Q('Co odróżnia kolekcję od tablicy?', ['zmienny rozmiar', 'szybszy kod zawsze', 'brak indeksów', 'może trzymać tylko liczby'], 0, 'Kolekcje rosną i maleją.'),
        Q('Która kolekcja dopuszcza duplikaty i pamięta kolejność?', ['List', 'Set', 'Map (klucze)', 'żadna'], 0, 'Lista.'),
        Q('Z jakiego pakietu importujemy kolekcje?', ['java.util', 'java.io', 'java.lang', 'java.math'], 0, 'Np. <code>import java.util.ArrayList;</code>.'),
      ],
    },

    {
      id: 'kol-lista', title: 'Lista: ArrayList', blurb: 'add, get, size', minutes: 6,
      content: [
        ANA('📋', 'Lista to <b>numerowana lista zakupów</b>, do której możesz dopisywać pozycje. Tworzysz ją tak: <code>List&lt;String&gt; l = new ArrayList&lt;&gt;();</code>. Typ po lewej to <b>interfejs</b> (<code>List</code>), po prawej konkretna klasa (<code>ArrayList</code>). Najważniejsze metody: <code>add(x)</code> dodaje na koniec, <code>get(i)</code> pobiera element o indeksie <code>i</code> (od 0), <code>size()</code> zwraca liczbę elementów.'),
        VIZ('cells', { rows: [{ label: 'List&lt;String&gt; l', cells: ['"Ala"', '"Ola"', '"Ala"'], idx: true }], cap: 'Kolejność jest zachowana, indeksy 0, 1, 2. Duplikat „Ala” jest dozwolony.' }),
        CODE(J`import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> l = new ArrayList<>();
        l.add("Ala");
        l.add("Ola");
        l.add("Ala");
        System.out.println(l.size());
        System.out.println(l.get(1));
        System.out.println(l);
    }
}
`, '3\nOla\n[Ala, Ola, Ala]'),
        NOTE('warn', 'Indeks poza zakresem (np. <code>get(5)</code> przy 3 elementach) zgłasza <code>IndexOutOfBoundsException</code>. Przy tablicy to był <code>ArrayIndexOutOfBoundsException</code>.'),
      ],
      guide: {
        files: [FL('Kolekcje.java', 'import java.util.ArrayList;\nimport java.util.List;\n\npublic class Kolekcje {\n    public static List<String> stworz() {\n        return null;\n    }\n}\n')],
        steps: [
          { say: '<p>W metodzie <code>stworz()</code> utwórz pustą listę napisów. Zastąp <code>return null;</code> tym i kolejnymi krokami.</p>', type: '        List<String> l = new ArrayList<>();', expect: J`List\s*<\s*String\s*>\s+l\s*=\s*new\s+ArrayList\s*<\s*>\s*\(\s*\)\s*;` },
          { say: '<p>Dodaj dwa elementy metodą <code>add</code>.</p>', type: '        l.add("Ala");\n        l.add("Ola");', expect: J`l\.add\s*\(\s*"Ala"\s*\)\s*;\s*l\.add\s*\(\s*"Ola"\s*\)\s*;` },
          { say: '<p>Zwróć listę.</p>', type: '        return l;', expect: J`return\s+l\s*;` },
        ],
        solution: [FL('Kolekcje.java', 'import java.util.ArrayList;\nimport java.util.List;\n\npublic class Kolekcje {\n    public static List<String> stworz() {\n        List<String> l = new ArrayList<>();\n        l.add("Ala");\n        l.add("Ola");\n        return l;\n    }\n}\n')],
        checks: [
          CK(CR, 'Lista zawiera Ala i Olę w tej kolejności', J`List<String> l = Kolekcje.stworz(); eq(2, l.size()); eq("Ala", l.get(0)); eq("Ola", l.get(1));`),
        ],
      },
      exercise: {
        prompt: '<p>W <code>Kolekcje</code> napisz <code>static List&lt;Integer&gt; liczby(int n)</code>: zwraca listę kolejnych liczb <code>1, 2, ..., n</code>.</p>',
        files: [FL('Kolekcje.java', 'import java.util.ArrayList;\nimport java.util.List;\n\npublic class Kolekcje {\n}\n')],
        hints: ['Utwórz <code>List<Integer> l = new ArrayList<>();</code>', 'Pętla <code>for (int i = 1; i <= n; i++) { l.add(i); }</code>'],
        solution: [FL('Kolekcje.java', 'import java.util.ArrayList;\nimport java.util.List;\n\npublic class Kolekcje {\n    public static List<Integer> liczby(int n) {\n        List<Integer> l = new ArrayList<>();\n        for (int i = 1; i <= n; i++) {\n            l.add(i);\n        }\n        return l;\n    }\n}\n')],
        checks: [
          CK(CR, 'liczby(4) = [1, 2, 3, 4]', J`eq("[1, 2, 3, 4]", Kolekcje.liczby(4).toString());`),
          CK(CR, 'liczby(0) = pusta lista', J`eq(0, Kolekcje.liczby(0).size());`),
        ],
      },
      quiz: [
        Q('Jak dodać element na koniec listy?', ['l.add(x)', 'l.put(x)', 'l[x]', 'l.push(x)'], 0, 'Metoda <code>add</code>.'),
        Q('Od jakiego indeksu zaczyna się lista?', ['0', '1', '-1', 'zależy od typu'], 0, 'Tak jak tablica.'),
        OUTQ('Co wypisze program?', ['3', '2', '1', 'błąd'], 0, 'Lista pozwala na duplikaty, więc ma trzy elementy.', 'import java.util.ArrayList;\nimport java.util.List;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> l = new ArrayList<>();\n        l.add("a");\n        l.add("a");\n        l.add("b");\n        System.out.println(l.size());\n    }\n}\n'),
        OUTQ('Co wypisze program?', ['[x, y]', '[y, x]', 'x', 'błąd'], 0, 'Elementy są w kolejności dodawania.', 'import java.util.ArrayList;\nimport java.util.List;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> l = new ArrayList<>();\n        l.add("x");\n        l.add("y");\n        System.out.println(l);\n    }\n}\n'),
      ],
    },

    {
      id: 'kol-lista-petla', title: 'Lista: pętla, contains, remove', blurb: 'przechodzenie i modyfikowanie listy', minutes: 6,
      content: [
        ANA('🔍', 'Po liście chodzisz tak samo jak po tablicy: <code>for (String s : l)</code> (for-each) albo pętlą z indeksem. Do tego kilka przydatnych metod: <code>contains(x)</code> (czy jest?), <code>remove(x)</code> (usuń element), <code>set(i, x)</code> (podmień), <code>isEmpty()</code>.'),
        CODE(J`import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Integer> l = new ArrayList<>();
        l.add(4);
        l.add(7);
        l.add(10);

        int suma = 0;
        for (int x : l) {
            suma += x;
        }
        System.out.println(suma);
        System.out.println(l.contains(7));
        l.remove(Integer.valueOf(7));
        System.out.println(l);
    }
}
`, '21\ntrue\n[4, 10]'),
        NOTE('warn', 'Dla <code>List&lt;Integer&gt;</code> zapis <code>l.remove(7)</code> usuwa element o <b>indeksie</b> 7, a nie liczbę 7! Żeby usunąć wartość, użyj <code>l.remove(Integer.valueOf(7))</code>.'),
      ],
      guide: {
        files: [FL('Kolekcje.java', 'import java.util.List;\n\npublic class Kolekcje {\n    public static int sumuj(List<Integer> l) {\n        return 0;\n    }\n}\n')],
        steps: [
          { say: '<p>Zacznij od licznika sumy.</p>', type: '        int suma = 0;', expect: J`int\s+suma\s*=\s*0\s*;` },
          { say: '<p>Pętla for-each po liście: <code>x</code> to kolejny element.</p>', type: '        for (int x : l) {\n            suma += x;\n        }', expect: J`for\s*\(\s*int\s+x\s*:\s*l\s*\)\s*\{\s*suma\s*\+=\s*x\s*;\s*\}` },
          { say: '<p>Zwróć sumę (zastąp <code>return 0;</code>).</p>', type: '        return suma;', expect: J`return\s+suma\s*;` },
        ],
        solution: [FL('Kolekcje.java', 'import java.util.List;\n\npublic class Kolekcje {\n    public static int sumuj(List<Integer> l) {\n        int suma = 0;\n        for (int x : l) {\n            suma += x;\n        }\n        return suma;\n    }\n}\n')],
        checks: [
          CK(CR, 'Suma elementów listy', J`eq(21, Kolekcje.sumuj(new ArrayList<>(Arrays.asList(4, 7, 10)))); eq(0, Kolekcje.sumuj(new ArrayList<Integer>()));`),
        ],
      },
      exercise: {
        prompt: '<p>Napisz w <code>Kolekcje</code> metodę <code>static List&lt;Integer&gt; parzyste(List&lt;Integer&gt; l)</code>: zwraca <b>nową</b> listę zawierającą tylko liczby parzyste z <code>l</code> (w tej samej kolejności).</p>',
        files: [FL('Kolekcje.java', 'import java.util.ArrayList;\nimport java.util.List;\n\npublic class Kolekcje {\n}\n')],
        hints: ['Nowa lista: <code>List<Integer> wynik = new ArrayList<>();</code>', '<code>if (x % 2 == 0) { wynik.add(x); }</code>'],
        solution: [FL('Kolekcje.java', 'import java.util.ArrayList;\nimport java.util.List;\n\npublic class Kolekcje {\n    public static List<Integer> parzyste(List<Integer> l) {\n        List<Integer> wynik = new ArrayList<>();\n        for (int x : l) {\n            if (x % 2 == 0) {\n                wynik.add(x);\n            }\n        }\n        return wynik;\n    }\n}\n')],
        checks: [
          CK(CR, 'Zwraca tylko parzyste', J`eq("[2, 4, 6]", Kolekcje.parzyste(new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6))).toString());`),
          CK(CR, 'Brak parzystych → pusta lista', J`eq(0, Kolekcje.parzyste(new ArrayList<>(Arrays.asList(1, 3))).size());`),
          CK(MD, 'Oryginalna lista nie jest zmieniana', J`List<Integer> l = new ArrayList<>(Arrays.asList(1, 2, 3)); Kolekcje.parzyste(l); eq(3, l.size());`),
        ],
      },
      quiz: [
        Q('Co robi <code>l.contains(x)</code>?', ['sprawdza, czy lista zawiera x (używa equals)', 'dodaje x', 'usuwa x', 'zwraca indeks x'], 0, 'Zwraca boolean; opiera się na <code>equals</code>.'),
        Q('Co usuwa <code>l.remove(2)</code> dla <code>List&lt;Integer&gt;</code>?', ['element o indeksie 2', 'liczbę 2', 'wszystkie dwójki', 'nic'], 0, 'Dla typu int to indeks.'),
        OUTQ('Co wypisze program?', ['[a, c]', '[a, b]', '[b, c]', 'błąd'], 0, 'Usuwamy element „b”.', 'import java.util.ArrayList;\nimport java.util.List;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> l = new ArrayList<>();\n        l.add("a");\n        l.add("b");\n        l.add("c");\n        l.remove("b");\n        System.out.println(l);\n    }\n}\n'),
      ],
    },

    {
      id: 'kol-zbior', title: 'Zbiór: HashSet', blurb: 'tylko unikalne elementy', minutes: 6,
      content: [
        ANA('🎟️', 'Zbiór to <b>lista gości z zakazem powtórek</b>: gdy ktoś już jest na liście, drugi raz go nie dopiszesz. <code>HashSet</code> trzyma tylko <b>unikalne</b> elementy i nie gwarantuje kolejności. Jest bardzo szybki w odpowiedzi na pytanie „czy to już mam?” (<code>contains</code>).'),
        VIZ('compare', { cols: [
          { icon: '📋', title: 'List: dodaję a, a, b', c: 'accent', items: ['<code>[a, a, b]</code>', 'rozmiar 3'] },
          { icon: '🎯', title: 'Set: dodaję a, a, b', c: 'ok', items: ['<code>{a, b}</code>', 'rozmiar 2, powtórka zignorowana'] }] }),
        CODE(J`import java.util.HashSet;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        Set<String> s = new HashSet<>();
        s.add("a");
        s.add("a");
        s.add("b");
        System.out.println(s.size());
        System.out.println(s.contains("a"));
        System.out.println(s.contains("z"));
    }
}
`, '2\ntrue\nfalse'),
        NOTE('exam', 'Zbiór rozpoznaje „to samo” przez <code>equals</code> <b>i</b> <code>hashCode</code>. Dlatego własne klasy wkładane do <code>HashSet</code> muszą mieć oba nadpisane (moduł 9).'),
      ],
      guide: {
        files: [FL('Kolekcje.java', 'import java.util.HashSet;\nimport java.util.List;\nimport java.util.Set;\n\npublic class Kolekcje {\n    public static int ileUnikalnych(List<String> l) {\n        return 0;\n    }\n}\n')],
        steps: [
          { say: '<p>Utwórz pusty zbiór napisów.</p>', type: '        Set<String> s = new HashSet<>();', expect: J`Set\s*<\s*String\s*>\s+s\s*=\s*new\s+HashSet\s*<\s*>\s*\(\s*\)\s*;` },
          { say: '<p>Wrzuć do zbioru wszystkie elementy listy. Powtórki zostaną pominięte automatycznie.</p>', type: '        for (String x : l) {\n            s.add(x);\n        }', expect: J`for\s*\(\s*String\s+x\s*:\s*l\s*\)\s*\{\s*s\.add\s*\(\s*x\s*\)\s*;\s*\}` },
          { say: '<p>Rozmiar zbioru to liczba unikalnych elementów.</p>', type: '        return s.size();', expect: J`return\s+s\.size\s*\(\s*\)\s*;` },
        ],
        solution: [FL('Kolekcje.java', 'import java.util.HashSet;\nimport java.util.List;\nimport java.util.Set;\n\npublic class Kolekcje {\n    public static int ileUnikalnych(List<String> l) {\n        Set<String> s = new HashSet<>();\n        for (String x : l) {\n            s.add(x);\n        }\n        return s.size();\n    }\n}\n')],
        checks: [
          CK(CR, 'Liczy unikalne elementy', J`eq(2, Kolekcje.ileUnikalnych(new ArrayList<>(Arrays.asList("a", "a", "b")))); eq(0, Kolekcje.ileUnikalnych(new ArrayList<String>())); eq(3, Kolekcje.ileUnikalnych(new ArrayList<>(Arrays.asList("x", "y", "z"))));`),
        ],
      },
      exercise: {
        prompt: '<p>Napisz w <code>Kolekcje</code> metodę <code>static boolean maDuplikaty(List&lt;Integer&gt; l)</code>: zwraca <code>true</code>, gdy w liście jest jakaś liczba więcej niż raz. Wskazówka: porównaj rozmiar listy z rozmiarem zbioru.</p>',
        files: [FL('Kolekcje.java', 'import java.util.HashSet;\nimport java.util.List;\nimport java.util.Set;\n\npublic class Kolekcje {\n}\n')],
        hints: ['<code>Set<Integer> s = new HashSet<>(l);</code> (zbiór można utworzyć z listy)', '<code>return s.size() != l.size();</code>'],
        solution: [FL('Kolekcje.java', 'import java.util.HashSet;\nimport java.util.List;\nimport java.util.Set;\n\npublic class Kolekcje {\n    public static boolean maDuplikaty(List<Integer> l) {\n        Set<Integer> s = new HashSet<>(l);\n        return s.size() != l.size();\n    }\n}\n')],
        checks: [
          CK(CR, 'Wykrywa duplikaty', J`eq(true, Kolekcje.maDuplikaty(new ArrayList<>(Arrays.asList(1, 2, 1))));`),
          CK(CR, 'Brak duplikatów → false', J`eq(false, Kolekcje.maDuplikaty(new ArrayList<>(Arrays.asList(1, 2, 3)))); eq(false, Kolekcje.maDuplikaty(new ArrayList<Integer>()));`),
        ],
      },
      quiz: [
        Q('Co się stanie, gdy dodasz do <code>HashSet</code> element, który już w nim jest?', ['zbiór się nie zmieni', 'pojawi się duplikat', 'wyjątek', 'element zastąpi poprzedni na końcu'], 0, 'Zbiór trzyma tylko unikalne elementy.'),
        OUTQ('Co wypisze program?', ['2', '3', '1', 'błąd'], 0, 'Trzy dodania, ale jeden duplikat.', 'import java.util.HashSet;\nimport java.util.Set;\n\npublic class Main {\n    public static void main(String[] args) {\n        Set<Integer> s = new HashSet<>();\n        s.add(5);\n        s.add(7);\n        s.add(5);\n        System.out.println(s.size());\n    }\n}\n'),
        Q('Które metody muszą być nadpisane w klasie, której obiekty trafiają do HashSet?', ['equals i hashCode', 'toString i main', 'compareTo', 'żadne'], 0, 'Dzięki temu zbiór wie, co znaczy „to samo”.'),
        Q('Czy HashSet gwarantuje kolejność elementów?', ['nie', 'tak, kolejność dodawania', 'tak, alfabetyczną', 'tak, rosnącą'], 0, 'Kolejność nie jest określona.'),
      ],
    },

    {
      id: 'kol-mapa', title: 'Mapa: HashMap', blurb: 'put i get po kluczu', minutes: 6,
      content: [
        ANA('📖', 'Mapa to <b>słownik / książka telefoniczna</b>: znasz <b>klucz</b> (nazwisko) i chcesz dostać <b>wartość</b> (numer). <code>Map&lt;String, Integer&gt;</code> to „napis → liczba”. <code>put(klucz, wartość)</code> zapisuje, <code>get(klucz)</code> odczytuje. Klucze są unikalne: <code>put</code> z istniejącym kluczem <b>nadpisuje</b> wartość.'),
        VIZ('cells', { rows: [{ label: 'klucz', cells: ['"Ala"', '"Ola"'], shape: 'bubble' }, { label: 'wartość', cells: ['20', '30'] }], cap: '<code>Map&lt;String, Integer&gt;</code>: „Ala” → 20, „Ola” → 30.' }),
        CODE(J`import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Map<String, Integer> wiek = new HashMap<>();
        wiek.put("Ala", 20);
        wiek.put("Ola", 30);
        wiek.put("Ala", 21);
        System.out.println(wiek.get("Ala"));
        System.out.println(wiek.get("Ewa"));
        System.out.println(wiek.size());
    }
}
`, '21\nnull\n2'),
        NOTE('warn', 'Dla nieistniejącego klucza <code>get</code> zwraca <code>null</code>. Przypisanie takiego wyniku do <code>int</code> kończy się <code>NullPointerException</code>, więc najpierw sprawdź <code>containsKey</code>.'),
      ],
      guide: {
        files: [FL('Kolekcje.java', 'import java.util.HashMap;\nimport java.util.Map;\n\npublic class Kolekcje {\n    public static Map<String, Integer> wiek() {\n        return null;\n    }\n}\n')],
        steps: [
          { say: '<p>Utwórz pustą mapę: klucze to napisy, wartości to liczby.</p>', type: '        Map<String, Integer> m = new HashMap<>();', expect: J`Map\s*<\s*String\s*,\s*Integer\s*>\s+m\s*=\s*new\s+HashMap\s*<\s*>\s*\(\s*\)\s*;` },
          { say: '<p>Zapisz dwie pary metodą <code>put</code>.</p>', type: '        m.put("Ala", 20);\n        m.put("Ola", 30);', expect: J`m\.put\s*\(\s*"Ala"\s*,\s*20\s*\)\s*;\s*m\.put\s*\(\s*"Ola"\s*,\s*30\s*\)\s*;` },
          { say: '<p>Zwróć mapę (zastąp <code>return null;</code>).</p>', type: '        return m;', expect: J`return\s+m\s*;` },
        ],
        solution: [FL('Kolekcje.java', 'import java.util.HashMap;\nimport java.util.Map;\n\npublic class Kolekcje {\n    public static Map<String, Integer> wiek() {\n        Map<String, Integer> m = new HashMap<>();\n        m.put("Ala", 20);\n        m.put("Ola", 30);\n        return m;\n    }\n}\n')],
        checks: [
          CK(CR, 'Mapa ma Alę (20) i Olę (30)', J`Map<String, Integer> m = Kolekcje.wiek(); eq(2, m.size()); eq(20, m.get("Ala")); eq(30, m.get("Ola"));`),
        ],
      },
      exercise: {
        prompt: '<p>Napisz w <code>Kolekcje</code> metodę <code>static int wiekOd(Map&lt;String, Integer&gt; m, String imie)</code>: zwraca wiek z mapy albo <code>-1</code>, gdy imienia nie ma.</p>',
        files: [FL('Kolekcje.java', 'import java.util.Map;\n\npublic class Kolekcje {\n}\n')],
        hints: ['<code>if (m.containsKey(imie)) { return m.get(imie); }</code>', 'albo <code>m.getOrDefault(imie, -1)</code>'],
        solution: [FL('Kolekcje.java', 'import java.util.Map;\n\npublic class Kolekcje {\n    public static int wiekOd(Map<String, Integer> m, String imie) {\n        if (m.containsKey(imie)) {\n            return m.get(imie);\n        }\n        return -1;\n    }\n}\n')],
        checks: [
          CK(CR, 'Istniejące imię', J`Map<String, Integer> m = new HashMap<>(); m.put("Ala", 20); eq(20, Kolekcje.wiekOd(m, "Ala"));`),
          CK(CR, 'Brakujące imię → -1', J`Map<String, Integer> m = new HashMap<>(); m.put("Ala", 20); eq(-1, Kolekcje.wiekOd(m, "Ewa")); eq(-1, Kolekcje.wiekOd(new HashMap<String, Integer>(), "x"));`),
        ],
      },
      quiz: [
        Q('Co zwróci <code>get</code> dla nieistniejącego klucza?', ['null', '0', 'wyjątek', 'pusty napis'], 0, 'Brak klucza oznacza <code>null</code>.'),
        OUTQ('Co wypisze program?', ['2<br>5', '1<br>5', '2<br>3', 'błąd'], 0, 'Kluczy jest dwa (a, b); wartość „a” została nadpisana.', 'import java.util.HashMap;\nimport java.util.Map;\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<String, Integer> m = new HashMap<>();\n        m.put("a", 3);\n        m.put("b", 1);\n        m.put("a", 5);\n        System.out.println(m.size());\n        System.out.println(m.get("a"));\n    }\n}\n'),
        Q('Co zrobi <code>put</code> z już istniejącym kluczem?', ['nadpisze wartość', 'doda drugi wpis', 'zgłosi wyjątek', 'zignoruje'], 0, 'Klucze są unikalne.'),
        Q('Ile typów podajemy w <code>Map&lt;K, V&gt;</code>?', ['dwa: klucz i wartość', 'jeden', 'trzy', 'żadnego'], 0, 'Dwa parametry typu.'),
      ],
    },

    {
      id: 'kol-mapa-petla', title: 'Mapa: przechodzenie i zliczanie', blurb: 'entrySet, getOrDefault', minutes: 7,
      content: [
        ANA('🧮', 'Po mapie możesz przejść pętlą po <b>parach</b>: <code>for (Map.Entry&lt;String, Integer&gt; e : m.entrySet())</code>; <code>e.getKey()</code> daje klucz, <code>e.getValue()</code> wartość. Same klucze: <code>m.keySet()</code>, same wartości: <code>m.values()</code>. Klasyczne zastosowanie: <b>zliczanie</b> (ile razy wystąpiło słowo), z pomocą <code>getOrDefault(klucz, 0)</code>.'),
        CODE(J`import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        String[] slowa = { "a", "b", "a", "a" };
        Map<String, Integer> licznik = new HashMap<>();
        for (String s : slowa) {
            licznik.put(s, licznik.getOrDefault(s, 0) + 1);
        }
        System.out.println(licznik.get("a"));
        System.out.println(licznik.get("b"));

        int suma = 0;
        for (int v : licznik.values()) {
            suma += v;
        }
        System.out.println(suma);
    }
}
`, '3\n1\n4'),
        NOTE('tip', '<code>getOrDefault(s, 0)</code> to „daj wartość dla <code>s</code>, a jeśli klucza nie ma, daj 0”. Dzięki temu nie potrzebujesz osobnego <code>if</code> na pierwsze wystąpienie.'),
      ],
      guide: {
        files: [FL('Kolekcje.java', 'import java.util.HashMap;\nimport java.util.Map;\n\npublic class Kolekcje {\n    public static Map<String, Integer> zlicz(String[] slowa) {\n        return null;\n    }\n}\n')],
        steps: [
          { say: '<p>Utwórz pustą mapę liczników.</p>', type: '        Map<String, Integer> m = new HashMap<>();', expect: J`Map\s*<\s*String\s*,\s*Integer\s*>\s+m\s*=\s*new\s+HashMap\s*<\s*>\s*\(\s*\)\s*;` },
          { say: '<p>Dla każdego słowa zwiększ licznik: bierzesz dotychczasową wartość (lub 0) i dodajesz 1.</p>', type: '        for (String s : slowa) {\n            m.put(s, m.getOrDefault(s, 0) + 1);\n        }', expect: J`for\s*\(\s*String\s+s\s*:\s*slowa\s*\)\s*\{\s*m\.put\s*\(\s*s\s*,\s*m\.getOrDefault\s*\(\s*s\s*,\s*0\s*\)\s*\+\s*1\s*\)\s*;\s*\}` },
          { say: '<p>Zwróć mapę.</p>', type: '        return m;', expect: J`return\s+m\s*;` },
        ],
        solution: [FL('Kolekcje.java', 'import java.util.HashMap;\nimport java.util.Map;\n\npublic class Kolekcje {\n    public static Map<String, Integer> zlicz(String[] slowa) {\n        Map<String, Integer> m = new HashMap<>();\n        for (String s : slowa) {\n            m.put(s, m.getOrDefault(s, 0) + 1);\n        }\n        return m;\n    }\n}\n')],
        checks: [
          CK(CR, 'Zlicza wystąpienia słów', J`Map<String, Integer> m = Kolekcje.zlicz(new String[]{ "a", "b", "a", "a" }); eq(2, m.size()); eq(3, m.get("a")); eq(1, m.get("b"));`),
          CK(CR, 'Pusta tablica → pusta mapa', J`eq(0, Kolekcje.zlicz(new String[]{}).size());`),
        ],
      },
      exercise: {
        prompt: '<p>Napisz w <code>Kolekcje</code> metodę <code>static int sumaWartosci(Map&lt;String, Integer&gt; m)</code>: zwraca sumę wszystkich wartości z mapy (użyj <code>m.values()</code>).</p>',
        files: [FL('Kolekcje.java', 'import java.util.Map;\n\npublic class Kolekcje {\n}\n')],
        hints: ['<code>for (int v : m.values()) { suma += v; }</code>'],
        solution: [FL('Kolekcje.java', 'import java.util.Map;\n\npublic class Kolekcje {\n    public static int sumaWartosci(Map<String, Integer> m) {\n        int suma = 0;\n        for (int v : m.values()) {\n            suma += v;\n        }\n        return suma;\n    }\n}\n')],
        checks: [
          CK(CR, 'Suma wartości', J`Map<String, Integer> m = new HashMap<>(); m.put("a", 3); m.put("b", 4); m.put("c", 10); eq(17, Kolekcje.sumaWartosci(m)); eq(0, Kolekcje.sumaWartosci(new HashMap<String, Integer>()));`),
        ],
      },
      quiz: [
        Q('Co zwraca <code>m.keySet()</code>?', ['zbiór kluczy mapy', 'listę wartości', 'rozmiar mapy', 'pierwszy wpis'], 0, 'Same klucze.'),
        Q('Do czego służy <code>getOrDefault(k, 0)</code>?', ['zwraca wartość klucza lub 0, gdy klucza nie ma', 'usuwa klucz', 'ustawia domyślną mapę', 'sortuje mapę'], 0, 'Wygodne przy zliczaniu.'),
        OUTQ('Co wypisze program?', ['2', '1', '0', 'błąd'], 0, 'Słowo „x” wystąpiło dwa razy.', 'import java.util.HashMap;\nimport java.util.Map;\n\npublic class Main {\n    public static void main(String[] args) {\n        String[] t = { "x", "y", "x" };\n        Map<String, Integer> m = new HashMap<>();\n        for (String s : t) {\n            m.put(s, m.getOrDefault(s, 0) + 1);\n        }\n        System.out.println(m.get("x"));\n    }\n}\n'),
      ],
    },

    {
      id: 'kol-wybor', micro: true, title: 'Którą kolekcję wybrać?', blurb: 'tablica, lista, zbiór czy mapa', minutes: 5,
      content: [
        ANA('🧭', 'Zanim wybierzesz „worek”, zadaj sobie trzy pytania: <b>(1)</b> czy kolejność i indeksy mają znaczenie? → <b>lista</b>. <b>(2)</b> Czy wszystko ma być unikalne i liczy się „czy jest?” → <b>zbiór</b>. <b>(3)</b> Czy szukasz wartości po jakimś kluczu? → <b>mapa</b>. A gdy rozmiar jest <b>stały i znany</b> (albo trzeba trzymać typy proste jak <code>int</code>) → zwykła <b>tablica</b>.'),
        VIZ('compare', { cols: [
          { icon: '🧱', title: 'tablica', c: 'accent', items: ['rozmiar stały', 'typy proste (<code>int[]</code>)'] },
          { icon: '📋', title: 'List', c: 'ok', items: ['kolejność, duplikaty', 'zmienny rozmiar'] },
          { icon: '🎯', title: 'Set', c: 'warn', items: ['unikalne elementy', 'szybkie <code>contains</code>'] },
          { icon: '🗝️', title: 'Map', c: 'accent', items: ['klucz → wartość', 'szybkie szukanie po kluczu'] }] }),
        NOTE('exam', 'Typowe pytanie sprawdzianu: „Chcę trzymać numery indeksów studentów bez powtórzeń” → <b>Set</b>. „Chcę znaleźć studenta po numerze indeksu” → <b>Map</b>. „Chcę zachować kolejność zapisu” → <b>List</b>.'),
      ],
      quiz: [
        Q('Chcesz przechować listę gości <b>bez powtórzeń</b>. Co wybierasz?', ['HashSet', 'ArrayList', 'HashMap', 'tablicę'], 0, 'Zbiór wyklucza duplikaty.'),
        Q('Chcesz szybko znaleźć numer telefonu po nazwisku. Co wybierasz?', ['HashMap', 'HashSet', 'ArrayList', 'int[]'], 0, 'Para nazwisko → telefon.'),
        Q('Chcesz zachować kolejność dodawania i dopuścić powtórki. Co wybierasz?', ['ArrayList', 'HashSet', 'HashMap', 'żadna'], 0, 'Lista pamięta kolejność.'),
        Q('Znasz z góry dokładnie 7 liczb całkowitych i nic nie będziesz dodawać. Najprościej użyć:', ['tablicy int[]', 'HashMap', 'HashSet', 'żadne z nich'], 0, 'Stały rozmiar i typ prosty.'),
        Q('Który zapis jest poprawny?', ['List&lt;String&gt; l = new ArrayList&lt;&gt;();', 'List&lt;String&gt; l = new List&lt;&gt;();', 'ArrayList l = new List();', 'List l = ArrayList();'], 0, 'Interfejs po lewej, klasa po prawej.'),
      ],
    },
  ],
  labs: [
    {
      id: 'lab-kol', title: 'Zadanie własne: Rejestr osób (lista, zbiór, mapa)', source: 'zadanie własne (Osoba w liście, zbiorze i mapie – Prezentacja 5)', own: true, concepts: ['kol-lista', 'kol-zbior', 'kol-mapa', 'eq-hashcode'],
      statement: J`<p>Zbuduj prosty rejestr, który przechowuje te same osoby w <b>liście</b>, w <b>zbiorze</b> i w <b>mapie</b>, i pokaż różnice między nimi.</p>
<ol>
<li><b>Osoba</b> – prywatne pola <code>imie</code>, <code>nazwisko</code> (String), <code>rokUrodzenia</code> (int); konstruktor w tej kolejności; <code>toString()</code>: <code>imie nazwisko rokUrodzenia</code>. Nadpisz <code>equals</code> i <code>hashCode</code> (wszystkie trzy pola).</li>
<li><b>Rejestr</b> – prywatne pola: <code>List&lt;Osoba&gt; lista</code> (ArrayList), <code>Set&lt;Osoba&gt; unikalne</code> (HashSet), <code>Map&lt;Integer, Osoba&gt; mapa</code> (HashMap) – wszystkie od razu zainicjowane.</li>
<li><code>void dodaj(Osoba o)</code> – dodaje osobę do listy <b>i</b> do zbioru.</li>
<li><code>int ile()</code> – liczba elementów listy; <code>int ileUnikalnych()</code> – liczba elementów zbioru.</li>
<li><code>boolean zawiera(Osoba o)</code> – czy lista zawiera osobę (według <code>equals</code>).</li>
<li><code>void przypisz(int id, Osoba o)</code> – zapisuje osobę w mapie pod kluczem <code>id</code>; <code>Osoba pobierz(int id)</code> – zwraca osobę z mapy lub <code>null</code>.</li>
<li><b>Main</b>: dodaj do rejestru 4 osoby (jedną dwa razy – z tymi samymi danymi, ale jako osobny obiekt), wypisz <code>ile()</code> i <code>ileUnikalnych()</code> oraz wynik <code>pobierz</code> dla istniejącego i nieistniejącego id.</li>
</ol>`,
      notes: 'Zadanie własne. Wnioski, które powinieneś wyciągnąć: lista trzyma duplikaty, zbiór – nie (o ile <code>equals</code> i <code>hashCode</code> są poprawne), mapa wyszukuje po kluczu.',
      files: [
        { name: 'Osoba.java', code: J`public class Osoba {

}
` },
        { name: 'Rejestr.java', code: J`public class Rejestr {

}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {

    }
}
` }],
      hints: ['Osoba: <code>equals</code> i <code>hashCode</code> jak w module 9 (<code>Objects.equals</code>, <code>Objects.hash</code>).', 'Pola Rejestru: <code>private List&lt;Osoba&gt; lista = new ArrayList&lt;&gt;();</code> itd.', 'W <code>dodaj</code>: <code>lista.add(o); unikalne.add(o);</code>'],
      solution: [
        { name: 'Osoba.java', code: J`import java.util.Objects;

public class Osoba {
    private String imie;
    private String nazwisko;
    private int rokUrodzenia;

    public Osoba(String imie, String nazwisko, int rokUrodzenia) {
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
        Osoba os = (Osoba) o;
        return rokUrodzenia == os.rokUrodzenia
                && Objects.equals(imie, os.imie)
                && Objects.equals(nazwisko, os.nazwisko);
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
        { name: 'Rejestr.java', code: J`import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class Rejestr {
    private List<Osoba> lista = new ArrayList<>();
    private Set<Osoba> unikalne = new HashSet<>();
    private Map<Integer, Osoba> mapa = new HashMap<>();

    public void dodaj(Osoba o) {
        lista.add(o);
        unikalne.add(o);
    }

    public int ile() {
        return lista.size();
    }

    public int ileUnikalnych() {
        return unikalne.size();
    }

    public boolean zawiera(Osoba o) {
        return lista.contains(o);
    }

    public void przypisz(int id, Osoba o) {
        mapa.put(id, o);
    }

    public Osoba pobierz(int id) {
        return mapa.get(id);
    }
}
` },
        { name: 'Main.java', code: J`public class Main {
    public static void main(String[] args) {
        Rejestr r = new Rejestr();
        r.dodaj(new Osoba("Jan", "Kowalski", 1990));
        r.dodaj(new Osoba("Ewa", "Nowak", 1985));
        r.dodaj(new Osoba("Jan", "Kowalski", 1990));
        r.dodaj(new Osoba("Adam", "Mak", 2000));

        System.out.println(r.ile());
        System.out.println(r.ileUnikalnych());

        r.przypisz(1, new Osoba("Ewa", "Nowak", 1985));
        System.out.println(r.pobierz(1));
        System.out.println(r.pobierz(99));
    }
}
` }],
      checks: [
        CK(CR, 'Osoba: konstruktor, pola prywatne, toString', J`for (String n : new String[]{"imie", "nazwisko", "rokUrodzenia"}) isTrue("Pole " + n + " ma być private", Modifier.isPrivate(fieldMods("Osoba", n)));
eq("Jan Kowalski 1990", new Osoba("Jan", "Kowalski", 1990).toString());`),
        CK(CR, 'Osoba: equals i hashCode porównują wszystkie trzy pola', J`Osoba a = new Osoba("Jan", "Kowalski", 1990);
eq(true, a.equals(new Osoba("Jan", "Kowalski", 1990)));
eq(false, a.equals(new Osoba("Jan", "Kowalski", 1991)));
eq(false, a.equals(new Osoba("Ewa", "Kowalski", 1990)));
eq(false, a.equals(null));
eq(a.hashCode(), new Osoba("Jan", "Kowalski", 1990).hashCode());`),
        CK(CR, 'Rejestr: pola typu List, Set, Map (prywatne)', J`isTrue("Brak pola lista typu List", hasField("Rejestr", "lista") && java.util.List.class.isAssignableFrom(findF(cls("Rejestr"), "lista").getType()));
isTrue("Brak pola unikalne typu Set", hasField("Rejestr", "unikalne") && java.util.Set.class.isAssignableFrom(findF(cls("Rejestr"), "unikalne").getType()));
isTrue("Brak pola mapa typu Map", hasField("Rejestr", "mapa") && java.util.Map.class.isAssignableFrom(findF(cls("Rejestr"), "mapa").getType()));
for (String n : new String[]{"lista", "unikalne", "mapa"}) isTrue("Pole " + n + " ma być private", Modifier.isPrivate(fieldMods("Rejestr", n)));`),
        CK(CR, 'ile() liczy wszystkie dodania (z duplikatami)', J`Rejestr r = new Rejestr();
eq(0, r.ile());
r.dodaj(new Osoba("A", "B", 1)); r.dodaj(new Osoba("A", "B", 1)); r.dodaj(new Osoba("C", "D", 2));
eq(3, r.ile());`),
        CK(CR, 'ileUnikalnych() pomija duplikaty', J`Rejestr r = new Rejestr();
r.dodaj(new Osoba("A", "B", 1)); r.dodaj(new Osoba("A", "B", 1)); r.dodaj(new Osoba("C", "D", 2));
eq(2, r.ileUnikalnych());`),
        CK(CR, 'zawiera() korzysta z equals', J`Rejestr r = new Rejestr();
r.dodaj(new Osoba("A", "B", 1));
eq(true, r.zawiera(new Osoba("A", "B", 1)));
eq(false, r.zawiera(new Osoba("A", "B", 2)));`),
        CK(CR, 'przypisz / pobierz: mapa po kluczu, null gdy brak', J`Rejestr r = new Rejestr();
Osoba o = new Osoba("A", "B", 1);
r.przypisz(7, o);
isTrue("pobierz(7) powinno zwrócić zapisaną osobę", r.pobierz(7) == o);
isTrue("pobierz(8) powinno zwrócić null", r.pobierz(8) == null);
r.przypisz(7, new Osoba("X", "Y", 9));
eq("X Y 9", r.pobierz(7).toString());`),
        CK(MD, 'Main wypisuje 4, 3 oraz osobę i null', J`List<String> l = lines(runMain());
isTrue("Main powinien wypisać 4 linie – jest: " + l, l.size() >= 4);
eq("4", l.get(0)); eq("3", l.get(1)); eq("Ewa Nowak 1985", l.get(2)); eq("null", l.get(3));`),
        CK(MN, 'Użyto ArrayList, HashSet i HashMap', J`isTrue("Użyj ArrayList", srcHas("Rejestr", "new\\s+ArrayList"));
isTrue("Użyj HashSet", srcHas("Rejestr", "new\\s+HashSet"));
isTrue("Użyj HashMap", srcHas("Rejestr", "new\\s+HashMap"));`),
      ],
    },
  ],

  quiz: [
    Q('Jeżeli zależy mi na tym, aby móc dodawać nowe elementy do kolekcji, móc przechowywać tę samą wartość wielokrotnie i mieć do niej dostęp na podstawie numeru indeksu, wybiorę:', ['listę', 'zbiór', 'mapę'], 0, 'Lista ma indeksy, duplikaty i dynamiczny rozmiar.', 'kol-lista'),
    Q('Jeżeli zależy mi na tym, aby móc dodawać elementy, przechowywać te same wartości wielokrotnie, ale rozróżniać je na podstawie klucza (wybranego przeze mnie numeru id), wybiorę:', ['listę', 'zbiór', 'mapę'], 2, 'Mapa: klucz → wartość.', 'kol-mapa'),
    Q('W mapach:', ['wartości mogą się powtarzać', 'kombinacja klucz + wartość jest unikalna', 'klucze są unikalne', 'wartości są unikalne'], [0, 2], 'Unikalne są klucze; wartości mogą się powtarzać.', 'kol-mapa'),
    Q('Co wypisze program?', ['2', '3', '1', '0'], 0, 'Zbiór odrzuca duplikat „a”, więc zawiera dwa elementy.', 'kol-zbior', { code: J`import java.util.HashSet;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        Set<String> s = new HashSet<>();
        s.add("a");
        s.add("b");
        s.add("a");
        System.out.println(s.size());
    }
}` }),
    Q('Co wypisze program?', ['3<br>2', '3<br>3', '2<br>2', '2<br>3'], 0, 'Lista trzyma duplikaty (3 elementy), zbiór – tylko unikalne (2).', 'kol-lista', { code: J`import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<Integer> l = new ArrayList<>(List.of(1, 2, 1));
        Set<Integer> s = new HashSet<>(l);
        System.out.println(l.size());
        System.out.println(s.size());
    }
}` }),
    Q('Co wypisze program?', ['null', '0', 'wyjątek', 'brak'], 0, '<code>get</code> dla nieistniejącego klucza zwraca <code>null</code>.', 'kol-mapa', { code: J`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Map<String, Integer> m = new HashMap<>();
        m.put("a", 1);
        System.out.println(m.get("b"));
    }
}` }),
    Q('Aby obiekty własnej klasy były poprawnie rozpoznawane jako duplikaty w <code>HashSet</code>, trzeba w tej klasie nadpisać:', ['<code>toString</code>', '<code>hashCode</code> i <code>equals</code>', '<code>compareTo</code>', '<code>clone</code>'], 1, 'Zbiór wykrywa duplikaty przez hasz i <code>equals</code>.', 'kol-zbior'),
  ],
});
