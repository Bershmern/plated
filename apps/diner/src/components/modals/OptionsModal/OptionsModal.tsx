'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { MenuItem } from '@/components/ui/MenuItemCard/MenuItemCard';
import { formatNaira, CartItemOption } from '@/lib/cart';

interface OptionsModalProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (item: MenuItem, selectedOptions: CartItemOption[]) => void;
}

export function OptionsModal({ item, onClose, onAddToCart }: OptionsModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, CartItemOption[]>>({});

  const toggleOption = (group: any, opt: any) => {
    const current = selectedOptions[group.id] || [];
    const exists = current.some((o) => o.id === opt.id);

    if (group.max_select === 1) {
      // Single select (radio)
      setSelectedOptions({
        ...selectedOptions,
        [group.id]: [{ id: opt.id, name: opt.name, price_delta_minor: opt.price_delta_minor }],
      });
    } else {
      // Multi select (checkbox)
      if (exists) {
        setSelectedOptions({
          ...selectedOptions,
          [group.id]: current.filter((o) => o.id !== opt.id),
        });
      } else {
        if (current.length < group.max_select) {
          setSelectedOptions({
            ...selectedOptions,
            [group.id]: [...current, { id: opt.id, name: opt.name, price_delta_minor: opt.price_delta_minor }],
          });
        }
      }
    }
  };

  // Validation: check min_select
  const isValid = item.option_groups.every((g) => {
    const sel = selectedOptions[g.id] || [];
    return sel.length >= g.min_select;
  });

  // Calculate total item price with options
  const flatSelectedOptions = Object.values(selectedOptions).flat();
  const optionsTotalDelta = flatSelectedOptions.reduce((acc, o) => acc + o.price_delta_minor, 0);
  const finalPriceMinor = item.price_minor + optionsTotalDelta;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 32 }}
          className="w-full max-w-md bg-card border border-border-default rounded-t-xl sm:rounded-xl p-6 shadow-2xl max-h-[85vh] flex flex-col relative z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-4 pb-3 border-b border-border-default">
            <div>
              <h2 className="text-24 font-black text-card-foreground tracking-tight">{item.name}</h2>
              <p className="text-12 text-primary font-bold">{formatNaira(item.price_minor)} base price</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-secondary text-text-secondary hover:text-text-primary flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Option Groups List */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-1 my-2">
            {item.option_groups.map((group) => {
              const currentSel = selectedOptions[group.id] || [];
              return (
                <div key={group.id} className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <h4 className="text-12 font-black text-primary uppercase tracking-wider">
                      {group.name}
                    </h4>
                    <span className="text-[10px] font-semibold text-text-secondary">
                      {group.min_select > 0
                        ? `Required (select ${group.min_select})`
                        : `Optional (up to ${group.max_select})`}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {group.options.map((opt: any) => {
                      const isSelected = currentSel.some((o) => o.id === opt.id);
                      return (
                        <motion.div
                          key={opt.id}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleOption(group, opt)}
                          className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-action-primary/10 border-action-primary shadow-sm'
                              : 'bg-surface-secondary/50 border-border-default hover:border-border-default/80'
                          }`}
                        >
                          <span className="text-12 font-semibold text-text-primary">{opt.name}</span>
                          <div className="flex items-center gap-2.5">
                            {opt.price_delta_minor > 0 && (
                              <span className="text-12 font-bold text-primary">
                                +{formatNaira(opt.price_delta_minor)}
                              </span>
                            )}
                            <div
                              className={`w-5 h-5 rounded-${
                                group.max_select === 1 ? 'full' : 'md'
                              } border flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'bg-action-primary border-action-primary text-surface-primary shadow-sm'
                                  : 'border-border-default bg-background'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Submit */}
          <div className="mt-4 pt-4 border-t border-border-default flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-text-secondary uppercase font-bold block">
                Total Price
              </span>
              <span className="text-24 font-black text-text-primary">{formatNaira(finalPriceMinor)}</span>
            </div>

            <motion.button
              whileTap={isValid ? { scale: 0.95 } : {}}
              disabled={!isValid}
              onClick={() => onAddToCart(item, flatSelectedOptions)}
              className={`px-6 py-3.5 rounded-xl font-black text-12 transition-all shadow-md ${
                isValid
                  ? 'bg-action-primary text-surface-primary hover:bg-action-primary/90'
                  : 'bg-surface-secondary text-text-secondary cursor-not-allowed border border-border-default'
              }`}
            >
              Add to Order
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
