import { useSnapshot } from 'valtio'
import { filterStore, settingsStore } from './store/index'
import './store/computed' // init the watch() watcher
import StatsBar from './components/StatsBar'
import Toolbar from './components/Toolbar'
import BoardView from './components/BoardView'
import ListView from './components/ListView'
import Sidebar from './components/Sidebar'
import TaskModal from './components/TaskModal'
import './App.css'

export default function App() {
  const filters = useSnapshot(filterStore)
  const settings = useSnapshot(settingsStore)

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-mark">V</div>
          <div>
            <div className="brand-title">ValtioBoard</div>
            <div className="brand-sub">Valtio State Management — Live Demo</div>
          </div>
        </div>
        <div className="header-apis">
          <div className="api-legend">
            <span className="api-tag">proxy()</span> Core state
            <span className="api-tag">useSnapshot()</span> React binding
            <span className="api-tag">watch()</span> Computed
            <span className="api-tag">subscribe()</span> Side effects
            <span className="api-tag">subscribeKey()</span> Targeted watch
          </div>
        </div>
        <div className="header-user">
          👤 {settings.userName}
        </div>
      </header>

      <StatsBar />

      <div className="app-body">
        <div className="main-area">
          <Toolbar />
          <div className="view-area">
            {filters.view === 'board' ? <BoardView /> : <ListView />}
          </div>
        </div>
        <Sidebar />
      </div>

      <TaskModal />
    </div>
  )
}
