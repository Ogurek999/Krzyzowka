import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { CELLS, ENTRIES } from './puzzle'

function field(row, col) {
  return screen.getByLabelText(`Pole ${row + 1} ${col + 1}`)
}

function cellOf(element) {
  return element.closest('.cell')
}

function clueButton(id) {
  const entry = ENTRIES.find((item) => item.id === id)
  return [...document.querySelectorAll('.clue')].find((button) => button.textContent.includes(entry.clue))
}

test('każde hasło ma tyle pól, ile liter', () => {
  render(<App />)
  const ekran = ENTRIES.find((entry) => entry.id === 'ekran')
  const fields = ekran.cells.map((key) => field(CELLS[key].row, CELLS[key].col))
  expect(fields).toHaveLength(5)
  expect(screen.getAllByRole('textbox')).toHaveLength(Object.keys(CELLS).length)
})

test('pole przyjmuje jedną literę i odrzuca cyfry', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.click(field(0, 0))
  await user.type(field(0, 0), '5')
  expect(field(0, 0)).toHaveValue('')

  await user.type(field(0, 0), 'a')
  expect(field(0, 0)).toHaveValue('A')
  expect(field(0, 1)).toHaveFocus()

  await user.type(field(0, 1), 'b')
  expect(field(0, 1)).toHaveValue('B')
})

test('Sprawdź oznacza poprawne litery na zielono, a błędne na czerwono', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.click(screen.getByRole('button', { name: 'Sprawdź' }))
  expect(document.querySelectorAll('.cell.correct, .cell.wrong')).toHaveLength(0)

  await user.click(field(0, 0))
  await user.type(field(0, 0), 'x')
  await user.click(screen.getByRole('button', { name: 'Sprawdź' }))
  expect(cellOf(field(0, 0))).toHaveClass('wrong')

  await user.click(screen.getByRole('button', { name: 'Pokaż rozwiązanie' }))
  await user.click(screen.getByRole('button', { name: 'Sprawdź' }))
  expect(cellOf(field(0, 0))).toHaveClass('correct')
  expect(document.querySelectorAll('.cell.wrong')).toHaveLength(0)
})

test('Pokaż rozwiązanie wypełnia całą siatkę', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.click(screen.getByRole('button', { name: 'Pokaż rozwiązanie' }))

  for (const cell of Object.values(CELLS)) {
    expect(field(cell.row, cell.col)).toHaveValue(cell.letter)
  }
  expect(field(0, 0)).toHaveValue('E')
})

test('Wyczyść usuwa litery i kolory', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.click(screen.getByRole('button', { name: 'Pokaż rozwiązanie' }))
  await user.click(screen.getByRole('button', { name: 'Sprawdź' }))
  await user.click(screen.getByRole('button', { name: 'Wyczyść' }))

  for (const cell of Object.values(CELLS)) {
    expect(field(cell.row, cell.col)).toHaveValue('')
  }
  expect(document.querySelectorAll('.cell.correct, .cell.wrong')).toHaveLength(0)
})

test('kliknięcie definicji podświetla pola hasła', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.click(clueButton('element'))
  const element = ENTRIES.find((entry) => entry.id === 'element')

  expect(document.querySelectorAll('.cell.highlight')).toHaveLength(7)
  for (const key of element.cells) {
    const cell = CELLS[key]
    expect(cellOf(field(cell.row, cell.col))).toHaveClass('highlight')
  }
  expect(cellOf(field(0, 0))).toHaveClass('active')
})

test('kliknięte pole jest aktywne', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.click(field(6, 0))
  expect(cellOf(field(6, 0))).toHaveClass('active')
  expect(cellOf(field(0, 0))).not.toHaveClass('active')
})

test('numer hasła zgadza się z numerem w siatce', () => {
  render(<App />)

  for (const entry of ENTRIES) {
    const button = clueButton(entry.id)
    expect(button.querySelector('.clue-number')).toHaveTextContent(String(entry.number))

    const cell = CELLS[entry.cells[0]]
    expect(cellOf(field(cell.row, cell.col)).querySelector('.number')).toHaveTextContent(
      String(entry.number),
    )
  }
})

test('Backspace czyści pole i cofa kursor', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.click(field(0, 0))
  await user.type(field(0, 0), 'e')
  await user.type(field(0, 1), 'k')
  expect(field(0, 1)).toHaveValue('K')

  await user.type(field(0, 1), '{backspace}')
  expect(field(0, 1)).toHaveValue('')

  await user.type(field(0, 1), '{backspace}')
  expect(field(0, 0)).toHaveValue('')
  expect(field(0, 0)).toHaveFocus()
})

test('z dwóch wpisanych znaków zostaje ostatnia litera', async () => {
  const user = userEvent.setup()
  render(<App />)

  const input = field(0, 0)
  await user.click(input)
  fireEvent.change(input, { target: { value: 'ab' } })
  expect(input).toHaveValue('B')
})

test('zmiana litery zdejmuje kolor z tego pola', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.click(screen.getByRole('button', { name: 'Pokaż rozwiązanie' }))
  await user.click(screen.getByRole('button', { name: 'Sprawdź' }))
  expect(cellOf(field(0, 0))).toHaveClass('correct')

  await user.click(field(0, 0))
  await user.type(field(0, 0), 'x')
  expect(field(0, 0)).toHaveValue('X')
  expect(cellOf(field(0, 0))).not.toHaveClass('correct')
})

test('hasła przecinają się', () => {
  const crossings = Object.values(CELLS).filter((cell) => cell.entries.length > 1)
  expect(crossings.length).toBeGreaterThan(0)
})
