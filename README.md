# Krzyżówka

Interaktywna krzyżówka napisana w React. Ma 10 haseł, sprawdzanie odpowiedzi, podgląd rozwiązania i czyszczenie planszy.

## Funkcje

- 10 haseł: 5 poziomych i 5 pionowych
- numeracja pól zgodna z numerami definicji
- podświetlanie wybranego hasła i aktywnego pola
- sprawdzanie odpowiedzi: poprawne litery na zielono, błędne na czerwono
- pokazywanie całego rozwiązania
- czyszczenie wszystkich pól

## Wymagania

Node.js w wersji 20.19+ lub 22.12+.

## Uruchomienie

```bash
npm install
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:5173`.

## Testy

```bash
npm test
```

Projekt zawiera 20 testów jednostkowych (Vitest i React Testing Library).

## Budowanie

```bash
npm run build
npm run preview
```

## Struktura projektu

```
src/
  App.jsx
  App.test.jsx
  puzzle.js
  styles.css
  components/
    Crossword.jsx
    Crossword.test.jsx
    ClueList.jsx
    ClueList.test.jsx
```

## Dokumentacja

Opis działania i instrukcja obsługi: [Dokumentacja.pdf](Dokumentacja.pdf).
