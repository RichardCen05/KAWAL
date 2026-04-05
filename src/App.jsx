import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import AnalysisLab from './pages/AnalysisLab'
import VerdictResult from './pages/VerdictResult'
import RiwayatKasus from './pages/RiwayatKasus'

const DUMMY_DATA = {
  namaUMKM: 'Ibu Sari — Warung Nasi Padang',
  nominalKUR: 50000000,
  slikStatus: 'Kol 5 (Macet)',
  slikDetail: 'Paylater — Tunggakan Rp215.000 (sudah lunas, belum ter-update)',
  avgQRIS: 12400000,
  qrisTrend: [
    { bulan: 'Sep', nominal: 11200000 },
    { bulan: 'Okt', nominal: 12100000 },
    { bulan: 'Nov', nominal: 12800000 },
    { bulan: 'Des', nominal: 13100000 },
    { bulan: 'Jan', nominal: 12400000 },
    { bulan: 'Feb', nominal: 12400000 },
  ],
  alasanPenolakan: 'Status Kolektibilitas 5 (Macet) pada SLIK OJK',
  tanggalPenolakan: '2026-03-15',
  bankPenolak: 'Bank BRI',
}

const INITIAL_CASES = [
  {
    id: 'KWL-2026-001',
    nama: 'Ibu Sari',
    usaha: 'Warung Nasi Padang',
    nominal: 50000000,
    status: 'banding',
    prioritas: 'tinggi',
    tanggal: '2026-03-15',
    deadline: '2026-04-15',
  },
  {
    id: 'KWL-2026-002',
    nama: 'Pak Ahmad',
    usaha: 'Toko Kelontong Makmur',
    nominal: 75000000,
    status: 'recovery',
    prioritas: 'sedang',
    tanggal: '2026-03-10',
    deadline: '2026-04-20',
  },
  {
    id: 'KWL-2026-003',
    nama: 'Ibu Dewi',
    usaha: 'Laundry Fresh Clean',
    nominal: 25000000,
    status: 'redirect',
    prioritas: 'rendah',
    tanggal: '2026-03-08',
    deadline: null,
  },
  {
    id: 'KWL-2026-004',
    nama: 'Pak Budi',
    usaha: 'Bengkel Motor Jaya',
    nominal: 100000000,
    status: 'banding',
    prioritas: 'tinggi',
    tanggal: '2026-03-12',
    deadline: '2026-04-12',
  },
  {
    id: 'KWL-2026-005',
    nama: 'Ibu Rina',
    usaha: 'Salon Kecantikan Ayu',
    nominal: 35000000,
    status: 'recovery',
    prioritas: 'sedang',
    tanggal: '2026-03-05',
    deadline: '2026-04-25',
  },
]

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [analysisData, setAnalysisData] = useState(null)
  const [verdictData, setVerdictData] = useState(null)
  const [cases] = useState(INITIAL_CASES)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const navigateToAnalysis = useCallback((data = null) => {
    setAnalysisData(data)
    setCurrentPage('analysis')
  }, [])

  const navigateToVerdict = useCallback((data) => {
    setVerdictData(data)
    setCurrentPage('verdict')
  }, [])

  const navigateToDashboard = useCallback(() => {
    setCurrentPage('dashboard')
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case 'analysis':
        return (
          <AnalysisLab
            key="analysis"
            dummyData={DUMMY_DATA}
            onComplete={navigateToVerdict}
          />
        )
      case 'verdict':
        return (
          <VerdictResult
            key="verdict"
            data={verdictData}
            dummyData={DUMMY_DATA}
            onBack={navigateToDashboard}
            onNewAudit={() => navigateToAnalysis()}
          />
        )
      case 'history':
        return (
          <RiwayatKasus
            key="history"
            onViewCase={(c) => navigateToAnalysis(c)}
          />
        )
      default:
        return (
          <Dashboard
            key="dashboard"
            cases={cases}
            onNewAudit={() => navigateToAnalysis()}
            onCaseClick={(c) => navigateToAnalysis(c)}
          />
        )
    }
  }

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>
      </main>
    </div>
  )
}
