import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  FlaskConical,
  History,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  HelpCircle,
} from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'analysis', label: 'Analysis Lab', icon: FlaskConical },
  { id: 'history', label: 'Riwayat Kasus', icon: History },
]

const bottomItems = [
  { id: 'settings', label: 'Pengaturan', icon: Settings },
  { id: 'help', label: 'Bantuan', icon: HelpCircle },
]

export default function Sidebar({ currentPage, onNavigate, collapsed, onToggle }) {
  return (
    <motion.aside
      className="fixed left-0 top-0 h-full bg-navy-800 text-white z-50 flex flex-col shadow-2xl"
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-400 to-navy-600 flex items-center justify-center flex-shrink-0 shadow-lg">
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
            <p className="text-[10px] text-navy-300 tracking-wider uppercase font-medium">
              Ubah Tolak Jadi Modal
            </p>
          </motion.div>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-navy-600 border-2 border-navy-800 flex items-center justify-center hover:bg-navy-500 transition-colors shadow-lg cursor-pointer"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-white" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-white" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {!collapsed && (
          <p className="text-[10px] text-navy-400 uppercase tracking-wider font-semibold px-3 mb-3">
            Menu Utama
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id || 
            (item.id === 'dashboard' && currentPage === 'verdict')
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 cursor-pointer group
                ${isActive
                  ? 'bg-white/15 text-white shadow-inner'
                  : 'text-navy-300 hover:bg-white/8 hover:text-white'
                }
              `}
            >
              <div className={`
                w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                transition-all duration-200
                ${isActive
                  ? 'bg-navy-500 shadow-md'
                  : 'bg-transparent group-hover:bg-white/5'
                }
              `}>
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
              {isActive && !collapsed && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400"
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="py-4 px-3 border-t border-white/10 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-navy-400 hover:bg-white/8 hover:text-white transition-all cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-[18px] h-[18px]" />
              </div>
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}

        {/* User profile */}
        <div className={`mt-3 flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-navy-400 to-emerald-500 flex items-center justify-center flex-shrink-0 text-xs font-bold">
            CS
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Credit Specialist</p>
              <p className="text-[11px] text-navy-400 truncate">cs@kawal.id</p>
            </div>
          )}
          {!collapsed && (
            <LogOut className="w-4 h-4 text-navy-400 hover:text-white cursor-pointer flex-shrink-0" />
          )}
        </div>
      </div>
    </motion.aside>
  )
}
