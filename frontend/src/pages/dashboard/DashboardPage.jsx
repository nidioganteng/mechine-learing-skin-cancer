import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getDashboard } from '../../services/api'
import AppLayout from '../../components/AppLayout'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard()
      .then(res => setData(res))
      .catch(err => { if (err.response?.status === 401) navigate('/login') })
      .finally(() => setLoading(false))
  }, [navigate])

  const RISIKO_COLOR = { 'BERISIKO': '#EF4444', 'TIDAK BERISIKO': '#10B981' }
  const RISIKO_LABEL = { 'BERISIKO': t('dashboard.risky'), 'TIDAK BERISIKO': t('dashboard.notRisky') }

  const firstName = data?.nama_lengkap?.split(' ')[0] ?? ''
  const statusTerakhir = data?.status_terakhir
  const statusColor = statusTerakhir ? (RISIKO_COLOR[statusTerakhir.label] ?? '#F59E0B') : '#F59E0B'
  const statusLabel = statusTerakhir ? (RISIKO_LABEL[statusTerakhir.label] ?? statusTerakhir.label) : '-'

  return (
    <AppLayout title={t('dashboard.title')} userName={firstName}>
      <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-8">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-[#7B9DB8] text-[15px]">
            {t('dashboard.loading')}
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:flex md:flex-row gap-4 md:gap-5 mb-6 lg:mb-8">

              {/* Welcome */}
              <div
                className="col-span-2 md:flex-1 rounded-2xl px-6 sm:px-10 py-6 sm:py-8 flex flex-col justify-center"
                style={{ backgroundColor: '#F3E3D0' }}
              >
                <h2 className="text-[22px] sm:text-[30px] text-[#12283A] font-semibold leading-tight">
                  {t('dashboard.welcome', { name: firstName })}
                </h2>
                <p className="text-[14px] sm:text-[16px] text-[#6B4F35] mt-1">{t('dashboard.welcomeSubtitle')}</p>
              </div>

              {/* Total */}
              <div
                className="rounded-2xl flex flex-col items-center justify-center py-6 sm:py-8 md:w-40 md:shrink-0"
                style={{ backgroundColor: '#AFAFAF' }}
              >
                <p className="text-[11px] sm:text-[12px] font-semibold text-white/80 text-center leading-tight mb-2 sm:mb-3 px-2">
                  {t('dashboard.totalChecks')}
                </p>
                <span className="text-[36px] sm:text-[42px] font-bold text-white leading-none">
                  {data?.total_pengecekan ?? 0}
                </span>
              </div>

              {/* Status Terakhir */}
              <div className="rounded-2xl border border-gray-200 flex flex-col items-center justify-center py-6 sm:py-8 px-4 md:w-50 md:shrink-0">
                <p className="text-[11px] sm:text-[13px] font-semibold text-[#12283A] mb-2 sm:mb-3">{t('dashboard.lastStatus')}</p>
                {statusTerakhir ? (
                  <>
                    <span className="text-[36px] sm:text-[42px] font-bold leading-none" style={{ color: statusColor }}>
                      {statusTerakhir.skor}%
                    </span>
                    <span className="text-[11px] sm:text-[13px] font-semibold mt-1 sm:mt-2" style={{ color: statusColor }}>
                      {statusLabel}
                    </span>
                  </>
                ) : (
                  <span className="text-[13px] text-gray-400">{t('dashboard.noStatus')}</span>
                )}
              </div>
            </div>

            {/* Riwayat Singkat */}
            <div className="rounded-2xl border border-gray-200 overflow-hidden mb-6 lg:mb-8">
              <div className="flex items-center justify-between px-4 sm:px-6 py-4">
                <h3 className="text-[14px] sm:text-[15px] font-semibold text-[#12283A]">{t('dashboard.recentHistory')}</h3>
                <Link
                  to="/riwayat"
                  className="text-[12px] sm:text-[13px] font-medium text-[#12283A] border border-[#12283A] rounded-full px-3 sm:px-4 py-1.5 hover:bg-gray-50 transition-colors flex items-center gap-1"
                >
                  <span className="hidden sm:inline">{t('dashboard.viewDetail')}</span>
                  <span className="sm:hidden">Detail</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              </div>

              {/* Table — scrollable on mobile */}
              <div className="overflow-x-auto">
                <table className="w-full text-[12px] sm:text-[13px] min-w-120">
                  <thead>
                    <tr style={{ backgroundColor: '#EEF4FA' }}>
                      <th className="text-left px-4 sm:px-6 py-3 font-semibold text-[#12283A]">{t('dashboard.tableDate')}</th>
                      <th className="text-left px-4 sm:px-6 py-3 font-semibold text-[#12283A]">{t('dashboard.tableStage1')}</th>
                      <th className="text-left px-4 sm:px-6 py-3 font-semibold text-[#12283A]">{t('dashboard.tableStage2')}</th>
                      <th className="text-left px-4 sm:px-6 py-3 font-semibold text-[#12283A]">{t('dashboard.tableNote')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.riwayat_singkat?.length > 0 ? (
                      data.riwayat_singkat.map((row, i) => (
                        <tr key={i} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-[#4A6070]">{row.waktu}</td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium" style={{ color: RISIKO_COLOR[row.tahap1] ?? '#4A6070' }}>
                            {RISIKO_LABEL[row.tahap1] ?? row.tahap1}
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-[#4A6070]">{row.tahap2}</td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-[#4A6070]">{row.keterangan}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-[#A8BEC9]">
                          {t('dashboard.noHistory')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mulai Deteksi */}
            <div className="flex justify-end">
              <Link
                to="/kuesioner"
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-[14px] sm:text-[15px] font-semibold text-[#4A3020] transition-all hover:opacity-90"
                style={{ backgroundColor: '#F0DEC8' }}
              >
                {t('dashboard.startDetection')}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
