'use client';

import React, { useState } from 'react';
import { Clock, ChevronRight, Utensils, ShoppingBag, Truck, CheckCircle2, MoreHorizontal, AlertCircle, LayoutGrid, List } from 'lucide-react';

type OrderStatus = 'new' | 'preparing' | 'ready' | 'completed';
type OrderType = 'dine_in' | 'pickup' | 'delivery';

interface OrderItem {
  id: string;
  name: string;
  qty: number;
  addons?: string[];
}

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  type: OrderType;
  table?: string;
  customer?: string;
  items: OrderItem[];
  timeElapsed: string;
}

// Helper to generate lots of dummy data for pagination demo
const generateDummyOrders = (): Order[] => {
  const base: Order[] = [
    { id: 'o1', orderNumber: '2940', status: 'new', type: 'dine_in', table: '12', timeElapsed: '2m', items: [{ id: 'i1', name: 'Margherita Pizza', qty: 1, addons: ['Extra Cheese'] }, { id: 'i2', name: 'Cola', qty: 2 }] },
    { id: 'o2', orderNumber: '2941', status: 'new', type: 'delivery', customer: 'Sarah W.', timeElapsed: '16m', items: [{ id: 'i3', name: 'Double Bacon Burger', qty: 2, addons: ['No Onions'] }, { id: 'i4', name: 'French Fries', qty: 2 }] },
    { id: 'o3', orderNumber: '2938', status: 'preparing', type: 'pickup', customer: 'Mike T.', timeElapsed: '12m', items: [{ id: 'i5', name: 'Veggie Supreme', qty: 1 }] },
    { id: 'o4', orderNumber: '2937', status: 'preparing', type: 'dine_in', table: '04', timeElapsed: '25m', items: [{ id: 'i6', name: 'Classic Cheeseburger', qty: 3 }, { id: 'i7', name: 'Garlic Bread', qty: 1 }] },
    { id: 'o5', orderNumber: '2935', status: 'ready', type: 'delivery', customer: 'John D.', timeElapsed: '32m', items: [{ id: 'i8', name: 'Hawaiian BBQ Pizza', qty: 1 }, { id: 'i9', name: 'Lemonade', qty: 1 }] }
  ];

  // Generate an extra 55 completed orders to show pagination
  const extras: Order[] = Array.from({ length: 55 }).map((_, i) => ({
    id: `extra_${i}`,
    orderNumber: `${2934 - i}`,
    status: 'completed',
    type: i % 3 === 0 ? 'dine_in' : i % 3 === 1 ? 'pickup' : 'delivery',
    table: i % 3 === 0 ? `${(i % 15) + 1}` : undefined,
    customer: i % 3 !== 0 ? `Customer ${i}` : undefined,
    timeElapsed: '45m',
    items: [{ id: `ei_${i}`, name: 'Classic Cheeseburger', qty: 1 }]
  }));

  return [...base, ...extras];
};

const INITIAL_ORDERS = generateDummyOrders();

const STATUS_COLUMNS: { id: OrderStatus; title: string }[] = [
  { id: 'new', title: 'New Orders' },
  { id: 'preparing', title: 'In Kitchen' },
  { id: 'ready', title: 'Ready / QA' },
  { id: 'completed', title: 'Completed' },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [viewType, setViewType] = useState<'board' | 'list'>('board');
  
  // Pagination State for List View
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;
  
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const paginatedOrders = orders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const advanceOrder = (orderId: string, currentStatus: OrderStatus) => {
    const statusFlow: Record<OrderStatus, OrderStatus> = {
      'new': 'preparing',
      'preparing': 'ready',
      'ready': 'completed',
      'completed': 'completed'
    };

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: statusFlow[currentStatus] };
      }
      return o;
    }));
  };

  const getActionText = (status: OrderStatus) => {
    switch (status) {
      case 'new': return 'Start Cooking';
      case 'preparing': return 'Mark Ready';
      case 'ready': return 'Complete Order';
      default: return '';
    }
  };

  const getTypeIcon = (type: OrderType) => {
    switch (type) {
      case 'dine_in': return <Utensils className="w-3.5 h-3.5" />;
      case 'pickup': return <ShoppingBag className="w-3.5 h-3.5" />;
      case 'delivery': return <Truck className="w-3.5 h-3.5" />;
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new': return <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-12 font-bold uppercase tracking-wider">New</span>;
      case 'preparing': return <span className="px-2 py-1 rounded bg-orange-100 text-action-primary text-12 font-bold uppercase tracking-wider">Preparing</span>;
      case 'ready': return <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-12 font-bold uppercase tracking-wider">Ready</span>;
      case 'completed': return <span className="px-2 py-1 rounded bg-surface-tertiary text-text-secondary text-12 font-bold uppercase tracking-wider">Completed</span>;
    }
  };

  const checkIsLate = (timeStr: string) => {
    const mins = parseInt(timeStr.replace('m', ''));
    return !isNaN(mins) && mins >= 15;
  };

  return (
    <div className="h-full flex flex-col bg-surface-secondary p-4 sm:p-6 overflow-hidden">
      
      {/* Header & View Toggle */}
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h1 className="text-32 font-black text-surface-primary tracking-tight leading-none mb-2">Order Management</h1>
          <p className="text-16 font-medium text-surface-secondary/70">Track active tickets and historical orders</p>
        </div>
        
        <div className="flex bg-surface-primary rounded-xl p-1 shadow-sm">
          <button 
            onClick={() => setViewType('board')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-14 transition-colors ${viewType === 'board' ? 'bg-text-primary text-surface-primary' : 'text-text-secondary hover:bg-surface-secondary'}`}
          >
            <LayoutGrid className="w-4 h-4" /> Board
          </button>
          <button 
            onClick={() => setViewType('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-14 transition-colors ${viewType === 'list' ? 'bg-text-primary text-surface-primary' : 'text-text-secondary hover:bg-surface-secondary'}`}
          >
            <List className="w-4 h-4" /> See All (List)
          </button>
        </div>
      </div>

      {/* ---------------- BOARD VIEW ---------------- */}
      {viewType === 'board' && (
        <div className="flex-1 overflow-x-auto custom-scrollbar">
          <div className="flex h-full gap-5 min-w-[1200px]">
            
            {STATUS_COLUMNS.map(column => {
              const columnOrders = orders.filter(o => o.status === column.id);
              
              return (
                <div key={column.id} className="flex-1 flex flex-col bg-surface-primary rounded-2xl overflow-hidden border border-border-default">
                  
                  {/* Column Header */}
                  <div className="px-6 py-5 flex justify-between items-center shrink-0 border-b border-border-default">
                    <h2 className="text-14 font-bold text-text-primary uppercase tracking-widest">{column.title}</h2>
                    <span className="w-7 h-7 rounded-full bg-surface-secondary text-text-primary flex items-center justify-center text-12 font-bold">
                      {columnOrders.length}
                    </span>
                  </div>

                  {/* Column Body */}
                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar bg-surface-secondary">
                    {columnOrders.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-text-tertiary">
                        <p className="text-12 font-bold uppercase tracking-widest">No Tickets</p>
                      </div>
                    ) : (
                      columnOrders.map(order => {
                        const isLate = checkIsLate(order.timeElapsed);

                        return (
                          <div key={order.id} className="bg-surface-primary rounded-xl border border-border-default shadow-sm flex flex-col overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-2">
                            
                            {/* Ticket Header & Metadata */}
                            <div className="p-4 pb-3 border-b border-border-default bg-surface-primary">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <span className="text-20 font-black text-text-primary tracking-tight block leading-none mb-1.5">
                                    #{order.orderNumber}
                                  </span>
                                  <div className={`flex items-center gap-1.5 text-12 font-bold uppercase tracking-wider ${isLate && order.status !== 'completed' ? 'text-red-600' : 'text-text-tertiary'}`}>
                                    {isLate && order.status !== 'completed' ? <AlertCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                    <span>{order.timeElapsed}</span>
                                  </div>
                                </div>
                                
                                <div className="px-2.5 py-1.5 bg-surface-secondary text-text-primary rounded-lg flex items-center gap-1.5 text-12 font-bold uppercase tracking-wider border border-border-default">
                                  {getTypeIcon(order.type)}
                                  <span>{order.type === 'dine_in' ? `Table ${order.table}` : order.customer}</span>
                                </div>
                              </div>
                            </div>

                            {/* Ticket Items */}
                            <div className="space-y-3 p-4 bg-surface-secondary/20">
                              {order.items.map(item => (
                                <div key={item.id} className="flex items-start gap-3">
                                  <span className="w-6 h-6 rounded-md bg-surface-secondary text-text-primary flex items-center justify-center text-14 font-black shrink-0 border border-border-default">
                                    {item.qty}
                                  </span>
                                  <div className="flex-1">
                                    <h4 className="text-14 font-bold text-text-primary leading-tight">{item.name}</h4>
                                    {item.addons && item.addons.length > 0 && (
                                      <div className="text-12 text-text-secondary font-medium mt-0.5 space-y-0.5">
                                        {item.addons.map((a, i) => <div key={i}>+ {a}</div>)}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Edge-to-Edge Action Button */}
                            {order.status !== 'completed' && (
                              <button 
                                onClick={() => advanceOrder(order.id, order.status)}
                                className={`w-full h-12 font-bold text-14 flex items-center justify-center gap-2 transition-colors shrink-0 border-t
                                  ${order.status === 'ready' 
                                    ? 'bg-text-primary text-surface-primary hover:bg-text-secondary border-text-primary' 
                                    : 'bg-action-primary text-surface-primary hover:bg-action-hover border-action-primary'}`}
                              >
                                {getActionText(order.status)} 
                                {order.status === 'ready' ? <CheckCircle2 className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                              </button>
                            )}
                            
                            {/* Completed State Footer */}
                            {order.status === 'completed' && (
                              <div className="h-10 bg-surface-tertiary flex items-center justify-between px-4 text-text-secondary shrink-0 border-t border-border-default">
                                <span className="text-12 font-bold uppercase tracking-wider flex items-center gap-1.5 text-text-primary">
                                  <CheckCircle2 className="w-4 h-4"/> Completed
                                </span>
                                <button className="p-1 hover:bg-surface-secondary rounded"><MoreHorizontal className="w-4 h-4" /></button>
                              </div>
                            )}

                          </div>
                        )
                      })
                    )}
                  </div>

                </div>
              )
            })}
            
          </div>
        </div>
      )}

      {/* ---------------- LIST VIEW ---------------- */}
      {viewType === 'list' && (
        <div className="flex-1 flex flex-col bg-surface-primary rounded-2xl border border-border-default overflow-hidden animate-in fade-in duration-200">
          
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-secondary sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-12 font-bold text-text-tertiary uppercase tracking-widest border-b border-border-default whitespace-nowrap">Order ID</th>
                  <th className="px-6 py-4 text-12 font-bold text-text-tertiary uppercase tracking-widest border-b border-border-default whitespace-nowrap">Type / Context</th>
                  <th className="px-6 py-4 text-12 font-bold text-text-tertiary uppercase tracking-widest border-b border-border-default w-full">Items</th>
                  <th className="px-6 py-4 text-12 font-bold text-text-tertiary uppercase tracking-widest border-b border-border-default whitespace-nowrap">Time</th>
                  <th className="px-6 py-4 text-12 font-bold text-text-tertiary uppercase tracking-widest border-b border-border-default whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 text-12 font-bold text-text-tertiary uppercase tracking-widest border-b border-border-default whitespace-nowrap text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {paginatedOrders.map(order => {
                  const isLate = checkIsLate(order.timeElapsed);
                  const totalItems = order.items.reduce((sum, i) => sum + i.qty, 0);
                  const itemsSummary = order.items.map(i => `${i.qty}x ${i.name}`).join(', ');

                  return (
                    <tr key={order.id} className="hover:bg-surface-secondary/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-16 font-black text-text-primary">#{order.orderNumber}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-14 font-medium text-text-primary">
                          <span className="text-text-secondary">{getTypeIcon(order.type)}</span>
                          {order.type === 'dine_in' ? `Table ${order.table}` : order.customer}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-14 font-medium text-text-primary line-clamp-1">
                          <span className="font-bold text-action-primary mr-2">{totalItems} items:</span>
                          <span className="text-text-secondary">{itemsSummary}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <div className={`flex items-center gap-1.5 text-14 font-bold ${isLate && order.status !== 'completed' ? 'text-red-600' : 'text-text-secondary'}`}>
                            {isLate && order.status !== 'completed' && <AlertCircle className="w-4 h-4" />}
                            {order.timeElapsed}
                         </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {order.status !== 'completed' ? (
                          <button 
                            onClick={() => advanceOrder(order.id, order.status)}
                            className="px-4 py-2 bg-action-primary hover:bg-action-hover text-surface-primary rounded-lg font-bold text-14 transition-colors"
                          >
                            {getActionText(order.status)}
                          </button>
                        ) : (
                          <button className="px-4 py-2 bg-surface-secondary hover:bg-surface-tertiary text-text-primary rounded-lg font-bold text-14 transition-colors">
                            View Receipt
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-border-default bg-surface-primary flex items-center justify-between shrink-0">
             <span className="text-14 font-medium text-text-secondary">
               Showing <span className="font-bold text-text-primary">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-bold text-text-primary">{Math.min(currentPage * ITEMS_PER_PAGE, orders.length)}</span> of <span className="font-bold text-text-primary">{orders.length}</span> orders
             </span>
             <div className="flex items-center gap-2">
               <button 
                 disabled={currentPage === 1}
                 onClick={() => setCurrentPage(p => p - 1)}
                 className="px-4 py-2 rounded-lg border border-border-default font-bold text-14 disabled:opacity-50 hover:bg-surface-secondary transition-colors"
               >
                 Previous
               </button>
               <span className="px-4 text-14 font-bold text-text-primary">Page {currentPage} of {totalPages}</span>
               <button 
                 disabled={currentPage === totalPages}
                 onClick={() => setCurrentPage(p => p + 1)}
                 className="px-4 py-2 rounded-lg border border-border-default font-bold text-14 disabled:opacity-50 hover:bg-surface-secondary transition-colors"
               >
                 Next
               </button>
             </div>
          </div>

        </div>
      )}

    </div>
  );
}
