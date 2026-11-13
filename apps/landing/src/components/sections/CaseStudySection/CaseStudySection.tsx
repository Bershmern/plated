import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export function CaseStudySection() {
  return (
    <section className="w-full relative pb-32 bg-surface-primary flex flex-col items-center px-4 sm:px-6">
      <div className="max-w-[1200px] min-h-[600px] w-full bg-surface-primary rounded-[2rem] sm:rounded-[2.5rem] border border-border-default shadow-sm overflow-hidden flex flex-col md:flex-row relative z-10">
        
        {/* LEFT COLUMN - TEXT */}
        <div className="flex-1 p-8 sm:p-12 md:p-16 flex flex-col justify-between">
          <div>
            {/* Logo placeholder */}
            <div className="w-24 h-10 border border-border-default rounded-md flex items-center justify-center font-bold text-text-primary tracking-wide mb-12 shadow-sm text-sm">
              BURGER CO.
            </div>
            
            <h3 className="text-3xl sm:text-4xl md:text-[40px] lg:text-[48px] font-bold text-text-primary leading-[1.05] mb-8 text-balance tracking-tight">
              Why we replaced our paper menus, and what happened next.
            </h3>
            
            <div className="flex flex-col gap-4">
              <a href="#" className="text-action-primary font-bold hover:underline flex items-center gap-1 group w-max underline-offset-4">
                Read the Case Study 
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a href="#" className="text-text-primary font-bold hover:underline flex items-center gap-1 group w-max underline-offset-4">
                View all customer stories 
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
          
          <div className="mt-16 md:mt-24">
            <p className="font-bold text-text-primary mb-2 text-lg">Rolled out across 15 locations.</p>
            <p className="text-text-secondary text-base leading-relaxed max-w-md">
              By replacing static paper menus with Plated's interactive visual menus, Burger Co. saw a 24% increase in AOV as diners consistently added premium sides they previously ignored.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN - IMAGE */}
        <div className="flex-1 relative min-h-[400px] md:min-h-full bg-surface-secondary border-t md:border-t-0 md:border-l border-border-default">
          <Image 
            src="/images/burger_case_study.jpg"
            alt="Burger Co. gourmet burger"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

      </div>
    </section>
  );
}
