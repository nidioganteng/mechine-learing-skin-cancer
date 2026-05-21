import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { register } from '../../services/api'
import LanguageSwitcher from '../../components/LanguageSwitcher'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [form, setForm] = useState({
    nama_lengkap: '', email: '', password: '', konfirmasi_password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showKonfirmasi, setShowKonfirmasi] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const { nama_lengkap, email, password, konfirmasi_password } = form
    if (!nama_lengkap || !email || !password || !konfirmasi_password) {
      setError(t('auth.register.error.allRequired')); return
    }
    if (password.length < 8) {
      setError(t('auth.register.error.minPassword')); return
    }
    if (password !== konfirmasi_password) {
      setError(t('auth.register.error.passwordMismatch')); return
    }
    setIsLoading(true)
    try {
      const res = await register(nama_lengkap, email, password)
      setSuccess(res.message)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      const msg = err.response?.data?.message || t('auth.register.error.general')
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = (() => {
    const p = form.password
    if (!p) return null
    if (p.length < 8) return { label: t('auth.register.strength.tooShort'), color: '#EF4444', width: '25%' }
    if (p.length < 10) return { label: t('auth.register.strength.weak'), color: '#F59E0B', width: '50%' }
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) return { label: t('auth.register.strength.strong'), color: '#10B981', width: '100%' }
    return { label: t('auth.register.strength.medium'), color: '#6CD0F6', width: '75%' }
  })()

  const steps = t('auth.register.steps', { returnObjects: true })

  return (
    <div className="min-h-screen flex font-['Poppins']">

      {/* Kiri — Brand Panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] px-14 py-12"
        style={{ backgroundColor: '#12283A' }}
      >
        <div className="font-['Kalnia'] text-[26px] text-white">YourSKIN</div>

        <div>
          <div
            className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: 'rgba(108,208,246,0.15)', color: '#6CD0F6' }}
          >
            {t('auth.register.tagline')}
          </div>
          <h2 className="font-['Kalnia'] text-[38px] leading-[1.2] text-white font-medium mb-5">
            {t('auth.register.heading')}
          </h2>
          <p className="text-[#7FA8BE] text-[15px] leading-[1.7] max-w-sm">
            {t('auth.register.subtitle')}
          </p>

          <div className="flex flex-col gap-4 mt-10">
            {steps.map((text, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ backgroundColor: 'rgba(108,208,246,0.15)', color: '#6CD0F6' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <span className="text-[14px] text-[#A8C4D4]">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: 'rgba(108,208,246,0.2)' }} />
          <div className="w-5 h-5 rounded-full" style={{ backgroundColor: 'rgba(186,206,217,0.2)' }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(108,208,246,0.1)' }} />
        </div>
      </div>

      {/* Kanan — Form Panel */}
      <div className="flex-1 flex flex-col bg-white overflow-y-auto">

        <div className="flex items-center justify-between pt-10 px-6 sm:px-12">
          <div className="lg:hidden font-['Kalnia'] text-[24px] text-[#12283A]">YourSKIN</div>
          <div className="ml-auto">
            <LanguageSwitcher />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-10">
        <div className="w-full max-w-100">
          <h1 className="font-['Kalnia'] text-[30px] text-[#12283A] font-medium mb-1">
            {t('auth.register.title')}
          </h1>
          <p className="text-[#4A6070] text-[14px] mb-8">
            {t('auth.register.hasAccount')}{' '}
            <Link to="/login" className="text-[#6CD0F6] font-semibold hover:underline">
              {t('auth.register.login')}
            </Link>
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-[13px] text-red-700 bg-red-50 border border-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 px-4 py-3 rounded-xl text-[13px] text-emerald-700 bg-emerald-50 border border-emerald-200">
              {success} {t('auth.register.successRedirect')}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#12283A]">{t('auth.register.fullName')}</label>
              <input type="text" name="nama_lengkap" value={form.nama_lengkap} onChange={handleChange}
                placeholder={t('auth.register.fullNamePlaceholder')}
                className="w-full px-4 py-3 rounded-xl border border-[#D8E8F0] text-[14px] text-[#12283A] placeholder-[#A8BEC9] outline-none transition-all duration-200 focus:border-[#6CD0F6] focus:ring-3 focus:ring-[#6CD0F6]/15" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#12283A]">{t('auth.register.email')}</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder={t('auth.register.emailPlaceholder')}
                className="w-full px-4 py-3 rounded-xl border border-[#D8E8F0] text-[14px] text-[#12283A] placeholder-[#A8BEC9] outline-none transition-all duration-200 focus:border-[#6CD0F6] focus:ring-3 focus:ring-[#6CD0F6]/15" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#12283A]">{t('auth.register.password')}</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                  placeholder={t('auth.register.passwordPlaceholder')}
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-[#D8E8F0] text-[14px] text-[#12283A] placeholder-[#A8BEC9] outline-none transition-all duration-200 focus:border-[#6CD0F6] focus:ring-3 focus:ring-[#6CD0F6]/15" />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7FA8BE] hover:text-[#12283A] transition-colors">
                  {showPassword
                    ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {passwordStrength && (
                <div className="mt-1.5">
                  <div className="h-1 w-full bg-[#EEF5F9] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-300"
                      style={{ width: passwordStrength.width, backgroundColor: passwordStrength.color }} />
                  </div>
                  <span className="text-[11px] mt-1 block" style={{ color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#12283A]">{t('auth.register.confirmPassword')}</label>
              <div className="relative">
                <input
                  type={showKonfirmasi ? 'text' : 'password'}
                  name="konfirmasi_password" value={form.konfirmasi_password} onChange={handleChange}
                  placeholder={t('auth.register.confirmPasswordPlaceholder')}
                  className={`w-full px-4 py-3 pr-11 rounded-xl border text-[14px] text-[#12283A] placeholder-[#A8BEC9] outline-none transition-all duration-200 focus:ring-3 ${
                    form.konfirmasi_password && form.konfirmasi_password !== form.password
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                      : 'border-[#D8E8F0] focus:border-[#6CD0F6] focus:ring-[#6CD0F6]/15'
                  }`}
                />
                <button type="button" onClick={() => setShowKonfirmasi(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7FA8BE] hover:text-[#12283A] transition-colors">
                  {showKonfirmasi
                    ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {form.konfirmasi_password && form.konfirmasi_password !== form.password && (
                <span className="text-[11px] text-red-500 mt-0.5">{t('auth.register.error.passwordNoMatch')}</span>
              )}
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full py-3.5 rounded-full text-white text-[15px] font-semibold transition-all duration-300 mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#6CD0F6', boxShadow: isLoading ? 'none' : '0 4px 15px rgba(108,208,246,0.35)' }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  {t('auth.register.loading')}
                </span>
              ) : t('auth.register.submit')}
            </button>

          </form>
        </div>
        </div>

        <p className="pb-6 text-[12px] text-[#A8BEC9] text-center">
          {t('auth.register.footer')}
        </p>
      </div>

    </div>
  )
}
