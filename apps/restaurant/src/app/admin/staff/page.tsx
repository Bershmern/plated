'use client';

import React, { useState } from 'react';
import { Search, Plus, Filter, Edit2, Trash2, X, Shield, Key, Mail, Lock } from 'lucide-react';

const mockStaff = [
  { id: 1, firstName: 'Sarah', lastName: 'Jenkins', role: 'Cashier', email: 'sarah.j@plated.com', pin: '****', active: true, lastActive: 'Today at 2:30 PM' },
  { id: 2, firstName: 'Mike', lastName: 'Thompson', role: 'Admin', email: 'admin@gmail.com', pin: '****', active: true, lastActive: 'Right now' },
  { id: 3, firstName: 'Elena', lastName: 'Rodriguez', role: 'Kitchen', email: 'elena.r@plated.com', pin: '****', active: true, lastActive: 'Today at 10:15 AM' },
  { id: 4, firstName: 'David', lastName: 'Kim', role: 'Cashier', email: 'david.k@plated.com', pin: '****', active: false, lastActive: 'Yesterday at 5:00 PM' },
  { id: 5, firstName: 'James', lastName: 'Wilson', role: 'Manager', email: 'james.w@plated.com', pin: '****', active: true, lastActive: 'Today at 1:45 PM' },
];

const roles = ['All Staff', 'Admin', 'Manager', 'Cashier', 'Kitchen'];

export default function StaffManagementPage() {
  const [activeRole, setActiveRole] = useState('All Staff');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);

  const filteredStaff = mockStaff.filter(staff => {
    const matchesRole = activeRole === 'All Staff' || staff.role === activeRole;
    const matchesSearch = 
      `${staff.firstName} ${staff.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) || 
      staff.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const openDrawer = (staff: any = null) => {
    setEditingStaff(staff);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setEditingStaff(null), 300);
  };

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'Admin': return 'bg-purple-100 text-purple-700';
      case 'Manager': return 'bg-blue-100 text-blue-700';
      case 'Cashier': return 'bg-orange-100 text-orange-700';
      case 'Kitchen': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-surface-secondary text-text-secondary';
    }
  };

  return (
    <div className="max-w-[1400px] w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-32 font-black text-text-primary tracking-tight leading-none mb-2">Staff Management</h1>
          <p className="text-16 font-medium text-text-secondary">{mockStaff.length} total staff members registered.</p>
        </div>
        <button 
          onClick={() => openDrawer()}
          className="flex items-center gap-2 bg-action-primary text-surface-primary px-5 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Staff Member
        </button>
      </div>

      {/* Toolbar: Detached Tabs & Search for Breathability */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        {/* Role Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto custom-scrollbar pb-2 md:pb-0">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-5 py-2.5 rounded-full font-bold text-14 transition-all whitespace-nowrap shadow-sm border ${
                activeRole === role 
                  ? 'bg-action-primary text-surface-primary border-action-primary' 
                  : 'bg-surface-primary text-text-secondary border-border-default hover:border-text-tertiary hover:text-text-primary'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-surface-primary shadow-sm px-4 py-2.5 rounded-xl w-full md:w-72 border border-border-default focus-within:border-action-primary focus-within:ring-1 focus-within:ring-action-primary transition-all">
            <Search className="w-4 h-4 text-text-tertiary" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
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
                <th className="p-5 pl-8">Staff Member</th>
                <th className="p-5">Role</th>
                <th className="p-5">Contact</th>
                <th className="p-5">Status</th>
                <th className="p-5">Last Active</th>
                <th className="p-5 pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default/50 text-14 text-text-primary">
              {filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-surface-secondary/50 transition-colors group">
                    <td className="p-5 pl-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-surface-secondary flex items-center justify-center font-bold text-16 text-text-primary shrink-0 border border-border-default shadow-sm">
                          {staff.firstName[0]}{staff.lastName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-16 text-text-primary leading-tight">{staff.firstName} {staff.lastName}</p>
                          <p className="text-13 text-text-tertiary mt-0.5">ID: #{1000 + staff.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1.5 rounded-lg text-13 font-bold shadow-sm border border-transparent ${getRoleBadgeColor(staff.role)}`}>
                        {staff.role}
                      </span>
                    </td>
                    <td className="p-5">
                      <p className="text-15 font-medium text-text-primary">{staff.email}</p>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1.5 rounded-full text-12 font-bold inline-flex items-center gap-2 ${
                        staff.active ? 'bg-green-100 text-green-700' : 'bg-surface-tertiary text-text-tertiary'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${staff.active ? 'bg-green-600' : 'bg-text-tertiary'}`}></span>
                        {staff.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-5 text-14 font-medium text-text-secondary">
                      {staff.lastActive}
                    </td>
                    <td className="p-5 pr-8 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openDrawer(staff)}
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
                      <Shield className="w-12 h-12 text-border-strong mb-4" />
                      <p className="text-16 font-bold text-text-primary">No staff members found</p>
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
          className={`absolute inset-y-0 right-0 w-full md:w-[550px] bg-surface-primary shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
            isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-default bg-surface-primary">
            <h2 className="text-20 font-black text-text-primary tracking-tight">
              {editingStaff ? 'Edit Staff Member' : 'New Staff Member'}
            </h2>
            <button 
              onClick={closeDrawer}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-secondary rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-surface-primary">
            
            {/* Core Details */}
            <div className="space-y-5">
              <h3 className="text-16 font-bold text-text-primary border-b border-border-default pb-2">Personal Details</h3>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-13 font-bold text-text-secondary">First Name *</label>
                  <input 
                    type="text" 
                    defaultValue={editingStaff?.firstName}
                    placeholder="e.g. Sarah"
                    className="w-full bg-surface-secondary border border-border-default rounded-xl px-4 py-3 text-15 font-medium text-text-primary focus:border-action-primary focus:ring-1 focus:ring-action-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-13 font-bold text-text-secondary">Last Name *</label>
                  <input 
                    type="text" 
                    defaultValue={editingStaff?.lastName}
                    placeholder="e.g. Jenkins"
                    className="w-full bg-surface-secondary border border-border-default rounded-xl px-4 py-3 text-15 font-medium text-text-primary focus:border-action-primary focus:ring-1 focus:ring-action-primary outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Role & Permissions */}
            <div className="space-y-5">
              <h3 className="text-16 font-bold text-text-primary border-b border-border-default pb-2">Role & Access</h3>
              <div className="space-y-1.5">
                <label className="text-13 font-bold text-text-secondary">Assigned Role *</label>
                <select 
                  defaultValue={editingStaff?.role || 'Cashier'}
                  className="w-full bg-surface-secondary border border-border-default rounded-xl px-4 py-3 text-15 font-medium text-text-primary focus:border-action-primary focus:ring-1 focus:ring-action-primary outline-none transition-all appearance-none"
                >
                  <option value="Admin">Admin (Full Access)</option>
                  <option value="Manager">Manager (Operations & Staff)</option>
                  <option value="Cashier">Cashier (POS Only)</option>
                  <option value="Kitchen">Kitchen Staff (KDS Only)</option>
                </select>
              </div>

              {/* Credentials Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="bg-surface-secondary p-4 rounded-xl border border-border-default space-y-3">
                  <div className="flex items-center gap-2 text-text-primary mb-2">
                    <Mail className="w-4 h-4 text-action-primary" />
                    <span className="font-bold text-14">Dashboard Email</span>
                  </div>
                  <input 
                    type="email" 
                    defaultValue={editingStaff?.email}
                    placeholder="staff@plated.com"
                    className="w-full bg-surface-primary shadow-sm border border-border-default rounded-xl px-4 py-3 text-15 font-medium text-text-primary focus:border-action-primary focus:ring-1 focus:ring-action-primary outline-none transition-all"
                  />
                </div>

                <div className="bg-surface-secondary p-4 rounded-xl border border-border-default space-y-3">
                  <div className="flex items-center gap-2 text-text-primary mb-2">
                    <Key className="w-4 h-4 text-action-primary" />
                    <span className="font-bold text-14">POS Terminal PIN</span>
                  </div>
                  <input 
                    type="password" 
                    maxLength={4}
                    defaultValue={editingStaff ? '1234' : ''}
                    placeholder="4-Digit PIN"
                    className="w-full bg-surface-primary shadow-sm border border-border-default rounded-xl px-4 py-3 text-16 font-mono tracking-[0.5em] text-text-primary focus:border-action-primary focus:ring-1 focus:ring-action-primary outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="space-y-5">
              <h3 className="text-16 font-bold text-text-primary border-b border-border-default pb-2">Security Settings</h3>
              
              <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-xl border border-border-default">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-surface-primary flex items-center justify-center border border-border-default shadow-sm">
                    <Lock className="w-5 h-5 text-text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-15 font-bold text-text-primary">Account Status</h4>
                    <p className="text-13 text-text-tertiary mt-0.5">Allow this user to log into Plated.</p>
                  </div>
                </div>
                {/* Custom Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={editingStaff ? editingStaff.active : true} />
                  <div className="w-12 h-7 bg-surface-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-action-primary"></div>
                </label>
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
              {editingStaff ? 'Update Staff' : 'Create Staff'}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
