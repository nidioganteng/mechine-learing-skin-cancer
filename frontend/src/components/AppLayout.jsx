import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Sidebar from './Sidebar'
import LanguageSwitcher from './LanguageSwitcher'

export default function AppLayout({ title, userName = '', children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { t: _t } = useTranslation()

  const initial = userName.charAt(0).toUpperCase()

  return (
    <div className="flex h-screen font-['Poppins'] bg-white overflow-hidden">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — drawer on mobile, static on desktop */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-30 h-full transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Header */}
        <header className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-4 lg:py-5 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1 rounded-lg text-[#12283A] hover:bg-gray-100 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h1 className="text-[18px] sm:text-[20px] lg:text-[22px] font-bold text-[#12283A]">{title}</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            {userName && (
              <>
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-[13px] sm:text-[15px] shrink-0"
                  style={{ backgroundColor: '#7B9DB8' }}
                >
                  {initial}
                </div>
                <span className="hidden sm:block text-[14px] lg:text-[15px] font-medium text-[#12283A] truncate max-w-30">
                  {userName}
                </span>
              </>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
