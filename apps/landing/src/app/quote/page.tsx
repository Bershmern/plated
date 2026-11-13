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
    <main className="min-h-screen flex flex-col justify-between">
      {/* NAVBAR */}
      <nav className="w-full max-w-5xl mx-auto px-6 py-6 flex justify-between items-center border-b border-border-default">
        <Link href="/" className="font-bold text-xl tracking-tight">
          Plated
        </Link>
        <span className="text-xs font-bold text-action-primary uppercase tracking-wider bg-surface-secondary border border-border-default px-3 py-1 rounded-full">
          Dedicated Quote Route (`/quote`)
        </span>
      </nav>

      {/* FORM CONTAINER */}
      <div className="max-w-xl w-full mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
        <div className="bg-surface-secondary p-8 rounded-3xl border border-border-default shadow-sm space-y-6">
          <div className="border-b border-border-default pb-4">
            <span className="text-[10px] font-bold text-action-primary uppercase tracking-wider block mb-1">
              Dual-Mode Intake Flow (Step {step < 4 ? step : 3} of 3)
            </span>
            <h1 className="text-2xl font-extrabold">Get a Custom Tailored Quote</h1>
            <p className="text-sm text-text-secondary mt-1">
              Retainer starts <strong>From ₦20,000 / month*</strong> (plus setup fee).
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-4 text-sm">
              <h4 className="font-bold text-action-primary uppercase text-[11px] tracking-wider">1. Venue Profile</h4>
              <div>
                <label className="block font-semibold mb-1.5">Restaurant / Chain Name</label>
                <input
                  type="text"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="e.g. Café Neo Lagos"
                  className="w-full p-3 bg-surface-primary border border-border-default rounded-xl focus:outline-none focus:ring-1 focus:ring-action-primary transition-shadow"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1.5">Number of Outlets</label>
                  <select
                    value={outletCount}
                    onChange={(e) => setOutletCount(e.target.value)}
                    className="w-full p-3 bg-surface-primary border border-border-default rounded-xl focus:outline-none focus:ring-1 focus:ring-action-primary transition-shadow"
                  >
                    <option value="1">1 Outlet</option>
                    <option value="2-3">2 – 3 Outlets</option>
                    <option value="4+">4+ Outlets (Chain)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1.5">Primary City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-3 bg-surface-primary border border-border-default rounded-xl focus:outline-none focus:ring-1 focus:ring-action-primary transition-shadow"
                  >
                    <option value="Lagos">Lagos</option>
                    <option value="Abuja">Abuja</option>
                    <option value="Other">Other City in Nigeria</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1.5">Instagram Handle / Website (Optional)</label>
                <input
                  type="text"
                  value={socialHandle}
                  onChange={(e) => setSocialHandle(e.target.value)}
                  placeholder="e.g. @cafeneong"
                  className="w-full p-3 bg-surface-primary border border-border-default rounded-xl focus:outline-none focus:ring-1 focus:ring-action-primary transition-shadow"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 text-sm">
              <h4 className="font-bold text-action-primary uppercase text-[11px] tracking-wider">2. Operational Volume</h4>
              <div>
                <label className="block font-semibold mb-1.5">Estimated Daily Table Orders</label>
                <select
                  value={dailyOrders}
                  onChange={(e) => setDailyOrders(e.target.value)}
                  className="w-full p-3 bg-surface-primary border border-border-default rounded-xl focus:outline-none focus:ring-1 focus:ring-action-primary transition-shadow"
                >
                  <option value="<50">Fewer than 50 orders / day</option>
                  <option value="50-150">50 – 150 orders / day</option>
                  <option value="150+">150+ peak daily table orders</option>
                </select>
              </div>

              <p className="text-xs text-text-secondary p-4 bg-surface-primary rounded-xl border border-border-default">
                Multi-outlet scaling curve automatically adjusts your custom retainer down toward ₦20,000–₦50,000 / outlet at volume.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-sm">
              <h4 className="font-bold text-action-primary uppercase text-[11px] tracking-wider">3. Owner Contact</h4>
              <div>
                <label className="block font-semibold mb-1.5">Owner / CEO Name</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Sulaiman Bashir"
                  className="w-full p-3 bg-surface-primary border border-border-default rounded-xl focus:outline-none focus:ring-1 focus:ring-action-primary transition-shadow"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1.5">WhatsApp Phone Number</label>
                  <input
                    type="tel"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full p-3 bg-surface-primary border border-border-default rounded-xl focus:outline-none focus:ring-1 focus:ring-action-primary transition-shadow"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@brand.ng"
                    className="w-full p-3 bg-surface-primary border border-border-default rounded-xl focus:outline-none focus:ring-1 focus:ring-action-primary transition-shadow"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-action-primary/10 text-action-primary rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                ✓
              </div>
              <h4 className="text-xl font-bold">Quote Request Received!</h4>
              <p className="text-sm text-text-secondary max-w-sm mx-auto leading-relaxed">
                We are analyzing your outlets: expect your custom tailored retainer quote on WhatsApp within 2 hours.
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-action-primary text-white text-sm font-bold rounded-full shadow-sm hover:opacity-90 transition-opacity"
              >
                Return to Home
              </Link>
            </div>
          )}

          {step < 4 && (
            <div className="flex gap-3 pt-3 border-t border-border-default">
              {step > 1 && (
                <button
                  onClick={() => setStep((prev) => (prev - 1) as any)}
                  className="px-5 py-3.5 bg-surface-primary border border-border-default text-text-primary text-sm font-bold rounded-full hover:bg-surface-secondary transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNextStep}
                className="flex-1 py-3.5 bg-action-primary text-white text-sm font-bold rounded-full shadow-md hover:opacity-90 transition-opacity"
              >
                {step === 3 ? 'Submit Quote Request' : 'Continue →'}
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="w-full py-6 text-center text-xs text-text-secondary border-t border-border-default">
        POWERED BY PLATED · plated.ng/quote
      </footer>
    </main>
  );
}
