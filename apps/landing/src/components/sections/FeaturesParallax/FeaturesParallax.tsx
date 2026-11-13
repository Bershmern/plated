import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, TrendingUp, Activity, Box, ShoppingBag, Clock, FileText } from 'lucide-react';
import Image from 'next/image';

export function FeaturesParallax() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Calculate how far the section has scrolled through the viewport
            // 0 = just entered bottom of screen, 1 = just left top of screen
            const totalDistance = windowHeight + rect.height;
            const scrolled = windowHeight - rect.top;
            
            let rawProgress = scrolled / totalDistance;
            rawProgress = Math.max(0, Math.min(1, rawProgress));
            
            setScrollProgress(rawProgress);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate parallax offsets based on scroll progress (progress goes 0 to 1)
  // We map progress [0, 1] to a pixel translation range
  const translateCol1 = 150 - (scrollProgress * 300); // starts lower (+150), ends higher (-150)
  const translateCol2 = 50 - (scrollProgress * 100);  // starts lower (+50), ends higher (-50)
  const translateCol3 = -50 + (scrollProgress * 100); // starts higher (-50), ends lower (+50)
  const translateCol4 = 200 - (scrollProgress * 400); // starts lower (+200), ends higher (-200)

  return (
    <section ref={sectionRef} className="w-full relative py-32 bg-surface-primary flex flex-col items-center px-4 overflow-hidden rounded-b-[2.5rem] sm:rounded-b-[3.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] z-20">
      
      {/* HEADER COPY */}
      <div className="max-w-3xl text-center mb-24 relative z-20">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary tracking-tight leading-[1.1] mb-6">
          Everything you need to run your floor.
        </h2>
        <p className="text-lg sm:text-xl text-text-secondary leading-relaxed">
          Manage orders, track inventory, and update menus from a single dashboard built for restaurant operations.
        </p>
      </div>

      {/* PARALLAX GRID */}
      <div className="w-full max-w-[1400px] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8 relative z-10 pb-32">
        
        {/* COLUMN 1 */}
        <div 
          className="flex flex-col gap-6 will-change-transform"
          style={{ transform: `translateY(${translateCol1}px)` }}
        >
          {/* Best Sellers Card */}
          <div className="bg-surface-primary rounded-3xl p-6 shadow-sm border border-border-default">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-text-secondary text-sm">Top Selling Items</h4>
              <span className="text-xs font-semibold text-text-tertiary bg-surface-secondary px-2 py-1 rounded-md">This week</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-action-primary/10 rounded-xl flex items-center justify-center text-action-primary">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-text-primary text-sm truncate w-32">Truffle Burger</p>
                <div className="flex items-center text-green-500 text-xs font-bold gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +42%
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-surface-primary rounded-3xl p-6 shadow-sm border border-border-default flex-1">
            <h4 className="font-bold text-text-secondary text-sm mb-6">Order Timeline</h4>
            <div className="flex flex-col gap-6 relative">
              <div className="absolute left-3.5 top-2 bottom-2 w-px bg-border-default -z-10" />
              
              {[
                { title: 'Supplier updated', time: 'Today • 18:39', icon: FileText },
                { title: 'Menu published', time: 'Yesterday • 09:46', icon: Activity },
                { title: 'Inventory synced', time: 'Monday • 08:24', icon: Box },
                { title: 'New order placed', time: 'Sunday • 12:36', icon: ShoppingBag },
                { title: 'Item created', time: 'Oct 11 • 14:32', icon: Box },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-7 h-7 bg-surface-primary border-2 border-border-default rounded-full flex items-center justify-center mt-0.5">
                    <item.icon className="w-3 h-3 text-text-tertiary" />
                  </div>
                  <div>
                    <p className="font-bold text-text-primary text-sm">{item.title}</p>
                    <p className="text-text-tertiary text-xs mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 2 */}
        <div 
          className="flex flex-col gap-6 will-change-transform"
          style={{ transform: `translateY(${translateCol2}px)` }}
        >
          {/* Forecast Chart Card */}
          <div className="bg-surface-primary rounded-3xl p-6 shadow-sm border border-border-default flex-1">
            <h4 className="font-bold text-text-secondary text-sm mb-6">Revenue Forecast</h4>
            {/* Fake SVG Line Chart */}
            <div className="w-full aspect-[4/3] relative flex flex-col justify-end gap-4">
              <svg viewBox="0 0 100 50" className="w-full h-auto stroke-action-primary fill-none overflow-visible">
                <path d="M0,40 Q10,35 20,40 T40,30 T60,35 T80,20 T100,10" strokeWidth="2" strokeLinecap="round" />
                <path d="M0,50 Q10,48 20,45 T40,48 T60,40 T80,42 T100,35" stroke="var(--text-tertiary)" strokeWidth="1" strokeDasharray="2,2" strokeLinecap="round" />
              </svg>
              <div className="flex justify-between w-full border-t border-border-default pt-2 text-[10px] text-text-tertiary font-medium">
                <span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Card */}
          <div className="bg-surface-primary rounded-3xl p-6 shadow-sm border border-border-default flex-1">
            <h4 className="font-bold text-text-secondary text-sm mb-6">Category Breakdown</h4>
            <div className="w-full aspect-[4/3] flex items-end justify-between gap-2 px-2 pb-6 border-b border-border-default relative">
              {[40, 70, 45, 90, 60, 85, 50, 100].map((h, i) => (
                <div key={i} className="w-full bg-action-soft rounded-t-sm relative group cursor-pointer" style={{ height: `${h}%` }}>
                  <div className="absolute bottom-0 left-0 right-0 bg-action-primary rounded-t-sm opacity-50" style={{ height: '40%' }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 3 */}
        <div 
          className="flex flex-col gap-6 will-change-transform"
          style={{ transform: `translateY(${translateCol3}px)` }}
        >
          {/* Large Product Detail Card */}
          <div className="bg-surface-primary rounded-3xl overflow-hidden shadow-sm border border-border-default flex-1 flex flex-col">
            <div className="w-full h-48 bg-surface-secondary relative border-b border-border-default">
              <Image 
                src="/images/burger_case_study.jpg" 
                alt="Product"
                fill
                className="object-cover opacity-80"
              />
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl text-text-primary mb-1">Signature Truffle Burger</h3>
              <p className="text-text-tertiary text-xs font-semibold mb-6">#PRD-8472-TB</p>
              
              <div className="flex border-b border-border-default mb-6">
                <button className="px-4 py-2 text-sm font-bold border-b-2 border-text-primary text-text-primary">Details</button>
                <button className="px-4 py-2 text-sm font-bold text-text-tertiary">Inventory</button>
                <button className="px-4 py-2 text-sm font-bold text-text-tertiary">Settings</button>
              </div>

              <div className="flex flex-col gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Supplier</span>
                  <span className="font-semibold text-text-primary">Local Farms Inc.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Cost</span>
                  <span className="font-semibold text-text-primary">$4.50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Retail price</span>
                  <span className="font-semibold text-text-primary">$18.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Margin</span>
                  <span className="font-semibold text-green-500">75%</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-text-tertiary">Status</span>
                  <span className="font-bold text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-md">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 4 */}
        <div 
          className="flex flex-col gap-6 will-change-transform"
          style={{ transform: `translateY(${translateCol4}px)` }}
        >
          {/* Top Metric Card */}
          <div className="bg-surface-primary rounded-3xl p-6 shadow-sm border border-border-default">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-text-secondary text-sm">Daily Revenue</h4>
              <ArrowUpRight className="w-4 h-4 text-text-tertiary" />
            </div>
            <p className="text-3xl font-bold text-text-primary mb-2">$12,472</p>
            <div className="flex gap-4 text-xs font-bold">
              <span className="text-green-500 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> 8%</span>
              <span className="text-text-tertiary">vs yesterday</span>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-surface-primary rounded-3xl p-6 shadow-sm border border-border-default">
            <h4 className="font-bold text-text-secondary text-sm mb-4">Stock Alerts</h4>
            <div className="flex justify-between mb-4">
              <div>
                <span className="inline-block px-2 py-1 bg-amber-500/10 text-amber-600 text-xs font-bold rounded-md mb-2">Running low</span>
                <p className="text-2xl font-bold text-text-primary">12</p>
              </div>
              <div>
                <span className="inline-block px-2 py-1 bg-red-500/10 text-red-600 text-xs font-bold rounded-md mb-2">Out of stock</span>
                <p className="text-2xl font-bold text-text-primary">3</p>
              </div>
            </div>
          </div>

          {/* List Card */}
          <div className="bg-surface-primary rounded-3xl p-6 shadow-sm border border-border-default flex-1">
            <div className="flex justify-between items-center mb-6 border-b border-border-default pb-4">
              <h4 className="font-bold text-text-secondary text-sm">Needs reorder</h4>
              <span className="text-text-tertiary text-xs font-semibold">Grade</span>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { name: 'Ketchup Packets', grade: 'A', color: 'text-red-500 bg-red-500/10' },
                { name: 'Napkins (Bulk)', grade: 'A', color: 'text-red-500 bg-red-500/10' },
                { name: 'Brioche Buns', grade: 'B', color: 'text-amber-500 bg-amber-500/10' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-surface-secondary rounded-lg flex items-center justify-center">
                      <Box className="w-4 h-4 text-text-tertiary" />
                    </div>
                    <span className="text-sm font-bold text-text-primary">{item.name}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${item.color}`}>{item.grade}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3-COLUMN FEATURES */}
      <div className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16 relative z-10 pt-16 pb-24 border-t border-border-default/50">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-action-soft rounded-2xl flex items-center justify-center mb-6 text-action-primary">
            <Activity className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-text-primary mb-4">Clear operational data</h4>
          <p className="text-text-secondary leading-relaxed">
            See which menu items are moving and which ingredients need restocking, without running complex reports.
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-action-soft rounded-2xl flex items-center justify-center mb-6 text-action-primary">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-text-primary mb-4">Scales with your restaurant</h4>
          <p className="text-text-secondary leading-relaxed">
            Designed to handle peak hours and multiple locations without slowing down your kitchen or waitstaff.
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-action-soft rounded-2xl flex items-center justify-center mb-6 text-action-primary">
            <Clock className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-text-primary mb-4">Quick deployment</h4>
          <p className="text-text-secondary leading-relaxed">
            Upload your menu and start taking orders the same day. No complex installation or downtime required.
          </p>
        </div>
      </div>

    </section>
  );
}
