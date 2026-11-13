import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function FeatureCaseStudyBanner() {
  return (
    <section className="w-full bg-[#FAFAFA] py-24 sm:py-32 flex flex-col items-center px-4 sm:px-6 relative z-10 border-b border-border-default">
      <div className="w-full max-w-[1200px] flex flex-col gap-4">
        
        {/* Label Above Card */}
        <div className="text-[#8B5CF6] font-semibold text-sm px-2">
          Featured Story
        </div>

        {/* Main Card Container */}
        <div className="w-full bg-surface-primary rounded-[2rem] p-2 flex flex-col md:flex-row shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border-default">
          
          {/* Left Content Half */}
          <div className="w-full md:w-1/2 bg-[#F6F8FA] rounded-[1.5rem] p-8 sm:p-12 lg:p-16 flex flex-col min-h-[400px] lg:min-h-[600px]">
            
            {/* Fake Brand Logo */}
            <div className="mb-12">
              <div className="h-10 w-32 bg-white rounded-lg border border-border-default flex items-center justify-center shadow-sm">
                <span className="font-bold text-[#10B981] tracking-tight">one<span className="text-[#F43F5E]">with</span></span>
              </div>
            </div>

            {/* Text Content */}
            <div className="flex flex-col gap-6 flex-1">
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-text-primary leading-[1.1] text-balance">
                How Onewith Maximized Their Working Capital So They Could Grow 2x
              </h2>
              <p className="text-[17px] text-text-secondary leading-relaxed font-medium max-w-[90%]">
                Find out how Onewith transformed its swimwear business and doubled revenue by mastering inventory management with Plated.
              </p>
            </div>

            {/* Avatar / Author */}
            <div className="flex items-center gap-4 mt-12 pt-8">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-secondary border border-border-default flex items-center justify-center">
                <div className="text-xl">🧑‍🦱</div>
              </div>
              <div className="flex flex-col">
                <span className="text-text-primary font-bold text-[15px]">Sebastiaan Debrouwere</span>
                <span className="text-text-tertiary text-[14px] font-medium">Founder</span>
              </div>
            </div>
          </div>

          {/* Right Image Half */}
          <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-full rounded-b-[1.5rem] md:rounded-r-[1.5rem] md:rounded-bl-none overflow-hidden bg-[#FCA5A5] flex items-center justify-center mt-2 md:mt-0 md:ml-2">
            {/* We use a solid color background as placeholder, or a generic image */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="text-white font-bold text-xl tracking-widest uppercase opacity-80 px-6 text-center">
              Customer Photo
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
