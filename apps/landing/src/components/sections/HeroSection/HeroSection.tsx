'use client';

import { useEffect, useState } from 'react';
import { Smartphone } from 'lucide-react';

import { useModals } from '@/components/layout/GlobalLayoutProvider/GlobalLayoutProvider';

export function HeroSection() {
  const { openQuoteModal, openDemoModal } = useModals();
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Get scroll progress between 0 and 1 over the first 600px of scroll
          const progress = Math.min(Math.max(window.scrollY / 600, 0), 1);
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call to set correct state if the page loads partially scrolled
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Advanced 3D scroll animation calculation
  // RotateX goes from 30deg (tilted back) to 0deg (flat)
  const rotateX = 30 - (30 * scrollProgress);
  // Scale goes from 0.9 to 1.02 (overflow-hidden on the section prevents scrollbars)
  const scale = 0.9 + (0.12 * scrollProgress);
  // Translate goes from 150px down to 0px
  const translateY = 150 - (150 * scrollProgress);

  return (
    <section className="w-full pt-20 sm:pt-32 pb-0 flex flex-col items-center text-center relative z-10 bg-surface-primary">
      {/* SUBTLE BACKGROUND ACCENT */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] aspect-square rounded-full bg-action-primary/5 blur-[120px] -z-10 pointer-events-none" />

      {/* TEXT CONTENT */}
      <div className="px-6 flex flex-col items-center">
        <h1 className="text-5xl sm:text-7xl lg:text-[88px] font-extrabold tracking-tight max-w-5xl leading-[1.05] mb-8 text-balance text-text-primary">
          Food your customers see <span className="text-action-primary">before it arrives.</span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-text-secondary max-w-3xl mb-12 leading-relaxed text-balance font-medium">
          An interactive menu where dishes land on the table exactly as diners choose, in an experience that feels entirely yours.
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center mb-4 relative z-10">
          <button
            onClick={openDemoModal}
            className="w-full sm:w-auto px-8 py-4 bg-action-primary text-white font-bold rounded-xl text-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all active:scale-[0.98]"
          >
            Book a demo
          </button>
          <button
            onClick={openQuoteModal}
            className="w-full sm:w-auto px-8 py-4 bg-surface-primary text-text-primary font-bold rounded-xl text-lg border-2 border-border-default hover:border-border-strong hover:bg-surface-secondary transition-all"
          >
            Contact sales
          </button>
        </div>
      </div>

      {/* MOCKUP PLACEHOLDER WITH 3D SCROLL ANIMATION */}
      <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-12 relative z-20" style={{ perspective: '2000px' }}>
        <div 
          className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] rounded-3xl sm:rounded-[2.5rem] bg-surface-primary border-[8px] sm:border-[12px] border-text-primary flex items-center justify-center overflow-hidden will-change-transform"
          style={{ 
            transform: `translateY(${translateY}px) scale(${scale}) rotateX(${rotateX}deg)`,
            transformStyle: 'preserve-3d',
            transformOrigin: 'bottom center',
            boxShadow: `0 ${30 + (20 * scrollProgress)}px ${60 + (40 * scrollProgress)}px -20px rgba(0,0,0,${0.2 + (0.1 * scrollProgress)})`,
          }}
        >
          {/* Inner screen content */}
          <div className="absolute inset-0 bg-surface-secondary flex flex-col items-center justify-center p-8">
            <Smartphone className="w-16 h-16 sm:w-20 sm:h-20 text-border-strong mb-6 opacity-60" />
            <div className="text-center z-10">
              <h3 className="text-xl sm:text-2xl font-bold text-text-secondary mb-3">Interactive 520ms Ordering Demo</h3>
              <p className="text-text-tertiary font-medium">Product animation mounts here</p>
            </div>
            
            {/* Abstract UI Elements to give it a "dashboard/app" feel */}
            <div className="absolute top-6 left-6 right-6 h-14 bg-surface-primary rounded-xl shadow-sm border border-border-default opacity-40 hidden sm:block" />
            <div className="absolute top-24 left-6 w-56 bottom-0 bg-surface-primary rounded-t-xl shadow-sm border-x border-t border-border-default opacity-40 hidden lg:block" />
            <div className="absolute top-24 left-6 lg:left-64 right-6 bottom-0 bg-surface-primary rounded-t-xl shadow-sm border-x border-t border-border-default opacity-40" />
          </div>
        </div>
      </div>
    </section>
  );
}
