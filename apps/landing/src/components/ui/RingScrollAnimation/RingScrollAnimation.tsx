'use client';

import { useEffect, useRef, useState } from 'react';

interface RingScrollAnimationProps {
  /** 
   * The background color of the section this is placed in.
   * Used for the gradient fade mask.
   * @default 'surface-primary'
   */
  fadeColor?: 'surface-primary' | 'surface-secondary';
}

export function RingScrollAnimation({ fadeColor = 'surface-primary' }: RingScrollAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Progress from 0 (entered screen from bottom) to 1 (left screen at top)
            const totalDistance = windowHeight + rect.height;
            const scrolled = windowHeight - rect.top;
            
            let rawProgress = scrolled / totalDistance;
            rawProgress = Math.max(0, Math.min(1, rawProgress));
            
            setScrollProgress(rawProgress);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initialize immediately
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Chill, calm, slow expansion. Starts small and expands moderately.
  const scale = 0.1 + (1.2 * scrollProgress);
  
  // Base opacity is 40%, fading down to 0 as it reaches the end
  const opacity = Math.max(0, Math.min(0.4, 0.4 - (0.4 * scrollProgress)));
  
  const fadeClass = fadeColor === 'surface-primary' 
    ? 'from-surface-primary via-transparent to-surface-primary'
    : 'from-surface-secondary via-transparent to-surface-secondary';

  return (
    <div 
      ref={containerRef}
      className="absolute top-0 left-1/2 w-[2000px] h-[2000px] flex items-center justify-center pointer-events-none z-0 will-change-transform"
      style={{
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity: opacity,
        transition: 'transform 0.1s ease-out, opacity 0.1s ease-out'
      }}
    >
      <div className="absolute w-[10%] h-[10%] rounded-full border border-border-strong/80" />
      <div className="absolute w-[30%] h-[30%] rounded-full border border-border-strong/50" />
      <div className="absolute w-[50%] h-[50%] rounded-full border border-border-default/80" />
      <div className="absolute w-[70%] h-[70%] rounded-full border border-border-default/60" />
      <div className="absolute w-[90%] h-[90%] rounded-full border border-border-default/40" />
      <div className="absolute w-[110%] h-[110%] rounded-full border border-border-default/20" />
      
      {/* Fade gradients so the edges seamlessly blend into the background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${fadeClass}`} />
    </div>
  );
}
