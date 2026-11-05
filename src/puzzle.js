export const ROWS = 12
export const COLS = 8

export const ENTRIES = [
  {
    id: 'ekran',
    row: 0,
    col: 0,
    dir: 'across',
    answer: 'EKRAN',
    clue: 'Urządzenie, na którym wyświetla się obraz',
  },
  {
    id: 'element',
    row: 0,
    col: 0,
    dir: 'down',
    answer: 'ELEMENT',
    clue: 'Część składowa większej całości',
  },
  {
    id: 'reakt',
    row: 0,
    col: 2,
    dir: 'down',
    answer: 'REAKT',
    clue: 'Biblioteka JavaScript do budowania interfejsów',
  },
  {
    id: 'nuta',
    row: 0,
    col: 4,
    dir: 'down',
    answer: 'NUTA',
    clue: 'Znak zapisu dźwięku',
  },
  {
    id: 'klasa',
    row: 3,
    col: 2,
    dir: 'across',
    answer: 'KLASA',
    clue: 'Szablon, na podstawie którego tworzy się obiekt',
  },
  {
    id: 'tablica',
    row: 6,
    col: 0,
    dir: 'across',
    answer: 'TABLICA',
    clue: 'Zbiór danych ułożonych w wiersze i kolumny',
  },
  {
    id: 'litera',
    row: 6,
    col: 3,
    dir: 'down',
    answer: 'LITERA',
    clue: 'Pojedynczy znak alfabetu',
  },
  {
    id: 'serwer',
    row: 9,
    col: 2,
    dir: 'across',
    answer: 'SERWER',
    clue: 'Komputer udostępniający zasoby w sieci',
  },
  {
    id: 'rys',
    row: 9,
    col: 7,
    dir: 'down',
    answer: 'RYS',
    clue: 'Drapieżny kot o cętkowanej sierści',
  },
  {
    id: 'atlas',
    row: 11,
    col: 3,
    dir: 'across',
    answer: 'ATLAS',
    clue: 'Zbiór map w jednym wydaniu',
  },
]

export const CELLS = {}

for (const entry of ENTRIES) {
  entry.cells = []
  entry.answer.split('').forEach((letter, i) => {
    const row = entry.row + (entry.dir === 'down' ? i : 0)
    const col = entry.col + (entry.dir === 'across' ? i : 0)
    const key = `${row}-${col}`
    if (!CELLS[key]) {
      CELLS[key] = { key, row, col, letter, entries: [] }
    }
    CELLS[key].entries.push(entry.id)
    entry.cells.push(key)
  })
}

const starts = Object.values(CELLS)
  .filter((cell) => ENTRIES.some((entry) => entry.row === cell.row && entry.col === cell.col))
  .sort((a, b) => a.row - b.row || a.col - b.col)

starts.forEach((cell, i) => {
  cell.number = i + 1
})

for (const entry of ENTRIES) {
  entry.number = CELLS[entry.cells[0]].number
}
