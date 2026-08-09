'use client';

import { useState, useEffect } from 'react';
import { TableTabsView, TableSession } from '../components/TableTabsView';
import { PrinterJobModal } from '../components/PrinterJobModal';
import { ManagerMenuCrud, MenuItemAdmin } from '../components/ManagerMenuCrud';
import { PaystackSubscriptionCard } from '../components/PaystackSubscriptionCard';

function formatNaira(koboMinor: number): string {
  const naira = Math.floor(koboMinor / 100);
  return `₦${naira.toLocaleString('en-NG')}`;
}

export default function RestaurantTillPage() {
  const [activeTab, setActiveTab] = useState<'counter' | 'tabs' | 'manager'>('counter');
  const [orders, setOrders] = useState<any[]>([]);
  const [sessions, setSessions] = useState<TableSession[]>([]);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<'cancelled' | 'wasted' | 'other'>('cancelled');
  const [printingOrder, setPrintingOrder] = useState<any | null>(null);
  const [ticketType, setTicketType] = useState<'kitchen_ticket' | 'order_receipt' | 'bill'>('kitchen_ticket');

  const [menuItems, setMenuItems] = useState<MenuItemAdmin[]>([
    {
      id: '44444444-4444-4444-4444-444444444441',
      name: 'Smokey Jollof & Grilled Chicken',
      description: 'Lagos smokey jollof rice with grilled chicken leg and fried plantains.',
      price_minor: 450000,
      is_listed: true,
      in_stock: true,
      category: 'Main Course',
    },
    {
      id: '44444444-4444-4444-4444-444444444442',
      name: 'Special Beef Suya Platter',
      description: 'Tender strips of grilled beef in yaji spice.',
      price_minor: 600000,
      is_listed: true,
      in_stock: true,
      category: 'Main Course',
    },
    {
      id: '44444444-4444-4444-4444-444444444446',
      name: 'Cold Malt Drink',
      description: 'Non-alcoholic premium malt beverage.',
      price_minor: 100000,
      is_listed: true,
      in_stock: false, // No Stock
      category: 'Drinks & Beverages',
    },
  ]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        if (data.sessions) {
          setSessions(data.sessions);
        }
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

  const updateOrderStatus = async (orderId: string, newStatus: string, reason?: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          status: newStatus,
          cancel_reason: reason,
        }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
    setCancellingOrderId(null);
  };

  const handleSettleTab = (sessionId: string, cashCollectedMinor: number) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? { ...s, status: 'settled', cash_collected_minor: cashCollectedMinor }
          : s
      )
    );
  };

  const handleVoidTab = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: 'void' } : s))
    );
  };

  const totalDeliveredCashMinor = sessions
    .filter((s) => s.status === 'settled')
    .reduce((acc, s) => acc + s.cash_collected_minor, 0);

  const totalVoidedOrdersCount = orders.filter((o) => o.status === 'cancelled').length;

  return (
    <main className="min-h-screen bg-porcelain text-graphite p-6">
      {/* HEADER & DUAL ROLE NAV */}
      <header className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-linen">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-graphite">Café Neo · Ikeja Counter Till</h1>
            <span className="w-2.5 h-2.5 rounded-full bg-ok animate-pulse" title="Live Feed Active" />
          </div>
          <p className="text-xs text-graphite/70 mt-0.5">Real-time Table Order Feed, Tabs & Staff Console</p>
        </div>

        <div className="flex items-center gap-2 bg-linen p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('counter')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'counter' ? 'bg-ink text-chalk shadow-xs' : 'text-graphite hover:bg-chalk'
            }`}
          >
            Live Order Feed ({orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length})
          </button>
          <button
            onClick={() => setActiveTab('tabs')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'tabs' ? 'bg-brass text-porcelain shadow-xs' : 'text-graphite hover:bg-chalk'
            }`}
          >
            Table Tabs ({sessions.filter((s) => s.status === 'open').length})
          </button>
          <button
            onClick={() => setActiveTab('manager')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'manager' ? 'bg-graphite text-chalk shadow-xs' : 'text-graphite hover:bg-chalk'
            }`}
          >
            Manager Console
          </button>
        </div>
      </header>

      {/* METRICS & TRACKING BAR */}
      <section className="max-w-6xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-chalk p-4 rounded-xl border border-linen flex justify-between items-center shadow-2xs">
          <div>
            <span className="text-[11px] font-bold text-brass uppercase tracking-wider block">Cash Collected (Settled Tabs)</span>
            <span className="text-xl font-extrabold text-graphite">{formatNaira(totalDeliveredCashMinor)}</span>
          </div>
          <span className="text-2xl">💵</span>
        </div>

        <div className="bg-chalk p-4 rounded-xl border border-linen flex justify-between items-center shadow-2xs">
          <div>
            <span className="text-[11px] font-bold text-brass uppercase tracking-wider block">Voided / Cancelled Orders</span>
            <span className="text-xl font-extrabold text-graphite">{totalVoidedOrdersCount} orders</span>
          </div>
          <span className="text-2xl">⚠️</span>
        </div>

        <div className="bg-chalk p-4 rounded-xl border border-linen flex justify-between items-center shadow-2xs">
          <div>
            <span className="text-[11px] font-bold text-brass uppercase tracking-wider block">Service Day Reset</span>
            <span className="text-xs font-semibold text-graphite">06:00 AM Daily Reset Filter</span>
          </div>
          <span className="text-2xl">🕒</span>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <section className="max-w-6xl mx-auto mt-8">
        {activeTab === 'counter' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-graphite">Active Order Feed</h2>
              <span className="text-xs font-semibold text-graphite/70">Auto-refreshing every 3s</span>
            </div>

            {orders.length === 0 ? (
              <div className="bg-chalk p-12 rounded-2xl border border-linen text-center text-graphite/60 text-sm">
                No orders received yet. Placed table orders will appear here automatically.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => {
                  const statusStyles: Record<string, { bg: string; badge: string }> = {
                    incoming: { bg: 'border-brass bg-linen/20', badge: 'bg-brass text-porcelain' },
                    processing: { bg: 'border-ink bg-chalk', badge: 'bg-ink text-chalk' },
                    delivered: { bg: 'border-ok/30 opacity-70 bg-chalk', badge: 'bg-ok text-porcelain' },
                    cancelled: { bg: 'border-alert/30 opacity-50 bg-chalk', badge: 'bg-alert text-porcelain' },
                  };

                  const style = statusStyles[order.status] || statusStyles.incoming;
                  const canWaste = order.status === 'processing' || order.status === 'delivered';

                  return (
                    <div
                      key={order.id}
                      className={`p-5 rounded-2xl border-2 flex flex-col justify-between shadow-xs transition-all ${style.bg}`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3 pb-3 border-b border-linen">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-black text-graphite">Table {order.table_label}</span>
                              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
                                {order.status}
                              </span>
                            </div>
                            <span className="text-[11px] text-graphite/60 block mt-0.5">
                              Placed {new Date(order.placed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <span className="text-sm font-extrabold text-graphite">{formatNaira(order.total_minor)}</span>
                        </div>

                        <div className="space-y-2 mb-4">
                          {order.items?.map((it: any) => (
                            <div key={it.id} className="text-xs text-graphite">
                              <div className="flex justify-between font-semibold">
                                <span>{it.qty}x {it.name_snapshot}</span>
                                <span className="font-mono">{formatNaira((it.price_minor_snapshot || 0) * (it.qty || 1))}</span>
                              </div>
                              {it.options?.length > 0 && (
                                <p className="text-[10px] text-graphite/70 pl-3 italic">
                                  + {it.options.map((o: any) => o.name_snapshot).join(', ')}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-linen space-y-2">
                        {order.status === 'incoming' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'processing')}
                            className="w-full py-2.5 bg-brass text-porcelain rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-xs"
                          >
                            Accept Order → Kitchen Processing
                          </button>
                        )}

                        {order.status === 'processing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                            className="w-full py-2.5 bg-ok text-porcelain rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-xs"
                          >
                            Mark Delivered to Table {order.table_label}
                          </button>
                        )}

                        {/* 58mm Thermal Print Ticket Button */}
                        <button
                          onClick={() => {
                            setPrintingOrder(order);
                            setTicketType('kitchen_ticket');
                          }}
                          className="w-full py-2 bg-linen text-graphite rounded-xl text-xs font-bold border border-linen hover:bg-chalk transition-all"
                        >
                          🖨️ Print ESC/POS Kitchen Ticket
                        </button>

                        {order.status !== 'cancelled' && (
                          <div>
                            {cancellingOrderId === order.id ? (
                              <div className="p-3 bg-porcelain rounded-xl border border-alert space-y-2 animate-in fade-in duration-200">
                                <span className="text-xs font-bold text-alert block">Reason for Cancelling</span>
                                <select
                                  value={cancelReason}
                                  onChange={(e) => setCancelReason(e.target.value as any)}
                                  className="w-full text-xs p-1.5 bg-chalk border border-linen rounded text-graphite"
                                >
                                  <option value="cancelled">Customer Cancelled (Pre-prep)</option>
                                  <option value="wasted" disabled={!canWaste}>
                                    Wasted / Spoiled ({canWaste ? 'Allowed' : 'Requires Processing'})
                                  </option>
                                  <option value="other">Other / Staff Error</option>
                                </select>

                                <div className="flex gap-2 pt-1">
                                  <button
                                    onClick={() => updateOrderStatus(order.id, 'cancelled', cancelReason)}
                                    className="flex-1 py-1.5 bg-alert text-porcelain text-xs font-bold rounded"
                                  >
                                    Confirm Cancel
                                  </button>
                                  <button
                                    onClick={() => setCancellingOrderId(null)}
                                    className="px-3 py-1.5 bg-linen text-graphite text-xs font-bold rounded"
                                  >
                                    Back
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setCancellingOrderId(order.id);
                                  setCancelReason(canWaste ? 'wasted' : 'cancelled');
                                }}
                                className="w-full py-1 text-xs text-alert font-medium hover:underline text-center"
                              >
                                Cancel Order
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'tabs' && (
          <TableTabsView
            sessions={sessions}
            onSettleTab={handleSettleTab}
            onVoidTab={handleVoidTab}
          />
        )}

        {activeTab === 'manager' && (
          <div className="space-y-8">
            <ManagerMenuCrud
              items={menuItems}
              onToggleStock={(id, inStock) =>
                setMenuItems((prev) =>
                  prev.map((it) => (it.id === id ? { ...it, in_stock: inStock } : it))
                )
              }
              onToggleListed={(id, isListed) =>
                setMenuItems((prev) =>
                  prev.map((it) => (it.id === id ? { ...it, is_listed: isListed } : it))
                )
              }
              onAddItem={(newItem) => setMenuItems((prev) => [...prev, newItem])}
            />

            <PaystackSubscriptionCard />
          </div>
        )}
      </section>

      {/* ESC/POS THERMAL PRINTER MODAL */}
      {printingOrder && (
        <PrinterJobModal
          order={printingOrder}
          ticketType={ticketType}
          onClose={() => setPrintingOrder(null)}
        />
      )}
    </main>
  );
}
