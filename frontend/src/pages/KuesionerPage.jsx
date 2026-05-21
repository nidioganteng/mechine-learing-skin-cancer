import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AppLayout from '../components/AppLayout'
import { getFormOptions, getDashboard, submitKuesioner } from '../services/api'

import StepIndicator  from './kuesioner/StepIndicator'
import StepDataDiri   from './kuesioner/StepDataDiri'
import StepGejala     from './kuesioner/StepGejala'
import StepHasilRF    from './kuesioner/StepHasilRF'
import StepUploadFoto from './kuesioner/StepUploadFoto'
import StepRingkasan  from './kuesioner/StepRingkasan'

const TOTAL_STEPS = 5

export default function KuesionerPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [step,        setStep]        = useState(1)
  const [options,     setOptions]     = useState({ genders: [], skin_types: [], sun_exposures: [] })
  const [userName,    setUserName]    = useState('')
  const [submitting,  setSubmitting]  = useState(false)
  const [result,      setResult]      = useState(null)
  const [imageResult, setImageResult] = useState(null)
  const [error,       setError]       = useState('')

  const [form, setForm] = useState({
    nama: '', usia: '', gender: '', tipe_kulit: '', paparan_uv: '',
    riwayat_keluarga: '', jumlah_tahi_lalat: '',
    gatal: '', berdarah: '', asimetris: '', tepi_kasar: '',
    warna_bervariasi: '', evolusi: '', diameter_mm: '',
  })

  useEffect(() => {
    getFormOptions().then(res => { if (res.status === 'success') setOptions(res) }).catch(() => {})
    getDashboard()
      .then(res => {
        if (res.status === 'success') {
          setUserName(res.nama_lengkap?.split(' ')[0] ?? '')
          setForm(f => ({ ...f, nama: res.nama_lengkap ?? '' }))
        }
      })
      .catch(err => { if (err.response?.status === 401) navigate('/login') })
  }, [navigate])

  function set(field) { return val => setForm(f => ({ ...f, [field]: val })) }
  function handleInput(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  function canProceed() {
    if (step === 1) return form.usia && form.gender && form.tipe_kulit && form.paparan_uv && form.riwayat_keluarga && form.jumlah_tahi_lalat
    if (step === 2) return form.gatal && form.berdarah && form.asimetris && form.tepi_kasar && form.warna_bervariasi && form.evolusi && form.diameter_mm
    return true
  }

  async function handleSubmitAndNext() {
    setSubmitting(true); setError('')
    try {
      const res = await submitKuesioner({
        usia: form.usia, gender: form.gender, tipe_kulit: form.tipe_kulit,
        paparan_uv: form.paparan_uv, riwayat_keluarga: form.riwayat_keluarga,
        jumlah_tahi_lalat: form.jumlah_tahi_lalat, diameter_mm: form.diameter_mm,
        asimetris: form.asimetris, tepi_kasar: form.tepi_kasar,
        warna_bervariasi: form.warna_bervariasi, evolusi: form.evolusi,
        gatal: form.gatal, berdarah: form.berdarah,
      })
      if (res.status === 'success') { setResult(res); setStep(3) }
      else setError(res.pesan || t('questionnaire.error'))
    } catch (err) {
      if (err.response?.status === 401) navigate('/login')
      else setError(t('questionnaire.error'))
    } finally {
      setSubmitting(false)
    }
  }

  const NavBtn = ({ onClick, disabled, children, outline }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full text-[13px] sm:text-[14px] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
        outline
          ? 'text-[#12283A] border border-[#D0D8E0] bg-white hover:bg-gray-50'
          : 'text-[#4A3020] hover:opacity-90'
      }`}
      style={!outline ? { backgroundColor: '#F0DEC8' } : {}}
    >
      {children}
    </button>
  )

  return (
    <AppLayout title={t('questionnaire.title')} userName={userName}>
      <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-8">
        <div className="rounded-2xl p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#EBF3F9' }}>

          <StepIndicator step={step} />

          <div className="mt-6 sm:mt-8">
            {step === 1 && <StepDataDiri   form={form} options={options} onInput={handleInput} set={set} />}
            {step === 2 && <StepGejala     form={form} set={set} />}
            {step === 3 && result && <StepHasilRF result={result} />}
            {step === 4 && <StepUploadFoto onResult={setImageResult} />}
            {step === 5 && <StepRingkasan  form={form} result={result} imageResult={imageResult} />}
          </div>

          {error && (
            <p className="mt-4 text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6 sm:mt-8">
            {step > 1 && step !== 3 ? (
              <NavBtn outline onClick={() => setStep(s => s - 1)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                {t('questionnaire.back')}
              </NavBtn>
            ) : <div />}

            {step === 3 ? (
              result?.hasil_risiko === 'BERISIKO' ? (
                <NavBtn onClick={() => setStep(4)}>
                  {t('questionnaire.next')}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </NavBtn>
              ) : (
                <NavBtn onClick={() => navigate('/dashboard')}>{t('questionnaire.finish')}</NavBtn>
              )
            ) : step === 4 ? (
              <NavBtn onClick={() => setStep(5)} disabled={!imageResult}>
                {t('questionnaire.next')}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </NavBtn>
            ) : step === 2 ? (
              <NavBtn onClick={() => canProceed() && handleSubmitAndNext()} disabled={!canProceed() || submitting}>
                {submitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-[#4A3020]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    {t('questionnaire.processing')}
                  </>
                ) : (
                  <>
                    {t('questionnaire.next')}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </>
                )}
              </NavBtn>
            ) : step < TOTAL_STEPS ? (
              <NavBtn onClick={() => canProceed() && setStep(s => s + 1)} disabled={!canProceed()}>
                {t('questionnaire.next')}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </NavBtn>
            ) : (
              <NavBtn onClick={() => navigate('/dashboard')}>
                {t('questionnaire.finish')}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </NavBtn>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
