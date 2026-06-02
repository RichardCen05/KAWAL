/**
 * BPRApp — self-contained shell for the BPR Manager view.
 * Rendered when App switches to 'bpr' mode.
 */
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import BPRSidebar from './components/BPRSidebar'
import BPRDashboard from './pages/BPRDashboard'
import AnalyticsPage from './pages/AnalyticsPage'

export default function BPRApp() {
  const [currentPage, setCurrentPage] = useState('bpr-dashboard')
  const [collapsed, setCollapsed] = useState(false)

  const renderPage = () => {
    switch (currentPage) {
      case 'bpr-analytics':
        return <AnalyticsPage key="bpr-analytics" />
      default:
        return <BPRDashboard key="bpr-dashboard" />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F4F6FA' }}>
      <BPRSidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        collapsed={collapsed}
        onToggle={() => setCollapsed(v => !v)}
      />
      <main
        className="flex-1 overflow-y-auto transition-all duration-300"
        style={{ marginLeft: collapsed ? 80 : 256 }}
      >
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>
      </main>
    </div>
  )
}
