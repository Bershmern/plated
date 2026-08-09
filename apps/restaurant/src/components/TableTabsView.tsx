'use client';

import { useState } from 'react';

function formatNaira(koboMinor: number): string {
  const naira = Math.floor(koboMinor / 100);
  return `₦${naira.toLocaleString('en-NG')}`;
}

export interface TableSession {
  id: string;
  table_label: string;
  status: 'open' | 'settled' | 'void';
  opened_at: string;
  cash_collected_minor: number;
  orders: Array<{
    id: string;
    total_minor: number;
    placed_at: string;
    items: Array<{ name_snapshot: string; qty: number }>;
  }>;
}

interface TableTabsViewProps {
  sessions: TableSession[];
  onSettleTab: (sessionId: string, cashCollectedMinor: number) => void;
  onVoidTab: (sessionId: string) => void;
}

export function TableTabsView({ sessions, onSettleTab, onVoidTab }: TableTabsViewProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [cashInput, setCashInput] = useState<string>('');

  const now = new Date().getTime();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-graphite">Open Table Tabs</h3>
          <p className="text-xs text-graphite/70">Accumulating orders per table. Settle tab when diners pay at counter.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((sess) => {
          const openedTime = new Date(sess.opened_at).getTime();
          const durationHours = (now - openedTime) / (1000 * 60 * 60);
          const isStale = durationHours >= 2 && sess.status === 'open'; // 2-3h Staleness alert (ARCHITECTURE.md §4)

          const totalTabMinor = sess.orders.reduce((acc, o) => acc + o.total_minor, 0);

          return (
            <div
              key={sess.id}
              className={`p-5 rounded-2xl border-2 flex flex-col justify-between shadow-xs transition-all ${
                isStale
                  ? 'border-alert/70 bg-alert/5'
                  : sess.status === 'settled'
                  ? 'border-ok/30 bg-chalk opacity-70'
                  : 'border-linen bg-chalk'
              }`}
            >
              <div>
                {/* STALENESS WARNING BANNER */}
                {isStale && (
                  <div className="mb-3 p-2 bg-alert text-porcelain rounded-xl text-[11px] font-bold flex items-center justify-between animate-pulse">
                    <span>⚠️ Stale Tab (&gt; 2 Hours Open)</span>
                    <span className="font-mono text-[10px]">{Math.floor(durationHours)}h open</span>
                  </div>
                )}

                <div className="flex justify-between items-start pb-3 border-b border-linen">
                  <div>
                    <h4 className="text-xl font-black text-graphite">Table {sess.table_label}</h4>
                    <span className="text-[11px] text-graphite/60 block mt-0.5">
                      Opened at {new Date(sess.opened_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    sess.status === 'open' ? 'bg-brass text-porcelain' : sess.status === 'settled' ? 'bg-ok text-porcelain' : 'bg-alert text-porcelain'
                  }`}>
                    {sess.status}
                  </span>
                </div>

                {/* ACCUMULATED ORDERS */}
                <div className="py-3 space-y-2">
                  <span className="text-[11px] font-bold text-brass uppercase tracking-wider block">
                    Orders on Tab ({sess.orders.length})
                  </span>
                  {sess.orders.map((ord) => (
                    <div key={ord.id} className="text-xs text-graphite flex justify-between">
                      <span>{ord.items.map((it) => `${it.qty}x ${it.name_snapshot}`).join(', ')}</span>
                      <span className="font-mono">{formatNaira(ord.total_minor)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* TOTAL & SETTLE ACTION */}
              <div className="pt-3 border-t border-linen space-y-3">
                <div className="flex justify-between items-center text-sm font-bold text-graphite">
                  <span>Tab Bill Total</span>
                  <span className="text-base font-extrabold">{formatNaira(totalTabMinor)}</span>
                </div>

                {sess.status === 'open' && (
                  <div>
                    {selectedSessionId === sess.id ? (
                      <div className="space-y-2 p-3 bg-porcelain rounded-xl border border-brass">
                        <label className="block text-xs font-semibold text-graphite">Cash Collected (Naira)</label>
                        <input
                          type="number"
                          value={cashInput}
                          onChange={(e) => setCashInput(e.target.value)}
                          placeholder={`e.g. ${totalTabMinor / 100}`}
                          className="w-full text-xs p-2 bg-chalk border border-linen rounded text-graphite font-bold"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const cashMinor = (parseFloat(cashInput) || (totalTabMinor / 100)) * 100;
                              onSettleTab(sess.id, cashMinor);
                              setSelectedSessionId(null);
                              setCashInput('');
                            }}
                            className="flex-1 py-2 bg-ok text-porcelain text-xs font-bold rounded-lg shadow-xs"
                          >
                            Confirm Payment & Settle
                          </button>
                          <button
                            onClick={() => setSelectedSessionId(null)}
                            className="px-3 py-2 bg-linen text-graphite text-xs font-bold rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedSessionId(sess.id)}
                          className="flex-1 py-2 bg-brass text-porcelain text-xs font-bold rounded-xl shadow-xs hover:opacity-90 transition-all"
                        >
                          Settle Table Tab
                        </button>
                        <button
                          onClick={() => onVoidTab(sess.id)}
                          className="px-3 py-2 text-xs text-alert font-semibold hover:underline"
                        >
                          Void
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
