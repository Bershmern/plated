'use client';

import React, { useState } from 'react';
import { Users, Clock, Receipt, Plus, CheckCircle2, AlertCircle, Utensils, SprayCan } from 'lucide-react';

type TableStatus = 'available' | 'occupied' | 'cleaning';

interface RestaurantTable {
  id: string;
  number: string;
  capacity: number;
  status: TableStatus;
  timeSeated?: string;
  currentBill?: number;
  orderId?: string;
}

const INITIAL_TABLES: RestaurantTable[] = [
  { id: 't1', number: '01', capacity: 2, status: 'occupied', timeSeated: '12m', currentBill: 45.50, orderId: '#2938' },
  { id: 't2', number: '02', capacity: 2, status: 'available' },
  { id: 't3', number: '03', capacity: 2, status: 'cleaning' },
  { id: 't4', number: '04', capacity: 2, status: 'occupied', timeSeated: '45m', currentBill: 112.00, orderId: '#2921' },
  { id: 't5', number: '05', capacity: 2, status: 'available' },
  { id: 't6', number: '06', capacity: 4, status: 'available' },
  { id: 't7', number: '07', capacity: 4, status: 'occupied', timeSeated: '05m', currentBill: 24.00, orderId: '#2942' },
  { id: 't8', number: '08', capacity: 4, status: 'occupied', timeSeated: '85m', currentBill: 215.75, orderId: '#2890' },
  { id: 't9', number: '09', capacity: 4, status: 'cleaning' },
  { id: 't10', number: '10', capacity: 4, status: 'available' },
  { id: 't11', number: '11', capacity: 6, status: 'occupied', timeSeated: '32m', currentBill: 168.20, orderId: '#2930' },
  { id: 't12', number: '12', capacity: 8, status: 'available' },
];

export default function TablesPage() {
  const [tables, setTables] = useState<RestaurantTable[]>(INITIAL_TABLES);

  const totalTables = tables.length;
  const availableCount = tables.filter(t => t.status === 'available').length;
  const occupiedCount = tables.filter(t => t.status === 'occupied').length;
  const cleaningCount = tables.filter(t => t.status === 'cleaning').length;

  const totalSeats = tables.reduce((sum, t) => sum + t.capacity, 0);
  const occupiedSeats = tables.filter(t => t.status === 'occupied').reduce((sum, t) => sum + t.capacity, 0);

  const handleSeatGuests = (tableId: string) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return { 
          ...t, 
          status: 'occupied', 
          timeSeated: '0m', 
          currentBill: 0.00,
          orderId: `#${Math.floor(Math.random() * 1000) + 3000}`
        };
      }
      return t;
    }));
  };

  const handleSettleBill = (tableId: string) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return { 
          ...t, 
          status: 'cleaning', 
          timeSeated: undefined, 
          currentBill: undefined,
          orderId: undefined
        };
      }
      return t;
    }));
  };

  const handleMarkClean = (tableId: string) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return { ...t, status: 'available' };
      }
      return t;
    }));
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const checkIsLate = (timeStr?: string) => {
    if (!timeStr) return false;
    const mins = parseInt(timeStr.replace('m', ''));
    return !isNaN(mins) && mins >= 60;
  };

  return (
    <div className="h-full flex flex-col bg-surface-secondary p-4 sm:p-6 overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h1 className="text-32 font-black text-surface-primary tracking-tight leading-none mb-2">Table Management</h1>
          <p className="text-16 font-medium text-surface-secondary/70">Monitor dining room status and turn over tables</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-4 mb-8 shrink-0">
        <div className="bg-surface-primary rounded-xl p-5 shadow-sm border border-border-default">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-text-tertiary"></div>
            <p className="text-12 font-bold text-text-tertiary uppercase tracking-widest leading-none pt-0.5">Total Seats</p>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-32 font-black text-text-primary leading-none tracking-tight">{occupiedSeats}</span>
            <span className="text-16 font-bold text-text-secondary mb-0.5">/ {totalSeats}</span>
          </div>
        </div>
        
        <div className="bg-surface-primary rounded-xl p-5 shadow-sm border border-border-default">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
            <p className="text-12 font-bold text-text-tertiary uppercase tracking-widest leading-none pt-0.5">Available</p>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-32 font-black text-text-primary leading-none tracking-tight">{availableCount}</span>
            <span className="text-16 font-bold text-text-secondary mb-0.5">Tables</span>
          </div>
        </div>

        <div className="bg-surface-primary rounded-xl p-5 shadow-sm border border-border-default">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-action-primary shadow-[0_0_8px_rgba(249,115,22,0.4)]"></div>
            <p className="text-12 font-bold text-text-tertiary uppercase tracking-widest leading-none pt-0.5">Occupied</p>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-32 font-black text-text-primary leading-none tracking-tight">{occupiedCount}</span>
            <span className="text-16 font-bold text-text-secondary mb-0.5">Tables</span>
          </div>
        </div>

        <div className="bg-surface-primary rounded-xl p-5 shadow-sm border border-border-default">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]"></div>
            <p className="text-12 font-bold text-text-tertiary uppercase tracking-widest leading-none pt-0.5">Needs Cleaning</p>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-32 font-black text-text-primary leading-none tracking-tight">{cleaningCount}</span>
            <span className="text-16 font-bold text-text-secondary mb-0.5">Tables</span>
          </div>
        </div>
      </div>

      {/* Floor Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-10 pr-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          
          {tables.map(table => {
            const isLate = checkIsLate(table.timeSeated);

            return (
              <div 
                key={table.id} 
                className="flex flex-col bg-surface-primary rounded-2xl overflow-hidden shadow-sm border border-border-default transition-all hover:shadow-md animate-in fade-in zoom-in-95"
              >
                {/* Card Header */}
                <div className="p-4 border-b border-border-default flex justify-between items-center bg-surface-primary">
                  <div className="flex items-center gap-3">
                    <span className="text-28 font-black tracking-tight text-text-primary leading-none">{table.number}</span>
                    <div className="px-2 py-1 bg-surface-secondary text-text-primary rounded-md flex items-center gap-1.5 border border-border-default">
                      <Users className="w-3.5 h-3.5 text-text-secondary" />
                      <span className="text-12 font-bold">{table.capacity}</span>
                    </div>
                  </div>
                  
                  {/* Status Indicator */}
                  {table.status === 'available' && <span className="text-12 font-bold uppercase tracking-wider text-green-600">Available</span>}
                  {table.status === 'occupied' && <span className="text-12 font-bold uppercase tracking-wider text-action-primary">Occupied</span>}
                  {table.status === 'cleaning' && <span className="text-12 font-bold uppercase tracking-wider text-yellow-600">Dirty</span>}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-center min-h-[110px] bg-surface-primary">
                  
                  {table.status === 'available' && (
                    <div className="text-left">
                      <p className="text-16 font-bold text-text-primary mb-1">Ready for seating</p>
                      <p className="text-14 font-medium text-text-secondary">Table is clean and set.</p>
                    </div>
                  )}

                  {table.status === 'cleaning' && (
                    <div className="text-left">
                      <p className="text-16 font-bold text-text-primary mb-1">Needs bussing</p>
                      <p className="text-14 font-medium text-text-secondary">Guests have departed.</p>
                    </div>
                  )}

                  {table.status === 'occupied' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-text-tertiary" />
                          <span className="text-14 font-bold text-text-secondary">{table.orderId}</span>
                        </div>
                        <span className="text-20 font-black text-text-primary tracking-tight">{formatMoney(table.currentBill || 0)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isLate ? <AlertCircle className="w-4 h-4 text-red-500" /> : <Clock className="w-4 h-4 text-text-tertiary" />}
                          <span className={`text-14 font-bold ${isLate ? 'text-red-600' : 'text-text-secondary'}`}>Seated</span>
                        </div>
                        <span className={`text-14 font-bold ${isLate ? 'text-red-600' : 'text-text-primary'}`}>{table.timeSeated}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Edge-to-Edge Action Footer */}
                <div className="mt-auto flex border-t border-border-default shrink-0">
                  
                  {table.status === 'available' && (
                    <button 
                      onClick={() => handleSeatGuests(table.id)}
                      className="flex-1 h-12 bg-surface-secondary hover:bg-surface-tertiary text-text-primary font-bold text-14 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Utensils className="w-4 h-4 text-text-tertiary" /> Seat Guests
                    </button>
                  )}

                  {table.status === 'cleaning' && (
                    <button 
                      onClick={() => handleMarkClean(table.id)}
                      className="flex-1 h-12 bg-surface-secondary hover:bg-surface-tertiary text-text-primary font-bold text-14 flex items-center justify-center gap-2 transition-colors"
                    >
                      <SprayCan className="w-4 h-4 text-text-tertiary" /> Mark as Clean
                    </button>
                  )}

                  {table.status === 'occupied' && (
                    <>
                      <button className="flex-1 h-12 bg-surface-secondary hover:bg-surface-tertiary text-text-primary font-bold text-14 flex items-center justify-center gap-2 transition-colors border-r border-border-default">
                        <Plus className="w-4 h-4 text-text-tertiary" /> Add Item
                      </button>
                      <button 
                        onClick={() => handleSettleBill(table.id)}
                        className="flex-1 h-12 bg-action-primary hover:bg-action-hover text-surface-primary font-bold text-14 flex items-center justify-center transition-colors"
                      >
                        Settle Bill
                      </button>
                    </>
                  )}

                </div>

              </div>
            )
          })}

        </div>
      </div>

    </div>
  );
}
