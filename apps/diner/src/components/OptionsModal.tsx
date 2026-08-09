'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { MenuItem } from './MenuItemCard';
import { formatNaira, CartItemOption } from '../lib/cart';

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
          className="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 32 }}
          className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[85vh] flex flex-col relative z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-black text-slate-100 tracking-tight">{item.name}</h2>
              <p className="text-xs text-blue-400 font-bold">{formatNaira(item.price_minor)} base price</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-slate-100 flex items-center justify-center transition-colors"
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
                    <h4 className="text-xs font-black text-blue-400 uppercase tracking-wider">
                      {group.name}
                    </h4>
                    <span className="text-[10px] font-semibold text-slate-400">
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
                              ? 'bg-blue-600/15 border-blue-500/60 shadow-md shadow-blue-500/10'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-xs font-semibold text-slate-200">{opt.name}</span>
                          <div className="flex items-center gap-2.5">
                            {opt.price_delta_minor > 0 && (
                              <span className="text-xs font-bold text-blue-400">
                                +{formatNaira(opt.price_delta_minor)}
                              </span>
                            )}
                            <div
                              className={`w-5 h-5 rounded-${
                                group.max_select === 1 ? 'full' : 'md'
                              } border flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                                  : 'border-slate-700 bg-slate-900'
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
          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Total Price
              </span>
              <span className="text-xl font-black text-slate-100">{formatNaira(finalPriceMinor)}</span>
            </div>

            <motion.button
              whileTap={isValid ? { scale: 0.95 } : {}}
              disabled={!isValid}
              onClick={() => onAddToCart(item, flatSelectedOptions)}
              className={`px-6 py-3.5 rounded-2xl font-black text-xs transition-all shadow-lg ${
                isValid
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
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
