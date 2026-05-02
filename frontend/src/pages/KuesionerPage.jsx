import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
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

  function set(field) {
    return val => setForm(f => ({ ...f, [field]: val }))
  }

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
    setSubmitting(true)
    setError('')
    try {
      const res = await submitKuesioner({
        usia: form.usia, gender: form.gender, tipe_kulit: form.tipe_kulit,
        paparan_uv: form.paparan_uv, riwayat_keluarga: form.riwayat_keluarga,
        jumlah_tahi_lalat: form.jumlah_tahi_lalat, diameter_mm: form.diameter_mm,
        asimetris: form.asimetris, tepi_kasar: form.tepi_kasar,
        warna_bervariasi: form.warna_bervariasi, evolusi: form.evolusi,
        gatal: form.gatal, berdarah: form.berdarah,
      })
      if (res.status === 'success') {
        setResult(res)
        setStep(3)
      } else {
        setError(res.pesan || 'Terjadi kesalahan.')
      }
    } catch (err) {
      if (err.response?.status === 401) navigate('/login')
      else setError('Terjadi kesalahan. Coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex h-screen font-['Poppins'] bg-white overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-10 py-5 border-b border-gray-200">
          <h1 className="text-[22px] font-bold text-[#12283A]">Analisis Kulit</h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-[15px]"
              style={{ backgroundColor: '#7B9DB8' }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-[15px] font-medium text-[#12283A]">{userName}</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-10 py-8">
          <div className="rounded-2xl p-8" style={{ backgroundColor: '#EBF3F9' }}>
            <StepIndicator step={step} />

            <div className="mt-8">
              {step === 1 && <StepDataDiri   form={form} options={options} onInput={handleInput} set={set} />}
              {step === 2 && <StepGejala     form={form} set={set} />}
              {step === 3 && result && <StepHasilRF result={result} />}
              {step === 4 && <StepUploadFoto onResult={setImageResult} />}
              {step === 5 && <StepRingkasan  form={form} result={result} imageResult={imageResult} />}
            </div>

            {error && (
              <p className="mt-4 text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
            )}

            {/* Navigasi */}
            <div className="flex justify-between mt-8">
              {step > 1 && step !== 3 ? (
                <button onClick={() => setStep(s => s - 1)}
                  className="px-6 py-3 rounded-full text-[14px] font-semibold text-[#12283A] border border-[#D0D8E0] bg-white hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Back
                </button>
              ) : <div />}

              {step === 3 ? (
                result?.hasil_risiko === 'BERISIKO' ? (
                  <button onClick={() => setStep(4)}
                    className="flex items-center gap-2 px-8 py-3 rounded-full text-[14px] font-semibold text-[#4A3020] transition-all hover:opacity-90"
                    style={{ backgroundColor: '#F0DEC8' }}>
                    Next
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                ) : (
                  <button onClick={() => navigate('/dashboard')}
                    className="px-8 py-3 rounded-full text-[14px] font-semibold text-[#4A3020] transition-all hover:opacity-90"
                    style={{ backgroundColor: '#F0DEC8' }}>
                    Selesai
                  </button>
                )
              ) : step === 4 ? (
                <button onClick={() => setStep(5)} disabled={!imageResult}
                  className="flex items-center gap-2 px-8 py-3 rounded-full text-[14px] font-semibold text-[#4A3020] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#F0DEC8' }}>
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ) : step === 2 ? (
                <button onClick={() => canProceed() && handleSubmitAndNext()} disabled={!canProceed() || submitting}
                  className="flex items-center gap-2 px-8 py-3 rounded-full text-[14px] font-semibold text-[#4A3020] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#F0DEC8' }}>
                  {submitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4 text-[#4A3020]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    <>
                      Next
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </>
                  )}
                </button>
              ) : step < TOTAL_STEPS ? (
                <button onClick={() => canProceed() && setStep(s => s + 1)} disabled={!canProceed()}
                  className="flex items-center gap-2 px-8 py-3 rounded-full text-[14px] font-semibold text-[#4A3020] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#F0DEC8' }}>
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ) : (
                <button onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 px-8 py-3 rounded-full text-[14px] font-semibold text-[#4A3020] transition-all hover:opacity-90"
                  style={{ backgroundColor: '#F0DEC8' }}>
                  Selesai
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
