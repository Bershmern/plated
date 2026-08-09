'use client';

import { useState } from 'react';
import Link from 'next/link';
import { QuoteModal } from '../components/QuoteModal';
import { BookDemoModal } from '../components/BookDemoModal';
import { FaqAccordion } from '../components/FaqAccordion';
import { Footer } from '../components/Footer';

export default function LandingPage() {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <main className="min-h-screen bg-porcelain text-graphite flex flex-col justify-between">
      {/* NAVBAR */}
      <nav className="w-full max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-tight text-graphite">Plated</span>
          <span className="text-[10px] uppercase font-mono font-bold bg-linen px-2 py-0.5 rounded text-brass">
            Nigeria
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDemoModal(true)}
            className="text-xs font-semibold text-graphite hover:text-brass px-3 py-2 transition-colors"
          >
            Book a Demo
          </button>

          <button
            onClick={() => setShowQuoteModal(true)}
            className="bg-ink text-chalk text-xs px-5 py-2.5 rounded-full font-bold shadow-xs hover:bg-graphite transition-colors"
          >
            Get a Custom Quote
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center flex-1 flex flex-col justify-center items-center">
        <span className="text-xs font-semibold tracking-widest text-brass uppercase bg-linen px-3 py-1 rounded-full mb-6">
          QR Table-Ordering SaaS for Small Restaurant Chains in Nigeria
        </span>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-graphite leading-tight mb-6">
          Food that arrives before it arrives.
        </h1>

        <p className="text-base sm:text-lg text-graphite max-w-2xl mb-8 leading-relaxed opacity-90">
          Dishes animate onto a lit dining stage as your customers swipe. Zero app downloads, zero account logins, and automatic return-diner recognition across all your outlets.
        </p>

        {/* HERO CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center mb-12">
          <button
            onClick={() => setShowQuoteModal(true)}
            className="w-full sm:w-auto px-8 py-3.5 bg-brass text-porcelain font-bold rounded-full text-xs shadow-md hover:opacity-95 transition-all active:scale-98"
          >
            Get a Custom Quote
          </button>

          <button
            onClick={() => setShowDemoModal(true)}
            className="w-full sm:w-auto px-8 py-3.5 bg-chalk text-graphite font-bold rounded-full text-xs border border-linen hover:bg-linen transition-all"
          >
            Book 15-Min Live Demo
          </button>
        </div>

        {/* PUBLIC PRICING BASELINE CARD (MARKETING.md §5.7) */}
        <div className="w-full max-w-xl bg-chalk p-8 rounded-3xl border border-linen shadow-2xs text-left">
          <div className="flex justify-between items-start border-b border-linen pb-4 mb-4">
            <div>
              <span className="text-[10px] font-bold text-brass uppercase tracking-wider block">
                Public Pricing Baseline (MARKETING.md §5.7)
              </span>
              <h3 className="text-2xl font-extrabold text-graphite mt-1">From ₦20,000 / month*</h3>
              <p className="text-xs text-graphite/70 mt-1">
                *Setup fee not included. Retainer scales based on business size & order volume.
              </p>
            </div>
            <Link
              href="/quote"
              className="text-xs font-bold text-brass hover:underline flex items-center gap-1"
            >
              Open `/quote` →
            </Link>
          </div>

          <p className="text-xs font-bold text-graphite mb-6 leading-snug">
            No commission. No per-order cut. No percentage of anything. What you sell is yours.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-graphite pt-4 border-t border-linen">
            <div className="p-3 bg-porcelain rounded-xl border border-linen">
              <span className="font-bold block text-graphite">With Devices — ₦500,000 once</span>
              <span className="text-[11px] text-graphite/70">Tablet, printer, router, first month data & on-site setup</span>
            </div>
            <div className="p-3 bg-porcelain rounded-xl border border-linen">
              <span className="font-bold block text-graphite">Software Only — ₦250,000 once</span>
              <span className="text-[11px] text-graphite/70">On a tablet & printer you already own</span>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE FAQ ACCORDION (MARKETING.md §5.10) */}
      <FaqAccordion />

      {/* 4-COLUMN ARCHITECTURAL FOOTER (MARKETING.md §5.11) */}
      <Footer
        onOpenQuoteModal={() => setShowQuoteModal(true)}
        onOpenDemoModal={() => setShowDemoModal(true)}
      />

      {/* SLIDE-OVER QUOTE MODAL */}
      <QuoteModal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
      />

      {/* PRE-CALL BOOK DEMO MODAL */}
      <BookDemoModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
      />
    </main>
  );
}
