'use client';

import { Check, X } from 'lucide-react';

const comparisonData = [
  { feature: "Cost (Monthly)", col1: "Free", col2: "₦10,000 / month", col3: "$50+ / month" },
  { feature: "Commission", col1: "0%", col2: "0% on cash (0.5% online)", col3: "2-5% on all orders" },
  { feature: "Visual Fidelity", col1: "None", col2: "Full dish photography", col3: "Tiny thumbnails" },
  { feature: "White-Labelling", col1: "N/A", col2: "Your exact brand", col3: "Their logo everywhere" },
  { feature: "Offline Resiliency", col1: "N/A", col2: "Full sync support", col3: "Fails without internet" },
];

import { useModals } from '@/components/layout/GlobalLayoutProvider/GlobalLayoutProvider';

export function PricingComparisonSection() {
  const { openQuoteModal, openDemoModal } = useModals();
  return (
    <section className="w-full bg-surface-primary pb-40 pt-16 flex flex-col items-center px-4 sm:px-6 relative z-10 rounded-b-[2.5rem] sm:rounded-b-[4rem] shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col items-center text-center max-w-2xl mb-24 px-4">
        <span className="text-sm font-semibold text-text-tertiary mb-6 uppercase tracking-widest">
          Compare
        </span>
        
        <h2 className="text-4xl sm:text-[48px] font-extrabold tracking-tight text-text-primary mb-6 leading-[1.15] text-balance">
          See how Plated stacks up against the rest
        </h2>
        
        <p className="text-[17px] text-text-secondary leading-relaxed font-medium">
          Compare how much it costs and what you actually get when replacing paper menus.
        </p>
      </div>

      {/* COMPARISON TABLE DESKTOP (Hidden on small mobile) */}
      <div className="hidden md:block relative w-full max-w-[1200px] mt-4">
        
        {/* Table Container */}
        <div className="relative border border-border-default rounded-3xl bg-surface-primary overflow-visible z-10">
          
          {/* Highlighted Plated Column Background */}
          {/* Using absolute positioning to overlap the table perfectly behind the 3rd column text. */}
          <div className="absolute top-[-24px] bottom-[-24px] left-[50%] w-[25%] bg-action-primary rounded-3xl shadow-2xl z-[-1]" />

          {/* Grid Layout */}
          <div className="w-full grid grid-cols-4 divide-y divide-border-default">
            
            {/* Header Row */}
            <div className="col-span-4 grid grid-cols-4 py-8 items-center">
              <div></div>
              <div className="text-center font-bold text-[17px] text-text-primary">Paper & WhatsApp</div>
              <div className="text-center font-extrabold text-2xl text-white tracking-tight flex items-center justify-center gap-2">
                Plated
              </div>
              <div className="text-center font-bold text-[17px] text-text-primary">Generic QR Menus</div>
            </div>

            {/* Data Rows */}
            {comparisonData.map((row, idx) => (
              <div key={idx} className="col-span-4 grid grid-cols-4 py-6 items-center">
                <div className="pl-10 font-bold text-[15px] text-text-primary">{row.feature}</div>
                <div className="text-center text-text-secondary font-medium text-[15px]">{row.col1}</div>
                <div className="text-center text-white font-bold text-[16px]">{row.col2}</div>
                <div className="text-center text-text-secondary font-medium text-[15px]">{row.col3}</div>
              </div>
            ))}
            
            {/* CTA Row - adds spacing at the bottom of the grid */}
            <div className="col-span-4 grid grid-cols-4 py-4 items-center border-t-0">
              <div className="h-12"></div>
            </div>

          </div>
        </div>
      </div>

      {/* COMPARISON MOBILE VIEW */}
      <div className="flex md:hidden flex-col w-full max-w-md gap-8 mt-4">
        {/* Plated Card (Highlighted) */}
        <div className="bg-action-primary rounded-3xl p-8 shadow-xl flex flex-col relative z-20">
          <h3 className="text-3xl font-extrabold text-white mb-6 text-center">Plated</h3>
          <div className="flex flex-col gap-4">
            {comparisonData.map((row, idx) => (
              <div key={idx} className="flex flex-col border-b border-white/20 pb-4 last:border-0 last:pb-0">
                <span className="text-white/80 text-[13px] uppercase tracking-wider font-semibold mb-1">{row.feature}</span>
                <span className="text-white font-bold text-lg">{row.col2}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Other Options */}
        <div className="flex flex-col gap-6 relative z-10">
          <h4 className="text-[15px] font-bold text-text-tertiary uppercase tracking-widest text-center mt-4">Other Options</h4>
          
          <div className="bg-surface-secondary border border-border-default rounded-3xl p-6 flex flex-col">
            <h3 className="text-xl font-extrabold text-text-primary mb-6">Paper & WhatsApp</h3>
            <div className="flex flex-col gap-4">
              {comparisonData.map((row, idx) => (
                <div key={idx} className="flex flex-col border-b border-border-default pb-4 last:border-0 last:pb-0">
                  <span className="text-text-tertiary text-[13px] uppercase tracking-wider font-semibold mb-1">{row.feature}</span>
                  <span className="font-bold text-text-secondary">{row.col1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-secondary border border-border-default rounded-3xl p-6 flex flex-col">
            <h3 className="text-xl font-extrabold text-text-primary mb-6">Generic QR Menus</h3>
            <div className="flex flex-col gap-4">
              {comparisonData.map((row, idx) => (
                <div key={idx} className="flex flex-col border-b border-border-default pb-4 last:border-0 last:pb-0">
                  <span className="text-text-tertiary text-[13px] uppercase tracking-wider font-semibold mb-1">{row.feature}</span>
                  <span className="font-bold text-text-secondary">{row.col3}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CONVERSION FLOOR / ACTUAL PRICING */}
      <div className="w-full max-w-[800px] mt-24 md:mt-32 flex flex-col items-center text-center relative z-20">
        <h3 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-4 tracking-tight">
          Simple pricing for serious chains.
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-2 mb-6">
          <span className="text-2xl sm:text-3xl font-bold text-action-primary">₦10,000 / month</span>
          <span className="text-lg text-text-secondary font-medium hidden sm:block">per chain</span>
          <span className="text-lg text-text-secondary font-medium sm:hidden">per chain</span>
          <span className="text-text-tertiary font-bold px-2">+</span>
          <span className="text-xl font-bold text-text-primary bg-surface-secondary px-3 py-1 rounded-lg border border-border-default">Setup fee</span>
        </div>
        
        <p className="text-[15px] text-text-secondary leading-relaxed max-w-2xl mb-12 border border-border-default bg-surface-primary shadow-sm rounded-xl p-4">
          <strong className="text-text-primary">Plus a flat 0.5% platform fee for online payments.</strong> Zero commission on cash and offline payments. What you sell offline is 100% yours.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button 
            onClick={openDemoModal}
            className="w-full sm:w-auto px-8 py-4 bg-action-primary text-white font-bold rounded-xl text-lg shadow-[0_4px_14px_0_rgb(255,102,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,102,0,0.23)] hover:-translate-y-0.5 transition-all"
          >
            Book a demo
          </button>
          <button 
            onClick={openQuoteModal}
            className="w-full sm:w-auto px-8 py-4 bg-surface-primary text-text-primary font-bold rounded-xl text-lg border-2 border-border-default hover:border-border-strong transition-all"
          >
            Contact sales
          </button>
        </div>
      </div>

    </section>
  );
}
