'use client';

import { motion } from 'framer-motion';
import { Plus, SlidersHorizontal, ImageOff } from 'lucide-react';
import { formatNaira } from '@/lib/cart';

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price_minor: number;
  currency: string;
  image_url: string | null;
  image_ready: boolean;
  is_listed: boolean;
  in_stock: boolean;
  option_groups: any[];
}

interface MenuItemCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export function MenuItemCard({ item, onSelect }: MenuItemCardProps) {
  const isAvailable = item.is_listed && item.in_stock;
  const hasOptions = item.option_groups && item.option_groups.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={isAvailable ? { y: -2 } : {}}
      whileTap={isAvailable ? { scale: 0.98 } : {}}
      onClick={() => isAvailable && onSelect(item)}
      className={`p-3.5 rounded-xl border transition-all duration-200 flex gap-3.5 ${
        isAvailable
          ? 'bg-card border-border-default hover:border-action-primary/50 shadow-sm cursor-pointer'
          : 'bg-surface-secondary/40 border-border-default opacity-55 cursor-not-allowed select-none'
      }`}
    >
      {/* Dish Image Column */}
      <div className="w-24 h-24 rounded-xl overflow-hidden bg-surface-secondary flex-shrink-0 relative border border-border-default shadow-sm">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-surface-secondary text-text-secondary">
            <ImageOff className="w-6 h-6 mb-1 opacity-40" />
            <span className="text-[9px] font-bold tracking-wider uppercase">
              No Image
            </span>
          </div>
        )}

        {!isAvailable && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center p-1 text-center">
            <span className="text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-destructive/10 text-destructive border border-destructive/20">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Item Content Column */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-1.5 mb-1">
            <h3 className="font-extrabold text-14 text-card-foreground leading-snug tracking-tight truncate">
              {item.name}
            </h3>
          </div>

          {item.description && (
            <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed font-normal">
              {item.description}
            </p>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border-default">
          <div>
            <span className="font-black text-14 text-primary tracking-tight">
              {formatNaira(item.price_minor)}
            </span>
            {hasOptions && (
              <span className="block text-[9px] font-medium text-text-secondary flex items-center gap-0.5">
                <SlidersHorizontal className="w-2.5 h-2.5 text-primary" />
                Customizable
              </span>
            )}
          </div>

          {isAvailable && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="px-3 py-1.5 bg-action-primary text-surface-primary text-12 font-black rounded-xl shadow-sm hover:bg-action-primary/90 flex items-center gap-1"
            >
              {hasOptions ? (
                <>
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Options</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
