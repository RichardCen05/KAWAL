import { motion } from 'framer-motion'
import {
  Plus,
  FolderOpen,
  TrendingUp,
  DollarSign,
  Clock,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

/* ─────────────────── animation presets ─────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
}

/* ─────────────────── static data ───────────────────────── */
const chartData = [
  { name: 'Banding',  value: 20, color: '#22C55E' },
  { name: 'Recovery', value: 18, color: '#F59E0B' },
  { name: 'Redirect',  value: 7,  color: '#3B82F6' },
  { name: 'Pending',   value: 2,  color: '#9CA3AF' },
]

const statsCards = [
  {
    label: 'Total Kasus Bulan Ini',
    value: '47',
    change: '+12 dari bulan lalu',
    changeColor: 'text-emerald-600',
    icon: FolderOpen,
    iconGradient: 'from-blue-500 to-blue-700',
  },
  {
    label: 'Banding Berhasil',
    value: '34%',
    change: '16 dari 47 kasus',
    changeColor: 'text-slate-500',
    icon: TrendingUp,
    iconGradient: 'from-emerald-500 to-emerald-700',
  },
  {
    label: 'KUR Berhasil Tersalur',
    value: 'Rp 1,2M',
    change: '+Rp 340jt bulan ini',
    changeColor: 'text-emerald-600',
    icon: DollarSign,
    iconGradient: 'from-amber-500 to-amber-700',
  },
  {
    label: 'Rata-rata Waktu Audit',
    value: '8,3 mnt',
    change: 'vs 180 mnt manual',
    changeColor: 'text-slate-500',
    icon: Clock,
    iconGradient: 'from-rose-500 to-rose-700',
  },
]

const analysts = [
  { initials: 'DR', name: 'Dewi Rahayu',   role: 'Analis Kredit Senior', cases: 15, rate: 40, barPct: 75, barColor: '#22C55E' },
  { initials: 'FA', name: 'Faisal Amir',   role: 'Analis Kredit',        cases: 13, rate: 38, barPct: 65, barColor: '#22C55E' },
  { initials: 'RS', name: 'Rina Sari',     role: 'Analis Kredit',        cases: 12, rate: 33, barPct: 60, barColor: '#F59E0B' },
  { initials: 'JS', name: 'Joko Susilo',   role: 'Analis Kredit Junior',  cases: 7,  rate: 29, barPct: 35, barColor: '#F59E0B' },
]

const activities = [
  { type: 'banding',  dot: 'bg-emerald-500', text: 'Kasus Pak Hendra (Bengkel Motor) — Banding berhasil ke BRI · Rp 75 jt',          time: '2 jam lalu' },
  { type: 'recovery', dot: 'bg-amber-500',   text: 'Kasus Ibu Fitri (Toko Sembako) — Roadmap Recovery dibuat · 3 bulan',              time: '5 jam lalu' },
  { type: 'redirect', dot: 'bg-blue-500',    text: 'Kasus CV Maju Jaya — Dialihkan ke produk mikro BPR · Rp 50 jt',                  time: '1 hari lalu' },
  { type: 'banding',  dot: 'bg-emerald-500', text: 'Kasus Pak Agus (Warung Makan) — Surat Banding draft selesai',                    time: '2 hari lalu' },
  { type: 'recovery', dot: 'bg-amber-500',   text: 'Kasus Ibu Lestari (Salon) — Analisis AI selesai, menunggu review',               time: '3 hari lalu' },
]

/* ─────────────────── tooltip ───────────────────────────── */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-navy-800 text-white px-4 py-2.5 rounded-xl shadow-2xl text-sm"
        style={{ backgroundColor: '#1e293b' }}>
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-slate-300">{payload[0].value} kasus</p>
      </div>
    )
  }
  return null
}

/* ─────────────────── avatar colors (cycle) ─────────────── */
const avatarColors = [
  'from-navy-500 to-emerald-500',
  'from-amber-400 to-orange-500',
  'from-blue-500 to-indigo-600',
  'from-rose-400 to-pink-500',
]

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function BPRDashboard() {
  return (
    <motion.div
      className="p-8 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── HEADER ─────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              COMMAND CENTER — BPR
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Selamat Datang,{' '}
            <span style={{
              background: 'linear-gradient(135deg,#003366 0%,#00509d 50%,#0066cc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Pak Budi
            </span>
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            BPR Artha Maju Sejahtera &nbsp;·&nbsp; Cabang Malang &nbsp;·&nbsp; Periode Mei 2025
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2.5 text-white px-6 py-3.5 rounded-2xl font-semibold shadow-lg transition-shadow hover:shadow-xl cursor-pointer"
          style={{ backgroundColor: '#1B3A6B' }}
        >
          <Plus className="w-5 h-5" />
          Tambah Analis
        </motion.button>
      </motion.div>

      {/* ── METRIC CARDS ───────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-4 gap-5 mb-8">
        {statsCards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 group"
              style={{ transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.iconGradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-slate-500 font-medium mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className={`text-xs font-medium mt-2 ${stat.changeColor}`}>{stat.change}</p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* ── ROW 2: DONUT + ANALYST PERFORMANCE ─────────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-5 mb-8">

        {/* Donut chart — IDENTICAL style to original dashboard */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-1">Distribusi Kasus</h3>
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

          {/* Legend — 2-column grid, identical to original */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {chartData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-slate-600 font-medium">{item.name}</span>
                <span className="text-xs text-slate-400 ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Analyst performance — spans 2 columns */}
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-900">Kinerja Tim Analis</h3>
            <span className="text-xs font-semibold text-slate-400">Mei 2025</span>
          </div>

          <div className="space-y-5">
            {analysts.map((analyst, i) => (
              <div key={i} className="flex items-center gap-4">
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[i]} flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-sm`}
                >
                  {analyst.initials}
                </div>

                {/* Name + progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">{analyst.name}</p>
                    <div className="flex items-center gap-3 ml-3 flex-shrink-0">
                      <span className="text-xs font-bold text-slate-800">{analyst.cases} kasus</span>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: analyst.barColor === '#22C55E' ? '#f0fdf4' : '#fffbeb',
                          color: analyst.barColor,
                        }}
                      >
                        {analyst.rate}% berhasil
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-1.5">{analyst.role}</p>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${analyst.barPct}%` }}
                      transition={{ duration: 0.9, ease: 'easeOut', delay: i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: analyst.barColor }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <p className="text-[11px] text-slate-400 mt-5 pt-4 border-t border-slate-50">
            Progress bar menunjukkan proporsi kasus ditangani dari kapasitas maksimum 20 kasus/analis/bulan.
          </p>
        </div>
      </motion.div>

      {/* ── ROW 3: ACTIVITY FEED (full width) ──────────────────── */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-slate-900 text-lg">Aktivitas Terkini</h3>
          <button className="text-sm font-semibold text-navy-600 hover:text-navy-800 flex items-center gap-1 cursor-pointer transition-colors"
            style={{ color: '#00509d' }}>
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-slate-500 mb-6">Timeline audit tim — Mei 2025</p>

        <div className="space-y-4">
          {activities.map((activity, i) => (
            <div key={i} className="flex items-start gap-4 group">
              {/* Dot + vertical connector */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${activity.dot} ring-4 ring-white`} />
                {i < activities.length - 1 && (
                  <div className="w-px h-8 bg-slate-200 mt-1" />
                )}
              </div>

              {/* Text */}
              <div className="flex-1 -mt-0.5">
                <p className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors leading-snug">
                  {activity.text}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
