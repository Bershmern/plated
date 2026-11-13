'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Filter, MoreHorizontal, LayoutGrid, Download, QrCode, Trash2, Smartphone } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { QRCodeSVG } from 'qrcode.react';

interface RestaurantQR {
  id: string;
  chain_id: string;
  outlet_id: string;
  label: string;
  type: 'dine_in' | 'public';
  is_active: boolean;
}

export default function TablesPage() {
  const [qrs, setQrs] = useState<RestaurantQR[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'dine_in' | 'public'>('dine_in');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [labelInput, setLabelInput] = useState('');
  const [typeInput, setTypeInput] = useState<'dine_in' | 'public'>('dine_in');
  
  const supabase = createClient();

  const fetchQRs = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    // For now we get the chain_id from the user's staff record, or we just fetch all QRs the user has access to via RLS
    const { data, error } = await supabase
      .from('restaurant_qrs')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setQrs(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQRs();
  }, []);

  const handleAddQR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!labelInput) return;

    // We need outlet_id and chain_id. We fetch it from staff_users for the current user.
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: staffData } = await supabase
      .from('staff_users')
      .select('chain_id, outlet_id')
      .eq('id', user.id)
      .single();

    if (staffData) {
      await supabase.from('restaurant_qrs').insert({
        chain_id: staffData.chain_id,
        outlet_id: staffData.outlet_id,
        label: labelInput,
        type: typeInput,
        is_active: true
      });
      fetchQRs();
      setIsDrawerOpen(false);
      setLabelInput('');
    }
  };

  const handleDeleteQR = async (id: string) => {
    if (confirm('Are you sure you want to delete this QR code?')) {
      await supabase.from('restaurant_qrs').delete().eq('id', id);
      fetchQRs();
    }
  };

  const downloadQR = (id: string, label: string) => {
    const svg = document.getElementById(`qr-${id}`);
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width + 40;
        canvas.height = img.height + 40;
        if (ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 20, 20);
          const pngFile = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.download = `QR_${label.replace(/\s+/g, '_')}.png`;
          downloadLink.href = `${pngFile}`;
          downloadLink.click();
        }
      };
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  const filteredQRs = qrs.filter(qr => {
    if (filter !== qr.type) return false;
    if (searchQuery && !qr.label.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-[1400px] w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-32 font-black text-text-primary tracking-tight leading-none mb-2">QR Codes & Tables</h1>
          <p className="text-16 font-medium text-text-secondary">Generate and manage physical table QRs and public online ordering links.</p>
        </div>
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 bg-action-primary text-surface-primary px-5 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity whitespace-nowrap shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Create QR Link
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto custom-scrollbar pb-2 md:pb-0">
          <button
            onClick={() => setFilter('dine_in')}
            className={`px-5 py-2.5 rounded-full font-bold text-14 transition-all whitespace-nowrap shadow-sm border flex items-center gap-2 ${
              filter === 'dine_in' 
                ? 'bg-action-primary text-surface-primary border-action-primary' 
                : 'bg-surface-primary text-text-secondary border-border-default hover:border-text-tertiary hover:text-text-primary'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            In-House Tables (Dine-in)
          </button>
          <button
            onClick={() => setFilter('public')}
            className={`px-5 py-2.5 rounded-full font-bold text-14 transition-all whitespace-nowrap shadow-sm border flex items-center gap-2 ${
              filter === 'public' 
                ? 'bg-action-primary text-surface-primary border-action-primary' 
                : 'bg-surface-primary text-text-secondary border-border-default hover:border-text-tertiary hover:text-text-primary'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Public Links (Pickup/Delivery)
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-surface-primary shadow-sm px-4 py-2.5 rounded-xl w-full md:w-72 border border-border-default focus-within:border-action-primary focus-within:ring-1 focus-within:ring-action-primary transition-all">
            <Search className="w-4 h-4 text-text-tertiary" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-14 w-full placeholder:text-text-tertiary text-text-primary"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center text-text-tertiary font-medium">Loading QR codes...</div>
      ) : filteredQRs.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-text-tertiary font-medium border-2 border-dashed border-border-default rounded-2xl bg-surface-primary">
          <QrCode className="w-12 h-12 mb-4 opacity-50" />
          <p>No QR codes found for this category.</p>
          <button onClick={() => setIsDrawerOpen(true)} className="mt-4 text-action-primary font-bold hover:underline">Create your first one</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredQRs.map(qr => {
            // Note: In production, dynamically resolve the current host or use NEXT_PUBLIC_SITE_URL.
            // For MVP, we assume a standard route format:
            const appUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
            const qrLink = qr.type === 'dine_in' 
              ? `${appUrl}/o/plated?type=dine_in&t=${encodeURIComponent(qr.label)}`
              : `${appUrl}/o/plated?type=public`;

            return (
              <div key={qr.id} className="bg-surface-primary border border-border-default rounded-2xl p-6 shadow-sm flex flex-col items-center text-center group">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                  <QRCodeSVG 
                    id={`qr-${qr.id}`}
                    value={qrLink} 
                    size={160} 
                    level="H"
                    includeMargin={false}
                    fgColor="#000000"
                  />
                </div>
                
                <h3 className="text-20 font-black text-text-primary mb-1">{qr.label}</h3>
                <p className="text-13 text-text-tertiary font-medium mb-6">
                  {qr.type === 'dine_in' ? 'Table Order' : 'Public Order Link'}
                </p>

                <div className="flex items-center gap-2 w-full mt-auto">
                  <button 
                    onClick={() => downloadQR(qr.id, qr.label)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-surface-secondary text-text-secondary font-bold text-14 rounded-lg border border-border-default hover:bg-surface-tertiary transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button 
                    onClick={() => handleDeleteQR(qr.id)}
                    className="p-2.5 text-text-tertiary hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-surface-primary h-full shadow-2xl border-l border-border-default animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-6 border-b border-border-default flex justify-between items-center bg-surface-secondary/50">
              <h2 className="text-20 font-black text-text-primary">Create New QR Link</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-tertiary text-text-secondary hover:text-text-primary transition-colors">
                <span className="text-16 font-black leading-none pb-[2px]">×</span>
              </button>
            </div>

            <form onSubmit={handleAddQR} className="p-6 flex-1 overflow-y-auto space-y-6 custom-scrollbar">
              <div className="space-y-2">
                <label className="text-13 font-bold text-text-secondary uppercase tracking-wider">QR Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTypeInput('dine_in')}
                    className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                      typeInput === 'dine_in'
                        ? 'border-action-primary bg-action-primary/5 shadow-[0_0_0_1px_rgba(var(--action-primary-rgb),1)]'
                        : 'border-border-default hover:border-text-tertiary bg-surface-secondary'
                    }`}
                  >
                    <LayoutGrid className={`w-5 h-5 ${typeInput === 'dine_in' ? 'text-action-primary' : 'text-text-tertiary'}`} />
                    <div>
                      <h4 className={`font-bold text-14 ${typeInput === 'dine_in' ? 'text-action-primary' : 'text-text-primary'}`}>In-House Table</h4>
                      <p className="text-12 text-text-tertiary mt-1 font-medium">Binds orders to a table.</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTypeInput('public')}
                    className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                      typeInput === 'public'
                        ? 'border-action-primary bg-action-primary/5 shadow-[0_0_0_1px_rgba(var(--action-primary-rgb),1)]'
                        : 'border-border-default hover:border-text-tertiary bg-surface-secondary'
                    }`}
                  >
                    <Smartphone className={`w-5 h-5 ${typeInput === 'public' ? 'text-action-primary' : 'text-text-tertiary'}`} />
                    <div>
                      <h4 className={`font-bold text-14 ${typeInput === 'public' ? 'text-action-primary' : 'text-text-primary'}`}>Public Link</h4>
                      <p className="text-12 text-text-tertiary mt-1 font-medium">For social & pickup.</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-13 font-bold text-text-secondary uppercase tracking-wider">
                  {typeInput === 'dine_in' ? 'Table Number / Label' : 'Link Name / Location'}
                </label>
                <input 
                  type="text" 
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                  placeholder={typeInput === 'dine_in' ? 'e.g., Table 4 or Patio 2' : 'e.g., Main Entrance Window'}
                  className="w-full bg-surface-secondary border border-border-default text-text-primary text-15 font-medium px-4 py-3 rounded-xl focus:border-action-primary focus:ring-1 focus:ring-action-primary outline-none transition-all"
                  required
                />
              </div>
            </form>

            <div className="p-6 border-t border-border-default bg-surface-secondary/50">
              <button 
                onClick={handleAddQR}
                className="w-full bg-action-primary text-surface-primary font-black text-16 py-4 rounded-xl shadow-sm hover:opacity-90 transition-opacity"
              >
                Generate QR Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
