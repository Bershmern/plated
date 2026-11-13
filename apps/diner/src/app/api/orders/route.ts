import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '../../../lib/supabaseServer';

// ─── POST /api/orders — Place a new order ────────────────────────────────────
export async function POST(request: NextRequest) {
  const idempotencyKey = request.headers.get('Idempotency-Key');

  if (!idempotencyKey) {
    return NextResponse.json(
      { error: { code: 'bad_request', message: 'Missing Idempotency-Key header' } },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { outlet_id, table_label, items, client_created_at, fulfillment_type, customer_name, customer_phone, delivery_address } = body;

    if (!outlet_id || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: { code: 'bad_request', message: 'Invalid order payload: outlet_id and items required' } },
        { status: 400 }
      );
    }

    // Check offline stale TTL (20 minutes)
    if (client_created_at) {
      const clientTime = new Date(client_created_at).getTime();
      if (Date.now() - clientTime > 20 * 60 * 1000) {
        return NextResponse.json(
          { error: { code: 'order_stale', message: 'Queued order is older than 20 minutes' } },
          { status: 409 }
        );
      }
    }

    // Resolve device ID from cookie
    const deviceId = request.cookies.get('__plated_device_id')?.value;

    if (!deviceId) {
      return NextResponse.json(
        { error: { code: 'device_unknown', message: 'Device not recognized. Please scan the QR code again.' } },
        { status: 401 }
      );
    }

    const supabase = createServerClient();

    // Call the atomic place_order_transaction RPC
    const { data: rpcRes, error: rpcErr } = await supabase.rpc('place_order_transaction', {
      p_device_id: deviceId,
      p_outlet_id: outlet_id,
      p_table_label: table_label || null,
      p_client_created_at: client_created_at || new Date().toISOString(),
      p_idempotency_key: idempotencyKey,
      p_items: items,
      p_fulfillment_type: fulfillment_type || 'dine_in',
      p_customer_name: customer_name || null,
      p_customer_phone: customer_phone || null,
      p_delivery_address: delivery_address || null,
    });

    if (rpcErr) {
      if (rpcErr.message.includes('item_unavailable')) {
        return NextResponse.json(
          { error: { code: 'item_unavailable', message: 'One or more items in your cart are no longer available' } },
          { status: 422 }
        );
      }
      if (rpcErr.message.includes('outlet_not_found')) {
        return NextResponse.json(
          { error: { code: 'outlet_not_found', message: 'Outlet not found or closed' } },
          { status: 404 }
        );
      }
      throw rpcErr;
    }

    // Fetch the created order details to return to the client
    const { data: createdOrder, error: fetchErr } = await supabase
      .from('orders')
      .select(`
        id, status, placed_at, subtotal_minor, total_minor, currency,
        items:order_items(
          id, menu_item_id, qty, name_snapshot, price_minor_snapshot, notes,
          options:order_item_options(name_snapshot, price_delta_minor_snapshot)
        )
      `)
      .eq('id', rpcRes.order_id)
      .single();

    if (fetchErr || !createdOrder) {
      throw fetchErr || new Error('Failed to fetch created order');
    }

    const formattedOrder = {
      id: createdOrder.id,
      status: createdOrder.status,
      placed_at: createdOrder.placed_at,
      subtotal_minor: createdOrder.subtotal_minor,
      total_minor: createdOrder.total_minor,
      currency: createdOrder.currency,
      items: (createdOrder.items || []).map((it: any) => {
        const optionsDelta = (it.options || []).reduce(
          (acc: number, opt: any) => acc + (opt.price_delta_minor_snapshot || 0),
          0
        );
        return {
          menu_item_id: it.menu_item_id,
          name: it.name_snapshot,
          qty: it.qty,
          price_minor: it.price_minor_snapshot,
          line_total_minor: it.qty * (it.price_minor_snapshot + optionsDelta),
          notes: it.notes,
          options: (it.options || []).map((opt: any) => ({
            name: opt.name_snapshot,
            price_delta_minor: opt.price_delta_minor_snapshot,
          })),
        };
      }),
    };

    const statusCode = rpcRes.is_replay ? 200 : 201;

    return NextResponse.json(
      {
        order: formattedOrder,
        session: { id: rpcRes.session_id },
        recognition: { order_count: rpcRes.order_count },
      },
      { status: statusCode }
    );
  } catch (err: any) {
    console.error('[orders POST] Error:', err);
    return NextResponse.json(
      { error: { code: 'internal', message: err.message } },
      { status: 500 }
    );
  }
}

// ─── GET /api/orders?id=:orderId — Poll order status ─────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('id');

  if (!orderId) {
    return NextResponse.json(
      { error: { code: 'bad_request', message: 'Missing order id query param' } },
      { status: 400 }
    );
  }

  try {
    const supabase = createServerClient();
    const deviceId = request.cookies.get('__plated_device_id')?.value;

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select(`
        id, status, placed_at, subtotal_minor, total_minor, currency,
        profile:diner_profiles!inner(device_id),
        items:order_items(
          menu_item_id, qty, name_snapshot, price_minor_snapshot, notes,
          options:order_item_options(name_snapshot, price_delta_minor_snapshot)
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderErr || !order) {
      return NextResponse.json(
        { error: { code: 'order_not_found', message: 'Order not found' } },
        { status: 404 }
      );
    }

    // Verify device ownership
    const profileObj = (order as any).profile;
    const profileDeviceId = Array.isArray(profileObj) ? profileObj[0]?.device_id : profileObj?.device_id;
    if (deviceId && profileDeviceId && profileDeviceId !== deviceId) {
      return NextResponse.json(
        { error: { code: 'order_not_found', message: 'Order not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      order: {
        id: order.id,
        status: order.status,
        placed_at: order.placed_at,
        subtotal_minor: order.subtotal_minor,
        total_minor: order.total_minor,
        currency: order.currency,
        items: (order.items || []).map((it: any) => {
          const optionsDelta = (it.options || []).reduce(
            (acc: number, opt: any) => acc + (opt.price_delta_minor_snapshot || 0),
            0
          );
          return {
            menu_item_id: it.menu_item_id,
            name: it.name_snapshot,
            qty: it.qty,
            price_minor: it.price_minor_snapshot,
            line_total_minor: it.qty * (it.price_minor_snapshot + optionsDelta),
            notes: it.notes,
            options: (it.options || []).map((opt: any) => ({
              name: opt.name_snapshot,
              price_delta_minor: opt.price_delta_minor_snapshot,
            })),
          };
        }),
      },
    });
  } catch (err: any) {
    console.error('[orders GET] Error:', err);
    return NextResponse.json(
      { error: { code: 'internal', message: err.message } },
      { status: 500 }
    );
  }
}
