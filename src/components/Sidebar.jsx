import { useState } from 'react'
import { useSnapshot } from 'valtio'
import { activityStore, settingsStore } from '../store/index'

const ACCENT_COLORS = [
  '#6366f1', '#3b82f6', '#06b6d4', '#22c55e',
  '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'
]

export default function Sidebar() {
  const activity = useSnapshot(activityStore)
  const settings = useSnapshot(settingsStore)
  const [tab, setTab] = useState('activity') // 'activity' | 'settings'

  return (
    <aside className="sidebar">
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${tab === 'activity' ? 'active' : ''}`}
          onClick={() => setTab('activity')}
        >
          <span className="api-tag sm">subscribe()</span>
          Activity
        </button>
        <button
          className={`sidebar-tab ${tab === 'settings' ? 'active' : ''}`}
          onClick={() => setTab('settings')}
        >
          <span className="api-tag sm">subscribeKey()</span>
          Settings
        </button>
      </div>

      {tab === 'activity' && (
        <div className="activity-panel">
          <p className="panel-hint">
            Powered by <code>subscribe(taskStore, …)</code> — fires on every state mutation
          </p>
          <div className="activity-list">
            {activity.entries.map(e => (
              <div key={e.id} className={`activity-entry type-${e.type}`}>
                <span className="activity-time">{e.time}</span>
                <span className="activity-msg">{e.msg}</span>
              </div>
            ))}
            {activity.entries.length === 0 && (
              <p className="empty-hint">No activity yet</p>
            )}
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="settings-panel">
          <p className="panel-hint">
            Each field uses <code>subscribeKey(settingsStore, key, …)</code> — saves to localStorage only when that key changes
          </p>

          <div className="setting-row">
            <label>Your Name</label>
            <input
              className="field-input sm"
              value={settings.userName}
              onChange={e => (settingsStore.userName = e.target.value)}
            />
          </div>

          <div className="setting-row">
            <label>Show Done Column</label>
            <button
              className={`toggle-pill ${settings.showDone ? 'on' : ''}`}
              onClick={() => (settingsStore.showDone = !settingsStore.showDone)}
            >
              <span className="pill-knob" />
              {settings.showDone ? 'Visible' : 'Hidden'}
            </button>
          </div>

          <div className="setting-row">
            <label>Compact Cards</label>
            <button
              className={`toggle-pill ${settings.compactCards ? 'on' : ''}`}
              onClick={() => (settingsStore.compactCards = !settingsStore.compactCards)}
            >
              <span className="pill-knob" />
              {settings.compactCards ? 'Compact' : 'Normal'}
            </button>
          </div>

          <div className="setting-row">
            <label>Accent Color</label>
            <div className="color-picker">
              {ACCENT_COLORS.map(color => (
                <button
                  key={color}
                  className={`color-swatch ${settings.accentColor === color ? 'active' : ''}`}
                  style={{ background: color }}
                  onClick={() => (settingsStore.accentColor = color)}
                />
              ))}
            </div>
          </div>

          <div className="setting-note">
            Changes persist automatically via <code>subscribeKey()</code>
          </div>
        </div>
      )}
    </aside>
  )
}
