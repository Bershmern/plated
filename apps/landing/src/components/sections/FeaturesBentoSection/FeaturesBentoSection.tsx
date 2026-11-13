'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ArrowUpRight, Palette, WifiOff, Users, Focus } from 'lucide-react';
import Image from 'next/image';

export function FeaturesBentoSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="w-full bg-surface-primary py-32 flex flex-col items-center px-4 sm:px-6 relative z-10">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col text-center max-w-4xl mb-24 px-4">
        <h2 className="text-4xl sm:text-6xl md:text-[72px] leading-[1.05] font-extrabold tracking-tight text-balance">
          <span className="text-text-tertiary font-medium">Built for the reality of </span>
          <br className="hidden sm:block" />
          <span className="text-text-primary">restaurant service.</span>
        </h2>
      </div>

      <div className="w-full max-w-[1200px] flex flex-col gap-6">
        
        {/* EXPANDABLE TOP CARD: VISUAL ORDERING */}
        <motion.div 
          layout
          transition={{ duration: 0.6, type: 'spring', bounce: 0.15 }}
          className="bg-surface-primary border border-border-default overflow-hidden flex flex-col relative w-full rounded-3xl"
        >
          <div className="flex flex-col p-8 sm:p-14 relative min-h-[450px] md:min-h-[500px]">
            
            {/* Toggle Button */}
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="absolute bottom-10 left-10 w-14 h-14 bg-text-primary hover:bg-[#333] rounded-full flex items-center justify-center text-surface-primary transition-all duration-300 z-20 hover:scale-105 active:scale-95"
              aria-label={isExpanded ? "Collapse details" : "Expand details"}
            >
              <motion.div layout transition={{ duration: 0.2 }}>
                {isExpanded ? <X size={24} /> : <Plus size={24} />}
              </motion.div>
            </button>

            {/* Content Area */}
            <motion.div layout className={`w-full z-10 relative ${isExpanded ? 'max-w-full' : 'max-w-[45%]'}`}>
              <motion.h3 layout className="text-3xl md:text-[40px] font-extrabold tracking-tight text-text-primary mb-6 leading-[1.1]">
                Dishes get ordered when people can picture eating them
              </motion.h3>
              
              <AnimatePresence mode="popLayout">
                {!isExpanded && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-text-secondary text-[15px] sm:text-[17px] leading-relaxed max-w-[480px]">
                      Every dish is shot on a plate, on a transparent background, and lands on a lit table as the diner swipes. Not a thumbnail in a list: the actual dish, arriving.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Expanded 3-Column Grid */}
            <AnimatePresence mode="popLayout">
              {isExpanded && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 z-10 relative w-full md:w-[85%]"
                >
                  <div className="flex flex-col">
                    <h4 className="font-bold text-text-primary mb-2 text-lg">Crystal clear expectations</h4>
                    <p className="text-text-secondary leading-relaxed font-medium">Diners see exactly what they are getting, practically eliminating complaints and sent-back food.</p>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-bold text-text-primary mb-2 text-lg">Automated upselling</h4>
                    <p className="text-text-secondary leading-relaxed font-medium">Visuals naturally encourage diners to add premium sides and drinks they would normally skip when just reading text.</p>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-bold text-text-primary mb-2 text-lg">High fidelity capture</h4>
                    <p className="text-text-secondary leading-relaxed font-medium">We handle the photography to a fixed spec before you go live, ensuring perfect consistency across your entire menu.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Spacer for expanded height */}
            {isExpanded && <motion.div layout className="h-[280px] w-full hidden md:block" />}

            {/* Dynamic Image Overlay */}
            <motion.div 
              layout
              transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }}
              className={`absolute right-0 bottom-0 bg-surface-secondary border-t border-l border-border-default overflow-hidden z-0 rounded-tl-2xl
                ${isExpanded 
                  ? 'w-full md:w-[65%] h-[250px] md:h-[320px]' 
                  : 'w-[50%] h-[75%] translate-y-0'
                }
              `}
            >
              {/* Fallback pattern/placeholder since we don't have the dish image yet */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-text-tertiary font-bold tracking-widest uppercase">Visual Menu UI</span>
              </div>
            </motion.div>

          </div>
        </motion.div>

        {/* 2x2 BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-4">
          
          {/* Card 1: White-Labelling */}
          <div className="bg-surface-secondary border border-border-default rounded-3xl p-10 sm:p-14 relative overflow-hidden flex flex-col min-h-[480px]">
            <div className="relative z-10 w-full max-w-[95%]">
              <h3 className="text-[28px] sm:text-[32px] font-extrabold text-text-primary tracking-tight mb-4 leading-[1.1]">
                Your restaurant, your brand, your app
              </h3>
              <p className="text-text-secondary font-medium leading-[1.6] text-[17px]">
                Plated doesn't look like Plated. It looks like you. We apply your high-res logo, brand colors, and typography directly into the ordering flow.
              </p>
            </div>
            
            {/* UI Mockup Floating */}
            <div className="absolute -bottom-8 -right-8 w-[85%] h-[60%] bg-surface-primary rounded-tl-3xl border border-border-default shadow-sm p-6 flex flex-col gap-5">
              <div className="flex items-center gap-3 border-b border-border-default pb-4">
                <Palette className="w-5 h-5 text-text-primary" />
                <span className="font-bold text-sm text-text-primary tracking-tight">Theme Settings</span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center bg-surface-secondary p-3 rounded-xl border border-border-default">
                  <span className="text-sm font-semibold text-text-secondary">Primary Brand Color</span>
                  <div className="w-6 h-6 rounded-full bg-action-primary shadow-sm border border-border-default" />
                </div>
                <div className="flex justify-between items-center bg-surface-secondary p-3 rounded-xl border border-border-default">
                  <span className="text-sm font-semibold text-text-secondary">Menu Typography</span>
                  <span className="text-[13px] font-bold font-serif text-text-primary">Playfair Display</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Silent Diner Recognition */}
          <div className="bg-surface-secondary border border-border-default rounded-3xl p-10 sm:p-14 relative overflow-hidden flex flex-col min-h-[480px]">
            <div className="relative z-10 w-full max-w-[95%]">
              <h3 className="text-[28px] sm:text-[32px] font-extrabold text-text-primary tracking-tight mb-4 leading-[1.1]">
                Silent Diner Recognition
              </h3>
              <p className="text-text-secondary font-medium leading-[1.6] text-[17px]">
                They scan once. We remember them next time. No accounts, no logins. Greet your regulars by name automatically.
              </p>
            </div>

            {/* UI Mockup Floating */}
            <div className="absolute -bottom-10 -right-6 w-[80%] h-[55%] bg-surface-primary rounded-tl-3xl border border-border-default shadow-sm p-5 flex flex-col gap-3">
               <div className="flex items-center gap-3 bg-surface-secondary p-3 rounded-xl border border-action-primary/20">
                 <div className="w-10 h-10 bg-action-primary rounded-full flex items-center justify-center text-white font-bold text-[13px] tracking-tight">JS</div>
                 <div className="flex flex-col">
                   <span className="text-[14px] font-bold text-text-primary leading-tight">John Smith</span>
                   <span className="text-[12px] font-semibold text-action-primary mt-0.5">Returning: 14th visit</span>
                 </div>
               </div>
               <div className="flex items-center gap-3 bg-surface-secondary p-3 rounded-xl border border-border-default opacity-60">
                 <div className="w-10 h-10 bg-surface-tertiary rounded-full flex items-center justify-center text-text-tertiary font-bold text-[13px]">?</div>
                 <div className="flex flex-col">
                   <span className="text-[14px] font-bold text-text-secondary leading-tight">Guest Table 4</span>
                   <span className="text-[12px] font-medium text-text-tertiary mt-0.5">First visit</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Card 3: Offline Resiliency */}
          <div className="bg-surface-secondary border border-border-default rounded-3xl p-10 sm:p-14 relative overflow-hidden flex flex-col min-h-[480px]">
            <div className="relative z-10 w-full max-w-[95%]">
              <h3 className="text-[28px] sm:text-[32px] font-extrabold text-text-primary tracking-tight mb-4 leading-[1.1]">
                Network drops. <br/>The order doesn't.
              </h3>
              <p className="text-text-secondary font-medium leading-[1.6] text-[17px]">
                Unsent orders wait on the diner's phone and send themselves when the signal returns. The tablet queue survives a power cut seamlessly.
              </p>
            </div>
            
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[85%] h-[45%] bg-surface-primary rounded-t-3xl border border-border-default shadow-sm p-8 flex flex-col items-center justify-center gap-4">
               <div className="w-14 h-14 bg-surface-secondary border border-border-default rounded-full flex items-center justify-center mb-1">
                 <WifiOff className="w-6 h-6 text-text-secondary" />
               </div>
               <div className="w-full h-1.5 bg-surface-tertiary rounded-full overflow-hidden">
                 <div className="w-[60%] h-full bg-action-primary rounded-full relative overflow-hidden">
                   {/* Shimmer effect */}
                   <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                 </div>
               </div>
               <span className="text-[13px] font-bold text-text-tertiary uppercase tracking-wider">Syncing 3 saved orders...</span>
            </div>
          </div>

          {/* Card 4: Shared Table Tab */}
          <div className="bg-surface-secondary border border-border-default rounded-3xl p-10 sm:p-14 relative overflow-hidden flex flex-col min-h-[480px]">
            <div className="relative z-10 w-full max-w-[95%]">
              <h3 className="text-[28px] sm:text-[32px] font-extrabold text-text-primary tracking-tight mb-4 leading-[1.1]">
                One table, multiple orders, one bill
              </h3>
              <p className="text-text-secondary font-medium leading-[1.6] text-[17px]">
                Four people order from four phones. It's one tab, settled once at the counter. Group dining made completely frictionless.
              </p>
            </div>
            
            <div className="absolute -bottom-8 -right-6 w-[80%] h-[65%] bg-surface-primary rounded-tl-3xl border border-border-default shadow-sm p-6 flex flex-col font-mono text-[13px]">
               <div className="flex items-center justify-between border-b border-dashed border-border-strong pb-4 mb-4">
                 <div className="flex items-center gap-2 text-text-primary">
                   <Users className="w-4 h-4" />
                   <span className="font-bold tracking-tight">TABLE_12</span>
                 </div>
                 <span className="bg-action-primary/10 text-action-primary border border-action-primary/20 px-2 py-0.5 rounded-md font-bold">4_GUESTS</span>
               </div>
               
               <div className="flex flex-col gap-3 text-text-secondary">
                 <div className="flex justify-between items-center">
                   <span>Phone_1 (John)</span>
                   <span className="font-semibold text-text-primary">₦12,500</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span>Phone_2 (Sarah)</span>
                   <span className="font-semibold text-text-primary">₦8,200</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span>Phone_3 (Mike)</span>
                   <span className="font-semibold text-text-primary">₦15,000</span>
                 </div>
                 <div className="mt-2 pt-3 border-t border-dashed border-border-strong flex justify-between items-center">
                   <span className="font-bold text-text-primary uppercase">Total_Tab</span>
                   <span className="font-bold text-action-primary text-[15px]">₦35,700</span>
                 </div>
               </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
