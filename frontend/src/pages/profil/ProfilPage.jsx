import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AppLayout from '../../components/AppLayout'
import { getProfil, updateProfil, updatePassword } from '../../services/api'
import axios from 'axios'

function InputField({ label, value, onChange, type = 'text', placeholder, readOnly = false }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-[#12283A]">{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} readOnly={readOnly}
        className={`px-4 py-3 rounded-xl border text-[14px] text-[#12283A] outline-none transition-all placeholder-gray-300 ${
          readOnly
            ? 'border-[#D8E8F0] bg-gray-50 cursor-default text-gray-400'
            : 'border-[#D8E8F0] bg-white focus:border-[#7B9DB8] focus:ring-2 focus:ring-[#7B9DB8]/15'
        }`}
      />
    </div>
  )
}

function Toast({ msg, type }) {
  if (!msg) return null
  const isError = type === 'error'
  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-[13px] font-medium ${
      isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
    }`}>
      {isError
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      }
      {msg}
    </div>
  )
}

export default function ProfilPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [profil,       setProfil]       = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [namaEdit,     setNamaEdit]     = useState('')
  const [savingNama,   setSavingNama]   = useState(false)
  const [namaMsg,      setNamaMsg]      = useState({ text: '', type: '' })
  const [pwLama,       setPwLama]       = useState('')
  const [pwBaru,       setPwBaru]       = useState('')
  const [pwKonfirmasi, setPwKonfirmasi] = useState('')
  const [savingPw,     setSavingPw]     = useState(false)
  const [pwMsg,        setPwMsg]        = useState({ text: '', type: '' })
  const [showPwLama,   setShowPwLama]   = useState(false)
  const [showPwBaru,   setShowPwBaru]   = useState(false)

  useEffect(() => {
    getProfil()
      .then(res => {
        if (res.status === 'success') { setProfil(res); setNamaEdit(res.user.nama_lengkap) }
      })
      .catch(err => { if (err.response?.status === 401) navigate('/login') })
      .finally(() => setLoading(false))
  }, [navigate])

  async function handleSaveNama() {
    if (!namaEdit.trim()) return
    setSavingNama(true); setNamaMsg({ text: '', type: '' })
    try {
      const res = await updateProfil(namaEdit.trim())
      if (res.status === 'success') {
        setProfil(p => ({ ...p, user: { ...p.user, nama_lengkap: namaEdit.trim() } }))
        setNamaMsg({ text: t('profile.nameUpdated'), type: 'success' })
      } else {
        setNamaMsg({ text: res.message, type: 'error' })
      }
    } catch {
      setNamaMsg({ text: t('profile.error.general'), type: 'error' })
    } finally {
      setSavingNama(false)
    }
  }

  async function handleSavePassword() {
    setPwMsg({ text: '', type: '' })
    if (!pwLama || !pwBaru || !pwKonfirmasi) {
      setPwMsg({ text: t('profile.error.allRequired'), type: 'error' }); return
    }
    if (pwBaru !== pwKonfirmasi) {
      setPwMsg({ text: t('profile.error.passwordMismatch'), type: 'error' }); return
    }
    if (pwBaru.length < 6) {
      setPwMsg({ text: t('profile.error.minPassword'), type: 'error' }); return
    }
    setSavingPw(true)
    try {
      const res = await updatePassword(pwLama, pwBaru)
      if (res.status === 'success') {
        setPwMsg({ text: t('profile.passwordUpdated'), type: 'success' })
        setPwLama(''); setPwBaru(''); setPwKonfirmasi('')
      } else {
        setPwMsg({ text: res.message, type: 'error' })
      }
    } catch (err) {
      const msg = err.response?.data?.message ?? t('profile.error.general')
      setPwMsg({ text: msg, type: 'error' })
    } finally {
      setSavingPw(false)
    }
  }

  async function handleLogout() {
    try { await axios.get('/logout', { withCredentials: true }) } catch {}
    navigate('/login')
  }

  const user      = profil?.user
  const stats     = profil?.stats
  const inisial   = user?.nama_lengkap?.charAt(0)?.toUpperCase() ?? '?'
  const firstName = user?.nama_lengkap?.split(' ')[0] ?? ''

  const STAT_RISIKO = stats?.status_terakhir === 'BERISIKO'
    ? { label: t('profile.risky'),    color: '#EF4444' }
    : stats?.status_terakhir === 'TIDAK BERISIKO'
    ? { label: t('profile.notRisky'), color: '#10B981' }
    : null

  return (
    <AppLayout title={t('profile.title')} userName={firstName}>
      <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-8">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-[#7B9DB8] text-[15px]">{t('profile.loading')}</div>
        ) : (
          <div className="max-w-4xl flex flex-col gap-5 sm:gap-6">

            {/* Profile hero card */}
            <div className="rounded-2xl p-5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8"
              style={{ backgroundColor: '#EBF3F9' }}>

              {/* Avatar + info row on mobile */}
              <div className="flex items-center gap-4 sm:gap-0 sm:block w-full sm:w-auto">
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-white font-['Kalnia'] text-[28px] sm:text-[40px] shrink-0"
                  style={{ backgroundColor: '#7B9DB8' }}>
                  {inisial}
                </div>
                {/* Mobile: name/email next to avatar */}
                <div className="sm:hidden">
                  <h2 className="text-[18px] font-bold text-[#12283A]">{user?.nama_lengkap}</h2>
                  <p className="text-[13px] text-[#4A6070] mt-0.5">{user?.email}</p>
                </div>
              </div>

              <div className="flex-1 w-full sm:w-auto">
                {/* Desktop: name/email in main area */}
                <h2 className="hidden sm:block text-[24px] font-bold text-[#12283A]">{user?.nama_lengkap}</h2>
                <p className="hidden sm:block text-[14px] text-[#4A6070] mt-0.5">{user?.email}</p>

                <div className="flex items-center gap-4 sm:mt-4">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[#4A6070]">{t('profile.totalChecks')}</span>
                    <span className="text-[20px] sm:text-[22px] font-bold text-[#12283A]">{stats?.total_pengecekan ?? 0}</span>
                  </div>
                  {STAT_RISIKO && (
                    <>
                      <div className="w-px h-8 bg-[#B8D0E0]" />
                      <div className="flex flex-col">
                        <span className="text-[11px] text-[#4A6070]">{t('profile.lastStatus')}</span>
                        <span className="text-[13px] sm:text-[14px] font-bold" style={{ color: STAT_RISIKO.color }}>
                          {STAT_RISIKO.label}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Logout — full width on mobile, auto on desktop */}
              <button onClick={handleLogout}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-red-200 text-red-500 text-[13px] font-semibold hover:bg-red-50 transition-colors shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                {t('profile.logout')}
              </button>
            </div>

            {/* Edit cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">

              {/* Edit Nama */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col gap-4">
                <div>
                  <h3 className="text-[15px] sm:text-[16px] font-bold text-[#12283A]">{t('profile.editName')}</h3>
                  <p className="text-[13px] text-[#4A6070] mt-0.5">{t('profile.editNameSubtitle')}</p>
                </div>
                <InputField label={t('profile.email')} value={user?.email ?? ''} onChange={() => {}} readOnly placeholder="—" />
                <InputField label={t('profile.fullName')} value={namaEdit} onChange={setNamaEdit} placeholder={t('profile.fullNamePlaceholder')} />
                <Toast msg={namaMsg.text} type={namaMsg.type} />
                <button onClick={handleSaveNama}
                  disabled={savingNama || !namaEdit.trim() || namaEdit.trim() === user?.nama_lengkap}
                  className="mt-auto px-6 py-3 rounded-full text-[14px] font-semibold text-[#4A3020] transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#F0DEC8' }}>
                  {savingNama ? t('profile.saving') : t('profile.saveName')}
                </button>
              </div>

              {/* Ganti Password */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col gap-4">
                <div>
                  <h3 className="text-[15px] sm:text-[16px] font-bold text-[#12283A]">{t('profile.changePassword')}</h3>
                  <p className="text-[13px] text-[#4A6070] mt-0.5">{t('profile.changePasswordSubtitle')}</p>
                </div>

                {[
                  { label: t('profile.oldPassword'), val: pwLama, set: setPwLama, show: showPwLama, setShow: setShowPwLama },
                  { label: t('profile.newPassword'),  val: pwBaru, set: setPwBaru, show: showPwBaru, setShow: setShowPwBaru },
                ].map(({ label, val, set, show, setShow }, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-[#12283A]">{label}</label>
                    <div className="relative">
                      <input type={show ? 'text' : 'password'} value={val} onChange={e => set(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 pr-11 rounded-xl border border-[#D8E8F0] bg-white text-[14px] text-[#12283A] outline-none focus:border-[#7B9DB8] focus:ring-2 focus:ring-[#7B9DB8]/15" />
                      <button type="button" onClick={() => setShow(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {show
                          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                          : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#12283A]">{t('profile.confirmPassword')}</label>
                  <input type="password" value={pwKonfirmasi} onChange={e => setPwKonfirmasi(e.target.value)}
                    placeholder="••••••••"
                    className="px-4 py-3 rounded-xl border border-[#D8E8F0] bg-white text-[14px] text-[#12283A] outline-none focus:border-[#7B9DB8] focus:ring-2 focus:ring-[#7B9DB8]/15" />
                </div>

                <Toast msg={pwMsg.text} type={pwMsg.type} />

                <button onClick={handleSavePassword} disabled={savingPw}
                  className="mt-auto px-6 py-3 rounded-full text-[14px] font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#7B9DB8' }}>
                  {savingPw ? t('profile.saving') : t('profile.savePassword')}
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
