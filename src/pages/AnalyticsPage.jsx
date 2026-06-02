import { motion } from 'framer-motion'
import {
  BarChart2,
  AlertTriangle,
  CheckCircle2,
  Star,
  ArrowUpRight,
  Sparkles,
  ChevronDown,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'

/* ─── animation presets ──────────────────────────────────────── */
const cv = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
}
const iv = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.44, ease: [0.4, 0, 0.2, 1] } },
}

/* ─── static data ────────────────────────────────────────────── */
const REJECTION_REASONS = [
  { label: 'Kolektibilitas SLIK Kol.2+', kasus: 21, pct: 45, color: '#EF4444' },
  { label: 'Dokumen tidak lengkap',       kasus: 11, pct: 23, color: '#F59E0B' },
  { label: 'Usia usaha < 6 bulan',        kasus: 7,  pct: 15, color: '#9CA3AF' },
  { label: 'Arus kas tidak tercatat',     kasus: 5,  pct: 11, color: '#3B82F6' },
  { label: 'Plafon melebihi DSR',         kasus: 3,  pct: 6,  color: '#8B5CF6' },
]

const WEEKLY_TREND = [
  { week: 'Minggu 1', Banding: 3, Recovery: 3, Redirect: 2 },
  { week: 'Minggu 2', Banding: 4, Recovery: 4, Redirect: 3 },
  { week: 'Minggu 3', Banding: 5, Recovery: 6, Redirect: 3 },
  { week: 'Minggu 4', Banding: 4, Recovery: 5, Redirect: 5 },
]

const AI_INSIGHTS = [
  '45% penolakan disebabkan SLIK Kol.2+, mayoritas dari tunggakan Paylater konsumtif di bawah Rp 500.000. Profil ini berpotensi dibantu dengan verifikasi lag data OJK sebelum pengajuan ulang.',
  'Kasus dengan omzet QRIS tercatat stabil lebih dari 6 bulan memiliki tingkat banding berhasil 2,3× lebih tinggi dibandingkan tanpa data QRIS. Rekomendasikan QRIS sebagai dokumen standar.',
  '11 kasus dokumen tidak lengkap dapat dicegah dengan Credit Readiness Check sebelum nasabah mendaftar ke bank — estimasi penghematan 4,2 jam per kasus.',
]

const USAHA_ROWS = [
  { jenis: 'Warung / Toko',        total: 18, alasan: 'SLIK Kol.2',  berhasil: 7, rate: 39 },
  { jenis: 'Kuliner / Restoran',   total: 12, alasan: 'Dokumen',      berhasil: 4, rate: 33 },
  { jenis: 'Jasa / Bengkel',       total: 9,  alasan: 'SLIK Kol.2',  berhasil: 3, rate: 33 },
  { jenis: 'Pertanian',            total: 5,  alasan: 'Usia usaha',   berhasil: 1, rate: 20 },
  { jenis: 'Konveksi / Produksi',  total: 3,  alasan: 'DSR',          berhasil: 1, rate: 33 },
]

const METRIC_CARDS = [
  {
    label: 'Kasus Dianalisis', value: '47',
    change: '+8 dari bulan lalu', changeColor: '#22C55E',
    icon: BarChart2, grad: 'from-blue-500 to-blue-700',
  },
  {
    label: 'Alasan Dominan', value: 'SLIK Kol.2+',
    change: '45% dari seluruh kasus', changeColor: '#94a3b8',
    icon: AlertTriangle, grad: 'from-amber-500 to-amber-700',
  },
  {
    label: 'Banding Berhasil', value: '34%',
    change: '16 dari 47 kasus', changeColor: '#94a3b8',
    icon: CheckCircle2, grad: 'from-emerald-500 to-emerald-700',
  },
  {
    label: 'Rata-rata Skor Readiness', value: '61/100',
    change: 'sebelum perbaikan', changeColor: '#94a3b8',
    icon: Star, grad: 'from-rose-500 to-rose-700',
  },
]

/* ─── tiny helpers ───────────────────────────────────────────── */
function RatePill({ rate }) {
  let bg, color
  if (rate > 35)       { bg = '#F0FDF4'; color = '#16a34a' }
  else if (rate >= 20) { bg = '#F8FAFC'; color = '#64748b' }
  else                 { bg = '#FFFBEB'; color = '#b45309' }
  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold"
      style={{ backgroundColor: bg, color }}
    >
      {rate}%
    </span>
  )
}

const CustomStackedTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-xl shadow-xl border border-slate-100 px-4 py-3 text-sm min-w-[140px]">
      <p className="font-bold text-slate-800 mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.fill }} />
            {p.name}
          </span>
          <span className="font-bold text-slate-800">{p.value}</span>
        </div>
      ))}
      <div className="border-t border-slate-100 mt-1.5 pt-1.5 flex justify-between">
        <span className="text-slate-500 text-xs">Total</span>
        <span className="font-bold text-slate-800 text-xs">
          {payload.reduce((s, p) => s + p.value, 0)}
        </span>
      </div>
    </div>
  )
}

/* ─── filter dropdown ────────────────────────────────────────── */
function FilterSelect({ label }) {
  return (
    <div className="relative">
      <select
        className="appearance-none pl-3 pr-8 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 cursor-pointer transition-all shadow-sm"
        defaultValue={label}
      >
        <option>{label}</option>
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function AnalyticsPage() {
  return (
    <motion.div
      className="p-8 min-h-screen"
      style={{ backgroundColor: '#F4F6FA' }}
      variants={cv}
      initial="hidden"
      animate="visible"
    >
      {/* ── HEADER ─────────────────────────────────────────────── */}
      <motion.div variants={iv} className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">ANALYTICS</p>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Analitik Pola Penolakan
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Insight dari <span className="font-semibold text-slate-700">47 kasus diproses</span>
            &nbsp;·&nbsp; Periode Mei 2025
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5">
          <FilterSelect label="Semua Bank" />
          <FilterSelect label="Semua Jenis Usaha" />
          <FilterSelect label="30 Hari Terakhir" />
        </div>
      </motion.div>

      {/* ── METRIC CARDS ───────────────────────────────────────── */}
      <motion.div variants={iv} className="grid grid-cols-4 gap-5 mb-7">
        {METRIC_CARDS.map((card, i) => {
          const Icon = card.icon
          return (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-5 shadow-sm group"
              style={{ transition: 'all .3s cubic-bezier(.4,0,.2,1)' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.grad} flex items-center justify-center shadow-md`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-slate-500 font-medium mb-1">{card.label}</p>
              <p className="text-2xl font-extrabold text-slate-900">{card.value}</p>
              <p className="text-xs font-semibold mt-2" style={{ color: card.changeColor }}>
                {card.change}
              </p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* ── ROW 2: BAR CHARTS ──────────────────────────────────── */}
      <motion.div variants={iv} className="grid grid-cols-2 gap-5 mb-7">

        {/* LEFT — Distribusi Alasan Penolakan (horizontal custom bars) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-1">Distribusi Alasan Penolakan</h3>
          <p className="text-xs text-slate-400 mb-5">47 kasus · Mei 2025</p>

          <div className="space-y-3.5">
            {REJECTION_REASONS.map((row, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700 truncate pr-2 max-w-[220px]">
                    {row.label}
                  </span>
                  <span className="text-xs font-bold text-slate-500 flex-shrink-0 ml-auto">
                    {row.kasus} kasus&nbsp;
                    <span className="font-semibold" style={{ color: row.color }}>{row.pct}%</span>
                  </span>
                </div>
                {/* Bar track */}
                <div className="w-full rounded-full overflow-hidden" style={{ height: 8, backgroundColor: '#F1F5F9' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${row.pct}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut', delay: i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: row.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-5 pt-4 border-t border-slate-50 flex flex-wrap gap-3">
            {REJECTION_REASONS.map((r, i) => (
              <span key={i} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }} />
                {r.label.split(' ').slice(0, 2).join(' ')}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT — Tren Kasus per Minggu (stacked bar Recharts) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-1">Tren Kasus per Minggu</h3>
          <p className="text-xs text-slate-400 mb-4">Volume kasus berdasarkan outcome · Mei 2025</p>

          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={WEEKLY_TREND}
                barSize={32}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomStackedTooltip />} cursor={{ fill: 'rgba(241,245,249,0.7)', radius: 8 }} />
                <Bar dataKey="Banding"  stackId="a" fill="#22C55E" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Recovery" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Redirect" stackId="a" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 mt-3 pt-3 border-t border-slate-50">
            {[['Banding','#22C55E'],['Recovery','#F59E0B'],['Redirect','#3B82F6']].map(([n,c]) => (
              <span key={n} className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: c }} />
                {n}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── ROW 3: AI INSIGHTS ─────────────────────────────────── */}
      <motion.div variants={iv} className="mb-7">
        <div
          className="bg-white rounded-2xl p-6 shadow-sm"
          style={{ borderLeft: '4px solid #3B82F6' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#EFF6FF' }}>
              <Sparkles className="w-4.5 h-4.5" style={{ width: 18, height: 18, color: '#3B82F6' }} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Insight AI Otomatis</h3>
              <p className="text-xs text-slate-400 mt-0.5">Dihasilkan dari analisis 47 kasus · diperbarui real-time</p>
            </div>
            <span className="ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: '#EFF6FF', color: '#3B82F6', border: '1px solid #bfdbfe' }}>
              3 Temuan
            </span>
          </div>

          <div className="space-y-4">
            {AI_INSIGHTS.map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{ backgroundColor: '#F8FAFC' }}
              >
                {/* Bullet number */}
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-extrabold text-white mt-0.5"
                  style={{ backgroundColor: '#3B82F6' }}>
                  {i + 1}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{insight}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── ROW 4: BREAKDOWN TABLE ─────────────────────────────── */}
      <motion.div variants={iv}>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Card header */}
          <div className="px-6 py-5 border-b border-slate-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Breakdown per Jenis Usaha</h3>
                <p className="text-sm text-slate-400 mt-0.5">Perbandingan tingkat keberhasilan lintas segmen UMKM</p>
              </div>
              <button
                className="text-xs font-bold px-4 py-2 rounded-xl text-white shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#1B3A6B' }}
              >
                Ekspor CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC' }}>
                  {['Jenis Usaha','Total Kasus','Alasan Utama','Berhasil','Tingkat Keberhasilan'].map((h) => (
                    <th key={h}
                      className="text-left text-xs font-bold uppercase tracking-wider text-slate-400 px-6 py-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {USAHA_ROWS.map((row, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.06 }}
                    className="border-t hover:bg-slate-50/60 transition-colors"
                    style={{ borderColor: '#F8FAFC' }}
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-800">{row.jenis}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* Mini bar */}
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(row.total / 18) * 100}%`,
                              backgroundColor: '#3B82F6',
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold text-slate-800">{row.total}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor:
                            row.alasan === 'SLIK Kol.2' ? '#FEF2F2' :
                            row.alasan === 'Dokumen'    ? '#FFFBEB' :
                            row.alasan === 'DSR'        ? '#F5F3FF' : '#F8FAFC',
                          color:
                            row.alasan === 'SLIK Kol.2' ? '#dc2626' :
                            row.alasan === 'Dokumen'    ? '#b45309' :
                            row.alasan === 'DSR'        ? '#7c3aed' : '#64748b',
                        }}
                      >
                        {row.alasan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-800">{row.berhasil}</span>
                      <span className="text-xs text-slate-400 ml-1">kasus</span>
                    </td>
                    <td className="px-6 py-4">
                      <RatePill rate={row.rate} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer summary */}
          <div className="px-6 py-4 border-t flex items-center justify-between"
            style={{ borderColor: '#F8FAFC', backgroundColor: '#FAFBFC' }}>
            <p className="text-xs text-slate-400">
              Total: <span className="font-bold text-slate-700">47 kasus</span> dari 5 segmen usaha
            </p>
            <p className="text-xs text-slate-400">
              Rata-rata tingkat keberhasilan:{' '}
              <span className="font-bold text-slate-700">34%</span>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
