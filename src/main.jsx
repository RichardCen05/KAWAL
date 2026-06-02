import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import BPRApp from './BPRApp.jsx'

function AppRoot() {
  // Switch view with a simple state flag; persists in session via hash
  const [mode, setMode] = useState(
    () => window.location.hash === '#bpr' ? 'bpr' : 'cs'
  )

  const switchTo = (m) => {
    setMode(m)
    window.location.hash = m === 'bpr' ? '#bpr' : ''
  }

  return (
    <>
      {mode === 'bpr' ? <BPRApp /> : <App />}

      {/* Floating mode-switcher pill — bottom-right corner */}
      <div
        className="fixed bottom-5 right-5 z-[9999] flex items-center rounded-full shadow-xl overflow-hidden text-xs font-bold"
        style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}
      >
        <button
          onClick={() => switchTo('cs')}
          className="px-4 py-2 transition-all cursor-pointer"
          style={{
            backgroundColor: mode === 'cs' ? '#1B3A6B' : '#e2e8f0',
            color: mode === 'cs' ? '#ffffff' : '#64748b',
          }}
        >
          Credit Specialist
        </button>
        <button
          onClick={() => switchTo('bpr')}
          className="px-4 py-2 transition-all cursor-pointer"
          style={{
            backgroundColor: mode === 'bpr' ? '#1B3A6B' : '#e2e8f0',
            color: mode === 'bpr' ? '#ffffff' : '#64748b',
          }}
        >
          Manajer BPR
        </button>
      </div>
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>,
)

