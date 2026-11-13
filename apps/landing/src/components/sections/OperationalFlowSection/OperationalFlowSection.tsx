'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { QrCode, TabletSmartphone, Smile } from 'lucide-react';

export function OperationalFlowSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress within this specific section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // The ring starts small at the bottom (when section enters)
  // Expands as we scroll through
  // Fades in then fades out
  const ringScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1.2, 1.5]);
  const ringOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.15, 0.15, 0]);
  const ringY = useTransform(scrollYProgress, [0, 1], [200, -200]);

  const steps = [
    {
      icon: <QrCode className="w-8 h-8 text-action-primary" />,
      title: "1. Scan to order",
      description: "Diners sit, scan the QR code, and order from an interactive visual menu."
    },
    {
      icon: <TabletSmartphone className="w-8 h-8 text-action-primary" />,
      title: "2. Received & processed",
      description: "Orders land instantly on the counter tablet and print directly to the kitchen."
    },
    {
      icon: <Smile className="w-8 h-8 text-action-primary" />,
      title: "3. Happy & returning",
      description: "Faster service, paid flexibly at the counter, and recognized automatically next time."
    }
  ];

  return (
    <section ref={containerRef} className="w-full bg-surface-primary py-32 flex flex-col items-center px-4 sm:px-6 relative overflow-hidden z-10">
      
      {/* SCROLL ANIMATED BACKGROUND RING */}
      <motion.div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full border-[1px] border-action-primary/30 pointer-events-none z-0"
        style={{
          scale: ringScale,
          opacity: ringOpacity,
          y: ringY,
          x: '-50%' // overriding the default transform since framer-motion handles it
        }}
      />
      {/* Inner subtle ring */}
      <motion.div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] rounded-full border-[1px] border-action-primary/20 pointer-events-none z-0"
        style={{
          scale: ringScale,
          opacity: ringOpacity,
          y: ringY,
          x: '-50%'
        }}
      />

      {/* SECTION HEADER */}
      <div className="flex flex-col items-center text-center max-w-3xl mb-24 px-4 relative z-10">
        <h2 className="text-4xl sm:text-5xl md:text-[56px] font-extrabold tracking-tight text-text-primary mb-6 leading-[1.1] text-balance">
          From scan to a <span className="text-action-primary">returning customer.</span>
        </h2>
        <p className="text-[17px] text-text-secondary leading-relaxed font-medium max-w-xl">
          A seamless flow designed to eliminate waiter back-and-forth and keep your kitchen firing on all cylinders.
        </p>
      </div>

      {/* 3-STEP FLOW */}
      <div className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative z-10">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center group">
            {/* Icon Container */}
            <div className="w-20 h-20 bg-surface-secondary border border-border-default rounded-full flex items-center justify-center mb-8 relative shadow-sm group-hover:scale-105 transition-transform duration-300">
              {step.icon}
              
              {/* Connecting Line (Desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 left-full w-full h-[1px] bg-border-default -translate-y-1/2 z-[-1] ml-4 pointer-events-none" style={{ width: 'calc(100% + 2rem)' }} />
              )}
              {/* Connecting Line (Mobile) */}
              {index < steps.length - 1 && (
                <div className="block md:hidden absolute top-full left-1/2 w-[1px] h-12 bg-border-default -translate-x-1/2 z-[-1] pointer-events-none" />
              )}
            </div>
            
            {/* Content */}
            <h3 className="text-2xl font-extrabold text-text-primary mb-4">{step.title}</h3>
            <p className="text-[15px] text-text-secondary leading-[1.6] font-medium max-w-[280px]">
              {step.description}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
}
