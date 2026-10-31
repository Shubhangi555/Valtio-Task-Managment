import { useSnapshot } from 'valtio'
import { computed } from '../store/computed'
import { COLUMNS, PRIORITIES } from '../store/tasks'

export default function StatsBar() {
  const c = useSnapshot(computed)

  return (
    <div className="stats-bar">
      <div className="stats-label">
        <span className="api-tag">watch()</span>
        Live Metrics
      </div>

      <div className="stats-grid">
        <Stat
          value={c.total}
          label="Total Tasks"
          color="var(--text)"
        />
        <Stat
          value={`${c.completionRate}%`}
          label="Complete"
          color="var(--green)"
        />
        <Stat
          value={c.overdueCount}
          label="Overdue"
          color={c.overdueCount > 0 ? 'var(--red)' : 'var(--muted)'}
        />
        <Stat
          value={c.velocityLast7}
          label="Done / 7d"
          color="var(--accent)"
        />
      </div>

      <div className="progress-bar-wrap">
        <div className="progress-track">
          {COLUMNS.map(col => {
            const count = c.byColumn[col.id] || 0
            const pct = c.total > 0 ? (count / c.total) * 100 : 0
            return (
              <div
                key={col.id}
                className="progress-seg"
                style={{ width: `${pct}%`, background: col.color }}
                title={`${col.label}: ${count}`}
              />
            )
          })}
        </div>
        <div className="progress-legend">
          {COLUMNS.map(col => (
            <span key={col.id} className="legend-item">
              <span className="legend-dot" style={{ background: col.color }} />
              {col.label} ({c.byColumn[col.id] || 0})
            </span>
          ))}
        </div>
      </div>

      <div className="priority-pills">
        {Object.entries(PRIORITIES).map(([key, { label, color }]) => (
          <span key={key} className="priority-chip" style={{ borderColor: color, color }}>
            {label}: {c.byPriority[key] || 0}
          </span>
        ))}
      </div>
    </div>
  )
}

function Stat({ value, label, color }) {
  return (
    <div className="stat-item">
      <span className="stat-value" style={{ color }}>{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}
