"use client"

import * as React from "react"
import { Trash2, Minus, Plus } from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@plated/ui"
import { Checkbox } from "@plated/ui"
import { MenuItem, OptionGroup, Option } from '@/components/screens/MenuScreen/MenuScreen'

interface ItemAddonDrawerProps {
  item: MenuItem | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (item: MenuItem, selectedOptions: Option[], qty: number) => void
}

export function ItemAddonDrawer({
  item,
  isOpen,
  onClose,
  onAddToCart,
}: ItemAddonDrawerProps) {
  const [selectedOptions, setSelectedOptions] = React.useState<Option[]>([])
  const [qty, setQty] = React.useState(1)

  React.useEffect(() => {
    if (isOpen) {
      setSelectedOptions([])
      setQty(1)
    }
  }, [isOpen, item])

  if (!item) return null

  const handleToggleOption = (group: OptionGroup, option: Option) => {
    setSelectedOptions((prev) => {
      const isSelected = prev.some(o => o.id === option.id);
      if (isSelected) {
        return prev.filter(o => o.id !== option.id);
      } else {
        // Enforce max selection
        const groupSelected = prev.filter(o => group.options.some(go => go.id === o.id));
        if (group.max_select === 1) {
          // Replace
          return [...prev.filter(o => !group.options.some(go => go.id === o.id)), option];
        } else if (groupSelected.length >= group.max_select) {
          return prev; // Reached max
        }
        return [...prev, option];
      }
    });
  }

  const basePrice = item.price_minor / 100
  const addonsTotal = selectedOptions.reduce((acc, opt) => acc + (opt.price_delta_minor / 100), 0)
  const totalPrice = (basePrice + addonsTotal) * qty

  // Validation
  const isValid = item.option_groups.every(g => {
    const groupSelected = selectedOptions.filter(o => g.options.some(go => go.id === o.id));
    return groupSelected.length >= g.min_select;
  });

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[90vh] bg-surface-primary">
        <DrawerHeader className="text-left pb-4 border-b border-border-default">
          <DrawerTitle className="flex justify-between items-start gap-4">
            <span className="text-16 font-bold text-text-primary">{item.name}</span>
            <span className="text-16 font-bold text-text-primary whitespace-nowrap">
              ₦{basePrice.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
            </span>
          </DrawerTitle>
          {item.description && (
            <p className="text-12 text-text-secondary mt-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </DrawerHeader>

        <div className="p-6 overflow-y-auto pb-24">
          <div className="space-y-6">
            {item.option_groups.map((group) => (
              <div key={group.id} className="space-y-3">
                 <div className="flex justify-between items-center">
                   <h4 className="font-bold text-14 text-text-primary">{group.name}</h4>
                   <span className="text-12 text-text-secondary">
                     {group.min_select > 0 ? `Required (${group.min_select})` : 'Optional'}
                   </span>
                 </div>
                 {group.options.map((opt) => (
                   <label
                    key={opt.id}
                    className="flex items-center justify-between gap-4 cursor-pointer group"
                   >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedOptions.some(o => o.id === opt.id)}
                        onCheckedChange={() => handleToggleOption(group, opt)}
                      />
                      <span className="text-14 font-medium text-text-primary group-hover:text-action-primary transition-colors">
                        {opt.name}
                      </span>
                    </div>
                    {opt.price_delta_minor > 0 && (
                      <span className="text-12 font-medium text-text-secondary">
                        + ₦{(opt.price_delta_minor / 100).toLocaleString("en-NG")}
                      </span>
                    )}
                   </label>
                 ))}
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-surface-primary border-t border-border-default flex items-center gap-4 z-10">
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-secondary border border-border-strong text-text-secondary hover:text-destructive shrink-0"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          
          <button
            disabled={!isValid}
            onClick={() => onAddToCart(item, selectedOptions, qty)}
            className="flex-1 h-12 rounded-xl bg-text-primary flex items-center justify-between px-4 text-14 font-bold text-surface-primary disabled:opacity-50"
          >
            <span>Add to Cart</span>
            <span>₦{totalPrice.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-14 font-bold text-text-primary">{qty}</span>
            <div className="flex flex-col gap-1">
              <button 
                onClick={() => setQty(q => q + 1)}
                className="w-5 h-5 rounded-full border border-border-strong flex items-center justify-center text-text-primary"
              >
                <Plus className="w-3 h-3" />
              </button>
              <button 
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-5 h-5 rounded-full border border-border-strong flex items-center justify-center text-text-primary"
              >
                <Minus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
