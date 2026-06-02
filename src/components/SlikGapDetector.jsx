import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Info, FileText, ChevronRight, CheckCircle2, X } from 'lucide-react'

/* ─────────────────────────────────────────────────────────────────────────
   Micro-components
   ───────────────────────────────────────────────────────────────────────── */

/** Small metric card (3 in a row) */
function MetricCard({ label, value, sub, valueColor = 'text-gray-900' }) {
  return (
    <div className="flex-1 bg-[#F8FAFC] rounded-2xl px-4 py-3 flex flex-col gap-0.5 min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 truncate">{label}</p>
      <p className={`text-base font-extrabold leading-tight ${valueColor}`}>{value}</p>
      <p className="text-[11px] text-slate-400 truncate">{sub}</p>
    </div>
  )
}

/** Timeline dot with optional dashed ring */
function TimelineDot({ color, dashed = false, pulse = false }) {
  return (
    <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
      {/* dashed outer ring */}
      {dashed && (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 20 20"
          fill="none"
        >
          <circle
            cx="10" cy="10" r="8"
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeDasharray="3 2"
          />
        </svg>
      )}
      {/* solid inner dot */}
      <div
        className={`w-3 h-3 rounded-full ${color} ${pulse ? 'animate-pulse' : ''}`}
      />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Toast notification
   ───────────────────────────────────────────────────────────────────────── */
function Toast({ message, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4 }}
      className="flex items-start gap-2.5 bg-[#1B3A6B] text-white text-xs rounded-xl px-4 py-3 shadow-lg mt-3"
    >
      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
      <span className="flex-1 leading-relaxed">{message}</span>
      <button onClick={onClose} className="text-white/60 hover:text-white cursor-pointer flex-shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────────────────────────────────── */
export default function SlikGapDetector() {
  const [toast, setToast] = useState(null)
  const [templateOpen, setTemplateOpen] = useState(false)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  /* Timeline point data */
  const timelinePoints = [
    {
      date: '12 Mar',
      label: 'Pelunasan Paylater',
      dot: <TimelineDot color="bg-[#22C55E]" />,
      lineStyle: 'solid',          // line that follows this dot
    },
    {
      date: '31 Mar',
      label: 'SLIK dicetak',
      dot: <TimelineDot color="bg-slate-400" />,
      lineStyle: 'solid',
    },
    {
      date: '~11 Apr',
      label: 'Estimasi update OJK',
      dot: <TimelineDot color="bg-[#F59E0B]" dashed />,
      lineStyle: 'dashed',
    },
    {
      date: 'Sekarang',
      label: 'Status masih Kol.2',
      dot: <TimelineDot color="bg-[#EF4444]" pulse />,
      lineStyle: null,             // last point — no trailing line
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      className="mt-5 bg-white rounded-2xl p-5"
      style={{ boxShadow: '0 1px 12px 0 rgba(15,27,45,0.08)' }}
    >
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-start gap-3">
          {/* Icon box */}
          <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
            <Clock className="w-4.5 h-4.5 text-[#3B82F6]" style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 leading-tight">
              Deteksi Celah Data SLIK
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              Analisis otomatis keterlambatan pembaruan data OJK
            </p>
          </div>
        </div>

        {/* Badge */}
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-100 whitespace-nowrap flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          Celah Terdeteksi ✓
        </span>
      </div>

      {/* ── 3 METRIC CARDS ─────────────────────────────────────────── */}
      <div className="flex gap-2 mb-5">
        <MetricCard
          label="Tanggal Pelunasan"
          value="12 Mar 2025"
          sub="Dari dokumen Paylater"
        />
        <MetricCard
          label="Tanggal Cetak SLIK"
          value="31 Mar 2025"
          sub="Laporan resmi OJK"
        />
        <MetricCard
          label="Selisih Waktu"
          value="19 Hari"
          valueColor="text-[#F59E0B]"
          sub="Jeda pembaruan OJK"
        />
      </div>

      {/* ── TIMELINE HORIZONTAL ────────────────────────────────────── */}
      <div className="mb-2">
        {/* Dots + connecting lines */}
        <div className="flex items-center mb-2">
          {timelinePoints.map((pt, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              {/* Dot */}
              {pt.dot}

              {/* Connecting line (if not last) */}
              {pt.lineStyle && (
                <div className="flex-1 h-px mx-1">
                  {pt.lineStyle === 'solid' ? (
                    <div className="h-px w-full bg-slate-300" />
                  ) : (
                    <svg className="w-full h-px" style={{ height: 2 }}>
                      <line
                        x1="0%" y1="1" x2="100%" y2="1"
                        stroke="#F59E0B"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                      />
                    </svg>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Date labels (above) + description labels (below) */}
        <div className="flex">
          {timelinePoints.map((pt, i) => (
            <div
              key={i}
              className={`flex flex-col items-start ${i < timelinePoints.length - 1 ? 'flex-1' : ''}`}
            >
              <span className={`text-[10px] font-bold leading-tight ${
                pt.date === 'Sekarang' ? 'text-[#EF4444]' :
                pt.date === '~11 Apr'  ? 'text-[#F59E0B]' :
                pt.date === '12 Mar'   ? 'text-[#22C55E]' :
                'text-slate-500'
              }`}>
                {pt.date}
              </span>
              <span className="text-[9.5px] text-slate-400 leading-tight mt-0.5 max-w-[62px]">
                {pt.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline caption */}
      <p className="text-[10.5px] text-slate-400 leading-relaxed mb-5 mt-3 pr-1">
        OJK memperbarui data SLIK 30–45 hari setelah pelunasan. Pengajuan KUR dilakukan sebelum
        pembaruan membuat profil nasabah tampak lebih buruk dari kondisi sebenarnya.
      </p>

      {/* ── LEGAL IMPLICATION BOX ──────────────────────────────────── */}
      <div
        className="rounded-xl p-4 mb-5 flex gap-3"
        style={{
          background: '#EFF6FF',
          borderLeft: '3px solid #3B82F6',
        }}
      >
        <Info className="w-4 h-4 text-[#3B82F6] flex-shrink-0 mt-0.5" style={{ width: 15, height: 15 }} />
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Berdasarkan{' '}
          <span className="font-semibold text-slate-800">POJK No. 22 Tahun 2023</span>,
          bank wajib melakukan analisis cash flow komprehensif dan tidak boleh hanya mengandalkan
          kolektibilitas SLIK. Keterlambatan update data OJK dapat menjadi dasar{' '}
          <span className="font-semibold text-slate-800">keberatan formal</span> jika nasabah
          terbukti telah melunasi kewajibannya.
        </p>
      </div>

      {/* ── ACTION BUTTONS ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          {/* Primary */}
          <motion.button
            whileHover={{ scale: 1.02, opacity: 0.95 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              showToast(
                'Argumen celah SLIK berhasil ditambahkan ke draft surat banding. AI akan menyusun paragraf pembuka secara otomatis.'
              )
            }
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer transition-all"
            style={{ backgroundColor: '#1B3A6B' }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Masukkan sebagai Argumen Banding
          </motion.button>

          {/* Secondary */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setTemplateOpen((v) => !v)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            Lihat Template Surat
            <ChevronRight
              className={`w-3 h-3 transition-transform duration-200 ${templateOpen ? 'rotate-90' : ''}`}
            />
          </motion.button>
        </div>

        {/* Caption */}
        <p className="text-[10px] text-slate-400 text-center">
          Argumen ini akan otomatis dimasukkan ke draft surat banding oleh AI
        </p>
      </div>

      {/* ── TEMPLATE PREVIEW (expandable) ──────────────────────────── */}
      <AnimatePresence>
        {templateOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Template Paragraf Keberatan SLIK
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed font-mono">
                "Berkenaan dengan penolakan pengajuan KUR atas nama nasabah yang bersangkutan,
                perlu kami sampaikan bahwa status kolektibilitas yang tercatat pada SLIK OJK
                per tanggal 31 Maret 2025 tidak mencerminkan kondisi terkini, dikarenakan
                adanya jeda pembaruan data OJK selama 19 hari sejak tanggal pelunasan
                (12 Maret 2025). Merujuk pada POJK No. 22 Tahun 2023, kami memohon agar
                bank melakukan verifikasi cash flow terkini sebelum keputusan final ditetapkan."
              </p>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(
                    'Berkenaan dengan penolakan pengajuan KUR atas nama nasabah yang bersangkutan, perlu kami sampaikan bahwa status kolektibilitas yang tercatat pada SLIK OJK per tanggal 31 Maret 2025 tidak mencerminkan kondisi terkini, dikarenakan adanya jeda pembaruan data OJK selama 19 hari sejak tanggal pelunasan (12 Maret 2025). Merujuk pada POJK No. 22 Tahun 2023, kami memohon agar bank melakukan verifikasi cash flow terkini sebelum keputusan final ditetapkan.'
                  )
                  showToast('Template berhasil disalin ke clipboard!')
                }}
                className="mt-3 text-[10px] font-bold text-[#3B82F6] hover:underline cursor-pointer"
              >
                Salin ke Clipboard →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOAST ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <Toast message={toast} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
