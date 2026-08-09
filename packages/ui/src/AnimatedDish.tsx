'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedDishProps {
  dishKey: string;
  name: string;
  priceFormatted: string;
  imageUrl?: string | null;
  accentHex?: string;
  onSelect?: () => void;
}

// 520ms landing easing spec (DESIGN_SYSTEM.md §6.1)
const LANDING_EASE = [0.16, 1, 0.3, 1];
const LANDING_DURATION = 0.52; // 520ms

export function AnimatedDish({
  dishKey,
  name,
  priceFormatted,
  imageUrl,
  accentHex = '#B08D57',
  onSelect,
}: AnimatedDishProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={dishKey}
        initial={{
          opacity: 0,
          scale: 1.15,
          y: -24,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.9,
          y: 20,
        }}
        transition={{
          duration: LANDING_DURATION,
          ease: LANDING_EASE,
        }}
        onClick={onSelect}
        className="cursor-pointer flex flex-col items-center justify-center p-2 text-center select-none"
        style={{ willChange: 'transform, opacity' }} // Strict GPU acceleration rule (DESIGN_SYSTEM.md §6.2)
      >
        {/* Dish Plate Container */}
        <div className="relative w-28 h-28 rounded-full bg-porcelain shadow-xl border-2 border-linen flex items-center justify-center overflow-hidden mb-2">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-linen/50 text-graphite p-2">
              <span className="text-3xl font-serif font-extrabold" style={{ color: accentHex }}>
                {name.charAt(0)}
              </span>
            </div>
          )}

          {/* Contact Line Anchor Highlight at 86% height */}
          <div className="absolute bottom-1 inset-x-3 h-1 rounded-full bg-brass/30 opacity-60 pointer-events-none" />
        </div>

        {/* Dish Name & Price */}
        <h4 className="text-xs font-bold text-graphite line-clamp-1 max-w-[160px] tracking-tight">{name}</h4>
        <span className="text-[11px] font-extrabold text-brass">{priceFormatted}</span>
      </motion.div>
    </AnimatePresence>
  );
}
