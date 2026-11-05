import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Crossword from './Crossword'
import { CELLS, COLS, ENTRIES, ROWS } from '../puzzle'

function setup(overrides = {}) {
  const props = {
    values: {},
    status: {},
    entry: ENTRIES.find((entry) => entry.id === 'ekran'),
    activeCell: '0-0',
    onSelect: vi.fn(),
    onChange: vi.fn(),
    onKeyDown: vi.fn(),
    inputs: { current: {} },
    ...overrides,
  }
  render(<Crossword {...props} />)
  return props
}

function cell(key) {
  const [row, col] = key.split('-').map(Number)
  return screen.getByLabelText(`Pole ${row + 1} ${col + 1}`).closest('.cell')
}

test('renderuje wszystkie białe i czarne pola siatki', () => {
  const { container } = render(
    <Crossword
      values={{}}
      status={{}}
      entry={ENTRIES[0]}
      activeCell="0-0"
      onSelect={() => {}}
      onChange={() => {}}
      onKeyDown={() => {}}
      inputs={{ current: {} }}
    />,
  )

  expect(screen.getAllByRole('textbox')).toHaveLength(Object.keys(CELLS).length)
  expect(container.querySelectorAll('.cell.black')).toHaveLength(
    ROWS * COLS - Object.keys(CELLS).length,
  )
})

test('oznacza aktywne pole, pola hasła i wynik sprawdzania', () => {
  setup({ activeCell: '0-2', status: { '0-1': 'ok', '0-2': 'bad' } })

  expect(cell('0-1')).toHaveClass('highlight')
  expect(cell('0-1')).toHaveClass('correct')
  expect(cell('0-2')).toHaveClass('highlight')
  expect(cell('0-2')).toHaveClass('active')
  expect(cell('0-2')).toHaveClass('wrong')
  expect(cell('6-0')).not.toHaveClass('highlight')
})

test('numery pojawiają się tylko na początku haseł', () => {
  setup()

  expect(cell('0-0').querySelector('.number')).toHaveTextContent('1')
  expect(cell('0-2').querySelector('.number')).toHaveTextContent('2')
  expect(cell('0-1').querySelector('.number')).toBeNull()
  expect(cell('6-3').querySelector('.number')).toHaveTextContent('6')
})

test('wpisana litera trafia do onChange', async () => {
  const user = userEvent.setup()
  let typed = null
  setup({
    onChange: vi.fn((event, clicked) => {
      typed = { value: event.target.value, cell: clicked }
    }),
  })

  await user.type(screen.getByLabelText('Pole 1 1'), 'a')

  expect(typed.value).toBe('a')
  expect(typed.cell.key).toBe('0-0')
})

test('kliknięcie pola i Backspace wywołują przekazane funkcje', async () => {
  const user = userEvent.setup()
  const props = setup()

  await user.click(screen.getByLabelText('Pole 7 1'))
  expect(props.onSelect).toHaveBeenCalledWith(CELLS['6-0'])

  await user.type(screen.getByLabelText('Pole 7 1'), '{backspace}')
  expect(props.onKeyDown).toHaveBeenCalled()
  expect(props.onKeyDown.mock.calls[0][0].key).toBe('Backspace')
})
