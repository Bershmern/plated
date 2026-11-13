'use client';

import { useState } from 'react';

export function MoniepointSubscriptionCard() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectMoniepoint = () => {
    setIsConnecting(true);
    setTimeout(() => {
      alert('[Moniepoint Inline] Card tokenized successfully. Subscription renewed.');
      setIsConnecting(false);
    }, 1500);
  };

  return (
    <div className="bg-surface-primary p-6 rounded-2xl border border-border-default shadow-sm space-y-4">
      <div className="flex justify-between items-start border-b border-border-default pb-4">
        <div>
          <span className="text-12 font-bold text-text-tertiary uppercase tracking-wider block">
            Plated Retainer Subscription
          </span>
          <h3 className="text-24 font-extrabold text-text-primary mt-0.5">₦10,000 / month</h3>
          <p className="text-14 text-text-secondary mt-1">Flat retainer auto-debited via Moniepoint</p>
        </div>

        <span className="px-3 py-1 bg-green-500/15 text-green-700 rounded-full text-12 font-bold uppercase tracking-wider">
          Active Subscription
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-14 text-text-primary">
        <div className="p-3 bg-surface-secondary rounded-xl border border-border-default space-y-1">
          <span className="text-12 text-text-secondary font-semibold uppercase block">Connected Card</span>
          <p className="font-mono font-bold text-text-primary">•••• •••• •••• 4242</p>
          <span className="text-12 text-text-secondary block">Visa · Expires 12/28</span>
        </div>

        <div className="p-3 bg-surface-secondary rounded-xl border border-border-default space-y-1">
          <span className="text-12 text-text-secondary font-semibold uppercase block">Next Renewal Date</span>
          <p className="font-mono font-bold text-text-primary">September 9, 2026</p>
          <span className="text-12 text-green-600 font-semibold block">Auto-renewal enabled</span>
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-12 text-text-secondary">
          Need to add extra outlets or update billing email? Contact support directly.
        </p>

        <button
          disabled={isConnecting}
          onClick={handleConnectMoniepoint}
          className={`px-5 py-2.5 bg-action-primary text-surface-primary text-14 font-bold rounded-xl shadow-sm transition-all ${
            isConnecting ? 'opacity-50 cursor-wait' : 'hover:opacity-90 active:scale-95'
          }`}
        >
          {isConnecting ? 'Opening Moniepoint...' : 'Update Moniepoint Card'}
        </button>
      </div>
    </div>
  );
}
