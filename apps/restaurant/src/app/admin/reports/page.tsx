'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Download, TrendingUp, TrendingDown, DollarSign, Users, Utensils, Clock, Receipt } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [topSellers, setTopSellers] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      
      const { data: orders, error: ordersErr } = await supabase
        .from('orders')
        .select('id, total_minor, status, placed_at, order_items(qty, name_snapshot)')
        .order('placed_at', { ascending: false });

      if (orders && !ordersErr) {
        let revenue = 0;
        let orderCount = orders.length;
        let itemsMap: Record<string, { qty: number, rev: number }> = {};
        
        const last7Days = Array.from({length: 7}).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return { day: d.toLocaleDateString('en-US', { weekday: 'short' }), value: 0, rawDate: d };
        });

        orders.forEach(order => {
          revenue += order.total_minor;
          
          const d = new Date(order.placed_at);
          const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
          const chartItem = last7Days.find(x => x.day === dayName);
          if (chartItem) chartItem.value += (order.total_minor / 100);

          if (order.order_items) {
            order.order_items.forEach((item: any) => {
              if (!itemsMap[item.name_snapshot]) itemsMap[item.name_snapshot] = { qty: 0, rev: 0 };
              itemsMap[item.name_snapshot].qty += item.qty;
            });
          }
        });

        const maxVal = Math.max(...last7Days.map(d => d.value), 1);
        const mappedChart = last7Days.map(d => ({
          day: d.day,
          value: d.value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
          height: `${(d.value / maxVal) * 100}%`
        }));

        setStats({
          totalRevenue: revenue / 100,
          totalOrders: orderCount,
          avgOrderValue: orderCount ? (revenue / 100) / orderCount : 0
        });
        
        setChartData(mappedChart);

        const sortedItems = Object.entries(itemsMap)
          .sort((a, b) => b[1].qty - a[1].qty)
          .slice(0, 3)
          .map(([name, data], i) => ({
            name,
            sales: data.qty,
            percentage: `${Math.max(20, 100 - (i * 30))}%`
          }));
        
        setTopSellers(sortedItems);

        setRecentTransactions(orders.slice(0, 5).map(o => ({
          id: '#' + o.id.slice(0, 6).toUpperCase(),
          time: new Date(o.placed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          amount: o.total_minor / 100,
          status: o.status === 'delivered' ? 'Completed' : (o.status === 'incoming' ? 'Incoming' : 'Preparing')
        })));
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-text-tertiary">Loading reports...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-32 font-black text-text-primary tracking-tight">Reports & Analytics</h1>
          <p className="text-15 text-text-tertiary mt-1">Real-time insights for your business</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-secondary text-text-primary font-bold rounded-lg border border-border-default hover:bg-border-default/50 transition-colors">
            <Calendar className="w-4 h-4" />
            Last 7 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-action-primary text-surface-primary font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-primary p-6 rounded-2xl shadow-sm border border-border-default/50 relative overflow-hidden group hover:border-action-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-700">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-13 font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
              <TrendingUp className="w-3 h-3" />
              +12.5%
            </span>
          </div>
          <div>
            <p className="text-14 font-bold text-text-secondary mb-1">Gross Revenue</p>
            <h3 className="text-32 font-black text-text-primary tracking-tight">₦{stats.totalRevenue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-surface-primary p-6 rounded-2xl shadow-sm border border-border-default/50 relative overflow-hidden group hover:border-action-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-action-primary/10 flex items-center justify-center text-action-primary">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-13 font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
              <TrendingUp className="w-3 h-3" />
              +8.2%
            </span>
          </div>
          <div>
            <p className="text-14 font-bold text-text-secondary mb-1">Total Orders</p>
            <h3 className="text-32 font-black text-text-primary tracking-tight">{stats.totalOrders}</h3>
          </div>
        </div>

        <div className="bg-surface-primary p-6 rounded-2xl shadow-sm border border-border-default/50 relative overflow-hidden group hover:border-action-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-14 font-bold text-text-secondary mb-1">Avg. Order Value</p>
            <h3 className="text-32 font-black text-text-primary tracking-tight">₦{stats.avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
          </div>
        </div>

        <div className="bg-surface-primary p-6 rounded-2xl shadow-sm border border-border-default/50 relative overflow-hidden group hover:border-action-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-14 font-bold text-text-secondary mb-1">Active Tables</p>
            <h3 className="text-32 font-black text-text-primary tracking-tight">85%</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-primary p-8 rounded-2xl shadow-sm border border-border-default/50 flex flex-col min-h-[420px]">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-20 font-black text-text-primary">Sales Over Time</h3>
              <p className="text-15 text-text-tertiary mt-1">Revenue breakdown by day</p>
            </div>
            <div className="text-right">
              <p className="text-28 font-black text-text-primary tracking-tight">₦{stats.totalRevenue.toLocaleString()}</p>
              <p className="text-14 font-bold text-green-600">Total this period</p>
            </div>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-4 sm:gap-6 relative pt-8">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full border-t border-border-default/30 border-dashed"></div>
              ))}
              <div className="w-full border-t border-border-default/30"></div>
            </div>
            
            {chartData.map((data, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center flex-1 h-full justify-end group">
                <div className="absolute -top-12 bg-text-primary text-surface-primary text-13 font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md pointer-events-none whitespace-nowrap">
                  ₦{data.value}
                </div>
                <div 
                  className="w-full max-w-[36px] bg-action-primary/80 hover:bg-action-primary rounded-t-xl transition-all duration-500 ease-out cursor-pointer shadow-sm"
                  style={{ height: data.height }}
                ></div>
                <div className="mt-5 text-14 font-bold text-text-tertiary group-hover:text-text-primary transition-colors">
                  {data.day}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-primary p-8 rounded-2xl shadow-sm border border-border-default/50 flex flex-col">
          <div className="mb-8">
            <h3 className="text-20 font-black text-text-primary">Top Selling Items</h3>
            <p className="text-15 text-text-tertiary mt-1">Highest volume</p>
          </div>
          
          <div className="flex-1 flex flex-col gap-6">
            {topSellers.map((item, i) => (
              <div key={item.name} className="flex flex-col gap-3 group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <span className="w-7 h-7 rounded-full bg-surface-secondary flex items-center justify-center text-13 font-black text-text-secondary shrink-0 shadow-sm border border-border-default/50 group-hover:bg-action-primary group-hover:text-surface-primary transition-colors">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-15 font-bold text-text-primary leading-tight">{item.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-15 font-bold text-text-primary">{item.sales} ord.</p>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-surface-secondary rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-action-primary rounded-full transition-all duration-1000"
                    style={{ width: item.percentage }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-surface-primary rounded-2xl shadow-sm border border-border-default overflow-hidden">
        <div className="p-6 border-b border-border-default flex items-center justify-between">
          <div>
            <h3 className="text-18 font-black text-text-primary">Recent Transactions</h3>
            <p className="text-14 text-text-tertiary mt-1">Live feed of processed orders</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-secondary/50 text-12 font-bold text-text-tertiary uppercase tracking-wider border-b border-border-default">
                <th className="p-5 pl-8">Order ID</th>
                <th className="p-5">Time</th>
                <th className="p-5">Amount</th>
                <th className="p-5 pr-8">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default/50 text-14 text-text-primary">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-surface-secondary/50 transition-colors group">
                  <td className="p-5 pl-8 font-bold text-15 text-text-primary">
                    {tx.id}
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-text-secondary font-medium">
                      <Clock className="w-4 h-4" />
                      {tx.time}
                    </div>
                  </td>
                  <td className="p-5 font-black text-16 tracking-tight">
                    ₦{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-5 pr-8">
                    <span className={`px-3 py-1.5 rounded-full text-12 font-bold inline-flex items-center gap-2 ${
                      tx.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                      tx.status === 'Preparing' ? 'bg-orange-100 text-orange-700' :
                      'bg-surface-tertiary text-text-tertiary'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        tx.status === 'Completed' ? 'bg-green-600' : 
                        tx.status === 'Preparing' ? 'bg-action-primary' :
                        'bg-text-tertiary'
                      }`}></span>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
