import { useTranslation } from 'react-i18next'
import { Label, YaTidak, DiameterStepper } from './Atoms'

export default function StepGejala({ form, set }) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col md:flex-row gap-5 md:gap-0">
      <div className="flex-1 flex flex-col gap-6 md:pr-8">
        <div>
          <p className="text-[14px] text-[#12283A] mb-1">{t('questionnaire.symptoms.itchy')}</p>
          <YaTidak value={form.gatal} onChange={set('gatal')} />
        </div>
        <div>
          <p className="text-[14px] text-[#12283A] mb-1">{t('questionnaire.symptoms.bleeding')}</p>
          <YaTidak value={form.berdarah} onChange={set('berdarah')} />
        </div>
        <div>
          <p className="text-[14px] text-[#12283A] mb-1">{t('questionnaire.symptoms.asymmetric')}</p>
          <YaTidak value={form.asimetris} onChange={set('asimetris')} />
        </div>
        <div>
          <p className="text-[14px] text-[#12283A] mb-1">{t('questionnaire.symptoms.roughBorder')}</p>
          <YaTidak value={form.tepi_kasar} onChange={set('tepi_kasar')} />
        </div>
      </div>

      <div className="hidden md:block w-px bg-gray-200 self-stretch" />

      <div className="flex-1 flex flex-col gap-6 md:pl-8">
        <div>
          <p className="text-[14px] text-[#12283A] mb-1">{t('questionnaire.symptoms.varyingColor')}</p>
          <YaTidak value={form.warna_bervariasi} onChange={set('warna_bervariasi')} />
        </div>
        <div>
          <p className="text-[14px] text-[#12283A] mb-1">{t('questionnaire.symptoms.evolution')}</p>
          <YaTidak value={form.evolusi} onChange={set('evolusi')} />
        </div>
        <div>
          <Label>{t('questionnaire.symptoms.diameter')}</Label>
          <DiameterStepper value={form.diameter_mm} onChange={set('diameter_mm')} />
        </div>
      </div>
    </div>
  )
}
