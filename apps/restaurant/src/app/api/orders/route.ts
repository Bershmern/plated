import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '../../../lib/supabase-server';

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
    console.error('[restaurant GET /api/orders] Error:', err);
    return NextResponse.json(
      { error: { code: 'internal', message: err.message } },
      { status: 500 }
    );
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
