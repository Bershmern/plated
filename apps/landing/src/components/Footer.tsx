'use client';

import Link from 'next/link';

interface FooterProps {
  onOpenQuoteModal: () => void;
  onOpenDemoModal: () => void;
}

export function Footer({ onOpenQuoteModal, onOpenDemoModal }: FooterProps) {
  return (
    <footer className="w-full bg-ink text-chalk pt-16 pb-8 border-t border-linen/20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-chalk/10 text-xs">
        {/* COL 1: BRAND & MISSION */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-chalk tracking-tight">Plated</span>
            <span className="text-[10px] bg-brass/30 text-brass px-2 py-0.5 rounded font-mono uppercase">
              Nigeria
            </span>
          </div>
          <p className="text-chalk/70 leading-relaxed">
            Animated QR table-ordering SaaS for small restaurant chains in Nigeria. Elevating in-venue dining with zero logins.
          </p>
          <span className="text-[10px] text-chalk/50 block">
            © {new Date().getFullYear()} Plated Technologies Ltd. All rights reserved.
          </span>
        </div>

        {/* COL 2: PRODUCT SURFACES */}
        <div className="space-y-3">
          <h4 className="font-bold text-brass uppercase text-[11px] tracking-wider">Product Surfaces</h4>
          <ul className="space-y-2 text-chalk/80">
            <li>
              <a href="http://localhost:3000/o/ikeja?t=4" target="_blank" rel="noreferrer" className="hover:text-brass transition-colors">
                Diner PWA (`order.plated.ng`)
              </a>
            </li>
            <li>
              <a href="http://localhost:3001" target="_blank" rel="noreferrer" className="hover:text-brass transition-colors">
                Restaurant Console (`app.plated.ng`)
              </a>
            </li>
            <li>
              <a href="http://localhost:3002" target="_blank" rel="noreferrer" className="hover:text-brass transition-colors">
                Internal Ops (`admin.plated.ng`)
              </a>
            </li>
          </ul>
        </div>

        {/* COL 3: CONVERSION & QUOTES */}
        <div className="space-y-3">
          <h4 className="font-bold text-brass uppercase text-[11px] tracking-wider">Pricing & Quotes</h4>
          <ul className="space-y-2 text-chalk/80">
            <li>
              <Link href="/quote" className="hover:text-brass transition-colors font-semibold text-brass">
                Dedicated Quote Route (`/quote`)
              </Link>
            </li>
            <li>
              <button onClick={onOpenQuoteModal} className="hover:text-brass transition-colors text-left">
                Get a Custom Quote (Modal)
              </button>
            </li>
            <li>
              <button onClick={onOpenDemoModal} className="hover:text-brass transition-colors text-left">
                Book a 15-Min Live Demo Call
              </button>
            </li>
            <li className="text-[10px] text-chalk/60 pt-1">
              Retainer: From ₦20,000 / month
            </li>
          </ul>
        </div>

        {/* COL 4: LEGAL & SUPPORT */}
        <div className="space-y-3">
          <h4 className="font-bold text-brass uppercase text-[11px] tracking-wider">Legal & Compliance</h4>
          <ul className="space-y-2 text-chalk/80">
            <li><a href="#legal" className="hover:text-brass transition-colors">Privacy Policy</a></li>
            <li><a href="#legal" className="hover:text-brass transition-colors">Terms of Service</a></li>
            <li><a href="#legal" className="hover:text-brass transition-colors">NDPA Data Protection</a></li>
            <li>
              <a href="https://wa.me/2348000000000" target="_blank" rel="noreferrer" className="text-ok font-semibold hover:underline">
                Direct WhatsApp Support
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="max-w-6xl mx-auto px-6 pt-6 flex justify-between items-center text-[10px] text-chalk/50 uppercase tracking-widest">
        <span>POWERED BY PLATED · plated.ng</span>
        <span>Lagos, Nigeria</span>
      </div>
    </footer>
  );
}
