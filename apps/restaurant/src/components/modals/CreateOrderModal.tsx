'use client';

import React, { useState } from 'react';
import { X, Minus, Plus, Search, CheckCircle2, Utensils, ShoppingBag, Truck, CreditCard, Banknote, Receipt, ArrowLeft, ChevronRight } from 'lucide-react';

interface Addon {
  id: string;
  name: string;
  price: number;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  addons?: Addon[];
}

const MENU_CATEGORIES = ['All', 'Pizzas', 'Burgers', 'Sides', 'Drinks'];

const DUMMY_MENU: MenuItem[] = [
  { 
    id: 'm1', name: 'Margherita Pizza', price: 12.00, category: 'Pizzas',
    addons: [{id:'a1', name:'Extra Cheese', price: 2.00}, {id:'a2', name:'Olives', price: 1.00}]
  },
  { 
    id: 'm2', name: 'Pepperoni Pizza', price: 14.50, category: 'Pizzas',
    addons: [{id:'a1', name:'Extra Cheese', price: 2.00}, {id:'a3', name:'Extra Pepperoni', price: 3.00}]
  },
  { id: 'm3', name: 'Veggie Supreme', price: 13.50, category: 'Pizzas' },
  { id: 'm4', name: 'Hawaiian BBQ', price: 15.00, category: 'Pizzas' },
  { 
    id: 'm5', name: 'Classic Cheeseburger', price: 9.00, category: 'Burgers',
    addons: [{id:'a4', name:'Bacon', price: 2.50}, {id:'a5', name:'No Pickles', price: 0.00}]
  },
  { id: 'm6', name: 'Double Bacon Burger', price: 12.50, category: 'Burgers' },
  { id: 'm7', name: 'French Fries', price: 4.50, category: 'Sides' },
  { id: 'm8', name: 'Garlic Bread', price: 5.00, category: 'Sides' },
  { id: 'm9', name: 'Cola', price: 2.50, category: 'Drinks' },
  { id: 'm10', name: 'Lemonade', price: 3.00, category: 'Drinks' },
];

interface CartItem extends MenuItem {
  cartItemId: string; 
  qty: number;
  selectedAddons: Addon[];
}

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 1 | 2 | 3 | 4;
type OrderType = 'dine_in' | 'pickup' | 'delivery' | null;

export function CreateOrderModal({ isOpen, onClose }: CreateOrderModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [orderType, setOrderType] = useState<OrderType>(null);
  const [tableNumber, setTableNumber] = useState('');
  const [customerInfo, setCustomerInfo] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [addonItem, setAddonItem] = useState<MenuItem | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash'|'card'|null>(null);
  const [amountTendered, setAmountTendered] = useState('');

  if (!isOpen) return null;

  const resetAndClose = () => {
    setStep(1);
    setOrderType(null);
    setTableNumber('');
    setCustomerInfo('');
    setCart([]);
    setAddonItem(null);
    setSelectedAddons([]);
    setPaymentMethod(null);
    setAmountTendered('');
    onClose();
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.addons && item.addons.length > 0) {
      setAddonItem(item);
      setSelectedAddons([]);
    } else {
      addToCart(item, []);
    }
  };

  const addToCart = (item: MenuItem, addons: Addon[]) => {
    const addonIds = addons.map(a => a.id).sort().join(',');
    const cartItemId = `${item.id}-${addonIds}`;

    setCart(prev => {
      const existing = prev.find(i => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map(i => i.cartItemId === cartItemId ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, cartItemId, qty: 1, selectedAddons: addons }];
    });
    setAddonItem(null);
  };

  const updateQty = (cartItemId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const subtotal = cart.reduce((sum, item) => {
    const itemTotal = item.price + item.selectedAddons.reduce((a, b) => a + b.price, 0);
    return sum + (itemTotal * item.qty);
  }, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const filteredMenu = DUMMY_MENU.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const canProceedToMenu = orderType === 'dine_in' ? tableNumber.trim() !== '' : (orderType !== null && customerInfo.trim() !== '');

  const getOrderTypeDisplay = () => {
    if (orderType === 'dine_in') return 'Dine-In';
    if (orderType === 'pickup') return 'Pickup';
    if (orderType === 'delivery') return 'Delivery';
    return '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-text-primary/70 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="w-full max-w-[1400px] h-full max-h-[90vh] bg-surface-primary rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border-strong animate-in zoom-in-95 duration-300 relative">
        
        {/* Wizard Header */}
        <div className="h-16 px-6 border-b border-border-default bg-surface-primary flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            {step > 1 && step < 4 && (
              <button onClick={() => setStep((step - 1) as Step)} className="p-2 -ml-2 text-text-tertiary hover:text-text-primary rounded-full hover:bg-surface-secondary transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-16 font-bold text-text-primary tracking-tight">
              {step === 1 && "Step 1: Order Context"}
              {step === 2 && "Step 2: Menu Selection"}
              {step === 3 && "Step 3: Payment"}
              {step === 4 && "Order Complete"}
            </h2>
          </div>

          {/* Stepper Dots */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`w-8 h-1.5 rounded-full transition-colors ${s === step ? 'bg-action-primary' : s < step ? 'bg-action-primary/30' : 'bg-surface-tertiary'}`} />
            ))}
          </div>

          <button onClick={resetAndClose} className="p-2 -mr-2 text-text-tertiary hover:text-text-primary rounded-full hover:bg-surface-secondary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* ---------------- STEP 1: ORDER CONTEXT ---------------- */}
          {step === 1 && (
            <div className="flex-1 flex flex-col items-center justify-center bg-surface-secondary p-8">
              <div className="w-full max-w-[540px] bg-surface-primary p-10 rounded-[24px] shadow-sm border border-border-default">
                <h3 className="text-24 font-bold mb-8 text-center text-text-primary tracking-tight">Select Order Type</h3>
                
                <div className="grid grid-cols-3 gap-3 mb-8">
                  <button onClick={() => setOrderType('dine_in')} className={`flex flex-col items-center justify-center gap-3 py-6 rounded-xl border-2 transition-all ${orderType === 'dine_in' ? 'border-action-primary bg-action-soft text-action-primary' : 'border-border-default hover:border-border-strong text-text-secondary bg-surface-primary'}`}>
                    <Utensils className="w-6 h-6" />
                    <span className="font-bold text-14">Dine-In</span>
                  </button>
                  <button onClick={() => setOrderType('pickup')} className={`flex flex-col items-center justify-center gap-3 py-6 rounded-xl border-2 transition-all ${orderType === 'pickup' ? 'border-action-primary bg-action-soft text-action-primary' : 'border-border-default hover:border-border-strong text-text-secondary bg-surface-primary'}`}>
                    <ShoppingBag className="w-6 h-6" />
                    <span className="font-bold text-14">Pickup</span>
                  </button>
                  <button onClick={() => setOrderType('delivery')} className={`flex flex-col items-center justify-center gap-3 py-6 rounded-xl border-2 transition-all ${orderType === 'delivery' ? 'border-action-primary bg-action-soft text-action-primary' : 'border-border-default hover:border-border-strong text-text-secondary bg-surface-primary'}`}>
                    <Truck className="w-6 h-6" />
                    <span className="font-bold text-14">Delivery</span>
                  </button>
                </div>

                <div className="min-h-[100px] mb-8">
                  {orderType === 'dine_in' && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                      <label className="block text-12 font-bold text-text-tertiary uppercase tracking-widest mb-2">Table Number</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 12" 
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full px-4 py-3 bg-surface-primary border border-border-default hover:border-border-strong rounded-xl text-16 font-bold text-text-primary focus:outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary transition-all"
                      />
                    </div>
                  )}

                  {(orderType === 'pickup' || orderType === 'delivery') && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                      <label className="block text-12 font-bold text-text-tertiary uppercase tracking-widest mb-2">Customer Info</label>
                      <input 
                        type="text" 
                        placeholder="Name or Phone Number" 
                        value={customerInfo}
                        onChange={(e) => setCustomerInfo(e.target.value)}
                        className="w-full px-4 py-3 bg-surface-primary border border-border-default hover:border-border-strong rounded-xl text-16 font-bold text-text-primary focus:outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary transition-all"
                      />
                    </div>
                  )}
                </div>

                <button 
                  disabled={!canProceedToMenu}
                  onClick={() => setStep(2)}
                  className="w-full h-14 bg-action-primary hover:bg-action-hover disabled:bg-surface-tertiary disabled:text-text-tertiary/50 text-surface-primary rounded-xl font-bold text-16 transition-colors flex items-center justify-center gap-2"
                >
                  Continue to Menu <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}


          {/* ---------------- STEP 2 & 3: MENU / PAYMENT & CART ---------------- */}
          {(step === 2 || step === 3) && (
            <>
              {/* Left Side: Dynamic Content */}
              <div className="flex-1 flex flex-col bg-surface-secondary relative">
                
                {step === 2 && (
                  <div className="flex-1 flex overflow-hidden">
                    {/* Category Sidebar */}
                    <div className="w-[240px] bg-surface-primary border-r border-border-default flex flex-col flex-shrink-0">
                      <div className="p-4 border-b border-border-default">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
                            <Search className="w-4 h-4" />
                          </span>
                          <input 
                            type="text" 
                            placeholder="Search..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-surface-secondary border border-border-default rounded-lg text-14 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-action-primary transition-colors"
                          />
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 gap-1 flex flex-col custom-scrollbar">
                        {MENU_CATEGORIES.map(cat => (
                          <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-3 text-left rounded-xl font-bold text-14 transition-colors flex items-center justify-between group ${
                              activeCategory === cat 
                                ? 'bg-surface-secondary text-text-primary' 
                                : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                            }`}
                          >
                            <span>{cat}</span>
                            {activeCategory === cat && (
                              <span className="w-1.5 h-1.5 rounded-full bg-action-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Menu Grid */}
                    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-surface-secondary">
                      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
                        {filteredMenu.map(item => {
                          const hasAddons = item.addons && item.addons.length > 0;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleItemClick(item)}
                              className="group flex flex-col text-left p-5 rounded-2xl bg-surface-primary border border-border-default hover:border-action-primary hover:shadow-sm transition-all active:scale-[0.98] h-36 justify-between relative overflow-hidden"
                            >
                              <div className="flex justify-between items-start gap-4">
                                <h4 className="text-16 font-bold text-text-primary leading-tight line-clamp-2">
                                  {item.name}
                                </h4>
                                {hasAddons && (
                                  <span className="shrink-0 px-2 py-0.5 bg-surface-secondary text-text-secondary border border-border-default rounded-full text-[10px] font-bold uppercase tracking-wider group-hover:bg-action-soft group-hover:text-action-primary group-hover:border-action-soft transition-colors">
                                    Options
                                  </span>
                                )}
                              </div>
                              <p className="text-16 font-black text-text-secondary group-hover:text-action-primary transition-colors">
                                ${item.price.toFixed(2)}
                              </p>
                            </button>
                          )
                        })}
                        {filteredMenu.length === 0 && (
                          <div className="col-span-full py-20 text-center text-text-tertiary">
                            <p className="text-16 font-medium">No items found.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Add-on Overlay */}
                    {addonItem && (
                      <div className="absolute inset-0 bg-text-primary/40 backdrop-blur-sm z-20 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-surface-primary w-full max-w-[480px] rounded-2xl shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
                          <div className="p-6 border-b border-border-default flex justify-between items-start shrink-0">
                            <div>
                              <h3 className="text-20 font-black text-text-primary leading-tight mb-1">{addonItem.name}</h3>
                              <p className="text-14 font-bold text-text-tertiary">Select Options</p>
                            </div>
                            <button onClick={() => setAddonItem(null)} className="p-2 -mr-2 text-text-tertiary hover:text-text-primary rounded-full hover:bg-surface-secondary transition-colors"><X className="w-5 h-5"/></button>
                          </div>
                          
                          <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar">
                            <div>
                              <h4 className="text-12 font-bold text-text-tertiary uppercase tracking-widest mb-3">Available Add-ons</h4>
                              <div className="space-y-2">
                                {addonItem.addons?.map(addon => {
                                  const isSelected = selectedAddons.some(a => a.id === addon.id);
                                  return (
                                    <button 
                                      key={addon.id}
                                      onClick={() => {
                                        if (isSelected) {
                                          setSelectedAddons(prev => prev.filter(a => a.id !== addon.id));
                                        } else {
                                          setSelectedAddons(prev => [...prev, addon]);
                                        }
                                      }}
                                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${isSelected ? 'border-action-primary bg-action-soft' : 'border-border-default hover:border-border-strong bg-surface-primary'}`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'border-action-primary bg-action-primary text-surface-primary' : 'border-border-strong bg-surface-primary'}`}>
                                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                                        </div>
                                        <span className={`font-bold text-14 ${isSelected ? 'text-action-primary' : 'text-text-primary'}`}>{addon.name}</span>
                                      </div>
                                      <span className={`font-bold text-14 ${isSelected ? 'text-action-primary' : 'text-text-secondary'}`}>
                                        +${addon.price.toFixed(2)}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          <div className="p-6 border-t border-border-default shrink-0 bg-surface-secondary/50 rounded-b-2xl">
                            <button 
                              onClick={() => addToCart(addonItem, selectedAddons)}
                              className="w-full h-14 bg-action-primary hover:bg-action-hover text-surface-primary rounded-xl font-bold text-16 transition-colors shadow-lg"
                            >
                              Add to Order
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 bg-surface-secondary">
                     <div className="w-full max-w-[540px] bg-surface-primary p-10 rounded-[24px] shadow-sm border border-border-default text-center">
                        <h3 className="text-14 font-bold text-text-tertiary uppercase tracking-widest mb-3">Amount Due</h3>
                        <p className="text-5xl font-black text-text-primary mb-10 tracking-tight">${total.toFixed(2)}</p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                          <button onClick={() => setPaymentMethod('card')} className={`flex flex-col items-center justify-center py-6 rounded-xl border-2 transition-all ${paymentMethod === 'card' ? 'border-action-primary bg-action-soft text-action-primary' : 'border-border-default text-text-secondary hover:border-border-strong hover:bg-surface-secondary'}`}>
                            <CreditCard className="w-8 h-8 mb-3" />
                            <span className="font-bold text-14">Card</span>
                          </button>
                          <button onClick={() => setPaymentMethod('cash')} className={`flex flex-col items-center justify-center py-6 rounded-xl border-2 transition-all ${paymentMethod === 'cash' ? 'border-action-primary bg-action-soft text-action-primary' : 'border-border-default text-text-secondary hover:border-border-strong hover:bg-surface-secondary'}`}>
                            <Banknote className="w-8 h-8 mb-3" />
                            <span className="font-bold text-14">Cash</span>
                          </button>
                        </div>

                        <div className="min-h-[100px] mb-6">
                          {paymentMethod === 'cash' && (
                            <div className="animate-in fade-in slide-in-from-top-2 text-left">
                              <label className="block text-12 font-bold text-text-tertiary uppercase tracking-widest mb-2">Amount Tendered</label>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary font-bold text-18">$</span>
                                <input 
                                  type="number" 
                                  placeholder="0.00" 
                                  value={amountTendered}
                                  onChange={(e) => setAmountTendered(e.target.value)}
                                  className="w-full pl-8 pr-4 py-3 bg-surface-secondary border border-border-default rounded-xl text-24 font-black text-text-primary focus:outline-none focus:border-action-primary transition-colors"
                                />
                              </div>
                              {Number(amountTendered) >= total && total > 0 && (
                                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                                  <span className="text-12 font-bold text-green-700 uppercase tracking-widest">Change Due</span>
                                  <span className="text-18 font-black text-green-700">${(Number(amountTendered) - total).toFixed(2)}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <button 
                          disabled={!paymentMethod || (paymentMethod === 'cash' && Number(amountTendered) < total)}
                          onClick={() => setStep(4)}
                          className="w-full h-14 bg-action-primary hover:bg-action-hover disabled:bg-surface-tertiary disabled:text-text-tertiary/50 text-surface-primary rounded-xl font-bold text-16 transition-colors flex items-center justify-center gap-2"
                        >
                          Confirm Payment <CheckCircle2 className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
                )}
              </div>

              {/* Right Side: The Receipt Ticket */}
              <div className="w-[400px] bg-white border-l border-border-default flex flex-col shrink-0 shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-10">
                
                {/* Receipt Header */}
                <div className="p-6 border-b border-border-default shrink-0 bg-white">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-12 font-bold text-text-tertiary uppercase tracking-widest">Ticket</h3>
                     <span className="text-12 font-bold bg-surface-secondary text-text-secondary px-2.5 py-1 rounded-full border border-border-default">
                       {cart.reduce((a, b) => a + b.qty, 0)} items
                     </span>
                  </div>
                  <div className="flex flex-col gap-1 p-4 bg-surface-secondary rounded-xl border border-border-default">
                    <span className="text-12 font-bold text-action-primary uppercase tracking-widest">
                      {getOrderTypeDisplay()}
                    </span>
                    {(tableNumber || customerInfo) && (
                       <span className="text-18 font-black text-text-primary tracking-tight">
                         {tableNumber ? `Table ${tableNumber}` : customerInfo}
                       </span>
                    )}
                  </div>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-white">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-text-tertiary space-y-3 opacity-40">
                      <Receipt className="w-12 h-12" />
                      <p className="text-14 font-bold uppercase tracking-widest">Empty</p>
                    </div>
                  ) : (
                    cart.map(item => {
                      const itemTotal = (item.price + item.selectedAddons.reduce((a, b) => a + b.price, 0)) * item.qty;
                      return (
                        <div key={item.cartItemId} className="flex flex-col gap-2 pb-4 border-b border-border-default/50 last:border-0 last:pb-0">
                          
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1 pt-0.5">
                              <h4 className="text-14 font-bold text-text-primary leading-tight mb-1">{item.name}</h4>
                              {item.selectedAddons.length > 0 && (
                                <div className="text-12 text-text-tertiary space-y-0.5 mb-1">
                                  {item.selectedAddons.map(a => (
                                    <div key={a.id}>+ {a.name}</div>
                                  ))}
                                </div>
                              )}
                              <p className="text-14 font-bold text-text-secondary">${itemTotal.toFixed(2)}</p>
                            </div>
                            
                            {/* Modern Quantity Controls */}
                            <div className="flex items-center gap-3 bg-surface-primary border border-border-default rounded-lg px-1.5 py-1 shrink-0 shadow-sm">
                              <button onClick={() => item.qty === 1 ? removeFromCart(item.cartItemId) : updateQty(item.cartItemId, -1)} className="w-6 h-6 flex items-center justify-center rounded text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors">
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-4 text-center text-13 font-bold text-text-primary">{item.qty}</span>
                              <button onClick={() => updateQty(item.cartItemId, 1)} className="w-6 h-6 flex items-center justify-center rounded text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors">
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>

                {/* Footer & Totals */}
                <div className="p-6 border-t border-dashed border-border-strong shrink-0 bg-surface-secondary/30">
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-14 font-medium text-text-secondary">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-14 font-medium text-text-secondary">
                      <span>Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="w-full h-px bg-border-default my-3" />
                    <div className="flex justify-between items-end">
                      <span className="text-16 font-bold text-text-primary uppercase tracking-wider">Total</span>
                      <span className="text-32 font-black text-text-primary leading-none tracking-tight">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {step === 2 && (
                    <button 
                      disabled={cart.length === 0}
                      onClick={() => setStep(3)}
                      className="w-full h-14 bg-text-primary hover:bg-text-secondary disabled:bg-surface-tertiary disabled:text-text-tertiary/50 text-surface-primary rounded-xl font-bold text-16 transition-colors shadow-lg flex items-center justify-center gap-2"
                    >
                      Proceed to Payment <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ---------------- STEP 4: SUCCESS ---------------- */}
          {step === 4 && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-surface-primary">
              <div className="w-24 h-24 bg-action-soft rounded-full flex items-center justify-center mb-6 animate-in zoom-in slide-in-from-bottom-4">
                <CheckCircle2 className="w-10 h-10 text-action-primary" />
              </div>
              <h2 className="text-32 font-black text-text-primary mb-2 tracking-tight">Order Confirmed!</h2>
              <p className="text-16 font-medium text-text-secondary mb-10">Sent to kitchen automatically.</p>
              
              <div className="flex flex-col gap-3 w-full max-w-[320px]">
                <button 
                  onClick={resetAndClose}
                  className="w-full h-14 bg-action-primary hover:bg-action-hover text-surface-primary rounded-xl font-bold text-16 transition-colors shadow-lg"
                >
                  Start New Order
                </button>
                <button 
                  className="w-full h-14 bg-surface-primary border border-border-default hover:border-border-strong hover:bg-surface-secondary text-text-primary rounded-xl font-bold text-16 transition-colors"
                >
                  Print Receipt
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
