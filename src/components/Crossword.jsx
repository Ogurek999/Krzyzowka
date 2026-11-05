import { CELLS, COLS, ROWS } from '../puzzle'

export default function Crossword({ values, status, entry, activeCell, onSelect, onChange, onKeyDown, inputs }) {
  const cells = []

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = CELLS[`${row}-${col}`]

      if (!cell) {
        cells.push(<div key={`${row}-${col}`} className="cell black" />)
        continue
      }

      const classes = ['cell']
      if (cell.entries.includes(entry.id)) classes.push('highlight')
      if (cell.key === activeCell) classes.push('active')
      if (status[cell.key] === 'ok') classes.push('correct')
      if (status[cell.key] === 'bad') classes.push('wrong')

      cells.push(
        <div key={cell.key} className={classes.join(' ')}>
          {cell.number && <span className="number">{cell.number}</span>}
          <input
            ref={(el) => {
              inputs.current[cell.key] = el
            }}
            value={values[cell.key] || ''}
            aria-label={`Pole ${row + 1} ${col + 1}`}
            onChange={(e) => onChange(e, cell)}
            onKeyDown={(e) => onKeyDown(e, cell)}
            onClick={() => onSelect(cell)}
          />
        </div>,
      )
    }
  }

  return <div className="grid">{cells}</div>
}
