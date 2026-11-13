import { Leaf, Hexagon, CircleDashed, Triangle, Diamond, Square, Egg, Star, Cloud, Ghost } from 'lucide-react';

const LOGOS = [
  { icon: Leaf, name: 'Sway' },
  { icon: Hexagon, name: 'Hexa' },
  { icon: CircleDashed, name: 'Loom' },
  { icon: Triangle, name: 'Apex' },
  { icon: Diamond, name: 'Gem' },
  { icon: Square, name: 'Block' },
  { icon: Egg, name: 'Oval' },
  { icon: Star, name: 'Nova' },
  { icon: Cloud, name: 'Aero' },
  { icon: Ghost, name: 'Phantom' },
];

export function BrandsStrip() {
  // We duplicate the logos array to create a seamless infinite scroll effect
  const marqueeItems = [...LOGOS, ...LOGOS, ...LOGOS];

  return (
    <section className="w-full bg-surface-primary py-24 sm:py-32 overflow-hidden flex flex-col items-center">
      <p className="text-center text-sm font-medium text-text-tertiary mb-12">
        Brands we've worked with
      </p>

      {/* MARQUEE CONTAINER */}
      <div className="w-full flex flex-col gap-4 relative">
        
        {/* ROW 1 (Moving Left) */}
        <div className="flex w-[300%] sm:w-[200%] md:w-[150%] lg:w-[120%] animate-marquee gap-4 px-2">
          {marqueeItems.map((brand, i) => {
            const Icon = brand.icon;
            return (
              <div 
                key={`row1-${i}`}
                className="flex-shrink-0 w-40 sm:w-48 h-16 sm:h-20 bg-surface-secondary/50 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 text-text-tertiary transition-colors hover:text-text-primary hover:bg-surface-secondary cursor-default"
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                <span className="font-bold text-lg sm:text-xl tracking-tight">{brand.name}</span>
              </div>
            );
          })}
        </div>

        {/* ROW 2 (Moving Right) */}
        <div className="flex w-[300%] sm:w-[200%] md:w-[150%] lg:w-[120%] animate-marquee-reverse gap-4 px-2 -ml-[20%]">
          {marqueeItems.reverse().map((brand, i) => {
            const Icon = brand.icon;
            return (
              <div 
                key={`row2-${i}`}
                className="flex-shrink-0 w-40 sm:w-48 h-16 sm:h-20 bg-surface-secondary/50 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 text-text-tertiary transition-colors hover:text-text-primary hover:bg-surface-secondary cursor-default"
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                <span className="font-bold text-lg sm:text-xl tracking-tight">{brand.name}</span>
              </div>
            );
          })}
        </div>

        {/* FADE GRADIENTS ON EDGES */}
        <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-surface-primary to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-surface-primary to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}
