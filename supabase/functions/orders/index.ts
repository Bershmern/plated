import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { getSupabaseServiceClient } from '../_shared/supabase.ts';
import { resolveDeviceIdentity } from '../_shared/device.ts';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const supabase = getSupabaseServiceClient();
    const deviceRes = await resolveDeviceIdentity(req);
    const responseHeaders = {
      ...corsHeaders,
      'Set-Cookie': deviceRes.cookieHeader,
    };

    // GET /orders/:id (Polling order status)
    if (req.method === 'GET') {
      const pathSegments = url.pathname.split('/').filter(Boolean);
      const orderId = pathSegments.pop();

      if (!orderId || orderId === 'orders') {
        return new Response(
          JSON.stringify({ error: { code: 'bad_request', message: 'Missing order ID' } }),
          { headers: responseHeaders, status: 400 }
        );
      }

      // Fetch order
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .select(`
          *,
          profile:diner_profiles!inner(device_id),
          items:order_items(
            id, menu_item_id, qty, name_snapshot, price_minor_snapshot, notes,
            options:order_item_options(name_snapshot, price_delta_minor_snapshot)
          )
        `)
        .eq('id', orderId)
        .single();

      // Check ownership
      if (orderErr || !order || order.profile.device_id !== deviceRes.deviceId) {
        return new Response(
          JSON.stringify({ error: { code: 'order_not_found', message: 'Order not found' } }),
          { headers: responseHeaders, status: 404 }
        );
      }

      // Fetch running session (tab)
      const { data: session } = await supabase
        .from('table_sessions')
        .select('*')
        .eq('id', order.session_id)
        .maybeSingle();

      const formattedOrder = {
        id: order.id,
        status: order.status,
        placed_at: order.placed_at,
        subtotal_minor: order.subtotal_minor,
        total_minor: order.total_minor,
        currency: order.currency || 'NGN',
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
      };

      return new Response(
        JSON.stringify({
          device: { token: deviceRes.token, is_new: deviceRes.isNew },
          order: formattedOrder,
          session: session
            ? {
                id: session.id,
                opened_at: session.opened_at,
                table_label: session.table_label,
                status: session.status,
              }
            : null,
        }),
        { headers: responseHeaders, status: 200 }
      );
    }

    // POST /orders (Submitting new order)
    if (req.method === 'POST') {
      const idempotencyKey = req.headers.get('Idempotency-Key');
      if (!idempotencyKey) {
        return new Response(
          JSON.stringify({ error: { code: 'bad_request', message: 'Missing Idempotency-Key header' } }),
          { headers: responseHeaders, status: 400 }
        );
      }

      const body = await req.json().catch(() => null);
      if (!body || !body.outlet_id || !body.table_label || !body.items || !Array.isArray(body.items)) {
        return new Response(
          JSON.stringify({ error: { code: 'bad_request', message: 'Invalid order payload' } }),
          { headers: responseHeaders, status: 400 }
        );
      }

      // 1. Check Offline Queue Stale TTL (API_CONTRACTS.md §5.1 - 20 minutes)
      if (body.client_created_at) {
        const clientTime = new Date(body.client_created_at).getTime();
        const now = Date.now();
        if (now - clientTime > 20 * 60 * 1000) {
          return new Response(
            JSON.stringify({ error: { code: 'order_stale', message: 'Queued order is older than 20 minutes' } }),
            { headers: responseHeaders, status: 409 }
          );
        }
      }

      // 2. Execute RPC Place Order Transaction
      const { data: rpcRes, error: rpcErr } = await supabase.rpc('place_order_transaction', {
        p_device_id: deviceRes.deviceId,
        p_outlet_id: body.outlet_id,
        p_table_label: body.table_label,
        p_client_created_at: body.client_created_at || new Date().toISOString(),
        p_idempotency_key: idempotencyKey,
        p_items: body.items,
        p_fulfillment_type: body.fulfillment_type || 'dine_in',
        p_customer_name: body.customer_name || null,
        p_customer_phone: body.customer_phone || null,
        p_delivery_address: body.delivery_address || null,
      });

      if (rpcErr) {
        if (rpcErr.message.includes('item_unavailable')) {
          return new Response(
            JSON.stringify({
              error: { code: 'item_unavailable', message: 'One or more items in cart are unavailable' },
            }),
            { headers: responseHeaders, status: 422 }
          );
        }
        if (rpcErr.message.includes('outlet_not_found')) {
          return new Response(
            JSON.stringify({ error: { code: 'outlet_not_found', message: 'Outlet not found or closed' } }),
            { headers: responseHeaders, status: 404 }
          );
        }

        return new Response(
          JSON.stringify({ error: { code: 'internal', message: rpcErr.message } }),
          { headers: responseHeaders, status: 500 }
        );
      }

      // Fetch created order details for response payload
      const orderId = rpcRes.order_id;
      const { data: createdOrder } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            id, menu_item_id, qty, name_snapshot, price_minor_snapshot, notes,
            options:order_item_options(name_snapshot, price_delta_minor_snapshot)
          )
        `)
        .eq('id', orderId)
        .single();

      const formattedOrder = {
        id: createdOrder.id,
        status: createdOrder.status,
        placed_at: createdOrder.placed_at,
        subtotal_minor: createdOrder.subtotal_minor,
        total_minor: createdOrder.total_minor,
        currency: createdOrder.currency || 'NGN',
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

      return new Response(
        JSON.stringify({
          device: { token: deviceRes.token, is_new: deviceRes.isNew },
          order: formattedOrder,
          session: { id: rpcRes.session_id },
          recognition: { order_count: rpcRes.order_count },
        }),
        { headers: responseHeaders, status: statusCode }
      );
    }

    return new Response(
      JSON.stringify({ error: { code: 'bad_request', message: 'Method not allowed' } }),
      { headers: responseHeaders, status: 405 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: { code: 'internal', message: (error as Error).message } }),
      { headers: corsHeaders, status: 500 }
    );
  }
});
