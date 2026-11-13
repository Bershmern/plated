'use client';

import { CheckCircle2 } from 'lucide-react';
import { useModals } from '@/components/layout/GlobalLayoutProvider/GlobalLayoutProvider';

export interface FeatureHeroProps {
  title: string;
  description: string;
  bullets: string[];
  imageComponent?: React.ReactNode;
}

export function FeatureHero({ title, description, bullets, imageComponent }: FeatureHeroProps) {
  const { openDemoModal } = useModals();
  
  return (
    <section className="w-full bg-surface-primary pt-32 pb-24 px-4 sm:px-6 flex justify-center overflow-hidden">
      <div className="w-full max-w-[1200px] grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Text Content */}
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-text-primary leading-[1.1] text-balance">
            {title}
          </h1>
          <p className="text-[17px] text-text-secondary leading-relaxed font-medium max-w-xl">
            {description}
          </p>
          
          <div className="flex flex-col gap-3 mt-2">
            {bullets.map((bullet, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-action-primary flex-shrink-0 mt-0.5" />
                <span className="text-text-primary font-medium text-[15px] leading-relaxed">{bullet}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <button
              onClick={openDemoModal}
              className="px-8 py-4 bg-action-primary text-white font-bold rounded-xl text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto"
            >
              Book a demo
            </button>
          </div>
        </div>

        {/* Image / Graphic - Bleeding off the right edge */}
        <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] flex items-center">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[800px] sm:w-[1000px] lg:w-[1200px] aspect-[16/10] sm:aspect-[16/9] rounded-l-3xl rounded-r-none border border-r-0 border-border-default shadow-2xl bg-surface-primary flex flex-col overflow-hidden">
            {/* Fake Dashboard Header */}
            <div className="h-14 sm:h-16 w-full border-b border-border-default bg-surface-secondary flex items-center px-6 gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="h-6 sm:h-8 w-64 bg-surface-primary border border-border-default rounded-md" />
            </div>
            
            {/* Fake Dashboard Body */}
            <div className="flex-1 w-full flex">
              {/* Fake Sidebar */}
              <div className="w-48 sm:w-64 h-full border-r border-border-default bg-surface-secondary/30 p-6 flex flex-col gap-4 hidden sm:flex">
                <div className="h-4 w-3/4 bg-border-default rounded-sm" />
                <div className="h-4 w-1/2 bg-border-default rounded-sm opacity-50" />
                <div className="h-4 w-2/3 bg-border-default rounded-sm opacity-50" />
                <div className="h-4 w-5/6 bg-border-default rounded-sm opacity-50" />
              </div>
              {/* Fake Content Area */}
              <div className="flex-1 p-6 sm:p-8 bg-surface-primary relative">
                {imageComponent ? (
                  imageComponent
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-text-tertiary font-bold text-xl uppercase tracking-widest text-center px-6">
                      Dynamic UI Graphic<br/>
                      <span className="text-sm font-medium normal-case tracking-normal opacity-70 mt-2 block">Bleeding off the screen edge</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
