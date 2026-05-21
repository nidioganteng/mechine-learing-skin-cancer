import { useTranslation } from 'react-i18next'

export default function CTASection() {
  const { t } = useTranslation()

  return (
    <section className="px-[8%] py-16 lg:py-24" style={{ backgroundColor: '#F2F8FC' }}>

      <div
        className="relative rounded-4xl lg:rounded-[40px] px-8 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20 overflow-hidden flex flex-col lg:flex-row items-center lg:justify-between gap-10 lg:gap-0"
        style={{ backgroundColor: '#12283A' }}
      >
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
          style={{ backgroundColor: '#6CD0F6', opacity: 0.15, filter: 'blur(70px)' }} />
        <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full pointer-events-none"
          style={{ backgroundColor: '#BACED9', opacity: 0.12, filter: 'blur(60px)' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(108,208,246,0.15) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />

        <div className="relative z-10 max-w-lg text-center lg:text-left">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5"
            style={{ backgroundColor: 'rgba(108,208,246,0.12)', color: '#6CD0F6', border: '1px solid rgba(108,208,246,0.25)' }}
          >
            {t('cta.badge')}
          </span>
          <h2 className="font-['Kalnia'] text-[32px] sm:text-[38px] lg:text-[44px] font-medium text-white leading-[1.15] mb-5">
            {t('cta.heading1')}<br />
            {t('cta.heading2')}
          </h2>
          <p className="text-white/55 text-[14px] lg:text-[16px] leading-[1.6]">
            {t('cta.subtitle')}
          </p>
        </div>

        <div className="relative z-10 flex flex-col gap-3 lg:gap-4 w-full lg:w-auto shrink-0">
          <a
            href="/register"
            className="inline-flex items-center justify-center text-[#12283A] text-[15px] lg:text-[16px] font-semibold no-underline px-8 lg:px-10 py-3.5 lg:py-4 rounded-full hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(108,208,246,0.35)] transition-all duration-300"
            style={{ backgroundColor: '#6CD0F6' }}
          >
            {t('cta.register')}
          </a>
          <a
            href="/login"
            className="inline-flex items-center justify-center text-white/70 text-[14px] lg:text-[15px] font-medium no-underline px-8 lg:px-10 py-3 rounded-full hover:text-white hover:bg-white/10 transition-all duration-300"
            style={{ border: '1px solid rgba(255,255,255,0.15)' }}
          >
            {t('cta.login')}
          </a>
        </div>
      </div>

      <div className="mt-8 lg:mt-12 flex flex-col sm:flex-row items-center justify-between gap-2 text-[#8AA5B5] text-[12px] lg:text-[13px] text-center sm:text-left">
        <span className="font-['Kalnia'] text-[18px] text-[#12283A]">YourSKIN</span>
        <span>{t('cta.footer')}</span>
        <span>{t('cta.academic')}</span>
      </div>

    </section>
  )
}
