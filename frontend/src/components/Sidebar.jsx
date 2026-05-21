import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Sidebar({ onClose }) {
  const { pathname } = useLocation()
  const { t } = useTranslation()

  const navItems = [
    {
      labelKey: 'nav.dashboard',
      to: '/dashboard',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      labelKey: 'nav.skinAnalysis',
      to: '/kuesioner',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="16" y2="17" />
        </svg>
      ),
    },
    {
      labelKey: 'nav.history',
      to: '/riwayat',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      labelKey: 'nav.profile',
      to: '/profil',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ]

  return (
    <aside
      className="w-64 h-full shrink-0 flex flex-col py-8 px-5 relative"
      style={{ backgroundColor: '#81A6C6' }}
    >
      {/* Close button — mobile only */}
      {onClose && (
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-1"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}

      <div className="font-['Kalnia'] text-[32px] text-white mb-10 px-1 text-center">
        YourSKIN
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(item => {
          const isActive = pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-full text-[16px] font-medium transition-colors ${
                isActive ? 'bg-white text-[#12283A]' : 'text-white hover:bg-white/15'
              }`}
            >
              {item.icon}
              {t(item.labelKey)}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
