import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Zap,
  CheckCircle2,
  Swords,
  ShieldCheck,
  Scale,
  Gavel,
  Loader2,
  User,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Microscope,
  BookOpen,
  Shield,
  Play,
  Bot,
  Sparkles,
  MessageCircle,
  Bell,
  Send,
  Edit3,
  Clock,
  AlertCircle,
} from 'lucide-react'
import SlikGapDetector from '../components/SlikGapDetector'

/* ─────────────────────────────────────────────────────────────
   AGENT DEFINITIONS  (debate engine — unchanged)
   ───────────────────────────────────────────────────────────── */
const AGENTS = [
  { id: 'parser',   name: 'Parser Agent',         icon: Bot,        color: 'text-cyan-400',    bgColor: 'bg-cyan-400/10',    borderColor: 'border-cyan-500/30' },
  { id: 'attacker', name: 'Circumstance Attacker', icon: Swords,     color: 'text-emerald-400', bgColor: 'bg-emerald-400/10', borderColor: 'border-emerald-500/30' },
  { id: 'defender', name: 'Denial Defender',       icon: ShieldCheck,color: 'text-rose-400',    bgColor: 'bg-rose-400/10',    borderColor: 'border-rose-500/30' },
  { id: 'legal',    name: 'Regulatory Legal',      icon: Scale,      color: 'text-amber-400',   bgColor: 'bg-amber-400/10',   borderColor: 'border-amber-500/30' },
  { id: 'judge',    name: 'Judge — Final Verdict', icon: Gavel,      color: 'text-purple-400',  bgColor: 'bg-purple-400/10',  borderColor: 'border-purple-500/30' },
]

const generateDebateMessages = (data) => [
  {
    agentId: 'parser',
    messages: [
      `🔍 Memulai ekstraksi dokumen...`,
      `📄 SLIK Report terdeteksi — Status: ${data.slikStatus}`,
      `📊 QRIS Transaction Summary — Rata-rata: Rp ${(data.avgQRIS / 1000000).toFixed(1)} juta/bulan`,
      `✅ Parsing selesai. 3 dokumen berhasil diekstrak dan divalidasi.`,
    ],
    delay: 600,
  },
  {
    agentId: 'attacker',
    messages: [
      `⚔️ Menganalisis profil pendapatan nasabah...`,
      `📈 FAKTA: QRIS income ${data.namaUMKM} stabil di Rp ${(data.avgQRIS / 1000000).toFixed(1)} jt/bulan selama 6 bulan terakhir dengan tren NAIK (+10.7%)`,
      `💰 Dengan pendapatan Rp ${(data.avgQRIS / 1000000).toFixed(1)} jt/bulan, nasabah memiliki kapasitas bayar cicilan KUR Rp ${(data.nominalKUR * 0.015 / 1000000).toFixed(1)} jt/bulan (DSR: ${((data.nominalKUR * 0.015 / data.avgQRIS) * 100).toFixed(1)}%)`,
      `⚠️ Tunggakan SLIK hanya Rp215.000 pada produk Paylater — BUKAN pinjaman produktif. Ini TIDAK mencerminkan kapasitas kredit UMKM yang sebenarnya.`,
      `🎯 ARGUMEN: Penolakan berdasarkan Kol 5 dari Paylater consumer Rp215rb adalah TIDAK PROPORSIONAL terhadap profil bisnis dengan omzet Rp148.8jt/tahun.`,
    ],
    delay: 800,
  },
  {
    agentId: 'defender',
    messages: [
      `🛡️ Mewakili posisi Bank ${data.namaUMKM?.includes('BRI') ? 'BRI' : 'Bank'}...`,
      `⚖️ Fakta: Nasabah tercatat Kol 5 (Macet) di SLIK OJK. Berdasarkan SOP Bank, status ini adalah ground for automatic rejection.`,
      `📋 Berdasarkan POJK Nomor 40/POJK.03/2019 tentang Penilaian Kualitas Aset, Kol 5 mengindikasikan kredit macet dengan tunggakan >180 hari.`,
      `❌ CONCESSION: Namun, saya TIDAK DAPAT membantah bahwa tunggakan Rp215.000 pada Paylater consumer adalah de minimis dan tidak relevan terhadap kapasitas kredit UMKM.`,
      `🏳️ Defender mengakui kelemahan argumen penolakan. Bukti Attacker valid.`,
    ],
    delay: 900,
  },
  {
    agentId: 'legal',
    messages: [
      `📚 Menganalisis landasan hukum...`,
      `📖 POJK No. 6/POJK.03/2022 Pasal 12 ayat (3): "Penilaian kredit harus mempertimbangkan kapasitas bayar terkini nasabah, tidak semata-mata berdasarkan data historis."`,
      `📖 Permenko KUR No. 1/2023 Pasal 8: "Bank pelaksana wajib melakukan analisis 5C secara komprehensif termasuk cash flow usaha."`,
      `⚖️ TEMUAN: Bank tidak melakukan analisis cash flow QRIS sebagaimana diwajibkan oleh regulasi. Ini adalah pelanggaran prosedural.`,
      `✅ Dasar hukum untuk banding: KUAT. Nasabah berhak mengajukan sanggahan berdasarkan POJK No. 6/2022 dan data cash flow QRIS.`,
    ],
    delay: 700,
  },
  {
    agentId: 'judge',
    messages: [
      `🔨 Menimbang seluruh argumen...`,
      `\n═══════════════════════════════════════\n   📋 RINGKASAN PUTUSAN AI TRIBUNAL\n═══════════════════════════════════════\n`,
      `Attacker vs Defender: ATTACKER MENANG\n• Defender melakukan CONCESSION pada poin de minimis.\n• Bukti QRIS income valid dan tidak terbantahkan.`,
      `Landasan Hukum: MENDUKUNG BANDING\n• 2 pasal regulasi mendukung posisi nasabah.\n• Bank melanggar kewajiban analisis cash flow.`,
      `\n🏆 VERDICT: ██ BANDING ██\nKonfidensI: 84.2%\nRekomendasi: Ajukan Surat Sanggahan ke Bank BRI\ndengan lampiran bukti QRIS dan kutipan POJK 6/2022.`,
    ],
    delay: 1000,
  },
]

/* ─────────────────────────────────────────────────────────────
   STATIC DATA
   ───────────────────────────────────────────────────────────── */
const WAR_AGENTS = [
  { id: 'auditor', label: 'Agen Auditor',      desc: 'Mencari bukti meringankan',      icon: Microscope, iconBg: '#F0FDF4', iconColor: '#22C55E' },
  { id: 'regulasi',label: 'Agen Regulasi',     desc: 'Menelusuri POJK & KUR',          icon: BookOpen,   iconBg: '#EFF6FF', iconColor: '#3B82F6' },
  { id: 'pembela', label: 'Agen Pembela Bank', desc: 'Mempertahankan keputusan bank',  icon: Shield,     iconBg: '#FFFBEB', iconColor: '#F59E0B' },
  { id: 'hakim',   label: 'Agen Hakim',        desc: 'Mensintesis & memutuskan',       icon: Gavel,      iconBg: '#F5F3FF', iconColor: '#8B5CF6' },
]

const FULL_LOG = [
  { time: '09:42:01', agent: 'Auditor',      color: '#22C55E', dotClass: 'bg-emerald-500',
    text: 'Omzet QRIS nasabah stabil Rp 12,4 jt/bulan selama 6 bulan berturut. Kemampuan bayar aktual jauh melampaui cicilan KUR yang diminta sebesar Rp 1,1 jt/bulan.' },
  { time: '09:42:03', agent: 'Regulasi',     color: '#3B82F6', dotClass: 'bg-blue-500',
    text: 'POJK 22/2023 Pasal 41 mewajibkan bank melakukan analisis cash flow komprehensif. Penolakan hanya berbasis SLIK tanpa mempertimbangkan omzet QRIS berpotensi cacat prosedur.' },
  { time: '09:42:07', agent: 'Pembela Bank', color: '#F59E0B', dotClass: 'bg-amber-500',
    text: 'Kolektibilitas 5 di SLIK adalah fakta tercatat resmi OJK. Bank berhak menolak berdasarkan profil risiko yang ditetapkan regulasi internal perbankan.' },
  { time: '09:42:09', agent: 'Auditor',      color: '#22C55E', dotClass: 'bg-emerald-500',
    text: 'Tunggakan Rp 215.000 bersumber dari Paylater konsumtif, bukan dari rekening usaha. Pelunasan sudah dilakukan 12 Maret 2025. Lag update OJK 19 hari — kondisi real sudah bersih.' },
  { time: '09:42:12', agent: 'Regulasi',     color: '#3B82F6', dotClass: 'bg-blue-500',
    text: 'Surat penolakan hanya mencantumkan "profil tidak sesuai" tanpa spesifikasi — tidak memenuhi standar transparansi minimal POJK 22/2023. Celah prosedural sangat kuat.' },
  { time: '09:42:15', agent: 'Pembela Bank', color: '#F59E0B', dotClass: 'bg-amber-500',
    text: 'Risiko eskalasi: jika banding ditolak, riwayat pengajuan berulang dapat memperburuk profil nasabah di sistem perbankan.' },
  { time: '09:42:17', agent: 'Auditor',      color: '#22C55E', dotClass: 'bg-emerald-500',
    text: 'Counter: POJK menjamin hak nasabah untuk mengajukan keberatan tanpa penalti pada profil kredit selama menggunakan jalur resmi LAPS SJK.' },
  { time: '09:42:21', agent: 'Hakim',        color: '#8B5CF6', dotClass: 'bg-violet-500',
    text: 'Mensintesis semua argumen. Bobot mendukung: 3 argumen confidence 88% rata-rata. Bobot menentang: 1 argumen confidence 61%. Vonis: BANDING dengan syarat dokumen pelunasan. Confidence total: 84,2%.' },
]

const RINGKASAN_POIN = [
  {
    type: 'pro',
    pillLabel: '✅ Mendukung Banding',
    pillBg: '#F0FDF4', pillColor: '#16a34a', pillBorder: '#bbf7d0',
    title: 'Celah prosedural bank — analisis cash flow tidak dilakukan',
    desc: 'Bank menolak hanya berdasarkan kolektibilitas SLIK tanpa melakukan analisis arus kas sebagaimana diwajibkan POJK 22/2023 Pasal 41. Omzet QRIS Rp 12,4 jt/bulan selama 6 bulan tidak pernah dipertimbangkan dalam keputusan penolakan.',
    tags: [
      { label: 'POJK 22/2023 Pasal 41', bg: '#EFF6FF', color: '#3B82F6' },
      { label: 'Data QRIS 6 bulan',      bg: '#F0FDF4', color: '#16a34a' },
    ],
  },
  {
    type: 'con',
    pillLabel: '⚠️ Menentang Banding',
    pillBg: '#FFFBEB', pillColor: '#b45309', pillBorder: '#fde68a',
    title: 'Kolektibilitas SLIK Kol.5 adalah fakta resmi OJK',
    desc: 'Bank memiliki dasar hukum untuk menolak berdasarkan profil kolektibilitas. Risiko: jika banding ditolak, nasabah perlu menunggu minimal 6 bulan sebelum bisa mengajukan ulang.',
    tags: [
      { label: 'Risiko penolakan ulang', bg: '#FFFBEB', color: '#b45309' },
      { label: 'Perlu klarifikasi lunas', bg: '#F8FAFC', color: '#64748b' },
    ],
  },
  {
    type: 'verdict',
    pillLabel: '⚖️ Kesimpulan Hakim',
    pillBg: '#F5F3FF', pillColor: '#7c3aed', pillBorder: '#ddd6fe',
    title: 'Banding direkomendasikan dengan syarat dokumen lunas disiapkan',
    desc: 'Bobot argumen mendukung (3 argumen, confidence rata-rata 88%) lebih kuat dari argumen menentang (1 argumen, confidence 61%). Banding memiliki peluang berhasil dengan syarat: sertakan bukti pelunasan Paylater dan laporan QRIS 6 bulan dalam berkas pengajuan.',
    tags: [
      { label: 'Confidence 84,2%', bg: '#F0FDF4', color: '#16a34a' },
      { label: 'Vonis: BANDING',   bg: '#F5F3FF', color: '#7c3aed' },
    ],
  },
]

const CONFIDENCE_DONE = [
  { label: 'Banding',  pct: 84, color: '#22C55E' },
  { label: 'Recovery', pct: 11, color: '#F59E0B' },
  { label: 'Redirect', pct: 5,  color: '#9CA3AF' },
]
const CONFIDENCE_LIVE = [
  { label: 'Banding',  pct: 64, color: '#22C55E' },
  { label: 'Recovery', pct: 22, color: '#F59E0B' },
  { label: 'Redirect', pct: 14, color: '#9CA3AF' },
]

/* ─────────────────────────────────────────────────────────────
   PIPELINE STAGES
   ───────────────────────────────────────────────────────────── */
const getStages = (done) => [
  { label: 'Ekstraksi',     done: true,  active: false },
  { label: 'Debat AI',      done,        active: false },
  { label: 'Vonis',         done,        active: false },
  { label: 'Draft Dokumen', done: false, active: done  },
]

/* ─────────────────────────────────────────────────────────────
   WHATSAPP MESSAGE TEMPLATE
   ───────────────────────────────────────────────────────────── */
const buildWAMessage = (nama, bank, plafon) => {
  const nominalStr = plafon ? `Rp ${Number(plafon).toLocaleString('id-ID')}` : 'Rp 50.000.000'
  return `Halo ${nama || 'Ibu/Bapak'}, berikut dokumen yang perlu disiapkan untuk pengajuan KUR ${bank} ${nominalStr}:

DOKUMEN WAJIB:
☐ 1. Cetakan SLIK/iDeb OJK
   → Cara dapat: Kunjungi ojk.go.id/konsumen atau kantor OJK terdekat. Gratis, selesai 1 hari.

☐ 2. Mutasi Rekening 3 Bulan Terakhir
   → Cara dapat: Download di ${bank === 'BRI' ? 'BRImo' : bank === 'BNI' ? 'BNIMobile' : bank === 'Mandiri' ? 'Livin by Mandiri' : bank === 'BSI' ? 'BSI Mobile' : 'aplikasi mobile banking'} (menu Rekening → Mutasi → Export PDF) atau minta di teller ${bank}.

☐ 3. Rekap Transaksi QRIS (jika ada)
   → Cara dapat: Screenshot ringkasan dari aplikasi GoPay/OVO/Dana menu Laporan Transaksi, pilih 6 bulan terakhir.

☐ 4. Surat Penolakan dari Bank
   → Dokumen yang sudah Anda terima dari ${bank}. Bawa dokumen asli atau foto yang jelas.

DOKUMEN PENDUKUNG:
☐ 5. KTP (foto/scan jelas)
☐ 6. KK (foto/scan jelas)
☐ 7. Foto usaha (tampak depan + dalam)

Hubungi kami jika ada pertanyaan.
Tim KAWAL — cs@kawal.id`
}

/* ─────────────────────────────────────────────────────────────
   DOCUMENT STATUS DATA
   ───────────────────────────────────────────────────────────── */
const DOC_STATUS_LOADED = [
  {
    name: 'SLIK/iDeb OJK', status: 'received',
    detail: 'Diproses dalam 2,3 dtk · 847 data poin',
    iconBg: '#F0FDF4', iconColor: '#22C55E',
  },
  {
    name: 'Mutasi Rekening BRI', status: 'received',
    detail: 'Diproses dalam 1,8 dtk · 3 bulan data',
    iconBg: '#F0FDF4', iconColor: '#22C55E',
  },
  {
    name: 'Rekap QRIS', status: 'pending',
    detail: 'Belum diterima — checklist sudah dikirim',
    iconBg: '#FFFBEB', iconColor: '#F59E0B',
  },
  {
    name: 'Surat Penolakan Bank', status: 'pending',
    detail: 'Belum diterima — ingatkan nasabah',
    iconBg: '#FFFBEB', iconColor: '#F59E0B',
  },
]

const DOC_STATUS_EMPTY = [
  { name: 'SLIK/iDeb OJK', status: 'empty', detail: 'Menunggu upload...' },
  { name: 'Mutasi Rekening', status: 'empty', detail: 'Menunggu upload...' },
  { name: 'Rekap QRIS', status: 'empty', detail: 'Menunggu upload...' },
  { name: 'Surat Penolakan', status: 'empty', detail: 'Menunggu upload...' },
]

const EXTRACTED = [
  { label: 'Omzet QRIS',     value: 'Rp 12.400.000/bulan', sub: '(6 bulan stabil)' },
  { label: 'Tunggakan SLIK', value: 'Rp 215.000 (Paylater)', sub: '— status Kol.2' },
  { label: 'DSR Saat Ini',   value: '6,2%', sub: 'dari pendapatan' },
]

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function AnalysisLab({ dummyData, onComplete }) {
  /* ── state ── */
  const [formData, setFormData] = useState({
    namaUMKM: '', nominalKUR: '', slikStatus: '', slikDetail: '', avgQRIS: '',
  })
  const [selectedBank,          setSelectedBank]          = useState('BRI')
  const [showChecklistPreview,  setShowChecklistPreview]  = useState(false)
  const [checklistSent,         setChecklistSent]         = useState(false)
  const [uploadedFiles,         setUploadedFiles]         = useState([])
  const [isAnalyzing,           setIsAnalyzing]           = useState(false)
  const [analysisComplete,      setAnalysisComplete]      = useState(false)
  const [debateLog,             setDebateLog]             = useState([])
  const [activeAgent,           setActiveAgent]           = useState(null)
  const [typingText,            setTypingText]            = useState('')
  const [warRoomStarted,        setWarRoomStarted]        = useState(false)
  const [showFullLog,           setShowFullLog]           = useState(false)
  const logEndRef = useRef(null)

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [debateLog, typingText])

  /* ── fill dummy ── */
  const fillDummyData = () => {
    setFormData({
      namaUMKM:   dummyData.namaUMKM,
      nominalKUR: dummyData.nominalKUR.toString(),
      slikStatus: dummyData.slikStatus,
      slikDetail: dummyData.slikDetail,
      avgQRIS:    dummyData.avgQRIS.toString(),
    })
    setUploadedFiles([
      { name: 'SLIK_IbuSari_2026.pdf',   type: 'SLIK',      status: 'parsed' },
      { name: 'QRIS_Summary_6Bulan.pdf', type: 'QRIS',      status: 'parsed' },
      { name: 'Surat_Penolakan_BRI.pdf', type: 'Penolakan', status: 'parsed' },
    ])
  }

  /* ── typing animation ── */
  const typeMessage = (msg) =>
    new Promise((resolve) => {
      let index = 0; setTypingText('')
      const interval = setInterval(() => {
        if (index <= msg.length) { setTypingText(msg.substring(0, index)); index++ }
        else { clearInterval(interval); setTypingText(''); resolve() }
      }, 15)
    })

  /* ── start analysis ── */
  const startAnalysis = async () => {
    if (!formData.namaUMKM) return
    setIsAnalyzing(true); setWarRoomStarted(true); setDebateLog([]); setAnalysisComplete(false)
    const data = { ...formData, nominalKUR: parseInt(formData.nominalKUR) || 0, avgQRIS: parseInt(formData.avgQRIS) || 0 }
    const messages = generateDebateMessages(data)
    for (const agentBlock of messages) {
      const agent = AGENTS.find((a) => a.id === agentBlock.agentId)
      setActiveAgent(agent)
      for (const msg of agentBlock.messages) {
        await typeMessage(msg)
        setDebateLog((prev) => [...prev, { agentId: agentBlock.agentId, agent, text: msg, timestamp: new Date().toLocaleTimeString('id-ID') }])
        await new Promise((r) => setTimeout(r, agentBlock.delay))
      }
    }
    setActiveAgent(null); setIsAnalyzing(false); setAnalysisComplete(true)
  }

  const handleComplete = () => {
    onComplete({
      status: 'banding', confidence: 84.2,
      formData: { ...formData, nominalKUR: parseInt(formData.nominalKUR) || 0, avgQRIS: parseInt(formData.avgQRIS) || 0 },
      debateLog,
    })
  }

  const handleSendChecklist = () => {
    setShowChecklistPreview(true)
    setChecklistSent(true)
  }

  const handleSendWhatsApp = () => {
    const msg = buildWAMessage(formData.namaUMKM, selectedBank, formData.nominalKUR)
    const encoded = encodeURIComponent(msg)
    window.open(`https://wa.me/?text=${encoded}`, '_blank')
  }

  const isLoaded   = uploadedFiles.length > 0
  const stages     = getStages(analysisComplete)
  const confData   = analysisComplete ? CONFIDENCE_DONE : CONFIDENCE_LIVE
  const docList    = isLoaded ? DOC_STATUS_LOADED : DOC_STATUS_EMPTY
  const receivedCount = isLoaded ? 2 : 0
  const allReceived   = receivedCount === 4

  const waMessage = buildWAMessage(
    formData.namaUMKM || 'Ibu Sari',
    selectedBank,
    formData.nominalKUR || '50000000'
  )

  return (
    <motion.div className="flex flex-col h-screen" style={{ backgroundColor: '#F4F6FA' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

      {/* ══ PAGE HEADER ════════════════════════════════════════════ */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between flex-shrink-0"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
            style={{ background: 'linear-gradient(135deg,#1B3A6B,#0f2040)' }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Analysis Lab</h2>
            <p className="text-xs text-slate-500">Adversarial AI Engine — Analisis Multi-Agen</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isAnalyzing && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
              style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', color: '#92400E' }}>
              <Loader2 className="w-4 h-4 animate-spin" /> Analisis Berjalan...
            </motion.div>
          )}
          {analysisComplete && (
            <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleComplete}
              className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg cursor-pointer"
              style={{ background: 'linear-gradient(135deg,#22C55E,#16a34a)' }}>
              Lanjut ke Surat Banding <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* ══ SPLIT BODY ═════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden p-5 gap-5">

        {/* ── LEFT PANEL 40% ─────────────────────────────────────── */}
        <div className="flex flex-col gap-4 overflow-y-auto" style={{ width: '40%', minWidth: 0 }}>

          {/* ── CARD 1: Input Kasus ──────────────────────────────── */}
          <div className="bg-white rounded-2xl p-5 flex-shrink-0"
            style={{ boxShadow: '0 1px 12px rgba(15,27,45,0.07)' }}>

            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">ANALYSIS LAB</p>
                <h3 className="text-base font-bold text-slate-900">Input Kasus</h3>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: '#F8FAFC', color: '#64748b', border: '1px solid #e2e8f0' }}>
                Kasus Baru
              </span>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={fillDummyData}
              className="w-full flex items-center justify-center gap-2 my-4 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
              style={{ backgroundColor: '#F0F4FF', border: '1px solid #c7d2fe', color: '#1B3A6B' }}>
              <User className="w-4 h-4" /> Gunakan Data Dummy (Ibu Sari)
            </motion.button>

            {/* 3 fields */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Nama Nasabah</label>
                <input type="text" value={formData.namaUMKM}
                  onChange={(e) => setFormData({ ...formData, namaUMKM: e.target.value })}
                  placeholder="Contoh: Ibu Sari"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Bank Tujuan KUR</label>
                <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all">
                  <option value="BRI">● BRI</option>
                  <option value="BNI">● BNI</option>
                  <option value="Mandiri">● Mandiri</option>
                  <option value="BSI">● BSI</option>
                  <option value="BPD">● Bank Daerah / BPD</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Plafon KUR</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">Rp</span>
                  <input type="number" value={formData.nominalKUR}
                    onChange={(e) => setFormData({ ...formData, nominalKUR: e.target.value })}
                    placeholder="50000000"
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
              </div>
            </div>
          </div>

          {/* ── CARD 2: WhatsApp Checklist ────────────────────────── */}
          <div className="bg-white rounded-2xl p-5 flex-shrink-0"
            style={{ boxShadow: '0 1px 12px rgba(15,27,45,0.07)', borderLeft: '3px solid #22C55E' }}>

            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#F0FDF4' }}>
                <MessageCircle style={{ width: 16, height: 16, color: '#22C55E' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900">Kirim Checklist Dokumen ke Nasabah</p>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Generate checklist spesifik KUR {selectedBank} dan kirim via WhatsApp sebelum nasabah datang
                </p>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleSendChecklist}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold cursor-pointer text-white"
              style={{ backgroundColor: '#22C55E' }}>
              📋 Generate & Kirim via WhatsApp
            </motion.button>

            <AnimatePresence>
              {showChecklistPreview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.28 }}
                  className="overflow-hidden mt-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                    Preview pesan WhatsApp
                  </p>
                  <div className="rounded-xl p-3 overflow-y-auto"
                    style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', maxHeight: 200 }}>
                    <pre className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-wrap font-sans">
                      {waMessage}
                    </pre>
                  </div>
                  <div className="flex items-center gap-2 mt-2.5">
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                      <Edit3 className="w-3 h-3" /> Edit Pesan
                    </button>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={handleSendWhatsApp}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white cursor-pointer"
                      style={{ backgroundColor: '#22C55E' }}>
                      <Send className="w-3 h-3" /> Kirim WhatsApp ↗
                    </motion.button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                    Checklist disesuaikan otomatis berdasarkan bank yang dipilih dan plafon pengajuan
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── SLIK Gap Detector ────────────────────────────────── */}
          <AnimatePresence>
            {isLoaded && <SlikGapDetector />}
          </AnimatePresence>

          {/* ── CARD 3: Status Dokumen ───────────────────────────── */}
          <div className="bg-white rounded-2xl p-5 flex-shrink-0"
            style={{ boxShadow: '0 1px 12px rgba(15,27,45,0.07)' }}>

            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-slate-900">Status Dokumen</p>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: isLoaded ? '#FFFBEB' : '#F8FAFC',
                  color: isLoaded ? '#b45309' : '#94a3b8',
                  border: `1px solid ${isLoaded ? '#fde68a' : '#e2e8f0'}`,
                }}>
                {isLoaded ? '2 dari 4 diterima' : '0 dari 4 diterima'}
              </span>
            </div>

            <div className="space-y-2">
              {docList.map((doc, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: doc.iconBg || '#F1F5F9' }}>
                      <FileText className="w-4 h-4" style={{ color: doc.iconColor || '#94a3b8' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{doc.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{doc.detail}</p>
                    </div>
                    {doc.status === 'received' && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: '#F0FDF4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                        ✓ Diterima
                      </span>
                    )}
                    {doc.status === 'pending' && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 flex items-center gap-1"
                        style={{ backgroundColor: '#FFFBEB', color: '#b45309', border: '1px solid #fde68a' }}>
                        <Clock className="w-2.5 h-2.5" /> Menunggu
                      </span>
                    )}
                    {doc.status === 'empty' && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: '#F8FAFC', color: '#94a3b8', border: '1px solid #e2e8f0' }}>
                        Pending
                      </span>
                    )}
                  </div>
                  {doc.status === 'pending' && (
                    <div className="mt-2 w-full rounded-full overflow-hidden"
                      style={{ height: 3, backgroundColor: '#FDE68A' }}>
                      <div className="h-full rounded-full" style={{ width: '0%', backgroundColor: '#F59E0B' }} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Summary + reminder */}
            <AnimatePresence>
              {isLoaded && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 rounded-xl flex items-center justify-between gap-2"
                  style={{ backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                  <p className="text-[11px] text-slate-500">
                    <span className="font-bold text-slate-700">2 dokumen</span> sudah diterima
                    &nbsp;·&nbsp;
                    <span className="font-bold text-amber-600">2 dokumen</span> menunggu nasabah
                  </p>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer flex-shrink-0 transition-colors hover:bg-blue-50"
                    style={{ color: '#1B3A6B', border: '1px solid #c7d2fe' }}>
                    <Bell className="w-3 h-3" /> Kirim Pengingat
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── CARD 4: Form Detail (hidden fields) + Start Button ── */}
          <div className="bg-white rounded-2xl p-5 flex-shrink-0"
            style={{ boxShadow: '0 1px 12px rgba(15,27,45,0.07)' }}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Detail Kasus Lanjutan</p>
            <div className="space-y-3">
              <select value={formData.slikStatus}
                onChange={(e) => setFormData({ ...formData, slikStatus: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all">
                <option value="">Pilih Status SLIK</option>
                <option>Kol 1 (Lancar)</option>
                <option>Kol 2 (Dalam Perhatian Khusus)</option>
                <option>Kol 3 (Kurang Lancar)</option>
                <option>Kol 4 (Diragukan)</option>
                <option>Kol 5 (Macet)</option>
              </select>
              <textarea value={formData.slikDetail}
                onChange={(e) => setFormData({ ...formData, slikDetail: e.target.value })}
                placeholder="Detail SLIK" rows={2}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none" />
              <input type="number" value={formData.avgQRIS}
                onChange={(e) => setFormData({ ...formData, avgQRIS: e.target.value })}
                placeholder="Rata-rata Omzet QRIS/bulan (Rp)"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>
          </div>

          {/* ── Main CTA button ───────────────────────────────────── */}
          <div className="flex-shrink-0 pb-2">
            {allReceived || formData.namaUMKM ? (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={startAnalysis} disabled={isAnalyzing || !formData.namaUMKM}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all cursor-pointer"
                style={isAnalyzing || !formData.namaUMKM
                  ? { backgroundColor: '#e2e8f0', color: '#94a3b8', cursor: 'not-allowed' }
                  : { backgroundColor: '#1B3A6B', color: '#fff', boxShadow: '0 4px 16px rgba(27,58,107,0.3)' }}>
                {isAnalyzing
                  ? <><Loader2 className="w-5 h-5 animate-spin" /> Sedang Menganalisis...</>
                  : <><Play className="w-5 h-5" /> Mulai Analisis AI →</>}
              </motion.button>
            ) : (
              <button disabled
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm cursor-not-allowed"
                style={{ backgroundColor: '#F1F5F9', color: '#94a3b8' }}>
                <AlertCircle className="w-4 h-4" />
                Menunggu 2 dokumen lagi...
              </button>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL 60% — War Room ──────────────────────────── */}
        <div className="flex flex-col gap-4 overflow-y-auto flex-1 min-w-0">
          <div className="bg-white rounded-2xl p-5 flex flex-col gap-5"
            style={{ boxShadow: '0 1px 12px rgba(15,27,45,0.07)' }}>

            {/* ── War Room header ──────────────────────────────────── */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-900">War Room — Debat AI Adversarial</span>
                  {analysisComplete ? (
                    <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: '#F8FAFC', color: '#64748b', border: '1px solid #e2e8f0' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
                      Selesai
                    </motion.span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: '#FEF2F2', color: '#dc2626', border: '1px solid #fecaca' }}>
                      <motion.span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"
                        animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
                      LIVE
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Panel pemantauan debat multi-agen secara real-time</p>
              </div>
            </div>

            {/* ── Stage pipeline bar ───────────────────────────────── */}
            <div className="flex items-center gap-0">
              {stages.map((stage, i) => (
                <div key={i} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    {stage.done ? (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#F0FDF4', border: '1.5px solid #22C55E' }}>
                        <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#22C55E' }} />
                      </div>
                    ) : stage.active ? (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#FFFBEB', border: '1.5px solid #F59E0B' }}>
                        <motion.div className="w-2 h-2 rounded-full bg-amber-500"
                          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                          transition={{ duration: 1.2, repeat: Infinity }} />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#F8FAFC', border: '1.5px solid #CBD5E1' }} />
                    )}
                    <span className={`text-[10px] font-semibold whitespace-nowrap ${
                      stage.done ? 'text-emerald-600' : stage.active ? 'text-amber-600 font-bold' : 'text-slate-400'
                    }`}>{stage.label}</span>
                  </div>
                  {i < stages.length - 1 && (
                    <div className="flex-1 h-px mx-2 mb-4" style={{
                      borderTop: stage.done ? '1.5px solid #22C55E' : stage.active ? '1.5px dashed #F59E0B' : '1.5px dashed #CBD5E1',
                    }} />
                  )}
                </div>
              ))}
            </div>

            {/* ── 2×2 agent cards ──────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-3">
              {WAR_AGENTS.map((ag, i) => {
                const Icon = ag.icon
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: ag.iconBg }}>
                      <Icon className="w-4 h-4" style={{ color: ag.iconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{ag.label}</p>
                      <p className="text-[10px] text-slate-400 truncate">{ag.desc}</p>
                    </div>
                    {analysisComplete ? (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: '#F8FAFC', color: '#64748b', border: '1px solid #e2e8f0' }}>
                        Selesai ✓
                      </span>
                    ) : isAnalyzing && (ag.id === 'auditor' || ag.id === 'regulasi') ? (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: '#F0FDF4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                        Aktif
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: '#F8FAFC', color: '#94a3b8', border: '1px solid #e2e8f0' }}>
                        Menunggu
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* ═══════════════════════════════════════════════════════
                RINGKASAN 3 POIN  (shown when complete)
                ═══════════════════════════════════════════════════════ */}
            <AnimatePresence>
              {analysisComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                  className="rounded-xl overflow-hidden"
                  style={{ backgroundColor: '#F8FAFC', borderLeft: '3px solid #8B5CF6' }}>

                  <div className="flex items-start gap-2.5 px-4 pt-4 pb-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: '#F5F3FF' }}>
                      <Gavel style={{ width: 14, height: 14, color: '#8B5CF6' }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Ringkasan Debat — Hakim AI</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">3 poin kunci dari 24 argumen yang diperdebatkan</p>
                    </div>
                  </div>

                  <div className="px-4 pb-4 space-y-0">
                    {RINGKASAN_POIN.map((poin, i) => (
                      <div key={i}>
                        {i > 0 && <div className="border-t border-slate-200 my-3" />}
                        <div>
                          <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full mb-2"
                            style={{ backgroundColor: poin.pillBg, color: poin.pillColor, border: `1px solid ${poin.pillBorder}` }}>
                            {poin.pillLabel}
                          </span>
                          <p className="text-xs font-bold text-slate-800 mb-1">{poin.title}</p>
                          <p className="text-[11px] text-slate-500 leading-relaxed mb-2">{poin.desc}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {poin.tags.map((tag, j) => (
                              <span key={j} className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: tag.bg, color: tag.color }}>
                                {tag.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action box */}
                  <div className="mx-4 mb-4 p-3 rounded-xl flex items-center gap-2.5"
                    style={{ backgroundColor: '#fff', border: '0.5px solid #e2e8f0' }}>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={handleComplete}
                      className="flex items-center gap-1.5 text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer flex-shrink-0"
                      style={{ backgroundColor: '#1B3A6B' }}>
                      Lanjut ke Draft Surat Banding <ChevronRight className="w-3.5 h-3.5" />
                    </motion.button>
                    <button onClick={() => setShowFullLog(v => !v)}
                      className="flex items-center gap-1.5 text-slate-500 border border-slate-200 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-50 transition-colors">
                      Lihat Log Lengkap (24 argumen)
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ═══════════════════════════════════════════════════════
                LOG SECTION
                ═══════════════════════════════════════════════════════ */}
            <div>
              {analysisComplete ? (
                <button onClick={() => setShowFullLog(v => !v)}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer mb-2">
                  {showFullLog
                    ? <><ChevronUp className="w-3.5 h-3.5" /> Sembunyikan Log Debat</>
                    : <><ChevronDown className="w-3.5 h-3.5" /> ▾ Lihat Log Debat Lengkap</>}
                </button>
              ) : (
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Log Debat</p>
              )}

              <AnimatePresence>
                {(!analysisComplete || showFullLog) && (
                  <motion.div
                    initial={analysisComplete ? { opacity: 0, height: 0 } : false}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden">
                    <div className="overflow-y-auto space-y-2.5 rounded-xl p-3"
                      style={{ maxHeight: 300, backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}>

                      {FULL_LOG.map((entry, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }} className="flex items-start gap-2.5">
                          <span className="text-[9px] font-mono text-slate-400 mt-0.5 flex-shrink-0 pt-px whitespace-nowrap">
                            [{entry.time}]
                          </span>
                          <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${entry.dotClass}`} />
                          <p className="text-[11px] leading-relaxed text-slate-600">
                            <span className="font-bold" style={{ color: entry.color }}>{entry.agent}</span>
                            {' '}— {entry.text}
                          </p>
                        </motion.div>
                      ))}

                      {debateLog.map((entry, i) => (
                        <motion.div key={`live-${i}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                          className="flex items-start gap-2.5">
                          <span className="text-[9px] font-mono text-slate-400 flex-shrink-0 pt-px">[{entry.timestamp}]</span>
                          <span className={`text-[10px] font-bold flex-shrink-0 ${entry.agent.color}`}>{entry.agent.name}</span>
                          <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-wrap">{entry.text}</p>
                        </motion.div>
                      ))}

                      {isAnalyzing && activeAgent && typingText && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2.5">
                          <span className={`text-[10px] font-bold flex-shrink-0 ${activeAgent.color}`}>{activeAgent.name}</span>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            {typingText}
                            <span className="inline-block w-1.5 h-3.5 bg-slate-400 ml-0.5 animate-pulse" />
                          </p>
                        </motion.div>
                      )}
                      <div ref={logEndRef} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Confidence meter ─────────────────────────────────── */}
            <div>
              <p className="text-xs text-slate-400 mb-3">
                {analysisComplete ? 'Confidence vonis final' : 'Confidence vonis sementara'}
              </p>
              <div className="space-y-2.5">
                {confData.map((c, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-600 w-16 flex-shrink-0">{c.label}</span>
                    <div className="flex-1 rounded-full overflow-hidden h-2" style={{ backgroundColor: '#F1F5F9' }}>
                      <motion.div
                        key={`${analysisComplete}-${c.label}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${c.pct}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: i * 0.15 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: c.color }}
                      />
                    </div>
                    <span className="text-xs font-bold w-8 text-right flex-shrink-0" style={{ color: c.color }}>
                      {c.pct}%
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 italic mt-3">
                {analysisComplete
                  ? 'Vonis final: BANDING — Confidence 84,2%'
                  : 'Agen Hakim sedang memproses — vonis final dalam ±15 detik'}
              </p>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  )
}
