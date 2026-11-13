import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export function MetricCard({ title, value, trend, icon, active, onClick }: MetricCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`p-6 rounded-2xl transition-all h-full flex flex-col justify-between bg-surface-primary border ${active ? 'border-border-default shadow-md bg-surface-secondary/50' : 'border-border-default hover:border-border-strong hover:bg-surface-secondary/20'}`}
    >
      <div className="flex justify-between items-start mb-4 shrink-0">
        <h3 className="text-12 font-bold text-text-tertiary uppercase tracking-widest">{title}</h3>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${active ? 'bg-surface-secondary text-text-primary shadow-sm border border-border-default' : 'bg-surface-tertiary text-text-secondary border border-border-default'}`}>
          {icon}
        </div>
      </div>
      
      <div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-4xl font-black tracking-tight text-text-primary">{value}</span>
        </div>
        
        <p className={`text-13 font-medium ${active ? 'text-action-primary' : 'text-text-tertiary'}`}>
          {trend}
        </p>
      </div>
    </div>
  );
}
