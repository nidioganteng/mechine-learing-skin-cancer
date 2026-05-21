import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AppLayout from '../../components/AppLayout'
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

function getBahayaInfo(kelas, t) {
  const map = {
    'Actinic keratoses (akiec)': { color: '#F59E0B',  labelKey: 'diseases.akiec.bahaya' },
    'Basal cell carcinoma (bcc)': { color: '#EF4444', labelKey: 'diseases.bcc.bahaya' },
    'Benign keratosis-like (bkl)': { color: '#10B981', labelKey: 'diseases.bkl.bahaya' },
    'Dermatofibroma (df)':         { color: '#10B981', labelKey: 'diseases.df.bahaya' },
    'Melanoma (mel)':              { color: '#DC2626', labelKey: 'diseases.mel.bahaya' },
    'Melanocytic nevi (nv)':       { color: '#10B981', labelKey: 'diseases.nv.bahaya' },
    'Vascular lesions (vasc)':     { color: '#10B981', labelKey: 'diseases.vasc.bahaya' },
  }
  const entry = map[kelas]
  if (!entry) return null
  return { color: entry.color, label: t(entry.labelKey) }
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
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const isBerisiko = item.hasil_risiko === 'BERISIKO'
  const warna = RISIKO_COLOR[item.hasil_risiko] ?? '#6B7280'
  const bahaya = item.tahap2_kelas ? getBahayaInfo(item.tahap2_kelas, t) : null
  const yn = val => val === 'Yes' ? t('history.yes') : t('history.no')

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50/60 transition-colors text-left"
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[12px] sm:text-[13px] font-bold text-white shrink-0"
          style={{ backgroundColor: '#7B9DB8' }}>
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[12px] sm:text-[13px] font-semibold text-[#12283A] truncate">{item.waktu}</p>
          <p className="text-[11px] sm:text-[12px] text-gray-400 mt-0.5 truncate">
            {t('history.age', { age: item.usia })} · {item.gender} · {item.tipe_kulit}
          </p>
        </div>

        <span className="px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-white shrink-0"
          style={{ backgroundColor: warna }}>
          {isBerisiko ? t('history.badgeRisky') : t('history.badgeSafe')}
        </span>

        {item.tahap2_kelas ? (
          <div className="hidden sm:flex flex-col items-end shrink-0">
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
          <span className="hidden sm:block text-[11px] text-gray-300 shrink-0">—</span>
        )}

        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5"
          className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="px-4 sm:px-6 pb-5 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-4">

            {/* Kolom kiri */}
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">{t('history.sectionPersonal')}</p>
              <DetailRow label={t('history.uvExposure')}    value={item.paparan_uv} />
              <DetailRow label={t('history.familyHistory')} value={item.riwayat_keluarga === 'Yes' ? t('history.exists') : t('history.notExists')} />
              <DetailRow label={t('history.moleCount')}     value={item.jumlah_tahi_lalat} />
              <DetailRow label={t('history.diameter')}      value={item.diameter_mm} />

              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-2">{t('history.sectionSymptoms')}</p>
              <DetailRow label={t('history.itchy')}        value={yn(item.gatal)}           highlight={item.gatal === 'Yes' ? 'text-red-500' : 'text-green-600'} />
              <DetailRow label={t('history.bleeding')}     value={yn(item.berdarah)}         highlight={item.berdarah === 'Yes' ? 'text-red-500' : 'text-green-600'} />
              <DetailRow label={t('history.asymmetric')}   value={yn(item.asimetris)}        highlight={item.asimetris === 'Yes' ? 'text-red-500' : 'text-green-600'} />
              <DetailRow label={t('history.roughBorder')}  value={yn(item.tepi_kasar)}       highlight={item.tepi_kasar === 'Yes' ? 'text-red-500' : 'text-green-600'} />
              <DetailRow label={t('history.varyingColor')} value={yn(item.warna_bervariasi)} highlight={item.warna_bervariasi === 'Yes' ? 'text-red-500' : 'text-green-600'} />
              <DetailRow label={t('history.evolution')}    value={yn(item.evolusi)}           highlight={item.evolusi === 'Yes' ? 'text-red-500' : 'text-green-600'} />
            </div>

            {/* Kolom kanan */}
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">{t('history.sectionScore')}</p>
              <div className="mb-3">
                <div className="flex justify-between text-[12px] text-gray-400 mb-1">
                  <span>{t('history.rfScore')}</span>
                  <span className="font-bold" style={{ color: warna }}>{item.skor_rf}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${item.skor_rf}%`, backgroundColor: warna }} />
                </div>
              </div>

              {item.tahap2_kelas ? (
                <>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-2">{t('history.sectionStage2')}</p>
                  <DetailRow label={t('history.lesionType')} value={item.tahap2_kelas} />
                  <div className="flex justify-between py-1.5 border-b border-gray-50">
                    <span className="text-[12px] text-gray-400">{t('history.confidence')}</span>
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
                  <p className="text-[12px] text-gray-300">{t('history.noImageAnalysis')}</p>
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
  const { t } = useTranslation()
  const [data,     setData]     = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('semua')
  const [userName, setUserName] = useState('')

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

  const totalBerisiko = data.filter(d => d.hasil_risiko === 'BERISIKO').length
  const totalAman     = data.filter(d => d.hasil_risiko === 'TIDAK BERISIKO').length

  return (
    <AppLayout title={t('history.title')} userName={userName}>
      <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-8">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-[#7B9DB8] text-[15px]">
            {t('history.loading')}
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 lg:mb-8">
              <div className="rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4" style={{ backgroundColor: '#EBF3F9' }}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#7B9DB8' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[12px] text-[#4A6070]">{t('history.totalChecks')}</p>
                  <p className="text-[24px] sm:text-[28px] font-bold text-[#12283A] leading-none">{data.length}</p>
                </div>
              </div>

              <div className="rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4" style={{ backgroundColor: '#FEF2F2' }}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 bg-red-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[12px] text-red-400">{t('history.risky')}</p>
                  <p className="text-[24px] sm:text-[28px] font-bold text-red-500 leading-none">{totalBerisiko}</p>
                </div>
              </div>

              <div className="rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4" style={{ backgroundColor: '#F0FDF4' }}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 bg-green-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[12px] text-green-600">{t('history.notRisky')}</p>
                  <p className="text-[24px] sm:text-[28px] font-bold text-green-500 leading-none">{totalAman}</p>
                </div>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 mb-4 sm:mb-5 flex-wrap">
              {[
                { key: 'semua',    label: t('history.filterAll',   { count: data.length }) },
                { key: 'berisiko', label: t('history.filterRisky', { count: totalBerisiko }) },
                { key: 'aman',     label: t('history.filterSafe',  { count: totalAman }) },
              ].map(tab => (
                <button key={tab.key} onClick={() => setFilter(tab.key)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[12px] sm:text-[13px] font-semibold transition-colors ${
                    filter === tab.key ? 'bg-[#12283A] text-white' : 'bg-white border border-gray-200 text-[#4A6070] hover:bg-gray-50'
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* List */}
            {filtered.length > 0 ? (
              <div className="flex flex-col gap-3">
                {filtered.map((item, i) => <RiwayatCard key={item.id} item={item} index={i} />)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 sm:py-20 gap-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <p className="text-[14px] sm:text-[15px] text-gray-400">
                  {data.length === 0 ? t('history.noHistory') : t('history.noFilterData')}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}
