import { proxy } from 'valtio'

const STORAGE_KEY = 'valtio-board-tasks'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

const defaultTasks = [
  { id: 't1', title: 'Set up CI/CD pipeline', desc: 'Configure GitHub Actions for auto-deploy', priority: 'high', column: 'done', tags: ['devops'], due: '2025-03-20', createdAt: Date.now() - 86400000 * 5 },
  { id: 't2', title: 'Design system tokens', desc: 'Define color, spacing and typography variables', priority: 'medium', column: 'done', tags: ['design'], due: '2025-03-22', createdAt: Date.now() - 86400000 * 4 },
  { id: 't3', title: 'Auth & JWT refresh flow', desc: 'Implement silent token refresh with retry logic', priority: 'urgent', column: 'progress', tags: ['backend', 'security'], due: '2025-04-02', createdAt: Date.now() - 86400000 * 3 },
  { id: 't4', title: 'Dashboard analytics page', desc: 'Charts for DAU, retention and revenue', priority: 'high', column: 'progress', tags: ['frontend'], due: '2025-04-05', createdAt: Date.now() - 86400000 * 2 },
  { id: 't5', title: 'Write API documentation', desc: 'OpenAPI spec for all v2 endpoints', priority: 'medium', column: 'review', tags: ['docs'], due: '2025-04-08', createdAt: Date.now() - 86400000 },
  { id: 't6', title: 'E2E test suite', desc: 'Playwright tests for critical user flows', priority: 'medium', column: 'review', tags: ['testing'], due: '2025-04-10', createdAt: Date.now() - 86400000 },
  { id: 't7', title: 'Mobile responsive fixes', desc: 'Fix layout breakpoints on 320-375px screens', priority: 'low', column: 'backlog', tags: ['frontend', 'design'], due: '2025-04-15', createdAt: Date.now() },
  { id: 't8', title: 'Rate limiting middleware', desc: 'Per-IP and per-user throttling on public routes', priority: 'high', column: 'backlog', tags: ['backend', 'security'], due: '2025-04-12', createdAt: Date.now() },
  { id: 't9', title: 'User onboarding flow', desc: 'Step-by-step first-run experience with tooltips', priority: 'medium', column: 'backlog', tags: ['frontend', 'ux'], due: '2025-04-20', createdAt: Date.now() },
]

const saved = loadFromStorage()

// ── CORE STATE ─── proxy() is the foundation of Valtio
export const taskStore = proxy({
  tasks: saved || defaultTasks,
})

// ── MUTATIONS ─── direct object mutations, no reducers
export function addTask(data) {
  taskStore.tasks.push({
    id: 't' + Date.now(),
    title: data.title,
    desc: data.desc || '',
    priority: data.priority || 'medium',
    column: data.column || 'backlog',
    tags: data.tags || [],
    due: data.due || '',
    createdAt: Date.now(),
  })
}

export function updateTask(id, patch) {
  const task = taskStore.tasks.find(t => t.id === id)
  if (!task) return
  Object.assign(task, patch) // deep mutation — Valtio tracks this
}

export function deleteTask(id) {
  taskStore.tasks = taskStore.tasks.filter(t => t.id !== id)
}

export function moveTask(id, column) {
  const task = taskStore.tasks.find(t => t.id === id)
  if (task) task.column = column // single nested mutation
}

export const COLUMNS = [
  { id: 'backlog',  label: 'Backlog',     color: '#64748b' },
  { id: 'progress', label: 'In Progress', color: '#3b82f6' },
  { id: 'review',  label: 'In Review',   color: '#f59e0b' },
  { id: 'done',    label: 'Done',        color: '#22c55e' },
]

export const PRIORITIES = {
  low:    { label: 'Low',    color: '#64748b' },
  medium: { label: 'Medium', color: '#3b82f6' },
  high:   { label: 'High',   color: '#f59e0b' },
  urgent: { label: 'Urgent', color: '#ef4444' },
}

export const ALL_TAGS = ['frontend', 'backend', 'design', 'devops', 'testing', 'docs', 'security', 'ux']
