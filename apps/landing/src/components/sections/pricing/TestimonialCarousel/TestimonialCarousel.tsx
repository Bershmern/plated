'use client';

import { Star } from 'lucide-react';

const testimonials = [
  {
    rating: 5,
    text: "Before Plated, waiters spent half their shift running back and forth to clarify orders. Now, the kitchen receives tickets exactly as the diner requested them. Our table turnover rate has significantly improved.",
    name: "Tolu O.",
    brand: "Lagos Bistro"
  },
  {
    rating: 5,
    text: "We wanted a digital menu that didn't feel like a cheap PDF link. Plated gave us an interactive menu that matches our brand identity perfectly. The loginless recognition feature makes our regulars feel seen.",
    name: "Chinedu E.",
    brand: "The Continental"
  },
  {
    rating: 5,
    text: "Managing a multi-outlet chain meant chaotic menu updates. With Plated, we update the menu centrally and it reflects across all our branches instantly. It has saved us thousands in printing costs alone.",
    name: "Amina Y.",
    brand: "Bukka Express"
  },
  {
    rating: 5,
    text: "The split payment feature is a lifesaver for large groups. No more awkward moments at the table trying to calculate who owes what. The dining experience is so much smoother now.",
    name: "Femi A.",
    brand: "Suya & Spice"
  }
];

export function TestimonialCarousel() {
  return (
    <section className="w-full bg-[#FAFAFA] py-24 px-4 flex flex-col items-center overflow-hidden">
      <div className="w-full max-w-[1200px] flex flex-col items-center text-center mb-16">
        <span className="inline-block py-1.5 px-4 rounded-full bg-surface-secondary border border-border-default text-xs font-bold uppercase tracking-widest text-text-tertiary mb-6">
          Testimonials
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary leading-[1.1] text-balance">
          Here's what other brands <br className="hidden sm:block" /> have to say about Plated:
        </h2>
      </div>

      {/* Carousel Container */}
      <div className="w-full max-w-[1400px] flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar px-4 sm:px-6">
        {testimonials.map((t, idx) => (
          <div 
            key={idx} 
            className="flex-shrink-0 w-[300px] sm:w-[350px] md:w-[400px] bg-white rounded-2xl p-8 shadow-sm border border-border-default snap-start flex flex-col"
          >
            <div className="flex gap-1 mb-6">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B]" />
              ))}
            </div>
            <p className="text-text-secondary text-[15px] font-medium leading-relaxed mb-8 flex-1">
              "{t.text}"
            </p>
            <div className="flex flex-col">
              <span className="font-bold text-text-primary text-[15px]">{t.name}</span>
              <span className="text-text-tertiary text-sm font-medium">{t.brand}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Scroll Hint */}
      <div className="flex gap-2 mt-4 items-center text-text-tertiary">
        <span className="text-xs font-medium uppercase tracking-widest">Swipe to read more</span>
      </div>
    </section>
  );
}
