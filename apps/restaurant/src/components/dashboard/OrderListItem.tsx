import React from 'react';
import { ExternalLink, Printer } from 'lucide-react';

interface OrderListItemProps {
  tableNumber: string;
  customerName: string;
  itemCount: number;
  status: 'incoming' | 'processing' | 'delivered' | 'cancelled';
  orderId?: string;
  type?: 'feed' | 'payment';
  onAction?: () => void;
}

export function OrderListItem({ 
  tableNumber, 
  customerName, 
  itemCount, 
  status, 
  orderId,
  type = 'feed',
  onAction
}: OrderListItemProps) {
  
  return (
    <div className="flex items-center justify-between py-4 border-b border-border-default last:border-0 hover:bg-surface-secondary transition-colors -mx-4 px-4 cursor-pointer group">
      
      <div className="flex flex-col">
        <h4 className="text-14 font-bold text-text-primary leading-tight flex items-center gap-2">
          {customerName}
        </h4>
        <p className="text-13 text-text-tertiary mt-1">
          Table {tableNumber.replace('0', '')} &bull; {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </p>
      </div>

      <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {type === 'feed' ? (
          <>
            <button className="flex items-center gap-1.5 text-12 font-bold text-text-primary hover:text-action-primary transition-colors">
              Print <Printer className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-border-strong" />
            <button className="flex items-center gap-1.5 text-12 font-bold text-text-primary hover:text-action-primary transition-colors">
              View
            </button>
          </>
        ) : (
          <button 
            onClick={(e) => { e.stopPropagation(); onAction?.(); }}
            className="px-4 py-1.5 bg-action-primary hover:bg-action-hover text-surface-primary font-bold text-12 rounded-lg transition-colors flex items-center gap-1.5"
          >
            Settle Bill <span className="text-[14px]">→</span>
          </button>
        )}
      </div>
    </div>
  );
}
