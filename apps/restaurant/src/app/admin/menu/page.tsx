'use client';

import React, { useState } from 'react';
import { Search, Plus, Filter, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';

const mockMenuItems = [
  { id: 1, name: 'Margherita Pizza', description: 'Classic tomato sauce, fresh mozzarella, basil.', category: 'Pizzas', price: 16.00, active: true },
  { id: 2, name: 'Pepperoni Pizza', description: 'Tomato sauce, mozzarella, double pepperoni.', category: 'Pizzas', price: 18.00, active: true },
  { id: 3, name: 'Classic Cheeseburger', description: 'Beef patty, american cheese, lettuce, tomato.', category: 'Burgers', price: 14.00, active: true },
  { id: 4, name: 'Double Bacon Burger', description: 'Two beef patties, bacon, cheddar, house sauce.', category: 'Burgers', price: 18.50, active: true },
  { id: 5, name: 'Truffle Fries', description: 'Crispy fries with truffle oil and parmesan.', category: 'Sides', price: 8.50, active: true },
  { id: 6, name: 'Garlic Bread', description: 'Oven baked artisan bread with garlic butter.', category: 'Sides', price: 6.00, active: true },
  { id: 7, name: 'Craft Cola', description: 'Artisanal cola with natural cane sugar.', category: 'Beverages', price: 4.50, active: false },
];

const categories = ['All', 'Pizzas', 'Burgers', 'Sides', 'Beverages'];

export default function MenuManagementPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const filteredItems = mockMenuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openDrawer = (item: any = null) => {
    setEditingItem(item);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setEditingItem(null), 300); // clear after animation
  };

  return (
    <div className="max-w-[1400px] w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-32 font-black text-text-primary tracking-tight leading-none mb-2">Menu Management</h1>
          <p className="text-16 font-medium text-text-secondary">{mockMenuItems.length} total items in your menu.</p>
        </div>
        <button 
          onClick={() => openDrawer()}
          className="flex items-center gap-2 bg-action-primary text-surface-primary px-5 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Menu Item
        </button>
      </div>

      {/* Toolbar: Detached Tabs & Search for Breathability */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        {/* Category Tabs */}
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

        {/* Search & Filter */}
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
                <th className="p-5">Price</th>
                <th className="p-5">Status</th>
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
                      <p className="text-13 text-text-tertiary truncate max-w-[280px] leading-relaxed">{item.description}</p>
                    </td>
                    <td className="p-5">
                      <span className="px-3 py-1.5 rounded-lg bg-surface-secondary text-13 font-bold text-text-secondary">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-5 font-black text-16 tracking-tight">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1.5 rounded-full text-12 font-bold inline-flex items-center gap-2 ${
                        item.active ? 'bg-green-100 text-green-700' : 'bg-surface-tertiary text-text-tertiary'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${item.active ? 'bg-green-600' : 'bg-text-tertiary'}`}></span>
                        {item.active ? 'Active' : 'Inactive'}
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
                        <button className="p-2.5 text-text-secondary hover:text-red-600 hover:bg-red-50 rounded-lg shadow-sm border border-transparent hover:border-red-100 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-text-secondary">
                    <div className="flex flex-col items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-border-strong mb-4" />
                      <p className="text-16 font-bold text-text-primary">No menu items found</p>
                      <p className="text-14 text-text-tertiary mt-1">Try adjusting your filters or search query.</p>
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
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-text-primary/40 backdrop-blur-sm"
          onClick={closeDrawer}
        />
        
        {/* Drawer Panel */}
        <div 
          className={`absolute inset-y-0 right-0 w-full md:w-[500px] bg-surface-primary shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
            isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-default bg-surface-primary">
            <h2 className="text-20 font-black text-text-primary tracking-tight">
              {editingItem ? 'Edit Menu Item' : 'New Menu Item'}
            </h2>
            <button 
              onClick={closeDrawer}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-secondary rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-surface-primary">
            
            {/* Image Upload Area */}
            <div className="space-y-2">
              <label className="text-13 font-bold text-text-secondary">Item Image</label>
              <div className="w-full h-40 rounded-xl border-2 border-dashed border-border-strong bg-surface-secondary flex flex-col items-center justify-center text-text-tertiary cursor-pointer hover:bg-surface-tertiary hover:border-action-primary hover:text-action-primary transition-all">
                <ImageIcon className="w-8 h-8 mb-2" />
                <p className="font-bold text-14">Click to upload image</p>
                <p className="text-12">PNG, JPG up to 5MB</p>
              </div>
            </div>

            {/* Core Fields */}
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-13 font-bold text-text-secondary">Item Name *</label>
                <input 
                  type="text" 
                  defaultValue={editingItem?.name}
                  placeholder="e.g. Margherita Pizza"
                  className="w-full bg-surface-secondary border border-border-default rounded-xl px-4 py-3 text-15 font-medium text-text-primary focus:border-action-primary focus:ring-1 focus:ring-action-primary outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-13 font-bold text-text-secondary">Price (₦) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    defaultValue={editingItem?.price}
                    placeholder="0.00"
                    className="w-full bg-surface-secondary border border-border-default rounded-xl px-4 py-3 text-15 font-medium text-text-primary focus:border-action-primary focus:ring-1 focus:ring-action-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-13 font-bold text-text-secondary">Category *</label>
                  <select 
                    defaultValue={editingItem?.category || 'Pizzas'}
                    className="w-full bg-surface-secondary border border-border-default rounded-xl px-4 py-3 text-15 font-medium text-text-primary focus:border-action-primary focus:ring-1 focus:ring-action-primary outline-none transition-all appearance-none"
                  >
                    <option value="Pizzas">Pizzas</option>
                    <option value="Burgers">Burgers</option>
                    <option value="Sides">Sides</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-13 font-bold text-text-secondary">Description</label>
                <textarea 
                  defaultValue={editingItem?.description}
                  placeholder="Short description of the item..."
                  rows={3}
                  className="w-full bg-surface-secondary border border-border-default rounded-xl px-4 py-3 text-15 font-medium text-text-primary focus:border-action-primary focus:ring-1 focus:ring-action-primary outline-none transition-all resize-none custom-scrollbar"
                />
              </div>
            </div>

            <hr className="border-border-default" />

            {/* Status & Options */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-15 font-bold text-text-primary">Item Status</h4>
                  <p className="text-13 text-text-secondary mt-0.5">Determine if this item is currently orderable.</p>
                </div>
                {/* Custom Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={editingItem ? editingItem.active : true} />
                  <div className="w-12 h-7 bg-surface-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-action-primary"></div>
                </label>
              </div>

              <div className="bg-surface-secondary border border-border-default p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-14 font-bold text-text-primary">Modifiers & Options</h4>
                  <p className="text-13 text-text-tertiary mt-0.5">Sizes, add-ons, and exclusions.</p>
                </div>
                <button className="text-13 font-bold text-action-primary hover:underline bg-surface-primary px-4 py-2 rounded-lg border border-border-default shadow-sm hover:shadow transition-all">
                  Configure
                </button>
              </div>
            </div>
            
          </div>

          {/* Drawer Footer */}
          <div className="p-6 border-t border-border-default bg-surface-secondary flex items-center justify-end gap-3 shrink-0">
            <button 
              onClick={closeDrawer}
              className="px-5 py-2.5 rounded-lg font-bold text-14 text-text-secondary bg-surface-primary border border-border-default hover:bg-surface-secondary transition-colors"
            >
              Cancel
            </button>
            <button className="px-5 py-2.5 rounded-lg font-bold text-14 text-surface-primary bg-action-primary hover:bg-orange-600 transition-colors shadow-sm">
              Save Item
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
