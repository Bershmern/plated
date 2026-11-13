"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ChevronDown } from "lucide-react"

export interface Option {
  id: string;
  name: string;
  price_delta_minor: number;
}

export interface OptionGroup {
  id: string;
  name: string;
  min_select: number;
  max_select: number;
  options: Option[];
}

export interface MenuItem {
  id: string
  name: string
  price_minor: number
  description?: string | null
  image_url?: string | null
  availability: string
  option_groups: OptionGroup[]
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

interface MenuScreenProps {
  tableLabel: string | null
  orderNo: string
  categories: MenuCategory[]
  onItemSelect: (item: MenuItem) => void
  activeCategory: string
  setActiveCategory: (cat: string) => void
  cartCount: number
  onViewCart: () => void
  chain: any
  recognition?: any
}

// 520ms Landing Animation Tokens
const landingTransition = {
  duration: 0.52,
  ease: [0.34, 1.56, 0.64, 1], // Custom spring-like easing for Settle
}
const shadowTransition = {
  duration: 0.38,
  ease: "easeOut",
}
const textTransition = {
  duration: 0.2, // 200ms swapping
  ease: "easeInOut",
}

export function MenuScreen({
  tableLabel,
  orderNo,
  categories,
  onItemSelect,
  activeCategory,
  setActiveCategory,
  cartCount,
  onViewCart,
  chain,
  recognition
}: MenuScreenProps) {
  const activeItems = categories.find(c => c.name === activeCategory)?.items || [];
  
  // The first item of the active category is the featured one.
  const featuredItem = activeItems.length > 0 ? activeItems[0] : null;

  return (
    <div className="flex-1 flex flex-col bg-surface-primary overflow-hidden">
      <div className="relative pt-12 pb-6 px-6 h-[280px] shrink-0">
        {/* Top Header */}
        <div className="flex items-center gap-2 mb-4 relative z-20">
          <div className="w-8 h-8 rounded-full bg-border-default overflow-hidden border border-border-default">
             {chain?.logo_url ? (
               <img src={chain.logo_url} className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center bg-white text-12">🍕</div>
             )}
          </div>
          <h2 className="text-16 font-bold text-text-primary">{chain?.display_name || chain?.name}</h2>
        </div>

        {/* Silent Diner Recognition */}
        <AnimatePresence>
          {recognition && recognition.order_count > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
              className="relative z-20 w-fit"
            >
              <div className="bg-action-primary/10 border border-action-primary/20 px-3 py-1.5 rounded-full flex items-center gap-2">
                <span className="text-12 font-bold text-action-primary">
                  Welcome back! This is your {recognition.order_count}{[11, 12, 13].includes(recognition.order_count % 100) ? 'th' : recognition.order_count % 10 === 1 ? 'st' : recognition.order_count % 10 === 2 ? 'nd' : recognition.order_count % 10 === 3 ? 'rd' : 'th'} order with us.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Featured Dish Text Overlay (Swaps at 200ms) */}
        <div className="relative z-20 w-[60%] mt-2">
          <AnimatePresence mode="wait">
            {featuredItem ? (
              <motion.div
                key={featuredItem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={textTransition}
              >
                <h1 className="text-24 font-bold text-text-primary tracking-tight mb-1 line-clamp-2 leading-tight">
                  {featuredItem.name}
                </h1>
                <p className="text-16 font-bold text-text-primary mb-3">
                  ₦{(featuredItem.price_minor / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-12 text-text-secondary leading-relaxed line-clamp-2">
                  {featuredItem.description}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={textTransition}
              >
                <h1 className="text-24 font-bold text-text-primary tracking-tight mb-1">Welcome!</h1>
                <p className="text-12 text-text-secondary leading-relaxed">Select a category to view dishes.</p>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex flex-col gap-0.5 text-10 text-text-tertiary font-medium mt-4">
            <p>Table: <span className="text-text-primary font-bold">{tableLabel || '007'}</span></p>
          </div>
        </div>

        {/* Hero Image (Animated 520ms Landing) */}
        <div className="absolute top-10 -right-24 w-[320px] h-[320px] z-10 pointer-events-none">
          {/* Base Table */}
          <img
            src="/brand/table/table.svg"
            alt="Table"
            className="absolute inset-0 w-full h-full object-contain"
          />
          
          {/* Light pool bloom on Settle */}
          <AnimatePresence mode="popLayout">
            {featuredItem && (
              <motion.div
                key={`bloom-${featuredItem.id}`}
                className="absolute inset-0 bg-white/20 rounded-full blur-[40px] mix-blend-overlay"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.38, duration: 0.14 }} // Starts exactly at Contact (380ms)
              />
            )}
          </AnimatePresence>

          {/* Contact Shadows */}
          <AnimatePresence mode="popLayout">
            {featuredItem && (
              <motion.div
                key={`shadow-${featuredItem.id}`}
                className="absolute top-[40%] left-[20%] w-[60%] h-[30%] bg-black/30 rounded-[100%] blur-[12px]"
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={shadowTransition}
              />
            )}
          </AnimatePresence>

          {/* Dish Landing */}
          <AnimatePresence mode="popLayout">
            {featuredItem && (
              <motion.div
                key={`dish-${featuredItem.id}`}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, y: -100, scale: 1.2, rotate: -5 }}
                animate={{ opacity: 1, y: -20, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, y: 50, scale: 0.8, rotate: 10 }}
                transition={landingTransition}
              >
                <img
                  src={featuredItem.image_url || "/brand/table/plate1.png"}
                  alt={featuredItem.name}
                  className="w-[70%] h-[70%] object-contain drop-shadow-2xl"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Menu List Section */}
      <div className="flex-1 flex flex-col bg-surface-primary px-6 rounded-t-2xl relative z-20 border-t border-border-default pt-4 shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
        
        {/* Toolbar: Category Filter Bar */}
        <div className="flex items-center gap-3 pb-4 border-b border-border-default mb-4 overflow-x-auto hide-scrollbar shrink-0 -mx-6 px-6">
          {categories.map(cat => (
             <button 
               key={cat.id}
               onClick={() => setActiveCategory(cat.name)}
               className={`px-4 py-2 rounded-full whitespace-nowrap text-14 font-bold transition-all duration-200 ${activeCategory === cat.name ? 'bg-text-primary text-surface-primary shadow-md transform scale-105' : 'bg-surface-secondary text-text-secondary hover:text-text-primary'}`}
             >
               {cat.name}
             </button>
          ))}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto pb-32 space-y-6 -mx-6 px-6">
          {activeItems.map((item) => (
            <div key={item.id} className="flex justify-between items-start gap-4">
              <div className="flex-1 pr-2">
                <h3 className="text-16 font-bold text-text-primary tracking-tight mb-1">{item.name}</h3>
                <p className="text-14 font-bold text-text-primary mb-2">
                  ₦{(item.price_minor / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </p>
                {item.description && (
                  <p className="text-12 text-text-secondary leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                )}
                {item.availability !== 'available' && (
                  <p className="text-10 text-destructive mt-1.5 font-bold uppercase tracking-wider bg-destructive/10 inline-block px-2 py-0.5 rounded-sm">
                    {item.availability === 'no_stock' ? 'Sold Out' : 'Unavailable'}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                {item.image_url && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-secondary border border-border-default shrink-0 relative">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <button
                  disabled={item.availability !== 'available'}
                  onClick={() => onItemSelect(item)}
                  className="px-4 py-1.5 rounded-full border border-border-strong text-12 font-bold text-text-primary flex items-center justify-center gap-1 shrink-0 disabled:opacity-50 hover:bg-surface-secondary active:scale-95 transition-all w-full"
                >
                  Add <span className="text-14 font-normal leading-none">+</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Sticky Order Button */}
      <AnimatePresence>
      {cartCount > 0 && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute bottom-0 left-0 right-0 p-6 pt-10 bg-gradient-to-t from-surface-primary via-surface-primary/95 to-transparent z-40 pointer-events-none"
        >
          <button
            onClick={onViewCart}
            className="w-full h-14 rounded-xl bg-text-primary text-surface-primary text-16 font-bold shadow-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 pointer-events-auto"
          >
            View Order ({cartCount})
            <div className="w-6 h-6 bg-surface-primary rounded-full flex items-center justify-center ml-2">
               <span className="text-10 text-text-primary font-bold">🛒</span>
            </div>
          </button>
        </motion.div>
      )}
      </AnimatePresence>
      
      {/* Powered by Plated */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center z-30 pointer-events-none">
        <p className="text-[10px] text-text-secondary uppercase tracking-wider font-medium bg-surface-primary/90 px-2 py-0.5 rounded shadow-sm backdrop-blur-md border border-border-default/50">
          powered by <span className="font-bold text-action-primary">Plated.</span>
        </p>
      </div>
    </div>
  )
}
