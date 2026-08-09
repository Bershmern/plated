'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DedicatedQuotePage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [restaurantName, setRestaurantName] = useState('');
  const [outletCount, setOutletCount] = useState('1');
  const [city, setCity] = useState('Lagos');
  const [socialHandle, setSocialHandle] = useState('');
  const [dailyOrders, setDailyOrders] = useState('50-150');
  const [ownerName, setOwnerName] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleNextStep = () => {
    if (step === 1 && !restaurantName) {
      alert('Please enter your restaurant or chain name');
      return;
    }
    if (step === 3 && (!ownerName || !whatsappPhone)) {
      alert('Please provide your name and WhatsApp phone number');
      return;
    }

    if (step < 3) {
      setStep((prev) => (prev + 1) as any);
    } else if (step === 3) {
      setStep(4);
    }
  };

  return (
    <main className="min-h-screen bg-porcelain text-graphite flex flex-col justify-between">
      {/* NAVBAR */}
      <nav className="w-full max-w-5xl mx-auto px-6 py-6 flex justify-between items-center border-b border-linen">
        <Link href="/" className="font-bold text-xl tracking-tight text-graphite">
          Plated
        </Link>
        <span className="text-xs font-semibold text-brass uppercase tracking-wider bg-linen px-3 py-1 rounded-full">
          Dedicated Quote Route (`/quote`)
        </span>
      </nav>

      {/* FORM CONTAINER */}
      <div className="max-w-xl w-full mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
        <div className="bg-chalk p-8 rounded-3xl border border-linen shadow-sm space-y-6">
          <div className="border-b border-linen pb-4">
            <span className="text-[10px] font-bold text-brass uppercase tracking-wider block">
              Dual-Mode Intake Flow (Step {step < 4 ? step : 3} of 3)
            </span>
            <h1 className="text-2xl font-extrabold text-graphite">Get a Custom Tailored Quote</h1>
            <p className="text-xs text-graphite/70 mt-1">
              Retainer starts <strong>From ₦20,000 / month*</strong> (setup fee not included).
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-4 text-xs">
              <h4 className="font-bold text-brass uppercase text-[11px] tracking-wider">1. Venue Profile</h4>
              <div>
                <label className="block font-semibold mb-1">Restaurant / Chain Name</label>
                <input
                  type="text"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="e.g. Café Neo Lagos"
                  className="w-full p-3 bg-porcelain border border-linen rounded-xl focus:outline-none focus:ring-1 focus:ring-brass"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Number of Outlets</label>
                  <select
                    value={outletCount}
                    onChange={(e) => setOutletCount(e.target.value)}
                    className="w-full p-3 bg-porcelain border border-linen rounded-xl"
                  >
                    <option value="1">1 Outlet</option>
                    <option value="2-3">2 – 3 Outlets</option>
                    <option value="4+">4+ Outlets (Chain)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Primary City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-3 bg-porcelain border border-linen rounded-xl"
                  >
                    <option value="Lagos">Lagos</option>
                    <option value="Abuja">Abuja</option>
                    <option value="Other">Other City in Nigeria</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Instagram Handle / Website (Optional)</label>
                <input
                  type="text"
                  value={socialHandle}
                  onChange={(e) => setSocialHandle(e.target.value)}
                  placeholder="e.g. @cafeneong"
                  className="w-full p-3 bg-porcelain border border-linen rounded-xl"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 text-xs">
              <h4 className="font-bold text-brass uppercase text-[11px] tracking-wider">2. Operational Volume</h4>
              <div>
                <label className="block font-semibold mb-1">Estimated Daily Table Orders</label>
                <select
                  value={dailyOrders}
                  onChange={(e) => setDailyOrders(e.target.value)}
                  className="w-full p-3 bg-porcelain border border-linen rounded-xl"
                >
                  <option value="<50">Fewer than 50 orders / day</option>
                  <option value="50-150">50 – 150 orders / day</option>
                  <option value="150+">150+ peak daily table orders</option>
                </select>
              </div>

              <p className="text-xs text-graphite/70 p-3 bg-linen/60 rounded-xl border border-linen">
                Multi-outlet scaling curve automatically adjusts your custom retainer down toward ₦20,000–₦50,000 / outlet at volume.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-xs">
              <h4 className="font-bold text-brass uppercase text-[11px] tracking-wider">3. Owner Contact</h4>
              <div>
                <label className="block font-semibold mb-1">Owner / CEO Name</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Sulaiman Bashir"
                  className="w-full p-3 bg-porcelain border border-linen rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">WhatsApp Phone Number</label>
                  <input
                    type="tel"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full p-3 bg-porcelain border border-linen rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@brand.ng"
                    className="w-full p-3 bg-porcelain border border-linen rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-ok/15 text-ok rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                ✓
              </div>
              <h4 className="text-xl font-bold text-graphite">Quote Request Received!</h4>
              <p className="text-xs text-graphite/80 max-w-sm mx-auto leading-relaxed">
                We are analyzing your outlets — expect your custom tailored retainer quote on WhatsApp within 2 hours.
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-brass text-porcelain text-xs font-bold rounded-full shadow-xs"
              >
                Return to Home
              </Link>
            </div>
          )}

          {step < 4 && (
            <div className="flex gap-3 pt-3 border-t border-linen">
              {step > 1 && (
                <button
                  onClick={() => setStep((prev) => (prev - 1) as any)}
                  className="px-5 py-3 bg-linen text-graphite text-xs font-bold rounded-full"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNextStep}
                className="flex-1 py-3.5 bg-brass text-porcelain text-xs font-bold rounded-full shadow-md hover:opacity-90 transition-all"
              >
                {step === 3 ? 'Submit Quote Request' : 'Continue →'}
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="w-full py-6 text-center text-xs text-graphite/60 border-t border-linen">
        POWERED BY PLATED · plated.ng/quote
      </footer>
    </main>
  );
}
