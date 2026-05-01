import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getDashboard } from '../../services/api'
import Sidebar from '../../components/Sidebar'

const RISIKO_COLOR = {
  'BERISIKO':      '#EF4444',
  'TIDAK BERISIKO': '#10B981',
}

const RISIKO_LABEL = {
  'BERISIKO':      'Berisiko',
  'TIDAK BERISIKO': 'Tidak Berisiko',
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard()
      .then(res => setData(res))
      .catch(err => {
        if (err.response?.status === 401) navigate('/login')
      })
      .finally(() => setLoading(false))
  }, [navigate])

  const firstName = data?.nama_lengkap?.split(' ')[0] ?? ''
  const statusTerakhir = data?.status_terakhir
  const statusColor = statusTerakhir ? (RISIKO_COLOR[statusTerakhir.label] ?? '#F59E0B') : '#F59E0B'
  const statusLabel = statusTerakhir ? (RISIKO_LABEL[statusTerakhir.label] ?? statusTerakhir.label) : '-'

  return (
    <div className="flex h-screen font-['Poppins'] bg-white overflow-hidden">

      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="flex items-center justify-between px-10 py-5 border-b border-gray-200">
          <h1 className="text-[22px] font-bold text-[#12283A]">Dashboard</h1>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-[15px]"
              style={{ backgroundColor: '#7B9DB8' }}
            >
              {firstName.charAt(0).toUpperCase()}
            </div>
            <span className="text-[15px] font-medium text-[#12283A]">{firstName}</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-10 py-8">

          {loading ? (
            <div className="flex items-center justify-center h-40 text-[#7B9DB8] text-[15px]">
              Memuat data...
            </div>
          ) : (
            <>
              {/* Stat Cards */}
              <div className="flex gap-5 mb-8">

                {/* Welcome Card */}
                <div
                  className="flex-1 rounded-2xl px-10 py-8 flex flex-col justify-center"
                  style={{ backgroundColor: '#F3E3D0' }}
                >
                  <h2 className="text-[30px] text-[#12283A] font-semibold leading-tight">
                    Halo {firstName}
                  </h2>
                  <p className="text-[16px] text-[#6B4F35] mt-1">Selamat Datang!</p>
                </div>

                {/* Total Pengecekan */}
                <div
                  className="w-40 shrink-0 rounded-2xl flex flex-col items-center justify-center py-8"
                  style={{ backgroundColor: '#AFAFAF' }}
                >
                  <p className="text-[12px] font-semibold text-white/80 text-center leading-tight mb-3">
                    Total Pengecekan
                  </p>
                  <span className="text-[42px] font-bold text-white leading-none">
                    {data?.total_pengecekan ?? 0}
                  </span>
                </div>

                {/* Status Terakhir */}
                <div className="w-50 shrink-0 rounded-2xl border border-gray-200 flex flex-col items-center justify-center py-8 px-6">
                  <p className="text-[13px] font-semibold text-[#12283A] mb-3">Status terakhir</p>
                  {statusTerakhir ? (
                    <>
                      <span className="text-[42px] font-bold leading-none" style={{ color: statusColor }}>
                        {statusTerakhir.skor}%
                      </span>
                      <span className="text-[13px] font-semibold mt-2" style={{ color: statusColor }}>
                        {statusLabel}
                      </span>
                    </>
                  ) : (
                    <span className="text-[14px] text-gray-400">Belum ada</span>
                  )}
                </div>

              </div>

              {/* Riwayat Singkat */}
              <div className="rounded-2xl border border-gray-200 overflow-hidden mb-8">
                <div className="flex items-center justify-between px-6 py-4">
                  <h3 className="text-[15px] font-semibold text-[#12283A]">Riwayat singkat</h3>
                  <Link
                    to="/riwayat"
                    className="text-[13px] font-medium text-[#12283A] border border-[#12283A] rounded-full px-4 py-1.5 hover:bg-gray-50 transition-colors flex items-center gap-1"
                  >
                    Lihat lebih Detail
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                </div>

                <table className="w-full text-[13px]">
                  <thead>
                    <tr style={{ backgroundColor: '#EEF4FA' }}>
                      <th className="text-left px-6 py-3 font-semibold text-[#12283A]">Tanggal &amp; Waktu</th>
                      <th className="text-left px-6 py-3 font-semibold text-[#12283A]">Analisis Tahap 1</th>
                      <th className="text-left px-6 py-3 font-semibold text-[#12283A]">Analisis Tahap 2</th>
                      <th className="text-left px-6 py-3 font-semibold text-[#12283A]">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.riwayat_singkat?.length > 0 ? (
                      data.riwayat_singkat.map((row, i) => (
                        <tr key={i} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-[#4A6070]">{row.waktu}</td>
                          <td className="px-6 py-4 font-medium" style={{ color: RISIKO_COLOR[row.tahap1] ?? '#4A6070' }}>
                            {RISIKO_LABEL[row.tahap1] ?? row.tahap1}
                          </td>
                          <td className="px-6 py-4 text-[#4A6070]">{row.tahap2}</td>
                          <td className="px-6 py-4 text-[#4A6070]">{row.keterangan}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-[#A8BEC9]">
                          Belum ada riwayat analisis
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mulai Deteksi Button */}
              <div className="flex justify-end">
                <Link
                  to="/kuesioner"
                  className="flex items-center gap-3 px-8 py-4 rounded-full text-[15px] font-semibold text-[#4A3020] transition-all hover:opacity-90"
                  style={{ backgroundColor: '#F0DEC8' }}
                >
                  MULAI DETEKSI
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
