"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UtensilsCrossed } from "lucide-react"

import { WelcomeScreen } from '@/components/screens/WelcomeScreen/WelcomeScreen'
import { MenuScreen, MenuItem, MenuCategory, Option } from '@/components/screens/MenuScreen/MenuScreen'
import { ItemAddonDrawer } from '@/components/drawers/ItemAddonDrawer/ItemAddonDrawer'
import { OrderSummaryScreen, CartItem } from '@/components/screens/OrderSummaryScreen/OrderSummaryScreen'
import { PaymentModal, PaymentMethod } from '@/components/modals/PaymentModal/PaymentModal'
import { scanOutlet, placeOrder } from '@/lib/api'

type AppState = "loading" | "error" | "welcome" | "menu" | "summary" | "success"

interface PageProps {
  params: { slug: string }
  searchParams: { t?: string, type?: string }
}

export default function DinerOutletPage({ params, searchParams }: PageProps) {
  const tableLabel = searchParams.t || "1"
  
  // App State
  const [appState, setAppState] = useState<AppState>("loading")
  const [errorMsg, setErrorMsg] = useState("")
  
  // Data State
  const [chain, setChain] = useState<any>(null)
  const [outlet, setOutlet] = useState<any>(null)
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [session, setSession] = useState<any>(null)
  const [recognition, setRecognition] = useState<any>(null)
  const [orderNo, setOrderNo] = useState<string>("")
  
  const [activeCategory, setActiveCategory] = useState("")
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null)
  const [isAddonDrawerOpen, setIsAddonDrawerOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isOrdering, setIsOrdering] = useState(false)
  
  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Helper to convert hex to HSL string (H S% L%) for Tailwind variables
  const hexToHsl = (hex: string) => {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  useEffect(() => {
    async function loadData() {
      try {
        const data = await scanOutlet(params.slug, tableLabel);
        setChain(data.chain);
        setOutlet(data.outlet);
        setCategories(data.menu.categories);
        setSession(data.session);
        setRecognition(data.recognition);
        
        if (data.menu.categories.length > 0) {
          setActiveCategory(data.menu.categories[0].name);
        }
        
        // Optional theme injection
        if (data.chain.accent) {
           document.documentElement.style.setProperty('--action-primary', hexToHsl(data.chain.accent));
        }
        if (data.chain.accent_ink) {
           document.documentElement.style.setProperty('--action-primary-ink', hexToHsl(data.chain.accent_ink));
        }

        
        setAppState("welcome");
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to load menu");
        setAppState("error");
      }
    }
    loadData();
  }, [params.slug, tableLabel]);

  const handleItemSelect = (item: MenuItem) => {
    setSelectedMenuItem(item)
    setIsAddonDrawerOpen(true)
  }

  const handleAddToCart = (item: MenuItem, selectedOptions: Option[], qty: number) => {
    const sortedOptionIds = selectedOptions.map(o => o.id).sort().join("-")
    const cartItemId = `${item.id}-${sortedOptionIds}`
    
    setCartItems(prev => {
      const existing = prev.find(ci => ci.cart_item_id === cartItemId)
      if (existing) {
        return prev.map(ci => ci.cart_item_id === cartItemId ? { ...ci, qty: ci.qty + qty } : ci)
      }
      return [
        ...prev,
        {
          cart_item_id: cartItemId,
          menu_item_id: item.id,
          name: item.name,
          price_minor: item.price_minor,
          qty,
          addons: selectedOptions as any,
          description: item.description || ''
        }
      ]
    })
    setIsAddonDrawerOpen(false)
    setSelectedMenuItem(null)
  }

  const handleUpdateQty = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      setCartItems(prev => prev.filter(ci => ci.cart_item_id !== cartItemId))
    } else {
      setCartItems(prev => prev.map(ci => ci.cart_item_id === cartItemId ? { ...ci, qty: newQty } : ci))
    }
  }

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems(prev => prev.filter(ci => ci.cart_item_id !== cartItemId))
  }

  const handleEditItem = (item: CartItem) => {
    const menuItem = categories.flatMap(c => c.items).find(i => i.id === item.menu_item_id)
    if (menuItem) {
      handleRemoveItem(item.cart_item_id)
      setSelectedMenuItem(menuItem)
      setIsAddonDrawerOpen(true)
    }
  }

  const orderType = (searchParams.type as 'dine_in' | 'public') || 'dine_in'

  async function handlePaymentSubmit(method: PaymentMethod, customerDetails: { name: string, phone: string, fulfillment: string, address: string }) {
    if (isOrdering) return;
    setIsOrdering(true);
    
    try {
      const payloadItems = cartItems.map(ci => ({
        menu_item_id: ci.menu_item_id,
        qty: ci.qty,
        notes: "",
        options: ci.addons.map(a => ({
          option_id: a.id,
          qty: 1
        }))
      }));
      
      const idempotencyKey = crypto.randomUUID();
      const res = await placeOrder(
        outlet.id, 
        tableLabel, 
        payloadItems, 
        idempotencyKey, 
        customerDetails.fulfillment, 
        customerDetails.name, 
        customerDetails.phone, 
        customerDetails.address
      );
      const orderId = res.order.id;
      
      if (method === 'counter') {
        setOrderNo(orderId.slice(0, 8).toUpperCase());
        setIsPaymentModalOpen(false);
        setAppState("success");
        setCartItems([]);
      } else {
        // Initialize Moniepoint checkout
        const initRes = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/moniepoint_initialize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id: orderId })
        });
        const initData = await initRes.json();
        
        if (initData.checkout_url) {
          window.location.href = initData.checkout_url;
        } else {
          throw new Error(initData.error || "Failed to initialize payment");
        }
      }
    } catch (err) {
      alert("Failed to place order. Please try again.");
    } finally {
      setIsOrdering(false);
    }
  }

  return (
    <main className="h-[100dvh] w-full max-w-[402px] mx-auto relative bg-surface-primary shadow-2xl overflow-hidden sm:border-x sm:border-border-default">
      <AnimatePresence mode="wait">
        
        {appState === "loading" && (
           <motion.div key="loading" className="h-full flex items-center justify-center">
              <p className="text-text-secondary font-bold animate-pulse">Loading menu...</p>
           </motion.div>
        )}
        
        {appState === "error" && (
           <motion.div key="error" className="h-full flex items-center justify-center flex-col gap-4">
              <p className="text-destructive font-bold">{errorMsg}</p>
              <button onClick={() => window.location.reload()} className="px-4 py-2 bg-text-primary text-surface-primary rounded-full">Retry</button>
           </motion.div>
        )}

        {appState === "welcome" && (
          <WelcomeScreen
            key="welcome"
            orderCount={recognition?.order_count || 0}
            tableLabel={tableLabel}
            orderNo={""}
            onContinue={() => setAppState("menu")}
          />
        )}

        {appState === "menu" && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="h-full flex flex-col relative"
          >
            <MenuScreen
              tableLabel={tableLabel}
              orderNo={session?.id ? `Tab Open` : ""}
              categories={categories}
              chain={chain}
          recognition={recognition}
              onItemSelect={handleItemSelect}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              cartCount={cartItems.length}
              onViewCart={() => setAppState("summary")}
            />
            
            <ItemAddonDrawer
              isOpen={isAddonDrawerOpen}
              onClose={() => setIsAddonDrawerOpen(false)}
              item={selectedMenuItem}
              onAddToCart={handleAddToCart}
            />
          </motion.div>
        )}

        {appState === "summary" && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="h-full flex flex-col relative"
          >
            <OrderSummaryScreen
              tableLabel={tableLabel}
              orderNo={""}
              cartItems={cartItems}
              onBack={() => setAppState("menu")}
              onOrder={() => setIsPaymentModalOpen(true)}
              onUpdateQty={handleUpdateQty}
              onRemoveItem={handleRemoveItem}
              onEditItem={handleEditItem}
            />
            
            <PaymentModal
              isOpen={isPaymentModalOpen}
              orderType={orderType}
              onClose={() => setIsPaymentModalOpen(false)}
              onContinue={handlePaymentSubmit}
            />
          </motion.div>
        )}

        {appState === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full flex flex-col bg-surface-primary items-center justify-center p-6 text-center relative"
          >
             {/* Logo Placeholder */}
             <div className="flex flex-col items-center gap-4 mb-12">
               <div className="w-16 h-16 rounded-full bg-border-default overflow-hidden flex items-center justify-center text-24">
                 {chain?.logo_url ? (
                   <img src={chain.logo_url} className="w-full h-full object-cover" />
                 ) : (
                   "🍕"
                 )}
               </div>
               <h2 className="text-20 font-bold text-text-primary">{chain?.display_name || chain?.name}</h2>
             </div>
             
             {/* Progress Bar Placeholder */}
             <div className="flex flex-col gap-1 mb-8 w-full">
               <div className="text-[8px] font-bold text-text-primary text-center uppercase tracking-widest">
                 Order Received
               </div>
               <div className="w-full h-1 bg-border-default rounded-full overflow-hidden">
                 <div className="w-full h-full bg-action-primary" />
               </div>
             </div>
             
             <p className="text-14 font-medium text-text-primary mb-10">Your order has been sent to the kitchen.</p>
             
             <h1 className="text-24 font-bold text-text-primary mb-6">Order Summary</h1>
             <div className="flex flex-col gap-1.5 text-12 text-text-secondary font-medium items-center w-full">
               <p>Table: <span className="text-text-primary font-bold">{tableLabel}</span></p>
               <p>Order No: <span className="text-text-primary font-bold">#{orderNo}</span></p>
             </div>
             
             {/* Powered by Plated watermark */}
             <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10 pointer-events-none">
               <p className="text-[10px] text-text-secondary uppercase tracking-wider font-medium">
                 powered by <span className="font-bold">Plated.</span>
               </p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
