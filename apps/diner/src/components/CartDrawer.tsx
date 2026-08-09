'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, ArrowRight, ChefHat } from 'lucide-react';
import { CartItem, formatNaira } from '../lib/cart';

interface CartDrawerProps {
  items: CartItem[];
  outletId: string;
  tableLabel: string;
  onUpdateQty: (cartItemId: string, newQty: number) => void;
  onOrderSuccess: (order: any) => void;
}

export function CartDrawer({
  items,
  outletId,
  tableLabel,
  onUpdateQty,
  onOrderSuccess,
}: CartDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');

  const totalItems = items.reduce((acc, item) => acc + item.qty, 0);
  const subtotalMinor = items.reduce((acc, item) => {
    const optionsDelta = item.options.reduce((oAcc, opt) => oAcc + opt.price_delta_minor, 0);
    return acc + (item.price_minor + optionsDelta) * item.qty;
  }, 0);

  if (totalItems === 0) return null;

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    try {
      const idempotencyKey = crypto.randomUUID();
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({
          outlet_id: outletId,
          table_label: tableLabel,
          client_created_at: new Date().toISOString(),
          items: items.map((it) => ({
            menu_item_id: it.menu_item_id,
            qty: it.qty,
            notes: orderNotes || it.notes || null,
            option_ids: it.options.map((o) => o.id),
          })),
        }),
      });

      const data = await res.json();
      if (res.ok && data.order) {
        onOrderSuccess(data.order);
      } else {
        alert(data.error?.message || 'Failed to submit order');
      }
    } catch (err: any) {
      alert(err.message || 'Network error submitting order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Sticky Bottom Floating Bar (StoreHub Inspired) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-4 left-0 right-0 z-40 px-4 pointer-events-none"
          >
            <div className="max-w-md mx-auto pointer-events-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsOpen(true)}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-3.5 rounded-2xl shadow-2xl shadow-blue-600/40 flex items-center justify-between font-black border border-blue-400/40 backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/20 text-white text-xs flex items-center justify-center font-black border border-white/30">
                    {totalItems}
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-black block leading-none">View Cart Order</span>
                    <span className="text-[10px] text-blue-200 font-medium">Table #{tableLabel}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-black tracking-tight">
                    {formatNaira(subtotalMinor)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-blue-200" />
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Order Review Sheet */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:p-4">
            {/* Scrim Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-md"
            />

            {/* Sheet Container */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[85vh] flex flex-col relative z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-black text-slate-100 tracking-tight flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-blue-400" />
                    Review Table Order
                  </h2>
                  <p className="text-xs text-slate-400">
                    Table {tableLabel} · Dine First, Pay at Counter
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
                {items.map((item) => {
                  const itemOptionsDelta = item.options.reduce(
                    (a, o) => a + o.price_delta_minor,
                    0
                  );
                  const lineTotalMinor = (item.price_minor + itemOptionsDelta) * item.qty;

                  return (
                    <div
                      key={item.cart_item_id}
                      className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 flex justify-between items-center gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black text-slate-200 truncate">{item.name}</h4>
                        {item.options.length > 0 && (
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            + {item.options.map((o) => o.name).join(', ')}
                          </p>
                        )}
                        <span className="text-xs font-extrabold text-blue-400 mt-1 block">
                          {formatNaira(lineTotalMinor)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                        <button
                          onClick={() => onUpdateQty(item.cart_item_id, item.qty - 1)}
                          className="w-7 h-7 rounded-lg bg-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center hover:bg-slate-700 active:scale-90 transition-all"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-black text-slate-100 w-5 text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.cart_item_id, item.qty + 1)}
                          className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center hover:bg-blue-500 active:scale-90 transition-all shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <ChefHat className="w-3.5 h-3.5 text-blue-400" />
                    Kitchen / Special Notes
                  </label>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Extra spicy pepper, serve drinks extra cold..."
                    rows={2}
                    className="w-full p-3 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Footer Summary & Submit */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Subtotal Amount
                  </span>
                  <span className="text-lg font-black text-slate-100">
                    {formatNaira(subtotalMinor)}
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 text-center">
                  Submitting sends order directly to kitchen printer & counter till.
                </p>

                <motion.button
                  whileTap={!isSubmitting ? { scale: 0.97 } : {}}
                  disabled={isSubmitting}
                  onClick={handleSubmitOrder}
                  className={`w-full py-3.5 rounded-2xl font-black text-xs text-white shadow-xl transition-all ${
                    isSubmitting
                      ? 'bg-blue-900/50 text-blue-300 cursor-wait'
                      : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/30'
                  }`}
                >
                  {isSubmitting ? 'Sending Order to Kitchen...' : 'Confirm & Place Order'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
