import { motion } from 'framer-motion'
import {
  Plus,
  TrendingUp,
  FileCheck,
  DollarSign,
  Clock,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  CalendarDays,
  Search,
  Filter,
  MoreVertical,
  Sparkles,
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const chartData = [
  { name: 'Banding', value: 42, color: '#059669' },
  { name: 'Recovery', value: 28, color: '#d97706' },
  { name: 'Redirect', value: 18, color: '#2563eb' },
  { name: 'Pending', value: 12, color: '#94a3b8' },
]

const statsCards = [
  {
    label: 'Total Kasus Diproses',
    value: '247',
    change: '+12 bulan ini',
    icon: FileCheck,
    color: 'from-navy-600 to-navy-800',
    bgLight: 'bg-navy-50',
    textColor: 'text-navy-700',
  },
  {
    label: 'Banding Berhasil',
    value: '78.4%',
    change: '+5.2% dari Q1',
    icon: TrendingUp,
    color: 'from-emerald-500 to-emerald-700',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-700',
  },
  {
    label: 'Modal Terselamatkan',
    value: 'Rp 8.2M',
    change: '+Rp 1.4M bulan ini',
    icon: DollarSign,
    color: 'from-amber-500 to-amber-700',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-700',
  },
  {
    label: 'Menunggu Review',
    value: '14',
    change: '3 prioritas tinggi',
    icon: Clock,
    color: 'from-rose-500 to-rose-700',
    bgLight: 'bg-rose-50',
    textColor: 'text-rose-700',
  },
]

const statusConfig = {
  banding: { label: 'Banding', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  recovery: { label: 'Recovery', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  redirect: { label: 'Redirect', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  error: { label: 'Error', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
}

const prioritasConfig = {
  tinggi: { label: 'Tinggi', color: 'text-rose-600', icon: AlertTriangle },
  sedang: { label: 'Sedang', color: 'text-amber-600', icon: Clock },
  rendah: { label: 'Rendah', color: 'text-slate-500', icon: CheckCircle2 },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}

const formatCurrency = (num) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy-800 text-white px-4 py-2.5 rounded-xl shadow-2xl text-sm">
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-navy-200">{payload[0].value} kasus</p>
      </div>
    )
  }
  return null
}

export default function Dashboard({ cases, onNewAudit, onCaseClick }) {
  return (
    <motion.div
      className="p-8 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-navy-500" />
            <span className="text-sm font-medium text-navy-600 tracking-wide">COMMAND CENTER</span>
          </div>
          <h1 className="text-3xl font-bold text-navy-900">
            Selamat Datang, <span className="gradient-text">Specialist</span>
          </h1>
          <p className="text-slate-500 mt-1">
            Pantau dan kelola semua kasus penolakan kredit UMKM dari sini.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNewAudit}
          id="btn-mulai-audit"
          className="flex items-center gap-2.5 bg-gradient-to-r from-navy-600 to-navy-800 text-white px-6 py-3.5 rounded-2xl font-semibold shadow-lg shadow-navy-600/25 hover:shadow-xl hover:shadow-navy-600/35 transition-shadow cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Mulai Audit Baru
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-4 gap-5 mb-8">
        {statsCards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 card-hover group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-slate-500 font-medium mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
              <p className={`text-xs font-medium mt-2 ${stat.textColor}`}>
                {stat.change}
              </p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Chart + Activity */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-5 mb-8">
        {/* Donut Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-navy-900 mb-1">Distribusi Kasus</h3>
          <p className="text-sm text-slate-500 mb-4">Berdasarkan hasil audit AI</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  cornerRadius={6}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {chartData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-slate-600 font-medium">{item.name}</span>
                <span className="text-xs text-slate-400 ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Aktivitas Terkini */}
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-navy-900">Aktivitas Terkini</h3>
              <p className="text-sm text-slate-500">Timeline audit terakhir</p>
            </div>
            <button className="text-sm text-navy-600 font-semibold hover:text-navy-800 flex items-center gap-1 cursor-pointer">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {[
              { time: '2 jam lalu', text: 'Kasus Ibu Sari — Banding berhasil diajukan ke Bank BRI', type: 'banding' },
              { time: '5 jam lalu', text: 'Kasus Pak Ahmad — Roadmap Recovery telah dibuat', type: 'recovery' },
              { time: '1 hari lalu', text: 'Kasus Ibu Dewi — Dialihkan ke Amartha', type: 'redirect' },
              { time: '2 hari lalu', text: 'Kasus Pak Budi — Surat Banding draft selesai', type: 'banding' },
              { time: '3 hari lalu', text: 'Kasus Ibu Rina — Analisis AI selesai', type: 'recovery' },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-4 group">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${statusConfig[activity.type]?.dot} ring-4 ring-white`} />
                  {i < 4 && <div className="w-px h-8 bg-slate-200" />}
                </div>
                <div className="flex-1 -mt-0.5">
                  <p className="text-sm text-slate-700 group-hover:text-navy-800 transition-colors">{activity.text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Cases Table */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-navy-900 text-lg">Daftar Kasus Nasabah</h3>
              <p className="text-sm text-slate-500 mt-0.5">Kelola dan pantau progress audit semua nasabah</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nasabah..."
                  className="pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-100 transition-all w-64"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3.5">ID Kasus</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3.5">Nasabah</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3.5">Nominal KUR</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3.5">Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3.5">Prioritas</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3.5">Deadline</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3.5">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c, i) => {
                const status = statusConfig[c.status]
                const prioritas = prioritasConfig[c.prioritas]
                const PIcon = prioritas?.icon
                const daysLeft = c.deadline
                  ? Math.ceil((new Date(c.deadline) - new Date()) / (1000 * 60 * 60 * 24))
                  : null
                return (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => onCaseClick(c)}
                    className="border-t border-slate-50 hover:bg-navy-50/30 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono font-semibold text-navy-700">{c.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{c.nama}</p>
                        <p className="text-xs text-slate-500">{c.usaha}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-800">{formatCurrency(c.nominal)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status?.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status?.dot}`} />
                        {status?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-xs font-semibold ${prioritas?.color}`}>
                        {PIcon && <PIcon className="w-3.5 h-3.5" />}
                        {prioritas?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {c.deadline ? (
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                          <span className={`text-xs font-medium ${daysLeft <= 7 ? 'text-rose-600' : 'text-slate-600'}`}>
                            {daysLeft} hari lagi
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}
