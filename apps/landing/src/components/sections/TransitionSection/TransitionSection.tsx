'use client';

import { RingScrollAnimation } from '@/components/ui/RingScrollAnimation/RingScrollAnimation';

export function TransitionSection() {
  return (
    // We use a negative top margin to pull this section up so it flows seamlessly right underneath (and slightly behind) the hero mockup.
    <section className="w-full relative -mt-32 pt-56 pb-40 bg-transparent flex flex-col items-center justify-center">
      
      {/* CONCENTRIC CIRCLES SCROLL ANIMATION (Originates from underneath the Hero device) */}
      <RingScrollAnimation fadeColor="surface-primary" />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl px-6 mt-16">
        <span className="px-4 py-1.5 rounded-md bg-surface-secondary border border-border-default text-xs font-semibold text-text-secondary uppercase tracking-wider mb-8 shadow-sm">
          Announcement
        </span>
        
        <h2 className="text-4xl sm:text-5xl md:text-[64px] leading-[1.05] font-bold tracking-tight text-balance">
          <span className="text-text-tertiary">Your paper menu is a </span>
          <span className="text-text-primary">static list.</span>
        </h2>
        
        <p className="text-xl sm:text-2xl text-text-secondary text-center max-w-3xl leading-relaxed mt-8 mb-8 text-balance font-medium">
          It works, but it doesn't sell. Orders pile up in a backlog, waiters run back and forth to clarify requests, and your unique brand disappears into a generic ordering screen.
        </p>
      </div>

    </section>
  );
}
