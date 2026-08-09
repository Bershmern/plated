'use client';

function formatNaira(koboMinor: number): string {
  const naira = Math.floor(koboMinor / 100);
  return `₦${naira.toLocaleString('en-NG')}`;
}

interface Order {
  id: string;
  table_label: string;
  placed_at: string;
  total_minor: number;
  items: Array<{
    name_snapshot: string;
    qty: number;
    price_minor_snapshot?: number;
    options?: Array<{ name_snapshot: string }>;
    notes?: string;
  }>;
}

interface PrinterJobModalProps {
  order: Order;
  ticketType: 'kitchen_ticket' | 'order_receipt' | 'bill';
  onClose: () => void;
}

export function PrinterJobModal({ order, ticketType, onClose }: PrinterJobModalProps) {
  const ticketTitles = {
    kitchen_ticket: 'KITCHEN TICKET',
    order_receipt: 'CUSTOMER RECEIPT',
    bill: 'TABLE BILL SUMMARY',
  };

  const handleSendToThermalPrinter = () => {
    alert(`[ESC/POS Driver] Ticket (${ticketTitles[ticketType]}) sent to 58mm thermal printer.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-porcelain rounded-2xl p-6 shadow-2xl space-y-4 border border-linen font-mono text-graphite">
        <div className="flex justify-between items-start pb-3 border-b border-graphite/20">
          <div>
            <h3 className="text-sm font-bold tracking-wider">{ticketTitles[ticketType]}</h3>
            <span className="text-[10px] text-graphite/70 block">58mm ESC/POS Thermal Output</span>
          </div>
          <button onClick={onClose} className="text-graphite font-bold">✕</button>
        </div>

        {/* 58mm Thermal Ticket Preview Frame */}
        <div className="bg-chalk p-4 rounded-xl border border-graphite/30 text-xs space-y-3 font-mono leading-tight">
          <div className="text-center space-y-1">
            <p className="font-extrabold text-sm uppercase">CAFÉ NEO</p>
            <p className="text-[10px]">Ikeja Branch · Lagos</p>
            <p className="text-[10px] border-b border-dashed border-graphite/40 pb-2">
              TABLE: {order.table_label} · TIME: {new Date(order.placed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="space-y-1.5 py-1">
            {order.items.map((it, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between font-bold">
                  <span>{it.qty}x {it.name_snapshot}</span>
                  {ticketType !== 'kitchen_ticket' && (
                    <span>{formatNaira((it.price_minor_snapshot || 0) * it.qty)}</span>
                  )}
                </div>
                {it.options && it.options.length > 0 && (
                  <p className="text-[10px] text-graphite/80 pl-2">
                    + {it.options.map((o) => o.name_snapshot).join(', ')}
                  </p>
                )}
                {it.notes && (
                  <p className="text-[10px] font-bold text-graphite pl-2">
                    * NOTE: {it.notes}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-dashed border-graphite/40 space-y-1">
            <div className="flex justify-between font-extrabold text-sm">
              <span>TOTAL</span>
              <span>{formatNaira(order.total_minor)}</span>
            </div>
            <p className="text-[9px] text-center pt-2 text-graphite/70">
              POWERED BY PLATED · plated.ng
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSendToThermalPrinter}
            className="flex-1 py-3 bg-ink text-chalk rounded-xl text-xs font-bold shadow-xs hover:bg-graphite transition-all"
          >
            🖨️ Send to 58mm Thermal Printer
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 bg-linen text-graphite rounded-xl text-xs font-bold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
