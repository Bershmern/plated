'use client';

import { motion } from 'framer-motion';
import { Search, MapPin, UtensilsCrossed } from 'lucide-react';

interface VenueHeaderProps {
  venueName: string;
  tableLabel: string;
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
    <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3 shadow-2xl">
      <div className="max-w-md mx-auto space-y-3">
        {/* Top Venue Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 border border-blue-400/30"
            >
              <UtensilsCrossed className="w-5 h-5" />
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-extrabold text-slate-100 tracking-tight leading-none">
                  {venueName}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Open
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-blue-400" />
                Scan to Table Ordering
              </p>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-900/60 to-slate-800/80 px-3.5 py-1.5 rounded-xl border border-blue-500/30 text-xs font-black text-blue-300 shadow-md shadow-blue-950/50 flex items-center gap-1.5"
          >
            <span className="text-[10px] text-blue-400 font-normal uppercase tracking-wider">Tab</span>
            <span>#{tableLabel}</span>
          </motion.div>
        </div>

        {/* Search Input Bar */}
        {onSearchChange && (
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search jollof, suya, zobo..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900/90 text-slate-100 placeholder-slate-500 rounded-xl border border-slate-700/60 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
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
