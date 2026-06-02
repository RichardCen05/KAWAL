import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Check,
  AlertTriangle,
  Info,
  Calendar,
  Building2,
  Clock,
  ArrowRight,
  TrendingUp,
  FileCheck,
  HelpCircle,
  Sparkles,
  Award,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react'

// Container animations for smooth transitions
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
}

export default function ReadinessCheck({ onNewAudit }) {
  const [activeTab, setActiveTab] = useState('hasil') // 'hasil', 'perbandingan', 'riwayat'
  const [isSimulated, setIsSimulated] = useState(false) // Toggle for simulating repair recommendations

  // Data that changes during the simulation
  const score = isSimulated ? 88 : 68
  const scoreLabel = isSimulated ? 'Sangat Siap' : 'Siap Sebagian'
  const scoreBadgeColor = isSimulated
    ? 'bg-[#EAF3DE] text-[#1D9E75] border-[#1D9E75]/20'
    : 'bg-[#FAEEDA] text-[#EF9F27] border-[#EF9F27]/20'
  const scoreBadgeText = isSimulated ? 'Siap Diajukan' : 'Perlu Perbaikan'

  const slikStatusVal = isSimulated ? 'Kol. 1' : 'Kol. 2'
  const slikStatusDesc = isSimulated ? 'Lancar & Terupdate' : 'Perlu klarifikasi'
  const slikStatusColor = isSimulated ? 'text-[#1D9E75]' : 'text-[#EF9F27]'

  // 6 Faktor Penilaian
  const faktorPenilaian = [
    {
      id: 1,
      nama: 'Riwayat SLIK/iDeb',
      deskripsi: isSimulated 
        ? 'Lancar (Kol 1), tunggakan Paylater Rp 215rb telah dilunasi & terupdate'
        : 'Kolektibilitas 2, tunggakan Paylater Rp 215rb',
      skor: isSimulated ? 100 : 40,
      badgeText: isSimulated ? 'Lancar' : 'Berisiko',
      badgeStyle: isSimulated
        ? 'bg-[#EAF3DE] text-[#1D9E75] border-[#1D9E75]/20'
        : 'bg-[#FCEBEB] text-[#E24B4A] border-[#E24B4A]/20',
      barColor: isSimulated ? 'bg-[#1D9E75]' : 'bg-[#E24B4A]'
    },
    {
      id: 2,
      nama: 'Arus Kas & Omzet',
      deskripsi: 'QRIS stabil Rp 12,4 jt/bulan selama 6 bulan',
      skor: 85,
      badgeText: 'Sangat Baik',
      badgeStyle: 'bg-[#EAF3DE] text-[#1D9E75] border-[#1D9E75]/20',
      barColor: 'bg-[#1D9E75]'
    },
    {
      id: 3,
      nama: 'Kelengkapan Dokumen',
      deskripsi: 'KTP, NPWP, mutasi rekening — lengkap',
      skor: 90,
      badgeText: 'Lengkap',
      badgeStyle: 'bg-[#EAF3DE] text-[#1D9E75] border-[#1D9E75]/20',
      barColor: 'bg-[#1D9E75]'
    },
    {
      id: 4,
      nama: 'Rasio DSR',
      deskripsi: 'Cicilan terhadap pendapatan: 6,2% (batas bank 30%)',
      skor: 80,
      badgeText: 'Aman',
      badgeStyle: 'bg-[#EAF3DE] text-[#1D9E75] border-[#1D9E75]/20',
      barColor: 'bg-[#1D9E75]'
    },
    {
      id: 5,
      nama: 'Usia Usaha',
      deskripsi: '14 bulan, melewati batas minimum 6 bulan',
      skor: 70,
      badgeText: 'Memenuhi',
      badgeStyle: 'bg-[#EAF3DE] text-[#1D9E75] border-[#1D9E75]/20',
      barColor: 'bg-[#1D9E75]'
    },
    {
      id: 6,
      nama: 'Legalitas Usaha',
      deskripsi: isSimulated 
        ? 'NIB aktif & SIUP terdaftar melalui OSS' 
        : 'NIB aktif, belum memiliki SIUP',
      skor: isSimulated ? 95 : 55,
      badgeText: isSimulated ? 'Lengkap' : 'Kurang SIUP',
      badgeStyle: isSimulated 
        ? 'bg-[#EAF3DE] text-[#1D9E75] border-[#1D9E75]/20'
        : 'bg-[#FAEEDA] text-[#EF9F27] border-[#EF9F27]/20',
      barColor: isSimulated ? 'bg-[#1D9E75]' : 'bg-[#EF9F27]'
    }
  ]

  // Perbandingan Kriteria BRI
  const kriteriaBRI = [
    {
      id: 1,
      kriteria: 'Omzet Bulanan',
      nasabah: 'Rp 12,4 jt',
      min: 'Rp 2 jt',
      status: 'pass',
      persen: 90,
      barColor: 'bg-[#1D9E75]'
    },
    {
      id: 2,
      kriteria: 'Usia Usaha',
      nasabah: '14 bln',
      min: '6 bln',
      status: 'pass',
      persen: 78,
      barColor: 'bg-[#1D9E75]'
    },
    {
      id: 3,
      kriteria: 'Status SLIK',
      nasabah: isSimulated ? 'Kol. 1' : 'Kol. 2',
      min: 'Kol. 1',
      status: isSimulated ? 'pass' : 'warning',
      persen: isSimulated ? 100 : 40,
      barColor: isSimulated ? 'bg-[#1D9E75]' : 'bg-[#EF9F27]',
      hasMarker: !isSimulated
    },
    {
      id: 4,
      kriteria: 'DSR Rasio Cicilan',
      nasabah: '6,2%',
      min: 'Maks 30%',
      status: 'pass',
      persen: 22,
      barColor: 'bg-[#1D9E75]'
    },
    {
      id: 5,
      kriteria: 'Plafon Diajukan',
      nasabah: 'Rp 50 jt',
      min: 'Maks Rp 100 jt',
      status: 'pass',
      persen: 50,
      barColor: 'bg-[#1D9E75]'
    }
  ]

  // Math variables for donut chart SVG
  const circ = 251.3
  const greenArc = (score / 100) * circ
  const yellowArc = circ - greenArc

  return (
    <motion.div
      className="p-8 min-h-screen bg-[#f0f4f8]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Halaman */}
      <motion.div variants={itemVariants} className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">PRE-SCREENING INSTRUMENT</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Cek Kesiapan Kredit
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Evaluasi kesiapan pengajuan KUR sebelum nasabah mendaftar
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Button to toggle simulations */}
          <button
            onClick={() => setIsSimulated(!isSimulated)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all shadow-sm cursor-pointer ${
              isSimulated
                ? 'bg-white text-rose-600 border-rose-200 hover:bg-rose-50'
                : 'bg-white text-navy-600 border-navy-100 hover:bg-navy-50/50'
            }`}
          >
            {isSimulated ? (
              <>
                <RotateCcw className="w-4 h-4" />
                Reset Simulasi
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                Simulasikan Perbaikan
              </>
            )}
          </button>

          <button
            onClick={onNewAudit}
            className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all cursor-pointer hover:opacity-90 active:scale-95"
            style={{ backgroundColor: '#1D9E75' }}
          >
            <Plus className="w-4 h-4" />
            Kasus Baru
          </button>
        </div>
      </motion.div>

      {/* Tab Bar */}
      <motion.div variants={itemVariants} className="border-b border-slate-200 mb-6 flex items-center justify-between">
        <div className="flex gap-8">
          {[
            { id: 'hasil', label: 'Hasil Evaluasi' },
            { id: 'perbandingan', label: 'Perbandingan Kriteria Bank' },
            { id: 'riwayat', label: 'Riwayat Penilaian' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-bold border-b-2 transition-all relative cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#1D9E75] text-[#1D9E75]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeReadinessTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1D9E75]"
                />
              )}
            </button>
          ))}
        </div>
        <div className="text-xs font-semibold text-slate-400 pb-4">
          ID Audit: KWL-RDY-0932
        </div>
      </motion.div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        {activeTab === 'hasil' && (
          <motion.div
            key="hasil-evaluasi"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* ROW 1: Donut Score and Factors */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Kolom Kiri: Profil Nasabah & Skor */}
              <motion.div
                variants={itemVariants}
                className="lg:col-span-5 bg-white rounded-xl p-6 border border-slate-200/60 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Profil Nasabah & Skor</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Analisis instan kesiapan nasabah</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${scoreBadgeColor}`}>
                      {scoreBadgeText}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-4 mb-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Usaha & Pengajuan</p>
                    <p className="text-base font-bold text-slate-800 mt-1">Ibu Sari — Warung Nasi Padang</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">Pengajuan:</span>
                      <span className="text-xs font-bold text-slate-700">KUR BRI · Rp 50 juta</span>
                    </div>
                  </div>

                  {/* SVG Donut Chart Score */}
                  <div className="relative w-44 h-44 mx-auto mb-6 flex items-center justify-center">
                    <svg width="100%" height="100%" viewBox="0 0 100 100" className="transform -rotate-90">
                      {/* Base Track */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#F3F4F6"
                        strokeWidth="9"
                      />
                      {/* Yellow Risk Arc */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#EF9F27"
                        strokeWidth="9"
                        strokeDasharray={circ}
                        strokeDashoffset={-greenArc}
                        className="transition-all duration-700 ease-out"
                      />
                      {/* Green Success Arc */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#1D9E75"
                        strokeWidth="9"
                        strokeDasharray={`${greenArc} ${circ}`}
                        strokeLinecap="round"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-4xl font-extrabold text-slate-800 tracking-tight transition-all duration-300">
                        {score}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">dari 100</span>
                    </div>
                  </div>

                  <p className="text-center text-lg font-bold text-slate-700 tracking-wide mt-2">
                    Status: <span className={score >= 80 ? 'text-[#1D9E75]' : 'text-[#EF9F27]'}>{scoreLabel}</span>
                  </p>
                </div>

                {/* 3 Metric Cards Kecil */}
                <div className="grid grid-cols-3 gap-2.5 mt-6 pt-6 border-t border-slate-100">
                  <div className="bg-[#f8fafc] border border-slate-100 rounded-lg p-2.5 text-center">
                    <p className="text-[10px] font-semibold text-slate-400">Skor SLIK</p>
                    <p className={`text-xs font-bold mt-1 ${slikStatusColor}`}>{slikStatusVal}</p>
                    <p className="text-[9px] text-slate-400 truncate mt-0.5" title={slikStatusDesc}>{slikStatusDesc}</p>
                  </div>
                  <div className="bg-[#f8fafc] border border-slate-100 rounded-lg p-2.5 text-center">
                    <p className="text-[10px] font-semibold text-slate-400">Usia Usaha</p>
                    <p className="text-xs font-bold mt-1 text-[#1D9E75]">14 bln</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Memenuhi syarat</p>
                  </div>
                  <div className="bg-[#f8fafc] border border-slate-100 rounded-lg p-2.5 text-center">
                    <p className="text-[10px] font-semibold text-slate-400">Rata-rata Omzet</p>
                    <p className="text-xs font-bold mt-1 text-slate-800">Rp 12 jt</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">per bulan</p>
                  </div>
                </div>
              </motion.div>

              {/* Kolom Kanan: Faktor Penilaian */}
              <motion.div
                variants={itemVariants}
                className="lg:col-span-7 bg-white rounded-xl p-6 border border-slate-200/60 shadow-sm"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-slate-800">Faktor Penilaian</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Analisis detail aspek krusial kriteria kelayakan bank</p>
                </div>

                <div className="space-y-4">
                  {faktorPenilaian.map((factor) => (
                    <div key={factor.id} className="p-3 border border-slate-100 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-all">
                      <div className="flex items-start justify-between mb-1.5">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-700">{factor.nama}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{factor.deskripsi}</p>
                        </div>
                        <div className="flex flex-col items-end pl-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${factor.badgeStyle}`}>
                            {factor.badgeText}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 mt-1">{factor.skor}/100</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${factor.skor}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full rounded-full ${factor.barColor}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* ROW 2: Recommendations and Bank Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Kolom Kiri: Rekomendasi Sebelum Pengajuan */}
              <motion.div
                variants={itemVariants}
                className="lg:col-span-6 bg-white rounded-xl p-6 border border-slate-200/60 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Rekomendasi Sebelum Pengajuan</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Langkah konkret perbaikan profil untuk meningkatkan peluang</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Recommendation 1 */}
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#EAF3DE] text-[#1D9E75] flex items-center justify-center font-bold text-xs">
                        1
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm text-slate-600 leading-relaxed ${isSimulated ? 'line-through opacity-50' : ''}`}>
                          Lunasi tunggakan Paylater Rp 215.000 dan tunggu 30–45 hari agar status SLIK diperbarui oleh OJK sebelum mengajukan KUR.
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="bg-[#FCEBEB] text-[#E24B4A] border border-[#E24B4A]/10 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            Prioritas Tinggi
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Estimasi waktu: 30–45 hari
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Recommendation 2 */}
                    <div className="flex gap-3 pt-3 border-t border-slate-100">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#EAF3DE] text-[#1D9E75] flex items-center justify-center font-bold text-xs">
                        2
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm text-slate-600 leading-relaxed ${isSimulated ? 'line-through opacity-50' : ''}`}>
                          Daftarkan usaha ke SIUP melalui OSS (Online Single Submission) untuk memperkuat kelengkapan dokumen legalitas.
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="bg-[#FAEEDA] text-[#EF9F27] border border-[#EF9F27]/10 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            Prioritas Sedang
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Estimasi waktu: 7–14 hari
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Recommendation 3 */}
                    <div className="flex gap-3 pt-3 border-t border-slate-100">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#EAF3DE] text-[#1D9E75] flex items-center justify-center font-bold text-xs">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Pastikan rekening koran 3 bulan terakhir aktif dan mencerminkan omzet nyata, hindari penarikan tunai besar sebelum pengajuan.
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="bg-[#E6F1FB] text-[#2563eb] border border-[#2563eb]/10 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            Saran Tambahan
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Estimasi waktu: segera
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Box Prediksi Skor */}
                <div className="mt-6 p-4 rounded-xl bg-[#EAF3DE] border border-[#1D9E75]/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#1D9E75]/10 flex items-center justify-center">
                      <Award className="w-5 h-5 text-[#1D9E75]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Prediksi Setelah Perbaikan</p>
                      <p className="text-sm font-bold text-[#1D9E75] mt-0.5">Prediksi skor setelah perbaikan: 88/100</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-[#1D9E75] text-white px-2.5 py-1 rounded-lg shadow-sm">
                    Kemungkinan disetujui tinggi
                  </span>
                </div>
              </motion.div>

              {/* Kolom Kanan: Perbandingan dengan Kriteria BRI KUR Mikro */}
              <motion.div
                variants={itemVariants}
                className="lg:col-span-6 bg-white rounded-xl p-6 border border-slate-200/60 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-800">Perbandingan dengan Kriteria BRI KUR Mikro</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Kesesuaian profile nasabah terhadap SOP Kebijakan BRI</p>
                  </div>

                  <div className="space-y-4">
                    {kriteriaBRI.map((item) => (
                      <div key={item.id} className="relative">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-semibold text-slate-600">{item.kriteria}</span>
                          <span className="text-slate-500">
                            <span className="font-bold text-slate-800">{item.nasabah}</span>
                            {item.status === 'pass' ? (
                              <span className="text-[#1D9E75] ml-1 font-bold">✓</span>
                            ) : (
                              <span className="text-[#EF9F27] ml-1 font-bold">⚠</span>
                            )}
                            <span className="text-slate-400"> vs </span>
                            <span>{item.min}</span>
                          </span>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="w-full bg-slate-200 rounded-full h-2 relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.persen}%` }}
                            transition={{ duration: 0.8 }}
                            className={`h-full rounded-full ${item.barColor}`}
                          />
                          
                          {/* SLIK Marker Line (only when SLIK warning is active) */}
                          {item.hasMarker && (
                            <div 
                              className="absolute top-1/2 -translate-y-1/2 w-1.5 h-3 bg-[#E24B4A] rounded-sm group cursor-pointer"
                              style={{ left: '80%' }}
                              title="Ideal: Kol 1 (80% score)"
                            >
                              <div className="hidden group-hover:block absolute bottom-4 left-1/2 -translate-x-1/2 bg-navy-800 text-white text-[9px] px-1.5 py-0.5 rounded font-mono whitespace-nowrap shadow-md">
                                Ideal (80%)
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Box Bottom Status */}
                {isSimulated ? (
                  <div className="mt-6 p-4 rounded-xl bg-[#EAF3DE] border border-[#1D9E75]/20 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#1D9E75] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Semua Kriteria Terpenuhi</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Status SLIK sudah lancar dan SIUP terdaftar. Profil sudah memenuhi SOP BRI KUR Mikro secara penuh. Siap diajukan!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 p-4 rounded-xl bg-[#FAEEDA] border border-[#EF9F27]/20 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-[#EF9F27] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">1 Kriteria Utama Belum Terpenuhi</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Status SLIK perlu diperbaiki. Rekomendasi: tunda pengajuan 30–45 hari agar status diperbarui oleh OJK.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Perbandingan Kriteria Bank */}
        {activeTab === 'perbandingan' && (
          <motion.div
            key="perbandingan-bank"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-xl p-6 border border-slate-200/60 shadow-sm"
          >
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Perbandingan Kriteria Bank pelaksana KUR</h3>
                <p className="text-xs text-slate-400 mt-0.5">Analisis kesesuaian profil Ibu Sari terhadap beberapa opsi bank</p>
              </div>
              <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                KUR Mikro 2026
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-50">
                    <th className="p-4 rounded-l-lg">Bank Penerbit</th>
                    <th className="p-4">Plafon Maksimal</th>
                    <th className="p-4">Bunga Efektif</th>
                    <th className="p-4">Skor Kesiapan</th>
                    <th className="p-4">Status Kelayakan</th>
                    <th className="p-4 rounded-r-lg">Catatan Kebijakan Bank</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      name: 'BRI (KUR Mikro)',
                      plafon: 'Rp 100 jt',
                      bunga: '6% per tahun',
                      skor: isSimulated ? 88 : 68,
                      status: isSimulated ? 'Siap Diajukan' : 'Perlu Perbaikan',
                      statusColor: isSimulated ? 'bg-[#EAF3DE] text-[#1D9E75]' : 'bg-[#FAEEDA] text-[#EF9F27]',
                      catatan: isSimulated 
                        ? 'Semua kriteria terpenuhi.'
                        : 'Sangat ketat terhadap SLIK Kol. 2 di awal. Perlu penyelesaian tunggakan Paylater.',
                    },
                    {
                      name: 'Mandiri (KUR Mikro)',
                      plafon: 'Rp 100 jt',
                      bunga: '6% per tahun',
                      skor: isSimulated ? 90 : 72,
                      status: isSimulated ? 'Siap Diajukan' : 'Siap Bersyarat',
                      statusColor: isSimulated ? 'bg-[#EAF3DE] text-[#1D9E75]' : 'bg-[#E6F1FB] text-[#2563eb]',
                      catatan: 'Dapat memproses SLIK Kol. 2 dengan surat klarifikasi pelunasan tanpa menunggu OJK update database.',
                    },
                    {
                      name: 'BNI (KUR Mikro)',
                      plafon: 'Rp 100 jt',
                      bunga: '6% per tahun',
                      skor: isSimulated ? 87 : 70,
                      status: isSimulated ? 'Siap Diajukan' : 'Siap Bersyarat',
                      statusColor: isSimulated ? 'bg-[#EAF3DE] text-[#1D9E75]' : 'bg-[#E6F1FB] text-[#2563eb]',
                      catatan: 'Memerlukan surat keterangan usaha yang sah, toleransi Kol 2 paylater kecil jika melampirkan bukti lunas.',
                    },
                    {
                      name: 'BCA (KUR Mikro)',
                      plafon: 'Rp 100 jt',
                      bunga: '6% per tahun',
                      skor: isSimulated ? 82 : 55,
                      status: isSimulated ? 'Siap Diajukan' : 'Berisiko Tinggi',
                      statusColor: isSimulated ? 'bg-[#EAF3DE] text-[#1D9E75]' : 'bg-[#FCEBEB] text-[#E24B4A]',
                      catatan: 'Kebijakan penjaminan sangat ketat, mewajibkan agunan tambahan di beberapa kondisi tertentu, wajib Kol 1 mutlak.',
                    },
                  ].map((bank, index) => (
                    <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors text-sm text-slate-700">
                      <td className="p-4 font-bold text-slate-800">{bank.name}</td>
                      <td className="p-4 font-medium">{bank.plafon}</td>
                      <td className="p-4 font-medium">{bank.bunga}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${bank.skor >= 80 ? 'bg-[#1D9E75]' : bank.skor >= 65 ? 'bg-[#EF9F27]' : 'bg-[#E24B4A]'}`}
                              style={{ width: `${bank.skor}%` }}
                            />
                          </div>
                          <span className="font-bold">{bank.skor}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${bank.statusColor}`}>
                          {bank.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-500 leading-relaxed max-w-xs">{bank.catatan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/50 flex items-start gap-3">
              <Info className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-slate-500 leading-relaxed">
                <span className="font-bold text-slate-700">Tip Credit Specialist:</span> Jika nasabah mendesak butuh pengajuan, 
                <span className="font-semibold text-slate-700"> Bank Mandiri </span> lebih direkomendasikan karena menerima bukti pelunasan fisik (Surat Keterangan Lunas) dari leasing/paylater tanpa menunggu database SLIK OJK ter-update secara otomatis di akhir bulan.
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Riwayat Penilaian */}
        {activeTab === 'riwayat' && (
          <motion.div
            key="riwayat-penilaian"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-xl p-6 border border-slate-200/60 shadow-sm"
          >
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Riwayat Penilaian Kesiapan Kredit</h3>
                <p className="text-xs text-slate-400 mt-0.5">Daftar nasabah yang dievaluasi kesiapannya sebelum mendaftar ke bank</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Cari riwayat..."
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-navy-400 bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'KWL-RDY-0932',
                  date: 'Hari ini, 14:20',
                  name: 'Ibu Sari — Warung Nasi Padang',
                  bank: 'BRI',
                  amount: 'Rp 50 Juta',
                  score: isSimulated ? 88 : 68,
                  status: isSimulated ? 'Siap Diajukan' : 'Perlu Perbaikan',
                  statusColor: isSimulated ? 'bg-[#EAF3DE] text-[#1D9E75]' : 'bg-[#FAEEDA] text-[#EF9F27]',
                },
                {
                  id: 'KWL-RDY-0891',
                  date: '2 hari lalu',
                  name: 'Pak Ahmad — Toko Kelontong Makmur',
                  bank: 'Mandiri',
                  amount: 'Rp 75 Juta',
                  score: 82,
                  status: 'Siap Diajukan',
                  statusColor: 'bg-[#EAF3DE] text-[#1D9E75]',
                },
                {
                  id: 'KWL-RDY-0873',
                  date: '5 hari lalu',
                  name: 'Ibu Dewi — Laundry Fresh Clean',
                  bank: 'BNI',
                  amount: 'Rp 25 Juta',
                  score: 90,
                  status: 'Siap Diajukan',
                  statusColor: 'bg-[#EAF3DE] text-[#1D9E75]',
                },
                {
                  id: 'KWL-RDY-0841',
                  date: '1 minggu lalu',
                  name: 'Pak Budi — Bengkel Motor Jaya',
                  bank: 'BRI',
                  amount: 'Rp 100 Juta',
                  score: 45,
                  status: 'Berisiko Tinggi',
                  statusColor: 'bg-[#FCEBEB] text-[#E24B4A]',
                },
                {
                  id: 'KWL-RDY-0820',
                  date: '2 minggu lalu',
                  name: 'Ibu Rina — Salon Kecantikan Ayu',
                  bank: 'Mandiri',
                  amount: 'Rp 35 Juta',
                  score: 75,
                  status: 'Siap Bersyarat',
                  statusColor: 'bg-[#E6F1FB] text-[#2563eb]',
                },
              ].map((hist, index) => (
                <div 
                  key={index}
                  className="p-4 border border-slate-100 rounded-lg hover:border-slate-200 hover:bg-slate-50/50 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-mono text-xs font-semibold">
                      {hist.bank}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-800">{hist.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">{hist.id}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Pengajuan: <span className="font-semibold text-slate-700">{hist.amount}</span> · {hist.date}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-slate-800">{hist.score}/100</p>
                      <p className="text-[10px] text-slate-400">Skor AI</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${hist.statusColor} min-w-[90px] text-center`}>
                      {hist.status}
                    </span>

                    <button 
                      onClick={() => {
                        if (hist.id === 'KWL-RDY-0932') {
                          setActiveTab('hasil')
                        } else {
                          alert(`Membuka audit kesiapan untuk ${hist.name}`)
                        }
                      }}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
