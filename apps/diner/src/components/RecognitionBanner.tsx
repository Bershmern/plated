'use client';

import { motion } from 'framer-motion';
import { Sparkles, RotateCcw, ShieldCheck } from 'lucide-react';
import { formatNaira } from '../lib/cart';

interface LastOrder {
  placed_at: string;
  outlet_name: string;
  subtotal_minor: number;
  items: Array<{
    menu_item_id: string;
    name_snapshot: string;
    qty: number;
    options: any[];
  }>;
}

interface RecognitionBannerProps {
  chainName: string;
  orderCount: number;
  lastOrder?: LastOrder | null;
  onReorder: (lastOrder: LastOrder) => void;
}

export function RecognitionBanner({
  chainName,
  orderCount,
  lastOrder,
  onReorder,
}: RecognitionBannerProps) {
  if (!orderCount || orderCount <= 0 || !lastOrder) {
    return null; // Silence rule: strictly null when no prior profile
  }

  const visitSuffix =
    orderCount === 1 ? '2nd' : orderCount === 2 ? '3rd' : `${orderCount + 1}th`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-4 my-3 p-4 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900/90 to-blue-950/70 border border-blue-500/30 shadow-xl shadow-blue-950/40 relative overflow-hidden backdrop-blur-md"
    >
      {/* Decorative Subtle Blue Radial Glow */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex justify-between items-start gap-2 mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30 flex-shrink-0">
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-100 tracking-tight flex items-center gap-1.5">
              Welcome back to {chainName}!
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Your <span className="text-blue-400 font-bold">{visitSuffix} visit</span> with us
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
          <ShieldCheck className="w-3 h-3 text-blue-400" />
          Recognized
        </span>
      </div>

      {lastOrder && (
        <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-medium text-slate-400 block">
              Last Order ({lastOrder.outlet_name}):
            </span>
            <p className="text-xs font-bold text-slate-200 truncate">
              {lastOrder.items?.map((it) => `${it.qty}x ${it.name_snapshot}`).join(', ')}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onReorder(lastOrder)}
            className="flex-shrink-0 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black rounded-xl shadow-md shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            Reorder
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
