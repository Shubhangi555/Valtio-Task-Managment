import { moveTask, deleteTask, COLUMNS, PRIORITIES } from '../store/tasks'
import { uiStore } from '../store/index'

export default function TaskCard({ task, compact }) {
  const priority = PRIORITIES[task.priority]
  const isOverdue = task.due && task.column !== 'done' && new Date(task.due) < new Date()
  const colIndex = COLUMNS.findIndex(c => c.id === task.column)

  function handleMove(dir) {
    const next = COLUMNS[colIndex + dir]
    if (next) moveTask(task.id, next.id)
  }

  function formatDate(d) {
    if (!d) return null
    return new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })
  }

  return (
    <div className={`task-card ${compact ? 'compact' : ''} priority-${task.priority}`}>
      <div className="task-card-header">
        <span
          className="priority-dot"
          style={{ background: priority.color }}
          title={priority.label}
        />
        <span className="task-title">{task.title}</span>
        <button
          className="card-menu-btn"
          onClick={() => { uiStore.editingTask = task.id; uiStore.modalOpen = true }}
          title="Edit"
        >⋯</button>
      </div>

      {!compact && task.desc && (
        <p className="task-desc">{task.desc}</p>
      )}

      <div className="task-card-footer">
        <div className="task-tags">
          {task.tags.slice(0, 2).map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
          {task.tags.length > 2 && <span className="tag tag-more">+{task.tags.length - 2}</span>}
        </div>
        <div className="task-meta">
          {task.due && (
            <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
              {isOverdue ? '⚠ ' : ''}{formatDate(task.due)}
            </span>
          )}
        </div>
      </div>

      <div className="task-move-btns">
        {colIndex > 0 && (
          <button className="move-btn move-left" onClick={() => handleMove(-1)} title={`Move to ${COLUMNS[colIndex-1].label}`}>
            ← {COLUMNS[colIndex-1].label}
          </button>
        )}
        <button
          className="move-btn delete-btn"
          onClick={() => deleteTask(task.id)}
          title="Delete"
        >×</button>
        {colIndex < COLUMNS.length - 1 && (
          <button className="move-btn move-right" onClick={() => handleMove(1)} title={`Move to ${COLUMNS[colIndex+1].label}`}>
            {COLUMNS[colIndex+1].label} →
          </button>
        )}
      </div>
    </div>
  )
}
