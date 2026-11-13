"use client"

import * as React from "react"
import { CreditCard, Building2, Hash, Store } from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@plated/ui"

export type PaymentMethod = "card" | "bank_transfer" | "ussd" | "counter"

interface PaymentModalProps {
  isOpen: boolean
  orderType?: 'dine_in' | 'public'
  onClose: () => void
  onContinue: (method: PaymentMethod, customerDetails: { name: string, phone: string, fulfillment: string, address: string }) => void
}

export function PaymentModal({
  isOpen,
  orderType = 'dine_in',
  onClose,
  onContinue
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethod>("card")
  
  const [name, setName] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [fulfillment, setFulfillment] = React.useState<'pickup'|'delivery'>('pickup')
  const [address, setAddress] = React.useState('')
  
  // Reset when opened
  React.useEffect(() => {
    if (isOpen) {
      setSelectedMethod("card")
    }
  }, [isOpen])

  const handleContinue = () => {
    if (orderType === 'public' && !name) {
      alert("Please enter your name.");
      return;
    }
    onContinue(selectedMethod, { name, phone, fulfillment: orderType === 'public' ? fulfillment : 'dine_in', address });
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[90vh] bg-surface-primary">
        <DrawerHeader className="text-center pb-6">
          <DrawerTitle className="text-16 font-bold text-text-primary tracking-tight">
            Checkout Details
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-6 pb-8 space-y-6 overflow-y-auto custom-scrollbar max-h-[70vh]">
          
          {orderType === 'public' && (
            <div className="space-y-4 border-b border-border-default pb-6">
              <h4 className="text-14 font-bold text-text-primary">Order Info</h4>
              
              <div className="flex bg-surface-secondary rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setFulfillment('pickup')}
                  className={`flex-1 py-1.5 text-13 font-bold rounded-md transition-colors ${fulfillment === 'pickup' ? 'bg-surface-primary shadow-sm text-text-primary' : 'text-text-tertiary'}`}
                >
                  Pickup
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillment('delivery')}
                  className={`flex-1 py-1.5 text-13 font-bold rounded-md transition-colors ${fulfillment === 'delivery' ? 'bg-surface-primary shadow-sm text-text-primary' : 'text-text-tertiary'}`}
                >
                  Delivery
                </button>
              </div>

              <div>
                <label className="text-12 font-bold text-text-secondary block mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-surface-secondary border border-border-default rounded-lg px-3 py-2 text-14 text-text-primary" 
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="text-12 font-bold text-text-secondary block mb-1">Phone Number (Optional)</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-surface-secondary border border-border-default rounded-lg px-3 py-2 text-14 text-text-primary" 
                  placeholder="080..."
                />
              </div>

              {fulfillment === 'delivery' && (
                <div>
                  <label className="text-12 font-bold text-text-secondary block mb-1">Delivery Address</label>
                  <textarea 
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full bg-surface-secondary border border-border-default rounded-lg px-3 py-2 text-14 text-text-primary" 
                    placeholder="Enter full address..."
                    rows={2}
                  />
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <h4 className="text-14 font-bold text-text-primary border-b border-border-default pb-2">
              Payment Method
            </h4>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="radio" 
                  name="payment" 
                  value="card"
                  checked={selectedMethod === "card"}
                  onChange={() => setSelectedMethod("card")}
                  className="peer sr-only"
                />
                <div className="w-4 h-4 rounded-full border border-action-primary peer-checked:border-[4px] transition-all"></div>
              </div>
              <CreditCard className="w-4 h-4 text-text-secondary group-hover:text-action-primary transition-colors" />
              <span className="text-14 font-medium text-text-primary group-hover:text-action-primary transition-colors">Card</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="radio" 
                  name="payment" 
                  value="bank_transfer"
                  checked={selectedMethod === "bank_transfer"}
                  onChange={() => setSelectedMethod("bank_transfer")}
                  className="peer sr-only"
                />
                <div className="w-4 h-4 rounded-full border border-action-primary peer-checked:border-[4px] transition-all"></div>
              </div>
              <Building2 className="w-4 h-4 text-text-secondary group-hover:text-action-primary transition-colors" />
              <span className="text-14 font-medium text-text-primary group-hover:text-action-primary transition-colors">Bank Transfer</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="radio" 
                  name="payment" 
                  value="ussd"
                  checked={selectedMethod === "ussd"}
                  onChange={() => setSelectedMethod("ussd")}
                  className="peer sr-only"
                />
                <div className="w-4 h-4 rounded-full border border-action-primary peer-checked:border-[4px] transition-all"></div>
              </div>
              <Hash className="w-4 h-4 text-text-secondary group-hover:text-action-primary transition-colors" />
              <span className="text-14 font-medium text-text-primary group-hover:text-action-primary transition-colors">USSD</span>
            </label>
          </div>

          <div className="pt-2">
            <label className="flex items-center justify-between cursor-pointer group border border-border-default rounded-xl p-3 hover:border-action-primary transition-colors">
              <div className="flex items-center gap-3">
                <Store className="w-4 h-4 text-text-secondary group-hover:text-action-primary transition-colors" />
                <span className="text-14 font-bold text-text-primary group-hover:text-action-primary transition-colors">Pay at Counter</span>
              </div>
              <div className="relative flex items-center justify-center">
                <input 
                  type="radio" 
                  name="payment" 
                  value="counter"
                  checked={selectedMethod === "counter"}
                  onChange={() => setSelectedMethod("counter")}
                  className="peer sr-only"
                />
                <div className="w-4 h-4 rounded-full border border-action-primary peer-checked:border-[4px] transition-all"></div>
              </div>
            </label>
          </div>

          <div className="pt-4">
            <button
              onClick={handleContinue}
              className="w-full h-12 rounded-xl bg-action-primary hover:bg-action-primary/90 text-surface-primary text-14 font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              Continue to Pay 
              <span className="text-10">⚪</span> 
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
