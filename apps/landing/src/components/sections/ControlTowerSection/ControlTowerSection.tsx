import { useState } from 'react';
import { DollarSign, Droplets, Clock, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { RingScrollAnimation } from '@/components/ui/RingScrollAnimation/RingScrollAnimation';

export function ControlTowerSection() {
  const [activeTab, setActiveTab] = useState('revenue');

  return (
    <section className="w-full relative -mt-32 pt-64 pb-32 bg-surface-primary flex flex-col items-center">
      
      <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-[1200px]">
        {/* PILL */}
        <div className="px-4 py-1.5 rounded-full border border-border-strong bg-surface-primary text-xs font-bold text-text-secondary mb-12 shadow-sm">
          Case Studies
        </div>

        {/* HEADLINE */}
        <h2 className="text-4xl sm:text-5xl md:text-[64px] font-bold text-center leading-[1.05] tracking-tight mb-8 text-balance text-text-primary">
          Operations control tower <br/>
          ready for lift-off.
        </h2>

        {/* SUBTEXT */}
        <p className="text-lg sm:text-xl text-center text-text-secondary max-w-2xl leading-relaxed mb-16 text-balance">
          As your restaurant grows, so do the complexities of managing your operations. Plated helps you plan better, launch faster, and focus on what matters: growing your business.
        </p>

        {/* TAB TOGGLES */}
        <div role="tablist" className="flex bg-surface-primary rounded-xl border border-border-default shadow-[0_2px_10px_rgb(0,0,0,0.06)] p-1.5 mb-16 overflow-x-auto max-w-full relative z-20">
          <button 
            role="tab"
            aria-selected={activeTab === 'capital'}
            aria-controls="panel-capital"
            onClick={() => setActiveTab('capital')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'capital' 
                ? 'bg-action-soft text-action-primary' 
                : 'text-text-secondary hover:bg-surface-secondary'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Working Capital
          </button>
          
          <button 
            role="tab"
            aria-selected={activeTab === 'revenue'}
            aria-controls="panel-revenue"
            onClick={() => setActiveTab('revenue')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'revenue' 
                ? 'bg-action-soft text-action-primary' 
                : 'text-text-secondary hover:bg-surface-secondary'
            }`}
          >
            <Droplets className="w-4 h-4" />
            Revenue Leakage
          </button>
          
          <button 
            role="tab"
            aria-selected={activeTab === 'time'}
            aria-controls="panel-time"
            onClick={() => setActiveTab('time')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'time' 
                ? 'bg-action-soft text-action-primary' 
                : 'text-text-secondary hover:bg-surface-secondary'
            }`}
          >
            <Clock className="w-4 h-4" />
            Save Time
          </button>
        </div>

        {/* FEATURE CARD CONTAINER */}
        <div className="relative w-full">
          
          {/* CONCENTRIC CIRCLES SCROLL ANIMATION (Originate exactly from top-center of this card) */}
          <RingScrollAnimation fadeColor="surface-primary" />

          {/* ACTUAL CARD */}
          <div className="relative z-10 w-full bg-surface-primary rounded-[2rem] sm:rounded-[2.5rem] border border-border-default shadow-sm overflow-hidden min-h-[600px] flex flex-col md:flex-row">
            
            {activeTab === 'revenue' && (
              <div role="tabpanel" id="panel-revenue" className="w-full flex flex-col md:flex-row">
                <div className="flex-1 p-12 flex flex-col justify-center">
                  <h4 className="text-action-primary font-bold mb-4 text-lg">Inventory Management</h4>
                  <h3 className="text-4xl sm:text-[40px] font-bold text-text-primary mb-8 leading-[1.1] tracking-tight">Prevent revenue leakage.</h3>
                  <a href="#" className="text-text-primary font-bold hover:underline flex items-center gap-1 group w-max underline-offset-4 mb-12">
                    Learn More 
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  <p className="text-text-secondary text-lg leading-relaxed">
                    Effortlessly plan for the future, taking into account your lead time, stock levels, and real-time sales velocity.
                  </p>
                </div>
                <div className="flex-1 bg-surface-secondary border-l border-border-default flex items-center justify-center p-8">
                  <div className="bg-surface-primary rounded-2xl shadow-lg border border-border-default p-6 w-full max-w-sm">
                    <p className="font-bold text-text-primary text-sm mb-4 leading-relaxed">You have inventory incoming, but you are going to have some time in between with zero stock cover</p>
                    <div className="flex w-full h-8 rounded-md overflow-hidden mb-2 border border-border-default">
                      <div className="w-[40%] bg-action-primary" />
                      <div className="w-[20%] bg-red-100" />
                      <div className="w-[40%] bg-action-primary/60" />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold mb-6">
                      <span className="bg-action-primary text-white px-2 py-0.5 rounded">Current stock</span>
                      <span className="bg-red-500 text-white px-2 py-0.5 rounded">Stock gap</span>
                      <span className="bg-action-primary/60 text-white px-2 py-0.5 rounded">New stock</span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">This item will be out of stock in <span className="border border-border-strong rounded px-1 text-text-primary font-bold">12</span> days, and new items will arrive in <span className="border border-border-strong rounded px-1 text-text-primary font-bold">18</span> days. There will be <span className="border border-red-500 text-red-500 rounded px-1 font-bold">6</span> days without stock cover.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'time' && (
              <div role="tabpanel" id="panel-time" className="w-full flex flex-col md:flex-row">
                <div className="flex-1 p-12 flex flex-col justify-center">
                  <div className="px-4 py-2 rounded-lg border border-border-default text-xs font-bold text-text-secondary w-max mb-8 tracking-widest uppercase">Leni Swims</div>
                  <h3 className="text-4xl sm:text-[40px] font-bold text-text-primary mb-8 leading-[1.1] tracking-tight">Save time and money.</h3>
                  <a href="#" className="text-text-primary font-bold hover:underline flex items-center gap-1 group w-max underline-offset-4 mb-12">
                    Read Case Study 
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  <p className="text-text-secondary text-lg leading-relaxed">
                    Gaining insights on stock and sales data can be difficult when information is siloed. <strong className="text-text-primary">Allow ops & marketing teams to collaborate</strong> instead of chasing each other.
                  </p>
                </div>
                <div className="flex-1 bg-surface-secondary relative border-l border-border-default min-h-[400px]">
                  <Image src="/images/burger_case_study.jpg" alt="Case Study" fill className="object-cover" />
                  <div className="absolute bottom-6 left-6 right-6 bg-surface-primary rounded-xl p-4 shadow-xl border border-border-default">
                    <p className="text-xs font-bold text-center text-text-primary mb-3">Time Spent on Purchase Orders</p>
                    <div className="flex">
                      <div className="flex-1 flex items-center justify-center gap-3 border-r border-border-default pr-4">
                        <span className="text-2xl">😫</span>
                        <div>
                          <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Manually</p>
                          <p className="text-xl font-bold text-text-primary">23 hours</p>
                          <p className="text-[10px] text-text-tertiary">per week</p>
                        </div>
                      </div>
                      <div className="flex-1 flex items-center justify-center gap-3 pl-4 bg-action-primary text-white rounded-r-lg">
                        <div>
                          <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider">With Plated</p>
                          <p className="text-xl font-bold">Only 4 hours</p>
                          <p className="text-[10px] text-white/80">per week</p>
                        </div>
                        <span className="text-2xl">🤩</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'capital' && (
              <div role="tabpanel" id="panel-capital" className="w-full flex flex-col md:flex-row">
                <div className="flex-1 p-12 flex flex-col justify-center">
                  <div className="px-4 py-2 rounded-lg border border-border-default text-xs font-bold text-text-secondary w-max mb-8 tracking-widest uppercase text-action-primary">Onewith</div>
                  <h3 className="text-4xl sm:text-[40px] font-bold text-text-primary mb-8 leading-[1.1] tracking-tight">Grow fast with less cash.</h3>
                  <a href="#" className="text-text-primary font-bold hover:underline flex items-center gap-1 group w-max underline-offset-4 mb-12">
                    Read Case Study 
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  <p className="text-text-secondary text-lg leading-relaxed">
                    Stop wrestling with endless spreadsheets and manually reconciling your data. <strong className="text-text-primary">Plated gives you one powerful, intuitive source of truth</strong> for inventory and sales.
                  </p>
                </div>
                <div className="flex-1 bg-surface-secondary relative border-l border-border-default min-h-[400px]">
                  <Image src="/images/burger_case_study.jpg" alt="Case Study" fill className="object-cover" />
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </section>
  );
}
