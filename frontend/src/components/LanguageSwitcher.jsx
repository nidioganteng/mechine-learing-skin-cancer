import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher({ variant = 'light' }) {
  const { i18n } = useTranslation()
  const current = i18n.language

  function toggle() {
    i18n.changeLanguage(current === 'id' ? 'en' : 'id')
  }

  const isDark = variant === 'dark'

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all border ${
        isDark
          ? 'border-white/20 text-white hover:bg-white/10'
          : 'border-[#D8E8F0] text-[#12283A] hover:bg-[#EBF3F9]'
      }`}
      title={current === 'id' ? 'Switch to English' : 'Ganti ke Indonesia'}
    >
      <span className="text-[14px]">{current === 'id' ? '🇮🇩' : '🇬🇧'}</span>
      <span>{current === 'id' ? 'ID' : 'EN'}</span>
    </button>
  )
}
