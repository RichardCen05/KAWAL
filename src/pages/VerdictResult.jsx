import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Copy,
  Download,
  Info,
  X,
  CheckCircle2,
  FileText,
  Shield,
  AlertTriangle,
  ArrowLeftRight,
  Plus,
  ChevronRight,
  Star,
  ExternalLink,
  TrendingUp,
  AlertCircle,
  Activity,
  Sparkles,
  BookOpen,
  Paperclip,
  BarChart3,
  Scale,
  Edit3,
  Lightbulb,
  Zap,
} from 'lucide-react'

/* ─── animation presets ─────────────────────────────────────── */
const cv = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.09 } } }
const iv = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } } }

/* ─── verdict configs ───────────────────────────────────────── */
const statusConfigs = {
  banding:  { label: 'BANDING',  badgeBg: '#F0FDF4', badgeColor: '#16a34a', badgeBorder: '#bbf7d0', icon: Shield },
  recovery: { label: 'RECOVERY', badgeBg: '#FFFBEB', badgeColor: '#b45309', badgeBorder: '#fde68a', icon: AlertTriangle },
  redirect: { label: 'REDIRECT', badgeBg: '#EFF6FF', badgeColor: '#1d4ed8', badgeBorder: '#bfdbfe', icon: ArrowLeftRight },
}

/* ─── letter paragraphs (mutable base) ─────────────────────── */
const BASE_PARAGRAPHS = {
  P1: 'Dengan hormat, kami mengajukan sanggahan atas penolakan pengajuan KUR Mikro senilai Rp 50.000.000 atas nama Ibu Sari (Warung Nasi Padang) yang ditolak berdasarkan status kolektibilitas SLIK OJK.',
  P2: 'Status kolektibilitas 5 yang tercatat dalam SLIK OJK berasal dari tunggakan layanan Paylater sebesar Rp 215.000 yang bersifat konsumtif dan tidak mencerminkan kemampuan bayar usaha nasabah yang sesungguhnya.',
  P3: 'Berdasarkan POJK Nomor 22 Tahun 2023 Pasal 41, lembaga keuangan diwajibkan melakukan analisis arus kas secara menyeluruh dan tidak dapat menjadikan kolektibilitas SLIK sebagai satu-satunya dasar penolakan kredit produktif.',
  P4: 'Data transaksi QRIS nasabah menunjukkan omzet rata-rata Rp 12.400.000 per bulan selama 6 bulan terakhir, menunjukkan kapasitas bayar yang memadai.',
}

/* ─── audit trail data ──────────────────────────────────────── */
const AUDIT_DATA = {
  P1: {
    regulasi: [{ badge: 'POJK 22/2023', text: 'Pasal 41 ayat 2 — Kewajiban transparansi alasan penolakan kredit' }],
    bukti:    [{ badge: 'Surat Penolakan Bank', badgeColor: '#b45309', badgeBg: '#FFFBEB', text: 'Baris 3 surat penolakan: "tidak memenuhi kriteria kolektibilitas"' }],
    skor: 72, skorLabel: 'Kuat — alasan penolakan tidak spesifik, memenuhi syarat sanggahan berdasarkan POJK',
  },
  P2: {
    regulasi: [{ badge: 'POJK 22/2023', text: 'Pasal 21 — Perlakuan adil dan tidak diskriminatif terhadap nasabah' }],
    bukti: [
      { badge: 'Laporan SLIK OJK',    badgeColor: '#16a34a', badgeBg: '#F0FDF4', text: 'Halaman 2 SLIK: kolektibilitas 5 tercatat dari akun Paylater konsumtif, bukan rekening usaha' },
      { badge: 'Mutasi Rekening BRI', badgeColor: '#b45309', badgeBg: '#FFFBEB', text: 'Tidak ditemukan tunggakan dari rekening usaha — 38 transaksi masuk dalam 3 bulan terakhir' },
    ],
    skor: 88, skorLabel: 'Sangat kuat — ada bukti dokumen langsung dari SLIK',
  },
  P3: {
    regulasi: [
      { badge: 'POJK 22/2023',    text: 'Pasal 41 — Kewajiban analisis cash flow komprehensif' },
      { badge: 'Permenko KUR 2026', text: 'Pasal 8 — Bank penyalur wajib mempertimbangkan omzet usaha' },
    ],
    bukti: [{ badge: 'Surat Penolakan Bank', badgeColor: '#dc2626', badgeBg: '#FEF2F2', text: 'Analisis cash flow tidak ditemukan dalam dokumen penolakan — indikasi prosedur tidak dijalankan' }],
    skor: 91, skorLabel: 'Sangat kuat — celah prosedural bank yang dapat dibuktikan secara regulasi',
  },
  P4: {
    regulasi: [{ badge: 'Permenko KUR 2026', text: 'Pasal 12 — Omzet usaha sebagai indikator kelayakan kredit' }],
    bukti:    [{ badge: 'Rekap QRIS GoPay', badgeColor: '#16a34a', badgeBg: '#F0FDF4', text: '6 bulan data: Jan Rp 11,2 jt / Feb Rp 11,8 jt / Mar Rp 12,1 jt / Apr Rp 12,4 jt / Mei Rp 12,7 jt / Jun Rp 13,1 jt' }],
    skor: 71, skorLabel: 'Kuat — data kuantitatif 6 bulan dengan tren positif',
  },
}

/* ─── strength meter data ───────────────────────────────────── */
const STRENGTH_DATA = {
  P1: {
    regulasi:  { score: 75, desc: 'POJK 22/2023 Pasal 41 ayat 2' },
    bukti:     { score: 65, desc: 'Surat penolakan tidak spesifik' },
    preseden:  { score: 76, desc: '8 dari 12 kasus serupa berhasil banding' },
    suggestions: [
      { text: '+ Sebutkan nomor dan tanggal surat penolakan', addition: ' (ref. Surat Penolakan BRI No. 045/KUR/III/2025 tanggal 10 Maret 2025)' },
    ],
    newScore: 80,
  },
  P2: {
    regulasi:  { score: 90, desc: 'POJK 22/2023 Pasal 21 — perlakuan tidak diskriminatif' },
    bukti:     { score: 88, desc: 'Terbukti dari laporan SLIK halaman 2' },
    preseden:  { score: 86, desc: '11 dari 13 kasus serupa berhasil' },
    suggestions: [],
    newScore: 88,
  },
  P3: {
    regulasi:  { score: 95, desc: 'POJK 22/2023 + Permenko KUR 2026' },
    bukti:     { score: 88, desc: 'Cash flow tidak dianalisis — terbukti dari surat penolakan' },
    preseden:  { score: 79, desc: '12 dari 15 kasus serupa berhasil banding' },
    suggestions: [],
    newScore: 91,
  },
  P4: {
    regulasi:  { score: 72, desc: 'Permenko KUR 2026 Pasal 12' },
    bukti:     { score: 68, desc: 'Data QRIS ada namun tanpa tren spesifik' },
    preseden:  { score: 73, desc: '9 dari 14 kasus dengan data QRIS berhasil' },
    suggestions: [
      { text: '+ Tambahkan tren pertumbuhan omzet bulan ke bulan', addition: ' dengan pertumbuhan positif: Jan Rp 11,2 jt → Jun Rp 13,1 jt (+17%),' },
      { text: '+ Bandingkan DSR 6,2% dengan batas maksimal bank 30%', addition: ' Debt Service Ratio (DSR) hanya 6,2% — jauh di bawah batas maksimal 30% yang ditetapkan Bank Indonesia.' },
      { text: '+ Sebutkan jumlah transaksi QRIS per bulan', addition: ' dengan rata-rata 284 transaksi per bulan,' },
    ],
    newScore: 85,
  },
}

/* ─── argument summary rows ─────────────────────────────────── */
const ARG_ROWS = [
  { pid: 'P1', preview: 'Kami mengajukan sanggahan...', reg: 'POJK 22/2023'     },
  { pid: 'P2', preview: 'Status kolektibilitas 5...',   reg: 'POJK 22/2023'     },
  { pid: 'P3', preview: 'Berdasarkan POJK Nomor 22...', reg: 'POJK + Permenko'  },
  { pid: 'P4', preview: 'Data transaksi QRIS...',       reg: 'Permenko KUR 2026' },
]

/* ─── lenders ────────────────────────────────────────────────── */
const LENDERS = [
  { name: 'Amartha',   type: 'P2P Lending',   maxLoan: 'Rp 50 Juta',  rate: '12-18%/tahun', rating: 4.5, color: '#0d9488', desc: 'Platform P2P lending fokus pemberdayaan UMKM wanita di pedesaan.' },
  { name: 'Modalku',   type: 'Micro Finance', maxLoan: 'Rp 2 Miliar', rate: '10-16%/tahun', rating: 4.7, color: '#3B82F6', desc: 'Solusi permodalan digital untuk UKM dengan proses cepat dan transparan.' },
  { name: 'KoinWorks', type: 'Multi Finance', maxLoan: 'Rp 2 Miliar', rate: '9-18%/tahun',  rating: 4.4, color: '#6366f1', desc: 'Super financial app dengan beragam produk pinjaman bisnis.' },
]

/* ─── roadmap steps ──────────────────────────────────────────── */
const ROADMAP = [
  { title: 'Lunasi & Update SLIK',      desc: 'Pastikan Paylater sudah lunas dan minta pernyataan lunas resmi dari penyedia.', pill: 'Prioritas Tinggi', pillBg: '#FEF2F2', pillColor: '#dc2626', est: 'Selesai dalam 3–5 hari' },
  { title: 'Ajukan Surat Sanggahan',    desc: 'Kirimkan surat sanggahan ke Bank BRI cabang dan tembusan ke OJK via portal konsumen.', pill: 'Setelah Step 1', pillBg: '#FFFBEB', pillColor: '#b45309', est: 'Respons bank 14 hari kerja' },
  { title: 'Follow Up & Dokumentasi',  desc: 'Catat semua komunikasi dengan bank. Jika tidak ada respons dalam 20 hari kerja, eskalasi ke LAPS SJK OJK.', pill: 'Jika diperlukan', pillBg: '#F8FAFC', pillColor: '#64748b', est: 'Maksimal 20 hari kerja' },
]

/* ─── helpers ────────────────────────────────────────────────── */
const scoreColor  = (s) => s >= 85 ? '#22C55E' : s >= 70 ? '#3B82F6' : '#F59E0B'
const scoreBg     = (s) => s >= 85 ? '#F0FDF4' : s >= 70 ? '#EFF6FF' : '#FFFBEB'
const scoreLabel  = (s) => s >= 85 ? 'Sangat Kuat' : s >= 70 ? 'Kuat' : 'Sedang'
const borderColor = (s) => s >= 80 ? '#22C55E' : s >= 60 ? '#F59E0B' : '#EF4444'
const borderBg    = (s) => s >= 80 ? '#F0FDF410' : s >= 60 ? '#FFFBEB20' : '#FEF2F210'

/* ══════════════════════════════════════════════════════════════
   SVG SCORE GAUGE
   ══════════════════════════════════════════════════════════════ */
function ScoreGauge({ score }) {
  const color = scoreColor(score)
  return (
    <svg width="120" height="72" viewBox="0 0 120 72" className="mx-auto">
      {/* Background arc */}
      <path d="M 10 66 A 50 50 0 0 1 110 66"
        fill="none" stroke="#E2E8F0" strokeWidth="10" strokeLinecap="round" />
      {/* Progress arc */}
      <path d="M 10 66 A 50 50 0 0 1 110 66"
        fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
        strokeDasharray={`${score} 100`} pathLength="100" />
      {/* Score */}
      <text x="60" y="56" textAnchor="middle" fontSize="24" fontWeight="900"
        fill={color} fontFamily="Inter, sans-serif">{score}</text>
      <text x="60" y="68" textAnchor="middle" fontSize="10"
        fill="#94a3b8" fontFamily="Inter, sans-serif">/100</text>
    </svg>
  )
}

/* ══════════════════════════════════════════════════════════════
   ANIMATED COUNTER
   ══════════════════════════════════════════════════════════════ */
function AnimatedScore({ target }) {
  const [val, setVal] = useState(target - 15)
  useEffect(() => {
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / 800, 1)
      setVal(Math.round((target - 15) + p * 15))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target])
  return <>{val}</>
}

/* ══════════════════════════════════════════════════════════════
   STRENGTH METER PANEL (right column of Surat Banding)
   ══════════════════════════════════════════════════════════════ */
function StrengthMeterPanel({ activePid, paragraphScores, onApplySuggestion }) {
  const score = paragraphScores[activePid] || 72
  const sd    = STRENGTH_DATA[activePid]
  const hasWarning = score < 80 && sd?.suggestions?.length > 0

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
        <p className="text-xs font-bold text-slate-800">Strength Meter</p>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: '#F8FAFC', color: '#64748b', border: '1px solid #e2e8f0' }}>
          {activePid} aktif
        </span>
      </div>

      <div className="p-4 space-y-4 flex-1">

        {/* Main gauge */}
        <div className="text-center">
          <ScoreGauge score={score} key={activePid + score} />
          <p className="text-xs font-bold mt-1" style={{ color: scoreColor(score) }}>
            {scoreLabel(score)}
          </p>
        </div>

        {/* Sub-scores */}
        <div className="space-y-3">
          {[
            { label: 'Kekuatan regulasi',       data: sd?.regulasi },
            { label: 'Kekuatan bukti dokumen',  data: sd?.bukti },
            { label: 'Preseden kasus serupa',   data: sd?.preseden },
          ].map(({ label, data }, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-slate-600">{label}</span>
                <span className="text-[11px] font-extrabold" style={{ color: scoreColor(data?.score || 70) }}>
                  {data?.score || 0}/100
                </span>
              </div>
              <div className="w-full rounded-full overflow-hidden mb-1" style={{ height: 5, backgroundColor: '#E2E8F0' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data?.score || 0}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: scoreColor(data?.score || 70) }}
                />
              </div>
              <p className="text-[10px] text-slate-400 leading-snug">{data?.desc}</p>
            </div>
          ))}
        </div>

        {/* AI Suggestion */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Lightbulb style={{ width: 12, height: 12, color: '#94a3b8' }} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Saran dari AI</p>
          </div>

          {!hasWarning ? (
            <div className="p-3 rounded-xl"
              style={{ backgroundColor: '#F0FDF4', border: '1px solid #dcfce7' }}>
              <div className="flex items-start gap-2">
                <CheckCircle2 style={{ width: 14, height: 14, color: '#22C55E', flexShrink: 0, marginTop: 1 }} />
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Paragraf ini sudah sangat kuat. Tidak ada perubahan yang diperlukan sebelum pengiriman.
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="p-3 rounded-xl mb-2"
                style={{ backgroundColor: '#FFFBEB', border: '1px solid #fde68a' }}>
                <div className="flex items-start gap-2">
                  <Lightbulb style={{ width: 14, height: 14, color: '#F59E0B', flexShrink: 0, marginTop: 1 }} />
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    Paragraf ini bisa diperkuat dengan menambahkan data spesifik. Klik saran di bawah untuk menerapkan otomatis:
                  </p>
                </div>
              </div>
              <div className="space-y-1.5">
                {sd?.suggestions.map((sug, i) => (
                  <button key={i}
                    onClick={() => onApplySuggestion(activePid, sug.addition, sd.newScore)}
                    className="w-full text-left text-[11px] font-semibold px-3 py-2 rounded-lg cursor-pointer transition-all hover:bg-blue-50"
                    style={{ color: '#1B3A6B', border: '1px solid #bfdbfe', backgroundColor: '#EFF6FF' }}>
                    {sug.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* All paragraphs mini-view */}
        <div className="border-t border-slate-100 pt-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Semua paragraf</p>
          <div className="space-y-2">
            {ARG_ROWS.map(({ pid, preview }) => {
              const s = paragraphScores[pid] || 72
              const isActive = pid === activePid
              return (
                <div key={pid} className={`flex items-center gap-2 p-2 rounded-lg transition-all ${isActive ? 'ring-1' : ''}`}
                  style={{ backgroundColor: isActive ? scoreBg(s) : 'transparent', '--tw-ring-color': scoreColor(s) }}>
                  <span className="text-[9px] font-extrabold w-5 flex-shrink-0 text-center"
                    style={{ color: isActive ? '#1B3A6B' : '#94a3b8' }}>
                    {pid}
                  </span>
                  <div className="flex-1 rounded-full overflow-hidden" style={{ height: 4, backgroundColor: '#E2E8F0' }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${s}%`, backgroundColor: scoreColor(s) }} />
                  </div>
                  <span className="text-[10px] font-extrabold flex-shrink-0" style={{ color: scoreColor(s) }}>
                    {s}
                  </span>
                  {s < 80 && (
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#F59E0B' }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   AUDIT TRAIL PANEL — fixed viewport-level drawer
   ══════════════════════════════════════════════════════════════ */
function AuditTrailPanel({ paragraphId, onClose }) {
  const d = AUDIT_DATA[paragraphId]
  if (!d) return null

  return (
    <AnimatePresence>
      <motion.div key="backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(15,27,45,0.18)', backdropFilter: 'blur(2px)' }}
        onClick={onClose} />

      <motion.div key="drawer"
        initial={{ x: 360, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 360, opacity: 0 }}
        transition={{ duration: 0.34, ease: [0.4, 0, 0.2, 1] }}
        className="fixed right-0 top-0 h-full bg-white z-50 flex flex-col"
        style={{ width: 340, boxShadow: '-8px 0 48px rgba(15,27,45,0.14)' }}>

        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#EFF6FF' }}>
              <Scale style={{ width: 16, height: 16, color: '#3B82F6' }} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Audit Trail</p>
              <h4 className="text-sm font-bold text-slate-800">Paragraf {paragraphId.replace('P', '')}</h4>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Score strip */}
        <div className="px-5 py-3 border-b border-slate-50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Kekuatan Argumen</span>
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: scoreBg(d.skor), color: scoreColor(d.skor) }}>
              {scoreLabel(d.skor)} · {d.skor}/100
            </span>
          </div>
          <div className="mt-2.5 w-full rounded-full overflow-hidden" style={{ height: 6, backgroundColor: '#E2E8F0' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${d.skor}%` }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
              className="h-full rounded-full" style={{ backgroundColor: scoreColor(d.skor) }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen style={{ width: 13, height: 13, color: '#94a3b8' }} />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Dasar Regulasi</p>
            </div>
            <div className="space-y-2.5">
              {d.regulasi.map((r, i) => (
                <div key={i} className="p-3.5 rounded-xl" style={{ backgroundColor: '#EFF6FF', border: '1px solid #dbeafe' }}>
                  <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-2"
                    style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}>{r.badge}</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Paperclip style={{ width: 13, height: 13, color: '#94a3b8' }} />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Bukti Dokumen</p>
            </div>
            <div className="space-y-2.5">
              {d.bukti.map((b, i) => (
                <div key={i} className="p-3.5 rounded-xl"
                  style={{ backgroundColor: b.badgeBg, border: `1px solid ${b.badgeColor}22` }}>
                  <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-2"
                    style={{ backgroundColor: `${b.badgeColor}18`, color: b.badgeColor, border: `1px solid ${b.badgeColor}30` }}>
                    {b.badge}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">{b.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 style={{ width: 13, height: 13, color: '#94a3b8' }} />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Skor Kekuatan Argumen</p>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-600">Kekuatan argumen ini</span>
                <span className="text-xl font-extrabold" style={{ color: scoreColor(d.skor) }}>
                  {d.skor}<span className="text-xs font-bold text-slate-400">/100</span>
                </span>
              </div>
              <div className="w-full rounded-full overflow-hidden mb-3" style={{ height: 8, backgroundColor: '#E2E8F0' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${d.skor}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.15 }}
                  className="h-full rounded-full" style={{ backgroundColor: scoreColor(d.skor) }} />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed italic">{d.skorLabel}</p>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-slate-100 flex-shrink-0">
          <button onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
            Tutup Panel
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function VerdictResult({ data, dummyData, onBack, onNewAudit }) {
  const verdictStatus = data?.status || 'banding'
  const confidence    = data?.confidence || 84.2
  const formData      = data?.formData || { namaUMKM: dummyData.namaUMKM, nominalKUR: dummyData.nominalKUR, avgQRIS: dummyData.avgQRIS }
  const cfg = statusConfigs[verdictStatus]

  /* ── state ── */
  const [openAudit,       setOpenAudit]       = useState(null)
  const [copied,          setCopied]          = useState(false)
  const [roadmapChecked,  setRoadmapChecked]  = useState([false, false, false])
  const [activeTab,       setActiveTab]       = useState('edit')
  const [activePid,       setActivePid]       = useState('P3')
  const [paragraphScores, setParagraphScores] = useState({ P1: 72, P2: 88, P3: 91, P4: 71 })
  const [paragraphTexts,  setParagraphTexts]  = useState({ ...BASE_PARAGRAPHS })
  const [appliedSugs,     setAppliedSugs]     = useState(new Set())

  const toggleRoadmap = (i) => { const n = [...roadmapChecked]; n[i] = !n[i]; setRoadmapChecked(n) }

  const handleCopy = () => {
    const text = Object.values(paragraphTexts).join('\n\n')
    navigator.clipboard?.writeText(text)
    setCopied(true); setTimeout(() => setCopied(false), 2200)
  }

  const handleApplySuggestion = (pid, addition, newScore) => {
    setParagraphTexts(prev => ({ ...prev, [pid]: prev[pid].replace(/[.,]?\s*$/, '') + addition }))
    setParagraphScores(prev => ({ ...prev, [pid]: newScore }))
    setAppliedSugs(prev => new Set([...prev, pid]))
  }

  const dsr      = ((formData.nominalKUR * 0.015 / (formData.avgQRIS || 12400000)) * 100).toFixed(1)
  const avgScore = Math.round(Object.values(paragraphScores).reduce((a, b) => a + b, 0) / 4)

  return (
    <>
      <AnimatePresence>
        {openAudit && (
          <AuditTrailPanel paragraphId={openAudit} onClose={() => setOpenAudit(null)} />
        )}
      </AnimatePresence>

      <motion.div className="min-h-screen pb-16" style={{ backgroundColor: '#F4F6FA' }}
        variants={cv} initial="hidden" animate="visible">

        {/* ══ HEADER ══════════════════════════════════════════════════ */}
        <motion.div variants={iv} className="bg-white border-b border-slate-100 px-8 py-5"
          style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
          <div className="flex items-start justify-between">
            <div>
              <button onClick={onBack}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 mb-2.5 cursor-pointer transition-colors group">
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                Kembali ke Dashboard
              </button>
              <h1 className="text-lg font-bold text-slate-900">
                Ibu Sari — Warung Nasi Padang &nbsp;·&nbsp; KUR BRI Rp 50 Juta
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Dianalisis oleh KAWAL AI · {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-extrabold"
                style={{ backgroundColor: cfg.badgeBg, color: cfg.badgeColor, border: `1.5px solid ${cfg.badgeBorder}` }}>
                <motion.span className="w-2 h-2 rounded-full inline-block flex-shrink-0"
                  style={{ backgroundColor: cfg.badgeColor }}
                  animate={{ opacity: [1, 0.35, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
                {cfg.label} — {confidence.toFixed(1)}% Confidence
              </span>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onNewAudit}
                className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm cursor-pointer"
                style={{ backgroundColor: '#1B3A6B' }}>
                <Plus className="w-4 h-4" /> Audit Baru
              </motion.button>
            </div>
          </div>

          {/* Context strip */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-50">
            {[
              { label: 'Alasan Penolakan',      value: 'Kolektibilitas 5 (Macet) — SLIK OJK',            icon: AlertCircle, color: '#EF4444' },
              { label: 'Fakta Lapangan',         value: 'Paylater Rp 215rb — konsumtif, sudah lunas',     icon: CheckCircle2, color: '#22C55E' },
              { label: 'Pelanggaran Prosedur',   value: 'POJK 22/2023 Ps. 41 — cash flow tidak dianalisis', icon: Scale, color: '#3B82F6' },
            ].map(({ label, value, icon: Icon, color }, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}15` }}>
                  <Icon style={{ width: 12, height: 12, color }} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="px-8 pt-6 space-y-6">

          {/* ══ SECTION 1 — METRIC CARDS ════════════════════════════ */}
          <motion.div variants={iv} className="grid grid-cols-3 gap-5">
            {[
              { label: 'Omzet QRIS', value: 'Rp 12,4 jt', sub: 'Stabil 6 bulan', iconBg: 'from-blue-500 to-blue-700', Icon: TrendingUp, trend: '+5,6% MoM', trendColor: '#22C55E' },
              { label: 'Tunggakan SLIK', value: 'Rp 215 rb', sub: 'Sudah lunas', iconBg: 'from-amber-500 to-amber-700', Icon: AlertCircle, trend: 'Konsumtif — bukan usaha', trendColor: '#F59E0B' },
              { label: 'Debt Service Ratio', value: `${dsr}%`, sub: 'Batas sehat 30%', iconBg: 'from-rose-500 to-rose-700', Icon: Activity, trend: 'Jauh di bawah batas', trendColor: '#22C55E' },
            ].map(({ label, value, sub, iconBg, Icon, trend, trendColor }, i) => (
              <motion.div key={i} whileHover={{ y: -3 }}
                className="bg-white rounded-2xl p-5 shadow-sm"
                style={{ boxShadow: '0 1px 8px rgba(15,27,45,0.06)', transition: 'all .3s cubic-bezier(.4,0,.2,1)' }}>
                <div className="mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
                <p className="text-2xl font-extrabold text-slate-900">{value}</p>
                <p className="text-xs font-semibold text-slate-400 mt-1">{sub}</p>
                <p className="text-[11px] font-bold mt-2" style={{ color: trendColor }}>{trend}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* ══ SECTION 2 — SURAT BANDING (60%) + ROADMAP (40%) ════ */}
          <motion.div variants={iv} className="grid gap-5" style={{ gridTemplateColumns: '60% 1fr' }}>

            {/* ── SURAT BANDING — 2-column layout ──────────────────── */}
            <div className="bg-white rounded-2xl flex flex-col"
              style={{ boxShadow: '0 1px 12px rgba(15,27,45,0.07)', minHeight: 560 }}>

              {/* Card header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-50 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: '#EFF6FF' }}>
                    <FileText style={{ width: 15, height: 15, color: '#3B82F6' }} />
                  </div>
                  <h3 className="font-bold text-slate-900">Surat Banding</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold" style={{ color: scoreColor(avgScore) }}>
                    Rata-rata kekuatan: {avgScore}/100
                  </span>
                  <div className="flex items-center gap-1">
                    <button title="Edit" className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={handleCopy} title="Salin"
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer">
                      {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button title="Unduh PDF"
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tab bar */}
              <div className="flex border-b border-slate-100 px-5 flex-shrink-0">
                {[
                  { id: 'edit',    label: 'Mode Edit' },
                  { id: 'preview', label: 'Preview PDF' },
                  { id: 'riwayat', label: 'Riwayat Versi' },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 2-column body */}
              <div className="flex flex-1 overflow-hidden">

                {/* Left 65%: letter text */}
                <div className="overflow-y-auto p-5" style={{ width: '65%' }}>
                  {/* Formal heading */}
                  <div className="mb-4 pb-4 border-b border-slate-100">
                    <p className="text-[11px] font-extrabold text-slate-800 text-center uppercase tracking-widest mb-3">
                      Surat Sanggahan Atas Penolakan Kredit Usaha Rakyat
                    </p>
                    <div className="text-xs text-slate-600 space-y-0.5">
                      <p>Kepada Yth. <span className="font-semibold">Kepala Cabang Bank BRI</span></p>
                      <p>di Tempat</p>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      <span className="font-semibold">Perihal:</span> Sanggahan atas Penolakan KUR Mikro
                    </p>
                    <p className="text-xs text-slate-600 mt-2">Dengan hormat,</p>
                  </div>

                  {/* Paragraphs */}
                  <div className="space-y-3">
                    {['P1', 'P2', 'P3', 'P4'].map((pid) => {
                      const s      = paragraphScores[pid]
                      const isAct  = activePid === pid
                      const bc     = borderColor(s)
                      return (
                        <div key={pid}
                          onClick={() => setActivePid(pid)}
                          className="relative pl-3 pr-3 py-3 rounded-r-xl cursor-pointer transition-all duration-200 group"
                          style={{
                            borderLeft: `3px solid ${bc}`,
                            backgroundColor: isAct ? `${bc}12` : `${bc}06`,
                            boxShadow: isAct ? `inset 0 0 0 1px ${bc}30` : 'none',
                          }}>
                          <span className="absolute top-2 left-3 text-[9px] font-extrabold"
                            style={{ color: isAct ? bc : '#94a3b8' }}>{pid}</span>
                          <div className="flex items-start gap-2 mt-3">
                            <p className="text-xs text-slate-700 leading-relaxed flex-1"
                              contentEditable={activeTab === 'edit'}
                              suppressContentEditableWarning
                              style={{ outline: 'none' }}>
                              {paragraphTexts[pid]}
                            </p>
                            <button onClick={(e) => { e.stopPropagation(); setOpenAudit(pid) }}
                              title="Lihat audit trail"
                              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer mt-0.5"
                              style={{
                                backgroundColor: openAudit === pid ? '#3B82F6' : '#EFF6FF',
                                color: openAudit === pid ? '#fff' : '#3B82F6',
                              }}>
                              <Info className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {appliedSugs.has(pid) && (
                            <div className="flex items-center gap-1 mt-2">
                              <Zap style={{ width: 10, height: 10, color: '#22C55E' }} />
                              <span className="text-[10px] font-bold text-emerald-600">Saran AI diterapkan</span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Closing */}
                  <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                    <p className="leading-relaxed">Berdasarkan fakta-fakta di atas, kami memohon agar pihak Bank dapat meninjau kembali permohonan KUR Mikro atas nama yang bersangkutan.</p>
                    <p>Demikian surat sanggahan ini kami buat dengan sebenar-benarnya.</p>
                    <p className="mt-3 font-semibold text-slate-800">Hormat kami,</p>
                    <p>Credit Specialist — Kawal.id</p>
                  </div>
                </div>

                {/* Right 35%: Strength meter */}
                <div className="border-l border-slate-100 flex-shrink-0" style={{ width: '35%' }}>
                  <StrengthMeterPanel
                    activePid={activePid}
                    paragraphScores={paragraphScores}
                    onApplySuggestion={handleApplySuggestion}
                  />
                </div>
              </div>

              {/* Card footer */}
              <div className="px-5 py-3 border-t border-slate-50 flex-shrink-0">
                <div className="flex items-center justify-between p-3.5 rounded-xl"
                  style={{ backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      Rata-rata kekuatan surat: <span style={{ color: scoreColor(avgScore) }}>{avgScore}/100</span>
                    </p>
                    {paragraphScores.P4 < 80 && (
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Surat ini akan lebih kuat jika P4 diperkuat terlebih dahulu. Estimasi setelah perbaikan: <span className="font-bold text-slate-600">88/100</span>
                      </p>
                    )}
                  </div>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm cursor-pointer flex-shrink-0"
                    style={{ backgroundColor: '#1B3A6B' }}>
                    <Download className="w-3.5 h-3.5" /> Unduh PDF Final ↓
                  </motion.button>
                </div>
              </div>
            </div>

            {/* ── ROADMAP STRATEGIS ─────────────────────────────────── */}
            <div className="bg-white rounded-2xl p-5 flex flex-col"
              style={{ boxShadow: '0 1px 12px rgba(15,27,45,0.07)' }}>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#EFF6FF' }}>
                  <ChevronRight style={{ width: 15, height: 15, color: '#1B3A6B' }} />
                </div>
                <h3 className="font-bold text-slate-900">Roadmap Strategis</h3>
              </div>

              <div className="space-y-0 flex-1">
                {ROADMAP.map((step, i) => (
                  <div key={i} className="flex gap-0">
                    <div className="flex flex-col items-center w-10 flex-shrink-0">
                      <button onClick={() => toggleRoadmap(i)}
                        className="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs text-white flex-shrink-0 cursor-pointer transition-all duration-300 z-10"
                        style={{ backgroundColor: roadmapChecked[i] ? '#22C55E' : '#1B3A6B' }}>
                        {roadmapChecked[i] ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                      </button>
                      {i < ROADMAP.length - 1 && (
                        <div className="w-px flex-1 my-1" style={{ minHeight: 28, backgroundColor: roadmapChecked[i] ? '#86efac' : '#e2e8f0' }} />
                      )}
                    </div>
                    <div className="flex-1 mb-4 ml-3 p-4 rounded-xl cursor-pointer transition-all duration-200"
                      style={{ backgroundColor: roadmapChecked[i] ? '#F0FDF4' : '#F8FAFC', border: roadmapChecked[i] ? '1px solid #bbf7d0' : '1px solid #F1F5F9' }}
                      onClick={() => toggleRoadmap(i)}>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h4 className={`text-sm font-bold ${roadmapChecked[i] ? 'text-emerald-700 line-through' : 'text-slate-800'}`}>{step.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: step.pillBg, color: step.pillColor }}>{step.pill}</span>
                      </div>
                      <p className={`text-xs leading-relaxed mb-1.5 ${roadmapChecked[i] ? 'text-emerald-600/70' : 'text-slate-500'}`}>{step.desc}</p>
                      <p className="text-[10px] font-semibold text-slate-400">{step.est}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl mt-2" style={{ backgroundColor: '#F8FAFC', borderLeft: '3px solid #22C55E' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Probabilitas keberhasilan banding</p>
                <p className="text-3xl font-extrabold" style={{ color: '#22C55E' }}>67%</p>
                <p className="text-[11px] text-slate-400 mt-1">Berdasarkan 47 kasus serupa yang diproses KAWAL</p>
              </div>
            </div>
          </motion.div>

          {/* ══ SECTION 3 — ARGUMENT STRENGTH SUMMARY ═══════════════ */}
          <motion.div variants={iv} className="bg-white rounded-2xl p-6 shadow-sm"
            style={{ boxShadow: '0 1px 12px rgba(15,27,45,0.07)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#EFF6FF' }}>
                <Sparkles style={{ width: 18, height: 18, color: '#3B82F6' }} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Ringkasan Kekuatan Argumen Banding</h3>
                <p className="text-xs text-slate-400 mt-0.5">Setiap argumen dalam surat banding dievaluasi berdasarkan preseden kasus dan kekuatan regulasi</p>
              </div>
            </div>

            <div className="space-y-3">
              {ARG_ROWS.map((row, i) => {
                const s = paragraphScores[row.pid]
                return (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="flex items-center gap-4 p-4 rounded-xl transition-colors cursor-pointer"
                    style={{ backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F1F5F9' }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F8FAFC' }}
                    onClick={() => { setActivePid(row.pid); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                    <span className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold flex-shrink-0 text-white"
                      style={{ backgroundColor: '#1B3A6B' }}>{row.pid}</span>
                    <span className="text-xs text-slate-500 flex-1 truncate">{row.preview}</span>
                    <div className="w-28 rounded-full overflow-hidden flex-shrink-0" style={{ height: 6, backgroundColor: '#E2E8F0' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${s}%` }}
                        transition={{ duration: 1, delay: 0.4 + i * 0.1 }}
                        className="h-full rounded-full" style={{ backgroundColor: scoreColor(s) }} />
                    </div>
                    <span className="text-sm font-extrabold flex-shrink-0 w-14 text-right" style={{ color: scoreColor(s) }}>
                      {s}/100
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 whitespace-nowrap"
                      style={{ backgroundColor: '#EFF6FF', color: '#3B82F6' }}>{row.reg}</span>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#EFF6FF', color: '#3B82F6' }}>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="mt-5 p-5 rounded-2xl flex items-center justify-between"
              style={{ backgroundColor: '#F0FDF4', border: '1px solid #dcfce7' }}>
              <div>
                <p className="text-sm font-bold text-emerald-800">
                  Rata-rata kekuatan argumen: <span className="text-emerald-600 text-base">{avgScore}/100</span>
                </p>
                <p className="text-xs text-emerald-700 mt-0.5">Surat banding ini siap diajukan ke bank</p>
              </div>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm cursor-pointer"
                style={{ backgroundColor: '#1B3A6B' }}>
                <Download className="w-4 h-4" /> Unduh PDF Surat Banding
              </motion.button>
            </div>
          </motion.div>

          {/* ══ LENDER ALTERNATIVES ══════════════════════════════════ */}
          <motion.div variants={iv} className="bg-white rounded-2xl p-6 shadow-sm"
            style={{ boxShadow: '0 1px 12px rgba(15,27,45,0.07)' }}>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#EFF6FF' }}>
                <ArrowLeftRight style={{ width: 15, height: 15, color: '#3B82F6' }} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Lender Alternatif</h3>
                <p className="text-xs text-slate-400">Rekomendasi mitra pendanaan jika banding tidak berhasil</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-5">
              {LENDERS.map((lender, i) => (
                <motion.div key={i} whileHover={{ y: -4 }}
                  className="rounded-2xl border border-slate-100 overflow-hidden group cursor-pointer"
                  style={{ transition: 'all .3s cubic-bezier(.4,0,.2,1)' }}>
                  <div className="h-1.5 w-full" style={{ backgroundColor: lender.color }} />
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-slate-800">{lender.name}</h4>
                        <p className="text-xs text-slate-400">{lender.type}</p>
                      </div>
                      <span className="flex items-center gap-1 text-sm font-bold text-slate-700">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />{lender.rating}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">{lender.desc}</p>
                    <div className="space-y-1.5 text-xs mb-4">
                      <div className="flex justify-between"><span className="text-slate-400">Maks. Pinjaman</span><span className="font-semibold text-slate-800">{lender.maxLoan}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Bunga</span><span className="font-semibold text-slate-800">{lender.rate}</span></div>
                    </div>
                    <button className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      style={{ backgroundColor: '#F8FAFC', color: '#1B3A6B' }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1B3A6B'; e.currentTarget.style.color = '#fff' }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.color = '#1B3A6B' }}>
                      Lihat Detail <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ══ BOTTOM ACTIONS ══════════════════════════════════════ */}
          <motion.div variants={iv} className="flex items-center justify-between pt-2">
            <button onClick={onBack}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
            </button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onNewAudit}
              className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-semibold shadow-lg cursor-pointer"
              style={{ backgroundColor: '#1B3A6B', boxShadow: '0 4px 16px rgba(27,58,107,0.28)' }}>
              <Plus className="w-5 h-5" /> Mulai Audit Baru
            </motion.button>
          </motion.div>

        </div>
      </motion.div>
    </>
  )
}
