import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Shield,
  AlertTriangle,
  ArrowLeftRight,
  CheckCircle2,
  FileText,
  Download,
  Printer,
  ArrowLeft,
  Edit3,
  ExternalLink,
  MapPin,
  Phone,
  Globe,
  Star,
  ChevronDown,
  Plus,
  Sparkles,
  Copy,
  CircleDot,
} from 'lucide-react'

const statusConfigs = {
  banding: {
    label: 'BANDING',
    sublabel: 'Penolakan Layak Disanggah',
    color: 'from-emerald-500 to-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    icon: Shield,
    dotColor: 'bg-emerald-500',
  },
  recovery: {
    label: 'RECOVERY',
    sublabel: 'Perlu Pemulihan Profil',
    color: 'from-amber-500 to-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    icon: AlertTriangle,
    dotColor: 'bg-amber-500',
  },
  redirect: {
    label: 'REDIRECT',
    sublabel: 'Alihkan ke Lender Alternatif',
    color: 'from-blue-500 to-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    icon: ArrowLeftRight,
    dotColor: 'bg-blue-500',
  },
}

const lenders = [
  {
    name: 'Amartha',
    type: 'P2P Lending',
    maxLoan: 'Rp 50 Juta',
    rate: '12-18%/tahun',
    rating: 4.5,
    desc: 'Platform P2P lending fokus pemberdayaan UMKM wanita di pedesaan.',
    color: 'from-teal-500 to-teal-700',
  },
  {
    name: 'Modalku',
    type: 'Micro Finance',
    maxLoan: 'Rp 2 Miliar',
    rate: '10-16%/tahun',
    rating: 4.7,
    desc: 'Solusi permodalan digital untuk UKM dengan proses cepat dan transparan.',
    color: 'from-blue-500 to-blue-700',
  },
  {
    name: 'KoinWorks',
    type: 'Multi Finance',
    maxLoan: 'Rp 2 Miliar',
    rate: '9-18%/tahun',
    rating: 4.4,
    desc: 'Super financial app dengan beragam produk pinjaman bisnis.',
    color: 'from-indigo-500 to-indigo-700',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}

export default function VerdictResult({ data, dummyData, onBack, onNewAudit }) {
  const verdictStatus = data?.status || 'banding'
  const [currentStatus, setCurrentStatus] = useState(verdictStatus)
  const config = statusConfigs[currentStatus]
  const StatusIcon = config.icon
  const confidence = data?.confidence || 94.2

  const formData = data?.formData || {
    namaUMKM: dummyData.namaUMKM,
    nominalKUR: dummyData.nominalKUR,
    avgQRIS: dummyData.avgQRIS,
    slikStatus: dummyData.slikStatus,
    slikDetail: dummyData.slikDetail,
  }

  const [suratBanding, setSuratBanding] = useState(
    `SURAT SANGGAHAN ATAS PENOLAKAN KREDIT USAHA RAKYAT

Kepada Yth.
Kepala Cabang Bank BRI
di Tempat

Perihal: Sanggahan atas Penolakan Permohonan KUR Mikro

Dengan hormat,

Yang bertanda tangan di bawah ini:
Nama    : ${formData.namaUMKM}
Usaha   : Warung Nasi Padang
Nominal : Rp ${(formData.nominalKUR / 1000000).toFixed(0)} Juta

Dengan ini mengajukan sanggahan atas penolakan permohonan KUR Mikro dengan alasan sebagai berikut:

1. DASAR HUKUM SANGGAHAN
   
   a. POJK No. 6/POJK.03/2022 Pasal 12 ayat (3): "Penilaian kredit harus mempertimbangkan kapasitas bayar terkini nasabah, tidak semata-mata berdasarkan data historis."
   
   b. Permenko KUR No. 1/2023 Pasal 8: "Bank pelaksana wajib melakukan analisis 5C secara komprehensif termasuk cash flow usaha."

2. FAKTA-FAKTA PENDUKUNG

   a. Status Kol 5 pada SLIK berasal dari Paylater consumer sebesar Rp215.000 yang telah LUNAS namun belum ter-update di sistem.
   
   b. Omzet QRIS tercatat stabil pada rata-rata Rp ${(formData.avgQRIS / 1000000).toFixed(1)} juta/bulan selama 6 bulan terakhir dengan tren pertumbuhan positif (+10.7%).
   
   c. Debt Service Ratio (DSR): ${((formData.nominalKUR * 0.015 / formData.avgQRIS) * 100).toFixed(1)}% — masih dalam batas sehat.

3. BUKTI TERLAMPIR
   
   - Laporan Transaksi QRIS 6 Bulan Terakhir
   - Bukti Pelunasan Paylater
   - Screenshot Konfirmasi dari Penyedia Paylater

Berdasarkan fakta-fakta di atas, kami memohon agar pihak Bank dapat meninjau kembali permohonan KUR Mikro atas nama yang bersangkutan.

Demikian surat sanggahan ini kami buat dengan sebenar-benarnya.

Hormat kami,
Credit Specialist — Kawal.id`
  )

  const [roadmapChecked, setRoadmapChecked] = useState([false, false, false])

  const toggleRoadmap = (index) => {
    const newChecked = [...roadmapChecked]
    newChecked[index] = !newChecked[index]
    setRoadmapChecked(newChecked)
  }

  const roadmapSteps = [
    {
      title: 'Lunasi & Update SLIK',
      desc: 'Pastikan Paylater telah lunas dan minta penyedia jasa untuk update status ke OJK. Minta surat keterangan lunas resmi.',
      timeline: '1-2 Minggu',
    },
    {
      title: 'Ajukan Surat Sanggahan',
      desc: 'Kirimkan surat sanggahan ke Bank BRI cabang dengan lampiran bukti QRIS, bukti lunas Paylater, dan referensi pasal POJK.',
      timeline: '1-3 Hari',
    },
    {
      title: 'Follow-up & Monitoring',
      desc: 'Follow up ke bank setiap 3 hari kerja. Jika tidak ada respon dalam 14 hari, escalate ke OJK Consumer Protection.',
      timeline: '2-4 Minggu',
    },
  ]

  return (
    <motion.div
      className="min-h-screen pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Verdict Header */}
      <motion.div
        variants={itemVariants}
        className={`bg-gradient-to-r ${config.color} px-8 py-8 relative overflow-hidden`}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/20" />
          <div className="absolute -left-10 -bottom-10 w-60 h-60 rounded-full bg-white/10" />
        </div>

        <div className="relative z-10">
          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <StatusIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold text-white">
                    Verdict: {config.label}
                  </h1>
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-semibold">
                    {confidence.toFixed(1)}% Confidence
                  </span>
                </div>
                <p className="text-white/80 text-lg">{config.sublabel}</p>
                <p className="text-white/60 text-sm mt-1">
                  Nasabah: {formData.namaUMKM} — KUR Rp {(formData.nominalKUR / 1000000).toFixed(0)} Juta
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Status Override */}
              <div className="relative">
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                  className="appearance-none bg-white/20 backdrop-blur-md text-white px-4 py-2.5 pr-10 rounded-xl border border-white/30 text-sm font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <option value="banding" className="text-slate-800">🟢 Banding</option>
                  <option value="recovery" className="text-slate-800">🟡 Recovery</option>
                  <option value="redirect" className="text-slate-800">🔵 Redirect</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 pointer-events-none" />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2.5 rounded-xl border border-white/30 text-sm font-semibold hover:bg-white/30 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Ekspor PDF
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2.5 rounded-xl border border-white/30 text-sm font-semibold hover:bg-white/30 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Cetak
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="px-8 -mt-4 relative z-20">
        {/* Diagnosis Section */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-navy-600" />
            <h3 className="text-lg font-bold text-navy-900">Kenapa Anda Ditolak?</h3>
            <span className="text-xs text-slate-400 font-medium">— Penjelasan dalam Bahasa Manusia</span>
          </div>

          <div className={`p-5 rounded-xl ${config.bgColor} ${config.borderColor} border mb-4`}>
            <p className="text-slate-700 leading-relaxed">
              <strong>Penolakan KUR {formData.namaUMKM}</strong> oleh Bank BRI didasarkan pada status kolektibilitas 5 (Macet)
              yang tercatat di SLIK OJK. Namun, setelah diaudit oleh sistem AI Kawal, ditemukan bahwa:
            </p>
            <ul className="mt-3 space-y-2">
              <li className="flex items-start gap-2.5 text-slate-700">
                <CircleDot className={`w-4 h-4 mt-0.5 flex-shrink-0 ${config.textColor}`} />
                <span>Status Kol 5 berasal dari <strong>tunggakan Paylater sebesar Rp215.000</strong> yang bersifat consumer (bukan produktif) dan sebenarnya <strong>sudah lunas</strong> namun belum ter-update di sistem SLIK.</span>
              </li>
              <li className="flex items-start gap-2.5 text-slate-700">
                <CircleDot className={`w-4 h-4 mt-0.5 flex-shrink-0 ${config.textColor}`} />
                <span>Omzet QRIS nasabah <strong>stabil di Rp{(formData.avgQRIS / 1000000).toFixed(1)} juta/bulan</strong> dengan tren pertumbuhan positif, menunjukkan kapasitas bayar yang memadai.</span>
              </li>
              <li className="flex items-start gap-2.5 text-slate-700">
                <CircleDot className={`w-4 h-4 mt-0.5 flex-shrink-0 ${config.textColor}`} />
                <span>Bank <strong>tidak melakukan analisis cash flow QRIS</strong> sebagaimana diwajibkan POJK No. 6/2022, sehingga terdapat celah prosedural untuk banding.</span>
              </li>
            </ul>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Omzet QRIS/bulan', value: `Rp ${(formData.avgQRIS / 1000000).toFixed(1)}jt`, sub: 'Stabil 6 bulan' },
              { label: 'Tunggakan SLIK', value: 'Rp 215rb', sub: 'Sudah lunas' },
              { label: 'Debt Service Ratio', value: `${((formData.nominalKUR * 0.015 / formData.avgQRIS) * 100).toFixed(1)}%`, sub: 'Batas sehat' },
              { label: 'Skor Kelayakan', value: `${confidence.toFixed(0)}%`, sub: 'Sangat Tinggi' },
            ].map((metric, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-2xl font-bold text-navy-900">{metric.value}</p>
                <p className="text-sm text-slate-600 font-medium mt-1">{metric.label}</p>
                <p className={`text-xs mt-0.5 ${config.textColor} font-semibold`}>{metric.sub}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Document Smith */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-navy-600" />
                <h3 className="text-lg font-bold text-navy-900">Surat Banding</h3>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer" title="Salin">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer" title="Edit">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <textarea
              value={suratBanding}
              onChange={(e) => setSuratBanding(e.target.value)}
              className="w-full h-[420px] p-5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono text-slate-700 leading-relaxed resize-none focus:outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100 transition-all"
            />
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <Edit3 className="w-3 h-3" />
              Anda dapat mengedit surat ini sebelum dikirim ke nasabah atau bank.
            </p>
          </motion.div>

          {/* Strategic Roadmap */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-navy-600" />
              <h3 className="text-lg font-bold text-navy-900">Roadmap Strategis</h3>
            </div>

            <div className="space-y-4 mb-6">
              {roadmapSteps.map((step, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 4 }}
                  className={`flex gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                    roadmapChecked[i]
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-slate-50 border-slate-200 hover:border-navy-300'
                  }`}
                  onClick={() => toggleRoadmap(i)}
                >
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      roadmapChecked[i]
                        ? 'bg-emerald-500 text-white'
                        : 'bg-navy-100 text-navy-700'
                    }`}>
                      {roadmapChecked[i] ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </div>
                    {i < 2 && (
                      <div className={`w-px h-full min-h-[20px] ${
                        roadmapChecked[i] ? 'bg-emerald-300' : 'bg-slate-300'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-bold text-sm ${
                        roadmapChecked[i] ? 'text-emerald-700 line-through' : 'text-slate-800'
                      }`}>
                        {step.title}
                      </h4>
                      <span className="text-xs text-slate-400 font-medium">{step.timeline}</span>
                    </div>
                    <p className={`text-sm leading-relaxed ${
                      roadmapChecked[i] ? 'text-emerald-600/70' : 'text-slate-600'
                    }`}>
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="p-4 rounded-xl bg-navy-50 border border-navy-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-navy-800">Progress Roadmap</span>
                <span className="text-sm font-bold text-navy-600">
                  {roadmapChecked.filter(Boolean).length}/{roadmapChecked.length}
                </span>
              </div>
              <div className="w-full h-2.5 bg-navy-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-navy-500 to-emerald-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(roadmapChecked.filter(Boolean).length / roadmapChecked.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Lender Matcher — Show for redirect or always show */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-navy-600" />
              <h3 className="text-lg font-bold text-navy-900">Lender Alternatif</h3>
              <span className="text-xs text-slate-400 font-medium">— Rekomendasi Mitra Pendanaan</span>
            </div>
            {currentStatus !== 'redirect' && (
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">
                Opsional — Ditampilkan jika status Redirect
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-5">
            {lenders.map((lender, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-slate-200 overflow-hidden card-hover group"
              >
                <div className={`h-2 bg-gradient-to-r ${lender.color}`} />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{lender.name}</h4>
                      <p className="text-xs text-slate-500">{lender.type}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-bold text-slate-700">{lender.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">{lender.desc}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Maks. Pinjaman</span>
                      <span className="font-semibold text-slate-700">{lender.maxLoan}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Bunga</span>
                      <span className="font-semibold text-slate-700">{lender.rate}</span>
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-navy-50 text-navy-700 font-semibold text-sm hover:bg-navy-100 transition-colors cursor-pointer group-hover:bg-navy-600 group-hover:text-white">
                    Lihat Detail
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onNewAudit}
            className="flex items-center gap-2 bg-gradient-to-r from-navy-600 to-navy-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-navy-600/25 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Mulai Audit Baru
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}
