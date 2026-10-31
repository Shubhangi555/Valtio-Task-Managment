import { useState, useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { taskStore, addTask, updateTask, COLUMNS, PRIORITIES, ALL_TAGS } from '../store/tasks'
import { uiStore } from '../store/index'

export default function TaskModal() {
  const ui = useSnapshot(uiStore)
  const { tasks } = useSnapshot(taskStore)

  const editingTask = ui.editingTask ? tasks.find(t => t.id === ui.editingTask) : null

  const [form, setForm] = useState({
    title: '', desc: '', priority: 'medium',
    column: 'backlog', tags: [], due: ''
  })

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        desc: editingTask.desc,
        priority: editingTask.priority,
        column: editingTask.column,
        tags: [...editingTask.tags],
        due: editingTask.due || '',
      })
    } else {
      setForm({
        title: '', desc: '', priority: 'medium',
        column: ui.addingToColumn || 'backlog',
        tags: [], due: ''
      })
    }
  }, [ui.editingTask, ui.addingToColumn])

  function close() {
    uiStore.modalOpen = false
    uiStore.editingTask = null
    uiStore.addingToColumn = null
  }

  function submit() {
    if (!form.title.trim()) return
    if (editingTask) {
      updateTask(editingTask.id, form)
    } else {
      addTask(form)
    }
    close()
  }

  function toggleTag(tag) {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag]
    }))
  }

  if (!ui.modalOpen) return null

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && close()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{editingTask ? 'Edit Task' : 'New Task'}</h3>
          <button className="modal-close" onClick={close}>×</button>
        </div>

        <div className="modal-body">
          <label className="field-label">Title *</label>
          <input
            className="field-input"
            placeholder="What needs to be done?"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && submit()}
            autoFocus
          />

          <label className="field-label">Description</label>
          <textarea
            className="field-input field-textarea"
            placeholder="Add more detail…"
            value={form.desc}
            rows={2}
            onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
          />

          <div className="modal-row">
            <div className="modal-col">
              <label className="field-label">Priority</label>
              <select
                className="field-select"
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
              >
                {Object.entries(PRIORITIES).map(([k, { label }]) => (
                  <option key={k} value={k}>{label}</option>
                ))}
              </select>
            </div>
            <div className="modal-col">
              <label className="field-label">Column</label>
              <select
                className="field-select"
                value={form.column}
                onChange={e => setForm(f => ({ ...f, column: e.target.value }))}
              >
                {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div className="modal-col">
              <label className="field-label">Due Date</label>
              <input
                type="date"
                className="field-input"
                value={form.due}
                onChange={e => setForm(f => ({ ...f, due: e.target.value }))}
              />
            </div>
          </div>

          <label className="field-label">Tags</label>
          <div className="tag-picker">
            {ALL_TAGS.map(tag => (
              <button
                key={tag}
                className={`tag-pick-btn ${form.tags.includes(tag) ? 'selected' : ''}`}
                onClick={() => toggleTag(tag)}
              >{tag}</button>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-ghost" onClick={close}>Cancel</button>
          <button className="btn-primary" onClick={submit} disabled={!form.title.trim()}>
            {editingTask ? 'Save Changes' : 'Add Task'}
          </button>
        </div>
      </div>
    </div>
  )
}
