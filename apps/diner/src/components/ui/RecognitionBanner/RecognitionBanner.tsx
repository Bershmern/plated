'use client';

import { motion } from 'framer-motion';
import { Sparkles, RotateCcw, ShieldCheck } from 'lucide-react';
import { formatNaira } from '@/lib/cart';

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
      className="mx-4 my-3 p-4 rounded-xl bg-card border border-border-default shadow-sm relative overflow-hidden backdrop-blur-md"
    >
      {/* Decorative Subtle Orange Radial Glow */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-action-primary/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex justify-between items-start gap-2 mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-action-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-12 font-black text-card-foreground tracking-tight flex items-center gap-1.5">
              Welcome back to {chainName}!
            </h3>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Your <span className="text-primary font-bold">{visitSuffix} visit</span> with us
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
          <ShieldCheck className="w-3 h-3 text-green-700" />
          Recognized
        </span>
      </div>

      {lastOrder && (
        <div className="pt-2.5 border-t border-border-default flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-medium text-text-secondary block">
              Last Order ({lastOrder.outlet_name}):
            </span>
            <p className="text-12 font-bold text-text-primary truncate">
              {lastOrder.items?.map((it) => `${it.qty}x ${it.name_snapshot}`).join(', ')}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onReorder(lastOrder)}
            className="flex-shrink-0 px-3.5 py-1.5 bg-action-primary text-surface-primary text-12 font-black rounded-xl shadow-sm hover:bg-action-primary/90 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            Reorder
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
