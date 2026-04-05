import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Calendar,
  Clock,
  FileText,
  Eye,
  Download,
  MoreHorizontal,
  CheckCircle2,
  AlertTriangle,
  ArrowLeftRight,
  XCircle,
  ArrowUpDown,
  SlidersHorizontal,
  History,
  Building2,
  User,
  Banknote,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  X,
} from 'lucide-react'

const ALL_CASES = [
  {
    id: 'KWL-2026-001',
    nama: 'Ibu Sari',
    usaha: 'Warung Nasi Padang',
    nominal: 50000000,
    status: 'banding',
    hasil: 'berhasil',
    prioritas: 'tinggi',
    tanggal: '2026-03-15',
    selesai: '2026-03-28',
    bank: 'Bank BRI',
    specialist: 'Ahmad Fauzi',
    catatan: 'Banding berhasil — SLIK sudah ter-update. KUR dicairkan.',
    slikStatus: 'Kol 5 → Kol 1',
    qrisAvg: 12400000,
  },
  {
    id: 'KWL-2026-002',
    nama: 'Pak Ahmad',
    usaha: 'Toko Kelontong Makmur',
    nominal: 75000000,
    status: 'recovery',
    hasil: 'proses',
    prioritas: 'sedang',
    tanggal: '2026-03-10',
    selesai: null,
    bank: 'Bank Mandiri',
    specialist: 'Siti Nurhaliza',
    catatan: 'Roadmap recovery berjalan — pelunasan tunggakan tahap 2/3.',
    slikStatus: 'Kol 3',
    qrisAvg: 8700000,
  },
  {
    id: 'KWL-2026-003',
    nama: 'Ibu Dewi',
    usaha: 'Laundry Fresh Clean',
    nominal: 25000000,
    status: 'redirect',
    hasil: 'berhasil',
    prioritas: 'rendah',
    tanggal: '2026-03-08',
    selesai: '2026-03-20',
    bank: 'Bank BNI',
    specialist: 'Ahmad Fauzi',
    catatan: 'Dialihkan ke Amartha — pinjaman dicairkan Rp 20 juta.',
    slikStatus: 'Kol 4',
    qrisAvg: 5200000,
  },
  {
    id: 'KWL-2026-004',
    nama: 'Pak Budi',
    usaha: 'Bengkel Motor Jaya',
    nominal: 100000000,
    status: 'banding',
    hasil: 'proses',
    prioritas: 'tinggi',
    tanggal: '2026-03-12',
    selesai: null,
    bank: 'Bank BRI',
    specialist: 'Dewi Anggraini',
    catatan: 'Surat banding sudah dikirim — menunggu respon bank.',
    slikStatus: 'Kol 5',
    qrisAvg: 18500000,
  },
  {
    id: 'KWL-2026-005',
    nama: 'Ibu Rina',
    usaha: 'Salon Kecantikan Ayu',
    nominal: 35000000,
    status: 'recovery',
    hasil: 'proses',
    prioritas: 'sedang',
    tanggal: '2026-03-05',
    selesai: null,
    bank: 'Bank BCA',
    specialist: 'Siti Nurhaliza',
    catatan: 'Roadmap pelunasan berjalan — estimasi selesai 2 minggu.',
    slikStatus: 'Kol 2',
    qrisAvg: 7300000,
  },
  {
    id: 'KWL-2026-006',
    nama: 'Pak Joko',
    usaha: 'Warung Makan Sederhana',
    nominal: 30000000,
    status: 'banding',
    hasil: 'berhasil',
    prioritas: 'tinggi',
    tanggal: '2026-02-28',
    selesai: '2026-03-15',
    bank: 'Bank BRI',
    specialist: 'Ahmad Fauzi',
    catatan: 'Banding berhasil — data SLIK error terkoreksi.',
    slikStatus: 'Kol 5 → Kol 1',
    qrisAvg: 9800000,
  },
  {
    id: 'KWL-2026-007',
    nama: 'Ibu Lestari',
    usaha: 'Toko Kain Batik',
    nominal: 60000000,
    status: 'redirect',
    hasil: 'berhasil',
    prioritas: 'rendah',
    tanggal: '2026-02-20',
    selesai: '2026-03-05',
    bank: 'Bank Mandiri',
    specialist: 'Dewi Anggraini',
    catatan: 'Dialihkan ke KoinWorks — pencairan Rp 45 juta.',
    slikStatus: 'Kol 3',
    qrisAvg: 14200000,
  },
  {
    id: 'KWL-2026-008',
    nama: 'Pak Hendra',
    usaha: 'Percetakan Digital',
    nominal: 45000000,
    status: 'banding',
    hasil: 'gagal',
    prioritas: 'sedang',
    tanggal: '2026-02-15',
    selesai: '2026-03-10',
    bank: 'Bank BNI',
    specialist: 'Ahmad Fauzi',
    catatan: 'Banding ditolak bank — tunggakan aktif terkonfirmasi. Dialihkan ke recovery.',
    slikStatus: 'Kol 5',
    qrisAvg: 6100000,
  },
  {
    id: 'KWL-2026-009',
    nama: 'Ibu Mega',
    usaha: 'Katering Rumahan',
    nominal: 20000000,
    status: 'recovery',
    hasil: 'berhasil',
    prioritas: 'rendah',
    tanggal: '2026-02-10',
    selesai: '2026-03-25',
    bank: 'Bank BRI',
    specialist: 'Siti Nurhaliza',
    catatan: 'Recovery selesai — profil SLIK bersih, siap ajukan ulang.',
    slikStatus: 'Kol 3 → Kol 1',
    qrisAvg: 4800000,
  },
  {
    id: 'KWL-2026-010',
    nama: 'Pak Darmawan',
    usaha: 'Toko Bangunan',
    nominal: 150000000,
    status: 'banding',
    hasil: 'berhasil',
    prioritas: 'tinggi',
    tanggal: '2026-02-05',
    selesai: '2026-02-28',
    bank: 'Bank Mandiri',
    specialist: 'Dewi Anggraini',
    catatan: 'Banding berhasil — bank mengakui kesalahan pencatatan SLIK.',
    slikStatus: 'Kol 5 → Kol 1',
    qrisAvg: 32000000,
  },
]

const statusConfig = {
  banding: { label: 'Banding', icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', ring: 'ring-emerald-500/20' },
  recovery: { label: 'Recovery', icon: AlertTriangle, color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500', ring: 'ring-amber-500/20' },
  redirect: { label: 'Redirect', icon: ArrowLeftRight, color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500', ring: 'ring-blue-500/20' },
  error: { label: 'Error', icon: XCircle, color: 'bg-red-100 text-red-700', dot: 'bg-red-500', ring: 'ring-red-500/20' },
}

const hasilConfig = {
  berhasil: { label: 'Berhasil', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
  proses: { label: 'Dalam Proses', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Clock },
  gagal: { label: 'Gagal', color: 'text-red-600 bg-red-50 border-red-200', icon: XCircle },
}

const formatCurrency = (num) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
}

export default function RiwayatKasus({ onViewCase }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('semua')
  const [filterHasil, setFilterHasil] = useState('semua')
  const [sortBy, setSortBy] = useState('tanggal')
  const [sortDir, setSortDir] = useState('desc')
  const [expandedCase, setExpandedCase] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = ALL_CASES
    .filter((c) => {
      const matchesSearch =
        c.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.usaha.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.bank.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'semua' || c.status === filterStatus
      const matchesHasil = filterHasil === 'semua' || c.hasil === filterHasil
      return matchesSearch && matchesStatus && matchesHasil
    })
    .sort((a, b) => {
      let valA, valB
      switch (sortBy) {
        case 'nama': valA = a.nama; valB = b.nama; break
        case 'nominal': valA = a.nominal; valB = b.nominal; break
        case 'tanggal':
        default: valA = a.tanggal; valB = b.tanggal; break
      }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1
      if (valA > valB) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDir('desc')
    }
  }

  // Summary stats for history
  const totalKasus = ALL_CASES.length
  const berhasilCount = ALL_CASES.filter((c) => c.hasil === 'berhasil').length
  const prosesCount = ALL_CASES.filter((c) => c.hasil === 'proses').length
  const gagalCount = ALL_CASES.filter((c) => c.hasil === 'gagal').length
  const totalNominal = ALL_CASES.filter((c) => c.hasil === 'berhasil').reduce((sum, c) => sum + c.nominal, 0)

  return (
    <motion.div
      className="p-8 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <History className="w-5 h-5 text-navy-500" />
          <span className="text-sm font-medium text-navy-600 tracking-wide">RIWAYAT KASUS</span>
        </div>
        <h1 className="text-3xl font-bold text-navy-900">Arsip & Riwayat Audit</h1>
        <p className="text-slate-500 mt-1">
          Telusuri dan kelola semua riwayat kasus audit yang pernah diproses.
        </p>
      </motion.div>

      {/* Summary Stats Bar */}
      <motion.div variants={itemVariants} className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl px-5 py-4 border border-slate-100 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-navy-100 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-navy-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-navy-900">{totalKasus}</p>
            <p className="text-xs text-slate-500 font-medium">Total Riwayat</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl px-5 py-4 border border-slate-100 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-700">{berhasilCount}</p>
            <p className="text-xs text-slate-500 font-medium">Berhasil ({((berhasilCount / totalKasus) * 100).toFixed(0)}%)</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl px-5 py-4 border border-slate-100 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-700">{prosesCount}</p>
            <p className="text-xs text-slate-500 font-medium">Dalam Proses</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl px-5 py-4 border border-slate-100 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
            <Banknote className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-700">{formatCurrency(totalNominal)}</p>
            <p className="text-xs text-slate-500 font-medium">Nominal Berhasil</p>
          </div>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-6">
        <div className="p-4 flex items-center gap-3 border-b border-slate-100">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama, usaha, ID kasus, atau bank..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-100 transition-all"
            />
          </div>

          {/* Quick Status Filters */}
          <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl p-1">
            {[
              { value: 'semua', label: 'Semua' },
              { value: 'banding', label: 'Banding' },
              { value: 'recovery', label: 'Recovery' },
              { value: 'redirect', label: 'Redirect' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilterStatus(item.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterStatus === item.value
                    ? 'bg-white text-navy-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Hasil filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl p-1">
            {[
              { value: 'semua', label: 'Semua Hasil' },
              { value: 'berhasil', label: '✓ Berhasil' },
              { value: 'proses', label: '◷ Proses' },
              { value: 'gagal', label: '✗ Gagal' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilterHasil(item.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterHasil === item.value
                    ? 'bg-white text-navy-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Count & Sort */}
        <div className="px-5 py-3 flex items-center justify-between text-sm">
          <span className="text-slate-500">
            Menampilkan <strong className="text-slate-700">{filtered.length}</strong> dari {ALL_CASES.length} kasus
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleSort('tanggal')}
              className={`flex items-center gap-1 text-xs font-semibold cursor-pointer transition-colors ${
                sortBy === 'tanggal' ? 'text-navy-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Tanggal
              {sortBy === 'tanggal' && (
                <span className="text-[10px]">{sortDir === 'desc' ? '↓' : '↑'}</span>
              )}
            </button>
            <button
              onClick={() => toggleSort('nominal')}
              className={`flex items-center gap-1 text-xs font-semibold cursor-pointer transition-colors ${
                sortBy === 'nominal' ? 'text-navy-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Banknote className="w-3.5 h-3.5" />
              Nominal
              {sortBy === 'nominal' && (
                <span className="text-[10px]">{sortDir === 'desc' ? '↓' : '↑'}</span>
              )}
            </button>
            <button
              onClick={() => toggleSort('nama')}
              className={`flex items-center gap-1 text-xs font-semibold cursor-pointer transition-colors ${
                sortBy === 'nama' ? 'text-navy-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Nama
              {sortBy === 'nama' && (
                <span className="text-[10px]">{sortDir === 'desc' ? '↓' : '↑'}</span>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Cases List */}
      <motion.div variants={itemVariants} className="space-y-3">
        <AnimatePresence>
          {filtered.map((c) => {
            const st = statusConfig[c.status]
            const hs = hasilConfig[c.hasil]
            const StIcon = st.icon
            const HsIcon = hs.icon
            const isExpanded = expandedCase === c.id

            return (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden card-hover"
              >
                {/* Main Row */}
                <div
                  className="flex items-center px-5 py-4 cursor-pointer group"
                  onClick={() => setExpandedCase(isExpanded ? null : c.id)}
                >
                  {/* Status Icon */}
                  <div className={`w-10 h-10 rounded-xl ${st.color} flex items-center justify-center flex-shrink-0 mr-4`}>
                    <StIcon className="w-5 h-5" />
                  </div>

                  {/* Main Info */}
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono text-navy-500 font-semibold">{c.id}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${hs.color}`}>
                        <HsIcon className="w-3 h-3" />
                        {hs.label}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {c.nama} — <span className="font-medium text-slate-600">{c.usaha}</span>
                    </p>
                  </div>

                  {/* Bank */}
                  <div className="flex items-center gap-1.5 mr-6 flex-shrink-0">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-600 font-medium">{c.bank}</span>
                  </div>

                  {/* Nominal */}
                  <div className="mr-6 flex-shrink-0 text-right">
                    <p className="text-sm font-bold text-slate-800">{formatCurrency(c.nominal)}</p>
                    <p className="text-[10px] text-slate-400">Nominal KUR</p>
                  </div>

                  {/* Date */}
                  <div className="mr-6 flex-shrink-0 text-right">
                    <p className="text-xs font-semibold text-slate-700">{formatDate(c.tanggal)}</p>
                    <p className="text-[10px] text-slate-400">Tanggal Audit</p>
                  </div>

                  {/* Status badge */}
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mr-4 ${st.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                    {st.label}
                  </span>

                  {/* Expand arrow */}
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-slate-400 group-hover:text-slate-600"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.div>
                </div>

                {/* Expanded Detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-slate-100">
                        <div className="grid grid-cols-4 gap-4 mt-4 mb-4">
                          {/* SLIK Status */}
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-[10px] text-slate-400 font-semibold uppercase mb-1">Status SLIK</p>
                            <p className="text-sm font-bold text-slate-800">{c.slikStatus}</p>
                          </div>
                          {/* QRIS */}
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-[10px] text-slate-400 font-semibold uppercase mb-1">Avg. QRIS/bulan</p>
                            <p className="text-sm font-bold text-slate-800">{formatCurrency(c.qrisAvg)}</p>
                          </div>
                          {/* Specialist */}
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-[10px] text-slate-400 font-semibold uppercase mb-1">Specialist</p>
                            <p className="text-sm font-bold text-slate-800">{c.specialist}</p>
                          </div>
                          {/* Tanggal Selesai */}
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-[10px] text-slate-400 font-semibold uppercase mb-1">Tanggal Selesai</p>
                            <p className="text-sm font-bold text-slate-800">{c.selesai ? formatDate(c.selesai) : 'Belum selesai'}</p>
                          </div>
                        </div>

                        {/* Catatan */}
                        <div className="p-4 rounded-xl bg-navy-50 border border-navy-100 mb-4">
                          <p className="text-xs text-navy-500 font-semibold uppercase mb-1">Catatan Hasil</p>
                          <p className="text-sm text-navy-800 leading-relaxed">{c.catatan}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); onViewCase && onViewCase(c) }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-600 text-white text-xs font-semibold hover:bg-navy-700 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Lihat Detail Analisis
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer">
                            <Download className="w-3.5 h-3.5" />
                            Unduh Laporan
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer">
                            <FileText className="w-3.5 h-3.5" />
                            Surat Banding
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-lg font-semibold text-slate-400">Tidak ada kasus ditemukan</p>
            <p className="text-sm text-slate-400 mt-1">Coba ubah filter atau kata kunci pencarian Anda.</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
