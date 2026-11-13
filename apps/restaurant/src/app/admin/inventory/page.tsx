'use client';

import React, { useState } from 'react';
import { Search, Filter, Edit2, X, Image as ImageIcon, History, Package } from 'lucide-react';

const mockInventoryItems = [
  { id: 1, name: 'Margherita Pizza', category: 'Pizzas', stock_count: null, in_stock: true },
  { id: 2, name: 'Pepperoni Pizza', category: 'Pizzas', stock_count: 5, in_stock: true },
  { id: 3, name: 'Classic Cheeseburger', category: 'Burgers', stock_count: 12, in_stock: true },
  { id: 4, name: 'Double Bacon Burger', category: 'Burgers', stock_count: 8, in_stock: true },
  { id: 5, name: 'Truffle Fries', category: 'Sides', stock_count: 50, in_stock: true },
  { id: 6, name: 'Garlic Bread', category: 'Sides', stock_count: 0, in_stock: false },
  { id: 7, name: 'Craft Cola', category: 'Beverages', stock_count: null, in_stock: true },
];

const categories = ['All', 'Pizzas', 'Burgers', 'Sides', 'Beverages'];

export default function InventoryManagementPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Drawer states
  const [isUnlimited, setIsUnlimited] = useState(true);
  const [editStockCount, setEditStockCount] = useState('');

  const filteredItems = mockInventoryItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openDrawer = (item: any) => {
    setEditingItem(item);
    setIsUnlimited(item.stock_count === null);
    setEditStockCount(item.stock_count !== null ? String(item.stock_count) : '');
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setEditingItem(null), 300);
  };

  return (
    <div className="max-w-[1400px] w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-32 font-black text-text-primary tracking-tight leading-none mb-2">Inventory Management</h1>
          <p className="text-16 font-medium text-text-secondary">Track and adjust stock levels across your menu.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto custom-scrollbar pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full font-bold text-14 transition-all whitespace-nowrap shadow-sm border ${
                activeCategory === cat 
                  ? 'bg-action-primary text-surface-primary border-action-primary' 
                  : 'bg-surface-primary text-text-secondary border-border-default hover:border-text-tertiary hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-surface-primary shadow-sm px-4 py-2.5 rounded-xl w-full md:w-72 border border-border-default focus-within:border-action-primary focus-within:ring-1 focus-within:ring-action-primary transition-all">
            <Search className="w-4 h-4 text-text-tertiary" />
            <input 
              type="text" 
              placeholder="Search items..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-14 w-full placeholder:text-text-tertiary text-text-primary"
            />
          </div>
          <button className="flex items-center justify-center w-11 h-11 rounded-xl bg-surface-primary shadow-sm border border-border-default text-text-secondary hover:text-text-primary transition-colors shrink-0">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface-primary rounded-2xl shadow-sm border border-border-default overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-secondary/50 text-12 font-bold text-text-tertiary uppercase tracking-wider border-b border-border-default">
                <th className="p-5 pl-8 w-16">Image</th>
                <th className="p-5">Item Name</th>
                <th className="p-5">Category</th>
                <th className="p-5">Stock Level</th>
                <th className="p-5">Availability</th>
                <th className="p-5 pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default/50 text-14 text-text-primary">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-secondary/50 transition-colors group">
                    <td className="p-5 pl-8">
                      <div className="w-14 h-14 rounded-xl bg-surface-secondary flex items-center justify-center border border-border-default overflow-hidden shrink-0">
                        <ImageIcon className="w-6 h-6 text-text-tertiary opacity-50" />
                      </div>
                    </td>
                    <td className="p-5">
                      <p className="font-bold text-16 text-text-primary mb-1">{item.name}</p>
                    </td>
                    <td className="p-5">
                      <span className="px-3 py-1.5 rounded-lg bg-surface-secondary text-13 font-bold text-text-secondary">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        {item.stock_count === null ? (
                          <span className="text-14 font-medium text-text-secondary italic">Unlimited</span>
                        ) : (
                          <span className={`text-16 font-black \${item.stock_count <= 5 && item.stock_count > 0 ? 'text-orange-500' : item.stock_count === 0 ? 'text-red-500' : 'text-text-primary'}`}>
                            {item.stock_count}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1.5 rounded-full text-12 font-bold inline-flex items-center gap-2 \${
                        item.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        <span className={`w-2 h-2 rounded-full \${item.in_stock ? 'bg-green-600' : 'bg-red-600'}`}></span>
                        {item.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="p-5 pr-8 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openDrawer(item)}
                          className="p-2.5 text-text-secondary hover:text-text-primary hover:bg-surface-primary rounded-lg shadow-sm border border-transparent hover:border-border-default transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-text-secondary">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="w-12 h-12 text-border-strong mb-4" />
                      <p className="text-16 font-bold text-text-primary">No items found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Drawer */}
      <div 
        className={`fixed inset-0 z-[100] transition-opacity duration-300 \${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className="absolute inset-0 bg-text-primary/40 backdrop-blur-sm"
          onClick={closeDrawer}
        />
        
        <div 
          className={`absolute inset-y-0 right-0 w-full md:w-[500px] bg-surface-primary shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out \${
            isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-6 border-b border-border-default bg-surface-primary shrink-0">
            <h2 className="text-20 font-black text-text-primary tracking-tight">
              Manage Inventory
            </h2>
            <button 
              onClick={closeDrawer}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-secondary rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-surface-primary">
            {editingItem && (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-surface-secondary border border-border-default flex items-center justify-center shrink-0">
                    <ImageIcon className="w-6 h-6 text-text-tertiary" />
                  </div>
                  <div>
                    <h3 className="text-18 font-bold text-text-primary">{editingItem.name}</h3>
                    <p className="text-14 text-text-secondary">{editingItem.category}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-15 font-bold text-text-primary">Stock Level</h4>
                  
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="unlimited" 
                      checked={isUnlimited} 
                      onChange={(e) => setIsUnlimited(e.target.checked)} 
                      className="w-5 h-5 rounded text-action-primary focus:ring-action-primary border-border-default bg-surface-secondary"
                    />
                    <label htmlFor="unlimited" className="font-bold text-14 text-text-primary cursor-pointer">
                      Unlimited (Do not track stock)
                    </label>
                  </div>

                  {!isUnlimited && (
                    <div className="space-y-1.5 mt-4">
                      <label className="text-13 font-bold text-text-secondary">Current Stock Count</label>
                      <input
                        type="number"
                        value={editStockCount}
                        onChange={(e) => setEditStockCount(e.target.value)}
                        placeholder="e.g. 50"
                        className="w-full bg-surface-secondary border border-border-default rounded-xl px-4 py-3 text-15 font-bold text-text-primary focus:border-action-primary focus:ring-1 focus:ring-action-primary outline-none transition-all"
                      />
                    </div>
                  )}
                </div>

                <hr className="border-border-default my-6" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-15 font-bold text-text-primary flex items-center gap-2">
                      <History className="w-4 h-4" />
                      Recent Stock Ledger
                    </h4>
                  </div>
                  
                  <div className="space-y-3 bg-surface-secondary border border-border-default rounded-xl p-4">
                    <div className="flex items-center justify-between text-13 pb-3 border-b border-border-default/50">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-14 text-green-600">+100</span>
                        <span className="font-medium text-text-primary">Manual Restock</span>
                      </div>
                      <span className="text-text-tertiary">2 hours ago</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-13 pb-3 border-b border-border-default/50">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-14 text-red-600">-2</span>
                        <span className="font-medium text-text-primary">Order #A1B2</span>
                      </div>
                      <span className="text-text-tertiary">Yesterday</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-13">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-14 text-red-600">-5</span>
                        <span className="font-medium text-text-primary">Spoilage</span>
                      </div>
                      <span className="text-text-tertiary">2 days ago</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="p-6 border-t border-border-default bg-surface-secondary flex items-center justify-end gap-3 shrink-0">
            <button 
              onClick={closeDrawer}
              className="px-5 py-2.5 rounded-lg font-bold text-14 text-text-secondary bg-surface-primary border border-border-default hover:bg-surface-secondary transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={closeDrawer}
              className="px-5 py-2.5 rounded-lg font-bold text-14 text-surface-primary bg-action-primary hover:bg-orange-600 transition-colors shadow-sm"
            >
              Save Inventory
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
