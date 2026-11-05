import { useRef, useState } from 'react'
import Crossword from './components/Crossword'
import ClueList from './components/ClueList'
import { CELLS, ENTRIES } from './puzzle'
import './styles.css'

const LETTER = /^[A-ZĄĆĘŁŃÓŚŹŻ]$/

export default function App() {
  const [values, setValues] = useState({})
  const [active, setActive] = useState({ entry: 'ekran', cell: ENTRIES[0].cells[0] })
  const [status, setStatus] = useState({})
  const inputs = useRef({})

  const entry = ENTRIES.find((item) => item.id === active.entry)

  function focus(key) {
    inputs.current[key]?.focus()
  }

  function selectEntry(next) {
    setActive({ entry: next.id, cell: next.cells[0] })
    focus(next.cells[0])
  }

  function selectCell(cell) {
    const current = CELLS[cell.key]
    const entryId = current.entries.includes(active.entry) ? active.entry : current.entries[0]
    setActive({ entry: entryId, cell: cell.key })
  }

  function type(e, cell) {
    const typed = e.target.value.slice(-1).toUpperCase()
    const valid = LETTER.test(typed)
    const letter = valid ? typed : values[cell.key] || ''
    setValues({ ...values, [cell.key]: letter })
    setStatus((prev) => {
      if (!prev[cell.key]) return prev
      const next = { ...prev }
      delete next[cell.key]
      return next
    })
    if (!valid) return
    const nextKey = entry.cells[entry.cells.indexOf(cell.key) + 1]
    if (nextKey) {
      setActive({ entry: entry.id, cell: nextKey })
      focus(nextKey)
    }
  }

  function keyDown(e, cell) {
    if (e.key !== 'Backspace') return
    e.preventDefault()
    const index = entry.cells.indexOf(cell.key)
    if (values[cell.key]) {
      setValues({ ...values, [cell.key]: '' })
      return
    }
    const prevKey = entry.cells[index - 1]
    if (!prevKey) return
    setValues({ ...values, [prevKey]: '' })
    setActive({ entry: entry.id, cell: prevKey })
    focus(prevKey)
  }

  function check() {
    const next = {}
    for (const [key, value] of Object.entries(values)) {
      if (!value) continue
      next[key] = value === CELLS[key].letter ? 'ok' : 'bad'
    }
    setStatus(next)
  }

  function solve() {
    const next = {}
    for (const key of Object.keys(CELLS)) {
      next[key] = CELLS[key].letter
    }
    setValues(next)
    setStatus({})
  }

  function clear() {
    setValues({})
    setStatus({})
  }

  const across = ENTRIES.filter((item) => item.dir === 'across')
  const down = ENTRIES.filter((item) => item.dir === 'down')

  return (
    <div className="app">
      <h1>Krzyżówka</h1>
      <p className="subtitle">Kliknij definicję, aby zaznaczyć hasło, i wpisuj litery.</p>
      <div className="layout">
        <Crossword
          values={values}
          status={status}
          entry={entry}
          activeCell={active.cell}
          onSelect={selectCell}
          onChange={type}
          onKeyDown={keyDown}
          inputs={inputs}
        />
        <div className="panel">
          <ClueList title="Poziomo" entries={across} active={active.entry} onSelect={selectEntry} />
          <ClueList title="Pionowo" entries={down} active={active.entry} onSelect={selectEntry} />
          <div className="actions">
            <button onClick={check}>Sprawdź</button>
            <button onClick={solve}>Pokaż rozwiązanie</button>
            <button onClick={clear}>Wyczyść</button>
          </div>
        </div>
      </div>
    </div>
  )
}
