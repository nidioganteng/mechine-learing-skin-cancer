import { useTranslation } from 'react-i18next'

const STEP_ICONS = ['👤', '📝', '📷', '✅']

export default function HowItWorksSection() {
  const { t } = useTranslation()
  const steps = t('howItWorks.steps', { returnObjects: true })

  return (
    <section
      className="px-[8%] py-16 lg:py-24 relative overflow-hidden"
      style={{ backgroundColor: '#BACED9' }}
    >
      <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full pointer-events-none"
        style={{ backgroundColor: '#6CD0F6', opacity: 0.2, filter: 'blur(70px)' }} />
      <div className="absolute -left-24 bottom-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ backgroundColor: '#12283A', opacity: 0.06, filter: 'blur(60px)' }} />

      <div className="text-center mb-10 lg:mb-16 relative z-10">
        <span className="text-[#1B3A4B]/60 text-sm font-semibold tracking-widest uppercase">
          {t('howItWorks.badge')}
        </span>
        <h2 className="font-['Kalnia'] text-[30px] sm:text-[36px] lg:text-[42px] font-medium text-[#12283A] leading-[1.2] mt-3">
          {t('howItWorks.heading')}
        </h2>
        <p className="text-[#1B3A4B]/70 text-[14px] lg:text-[16px] leading-[1.6] mt-4 max-w-lg mx-auto">
          {t('howItWorks.subtitle')}
        </p>
      </div>

      <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 z-10">
        <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px"
          style={{ backgroundColor: 'rgba(18,40,58,0.2)' }} />

        {steps.map((step, i) => (
          <div key={i} className="relative flex flex-col items-center text-center">
            <div className="relative mb-5 lg:mb-6">
              <div
                className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center text-xl lg:text-2xl shadow-sm"
                style={{ border: '2px solid rgba(18,40,58,0.12)' }}
              >
                {STEP_ICONS[i]}
              </div>
              <span
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                style={{ backgroundColor: '#12283A' }}
              >
                {i + 1}
              </span>
            </div>
            <h3 className="font-['Kalnia'] text-[17px] lg:text-[19px] font-medium text-[#12283A] mb-2">
              {step.title}
            </h3>
            <p className="text-[#1B3A4B]/70 text-[13px] lg:text-[14px] leading-[1.6]">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
