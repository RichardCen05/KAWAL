import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  FileText,
  Zap,
  Play,
  CheckCircle2,
  Bot,
  Swords,
  ShieldCheck,
  Scale,
  Gavel,
  Loader2,
  Sparkles,
  User,
  AlertCircle,
  ChevronRight,
} from 'lucide-react'

const AGENTS = [
  {
    id: 'parser',
    name: 'Parser Agent',
    icon: Bot,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10',
    borderColor: 'border-cyan-500/30',
  },
  {
    id: 'attacker',
    name: 'Circumstance Attacker',
    icon: Swords,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    borderColor: 'border-emerald-500/30',
  },
  {
    id: 'defender',
    name: 'Denial Defender',
    icon: ShieldCheck,
    color: 'text-rose-400',
    bgColor: 'bg-rose-400/10',
    borderColor: 'border-rose-500/30',
  },
  {
    id: 'legal',
    name: 'Regulatory Legal',
    icon: Scale,
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    borderColor: 'border-amber-500/30',
  },
  {
    id: 'judge',
    name: 'Judge — Final Verdict',
    icon: Gavel,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-500/30',
  },
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
      `💰 Dengan pendapatan Rp ${(data.avgQRIS / 1000000).toFixed(1)} jt/bulan, nasabah memiliki kapasitas bayar cicilan KUR Rp ${(data.nominalKUR * 0.015 / 1000000).toFixed(1)} jt/bulan (Debt Service Ratio: ${((data.nominalKUR * 0.015 / data.avgQRIS) * 100).toFixed(1)}%)`,
      `⚠️ Tunggakan SLIK hanya Rp215.000 pada produk Paylater — BUKAN pinjaman produktif. Ini TIDAK mencerminkan kapasitas kredit UMKM yang sebenarnya.`,
      `🎯 ARGUMEN: Penolakan berdasarkan Kol 5 dari Paylater consumer Rp215rb adalah TIDAK PROPORSIONAL terhadap profil bisnis dengan omzet Rp148.8jt/tahun.`,
    ],
    delay: 800,
  },
  {
    agentId: 'defender',
    messages: [
      `🛡️ Mewakili posisi Bank BRI...`,
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
      `⚖️ TEMUAN: Bank BRI TIDAK melakukan analisis cash flow QRIS sebagaimana diwajibkan oleh regulasi. Ini adalah pelanggaran prosedural.`,
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
      `\n🏆 VERDICT: ██ BANDING ██\nKonfidensI: 94.2%\nRekomendasi: Ajukan Surat Sanggahan ke Bank BRI\ndengan lampiran bukti QRIS dan kutipan POJK 6/2022.`,
    ],
    delay: 1000,
  },
]

export default function AnalysisLab({ dummyData, onComplete }) {
  const [formData, setFormData] = useState({
    namaUMKM: '',
    nominalKUR: '',
    slikStatus: '',
    slikDetail: '',
    avgQRIS: '',
  })
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [debateLog, setDebateLog] = useState([])
  const [activeAgent, setActiveAgent] = useState(null)
  const [typingText, setTypingText] = useState('')
  const logEndRef = useRef(null)

  const scrollToBottom = () => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [debateLog, typingText])

  const fillDummyData = () => {
    setFormData({
      namaUMKM: dummyData.namaUMKM,
      nominalKUR: dummyData.nominalKUR.toString(),
      slikStatus: dummyData.slikStatus,
      slikDetail: dummyData.slikDetail,
      avgQRIS: dummyData.avgQRIS.toString(),
    })
    setUploadedFiles([
      { name: 'SLIK_IbuSari_2026.pdf', type: 'SLIK', status: 'parsed' },
      { name: 'QRIS_Summary_6Bulan.pdf', type: 'QRIS', status: 'parsed' },
      { name: 'Surat_Penolakan_BRI.pdf', type: 'Penolakan', status: 'parsed' },
    ])
  }

  const typeMessage = (msg) => {
    return new Promise((resolve) => {
      let index = 0
      setTypingText('')
      const interval = setInterval(() => {
        if (index <= msg.length) {
          setTypingText(msg.substring(0, index))
          index++
        } else {
          clearInterval(interval)
          setTypingText('')
          resolve()
        }
      }, 15)
    })
  }

  const startAnalysis = async () => {
    if (!formData.namaUMKM) return
    setIsAnalyzing(true)
    setDebateLog([])
    setAnalysisComplete(false)

    const data = {
      ...formData,
      nominalKUR: parseInt(formData.nominalKUR) || 0,
      avgQRIS: parseInt(formData.avgQRIS) || 0,
    }
    const messages = generateDebateMessages(data)

    for (const agentBlock of messages) {
      const agent = AGENTS.find((a) => a.id === agentBlock.agentId)
      setActiveAgent(agent)

      for (const msg of agentBlock.messages) {
        await typeMessage(msg)
        setDebateLog((prev) => [
          ...prev,
          {
            agentId: agentBlock.agentId,
            agent,
            text: msg,
            timestamp: new Date().toLocaleTimeString('id-ID'),
          },
        ])
        await new Promise((r) => setTimeout(r, agentBlock.delay))
      }
    }

    setActiveAgent(null)
    setIsAnalyzing(false)
    setAnalysisComplete(true)
  }

  const handleComplete = () => {
    onComplete({
      status: 'banding',
      confidence: 94.2,
      formData: {
        ...formData,
        nominalKUR: parseInt(formData.nominalKUR) || 0,
        avgQRIS: parseInt(formData.avgQRIS) || 0,
      },
      debateLog,
    })
  }

  return (
    <motion.div
      className="h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy-900">Analysis Lab</h2>
            <p className="text-sm text-slate-500">Adversarial AI Engine — Analisis Multi-Agen</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              Analisis Berjalan...
            </motion.div>
          )}
          {analysisComplete && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleComplete}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-emerald-500/25 cursor-pointer"
            >
              Lihat Verdict
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel — Input */}
        <div className="w-[440px] border-r border-slate-200 bg-white overflow-y-auto flex-shrink-0">
          <div className="p-6">
            {/* Dummy data button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fillDummyData}
              className="w-full flex items-center justify-center gap-2 mb-6 px-4 py-3 rounded-xl bg-gradient-to-r from-navy-50 to-blue-50 border border-navy-200 text-navy-700 font-semibold text-sm hover:border-navy-400 transition-colors cursor-pointer"
            >
              <User className="w-4 h-4" />
              Gunakan Data Dummy (Ibu Sari)
            </motion.button>

            {/* Drop zone */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Unggah Dokumen</label>
              <div className="drop-zone rounded-2xl p-6 text-center cursor-pointer hover:bg-navy-50/50 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600 font-medium">
                  Drag & Drop PDF di sini
                </p>
                <p className="text-xs text-slate-400 mt-1">SLIK, QRIS, Mutasi, Surat Penolakan</p>
              </div>

              {/* Uploaded files */}
              <AnimatePresence>
                {uploadedFiles.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-3 space-y-2"
                  >
                    {uploadedFiles.map((file, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200"
                      >
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                          <p className="text-xs text-emerald-600">{file.type} — Parsed ✓</p>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama UMKM</label>
                <input
                  type="text"
                  value={formData.namaUMKM}
                  onChange={(e) => setFormData({ ...formData, namaUMKM: e.target.value })}
                  placeholder="Contoh: Warung Ibu Sari"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-100 transition-all bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nominal KUR (Rp)</label>
                <input
                  type="number"
                  value={formData.nominalKUR}
                  onChange={(e) => setFormData({ ...formData, nominalKUR: e.target.value })}
                  placeholder="50000000"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-100 transition-all bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status SLIK</label>
                <select
                  value={formData.slikStatus}
                  onChange={(e) => setFormData({ ...formData, slikStatus: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-100 transition-all bg-slate-50 focus:bg-white"
                >
                  <option value="">Pilih Status SLIK</option>
                  <option value="Kol 1 (Lancar)">Kol 1 — Lancar</option>
                  <option value="Kol 2 (Dalam Perhatian Khusus)">Kol 2 — Dalam Perhatian Khusus</option>
                  <option value="Kol 3 (Kurang Lancar)">Kol 3 — Kurang Lancar</option>
                  <option value="Kol 4 (Diragukan)">Kol 4 — Diragukan</option>
                  <option value="Kol 5 (Macet)">Kol 5 — Macet</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Detail SLIK</label>
                <textarea
                  value={formData.slikDetail}
                  onChange={(e) => setFormData({ ...formData, slikDetail: e.target.value })}
                  placeholder="Detail tunggakan atau catatan di SLIK..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-100 transition-all bg-slate-50 focus:bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Rata-Rata Omzet QRIS/bulan (Rp)</label>
                <input
                  type="number"
                  value={formData.avgQRIS}
                  onChange={(e) => setFormData({ ...formData, avgQRIS: e.target.value })}
                  placeholder="12400000"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-100 transition-all bg-slate-50 focus:bg-white"
                />
              </div>

              {/* Start Analysis Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={startAnalysis}
                disabled={isAnalyzing || !formData.namaUMKM}
                id="btn-start-analysis"
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                  isAnalyzing || !formData.namaUMKM
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-navy-600 to-navy-800 text-white shadow-lg shadow-navy-600/30 pulse-glow'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sedang Menganalisis...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Mulai Analisis AI
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Right Panel — The War Room */}
        <div className="flex-1 bg-terminal-bg flex flex-col overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-terminal-border bg-[#0d1117]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-xs text-terminal-dim font-mono font-semibold tracking-wider">
                ⚔️ AI ADVERSARIAL DEBATE — WAR ROOM
              </span>
            </div>
            <div className="flex items-center gap-2">
              {AGENTS.map((agent) => {
                const Icon = agent.icon
                const isActive = activeAgent?.id === agent.id
                return (
                  <motion.div
                    key={agent.id}
                    animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ repeat: isActive ? Infinity : 0, duration: 1 }}
                    className={`w-6 h-6 rounded-md flex items-center justify-center ${
                      isActive ? agent.bgColor : 'bg-white/5'
                    }`}
                    title={agent.name}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? agent.color : 'text-terminal-dim'}`} />
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Terminal body */}
          <div className="flex-1 overflow-y-auto terminal-scroll p-5 space-y-1 font-mono text-sm">
            {debateLog.length === 0 && !isAnalyzing && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                  <Sparkles className="w-9 h-9 text-terminal-dim" />
                </div>
                <p className="text-terminal-dim font-semibold text-base mb-2">
                  War Room Siap
                </p>
                <p className="text-terminal-dim/60 text-xs max-w-xs">
                  Isi form di panel kiri dan klik "Mulai Analisis AI" untuk memulai perdebatan multi-agen.
                </p>
              </div>
            )}

            {debateLog.map((entry, i) => {
              const Icon = entry.agent.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group"
                >
                  <div className="flex items-start gap-3 py-1.5">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${entry.agent.bgColor}`}>
                      <Icon className={`w-3.5 h-3.5 ${entry.agent.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-xs font-bold ${entry.agent.color}`}>
                          {entry.agent.name}
                        </span>
                        <span className="text-[10px] text-terminal-dim">
                          {entry.timestamp}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[13px] leading-relaxed whitespace-pre-wrap">
                        {entry.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {/* Typing indicator */}
            {isAnalyzing && activeAgent && typingText && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-3 py-1.5"
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${activeAgent.bgColor}`}>
                  <activeAgent.icon className={`w-3.5 h-3.5 ${activeAgent.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs font-bold ${activeAgent.color}`}>
                      {activeAgent.name}
                    </span>
                    <div className="flex gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-terminal-text animate-pulse" />
                      <span className="w-1 h-1 rounded-full bg-terminal-text animate-pulse [animation-delay:0.15s]" />
                      <span className="w-1 h-1 rounded-full bg-terminal-text animate-pulse [animation-delay:0.3s]" />
                    </div>
                  </div>
                  <p className="text-slate-300 text-[13px] leading-relaxed">
                    {typingText}
                    <span className="inline-block w-2 h-4 bg-terminal-text ml-0.5 cursor-blink" />
                  </p>
                </div>
              </motion.div>
            )}

            {/* Analysis complete */}
            {analysisComplete && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold text-sm">ANALISIS SELESAI</span>
                </div>
                <p className="text-slate-400 text-xs">
                  Semua agen telah menyelesaikan debat. Klik tombol "Lihat Verdict" untuk melihat hasil akhir.
                </p>
              </motion.div>
            )}

            <div ref={logEndRef} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
