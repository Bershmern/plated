import { PricingHeroSection } from '@/components/sections/pricing/PricingHeroSection/PricingHeroSection';
import { TestimonialCarousel } from '@/components/sections/pricing/TestimonialCarousel/TestimonialCarousel';
import { PricingComparisonSection } from '@/components/sections/PricingComparisonSection/PricingComparisonSection';

export const metadata = {
  title: 'Pricing | Plated',
  description: 'Transparent pricing for restaurants of all sizes.',
};

export default function PricingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#FAFAFA] w-full">
      <PricingHeroSection />
      <TestimonialCarousel />
      <PricingComparisonSection />
    </main>
  );
}
