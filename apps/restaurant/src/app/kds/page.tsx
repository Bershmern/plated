'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Check, Utensils, AlertCircle, LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function KDSPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrders = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id, 
        created_at, 
        status, 
        fulfillment_type, 
        customer_name,
        session_id,
        order_items ( id, qty, name_snapshot, notes )
      `)
      .in('status', ['incoming', 'processing', 'ready'])
      .order('created_at', { ascending: true });

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (id: string, newStatus: string) => {
    const supabase = createClient();
    await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    fetchOrders();
  };

  const handleLogout = async () => {
    document.cookie = 'plated_dev_user=; path=/; max-age=0';
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    window.location.href = '/login';
  };

  const incoming = orders.filter(o => o.status === 'incoming');
  const processing = orders.filter(o => o.status === 'processing');
  const ready = orders.filter(o => o.status === 'ready');

  const OrderCard = ({ order }: { order: any }) => {
    const timeElapsed = Math.floor((new Date().getTime() - new Date(order.created_at).getTime()) / 60000);
    const isLate = timeElapsed > 15;

    return (
      <div className={`p-4 rounded-xl border flex flex-col gap-3 transition-colors ${
        isLate && order.status !== 'ready' ? 'border-red-500/50 bg-red-50/50 dark:bg-red-950/20' : 'border-border-default bg-surface-primary shadow-sm'
      }`}>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-20 font-black text-text-primary">
                #{order.id.slice(0, 4).toUpperCase()}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-11 font-bold uppercase tracking-widest ${
                order.fulfillment_type === 'dine_in' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
              }`}>
                {order.fulfillment_type.replace('_', ' ')}
              </span>
            </div>
            <p className="text-13 text-text-tertiary mt-1">{order.customer_name || 'Guest'}</p>
          </div>
          <div className={`flex items-center gap-1 text-14 font-bold ${isLate && order.status !== 'ready' ? 'text-red-500' : 'text-text-secondary'}`}>
            <Clock className="w-4 h-4" />
            {timeElapsed}m
          </div>
        </div>

        <div className="flex-1">
          <ul className="space-y-2">
            {order.order_items?.map((item: any) => (
              <li key={item.id} className="text-15 text-text-secondary flex items-start gap-2">
                <span className="font-bold text-text-primary">{item.qty}x</span>
                <div>
                  <p className="font-semibold">{item.name_snapshot}</p>
                  {item.notes && <p className="text-12 text-orange-600 dark:text-orange-400 leading-tight mt-0.5 font-medium">Note: {item.notes}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-3 border-t border-border-default mt-2 flex gap-2">
          {order.status === 'incoming' && (
            <button 
              onClick={() => updateOrderStatus(order.id, 'processing')}
              className="flex-1 bg-action-primary text-surface-primary py-2.5 rounded-lg font-bold text-14 hover:opacity-90 transition-opacity"
            >
              Start Preparing
            </button>
          )}
          {order.status === 'processing' && (
            <button 
              onClick={() => updateOrderStatus(order.id, 'ready')}
              className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-bold text-14 hover:bg-green-700 transition-colors"
            >
              Mark Ready
            </button>
          )}
          {order.status === 'ready' && (
            <button 
              onClick={() => updateOrderStatus(order.id, 'delivered')}
              className="flex-1 bg-surface-tertiary border border-border-default text-text-secondary py-2.5 rounded-lg font-bold text-14 hover:bg-surface-secondary transition-colors"
            >
              Clear Order
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-surface-primary text-text-primary p-6 overflow-x-auto font-sans">
      <header className="flex justify-between items-center mb-6 pb-6 border-b border-border-default">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-action-primary rounded-xl flex items-center justify-center text-surface-primary shadow-sm">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-24 font-black tracking-tight leading-none">Kitchen Display</h1>
            <p className="text-13 text-text-tertiary font-medium mt-1">Live Order Sync</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-13 font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-900/50">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Live
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 px-4 py-2 bg-surface-secondary hover:bg-surface-tertiary border border-border-default rounded-lg text-14 font-bold text-text-secondary transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-text-tertiary font-medium">Loading orders...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          <div className="flex flex-col bg-surface-secondary rounded-2xl border border-border-default shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border-default flex justify-between items-center bg-surface-tertiary">
              <h2 className="text-14 font-black uppercase tracking-wider text-text-secondary">Incoming</h2>
              <span className="bg-surface-primary text-text-primary border border-border-default text-12 font-bold px-2.5 py-1 rounded-full">{incoming.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
              {incoming.map(order => <OrderCard key={order.id} order={order} />)}
              {incoming.length === 0 && <div className="text-center text-text-tertiary font-medium mt-10">No incoming orders</div>}
            </div>
          </div>

          <div className="flex flex-col bg-surface-secondary rounded-2xl border border-border-default shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border-default flex justify-between items-center bg-surface-tertiary">
              <h2 className="text-14 font-black uppercase tracking-wider text-action-primary">Preparing</h2>
              <span className="bg-action-primary/10 text-action-primary border border-action-primary/20 text-12 font-bold px-2.5 py-1 rounded-full">{processing.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
              {processing.map(order => <OrderCard key={order.id} order={order} />)}
              {processing.length === 0 && <div className="text-center text-text-tertiary font-medium mt-10">No orders in preparation</div>}
            </div>
          </div>

          <div className="flex flex-col bg-surface-secondary rounded-2xl border border-border-default shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border-default flex justify-between items-center bg-surface-tertiary">
              <h2 className="text-14 font-black uppercase tracking-wider text-green-600">Ready</h2>
              <span className="bg-green-50 dark:bg-green-900/20 text-green-600 border border-green-200 dark:border-green-900/50 text-12 font-bold px-2.5 py-1 rounded-full">{ready.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
              {ready.map(order => <OrderCard key={order.id} order={order} />)}
              {ready.length === 0 && <div className="text-center text-text-tertiary font-medium mt-10">No orders ready</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
