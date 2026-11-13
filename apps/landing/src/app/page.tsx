'use client';

import { PricingComparisonSection } from '@/components/sections/PricingComparisonSection/PricingComparisonSection';
import { FaqSection } from '@/components/sections/FaqSection/FaqSection';
import { ArrowRight, CheckCircle2, ChevronRight, Store, Smartphone, Receipt, Layers, ScanLine, ShoppingBag, Smile, CheckCircle } from 'lucide-react';
import { HeroSection } from '@/components/sections/HeroSection/HeroSection';
import { TransitionSection } from '@/components/sections/TransitionSection/TransitionSection';
import { CaseStudySection } from '@/components/sections/CaseStudySection/CaseStudySection';
import { BrandsStrip } from '@/components/sections/BrandsStrip/BrandsStrip';
import { FeaturesParallax } from '@/components/sections/FeaturesParallax/FeaturesParallax';
import { ControlTowerSection } from '@/components/sections/ControlTowerSection/ControlTowerSection';
import { FeaturesBentoSection } from '@/components/sections/FeaturesBentoSection/FeaturesBentoSection';
import { OperationalFlowSection } from '@/components/sections/OperationalFlowSection/OperationalFlowSection';

export default function LandingPage() {
  return (
    <main className="flex flex-col font-sans w-full">
      
      <HeroSection />

      <TransitionSection />
      
      <CaseStudySection />

      <BrandsStrip />

      <FeaturesParallax />

      <ControlTowerSection />
      
      <FeaturesBentoSection />
      
      <OperationalFlowSection />
      
      <FaqSection />

      <PricingComparisonSection />
    </main>
  );
}
