import { useSnapshot } from 'valtio'
import { taskStore, moveTask, deleteTask, COLUMNS, PRIORITIES } from '../store/tasks'
import { filterStore, getFilteredTasks, uiStore } from '../store/index'

export default function ListView() {
  const { tasks } = useSnapshot(taskStore)
  const filters = useSnapshot(filterStore)
  const filtered = getFilteredTasks(tasks, filters)

  function formatDate(d) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="list-view">
      <table className="task-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Tags</th>
            <th>Due</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(task => {
            const priority = PRIORITIES[task.priority]
            const col = COLUMNS.find(c => c.id === task.column)
            const isOverdue = task.due && task.column !== 'done' && new Date(task.due) < new Date()
            return (
              <tr key={task.id} className={`task-row ${task.column === 'done' ? 'row-done' : ''}`}>
                <td className="row-title">
                  <span className="priority-dot" style={{ background: priority.color }} />
                  <div>
                    <div className="row-title-text">{task.title}</div>
                    <div className="row-desc">{task.desc}</div>
                  </div>
                </td>
                <td>
                  <span className="priority-badge" style={{ color: priority.color, borderColor: priority.color }}>
                    {priority.label}
                  </span>
                </td>
                <td>
                  <select
                    className="status-select"
                    value={task.column}
                    style={{ color: col.color }}
                    onChange={e => moveTask(task.id, e.target.value)}
                  >
                    {COLUMNS.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <div className="row-tags">
                    {task.tags.slice(0, 2).map(t => <span key={t} className="tag">{t}</span>)}
                    {task.tags.length > 2 && <span className="tag">+{task.tags.length - 2}</span>}
                  </div>
                </td>
                <td className={isOverdue ? 'overdue' : 'row-date'}>
                  {formatDate(task.due)}
                </td>
                <td className="row-actions">
                  <button
                    className="action-btn"
                    onClick={() => { uiStore.editingTask = task.id; uiStore.modalOpen = true }}
                  >Edit</button>
                  <button className="action-btn del" onClick={() => deleteTask(task.id)}>Del</button>
                </td>
              </tr>
            )
          })}
          {filtered.length === 0 && (
            <tr><td colSpan={6} className="empty-row">No tasks match your filters</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
