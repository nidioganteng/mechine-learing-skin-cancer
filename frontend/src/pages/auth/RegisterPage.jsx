import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function RegisterPage() {
  const [form, setForm] = useState({
    nama_lengkap: '',
    email: '',
    password: '',
    konfirmasi_password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showKonfirmasi, setShowKonfirmasi] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const { nama_lengkap, email, password, konfirmasi_password } = form
    if (!nama_lengkap || !email || !password || !konfirmasi_password) {
      setError('Semua field wajib diisi.')
      return
    }
    if (password.length < 8) {
      setError('Password minimal 8 karakter.')
      return
    }
    if (password !== konfirmasi_password) {
      setError('Konfirmasi password tidak cocok.')
      return
    }
    setIsLoading(true)
    // TODO: integrasi API
    setTimeout(() => setIsLoading(false), 1000)
  }

  const passwordStrength = (() => {
    const p = form.password
    if (!p) return null
    if (p.length < 8) return { label: 'Terlalu pendek', color: '#EF4444', width: '25%' }
    if (p.length < 10) return { label: 'Lemah', color: '#F59E0B', width: '50%' }
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) return { label: 'Kuat', color: '#10B981', width: '100%' }
    return { label: 'Sedang', color: '#6CD0F6', width: '75%' }
  })()

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

        {/* Tengah */}
        <div>
          <div
            className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: 'rgba(108,208,246,0.15)', color: '#6CD0F6' }}
          >
            Bergabung Gratis
          </div>
          <h2 className="font-['Kalnia'] text-[38px] leading-[1.2] text-white font-medium mb-5">
            Mulai Perjalanan<br />Kesehatan Anda
          </h2>
          <p className="text-[#7FA8BE] text-[15px] leading-[1.7] max-w-sm">
            Buat akun dan dapatkan akses ke dua tahap analisis kulit
            bertenaga AI — kuesioner risiko dan deteksi gambar lesi.
          </p>

          {/* Steps */}
          <div className="flex flex-col gap-4 mt-10">
            {[
              { step: '01', text: 'Daftar & buat akun Anda' },
              { step: '02', text: 'Isi kuesioner gejala kulit' },
              { step: '03', text: 'Upload foto & dapatkan hasil' },
            ].map(s => (
              <div key={s.step} className="flex items-center gap-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ backgroundColor: 'rgba(108,208,246,0.15)', color: '#6CD0F6' }}
                >
                  {s.step}
                </div>
                <span className="text-[14px] text-[#A8C4D4]">{s.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dekorasi */}
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
            Buat Akun
          </h1>
          <p className="text-[#4A6070] text-[14px] mb-8">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-[#6CD0F6] font-semibold hover:underline">
              Masuk di sini
            </Link>
          </p>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-[13px] text-red-700 bg-red-50 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

            {/* Nama Lengkap */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#12283A]">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="nama_lengkap"
                value={form.nama_lengkap}
                onChange={handleChange}
                placeholder="Nama lengkap Anda"
                className="w-full px-4 py-3 rounded-xl border border-[#D8E8F0] text-[14px] text-[#12283A] placeholder-[#A8BEC9] outline-none transition-all duration-200 focus:border-[#6CD0F6] focus:ring-3 focus:ring-[#6CD0F6]/15"
              />
            </div>

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
              <label className="text-[13px] font-semibold text-[#12283A]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimal 8 karakter"
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
              {/* Password strength */}
              {passwordStrength && (
                <div className="mt-1.5">
                  <div className="h-1 w-full bg-[#EEF5F9] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: passwordStrength.width, backgroundColor: passwordStrength.color }}
                    />
                  </div>
                  <span className="text-[11px] mt-1 block" style={{ color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Konfirmasi Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#12283A]">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showKonfirmasi ? 'text' : 'password'}
                  name="konfirmasi_password"
                  value={form.konfirmasi_password}
                  onChange={handleChange}
                  placeholder="Ulangi password"
                  className={`w-full px-4 py-3 pr-11 rounded-xl border text-[14px] text-[#12283A] placeholder-[#A8BEC9] outline-none transition-all duration-200 focus:ring-3 ${
                    form.konfirmasi_password && form.konfirmasi_password !== form.password
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                      : 'border-[#D8E8F0] focus:border-[#6CD0F6] focus:ring-[#6CD0F6]/15'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowKonfirmasi(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7FA8BE] hover:text-[#12283A] transition-colors"
                >
                  {showKonfirmasi ? (
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
              {form.konfirmasi_password && form.konfirmasi_password !== form.password && (
                <span className="text-[11px] text-red-500 mt-0.5">Password tidak cocok</span>
              )}
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
              ) : 'Buat Akun →'}
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
