import { proxy, subscribe } from 'valtio'
import { subscribeKey } from 'valtio/utils'
import { taskStore } from './tasks'

// ── FILTER STATE ─── shared across Board + List views simultaneously
export const filterStore = proxy({
  search: '',
  priority: 'all',
  tag: 'all',
  view: 'board', // 'board' | 'list'
})

// Derived filter function — used in components
export function getFilteredTasks(tasks, filters) {
  return tasks.filter(task => {
    if (filters.search) {
      const q = filters.search.toLowerCase()
      if (!task.title.toLowerCase().includes(q) && !task.desc.toLowerCase().includes(q)) return false
    }
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false
    if (filters.tag !== 'all' && !task.tags.includes(filters.tag)) return false
    return true
  })
}

// ── UI STATE ─── modal, selected task, drag state
export const uiStore = proxy({
  modalOpen: false,
  editingTask: null,   // task id being edited
  addingToColumn: null, // column to pre-fill when adding
})

// ── SETTINGS STATE ─── persisted via subscribeKey
const SETTINGS_KEY = 'valtio-board-settings'
function loadSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {} } catch { return {} }
}
const savedSettings = loadSettings()

export const settingsStore = proxy({
  userName: savedSettings.userName || 'You',
  showDone: savedSettings.showDone !== undefined ? savedSettings.showDone : true,
  compactCards: savedSettings.compactCards || false,
  accentColor: savedSettings.accentColor || '#6366f1',
})

// subscribeKey — only fires when ONE specific key changes
subscribeKey(settingsStore, 'userName',     () => persistSettings())
subscribeKey(settingsStore, 'showDone',     () => persistSettings())
subscribeKey(settingsStore, 'compactCards', () => persistSettings())
subscribeKey(settingsStore, 'accentColor',  () => {
  persistSettings()
  document.documentElement.style.setProperty('--accent', settingsStore.accentColor)
})

function persistSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({
    userName:     settingsStore.userName,
    showDone:     settingsStore.showDone,
    compactCards: settingsStore.compactCards,
    accentColor:  settingsStore.accentColor,
  }))
}

// Apply saved accent color on boot
document.documentElement.style.setProperty('--accent', settingsStore.accentColor)

// ── ACTIVITY LOG ─── subscribe() fires on any change to taskStore
export const activityStore = proxy({ entries: [] })

function log(msg, type = 'info') {
  const time = new Date().toLocaleTimeString('en', { hour12: false })
  activityStore.entries.unshift({ id: Date.now() + Math.random(), time, msg, type })
  if (activityStore.entries.length > 30) activityStore.entries.length = 30
}

// subscribe() — watches the ENTIRE taskStore proxy tree
// Fires on any task add, update, delete, or column change
let lastTaskCount = taskStore.tasks.length
let lastDoneCount = taskStore.tasks.filter(t => t.column === 'done').length

subscribe(taskStore, () => {
  const tasks = taskStore.tasks
  const newCount = tasks.length
  const newDoneCount = tasks.filter(t => t.column === 'done').length

  if (newCount > lastTaskCount) {
    const newest = tasks[tasks.length - 1]
    log(`Task added: "${newest.title}"`, 'add')
  } else if (newCount < lastTaskCount) {
    log(`A task was deleted`, 'delete')
  } else if (newDoneCount > lastDoneCount) {
    const done = tasks.find(t => t.column === 'done')
    log(`Task completed ✓`, 'complete')
  } else {
    const moved = tasks.find(t => t._lastMoved)
    log(`Board updated`, 'update')
  }

  lastTaskCount = newCount
  lastDoneCount = newDoneCount

  // Also persist tasks to localStorage
  try {
    localStorage.setItem('valtio-board-tasks', JSON.stringify(tasks))
  } catch {}
})

// Log on startup
log('Board loaded — state ready', 'info')
