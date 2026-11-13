'use client';

import { motion } from 'framer-motion';
import { Search, MapPin, UtensilsCrossed } from 'lucide-react';

interface VenueHeaderProps {
  venueName: string;
  tableLabel: string | null;
  accentHex?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function VenueHeader({
  venueName,
  tableLabel,
  searchQuery = '',
  onSearchChange,
}: VenueHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border-default px-4 py-3 shadow-sm">
      <div className="max-w-md mx-auto space-y-3">
        {/* Top Venue Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-10 h-10 rounded-xl bg-action-primary flex items-center justify-center text-surface-primary shadow-md"
            >
              <UtensilsCrossed className="w-5 h-5" />
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-16-tight font-extrabold text-text-primary tracking-tight leading-none">
                  {venueName}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Open
                </span>
              </div>
              <p className="text-[11px] text-text-secondary flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-primary" />
                {tableLabel ? 'Scan to Table Ordering' : 'Pickup & Delivery'}
              </p>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-accent px-3.5 py-1.5 rounded-xl border border-border-default text-12 font-black text-text-primary shadow-sm flex items-center gap-1.5"
          >
            {tableLabel ? (
              <>
                <span className="text-[10px] text-text-secondary font-normal uppercase tracking-wider">Tab</span>
                <span>#{tableLabel}</span>
              </>
            ) : (
              <span className="text-[10px] uppercase tracking-wider">Guest</span>
            )}
          </motion.div>
        </div>

        {/* Search Input Bar */}
        {onSearchChange && (
          <div className="relative">
            <Search className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search items..."
              className="w-full pl-10 pr-4 py-2 text-12 bg-surface-secondary text-text-primary placeholder-muted-foreground rounded-xl border border-border-default focus:outline-none focus:border-action-primary focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-12 text-text-secondary hover:text-text-primary"
              >
                ✕
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
