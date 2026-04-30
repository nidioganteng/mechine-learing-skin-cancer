import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Email dan password wajib diisi.')
      return
    }
    setIsLoading(true)
    // TODO: integrasi API
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="min-h-screen flex font-['Poppins']">

      {/* Kiri — Brand Panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] px-14 py-12"
        style={{ backgroundColor: '#12283A' }}
      >
        {/* Logo */}
        <div className="font-['Kalnia'] text-[26px] text-white">
          YourSKIN
        </div>

        {/* Tengah — Tagline */}
        <div>
          <div
            className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: 'rgba(108,208,246,0.15)', color: '#6CD0F6' }}
          >
            Deteksi Dini · AI-Powered
          </div>
          <h2 className="font-['Kalnia'] text-[38px] leading-[1.2] text-white font-medium mb-5">
            Selamat Datang<br />Kembali
          </h2>
          <p className="text-[#7FA8BE] text-[15px] leading-[1.7] max-w-sm">
            Masuk untuk melanjutkan analisis kulit Anda dengan teknologi
            Random Forest dan EfficientNet-B3 kami.
          </p>

          {/* Stats */}
          <div className="flex gap-8 mt-10">
            {[
              { val: '95%', label: 'Akurasi Model' },
              { val: '7', label: 'Kelas Diagnosis' },
              { val: '2', label: 'Tahap Analisis' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-[22px] font-bold text-white">{s.val}</div>
                <div className="text-[12px] text-[#7FA8BE] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dekorasi bawah */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: 'rgba(108,208,246,0.2)' }} />
          <div className="w-5 h-5 rounded-full" style={{ backgroundColor: 'rgba(186,206,217,0.2)' }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(108,208,246,0.1)' }} />
        </div>
      </div>

      {/* Kanan — Form Panel */}
      <div className="flex-1 flex flex-col bg-white overflow-y-auto">

        {/* Logo mobile */}
        <div className="lg:hidden font-['Kalnia'] text-[24px] text-[#12283A] pt-10 px-6 sm:px-12">
          YourSKIN
        </div>

        {/* Area tengah — form */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-10">
        <div className="w-full max-w-100">
          <h1 className="font-['Kalnia'] text-[30px] text-[#12283A] font-medium mb-1">
            Masuk
          </h1>
          <p className="text-[#4A6070] text-[14px] mb-8">
            Belum punya akun?{' '}
            <Link to="/register" className="text-[#6CD0F6] font-semibold hover:underline">
              Daftar sekarang
            </Link>
          </p>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-[13px] text-red-700 bg-red-50 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#12283A]">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="nama@email.com"
                className="w-full px-4 py-3 rounded-xl border border-[#D8E8F0] text-[14px] text-[#12283A] placeholder-[#A8BEC9] outline-none transition-all duration-200 focus:border-[#6CD0F6] focus:ring-3 focus:ring-[#6CD0F6]/15"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-semibold text-[#12283A]">
                  Password
                </label>
                <button type="button" className="text-[12px] text-[#6CD0F6] hover:underline font-medium">
                  Lupa password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-[#D8E8F0] text-[14px] text-[#12283A] placeholder-[#A8BEC9] outline-none transition-all duration-200 focus:border-[#6CD0F6] focus:ring-3 focus:ring-[#6CD0F6]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7FA8BE] hover:text-[#12283A] transition-colors"
                >
                  {showPassword ? (
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full text-white text-[15px] font-semibold transition-all duration-300 mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#6CD0F6',
                boxShadow: isLoading ? 'none' : '0 4px 15px rgba(108,208,246,0.35)',
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Memproses...
                </span>
              ) : 'Masuk →'}
            </button>

          </form>
        </div>
        </div>

        {/* Footer */}
        <p className="pb-6 text-[12px] text-[#A8BEC9] text-center">
          © 2025 YourSKIN · Sistem Deteksi Kanker Kulit
        </p>
      </div>

    </div>
  )
}
