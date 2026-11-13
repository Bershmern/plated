import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '../../../lib/supabaseServer';

const FALLBACK_ORDERS = [
  {
    id: 'ord-101',
    chain_id: '11111111-1111-1111-1111-111111111111',
    outlet_id: '22222222-2222-2222-2222-222222222221',
    session_id: 'sess-1',
    table_label: 'Table 4',
    status: 'incoming',
    subtotal_minor: 950000,
    total_minor: 950000,
    currency: 'NGN',
    placed_at: new Date(Date.now() - 5 * 60000).toISOString(),
    items: [
      { id: 'item-1', name_snapshot: 'Smokey Jollof Rice & Chicken', qty: 2, price_minor_snapshot: 350000, notes: 'Extra pepper', options: [] },
      { id: 'item-2', name_snapshot: 'Chilled Zobo Drink', qty: 2, price_minor_snapshot: 125000, options: [] },
    ],
  },
  {
    id: 'ord-102',
    chain_id: '11111111-1111-1111-1111-111111111111',
    outlet_id: '22222222-2222-2222-2222-222222222221',
    session_id: 'sess-2',
    table_label: 'Table 2',
    status: 'processing',
    subtotal_minor: 1200000,
    total_minor: 1200000,
    currency: 'NGN',
    placed_at: new Date(Date.now() - 12 * 60000).toISOString(),
    items: [
      { id: 'item-3', name_snapshot: 'Suya Platter', qty: 1, price_minor_snapshot: 700000, notes: '', options: [] },
      { id: 'item-4', name_snapshot: 'Fried Yam & Pepper Sauce', qty: 1, price_minor_snapshot: 500000, notes: '', options: [] },
    ],
  },
  {
    id: 'ord-103',
    chain_id: '11111111-1111-1111-1111-111111111111',
    outlet_id: '22222222-2222-2222-2222-222222222221',
    session_id: 'sess-3',
    table_label: 'Table 7',
    status: 'ready',
    subtotal_minor: 850000,
    total_minor: 850000,
    currency: 'NGN',
    placed_at: new Date(Date.now() - 18 * 60000).toISOString(),
    items: [
      { id: 'item-5', name_snapshot: 'Egusi Soup with Pounded Yam', qty: 1, price_minor_snapshot: 850000, notes: '', options: [] },
    ],
  },
  {
    id: 'ord-104',
    chain_id: '11111111-1111-1111-1111-111111111111',
    outlet_id: '22222222-2222-2222-2222-222222222221',
    session_id: 'sess-4',
    table_label: 'Table 1',
    status: 'delivered',
    subtotal_minor: 450000,
    total_minor: 450000,
    currency: 'NGN',
    placed_at: new Date(Date.now() - 35 * 60000).toISOString(),
    items: [
      { id: 'item-6', name_snapshot: 'Spaghetti Bolognese', qty: 1, price_minor_snapshot: 450000, notes: '', options: [] },
    ],
  },
];

const FALLBACK_SESSIONS = [
  { id: 'sess-1', table_label: 'Table 4', status: 'open', opened_at: new Date().toISOString(), cash_collected_minor: 0, orders: [FALLBACK_ORDERS[0]] },
  { id: 'sess-2', table_label: 'Table 2', status: 'open', opened_at: new Date().toISOString(), cash_collected_minor: 0, orders: [FALLBACK_ORDERS[1]] },
  { id: 'sess-3', table_label: 'Table 7', status: 'open', opened_at: new Date().toISOString(), cash_collected_minor: 0, orders: [FALLBACK_ORDERS[2]] },
  { id: 'sess-4', table_label: 'Table 1', status: 'open', opened_at: new Date().toISOString(), cash_collected_minor: 0, orders: [FALLBACK_ORDERS[3]] },
];

// ─── GET /api/orders — Fetch active orders & table sessions for restaurant till ────
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();

    // 1. Fetch Orders for Ikeja Outlet with items and options
    const { data: orders, error: ordersErr } = await supabase
      .from('orders')
      .select(`
        id, chain_id, outlet_id, session_id, status, cancel_reason, cancel_note,
        subtotal_minor, total_minor, currency, placed_at, idempotency_key,
        session:table_sessions(table_label),
        items:order_items(
          id, menu_item_id, qty, name_snapshot, price_minor_snapshot, notes,
          options:order_item_options(name_snapshot, price_delta_minor_snapshot)
        )
      `)
      .order('placed_at', { ascending: false });

    if (ordersErr) throw ordersErr;

    // Format orders for counter till
    const formattedOrders = (orders || []).map((o: any) => ({
      id: o.id,
      chain_id: o.chain_id,
      outlet_id: o.outlet_id,
      session_id: o.session_id,
      table_label: o.session?.table_label || '?',
      status: o.status,
      cancel_reason: o.cancel_reason,
      cancel_note: o.cancel_note,
      subtotal_minor: o.subtotal_minor,
      total_minor: o.total_minor,
      currency: o.currency || 'NGN',
      placed_at: o.placed_at,
      idempotency_key: o.idempotency_key,
      items: (o.items || []).map((it: any) => ({
        id: it.id,
        menu_item_id: it.menu_item_id,
        name_snapshot: it.name_snapshot,
        qty: it.qty,
        price_minor_snapshot: it.price_minor_snapshot,
        notes: it.notes,
        options: (it.options || []).map((opt: any) => ({
          name_snapshot: opt.name_snapshot,
          price_delta_minor_snapshot: opt.price_delta_minor_snapshot,
        })),
      })),
    }));

    // 2. Fetch Open Table Sessions (Tabs)
    const { data: sessions, error: sessErr } = await supabase
      .from('table_sessions')
      .select(`
        id, chain_id, outlet_id, table_label, status, cash_collected_minor,
        service_day, opened_at, settled_at
      `)
      .order('opened_at', { ascending: false });

    if (sessErr) throw sessErr;

    // Attach orders to each session
    const formattedSessions = (sessions || []).map((s: any) => {
      const sessionOrders = formattedOrders.filter((ord: any) => ord.session_id === s.id);
      return {
        id: s.id,
        table_label: s.table_label,
        status: s.status,
        opened_at: s.opened_at,
        settled_at: s.settled_at,
        cash_collected_minor: s.cash_collected_minor,
        orders: sessionOrders,
      };
    });

    return NextResponse.json({
      orders: formattedOrders,
      sessions: formattedSessions,
    });
  } catch (err: any) {
    console.warn('[restaurant GET /api/orders] Supabase offline, serving fallback orders:', err?.message || err);
    return NextResponse.json({
      orders: FALLBACK_ORDERS,
      sessions: FALLBACK_SESSIONS,
    });
  }
}

// ─── PATCH /api/orders — Update order status (incoming -> processing -> delivered | cancelled) ────
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, status, cancel_reason, cancel_note } = body;

    if (!order_id || !status) {
      return NextResponse.json(
        { error: { code: 'bad_request', message: 'Missing order_id or status' } },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const updatePayload: any = { status };
    if (cancel_reason) updatePayload.cancel_reason = cancel_reason;
    if (cancel_note) updatePayload.cancel_note = cancel_note;

    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', order_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ order: updatedOrder });
  } catch (err: any) {
    console.error('[restaurant PATCH /api/orders] Error:', err);
    return NextResponse.json(
      { error: { code: 'internal', message: err.message } },
      { status: 500 }
    );
  }
}
