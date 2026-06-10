import { useTranslation } from 'react-i18next'
import { Label, TextInput, SelectInput, SkinTypeSelect, AdaTidakAda } from './Atoms'

export default function StepDataDiri({ form, options, onInput, set }) {
  const { t } = useTranslation()

  const genderOptions = options.genders.length
    ? options.genders.map(g => ({
        value: g,
        label: g === 'Male' ? t('questionnaire.personal.male') : g === 'Female' ? t('questionnaire.personal.female') : g,
      }))
    : [
        { value: 'Male',   label: t('questionnaire.personal.male') },
        { value: 'Female', label: t('questionnaire.personal.female') },
      ]

  const uvLabelMap = {
    Low:      t('questionnaire.personal.uvLow'),
    Moderate: t('questionnaire.personal.uvModerate'),
    High:     t('questionnaire.personal.uvHigh'),
  }

  const sunOptions = options.sun_exposures.length
    ? options.sun_exposures.map(s => ({ value: s, label: uvLabelMap[s] ?? s }))
    : [
        { value: 'Low',      label: t('questionnaire.personal.uvLow') },
        { value: 'Moderate', label: t('questionnaire.personal.uvModerate') },
        { value: 'High',     label: t('questionnaire.personal.uvHigh') },
      ]

  return (
    <div className="flex flex-col md:flex-row gap-5 md:gap-0">
      <div className="flex-1 flex flex-col gap-5 md:pr-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <Label>{t('questionnaire.personal.name')}</Label>
            <TextInput name="nama" value={form.nama} onChange={onInput}
              placeholder={t('questionnaire.personal.namePlaceholder')} readOnly />
          </div>
          <div className="flex-1">
            <Label>{t('questionnaire.personal.age')}</Label>
            <TextInput name="usia" value={form.usia} onChange={onInput}
              placeholder={t('questionnaire.personal.agePlaceholder')} type="number" />
          </div>
        </div>

        <div>
          <Label>{t('questionnaire.personal.gender')}</Label>
          <SelectInput value={form.gender} onChange={set('gender')} options={genderOptions}
            placeholder={t('questionnaire.personal.genderPlaceholder')} />
        </div>

        <div>
          <Label>{t('questionnaire.personal.skinType')}</Label>
          <SkinTypeSelect
            value={form.tipe_kulit}
            onChange={set('tipe_kulit')}
            options={options.skin_types.length ? options.skin_types : ['Type I', 'Type II', 'Type III', 'Type IV', 'Type V']}
            placeholder={t('questionnaire.personal.skinTypePlaceholder')}
          />
        </div>
      </div>

      <div className="hidden md:block w-px bg-gray-200 self-stretch" />

      <div className="flex-1 flex flex-col gap-5 md:pl-8">
        <div>
          <Label>{t('questionnaire.personal.uvExposure')}</Label>
          <SelectInput value={form.paparan_uv} onChange={set('paparan_uv')} options={sunOptions}
            placeholder={t('questionnaire.personal.uvPlaceholder')} />
        </div>

        <div>
          <Label>{t('questionnaire.personal.familyHistory')}</Label>
          <AdaTidakAda value={form.riwayat_keluarga} onChange={set('riwayat_keluarga')} />
        </div>

        <div>
          <Label>{t('questionnaire.personal.moleCount')}</Label>
          <TextInput name="jumlah_tahi_lalat" value={form.jumlah_tahi_lalat} onChange={onInput}
            placeholder={t('questionnaire.personal.moleCountPlaceholder')} type="number" />
        </div>
      </div>
    </div>
  )
}
