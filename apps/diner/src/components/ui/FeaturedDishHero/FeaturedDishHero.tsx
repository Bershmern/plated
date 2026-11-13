'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus } from 'lucide-react';
import { MenuItem } from '@/components/ui/MenuItemCard/MenuItemCard';
import { formatNaira } from '@/lib/cart';

interface FeaturedDishHeroProps {
  items: MenuItem[];
  onSelectDish: (item: MenuItem) => void;
}

export function FeaturedDishHero({ items, onSelectDish }: FeaturedDishHeroProps) {
  const featuredItems = items.filter((it) => it.image_url && it.in_stock);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredItems.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredItems.length]);

  if (featuredItems.length === 0) return null;

  const currentDish = featuredItems[currentIndex];

  return (
    <section className="px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-12 font-black text-text-primary flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          Chef's Specials
        </span>
        <div className="flex gap-1">
          {featuredItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-5 bg-action-primary' : 'w-1.5 bg-border'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden bg-card border border-border-default shadow-sm h-52 group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDish.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 cursor-pointer"
            onClick={() => onSelectDish(currentDish)}
          >
            {/* Background Dish Image */}
            <img
              src={currentDish.image_url!}
              alt={currentDish.name}
              className="w-full h-full object-cover object-center"
            />

            {/* Ambient Gradients - Darkened to ensure text is always legible regardless of theme */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

            {/* Dish Card Info Container */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between gap-3">
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-action-primary text-surface-primary shadow-sm mb-1.5">
                  Popular Choice
                </span>
                <h3 className="text-16-tight font-black text-white leading-snug truncate drop-shadow-md">
                  {currentDish.name}
                </h3>
                <p className="text-[11px] text-text-secondary line-clamp-1 mt-0.5 font-medium opacity-90">
                  {currentDish.description}
                </p>
              </div>

              <div className="text-right flex-shrink-0 flex flex-col items-end gap-1.5">
                <span className="text-16-tight font-black text-white tracking-tight drop-shadow-md">
                  {formatNaira(currentDish.price_minor)}
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="px-3.5 py-1.5 bg-action-primary text-surface-primary text-12 font-black rounded-xl shadow-md hover:bg-action-primary/90 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Order
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
