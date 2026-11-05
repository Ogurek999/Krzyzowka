export default function ClueList({ title, entries, active, onSelect }) {
  return (
    <section className="clues">
      <h2>{title}</h2>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>
            <button
              type="button"
              className={entry.id === active ? 'clue active' : 'clue'}
              onClick={() => onSelect(entry)}
            >
              <span className="clue-number">{entry.number}</span>
              {entry.clue}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
