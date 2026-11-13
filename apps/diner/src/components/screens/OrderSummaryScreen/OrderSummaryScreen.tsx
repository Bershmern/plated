"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Trash2, Edit2, ArrowLeft } from "lucide-react"
import { MenuItem } from '@/components/screens/MenuScreen/MenuScreen'

export interface CartItem {
  cart_item_id: string
  menu_item_id: string
  name: string
  price_minor: number
  qty: number
  addons: { id: string, name: string, price_delta_minor: number }[]
  description?: string | null
}

interface OrderSummaryScreenProps {
  tableLabel: string | null
  orderNo: string
  cartItems: CartItem[]
  onBack: () => void
  onOrder: () => void
  onUpdateQty: (cartItemId: string, newQty: number) => void
  onRemoveItem: (cartItemId: string) => void
  onEditItem: (item: CartItem) => void
}

export function OrderSummaryScreen({
  tableLabel,
  orderNo,
  cartItems,
  onBack,
  onOrder,
  onUpdateQty,
  onRemoveItem,
  onEditItem
}: OrderSummaryScreenProps) {
  
  const totalMinor = cartItems.reduce((acc, item) => {
    const addonsTotal = item.addons.reduce((sum, a) => sum + a.price_delta_minor, 0)
    return acc + ((item.price_minor + addonsTotal) * item.qty)
  }, 0)

  return (
    <div className="flex-1 flex flex-col bg-surface-primary overflow-hidden h-full">
      <div className="relative pt-12 pb-6 px-6 shrink-0">
        {/* Top Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-border-default overflow-hidden">
             {/* Logo Placeholder */}
             <div className="w-full h-full flex items-center justify-center bg-white text-12">🍕</div>
          </div>
          <h2 className="text-16 font-bold text-text-primary">Pizza Heaven</h2>
        </div>

        {/* Progress Bar Placeholder */}
        <div className="flex flex-col gap-1 mb-8">
          <div className="text-[8px] font-bold text-text-primary text-center uppercase tracking-widest">
            50% Complete
          </div>
          <div className="w-full h-1 bg-border-default rounded-full overflow-hidden">
            <div className="w-[50%] h-full bg-action-primary" />
          </div>
        </div>

        {/* Title & Meta Info */}
        <div className="relative z-10 w-3/5 mb-2">
          <h1 className="text-24 font-bold text-text-primary tracking-tight mb-6">Order Summary</h1>
          
          <div className="flex flex-col gap-1.5 text-12 text-text-secondary font-medium">
            <p>Table: <span className="text-text-primary font-bold">{tableLabel || '007'}</span></p>
            <p>Order No: <span className="text-text-primary font-bold">#{orderNo}</span></p>
            <p>Processing Time: <span className="text-text-primary font-bold">&lt;15 mins</span></p>
          </div>
        </div>

        {/* Hero Image (Fixed Table on right) - same as Menu */}
        <div className="absolute top-20 -right-24 w-[300px] h-[300px] z-0 pointer-events-none">
          <img
            src="/brand/table/table.svg"
            alt="Table"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Cart Items Section */}
      <div className="flex-1 flex flex-col bg-surface-primary px-6 relative z-20 overflow-y-auto pb-32">
        <div className="space-y-8 pt-4">
          {cartItems.map((item) => {
            const itemBasePrice = item.price_minor / 100
            const itemAddonsTotal = item.addons.reduce((sum, a) => sum + (a.price_delta_minor / 100), 0)
            const itemTotal = (itemBasePrice + itemAddonsTotal) * item.qty

            return (
              <div key={item.cart_item_id} className="flex flex-col gap-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-16 font-bold text-text-primary tracking-tight">{item.name}</h3>
                    {item.description && (
                      <p className="text-12 text-text-secondary mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-14 font-bold text-text-primary">
                      ₦{itemBasePrice.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                    </p>
                    {itemAddonsTotal > 0 && (
                      <p className="text-10 text-text-secondary">
                        + ₦{itemAddonsTotal.toLocaleString('en-NG')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Addons List */}
                {item.addons.length > 0 && (
                  <div className="pl-4 border-l-2 border-border-default space-y-1 my-1">
                    {item.addons.map(addon => (
                      <p key={addon.id} className="text-12 text-text-secondary">
                        {addon.name}
                      </p>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-6 mt-1">
                  <button 
                    onClick={() => onRemoveItem(item.cart_item_id)}
                    className="text-text-secondary hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onEditItem(item)}
                    className="flex items-center gap-1 text-12 font-medium text-text-secondary hover:text-text-primary"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border border-border-strong flex items-center justify-center text-[10px] cursor-pointer" onClick={() => onUpdateQty(item.cart_item_id, Math.max(1, item.qty - 1))}>-</span>
                    <span className="text-14 font-bold text-text-primary w-4 text-center">{item.qty}</span>
                    <span className="w-4 h-4 rounded-full border border-border-strong flex items-center justify-center text-[10px] cursor-pointer" onClick={() => onUpdateQty(item.cart_item_id, item.qty + 1)}>+</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-surface-primary/80 backdrop-blur-md border-t border-border-default px-6 py-5 z-30">
        <div className="flex justify-between items-end mb-4">
          <p className="text-12 text-text-secondary font-medium">Total (Incl. Val. Tax)</p>
          <p className="text-16 font-bold text-text-primary">
            ₦{(totalMinor / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-secondary border border-border-strong text-text-secondary hover:text-text-primary shrink-0 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={onOrder}
            className="flex-1 h-12 rounded-xl bg-action-primary hover:bg-action-primary/90 text-surface-primary text-16 font-bold transition-colors shadow-sm"
          >
            Order
          </button>
        </div>
        
        {/* Powered by Plated */}
        <div className="flex justify-center mt-3 pointer-events-none">
          <p className="text-[10px] text-text-secondary uppercase tracking-wider font-medium">
            powered by <span className="text-action-primary font-bold">Plated.</span>
          </p>
        </div>
      </div>
    </div>
  )
}
