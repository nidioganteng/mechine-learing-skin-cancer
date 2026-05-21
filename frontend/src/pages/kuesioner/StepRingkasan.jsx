import { useTranslation } from 'react-i18next'
import { useClassInfo } from './Atoms'

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-0 shadow-sm">
      <p className="text-[11px] font-semibold text-gray-400 tracking-widest uppercase mb-3">{title}</p>
      <div className="w-full h-px bg-gray-100 mb-4" />
      {children}
    </div>
  )
}

function Row({ label, value, valueClass = '' }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
      <span className="text-[13px] text-gray-500">{label}</span>
      <span className={`text-[13px] font-bold text-[#12283A] ${valueClass}`}>{value}</span>
    </div>
  )
}

function YaBadge({ val }) {
  const { t } = useTranslation()
  return val === 'Yes'
    ? <span className="text-[13px] font-bold text-red-500">{t('questionnaire.summary.yes')}</span>
    : <span className="text-[13px] font-bold text-green-500">{t('questionnaire.summary.notExists')}</span>
}

export default function StepRingkasan({ form, result, imageResult }) {
  const { t } = useTranslation()
  const isBerisiko    = result?.hasil_risiko === 'BERISIKO'
  const confidencePct = imageResult ? Math.round(imageResult.confidence * 100 * 10) / 10 : 0
  const classInfo     = useClassInfo(imageResult?.kelas)
  const diameterNum   = parseFloat(form.diameter_mm) || 0

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-[20px] sm:text-[22px] font-bold text-[#12283A]">{t('questionnaire.summary.heading')}</h2>
        <span className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-bold text-white ${isBerisiko ? 'bg-red-500' : 'bg-green-500'}`}>
          <span className="w-2.5 h-2.5 rounded-full bg-white/60" />
          {isBerisiko ? t('questionnaire.summary.highRisk') : t('questionnaire.summary.notRisky')}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <SectionCard title={t('questionnaire.summary.demographics')}>
          <Row label={t('questionnaire.summary.name')}       value={form.nama || '-'} />
          <Row label={t('questionnaire.summary.age')}        value={form.usia ? `${form.usia} ${t('questionnaire.summary.years')}` : '-'} />
          <Row label={t('questionnaire.summary.gender')}     value={form.gender || '-'} />
          <Row label={t('questionnaire.summary.skinType')}   value={form.tipe_kulit || '-'} />
          <Row label={t('questionnaire.summary.uvExposure')} value={form.paparan_uv || '-'} />
          <div className="flex justify-between items-center py-2">
            <span className="text-[13px] text-gray-500">{t('questionnaire.summary.familyHistory')}</span>
            {form.riwayat_keluarga === 'Yes'
              ? <span className="text-[13px] font-bold text-red-500">{t('questionnaire.summary.familyExists')}</span>
              : <span className="text-[13px] font-bold text-green-500">{t('questionnaire.summary.familyNotExists')}</span>}
          </div>
        </SectionCard>

        <SectionCard title={t('questionnaire.summary.aiScore')}>
          {imageResult && classInfo ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[15px] font-bold text-[#12283A]">{t('questionnaire.summary.aiDetection')}</span>
                <span className="px-3 py-1 rounded-full text-[12px] font-semibold text-white bg-[#12283A]">
                  {imageResult.kelas}
                </span>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-[13px] text-gray-500 mb-1.5">
                  <span>{t('questionnaire.summary.confidenceLevel')}</span>
                  <span className="font-bold text-[#12283A]">{confidencePct}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${confidencePct}%`, backgroundColor: '#7B9DB8' }} />
                </div>
              </div>
              <div className={`rounded-xl px-4 py-3 text-[12px] leading-relaxed flex gap-2 mb-3 ${
                classInfo.mendesak ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-blue-50 text-[#4A6070]'
              }`}>
                <span className="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: classInfo.dot }} />
                {classInfo.pesan}
              </div>
              <div className="flex justify-between items-center py-2 border-t border-gray-100">
                <span className="text-[13px] text-gray-500">{t('questionnaire.summary.spontaneousItchy')}</span>
                <YaBadge val={form.gatal} />
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-[13px] text-gray-500">{t('questionnaire.summary.spreadBleeding')}</span>
                <YaBadge val={form.berdarah} />
              </div>
            </>
          ) : (
            <div className="py-6 text-center text-[13px] text-gray-400">
              {t('questionnaire.summary.noImageAnalysis')}
            </div>
          )}
        </SectionCard>

        <SectionCard title={t('questionnaire.summary.clinicalSymptoms')}>
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-[13px] text-gray-500">{t('questionnaire.summary.asymmetric')}</span>
            <YaBadge val={form.asimetris} />
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-[13px] text-gray-500">{t('questionnaire.summary.roughBorder')}</span>
            <YaBadge val={form.tepi_kasar} />
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-[13px] text-gray-500">{t('questionnaire.summary.varyingColor')}</span>
            <YaBadge val={form.warna_bervariasi} />
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-[13px] text-gray-500">{t('questionnaire.summary.diameter')}</span>
            {diameterNum > 6
              ? <span className="text-[13px] font-bold text-red-500">{t('questionnaire.summary.yes')}</span>
              : <span className="text-[13px] font-bold text-green-500">{t('questionnaire.summary.notExists')}</span>}
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-[13px] text-gray-500">{t('questionnaire.summary.evolution')}</span>
            <YaBadge val={form.evolusi} />
          </div>
        </SectionCard>

        <SectionCard title={t('questionnaire.summary.rfScore')}>
          <div className="mb-3">
            <div className="flex justify-between text-[13px] mb-1.5">
              <span className="text-gray-500">{t('questionnaire.rfResult.probabilityLabel')}</span>
              <span className="font-bold" style={{ color: isBerisiko ? '#EF4444' : '#10B981' }}>
                {result?.probabilitas_persen ?? 0}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full"
                style={{ width: `${result?.probabilitas_persen ?? 0}%`, backgroundColor: isBerisiko ? '#EF4444' : '#10B981' }} />
            </div>
          </div>
          <Row label={t('questionnaire.summary.rfScoreLabel')}  value={`${result?.skor_rf ?? 0}%`} />
          <Row label={t('questionnaire.summary.moleCount')}     value={form.jumlah_tahi_lalat || '-'} />
          <Row label={t('questionnaire.summary.lesionDiameter')} value={form.diameter_mm ? `${form.diameter_mm} mm` : '-'} />
        </SectionCard>

      </div>
    </div>
  )
}
