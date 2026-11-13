'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'Do I have to change my POS?',
    answer: 'No. We do not touch it or replace it. Orders arrive on a tablet; your staff fulfill them and handle receipts seamlessly.',
  },
  {
    question: 'How do my customers pay?',
    answer: 'Flexible: they can pay online via Moniepoint, or pay offline at the counter via Cash, POS, or Bank Transfer. Staff confirms payment directly on the tablet.',
  },
  {
    question: 'What happens when the light goes?',
    answer: "The tablet holds the last orders it received. If a diner's connection drops, the order waits on their phone and sends itself when the signal returns.",
  },
  {
    question: 'What if the printer runs out of paper mid-rush?',
    answer: 'It beeps. Your staff change the roll, and every order on screen has a persistent "Reprint" button.',
  }
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-surface-primary py-32 flex flex-col items-center px-4 sm:px-6 relative z-10">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col items-center text-center max-w-2xl mb-16 px-4">
        <span className="text-sm font-semibold text-text-secondary mb-6 bg-surface-secondary px-3 py-1 rounded border border-border-default">
          Plated FAQ
        </span>
        
        <h2 className="text-4xl sm:text-[44px] font-extrabold tracking-tight text-text-primary mb-6 leading-[1.15]">
          We're here to answer all your questions.
        </h2>
        
        <p className="text-[17px] text-text-secondary leading-relaxed font-medium max-w-xl">
          New to Plated or looking to supercharge your current restaurant operations? We'll help you learn more about the platform and its features.
        </p>
      </div>

      {/* ACCORDION LIST */}
      <div className="w-full max-w-[1000px] flex flex-col gap-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-surface-secondary/50 rounded-[1.25rem] border border-border-default overflow-hidden transition-all duration-300 hover:bg-surface-secondary"
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full p-6 sm:px-8 text-left flex justify-between items-center gap-6 group"
              >
                <span className="font-bold text-[17px] sm:text-[19px] text-text-primary group-hover:text-black transition-colors">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                >
                  <Plus className="w-6 h-6 text-text-primary" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 sm:px-8 pb-8 text-text-secondary leading-[1.6] text-[17px] max-w-[90%] font-medium">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
