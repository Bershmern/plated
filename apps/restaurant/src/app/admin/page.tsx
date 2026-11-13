'use client';

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingBag, ArrowUpRight } from 'lucide-react';

const KPICard = ({ title, value, change, isPositive, icon: Icon }: any) => (
  <div className="bg-surface-primary p-5 rounded-2xl border border-border-default shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center text-text-primary">
        <Icon className="w-5 h-5" />
      </div>
      <div className={`flex items-center gap-1 text-12 font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {change}%
      </div>
    </div>
    <div>
      <h3 className="text-14 font-bold text-text-secondary mb-1">{title}</h3>
      <p className="text-28 font-black text-text-primary tracking-tight">{value}</p>
    </div>
  </div>
);

export default function AdminOverviewPage() {
  return (
    <div className="max-w-[1400px] w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div>
        <h1 className="text-32 font-black text-text-primary tracking-tight leading-none mb-2">Overview</h1>
        <p className="text-16 font-medium text-text-secondary">Here's what's happening at Pizza Heaven today.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KPICard title="Total Revenue" value="₦4,289.50" change="12.5" isPositive={true} icon={DollarSign} />
        <KPICard title="Total Orders" value="156" change="8.2" isPositive={true} icon={ShoppingBag} />
        <KPICard title="Average Order Value" value="₦27.49" change="2.1" isPositive={false} icon={ArrowUpRight} />
        <KPICard title="Total Guests" value="412" change="15.3" isPositive={true} icon={Users} />
      </div>

      {/* Charts & Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart Placeholder */}
        <div className="lg:col-span-2 bg-surface-primary rounded-2xl border border-border-default shadow-sm p-6 min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-16 font-bold text-text-primary">Revenue Over Time</h2>
            <select className="bg-surface-secondary text-14 font-bold text-text-primary px-3 py-1.5 rounded-lg border border-border-default outline-none">
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="flex-1 flex items-center justify-center bg-surface-secondary/30 rounded-xl border border-dashed border-border-strong text-text-tertiary">
            <p className="font-bold text-14 uppercase tracking-widest">Chart Placeholder</p>
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-surface-primary rounded-2xl border border-border-default shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-16 font-bold text-text-primary">Top Selling Items</h2>
            <button className="text-12 font-bold text-action-primary hover:underline">View All</button>
          </div>
          
          <div className="space-y-4">
            {[
              { name: 'Margherita Pizza', sales: 42, revenue: '₦630.00' },
              { name: 'Double Bacon Burger', sales: 38, revenue: '₦570.00' },
              { name: 'Classic Cheeseburger', sales: 29, revenue: '₦348.00' },
              { name: 'Hawaiian BBQ Pizza', sales: 24, revenue: '₦432.00' },
              { name: 'Garlic Bread', sales: 45, revenue: '₦180.00' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <span className="text-14 font-bold text-text-tertiary w-4">{i + 1}</span>
                  <div>
                    <h4 className="text-14 font-bold text-text-primary group-hover:text-action-primary transition-colors">{item.name}</h4>
                    <p className="text-12 text-text-secondary">{item.sales} sold</p>
                  </div>
                </div>
                <span className="text-14 font-bold text-text-primary">{item.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recent Activity / Orders Table */}
      <div className="bg-surface-primary rounded-2xl border border-border-default shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border-default flex justify-between items-center">
          <h2 className="text-16 font-bold text-text-primary">Recent Orders</h2>
          <button className="text-12 font-bold text-action-primary hover:underline">View All Orders</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-secondary text-12 font-bold text-text-tertiary uppercase tracking-wider border-b border-border-default">
                <th className="p-4 pl-6">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default text-14 text-text-primary">
              {[
                { id: '#1452', customer: 'Walk-in', type: 'Dine-in (Table 4)', amount: '₦42.50', status: 'Completed', time: '2 min ago' },
                { id: '#1451', customer: 'Sarah Jenkins', type: 'Takeaway', amount: '₦18.00', status: 'Cooking', time: '12 min ago' },
                { id: '#1450', customer: 'UberEats', type: 'Delivery', amount: '₦64.20', status: 'Ready', time: '18 min ago' },
                { id: '#1449', customer: 'Walk-in', type: 'Dine-in (Table 12)', amount: '₦112.00', status: 'Completed', time: '35 min ago' },
                { id: '#1448', customer: 'Mike T.', type: 'Takeaway', amount: '₦24.50', status: 'Completed', time: '42 min ago' },
              ].map((order, i) => (
                <tr key={i} className="hover:bg-surface-secondary transition-colors">
                  <td className="p-4 pl-6 font-bold font-mono">{order.id}</td>
                  <td className="p-4 font-medium">{order.customer}</td>
                  <td className="p-4 text-text-secondary">{order.type}</td>
                  <td className="p-4 font-bold">{order.amount}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-11 font-bold ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'Cooking' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right text-text-tertiary">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
