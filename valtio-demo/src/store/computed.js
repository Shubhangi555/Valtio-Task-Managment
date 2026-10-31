import { proxy } from 'valtio'
import { watch } from 'valtio/utils'
import { taskStore, COLUMNS } from './tasks'

// ── COMPUTED STATE ─── watch() auto-re-runs when dependencies change
// This is a plain proxy that gets written to by the watcher.
// Any component that calls useSnapshot(computed) will re-render on update.
export const computed = proxy({
  total: 0,
  byColumn: {},      // { backlog: 3, progress: 2, ... }
  byPriority: {},    // { urgent: 1, high: 3, ... }
  completionRate: 0, // percentage
  overdueCount: 0,
  tagCounts: {},     // { frontend: 4, backend: 2, ... }
  velocityLast7: 0,  // tasks completed in the last 7 days
})

// watch() tracks which proxies are accessed via get() and re-runs on changes
watch(get => {
  const { tasks } = get(taskStore)

  const byColumn = {}
  const byPriority = {}
  const tagCounts = {}
  let overdueCount = 0
  let velocityLast7 = 0
  const now = Date.now()
  const sevenDays = 7 * 24 * 60 * 60 * 1000

  for (const task of tasks) {
    // by column
    byColumn[task.column] = (byColumn[task.column] || 0) + 1

    // by priority
    byPriority[task.priority] = (byPriority[task.priority] || 0) + 1

    // tags
    for (const tag of task.tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    }

    // overdue: has a due date, not done, and past due
    if (task.due && task.column !== 'done') {
      const dueMs = new Date(task.due).getTime()
      if (dueMs < now) overdueCount++
    }

    // velocity: tasks moved to done in last 7 days
    if (task.column === 'done' && task.createdAt > now - sevenDays) {
      velocityLast7++
    }
  }

  const doneCount = byColumn['done'] || 0
  const total = tasks.length

  // Write derived values back to the computed proxy
  computed.total = total
  computed.byColumn = byColumn
  computed.byPriority = byPriority
  computed.completionRate = total > 0 ? Math.round((doneCount / total) * 100) : 0
  computed.overdueCount = overdueCount
  computed.tagCounts = tagCounts
  computed.velocityLast7 = velocityLast7
})
