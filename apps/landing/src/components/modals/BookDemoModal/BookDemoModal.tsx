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
    <div className="fixed inset-0 z-50 bg-text-primary/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-primary rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 border border-border-default text-text-primary">
        <div className="flex justify-between items-start pb-3 border-b border-border-default">
          <div>
            <span className="text-[10px] font-bold text-action-primary uppercase tracking-wider block mb-1">
              Book a Live Demo Call
            </span>
            <h3 className="text-xl font-bold">See Your Dishes Live</h3>
          </div>
          <button onClick={onClose} aria-label="Close modal" className="p-1 text-text-tertiary hover:text-text-primary font-bold text-lg transition-colors">✕</button>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 bg-action-primary/10 text-action-primary rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h4 className="text-lg font-bold">Demo Call Scheduled!</h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              We are pre-loading a sample of your menu onto our demo phone now. We will contact you on WhatsApp shortly.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-text-primary text-surface-primary text-sm font-bold rounded-full shadow-sm hover:opacity-90 transition-opacity"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitDemo} className="space-y-4 text-sm">
            {/* MICROCOPY OFFER */}
            <div className="p-4 bg-surface-secondary rounded-xl border border-border-default text-text-primary">
              <p className="font-semibold leading-relaxed">
                "Fifteen minutes. We pre-load a sample of your actual menu onto our demo phone before we call."
              </p>
            </div>

            <div>
              <label className="block font-semibold mb-1.5">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Chief Executive Officer"
                className="w-full p-3 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:ring-1 focus:ring-action-primary transition-shadow"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1.5">Restaurant Name</label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="e.g. Café Neo"
                className="w-full p-3 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:ring-1 focus:ring-action-primary transition-shadow"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1.5">WhatsApp Phone</label>
                <input
                  type="tel"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="w-full p-3 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:ring-1 focus:ring-action-primary transition-shadow"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1.5">Preferred Date/Time</label>
                <input
                  type="datetime-local"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full p-3 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:ring-1 focus:ring-action-primary transition-shadow"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-action-primary text-white text-sm font-bold rounded-full shadow-md hover:opacity-90 transition-opacity mt-4"
            >
              Confirm 15-Minute Demo Call
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
