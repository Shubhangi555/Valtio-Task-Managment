import { useSnapshot } from 'valtio'
import { taskStore, COLUMNS } from '../store/tasks'
import { filterStore, getFilteredTasks, settingsStore, uiStore } from '../store/index'
import TaskCard from './TaskCard'

export default function BoardView() {
  const { tasks } = useSnapshot(taskStore)
  const filters = useSnapshot(filterStore)
  const settings = useSnapshot(settingsStore)

  const filtered = getFilteredTasks(tasks, filters)

  const visibleColumns = settings.showDone
    ? COLUMNS
    : COLUMNS.filter(c => c.id !== 'done')

  return (
    <div className="board">
      {visibleColumns.map(col => {
        const colTasks = filtered.filter(t => t.column === col.id)
        return (
          <div key={col.id} className="board-col">
            <div className="col-header">
              <span className="col-dot" style={{ background: col.color }} />
              <span className="col-title">{col.label}</span>
              <span className="col-count">{colTasks.length}</span>
              <button
                className="col-add-btn"
                title="Add task"
                onClick={() => {
                  uiStore.addingToColumn = col.id
                  uiStore.editingTask = null
                  uiStore.modalOpen = true
                }}
              >+</button>
            </div>

            <div className={`col-cards ${colTasks.length === 0 ? 'empty' : ''}`}>
              {colTasks.length === 0 && (
                <div className="col-empty">
                  {filters.search || filters.priority !== 'all' || filters.tag !== 'all'
                    ? 'No matches'
                    : 'Drop tasks here'}
                </div>
              )}
              {colTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  compact={settings.compactCards}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
