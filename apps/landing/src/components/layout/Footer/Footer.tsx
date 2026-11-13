'use client';

import Link from 'next/link';

import { useModals } from '@/components/layout/GlobalLayoutProvider/GlobalLayoutProvider';

export function Footer() {
  const { openQuoteModal, openDemoModal } = useModals();
  return (
    <footer className="w-full bg-[#1A1A1A] text-white pt-48 pb-12 mt-[-8rem] relative z-0 border-t-0 flex flex-col items-center">
      
      <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-12 relative z-10 flex flex-col items-start">
        
        {/* MASSIVE BRANDING - FLUSH LEFT */}
        <div className="w-full text-left mb-8 md:mb-16" aria-hidden="true" role="presentation">
          <div className="text-[18vw] sm:text-[14rem] md:text-[18rem] lg:text-[22rem] leading-none font-extrabold tracking-tighter text-[#E46B23] select-none ml-[-0.5vw]">
            Plated.
          </div>
          <p className="text-lg sm:text-xl text-white/60 font-medium mt-2 sm:mt-4 ml-1 max-w-[70%] sm:max-w-[50%] md:max-w-[40%] lg:max-w-[35%]">
            An interactive menu where dishes land on the table exactly as diners choose, in an experience that feels entirely yours.
          </p>
        </div>

        {/* COLUMNS - Tied to the right side underneath */}
        <div className="w-full flex justify-center md:justify-end mb-24 md:pr-16 lg:pr-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 text-center sm:text-left">
            
            {/* COL 1 - Features */}
            <div className="flex flex-col gap-6 items-center sm:items-start">
              <h4 className="font-bold text-white text-lg">Features</h4>
              <ul className="flex flex-col gap-4 text-sm text-[#A1A1AA]">
                <li><Link href="/features/dynamic-menus" className="hover:text-white transition-colors hover-underline pb-0.5">Dynamic Menus</Link></li>
                <li><Link href="/features/table-ordering" className="hover:text-white transition-colors hover-underline pb-0.5">Table Ordering</Link></li>
                <li><Link href="/features/waiter-app" className="hover:text-white transition-colors hover-underline pb-0.5">Waiter App</Link></li>
                <li><Link href="/features/analytics" className="hover:text-white transition-colors hover-underline pb-0.5">Analytics</Link></li>
              </ul>
            </div>

            {/* COL 2 - Resources */}
            <div className="flex flex-col gap-6 items-center sm:items-start">
              <h4 className="font-bold text-white text-lg">Resources</h4>
              <ul className="flex flex-col gap-4 text-sm text-[#A1A1AA]">
                <li><Link href="/#faq" className="hover:text-white transition-colors hover-underline pb-0.5">FAQ</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors hover-underline pb-0.5">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors hover-underline pb-0.5">Case Studies</Link></li>
              </ul>
            </div>
            
            {/* COL 3 - Pricing */}
            <div className="flex flex-col gap-6 items-center sm:items-start">
              <h4 className="font-bold text-white text-lg">Pricing & Quotes</h4>
              <ul className="flex flex-col gap-4 text-sm text-[#A1A1AA]">
                <li><button onClick={openQuoteModal} className="hover:text-white transition-colors hover-underline pb-0.5">Get a Custom Quote</button></li>
                <li><button onClick={openDemoModal} className="hover:text-white transition-colors hover-underline pb-0.5">Book a Live Demo</button></li>
                <li><a href="#" className="hover:text-white transition-colors hover-underline pb-0.5">Pricing Details</a></li>
              </ul>
            </div>

            {/* COL 4 - Legal */}
            <div className="flex flex-col gap-6 items-center sm:items-start">
              <h4 className="font-bold text-white text-lg">Legal & Support</h4>
              <ul className="flex flex-col gap-4 text-sm text-[#A1A1AA]">
                <li><a href="#" className="hover:text-white transition-colors hover-underline pb-0.5">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover-underline pb-0.5">Terms of Service</a></li>
                <li><a href="https://wa.me/2348000000000" className="hover:text-white transition-colors hover-underline pb-0.5">24/7 Support</a></li>
              </ul>
            </div>

          </div>
        </div>

        {/* DIVIDER & BOTTOM BAR */}
        <div className="w-full border-t border-white/20 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-sm text-white/90 font-medium text-center sm:text-left">
            © Plated 2026 | A product of <a href="https://www.noblecasca.com" target="_blank" rel="noreferrer" className="underline underline-offset-4 decoration-white/40 hover:text-white hover:decoration-white transition-colors">Noble Casca LLC</a>
          </p>
          <div className="flex gap-6 text-sm text-white/80 font-medium">
            <a href="#" aria-label="Contact us on WhatsApp" className="hover:text-white transition-colors hover-underline pb-0.5">WhatsApp</a>
            <a href="#" aria-label="Follow us on Facebook" className="hover:text-white transition-colors hover-underline pb-0.5">Facebook</a>
            <a href="#" aria-label="Follow us on Instagram" className="hover:text-white transition-colors hover-underline pb-0.5">Instagram</a>
            <span className="opacity-40">|</span>
            <a href="#" className="hover:text-white transition-colors hover-underline pb-0.5">Terms</a>
            <a href="#" className="hover:text-white transition-colors hover-underline pb-0.5">Privacy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
