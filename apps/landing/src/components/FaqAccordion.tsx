'use client';

import { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: '1. Does Plated replace our existing POS system?',
    answer:
      'No. Plated operates alongside your POS as a dedicated table-ordering channel. Staff read incoming orders off the counter tablet feed and key them into your existing POS or accounting ledger when settling.',
  },
  {
    question: '2. How are diner payments handled at the table?',
    answer:
      'Diners browse, configure options, and submit orders directly from their table. Orders accumulate into a single table tab (`table_sessions`). Diners pay at the counter as usual when finishing their meal.',
  },
  {
    question: '3. What happens during internet or power outages in Lagos?',
    answer:
      'Unsent orders automatically queue on the diner phone with client timestamp. The counter tablet retains local queue state and syncs instantly when connectivity returns.',
  },
  {
    question: '4. What if the thermal printer runs out of paper or jams?',
    answer:
      'The counter tablet till emits audible alerts and maintains a persistent "Reprint ESC/POS Ticket" button on every order card. You can reprint tickets anytime without losing order data.',
  },
  {
    question: '5. Is diner history shared across competing restaurant brands?',
    answer:
      'Never. Diner recognition is strictly keyed on `(device_id, chain_id)`. History pools across every outlet of your chain but is strictly isolated from all other restaurant brands.',
  },
  {
    question: '6. How do image processing credits work?',
    answer:
      'Your monthly plan includes 10 free Claid.ai image cutout processing credits per month. Additional credits cost ₦1,000 per credit beyond the bundle.',
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <span className="text-xs font-semibold tracking-widest text-brass uppercase bg-linen px-3 py-1 rounded-full">
          Frequently Asked Questions (MARKETING.md §5.10)
        </span>
        <h2 className="text-3xl font-extrabold text-graphite tracking-tight mt-3">
          Everything You Need to Know
        </h2>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-chalk rounded-2xl border border-linen overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full p-5 text-left flex justify-between items-center gap-4 font-bold text-sm text-graphite hover:text-brass"
              >
                <span>{faq.question}</span>
                <span className={`text-lg transition-transform duration-200 ${isOpen ? 'rotate-180 text-brass' : ''}`}>
                  ↓
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-graphite/80 leading-relaxed border-t border-linen/50 pt-3 animate-in fade-in duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
