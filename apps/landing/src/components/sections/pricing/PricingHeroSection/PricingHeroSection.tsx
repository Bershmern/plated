'use client';

import { Zap } from 'lucide-react';

const pricingPlans = [
  {
    name: 'Single Location',
    monthlyPrice: 59,
    annualPrice: 708,
    highlight: false,
    description: 'Perfect for independent restaurants',
    features: ['Unlimited orders', 'Standard Tech Support', 'Community access', 'Basic reporting'],
  },
  {
    name: 'Multi-Outlet / Chain',
    monthlyPrice: 159,
    annualPrice: 1908,
    highlight: true,
    description: 'For growing restaurant brands',
    features: ['Unlimited locations', '24/7 Dedicated Support', 'Custom integrations', 'White-glove onboarding'],
  },
];

const includedFeatures = [
  {
    title: 'Real-time sync',
    description: 'Syncs orders across all your locations and devices instantly.',
  },
  {
    title: 'Menu management',
    description: 'Update items, modifiers, and prices across all locations at once.',
  },
  {
    title: 'Inventory alerts',
    description: 'Get notified when stock is running low to avoid 86ing items.',
  },
  {
    title: 'Staff management',
    description: 'Manage roles, permissions, and schedules for your entire team.',
  },
  {
    title: 'Supplier integrations',
    description: 'Automatically route orders to your suppliers when stock is low.',
  },
  {
    title: '24/7 Tech support',
    description: 'Always here to help, even during your busiest Friday dinner rushes.',
  },
];

export function PricingHeroSection() {
  return (
    <section className="w-full bg-[#FAFAFA] pt-32 pb-24 px-4 sm:px-6 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-3xl flex flex-col items-center text-center mb-16">
        <span className="inline-block py-1.5 px-4 rounded-full bg-white border border-border-default text-xs font-bold uppercase tracking-widest text-text-secondary mb-6 shadow-sm">
          Pricing
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.1] text-balance mb-6">
          Streamline, track, order & plan <span className="text-action-primary">your restaurant operations</span>
        </h1>
        <p className="text-lg text-text-secondary font-medium leading-relaxed max-w-2xl">
          Get complete visibility, effortless menu management, and everything you need to run your business effectively from day one.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="w-full max-w-[900px] grid md:grid-cols-2 gap-6 lg:gap-8 mb-16 relative z-10">
        {pricingPlans.map((plan, idx) => (
          <div 
            key={idx} 
            className={`rounded-[2rem] p-8 flex flex-col shadow-xl transition-transform hover:-translate-y-1 duration-300 ${
              plan.highlight 
                ? 'bg-[#FF5A00] text-white border-none' 
                : 'bg-white text-text-primary border border-border-default'
            }`}
          >
            <div className="flex items-center justify-between mb-8">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.highlight ? 'bg-white/20' : 'bg-surface-secondary text-action-primary'}`}>
                <Zap className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${plan.highlight ? 'bg-white/20 text-white' : 'bg-surface-secondary text-text-tertiary'}`}>
                Monthly
              </span>
            </div>
            
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <p className={`text-sm mb-6 ${plan.highlight ? 'text-white/90' : 'text-text-secondary'}`}>
              {plan.description}
            </p>

            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl font-extrabold">${plan.monthlyPrice}</span>
              <span className={`text-sm font-medium ${plan.highlight ? 'text-white/80' : 'text-text-tertiary'}`}>/mo</span>
            </div>
            <p className={`text-xs font-medium mb-8 ${plan.highlight ? 'text-white/70' : 'text-text-tertiary'}`}>
              Billed at ${plan.annualPrice}/Year
            </p>

            <div className="flex-1 flex flex-col gap-4 mb-8">
              {plan.features.map((feature, fIdx) => (
                <div key={fIdx} className="flex items-center gap-3">
                  <span className={`w-5 h-5 flex-shrink-0 flex items-center justify-center font-bold text-lg ${plan.highlight ? 'text-white' : 'text-action-primary'}`}>+</span>
                  <span className={`text-sm font-medium ${plan.highlight ? 'text-white/90' : 'text-text-secondary'}`}>{feature}</span>
                </div>
              ))}
            </div>

            <button className={`w-full py-4 rounded-xl font-bold text-center transition-all ${
              plan.highlight 
                ? 'bg-white text-[#FF5A00] hover:bg-white/90' 
                : 'bg-surface-secondary text-text-primary hover:bg-border-default'
            }`}>
              {plan.highlight ? 'Start free trial' : 'View full breakdown'}
            </button>
          </div>
        ))}
      </div>

      {/* What's Included Box */}
      <div className="w-full max-w-[1000px] bg-surface-secondary rounded-[2rem] p-8 sm:p-12 border border-border-default">
        <h3 className="text-xl font-bold text-center text-text-primary mb-10">What's included?</h3>
        
        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10 mb-12">
          {includedFeatures.map((feat, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-border-default shadow-sm flex items-center justify-center flex-shrink-0">
                <span className="font-extrabold text-xl text-text-primary">+</span>
              </div>
              <div className="flex flex-col">
                <h4 className="font-bold text-text-primary text-[15px] mb-1">{feat.title}</h4>
                <p className="text-sm text-text-secondary font-medium leading-relaxed">{feat.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center w-full border-t border-border-default pt-8">
          <p className="text-text-primary font-bold text-[15px]">
            Get 21-days to try it out, it's on the house.
          </p>
        </div>
      </div>

    </section>
  );
}
