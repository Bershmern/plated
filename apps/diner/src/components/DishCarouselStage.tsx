'use client';

import { useState } from 'react';
import { Stage, AnimatedDish } from '@plated/ui';
import { formatNaira } from '../lib/cart';
import { MenuItem } from './MenuItemCard';

interface DishCarouselStageProps {
  items: MenuItem[];
  accentHex?: string;
  onSelectDish: (item: MenuItem) => void;
}

export function DishCarouselStage({ items, accentHex = '#B08D57', onSelectDish }: DishCarouselStageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!items || items.length === 0) return null;

  const currentDish = items[currentIndex % items.length];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <div className="w-full bg-ink flex flex-col items-center border-b border-linen/30 pb-4">
      <Stage accentHex={accentHex} className="py-4">
        <AnimatedDish
          dishKey={currentDish.id}
          name={currentDish.name}
          priceFormatted={formatNaira(currentDish.price_minor)}
          imageUrl={currentDish.image_url}
          accentHex={accentHex}
          onSelect={() => onSelectDish(currentDish)}
        />
      </Stage>

      {/* Swipe Controls & Dots Navigation */}
      <div className="flex items-center gap-6 mt-2">
        <button
          onClick={handlePrev}
          className="p-2 text-chalk hover:text-brass text-sm font-bold transition-colors"
          aria-label="Previous Dish"
        >
          ←
        </button>

        <div className="flex gap-1.5">
          {items.map((it, idx) => (
            <button
              key={it.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex % items.length ? 'w-5 bg-brass' : 'bg-chalk/40 hover:bg-chalk/70'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-2 text-chalk hover:text-brass text-sm font-bold transition-colors"
          aria-label="Next Dish"
        >
          →
        </button>
      </div>

      <button
        onClick={() => onSelectDish(currentDish)}
        className="mt-3 px-5 py-1.5 bg-brass text-porcelain text-xs font-bold rounded-full shadow-xs hover:opacity-90 transition-opacity"
      >
        Select {currentDish.name}
      </button>
    </div>
  );
}
