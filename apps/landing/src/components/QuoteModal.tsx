'use client';

import { useState } from 'react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [restaurantName, setRestaurantName] = useState('');
  const [outletCount, setOutletCount] = useState('1');
  const [city, setCity] = useState('Lagos');
  const [socialHandle, setSocialHandle] = useState('');
  const [dailyOrders, setDailyOrders] = useState('50-150');
  const [ownerName, setOwnerName] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

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
      setStep(4); // Confirmation step
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-porcelain rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border border-linen text-graphite animate-in slide-in-from-bottom duration-300">
        {/* MODAL HEADER */}
        <div className="flex justify-between items-start pb-3 border-b border-linen">
          <div>
            <span className="text-[10px] font-bold text-brass uppercase tracking-wider block">
              Dual-Mode Quote Questionnaire (Step {step < 4 ? step : 3} of 3)
            </span>
            <h3 className="text-xl font-bold text-graphite">Get a Custom Tailored Quote</h3>
          </div>
          <button onClick={onClose} className="p-1 text-graphite font-bold text-lg">✕</button>
        </div>

        {/* STEP 1: VENUE PROFILE */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <h4 className="font-bold text-brass uppercase text-[11px] tracking-wider">1. Venue Profile</h4>
            <div>
              <label className="block font-semibold mb-1">Restaurant / Chain Name</label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="e.g. Tasty Bites Lagos"
                className="w-full p-3 bg-chalk border border-linen rounded-xl focus:outline-none focus:ring-1 focus:ring-brass"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Number of Outlets</label>
                <select
                  value={outletCount}
                  onChange={(e) => setOutletCount(e.target.value)}
                  className="w-full p-3 bg-chalk border border-linen rounded-xl"
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
                  className="w-full p-3 bg-chalk border border-linen rounded-xl"
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
                placeholder="e.g. @tastybitesng"
                className="w-full p-3 bg-chalk border border-linen rounded-xl"
              />
            </div>
          </div>
        )}

        {/* STEP 2: OPERATIONAL VOLUME */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <h4 className="font-bold text-brass uppercase text-[11px] tracking-wider">2. Operational Volume</h4>
            <div>
              <label className="block font-semibold mb-1">Estimated Daily Table Orders</label>
              <select
                value={dailyOrders}
                onChange={(e) => setDailyOrders(e.target.value)}
                className="w-full p-3 bg-chalk border border-linen rounded-xl"
              >
                <option value="<50">Fewer than 50 orders / day</option>
                <option value="50-150">50 – 150 orders / day</option>
                <option value="150+">150+ peak daily table orders</option>
              </select>
            </div>

            <p className="text-xs text-graphite/70 p-3 bg-linen/50 rounded-xl border border-linen">
              Multi-outlet scaling curve automatically adjusts your custom retainer down toward ₦20,000–₦50,000 / outlet at volume.
            </p>
          </div>
        )}

        {/* STEP 3: CONTACT INFO */}
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
                className="w-full p-3 bg-chalk border border-linen rounded-xl"
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
                  className="w-full p-3 bg-chalk border border-linen rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@brand.ng"
                  className="w-full p-3 bg-chalk border border-linen rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: CONFIRMATION */}
        {step === 4 && (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-ok/15 text-ok rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <h4 className="text-lg font-bold text-graphite">Quote Request Received!</h4>
            <p className="text-xs text-graphite/80 max-w-sm mx-auto leading-relaxed">
              We are analyzing your outlets — expect your custom tailored retainer quote on WhatsApp within 2 hours.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-brass text-porcelain text-xs font-bold rounded-full shadow-xs"
            >
              Done
            </button>
          </div>
        )}

        {/* FOOTER ACTIONS */}
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
              className="flex-1 py-3 bg-brass text-porcelain text-xs font-bold rounded-full shadow-md hover:opacity-90 transition-all"
            >
              {step === 3 ? 'Submit Quote Request' : 'Continue →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
