'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Utensils, ArrowLeft, Receipt } from 'lucide-react';
import { formatNaira } from '../lib/cart';

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
      bg: 'bg-blue-950/60 border-blue-500/40',
      text: 'text-blue-300',
      badge: 'bg-blue-600 text-white',
      label: 'Order Sent to Kitchen',
      icon: Clock,
    },
    processing: {
      bg: 'bg-indigo-950/80 border-indigo-500/50',
      text: 'text-indigo-200',
      badge: 'bg-indigo-600 text-white',
      label: 'Chef is Preparing Your Meal',
      icon: Utensils,
    },
    delivered: {
      bg: 'bg-emerald-950/60 border-emerald-500/40',
      text: 'text-emerald-300',
      badge: 'bg-emerald-600 text-white',
      label: 'Delivered to Your Table!',
      icon: CheckCircle2,
    },
    cancelled: {
      bg: 'bg-red-950/60 border-red-500/40',
      text: 'text-red-300',
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
      className="min-h-screen bg-[#0B0F19] text-slate-100 p-4 max-w-md mx-auto flex flex-col justify-between"
    >
      <div className="space-y-5 pt-4">
        {/* Success Header Badge */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-600/30 border border-blue-400/30"
          >
            <Receipt className="w-8 h-8" />
          </motion.div>

          <div>
            <h2 className="text-xl font-black text-slate-100 tracking-tight">Order Confirmed!</h2>
            <p className="text-xs text-slate-400 mt-1">
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
          className={`p-4 rounded-2xl border ${currentStatus.bg} shadow-lg space-y-1.5`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-black uppercase tracking-wider ${currentStatus.text}`}>
              {currentStatus.label}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Your kitchen ticket has been printed. Staff will serve your meal directly to Table #{order.table_label}.
          </p>
        </motion.div>

        {/* Itemized Order Receipt */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3 shadow-xl">
          <h4 className="text-xs font-black text-blue-400 uppercase tracking-wider">
            Order Receipt Items
          </h4>

          <div className="space-y-2.5">
            {order.items?.map((it: any, idx: number) => (
              <div key={idx} className="flex justify-between items-start text-xs">
                <div>
                  <span className="font-extrabold text-slate-200">
                    {it.qty}x {it.name || it.name_snapshot}
                  </span>
                  {it.options?.length > 0 && (
                    <span className="block text-[11px] text-slate-400 mt-0.5">
                      + {it.options.map((o: any) => o.name || o.name_snapshot).join(', ')}
                    </span>
                  )}
                </div>
                <span className="font-mono font-bold text-slate-300">
                  {formatNaira((it.price_minor || it.price_minor_snapshot || 0) * (it.qty || 1))}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm font-black">
            <span className="text-slate-300">Total Bill</span>
            <span className="text-blue-400">{formatNaira(order.total_minor || order.subtotal_minor || 0)}</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="py-4 space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOrderAnother}
          className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-2xl text-xs font-black border border-slate-700 transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" />
          Add More Items to Table Tab
        </motion.button>
        <span className="text-[9px] text-slate-500 tracking-widest uppercase text-center block font-mono">
          PLATED QR TABLE ORDERING • IKEJA
        </span>
      </div>
    </motion.div>
  );
}
