import LandingLayout from '../components/landing/LandingLayout';
import Hero from '../components/landing/Hero';
import ProductsOverviewSection from '../components/landing/ProductsOverviewSection';
import TransactionsToIntelligence from '../components/landing/TransactionsToIntelligence';
import SpotlightSection from '../components/landing/SpotlightSection';
import BusinessIntelligenceReports from '../components/landing/BusinessIntelligenceReports';
import Compliance from '../components/landing/Compliance';

export default function Landing() {
  return (
    <LandingLayout path="/">
      <Hero />
      <ProductsOverviewSection />
      <section className="pt-20 md:pt-28 pb-4 md:pb-8 landing-surface-tinted relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <TransactionsToIntelligence />
        </div>
      </section>
      <SpotlightSection />
      <section className="py-20 md:py-28 landing-surface-tinted relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <BusinessIntelligenceReports />
        </div>
      </section>
      <Compliance />
    </LandingLayout>
  );
}
