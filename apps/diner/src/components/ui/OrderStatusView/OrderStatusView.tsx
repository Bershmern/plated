'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Utensils, ArrowLeft, Receipt } from 'lucide-react';
import { formatNaira } from '@/lib/cart';

interface OrderStatusViewProps {
  order: any;
  onOrderAnother: () => void;
}

export function OrderStatusView({ order, onOrderAnother }: OrderStatusViewProps) {
  const statusColors: Record<
    string,
    { bg: string; text: string; badge: string; label: string; icon: any }
  > = {
    incoming: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-700',
      badge: 'bg-blue-600 text-white',
      label: 'Order Sent to Kitchen',
      icon: Clock,
    },
    processing: {
      bg: 'bg-orange-50 border-orange-200',
      text: 'text-orange-700',
      badge: 'bg-action-primary text-surface-primary',
      label: 'Chef is Preparing Your Meal',
      icon: Utensils,
    },
    delivered: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-700',
      badge: 'bg-green-600 text-white',
      label: 'Delivered to Your Table!',
      icon: CheckCircle2,
    },
    cancelled: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-700',
      badge: 'bg-red-600 text-white',
      label: 'Order Cancelled',
      icon: CheckCircle2,
    },
  };

  const currentStatus = statusColors[order.status] || statusColors.incoming;
  const StatusIcon = currentStatus.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-background text-text-primary p-4 max-w-md mx-auto flex flex-col justify-between"
    >
      <div className="space-y-5 pt-4">
        {/* Success Header Badge */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="w-16 h-16 rounded-xl bg-action-primary text-surface-primary flex items-center justify-center mx-auto shadow-md"
          >
            <Receipt className="w-8 h-8" />
          </motion.div>

          <div>
            <h2 className="text-24 font-black text-text-primary tracking-tight">Order Confirmed!</h2>
            <p className="text-12 text-text-secondary mt-1">
              Table #{order.table_label} · Placed at{' '}
              {new Date(order.placed_at || Date.now()).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        {/* Live Status Tracker Box */}
        <motion.div
          animate={{ scale: [1, 1.01, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className={`p-4 rounded-xl border ${currentStatus.bg} shadow-sm space-y-1.5`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-12 font-black uppercase tracking-wider ${currentStatus.text}`}>
              {currentStatus.label}
            </span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
          <p className={`text-[11px] leading-relaxed ${currentStatus.text} opacity-90`}>
            Your kitchen ticket has been printed. Staff will serve your meal directly to Table #{order.table_label}.
          </p>
        </motion.div>

        {/* Itemized Order Receipt */}
        <div className="bg-card rounded-xl p-4 border border-border-default space-y-3 shadow-sm">
          <h4 className="text-12 font-black text-primary uppercase tracking-wider">
            Order Receipt Items
          </h4>

          <div className="space-y-2.5">
            {order.items?.map((it: any, idx: number) => (
              <div key={idx} className="flex justify-between items-start text-12">
                <div>
                  <span className="font-extrabold text-card-foreground">
                    {it.qty}x {it.name || it.name_snapshot}
                  </span>
                  {it.options?.length > 0 && (
                    <span className="block text-[11px] text-text-secondary mt-0.5">
                      + {it.options.map((o: any) => o.name || o.name_snapshot).join(', ')}
                    </span>
                  )}
                </div>
                <span className="font-mono font-bold text-text-primary">
                  {formatNaira((it.price_minor || it.price_minor_snapshot || 0) * (it.qty || 1))}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-border-default flex justify-between items-center text-14 font-black">
            <span className="text-text-secondary">Total Bill</span>
            <span className="text-primary">{formatNaira(order.total_minor || order.subtotal_minor || 0)}</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="py-4 space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOrderAnother}
          className="w-full py-3.5 bg-surface-secondary hover:bg-surface-secondary/80 text-text-primary rounded-xl text-12 font-black border border-border-default transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-primary" />
          Add More Items to Table Tab
        </motion.button>
        <span className="text-[9px] text-text-secondary tracking-widest uppercase text-center block font-mono">
          PLATED QR TABLE ORDERING • IKEJA
        </span>
      </div>
    </motion.div>
  );
}
