import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { getRiwayat, getDashboard } from '../../services/api'

const RISIKO_COLOR = { 'BERISIKO': '#EF4444', 'TIDAK BERISIKO': '#10B981' }

const CLASS_SINGKAT = {
  'Actinic keratoses (akiec)': 'Akiec',
  'Basal cell carcinoma (bcc)': 'BCC',
  'Benign keratosis-like (bkl)': 'BKL',
  'Dermatofibroma (df)': 'DF',
  'Melanoma (mel)': 'Melanoma',
  'Melanocytic nevi (nv)': 'Nevi',
  'Vascular lesions (vasc)': 'Vasc',
}

const BAHAYA_INFO = {
  'Actinic keratoses (akiec)': { label: 'Resiko Sedang',       color: '#F59E0B' },
  'Basal cell carcinoma (bcc)': { label: 'Resiko Tinggi',       color: '#EF4444' },
  'Benign keratosis-like (bkl)': { label: 'Resiko Rendah',     color: '#10B981' },
  'Dermatofibroma (df)':         { label: 'Resiko Rendah',     color: '#10B981' },
  'Melanoma (mel)':              { label: 'Sangat Tinggi',      color: '#DC2626' },
  'Melanocytic nevi (nv)':       { label: 'Resiko Rendah',     color: '#10B981' },
  'Vascular lesions (vasc)':     { label: 'Resiko Rendah',     color: '#10B981' },
}

function yn(val) {
  return val === 'Yes' ? 'Ya' : 'Tidak'
}

function DetailRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-[12px] text-gray-400">{label}</span>
      <span className={`text-[12px] font-semibold ${highlight ?? 'text-[#12283A]'}`}>{value}</span>
    </div>
  )
}

function RiwayatCard({ item, index }) {
  const [open, setOpen] = useState(false)
  const isBerisiko = item.hasil_risiko === 'BERISIKO'
  const warna = RISIKO_COLOR[item.hasil_risiko] ?? '#6B7280'
  const bahaya = item.tahap2_kelas ? BAHAYA_INFO[item.tahap2_kelas] : null

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Card header / summary row */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors text-left"
      >
        {/* Nomor */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0"
          style={{ backgroundColor: '#7B9DB8' }}>
          {index + 1}
        </div>

        {/* Waktu */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-[#12283A] truncate">{item.waktu}</p>
          <p className="text-[12px] text-gray-400 mt-0.5">
            Usia {item.usia} tahun · {item.gender} · {item.tipe_kulit}
          </p>
        </div>

        {/* Badge Tahap 1 */}
        <span className="px-3 py-1 rounded-full text-[11px] font-bold text-white shrink-0"
          style={{ backgroundColor: warna }}>
          {isBerisiko ? 'BERISIKO' : 'AMAN'}
        </span>

        {/* Tahap 2 */}
        {item.tahap2_kelas ? (
          <div className="flex flex-col items-end shrink-0">
            <span className="text-[11px] font-bold text-[#12283A]">
              {CLASS_SINGKAT[item.tahap2_kelas] ?? item.tahap2_kelas}
            </span>
            {bahaya && (
              <span className="text-[10px] font-semibold" style={{ color: bahaya.color }}>
                {bahaya.label}
              </span>
            )}
          </div>
        ) : (
          <span className="text-[11px] text-gray-300 shrink-0">—</span>
        )}

        {/* Chevron */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5"
          className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Detail expandable */}
      {open && (
        <div className="px-6 pb-5 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-x-8 gap-y-0 mt-4">

            {/* Kolom kiri: Data diri + Gejala */}
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Data Diri</p>
              <DetailRow label="Paparan UV"       value={item.paparan_uv} />
              <DetailRow label="Riwayat Keluarga" value={item.riwayat_keluarga === 'Yes' ? 'Ada' : 'Tidak Ada'} />
              <DetailRow label="Jumlah Tahi Lalat" value={item.jumlah_tahi_lalat} />
              <DetailRow label="Diameter (mm)"    value={item.diameter_mm} />

              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-2">Gejala Klinis</p>
              <DetailRow label="Gatal"            value={yn(item.gatal)}
                highlight={item.gatal === 'Yes' ? 'text-red-500' : 'text-green-600'} />
              <DetailRow label="Berdarah"         value={yn(item.berdarah)}
                highlight={item.berdarah === 'Yes' ? 'text-red-500' : 'text-green-600'} />
              <DetailRow label="Asimetris"        value={yn(item.asimetris)}
                highlight={item.asimetris === 'Yes' ? 'text-red-500' : 'text-green-600'} />
              <DetailRow label="Tepian Kasar"     value={yn(item.tepi_kasar)}
                highlight={item.tepi_kasar === 'Yes' ? 'text-red-500' : 'text-green-600'} />
              <DetailRow label="Warna Bervariasi" value={yn(item.warna_bervariasi)}
                highlight={item.warna_bervariasi === 'Yes' ? 'text-red-500' : 'text-green-600'} />
              <DetailRow label="Evolusi"          value={yn(item.evolusi)}
                highlight={item.evolusi === 'Yes' ? 'text-red-500' : 'text-green-600'} />
            </div>

            {/* Kolom kanan: Skor RF + Tahap 2 */}
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Skor Analisis</p>
              <div className="mb-3">
                <div className="flex justify-between text-[12px] text-gray-400 mb-1">
                  <span>Skor RF (Tahap 1)</span>
                  <span className="font-bold" style={{ color: warna }}>{item.skor_rf}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${item.skor_rf}%`, backgroundColor: warna }} />
                </div>
              </div>

              {item.tahap2_kelas ? (
                <>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-2">Hasil Tahap 2 (AI)</p>
                  <DetailRow label="Jenis Lesi" value={item.tahap2_kelas} />
                  <div className="flex justify-between py-1.5 border-b border-gray-50">
                    <span className="text-[12px] text-gray-400">Confidence</span>
                    <span className="text-[12px] font-bold" style={{ color: bahaya?.color ?? '#7B9DB8' }}>
                      {item.tahap2_conf}%
                    </span>
                  </div>
                  {bahaya && (
                    <div className="mt-3 px-3 py-2 rounded-xl flex items-center gap-2"
                      style={{ backgroundColor: `${bahaya.color}15` }}>
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: bahaya.color }} />
                      <span className="text-[11px] font-semibold" style={{ color: bahaya.color }}>
                        {bahaya.label}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="mt-4 py-6 flex flex-col items-center gap-2 bg-gray-50 rounded-xl">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 9h.01M15 9h.01M9 15h6" />
                  </svg>
                  <p className="text-[12px] text-gray-300">Analisis gambar tidak dilakukan</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function RiwayatPage() {
  const navigate = useNavigate()
  const [data,      setData]      = useState([])
  const [loading,   setLoading]   = useState(true)
  const [filter,    setFilter]    = useState('semua')
  const [userName,  setUserName]  = useState('')

  useEffect(() => {
    getDashboard()
      .then(res => { if (res.status === 'success') setUserName(res.nama_lengkap?.split(' ')[0] ?? '') })
      .catch(err => { if (err.response?.status === 401) navigate('/login') })

    getRiwayat()
      .then(res => { if (res.status === 'success') setData(res.riwayat) })
      .catch(err => { if (err.response?.status === 401) navigate('/login') })
      .finally(() => setLoading(false))
  }, [navigate])

  const filtered = filter === 'semua'
    ? data
    : data.filter(d => d.hasil_risiko === (filter === 'berisiko' ? 'BERISIKO' : 'TIDAK BERISIKO'))

  const totalBerisiko    = data.filter(d => d.hasil_risiko === 'BERISIKO').length
  const totalAman        = data.filter(d => d.hasil_risiko === 'TIDAK BERISIKO').length
  const totalTahap2      = data.filter(d => d.tahap2_kelas).length

  return (
    <div className="flex h-screen font-['Poppins'] bg-white overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-10 py-5 border-b border-gray-200">
          <h1 className="text-[22px] font-bold text-[#12283A]">Riwayat Analisis</h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-[15px]"
              style={{ backgroundColor: '#7B9DB8' }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-[15px] font-medium text-[#12283A]">{userName}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-10 py-8">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-[#7B9DB8] text-[15px]">
              Memuat riwayat...
            </div>
          ) : (
            <>
              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="rounded-2xl p-5 flex items-center gap-4" style={{ backgroundColor: '#EBF3F9' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: '#7B9DB8' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#4A6070]">Total Pemeriksaan</p>
                    <p className="text-[28px] font-bold text-[#12283A] leading-none">{data.length}</p>
                  </div>
                </div>

                <div className="rounded-2xl p-5 flex items-center gap-4" style={{ backgroundColor: '#FEF2F2' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-red-400">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[12px] text-red-400">Berisiko</p>
                    <p className="text-[28px] font-bold text-red-500 leading-none">{totalBerisiko}</p>
                  </div>
                </div>

                <div className="rounded-2xl p-5 flex items-center gap-4" style={{ backgroundColor: '#F0FDF4' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-green-400">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[12px] text-green-600">Tidak Berisiko</p>
                    <p className="text-[28px] font-bold text-green-500 leading-none">{totalAman}</p>
                  </div>
                </div>
              </div>

              {/* Filter tabs */}
              <div className="flex items-center gap-2 mb-5">
                {[
                  { key: 'semua',    label: `Semua (${data.length})` },
                  { key: 'berisiko', label: `Berisiko (${totalBerisiko})` },
                  { key: 'aman',     label: `Tidak Berisiko (${totalAman})` },
                ].map(tab => (
                  <button key={tab.key} onClick={() => setFilter(tab.key)}
                    className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${
                      filter === tab.key
                        ? 'bg-[#12283A] text-white'
                        : 'bg-white border border-gray-200 text-[#4A6070] hover:bg-gray-50'
                    }`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* List riwayat */}
              {filtered.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {filtered.map((item, i) => (
                    <RiwayatCard key={item.id} item={item} index={i} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <p className="text-[15px] text-gray-400">
                    {data.length === 0 ? 'Belum ada riwayat analisis' : 'Tidak ada data untuk filter ini'}
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
