import { useSnapshot } from 'valtio'
import { filterStore, uiStore, settingsStore } from '../store/index'
import { PRIORITIES, ALL_TAGS } from '../store/tasks'

export default function Toolbar() {
  const filters = useSnapshot(filterStore)
  const settings = useSnapshot(settingsStore)

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <span className="api-tag">proxy()</span>
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input
            className="search-input"
            placeholder="Search tasks…"
            value={filters.search}
            // Direct mutation — filterStore is a proxy, no setState needed
            onChange={e => (filterStore.search = e.target.value)}
          />
          {filters.search && (
            <button className="search-clear" onClick={() => (filterStore.search = '')}>×</button>
          )}
        </div>

        <select
          className="filter-select"
          value={filters.priority}
          onChange={e => (filterStore.priority = e.target.value)}
        >
          <option value="all">All Priorities</option>
          {Object.entries(PRIORITIES).map(([k, { label }]) => (
            <option key={k} value={k}>{label}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={filters.tag}
          onChange={e => (filterStore.tag = e.target.value)}
        >
          <option value="all">All Tags</option>
          {ALL_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="toolbar-right">
        <div className="view-toggle">
          <button
            className={filters.view === 'board' ? 'active' : ''}
            onClick={() => (filterStore.view = 'board')}
            title="Board view"
          >⊞ Board</button>
          <button
            className={filters.view === 'list' ? 'active' : ''}
            onClick={() => (filterStore.view = 'list')}
            title="List view"
          >☰ List</button>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            uiStore.editingTask = null
            uiStore.addingToColumn = null
            uiStore.modalOpen = true
          }}
        >+ New Task</button>
      </div>
    </div>
  )
}
