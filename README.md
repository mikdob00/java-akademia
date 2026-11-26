# Java Akademia

Lokalny program do nauki Javy w stylu Codecademy – oparty na materiałach z zajęć (Wykłady 1–5, Zadania 1–4).

## Uruchomienie

```
git clone https://github.com/mikdob00/java-akademia.git
cd java-akademia
node server.js
```

Albo krok po kroku:

1. Zainstalowany Node.js (https://nodejs.org) oraz JDK (np. ten z IntelliJ IDEA albo dowolny JDK 17+ dostępny w `JAVA_HOME` / `PATH`). Program sam go wykryje i użyje do kompilacji Twojego kodu.
2. Kliknij dwukrotnie `start.bat` (albo w terminalu: `node server.js`).
3. Otwórz http://localhost:4321

Postęp zapisuje się w pliku `data/progress.json` (z kopią `progress.bak.json`) (kopię zapasową możesz wyeksportować w Ustawieniach).

## Co jest w środku

- **Roadmapa** – 12 modułów od najprostszych do najtrudniejszych (podstawy → klasy → hermetyzacja → static → dziedziczenie → polimorfizm → klasy abstrakcyjne i wyjątki → interfejsy → equals/hashCode → sortowanie → generyki → kolekcje).
- **Lekcje** – krótka teoria z przykładami do uruchomienia, mini-quiz i małe zadanie po każdym pojedynczym pojęciu; kod jest kompilowany i testowany naprawdę.
- **Zadania z zajęć** – te same zadania, które prowadząca omawiała (Zadania 1–4), oraz własne dla działów bez zadań. Po zakończeniu dostajesz ocenę i listę błędów z wagą: poważny / średni / powierzchowny.
- **Do powtórki** – miejsca, do których warto wrócić, posortowane wg wagi błędu.
- **Sprawdziany** – 5 sprawdzianów próbnych (pytania zamknięte, „co wypisze program?”, zadania programistyczne) z oceną w skali prowadzącej.
- **Projekt** – lista wymagań z Projekt.pdf, terminy, wskazówki do obrony i fiszki. Program **nie pisze projektu** – projekt nie może być generowany przez AI.

## Walidacja treści (opcjonalnie)

```
node tools/validate.js all
```

Sprawdza, że każde rozwiązanie wzorcowe przechodzi wszystkie testy, a pytania „co wypisze program?” mają poprawne odpowiedzi.
