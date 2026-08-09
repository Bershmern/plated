'use client';

import { useState } from 'react';

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookDemoModal({ isOpen, onClose }: BookDemoModalProps) {
  const [name, setName] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmitDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !restaurantName || !whatsappPhone) {
      alert('Please complete all required fields');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-porcelain rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 border border-linen text-graphite">
        <div className="flex justify-between items-start pb-3 border-b border-linen">
          <div>
            <span className="text-[10px] font-bold text-brass uppercase tracking-wider block">
              Book a Live Demo Call (MARKETING.md §5.8)
            </span>
            <h3 className="text-xl font-bold text-graphite">See Your Dishes Live</h3>
          </div>
          <button onClick={onClose} className="p-1 text-graphite font-bold text-lg">✕</button>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 bg-ok/15 text-ok rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h4 className="text-lg font-bold text-graphite">Demo Call Scheduled!</h4>
            <p className="text-xs text-graphite/80 leading-relaxed">
              We are pre-loading a sample of your menu onto our demo phone now. We will contact you on WhatsApp shortly.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-brass text-porcelain text-xs font-bold rounded-full shadow-xs"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitDemo} className="space-y-4 text-xs">
            {/* MICROCOPY OFFER */}
            <div className="p-3 bg-linen/60 rounded-xl border border-brass/30 text-graphite">
              <p className="font-semibold leading-relaxed">
                "Fifteen minutes. We pre-load a sample of your actual menu onto our demo phone before we call."
              </p>
            </div>

            <div>
              <label className="block font-semibold mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Chief Executive Officer"
                className="w-full p-3 bg-chalk border border-linen rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Restaurant Name</label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="e.g. Café Neo"
                className="w-full p-3 bg-chalk border border-linen rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">WhatsApp Phone</label>
                <input
                  type="tel"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="w-full p-3 bg-chalk border border-linen rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Preferred Date/Time</label>
                <input
                  type="datetime-local"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full p-3 bg-chalk border border-linen rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-ink text-chalk text-xs font-bold rounded-full shadow-md hover:bg-graphite transition-all mt-2"
            >
              Confirm 15-Minute Demo Call
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
