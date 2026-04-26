import HeroSection from './homepage/HeroSection'
import FeaturesSection from './homepage/FeaturesSection'
import HowItWorksSection from './homepage/HowItWorksSection'
import StatsSection from './homepage/StatsSection'
import CTASection from './homepage/CTASection'

export default function HomePage() {
  return (
    <div className="bg-white overflow-x-hidden font-['Poppins']">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <CTASection />
    </div>
  )
}
