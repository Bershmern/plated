'use client';

import { useState } from 'react';

export function PaystackSubscriptionCard() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectPaystack = () => {
    setIsConnecting(true);
    setTimeout(() => {
      alert('[Paystack Inline] Card tokenized successfully. Subscription renewed.');
      setIsConnecting(false);
    }, 1500);
  };

  return (
    <div className="bg-chalk p-6 rounded-2xl border border-linen shadow-2xs space-y-4">
      <div className="flex justify-between items-start border-b border-linen pb-4">
        <div>
          <span className="text-[11px] font-bold text-brass uppercase tracking-wider block">
            Plated Retainer Subscription
          </span>
          <h3 className="text-xl font-extrabold text-graphite mt-0.5">From ₦20,000 / month</h3>
          <p className="text-xs text-graphite/70 mt-1">Quote-based retainer auto-debited via Paystack</p>
        </div>

        <span className="px-3 py-1 bg-ok/15 text-ok rounded-full text-xs font-bold uppercase tracking-wider">
          Active Subscription
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-graphite">
        <div className="p-3 bg-porcelain rounded-xl border border-linen space-y-1">
          <span className="text-[10px] text-graphite/60 font-semibold uppercase block">Connected Card</span>
          <p className="font-mono font-bold text-graphite">•••• •••• •••• 4242</p>
          <span className="text-[10px] text-graphite/70 block">Visa · Expires 12/28</span>
        </div>

        <div className="p-3 bg-porcelain rounded-xl border border-linen space-y-1">
          <span className="text-[10px] text-graphite/60 font-semibold uppercase block">Next Renewal Date</span>
          <p className="font-mono font-bold text-graphite">September 9, 2026</p>
          <span className="text-[10px] text-ok font-semibold block">Auto-renewal enabled</span>
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-[11px] text-graphite/70">
          Need to add extra outlets or update billing email? Contact support directly.
        </p>

        <button
          disabled={isConnecting}
          onClick={handleConnectPaystack}
          className={`px-5 py-2.5 bg-brass text-porcelain text-xs font-bold rounded-xl shadow-xs transition-all ${
            isConnecting ? 'opacity-50 cursor-wait' : 'hover:opacity-90 active:scale-98'
          }`}
        >
          {isConnecting ? 'Opening Paystack...' : 'Update Paystack Card'}
        </button>
      </div>
    </div>
  );
}
