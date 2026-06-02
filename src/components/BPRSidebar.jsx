import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Briefcase,
  Users,
  BarChart2,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
} from 'lucide-react'

const navItems = [
  { id: 'bpr-dashboard', label: 'Dashboard BPR',      icon: LayoutDashboard, active: true },
  { id: 'bpr-portfolio', label: 'Portofolio Kasus',   icon: Briefcase },
  { id: 'bpr-team',      label: 'Kinerja Tim',        icon: Users },
  { id: 'bpr-analytics', label: 'Analitik Penolakan', icon: BarChart2 },
]

const bottomItems = [
  { id: 'bpr-settings', label: 'Pengaturan', icon: Settings },
  { id: 'bpr-help',     label: 'Bantuan',    icon: HelpCircle },
]

export default function BPRSidebar({ currentPage, onNavigate, collapsed, onToggle }) {
  return (
    <motion.aside
      className="fixed left-0 top-0 h-full text-white z-50 flex flex-col shadow-2xl"
      style={{ backgroundColor: '#0F1B2D' }}
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* ── Logo ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2040 100%)' }}
        >
          <Shield className="w-5 h-5 text-white" />
        </div>

        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-xl font-bold tracking-tight">Kawal</h1>
            <p className="text-[10px] tracking-wider uppercase font-medium" style={{ color: '#6b80a0' }}>
              Ubah Tolak Jadi Modal
            </p>
          </motion.div>
        )}
      </div>

      {/* ── Toggle button ─────────────────────────────────────── */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shadow-lg cursor-pointer"
        style={{ backgroundColor: '#1B3A6B', borderColor: '#0F1B2D' }}
      >
        {collapsed
          ? <ChevronRight className="w-3 h-3 text-white" />
          : <ChevronLeft  className="w-3 h-3 text-white" />}
      </button>

      {/* ── Navigation ───────────────────────────────────────── */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {!collapsed && (
          <p className="text-[10px] uppercase tracking-wider font-semibold px-3 mb-3" style={{ color: '#4a607a' }}>
            Menu BPR
          </p>
        )}

        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer group"
              style={{
                backgroundColor: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: isActive ? '#ffffff' : '#6b80a0',
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'
                if (!isActive) e.currentTarget.style.color = '#ffffff'
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'
                if (!isActive) e.currentTarget.style.color = '#6b80a0'
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                style={{ backgroundColor: isActive ? '#1B3A6B' : 'transparent' }}
              >
                <Icon className="w-[18px] h-[18px]" />
              </div>

              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {item.label}
                </motion.span>
              )}

              {/* Active dot — only Dashboard BPR */}
              {isActive && !collapsed && (
                <motion.div
                  layoutId="bprActiveIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400"
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* ── Bottom ───────────────────────────────────────────── */}
      <div className="py-4 px-3 border-t border-white/10 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all cursor-pointer"
              style={{ color: '#4a607a' }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.color = '#ffffff'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#4a607a'
              }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-[18px] h-[18px]" />
              </div>
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}

        {/* User profile */}
        <div
          className={`mt-3 flex items-center gap-3 px-3 py-3 rounded-xl ${collapsed ? 'justify-center' : ''}`}
          style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #22C55E 100%)' }}
          >
            BH
          </div>

          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">Budi Hartono</p>
                <p className="text-[11px] truncate" style={{ color: '#4a607a' }}>
                  BPR Artha Maju · Kepala Cabang
                </p>
              </div>
              <LogOut
                className="w-4 h-4 flex-shrink-0 cursor-pointer hover:text-white transition-colors"
                style={{ color: '#4a607a' }}
              />
            </>
          )}
        </div>
      </div>
    </motion.aside>
  )
}
