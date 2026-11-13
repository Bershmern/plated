'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, ArrowRight, ChefHat, User, Phone, MapPin } from 'lucide-react';
import { CartItem, formatNaira } from '@/lib/cart';

interface CartDrawerProps {
  items: CartItem[];
  outletId: string;
  tableLabel: string | null;
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

  // Contact Form for Public Orders
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderType, setOrderType] = useState<'dine_in' | 'pickup' | 'delivery'>(
    tableLabel ? 'dine_in' : 'pickup'
  );

  const totalItems = items.reduce((acc, item) => acc + item.qty, 0);
  const subtotalMinor = items.reduce((acc, item) => {
    const optionsDelta = item.options.reduce((oAcc: number, opt: any) => oAcc + opt.price_delta_minor, 0);
    return acc + (item.price_minor + optionsDelta) * item.qty;
  }, 0);

  if (totalItems === 0) return null;

  const isFormValid = tableLabel
    ? true
    : customerName.trim() !== '' &&
      customerPhone.trim() !== '' &&
      (orderType === 'pickup' || deliveryAddress.trim() !== '');

  const handleSubmitOrder = async () => {
    if (!isFormValid) return;

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
          fulfillment_type: orderType,
          customer_name: customerName || null,
          customer_phone: customerPhone || null,
          delivery_address: orderType === 'delivery' ? deliveryAddress : null,
          client_created_at: new Date().toISOString(),
          items: items.map((it) => ({
            menu_item_id: it.menu_item_id,
            qty: it.qty,
            notes: orderNotes || it.notes || null,
            option_ids: it.options.map((o: any) => o.id),
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
                className="w-full bg-action-primary text-surface-primary p-3.5 rounded-xl shadow-lg flex items-center justify-between font-black border border-action-primary/20 backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/20 text-white text-12 flex items-center justify-center font-black border border-white/30">
                    {totalItems}
                  </div>
                  <div className="text-left">
                    <span className="text-12 font-black block leading-none">View Cart Order</span>
                    <span className="text-[10px] text-surface-primary/80 font-medium">
                      {tableLabel ? `Table #${tableLabel}` : 'Pickup & Delivery'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-14 font-black tracking-tight">
                    {formatNaira(subtotalMinor)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-surface-primary/80" />
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
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Sheet Container */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              className="w-full max-w-md bg-card border border-border-default rounded-t-xl sm:rounded-xl p-6 shadow-2xl max-h-[85vh] flex flex-col relative z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-3 border-b border-border-default">
                <div>
                  <h2 className="text-24 font-black text-card-foreground tracking-tight flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    Review Order
                  </h2>
                  <p className="text-12 text-text-secondary">
                    {tableLabel
                      ? `Table ${tableLabel} · Dine First, Pay at Counter`
                      : 'Pickup & Delivery · Pay at Checkout'}
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-surface-secondary text-text-secondary hover:text-text-primary flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
                <div className="space-y-3">
                  {items.map((item) => {
                    const itemOptionsDelta = item.options.reduce(
                      (a: number, o: any) => a + o.price_delta_minor,
                      0
                    );
                    const lineTotalMinor = (item.price_minor + itemOptionsDelta) * item.qty;

                    return (
                      <div
                        key={item.cart_item_id}
                        className="p-3.5 bg-surface-secondary/50 rounded-xl border border-border-default flex justify-between items-center gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="text-12 font-black text-text-primary truncate">{item.name}</h4>
                          {item.options.length > 0 && (
                            <p className="text-[11px] text-text-secondary mt-0.5 truncate">
                              + {item.options.map((o: any) => o.name).join(', ')}
                            </p>
                          )}
                          <span className="text-12 font-extrabold text-primary mt-1 block">
                            {formatNaira(lineTotalMinor)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 bg-card p-1 rounded-xl border border-border-default">
                          <button
                            onClick={() => onUpdateQty(item.cart_item_id, item.qty - 1)}
                            className="w-7 h-7 rounded-lg bg-surface-secondary text-text-primary font-bold text-12 flex items-center justify-center hover:bg-surface-secondary/80 active:scale-90 transition-all"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-12 font-black text-text-primary w-5 text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.cart_item_id, item.qty + 1)}
                            className="w-7 h-7 rounded-lg bg-action-primary text-surface-primary font-bold text-12 flex items-center justify-center hover:bg-action-primary/90 active:scale-90 transition-all shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <label className="block text-12 font-bold text-text-secondary mb-1.5 flex items-center gap-1.5">
                    <ChefHat className="w-3.5 h-3.5 text-primary" />
                    Kitchen / Special Notes
                  </label>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Extra spicy pepper, serve drinks extra cold..."
                    rows={2}
                    className="w-full p-3 text-12 bg-surface-secondary/50 border border-border-default rounded-xl text-text-primary placeholder-muted-foreground focus:outline-none focus:border-action-primary transition-all"
                  />
                </div>

                {/* Public Order Contact Form */}
                {!tableLabel && (
                  <div className="pt-4 border-t border-border-default space-y-4">
                    <div>
                      <label className="block text-12 font-bold text-text-secondary mb-2">Order Method</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setOrderType('pickup')}
                          className={`flex-1 py-2 text-12 font-bold rounded-xl border transition-all ${
                            orderType === 'pickup'
                              ? 'bg-action-primary text-surface-primary border-action-primary shadow-sm'
                              : 'bg-surface-secondary/50 text-text-secondary border-border-default hover:bg-surface-secondary'
                          }`}
                        >
                          Pickup
                        </button>
                        <button
                          onClick={() => setOrderType('delivery')}
                          className={`flex-1 py-2 text-12 font-bold rounded-xl border transition-all ${
                            orderType === 'delivery'
                              ? 'bg-action-primary text-surface-primary border-action-primary shadow-sm'
                              : 'bg-surface-secondary/50 text-text-secondary border-border-default hover:bg-surface-secondary'
                          }`}
                        >
                          Delivery
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="relative">
                        <User className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Your Name *"
                          className="w-full pl-9 pr-4 py-2.5 text-12 bg-surface-secondary/50 border border-border-default rounded-xl text-text-primary placeholder-muted-foreground focus:outline-none focus:border-action-primary transition-all"
                        />
                      </div>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="Phone Number *"
                          className="w-full pl-9 pr-4 py-2.5 text-12 bg-surface-secondary/50 border border-border-default rounded-xl text-text-primary placeholder-muted-foreground focus:outline-none focus:border-action-primary transition-all"
                        />
                      </div>
                      {orderType === 'delivery' && (
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
                          <textarea
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            placeholder="Full Delivery Address *"
                            rows={2}
                            className="w-full pl-9 pr-4 py-2.5 text-12 bg-surface-secondary/50 border border-border-default rounded-xl text-text-primary placeholder-muted-foreground focus:outline-none focus:border-action-primary transition-all"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Summary & Submit */}
              <div className="pt-4 border-t border-border-default space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-12 font-bold text-text-secondary uppercase tracking-wider">
                    Subtotal Amount
                  </span>
                  <span className="text-24 font-black text-text-primary">
                    {formatNaira(subtotalMinor)}
                  </span>
                </div>

                <p className="text-[10px] text-text-secondary text-center">
                  {tableLabel
                    ? 'Submitting sends order directly to kitchen printer & counter till.'
                    : 'A small transaction fee of 0.5% applies for online payments.'}
                </p>

                <motion.button
                  whileTap={!isSubmitting && isFormValid ? { scale: 0.97 } : {}}
                  disabled={isSubmitting || !isFormValid}
                  onClick={handleSubmitOrder}
                  className={`w-full py-3.5 rounded-xl font-black text-12 transition-all shadow-md ${
                    isSubmitting
                      ? 'bg-action-primary/50 text-surface-primary cursor-wait'
                      : isFormValid
                      ? 'bg-action-primary text-surface-primary hover:bg-action-primary/90'
                      : 'bg-surface-secondary text-text-secondary cursor-not-allowed border border-border-default'
                  }`}
                >
                  {isSubmitting
                    ? 'Processing...'
                    : tableLabel
                    ? 'Confirm & Place Order'
                    : 'Proceed to Payment'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
