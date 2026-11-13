'use client';

import { useState, useEffect } from 'react';
import { Bell, ChefHat, CreditCard, Search, Soup, Utensils, Croissant, ExternalLink } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { OrderListItem } from '@/components/dashboard/OrderListItem';
import { CreateOrderModal } from '@/components/modals/CreateOrderModal';

const POPULAR_DISHES = [
  { id: '1', name: 'Smokey Jollof Rice', orders: 23, icon: <Soup className="w-5 h-5" /> },
  { id: '2', name: 'Grilled Chicken Tacos', orders: 16, icon: <Utensils className="w-5 h-5" /> },
  { id: '3', name: 'Spaghetti Bolognese', orders: 13, icon: <Utensils className="w-5 h-5" /> },
  { id: '4', name: 'French Bread & Potato', orders: 12, icon: <Croissant className="w-5 h-5" /> },
];

const OUT_OF_STOCK = [
  { id: '1', name: 'Hawaiian Chicken Skewers', available: '04:00 PM' },
  { id: '2', name: 'Veggie Supreme Pizza', available: '03:30 PM' },
  { id: '3', name: 'Fish and Chips', available: '04:20 PM' },
  { id: '4', name: 'Cold Malt Drink', available: 'Tomorrow' },
];

export default function DashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch restaurant orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateOrder = () => {
    setIsOrderModalOpen(true);
  };

  const handlePayNow = (orderId: string) => {
    alert(`Open Payment Modal for Order #${orderId.substring(0, 4)}`);
  };

  const incomingOrders = orders.filter(o => o.status === 'incoming');
  const processingOrders = orders.filter(o => o.status === 'processing');
  const feedOrders = [...incomingOrders, ...processingOrders];
  const paymentOrders = orders.filter(o => o.status === 'delivered');

  return (
    <div className="flex-1 grid grid-cols-4 gap-4 bg-surface-secondary overflow-hidden h-full">
      {/* COLUMN 1: Live Feed */}
      <section className="bg-surface-primary rounded-2xl flex flex-col border border-border-default overflow-hidden">
        <div className="px-5 pt-5 pb-3 shrink-0">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text" 
              placeholder="Search Order List" 
              className="w-full pl-9 pr-4 py-2 bg-surface-secondary border border-border-default rounded-lg text-14 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-action-primary transition-colors"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-4 custom-scrollbar">
          {/* Group: New Orders */}
          {incomingOrders.length > 0 && (
            <div>
              <div className="sticky top-0 bg-surface-primary/95 backdrop-blur py-2 mb-2 z-10 border-b border-border-default text-center">
                <span className="text-12 font-bold text-text-tertiary uppercase tracking-wider">New Order</span>
              </div>
              <div className="space-y-2">
                {incomingOrders.map(order => (
                  <OrderListItem
                    key={order.id}
                    tableNumber={`0${order.table_label}`}
                    customerName={`Order #${order.id.substring(0, 4)}`}
                    itemCount={order.items?.reduce((acc: number, it: any) => acc + (it.qty || 1), 0) || 0}
                    status={order.status}
                    type="feed"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Group: Processing */}
          {processingOrders.length > 0 && (
            <div>
              <div className="sticky top-0 bg-surface-primary/95 backdrop-blur py-2 mb-2 z-10 border-b border-border-default text-center">
                <span className="text-12 font-bold text-text-tertiary uppercase tracking-wider">Processing</span>
              </div>
              <div className="space-y-2">
                {processingOrders.map(order => (
                  <OrderListItem
                    key={order.id}
                    tableNumber={`0${order.table_label}`}
                    customerName={`Order #${order.id.substring(0, 4)}`}
                    itemCount={order.items?.reduce((acc: number, it: any) => acc + (it.qty || 1), 0) || 0}
                    status={order.status}
                    type="feed"
                  />
                ))}
              </div>
            </div>
          )}

          {feedOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-text-tertiary mt-12">
              <ChefHat className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-14 font-medium text-text-secondary">No active orders</p>
              <p className="text-12 mt-1">Kitchen is caught up.</p>
            </div>
          )}
        </div>
      </section>

      {/* COLUMN 2: Incoming Metric & Payment Feed */}
      <section className="flex flex-col gap-4">
        <div className="bg-surface-primary rounded-2xl border border-border-default shrink-0 shadow-sm overflow-hidden">
          <MetricCard 
            title="New Order" 
            value={incomingOrders.length.toString()} 
            trend="Pending acceptance" 
            icon={<Bell className="w-5 h-5" />} 
            active={incomingOrders.length > 0} 
          />
        </div>
        
        <div className="flex-1 bg-surface-primary rounded-2xl border border-border-default flex flex-col overflow-hidden">
          <div className="px-5 pt-5 pb-3 shrink-0 flex items-center justify-between">
            <h2 className="text-14 font-bold text-text-primary uppercase tracking-wider">Awaiting Payment</h2>
            <span className="text-12 font-bold bg-surface-tertiary text-text-secondary px-2 py-0.5 rounded-full border border-border-default">
              {paymentOrders.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {paymentOrders.length > 0 ? paymentOrders.map(order => (
              <OrderListItem
                key={order.id}
                tableNumber={`0${order.table_label}`}
                customerName={`Table ${order.table_label}`}
                itemCount={order.items?.reduce((acc: number, it: any) => acc + (it.qty || 1), 0) || 0}
                status={order.status}
                orderId={order.id}
                type="payment"
                onAction={() => handlePayNow(order.id)}
              />
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-text-tertiary">
                <CreditCard className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-14 font-medium text-text-secondary">All settled</p>
                <p className="text-12 mt-1">No orders awaiting payment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* COLUMN 3: Processing Metrics & Popular Dishes */}
      <section className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4 shrink-0">
          <div className="bg-surface-primary rounded-2xl border border-border-default shadow-sm overflow-hidden">
            <MetricCard 
              title="Total Orders" 
              value={processingOrders.length.toString()} 
              trend="In the kitchen" 
              icon={<ChefHat className="w-5 h-5" />} 
            />
          </div>
          <div className="bg-surface-primary rounded-2xl border border-border-default shadow-sm overflow-hidden">
            <MetricCard 
              title="Waitlist" 
              value="0" 
              trend="Normal capacity" 
              icon={<Search className="w-5 h-5" />} 
            />
          </div>
        </div>

        <div className="flex-1 bg-surface-primary rounded-2xl border border-border-default flex flex-col overflow-hidden">
          <div className="px-5 pt-5 pb-3 shrink-0 flex items-center justify-between">
            <h2 className="text-14 font-bold text-text-primary uppercase tracking-wider">Popular Dishes</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {POPULAR_DISHES.map((dish, idx) => (
              <div key={dish.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-secondary border border-border-default hover:border-border-strong transition-colors">
                <span className="text-12 font-bold text-text-tertiary w-4 text-right">{idx + 1}</span>
                <div className="w-10 h-10 rounded-lg bg-surface-tertiary flex items-center justify-center text-text-secondary border border-border-default">
                  {dish.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-14 font-semibold text-text-primary leading-tight">{dish.name}</h4>
                  <p className="text-12 text-text-tertiary mt-0.5">
                    <span className="font-semibold text-text-secondary">{dish.orders}</span> orders
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COLUMN 4: Command Center */}
      <section className="flex flex-col gap-4">
        <div className="bg-text-primary rounded-2xl shrink-0 text-surface-primary pt-2 pb-6 px-2">
          <div className="flex items-center gap-4 mb-6 px-2">
            <div className="w-12 h-12 rounded-full bg-surface-tertiary/20 flex items-center justify-center text-surface-primary overflow-hidden border border-border-strong">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div>
              <p className="text-14 font-bold leading-tight">Cashier Name</p>
              <p className="text-12 text-text-tertiary/80 mt-0.5">ID: #94821</p>
            </div>
          </div>
          
          <div className="px-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-14 font-bold text-surface-primary">View All Orders</span>
              <ExternalLink className="w-4 h-4 text-text-tertiary/80" />
            </div>
            <div className="w-full h-px bg-border-strong mb-6" />
            
            <button 
              onClick={handleCreateOrder}
              className="w-full h-14 bg-action-primary hover:bg-action-hover text-surface-primary rounded-xl font-bold text-16 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <span className="text-xl leading-none">+</span> Create New Order
            </button>
          </div>
        </div>

        <div className="flex-1 bg-surface-primary rounded-2xl border border-border-default flex flex-col overflow-hidden">
          <div className="px-5 pt-5 pb-3 shrink-0 flex items-center justify-between">
            <h2 className="text-14 font-bold text-text-primary uppercase tracking-wider">Out of Stock</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-0 divide-y divide-border-default custom-scrollbar">
            {OUT_OF_STOCK.map((item) => (
              <div key={item.id} className="p-4 flex flex-col gap-1 hover:bg-surface-secondary transition-colors cursor-pointer">
                <h4 className="text-14 font-semibold text-text-primary">{item.name}</h4>
                <div className="flex items-center gap-1.5 text-12">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span className="text-text-tertiary">Est. Restock: <span className="font-medium text-text-secondary">{item.available}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CreateOrderModal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
      />
    </div>
  );
}
