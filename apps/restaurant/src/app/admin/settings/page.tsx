'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Building2, Clock, Calculator, Printer, UploadCloud, MapPin, Phone, Mail, Palette, Type, CreditCard } from 'lucide-react';

const tabs = [
  { id: 'general', label: 'General Profile', icon: Building2 },
  { id: 'appearance', label: 'Brand & Appearance', icon: Palette },
  { id: 'operations', label: 'Operations & Hours', icon: Clock },
  { id: 'billing', label: 'Billing', icon: Calculator },
];

const fonts = [
  { name: 'Inter', type: 'Sans-Serif', className: 'font-sans' },
  { name: 'Plus Jakarta Sans', type: 'Sans-Serif', className: 'font-sans' },
  { name: 'Outfit', type: 'Modern Sans', className: 'font-sans' },
  { name: 'Space Grotesk', type: 'Display', className: 'font-sans' },
  { name: 'Playfair Display', type: 'Serif', className: 'font-serif' },
  { name: 'Cormorant Garamond', type: 'Serif', className: 'font-serif' },
];

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('appearance');
  const [activeFont, setActiveFont] = useState('Inter');
  const [primaryColor, setPrimaryColor] = useState('#EA580C');
  const [secondaryColor, setSecondaryColor] = useState('#FFEDD5');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('/api/brand').then(res => res.json()).then(data => {
      if (data) {
        setPrimaryColor(data.primaryColor || '#EA580C');
        setSecondaryColor(data.secondaryColor || '#FFEDD5');
        setActiveFont(data.activeFont || 'Inter');
      }
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ primaryColor, secondaryColor, activeFont }),
      });
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-[1400px] w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-32 font-black text-text-primary tracking-tight leading-none mb-2">System Settings</h1>
          <p className="text-16 font-medium text-text-secondary">Manage your restaurant profile, operations, and hardware.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-action-primary text-surface-primary px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Sidebar (Navigation) */}
        <div className="w-full lg:w-72 flex flex-col gap-2 shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-15 transition-all w-full text-left border ${
                  isActive
                    ? 'bg-surface-primary text-action-primary border-transparent shadow-sm'
                    : 'bg-transparent text-text-secondary border-transparent hover:bg-surface-primary/50 hover:text-text-primary'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-action-primary' : 'text-text-tertiary'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 w-full bg-surface-primary rounded-3xl shadow-sm border border-border-default/50 p-8 min-h-[600px]">
          
          {activeTab === 'general' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              
              <div>
                <h2 className="text-24 font-black text-text-primary tracking-tight mb-2">General Profile</h2>
                <p className="text-15 text-text-tertiary">Your core restaurant identity across the POS and customer apps.</p>
              </div>

              <div className="max-w-2xl space-y-6">
                <div className="space-y-2">
                  <label className="text-14 font-bold text-text-primary">Restaurant Name</label>
                  <input 
                    type="text" 
                    defaultValue="Plated Brooklyn"
                    className="w-full bg-surface-secondary shadow-inner border border-border-default/50 rounded-xl px-4 py-3.5 text-15 font-medium text-text-primary focus:border-action-primary focus:ring-1 focus:ring-action-primary outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-14 font-bold text-text-primary">Support Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary pointer-events-none" />
                      <input 
                        type="email" 
                        defaultValue="hello@plated.com"
                        className="w-full bg-surface-secondary shadow-inner border border-border-default/50 rounded-xl pl-12 pr-4 py-3.5 text-15 font-medium text-text-primary focus:border-action-primary focus:ring-1 focus:ring-action-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-14 font-bold text-text-primary">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary pointer-events-none" />
                      <input 
                        type="tel" 
                        defaultValue="(555) 123-4567"
                        className="w-full bg-surface-secondary shadow-inner border border-border-default/50 rounded-xl pl-12 pr-4 py-3.5 text-15 font-medium text-text-primary focus:border-action-primary focus:ring-1 focus:ring-action-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-border-default/50 my-8" />

                <div className="space-y-2">
                  <label className="text-14 font-bold text-text-primary">Physical Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-text-tertiary pointer-events-none" />
                    <textarea 
                      defaultValue="123 Bedford Ave&#10;Brooklyn, NY 11211"
                      rows={3}
                      className="w-full bg-surface-secondary shadow-inner border border-border-default/50 rounded-xl pl-12 pr-4 py-3.5 text-15 font-medium text-text-primary focus:border-action-primary focus:ring-1 focus:ring-action-primary outline-none transition-all resize-none custom-scrollbar"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              
              <div>
                <h2 className="text-24 font-black text-text-primary tracking-tight mb-2">Brand & Appearance</h2>
                <p className="text-15 text-text-tertiary">Completely white-label the diner-facing app to match your restaurant's unique identity.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Logo & Colors (Left side) */}
                <div className="lg:col-span-1 space-y-8">
                  
                  <div className="space-y-3">
                    <label className="text-14 font-bold text-text-primary">Brand Logo</label>
                    <div className="w-full aspect-square bg-surface-secondary border-2 border-dashed border-border-default rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-action-primary hover:bg-surface-secondary/80 transition-all cursor-pointer group">
                      <div className="w-14 h-14 rounded-full bg-surface-primary shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-6 h-6 text-action-primary" />
                      </div>
                      <div className="text-center px-4">
                        <p className="text-14 font-bold text-text-primary">Upload Logo</p>
                        <p className="text-13 text-text-tertiary mt-1">High-res PNG (max 2MB)</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-14 font-bold text-text-primary">Color System</label>
                    
                    <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-xl border border-border-default/50 relative overflow-hidden">
                      <div>
                        <p className="text-14 font-bold text-text-primary">Primary Color</p>
                        <p className="text-12 text-text-tertiary">Buttons & Accents</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-14 font-bold text-text-secondary uppercase">{primaryColor}</span>
                        <div className="relative w-8 h-8 rounded-full shadow-sm border border-border-default cursor-pointer overflow-hidden ring-2 ring-transparent transition-all" style={{ backgroundColor: primaryColor }}>
                          <input 
                            type="color" 
                            value={primaryColor} 
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-xl border border-border-default/50 relative overflow-hidden">
                      <div>
                        <p className="text-14 font-bold text-text-primary">Secondary Color</p>
                        <p className="text-12 text-text-tertiary">Highlights & Badges</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-14 font-bold text-text-secondary uppercase">{secondaryColor}</span>
                        <div className="relative w-8 h-8 rounded-full shadow-sm border border-border-default cursor-pointer overflow-hidden ring-2 ring-transparent transition-all" style={{ backgroundColor: secondaryColor }}>
                          <input 
                            type="color" 
                            value={secondaryColor} 
                            onChange={(e) => setSecondaryColor(e.target.value)}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Typography (Right side) */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center gap-2">
                    <Type className="w-5 h-5 text-text-secondary" />
                    <label className="text-14 font-bold text-text-primary">Curated Typography</label>
                  </div>
                  <p className="text-14 text-text-tertiary mb-4">Select a font family for your diner app. These are highly optimized for readability and brand character.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {fonts.map((font) => (
                      <div 
                        key={font.name}
                        onClick={() => setActiveFont(font.name)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                          activeFont === font.name 
                            ? 'bg-action-primary/5 border-action-primary shadow-sm ring-1 ring-action-primary'
                            : 'bg-surface-secondary border-border-default/50 hover:border-border-strong hover:shadow-sm'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-6">
                          <span className={`text-13 font-bold px-2.5 py-1 rounded-md ${
                            activeFont === font.name ? 'bg-action-primary text-white' : 'bg-surface-primary text-text-secondary border border-border-default/50'
                          }`}>
                            {font.type}
                          </span>
                          {activeFont === font.name && (
                            <div className="w-5 h-5 rounded-full bg-action-primary flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className={`text-24 text-text-primary mb-1 tracking-tight ${font.name === 'Playfair Display' || font.name === 'Cormorant Garamond' ? 'font-serif' : 'font-sans font-black'}`}>
                            {font.name}
                          </p>
                          <p className="text-14 text-text-secondary">The quick brown fox jumps over the lazy dog.</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'operations' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              
              <div>
                <h2 className="text-24 font-black text-text-primary tracking-tight mb-2">Operations & Hours</h2>
                <p className="text-15 text-text-tertiary">Configure how and when your restaurant receives orders.</p>
              </div>

              <div className="space-y-8 max-w-3xl">
                
                {/* Order Settings */}
                <div className="space-y-6">
                  <h3 className="text-16 font-black text-text-primary border-b border-border-default/50 pb-3">Order Flow</h3>
                  
                  <div className="flex items-center justify-between p-5 bg-surface-secondary rounded-2xl border border-border-default/50">
                    <div>
                      <h4 className="text-15 font-bold text-text-primary">Auto-Accept Online Orders</h4>
                      <p className="text-14 text-text-tertiary mt-1">Automatically send new digital orders to the KDS.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-12 h-7 bg-surface-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-action-primary shadow-inner"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-5 bg-surface-secondary rounded-2xl border border-border-default/50">
                    <div>
                      <h4 className="text-15 font-bold text-text-primary">Default Preparation Time</h4>
                      <p className="text-14 text-text-tertiary mt-1">Estimated time added to customer wait calculations.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        defaultValue="15"
                        className="w-20 bg-surface-primary shadow-sm border border-border-default/50 rounded-lg px-3 py-2 text-15 font-bold text-text-primary text-center focus:border-action-primary outline-none"
                      />
                      <span className="text-14 font-medium text-text-secondary">minutes</span>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="space-y-6">
                  <h3 className="text-16 font-black text-text-primary border-b border-border-default/50 pb-3">Business Hours</h3>
                  
                  <div className="bg-surface-secondary rounded-2xl border border-border-default/50 p-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => (
                      <div key={day} className={`flex items-center justify-between p-4 ${idx !== 6 ? 'border-b border-border-default/30' : ''}`}>
                        <div className="flex items-center gap-4 w-1/3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked={day !== 'Monday'} />
                            <div className="w-10 h-6 bg-surface-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-action-primary"></div>
                          </label>
                          <span className="text-15 font-bold text-text-primary">{day}</span>
                        </div>
                        
                        {day !== 'Monday' ? (
                          <div className="flex items-center gap-3">
                            <select className="bg-surface-primary shadow-sm border border-border-default/50 rounded-lg px-3 py-2 text-14 font-medium text-text-primary outline-none">
                              <option>09:00 AM</option>
                              <option selected>11:00 AM</option>
                            </select>
                            <span className="text-text-tertiary font-medium">to</span>
                            <select className="bg-surface-primary shadow-sm border border-border-default/50 rounded-lg px-3 py-2 text-14 font-medium text-text-primary outline-none">
                              <option>09:00 PM</option>
                              <option selected>10:00 PM</option>
                              <option>11:00 PM</option>
                            </select>
                          </div>
                        ) : (
                          <span className="text-14 font-bold text-text-tertiary px-8">Closed</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              
              <div>
                <h2 className="text-24 font-black text-text-primary tracking-tight mb-2">Billing & Subscription</h2>
                <p className="text-15 text-text-tertiary">Manage your Plated POS subscription and platform fees.</p>
              </div>

              <div className="space-y-8 max-w-3xl">
                {/* Subscription Card */}
                <div className="bg-surface-primary rounded-2xl border border-border-default/50 shadow-sm overflow-hidden">
                  <div className="p-6 sm:p-8 bg-surface-secondary border-b border-border-default/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-20 font-black text-text-primary">Plated Pro Plan</h3>
                        <span className="bg-green-100 text-green-700 text-12 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Active</span>
                      </div>
                      <p className="text-14 text-text-secondary">Your next billing date is September 1, 2026</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <h4 className="text-32 font-black text-text-primary tracking-tight">₦20,000<span className="text-16 text-text-tertiary font-medium">/mo</span></h4>
                    </div>
                  </div>
                  
                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center text-text-primary border border-border-default">
                          <Calculator className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-15 font-bold text-text-primary">Platform Fee</p>
                          <p className="text-13 text-text-tertiary mt-0.5">Applied to digital orders only</p>
                        </div>
                      </div>
                      <span className="text-16 font-black text-text-primary">1.0%</span>
                    </div>

                    <div className="w-full h-px bg-border-default/50"></div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center text-text-primary border border-border-default">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-15 font-bold text-text-primary">Payment Method</p>
                          <p className="text-13 text-text-tertiary mt-0.5">Mastercard ending in 4242</p>
                        </div>
                      </div>
                      <button className="text-14 font-bold text-action-primary hover:underline">Update</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
