import { useTranslation } from 'react-i18next'

const STAT_ACCENTS = ['#6CD0F6', '#BACED9', '#6CD0F6', '#BACED9']

const diseases = [
  { code: 'MEL', name: 'Melanoma',              dot: 'bg-red-400',     riskKey: 'high' },
  { code: 'BCC', name: 'Basal Cell Carcinoma',  dot: 'bg-red-400',     riskKey: 'high' },
  { code: 'AKIEC', name: 'Actinic Keratoses',   dot: 'bg-orange-400',  riskKey: 'medium' },
  { code: 'BKL', name: 'Benign Keratosis',      dot: 'bg-emerald-400', riskKey: 'low' },
  { code: 'DF', name: 'Dermatofibroma',         dot: 'bg-emerald-400', riskKey: 'low' },
  { code: 'NV', name: 'Melanocytic Nevi',       dot: 'bg-emerald-400', riskKey: 'low' },
  { code: 'VASC', name: 'Vascular Lesions',     dot: 'bg-emerald-400', riskKey: 'low' },
]

export default function StatsSection() {
  const { t } = useTranslation()
  const stats = t('stats.items', { returnObjects: true })

  return (
    <section className="px-[8%] py-16 lg:py-24 bg-white">

      <div className="text-center mb-10 lg:mb-16">
        <span className="text-[#6CD0F6] text-sm font-semibold tracking-widest uppercase">
          {t('stats.badge')}
        </span>
        <h2 className="font-['Kalnia'] text-[30px] sm:text-[36px] lg:text-[42px] font-medium text-[#12283A] leading-[1.2] mt-3">
          {t('stats.heading')}
        </h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-10 lg:mb-16">
        {stats.map((s, i) => {
          const accent = STAT_ACCENTS[i]
          return (
            <div
              key={i}
              className="text-center p-6 lg:p-8 rounded-3xl hover:-translate-y-1 transition-all duration-300"
              style={{ backgroundColor: '#F2F8FC', borderBottom: `4px solid ${accent}` }}
            >
              <div
                className="font-['Kalnia'] text-[40px] lg:text-[52px] font-medium leading-none mb-2"
                style={{ color: accent === '#BACED9' ? '#5A8FA8' : accent }}
              >
                {s.value}
              </div>
              <div className="text-[#12283A] font-semibold text-[13px] lg:text-[15px] mb-1">{s.label}</div>
              <div className="text-[#4A6070] text-[12px] lg:text-[13px] leading-normal hidden sm:block">{s.desc}</div>
            </div>
          )
        })}
      </div>

      <div className="rounded-3xl p-6 lg:p-10" style={{ backgroundColor: '#F2F8FC' }}>
        <h3 className="font-['Kalnia'] text-[22px] lg:text-[26px] font-medium text-[#12283A] mb-2">
          {t('stats.diseasesHeading')}
        </h3>
        <p className="text-[#4A6070] text-[14px] lg:text-[15px] mb-6 lg:mb-8">
          {t('stats.diseasesSubtitle')}
        </p>
        <div className="flex flex-wrap gap-2 lg:gap-3">
          {diseases.map((d, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl px-3 lg:px-5 py-2 lg:py-3 flex items-center gap-2 lg:gap-3 shadow-sm"
              style={{ border: '1px solid #E2EDF5' }}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${d.dot}`} />
              <span className="font-['Kalnia'] text-[13px] lg:text-[15px] font-medium text-[#12283A]">{d.code}</span>
              <span className="text-[#4A6070] text-[12px] lg:text-[14px] hidden sm:inline">{d.name}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
