import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ClueList from './ClueList'
import { ENTRIES } from '../puzzle'

const entries = ENTRIES.filter((entry) => entry.dir === 'across')

function buttons() {
  return [...document.querySelectorAll('.clue')]
}

test('wyświetla tytuł oraz numery i treści definicji', () => {
  render(<ClueList title="Poziomo" entries={entries} active="" onSelect={() => {}} />)

  expect(screen.getByText('Poziomo')).toBeInTheDocument()
  expect(buttons()).toHaveLength(entries.length)

  entries.forEach((entry, i) => {
    expect(buttons()[i]).toHaveTextContent(String(entry.number))
    expect(buttons()[i]).toHaveTextContent(entry.clue)
  })
})

test('kliknięcie definicji przekazuje całe hasło', async () => {
  const user = userEvent.setup()
  const onSelect = vi.fn()
  render(<ClueList title="Poziomo" entries={entries} active="" onSelect={onSelect} />)

  await user.click(buttons()[2])

  expect(onSelect).toHaveBeenCalledWith(entries[2])
})

test('podświetla aktywne hasło', () => {
  render(
    <ClueList title="Poziomo" entries={entries} active={entries[1].id} onSelect={() => {}} />,
  )

  expect(buttons()[0]).not.toHaveClass('active')
  expect(buttons()[1]).toHaveClass('active')
})
